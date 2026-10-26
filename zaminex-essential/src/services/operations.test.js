import test from "node:test";
import assert from "node:assert/strict";
import { createSeed } from "../mock/seed.js";
import { operate, canAccess, matchListings } from "./operations.js";
function flow() {
  let db = createSeed();
  const run = (user, action, p) => (db = operate(db, user, action, p));
  run("u2", "createContact", {
    first_name: "آزمون",
    last_name: "گردش کار",
    phone: "09121119999",
  });
  const owner = db._result.id;
  run("u2", "createRegistrationRequest", {
    management_scope_id: "s1",
    contact_id: owner,
    description: "فروش آپارتمان",
    title: "آپارتمان آزمایشی",
  });
  const req = db._result.id;
  run("u2", "assignRegistrationRequest", { id: req, assigned_to_id: "u4" });
  run("u4", "startAppraisal", { id: req });
  const workspace = {
    id: req,
    property: {
      address: "تهران",
      district_id: "district1",
      area: 100,
      rooms: 2,
      property_type_id: "apartment",
    },
    listing: { deal_type_id: "sale", sale_price: 10000000000 },
    appraisal: {
      findings: "بازدید و بررسی انجام شد",
      estimated_price: 9500000000,
    },
  };
  run("u4", "saveWorkspace", workspace);
  const listing = db.listings.find((l) => l.registration_request_id === req).id;
  run("u4", "submitListingForReview", { id: listing });
  run("u2", "requestListingChanges", { id: listing, reason: "نشانی کامل شود" });
  workspace.property.address = "تهران، خیابان بهار، پلاک ۲";
  run("u4", "saveWorkspace", workspace);
  run("u4", "submitListingForReview", { id: listing });
  run("u2", "approveListing", { id: listing });
  return {
    get db() {
      return db;
    },
    run,
    req,
    listing,
    owner,
    workspace,
  };
}
test("complete property cycle, inquiry, viewing, offer, contract and partial receipt", () => {
  const f = flow();
  assert.equal(
    f.db.registrationRequests.find((r) => r.id === f.req).status,
    "COMPLETED",
  );
  assert.equal(f.db.listings.find((l) => l.id === f.listing).status, "ACTIVE");
  f.run("u2", "createInquiry", {
    contact_id: f.owner,
    management_scope_id: "s1",
    assigned_to_id: "u4",
    district_ids: ["district1"],
    preference: { deal_type_id: "sale", max_sale_price: 11000000000 },
  });
  const inquiry = f.db._result.id;
  f.run("u4","acceptAssignment",{collection:"inquiries",id:inquiry});
  assert.equal(
    matchListings(f.db, inquiry).find((x) => x.listing.id === f.listing)
      .compatible,
    true,
  );
  f.run("u4", "introduceListing", {
    inquiry_id: inquiry,
    listing_id: f.listing,
  });
  const introduction = f.db._result.id;
  f.run("u4", "scheduleViewing", {
    introduction_id: introduction,
    scheduled_at: new Date(Date.now() + 3600000).toISOString(),
  });
  f.run("u4", "completeViewing", { id: f.db._result.id, outcome: "مورد پسند" });
  f.run("u4", "createDeal", { introduction_id: introduction });
  const deal = f.db._result.id;
  f.run("u4", "submitOffer", { deal_id: deal, sale_price: 9900000000 });
  f.run("u4", "acceptOffer", { id: f.db._result.id });
  assert.equal(f.db.listings.find((x) => x.id === f.listing).status, "ACTIVE");
  f.run("u7", "createContract", { id: deal });
  const contract = f.db._result.id;
  for (const party of f.db.contractParties.filter(
    (p) => p.contract_id === contract,
  ))
    f.run("u7", "signContract", { id: contract, party_id: party.id });
  f.run("u7", "finalizeContract", { id: contract });
  assert.equal(f.db.listings.find((x) => x.id === f.listing).status, "CLOSED");
  f.run("u8", "approveCommission", { id: contract });
  const commission = f.db._result.id;
  f.run("u8", "confirmPayment", {
    direction: "IN",
    amount: 10000000,
    contact_id: f.owner,
    allocations: [{ commission_id: commission, amount: 10000000 }],
  });
  assert.equal(
    f.db.commissions.find((x) => x.id === commission).final_amount,
    45000000,
  );
  assert.equal(
    f.db.paymentAllocations.find((x) => x.payment_id === f.db._result.id)
      .amount,
    10000000,
  );
});
test("no mutation on failure, private ownership and wrong-team writes blocked", () => {
  const db = createSeed(),
    snapshot = JSON.stringify(db);
  assert.throws(() =>
    operate(db, "u6", "assignRegistrationRequest", {
      id: "r1",
      assigned_to_id: "u6",
    }),
  );
  assert.equal(JSON.stringify(db), snapshot);
  const property = db.properties.find((p) => p.management_scope_id === "s1");
  assert.equal(canAccess(db, "u6", "properties", property), false);
  assert.throws(() =>
    operate(db, "u4", "confirmPayment", { amount: 1, direction: "IN" }),
  );
});
test("stale property snapshot cannot be approved", () => {
  const f = flow();
  const l = f.db.listings.find((x) => x.id === f.listing);
  l.review_status = "PENDING";
  f.db.listingReviews.push({
    id: "stale",
    listing_id: l.id,
    decision: "PENDING",
    submitted_version: l.version,
    submitted_snapshot: { property_version: 0 },
  });
  assert.throws(() => f.run("u2", "approveListing", { id: l.id }), /تغییر/);
});
test("financial allocation limits, reversal linkage and replay safety", () => {
  let db = createSeed();
  const run = (action, p) => (db = operate(db, "u8", action, p));
  assert.throws(
    () =>
      run("confirmPayment", {
        direction: "IN",
        amount: 100,
        allocations: [{ commission_id: "cm1", amount: 101 }],
      }),
    /تخصیص/,
  );
  assert.throws(
    () =>
      run("confirmPayment", {
        direction: "IN",
        amount: 999999999,
        allocations: [{ commission_id: "cm1", amount: 999999999 }],
      }),
    /مانده/,
  );
  run("confirmPayment", {
    operation_id: "repeat",
    direction: "IN",
    amount: 100,
    allocations: [{ commission_id: "cm1", amount: 100 }],
  });
  const id = db._result.id,
    count = db.payments.length;
  run("confirmPayment", {
    operation_id: "repeat",
    direction: "IN",
    amount: 100,
    allocations: [{ commission_id: "cm1", amount: 100 }],
  });
  assert.equal(db.payments.length, count);
  run("reversePayment", { id, reason: "ثبت اشتباه" });
  assert.equal(db.payments.find((p) => p.id === id).status, "REVERSED");
  assert.ok(db.payments.find((p) => p.reversal_of_id === id));
});
test("scope transfer coordinates request/property/listing, preserves staff membership", () => {
  let db = createSeed();
  const r = db.registrationRequests.find(
    (r) => r.resulting_property_id && r.management_scope_id === "s1",
  );
  const prop = r.resulting_property_id,
    memberCount = db.memberships.length;
  db = operate(db, "u2", "transferScope", {
    collection: "registrationRequests",
    id: r.id,
    to_scope_id: "s2",
    assigned_to_id: "u6",
    reason: "اصلاح محدوده",
  });
  assert.equal(
    db.properties.find((p) => p.id === prop).management_scope_id,
    "s2",
  );
  assert.ok(
    db.listings
      .filter((l) => l.property_id === prop)
      .every((l) => l.assigned_to_id === "u6"),
  );
  assert.equal(db.memberships.length, memberCount);
  assert.equal(db.transferHistory.at(-1).registration_request_id, r.id);
  assert.throws(
    () =>
      operate(db, "u3", "changeAssignee", {
        collection: "registrationRequests",
        id: r.id,
        assigned_to_id: "u4",
        reason: "تغییر",
      }),
    /عضو فعال|بسته شده/,
  );
});
test("signing seeded pending signature updates visible record", () => {
  let db = createSeed();
  const party = db.contractParties.find((p) => p.contract_id === "ct2");
  const count = db.signatures.length;
  db = operate(db, "u7", "signContract", { id: "ct2", party_id: party.id });
  assert.equal(
    db.signatures.find((x) => x.contract_party_id === party.id).status,
    "SIGNED",
  );
  assert.equal(db.signatures.length, count);
});
test("cross-team public introduction follows inquiry permissions", () => {
  let db = createSeed();
  const q = db.inquiries.find((q) => q.assigned_to_id === "u4");
  const l = db.listings.find(
    (l) =>
      l.status === "ACTIVE" &&
      l.review_status === "APPROVED" &&
      l.assigned_to_id !== "u4",
  );
  db = operate(db, "u4", "introduceListing", {
    inquiry_id: q.id,
    listing_id: l.id,
  });
  const intro = db.introductions.find((i) => i.id === db._result.id);
  assert.equal(canAccess(db, "u4", "introductions", intro), true);
  db = operate(db, "u4", "scheduleViewing", {
    introduction_id: intro.id,
    scheduled_at: new Date(Date.now() + 3600000).toISOString(),
  });
  assert.equal(
    canAccess(
      db,
      "u4",
      "viewings",
      db.viewings.find((v) => v.id === db._result.id),
    ),
    true,
  );
});
function workspaceFor(type, terms = {}) {
  let db = createSeed();
  db = operate(db, "u2", "createRegistrationRequest", {
    management_scope_id: "s1",
    contact_id: "c1",
    title: "ملک آزمون",
  });
  const id = db._result.id;
  db = operate(db, "u2", "assignRegistrationRequest", {
    id,
    assigned_to_id: "u4",
  });
  db = operate(db, "u4", "startAppraisal", { id });
  db = operate(db, "u4", "saveWorkspace", {
    id,
    property: {
      address: "تهران",
      district_id: "district1",
      area: 100,
      rooms: 2,
      property_type_id: "apartment",
    },
    appraisal: { findings: "گزارش کامل" },
    listing: {
      deal_type_id: type,
      sale_price: 10000000000,
      deposit: 1000000000,
      monthly_rent: 0,
      additional_terms: terms,
    },
  });
  return {
    db,
    id: db.listings.find((l) => l.registration_request_id === id).id,
  };
}
test("all six supported behaviors have executable valid submissions", () => {
  const terms = {
    sale: {},
    rent: {},
    mortgage: {},
    presale: {
      down_payment: 2000000000,
      installments: "ده قسط",
      delivery_date: "2028-01-01",
    },
    partnership: {
      owner_contribution: "زمین",
      builder_contribution: "ساخت",
      owner_share: 60,
      builder_share: 40,
      delivery_date: "2028-01-01",
    },
    exchange: {
      offered_asset: "آپارتمان دیگر",
      asset_value: 10000000000,
      counter_asset_value: 9000000000,
      balance: 1000000000,
    },
  };
  for (const [type, t] of Object.entries(terms)) {
    const f = workspaceFor(type, t);
    const db = operate(f.db, "u4", "submitListingForReview", { id: f.id });
    assert.equal(
      db.listings.find((l) => l.id === f.id).review_status,
      "PENDING",
      type,
    );
  }
});
test("invalid mortgage, partnership and missing version required condition cannot submit", () => {
  const mortgage = workspaceFor("mortgage");
  mortgage.db.listings.find((l) => l.id === mortgage.id).monthly_rent = 500;
  assert.throws(
    () =>
      operate(mortgage.db, "u4", "submitListingForReview", { id: mortgage.id }),
    /صفر/,
  );
  const partnership = workspaceFor("partnership", {
    owner_contribution: "زمین",
    builder_contribution: "ساخت",
    owner_share: 60,
    builder_share: 30,
    delivery_date: "2028-01-01",
  });
  assert.throws(
    () =>
      operate(partnership.db, "u4", "submitListingForReview", {
        id: partnership.id,
      }),
    /صد درصد/,
  );
  const sale = workspaceFor("sale");
  sale.db.dealTypeVersions
    .find(
      (v) =>
        v.id ===
        sale.db.listings.find((l) => l.id === sale.id).deal_type_version_id,
    )
    .validation_rules.required.push("special_condition");
  assert.throws(
    () => operate(sale.db, "u4", "submitListingForReview", { id: sale.id }),
    /special_condition/,
  );
});
test("another listing on same property cannot bypass finalized-contract exclusivity", () => {
  let db = createSeed();
  const c = db.contracts.find((c) => c.id === "ct1"),
    d = db.deals.find((d) => d.id === c.deal_id),
    l = db.listings.find((l) => l.id === d.listing_id),
    o = db.offers.find((o) => o.id === c.accepted_offer_id);
  db.listings.push({
    ...structuredClone(l),
    id: "parallelListing",
    status: "ACTIVE",
  });
  db.deals.push({
    ...structuredClone(d),
    id: "parallelDeal",
    stage: "CONTRACT",
    listing_id: "parallelListing",
    accepted_offer_id: "parallelOffer",
  });
  db.offers.push({
    ...structuredClone(o),
    id: "parallelOffer",
    deal_id: "parallelDeal",
  });
  db.contracts.push({
    ...structuredClone(c),
    id: "parallelContract",
    deal_id: "parallelDeal",
    accepted_offer_id: "parallelOffer",
    status: "SIGNED",
  });
  db.contractParties
    .filter((p) => p.contract_id === c.id)
    .forEach((p, i) => {
      db.contractParties.push({
        ...p,
        id: `parallelParty${i}`,
        contract_id: "parallelContract",
      });
      db.signatures.push({
        id: `parallelSignature${i}`,
        contract_party_id: `parallelParty${i}`,
        status: "SIGNED",
      });
    });
  assert.throws(
    () => operate(db, "u7", "finalizeContract", { id: "parallelContract" }),
    /ناسازگار/,
  );
});
test("contract signing checks frozen terms and accepted offer version chain", () => {
  const db = createSeed(),
    c = db.contracts.find((c) => c.id === "ct2"),
    party = db.contractParties.find((p) => p.contract_id === c.id);
  c.monthly_rent = 100;
  assert.throws(
    () => operate(db, "u7", "signContract", { id: c.id, party_id: party.id }),
    /صفر/,
  );
  c.monthly_rent = 0;
  c.deal_type_version_id = "dtv1";
  assert.throws(
    () => operate(db, "u7", "signContract", { id: c.id, party_id: party.id }),
    /نسخه/,
  );
});
test("assignment keeps deadline on dossier and recreates task for new consultant", () => {
  let db = createSeed();
  db = operate(db, "u2", "createRegistrationRequest", {
    management_scope_id: "s1",
    contact_id: "c1",
  });
  const id = db._result.id;
  const due_at = "2026-12-01T10:00:00.000Z";
  db = operate(db, "u2", "assignRegistrationRequest", {
    id,
    assigned_to_id: "u4",
    due_at,
  });
  assert.equal(db.registrationRequests.find((r) => r.id === id).due_at, due_at);
  assert.throws(()=>operate(db,"u2","assignRegistrationRequest",{id,assigned_to_id:"u5",due_at,reason:"توزیع مجدد"}),/دو روز/);
  db.registrationRequests.find(r=>r.id===id).assigned_at = new Date(Date.now()-49*3600000).toISOString();
  db = operate(db, "u2", "assignRegistrationRequest", {
    id,
    assigned_to_id: "u5",
    reason: "عدم پاسخ پس از دو روز",
    due_at,
  });
  assert.equal(
    db.tasks.filter((t) => t.subject_id === id && t.status === "OPEN").length,
    1,
  );
  assert.equal(
    db.tasks.find((t) => t.subject_id === id && t.status === "OPEN")
      .assigned_to_id,
    "u5",
  );
});

