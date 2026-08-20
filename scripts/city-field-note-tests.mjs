import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const expect = (condition, message) => {
  if (!condition) throw new Error(`City Field Note contract failed: ${message}`);
};

const enginePath = 'src/engines/city-field-note/city-field-note-engine.ts';
const componentPath = 'src/components/city-field-note/CityFieldNote.astro';
const routePath = 'src/pages/[country]/[city]/field-note.astro';

for (const file of [enginePath, componentPath, routePath]) {
  expect(fs.existsSync(path.join(root, file)), `${file} is missing`);
}

const engine = read(enginePath);
const component = read(componentPath);
const route = read(routePath);
const genericFiles = `${engine}\n${component}\n${route}`;

expect(engine.includes('export const cityFieldNoteView'), 'generic cityFieldNoteView resolver is missing');
expect(engine.includes('generatedChapters(city, country)'), 'generated chapter layer is not wired into the view');
expect(engine.includes('editorialAdSlots.slice(0, 3)'), 'city note should expose exactly three editorial ad slots');

for (const marker of [
  'city-note__hero',
  'city-note__quick',
  'city-note__chapters',
  'city-note__chapter-side',
  'city-note__photo-spread',
  'city-note__warning',
  'city-note__closing',
]) {
  expect(component.includes(marker), `presentation block ${marker} is missing`);
}

expect(component.includes('cityFieldNoteView(city, country)'), 'component does not consume the generic city note engine');
expect(route.includes('getCities().map'), 'route is not generated for the city registry');
expect(route.includes('<CityFieldNote {city} {country} />'), 'route does not render the generic city note component');
expect(!/<main(?:\s|>)/i.test(route), 'route must not nest another <main> inside BaseLayout');
expect(route.includes(':global(body:has(.city-note) #main-content)'), 'route does not release the global main width for the editorial layout');

const destinationTokens = /\b(don-det|don det|pakse|tad-lo|tad lo|thakhek|vang-vieng|vang vieng|vientiane|luang-prabang|luang prabang)\b/i;
expect(!destinationTokens.test(genericFiles), 'destination-specific content leaked into the generic city note implementation');

console.log('City Field Note contract passed: generic engine, route semantics and editorial layout structure are intact.');
