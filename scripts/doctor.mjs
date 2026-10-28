import {spawnSync} from 'node:child_process';
console.log('Node '+process.version+'; platform '+process.platform);
for(const [cmd,args]of [['git',['--version']],['codex',['--version']],['codex',['plugin','--help']]]){
 const result=spawnSync(cmd,args,{encoding:'utf8',timeout:15000,windowsHide:true});
 console.log('\n$ '+cmd+' '+args.join(' '));
 console.log(result.error?result.error.message:(result.stdout+result.stderr).trim());
}
console.log('\nNo credentials read. Manually check preview port, allowed stack, network and deadline.');
