import {selectOption} from "./select-helper.js";
import { test, expect } from "@playwright/test";
test("کارت رنج به درخواست‌ها و فایل‌های همان رنج با فیلتر پایدار وصل است", async ({
  page,
}) => {
  await page.goto("/teams");
  await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u1");
  const team = page
    .locator("section.panel")
    .filter({
      has: page.getByRole("heading", { name: "رنج شمال تهران", exact: true }),
    });
  await expect(
    team.getByRole("heading", { name: "درخواست‌های این رنج", exact: true }),
  ).toBeVisible();
  await expect(
    team.getByRole("heading", { name: "فایل‌های این رنج", exact: true }),
  ).toBeVisible();
  await team
    .getByRole("link", { name: "همه درخواست‌های این رنج ←", exact: true })
    .click();
  await expect(page).toHaveURL(/scope=s1/);
  await expect(page.getByLabel("فیلتر رنج")).toContainText("رنج شمال تهران");
  await page.reload();
  const scoped = await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem("farda-crm-sample")).db;
    return [...document.querySelectorAll("a.record-title")].every(
      (a) =>
        db.registrationRequests.find(
          (r) => r.id === a.pathname.split("/").pop(),
        )?.management_scope_id === "s1",
    );
  });
  expect(scoped).toBe(true);
  await page.goto("/teams");
  await page
    .locator("section.panel")
    .filter({
      has: page.getByRole("heading", { name: "رنج شمال تهران", exact: true }),
    })
    .getByRole("link", { name: "همه فایل‌های این رنج ←", exact: true })
    .click();
  await expect(page).toHaveURL(/scope=s1/);
  await expect(page.getByLabel("فیلتر رنج")).toContainText("رنج شمال تهران");
});
