import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chooseFieldCardTemplate, mergeGenerated, syncGenerationContract, tsModule, validateSource, slugify } from './lib/city-pipeline.mjs';
import { assertValidSpaCardCandidate } from './lib/spa-card-generation.mjs';
import { materializeSpaCardEditorial } from './lib/spa-card-editorial.mjs';
import { applySpaCardPhotoSelection, validateAutomaticPhotoCandidate } from './lib/spa-card-media.mjs';
import { discoverPhotoCandidates } from './lib/photo-discovery.mjs';
import { rankPlaceCandidates } from './lib/candidate-ranking.mjs';
import { evaluateCandidateAcceptance } from './lib/verification-engine.mjs';
import { evaluateCityPublication } from './lib/city-publish-qa.mjs';
import { assertValidFieldCardHero } from './lib/field-card-hero.mjs';
import { assertValidFieldCardQuickRead } from './lib/field-card-quick-read.mjs';
import { assertValidFieldCardPrimaryStory } from './lib/field-card-primary-story.mjs';
import { assertValidFieldCardSecondaryStory } from './lib/field-card-secondary-story.mjs';
import { assertValidFieldCardPractical } from './lib/field-card-practical.mjs';

const [country, city, ...flags] = process.argv.slice(2);
const dryRun = flags.includes('--dry-run');
const fromCity = flags.includes('--from-city');
const publishCheck = flags.includes('--publish-check');
const skipPhotoDiscovery = flags.includes('--skip-photo-discovery') || process.env.ATLAS_OFFLINE === '1';
if (!country || !city) throw new Error('Usage: npm run generate-city -- <country> <city> [--dry-run] [--from-city] [--publish-check] [--skip-photo-discovery]');

const root = process.cwd();
const draftFile = path.join(root, 'pipeline', 'cities', country, `${city}.json`);
const sourceFile = path.join(root, 'pipeline', 'sources', country, `${city}.json`);
const placeSourceShardFile = path.join(root, 'pipeline', 'sources', country, `${city}.places.mjs`);
if (!fs.existsSync(draftFile)) throw new Error(`No structural draft for ${country}/${city}. Run create-city first.`);
if (!fromCity && !fs.existsSync(sourceFile)) throw new Error(`No versioned research inputs at ${path.relative(root, sourceFile)}.`);

const draft = JSON.parse(fs.readFileSync(draftFile, 'utf8'));
syncGenerationContract(draft);
const input = fromCity
  ? { places: draft.places, things: draft.things, city: draft.cityData }
  : JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

if (!fromCity && fs.existsSync(placeSourceShardFile)) {
  const shardUrl = `${pathToFileURL(placeSourceShardFile).href}?mtime=${fs.statSync(placeSourceShardFile).mtimeMs}`;
  const shard = await import(shardUrl);
  if (!Array.isArray(shard.places)) throw new Error(`Place source shard must export a places array: ${path.relative(root, placeSourceShardFile)}`);
  input.places = [...(input.places ?? []), ...shard.places];
  console.log(`Loaded ${shard.places.length} place candidates from ${path.relative(root, placeSourceShardFile)}.`);
}

for (const candidate of [...(input.places ?? []), ...(input.things ?? [])]) {
  for (const source of candidate.sources ?? candidate.researchSources ?? []) validateSource(source);
}

const editorialPlaces = (input.places ?? []).map((candidate) => prepareCandidate(candidate, 'place', country));
const editorialThings = (input.things ?? []).map((candidate) => prepareCandidate(candidate, 'thing-to-do', country));
const selectedEditorialPlaces = rankPlaceCandidates(editorialPlaces, { cityCoordinates: draft.cityData?.coordinates });
const mediaContext = { cityName: draft.cityData.name, country: draft.country };
const places = [];
for (const candidate of selectedEditorialPlaces) places.push(normalizePlace(await prepareMediaWithDiscovery(candidate, mediaContext, 'place'), draft));
const things = [];
for (const candidate of editorialThings) things.push(normalizeThing(await prepareMediaWithDiscovery(candidate, mediaContext, 'thing-to-do'), draft));
for (const candidate of places) if (candidate.spaCard) assertValidSpaCardCandidate(candidate, 'place');
for (const candidate of things) if (candidate.spaCard) assertValidSpaCardCandidate(candidate, 'thing-to-do');
console.log(`Selected Place cards: ${summarizePlaceSelection(places)}`);
console.log(`Explore Board: ${(draft.cityData.exploreBoard?.featuredThingIds ?? []).join(', ') || 'awaiting manual landmark selection'}`);

const assembled = assembleDraft(draft, input.city ?? {}, places, things);
let publicationReport = null;
if (publishCheck) {
  publicationReport = evaluateCityPublication(assembled);
  printPublicationReport(publicationReport);
  if (publicationReport.status === 'blocked') {
    throw new Error(`Publication QA blocked ${country}/${city}. Fix the reported errors before publication.`);
  }
}

