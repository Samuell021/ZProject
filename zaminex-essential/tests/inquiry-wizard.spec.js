import {test,expect} from '@playwright/test';
import {selectOption} from './select-helper.js';
import {createSeed,schemaVersion} from '../src/mock/seed.js';
import {operate} from '../src/services/operations.js';
async function date(page,scope,label){
 await scope.getByRole('button',{name:'انتخاب تاریخ '+label}).click();await selectOption(page.getByLabel('سال تقویم'),'1406');await selectOption(page.getByLabel('ماه تقویم'),'1');await page.getByRole('button',{name:'روز ۱۵',exact:true}).click();
}
test('applicant wizard registers, assigns, saves needs, introduces listing, records viewing and negotiation in same dossier',async({page})=>{
 await page.goto('/inquiry-register');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await page.getByLabel('نام و نام خانوادگی متقاضی *').fill('متقاضی مسیر کامل');
 await page.getByLabel('شماره تماس متقاضی *').fill('09123334455');await page.getByRole('button',{name:'ادامه',exact:true}).click();
 await selectOption(page.getByLabel('نوع معامله مورد تقاضا *'),'sale');await page.getByLabel('شرح اولیه درخواست').fill('خرید آپارتمان');
 await page.getByRole('button',{name:'ادامه',exact:true}).click();await page.getByRole('button',{name:'ثبت درخواست و ادامه',exact:true}).click();
 await expect(page).toHaveURL(/inquiries\//);const original=new URL(page.url()).pathname;
 await expect(page.locator('.flow-current')).toContainText('منتظر پذیرش مدیر رنج');
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');
 await page.getByRole('button',{name:'پذیرش درخواست و ادامه',exact:true}).click();
 await selectOption(page.getByLabel('مشاور رنج پرونده *'),'u4');await date(page,page,'موعد تکمیل *');
 await page.getByRole('button',{name:'ثبت اطلاعات',exact:true}).click();
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await page.getByRole('button',{name:'پذیرش و شروع رسیدگی',exact:true}).click();
 await expect(page.getByRole('heading',{name:'تکمیل نیاز',exact:true})).toBeVisible();
 await page.getByLabel('حداقل متراژ',{exact:true}).fill('50');await page.getByLabel('حداکثر بودجه خرید (تومان)').fill('90000000000');
 await page.getByRole('button',{name:'ذخیره نیاز و ادامه',exact:true}).click();
 await page.getByRole('button',{name:'انتخاب و معرفی دستی فایل عرضه',exact:true}).click();
 const manual=page.getByRole('dialog',{name:'معرفی دستی فایل عرضه',exact:true});
 await manual.getByRole('button',{name:'انتخاب فایل',exact:true}).first().click();
 await manual.getByRole('button',{name:'ثبت معرفی به متقاضی',exact:true}).click();await expect(manual).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'معرفی فایل',exact:true})).toBeVisible();
 const introductions=page.locator('.flow-current').getByRole('region',{name:'فایل‌های معرفی‌شده؛ انتخاب برای بازدید',exact:true});
 await expect(introductions.locator('article')).toHaveCount(1);
 await introductions.getByRole('button',{name:'ثبت بازدید',exact:true}).click();
 const history=page.getByRole('dialog',{name:'سوابق پرونده',exact:true});
 const schedule=page.getByRole('dialog',{name:'برنامه‌ریزی بازدید',exact:true});
 await date(page,schedule,'زمان بازدید *');await schedule.getByRole('button',{name:'ثبت بازدید',exact:true}).click();await expect(schedule).toHaveCount(0);await expect(page.locator('.flow-current h2')).toHaveText('بازدید');
 const result=page.getByRole('dialog',{name:'ثبت نتیجه بازدید',exact:true});
 await expect(result).toHaveCount(0);
 await expect(page.locator('.flow-current').getByRole('region',{name:'انتخاب فایل معرفی‌شده برای بازدید',exact:true}).locator('article')).toHaveCount(0);
 const viewing=page.locator('.flow-current').getByRole('region',{name:'بازدیدهای متقاضی',exact:true}).locator('article');
 await expect(viewing).toHaveCount(1);await viewing.getByRole('button',{name:'ثبت نتیجه بازدید',exact:true}).click();
 await selectOption(result.getByLabel('نظر متقاضی پس از بازدید *'),'INTERESTED');await result.getByLabel('گزارش و نتیجه بازدید *').fill('ملک مناسب بود');await result.getByRole('button',{name:'ثبت نتیجه',exact:true}).click();
 await expect(result).toHaveCount(0);await page.getByRole('button',{name:'سوابق',exact:true}).click();await expect(history.getByRole('button',{name:'شروع مذاکره',exact:true})).toBeVisible();await expect(page.locator('.flow-current h2')).toHaveText('بازدید');await page.reload();await expect(page.locator('.flow-current h2')).toHaveText('بازدید');
 await history.getByRole('button',{name:'شروع مذاکره',exact:true}).click();
 const start=page.getByRole('dialog',{name:'شروع مذاکره',exact:true});await page.reload();await expect(start).toBeVisible();await start.getByRole('button',{name:'شروع مذاکره',exact:true}).click();
 await history.getByRole('button',{name:'ثبت نتیجه مذاکره',exact:true}).click();const deal=page.getByRole('dialog',{name:'ثبت نتیجه مذاکره',exact:true});await deal.getByLabel('توضیحات توافق *').fill('توافق اولیه طرفین');await deal.getByRole('button',{name:'ثبت نتیجه',exact:true}).click();
 await expect(history).toContainText('در انتظار تنظیم قرارداد توسط مدیرکل');await expect(history.getByRole('button',{name:'تنظیم قرارداد',exact:true})).toHaveCount(0);
 await history.getByRole('button',{name:'بستن',exact:true}).click();expect(new URL(page.url()).pathname).toBe(original);
 await page.goto('/inquiries');await expect(page.getByLabel('آخرین پرونده مشاهده‌شده')).toContainText('متقاضی مسیر کامل');
});
for(const actorId of ['u1','u2'])test(`inquiry list work, history and lifecycle remain in place for ${actorId}`,async({page})=>{
 const db=createSeed();const r=db.inquiries.find(r=>r.assigned_to_id==='u4'&&!['COMPLETED','CANCELLED'].includes(r.status));r.acceptance_status='ACCEPTED';r.status='SEARCHING';
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId});
 await page.goto('/inquiries?search='+r.code);const original=page.url();
 const card=page.locator('.request-flow-card').filter({hasText:r.code});
 await card.getByRole('button',{name:'پیگیری کار',exact:true}).click();const work=page.getByRole('dialog',{name:'کارها و پیگیری‌های پرونده',exact:true});
 await work.getByRole('button',{name:'ثبت کار',exact:true}).click();const form=page.getByRole('dialog',{name:'ثبت کار',exact:true});
 await expect(form.locator('select[name="assigned_to_id"]')).toHaveValue('u4');await form.getByLabel('عنوان کار *').fill('هماهنگی برای متقاضی');await date(page,form,'مهلت انجام کار *');await form.getByRole('button',{name:'ثبت اطلاعات',exact:true}).click();await expect(form).toHaveCount(0);await expect(work).toContainText('هماهنگی برای متقاضی');
 await work.getByRole('button',{name:'ثبت پیگیری',exact:true}).click();const follow=page.getByRole('dialog',{name:'ثبت پیگیری',exact:true});
 await expect(follow.locator('select[name="consultant_id"]')).toHaveValue('u4');await follow.getByLabel('موضوع پیگیری *').fill('پیگیری نیاز متقاضی');await follow.getByLabel('اقدام بعدی *').fill('تماس برای بازدید');await date(page,follow,'زمان پیگیری *');await follow.getByRole('button',{name:'ثبت اطلاعات',exact:true}).click();await expect(follow).toHaveCount(0);await expect(work).toContainText('پیگیری نیاز متقاضی');
 await work.getByRole('button',{name:'بستن',exact:true}).click();await expect(page).toHaveURL(original);
 await card.getByRole('button',{name:'سوابق',exact:true}).click();const history=page.getByRole('dialog',{name:'سوابق پرونده',exact:true});await page.reload();await expect(history).toBeVisible();await expect(history.getByRole('region',{name:'فایل‌های معرفی‌شده'})).toBeVisible();await history.getByRole('button',{name:'بستن',exact:true}).click();
 await card.getByRole('button',{name:'وضعیت درخواست',exact:true}).click();const status=page.getByRole('dialog',{name:'وضعیت پرونده',exact:true});await status.getByLabel('دلیل تغییر وضعیت *').fill('درخواست متقاضی پایان یافت');await status.getByRole('button',{name:'بستن پرونده',exact:true}).click();await expect(status).toHaveCount(0);await expect(card).toContainText('بسته');
 await page.setViewportSize({width:375,height:812});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
