import {selectOption} from "./select-helper.js";
import { test, expect } from "@playwright/test";
const routes = [
  "/",
  "/tasks",
  "/teams",
  "/staff",
  "/contacts",
  "/requests",
  "/reviews",
  "/properties",
  "/listings",
  "/inquiries",
  "/introductions",
  "/viewings",
  "/followups",
  "/deals",
  "/contracts",
  "/finance",
  "/reports",
  "/notifications",
  "/settings",
  "/guide",
];
test("صفحات اصلی، جزئیات و نمایش موبایل بدون خطای اجرا", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const url of routes) {
    await page.goto(url);
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.getByText("خطا در نمایش صفحه", { exact: true }),
    ).toHaveCount(0);
  }
  for (const url of [
    "/requests/r1",
    "/properties/p1",
    "/listings/l1",
    "/inquiries/i1",
    "/introductions/int1",
    "/deals/d1",
    "/contracts/ct1",
  ]) {
    await page.goto(url);
    await expect(
      page.getByText("خطا در نمایش صفحه", { exact: true }),
    ).toHaveCount(0);
  }
  await page.goto("/requests?view=board");
  await expect(page.locator(".kanban")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("ثبت شخص با نشانی فرم، ماندگاری و هشدار تکرار", async ({ page }) => {
  await page.goto("/contacts?action=create");
  await page.reload();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("نام *", { exact: true }).fill("آزمون");
  await page.getByLabel("نام خانوادگی *", { exact: true }).fill("مرورگر");
  await page.getByLabel("شماره همراه *", { exact: true }).fill("09129998877");
  await page.getByRole("button", { name: "ثبت اطلاعات", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/contacts?search=آزمون");
  await expect(page.locator("table").getByText("آزمون مرورگر")).toBeVisible();
  await page.reload();
  await expect(page.locator("table").getByText("آزمون مرورگر")).toBeVisible();
});
test("لینک مستقیم فرم غیرمجاز و شکست نمایشی تغییری ذخیره نمی‌کنند", async ({
  page,
}) => {
  await page.goto("/");
  await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u4");
  await page.goto("/requests/r3?action=workspace");
  await expect(
    page.getByText("شما به این پرونده دسترسی ندارید.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/contacts");
  await page.getByLabel("شکست نمایشی عملیات بعدی").check();
  await page.getByRole("button", { name: "ثبت شخص", exact: true }).click();
  await page.getByLabel("نام *", { exact: true }).fill("شکست");
  await page.getByLabel("نام خانوادگی *", { exact: true }).fill("نمایشی");
  await page.getByLabel("شماره همراه *", { exact: true }).fill("09127776655");
  const before = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("farda-crm-sample")).db.contacts.length,
  );
  await page.getByRole("button", { name: "ثبت اطلاعات", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("شکست نمایشی عملیات");
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("farda-crm-sample")).db.contacts.length,
    ),
  ).toBe(before);
});

test("بازکردن دوباره فرم، گزارش کارشناسی و شرایط عرضه را حفظ می‌کند", async ({
  page,
}) => {
  await page.goto("/");
  await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u5");
  await page.goto("/requests/r10?action=workspace");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByLabel("نتیجه تماس و کارشناسی *")).not.toHaveValue("");
  await expect(page.getByLabel("قیمت کارشناسی (تومان) *")).not.toHaveValue("");
  if (await page.getByLabel("پیش‌پرداخت (تومان) *").count())
    await expect(page.getByLabel("پیش‌پرداخت (تومان) *")).not.toHaveValue("");
});
