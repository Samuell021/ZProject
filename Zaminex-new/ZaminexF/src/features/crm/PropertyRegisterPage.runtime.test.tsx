import React from "react";
import { JSDOM } from "jsdom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readSupplyDraft } from "./lib/supplyDomain";

vi.mock("../../shared/components/ui/PropertyMapPicker", () => ({
  PropertyMapPicker: ({
    value,
    onChange,
  }: {
    value: [number, number] | null;
    onChange: (point: [number, number]) => void;
  }) => (
    <div>
      <output data-testid="map-value">{value ? value.join(",") : "empty"}</output>
      <button type="button" onClick={() => onChange([35.7219, 51.3347])}>انتخاب موقعیت نقشه</button>
    </div>
  ),
}));

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "https://crm.example.test/app/property-register/",
});
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  HTMLInputElement: dom.window.HTMLInputElement,
  HTMLTextAreaElement: dom.window.HTMLTextAreaElement,
  HTMLSelectElement: dom.window.HTMLSelectElement,
  HTMLButtonElement: dom.window.HTMLButtonElement,
  Element: dom.window.Element,
  Node: dom.window.Node,
  Event: dom.window.Event,
  InputEvent: dom.window.InputEvent,
  MouseEvent: dom.window.MouseEvent,
  KeyboardEvent: dom.window.KeyboardEvent,
  MutationObserver: dom.window.MutationObserver,
  File: dom.window.File,
  getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
  localStorage: dom.window.localStorage,
  sessionStorage: dom.window.sessionStorage,
});

const { cleanup, fireEvent, render, waitFor } = await import("@testing-library/react");
const { PropertyRegisterPage } = await import("./pages/PropertyRegisterPage");

const baseCase = {
  id: 101,
  code: "PC-101",
  contact: 11,
  contact_name: "مالک آزمون",
  contact_phones: ["09121112233"],
  scope: 1,
  scope_name: "رنج شمال",
  sales_range: 1,
  sales_range_name: "رنج شمال",
  lead_status: "ACCEPTED",
  acceptance_status: "ACCEPTED",
  status: "ACTIVE",
  stage: "appraisal",
  assigned_to: 9,
  assigned_to_name: "مشاور آزمون",
  property_title: "",
  description: "آپارتمان آزمون",
  version: 4,
  resulting_property: 88,
  appraisal: { report_text: "", visit_notes: "", findings: {}, is_complete: false },
};

