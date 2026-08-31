import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateFieldCardPrimaryStory } from './lib/field-card-primary-story.mjs';

const editorial = JSON.parse(readFileSync(new URL('../src/content/field-card-editorial.json', import.meta.url), 'utf8'));
const contract = JSON.parse(readFileSync(new URL('../pipeline/contracts/field-card-primary-story.json', import.meta.url), 'utf8'));
const component = readFileSync(new URL('../src/components/field-card/FieldCardStoryBlock.astro', import.meta.url), 'utf8');
const fieldCard = readFileSync(new URL('../src/components/field-card/FieldCard.astro', import.meta.url), 'utf8');
const hero = readFileSync(new URL('../src/components/field-card/FieldCardHero.astro', import.meta.url), 'utf8');
const quickRead = readFileSync(new URL('../src/components/field-card/FieldCardQuickRead.astro', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/engines/field-card/field-card-engine.ts', import.meta.url), 'utf8');
const generator = readFileSync(new URL('./generate-city.mjs', import.meta.url), 'utf8');
const tokens = readFileSync(new URL('../src/core/design-system/tokens.css', import.meta.url), 'utf8');

const authoredPrimaryStories = Object.entries(editorial).filter(([, entry]) => entry.primaryStory);
assert.ok(authoredPrimaryStories.length > 0, 'The canonical editorial registry must retain authored primary-story overrides.');

const validStory = {
  chapters: [
    { label: 'FIRST ANGLE', title: 'First angle', body: 'First body' },
    { label: 'SECOND ANGLE', title: 'Second angle', body: 'Second body' },
  ],
  note: { label: 'FIELD NOTE', text: 'Useful detail' },
};

assert.equal(validateFieldCardPrimaryStory({ chapters: [{ label: 'ONLY', title: 'Only one', body: 'Body' }], note: { label: 'NOTE', text: 'Text' } }).valid, false, 'Primary story must require exactly two chapters');
assert.equal(validateFieldCardPrimaryStory({ ...validStory, chapters: [{ title: 'First angle', body: 'First body' }, validStory.chapters[1]] }).valid, false, 'Primary story chapters must require editorial labels');
assert.equal(validateFieldCardPrimaryStory({ ...validStory, layout: 'custom' }).valid, false, 'Primary story data must not own layout');
assert.equal(validateFieldCardPrimaryStory({ ...validStory, chapters: [{ label: 'FIRST ANGLE', title: 'First angle', body: 'First body', image: '/custom.jpg' }, validStory.chapters[1]] }).valid, false, 'Primary story chapters must not own presentation/media keys');
assert.equal(validateFieldCardPrimaryStory({ ...validStory, note: { ...validStory.note, position: 'left' } }).valid, false, 'Primary story note must not own its position');

assert.equal(contract.presentation.alwaysPresent, true, 'Primary story block must be universal');
assert.equal(contract.presentation.chapterNumbering, '01 and 02 are presentation-owned and derive from chapter order', 'Primary story numbering must stay presentation-owned');
assert.equal(contract.editorial.chapters.count, 2, 'Primary story contract must always expose two chapter slots');
assert.deepEqual(contract.editorial.contentOnlyShape.chapterKeys, ['label', 'title', 'body'], 'Primary story chapters must expose label, title and body only');
assert.equal(contract.editorial.contentOnlyShape.presentationKeysForbidden, true, 'Primary story contract must keep presentation out of editorial data');
assert.match(contract.editorial.chapters.antiPattern, /Do not fill chapter one with route or chapter two with price by habit/i, 'Contract must forbid fixed route/price semantics');
assert.doesNotMatch(component, /xe-bang-fai|thakhek/i, 'Universal story component must not contain destination-specific branches or copy');
assert.doesNotMatch(component, /ROUTE NOTE/, 'Post-it label must be editorial data, not component copy');
assert.match(component, /const firstChapter = story\.chapters\[0\];[\s\S]*const remainingChapters = story\.chapters\.slice\(1\);/, 'Story block must preserve the authored chapter order when it renders the first chapter separately for its optional ad slot');
assert.match(component, /remainingChapters\.map\(\(chapter, index\)/, 'Story block must render every remaining authored chapter after the optional ad slot');
assert.match(component, /<span aria-hidden="true">01 ·<\/span>[\s\S]*?String\(chapterIndex \+ 1\)\.padStart\(2, '0'\)/, 'Story block must render 01 and 02 from chapter order');
assert.match(component, /chapter\.label \|\| fallbackChapterLabel/, 'Story block must render authored chapter labels while retaining legacy fallback compatibility');
assert.match(component, /story\.note\.label/, 'Story block must render a variable post-it label');
assert.match(component, /story\.note\.text/, 'Story block must render variable post-it text');
assert.match(component, /Photo to add/, 'Story block must keep a manual-fill placeholder when its dedicated photo is missing');
assert.match(component, /width: min\(1000px, calc\(100% - 56px\)\)/, 'Story block must remain narrower than the Field Card canvas on desktop');
assert.match(component, /border-top:/, 'Story block must retain a top divider');
assert.match(component, /border-bottom:/, 'Story block must retain a bottom divider');
assert.doesNotMatch(component, /border-left:|border-right:/, 'Story block must not gain side borders');
assert.match(component, /background:\s*var\(--field-card-sheet\)/, 'Story block must consume the shared Field Card sheet token');
assert.match(fieldCard, /body:has\(\.field-card\)[\s\S]*background:\s*var\(--field-card-page\)/, 'Field Card routes must consume the shared page token');
assert.match(hero, /linear-gradient\(var\(--field-card-sheet-wash\), var\(--field-card-sheet-wash\)\)/, 'Field Card Hero must consume the shared translucent sheet token');
assert.doesNotMatch([fieldCard, hero, component].join('\n'), /#f4f0e7|#fffdf8/, 'Field Card components must not duplicate shared page/sheet hex values');
assert.equal((hero.match(/\.field-card-hero__axis\s*\{/g) ?? []).length, 2, 'Hero axis should have one base rule and one mobile override only');
assert.doesNotMatch(hero, /\.field-card-hero__axis\s*\{\s*overflow:\s*hidden;/, 'Hero mobile axis must not retain the obsolete overflow override');
assert.match(engine, /getEditorialPrimaryStory/, 'View engine must read primary-story overrides from the canonical editorial registry');
assert.match(engine, /thing\.fieldCard\.primaryStory/, 'View engine must support generated primary-story content');
assert.match(engine, /storyImage = gallery\[1\]/, 'Story block must request a distinct secondary Field Card image');
assert.doesNotMatch(engine, /fieldCard\.whyGo/, 'Field Card rendering fallbacks must not depend on the removed Why Go presentation concept');
assert.match(generator, /candidate\.fieldCardPrimaryStory/, 'City generation must accept authored primary-story content');
assert.match(generator, /assertValidFieldCardPrimaryStory/, 'Primary-story generation input must be validated');

assert.match(tokens, /--field-card-page:#f4f0e7/, 'Field Card page color must be a shared design token');
assert.match(tokens, /--field-card-sheet:#fffdf8/, 'Field Card sheet color must be a shared design token');
assert.match(tokens, /--field-card-sheet-wash:rgb\(255 253 248 \/ \.96\)/, 'Field Card translucent sheet color must be a shared design token');
assert.match(tokens, /--field-card-title:'Newsreader'/, 'Newsreader title role must be defined');
assert.match(tokens, /--field-card-editorial:'Newsreader'/, 'Newsreader editorial role must be defined');
assert.match(tokens, /--field-card-practical:'Manrope'/, 'Manrope practical role must be defined');
assert.match(tokens, /--field-card-handwritten:'Caveat'/, 'Caveat handwritten role must be defined');
assert.doesNotMatch(fieldCard, /field-card-typography\.css/, 'Field Card typography must not rely on an override stylesheet');
assert.doesNotMatch([hero, quickRead, component].join('\n'), /font-family:\s*(?:Fraunces|'DM Sans')/, 'Field Card components must not retain legacy Fraunces or DM Sans declarations');
assert.match(hero, /\.field-card-hero h1\s*\{[\s\S]*?font-family:\s*var\(--field-card-title\);[\s\S]*?font-weight:\s*600;/, 'Hero title must directly use Newsreader 600 role');
assert.match(hero, /\.field-card-hero__description\s*\{[\s\S]*?font-family:\s*var\(--field-card-editorial\);[\s\S]*?font-weight:\s*400;/, 'Hero introduction must directly use Newsreader 400 role');
assert.match(quickRead, /\.field-card-quick-read__primary\s*\{[\s\S]*?font-family:\s*var\(--field-card-practical\);[\s\S]*?font-weight:\s*400;/, 'Quick Read practical values must directly use Manrope 400 role');
assert.match(component, /\.field-card-story-block__story h2\s*\{[\s\S]*?font-family:\s*var\(--field-card-title\);[\s\S]*?font-weight:\s*600;/, 'Story titles must directly use Newsreader 600 role');
assert.match(component, /\.field-card-story-block__story p\s*\{[\s\S]*?font-family:\s*var\(--field-card-editorial\);[\s\S]*?font-weight:\s*400;/, 'Story narrative must directly use Newsreader 400 role');
assert.match(component, /\.field-card-story-block__label\s*\{[\s\S]*?font-family:\s*var\(--field-card-practical\)/, 'Chapter labels must use the same Manrope role as chapters 03 and 04');
assert.match(component, /\.field-card-story-block__photo figcaption\s*\{[\s\S]*?font-family:\s*var\(--field-card-editorial\);[\s\S]*?font-weight:\s*400;/, 'Photo captions must directly use Newsreader 400 role');
assert.match(component, /\.field-card-story-block__note span\s*\{[\s\S]*?font-family:\s*var\(--field-card-practical\);[\s\S]*?font-weight:\s*400;/, 'Post-it labels must directly use Manrope 400 role');
assert.match(component, /\.field-card-story-block__note p\s*\{[\s\S]*?font-family:\s*var\(--field-card-handwritten\);/, 'Post-it text must directly use the handwritten role');
assert.match(fieldCard, /\.field-card__body h2\s*\{[\s\S]*?font-family:\s*var\(--field-card-title\);[\s\S]*?font-weight:\s*600;/, 'Later Field Card headings must use Newsreader 600 directly');

console.log(`Field Card primary story contract passed: ${authoredPrimaryStories.length} canonical override(s) found.`);
