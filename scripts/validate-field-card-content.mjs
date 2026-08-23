import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const loadJson = (relativePath, fallback = {}) => {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const editorial = loadJson('src/content/field-card-editorial.json');
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value ?? {}, key);
const text = (value) => String(value ?? '').trim();
const resolveFaq = (thing) => editorial[thing.id]?.faq ?? thing.fieldCard?.faq ?? [];
const resolveMedia = (thing) => editorial[thing.id]?.media ?? thing.media?.fieldCard?.gallery ?? [];
const resolveSources = (thing) => editorial[thing.id]?.sources ?? thing.researchSources ?? [];
const isShortFieldCard = (id) => hasOwn(editorial[id], 'secondaryStory') && editorial[id].secondaryStory === null;

const cityFiles = [];
const collectJson = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) collectJson(absolute);
    else if (entry.isFile() && entry.name.endsWith('.json')) cityFiles.push(absolute);
  }
};
collectJson(path.join(root, 'pipeline', 'cities'));

const failures = [];
let standardCount = 0;
let shortCount = 0;

for (const filePath of cityFiles) {
  const draft = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (draft.cityData?.seo?.indexable === false) continue;
  const cityKey = `${draft.country}/${draft.city}`;
  const activeThings = (draft.things ?? []).filter((thing) => thing.category === 'things-to-do' && thing.verification?.decision !== 'reject-closed');

  for (const thing of activeThings) {
    const latitude = thing.coordinates?.latitude;
    const longitude = thing.coordinates?.longitude;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      failures.push(`${cityKey}/${thing.id}: missing valid coordinates`);
    }
  }

  for (const thing of activeThings) {
    const short = isShortFieldCard(thing.id);
    if (short) shortCount += 1; else standardCount += 1;
    if (short && thing.fieldCard?.secondaryStory) failures.push(`${cityKey}/${thing.id}: short Field Card must not retain generated secondaryStory data`);

    const faq = resolveFaq(thing);
    const media = resolveMedia(thing);
    const sources = resolveSources(thing);
    if (faq.length !== 5) failures.push(`${cityKey}/${thing.id}: Field Card requires exactly 5 FAQ items; found ${faq.length}`);
    for (const [index, item] of faq.entries()) if (!text(item?.question) || !text(item?.answer)) failures.push(`${cityKey}/${thing.id}: FAQ ${index + 1} requires a non-empty question and answer`);

    const expectedMediaCount = short ? 2 : 3;
    if (media.length !== expectedMediaCount) failures.push(`${cityKey}/${thing.id}: ${short ? 'short' : 'standard'} Field Card requires exactly ${expectedMediaCount} media items; found ${media.length}`);
    for (const [index, item] of media.entries()) {
      if (!text(item?.src)) failures.push(`${cityKey}/${thing.id}: media ${index + 1} is missing src`);
      if (!text(item?.sourceName)) failures.push(`${cityKey}/${thing.id}: media ${index + 1} is missing sourceName`);
      if (!text(item?.license)) failures.push(`${cityKey}/${thing.id}: media ${index + 1} is missing license`);
    }
    const validSources = sources.filter((item) => text(item?.sourceName) && text(item?.sourceUrl));
    if (!validSources.length) failures.push(`${cityKey}/${thing.id}: Field Card requires at least one named editorial source with a URL`);
  }
}

if (failures.length) throw new Error(`Field Card content validation failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
console.log(`Field Card content validation passed: ${standardCount} standard, ${shortCount} short.`);
