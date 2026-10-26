import {selectOption} from "./select-helper.js";
import {isoToJalaliInput} from "../src/services/jalali-date.js";
import { test, expect } from "@playwright/test";
async function drag(page, source, target) {
  await source.evaluate(el=>el.scrollIntoView({block:"center",inline:"nearest"}));
  const a = await source.boundingBox(),
    b = await target.boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 12, a.y + a.height / 2 + 12, {
    steps: 3,
  });
  await page.mouse.move(b.x + b.width / 2, b.y + 50, { steps: 12 });
  await page.mouse.up();
}
test("کاریز مراحل سرنخ را ندارد و انتقال نامعتبر را رد می‌کند", async ({
  page,
}) => {
  await page.goto("/pipelines?pipeline=requests&scope=s1");
  await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u4");
  await expect(page.locator('[data-stage="NEW"]')).toHaveCount(0);
  await expect(page.locator('[data-stage="ASSIGNED"]')).toHaveCount(0);
  for(const status of ['COMPLETED','CANCELLED','DUPLICATE'])await expect(page.locator(`[data-stage="${status}"]`)).toHaveCount(0);
  const card = page.locator('[data-stage="IN_PROGRESS"] .kanban-card').first();
  const handle = card.getByRole("button", { name: "کشیدن کارت" });
  await drag(page, handle, page.locator('[data-stage="CHANGES_REQUIRED"]'));
  await expect(page.getByRole("alert")).toContainText("این انتقال مستقیم مجاز نیست");
  await expect(page).toHaveURL(/pipelines/);
});

test("انتقال معتبر کارت توسط مسئول پرونده فرم کارشناسی را باز می‌کند", async ({page}) => {
  await page.goto("/pipelines?pipeline=requests&scope=s1");
  await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u5");
  await drag(page, page.locator('[data-stage="CHANGES_REQUIRED"] .kanban-card').first().getByRole("button",{name:"کشیدن کارت"}), page.locator('[data-stage="IN_PROGRESS"]'));
  await expect(page).toHaveURL(/requests\/.*action=workspace/);
  await expect(page.getByRole("dialog", {name:"کارشناسی و تکمیل پرونده",exact:true})).toBeVisible();
});

