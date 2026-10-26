import {selectOption} from "./select-helper.js";
import { test, expect } from '@playwright/test';

test('nested dialogs trap focus and Escape preserves the parent form and data', async ({ page }) => {
  await page.goto('/contacts?action=create');
  const parent = page.getByRole('dialog', { name: 'ثبت اطلاعات جدید', exact: true });
  await parent.getByLabel('نام *', { exact: true }).fill('حفظ فرم');
  const opener = parent.getByRole('button', { name: 'راهنمای برنامه‌نویس', exact: true });
  await opener.click();
  const child = page.getByRole('dialog', { name: /راهنمای برنامه‌نویس/ });
  await child.getByRole('tab', { name: 'تغییرات ZaminexB', exact: true }).click();
  await expect(child.getByRole('heading', { name: 'مسیر تغییر از ZaminexB به نمونه' })).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    expect(await child.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(child).toHaveCount(0);
  await expect(parent.getByLabel('نام *', { exact: true })).toHaveValue('حفظ فرم');
  await expect(opener).toBeFocused();
  await expect(page).toHaveURL(/action=create/);
  await page.keyboard.press('Escape');
  await expect(parent).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('backend comparison is contextual, searchable, recoverable and responsive', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/properties?help=developer&helpTab=backend');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Property', { exact: true })).toBeVisible();
  await dialog.getByText('Property', { exact: true }).click();
  await expect(dialog.getByText('properties/models.py · Property', { exact: true })).toBeVisible();
  await selectOption(dialog.getByLabel('دامنه مقایسه بک‌اند'), 'all');
  await dialog.getByLabel('جست‌وجو در مقایسه').fill('CommissionPolicyVersion');
  await expect(dialog.getByText('CommissionPolicyVersion', { exact: true })).toBeVisible();
  await dialog.getByLabel('جست‌وجو در مقایسه').fill('missing-model-123');
  await expect(dialog.getByText(/مدلی با این عبارت پیدا نشد/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.reload();
  await expect(page.getByRole('tab', { name: 'تغییرات ZaminexB', exact: true })).toHaveAttribute('aria-selected', 'true');
});

test('service failure stays visible inside the active dialog', async ({ page }) => {
  await page.goto('/contacts');
  await page.getByLabel('شکست نمایشی عملیات بعدی').check();
  await page.getByRole('button', { name: 'ثبت شخص', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('نام *', { exact: true }).fill('آزمون');
  await dialog.getByLabel('نام خانوادگی *', { exact: true }).fill('خطا');
  await dialog.getByLabel('شماره همراه *', { exact: true }).fill('09125556666');
  await dialog.getByRole('button', { name: 'ثبت اطلاعات', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('شکست نمایشی عملیات');
});

test('storage failure remains visible after dismissing transient messages', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = function () { throw new DOMException('Quota exceeded', 'QuotaExceededError'); };
  });
  await page.goto('/');
  await selectOption(page.getByLabel('ورود نمایشی با کاربر'), 'u2');
  await expect(page.getByRole('alert')).toContainText('ذخیره در مرورگر انجام نشد');
  await page.getByRole('button',{name:'سرنخ و پرونده‌ها',exact:true}).click();
  await page.getByRole('link', { name: 'اشخاص', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('با تازه‌کردن یا بستن صفحه');
});
