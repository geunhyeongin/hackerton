import test from 'node:test';
import assert from 'node:assert/strict';
import {validateItem,selectItems,summarize} from '../domain.mjs';
test('validation preserves zero and rejects invalid values',()=>{
 assert.deepEqual(validateItem({title:' task ',value:0}),{title:'task',value:0,status:'open'});
 for(const v of [null,[],{}, {title:' '},{title:'x',value:-1},{title:'x',value:'2'},{title:'x',value:Infinity},{title:'x',status:'bad'}]) assert.throws(()=>validateItem(v));
});
test('search filter summary and empty data',()=>{
 const rows=[{title:'Alpha',status:'open',value:0},{title:'Beta',status:'done',value:2}];
 assert.deepEqual(selectItems(rows,{q:'ALP',status:'open'}),[rows[0]]);
 assert.equal(rows.length,2);
 assert.deepEqual(summarize(rows),{total:2,open:1,done:1,value:2});
 assert.deepEqual(summarize([]),{total:0,open:0,done:0,value:0});
});
