/**
 * 업무 규칙을 바꿀 때 가장 먼저 읽을 파일.
 * 입력 정리·검증과 검색·집계를 담당한다. HTTP나 파일 저장에는 의존하지 않는다.
 * 예제 필드는 title(제목), value(수치), status(open/done)다.
 * 현장 변경: 이 파일의 규칙 → 테스트 → 서버 계약 → 화면 순서로 함께 고친다.
 */
const invalid=message=>Object.assign(new Error(message),{status:400});
// 현장 교체 지점: 필드, 허용 상태, 판정과 집계 규칙.
/**
 * 입력 객체에서 허용한 필드만 꺼내 정규화된 새 객체를 반환한다.
 * 실패하면 status=400 오류를 던져 서버가 입력 오류로 응답하게 한다.
 * 기본값은 undefined에만 적용된다. 0은 유효한 값이며 문자열 "2"는 거부한다.
 */
export function validateItem(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw invalid('객체를 입력하세요.');
  const {title, value = 0, status = 'open'} = input;
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 200) throw invalid('제목은 1~200자입니다.');
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1e12) throw invalid('값은 0~1조 사이 숫자입니다.');
  if (!['open','done'].includes(status)) throw invalid('상태는 open 또는 done입니다.');
  return {title:title.trim(), value, status};
}
// 원본 배열을 변경하지 않고 제목 부분 검색과 상태 필터를 동시에 적용한다.
export function selectItems(items, {q='',status=''}={}) {
  return items.filter(item => item.title.toLowerCase().includes(q.toLowerCase()) && (!status || item.status === status));
}
// 전체 배열을 집계한다. 필터 기준 집계가 필요하면 필터한 배열을 전달한다.
export function summarize(items) {
  return {total:items.length, open:items.filter(x=>x.status==='open').length,
    done:items.filter(x=>x.status==='done').length, value:items.reduce((n,x)=>n+x.value,0)};
}
