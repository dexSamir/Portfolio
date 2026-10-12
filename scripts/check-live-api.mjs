import { writeFile, mkdir } from 'node:fs/promises';
const origin=process.env.VITE_API_BASE_URL || 'https://portfolio-back-r1hd.onrender.com';
const paths=['/api/Projects/GetAll','/api/Technologies/GetAll','/api/Testimonials/GetApproved','/api/Testimonials/GetAll','/api/Testimonials/GetByStatus/pending','/swagger/v1/swagger.json'];
const results=await Promise.all(paths.map(async path=>{
 const start=performance.now();
 try {
  const r=await fetch(origin+path,{signal:AbortSignal.timeout(45000),headers:{Origin:'https://portfolio-audit.example'}});
  const text=await r.text();let data;try{data=JSON.parse(text);}catch{}
  const result={path,status:r.status,ms:Math.round(performance.now()-start),contentType:r.headers.get('content-type'),cors:r.headers.get('access-control-allow-origin'),count:Array.isArray(data)?data.length:undefined,keys:Array.isArray(data)&&data[0]?Object.keys(data[0]):undefined};
  if(path.includes('swagger') && data?.paths) result.endpoints=Object.fromEntries(Object.entries(data.paths).map(([p,methods])=>[p,Object.keys(methods)]));
  return result;
 } catch(e){return {path,status:null,ms:Math.round(performance.now()-start),error:e.message};}
}));
await mkdir('artifacts',{recursive:true});await writeFile('artifacts/live-api.json',JSON.stringify({date:new Date().toISOString(),origin,method:'Unauthenticated read-only GETs; no mutations',results},null,2));console.log(JSON.stringify(results,null,2));