const completeTerms = {
  sale: {},
  rent: {},
  mortgage: {},
  presale: {
    down_payment: 2000000000,
    installments: "هشت قسط",
    delivery_date: "2028-01-01",
  },
  partnership: {
    owner_contribution: "زمین",
    builder_contribution: "ساخت",
    owner_share: 60,
    builder_share: 40,
    delivery_date: "2028-01-01",
  },
  exchange: {
    offered_asset: "ملک مقابل",
    asset_value: 10000000000,
    counter_asset_value: 9000000000,
    balance: 1000000000,
  },
};
for (const type of Object.keys(completeTerms))
  test(`full ${type} cycle reaches signed contract and partial receipt`, () => {
    const f = workspaceFor(type, completeTerms[type]);
    let db = f.db;
    const run = (user, action, payload) =>
      (db = operate(db, user, action, payload));
    run("u4", "submitListingForReview", { id: f.id });
    run("u2", "approveListing", { id: f.id });
    const listing = db.listings.find((x) => x.id === f.id);
    run("u2", "createInquiry", {
      contact_id: "c1",
      management_scope_id: "s1",
      assigned_to_id: "u4",
      preference: { deal_type_id: type },
    });
    const inquiry = db._result.id;
    run("u4","acceptAssignment",{collection:"inquiries",id:inquiry});
    run("u4", "introduceListing", {
      inquiry_id: inquiry,
      listing_id: listing.id,
    });
    const introduction = db._result.id;
    run("u4", "createDeal", { introduction_id: introduction });
    const deal = db._result.id;
    run("u4", "submitOffer", {
      deal_id: deal,
      sale_price: listing.sale_price,
      deposit: listing.deposit,
      monthly_rent: listing.monthly_rent,
    });
    run("u4", "acceptOffer", { id: db._result.id });
    run("u7", "createContract", { id: deal });
    const contract = db._result.id;
    for (const party of db.contractParties.filter(
      (x) => x.contract_id === contract,
    ))
      run("u7", "signContract", { id: contract, party_id: party.id });
    run("u7", "finalizeContract", { id: contract });
    run("u8", "approveCommission", { id: contract });
    const commission = db.commissions.find((x) => x.id === db._result.id);
    run("u8", "confirmPayment", {
      contact_id: "c1",
      direction: "IN",
      amount: 1000000,
      allocations: [{ commission_id: commission.id, amount: 1000000 }],
    });
    assert.equal(
      db.contracts.find((x) => x.id === contract).status,
      "FINALIZED",
    );
    assert.equal(
      db.paymentAllocations.find((x) => x.payment_id === db._result.id).amount,
      1000000,
    );
  });
