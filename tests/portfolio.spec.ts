import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { apiFixtures, authenticate, project, testimonial } from './fixtures';
test.beforeEach(async({page})=>{await apiFixtures(page);});
for(const path of ['/','/projects','/resume','/contact','/testimonials','/login','/403','/not-a-page']) {
 test(`route ${path}: refresh, console, images, semantics, accessibility`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const response = await page.goto(path);expect(response?.status()).toBe(path === '/not-a-page' ? 404 : 200);await expect(page.locator('h1').first()).toBeVisible();
  await page.waitForTimeout(2100);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  expect(await page.locator('img').evaluateAll(imgs=>imgs.every(img=>img.hasAttribute('alt') && (!img.getClientRects().length || (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth>0)))).toBe(true);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.reload();await expect(page.locator('h1').first()).toBeVisible();expect(errors).toEqual([]);
 });
}
test('CV downloads on both pages match the committed PDF',async({page})=>{
 const original=await readFile('public/imgs/resume/Samir_Habibov_CV.pdf');
 for(const path of ['/','/resume']) {await page.goto(path);const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:'Download CV'}).click()]);expect(await readFile((await download.path())!)).toEqual(original);}
});
test('menu traps focus, closes on Escape, and navigates',async({page})=>{
 await page.goto('/');const trigger=page.getByRole('button',{name:'Open menu'});await trigger.click();await expect(page.getByRole('button',{name:'Close menu'})).toBeFocused();await page.keyboard.press('Shift+Tab');await expect(page.getByRole('link',{name:'Testimonials',exact:true})).toBeFocused();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await trigger.click();await page.getByRole('link',{name:'Resume',exact:true}).click();await expect(page).toHaveURL(/\/resume$/);await expect(page.getByRole('heading',{name:'My Resume'})).toBeVisible();
});
test('WhatsApp special characters and unsent draft are preserved',async({page})=>{
 await page.goto('/contact');await page.evaluate(()=>{window.open=(url)=>{(window as unknown as {opened:string}).opened=String(url);return null;};});
 for(const [id,value] of Object.entries({name:'Samir & Test',email:'test@example.com',subject:'A # B?',message:'Salam + & # Azərbaycan'})) await page.locator('#'+id).fill(value);
 await page.getByRole('button',{name:'Send via WhatsApp'}).click();const opened=await page.evaluate(()=>(window as unknown as {opened:string}).opened);expect(new URL(opened).searchParams.get('text')).toContain('Salam + & # Azərbaycan');await expect(page.locator('#message')).toHaveValue('Salam + & # Azərbaycan');
});
test('dynamic failures retry and unsafe links do not render',async({page})=>{
 let calls=0;await page.route('**/api/Projects/GetAll',r=>{calls++;return r.fulfill({status:calls===1?503:200,contentType:'application/json',body:JSON.stringify([{...project,githubUrl:'javascript:alert(1)',liveUrl:'data:text/html,bad'}])});});await page.goto('/projects');await expect(page.getByRole('alert')).toBeVisible();await page.getByRole('button',{name:'Try again'}).click();await expect(page.getByText('Example Project')).toBeVisible();expect(await page.locator('a[href^="javascript:"],a[href^="data:"]').count()).toBe(0);
});
test('testimonial dialog validates upload, submits once, and restores focus',async({page})=>{
 let writes=0;await page.route('**/api/Testimonials/Create',async r=>{writes++;await r.fulfill({contentType:'application/json',body:JSON.stringify(testimonial)});});
 await page.goto('/testimonials');const trigger=page.getByRole('button',{name:'Add Your Testimonial'});await trigger.click();const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
 await page.locator('#profileImage-upload').setInputFiles({name:'bad.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg/>')});await expect(page.getByRole('alert')).toContainText('Choose a JPEG');
 for(const [id,value] of Object.entries({fullName:'Test Person',position:'Engineer',company:'Test',message:'Excellent work'})) await dialog.locator('#'+id).fill(value);
 await dialog.getByRole('button',{name:'Rate 4 out of 5'}).click();await dialog.getByRole('button',{name:'Send',exact:true}).click();await expect(page.getByRole('status')).toContainText('submitted');await expect(dialog).toHaveCount(0);expect(writes).toBe(1);await expect(trigger).toBeFocused();
});
test('admin guard prevents requests without a current session',async({page})=>{
 let privateReads=0;page.on('request',r=>{if(r.url().includes('/GetAll'))privateReads++;});await page.goto('/admin');await expect(page).toHaveURL(/\/login$/);expect(privateReads).toBe(0);
});
test('login toggle and success, admin tabs, backup, edit/create, moderation and logout',async({page})=>{
 await page.goto('/login');await page.getByLabel('Email',{exact:true}).fill('test@example.com');await page.getByLabel('Password',{exact:true}).fill('test-password');await page.getByRole('button',{name:'Show password'}).click();await expect(page.locator('#password')).toHaveAttribute('type','text');await page.getByRole('button',{name:'Login',exact:true}).click();await expect(page).toHaveURL(/\/admin$/);await expect(page.getByRole('heading',{name:'Dashboard',exact:true})).toBeVisible();
 const openTab=async(name:string)=>{if(page.viewportSize()!.width<1024)await page.getByRole('button',{name:'Open admin menu'}).click();await page.getByRole('button',{name,exact:true}).filter({visible:true}).click();};
 await openTab('Projects');await expect(page.getByText('Example Project').filter({visible:true}).first()).toBeVisible();
 await page.getByRole('button',{name:'Edit project',exact:true}).filter({visible:true}).first().click();await expect(page).toHaveURL(/id=project-1/);await expect(page.locator('#title')).toHaveValue('Example Project');
 await page.getByRole('button',{name:'Back to Dashboard'}).click();await openTab('Testimonials');await expect(page.getByText('Test Reviewer').filter({visible:true}).first()).toBeVisible();
 await openTab('Dashboard');const approve=page.getByRole('button',{name:'Approve Pending Reviewer'}).filter({visible:true});await approve.click();
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:/Export/}).first().click()]);expect(download.suggestedFilename()).toBe('portfolio-data.json');
 await openTab('Settings');await page.getByRole('heading',{name:'Profile Settings'}).waitFor();
 if(page.viewportSize()!.width<1024)await page.getByRole('button',{name:'Open admin menu'}).click();await page.getByRole('button',{name:'Logout',exact:true}).filter({visible:true}).click();await expect(page).toHaveURL(/\/login$/);
});
test('admin failure is visible instead of a fake empty dashboard',async({page})=>{
 await authenticate(page);await page.route('**/api/Testimonials/GetAll',r=>r.fulfill({status:503}));await page.goto('/admin');await expect(page.getByRole('alert')).toContainText('Unable to load dashboard');
});
test('admin create forms are accessible',async({page})=>{
 await authenticate(page);
 for(const type of ['project','testimonial']) {await page.goto('/admin/create?type='+type);await expect(page.locator('h1')).toBeVisible();await page.waitForTimeout(600);const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);}
});
test('admin creates and updates a project with multipart data',async({page})=>{
 await authenticate(page);let method='',body='';await page.route('**/api/Projects/Create',async r=>{method=r.request().method();body=r.request().postData()||'';await r.fulfill({contentType:'application/json',body:JSON.stringify(project)});});
 await page.goto('/admin/create?type=project');await page.locator('#title').fill('Created in test');await page.locator('#description').fill('Test project description');await page.getByRole('button',{name:'React',exact:true}).click();await page.getByRole('button',{name:/Save Project|Create Project/}).click();await expect(page.getByRole('status')).toContainText('created successfully');expect(method).toBe('POST');expect(body).toContain('name="technologyIds"');expect(body).toContain('Created in test');
 await page.waitForURL('**/admin');await page.goto('/admin/create?type=project&edit=true&id=project-1');await expect(page.locator('#title')).toHaveValue('Example Project');await page.route('**/api/Projects/Update/*',async r=>{method=r.request().method();await r.fulfill({contentType:'application/json',body:JSON.stringify(project)});});await page.locator('#title').fill('Updated in test');await page.getByRole('button',{name:/Update Project|Save Project/}).click();await expect(page.getByRole('status')).toContainText('updated successfully');expect(method).toBe('PATCH');
});
test('backup import validates and previews without server writes',async({page})=>{
 await authenticate(page);let writes=0;page.on('request',r=>{if(r.url().includes('/api/')&&r.method()!=='GET')writes++;});await page.goto('/admin');await expect(page.getByRole('heading',{name:'Dashboard',exact:true})).toBeVisible();
 const input=page.locator('input[type="file"]');await input.setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({projects:[project],testimonials:[testimonial]}))});await expect(page.getByText('Local backup preview.',{exact:false})).toBeVisible();expect(writes).toBe(0);await page.getByRole('button',{name:'Reload live data'}).click();await expect(page.getByText('Local backup preview.',{exact:false})).toHaveCount(0);
});
test('failed lazy route shows recovery UI',async({page})=>{
 await page.route('**/assets/resume-*.js',r=>r.abort());await page.goto('/resume');await expect(page.getByRole('heading',{name:'This page could not load'})).toBeVisible();await expect(page.getByRole('button',{name:'Reload page'})).toBeVisible();
});
test('reduced motion and blocked browser storage do not prevent reading',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError');}});});await page.goto('/');await expect(page.getByRole('heading',{name:"I'm Samir Habibov"})).toBeVisible();await expect(page.getByText('Backend Developer',{exact:true})).toBeVisible();
});
test('admin testimonial creation and project delete confirmation',async({page})=>{
 await authenticate(page);let created=0,deleted=0;
 await page.route('**/api/Testimonials/Create',r=>{created++;return r.fulfill({contentType:'application/json',body:JSON.stringify(testimonial)});});
 await page.goto('/admin/create?type=testimonial');for(const [id,value] of Object.entries({fullName:'Admin Reviewer',position:'Engineer',company:'Test',message:'Created in isolated test'}))await page.locator('#'+id).fill(value);
 await page.getByRole('button',{name:'Save Testimonial'}).click();await expect(page.getByRole('status')).toContainText('created successfully');await page.waitForURL('**/admin');expect(created).toBe(1);
 if(page.viewportSize()!.width<1024)await page.getByRole('button',{name:'Open admin menu'}).click();await page.getByRole('button',{name:'Projects',exact:true}).filter({visible:true}).click();
 await page.route('**/api/Projects/Delete/Soft?*',r=>{deleted++;return r.fulfill({status:204});});
 await page.getByRole('button',{name:'Delete item'}).filter({visible:true}).first().click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Cancel',exact:true}).click();expect(deleted).toBe(0);
 await page.getByRole('button',{name:'Delete item'}).filter({visible:true}).first().click();await page.getByRole('dialog').getByRole('button',{name:'Delete',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);expect(deleted).toBe(1);await expect(page.getByText('No projects yet',{exact:true})).toBeVisible();
});
test('admin tabs have accessible controls and fit the viewport',async({page})=>{
 await authenticate(page);await page.goto('/admin');await expect(page.getByRole('heading',{name:'Dashboard',exact:true})).toBeVisible();
 for(const name of ['Dashboard','Projects','Testimonials','Settings']){
  if(page.viewportSize()!.width<1024)await page.getByRole('button',{name:'Open admin menu'}).click();await page.getByRole('button',{name,exact:true}).filter({visible:true}).click();await page.waitForTimeout(400);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 }
});
