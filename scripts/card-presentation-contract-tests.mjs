import assert from 'node:assert/strict';
import fs from 'node:fs';

const placeCard = fs.readFileSync('src/components/cards/PlaceCard.astro', 'utf8');
const thingCard = fs.readFileSync('src/components/cards/ThingToDoCard.astro', 'utf8');
const cardCss = fs.readFileSync('src/components/cards/entry-card.css', 'utf8');
const spaPanel = fs.readFileSync('src/components/spa/SpaPanel.astro', 'utf8');

assert.doesNotMatch(placeCard, /card-type|categoryLabels|const\s+context\s*=/, 'Place cards must never render the category/city label above the establishment name');
assert.doesNotMatch(cardCss, /\.card-type\b/, 'Removed category/city label styling must never return');
assert.doesNotMatch(spaPanel, /\.card-type\b/, 'Removed category/city label styling must never remain in the SPA shell');

assert.match(placeCard, /\{place\.spaCard\?\.handwrittenTags\s*&&/, 'Place handwritten notes must render whenever the SPA card has them');
assert.match(thingCard, /\{spaCard\?\.handwrittenTags\s*&&/, 'Things to do handwritten notes must render from the resolved SPA card content');
assert.doesNotMatch(placeCard, /image\s*&&\s*place\.spaCard\?\.handwrittenTags/, 'Place handwritten notes must never depend on the photo being present');
assert.doesNotMatch(thingCard, /image\s*&&\s*spaCard\?\.handwrittenTags/, 'Things to do handwritten notes must never depend on the photo being present');
assert.match(cardCss, /\.card-media\.empty\s+\.card-handwritten/, 'Placeholder cards must keep handwritten notes readable before a photo is filled');

console.log('Permanent SPA card presentation contract tests passed.');
