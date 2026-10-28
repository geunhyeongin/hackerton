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
