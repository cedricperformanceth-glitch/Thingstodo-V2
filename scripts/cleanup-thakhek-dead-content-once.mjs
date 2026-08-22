import fs from 'node:fs';
import path from 'node:path';

const removedId = 'thing-tham-nang-aen-cave';
const shortIds = ['thing-tham-chang-elephant-cave','thing-tha-falang','thing-pha-inh-cave','thing-cool-springs-loop','thing-sandstone-buddhas'];
const boardIds = ['thing-kong-lor-cave','thing-xe-bang-fai-cave','thing-hin-nam-no-national-park'];
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const own = (value, key) => Object.prototype.hasOwnProperty.call(value ?? {}, key);

const sourceFile = 'pipeline/sources/laos/thakhek.json';
const source = read(sourceFile);
source.things = (source.things ?? []).filter((thing) => thing.id !== removedId);
source.city.exploreBoard.featuredThingIds = boardIds;
write(sourceFile, source);

const compactNames = new Set(['field-card-compact-copy.json','field-card-compact-additions.json','field-card-editorial-overrides.json','field-card-editorial-thakhek.json','field-card-editorial-thakhek-additions.json','field-card-editorial-hin-nam-no.json']);
const mediaNames = new Set(['field-card-media-copy.json','field-card-media-additions.json']);
for (const name of fs.readdirSync('src/content')) {
  if (!name.endsWith('.json') || name === 'thing-status-overrides.json') continue;
  const file = path.join('src/content', name);
  const data = read(file);
  if (!data || Array.isArray(data) || typeof data !== 'object') continue;
  let changed = false;
  if (own(data, removedId)) { delete data[removedId]; changed = true; }
  if (name === 'field-card-secondary-story-copy.json') {
    for (const id of shortIds) if (own(data, id)) { delete data[id]; changed = true; }
  }
  if (compactNames.has(name)) {
    for (const id of shortIds) {
      const entry = data[id];
      if (entry && own(entry, 'secondaryStory')) { delete entry.secondaryStory; changed = true; }
      if (Array.isArray(entry?.media) && entry.media.length > 2) { entry.media = entry.media.slice(0, 2); changed = true; }
    }
  }
  if (mediaNames.has(name)) {
    for (const id of shortIds) {
      const items = data[id];
      if (!Array.isArray(items) || items.length <= 2) continue;
      if (name === 'field-card-media-additions.json' && id === 'thing-cool-springs-loop') {
        const drawing = items.find((item) => item?.id === 'cool-springs-loop-photo-3');
        const first = items.find((item) => item?.id !== 'cool-springs-loop-photo-3');
        data[id] = [first, drawing].filter(Boolean);
      } else data[id] = items.slice(0, 2);
      changed = true;
    }
  }
  if (changed) write(file, data);
}

console.log('Thakhek dead-content cleanup applied.');
