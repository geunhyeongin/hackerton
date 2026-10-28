import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCSV,toCSV,rankRows} from '../modules/table.mjs';
import {fetchJSON} from '../modules/external.mjs';
test('CSV: quotes commas embedded newline BOM and malformed input',()=>{
 const rows=[{name:'a,b',note:'say "hi"\nnext'},{name:'한글',note:''}];
 assert.deepEqual(parseCSV('\ufeff'+toCSV(rows)),rows);
 assert.deepEqual(parseCSV('name,note\r\na,\r\n'),[{name:'a',note:''}]);
 assert.throws(()=>parseCSV('a,a\n1,2'));
 assert.throws(()=>parseCSV('a,b\n1'));
 assert.throws(()=>parseCSV('a\n"broken'));
 assert.deepEqual(parseCSV(''),[]);
});
test('ranking is deterministic, numeric, does not mutate',()=>{
 const rows=[{name:'a',quality:2,cost:4},{name:'b',quality:4,cost:2}];
 assert.equal(rankRows(rows,{quality:2,cost:-1})[0].name,'b');
 assert.equal(rows[0].name,'a');
 assert.throws(()=>rankRows([{quality:'x'}],{quality:1}));
});
test('external call returns explicit demo fallback and times out',async()=>{
 const result=await fetchJSON('https://example.invalid',{fetchImpl:async()=>{throw new Error('offline');},fallback:{demo:true}});
 assert.deepEqual(result,{source:'fallback',data:{demo:true},error:'offline'});
 const ok=await fetchJSON('https://example.invalid',{fetchImpl:async()=>new Response('{"ok":true}')});
 assert.equal(ok.source,'live');
 await assert.rejects(fetchJSON('https://example.invalid',{timeoutMs:5,fetchImpl:(_,opts)=>new Promise((resolve,reject)=>opts.signal.addEventListener('abort',()=>reject(opts.signal.reason)))}));
});
