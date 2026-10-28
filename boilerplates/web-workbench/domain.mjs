const invalid=message=>Object.assign(new Error(message),{status:400});
// 현장 교체 지점: 필드, 허용 상태, 판정과 집계 규칙.
export function validateItem(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw invalid('객체를 입력하세요.');
  const {title, value = 0, status = 'open'} = input;
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 200) throw invalid('제목은 1~200자입니다.');
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1e12) throw invalid('값은 0~1조 사이 숫자입니다.');
  if (!['open','done'].includes(status)) throw invalid('상태는 open 또는 done입니다.');
  return {title:title.trim(), value, status};
}
export function selectItems(items, {q='',status=''}={}) {
  return items.filter(item => item.title.toLowerCase().includes(q.toLowerCase()) && (!status || item.status === status));
}
export function summarize(items) {
  return {total:items.length, open:items.filter(x=>x.status==='open').length,
    done:items.filter(x=>x.status==='done').length, value:items.reduce((n,x)=>n+x.value,0)};
}
