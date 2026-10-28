// 읽기 전용 환경 진단. 버전과 CLI 지원 여부만 확인하고 인증 파일/키는 읽지 않는다.
// 설치나 설정 변경은 하지 않는다. 명령이 없으면 오류를 보여주고 다음 항목을 확인한다.
import {spawnSync} from 'node:child_process';
console.log('Node '+process.version+'; platform '+process.platform);
for(const [cmd,args]of [['git',['--version']],['codex',['--version']],['codex',['plugin','--help']]]){
 const result=spawnSync(cmd,args,{encoding:'utf8',timeout:15000,windowsHide:true});
 console.log('\n$ '+cmd+' '+args.join(' '));
 console.log(result.error?result.error.message:(result.stdout+result.stderr).trim());
}
console.log('\nNo credentials read. Manually check preview port, allowed stack, network and deadline.');
