import {test,expect} from '@playwright/test';
import {selectOption} from './select-helper.js';
import {createSeed,schemaVersion} from '../src/mock/seed.js';
import {operate} from '../src/services/operations.js';

test('wizard registers a lead, manager accepts and assigns, consultant appraises, manager approves and consultant lists',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/property-register');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await page.getByLabel('نام و نام خانوادگی').fill('مالک ویزارد کامل');
 await page.getByLabel('شماره تماس',{exact:true}).fill('۰۹۱۲۳۴۵۶۷۸۹');
 await page.getByRole('button',{name:'ادامه',exact:true}).click();
 await page.getByLabel('توضیحات اولیه ملک (اختیاری)').fill('آپارتمان برای فروش');
 await page.getByRole('button',{name:'ادامه',exact:true}).click();
 await page.getByRole('button',{name:'ثبت سرنخ و ادامه',exact:true}).click();
 await expect(page).toHaveURL(/case=/);const href=page.url();
 await expect(page.getByText('سرنخ ثبت شده و منتظر پذیرش مدیر رنج است.',{exact:false})).toBeVisible();
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');
 await page.getByRole('button',{name:'پذیرش سرنخ و ادامه'}).click();
 await selectOption(page.getByLabel('مشاور رنج پرونده *'),'u4');
 await page.getByRole('button',{name:'انتخاب تاریخ موعد تکمیل *'}).click();
 await selectOption(page.getByLabel('سال تقویم'),'1406');await selectOption(page.getByLabel('ماه تقویم'),'1');
 await page.getByRole('button',{name:'روز ۱۵',exact:true}).click();
 await page.getByRole('button',{name:'ثبت اطلاعات',exact:true}).click();
 await expect(page.getByText('در انتظار پذیرش سارا محمدی',{exact:false})).toBeVisible();
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await page.getByRole('button',{name:'پذیرش و شروع کارشناسی',exact:true}).click();
 await page.getByRole('button',{name:'تکمیل اطلاعات و گزارش بازدید',exact:true}).click();
 await page.getByLabel('نشانی کامل *').fill('نشانی تست');
 await selectOption(page.getByLabel('منطقه *'),'district1');
 await page.getByLabel('متراژ *',{exact:true}).fill('100');
 await page.getByLabel('نتیجه تماس و کارشناسی *').fill('ملک کارشناسی شد');
 await expect(page.getByLabel('قیمت کارشناسی',{exact:false})).toHaveCount(0);
 await page.getByRole('button',{name:'ذخیره کارشناسی ملک'}).click();
 await expect(page.locator('.swal2-popup')).toContainText('اطلاعات ملک ذخیره شد');
 await page.getByRole('button',{name:'مرور و ارسال برای مدیر',exact:true}).click();
 const review=page.getByRole('dialog',{name:'مرور اطلاعات و ارسال برای مدیر',exact:true});
 await expect(review).toContainText('ملک کارشناسی شد');
 await page.reload();
 await expect(review).toBeVisible();
 await review.getByRole('button',{name:'تأیید و ارسال برای مدیر',exact:true}).click();
 await expect(page.getByText('اطلاعات برای مدیر رنج ارسال شده',{exact:false})).toBeVisible();
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');
 await page.getByLabel('عنوان ملک *',{exact:true}).fill('ملک ویزارد');
 await page.getByRole('button',{name:'ثبت اطلاعات',exact:true}).click();
 await page.getByRole('button',{name:'تأیید ملک و ادامه'}).click();
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await selectOption(page.getByLabel('نوع معامله فایل'),'sale');
 await page.getByLabel('قیمت فروش *').fill('1200000000');
 await page.getByRole('button',{name:'ثبت فایل عرضه',exact:true}).click();
 await expect(page.getByText('ملک تأیید شده و فایل‌های زیر ثبت شده‌اند.',{exact:false})).toBeVisible();
 await page.goto('/property-register');
 await expect(page.getByLabel('آخرین پرونده مشاهده‌شده')).toContainText('آخرین بار اینجا بودید');
 await page.getByRole('link',{name:'ادامه از همین پرونده ←'}).click();await expect(page).toHaveURL(href);
 expect(errors).toEqual([]);
});

