import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reusableFolders = [
  'src/engines',
  'src/core',
  'src/components/layout',
  'src/components/hero',
  'src/components/explore-board',
  'src/components/spa',
  'src/components/city-field-note',
  'src/pages/[country]',
];
const presentationFolders = ['src/components', 'src/pages'];
const sourceFiles = (folder) => {
  const dir = path.join(root, folder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { recursive: true })
    .filter((file) => String(file).match(/\.(ts|astro)$/))
    .map((file) => path.join(folder, String(file)));
};

const destinationPayloadImport = /from ['"][^'"]*(?:content\/(?:generated\/|countries\/|field-card-editorial-(?!overrides\.json)[^'"]+\.json)|pipeline\/(?:cities|sources)\/)[^'"]*['"]/i;
const destinationFailures = reusableFolders
  .flatMap(sourceFiles)
  .filter((file) => destinationPayloadImport.test(fs.readFileSync(path.join(root, file), 'utf8')));

if (destinationFailures.length) {
  throw new Error(`Reusable code must not import destination payloads directly: ${destinationFailures.join(', ')}`);
}

const rawEditorialImport = /from ['"][^'"]*content\/(?:field-card-[^'"]*-copy|city-field-note-[^'"]*-copy|spa-thing-card-copy)\.json['"]/i;
const editorialBoundaryFailures = presentationFolders
  .flatMap(sourceFiles)
  .filter((file) => rawEditorialImport.test(fs.readFileSync(path.join(root, file), 'utf8')));

if (editorialBoundaryFailures.length) {
  throw new Error(`Presentation must use editorial resolvers, not raw editorial JSON: ${editorialBoundaryFailures.join(', ')}`);
}

console.log('Architecture check passed: reusable code avoids direct destination payload imports and presentation is detached from raw editorial files.');