beforeEach(() => {
  dom.window.localStorage.clear();
  dom.window.sessionStorage.clear();
  dom.window.history.replaceState({}, "", "/app/property-register/?id=101");
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:property-preview");
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("property registration form upload and review ordering", () => {
  it("persists hierarchical location, uses map coordinates, and does not submit review until image retry succeeds", async () => {
    let caseVersion = 4;
    let uploadFails = true;
    const timeline: string[] = [];
    const workspacePayloads: Array<Record<string, unknown>> = [];
    const uploadKeys: string[] = [];
    const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
      const url = String(input);
      const method = String(init?.method || "GET").toUpperCase();

      if (method === "POST" && url.includes("/save_workspace/")) {
        timeline.push("save_workspace");
        workspacePayloads.push(JSON.parse(String(init?.body || "{}")));
        caseVersion += 1;
        return new Response(JSON.stringify({ ...baseCase, version: caseVersion, property_id: 88, resulting_property: 88 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (method === "POST" && url.includes("/properties/api/properties/88/images/")) {
        timeline.push("upload_image");
        uploadKeys.push((init?.headers as Record<string, string>)?.["Idempotency-Key"] || "");
        if (uploadFails) {
          return new Response(JSON.stringify({ detail: "mock image upload failure" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify([{ id: 900, url: "/media/test.png", sort_order: 0 }]), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (method === "POST" && url.includes("/submit_property_for_review/")) {
        timeline.push("submit_review");
        return new Response(JSON.stringify({ id: 501, version: 1 }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.includes("/basics/api/locations/")) {
        return new Response(JSON.stringify([
          { id: 1, name: "tehran", displayName: "تهران", cities: [
            { id: 2, name: "tehran-city", displayName: "تهران", districts: [
              { id: 3, name: "jordan", displayName: "جردن" },
            ] },
          ] },
        ]), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      if (url.includes("/basics/api/catalog/")) {
        return new Response(JSON.stringify({
          usages: [{ id: 5, name: "residential", displayName: "مسکونی" }],
          propertyTypes: [{ id: 6, name: "apartment", displayName: "آپارتمان", propertyUsage: 5, propertyUsageName: "مسکونی" }],
          dealTypes: [],
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      if (url.includes("/basics/api/schema/property-form/")) {
        return new Response(JSON.stringify({
          fields: [
            {
              id: 1,
              name: "area",
              displayName: "متراژ اصلی",
              dataType: "integer",
              inputType: "default",
              unit: "متر مربع",
              isFacility: false,
              isCore: true,
              coreField: "area",
              isRequired: true,
              sortOrder: 0,
              options: [],
            },
            {
              id: 2,
              name: "parking_count",
              displayName: "تعداد پارکینگ",
              dataType: "integer",
              inputType: "default",
              unit: "",
              isFacility: false,
              isCore: false,
              coreField: "",
              isRequired: true,
              sortOrder: 1,
              options: [],
            },
          ],
          facilities: [],
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (url.includes("/properties/api/properties/88/")) {
        return new Response(JSON.stringify({
          id: 88,
          title: "آپارتمان آزمون",
          type: "APARTMENT",
          propertyTypeRef: 6,
          propertyUsage: 5,
          districtId: null,
          address: "",
          area: 0,
          beds: 0,
          floor: null,
          constructionYear: null,
          latitude: null,
          longitude: null,
          attributes: {},
          images: [],
          parties: [],
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      if (url.includes("/crm/api/property-cases/101/")) {
        return new Response(JSON.stringify({ ...baseCase, version: caseVersion }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (url.includes("/crm/api/property-cases/") || url.includes("/crm/api/contacts/") ||
          url.includes("/crm/api/scope-memberships/") || url.includes("/crm/api/deal-types/") ||
          url.includes("/crm/api/properties/88/listings/")) {
        return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ detail: `Unexpected request: ${method} ${url}` }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const view = render(
      <PropertyRegisterPage
        csrfToken="test-csrf"
        role="consultant"
        currentUserId={9}
        recordId="101"
        navigate={vi.fn()}
      />,
    );

    await view.findByRole("heading", { name: /مرحلهٔ ۵: تکمیل مشخصات ملک/ });
    await waitFor(() => expect(view.getByRole("button", { name: "انتخاب استان" })).toBeTruthy());

    fireEvent.click(view.getByRole("button", { name: "انتخاب استان" }));
    fireEvent.click(await view.findByRole("button", { name: "تهران" }));
    fireEvent.click(view.getByRole("button", { name: "انتخاب شهر" }));
    const tehranButtons = await view.findAllByRole("button", { name: "تهران" });
    fireEvent.click(tehranButtons[tehranButtons.length - 1]);
    fireEvent.click(view.getByRole("button", { name: "انتخاب محله" }));
    fireEvent.click(await view.findByRole("button", { name: "جردن" }));

    await waitFor(() => {
      expect(readSupplyDraft("consultant:9", 101)?.fields).toMatchObject({
        provinceId: "1",
        cityId: "2",
        districtId: "3",
        neighborhood: "جردن",
      });
    });

    fireEvent.click(view.getByRole("button", { name: "انتخاب موقعیت نقشه" }));
    expect(view.getByTestId("map-value").textContent).toBe("35.7219,51.3347");
    fireEvent.change(view.getByPlaceholderText("مثال: 35.7219"), { target: { value: "not-a-coordinate" } });
    expect(view.getByTestId("map-value").textContent).toBe("empty");
    fireEvent.click(view.getByRole("button", { name: "انتخاب موقعیت نقشه" }));
    fireEvent.change(view.getByPlaceholderText("خیابان، کوچه، پلاک و واحد"), {
      target: { value: "تهران، جردن، خیابان آزمون" },
    });
    const areaLabel = view.getByText("متراژ به متر مربع (الزامی)");
    fireEvent.change(areaLabel.parentElement!.querySelector("input")!, { target: { value: "120" } });
    fireEvent.change(view.getByPlaceholderText(/کیفیت ساخت، نورگیری/), {
      target: { value: "گزارش کامل کارشناسی" },
    });
    const imageInput = view.container.querySelector('input[type="file"]') as HTMLInputElement;
    const imageFile = new File(["image-bytes"], "property.png", { type: "image/png" });
    fireEvent.change(imageInput, { target: { files: [imageFile] } });
    expect(view.getByAltText("پیش‌نمایش property.png")).toBeTruthy();

    const submitButton = view.getByRole("button", { name: "ذخیره و ارسال برای تأیید مدیر" });
    fireEvent.click(submitButton);
    expect(await view.findByText("تکمیل «تعداد پارکینگ» الزامی است.")).toBeTruthy();
    expect(timeline).toEqual([]);
    const parkingCount = view.getByText("تعداد پارکینگ").parentElement!.querySelector("input")!;
    fireEvent.change(parkingCount, { target: { value: "1" } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(view.getByText("mock image upload failure")).toBeTruthy());
    expect(timeline).toEqual(["save_workspace", "upload_image"]);
    expect(timeline).not.toContain("submit_review");
    expect(workspacePayloads[0]).toMatchObject({
      district: 3,
      neighborhood: "جردن",
      property_type_ref: 6,
      property_usage: 5,
      latitude: 35.7219,
      longitude: 51.3347,
    });

    uploadFails = false;
    fireEvent.click(view.getByRole("button", { name: "ذخیره و ارسال برای تأیید مدیر" }));
    await waitFor(() => expect(timeline).toContain("submit_review"));
    expect(timeline.slice(-3)).toEqual(["save_workspace", "upload_image", "submit_review"]);
    expect(uploadKeys).toHaveLength(2);
    expect(uploadKeys[0]).toBeTruthy();
    expect(uploadKeys[1]).toBe(uploadKeys[0]);
  });
});
