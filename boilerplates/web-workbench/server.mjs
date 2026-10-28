import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {createStore} from './store.mjs';
import {validateItem,selectItems,summarize} from './domain.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const staticFiles={'/':['index.html','text/html'],'/app.js':['app.js','text/javascript'],'/style.css':['style.css','text/css']};
function fail(message,status=400){return Object.assign(new Error(message),{status});}
async function body(req) {
  const chunks=[];let bytes=0;
  for await(const chunk of req) {
    bytes+=chunk.length;
    if(bytes>1024*1024) throw fail('입력 상한은 1MB입니다.',413);
    chunks.push(chunk);
  }
  try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw fail('JSON 형식을 확인하세요.');}
}
export function createServer({dataFile=path.join(root,'data/items.json')}={}) {
 const store=createStore(dataFile);
 return http.createServer(async(req,res)=>{
  function json(status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
  try {
   const url=new URL(req.url,'http://localhost');
   if(req.headers.origin && req.headers.origin!== 'http://'+req.headers.host && req.headers.origin!=='https://'+req.headers.host) throw fail('다른 출처의 요청은 허용하지 않습니다.',403);
   if(url.pathname==='/api/health' && req.method==='GET') return json(200,{ok:true});
   if(url.pathname==='/api/items' && req.method==='GET') return json(200,selectItems(await store.read(),Object.fromEntries(url.searchParams)));
   if(url.pathname==='/api/summary' && req.method==='GET') return json(200,summarize(await store.read()));
   if(url.pathname==='/api/items' && req.method==='POST') {
    const item={id:randomUUID(),...validateItem(await body(req))};
    await store.change(rows=>{rows.push(item);});
    return json(201,item);
   }
   const match=url.pathname.match(/^\/api\/items\/([a-zA-Z0-9-]+)$/);
   if(match && ['PATCH','DELETE'].includes(req.method)) {
    const input=req.method==='PATCH'?await body(req):null;
    if(req.method==='PATCH' && (!input || typeof input!=='object' || Array.isArray(input)))throw fail('객체를 입력하세요.');
    const result=await store.change(rows=>{
     const index=rows.findIndex(x=>x.id===match[1]);
     if(index===-1) throw fail('항목이 없습니다.',404);
     if(req.method==='DELETE') return rows.splice(index,1)[0];
     rows[index]={id:rows[index].id,...validateItem({...rows[index],...input})};
     return rows[index];
    });
    return json(200,result);
   }
   if(url.pathname==='/api/import' && req.method==='POST') {
    const input=await body(req);
    if(!Array.isArray(input)||input.length>1000) throw fail('최대 1000개 배열을 입력하세요.');
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
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const port=Number(process.env.PORT || 3000);
 const server=createServer({dataFile:process.env.DATA_FILE || undefined});
 server.on('error',error=>{console.error(error.message);process.exitCode=1;});
 server.listen(port,process.env.HOST || '0.0.0.0',()=>console.log('Open preview port '+port+' or http://localhost:'+port));
}