test('future stages cannot introduce files before acceptance and needs; unrelated history is inaccessible',async({page})=>{
 let db=createSeed();db=operate(db,'u2','createLead',{lead_type:'INQUIRY',management_scope_id:'s1',initial_contact_name:'درخواست قبل ارجاع',initial_contact_phone:'09123456789',deal_type_id:'sale'});const id=db._result.id;
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u4'});
 await page.goto(`/inquiries/${id}?stage=matching&manualListing=select`);await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.getByRole('button',{name:'معرفی به متقاضی',exact:true})).toHaveCount(0);
 await page.goto(`/inquiries?historyCase=${id}`);await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('a second listing can be introduced while another listing awaits viewing',async({page})=>{
 let db=createSeed();db=operate(db,'u2','createLead',{lead_type:'INQUIRY',management_scope_id:'s1',initial_contact_name:'متقاضی چند فایل',initial_contact_phone:'09123456789',deal_type_id:'sale'});const id=db._result.id;
 db=operate(db,'u2','assignCase',{collection:'inquiries',id,assigned_to_id:'u4',due_at:'2030-01-01T10:00:00Z'});db=operate(db,'u4','acceptAssignment',{collection:'inquiries',id});
 db=operate(db,'u4','saveInquiryNeeds',{id,preferences:[{deal_type_id:'sale'}]});
 const listing=db.listings.find(l=>l.status==='ACTIVE'&&l.review_status==='APPROVED');
 db=operate(db,'u4','introduceListing',{inquiry_id:id,listing_id:listing.id});
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u4'});
 await page.goto(`/inquiries/${id}?stage=matching`);
 await page.getByRole('button',{name:'انتخاب و معرفی دستی فایل عرضه',exact:true}).click();
 const manual=page.getByRole('dialog',{name:'معرفی دستی فایل عرضه',exact:true});
 await manual.getByRole('button',{name:'انتخاب فایل',exact:true}).first().click();await manual.getByRole('button',{name:'ثبت معرفی به متقاضی',exact:true}).click();await expect(manual).toHaveCount(0);
 await page.getByRole('button',{name:'سوابق',exact:true}).click();
 await expect(page.getByRole('region',{name:'فایل‌های معرفی‌شده',exact:true}).locator('article')).toHaveCount(2);
});
test('applicant list always shows all nine stage filters including empty stages and intake dossiers',async({page})=>{
 let db=createSeed();db=operate(db,'u2','createLead',{lead_type:'INQUIRY',management_scope_id:'s1',initial_contact_name:'متقاضی منتظر ارجاع',initial_contact_phone:'09123456789',deal_type_id:'sale'});
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u1'});
 await page.goto('/inquiries');
 const filters=page.getByRole('group',{name:'فیلتر مرحله پرونده',exact:true});
 for(const title of ['ثبت درخواست','پذیرش مدیر','ارجاع','پذیرش مشاور','تکمیل نیاز','معرفی فایل','بازدید','مذاکره','قرارداد'])await expect(filters.getByRole('button',{name:new RegExp('^'+title+' ')})).toBeVisible();
 await filters.getByRole('button',{name:/^ارجاع /}).click();await expect(page.locator('.request-flow-card').filter({hasText:'متقاضی منتظر ارجاع'})).toBeVisible();
 await filters.getByRole('button',{name:/^ثبت درخواست /}).click();await expect(filters.getByRole('button',{name:/^ثبت درخواست /})).toHaveAttribute('aria-pressed','true');await expect(page.locator('.request-flow-card')).toHaveCount(0);
});
test('paused introduced file stays in introduction stage with an explanation instead of a missing action',async({page})=>{
 const db=createSeed();await page.addInitScript(data=>localStorage.setItem('farda-crm-sample',JSON.stringify(data)),{db,schemaVersion,actorId:'u5'});
 await page.goto('/inquiries/i10?casePanel=history');
 await expect(page.locator('.flow-current h2')).toHaveText('معرفی فایل');
 const row=page.getByRole('region',{name:'فایل‌های معرفی‌شده',exact:true}).locator('article').filter({hasText:'L-1010'});
 await expect(row.getByRole('status')).toContainText('تکمیل یا تأیید');
 await expect(row.getByRole('link',{name:'پیگیری وضعیت ملک و عرضه',exact:false})).toHaveAttribute('href','/requests/r10');
 await expect(row.getByRole('button',{name:'برنامه‌ریزی بازدید',exact:true})).toHaveCount(0);
});
test('stage lists select the exact introduction and completed viewing without moving every file into negotiation',async({page})=>{
 let db=createSeed();db=operate(db,'u2','createLead',{lead_type:'INQUIRY',management_scope_id:'s1',initial_contact_name:'متقاضی انتخاب مسیر',initial_contact_phone:'09123456789',deal_type_id:'sale'});const id=db._result.id;
 db=operate(db,'u2','assignCase',{collection:'inquiries',id,assigned_to_id:'u4',due_at:'2030-01-01T10:00:00Z'});db=operate(db,'u4','acceptAssignment',{collection:'inquiries',id});db=operate(db,'u4','saveInquiryNeeds',{id,preferences:[{deal_type_id:'sale'}]});
 const listings=db.listings.filter(l=>l.status==='ACTIVE'&&l.review_status==='APPROVED').slice(0,2);const viewIds=[];
 for(const [index,l] of listings.entries()){
  db=operate(db,'u4','introduceListing',{inquiry_id:id,listing_id:l.id});const introId=db._result.id;
  db=operate(db,'u4','scheduleViewing',{introduction_id:introId,scheduled_at:'2099-01-01T10:00:00Z'});viewIds.push(db._result.id);
  db=operate(db,'u4','completeViewing',{id:viewIds[index],interest:index===0?'INTERESTED':'NOT_INTERESTED',outcome:index===0?'مناسب مذاکره':'نامناسب'});
 }
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u4'});
 await page.goto(`/inquiries/${id}`);
 await expect(page.locator('.flow-current h2')).toHaveText('بازدید');
 await expect(page.locator('.flow-current').getByRole('region',{name:'بازدیدهای متقاضی',exact:true}).locator('article')).toHaveCount(2);
 await page.getByRole('navigation',{name:'مسیر درخواست متقاضی'}).getByRole('button',{name:'مذاکره',exact:false}).click();
 const choices=page.locator('.flow-current').getByRole('region',{name:'انتخاب بازدید برای شروع مذاکره',exact:true});
 await expect(choices.locator('article')).toHaveCount(1);await expect(choices).toContainText(listings[0].code);
 await choices.getByRole('button',{name:'شروع مذاکره',exact:true}).click();
 const form=page.getByRole('dialog',{name:'شروع مذاکره',exact:true});await expect(form).toContainText(listings[0].code);await form.getByRole('button',{name:'شروع مذاکره',exact:true}).click();await expect(form).toHaveCount(0);
 await expect(page.locator('.flow-current').getByRole('region',{name:'مذاکرات ثبت‌شده',exact:true}).locator('article')).toHaveCount(1);
 await page.reload();await expect(page.locator('.flow-current h2')).toHaveText('مذاکره');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('farda-crm-sample')).db);
 const deals=saved.deals.filter(d=>d.inquiry_id===id);expect(deals).toHaveLength(1);expect(deals[0].viewing_id).toBe(viewIds[0]);expect(deals[0].listing_id).toBe(listings[0].id);
 expect(saved.viewings.find(v=>v.id===viewIds[1]).interest).toBe('NOT_INTERESTED');
});
test('paused introduction can be removed with confirmation without deleting the property',async({page})=>{
 const db=createSeed();await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId:'u5'});
 await page.goto('/inquiries/i10?stage=matching');
 const list=page.locator('.flow-current').getByRole('region',{name:'فایل‌های معرفی‌شده؛ انتخاب برای بازدید',exact:true});
 const row=list.locator('article').filter({hasText:'L-1010'});await row.getByRole('button',{name:'حذف معرفی',exact:true}).click();
 const modal=page.getByRole('dialog',{name:'حذف معرفی',exact:true});await modal.getByRole('button',{name:'بستن',exact:true}).click();await expect(row).toHaveCount(1);
 await row.getByRole('button',{name:'حذف معرفی',exact:true}).click();await modal.getByRole('button',{name:'حذف معرفی',exact:true}).click();await expect(modal).toHaveCount(0);await expect(row).toHaveCount(0);
 await page.reload();await expect(row).toHaveCount(0);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('farda-crm-sample')).db);expect(saved.introductions.find(i=>i.id==='intro10').status).toBe('CANCELLED');expect(saved.properties).toHaveLength(db.properties.length);expect(saved.listings).toHaveLength(db.listings.length);
});
for(const actorId of ['u1','u4'])test(`contract stage lists successful negotiations and gates preparation for ${actorId}`,async({page})=>{
 const db=createSeed(),inquiry=db.inquiries.find(i=>i.id==='i1'),deal=db.deals.find(d=>d.id==='d1');
 Object.assign(inquiry,{status:'INTRODUCED',acceptance_status:'ACCEPTED',lead_status:'ACCEPTED',needs_status:'CONFIRMED'});deal.stage='AGREED';db.contracts=db.contracts.filter(c=>c.deal_id!==deal.id);
 db.deals.push({...deal,id:'contract-stage-lost',stage:'LOST',code:'LOST-EXCLUDE'});
 await page.addInitScript(data=>{if(!localStorage.getItem('farda-crm-sample'))localStorage.setItem('farda-crm-sample',JSON.stringify(data));},{db,schemaVersion,actorId});await page.goto('/inquiries/i1');
 await expect(page.locator('.flow-current h2')).toHaveText('قرارداد');const list=page.locator('.flow-current').getByRole('region',{name:'مذاکرات موفق؛ انتخاب برای تنظیم قرارداد',exact:true});await expect(list.locator('article')).toHaveCount(1);await expect(list).not.toContainText('LOST-EXCLUDE');
 const button=list.getByRole('button',{name:'تنظیم قرارداد',exact:true});
 if(actorId==='u1'){await button.click();await expect(page.getByRole('dialog',{name:'تنظیم قرارداد',exact:true})).toBeVisible();}else await expect(button).toHaveCount(0);
});
