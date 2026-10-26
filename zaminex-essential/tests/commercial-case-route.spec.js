import {test,expect} from '@playwright/test';import {createSeed,schemaVersion} from '../src/mock/seed.js';
test('commercial sections leave the menu and old event links return to dossier history',async({page})=>{
 const db=createSeed();await page.addInitScript(data=>localStorage.setItem('farda-crm-sample',JSON.stringify(data)),{db,schemaVersion,actorId:'u1'});
 for(const collection of ['introductions','viewings','deals']){
  await page.goto('/'+collection);await expect(page).toHaveURL(/\/inquiries$/);
  await expect(page.locator('aside a[href="/'+collection+'"]')).toHaveCount(0);
  await page.goto('/'+collection+'/'+db[collection][0].id);
  await expect(page).toHaveURL(/\/(inquiries|requests)\/[^?]+\?casePanel=history$/);
  await expect(page.getByRole('dialog',{name:'سوابق پرونده',exact:true})).toBeVisible();
 }
});
test('property history keeps introduction rejection inside the dossier after retiring the separate page',async({page})=>{
 const db=createSeed(),r=db.registrationRequests.find(r=>r.resulting_property_id),l=db.listings.find(l=>l.property_id===r.resulting_property_id);
 const inquiry=db.inquiries.find(i=>!['COMPLETED','CANCELLED','CLOSED'].includes(i.status));
 r.status='COMPLETED';r.acceptance_status='ACCEPTED';const property=db.properties.find(p=>p.id===l.property_id);property.record_status='ACTIVE';property.review_status='APPROVED';
 db.listings.push({...l,id:'decline-listing',code:'L-DECLINE',status:'ACTIVE',review_status:'APPROVED'});db.introductions.push({id:'decline-intro',listing_id:'decline-listing',inquiry_id:inquiry.id,status:'INTRODUCED'});
 await page.addInitScript(data=>localStorage.setItem('farda-crm-sample',JSON.stringify(data)),{db,schemaVersion,actorId:'u1'});
 await page.goto(`/requests/${r.id}?casePanel=history`);
 const row=page.getByRole('region',{name:'معرفی‌های این ملک',exact:true}).locator('article').filter({hasText:'L-DECLINE'});
 await row.getByRole('button',{name:'ثبت عدم تمایل به فایل',exact:true}).click();
 const form=page.getByRole('dialog',{name:'ثبت عدم تمایل به فایل',exact:true});await form.getByLabel('دلیل عدم تمایل متقاضی *').fill('موقعیت ملک مناسب متقاضی نبود');await form.getByRole('button',{name:'ثبت نتیجه',exact:true}).click();
 await expect(form).toHaveCount(0);await expect(row).toContainText('موقعیت ملک مناسب متقاضی نبود');await expect(row.getByRole('button')).toHaveCount(0);
});
