export function parseCSV(text) {
 text=text.replace(/^\uFEFF/,'');
 if(!text.trim())return [];
 const rows=[];let row=[],field='',quoted=false,closed=false;
 function cell(){row.push(field);field='';closed=false;}
 function line(){cell();rows.push(row);row=[];}
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;}}else field+=c;continue;}
  if(c==='"'){if(field || closed)throw new Error('Invalid CSV or numeric input');quoted=true;}
  else if(c===',')cell();
  else if(c==='\r'||c==='\n'){if(c==='\r'&&text[i+1]==='\n')i++;line();}
  else {if(closed)throw new Error('Invalid CSV or numeric input');field+=c;}
 }
 if(quoted)throw new Error('Invalid CSV or numeric input');
 if(field || row.length || closed)line();
 const headers=rows.shift();
 if(headers.some(x=>!x)||new Set(headers).size!==headers.length)throw new Error('Invalid CSV or numeric input');
 return rows.map(values=>{
  if(values.length!==headers.length)throw new Error('Invalid CSV or numeric input');
  return Object.fromEntries(headers.map((key,i)=>[key,values[i]]));
 });
}
export function toCSV(rows,{spreadsheetSafe=false}={}) {
 if(!rows.length)return '';
 const keys=Object.keys(rows[0]);
 function escape(value){
  let s=String(value??'');
  if(spreadsheetSafe && /^[=+\-@\t\r]/.test(s))s="'"+s;
  return '"'+s.replaceAll('"','""')+'"';
 }
 return [keys,...rows.map(row=>keys.map(key=>row[key]))].map(row=>row.map(escape).join(',')).join('\r\n');
}
export function rankRows(rows,weights) {
 for(const weight of Object.values(weights))if(!Number.isFinite(weight))throw new Error('Invalid CSV or numeric input');
 return rows.map(row=>{
  let score=0;
  for(const [key,weight]of Object.entries(weights)){
   if(typeof row[key]!=='number'||!Number.isFinite(row[key]))throw new Error('Numeric field required: '+key);
   score+=row[key]*weight;
  }
  if(!Number.isFinite(score))throw new Error('Invalid CSV or numeric input');
  return {...row,score};
 }).sort((a,b)=>b.score-a.score);
}
