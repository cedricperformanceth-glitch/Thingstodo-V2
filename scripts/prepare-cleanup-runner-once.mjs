import fs from 'node:fs';

const file = 'scripts/repo-cleanup-once.mjs';
const source = fs.readFileSync(file, 'utf8');
const start = source.indexOf('// 8) Sanity checks:');
const end = source.indexOf('// This migration is intentionally disposable:');
if (start < 0 || end < 0 || end <= start) throw new Error('Unable to isolate one-time post-migration assertions');
fs.writeFileSync(file, `${source.slice(0, start)}${source.slice(end)}`);
fs.rmSync('scripts/prepare-cleanup-runner-once.mjs');
