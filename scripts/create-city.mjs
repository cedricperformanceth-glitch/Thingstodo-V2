import fs from 'node:fs';
import path from 'node:path';
import { emptyDraft, setCategoryTarget, slugify, tsModule } from './lib/city-pipeline.mjs';

const [countryInput, cityInput, ...flags] = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = flags.indexOf(flag);
  return index >= 0 ? flags[index + 1] : undefined;
};
const profile = valueAfter('--profile') ?? 'compact';
const settlementType = valueAfter('--settlement');
const dryRun = flags.includes('--dry-run');
const requestedTargets = {};
for (let index = 0; index < flags.length; index += 1) {
  if (flags[index] !== '--target') continue;
  const pair = flags[index + 1];
  if (!pair || !pair.includes('=')) throw new Error(`Invalid --target '${pair ?? ''}'. Use --target category=count.`);
  const [category, rawValue] = pair.split('=', 2);
  const value = Number(rawValue);
  if (!category || !Number.isInteger(value) || value < 0) throw new Error(`Invalid --target '${pair}'. Counts must be non-negative integers.`);
  requestedTargets[category] = value;
  index += 1;
}

if (!countryInput || !cityInput || !['compact', 'standard', 'large'].includes(profile) || !['village', 'city'].includes(settlementType ?? '')) {
  throw new Error('Usage: npm run create-city -- <country> <city> --settlement village|city [--profile compact|standard|large] [--target category=count ...] [--dry-run]');
}

const country = slugify(countryInput);
const city = slugify(cityInput);
const root = process.cwd();
const countryFile = path.join(root, 'src', 'content', 'countries', `${country}.ts`);
const draftFile = path.join(root, 'pipeline', 'cities', country, `${city}.json`);
const moduleFile = path.join(root, 'src', 'content', 'generated', country, `${city}.ts`);

if (!fs.existsSync(countryFile)) throw new Error(`Unknown country '${country}'. Add a country configuration first.`);
if (fs.existsSync(draftFile) || fs.existsSync(moduleFile)) {
  if (dryRun) {
    console.log(`[dry-run] ${country}/${city} already has a structural draft; no clone would be created.`);
    process.exit(0);
  }
  throw new Error(`City '${country}/${city}' already exists; use generate-city to refresh gaps.`);
}

const draft = emptyDraft(country, city, profile, settlementType);
for (const [category, value] of Object.entries(requestedTargets)) setCategoryTarget(draft, category, value);
draft.cityData.seo.indexable = false;

const targetSummary = Object.entries(requestedTargets).map(([category, value]) => `${category}=${value}`).join(', ');
console.log(`${dryRun ? '[dry-run] Would create' : 'Creating'} ${country}/${city} (${profile}, ${settlementType})${targetSummary ? ` with admin counts: ${targetSummary}` : ''}.`);

if (!dryRun) {
  fs.mkdirSync(path.dirname(draftFile), { recursive: true });
  fs.mkdirSync(path.dirname(moduleFile), { recursive: true });
  fs.writeFileSync(draftFile, `${JSON.stringify(draft, null, 2)}\n`);
  fs.writeFileSync(moduleFile, tsModule(draft));
  await import('./regenerate-content-registry.mjs');
}
