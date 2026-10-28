import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('bootstrap copies executable app and refuses existing files without changing them',async()=>{
 const dir=await fs.mkdtemp(path.join(tmpdir(),'h-bootstrap-'));
 const script=path.join(root,'scripts/bootstrap.mjs');
 const run=()=>spawnSync(process.execPath,[script,dir,'--web'],{encoding:'utf8'});
 try{
  assert.equal(run().status,0);
  assert.equal(JSON.parse(await fs.readFile(path.join(dir,'web-app/package.json'),'utf8')).type,'module');
  const before=await fs.readFile(path.join(dir,'AGENTS.md'),'utf8');
  assert.equal(run().status,1);
  assert.equal(await fs.readFile(path.join(dir,'AGENTS.md'),'utf8'),before);
  const tests=spawnSync(process.execPath,['--test','tests/*.test.mjs'],{cwd:path.join(dir,'web-app'),encoding:'utf8'});
  assert.equal(tests.status,0,tests.stdout+tests.stderr);
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
test('manual skill copy preserves references and license, refuses overwrite',async()=>{
 const dir=await fs.mkdtemp(path.join(tmpdir(),'h-skills-'));
 try{
  const src=path.join(dir,'package'),project=path.join(dir,'project');
  await fs.mkdir(path.join(src,'skills/demo'),{recursive:true});
  await fs.writeFile(path.join(src,'skills/demo/SKILL.md'),'---\nname: demo\ndescription: Test skill\n---\n');
  await fs.writeFile(path.join(src,'LICENSE'),'Example license');
  await fs.writeFile(path.join(src,'auth.json'),'must not copy');
  const run=()=>spawnSync(process.execPath,[path.join(root,'scripts/copy-skills.mjs'),src,project,'demo'],{encoding:'utf8'});
  assert.equal(run().status,0);
  assert.equal(await fs.readFile(path.join(project,'.agents/skills/demo/LICENSE'),'utf8'),'Example license');
  await assert.rejects(fs.access(path.join(project,'.agents/skills/demo/auth.json')));
  assert.equal(run().status,1);
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});

test('UTF-8 Korean survives toolkit files and browser source',async()=>{
 const read=p=>fs.readFile(path.join(root,p),'utf8');
 assert.ok((await read('README.md')).includes('해커톤 현장 툴킷'));
 assert.ok((await read('AGENTS.md')).includes('현장 공지 기준'));
 assert.ok((await read('boilerplates/web-workbench/public/index.html')).includes('업무 요청 관리'));
 assert.ok((await read('boilerplates/web-workbench/domain.mjs')).includes('객체를 입력하세요.'));
});