test("شروع جست‌وجوی متقاضی از دکمه و بدون کشیدن کارت ممکن است", async ({
  page,
}) => {
  await page.goto("/inquiries/i6");
  await page
    .getByRole("button", { name: "شروع جست‌وجوی فایل", exact: true })
    .click();
  await page
    .getByLabel("اقدام بعدی *", { exact: true })
    .fill("تطبیق فایل‌های فعال");
  await page
    .getByLabel("موعد اقدام بعدی *", { exact: true })
    .fill(isoToJalaliInput("2030-01-01T10:00:00+03:30", true));
  await page.getByRole("button", { name: "ثبت اطلاعات", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText("تطبیق", { exact: true })).toBeVisible();
});

test('پایان‌یافته‌ها در فهرست می‌مانند و کارشناسی مجدد همان پرونده را به کاریز برمی‌گرداند',async({page})=>{
 await page.goto('/requests');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');
 await selectOption(page.getByLabel('وضعیت پرونده'),'COMPLETED');
 await expect(page).toHaveURL(/status=COMPLETED/);
 await expect(page.locator('a[href="/requests/r2"]').first()).toBeVisible();
 await page.goto('/pipelines?pipeline=requests&scope=s1');
 await expect(page.locator('.kanban-card a[href="/requests/r2"]')).toHaveCount(0);
 for(const status of ['COMPLETED','CANCELLED','DUPLICATE'])await expect(page.locator(`[data-stage="${status}"]`)).toHaveCount(0);
 await page.goto('/requests/r2');
 await page.getByRole('button',{name:'درخواست کارشناسی مجدد',exact:true}).click();
 await page.getByLabel('دلیل کارشناسی مجدد *').fill('تغییر وضعیت ملک؛ نیاز به بازدید مجدد');
 await page.getByRole('button',{name:'ثبت درخواست کارشناسی مجدد',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(page).toHaveURL(/requests\/r2$/);
 await page.getByText('سوابق کارشناسی مجدد',{exact:false}).click();
 await expect(page.getByText('گزارش کارشناسی قبلی:',{exact:false})).toBeVisible();
 await page.goto('/pipelines?pipeline=requests&scope=s1');
 await expect(page.locator('[data-stage="CHANGES_REQUIRED"] a[href="/requests/r2"]').first()).toBeVisible();
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u5');
 await page.goto('/tasks');
 await expect(page.locator('article').filter({hasText:'کارشناسی مجدد پرونده'}).locator('a[href="/requests/r2"]')).toBeVisible();
 await page.goto('/requests/r2');
 await expect(page.getByRole('button',{name:'کارشناسی و تکمیل پرونده',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'درخواست کارشناسی مجدد',exact:true})).toHaveCount(0);
});

test('کاریز مدیریتی سرنخ را نشان می‌دهد؛ کاریز مشاور فقط عملیات خودش و کارت‌های کوچک دارد',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('/');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await page.goto('/lead-submit');
 await page.getByLabel('نام تماس‌گیرنده *').fill('سرنخ ویژه کاریز مدیر');
 await page.getByLabel('شماره تماس *').fill('09126667788');
 await page.getByRole('button',{name:'ثبت سرنخ و ایجاد پرونده'}).click();
 await expect(page).toHaveURL(/submitted=/);
 const id=new URL(page.url()).searchParams.get('submitted');
 await page.goto('/pipelines?pipeline=requests');
 for(const stage of ['LEAD_RECEPTION','LEAD_READY','ASSIGNMENT_PENDING'])await expect(page.locator(`[data-stage="${stage}"]`)).toHaveCount(0);
 await expect(page.locator(`.kanban-card a[href="/requests/${id}"]`)).toHaveCount(0);
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');
 const column=page.locator('[data-stage="LEAD_RECEPTION"]');
 const card=column.locator('.kanban-card').filter({has:page.locator(`a[href="/requests/${id}"]`)});
 await expect(card).toBeVisible();await expect(card).toContainText('ثبت‌کننده: سارا محمدی');
 const box=await card.boundingBox(),col=await column.boundingBox();
 expect(box.width).toBeLessThan(280);expect(box.height).toBeLessThan(260);expect(col.width).toBeLessThan(290);
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u3');
 await expect(page.locator(`.kanban-card a[href="/requests/${id}"]`)).toHaveCount(0);
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u1');
 await expect(page.locator(`.kanban-card a[href="/requests/${id}"]`).first()).toBeVisible();
});

test('مدیر احتمال تکراری را بررسی و پرونده را بدون حذف به پرونده اصلی متصل می‌کند',async({page})=>{
 await page.goto('/');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await page.goto('/lead-submit');
 // The caller already belongs to an accessible case. This is only a candidate warning.
 await page.getByLabel('نام تماس‌گیرنده *').fill('ثبت دوباره ملک موجود');
 const phone=await page.evaluate(()=>JSON.parse(localStorage.getItem('farda-crm-sample')).db.contactPhones.find(p=>p.contact_id==='c1').phone_number);
 await page.getByLabel('شماره تماس *').fill(phone);
 await page.getByRole('button',{name:'ثبت سرنخ و ایجاد پرونده'}).click();
 await expect(page).toHaveURL(/submitted=/);const id=new URL(page.url()).searchParams.get('submitted');
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');await page.goto(`/requests/${id}`);
 await page.getByRole('button',{name:'بررسی احتمال تکراری',exact:true}).click();
 await selectOption(page.getByLabel('پرونده اصلی *'),'r1');
 await page.getByLabel('دلیل تکراری بودن *').fill('مشخصات با ملک پرونده اصلی تطبیق داده شد');
 await page.getByRole('button',{name:'تأیید تکراری بودن پرونده',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(page.getByRole('link',{name:'مشاهده پرونده اصلی ←'})).toBeVisible();
 await expect(page.getByRole('button',{name:'پذیرش سرنخ',exact:true})).toHaveCount(0);
 await page.goto('/requests?status=DUPLICATE');await expect(page.locator(`a[href="/requests/${id}"]`).first()).toBeVisible();
 await page.goto('/pipelines?pipeline=requests');await expect(page.locator(`.kanban-card a[href="/requests/${id}"]`)).toHaveCount(0);
});

for(const [route,width] of [['/pipelines?pipeline=requests',1100],['/requests?view=board',1100],['/pipelines?pipeline=requests',390]])test(`فلش‌های کاریز در بالا و میانه صفحه قابل استفاده‌اند — ${route} — ${width}`,async({page})=>{
 await page.setViewportSize({width,height:650});
 await page.goto('/');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');await page.goto(route);
 const left=page.getByRole('button',{name:'حرکت کاریز به چپ',exact:true}),right=page.getByRole('button',{name:'حرکت کاریز به راست',exact:true});
 const board=page.locator('.kanban');
 await expect(left).toBeEnabled();await expect(right).toBeDisabled();
 const start=await board.evaluate(el=>el.scrollLeft);
 await left.click();await expect.poll(()=>board.evaluate(el=>el.scrollLeft)).toBeLessThan(start-10);
 await expect(right).toBeEnabled();
 await page.locator('.main-shell').evaluate(el=>{el.scrollTop=450;});
 const controls=page.getByRole('group',{name:'جابه‌جایی افقی کاریز'});
 await expect(controls).toBeVisible();
 const box=await controls.boundingBox();expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThan(650);
 await right.click();await expect.poll(()=>board.evaluate(el=>el.scrollLeft)).toBeGreaterThan(-10);
});
