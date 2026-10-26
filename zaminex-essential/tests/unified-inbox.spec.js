import {test,expect} from '@playwright/test';
import {createSeed,schemaVersion} from '../src/mock/seed.js';
import {operate} from '../src/services/operations.js';
import {selectOption} from './select-helper.js';
for(const actorId of ['u1','u2','u4'])test(`unified inbox defaults to all and preserves role-specific tabs for ${actorId}`,async({page})=>{
 let db=createSeed();
 db=operate(db,'u2','createLead',{lead_type:'PROPERTY',management_scope_id:'s1',initial_contact_name:'آماده ارجاع در کارتابل',initial_contact_phone:'09123456789'});const ready=db._result.id;
 db=operate(db,'u4','createLead',{lead_type:'PROPERTY',initial_contact_name:'پذیرش مدیر در کارتابل',initial_contact_phone:'09123456780'});const fresh=db._result.id;
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId});
 await page.goto('/inbox');
 await expect(page.getByRole('tab',{name:/^همه/})).toHaveAttribute('aria-selected','true');
 await expect(page.locator('aside a[href="/leads"]')).toHaveCount(0);
 const tabs=page.getByRole('tablist',{name:'دسته‌بندی کارتابل پذیرش'});
 if(actorId==='u4'){
  await expect(tabs.getByRole('tab',{name:/پذیرش اولیه|تأیید کارشناسی/})).toHaveCount(0);
  await expect(page.locator(`a[href="/requests/${ready}"]`)).toHaveCount(0);
  await expect(page.locator(`a[href="/requests/${fresh}"]`)).toHaveCount(0);
 }else{
  await expect(page.locator('.intake-card').filter({hasText:'آماده ارجاع در کارتابل'})).toBeVisible();
  await tabs.getByRole('tab',{name:/^پذیرش اولیه/}).click();
  const freshCard=page.locator('.intake-card').filter({hasText:'پذیرش مدیر در کارتابل'});
  await expect(freshCard).toBeVisible();await expect(page.locator('.intake-card').filter({hasText:'آماده ارجاع در کارتابل'})).toHaveCount(0);
  await freshCard.getByRole('button',{name:'پذیرش سرنخ',exact:true}).click();
  await expect(page).toHaveURL(/\/inbox/);await expect(freshCard).toHaveCount(0);
  await tabs.getByRole('tab',{name:/^ارجاع به مشاور/}).click();await expect(freshCard).toBeVisible();
 }
 await tabs.getByRole('tab',{name:/^پذیرش ارجاع/}).click();await expect(page).toHaveURL(/state=PENDING/);
 await page.reload();await expect(page.getByRole('tab',{name:/^پذیرش ارجاع/})).toHaveAttribute('aria-selected','true');
 await page.setViewportSize({width:375,height:812});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
test('old leads address redirects to the tabbed inbox',async({page})=>{
 await page.goto('/leads?state=UNASSIGNED');await expect(page).toHaveURL(/\/inbox\?state=UNASSIGNED/);
 await expect(page.getByRole('tab',{name:/^ارجاع به مشاور/})).toHaveAttribute('aria-selected','true');
});
test('listing opens in a new page from property dossier without losing the dossier',async({page})=>{
 const db=createSeed();const r=db.registrationRequests.find(r=>r.resulting_property_id&&db.listings.some(l=>l.property_id===r.resulting_property_id));
 const listing=db.listings.find(l=>l.property_id===r.resulting_property_id);
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u1'});
 await page.goto(`/requests/${r.id}?stage=listing`);const original=page.url();
 const link=page.locator(`a[href="/listings/${listing.id}"]`).first();
 await expect(link).toHaveAttribute('target','_blank');
 const popupEvent=page.waitForEvent('popup');await link.click();const popup=await popupEvent;
 await expect(popup).toHaveURL(new RegExp(`/listings/${listing.id}`));await expect(page).toHaveURL(original);await popup.close();
 await page.goto(`/properties/${r.resulting_property_id}`);
 await expect(page.locator(`a[href="/listings/${listing.id}"]`).first()).toHaveAttribute('target','_blank');
});
