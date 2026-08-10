import fs from 'node:fs'; import path from 'node:path';
const engines=path.join(process.cwd(),'src','engines'); const banned=/from ['"][^'"]*(don-det|pakse|laos|sri-lanka|thailand)[^'"]*['"]/i;
const failures=fs.readdirSync(engines,{recursive:true}).filter(file=>String(file).endsWith('.ts')).filter(file=>banned.test(fs.readFileSync(path.join(engines,file),'utf8')));
if(failures.length) throw new Error(`Destination-specific engine imports: ${failures.join(', ')}`); console.log('Architecture check passed: engines use registries, not destinations.');
