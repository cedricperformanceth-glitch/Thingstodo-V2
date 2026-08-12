import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { enrichEntitiesWithFirstPartySources } from './lib/first-party-source-enrichment.mjs';
import { discoverFirstPartyPhotoLeads } from './lib/first-party-photo-discovery.mjs';

const [country, city] = process.argv.slice(2);
if (!country || !city) throw new Error('Usage: npm run audit:first-party -- <country> <city>');

const root = process.cwd();
const sourceFile = path.join(root, 'pipeline', 'sources', country, `${city}.json`);
const placeShardFile = path.join(root, 'pipeline', 'sources', country, `${city}.places.mjs`);
const firstPartyShardFile = path.join(root, 'pipeline', 'sources', country, `${city}.first-party.mjs`);
if (!fs.existsSync(sourceFile)) throw new Error(`Missing city source file: ${path.relative(root, sourceFile)}`);
if (!fs.existsSync(firstPartyShardFile)) throw new Error(`Missing first-party source shard: ${path.relative(root, firstPartyShardFile)}`);

const input = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
input.places ??= [];
input.things ??= [];
if (fs.existsSync(placeShardFile)) {
  const placeShard = await import(`${pathToFileURL(placeShardFile).href}?mtime=${fs.statSync(placeShardFile).mtimeMs}`);
  input.places.push(...(placeShard.places ?? []));
}
const firstPartyShard = await import(`${pathToFileURL(firstPartyShardFile).href}?mtime=${fs.statSync(firstPartyShardFile).mtimeMs}`);
const enriched = enrichEntitiesWithFirstPartySources(input.places, input.things, firstPartyShard.firstPartySources);
const byId = new Map([...enriched.places, ...enriched.things].map((entity) => [entity.id, entity]));

let sourcePages = 0;
let fetchedPages = 0;
let imageLeads = 0;
let pageOnlyLeads = 0;
console.log(`First-party photo audit: ${country}/${city}`);
for (const entityId of enriched.enrichedEntityIds) {
  const entity = byId.get(entityId);
  const leads = await discoverFirstPartyPhotoLeads(entity, { cityName: input.city?.name ?? city, country });
  const images = leads.filter((lead) => lead.discoveryStatus === 'image-found').length;
  const pages = leads.filter((lead) => lead.discoveryStatus === 'page-found').length;
  const fetched = leads.filter((lead) => lead.pageFetched).length;
  sourcePages += leads.length;
  fetchedPages += fetched;
  imageLeads += images;
  pageOnlyLeads += pages;
  console.log(`${entity.name}: sources=${leads.length} · fetched=${fetched} · image-leads=${images} · page-only=${pages}`);
}
console.log(`TOTAL entities=${enriched.enrichedEntityIds.length} · source-pages=${sourcePages} · fetched=${fetchedPages} · image-leads=${imageLeads} · page-only=${pageOnlyLeads}`);
console.log('All first-party results are editorial leads only; this audit never publishes media.');
