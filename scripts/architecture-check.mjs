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

const destinationImport = /from ['"][^'"]*(don-det|pakse|laos|sri-lanka|thailand)[^'"]*['"]|['"]\/(laos|thailand|sri-lanka)(\/|['"])/i;
const destinationFailures = reusableFolders
  .flatMap(sourceFiles)
  .filter((file) => destinationImport.test(fs.readFileSync(path.join(root, file), 'utf8')));

if (destinationFailures.length) {
  throw new Error(`Destination-specific reusable code: ${destinationFailures.join(', ')}`);
}

const rawEditorialImport = /from ['"][^'"]*content\/(?:field-card-[^'"]*-copy|spa-thing-card-copy)\.json['"]/i;
const editorialBoundaryFailures = presentationFolders
  .flatMap(sourceFiles)
  .filter((file) => rawEditorialImport.test(fs.readFileSync(path.join(root, file), 'utf8')));

if (editorialBoundaryFailures.length) {
  throw new Error(`Presentation must use editorial resolvers, not raw editorial JSON: ${editorialBoundaryFailures.join(', ')}`);
}

console.log('Architecture check passed: reusable code is destination-agnostic and presentation is detached from raw editorial files.');