if (dryRun) {
  console.log(publishCheck
    ? '[dry-run] Source and publication contracts are valid; no Atlas content changed.'
    : '[dry-run] Source contract is valid; no Atlas content changed.');
  process.exit(0);
}

fs.writeFileSync(draftFile, `${JSON.stringify(assembled, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'src', 'content', 'generated', country, `${city}.ts`), tsModule(assembled));
await import('./regenerate-content-registry.mjs');
console.log(`Generated static versioned content for ${country}/${city}${publishCheck ? ' with publication QA passed' : ''}.`);

function summarizePlaceSelection(places) {
  const counts = {};
  for (const place of places) counts[place.category] = (counts[place.category] ?? 0) + 1;
  return Object.entries(counts).map(([category, count]) => `${category}=${count}`).join(' · ');
}

function prepareCandidate(candidate, kind, candidateCountry) {
  const verified = prepareVerification(candidate, kind, candidateCountry);
  return prepareEditorial(verified, kind);
}

function prepareVerification(candidate, kind, candidateCountry) {
  if (candidate?.verification?.decision) return candidate;
  if (!Array.isArray(candidate?.verificationSignals)) return candidate;

  const verificationKind = candidate.verificationKind
    ?? (kind === 'thing-to-do' && candidate.isLandmark === true ? 'static-landmark' : 'business');
  const decision = evaluateCandidateAcceptance({ kind: verificationKind, signals: candidate.verificationSignals }, candidateCountry);
  if (decision.decision !== 'accept') {
    throw new Error(`Source verification for ${candidate?.name ?? 'unnamed candidate'} returned ${decision.decision}: ${decision.reason}`);
  }
  const next = structuredClone(candidate);
  next.verification = { ...decision };
  delete next.verificationSignals;
  delete next.verificationKind;
  return next;
}

function prepareEditorial(candidate, kind) {
  if (!candidate?.editorialDraft) return candidate;
  const result = materializeSpaCardEditorial(candidate, candidate.editorialDraft, kind, candidate.editorialFacts ?? []);
  if (result.status !== 'ready') {
    throw new Error(`SPA editorial draft for ${candidate?.name ?? 'unnamed candidate'} requires manual review: ${result.errors.join('; ')}`);
  }
  return result.candidate;
}

function hasQualifiedPhoto(candidate) {
  const current = candidate?.image ?? candidate?.media?.card?.image;
  if (current?.manual === true && current?.src) return true;
  const candidates = [...(candidate?.photoCandidates ?? []), ...(current?.src ? [current] : [])];
  return candidates.some((photo) => validateAutomaticPhotoCandidate(photo).valid);
}

async function prepareMediaWithDiscovery(candidate, context, kind) {
  let next = candidate;
  const activityMode = kind === 'thing-to-do';
  const shouldDiscover = !skipPhotoDiscovery && next?.spaCard && (activityMode || !hasQualifiedPhoto(next));
  if (shouldDiscover) {
    const discovered = await discoverPhotoCandidates(next, context, { mode: activityMode ? 'activity' : 'place' });
    if (discovered.length) {
      next = structuredClone(next);
      next.photoCandidates = [...(next.photoCandidates ?? []), ...discovered];
      console.log(`Wikimedia Commons: ${next.name} -> ${discovered.length} qualified candidate(s)${activityMode ? ' (activity reserve enabled)' : ''}.`);
    }
  }
  return prepareMedia(next, kind);
}

function prepareMedia(candidate, kind) {
  if (!candidate?.spaCard && !(candidate?.photoCandidates?.length)) return candidate;
  return applySpaCardPhotoSelection(candidate, { entityKind: kind }).candidate;
}

function generatedSources(candidate) {
  return (candidate.sources ?? candidate.researchSources ?? []).map(({ sourceName, sourceUrl, purpose, sourceType }) => ({ sourceName, sourceUrl, purpose, sourceType }));
}

function description(candidate) {
  return candidate.shortDescription ?? '';
}

function entityMedia(candidate) {
  const media = structuredClone(candidate.media ?? { fieldCard: { gallery: [] } });
  delete media.hero;
  if (media.research?.firstPartyPhotoLeads) delete media.research.firstPartyPhotoLeads;
  if (media.research && Object.keys(media.research).length === 0) delete media.research;
  media.fieldCard ??= { gallery: [] };
  return media;
}

function isManualEntity(entity) {
  return String(entity?.sourceMetadata?.sourceName ?? '').trim().toLowerCase() === 'manual';
}

function base(candidate, baseDraft, category) {
  const name = candidate.name;
  const coordinates = candidate.coordinates ?? baseDraft.cityData.coordinates;
  return {
    id: candidate.id ?? `${category}-${slugify(name)}`,
    slug: candidate.slug ?? slugify(name),
    name,
    country: baseDraft.country,
    city: baseDraft.city,
    category,
    coordinates,
    shortDescription: description(candidate),
    media: entityMedia(candidate),
    spaCard: candidate.spaCard ? structuredClone(candidate.spaCard) : undefined,
    verification: candidate.verification ? structuredClone(candidate.verification) : undefined,
    sourceMetadata: candidate.sourceMetadata ?? { sourceName: 'Atlas research pipeline' },
    researchSources: generatedSources(candidate),
    manualLocks: candidate.manualLocks ?? {},
  };
}

function normalizePlace(candidate, baseDraft) {
  const entity = base(candidate, baseDraft, candidate.category ?? 'practical-services');
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(candidate.name)}`;
  return { ...entity, address: candidate.address ?? '', googleMapsUrl: candidate.googleMapsUrl ?? map, image: candidate.image };
}

