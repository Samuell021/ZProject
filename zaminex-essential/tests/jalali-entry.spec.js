import {selectOption} from "./select-helper.js";
import {test,expect} from '@playwright/test';
test.use({timezoneId:'America/New_York'});
test('ورودی شمسی نامعتبر ثبت نمی‌شود و ساعت تهران مستقل از منطقه مرورگر ذخیره می‌شود',async({page})=>{
 await page.goto('/');
 await selectOption(page.getByLabel('ورود نمایشی با کاربر'), 'u4');
 await page.goto('/inquiries/i1?action=followup');
 const input=page.getByLabel('زمان پیگیری *');
 await input.fill('۱۴۰۴/۱۲/۳۰ ۱۰:۰۰');
 await page.getByLabel('موضوع پیگیری *').fill('آزمون تاریخ شمسی');
 await page.getByLabel('اقدام بعدی *',{exact:true}).fill('تماس');
 await page.getByRole('button',{name:'ثبت اطلاعات',exact:true}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 expect(await input.evaluate(el=>el.validity.customError)).toBe(true);
 await input.fill('۱۴۰۵/۰۸/۱۰ ۱۰:۰۰');
 await page.getByRole('button',{name:'ثبت اطلاعات',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('farda-crm-sample')).db.followUps.find(f=>f.notes==='آزمون تاریخ شمسی').scheduled_at)).toBe('2026-11-01T06:30:00.000Z');
});
