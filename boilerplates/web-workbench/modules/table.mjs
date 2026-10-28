/**
 * CSV → 객체 배열. 헤더를 키로 쓰며 모든 값은 문자열로 반환한다.
 * 쉼표·인용부호·셀 안 줄바꿈을 처리한다. 숫자 변환은 업무별 검증 경계에서 수행한다.
 * 전체 텍스트를 메모리에 올리므로 대용량 파일용 스트리밍 파서는 아니다.
 */
export function parseCSV(text) {
 text=text.replace(/^\uFEFF/,'');
 if(!text.trim())return [];
 // field: 현재 셀, row: 현재 행, quoted: 인용부호 안, closed: 인용부호를 방금 닫음.
 const rows=[];let row=[],field='',quoted=false,closed=false;
 function cell(){row.push(field);field='';closed=false;}
 function line(){cell();rows.push(row);row=[];}
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;}}else field+=c;continue;}
  if(c==='"'){if(field || closed)throw new Error('Invalid CSV or numeric input');quoted=true;}
  else if(c===',')cell();
  else if(c==='\r'||c==='\n'){if(c==='\r'&&text[i+1]==='\n')i++;line();}
  else {if(closed)throw new Error('Invalid CSV or numeric input');field+=c;}
 }
 if(quoted)throw new Error('Invalid CSV or numeric input');
 if(field || row.length || closed)line();
 const headers=rows.shift();
 if(headers.some(x=>!x)||new Set(headers).size!==headers.length)throw new Error('Invalid CSV or numeric input');
 return rows.map(values=>{
  if(values.length!==headers.length)throw new Error('Invalid CSV or numeric input');
  return Object.fromEntries(headers.map((key,i)=>[key,values[i]]));
 });
}
// 객체 배열 → CSV. Excel 배포용 spreadsheetSafe=true는 수식 시작 문자를 문자열 처리한다.
// 첫 행의 키 순서를 열 순서로 사용한다. 원본 보존이 필요하면 기본 false를 유지한다.
export function toCSV(rows,{spreadsheetSafe=false}={}) {
 if(!rows.length)return '';
 const keys=Object.keys(rows[0]);
 function escape(value){
  let s=String(value??'');
  if(spreadsheetSafe && /^[=+\-@\t\r]/.test(s))s="'"+s;
  return '"'+s.replaceAll('"','""')+'"';
 }
 return [keys,...rows.map(row=>keys.map(key=>row[key]))].map(row=>row.map(escape).join(',')).join('\r\n');
}
/**
 * score = 각 숫자 필드 × 가중치의 합. 점수 내림차순으로 새 배열을 반환한다.
 * 예: {quality:2,cost:-1}이면 품질*2-비용. 단위/정규화/가중치는 업무 합의 대상이다.
 * 동점이면 입력 순서를 유지한다. 이것은 합의된 점수 계산이지 객관적 최적해는 아니다.
 */
export function rankRows(rows,weights) {
 for(const weight of Object.values(weights))if(!Number.isFinite(weight))throw new Error('Invalid CSV or numeric input');
 return rows.map(row=>{
  let score=0;
  for(const [key,weight]of Object.entries(weights)){
   if(typeof row[key]!=='number'||!Number.isFinite(row[key]))throw new Error('Numeric field required: '+key);
   score+=row[key]*weight;
  }
  if(!Number.isFinite(score))throw new Error('Invalid CSV or numeric input');
  return {...row,score};
 }).sort((a,b)=>b.score-a.score);
}
