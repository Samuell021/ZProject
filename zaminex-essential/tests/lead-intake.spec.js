import {test,expect} from '@playwright/test';
import {selectOption} from './select-helper.js';
test('مشاور فقط ثبت می‌کند؛ سرنخ ابتدا در پذیرش و کارهای من است و با تأیید به سرنخ‌ها می‌رود؛ ارجاع توضیح اجباری ندارد',async({page})=>{
 await page.goto('/');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await page.getByRole('button',{name:'سرنخ و پرونده‌ها',exact:true}).click();
 for(const name of ['سرنخ‌ها','گروه‌ها و سطح دسترسی','گزارش‌ها','صف بررسی','کارکنان'])await expect(page.locator('aside').getByRole('link',{name,exact:true})).toHaveCount(0);
 await page.locator('aside').getByRole('link',{name:'ثبت سرنخ',exact:true}).click();
 await page.getByLabel('نام تماس‌گیرنده *').fill('سرنخ ثبت‌شده توسط مشاور');
 await page.getByLabel('شماره تماس *').fill('09123456789');
 await expect(page.getByLabel('رنج مسئول *')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'پذیرش سرنخ',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'ثبت سرنخ و ایجاد پرونده'}).click();
 await expect(page.getByRole('heading',{name:'سرنخ برای پذیرش مدیر رنج ثبت شد'})).toBeVisible();
 const id=new URL(page.url()).searchParams.get('submitted');
 await page.goto(`/requests/${id}?action=assign`);await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.goto('/tasks');await expect(page.locator(`a[href="/requests/${id}"]`)).toHaveCount(0);
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');
 await page.goto('/tasks');
 const receptionTask=page.locator('article').filter({has:page.locator(`a[href="/requests/${id}"]`)});
 await expect(receptionTask).toBeVisible();
 await expect(receptionTask).toContainText('ثبت‌کننده سرنخ: سارا محمدی');
 await page.goto('/leads?state=ALL');
 await expect(page.locator('article').filter({hasText:'سرنخ ثبت‌شده توسط مشاور'})).toHaveCount(0);
 await page.goto('/inbox');
 const lead=page.locator('article').filter({hasText:'سرنخ ثبت‌شده توسط مشاور'});
 await expect(lead).toContainText('ثبت‌کننده سرنخ: سارا محمدی');
 await lead.getByRole('button',{name:'پذیرش سرنخ',exact:true}).click();
 await expect(page).toHaveURL(/leads/);
 await expect(page.locator('article').filter({hasText:'سرنخ ثبت‌شده توسط مشاور'})).toBeVisible();
 await page.locator(`a[href="/requests/${id}"]`).first().click();
 await page.getByRole('button',{name:'ارجاع به کارشناس',exact:true}).click();
 await selectOption(page.getByLabel('مشاور رنج پرونده *'),'u5');
 await page.getByRole('button',{name:'انتخاب تاریخ موعد تکمیل *'}).click();
 await selectOption(page.getByLabel('سال تقویم'),'1406');await selectOption(page.getByLabel('ماه تقویم'),'1');
 await page.getByRole('button',{name:'روز ۱۵',exact:true}).click();
 await expect(page.getByLabel('توضیحات ارجاع (اختیاری)')).not.toHaveAttribute('required','');
 await page.getByRole('button',{name:'ثبت اطلاعات',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.goto('/leads?state=ALL');await expect(page.locator('article').filter({hasText:'سرنخ ثبت‌شده توسط مشاور'})).toBeVisible();
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u5');await page.goto('/inbox');
 await expect(page.locator('article').filter({hasText:'سرنخ ثبت‌شده توسط مشاور'})).toBeVisible();
 await page.locator('article').filter({hasText:'سرنخ ثبت‌شده توسط مشاور'}).getByRole('button',{name:'تأیید و شروع کارشناسی',exact:true}).click();
 await expect(page.locator('article').filter({hasText:'سرنخ ثبت‌شده توسط مشاور'})).toHaveCount(0);
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');await page.goto('/leads?state=ALL');
 await expect(page.locator('article').filter({hasText:'سرنخ ثبت‌شده توسط مشاور'})).toHaveCount(0);
});
test('منوی هر گروه فقط لینک‌های مجاز را حتی در بخش‌های بسته دارد',async({page})=>{
 await page.goto('/');
 for(const [actor,allowed,denied] of [
  ['u4',['lead-submit','inbox','tasks'],['leads','staff','groups','teams','reviews','reports','finance','settings','guide']],
  ['u2',['leads','staff','teams','reports'],['lead-submit','groups','finance','contracts','settings','guide']],
  ['u7',['contacts','deals','contracts'],['leads','lead-submit','requests','properties','inquiries','pipelines','reviews','teams','staff','groups','finance','reports','settings','guide']],
  ['u8',['finance','contracts','contacts'],['leads','lead-submit','requests','inquiries','deals','pipelines','reviews','teams','staff','groups','reports','settings','guide']],
 ]){
  await selectOption(page.getByLabel('ورود نمایشی با کاربر'),actor);
  for(const route of allowed)await expect(page.locator(`aside a[href="/${route}"]`)).toHaveCount(1);
  for(const route of denied)await expect(page.locator(`aside a[href="/${route}"]`)).toHaveCount(0);
 }
});

test('سرنخ ثبت‌شده مدیر رنج مستقیم آماده ارجاع است و پذیرش خود ندارد',async({page})=>{
 await page.goto('/');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');
 await page.goto('/leads?action=createLead');
 await page.getByLabel('نام تماس‌گیرنده *').fill('سرنخ مستقیم مدیر');
 await page.getByLabel('شماره تماس *').fill('09127778899');
 await selectOption(page.getByLabel('رنج مسئول *'),'s1');
 await page.getByRole('button',{name:'ثبت سرنخ و ایجاد پرونده'}).click();
 await expect(page).toHaveURL(/requests\//);
 const path=new URL(page.url()).pathname;
 await expect(page.getByRole('button',{name:'پذیرش سرنخ',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'ارجاع به کارشناس',exact:true})).toBeVisible();
 await page.goto('/inbox');await expect(page.locator('article').filter({hasText:'سرنخ مستقیم مدیر'})).toHaveCount(0);
 await page.goto('/tasks');await expect(page.locator(`a[href="${path}"]`)).toHaveCount(0);
 await page.goto('/leads');await expect(page.locator('article').filter({hasText:'سرنخ مستقیم مدیر'})).toBeVisible();
});

for(const width of [1440,390])test(`دکمه‌های پذیرش و انتقال در کارتابل و جزئیات فاصله دارند — ${width}`,async({page})=>{
 await page.setViewportSize({width,height:1000});
 await page.goto('/');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await page.goto('/lead-submit');
 await page.getByLabel('نام تماس‌گیرنده *').fill('آزمون فاصله اقدامات');
 await page.getByLabel('شماره تماس *').fill('09128889911');
 await page.getByRole('button',{name:'ثبت سرنخ و ایجاد پرونده'}).click();
 await expect(page).toHaveURL(/submitted=/);const id=new URL(page.url()).searchParams.get('submitted');
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');
 const separated=async(root)=>{
  const accept=root.getByRole('button',{name:'پذیرش سرنخ',exact:true});
  const transfer=root.getByRole('link',{name:'انتقال به رنج دیگر',exact:true}).or(root.getByRole('button',{name:'انتقال به رنج دیگر',exact:true}));
  await expect(accept).toBeVisible();await expect(transfer).toBeVisible();
  const a=await accept.boundingBox(),b=await transfer.boundingBox();
  const gap=Math.max(a.x-b.x-b.width,b.x-a.x-a.width,a.y-b.y-b.height,b.y-a.y-a.height);
  expect(gap).toBeGreaterThanOrEqual(8);
 };
 await page.goto('/inbox');
 await separated(page.locator('article').filter({hasText:'آزمون فاصله اقدامات'}));
 await page.goto('/tasks');await page.locator(`a[href="/requests/${id}"]`).click();
 await separated(page.locator('main'));
});

test('مشاور عنوان را فقط می‌خواند؛ توضیح سرنخ عنوان نیست و ثبت‌کننده هم برای مشاور نمایش ندارد',async({page})=>{
 await page.goto('/');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');
 await page.goto('/requests/r11');await page.getByRole('button',{name:'ویرایش عنوان ملک',exact:true}).click();
 await page.getByLabel('عنوان ملک *',{exact:true}).fill('عنوان تعیین‌شده مدیر رنج');
 await page.getByRole('button',{name:'ثبت اطلاعات',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await expect(page.getByText('ثبت‌کننده سرنخ:',{exact:false})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'ویرایش عنوان ملک',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'کارشناسی و تکمیل پرونده',exact:true}).click();
 await expect(page.getByLabel('عنوان ملک',{exact:true})).toHaveValue('عنوان تعیین‌شده مدیر رنج');
 await expect(page.getByLabel('عنوان ملک',{exact:true})).toHaveAttribute('readonly','');
});

test('تمدید فقط پس از پذیرش و انقضای موعد دیده می‌شود؛ ورود مستقیم زودهنگام هم باز نمی‌شود',async({page})=>{
 await page.goto('/');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await page.goto('/requests/r11');await expect(page.getByRole('button',{name:'درخواست تمدید مهلت',exact:true})).toHaveCount(0);
 await page.goto('/requests/r11?action=postponeAssignment');await expect(page.getByRole('dialog')).toHaveCount(0);
 const setState=async(state,status)=>{
  await page.evaluate(({state,status})=>{const saved=JSON.parse(localStorage.getItem('farda-crm-sample')),r=saved.db.registrationRequests.find(r=>r.id==='r11');r.acceptance_status=state;r.status=status;r.due_at=new Date(Date.now()-3600000).toISOString();localStorage.setItem('farda-crm-sample',JSON.stringify(saved));},{state,status});
  await page.goto('/requests/r11');
 };
 await setState('PENDING','ASSIGNED');await expect(page.getByRole('button',{name:'درخواست تمدید مهلت',exact:true})).toHaveCount(0);
 await setState('ACCEPTED','IN_PROGRESS');await expect(page.getByRole('button',{name:'درخواست تمدید مهلت',exact:true})).toBeVisible();
});