test('back to list shows last visited dossier and history stays separate per user',async({page})=>{
 let db=createSeed();db=operate(db,'u2','createLead',{lead_type:'PROPERTY',management_scope_id:'s1',initial_contact_name:'پرونده نشان‌دار',initial_contact_phone:'09123456789'});const id=db._result.id;
 await page.addInitScript(data=>{localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u2'});
 await page.goto('/requests');await expect(page.getByRole('heading',{name:'پرونده‌های ثبت ملک',exact:true})).toBeVisible();await page.goto(`/requests/${id}`);await expect(page.locator('main')).toContainText('پرونده نشان‌دار');await page.goBack();
 await expect(page.getByLabel('آخرین پرونده مشاهده‌شده')).toContainText('پرونده نشان‌دار');
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await expect(page.getByLabel('آخرین پرونده مشاهده‌شده')).toHaveCount(0);
});


test('property details show navigable journey and future stage cannot bypass manager acceptance',async({page})=>{
 let db=createSeed();db=operate(db,'u4','createLead',{lead_type:'PROPERTY',initial_contact_name:'سرنخ پیمایش',initial_contact_phone:'09123456789'});const id=db._result.id;
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u2'});
 await page.goto(`/requests/${id}`);
 const journey=page.getByRole('navigation',{name:'مسیر پرونده ملک'});
 await expect(journey.getByRole('button')).toHaveCount(7);
 await journey.getByRole('button',{name:'فایل عرضه',exact:false}).click();
 await expect(page).toHaveURL(/stage=listing/);
 await expect(page.getByText('اقدام آن پس از تکمیل پیش‌نیازها',{exact:false})).toBeVisible();
 await expect(page.getByRole('button',{name:'ثبت فایل عرضه',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'رفتن به مرحله فعلی پرونده'}).click();
 await expect(page.getByRole('button',{name:'پذیرش سرنخ و ادامه'})).toBeVisible();
 await page.setViewportSize({width:375,height:812});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

test('previous dossier picker opens a searchable URL-addressable modal and selection continues same case',async({page})=>{
 let db=createSeed();db=operate(db,'u2','createLead',{lead_type:'PROPERTY',management_scope_id:'s1',initial_contact_name:'مالک انتخاب پنجره',initial_contact_phone:'09123456789'});const id=db._result.id;
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u2'});
 await page.goto('/property-register');await page.getByRole('main').getByRole('button',{name:'پرونده‌ها',exact:true}).click();
 await expect(page).toHaveURL(/chooseCase=1/);await page.reload();
 const modal=page.getByRole('dialog',{name:'ادامه پرونده قبلی',exact:true});await expect(modal).toBeVisible();
 await modal.getByLabel('جست‌وجوی پرونده').fill('هیچ پرونده‌ای به این نام نیست');await expect(modal.getByText('پرونده‌ای پیدا نشد؛ عبارت جست‌وجو را تغییر دهید.')).toBeVisible();
 await modal.getByLabel('جست‌وجوی پرونده').fill('مالک انتخاب پنجره');
 await modal.getByRole('button',{name:'مالک انتخاب پنجره',exact:false}).click();
 await expect(modal).toHaveCount(0);await expect(page).toHaveURL(new RegExp(`case=${id}`));
});

test('SweetAlert displays validation and operation errors once and failed registration preserves entered values',async({page})=>{
 await page.goto('/property-register');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await page.getByRole('button',{name:'ادامه',exact:true}).click();
 await expect(page.locator('.swal2-popup')).toBeVisible();await expect(page.locator('.swal2-popup')).toContainText('نام و نام خانوادگی');
 await page.getByRole('button',{name:'متوجه شدم'}).click();
 await page.getByLabel('نام و نام خانوادگی').fill('خطای قابل تلاش مجدد');await page.getByLabel('شماره تماس',{exact:true}).fill('09123456789');
 await page.getByRole('button',{name:'ادامه',exact:true}).click();await page.getByRole('button',{name:'ادامه',exact:true}).click();
 await page.getByLabel('شکست نمایشی عملیات بعدی').check();await page.getByRole('button',{name:'ثبت سرنخ و ادامه',exact:true}).click();
 await expect(page.locator('.swal2-popup')).toContainText('شکست نمایشی عملیات');
 await page.getByRole('button',{name:'متوجه شدم'}).click();await expect(page.locator('.swal2-popup')).toHaveCount(0);
 await expect(page.getByText('خطای قابل تلاش مجدد',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'ثبت سرنخ و ادامه',exact:true}).click();await expect(page).toHaveURL(/case=/);
});

test('SweetAlert validation inside native modal stays above it and leaves the parent form open',async({page})=>{
 const db=createSeed();const r=db.registrationRequests.find(r=>r.assigned_to_id&&['IN_PROGRESS','CHANGES_REQUIRED'].includes(r.status));
 await page.addInitScript(data=>localStorage.setItem('farda-crm-sample',JSON.stringify(data)),{db,schemaVersion,actorId:r.assigned_to_id});
 await page.goto(`/requests/${r.id}?action=workspace`);
 const modal=page.locator('dialog[open]');await expect(modal).toBeVisible();
 await modal.getByLabel('نشانی کامل *').fill('');await modal.getByRole('button',{name:'ذخیره کارشناسی ملک'}).click();
 await expect(modal.locator('.swal2-popup')).toBeVisible();await page.getByRole('button',{name:'متوجه شدم'}).click();
 await expect(modal).toBeVisible();await expect(page).toHaveURL(/action=workspace/);
});

test('successful appraisal save offers review without auto-submission and cancelling keeps the saved draft',async({page})=>{
 const db=createSeed();const r=db.registrationRequests.find(r=>r.assigned_to_id&&['IN_PROGRESS','CHANGES_REQUIRED'].includes(r.status));
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:r.assigned_to_id});
 await page.goto(`/property-register?case=${r.id}&edit=workspace`);
 await page.getByLabel('نشانی کامل *').fill('نشانی ذخیره و مرور');await selectOption(page.getByLabel('منطقه *'),'district1');
 await page.getByLabel('متراژ *',{exact:true}).fill('100');await page.getByLabel('نتیجه تماس و کارشناسی *').fill('گزارش آماده مرور');
 await page.getByLabel('شکست نمایشی عملیات بعدی').check();await page.getByRole('button',{name:'ذخیره کارشناسی ملک'}).click();
 await expect(page.locator('.swal2-popup')).toContainText('شکست نمایشی عملیات');await expect(page.getByRole('button',{name:'مرور و ارسال برای مدیر',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'متوجه شدم'}).click();
 await page.getByRole('button',{name:'ذخیره کارشناسی ملک'}).click();await page.getByRole('button',{name:'فعلاً ادامه می‌دهم',exact:true}).click();
 await expect(page.getByRole('button',{name:'مرور و ارسال برای مدیر',exact:true})).toBeVisible();await expect(page).not.toHaveURL(/reviewRequest=/);
 await page.getByRole('button',{name:'مرور و ارسال برای مدیر',exact:true}).click();
 const review=page.getByRole('dialog',{name:'مرور اطلاعات و ارسال برای مدیر',exact:true});await expect(review).toContainText('گزارش آماده مرور');
 await review.getByRole('button',{name:'برگشت برای ویرایش',exact:true}).click();await expect(review).toHaveCount(0);
 await expect(page.getByLabel('نشانی کامل *')).toHaveValue('نشانی ذخیره و مرور');
});

test('registration list and dossier share wizard styling, stages and route while history remains available',async({page})=>{
 const db=createSeed();const r=db.registrationRequests.find(r=>r.assigned_to_id&&r.status==='IN_PROGRESS');
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u1'});
 await page.goto('/requests');
 await expect(page.getByRole('heading',{name:'پرونده‌ها در یک مسیر مشخص'})).toBeVisible();
 const card=page.locator('.request-flow-card').filter({hasText:r.code});
 if(!await card.count()){
  await page.getByPlaceholder('جست‌وجو در کد، نام و توضیحات…').fill(r.code);
 }
 await expect(card).toBeVisible();await expect(card.getByRole('list')).toBeVisible();
 await card.getByRole('link',{name:'مشاهده و ادامه مسیر',exact:false}).click();
 await expect(page).toHaveURL(new RegExp(`/requests/${r.id}$`));
 const journey=page.getByRole('navigation',{name:'مسیر پرونده ملک'});await expect(journey.getByRole('button')).toHaveCount(7);
 await journey.getByRole('button',{name:'ثبت سرنخ',exact:false}).click();await expect(page).toHaveURL(/stage=lead/);
 await page.getByRole('button',{name:'رفتن به مرحله فعلی پرونده'}).click();
 await page.getByRole('button',{name:'سوابق',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'سوابق پرونده',exact:true})).toBeVisible();await expect(page).toHaveURL(/casePanel=history/);
 await page.goto('/requests');await expect(page.getByLabel('آخرین پرونده مشاهده‌شده')).toContainText(r.code);
 await page.setViewportSize({width:375,height:812});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

test('consultant sees one next action in appraisal and opens the form explicitly',async({page})=>{
 let db=createSeed();db=operate(db,'u2','createLead',{lead_type:'PROPERTY',management_scope_id:'s1',initial_contact_name:'پرونده اقدام مشخص',initial_contact_phone:'09123456789'});const id=db._result.id;
 db=operate(db,'u2','assignCase',{id,collection:'registrationRequests',assigned_to_id:'u4',due_at:'2030-01-01T10:00:00Z'});db=operate(db,'u4','acceptAssignment',{id,collection:'registrationRequests'});
 await page.addInitScript(data=>localStorage.setItem('farda-crm-sample',JSON.stringify(data)),{db,schemaVersion,actorId:'u4'});
 await page.goto(`/requests/${id}`);const current=page.locator('.flow-current');
 await expect(current.getByText('الان چه کاری انجام بدهم؟')).toBeVisible();
 await expect(current.locator('.flow-next-action').getByRole('button')).toHaveCount(1);
 await expect(page.getByRole('button',{name:'سوابق',exact:true})).toBeVisible();
 await expect(page.getByLabel('نشانی کامل *')).toHaveCount(0);
 await current.getByRole('button',{name:'تکمیل اطلاعات و گزارش بازدید',exact:true}).click();
 await expect(page.getByLabel('نشانی کامل *')).toBeVisible();
 await expect(page.getByRole('button',{name:'مرور و ارسال برای مدیر',exact:true})).toHaveCount(0);
});

test('history and work open in-place and nested task form preserves the work modal',async({page})=>{
 const db=createSeed();const r=db.registrationRequests.find(r=>r.assigned_to_id&&r.status==='IN_PROGRESS');
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:r.assigned_to_id});
 await page.goto(`/requests/${r.id}`);
 await expect(page.locator('.flow-more')).toHaveCount(0);
 await page.getByRole('button',{name:'سوابق',exact:true}).click();
 const history=page.getByRole('dialog',{name:'سوابق پرونده',exact:true});await expect(history).toBeVisible();
 await page.reload();await expect(history).toBeVisible();await history.getByRole('button',{name:'بستن',exact:true}).click();
 const work=page.getByLabel('کارها و پیگیری‌های پرونده');await expect(work).toBeVisible();
 await expect(page.getByRole('dialog',{name:'پیگیری کار پرونده',exact:true})).toHaveCount(0);
 await work.getByRole('button',{name:'ثبت کار',exact:true}).click();
 const form=page.getByRole('dialog',{name:'ثبت کار',exact:true});await expect(form).toBeVisible();
 await page.keyboard.press('Escape');await expect(form).toHaveCount(0);await expect(work).toBeVisible();
 await work.getByRole('button',{name:'ثبت کار',exact:true}).click();
 await form.getByLabel('عنوان کار *').fill('پیگیری یکجا در پرونده');
 await form.getByRole('button',{name:'انتخاب تاریخ مهلت انجام کار *'}).click();
 await selectOption(page.getByLabel('سال تقویم'),'1406');await selectOption(page.getByLabel('ماه تقویم'),'1');await page.getByRole('button',{name:'روز ۱۵',exact:true}).click();
 await form.getByRole('button',{name:'ثبت اطلاعات',exact:true}).click();await expect(form).toHaveCount(0);
 await expect(work).toContainText('پیگیری یکجا در پرونده');await expect(page).toHaveURL(new RegExp(`/requests/${r.id}`));
});

test('approved active property still shows work creation controls and compact journey',async({page})=>{
 const db=createSeed();const r=db.registrationRequests.find(r=>r.status==='COMPLETED'&&r.assigned_to_id==='u4');
 const p=db.properties.find(p=>p.id===r.resulting_property_id);p.record_status='ACTIVE';p.review_status='APPROVED';r.acceptance_status='ACCEPTED';
 const listingIds=db.listings.filter(l=>l.property_id===p.id).map(l=>l.id);const dealIds=db.deals.filter(d=>listingIds.includes(d.listing_id)).map(d=>d.id);db.contracts=db.contracts.filter(c=>!dealIds.includes(c.deal_id));
 await page.addInitScript(data=>localStorage.setItem('farda-crm-sample',JSON.stringify(data)),{db,schemaVersion,actorId:'u4'});
 await page.setViewportSize({width:1440,height:1000});await page.goto(`/requests/${r.id}`);
 const work=page.getByLabel('کارها و پیگیری‌های پرونده');await expect(work.getByRole('button',{name:'ثبت کار',exact:true})).toBeVisible();await expect(work.getByRole('button',{name:'ثبت پیگیری',exact:true})).toBeVisible();
 const journey=page.getByRole('navigation',{name:'مسیر پرونده ملک'});expect((await journey.boundingBox()).height).toBeLessThan(170);
 await work.getByRole('button',{name:'ثبت پیگیری',exact:true}).click();await expect(page.getByRole('dialog',{name:'ثبت پیگیری',exact:true})).toBeVisible();
});

test('property history shows each viewing, negotiation and contract with its applicant',async({page})=>{
 const db=createSeed();const listing=db.listings.find(l=>db.viewings.some(v=>db.introductions.find(i=>i.id===v.introduction_id)?.listing_id===l.id)&&db.deals.some(d=>d.listing_id===l.id&&db.contracts.some(c=>c.deal_id===d.id)));
 const r=db.registrationRequests.find(r=>r.resulting_property_id===listing.property_id);
 await page.addInitScript(data=>localStorage.setItem('farda-crm-sample',JSON.stringify(data)),{db,schemaVersion,actorId:'u1'});
 await page.goto(`/requests/${r.id}?casePanel=history`);
 const modal=page.getByRole('dialog',{name:'سوابق پرونده',exact:true});
 for(const title of ['بازدیدهای این ملک','مذاکرات این ملک','قراردادهای این ملک']){
  const section=modal.getByRole('region',{name:title,exact:true});await expect(section).toBeVisible();await expect(section.locator('article').first()).toContainText('متقاضی:');await expect(section).toContainText(listing.code);
 }
 const current=page.locator('.property-journey [aria-current="step"]');
 await modal.getByRole('button',{name:'بستن',exact:true}).click();
 await expect(current.locator('.journey-current-marker')).toBeVisible();await expect(current.getByText('مرحله فعلی',{exact:true})).toHaveCount(0);
});

test('manager changes dossier status with reason and can reopen; stages have no hover movement',async({page})=>{
 let db=createSeed();db=operate(db,'u2','createLead',{lead_type:'PROPERTY',management_scope_id:'s1',initial_contact_name:'پرونده تعیین تکلیف',initial_contact_phone:'09123456789'});const id=db._result.id;
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u2'});
 await page.goto(`/requests/${id}`);
 const step=page.locator('.property-journey button').first();const before=await step.evaluate(el=>({transform:getComputedStyle(el).transform,background:getComputedStyle(el).backgroundColor}));await step.hover();
 expect(await step.evaluate(el=>({transform:getComputedStyle(el).transform,background:getComputedStyle(el).backgroundColor}))).toEqual(before);
 await page.getByRole('button',{name:'وضعیت پرونده',exact:true}).click();const modal=page.getByRole('dialog',{name:'وضعیت پرونده',exact:true});
 await expect(modal).toBeVisible();await page.reload();await expect(modal).toBeVisible();
 await modal.getByLabel('دلیل تغییر وضعیت *').fill('پایان رسیدگی به درخواست مالک');await modal.getByRole('button',{name:'بستن پرونده',exact:true}).click();
 await expect(modal).toHaveCount(0);await expect(page.locator('.flow-current')).toContainText('پرونده بسته شده');
 await page.getByRole('button',{name:'وضعیت پرونده',exact:true}).click();await modal.getByLabel('دلیل تغییر وضعیت *').fill('درخواست مجدد مالک');await modal.getByRole('button',{name:'بازگشایی برای رسیدگی',exact:true}).click();
 await expect(modal).toHaveCount(0);await expect(page.locator('.flow-current')).toContainText('مشاور مسئول و موعد رسیدگی را مشخص کنید');
 await page.goto('/requests');await expect(page.locator('.requests-list-intro').getByRole('link',{name:'ثبت جدید',exact:true})).toHaveCount(0);
});

test('list opens dossier history and status without leaving filters or pagination',async({page})=>{
 const db=createSeed();
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u1'});
 await page.goto('/requests?p=2');
 const original=page.url();const card=page.locator('.request-flow-card').first();
 await card.getByRole('button',{name:'سوابق',exact:true}).click();
 const history=page.getByRole('dialog',{name:'سوابق پرونده',exact:true});
 await expect(history).toBeVisible();expect(new URL(page.url()).pathname).toBe('/requests');
 await page.reload();await expect(history).toBeVisible();
 await history.getByRole('button',{name:'بستن',exact:true}).click();await expect(page).toHaveURL(original);
 await card.getByRole('button',{name:'وضعیت ملک',exact:true}).click();
 const status=page.getByRole('dialog',{name:'وضعیت پرونده',exact:true});await expect(status).toBeVisible();
 expect(new URL(page.url()).searchParams.get('p')).toBe('2');
 await status.getByRole('button',{name:'بستن',exact:true}).click();await expect(page).toHaveURL(original);
 await page.setViewportSize({width:375,height:812});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

for(const actorId of ['u1','u2'])test(`manager ${actorId} assigns task and followup to dossier consultant from list modal`,async({page})=>{
 const db=createSeed();const r=db.registrationRequests.find(r=>r.assigned_to_id&&r.status==='IN_PROGRESS'&&r.management_scope_id==='s1');
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId});
 await page.goto('/requests?p=1');await page.getByPlaceholder('جست‌وجو در کد، نام و توضیحات…').fill(r.code);
 const original=page.url();
 await page.locator('.request-flow-card').filter({hasText:r.code}).getByRole('button',{name:'پیگیری کار',exact:true}).click();
 const work=page.getByRole('dialog',{name:'کارها و پیگیری‌های پرونده',exact:true});await expect(work).toBeVisible();
 for(const kind of ['کار','پیگیری']){
  await work.getByRole('button',{name:`ثبت ${kind}`,exact:true}).click();
  const form=page.getByRole('dialog',{name:`ثبت ${kind}`,exact:true});
  await expect(form.locator('select[name="'+(kind==='کار'?'assigned_to_id':'consultant_id')+'"]')).toHaveValue(r.assigned_to_id);
  if(kind==='کار')await form.getByLabel('عنوان کار *').fill('کار مدیر برای مشاور');
  else {await form.getByLabel('موضوع پیگیری *').fill('پیگیری مدیر برای مشاور');await form.getByLabel('اقدام بعدی *').fill('تماس با مالک');}
  await form.getByRole('button',{name:kind==='کار'?'انتخاب تاریخ مهلت انجام کار *':'انتخاب تاریخ زمان پیگیری *'}).click();
  await selectOption(page.getByLabel('سال تقویم'),'1406');await selectOption(page.getByLabel('ماه تقویم'),'1');await page.getByRole('button',{name:'روز ۱۵',exact:true}).click();
  await form.getByRole('button',{name:'ثبت اطلاعات',exact:true}).click();await expect(form).toHaveCount(0);await expect(work).toBeVisible();
 }
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('farda-crm-sample')).db);
 expect(stored.tasks.find(t=>t.title==='کار مدیر برای مشاور')).toMatchObject({assigned_to_id:r.assigned_to_id,subject_id:r.id});
 expect(stored.followUps.find(t=>t.notes==='پیگیری مدیر برای مشاور')).toMatchObject({consultant_id:r.assigned_to_id,subject_id:r.id});
 await page.reload();await expect(work).toBeVisible();await expect(work).toContainText('کار مدیر برای مشاور');await expect(work).toContainText('پیگیری مدیر برای مشاور');
 await work.getByRole('button',{name:'بستن',exact:true}).click();await expect(page).toHaveURL(original);
});
test('property list always shows all seven stage filters and pending intake dossiers',async({page})=>{
 let db=createSeed();db=operate(db,'u2','createLead',{lead_type:'PROPERTY',management_scope_id:'s1',initial_contact_name:'ملک منتظر ارجاع',initial_contact_phone:'09123456789'});
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u1'});
 await page.goto('/requests');const filters=page.getByRole('group',{name:'فیلتر مرحله پرونده',exact:true});
 for(const title of ['ثبت سرنخ','پذیرش مدیر','ارجاع','پذیرش مشاور','کارشناسی ملک','تأیید ملک','فایل عرضه'])await expect(filters.getByRole('button',{name:new RegExp('^'+title+' ')})).toBeVisible();
 await filters.getByRole('button',{name:/^ارجاع /}).click();await expect(page.locator('.request-flow-card').filter({hasText:'ملک منتظر ارجاع'})).toBeVisible();
 await filters.getByRole('button',{name:/^ثبت سرنخ /}).click();await expect(page.locator('.request-flow-card')).toHaveCount(0);
});
