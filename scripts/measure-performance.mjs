import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const base = process.env.PERF_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
const vitals = await readFile('node_modules/web-vitals/dist/web-vitals.iife.js', 'utf8');
for (const device of ['desktop', 'mobile']) {
 for (const route of ['/', '/resume', '/contact', '/projects', '/testimonials']) {
  for (let run = 1; run <= 2; run++) {
   const context = await browser.newContext({ viewport: device === 'mobile' ? { width:390,height:844 } : { width:1440,height:900 }, isMobile:device==='mobile', deviceScaleFactor:1 });
   const page = await context.newPage();
   const metrics = {};
   await page.exposeBinding('recordVital', (_, m) => { metrics[m.name] = m.value; });
   await page.addInitScript({content: vitals + ';webVitals.onLCP(m=>window.recordVital(m),{reportAllChanges:true});webVitals.onCLS(m=>window.recordVital(m),{reportAllChanges:true});webVitals.onINP(m=>window.recordVital(m),{reportAllChanges:true});'});
   // Deterministic network fixtures: backend availability is tested separately.
   await page.route('https://portfolio-back-r1hd.onrender.com/**', r => r.fulfill({ contentType:'application/json', body:'[]' }));
   const cdp = await context.newCDPSession(page);
   await cdp.send('Network.enable');
   if(device==='mobile') {
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
   }
   await page.goto(base + route, {waitUntil:'domcontentloaded'});
   await page.locator('h1,h2').first().waitFor();
   await page.waitForTimeout(3500);
   const resources = await page.evaluate(()=>({ requests:performance.getEntriesByType('resource').length, bytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0), fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime }));
   await page.getByRole('button',{name:'Open menu'}).click();
   await page.waitForTimeout(150);
   await page.keyboard.press('Escape');
   await page.waitForTimeout(150);
   await page.goto('about:blank');
   await page.waitForTimeout(50);
   results.push({device,route,run,...metrics,...resources});
   console.log(JSON.stringify(results.at(-1)));
   await context.close();
  }
 }
}
await browser.close();
await mkdir('artifacts',{recursive:true});
await writeFile(process.env.PERF_OUTPUT || 'artifacts/performance-after.json',JSON.stringify({date:new Date().toISOString(),base,notes:'Local production build; Chrome; cold contexts; 2 samples; mobile 4x CPU/150ms/1.6Mbps. Empty API fixtures. INP from menu click and Escape; lab only, not field p75.',results},null,2));
