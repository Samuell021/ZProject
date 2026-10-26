import { selectOption } from "./select-helper.js";
import { test, expect } from '@playwright/test';
test('سرنخ ملک، تقویم انتخابی و پذیرش فقط توسط مسئول', async ({
  page
}) => {
  await page.goto('/leads');
  await page.getByRole('button', {
    name: 'ثبت سرنخ',
    exact: true
  }).click();
  await selectOption(page.getByLabel('نوع سرنخ *'), 'PROPERTY');
  await page.getByLabel('نام تماس‌گیرنده *').fill('مالک سرنخ جدید');
  await page.getByLabel('شماره تماس *').fill('09121114444');
  await selectOption(page.getByLabel('رنج مسئول *'), 's1');
  await page.getByRole('button', {
    name: 'انتخاب تاریخ موعد اولیه'
  }).click();
  await expect(page.getByRole('group', {
    name: 'تقویم شمسی'
  })).toBeVisible();
  await page.getByRole('button', {
    name: 'امروز',
    exact: true
  }).click();
  await expect(page.getByLabel('موعد اولیه', {
    exact: true
  })).not.toHaveValue('');
  await page.getByRole('button', {
    name: 'ثبت سرنخ و ایجاد پرونده'
  }).click();
  await expect(page).toHaveURL(/requests\//);
  const casePath = new URL(page.url()).pathname;
  await expect(page.getByRole("button",{name:"پذیرش سرنخ",exact:true})).toHaveCount(0);
  
  await page.goto(casePath);
  await page.getByRole('button', {
    name: 'ارجاع به کارشناس',
    exact: true
  }).click();
  await selectOption(page.getByLabel('مشاور رنج پرونده *'), 'u4');
  await page.getByRole('button', {
    name: 'انتخاب تاریخ موعد تکمیل *'
  }).click();
  await selectOption(page.getByLabel('ماه تقویم'), '9');
  await page.getByRole('button', {
    name: 'روز ۱۵',
    exact: true
  }).click();
  await page.getByLabel('توضیحات ارجاع (اختیاری)').fill('بررسی ملک');
  await page.getByRole('button', {
    name: 'ثبت اطلاعات',
    exact: true
  }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await selectOption(page.getByLabel('ورود نمایشی با کاربر'), 'u4');
  await expect(page.locator('aside').getByText('کارکنان', {
    exact: true
  })).toHaveCount(0);
  await expect(page.getByRole('button', {
    name: 'ارجاع به کارشناس',
    exact: true
  })).toHaveCount(0);
  await page.goto('/inbox');
  const card = page.locator('article').filter({
    hasText: 'مالک سرنخ جدید'
  });
  await card.getByRole('button', {
    name: 'تأیید و شروع کارشناسی'
  }).click();
  await expect(card).toHaveCount(0);
  await selectOption(page.getByLabel('ورود نمایشی با کاربر'), 'u2');
  await page.goto('/leads?state=ALL');
  await expect(page.locator(`a[href="${casePath}"]`)).toHaveCount(0);
  await page.reload();
  await expect(page.locator(`a[href="${casePath}"]`)).toHaveCount(0);
  await page.goto('/requests?search=مالک سرنخ جدید');
  await expect(page.locator(`a[href="${casePath}"]`).first()).toBeVisible();
  await page.reload();
  await page.goto('/pipelines?pipeline=requests');
  await expect(page.locator('[data-stage="NEW"]')).toHaveCount(0);
  await expect(page.locator('[data-stage="ASSIGNED"]')).toHaveCount(0);
  await selectOption(page.getByLabel('ورود نمایشی با کاربر'), 'u4');
  await page.goto('/staff');
  await expect(page.getByText('دسترسی به این بخش برای گروه کاربری شما مجاز نیست.')).toBeVisible();
});
test('تاریخ پیگیری فعلاً ورودی قبلی را حفظ می‌کند', async ({
  page
}) => {
  await page.goto('/');
  await selectOption(page.getByLabel('ورود نمایشی با کاربر'), 'u4');
  await page.goto('/inquiries/i7?action=followup');
  await expect(page.getByLabel('زمان پیگیری *')).toBeEditable();
  await expect(page.getByRole('button', {
    name: 'انتخاب تاریخ زمان پیگیری *'
  })).toHaveCount(0);
});
test('گروه‌های منو با کلیک و صفحه‌کلید باز و بسته می‌شوند و انتخاب حفظ می‌شود', async ({
  page
}) => {
  await page.goto('/');
  const toggle = page.getByRole('button', {
    name: 'مدیریت کاربران و دسترسی',
    exact: true
  });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  const dimensions = await toggle.evaluate(el => ({
    button: el.getBoundingClientRect().width,
    group: el.parentElement.getBoundingClientRect().width,
    background: getComputedStyle(el).backgroundColor
  }));
  expect(dimensions.button / dimensions.group).toBeGreaterThan(0.95);
  expect(dimensions.background).not.toBe('rgb(23, 101, 82)');
  await expect(page.locator('aside').getByRole('link', {
    name: 'کارکنان',
    exact: true
  })).toBeVisible();
  await page.reload();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('aside').getByRole('link', {
    name: 'کارکنان',
    exact: true
  })).toBeHidden();
});
test('سرنخ متقاضی، رد و ارجاع مجدد با حفظ سابقه', async ({
  page
}) => {
  await page.goto('/leads?action=createLead&type=INQUIRY');
  await page.getByLabel('نام تماس‌گیرنده *').fill('متقاضی پذیرش');
  await page.getByLabel('شماره تماس *').fill('09123334444');
  await selectOption(page.getByLabel('رنج مسئول *'), 's1');
  await selectOption(page.getByLabel('نوع معامله مورد تقاضا *'), 'sale');
  await page.getByRole('button', {
    name: 'ثبت سرنخ و ایجاد پرونده'
  }).click();
  await expect(page).toHaveURL(/inquiries\//);
  const url = page.url();
  await expect(page.getByRole("button",{name:"پذیرش سرنخ",exact:true})).toHaveCount(0);
  
  await page.goto(url);
  await page.getByRole('button', {
    name: 'ارجاع به کارشناس',
    exact: true
  }).click();
  await selectOption(page.getByLabel('مشاور رنج پرونده *'), 'u4');
  await page.getByRole('button', {
    name: 'انتخاب تاریخ موعد تکمیل *'
  }).click();
  await selectOption(page.getByLabel('سال تقویم'), '1406');
  await selectOption(page.getByLabel('ماه تقویم'), '1');
  await page.getByRole('button', {
    name: 'روز ۱۵',
    exact: true
  }).click();
  await page.getByLabel('توضیحات ارجاع (اختیاری)').fill('رسیدگی به متقاضی');
  await page.getByRole('button', {
    name: 'ثبت اطلاعات',
    exact: true
  }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', {
    name: 'ارجاع مجدد به کارشناس'
  })).toHaveCount(0);
  await selectOption(page.getByLabel('ورود نمایشی با کاربر'), 'u4');
  await page.getByRole('button', {
    name: 'رد ارجاع با دلیل'
  }).click();
  await page.getByLabel('دلیل رد ارجاع *').fill('خارج از تخصص این کارشناس');
  await page.getByRole('button', {
    name: 'ثبت رد ارجاع'
  }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page).toHaveURL(/inbox/);
  await expect(page.locator('article').filter({hasText:'متقاضی پذیرش'})).toHaveCount(0);
  await selectOption(page.getByLabel('ورود نمایشی با کاربر'), 'u2');
  const rejectedCard=page.locator('article').filter({hasText:'متقاضی پذیرش'});
  await expect(rejectedCard).toBeVisible();
  await rejectedCard.getByRole('link',{name:'ارجاع مجدد به کارشناس',exact:true}).click();
  await selectOption(page.getByLabel('مشاور رنج پرونده *'), 'u5');
  await page.getByRole('button', {
    name: 'انتخاب تاریخ موعد تکمیل *'
  }).click();
  await selectOption(page.getByLabel('سال تقویم'), '1406');
  await page.getByRole('button', {
    name: 'روز ۱۵',
    exact: true
  }).click();
  await page.getByLabel('توضیحات ارجاع (اختیاری)').fill('ارجاع بعد از رد');
  await page.getByRole('button', {
    name: 'ثبت اطلاعات',
    exact: true
  }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await selectOption(page.getByLabel('ورود نمایشی با کاربر'), 'u5');
  await page.getByRole('button', {
    name: 'تأیید و شروع رسیدگی'
  }).click();
  await expect(page.getByText('پذیرفته و در حال رسیدگی', {
    exact: true
  })).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(url);
  const history = await page.evaluate(() => JSON.parse(localStorage.getItem('farda-crm-sample')).db.assignmentHistory);
  const id = new URL(url).pathname.split('/').at(-1);
  expect(history.filter(h => h.inquiry_id === id).map(h => h.new_assignee_id)).toEqual(['u4', 'u5']);
});
test('تقویم پذیرش روی موبایل بدون بیرون‌زدگی و بدون تایپ', async ({
  page
}) => {
  await page.setViewportSize({
    width: 390,
    height: 844
  });
  await page.goto('/leads?action=createLead');
  await page.getByRole('button', {
    name: 'انتخاب تاریخ موعد اولیه'
  }).click();
  await selectOption(page.getByLabel('سال تقویم'), '1405');
  await selectOption(page.getByLabel('ماه تقویم'), '8');
  await selectOption(page.getByLabel('ساعت', {
    exact: true
  }), '10');
  await selectOption(page.getByLabel('دقیقه', {
    exact: true
  }), '30');
  await page.getByRole('button', {
    name: 'روز ۱۵',
    exact: true
  }).click();
  await expect(page.getByLabel('موعد اولیه', {
    exact: true
  })).toHaveValue('۱۴۰۵/۰۸/۱۵ ۱۰:۳۰');
  await page.getByRole('button', {
    name: 'انتخاب تاریخ موعد اولیه'
  }).click();
  await page.screenshot({
    path: 'review-artifacts/intake-calendar-mobile.png',
    fullPage: true
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
test('باز شدن تقویم ارتفاع فرم را تغییر نمی‌دهد و Escape فقط تقویم را می‌بندد', async ({
  page
}) => {
  await page.goto('/leads?action=createLead');
  const dialog = page.getByRole('dialog', {
    name: 'ثبت سرنخ و ایجاد پرونده'
  });
  const before = await dialog.boundingBox();
  await page.getByRole('button', {
    name: 'انتخاب تاریخ موعد اولیه'
  }).click();
  const calendar = page.getByRole('group', {
    name: 'تقویم شمسی'
  });
  await expect(calendar).toBeVisible();
  const after = await dialog.boundingBox(),
    box = await calendar.boundingBox();
  expect(Math.abs(before.height - after.height)).toBeLessThan(1);
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  const viewport = page.viewportSize();
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  await page.getByRole('combobox', {
    name: 'ماه تقویم'
  }).click();
  await page.keyboard.press('Escape');
  await expect(calendar).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(calendar).toHaveCount(0);
  await expect(dialog).toBeVisible();
});
test('سرنخ فقط برای مدیر کل و مدیر رنج است؛ مشاور فقط کارتابل دارد',async({page})=>{
 await page.goto('/');
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await page.getByRole('button',{name:'سرنخ و پرونده‌ها',exact:true}).click();
 await expect(page.locator('aside').getByRole('link',{name:'سرنخ‌ها',exact:true})).toHaveCount(0);
 await page.goto('/leads?action=createLead');
 await expect(page.getByText('دسترسی به این بخش برای گروه کاربری شما مجاز نیست.')).toBeVisible();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.goto('/requests?action=create');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.goto('/inbox');
 await expect(page.getByRole('heading',{name:'کارتابل پذیرش',exact:true})).toBeVisible();
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');
 await page.goto('/leads');
 await expect(page.getByRole('button',{name:'ثبت سرنخ',exact:true})).toBeVisible();
});
test('تمدید مهلت تا تصمیم مدیر اعمال نمی‌شود و بعد از تأیید از صف مدیر خارج می‌شود',async({page})=>{
 await page.goto('/');await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u4');
 await page.evaluate(()=>{const saved=JSON.parse(localStorage.getItem('farda-crm-sample'));saved.db.registrationRequests.find(r=>r.id==='r11').due_at=new Date(Date.now()-3600000).toISOString();localStorage.setItem('farda-crm-sample',JSON.stringify(saved));});
 await page.goto('/requests/r11');
 const due=await page.evaluate(()=>JSON.parse(localStorage.getItem('farda-crm-sample')).db.registrationRequests.find(r=>r.id==='r11').due_at);
 await page.getByRole('button',{name:'درخواست تمدید مهلت',exact:true}).click();
 await page.getByRole('button',{name:'انتخاب تاریخ موعد پیشنهادی رسیدگی *'}).click();
 await selectOption(page.getByLabel('سال تقویم'),'1406');await selectOption(page.getByLabel('ماه تقویم'),'1');
 await page.getByRole('button',{name:'روز ۱۵',exact:true}).click();
 await page.getByLabel('دلیل درخواست تمدید *').fill('نیاز به مهلت بیشتر برای بازدید');
 await page.getByRole('button',{name:'ثبت درخواست تمدید',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(page.getByText(/در انتظار تأیید تمدید مهلت · موعد پیشنهادی/)).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('farda-crm-sample')).db.registrationRequests.find(r=>r.id==='r11').due_at)).toBe(due);
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'),'u2');await page.goto('/inbox');
 const review=page.locator('article').filter({has:page.locator('a[href="/requests/r11"]')});
 await review.getByRole('link',{name:'بررسی درخواست تمدید',exact:true}).click();
 await selectOption(page.getByLabel('تصمیم مدیر *',{exact:true}),'APPROVE');
 await page.getByLabel('دلیل تصمیم مدیر *').fill('مهلت برای هماهنگی تأیید شد');
 await page.getByRole('button',{name:'ثبت تصمیم مدیر',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('farda-crm-sample')).db.registrationRequests.find(r=>r.id==='r11').due_at)).not.toBe(due);
 await page.goto('/inbox');await expect(review).toHaveCount(0);
});
