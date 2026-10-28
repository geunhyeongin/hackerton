/**
 * 요청 흐름: URL/메서드 확인 → JSON 읽기 → domain 검증 → store 저장 → JSON 응답.
 * 실행: node server.mjs. 테스트에서는 createServer({dataFile})로 임시 저장 경로를 넣는다.
 * 인증 없는 단일 사용자 연습 앱이다. 업무 규칙은 domain.mjs에서 변경한다.
 */
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {createStore} from './store.mjs';
import {validateItem,selectItems,summarize} from './domain.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
// 이 목록의 파일만 브라우저에 제공한다. 서버 소스와 data 폴더를 공개하지 않는다.
const staticFiles={'/':['index.html','text/html'],'/app.js':['app.js','text/javascript'],'/style.css':['style.css','text/css']};
function fail(message,status=400){return Object.assign(new Error(message),{status});}
// 요청을 최대 1MB까지만 모은다. 한글/이모지가 청크 경계에서 잘릴 수 있어
// Buffer를 합친 뒤 UTF-8 문자열로 한 번만 변환하고 JSON으로 읽는다.
async function body(req) {
  const chunks=[];let bytes=0;
  for await(const chunk of req) {
    bytes+=chunk.length;
    if(bytes>1024*1024) throw fail('입력 상한은 1MB입니다.',413);
    chunks.push(chunk);
  }
  try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw fail('JSON 형식을 확인하세요.');}
}
// 서버 생성과 listen을 분리하면 테스트가 빈 포트와 임시 데이터로 독립 실행할 수 있다.
export function createServer({dataFile=path.join(root,'data/items.json')}={}) {
 const store=createStore(dataFile);
 return http.createServer(async(req,res)=>{
  function json(status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
  try {
   const url=new URL(req.url,'http://localhost');
   // 다른 웹페이지의 브라우저 요청을 제한한다. 사용자 인증을 대신하는 검사는 아니다.
   if(req.headers.origin && req.headers.origin!== 'http://'+req.headers.host && req.headers.origin!=='https://'+req.headers.host) throw fail('다른 출처의 요청은 허용하지 않습니다.',403);
   if(url.pathname==='/api/health' && req.method==='GET') return json(200,{ok:true});
   if(url.pathname==='/api/items' && req.method==='GET') return json(200,selectItems(await store.read(),Object.fromEntries(url.searchParams)));
   if(url.pathname==='/api/summary' && req.method==='GET') return json(200,summarize(await store.read()));
   // 등록: 검증된 필드에 서버 생성 ID를 붙인다. 저장 완료 전에는 성공을 응답하지 않는다.
   if(url.pathname==='/api/items' && req.method==='POST') {
    const item={id:randomUUID(),...validateItem(await body(req))};
    await store.change(rows=>{rows.push(item);});
    return json(201,item);
   }
   // PATCH/DELETE: URL에서 ID를 찾고, 큐 안에서 현재 항목을 읽어 수정한다.
   const match=url.pathname.match(/^\/api\/items\/([a-zA-Z0-9-]+)$/);
   if(match && ['PATCH','DELETE'].includes(req.method)) {
    const input=req.method==='PATCH'?await body(req):null;
    if(req.method==='PATCH' && (!input || typeof input!=='object' || Array.isArray(input)))throw fail('객체를 입력하세요.');
    const result=await store.change(rows=>{
     const index=rows.findIndex(x=>x.id===match[1]);
     if(index===-1) throw fail('항목이 없습니다.',404);
     if(req.method==='DELETE') return rows.splice(index,1)[0];
     // 부분 수정값을 기존 값과 합친 뒤 전체 규칙을 다시 검증한다. ID는 변경하지 않는다.
     rows[index]={id:rows[index].id,...validateItem({...rows[index],...input})};
     return rows[index];
    });
    return json(200,result);
   }
   if(url.pathname==='/api/import' && req.method==='POST') {
    const input=await body(req);
    if(!Array.isArray(input)||input.length>1000) throw fail('최대 1000개 배열을 입력하세요.');
    // 먼저 모든 행을 검증한다. 한 행이 틀리면 저장을 시작하지 않아 부분 반영을 막는다.
    // 가져오기는 추가 방식이며 ID를 새로 부여한다. 같은 파일 재업로드는 중복을 만든다.
    const items=input.map(x=>({id:randomUUID(),...validateItem(x)}));
    await store.change(rows=>{rows.push(...items);});
    return json(201,{imported:items.length});
   }
   const asset=staticFiles[url.pathname];
   if(req.method==='GET' && asset) {
    const data=await readFile(path.join(root,'public',asset[0]));
    res.writeHead(200,{'Content-Type':asset[1]+'; charset=utf-8','X-Content-Type-Options':'nosniff'});return res.end(data);
   }
   return json(404,{error:'경로 또는 메서드를 확인하세요.'});
  } catch(error) {
   // 검증 오류만 클라이언트에 노출한다. 저장 실패의 경로·내부 정보는 숨긴다.
   const status=error.status || 500;
   if(status===500) console.error('Storage/server failure:',error.code || error.name);
   return json(status,{error:status===500?'서버 저장/처리에 실패했습니다. 터미널을 확인하세요.':error.message});
  }
 });
}
// 직접 실행할 때만 포트를 연다. import하는 테스트에서는 자동 실행하지 않는다.
// 원격 IDE 미리보기는 0.0.0.0 바인딩과 해당 포트 공개가 필요하다.
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const port=Number(process.env.PORT || 3000);
 const server=createServer({dataFile:process.env.DATA_FILE || undefined});
 server.on('error',error=>{console.error(error.message);process.exitCode=1;});
 server.listen(port,process.env.HOST || '0.0.0.0',()=>console.log('Open preview port '+port+' or http://localhost:'+port));
}
