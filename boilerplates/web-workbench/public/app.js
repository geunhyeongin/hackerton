const $=selector=>document.querySelector(selector);
async function api(url,options={}) {
 const response=await fetch(url,{...options,headers:{'Content-Type':'application/json',...options.headers}});
 const data=await response.json();
 if(!response.ok) throw new Error(data.error || '요청 실패');
 return data;
}
function message(text){$('#message').textContent=text;}
async function refresh(){
 const params=new URLSearchParams(new FormData($('#search')));
 const [items,total]=await Promise.all([api('/api/items?'+params),api('/api/summary')]);
 $('#summary').textContent='전체 '+total.total+' · 대기 '+total.open+' · 완료 '+total.done+' · 값 합계 '+total.value.toLocaleString();
 $('#rows').replaceChildren();
 if(!items.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=4;td.textContent='표시할 데이터가 없습니다.';tr.append(td);$('#rows').append(tr);}
 for(const item of items){
  const tr=document.createElement('tr');
  for(const value of [item.title,item.value.toLocaleString(),item.status==='done'?'완료':'대기']){
   const td=document.createElement('td');td.textContent=value;tr.append(td);
  }
  const actions=document.createElement('td');
  const toggle=document.createElement('button');toggle.textContent=item.status==='done'?'다시 열기':'완료 처리';
  toggle.onclick=()=>run(toggle,async()=>{await api('/api/items/'+item.id,{method:'PATCH',body:JSON.stringify({status:item.status==='done'?'open':'done'})});await refresh();message('상태를 변경했습니다.');});
  const remove=document.createElement('button');remove.textContent='삭제';
  remove.onclick=()=>{if(confirm('이 항목을 삭제할까요?')) run(remove,async()=>{await api('/api/items/'+item.id,{method:'DELETE'});await refresh();message('삭제했습니다.');});};
  actions.append(toggle,remove);tr.append(actions);$('#rows').append(tr);
 }
}
async function run(control,work){control.disabled=true;try{await work();}catch(error){message(error.message);}finally{control.disabled=false;}}
$('#create').onsubmit=event=>{event.preventDefault();run(event.submitter,async()=>{
 const data=new FormData(event.target);
 await api('/api/items',{method:'POST',body:JSON.stringify({title:data.get('title'),value:Number(data.get('value'))})});
 event.target.reset();await refresh();message('등록했습니다.');
});};
$('#search').onsubmit=event=>{event.preventDefault();run(event.submitter,async()=>{await refresh();message('조회했습니다.');});};
$('#export').onclick=event=>run(event.target,async()=>{
 const items=await api('/api/items');
 const url=URL.createObjectURL(new Blob([JSON.stringify(items,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='items.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 message('전체 데이터를 내보냈습니다.');
});
$('#import').onchange=event=>run(event.target,async()=>{
 const file=event.target.files[0];if(!file)return;
 if(file.size>1024*1024)throw new Error('최대 1MB 파일입니다.');
 const result=await api('/api/import',{method:'POST',body:JSON.stringify(JSON.parse(await file.text()))});
 event.target.value='';await refresh();message(result.imported+'건을 추가했습니다.');
});
refresh().catch(error=>message(error.message));
