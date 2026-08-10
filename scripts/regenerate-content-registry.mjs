import fs from 'node:fs'; import path from 'node:path';
const root=process.cwd(), dir=path.join(root,'src','content','generated');
const modules=fs.readdirSync(dir,{recursive:true}).map(String).filter(file=>file.endsWith('.ts')&&file!=='index.ts').map(file=>file.replace(/\\/g,'/').replace(/\.ts$/,''));
const imports=modules.map((file,index)=>`import { city as city${index}, places as places${index}, things as things${index} } from './${file}';`).join('\n');
const cityImports=modules.length?modules.map((_,i)=>`city${i}`).join(', '):'donDet'; const placeImports=modules.length?modules.map((_,i)=>`...places${i}`).join(', '):'...donDetPlaces'; const thingImports=modules.length?modules.map((_,i)=>`...things${i}`).join(', '):'...donDetThings';
fs.writeFileSync(path.join(dir,'index.ts'),`import type { City, Place, ThingToDo } from '../../core/models/types';\nimport { donDet } from '../cities/don-det';\nimport { donDetPlaces } from '../places/don-det';\nimport { donDetThings } from '../things-to-do/don-det';\n${imports}\nexport const generatedCities: City[] = [${cityImports}];\nexport const generatedPlaces: Place[] = [${placeImports}];\nexport const generatedThings: ThingToDo[] = [${thingImports}];\n`);
console.log(`Registry regenerated for ${modules.length + 1} city module(s).`);
