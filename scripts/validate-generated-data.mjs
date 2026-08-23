import fs from 'node:fs'; import path from 'node:path';
import { researchPlan, validateCityCategories } from './lib/city-pipeline.mjs';
const root=process.cwd(), dir=path.join(root,'pipeline','cities'); const drafts=fs.existsSync(dir)?fs.readdirSync(dir,{recursive:true}).filter(x=>String(x).endsWith('.json')).map(x=>JSON.parse(fs.readFileSync(path.join(dir,x),'utf8'))):[];
const fail=[]; const unique=(items,key,label)=>{const seen=new Set(); for(const item of items){const value=key(item); if(seen.has(value)) fail.push(`Duplicate ${label}: ${value}`); seen.add(value);}};
unique(drafts,x=>x.cityData.id,'city ID'); unique(drafts,x=>`${x.country}/${x.city}`,'city route'); unique(drafts.flatMap(x=>x.places),x=>x.id,'Place ID'); unique(drafts.flatMap(x=>x.things),x=>x.id,'ThingToDo ID'); unique(drafts.flatMap(x=>x.places),x=>`${x.country}/${x.city}/${x.slug}`,'Place route slug'); unique(drafts.flatMap(x=>x.things),x=>`${x.country}/${x.city}/${x.slug}`,'ThingToDo route slug');
for (const draft of drafts) {
  const cityKey=`${draft.country}/${draft.city}`;
  const isDraft=draft.cityData?.seo?.indexable === false;
  if ('media' in draft.cityData) fail.push(`Duplicate City media manifest: ${cityKey}`);
  if (draft.cityData.hero?.media) fail.push(`City Hero visual media must come from the asset resolver: ${cityKey}`);
  const settlementType=draft.cityData.settlementType;
  let actualCategories=[];
  try { actualCategories=validateCityCategories(draft.cityData.categories,settlementType,cityKey); } catch (error) { fail.push(`${cityKey}: ${error instanceof Error ? error.message : String(error)}`); }
  if (actualCategories.length) {
    const expectedResearchPlan=researchPlan(draft.country,settlementType,`${draft.country}/${draft.city}`,actualCategories);
    if (JSON.stringify(draft.researchPlan ?? null)!==JSON.stringify(expectedResearchPlan)) fail.push(`Research plan must match the current category/source rules for ${cityKey}.`);
  }
  if (!isDraft) {
    const heroRoot=path.join(root,'public','assets','cities',draft.country,draft.city,'hero');
    for (const [kind,assetPath] of [['stamp',path.join(heroRoot,'stamps',`${draft.city}-hero-stamp.webp`)],['drawing',path.join(heroRoot,'drawings',`${draft.city}-hero-drawing.webp`)],['photo',path.join(heroRoot,'photos',`${draft.city}-hero-photo.webp`)]]) if (!fs.existsSync(assetPath)) fail.push(`Missing City Hero ${kind}: ${cityKey} -> ${path.relative(root,assetPath)}`);
  }
  const featuredIds=draft.cityData.exploreBoard?.featuredThingIds ?? [];
  if (!isDraft && featuredIds.length !== 3) fail.push(`Explore Board requires exactly 3 landmarks: ${cityKey}; found ${featuredIds.length}`);
  if (new Set(featuredIds).size !== featuredIds.length) fail.push(`Explore Board landmark IDs must be unique: ${cityKey}`);
  for (const id of featuredIds) {
    const thing=draft.things.find((candidate)=>candidate.id===id);
    if (!thing) { fail.push(`Explore Board references missing ThingToDo '${id}': ${cityKey}`); continue; }
    if (thing.isLandmark !== true) fail.push(`Explore Board entry must be a landmark ThingToDo '${id}': ${cityKey}`);
    if (!thing.exploreBoard?.kicker || !thing.exploreBoard?.duration || !thing.exploreBoard?.route) fail.push(`Explore Board metadata is incomplete for '${id}': ${cityKey}`);
    if (!isDraft && !thing.media?.card?.image?.src) fail.push(`Explore Board landmark requires the shared ThingToDo card image '${id}': ${cityKey}`);
  }
  for (const entity of [...draft.places, ...draft.things]) {
    if (entity.media?.hero) fail.push(`Place/ThingToDo media must not contain Hero media: ${cityKey}/${entity.slug}`);
    if (entity.media?.research?.firstPartyPhotoLeads) fail.push(`Legacy first-party photo leads are forbidden: ${cityKey}/${entity.slug}`);
    if ('firstPartySources' in entity) fail.push(`Legacy firstPartySources field is forbidden: ${cityKey}/${entity.slug}`);
    if ('isMySelection' in entity) fail.push(`Legacy isMySelection field is forbidden: ${cityKey}/${entity.slug}`);
    if ('selectionRank' in entity) fail.push(`Legacy selectionRank field is forbidden: ${cityKey}/${entity.slug}`);
    if (!draft.cityData.categories?.includes(entity.category)) fail.push(`Entity category is not enabled by City.categories: ${cityKey}/${entity.slug} -> ${entity.category}`);
  }
}
if(fail.length) throw new Error(fail.join('\n'));
console.log('Generated Atlas data validation passed.');