test("presale overpayment, negative partnership shares and negative exchange values are rejected atomically", () => {
  for (const [type, terms] of [
    ["presale", { ...completeTerms.presale, down_payment: 20000000000 }],
    [
      "partnership",
      { ...completeTerms.partnership, owner_share: -10, builder_share: 110 },
    ],
    ["exchange", { ...completeTerms.exchange, asset_value: -1 }],
  ]) {
    const f = workspaceFor(type, terms);
    const before = JSON.stringify(f.db);
    assert.throws(
      () => operate(f.db, "u4", "submitListingForReview", { id: f.id }),
      undefined,
      type,
    );
    assert.equal(JSON.stringify(f.db), before);
  }
});

test("Persian and international phone formats detect duplicates without merging contacts", () => {
  let db = createSeed();
  db = operate(db, "u2", "createContact", {
    first_name: "آزمون",
    last_name: "اول",
    phone_number: "09129998877",
  });
  const first = db._result.id;
  db = operate(db, "u2", "createContact", {
    first_name: "آزمون",
    last_name: "دوم",
    phone_number: "۰۹۱۲۹۹۹۸۸۷۷",
  });
  assert.match(db._warning || "", /قبلاً/);
  assert.notEqual(db._result.id, first);
  assert.equal(db.contactPhones.at(-1).phone_number, "09129998877");
  db = operate(db, "u2", "createContact", {
    first_name: "آزمون",
    last_name: "سوم",
    phone_number: "+98 912 999 8877",
  });
  assert.match(db._warning || "", /قبلاً/);
});

