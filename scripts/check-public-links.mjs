import { readFile, writeFile } from 'node:fs/promises';
const api=process.env.VITE_API_BASE_URL || 'https://portfolio-back-r1hd.onrender.com';
const response=await fetch(api+'/api/Projects/GetAll',{signal:AbortSignal.timeout(45000)});
if(!response.ok)throw new Error(`API ${response.status}`);
const projects=await response.json();
const source=await readFile('src/components/social-links.tsx','utf8');
const urls=[...new Set([...projects.flatMap(p=>[p.githubUrl,p.liveUrl,p.imageUrl]),...Array.from(source.matchAll(/(?:url: )"(https:[^"]+)"/g),m=>m[1])].filter(u=>typeof u==='string'&&u.startsWith('https://')))];
const result=[];while(urls.length){await Promise.all(urls.splice(0,4).map(async url=>{try{const r=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(12000),redirect:'follow'});result.push({url,status:r.status});}catch(e){result.push({url,status:null,error:e.message});}}));}
await writeFile('artifacts/public-link-checks.json',JSON.stringify({method:'Read-only HEAD requests; anti-bot restrictions and timeouts are inconclusive.',result},null,2));console.log(result.map(x=>({origin:new URL(x.url).origin,status:x.status,error:x.error})));
