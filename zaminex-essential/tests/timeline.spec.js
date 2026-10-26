import {selectOption} from "./select-helper.js";
import { test, expect } from "@playwright/test";
test("خط زمانی پرونده، سوابق ارجاع و انتقال و بررسی مرتبط را با دسترسی معتبر نشان می‌دهد", async ({
  page,
}) => {
  await page.goto("/");
  await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u2");
  await page.goto("/requests/r2");
  const timeline = page.getByRole("region", { name: "خط زمانی پرونده" });
  await expect(timeline.locator("[data-event-kind=assignment]")).toContainText(
    "تغییر مشاور مسئول",
  );
  await expect(timeline.locator("[data-event-kind=transfer]")).toContainText(
    "رسیدگی توسط تیم تخصصی شمال",
  );
  await expect(
    timeline.locator("[data-event-kind=review]").first(),
  ).toBeVisible();
  await expect(
    timeline.locator("[data-event-kind=stage]").first(),
  ).toBeVisible();
  await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u6");
  await page.goto("/requests/r2");
  await expect(
    page.getByText("شما به این پرونده دسترسی ندارید.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "خط زمانی پرونده" }),
  ).toHaveCount(0);
  await page.goto("/listings/l7");
  await expect(page.getByRole("heading",{name:"مشخصات ملک و شرایط عرضه",exact:true})).toBeVisible();
  await expect(
    page.getByRole("region", { name: "خط زمانی پرونده" }),
  ).toHaveCount(0);
});
