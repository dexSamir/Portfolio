import type { Page } from '@playwright/test';
export const technology={id:'tech-1',name:'React'};
export const project={id:'project-1',title:'Example Project',description:'A tested portfolio project.',imageUrl:'/placeholder.svg',githubUrl:'https://github.com/example/repo',liveUrl:'https://example.com',technologies:[technology]};
export const testimonial={id:'review-1',fullName:'Test Reviewer',position:'Engineer',company:'Example',message:'Great collaboration. '.repeat(20),rating:5,status:'approved'};
export async function authenticate(page:Page) { await page.addInitScript(()=>sessionStorage.setItem('portfolio_jwt_token',`e30.${btoa(JSON.stringify({exp:Date.now()/1000+3600}))}.signature`)); }
export async function apiFixtures(page:Page) {
 await page.route('https://portfolio-back-r1hd.onrender.com/**',async route=>{
  const p=new URL(route.request().url()).pathname;const method=route.request().method();
  let data:unknown=[];
  if(p.endsWith('/auth/login')) data={token:`e30.${btoa(JSON.stringify({exp:Date.now()/1000+3600}))}.signature`};
  else if(p.includes('/Projects/')) data=method==='GET'?(p.includes('GetById')?project:[project]):project;
  else if(p.includes('/Technologies/')) data=method==='GET'?[technology]:technology;
  else if(p.includes('/Testimonials/')) data=method==='GET'?[testimonial,{...testimonial,id:'pending-1',status:'pending',fullName:'Pending Reviewer'}].filter(t=>!p.includes('GetApproved')||t.status==='approved'):testimonial;
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
 });
}
