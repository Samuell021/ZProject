import {selectOption} from "./select-helper.js";
import {isoToJalaliInput} from "../src/services/jalali-date.js";
import { test, expect } from "@playwright/test";
test("پیگیری از کارهای من با موعد یکسان و ثبت نتیجه و اقدام بعدی تکمیل می‌شود", async ({
  page,
}) => {
  await page.goto("/");
  await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u4");
  await page.goto("/inquiries/i7?action=followup");
  await page.getByLabel("زمان پیگیری *").fill(isoToJalaliInput("2030-01-01T10:00:00+03:30", true));
  await page.getByLabel("موضوع پیگیری *").fill("پیگیری هماهنگی آزمون");
  await page.getByLabel("اقدام بعدی *", { exact: true }).fill("تماس با مشتری");
  await page.getByRole("button", { name: "ثبت اطلاعات", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const follow = await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem("farda-crm-sample")).db;
    const f = db.followUps.find((x) => x.notes === "پیگیری هماهنگی آزمون");
    return {
      id: f.id,
      date: f.scheduled_at,
      task: db.tasks.find(
        (t) => t.subject_type === "follow_up" && t.subject_id === f.id,
      ),
    };
  });
  expect(follow.task.due_at).toBe(follow.date);
  await page.goto("/tasks");
  await page
    .locator(`a[href="/followups?action=followupResult&record=${follow.id}"]`)
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("نتیجه پیگیری *").fill("تماس برقرار شد");
  await page.getByLabel("اقدام بعدی", { exact: true }).fill("ارسال مدارک");
  await page
    .getByLabel("موعد اقدام بعدی", { exact: true })
    .fill(isoToJalaliInput("2030-01-02T10:00:00+03:30", true));
  await page.getByRole("button", { name: "ثبت اطلاعات", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  const result = await page.evaluate((id) => {
    const db = JSON.parse(localStorage.getItem("farda-crm-sample")).db;
    return {
      task: db.tasks.find(
        (t) => t.subject_type === "follow_up" && t.subject_id === id,
      ).status,
      follow: db.followUps.find((f) => f.id === id),
    };
  }, follow.id);
  expect(result.task).toBe("COMPLETED");
  expect(result.follow.next_action).toBe("ارسال مدارک");
  expect(result.follow.status).toBe("COMPLETED");
});
