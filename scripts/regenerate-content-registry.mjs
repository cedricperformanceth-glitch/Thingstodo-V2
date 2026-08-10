import fs from 'node:fs'; import path from 'node:path';
const root=process.cwd(), dir=path.join(root,'src','content','generated');
const modules=fs.readdirSync(dir,{recursive:true}).map(String).filter(file=>file.endsWith('.ts')&&file!=='index.ts').map(file=>file.replace(/\\/g,'/').replace(/\.ts$/,''));
const imports=modules.map((file,index)=>`import { city as city${index}, places as places${index}, things as things${index} } from './${file}';`).join('\n');
const cityImports=modules.map((_,i)=>`city${i}`).join(', '); const placeImports=modules.map((_,i)=>`...places${i}`).join(', '); const thingImports=modules.map((_,i)=>`...things${i}`).join(', ');
fs.writeFileSync(path.join(dir,'index.ts'),`import type { City, Place, ThingToDo } from '../../core/models/types';\n${imports}${imports?'\n':''}export const generatedCities: City[] = [${cityImports}];\nexport const generatedPlaces: Place[] = [${placeImports}];\nexport const generatedThings: ThingToDo[] = [${thingImports}];\n`);
console.log(`Registry regenerated for ${modules.length} city module(s).`);
