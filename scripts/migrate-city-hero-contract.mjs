import fs from 'node:fs';
import path from 'node:path';
import { tsModule } from './lib/city-pipeline.mjs';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, content) => fs.writeFileSync(path.join(root, file), content);
const replaceOnce = (file, before, after) => {
  const current = read(file);
  if (!current.includes(before)) throw new Error(`Expected migration marker not found in ${file}`);
  write(file, current.replace(before, after));
};

const laosCities = ['don-det', 'luang-prabang', 'pakse', 'tad-lo', 'thakhek', 'vang-vieng', 'vientiane'];
const countryRoot = path.join(root, 'public', 'assets', 'cities', 'laos');
fs.mkdirSync(countryRoot, { recursive: true });
for (const city of laosCities) {
  const oldDir = path.join(root, 'public', 'assets', 'cities', city);
  const newDir = path.join(countryRoot, city);
  if (fs.existsSync(oldDir)) {
    if (fs.existsSync(newDir)) throw new Error(`Refusing to overwrite ${newDir}`);
    fs.renameSync(oldDir, newDir);
  }
  for (const [kind, suffix] of [['stamps', 'stamp'], ['drawings', 'drawing']]) {
    const asset = path.join(newDir, 'hero', kind, `${city}-hero-${suffix}.webp`);
    if (!fs.existsSync(asset)) throw new Error(`Missing migrated Hero asset: ${asset}`);
  }
}

write('src/engines/hero/hero-assets.ts', `import type { City } from '../../core/models/types';

/**
 * City Hero artwork follows the public asset convention. Country + city slug
 * form the canonical asset identity so destinations can safely share slugs.
 */
export const getCityHeroAssets = (city: City) => {
  const { country, slug } = city;
  const base = \`/assets/cities/\${country}/\${slug}/hero\`;

  return {
    stamp: \`\${base}/stamps/\${slug}-hero-stamp.webp\`,
    drawing: \`\${base}/drawings/\${slug}-hero-drawing.webp\`,
  };
};
`);

replaceOnce(
  'src/core/models/types.ts',
  "export interface MediaManifest { hero: { stamps: MediaRecord[]; drawings: MediaRecord[]; photos: MediaRecord[] }; card?: { image?: MediaRecord }; fieldCard?: { gallery: MediaRecord[] }; }\n",
  "export interface MediaManifest { hero: { stamps: MediaRecord[]; drawings: MediaRecord[]; photos: MediaRecord[] }; card?: { image?: MediaRecord }; fieldCard?: { gallery: MediaRecord[] }; }\nexport interface CityHeroMedia { photos: MediaRecord[]; }\n",
);
replaceOnce(
  'src/core/models/types.ts',
  "export interface CityHero { eyebrow: string; title: string; subtitle: string; facts: HeroFact[]; media: MediaManifest['hero']; }",
  'export interface CityHero { eyebrow: string; title: string; subtitle: string; facts: HeroFact[]; media: CityHeroMedia; }',
);

replaceOnce(
  'scripts/lib/city-pipeline.mjs',
  "hero: { eyebrow: country, title: name, subtitle: '', facts: [], media: { stamps: [], drawings: [], photos: [] } },",
  "hero: { eyebrow: country, title: name, subtitle: '', facts: [], media: { photos: [] } },",
);

replaceOnce(
  'scripts/generate-city.mjs',
  'mergeGenerated(draft.cityData, input.city ?? {});',
  `const cityInput = structuredClone(input.city ?? {});
if (cityInput?.hero?.media) {
  delete cityInput.hero.media.stamps;
  delete cityInput.hero.media.drawings;
}
mergeGenerated(draft.cityData, cityInput);
draft.cityData.hero.media ??= { photos: [] };
delete draft.cityData.hero.media.stamps;
delete draft.cityData.hero.media.drawings;`,
);

