import { test, expect } from "@playwright/test";
const pages = [
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
  "/pipelines",
];
test("راهنمای برنامه‌نویس در همه بخش‌ها در دسترس است و API و همه مدل‌ها دارد", async ({
  page,
}) => {
  for (const url of pages) {
    await page.goto(url);
    await expect(
      page.getByRole("button", { name: "راهنمای برنامه‌نویس", exact: true }),
    ).toBeVisible();
  }
  await page.goto("/finance");
  await page
    .getByRole("button", { name: "راهنمای برنامه‌نویس", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "راهنمای برنامه‌نویس · کمیسیون و دریافت‌وپرداخت",
  });
  await expect(dialog).toBeVisible();
  await dialog.getByText("Commission", { exact: true }).click();
  await expect(
    dialog.getByText("debtor_contact_id", { exact: true }),
  ).toBeVisible();
  await dialog
    .getByRole("tab", { name: "APIها و عملیات", exact: true })
    .click();
  await dialog.getByText("POST /api/v1/payments", { exact: true }).click();
  await expect(
    dialog.getByText("confirmPayment", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("tab", { name: "مدل‌ها و جدول‌ها", exact: true })
    .click();
  await page.getByLabel(/^همه مدل‌ها/).check();
  await page.getByLabel("جست‌وجوی مدل یا فیلد").fill("ContractSignature");
  await expect(
    page.getByText("ContractSignature", { exact: true }),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "دریافت مرجع کامل بک‌اند" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "CRM-Farda-Backend-Reference.md",
  );
});
test("بستن راهنمای فرزند، فرم والد را حفظ می‌کند و کاریز رابط مستقل دارد", async ({
  page,
}) => {
  await page.goto("/requests?action=create");
  const parent = page.getByRole("dialog", {
    name: "ثبت اطلاعات جدید",
    exact: true,
  });
  await parent
    .getByRole("button", { name: "راهنمای برنامه‌نویس", exact: true })
    .click();
  const child = page.getByRole("dialog", {
    name: "راهنمای برنامه‌نویس · درخواست ملک و فضای کاری کارشناسی",
    exact: true,
  });
  await expect(child).toBeVisible();
  await page.reload();
  await child.getByRole("button", { name: "بستن", exact: true }).click();
  await expect(parent).toBeVisible();
  await expect(page).toHaveURL(/action=create/);
  await page.goto("/pipelines?pipeline=deals");
  await expect(page.locator(".kanban")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "کاریز مذاکرات", exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "تأمین فایل", exact: true }).click();
  await expect(page).toHaveURL(/pipeline=requests/);
  await page
    .getByRole("button", { name: "راهنمای برنامه‌نویس", exact: true })
    .click();
  await page
    .getByRole("tab", { name: "کاریز و گردش کار", exact: true })
    .click();
  await expect(page.getByText("approveListing", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "مشاهده کاریز تأمین فایل ←", exact: true }),
  ).toBeVisible();
});
