// 현장 초기화: 기본 규칙·스킬·가이드와 선택한 웹 소스를 새 프로젝트에 복사한다.
// 먼저 전체 대상의 중복 여부를 확인한다. 기존 파일이 하나라도 있으면 복사를 시작하지 않는다.
// --web이면 web-app 폴더를 만들고, 가이드/프롬프트는 hackathon-notes에 함께 둔다.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2),target=args.find(x=>!x.startsWith('--'));
if(!target){console.error('Usage: node scripts/bootstrap.mjs TARGET [--web]');process.exit(1);}
const dest=path.resolve(target),files=[];
function gather(from,to){
 const stat=fs.lstatSync(from);
 if(stat.isSymbolicLink())throw new Error('Symlink refused: '+from);
 if(stat.isDirectory()){for(const name of fs.readdirSync(from)){if(['.git','node_modules','data'].includes(name))continue;gather(path.join(from,name),path.join(to,name));}}
 else files.push([from,to]);
}
for(const name of ['AGENTS.md','HANDOFF-RULES.md'])gather(path.join(root,name),path.join(dest,name));
gather(path.join(root,'skills'),path.join(dest,'.agents/skills'));
gather(path.join(root,'templates'),path.join(dest,'hackathon-notes/templates'));
for(const name of ['guides','prompts'])gather(path.join(root,name),path.join(dest,'hackathon-notes',name));
if(args.includes('--web'))gather(path.join(root,'boilerplates/web-workbench'),path.join(dest,'web-app'));
for(const [,to]of files)if(fs.existsSync(to))throw new Error('Existing file; nothing copied: '+to);
for(const [from,to]of files){fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to,fs.constants.COPYFILE_EXCL);}
console.log('Copied '+files.length+' files to '+dest+'. Start a NEW Codex session here.');
