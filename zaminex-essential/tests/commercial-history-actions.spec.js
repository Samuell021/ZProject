import {test,expect} from '@playwright/test';
import {createSeed,schemaVersion} from '../src/mock/seed.js';
import {selectOption} from './select-helper.js';
function fixture(){
 const db=createSeed();const r=db.registrationRequests.find(r=>r.resulting_property_id&&r.assigned_to_id==='u4');
 r.acceptance_status='ACCEPTED';r.status='COMPLETED';
 const property=db.properties.find(p=>p.id===r.resulting_property_id);property.record_status='ACTIVE';property.review_status='APPROVED';
 const source=db.listings.find(l=>l.property_id===property.id);
 const listing={...source,id:'action-listing',code:'L-ACTIONS',status:'ACTIVE'};db.listings.push(listing);
 const inquiry={...db.inquiries[0],id:'action-inquiry',assigned_to_id:'u4',management_scope_id:'s1',status:'INTRODUCED',acceptance_status:'ACCEPTED'};db.inquiries.push(inquiry);
 db.introductions.push({id:'action-intro',listing_id:listing.id,inquiry_id:inquiry.id,status:'VIEWING_SCHEDULED'});
 db.viewings.push({id:'action-viewing',introduction_id:'action-intro',status:'SCHEDULED',scheduled_at:'2030-01-01T10:00:00Z',consultant_id:'u4'});
 return {db,r,listing};
}
async function load(page,data,actorId='u4'){
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db:data.db,schemaVersion,actorId});
 await page.goto(`/requests/${data.r.id}?casePanel=history`);
}
test('history completes viewing, starts negotiation, records success and lets only general manager prepare contract',async({page})=>{
 const data=fixture();await load(page,data);
 const history=page.getByRole('dialog',{name:'سوابق پرونده',exact:true});
 const viewing=history.getByRole('region',{name:'بازدیدهای این ملک'}).locator('article').filter({hasText:'L-ACTIONS'});
 await viewing.getByRole('button',{name:'ثبت نتیجه بازدید',exact:true}).click();
 const result=page.getByRole('dialog',{name:'ثبت نتیجه بازدید',exact:true});
 await selectOption(result.getByLabel('نظر متقاضی پس از بازدید *'),'INTERESTED');
 await result.getByLabel('گزارش و نتیجه بازدید *').fill('بازدید انجام شد و ملک مورد پسند بود');
 await result.getByRole('button',{name:'ثبت نتیجه',exact:true}).click();await expect(result).toHaveCount(0);
 await viewing.getByRole('button',{name:'شروع مذاکره',exact:true}).click();
 const start=page.getByRole('dialog',{name:'شروع مذاکره',exact:true});await page.reload();await expect(start).toBeVisible();
 await start.getByRole('button',{name:'شروع مذاکره',exact:true}).click();await expect(start).toHaveCount(0);
 const deal=history.getByRole('region',{name:'مذاکرات این ملک'}).locator('article').filter({hasText:'L-ACTIONS'});
 await expect(deal).toHaveCount(1);
 await deal.getByRole('button',{name:'ثبت نتیجه مذاکره',exact:true}).click();
 const decision=page.getByRole('dialog',{name:'ثبت نتیجه مذاکره',exact:true});
 await decision.getByLabel('توضیحات توافق *').fill('طرفین برای تنظیم قرارداد توافق کردند');
 await decision.getByRole('button',{name:'ثبت نتیجه',exact:true}).click();await expect(decision).toHaveCount(0);
 await expect(deal).toContainText('در انتظار تنظیم قرارداد توسط مدیرکل');
 await expect(deal.getByRole('button',{name:'تنظیم قرارداد',exact:true})).toHaveCount(0);
 await history.getByRole('button',{name:'بستن',exact:true}).click();
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u1');
 await page.getByRole('button',{name:'سوابق',exact:true}).click();
 await deal.getByRole('button',{name:'تنظیم قرارداد',exact:true}).click();
 const contract=page.getByRole('dialog',{name:'تنظیم قرارداد',exact:true});
 await contract.locator('input[type="number"]').first().fill('9000000000');
 await contract.getByRole('button',{name:'ثبت پیش‌نویس قرارداد',exact:true}).click();
 await expect(contract).toHaveCount(0);
 await expect(history.getByRole('region',{name:'قراردادهای این ملک'}).locator('article').filter({hasText:'L-ACTIONS'})).toHaveCount(1);
 expect(new URL(page.url()).pathname).toBe(`/requests/${data.r.id}`);
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('farda-crm-sample')).db);
 const created=stored.deals.find(d=>d.listing_id==='action-listing');
 expect(created.viewing_id).toBe('action-viewing');expect(stored.contracts.some(c=>c.deal_id===created.id)).toBe(true);
});
test('negative viewing has no next negotiation action; failed negotiation retains reason',async({page})=>{
 const data=fixture();
 data.db.deals.push({id:'failed-deal',code:'D-FAIL',listing_id:'action-listing',inquiry_id:'action-inquiry',stage:'NEGOTIATION'});
 await load(page,data);
 const history=page.getByRole('dialog',{name:'سوابق پرونده',exact:true});
 const viewing=history.getByRole('region',{name:'بازدیدهای این ملک'}).locator('article').filter({hasText:'L-ACTIONS'});
 await viewing.getByRole('button',{name:'ثبت نتیجه بازدید',exact:true}).click();
 const result=page.getByRole('dialog',{name:'ثبت نتیجه بازدید',exact:true});
 await selectOption(result.getByLabel('نظر متقاضی پس از بازدید *'),'NOT_INTERESTED');
 await result.getByLabel('گزارش و نتیجه بازدید *').fill('بازدید انجام شد؛ نامناسب بود');
 await result.getByRole('button',{name:'ثبت نتیجه',exact:true}).click();await expect(result).toHaveCount(0);
 await expect(viewing.getByRole('button',{name:'شروع مذاکره',exact:true})).toHaveCount(0);
 const deal=history.getByRole('region',{name:'مذاکرات این ملک'}).locator('article').filter({hasText:'D-FAIL'});
 await deal.getByRole('button',{name:'ثبت نتیجه مذاکره',exact:true}).click();
 const decision=page.getByRole('dialog',{name:'ثبت نتیجه مذاکره',exact:true});
 await selectOption(decision.getByLabel('نتیجه مذاکره *'),'FAILED');await decision.getByLabel('دلیل عدم توافق *').fill('توافق روی شرایط حاصل نشد');
 await decision.getByRole('button',{name:'ثبت نتیجه',exact:true}).click();await expect(decision).toHaveCount(0);
 await expect(deal).toContainText('توافق روی شرایط حاصل نشد');await expect(deal.getByRole('button')).toHaveCount(0);
});
for(const actorId of ['u2','u4','u7','u8'])test(`contract direct URL and navigation denied for ${actorId}`,async({page})=>{
 const data=fixture();await load(page,data,actorId);
 await page.goto('/contracts/ct1?action=contractTerms');
 await expect(page.getByRole('alert')).toContainText('دسترسی به این بخش');
 await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('aside a[href="/contracts"]')).toHaveCount(0);
});
test('list history restores nested action on reload and Escape retains the list and history',async({page})=>{
 const data=fixture();await load(page,data);
 await page.setViewportSize({width:375,height:812});
 await page.goto(`/requests?p=1&historyCase=${data.r.id}&commercialAction=viewingResult&commercialRecord=action-viewing`);
 const result=page.getByRole('dialog',{name:'ثبت نتیجه بازدید',exact:true});await expect(result).toBeVisible();
 await page.reload();await expect(result).toBeVisible();await result.getByLabel('گزارش و نتیجه بازدید *').fill('فرم قابل استفاده بعد از رفرش');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.keyboard.press('Escape');await expect(result).toHaveCount(0);
 await expect(page.getByRole('dialog',{name:'سوابق پرونده',exact:true})).toBeVisible();expect(new URL(page.url()).pathname).toBe('/requests');
});
test('forged contract action in consultant history never opens a contract form',async({page})=>{
 const data=fixture();data.db.deals.push({id:'ready-deal',code:'D-READY',listing_id:'action-listing',inquiry_id:'action-inquiry',stage:'AGREED'});
 await load(page,data);
 await page.goto(`/requests/${data.r.id}?casePanel=history&commercialAction=createContract&commercialRecord=ready-deal`);
 await expect(page.getByRole('dialog',{name:'سوابق پرونده',exact:true})).toBeVisible();
 await expect(page.getByRole('dialog',{name:'تنظیم قرارداد',exact:true})).toHaveCount(0);
});
