import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {dirname} from 'node:path';
import {randomUUID} from 'node:crypto';
// 큐 하나로 읽기-수정-저장을 직렬화한다. 실패하면 원본 파일을 보존한다.
export function createStore(file) {
  let queue=Promise.resolve();
  async function read() {
    try {
      const rows=JSON.parse(await readFile(file,'utf8'));
      if (!Array.isArray(rows)) throw new Error('저장 파일이 배열이 아닙니다.');
      return rows;
    } catch(error) { if(error.code==='ENOENT') return []; throw error; }
  }
  return {
    read:()=>queue.then(read),
    change(fn) {
      const task=queue.then(async()=>{
        const rows=await read();
        const result=fn(rows);
        await mkdir(dirname(file),{recursive:true});
        const temp=file+'.'+randomUUID()+'.tmp';
        await writeFile(temp,JSON.stringify(rows,null,2),'utf8');
        await rename(temp,file);
        return result;
      });
      queue=task.catch(()=>{});
      return task;
    }
  };
}
