/**
 * 서버에서 외부 JSON API를 부를 때 선택해서 연결하는 도구.
 * 성공: {source:'live',data}. 실패: fallback이 있으면 {source:'fallback',data,error},
 * 없으면 오류를 던진다. 화면은 fallback 결과를 실제 응답과 구분해 표시해야 한다.
 * 기본 제한시간은 5초이며 자동 재시도는 없다. 인증 키는 환경변수로 받아 서버에만 둔다.
 */
export async function fetchJSON(url,{timeoutMs=5000,fallback,fetchImpl=fetch,...options}={}) {
 // AbortController로 지연된 실제 fetch를 중단한다. 주입한 fetchImpl도 signal을 따라야 한다.
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(new Error('External call timed out')),timeoutMs);
 try{
  const response=await fetchImpl(url,{...options,signal:controller.signal});
  if(!response.ok)throw new Error('External HTTP '+response.status);
  return {source:'live',data:await response.json()};
 }catch(error){
  if(fallback===undefined)throw error;
  return {source:'fallback',data:structuredClone(fallback),error:error.message};
 // 성공/실패 여부와 관계없이 타이머를 정리한다.
 }finally{clearTimeout(timer);}
}
