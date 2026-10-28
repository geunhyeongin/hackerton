import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createServer} from '../server.mjs';
test('API: persistence, concurrent writes, import atomicity, errors, static allowlist',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'h-web-'));
 const dataFile=path.join(dir,'items.json');
 let server=createServer({dataFile});
 async function open(){await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return 'http://127.0.0.1:'+server.address().port;}
 let base=await open();
 const send=(route,method='GET',input)=>fetch(base+route,{method,headers:{'Content-Type':'application/json'},body:input===undefined?undefined:JSON.stringify(input)});
 try{
  assert.equal((await send('/')).status,200);
  assert.equal((await send('/data/items.json')).status,404);
  assert.equal((await send('/server.mjs')).status,404);
  assert.deepEqual(await (await send('/api/items')).json(),[]);
  assert.equal((await send('/api/items','POST',{title:' ',value:1})).status,400);
  const responses=await Promise.all(Array.from({length:12},(_,i)=>send('/api/items','POST',{title:'요청😀'+i,value:i})));
  assert.ok(responses.every(x=>x.status===201));
  let rows=await (await send('/api/items')).json();assert.equal(rows.length,12);assert.equal(rows[0].title.startsWith('요청😀'),true);
  assert.equal((await send('/api/import','POST',[{title:'valid'},{title:''}])).status,400);
  assert.equal((await (await send('/api/items')).json()).length,12);
  const first=rows[0];
  assert.equal((await send('/api/items/'+first.id,'PATCH',{status:'done'})).status,200);
  assert.equal((await (await send('/api/summary')).json()).done,1);
  assert.equal((await send('/api/items/missing','DELETE')).status,404);
  assert.equal((await fetch(base+'/api/items',{method:'POST',body:'{'})).status,400);
  assert.equal((await fetch(base+'/api/items',{method:'POST',headers:{Origin:'https://other.invalid'},body:'{}'})).status,403);
  assert.equal((await fetch(base+'/api/items',{method:'POST',body:'x'.repeat(1024*1024+1)})).status,413);
  assert.equal((await send('/api/import','POST',[{id:first.id,title:'imported',value:0}])).status,201);
  rows=await (await send('/api/items')).json();assert.equal(new Set(rows.map(x=>x.id)).size,13);
  await new Promise(resolve=>server.close(resolve));server=createServer({dataFile});base=await open();
  assert.equal((await (await send('/api/items')).json()).length,13);
  assert.equal((await send('/api/items/'+first.id,'DELETE')).status,200);
  await writeFile(dataFile,'broken');
  assert.equal((await send('/api/items')).status,500);
 }finally{await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true});}
});

test('storage shape errors are server failures; invalid PATCH bodies are rejected',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'h-shape-'));
 const file=path.join(dir,'items.json'),server=createServer({dataFile:file});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  await writeFile(file,'{}');assert.equal((await fetch(base+'/api/items')).status,500);
  await writeFile(file,'[{"id":"example","title":"x","value":0,"status":"open"}]');
  for(const value of [null,[]]){
   const res=await fetch(base+'/api/items/example',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});
   assert.equal(res.status,400);
  }
 }finally{await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true});}
});
