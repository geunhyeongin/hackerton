// 별도 터미널에서 실행한다. 인자가 없으면 목록만 조회하며 설치하지 않는다.
// 실제 목록에서 확인한 name@marketplaceName만 설치해 잘못된 패키지 추측을 막는다.
// 셸 문자열을 실행하지 않고 인자 배열로 CLI를 호출한다. 설치 후 새 세션이 필요하다.
// Run in a terminal, not in the Codex chat input.
import {spawnSync} from 'node:child_process';
const executable=process.env.CODEX_BIN || 'codex';
function run(args){const r=spawnSync(executable,args,{encoding:'utf8',timeout:120000,windowsHide:true});if(r.error || r.status!==0)throw new Error(r.error?.message || r.stderr || r.stdout);return r.stdout;}
try{
 run(['plugin','--help']);
 const result=JSON.parse(run(['plugin','list','--available','--json']));
 const candidates=[...(result.available||[]),...(result.installed||[])].filter(x=>x.marketplaceName && /superpowers|gstack/i.test(x.name||''));
 const unique=[...new Map(candidates.map(x=>[x.name+'@'+x.marketplaceName,x])).values()];
 for(const row of unique)console.log(row.name+'@'+row.marketplaceName+' installed='+Boolean(row.installed));
 const requested=process.argv.slice(2);
 if(!requested.length){console.log('Read-only. Run again with exact NAME@MARKETPLACE identifiers from this list.');process.exit(0);}
 for(const id of requested){
  if(!unique.some(x=>x.name+'@'+x.marketplaceName===id))throw new Error('Identifier not in marketplace list: '+id);
  console.log(run(['plugin','add',id,'--json']));
 }
 console.log('Start a NEW Codex session to verify installed skills.');
}catch(error){console.error(error.message);console.error('See guides/plugins.md for unsupported CLI and manual skill fallback.');process.exitCode=1;}
