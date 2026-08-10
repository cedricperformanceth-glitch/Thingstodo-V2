import fs from 'node:fs'; import path from 'node:path';
const root=process.cwd(), dir=path.join(root,'pipeline','cities'); const drafts=fs.existsSync(dir)?fs.readdirSync(dir,{recursive:true}).filter(x=>String(x).endsWith('.json')).map(x=>JSON.parse(fs.readFileSync(path.join(dir,x),'utf8'))):[];
const fail=[]; const unique=(items,key,label)=>{const seen=new Set(); for(const item of items){const value=key(item); if(seen.has(value)) fail.push(`Duplicate ${label}: ${value}`); seen.add(value);}};
unique(drafts,x=>x.cityData.id,'city ID'); unique(drafts,x=>`${x.country}/${x.city}`,'city route'); unique(drafts.flatMap(x=>x.places),x=>x.id,'Place ID'); unique(drafts.flatMap(x=>x.things),x=>x.id,'ThingToDo ID'); unique(drafts.flatMap(x=>x.places),x=>`${x.country}/${x.city}/${x.slug}`,'Place route slug'); unique(drafts.flatMap(x=>x.things),x=>`${x.country}/${x.city}/${x.slug}`,'ThingToDo route slug');
for (const draft of drafts) {
  const cityKey=`${draft.country}/${draft.city}`;
  if ('media' in draft.cityData) fail.push(`Duplicate City media manifest: ${cityKey}`);
  if (draft.cityData.hero?.media) fail.push(`City Hero visual media must come from the asset resolver: ${cityKey}`);

  const heroRoot=path.join(root,'public','assets','cities',draft.country,draft.city,'hero');
  const heroAssets=[
    ['stamp',path.join(heroRoot,'stamps',`${draft.city}-hero-stamp.webp`)],
    ['drawing',path.join(heroRoot,'drawings',`${draft.city}-hero-drawing.webp`)],
    ['photo',path.join(heroRoot,'photos',`${draft.city}-hero-photo.webp`)],
  ];
  for (const [kind,assetPath] of heroAssets) {
    if (!fs.existsSync(assetPath)) fail.push(`Missing City Hero ${kind}: ${cityKey} -> ${path.relative(root,assetPath)}`);
  }

  for (const entity of [...draft.places, ...draft.things]) {
    if (entity.media?.hero) fail.push(`Place/ThingToDo media must not contain Hero media: ${cityKey}/${entity.slug}`);
  }
}
if(fail.length) throw new Error(fail.join('\n')); console.log('Generated Atlas data validation passed.');
