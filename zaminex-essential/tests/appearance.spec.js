import {selectOption} from "./select-helper.js";
import { test, expect } from '@playwright/test';

test('brand and six palettes persist with dark mode across pages, forms and reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.brand')).toContainText('گروه سرمایه گذاری کلان فردا');
  await expect(page.locator('.brand small')).toHaveText('Crm');
  await page.getByLabel('ورود نمایشی با کاربر').click();
  await expect(page.getByRole('option').filter({hasText:'مرتضی کاظمی'})).toBeVisible();
  await expect(page.getByRole('option').filter({hasText:'خانم زرعکانی'})).toBeVisible();
  await expect(page.getByRole('option').filter({hasText:'امین زارعی'})).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'ظاهر برنامه', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'ظاهر برنامه' });
  await expect(dialog.getByRole('radio')).toHaveCount(6);
  for (const [name, id, hex] of [
    ['سبز فردا','green','#176552'], ['آبی نفتی','petroleum','#164E63'],
    ['آبی نیمه‌شب','midnight','#191970'], ['آلویی','plum','#6B3D80'],
    ['مسی','copper','#92502F'], ['خاکستری‌آبی','slate','#475569'],
  ]) {
    await dialog.getByRole('radio', { name: `${name} ${hex}`, exact: true }).check();
    await expect(page.locator('html')).toHaveAttribute('data-accent', id);
  }
  await dialog.getByRole('radio', { name: 'آبی نیمه‌شب #191970', exact: true }).check();
  await dialog.getByRole('button', { name: 'تیره', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
  await expect(dialog.getByRole('button', { name: 'تیره', exact: true })).toHaveAttribute('aria-pressed','true');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-accent','midnight');
  await expect(page.locator('html')).toHaveAttribute('data-mode','dark');
  await dialog.getByRole('button', { name: 'بستن', exact: true }).click();
  await page.goto('/requests?action=create');
  const form = page.getByRole('dialog');
  expect(await form.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(26, 36, 46)');
  await page.keyboard.press('Escape');
  for (const width of [320,768,1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/properties');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', {name:'ظاهر برنامه',exact:true}).click();
    expect(await page.getByRole('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
    await page.keyboard.press('Escape');
  }
});

test('saved old demo names migrate without discarding dossiers or custom names', async ({ page }) => {
  await page.goto('/');
  await selectOption(page.getByLabel('ورود نمایشی با کاربر'), 'u2');
  const expected = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('farda-crm-sample'));
    saved.db.staffProfiles.find(p=>p.user_id==='u1').full_name='علی رضایی';
    saved.db.staffProfiles.find(p=>p.user_id==='u2').full_name='مریم احمدی';
    saved.db.staffProfiles.find(p=>p.user_id==='u3').full_name='حسین کریمی';
    saved.db.registrationRequests[0].description='پرونده ذخیره‌شده من';
    localStorage.setItem('farda-crm-sample',JSON.stringify(saved));
    return saved.db.registrationRequests.length;
  });
  await page.reload();
  await expect(page.getByLabel('ورود نمایشی با کاربر')).toContainText('خانم زرعکانی');
  await page.getByLabel('ورود نمایشی با کاربر').click();
  await expect(page.getByRole('option').filter({hasText:'مرتضی کاظمی'})).toBeVisible();
  await page.keyboard.press('Escape');
  await selectOption(page.getByLabel('ورود نمایشی با کاربر'), 'u1');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('farda-crm-sample')).db.registrationRequests.length)).toBe(expected);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('farda-crm-sample')).db.registrationRequests[0].description)).toBe('پرونده ذخیره‌شده من');
});