write('scripts/validate-generated-data.mjs', `import fs from 'node:fs'; import path from 'node:path';
const dir=path.join(process.cwd(),'pipeline','cities'); const drafts=fs.existsSync(dir)?fs.readdirSync(dir,{recursive:true}).filter(x=>String(x).endsWith('.json')).map(x=>JSON.parse(fs.readFileSync(path.join(dir,x),'utf8'))):[];
const fail=[]; const unique=(items,key,label)=>{const seen=new Set(); for(const item of items){const value=key(item); if(seen.has(value)) fail.push(\`Duplicate \${label}: \${value}\`); seen.add(value);}};
unique(drafts,x=>x.cityData.id,'city ID'); unique(drafts,x=>\`\${x.country}/\${x.city}\`,'city route'); unique(drafts.flatMap(x=>x.places),x=>x.id,'Place ID'); unique(drafts.flatMap(x=>x.things),x=>x.id,'ThingToDo ID'); unique(drafts.flatMap(x=>x.places),x=>\`\${x.country}/\${x.city}/\${x.slug}\`,'Place route slug'); unique(drafts.flatMap(x=>x.things),x=>\`\${x.country}/\${x.city}/\${x.slug}\`,'ThingToDo route slug');
for (const draft of drafts) {
  if ('media' in draft.cityData) fail.push(\`Duplicate City media manifest: \${draft.country}/\${draft.city}\`);
  const heroMedia = draft.cityData.hero?.media ?? {};
  if ('stamps' in heroMedia || 'drawings' in heroMedia) fail.push(\`City Hero stamp/drawing media must come from the asset resolver: \${draft.country}/\${draft.city}\`);
}
if(fail.length) throw new Error(fail.join('\\n')); console.log('Generated Atlas data validation passed.');
`);

write('scripts/city-media-tests.mjs', `import assert from 'node:assert/strict';
import fs from 'node:fs';
import { emptyDraft } from './lib/city-pipeline.mjs';

const fresh = emptyDraft('testland', 'test-city', 'compact');
assert.equal('media' in fresh.cityData, false, 'new City drafts must use hero.media only');
assert.deepEqual(Object.keys(fresh.cityData.hero.media), ['photos'], 'new City Hero data must only own photos');
const draft = JSON.parse(fs.readFileSync('pipeline/cities/laos/don-det.json', 'utf8'));
assert.equal('media' in draft.cityData, false, 'Don Det must not keep a duplicate City media manifest');
assert.ok(draft.cityData.hero.media.photos.length > 0, 'Don Det Hero photo media remains canonical');
assert.equal('stamps' in draft.cityData.hero.media, false, 'Don Det stamp comes from the global asset resolver');
assert.equal('drawings' in draft.cityData.hero.media, false, 'Don Det drawing comes from the global asset resolver');
assert.ok(draft.cityData.manualLocks['hero.media.photos'], 'Don Det keeps the canonical Hero media lock');
assert.equal(draft.cityData.manualLocks['media.hero.photos'], undefined, 'obsolete duplicate Hero lock is removed');
console.log('City media duplication tests passed.');
`);

const draftsRoot = path.join(root, 'pipeline', 'cities');
const draftFiles = fs.readdirSync(draftsRoot, { recursive: true }).map(String).filter((file) => file.endsWith('.json'));
for (const relative of draftFiles) {
  const draftPath = path.join(draftsRoot, relative);
  const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
  const media = draft.cityData?.hero?.media ?? (draft.cityData.hero.media = { photos: [] });
  delete media.stamps;
  delete media.drawings;
  fs.writeFileSync(draftPath, `${JSON.stringify(draft, null, 2)}\n`);

  const output = path.join(root, 'src', 'content', 'generated', draft.country, `${draft.city}.ts`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, tsModule(draft));
}

let docs = read('docs/ASSETS.md');
docs = docs.replaceAll('public/assets/cities/<city-slug>/', 'public/assets/cities/<country-slug>/<city-slug>/');
docs = docs.replaceAll('public/assets/cities/<city-slug>/hero/', 'public/assets/cities/<country-slug>/<city-slug>/hero/');
if (!docs.includes('Country scope prevents slug collisions')) {
  docs = docs.replace('Drawings and stamps are city-specific.', 'Country scope prevents slug collisions between destinations in different countries.\n\nDrawings and stamps are city-specific.');
}
write('docs/ASSETS.md', docs);

for (const file of ['public/media/don-det/stamp.svg', 'public/media/don-det/drawing.svg']) {
  const absolute = path.join(root, file);
  if (fs.existsSync(absolute)) fs.rmSync(absolute);
}

console.log('City Hero contract migration completed.');
