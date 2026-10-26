import {test,expect} from '@playwright/test';
import {createSeed} from '../src/mock/seed.js';
test('fresh demo shows coherent stages and the two-consultant story',async({page})=>{
 await page.goto('/pipelines?pipeline=inquiries');await expect(page.locator('.kanban-column')).toHaveCount(9);
 for(const stage of ['reception','assignment','acceptance','needs','matching','viewings','negotiation','contract'])await expect(page.locator(`.kanban-column[data-stage="${stage}"] .kanban-card`).first()).toBeVisible();
 await page.goto('/inquiries/i10');const intros=page.getByRole('region',{name:'فایل‌های معرفی‌شده؛ انتخاب برای بازدید',exact:true});await expect(intros.locator('article')).toHaveCount(2);await expect(intros.getByRole('button',{name:'ثبت بازدید',exact:true})).toHaveCount(2);
 await page.goto('/inquiries/i17');const team=page.locator('.flow-current').getByRole('region',{name:'مذاکرات ثبت‌شده',exact:true});await expect(team).toContainText('همکاری دو مشاور');await expect(team).toContainText('رضا حسینی');await expect(team).toContainText('سارا محمدی');
 await page.goto('/inquiries/i4');await page.locator('.flow-current').getByRole('button',{name:'تنظیم قرارداد',exact:true}).click();await expect(page.getByRole('dialog',{name:'تنظیم قرارداد',exact:true})).toBeVisible();
});
test('old demo is backed up once and replaced with new persistent scenarios',async({page})=>{
 const old=createSeed();old.inquiries[0].notes='OLD-DEMO-MARKER';
 await page.addInitScript(db=>{if(!sessionStorage.getItem('old-seeded')){localStorage.setItem('farda-crm-sample',JSON.stringify({schemaVersion:1,db,actorId:'u1'}));sessionStorage.setItem('old-seeded','1');}},old);
 await page.goto('/inquiries/i10');await expect(page.locator('.flow-current h2')).toHaveText('معرفی فایل');
 const state=await page.evaluate(()=>{const keys=Object.keys(localStorage).filter(k=>k.startsWith('farda-crm-sample-backup-v1-'));return {backups:keys.length,backup:JSON.parse(localStorage.getItem(keys[0])),current:JSON.parse(localStorage.getItem('farda-crm-sample'))};});expect(state.backups).toBe(1);expect(state.backup.db.inquiries[0].notes).toBe('OLD-DEMO-MARKER');expect(state.current.schemaVersion).toBe(3);
 await page.reload();expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('farda-crm-sample-backup-v1-')).length)).toBe(1);
});
test('acceptance inbox contains decisions only; assignment remains in dossier and pipeline',async({page})=>{
 await page.goto('/inbox');const tabs=page.getByRole('tablist',{name:'دسته‌بندی کارتابل پذیرش'});await expect(tabs.getByRole('tab',{name:'ارجاع به مشاور',exact:false})).toHaveCount(0);await expect(page.getByRole('link',{name:/^ارجاع (مجدد )?به کارشناس$/})).toHaveCount(0);
 await expect(page.locator('.intake-card').filter({hasText:'R-1016'})).toHaveCount(0);await expect(page.locator('.intake-card').filter({hasText:'R-1013'})).toHaveCount(1);
 const pending=page.locator('.intake-card').filter({hasText:'R-1013'});await pending.getByRole('button',{name:'پذیرش پرونده',exact:true}).click();await expect(pending).toHaveCount(0);
 await page.goto('/pipelines?pipeline=requests');const card=page.locator('.kanban-column[data-stage="assignment"] .kanban-card').filter({hasText:'R-1016'});await card.getByRole('link',{name:'مشاهده و ادامه پرونده',exact:false}).click();await expect(page).toHaveURL(/\/requests\/r16$/);await expect(page.locator('.flow-current h2')).toHaveText('ارجاع');
});
test('version two cache gains withdrawal and extension examples after upgrade',async({page})=>{
 const old=createSeed();old.rescheduleHistory=[];old.registrationRequests=old.registrationRequests.filter(r=>r.id!=='r18');old.inquiries=old.inquiries.filter(i=>!['i18','i19','i20'].includes(i.id));
 await page.addInitScript(db=>{if(!sessionStorage.getItem('v2-seeded')){localStorage.setItem('farda-crm-sample',JSON.stringify({schemaVersion:2,db,actorId:'u1'}));sessionStorage.setItem('v2-seeded','1');}},old);
 await page.goto('/inbox?state=WITHDRAWAL_PENDING');await expect(page.locator('.intake-card')).toHaveCount(2);await page.goto('/inbox?state=EXTENSION_PENDING');await expect(page.locator('.intake-card')).toHaveCount(2);await page.reload();await expect(page.locator('.intake-card')).toHaveCount(2);
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('farda-crm-sample-backup-v2-')).length)).toBe(1);
});
