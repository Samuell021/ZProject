import {selectOption} from "./select-helper.js";
import {isoToJalaliInput} from "../src/services/jalali-date.js";
import { test, expect } from "@playwright/test";
for (const type of [
  "sale",
  "rent",
  "mortgage",
  "presale",
  "partnership",
  "exchange",
])
  test(`گردش کامل ${type} تا قرارداد با اصلاح و حفظ داده`, async ({ page }) => {
    test.setTimeout(60000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/requests");
    await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u2");
    await page.goto("/requests?action=create");
    await selectOption(page.getByLabel("شخص ثبت‌شده (اختیاری)"), "c1");
    await page.getByLabel("نام مالک یا معرف *").fill("مالک آزمون");
    await page.getByLabel("شماره تماس اولیه *").fill("09121112233");
    await selectOption(page.getByLabel("منطقه", { exact: true }), "district1");
    await selectOption(page.getByLabel("نوع عرضه اولیه (اختیاری)"), type);
    await page.getByLabel("توضیحات اولیه").fill("توضیح تماس مالک");
    await page.getByLabel("عنوان ملک",{exact:true}).fill("آپارتمان آزمون کامل");
    await page
      .getByRole("button", { name: "ثبت اطلاعات", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(page.url()).toMatch(/requests\//);
    const requestUrl = page.url();
    await expect(page.getByRole("button",{name:"پذیرش سرنخ",exact:true})).toHaveCount(0);
    
    await page.goto(requestUrl);
    await page
      .getByRole("button", { name: "ارجاع به کارشناس", exact: true })
      .click();
    await selectOption(page.getByLabel("مشاور رنج پرونده *"), "u4");
    await page.getByRole("button", {name:"انتخاب تاریخ موعد تکمیل *"}).click();
    await selectOption(page.getByLabel("سال تقویم"), "1405");
    await selectOption(page.getByLabel("ماه تقویم"), "8");
    await page.getByRole("button", {name:"روز ۱۰",exact:true}).click();
    await page.getByLabel("توضیحات ارجاع (اختیاری)").fill("کارشناسی اولیه");
    await page
      .getByRole("button", { name: "ثبت اطلاعات", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u4");
    await page
      .getByRole("button", { name: "تأیید و شروع کارشناسی", exact: true })
      .click();
    await expect(page.getByRole("status")).toBeVisible();
    await page
      .getByRole("button", { name: "کارشناسی و تکمیل پرونده", exact: true })
      .click();
    const fillWorkspace = async () => {
      await expect(page.getByLabel("عنوان ملک",{exact:true})).toHaveAttribute("readonly", "");
      await page.getByLabel("نشانی کامل *").fill("سعادت‌آباد، خیابان آزمون");
      await page.getByLabel("متراژ *", { exact: true }).fill("110");
      await page.getByLabel("اتاق *", { exact: true }).fill("2");
      await page
        .getByLabel("نتیجه تماس و کارشناسی *")
        .fill("تماس انجام شد؛ مشخصات و مالکیت بررسی شد.");
      await page.getByLabel("قیمت کارشناسی (تومان) *").fill("8000000000");
      await selectOption(page.getByLabel("نوع معامله *", { exact: true }), type);
      if (["sale", "presale", "exchange"].includes(type))
        await page.getByLabel("قیمت عرضه (تومان) *").fill("8500000000");
      if (["rent", "mortgage"].includes(type))
        await page.getByLabel("ودیعه / رهن (تومان) *").fill("1000000000");
      if (type === "rent")
        await page.getByLabel("اجاره ماهانه (تومان) *").fill("20000000");
      if (type === "presale") {
        await page.getByLabel("پیش‌پرداخت (تومان) *").fill("2000000000");
        await page.getByLabel("شرح اقساط *").fill("هشت قسط توافقی");
        await page
          .getByLabel("موعد تحویل *", { exact: true })
          .fill(isoToJalaliInput("2028-01-01"));
      }
      if (type === "partnership") {
        await page.getByLabel("آورده مالک *").fill("زمین");
        await page.getByLabel("آورده سازنده *").fill("ساخت");
        await page.getByLabel("درصد سهم مالک *").fill("60");
        await page.getByLabel("درصد سهم سازنده *").fill("40");
        await page.getByLabel("موعد اصلی تحویل *").fill(isoToJalaliInput("2028-01-01"));
      }
      if (type === "exchange") {
        await page.getByLabel("دارایی طرف مقابل *").fill("ملک مقابل");
        await page.getByLabel("ارزش دارایی اول *").fill("8500000000");
        await page.getByLabel("ارزش دارایی مقابل *").fill("8000000000");
        await page.getByLabel("مابه‌التفاوت *").fill("500000000");
      }
      await page
        .getByRole("button", {
          name: "ذخیره کارشناسی و شرایط عرضه",
          exact: true,
        })
        .click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
    };
    await fillWorkspace();
    await page
      .getByRole("button", { name: "ارسال برای بررسی", exact: true })
      .click();
    await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u2");
    await page
      .getByRole("link", { name: "مشاهده فایل عرضه ←", exact: true })
      .click();
    await page
      .getByRole("button", { name: "برگشت برای اصلاح", exact: true })
      .click();
    await page
      .getByLabel("دلیل برگشت برای اصلاح *")
      .fill("اطلاعات تکمیلی کارشناسی درج شود");
    await page
      .getByRole("button", { name: "ثبت اطلاعات", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u4");
    await page.goto(requestUrl);
    await page
      .getByRole("button", { name: "کارشناسی و تکمیل پرونده", exact: true })
      .click();
    await fillWorkspace();
    await page
      .getByRole("button", { name: "ارسال برای بررسی", exact: true })
      .click();
    await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u2");
    await page
      .getByRole("link", { name: "مشاهده فایل عرضه ←", exact: true })
      .click();
    await page
      .getByRole("button", { name: "تأیید و فعال‌سازی", exact: true })
      .click();
    await expect(page.getByRole("status")).toBeVisible();
    await page.reload();
    await expect(
      page.getByText("تأیید شده", { exact: true }).first(),
    ).toBeVisible();
    await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u2");
    await page.goto("/inquiries?action=create");
    await selectOption(page.getByLabel("متقاضی *", { exact: true }), "c14");
    await selectOption(page.getByLabel("مشاور مسئول *", { exact: true }), "u4");
    await selectOption(page.getByLabel("منطقه موردنظر"), "district1");
    await selectOption(page.getByLabel("نوع معامله *", { exact: true }), type);
    await page.getByLabel("حداقل متراژ").fill("100");
    await page.getByLabel("حداکثر متراژ").fill("120");
    await page.getByLabel("حداکثر بودجه خرید (تومان)").fill("9000000000");
    await page
      .getByLabel("اقدام بعدی *", { exact: true })
      .fill("معرفی فایل مناسب");
    await page
      .getByLabel("موعد اقدام *", { exact: true })
      .fill(isoToJalaliInput("2026-11-02T10:00:00+03:30", true));
    await page
      .getByRole("button", { name: "ثبت اطلاعات", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u4");
    await page.getByRole("button", {name:"تأیید و شروع رسیدگی",exact:true}).click();
    const candidate = page.locator(".card").filter({
      has: page.getByRole("heading", {
        name: "آپارتمان آزمون کامل",
        exact: true,
      }),
    });
    await candidate
      .getByRole("button", { name: "معرفی صریح به مشتری" })
      .click();
    await expect(page.getByRole("status")).toBeVisible();
    await page.locator('a[href^="/introductions/"]').last().click();
    const introUrl = page.url();
    await page
      .getByRole("button", { name: "برنامه‌ریزی بازدید", exact: true })
      .click();
    await page.getByLabel("زمان بازدید *").fill(isoToJalaliInput("2026-11-03T10:00:00+03:30", true));
    await selectOption(page.getByLabel("مشاور همراه *"), "u4");
    await page
      .getByRole("button", { name: "ثبت اطلاعات", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.goto("/viewings");
    const viewing = page
      .locator(".card")
      .filter({ has: page.locator(`a[href="${new URL(introUrl).pathname}"]`) });
    await viewing.getByRole("button", { name: "ثبت نتیجه بازدید" }).click();
    await page.getByLabel("نتیجه بازدید *").fill("مشتری تمایل به مذاکره دارد");
    await page.getByLabel("بازخورد مشتری").fill("ملک مناسب است");
    await page
      .getByRole("button", { name: "ثبت اطلاعات", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.goto(introUrl);
    await page
      .getByRole("button", { name: "ورود به مذاکره", exact: true })
      .click();
    await expect(page).toHaveURL(/deals\//);
    await page
      .getByRole("button", { name: "ثبت پیشنهاد جدید", exact: true })
      .click();
    await selectOption(page.getByLabel("پیشنهاددهنده *"), "c14");
    await page
      .getByLabel("قیمت پیشنهادی (تومان)")
      .fill(
        ["sale", "presale", "exchange"].includes(type) ? "8400000000" : "0",
      );
    await page
      .getByLabel("ودیعه پیشنهادی (تومان)")
      .fill(["rent", "mortgage"].includes(type) ? "1000000000" : "0");
    await page
      .getByLabel("اجاره پیشنهادی (تومان)")
      .fill(type === "rent" ? "20000000" : "0");
    await page.getByLabel("اعتبار پیشنهاد *").fill(isoToJalaliInput("2026-11-05T10:00:00+03:30", true));
    await page.getByLabel("شرایط پیشنهاد *").fill("پرداخت توافقی نمایشی");
    await page
      .getByRole("button", { name: "ثبت اطلاعات", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page
      .getByRole("button", { name: "پذیرش پیشنهاد", exact: true })
      .click();
    await expect(page.getByRole("button", { name: "ساخت پیش‌نویس قرارداد" })).toHaveCount(0);
    await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u7");
    await page.getByRole("button", { name: "ساخت پیش‌نویس قرارداد" }).click();
    await expect(page).toHaveURL(/contracts\//);
    await expect(page.getByRole("button",{name:"قطعی‌کردن قرارداد",exact:true})).toHaveCount(0);
    for (let i = 0; i < 2; i++) {
      await page
        .getByRole("button", { name: "ثبت امضای این طرف", exact: true })
        .first()
        .click();
      await expect(page.getByRole("status")).toBeVisible();
    }
    await page.getByRole("button", { name: "قطعی‌کردن قرارداد" }).click();
    await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u8");
    await expect(
      page.getByRole("link", { name: "مشاهده کمیسیون و دریافت" }),
    ).toBeVisible();
    await page.reload();
    await expect(page.getByText("قطعی", { exact: true }).first()).toBeVisible();
    await selectOption(page.getByLabel("ورود نمایشی با کاربر"), "u8");
    await page.goto("/finance");
    await page
      .getByRole("button", { name: "تصویب کمیسیون با سیاست نمایشی" })
      .last()
      .click();
    await expect(page.getByRole("status")).toBeVisible();
    await page.getByRole("button", { name: "ثبت دریافت یا پرداخت" }).click();
    await selectOption(page.getByLabel("جهت وجه *"), "IN");
    await selectOption(page.getByLabel("طرف حساب *"), "c14");
    await page.getByLabel("مبلغ وجه (تومان) *").fill("1000000");
    const target = await page
      .getByLabel("تخصیص به *")
      .locator("..")
      .locator("option")
      .last()
      .getAttribute("value");
    await selectOption(page.getByLabel("تخصیص به *"), target);
    await page.getByLabel("مبلغ تخصیص (تومان) *").fill("1000000");
    await selectOption(page.getByLabel("روش پرداخت *"), "CASH");
    await page.getByLabel("شماره پیگیری *").fill("BROWSER-PARTIAL-001");
    await page
      .getByRole("button", { name: "ثبت اطلاعات", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByText("BROWSER-PARTIAL-001")).toBeVisible();
    await page.reload();
    await expect(page.getByText("BROWSER-PARTIAL-001")).toBeVisible();
    const receipt = await page.evaluate(() => {
      const db = JSON.parse(localStorage.getItem("farda-crm-sample")).db;
      const p = db.payments.find(
        (x) => x.reference_number === "BROWSER-PARTIAL-001",
      );
      return {
        amount: p.amount,
        allocated: db.paymentAllocations
          .filter((x) => x.payment_id === p.id)
          .reduce((s, x) => s + x.amount, 0),
      };
    });
    expect(receipt).toEqual({ amount: 1000000, allocated: 1000000 });
    expect(errors).toEqual([]);
  });