test("contract officer sees related parties and phones but not unrelated contacts", () => {
  const db = createSeed(),
    party = db.contractParties[0],
    contact = db.contacts.find((x) => x.id === party.contact_id),
    phone = db.contactPhones.find((x) => x.contact_id === contact.id);
  assert.equal(canAccess(db, "u7", "contacts", contact), true);
  assert.equal(canAccess(db, "u7", "contactPhones", phone), true);
  const unrelated = {
    id: "private_contact",
    first_name: "محرمانه",
    created_by_id: "u2",
  };
  db.contacts.push(unrelated);
  assert.equal(canAccess(db, "u7", "contacts", unrelated), false);
  assert.equal(canAccess(db, "u4", "contacts", unrelated), false);
});

test("follow-up task keeps schedule, closes with result and preserves next action", () => {
  let db = createSeed();
  const schedule = "2030-01-01T10:00:00.000Z";
  db = operate(db, "u4", "createFollowUp", {
    contact_id: "c7",
    subject_type: "inquiry",
    subject_id: "i7",
    scheduled_at: schedule,
    notes: "تماس",
  });
  const id = db._result.id;
  const task = db.tasks.find(
    (t) => t.subject_type === "follow_up" && t.subject_id === id,
  );
  assert.equal(task.due_at, schedule);
  db = operate(db, "u4", "completeFollowUp", {
    id,
    outcome: "تماس انجام شد",
    next_action: "ارسال اطلاعات",
    next_action_at: "2030-01-02T10:00:00.000Z",
  });
  assert.equal(db.tasks.find((t) => t.id === task.id).status, "COMPLETED");
  assert.equal(
    db.followUps.find((f) => f.id === id).next_action,
    "ارسال اطلاعات",
  );
  assert.equal(
    db.followUps.find((f) => f.id === id).next_action_at,
    "2030-01-02T10:00:00.000Z",
  );
});
test("viewing workflow task uses viewing date and closes after outcome", () => {
  let db = createSeed();
  const schedule = "2030-02-01T10:00:00.000Z";
  db = operate(db, "u2", "createInquiry", {
    contact_id: "c1",
    assigned_to_id: "u4",
    management_scope_id: "s1",
    preference: { deal_type_id: "sale" },
  });
  const inquiry = db._result.id;
  db=operate(db,"u4","acceptAssignment",{collection:"inquiries",id:inquiry});
  db = operate(db, "u4", "introduceListing", {
    inquiry_id: inquiry,
    listing_id: "l7",
  });
  const intro = db._result.id;
  db = operate(db, "u4", "scheduleViewing", {
    introduction_id: intro,
    scheduled_at: schedule,
  });
  const id = db._result.id,
    task = db.tasks.find(
      (t) => t.subject_type === "viewing" && t.subject_id === id,
    );
  assert.equal(task.due_at, schedule);
  db = operate(db, "u4", "completeViewing", { id, outcome: "مناسب بود" });
  assert.equal(db.tasks.find((t) => t.id === task.id).status, "COMPLETED");
});

