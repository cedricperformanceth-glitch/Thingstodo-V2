import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const expect = (condition, message) => {
  if (!condition) throw new Error(`City Field Note contract failed: ${message}`);
};

const enginePath = 'src/engines/city-field-note/city-field-note-engine.ts';
const resolverPath = 'src/engines/city-field-note/city-field-note-editorial.ts';
const componentPath = 'src/components/city-field-note/CityFieldNote.astro';
const routePath = 'src/pages/[country]/[city]/field-note.astro';
const copyPath = 'src/content/city-field-note-copy.json';
const mediaPath = 'src/content/city-field-note-media-copy.json';
const sourcePath = 'src/content/city-field-note-source-copy.json';
const seoPath = 'src/content/city-field-note-seo-copy.json';

for (const file of [enginePath,resolverPath,componentPath,routePath,copyPath,mediaPath,sourcePath,seoPath]) {
  expect(fs.existsSync(path.join(root, file)), `${file} is missing`);
}

const engine = read(enginePath);
const component = read(componentPath);
const route = read(routePath);
const genericFiles = `${engine}\n${component}\n${route}`;
expect(engine.includes('export const cityFieldNoteView'), 'generic cityFieldNoteView resolver is missing');
expect(engine.includes('generatedChapters(city, country)'), 'generated fallback chapter layer is missing');
expect(engine.includes('getEditorialCityFieldNote(city.id)'), 'editorial city override is not wired into the engine');
expect(engine.includes('editorialAdSlots.slice(0, 3)'), 'city note should expose exactly three editorial ad slots');

for (const marker of ['city-note__hero','city-note__quick','city-note__chapters','city-note__chapter-side','city-note__photo-spread','city-note__warning','city-note__sources','city-note__closing']) {
  expect(component.includes(marker), `presentation block ${marker} is missing`);
}
expect(component.includes('view.media'), 'component does not render editorial media');
expect(component.includes('view.sources'), 'component does not render editorial sources');
expect(route.includes('getCities().map'), 'route is not generated for the city registry');
expect(route.includes('<CityFieldNote {city} {country} />'), 'route does not render the generic city note component');
expect(!/<main(?:\s|>)/i.test(route), 'route must not nest another <main> inside BaseLayout');
expect(route.includes(':global(body:has(.city-note) #main-content)'), 'route does not release the global main width');
expect(route.includes('getEditorialCityFieldNoteSeo'), 'route does not resolve editorial SEO');

const destinationTokens = /\b(don-det|don det|pakse|tad-lo|tad lo|thakhek|vang-vieng|vang vieng|vientiane|luang-prabang|luang prabang)\b/i;
expect(!destinationTokens.test(genericFiles), 'destination-specific content leaked into generic city note implementation');

const copy = json(copyPath);
const media = json(mediaPath);
const sources = json(sourcePath);
const seo = json(seoPath);
const completedEditorialCities = ['city-don-det', 'city-laos-thakhek'];

for (const id of completedEditorialCities) {
  const cityCopy = copy[id];
  const cityMedia = media[id];
  const citySources = sources[id];
  const citySeo = seo[id];

  expect(cityCopy && cityCopy.chapters?.length === 7, `${id} editorial copy must contain exactly seven chapters`);
  expect(cityCopy.quickRead?.length === 4, `${id} editorial quick read must contain four items`);
  expect(cityCopy.chapters.every((chapter) => chapter.title && chapter.paragraphs?.length >= 2), `${id} chapters need a title and at least two editorial paragraphs`);
  expect(cityMedia?.length === 4, `${id} city note must contain hero, two spread photos and one chapter-seven photo`);
  expect(cityMedia.every((item) => item.src && item.alt && item.sourceUrl && item.sourceName && item.license && item.locked === true), `${id} editorial images need provenance, alt, licence and lock`);
  expect(citySources?.length >= 5, `${id} editorial note needs a substantive source list`);
  expect(citySources.every((source) => source.sourceUrl && !source.sourceUrl.toLowerCase().includes('thingstodoatlas')), `${id} sources must be original external sources, never Atlas V1`);
  expect(citySeo?.indexable === true && citySeo.title && citySeo.description, `${id} completed city note must have publishable SEO`);
}

console.log(`City Field Note contract passed: generic fallback plus ${completedEditorialCities.length} completed editorial city notes are intact.`);
