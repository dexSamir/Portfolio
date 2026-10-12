import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];await mkdir('artifacts/screenshots',{recursive:true});
const csp=(await readFile('public/_headers','utf8')).split('\n').find(l=>l.includes('Content-Security-Policy:')).split('Content-Security-Policy: ')[1];
for(const width of [1440,768,390]) {
 const context=await browser.newContext({viewport:{width,height:900}});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('http://127.0.0.1:4175/**',async route=>{const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),'content-security-policy':csp}});});
 await page.goto('http://127.0.0.1:4175/');await page.waitForTimeout(2500);
 await page.screenshot({path:`artifacts/screenshots/home-${width}.png`,fullPage:true});
 results.push({width,check:'home with configured CSP',errors,image:await page.locator('img').evaluate(img=>({loaded:img.complete&&img.naturalWidth>0,width:img.naturalWidth}))});
 await page.addInitScript(()=>localStorage.setItem('vite-ui-theme','light'));
 for(const route of ['/','/resume','/contact']) {
  await page.goto('http://127.0.0.1:4175'+route);await page.waitForTimeout(1800);
  const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  results.push({width,check:'light '+route,violations:a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});
 }
 await context.close();
}
const page=await browser.newPage();await page.goto('http://127.0.0.1:4175/projects');await page.waitForTimeout(3000);
results.push({check:'live browser from localhost',text:await page.locator('main').innerText()});
await browser.close();await writeFile('artifacts/extra-checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
