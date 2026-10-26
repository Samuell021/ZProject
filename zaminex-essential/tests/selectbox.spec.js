import { test, expect } from '@playwright/test';
test('انتخاب‌گر سفارشی جست‌وجو، صفحه‌کلید و ذخیره مقدار فرم را پشتیبانی می‌کند', async ({
  page
}) => {
  await page.goto('/leads');
  const actor = page.getByRole('combobox', {
    name: 'ورود نمایشی با کاربر'
  });
  await actor.click();
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.getByRole('searchbox', {
    name: 'جست‌وجو در گزینه‌ها'
  }).fill('زرعکانی');
  await page.getByRole('option').filter({
    hasText: 'خانم زرعکانی'
  }).click();
  await expect(actor).toContainText('خانم زرعکانی');
  await page.goto('/leads?action=createLead');
  const type = page.getByRole('combobox', {
    name: 'نوع سرنخ *'
  });
  await type.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(type).toContainText('درخواست متقاضی');
  await expect(page.getByRole('combobox', {
    name: 'نوع معامله مورد تقاضا *'
  })).toBeVisible();
  await page.getByLabel('نام تماس‌گیرنده *').fill('متقاضی فهرست');
  await page.getByLabel('شماره تماس *').fill('09127778888');
  await page.getByRole('combobox', {
    name: 'رنج مسئول *'
  }).click();
  await page.getByRole('option', {
    name: 'رنج شمال تهران',
    exact: true
  }).click();
  await page.getByRole('combobox', {
    name: 'نوع معامله مورد تقاضا *'
  }).click();
  await page.getByRole('option', {
    name: 'فروش',
    exact: true
  }).click();
  await page.getByRole('button', {
    name: 'ثبت سرنخ و ایجاد پرونده'
  }).click();
  await expect(page).toHaveURL(/inquiries\//);
});
test('Escape فهرست انتخاب را می‌بندد و فرم والد را حفظ می‌کند', async ({
  page
}) => {
  await page.goto('/leads?action=createLead');
  const type = page.getByRole('combobox', {
    name: 'نوع سرنخ *'
  });
  await type.click();
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toBeHidden();
  await expect(page.getByRole('dialog', {
    name: 'ثبت سرنخ و ایجاد پرونده'
  })).toBeVisible();
  await expect(type).toBeFocused();
});
