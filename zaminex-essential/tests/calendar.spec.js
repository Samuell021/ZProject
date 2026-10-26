import {selectOption} from "./select-helper.js";
import { test, expect } from "@playwright/test";
test("تقویم هفتگی شمسی، مسیر هفته و فرم نتیجه بازدید حفظ می‌شوند", async ({
  page,
}) => {
  await page.goto("/");
  await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u1");
  const schedule = await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem("farda-crm-sample")).db;
    return db.viewings.find((v) => v.status === "SCHEDULED").scheduled_at;
  });
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(schedule));
  await page.goto(`/viewings?view=calendar&week=${day}`);
  await expect(page.locator(".calendar-day")).toHaveCount(7);
  await expect(page.locator(".viewing-calendar-event").first()).toBeVisible();
  const first = page
    .locator(".viewing-calendar-event")
    .filter({
      has: page.getByRole("button", { name: "ثبت نتیجه بازدید", exact: true }),
    })
    .first();
  await first
    .getByRole("button", { name: "ثبت نتیجه بازدید", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "بستن", exact: true }).click();
  await expect(page.locator(".calendar-day")).toHaveCount(7);
  const original = page.url();
  await page.getByRole("button", { name: "هفته بعد", exact: true }).click();
  expect(page.url()).not.toBe(original);
  await page.reload();
  await expect(page.locator(".calendar-day")).toHaveCount(7);
  await page.getByRole("button", { name: "هفته قبل", exact: true }).click();
  await expect(page.locator(".viewing-calendar-event").first()).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
