import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const pages=['index.html','projects.html','games.html','eve.html','ionspire-os.html','parallel-earth.html','president-simulator.html','ai-dungeon-master.html','lockridge.html','about.html','contact.html','privacy.html','terms.html'];
const version='5.0.0';let links=0;
for(const page of pages){
  const text=readFileSync(resolve(root,page),'utf8');
  assert(text.includes(`data-site-version="${version}"`),page+' release version');
  assert.equal((text.match(/<nav\b/g)||[]).length,1,page+' exactly one navigation landmark');
  assert.equal((text.match(/<h1\b/g)||[]).length,1,page+' exactly one h1');
  assert(text.includes(`style.css?v=${version}`),page+' shared style');
  assert(text.includes(`premium.css?v=${version}`),page+' premium style');
  assert(text.includes(`details.css?v=${version}`),page+' detail style');
  assert(text.includes(`app.js?v=${version}`),page+' app behavior');
  assert(text.includes(`energy.js?v=${version}`),page+' ambient motion');
  assert(text.includes('assets/atomic-ionspire-binary-static.svg'),page+' binary brand mark');
  assert(!text.includes('assets/ionstar-v3.png'),page+' no legacy public logo');
  const ids=[...text.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,page+' unique IDs');
  for(const match of text.matchAll(/(?:href|src)="([^"]+)"/g)){
    const url=match[1];if(/^(https?:|mailto:|#)/.test(url))continue;
    const [path,hash]=url.split('#');const file=path.split('?')[0];
    assert(existsSync(resolve(root,file)),`${page} broken local link ${url}`);
    if(hash){const target=readFileSync(resolve(root,file),'utf8');assert(target.includes(`id="${hash}"`),`${page} missing anchor ${url}`)}
    links++;
  }
}
const home=readFileSync(resolve(root,'index.html'),'utf8');
assert(home.includes('assets/atomic-ionspire-binary.svg'),'homepage animated logo');
for(const project of ['lockridge.html','parallel-earth.html','president-simulator.html','ai-dungeon-master.html'])assert(home.includes(project),'homepage project link '+project);
const projects=readFileSync(resolve(root,'projects.html'),'utf8');const games=readFileSync(resolve(root,'games.html'),'utf8');
assert(projects.includes('href="lockridge.html"'),'projects links Lockridge detail');assert(games.includes('href="lockridge.html"'),'games links Lockridge detail');
for(const svg of ['assets/atomic-ionspire-binary.svg','assets/atomic-ionspire-binary-static.svg']){const s=readFileSync(resolve(root,svg),'utf8');assert(s.includes('<svg'),svg+' valid SVG');assert(/0|1/.test(s),svg+' contains binary')}
const animated=readFileSync(resolve(root,'assets/atomic-ionspire-binary.svg'),'utf8');assert(animated.includes('prefers-reduced-motion:reduce'),'animated logo honors reduced motion');
const js=readFileSync(resolve(root,'app.js'),'utf8');assert(js.includes('IntersectionObserver'),'reveal observer');assert(js.includes('localStorage'),'motion preference persistence');
const energy=readFileSync(resolve(root,'energy.js'),'utf8');assert(energy.includes('document.hidden'),'ambient motion pauses while hidden');assert(energy.includes('requestAnimationFrame'),'ambient motion uses RAF');
console.log(JSON.stringify({pages:pages.length,localLinks:links,release:version,checks:'passed'},null,2));
