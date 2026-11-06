/* Build-time list of every module, without browser globals/network calls. */
import {readdir,writeFile,stat} from 'node:fs/promises';
import {join,relative} from 'node:path';
const root='docs/labor';
const walk=async dir=>{
  const out=[];
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const path=join(dir,entry.name);
    if(entry.isDirectory())out.push(...await walk(path));
    else if(entry.isFile()&&entry.name.endsWith('.js'))out.push(path);
  }
  return out;
};
const modules=await walk(join(root,'generated'));
const files=['./index.html','./app.js','./worker.js','./manifest.webmanifest','./icon.svg',
  './offline-assets.json','./service-worker.js',
  ...modules.map(path=>'./'+relative(root,path).replaceAll('\\','/'))].sort();
if(modules.length<10)throw Error('Engine wurde nicht vollständig übersetzt: '+modules.length+' Module');
for(const p of files.filter(x=>x!=='./offline-assets.json'))await stat(join(root,p.slice(2)));
await writeFile(join(root,'offline-assets.json'),JSON.stringify(files,null,2)+'\n');
console.log('Offline PWA vollständig vorgeladen:',files.length,'Dateien (davon',modules.length,'Engine-Module)');
