import fs from 'node:fs';
import path from 'node:path';
import { emptyDraft, slugify, tsModule } from './lib/city-pipeline.mjs';

const [countryInput, cityInput, ...flags] = process.argv.slice(2);
const profile = flags.includes('--profile') ? flags[flags.indexOf('--profile') + 1] : 'compact';
const dryRun = flags.includes('--dry-run');
if (!countryInput || !cityInput || !['compact', 'standard', 'large'].includes(profile)) throw new Error('Usage: pnpm create-city <country> <city> [--profile compact|standard|large] [--dry-run]');
const country = slugify(countryInput); const city = slugify(cityInput); const root = process.cwd();
const countryFile = path.join(root, 'src', 'content', 'countries', `${country}.ts`);
const draftFile = path.join(root, 'pipeline', 'cities', country, `${city}.json`);
const moduleFile = path.join(root, 'src', 'content', 'generated', country, `${city}.ts`);
if (!fs.existsSync(countryFile)) throw new Error(`Unknown country '${country}'. Add a country configuration first.`);
if (fs.existsSync(draftFile) || fs.existsSync(moduleFile)) {
  if (dryRun) { console.log(`[dry-run] ${country}/${city} already has a structural draft; no clone would be created.`); process.exit(0); }
  throw new Error(`City '${country}/${city}' already exists; use generate-city to refresh gaps.`);
}
console.log(`${dryRun ? '[dry-run] Would create' : 'Creating'} ${country}/${city} (${profile}) with persisted variable targets.`);
if (!dryRun) {
  fs.mkdirSync(path.dirname(draftFile), { recursive: true }); fs.mkdirSync(path.dirname(moduleFile), { recursive: true });
  const draft = emptyDraft(country, city, profile);
  fs.writeFileSync(draftFile, `${JSON.stringify(draft, null, 2)}\n`); fs.writeFileSync(moduleFile, tsModule(draft));
  const indexFile = path.join(root, 'src', 'content', 'generated', 'index.ts'); let index = fs.readFileSync(indexFile, 'utf8');
  const key = `${country}${city.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')}`;
  index = index.replace("import type { City, Place, ThingToDo } from '../../core/models/types';", `import type { City, Place, ThingToDo } from '../../core/models/types';\nimport { city as ${key}City, places as ${key}Places, things as ${key}Things } from './${country}/${city}';`);
  index = index.replace('export const generatedCities: City[] = [];', `export const generatedCities: City[] = [${key}City];`);
  index = index.replace('export const generatedPlaces: Place[] = [];', `export const generatedPlaces: Place[] = [${key}Places];`);
  index = index.replace('export const generatedThings: ThingToDo[] = [];', `export const generatedThings: ThingToDo[] = [${key}Things];`);
  fs.writeFileSync(indexFile, index);
  const countryText = fs.readFileSync(countryFile, 'utf8');
  fs.writeFileSync(countryFile, countryText.replace(/cities:\[([^\]]*)\]/, (_match, entries) => `cities:[${entries}${entries.trim() ? ',' : ''}'${city}']`));
}
