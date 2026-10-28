// 오프라인 대안: 패키지 전체를 복사해 상대경로 참조와 LICENSE를 보존한다.
// 스킬 문서 배치만 수행한다. hooks/MCP/브라우저 실행 도구를 설치하는 것은 아니다.
// 기존 대상은 덮어쓰지 않는다. 새 세션에서 인식 여부를 확인해야 한다.
// Instruction-only fallback. Preserve package-relative references and license.
import fs from 'node:fs';
import path from 'node:path';
const [source,target,prefix]=process.argv.slice(2);
if(!source||!target||!prefix||!/^[a-z0-9-]+$/.test(prefix))throw new Error('Usage: node copy-skills.mjs PACKAGE PROJECT PREFIX');
const src=path.resolve(source),dest=path.resolve(target,'.agents/skills',prefix);
if(!fs.statSync(path.join(src,'skills')).isDirectory())throw new Error('PACKAGE/skills is required.');
if(!fs.existsSync(path.join(src,'LICENSE')))throw new Error('Package LICENSE is required.');
if(dest===src||dest.startsWith(src+path.sep))throw new Error('Destination cannot be inside source.');
if(fs.existsSync(dest))throw new Error('Existing path preserved: '+dest);
fs.cpSync(src,dest,{recursive:true,filter:p=>!['.git','node_modules','auth.json','.env'].includes(path.basename(p))});
console.log('Copied package to '+dest+'. Start a NEW session; if undiscovered, ask Codex to read the required SKILL.md directly. This does not install runtime/hooks/MCP.');
