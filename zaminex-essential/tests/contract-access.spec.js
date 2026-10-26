import {selectOption} from "./select-helper.js";
import { test, expect } from "@playwright/test";
test("مدیرکل پرونده و شماره طرف قرارداد را می‌بیند و شخص نامرتبط مسدود می‌ماند", async ({
  page,
}) => {
  await page.goto("/");
  await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u1");
  await page.goto("/contracts/ct1");
  await page
    .getByRole("link", { name: "پرونده شخص ←", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/contacts\//);
  await expect(
    page.getByRole("heading", { name: "شماره‌های تماس" }),
  ).toBeVisible();
  await expect(
    page.getByText("شما به این پرونده دسترسی ندارید.", { exact: true }),
  ).toHaveCount(0);
  await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u1");
  await page.goto("/contacts?action=create");
  await page.getByLabel("نام *", { exact: true }).fill("شخص");
  await page
    .getByLabel("نام خانوادگی *", { exact: true })
    .fill("نامرتبط آزمون");
  await page.getByLabel("شماره همراه *", { exact: true }).fill("09123334455");
  await page.getByRole("button", { name: "ثبت اطلاعات", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const privateUrl = page.url();
  await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u7");
  await page.goto(privateUrl);
  await expect(
    page.getByText("شما به این پرونده دسترسی ندارید.", { exact: true }),
  ).toBeVisible();
});
