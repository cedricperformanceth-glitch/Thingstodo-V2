import fs from 'node:fs';
import path from 'node:path';
import { evaluateCityPublication } from './lib/city-publish-qa.mjs';

const [country, city, ...flags] = process.argv.slice(2);
if (!country || !city) throw new Error('Usage: pnpm qa-city <country> <city> [--json]');

const root = process.cwd();
const draftFile = path.join(root, 'pipeline', 'cities', country, `${city}.json`);
if (!fs.existsSync(draftFile)) throw new Error(`No city draft found at ${path.relative(root, draftFile)}.`);

const draft = JSON.parse(fs.readFileSync(draftFile, 'utf8'));
const report = evaluateCityPublication(draft);

if (flags.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Publication QA: ${report.city}`);
  console.log(`Status: ${report.status}`);
  console.log(`Places: ${report.summary.places} · Things to do: ${report.summary.thingsToDo}`);
  console.log(`Errors: ${report.summary.errors} · Warnings: ${report.summary.warnings}`);
  for (const entry of report.errors) console.error(`ERROR [${entry.code}]${entry.entity ? ` ${entry.entity}` : ''}: ${entry.message}`);
  for (const entry of report.warnings) console.warn(`WARN  [${entry.code}]${entry.entity ? ` ${entry.entity}` : ''}: ${entry.message}`);
}

if (report.status === 'blocked') process.exitCode = 1;
