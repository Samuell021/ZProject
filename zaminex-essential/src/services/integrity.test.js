import { test } from "node:test";
import assert from "node:assert/strict";
import { createSeed } from "../mock/seed.js";
test("داده نمایشی حداقل تعداد و پیوندهای معتبر دارد", () => {
  const d = createSeed();
  for (const [key, n] of Object.entries({
    users: 8,
    scopes: 3,
    contacts: 20,
    registrationRequests: 15,
    properties: 12,
    listings: 15,
    inquiries: 10,
    introductions: 15,
    viewings: 8,
    deals: 6,
    contracts: 3,
  })) {
    assert.ok(d[key].length >= n, `${key}: ${d[key].length}<${n}`);
    assert.equal(
      new Set(d[key].map((x) => x.id)).size,
      d[key].length,
      `duplicate ${key}`,
    );
  }
  const check = (from, field, to) => {
    for (const x of d[from])
      if (x[field])
        assert.ok(
          d[to].some((y) => y.id === x[field]),
          `${from}.${field}=${x[field]} missing ${to}`,
        );
  };
  for (const args of [
    ["contactPhones", "contact_id", "contacts"],
    ["propertyContacts", "property_id", "properties"],
    ["propertyContacts", "contact_id", "contacts"],
    ["registrationRequests", "contact_id", "contacts"],
    ["registrationRequests", "resulting_property_id", "properties"],
    ["registrationRequests", "assigned_to_id", "users"],
    ["memberships", "user_id", "users"],
    ["memberships", "scope_id", "scopes"],
    ["listings", "property_id", "properties"],
    ["listings", "deal_type_version_id", "dealTypeVersions"],
    ["inquiries", "contact_id", "contacts"],
    ["inquiryPreferences", "inquiry_id", "inquiries"],
    ["introductions", "listing_id", "listings"],
    ["introductions", "inquiry_id", "inquiries"],
    ["viewings", "introduction_id", "introductions"],
    ["deals", "listing_id", "listings"],
    ["deals", "inquiry_id", "inquiries"],
    ["offers", "deal_id", "deals"],
    ["contracts", "deal_id", "deals"],
    ["contractParties", "contract_id", "contracts"],
    ["signatures", "contract_party_id", "contractParties"],
    ["commissions", "contract_id", "contracts"],
    ["commissionShares", "commission_id", "commissions"],
    ["paymentAllocations", "payment_id", "payments"],
  ])
    check(...args);
  for (const p of d.properties)
    for (const key of ["sale_price", "deposit", "monthly_rent", "deal_type_id"])
      assert.ok(!(key in p), `Property contains ${key}`);
  for (const u of d.users) {
    assert.ok(!("role" in u));
    for (const id of u.group_ids) assert.ok(d.groups.some((g) => g.id === id));
  }
  for (const x of d.transferHistory)
    assert.equal(
      ["property_id", "registration_request_id", "inquiry_id"].filter(
        (k) => x[k],
      ).length,
      1,
    );
  for (const x of d.assignmentHistory)
    assert.equal(
      [
        "registration_request_id",
        "property_id",
        "listing_id",
        "inquiry_id",
        "deal_id",
      ].filter((k) => x[k]).length,
      1,
    );
  for (const pay of d.payments) {
    const total = d.paymentAllocations
      .filter((x) => x.payment_id === pay.id)
      .reduce((s, x) => s + x.amount, 0);
    assert.ok(total <= pay.amount, `payment ${pay.id} overallocated`);
  }
});
