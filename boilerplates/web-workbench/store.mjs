import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {dirname} from 'node:path';
import {randomUUID} from 'node:crypto';
/**
 * 단일 프로세스·소량 데이터용 JSON 저장소.
 * read(): 앞선 저장이 끝난 뒤 배열을 읽는다.
 * change(fn): 배열을 읽어 동기 함수 fn으로 변경하고, 저장 성공 후 fn의 결과를 반환한다.
 * 큐는 이 저장소 인스턴스 안에서만 유효하다. 여러 서버/프로세스의 동시 쓰기는 보호하지 않는다.
 */
// 큐 하나로 읽기-수정-저장을 직렬화한다. 실패하면 원본 파일을 보존한다.
export function createStore(file) {
  let queue=Promise.resolve();
  async function read() {
    try {
      const rows=JSON.parse(await readFile(file,'utf8'));
      if (!Array.isArray(rows)) throw new Error('저장 파일이 배열이 아닙니다.');
      return rows;
    // 파일이 아직 없을 때만 빈 목록이다. 손상/권한 오류를 빈 데이터로 숨기면 안 된다.
    } catch(error) { if(error.code==='ENOENT') return []; throw error; }
  }
  return {
    read:()=>queue.then(read),
    change(fn) {
      // 읽기→수정→저장 전체를 한 작업으로 묶어 동시 등록의 덮어쓰기를 줄인다.
      const task=queue.then(async()=>{
        const rows=await read();
        const result=fn(rows);
        await mkdir(dirname(file),{recursive:true});
        // 원본에 바로 쓰지 않고 임시 파일 완성 후 교체한다. DB 트랜잭션/백업은 아니다.
        const temp=file+'.'+randomUUID()+'.tmp';
        await writeFile(temp,JSON.stringify(rows,null,2),'utf8');
        await rename(temp,file);
        return result;
      });
      // 현재 요청에는 실패를 전달하되, 실패한 Promise 때문에 다음 작업까지 막지 않는다.
      queue=task.catch(()=>{});
      return task;
    }
  };
}