function normalizeThing(candidate, baseDraft) {
  const entity = base(candidate, baseDraft, 'things-to-do');
  const template = chooseFieldCardTemplate(candidate);
  const hero = candidate.fieldCardHero
    ? structuredClone(assertValidFieldCardHero(candidate.fieldCardHero, candidate.name))
    : undefined;
  const quickRead = candidate.fieldCardQuickRead
    ? structuredClone(assertValidFieldCardQuickRead(candidate.fieldCardQuickRead, candidate.name))
    : undefined;
  const primaryStory = candidate.fieldCardPrimaryStory
    ? structuredClone(assertValidFieldCardPrimaryStory(candidate.fieldCardPrimaryStory, candidate.name))
    : undefined;
  const secondaryStory = candidate.fieldCardSecondaryStory
    ? structuredClone(assertValidFieldCardSecondaryStory(candidate.fieldCardSecondaryStory, candidate.name))
    : undefined;
  const practicalNotes = candidate.fieldCardPractical
    ? structuredClone(assertValidFieldCardPractical(candidate.fieldCardPractical, candidate.name))
    : undefined;
  if (secondaryStory && !primaryStory) {
    throw new Error(`${candidate.name} fieldCardSecondaryStory requires fieldCardPrimaryStory so chapter ownership remains unambiguous.`);
  }
  return {
    ...entity,
    googleMapsUrl: candidate.googleMapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(candidate.name)}`,
    isLandmark: candidate.isLandmark === true,
    longDescription: candidate.longDescription ?? description(candidate),
    breadcrumbs: [baseDraft.country, baseDraft.city, 'things-to-do'],
    exploreBoard: candidate.exploreBoard,
    fieldCard: {
      template,
      hero,
      quickRead,
      primaryStory,
      secondaryStory,
      practicalNotes,
      whyGo: candidate.whyGo ?? '',
      practical: candidate.practical ?? '',
      access: candidate.access ?? '',
      notes: candidate.notes,
      faq: candidate.faq ?? [],
      sections: (candidate.sections ?? []).map((section) => typeof section === 'string' ? { title: section, body: '' } : section),
    },
  };
}

function assembleDraft(baseDraft, inputCity, nextPlaces, nextThings) {
  const next = structuredClone(baseDraft);
  const cityInput = structuredClone(inputCity ?? {});
  if (cityInput?.hero?.media) delete cityInput.hero.media;
  delete cityInput.categories;
  delete cityInput.settlementType;
  mergeGenerated(next.cityData, cityInput);
  syncGenerationContract(next);
  if (next.cityData.hero?.media) delete next.cityData.hero.media;

  const previousThings = next.things;
  next.things = nextThings.map((candidate) => {
    const existing = previousThings.find((thing) => thing.id === candidate.id);
    return existing ? mergeGenerated(existing, candidate) : candidate;
  });

  const previousPlaces = next.places;
  const generatedPlaces = nextPlaces.map((candidate) => {
    const existing = previousPlaces.find((place) => place.id === candidate.id);
    return existing ? mergeGenerated(existing, candidate) : candidate;
  });
  const retainedManualPlaces = previousPlaces.filter((place) => isManualEntity(place) && !generatedPlaces.some((candidate) => candidate.id === place.id));
  next.places = [...generatedPlaces, ...retainedManualPlaces];

  for (const entity of [...next.places, ...next.things]) {
    if (entity.media) delete entity.media.hero;
    if (entity.media?.research?.firstPartyPhotoLeads) delete entity.media.research.firstPartyPhotoLeads;
    if (entity.media?.research && Object.keys(entity.media.research).length === 0) delete entity.media.research;
    delete entity.firstPartySources;
    delete entity.isMySelection;
    delete entity.selectionRank;
  }
  return next;
}

function printPublicationReport(report) {
  console.log(`Publication QA: ${report.status} · ${report.summary.errors} error(s) · ${report.summary.warnings} warning(s).`);
  for (const entry of report.errors) console.error(`ERROR [${entry.code}]${entry.entity ? ` ${entry.entity}` : ''}: ${entry.message}`);
  for (const entry of report.warnings) console.warn(`WARN  [${entry.code}]${entry.entity ? ` ${entry.entity}` : ''}: ${entry.message}`);
}
