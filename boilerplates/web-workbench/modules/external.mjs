// Server-only. Keep keys in environment variables; never send them to the browser.
export async function fetchJSON(url,{timeoutMs=5000,fallback,fetchImpl=fetch,...options}={}) {
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(new Error('External call timed out')),timeoutMs);
 try{
  const response=await fetchImpl(url,{...options,signal:controller.signal});
  if(!response.ok)throw new Error('External HTTP '+response.status);
  return {source:'live',data:await response.json()};
 }catch(error){
  if(fallback===undefined)throw error;
  return {source:'fallback',data:structuredClone(fallback),error:error.message};
 }finally{clearTimeout(timer);}
}
