import {test,expect} from '@playwright/test';
import {createSeed,schemaVersion} from '../src/mock/seed.js';
import {inquiryWizardStage} from '../src/services/inquiry-wizard.js';
import {propertyWizardStage} from '../src/services/property-wizard.js';
async function seed(page){const db=createSeed();await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u1'});return db;}
test('case pipelines replace negotiations tab and open dossiers at their actual wizard stages',async({page})=>{
 const db=await seed(page);await page.goto('/pipelines?pipeline=deals');
 const tabs=page.getByRole('tablist',{name:'مسیر کاریز'});await expect(tabs.getByRole('tab')).toHaveCount(2);await expect(tabs.getByRole('tab',{name:'مذاکرات',exact:true})).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'کاریز پرونده‌های ملک',exact:true})).toBeVisible();
 for(const stage of ['lead','reception','assignment','acceptance','appraisal','review','listing'])await expect(page.locator(`.kanban-column[data-stage="${stage}"]`)).toHaveCount(1);
 const r=db.registrationRequests.find(r=>propertyWizardStage(db,r)==='listing');await expect(page.locator('.kanban-column[data-stage="listing"] .kanban-card').filter({hasText:r.code})).toHaveCount(1);
 await tabs.getByRole('tab',{name:'پرونده‌های متقاضی',exact:true}).click();await expect(page).toHaveURL(/pipeline=inquiries/);
 for(const stage of ['lead','reception','assignment','acceptance','needs','matching','viewings','negotiation','contract'])await expect(page.locator(`.kanban-column[data-stage="${stage}"]`)).toHaveCount(1);
 const inquiry=db.inquiries.find(r=>inquiryWizardStage(db,r)==='matching');const card=page.locator('.kanban-column[data-stage="matching"] .kanban-card').filter({hasText:inquiry.code});await expect(card).toHaveCount(1);await card.getByRole('link',{name:'مشاهده و ادامه پرونده',exact:false}).click();await expect(page).toHaveURL(new RegExp(`/inquiries/${inquiry.id}$`));
});
test('case pipeline filters persist on refresh and every intake stage is visible',async({page})=>{
 const db=await seed(page);await page.goto('/pipelines?pipeline=inquiries&scope=s1');
 const row=db.inquiries.find(r=>r.management_scope_id==='s1'&&inquiryWizardStage(db,r)==='matching');
 await page.getByLabel('جست‌وجوی کاریز').fill(row.code);await page.reload();await expect(page.getByLabel('جست‌وجوی کاریز')).toHaveValue(row.code);await expect(page.locator('.kanban-card')).toHaveCount(1);
 await expect(page.locator('.kanban-column[data-stage="reception"]')).toHaveCount(1);await expect(page.locator('.kanban-column[data-stage="assignment"]')).toHaveCount(1);
});
