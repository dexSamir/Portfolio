import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();const page=await context.newPage();
const errors=[];const responses=[];
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('response',r=>{if(r.url().includes('/api/'))responses.push({url:new URL(r.url()).pathname,status:r.status()});});
await page.goto('http://127.0.0.1:4175/projects',{waitUntil:'domcontentloaded'});
try {await page.waitForFunction(()=>document.querySelector('main')?.textContent?.trim(),{},{timeout:50000});}catch{}
const result={origin:'http://127.0.0.1:4175',responses,errors,heading:await page.locator('main h1,main h2').allTextContents(),projectCards:await page.locator('main h3').count(),alert:await page.getByRole('alert').allTextContents()};
await writeFile('artifacts/live-browser.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();
