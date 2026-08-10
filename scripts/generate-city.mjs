import fs from 'node:fs';
import path from 'node:path';
import { assignUnlocked, chooseFieldCardTemplate, mergeGenerated, selectExploreBoard, tsModule, validateSource, slugify } from './lib/city-pipeline.mjs';

const [country, city, ...flags] = process.argv.slice(2); const dryRun = flags.includes('--dry-run'); const fromCity = flags.includes('--from-city');
if (!country || !city) throw new Error('Usage: pnpm generate-city <country> <city> [--dry-run]');
const root = process.cwd(); const draftFile = path.join(root, 'pipeline', 'cities', country, `${city}.json`); const sourceFile = path.join(root, 'pipeline', 'sources', country, `${city}.json`);
if (!fs.existsSync(draftFile)) throw new Error(`No structural draft for ${country}/${city}. Run create-city first.`);
if (!fromCity && !fs.existsSync(sourceFile)) throw new Error(`No versioned research inputs at ${path.relative(root, sourceFile)}.`);
const draft = JSON.parse(fs.readFileSync(draftFile, 'utf8')); const input = fromCity ? { places: draft.places, things: draft.things, city: draft.cityData } : JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
for (const candidate of [...(input.places ?? []), ...(input.things ?? [])]) for (const source of candidate.sources ?? []) validateSource(source);
const things = (input.things ?? []).map((candidate) => normalizeThing(candidate, draft));
const places = (input.places ?? []).map((candidate) => normalizePlace(candidate, draft));
for (const candidate of things) console.log(`${candidate.name}: ${candidate.fieldCard.template} Field Card`);
console.log(`Explore Board: ${selectExploreBoard(things.length ? things : draft.things, draft.cityData.coordinates).join(', ') || 'awaiting landmark candidates'}`);
if (dryRun) { console.log('[dry-run] Source contract is valid; no Atlas content changed.'); process.exit(0); }
// Generation deliberately fills only gaps. Source adapters can provide independently verified facts;
// they must never supply prose copied from a competing guide platform.
const cityInput = structuredClone(input.city ?? {});
if (cityInput?.hero?.media) delete cityInput.hero.media;
mergeGenerated(draft.cityData, cityInput);
if (draft.cityData.hero?.media) delete draft.cityData.hero.media;
for (const candidate of things) {
  const existing = draft.things.find((thing) => thing.id === candidate.id); const target = existing ? mergeGenerated(existing, candidate) : candidate;
  if (!existing) draft.things.push(target);
}
for (const candidate of places) {
  const existing = draft.places.find((place) => place.id === candidate.id); const target = existing ? mergeGenerated(existing, candidate) : candidate;
  if (!existing) draft.places.push(target);
}
for (const entity of [...draft.places, ...draft.things]) if (entity.media) delete entity.media.hero;
assignUnlocked(draft.cityData, 'exploreBoard.featuredThingIds', selectExploreBoard(draft.things, draft.cityData.coordinates));
draft.generatedAt = new Date().toISOString();
fs.writeFileSync(draftFile, `${JSON.stringify(draft, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'src', 'content', 'generated', country, `${city}.ts`), tsModule(draft));
await import('./regenerate-content-registry.mjs');
console.log(`Generated static versioned content for ${country}/${city}.`);

function generatedSources(candidate) { return (candidate.sources ?? []).map(({ sourceName, sourceUrl, purpose, sourceType }) => ({ sourceName, sourceUrl, purpose, sourceType })); }
function description(candidate) { return candidate.shortDescription || `${candidate.name} is included in this Atlas draft from independently recorded traveller facts.`; }
function entityMedia(candidate) {
  const media = structuredClone(candidate.media ?? { fieldCard: { gallery: [] } });
  delete media.hero;
  media.fieldCard ??= { gallery: [] };
  return media;
}
function base(candidate, draft, category) {
  const name = candidate.name; const coordinates = candidate.coordinates ?? draft.cityData.coordinates;
  return { id: candidate.id ?? `${category}-${slugify(name)}`, slug: candidate.slug ?? slugify(name), name, country: draft.country, city: draft.city,
    category, coordinates, shortDescription: description(candidate), media: entityMedia(candidate),
    isMySelection: candidate.isMySelection ?? false, selectionRank: candidate.selectionRank, sourceMetadata: { sourceName: 'Atlas research pipeline', reviewedAt: new Date().toISOString() },
    researchSources: generatedSources(candidate), manualLocks: candidate.manualLocks ?? {} };
}
function normalizePlace(candidate, draft) {
  const entity = base(candidate, draft, candidate.category ?? 'practical-services'); const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(candidate.name)}`;
  return { ...entity, address: candidate.address ?? '', googleMapsUrl: candidate.googleMapsUrl ?? map, image: candidate.image };
}
function normalizeThing(candidate, draft) {
  const entity = base(candidate, draft, 'things-to-do'); const template = chooseFieldCardTemplate(candidate);
  return { ...entity, googleMapsUrl: candidate.googleMapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(candidate.name)}`,
    isLandmark: candidate.isLandmark === true, longDescription: candidate.longDescription ?? description(candidate), breadcrumbs: [draft.country, draft.city, 'things-to-do'],
    fieldCard: { template, whyGo: candidate.whyGo ?? '', practical: candidate.practical ?? '', access: candidate.access ?? '', notes: candidate.notes,
      faq: candidate.faq ?? [], sections: (candidate.sections ?? []).map((section) => typeof section === 'string' ? { title: section, body: '' } : section) } };
}
