import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateFieldCardSecondaryStory } from './lib/field-card-secondary-story.mjs';

const editorial = JSON.parse(readFileSync(new URL('../src/content/field-card-secondary-story-copy.json', import.meta.url), 'utf8'));
const contract = JSON.parse(readFileSync(new URL('../pipeline/contracts/field-card-secondary-story.json', import.meta.url), 'utf8'));
const component = readFileSync(new URL('../src/components/field-card/FieldCardSecondaryStory.astro', import.meta.url), 'utf8');
const beforeYouLeaveComponent = readFileSync(new URL('../src/components/field-card/FieldCardBeforeYouLeave.astro', import.meta.url), 'utf8');
const fieldCard = readFileSync(new URL('../src/components/field-card/FieldCard.astro', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/engines/field-card/field-card-engine.ts', import.meta.url), 'utf8');
const generator = readFileSync(new URL('./generate-city.mjs', import.meta.url), 'utf8');
const types = readFileSync(new URL('../src/core/models/types.ts', import.meta.url), 'utf8');

for (const [id, story] of Object.entries(editorial)) {
  const result = validateFieldCardSecondaryStory(story);
  assert.equal(result.valid, true, `${id}: ${result.errors.join('; ')}`);
}

const validStory = {
  chapters: [
    { label: 'TIME', title: 'Give it enough time', body: 'One editorial text belongs in chapter three.' },
    { label: 'CONDITIONS', title: 'Read the conditions', body: 'A different editorial angle belongs in chapter four.' },
  ],
  beforeYouLeave: {
    title: 'One last thing',
    body: 'One final editorial text belongs in Before You Leave.',
    note: { label: 'KEEP CLOSE', text: 'Reconfirm the detail locally.' },
  },
};

assert.equal(validateFieldCardSecondaryStory({ ...validStory, chapters: validStory.chapters.slice(0, 1) }).valid, false, 'Secondary story must keep exactly two chapters');
assert.equal(validateFieldCardSecondaryStory({ ...validStory, chapters: [{ ...validStory.chapters[0], body: ['One', 'Two'] }, validStory.chapters[1]] }).valid, false, 'Each secondary chapter body must be one text string');
assert.equal(validateFieldCardSecondaryStory({ ...validStory, layout: 'custom' }).valid, false, 'Secondary story data must not own layout');
assert.equal(validateFieldCardSecondaryStory({ ...validStory, image: '/custom.jpg' }).valid, false, 'Secondary story data must not own media');
assert.equal(validateFieldCardSecondaryStory({ ...validStory, beforeYouLeave: { ...validStory.beforeYouLeave, note: { ...validStory.beforeYouLeave.note, position: 'left' } } }).valid, false, 'Before You Leave note must not own its position');

assert.equal(contract.presentation.alwaysPresent, true, 'Secondary story block must be universal');
assert.equal(contract.presentation.chapterCount, 2, 'Secondary story must expose exactly two chapters');
assert.deepEqual(contract.presentation.chapterIndexes, ['03', '04'], 'Secondary story must own structural chapter indexes 03 and 04');
assert.equal(contract.presentation.photo, true, 'Secondary story must own one photo slot');
assert.equal(contract.presentation.postIt, false, 'Secondary story chapter block must not own a post-it');
assert.equal(contract.presentation.beforeYouLeave.alwaysPresent, true, 'Before You Leave must be universal');
assert.equal(contract.presentation.beforeYouLeave.photo, false, 'Before You Leave must not own a photo');
assert.match(contract.editorial.chapters.antiPattern, /Do not force chapter 03 to be TIME/i, 'Contract must forbid fixed chapter-three semantics');
assert.equal(contract.editorial.contentOnlyShape.presentationKeysForbidden, true, 'Secondary story contract must keep presentation out of editorial data');

assert.doesNotMatch(component, /xe-bang-fai|thakhek/i, 'Universal secondary story component must not contain destination-specific branches or copy');
assert.doesNotMatch(component, />TIME</i, 'Universal secondary story component must not hardcode TIME');
assert.match(component, /<figure/, 'Secondary story block must own a photo');
assert.match(component, /story\.chapters\.map/, 'Secondary story must render the two authored chapters');
assert.match(component, /index \+ 3/, 'Secondary story must derive structural indexes 03 and 04 from presentation');
assert.match(component, /chapter\.label/, 'Secondary story labels must be editorial data');
assert.match(component, /chapter\.title/, 'Secondary story titles must be editorial data');
assert.match(component, /chapter\.body/, 'Secondary story bodies must be editorial data');
assert.doesNotMatch(component, /story\.note|beforeYouLeave/, 'Secondary chapter block must not render the post-it or Before You Leave text');
assert.match(component, /grid-template-columns:\s*minmax\(280px, \.72fr\) minmax\(0, 1\.28fr\)/, 'Secondary story must keep photo left and text right on desktop');
assert.match(component, /background:\s*var\(--field-card-sheet\)/, 'Secondary story must render as a light Field Card sheet');
assert.match(component, /font-family:\s*var\(--field-card-title\)[\s\S]*font-weight:\s*600/, 'Secondary story titles must use Newsreader 600');
assert.match(component, /field-card-secondary-story__body[\s\S]*font-family:\s*var\(--field-card-editorial\)[\s\S]*font-weight:\s*400/, 'Secondary story narrative must use Newsreader 400');
assert.match(component, /field-card-secondary-story__label[\s\S]*font-family:\s*var\(--field-card-practical\)[\s\S]*font-weight:\s*400/, 'Secondary story labels must use Manrope 400');

assert.doesNotMatch(beforeYouLeaveComponent, /xe-bang-fai|thakhek/i, 'Universal Before You Leave component must not contain destination-specific branches or copy');
assert.match(beforeYouLeaveComponent, /FIELD NOTE · BEFORE YOU LEAVE/, 'Before You Leave label must belong to presentation');
assert.doesNotMatch(beforeYouLeaveComponent, /<img|<figure/, 'Before You Leave must not own a photo');
assert.match(beforeYouLeaveComponent, /content\.title/, 'Before You Leave title must be editorial data');
assert.match(beforeYouLeaveComponent, /content\.body/, 'Before You Leave body must be editorial data');
assert.match(beforeYouLeaveComponent, /content\.note\.label/, 'Before You Leave post-it label must be editorial data');
assert.match(beforeYouLeaveComponent, /content\.note\.text/, 'Before You Leave post-it text must be editorial data');
assert.match(beforeYouLeaveComponent, /field-card-before-you-leave__note p[\s\S]*font-family:\s*var\(--field-card-handwritten\)/, 'Before You Leave post-it must use the handwritten role');

assert.match(fieldCard, /<FieldCardStoryBlock[\s\S]*?<FieldCardSecondaryStory/, 'Secondary story must render directly after the Primary Story block');
assert.match(fieldCard, /<FieldCardSecondaryStory[\s\S]*?adSlots\[0\][\s\S]*?<FieldCardBeforeYouLeave/, 'Advertising must remain after the secondary story and before Before You Leave');
assert.match(engine, /secondaryStoryEditorial/, 'View engine must support editorial secondary-story overrides');
assert.match(engine, /thing\.fieldCard\.secondaryStory/, 'View engine must support generated secondary-story content');
assert.match(engine, /fallbackSecondaryStory/, 'Legacy activities must retain a deterministic secondary-story fallback');
assert.match(engine, /gallery\[2\]/, 'Secondary story photo must use the third Field Card gallery slot');
assert.match(engine, /slice\(primaryLegacyOffset \+ 2\)/, 'Legacy sections 03 and 04 must both be consumed before remaining sections render');
assert.match(types, /secondaryStory\?: FieldCardSecondaryStoryContent/, 'ThingToDo Field Card model must support secondary-story content');
assert.match(types, /beforeYouLeave: FieldCardBeforeYouLeaveContent/, 'Secondary story model must carry the universal Before You Leave content');
assert.match(generator, /candidate\.fieldCardSecondaryStory/, 'City generation must accept authored secondary-story content');
assert.match(generator, /assertValidFieldCardSecondaryStory/, 'Secondary-story generation input must be validated');

console.log(`Field Card secondary story contract passed: ${Object.keys(editorial).length} authored override(s) validated.`);
