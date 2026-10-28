/**
 * 화면 흐름: 폼 입력 → api() → 서버 처리 → refresh()로 목록/집계 다시 표시.
 * 화면의 min/required는 사용 편의 기능이며 서버 검증을 대체하지 않는다.
 * 업무 필드를 바꾸면 HTML의 name과 여기서 만드는 JSON 필드도 함께 변경한다.
 */
const $=selector=>document.querySelector(selector);
// fetch는 HTTP 400/500에서도 성공 Promise를 주므로 response.ok를 직접 확인한다.
async function api(url,options={}) {
 const response=await fetch(url,{...options,headers:{'Content-Type':'application/json',...options.headers}});
 const data=await response.json();
 if(!response.ok) throw new Error(data.error || '요청 실패');
 return data;
}
function message(text){$('#message').textContent=text;}
// 목록은 검색/상태 필터 기준, 상단 집계는 전체 데이터 기준이다.
// 서로 독립적인 두 GET 요청은 병렬로 읽고, 반환값으로 화면을 새로 그린다.
async function refresh(){
 const params=new URLSearchParams(new FormData($('#search')));
 const [items,total]=await Promise.all([api('/api/items?'+params),api('/api/summary')]);
 $('#summary').textContent='전체 '+total.total+' · 대기 '+total.open+' · 완료 '+total.done+' · 값 합계 '+total.value.toLocaleString();
 $('#rows').replaceChildren();
 if(!items.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=4;td.textContent='표시할 데이터가 없습니다.';tr.append(td);$('#rows').append(tr);}
 for(const item of items){
  const tr=document.createElement('tr');
  for(const value of [item.title,item.value.toLocaleString(),item.status==='done'?'완료':'대기']){
   // 입력을 HTML로 해석하지 않도록 innerHTML 대신 textContent를 사용한다.
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
// 요청 중 버튼을 비활성화하고 실패 메시지를 표시한다. 서버의 중복 방지 정책은 별개다.
async function run(control,work){control.disabled=true;try{await work();}catch(error){message(error.message);}finally{control.disabled=false;}}
// FormData의 값은 문자열이다. 숫자 변환 후 보내고 서버에서 타입·범위를 다시 검사한다.
$('#create').onsubmit=event=>{event.preventDefault();run(event.submitter,async()=>{
 const data=new FormData(event.target);
 await api('/api/items',{method:'POST',body:JSON.stringify({title:data.get('title'),value:Number(data.get('value'))})});
 event.target.reset();await refresh();message('등록했습니다.');
});};
$('#search').onsubmit=event=>{event.preventDefault();run(event.submitter,async()=>{await refresh();message('조회했습니다.');});};
// 현재 필터와 관계없이 전체 데이터를 파일로 내려받는다. Blob URL은 사용 후 해제한다.
$('#export').onclick=event=>run(event.target,async()=>{
 const items=await api('/api/items');
 const url=URL.createObjectURL(new Blob([JSON.stringify(items,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='items.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 message('전체 데이터를 내보냈습니다.');
});
// 파일을 브라우저에서 JSON으로 읽어 서버에 전달한다. 배열/행 검증은 서버가 담당한다.
$('#import').onchange=event=>run(event.target,async()=>{
 const file=event.target.files[0];if(!file)return;
 if(file.size>1024*1024)throw new Error('최대 1MB 파일입니다.');
 const result=await api('/api/import',{method:'POST',body:JSON.stringify(JSON.parse(await file.text()))});
 event.target.value='';await refresh();message(result.imported+'건을 추가했습니다.');
});
refresh().catch(error=>message(error.message));