test("workflow task completion requires the related follow-up result", () => {
  let db = createSeed();
  db = operate(db, "u4", "createFollowUp", {
    contact_id: "c7",
    subject_type: "inquiry",
    subject_id: "i7",
    scheduled_at: "2030-01-01T10:00:00Z",
  });
  const task = db.tasks.find(
    (t) => t.subject_type === "follow_up" && t.subject_id === db._result.id,
  );
  assert.throws(
    () => operate(db, "u4", "completeTask", { id: task.id }),
    /نتیجه/,
  );
});

test('manager reopens the same completed case with archived evidence and a new consultant task',()=>{
 const f=flow(),before=structuredClone(f.db);
 assert.throws(()=>f.run('u4','reopenAppraisal',{id:f.req,reason:'بازدید دوباره'}),/گروه|مدیریت/);
 assert.throws(()=>f.run('u3','reopenAppraisal',{id:f.req,reason:'بازدید دوباره'}),/دسترسی|مدیریت/);
 assert.throws(()=>f.run('u2','reopenAppraisal',{id:f.req}),/دلیل/);
 f.run('u2','reopenAppraisal',{id:f.req,reason:'تغییر مشخصات ملک',operation_id:'repeat-review'});
 const r=f.db.registrationRequests.find(x=>x.id===f.req),l=f.db.listings.find(x=>x.id===f.listing);
 assert.equal(r.status,'CHANGES_REQUIRED');
 assert.equal(r.assigned_to_id,'u4');
 assert.equal(r.acceptance_status,'ACCEPTED');
 assert.equal(r.closed_at,null);
 assert.equal(l.review_status,'CHANGES_REQUIRED');assert.equal(l.status,'PAUSED');
 assert.equal(f.db.registrationRequests.length,before.registrationRequests.length);
 assert.equal(f.db.properties.length,before.properties.length);
 assert.equal(f.db.listings.length,before.listings.length);
 assert.deepEqual(f.db.listingReviews,before.listingReviews);
 assert.equal(r.reappraisal_history.length,1);
 assert.equal(r.reappraisal_history[0].appraisal_snapshot.findings,before.appraisals.find(a=>a.registration_request_id===f.req).findings);
 assert(f.db.tasks.some(t=>t.subject_id===r.id&&t.assigned_to_id==='u4'&&t.status==='OPEN'));
 assert(f.db.stageHistory.some(h=>h.subject_id===r.id&&h.from_stage==='COMPLETED'&&h.to_stage==='CHANGES_REQUIRED'&&h.reason==='تغییر مشخصات ملک'));
 const taskCount=f.db.tasks.length;
 f.run('u2','reopenAppraisal',{id:f.req,reason:'تغییر مشخصات ملک',operation_id:'repeat-review'});
 assert.equal(f.db.tasks.length,taskCount);
 f.run('u4','saveWorkspace',{...f.workspace,appraisal:{...f.workspace.appraisal,findings:'گزارش جدید'}});
 assert.equal(f.db.registrationRequests.find(x=>x.id===f.req).reappraisal_history[0].appraisal_snapshot.findings,before.appraisals.find(a=>a.registration_request_id===f.req).findings);
 f.run('u4','submitListingForReview',{id:f.listing});f.run('u2','approveListing',{id:f.listing});
 assert.equal(f.db.registrationRequests.find(x=>x.id===f.req).status,'COMPLETED');
 assert.equal(f.db.listingReviews.length,before.listingReviews.length+1);
});
test('completed supply attached to a closed listing cannot be reopened as active supply',()=>{
 const f=flow();f.db.listings.find(x=>x.id===f.listing).status='CLOSED';
 assert.throws(()=>f.run('u2','reopenAppraisal',{id:f.req,reason:'بازدید مجدد'}),/عرضه|بسته|قرارداد/);
});

test('duplicate decision removes pending review and cannot reactivate the duplicate listing',()=>{
 const f=flow();f.run('u2','reopenAppraisal',{id:f.req,reason:'کارشناسی مجدد'});
 f.run('u4','submitListingForReview',{id:f.listing});
 f.run('u2','markDuplicateCase',{id:f.req,original_id:'r2',reason:'تطبیق مشخصات ملک با پرونده اصلی'});
 assert.equal(f.db.listings.find(l=>l.id===f.listing).status,'PAUSED');
 assert.equal(f.db.listings.find(l=>l.id===f.listing).review_status,'CHANGES_REQUIRED');
 assert(!f.db.listingReviews.some(review=>review.listing_id===f.listing&&review.decision==='PENDING'));
 assert.throws(()=>f.run('u2','approveListing',{id:f.listing}),/بسته/);
});
