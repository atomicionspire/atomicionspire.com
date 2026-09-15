import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pages = readdirSync(root).filter(path=>path.endsWith('.html'));
const version = '3.0.1';
let links = 0;
for(const page of pages) {
  const text = readFileSync(resolve(root,page),'utf8');
  assert.equal((text.match(/<nav /g)||[]).length,1,page+' shared navigation');
  assert.equal((text.match(/class="brand-mark"/g)||[]).length,2,page+' shared branding');
  assert(text.includes('aria-controls="primary-links"'), page+' accessible menu');
  assert(text.includes('styles.css?v='+version), page+' versioned CSS');
  assert(text.includes('script.js?v='+version), page+' versioned JS');
  assert(text.includes('data-site-version="'+version+'"'),page+' version');
  assert(!text.includes('atomic-ionspire-mark'),page+' old logo reference');
  assert.equal((text.match(/<h1[ >]/g)||[]).length,1,page+' single heading');
  for(const match of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if(/^(https?:|mailto:|#)/.test(url)) continue;
    const [path,hash] = url.split('#');
    const file = path.split('?')[0];
    assert(existsSync(resolve(root,file)), page+' broken link '+url);
    if(hash) assert(readFileSync(resolve(root,file),'utf8').includes('id="'+hash+'"'),page+' missing anchor '+url);
    links++;
  }
}
function crc32(bytes) {
  let crc=0xffffffff;
  for(const b of bytes) { crc^=b; for(let n=0;n<8;n++) crc=(crc>>>1)^((crc&1)?0xedb88320:0); }
  return (crc^0xffffffff)>>>0;
}
const png=readFileSync(resolve(root,'assets/ionstar-v3.png'));
assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
let pos=8,ended=false;const data=[];
while(pos<png.length) {
  const size=png.readUInt32BE(pos),tag=png.toString('ascii',pos+4,pos+8);
  assert(pos+size+12<=png.length,'truncated PNG '+tag);
  assert.equal(crc32(png.subarray(pos+4,pos+8+size)),png.readUInt32BE(pos+8+size),'PNG CRC '+tag);
  if(tag==='IDAT')data.push(png.subarray(pos+8,pos+8+size));
  if(tag==='IEND')ended=true;
  pos+=size+12;
}
assert(ended,'PNG missing IEND');
assert.equal(inflateSync(Buffer.concat(data)).length,1254*(1254*4+1),'decoded PNG dimensions');
const css=readFileSync(resolve(root,'styles.css'),'utf8');
assert(!css.includes('content:url('),'CSS must not replace an image source');
console.log(JSON.stringify({pages:pages.length,localLinks:links,pngBytes:png.length,pngSha256:createHash('sha256').update(png).digest('hex'),checks:'passed'},null,2));
