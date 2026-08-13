import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const component = readFileSync(new URL('../src/components/field-card/FieldCardStoryBlock.astro', import.meta.url), 'utf8');
const fieldCard = readFileSync(new URL('../src/components/field-card/FieldCard.astro', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/engines/field-card/field-card-engine.ts', import.meta.url), 'utf8');

assert.doesNotMatch(component, /xe-bang-fai|thakhek/i, 'Universal story block must not contain destination-specific branches or copy');
assert.match(component, /sections\.slice\(0, 2\)/, 'Story block must own the first two editorial sections');
assert.match(component, /Photo to add/, 'Story block must keep a manual-fill placeholder when its dedicated photo is missing');
assert.match(component, /field-card-story-block__route-note/, 'Story block must expose the universal route-note slot');
assert.match(component, /width: min\(1000px, calc\(100% - 56px\)\)/, 'Story block must remain narrower than the Field Card canvas on desktop');
assert.match(component, /border-top:/, 'Story block must retain a top divider');
assert.match(component, /border-bottom:/, 'Story block must retain a bottom divider');
assert.doesNotMatch(component, /border-left:|border-right:/, 'Story block must not gain side borders');
assert.match(component, /background: #fffdf8/, 'Story block must use the light sheet background');
assert.match(fieldCard, /<FieldCardQuickRead[\s\S]*<FieldCardStoryBlock/, 'Primary story block must render directly after Quick Read');
assert.match(fieldCard, /body:has\(\.field-card\)[\s\S]*background: #f4f0e7/, 'Field Card routes must restore the V1 paper page background');
assert.match(engine, /storySections = sections\.slice\(0, 2\)/, 'View engine must expose the first two sections as one story block');
assert.match(engine, /remainingSections = sections\.slice\(2\)/, 'View engine must prevent the first two sections from rendering twice');
assert.match(engine, /storyImage = gallery\[1\]/, 'Story block must request a distinct secondary Field Card image');
assert.match(engine, /storyNote = hero\.photoNote/, 'Story block route note must reuse the authored Hero route note by default');

console.log('Field Card primary story block contract passed.');
