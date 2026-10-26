import {buildDemoScenarios} from './demo-scenarios.js';
export const schemaVersion = 3;
export function createSeed() {
  const now = new Date();
  const date = (days = 0, hours = 0) =>
    new Date(+now + days * 86400000 + hours * 3600000).toISOString();
  const ids = [
    "sale",
    "rent",
    "mortgage",
    "presale",
    "partnership",
    "exchange",
  ];
  const names = [
    "مرتضی کاظمی",
    "خانم زرعکانی",
    "امین زارعی",
    "سارا محمدی",
    "رضا حسینی",
    "نازنین موسوی",
    "امیر صادقی",
    "الهام کاظمی",
  ];
  const groupIds = [
    "GENERAL_MANAGER",
    "RANGE_MANAGER",
    "RANGE_MANAGER",
    "AGENT",
    "AGENT",
    "AGENT",
    "CONTRACT_OFFICER",
    "FINANCE",
  ];
  const scope = (n) => (n % 3 === 0 ? "s2" : "s1");
  const agent = (n) => (scope(n) === "s2" ? "u6" : n % 2 ? "u4" : "u5");
  const data = Object.fromEntries(
    [
      "users",
      "groups",
      "staffProfiles",
      "scopes",
      "memberships",
      "contacts",
      "contactPhones",
      "propertyContacts",
      "registrationRequests",
      "properties",
      "appraisals",
      "listings",
      "listingReviews",
      "dealTypes",
      "dealTypeVersions",
      "inquiries",
      "inquiryPreferences",
      "inquiryCriteria",
      "introductions",
      "viewings",
      "tasks",
      "followUps",
      "rescheduleHistory",
      "deals",
      "dealParticipants",
      "offers",
      "contracts",
      "contractParties",
      "signatures",
      "attachments",
      "amendments",
      "commissionPolicies",
      "commissions",
      "commissionShares",
      "payments",
      "paymentAllocations",
      "stageHistory",
      "notifications",
      "activityLogs",
      "assignmentHistory",
      "transferHistory",
      "districts",
    ].map((k) => [k, []]),
  );
  data.groups = ["مدیر کل", "مدیر رنج", "مشاور", "مسئول قرارداد", "مالی"].map(
    (name, i) => ({
      id: [
        "GENERAL_MANAGER",
        "RANGE_MANAGER",
        "AGENT",
        "CONTRACT_OFFICER",
        "FINANCE",
      ][i],
      code: [
        "GENERAL_MANAGER",
        "RANGE_MANAGER",
        "AGENT",
        "CONTRACT_OFFICER",
        "FINANCE",
      ][i],
      name,
      permission_codes:
        i === 0
          ? ["*"]
          : i === 1
            ? ["registration", "inquiry", "deal", "team"]
            : i === 2
              ? ["registration", "inquiry", "deal"]
              : i === 3
                ? ["contract"]
                : ["finance"],
    }),
  );
  data.users = names.map((_, i) => ({
    id: `u${i + 1}`,
    username: [
      "admin",
      "manager.north",
      "manager.west",
      "sara",
      "reza",
      "nazanin",
      "contracts",
      "finance",
    ][i],
    is_active: true,
    group_ids: [groupIds[i]],
  }));
  data.staffProfiles = names.map((full_name, i) => ({
    id: `sp${i + 1}`,
    user_id: `u${i + 1}`,
    full_name,
    mobile: `0912000000${i}`,
    avatar: null,
    hired_at: date(-400 - i),
    notes: "",
  }));
  data.scopes = ["رنج شمال تهران", "رنج غرب تهران", "رنج مرکزی"].map(
    (name, i) => ({
      id: `s${i + 1}`,
      name,
      code: `S${i + 1}`,
      description: "تیم تخصصی معاملات منطقه",
      is_active: true,
      created_by_id: "u1",
    }),
  );
  data.memberships = [
    ["s1", "u2", "MANAGER"],
    ["s1", "u4", "CONSULTANT"],
    ["s1", "u5", "CONSULTANT"],
    ["s2", "u3", "MANAGER"],
    ["s2", "u6", "CONSULTANT"],
    ["s3", "u1", "MANAGER"],
  ].map(([scope_id, user_id, membership_role], i) => ({
    id: `mb${i + 1}`,
    scope_id,
    user_id,
    membership_role,
    joined_at: date(-120),
    left_at: null,
    assigned_by_id: "u1",
  }));
  data.memberships.push({
    id: "mb7",
    scope_id: "s2",
    user_id: "u5",
    membership_role: "CONSULTANT",
    joined_at: date(-250),
    left_at: date(-121),
    assigned_by_id: "u1",
  });
  data.districts = ["سعادت‌آباد", "نیاوران", "پونک", "جنت‌آباد", "ونک"].map(
    (name, i) => ({ id: `district${i + 1}`, name }),
  );
  const first = [
    "محمد",
    "فاطمه",
    "حسن",
    "زهرا",
    "مهدی",
    "نرگس",
    "آرش",
    "لیلا",
    "کامران",
    "مینا",
    "فرهاد",
    "شبنم",
    "بهرام",
    "رویا",
    "پویا",
    "مهسا",
    "کیان",
    "نگار",
    "سامان",
    "هستی",
    "مریم", "امید", "سحر", "پیمان", "پریسا", "شهاب", "حدیث", "حامد",
    "الهه", "احسان", "سمیرا", "نوید", "نسترن", "بابک", "سپیده", "علی", "یاسمن", "فرزاد", "ترانه", "رامین",
  ];
  data.contacts = first.map((first_name, i) => ({
    id: `c${i + 1}`,
    person_type: "INDIVIDUAL",
    first_name,
    last_name: ["احمدی", "کریمی", "رضایی", "حسینی"][i % 4],
    company_name: null,
    national_id: `001234${String(i + 1).padStart(4, "0")}`,
    notes: i === 0 ? "مالک آپارتمان سعادت‌آباد؛ قرارداد فروش قطعی شده است." : "",
    created_by_id: "u2",
    archived_at: null,
    merged_into_id: null,
  }));
  data.contactPhones = data.contacts.map((c, i) => ({
    id: `cp${i + 1}`,
    contact_id: c.id,
    phone_number: `0912${String(1000000 + i).padStart(7, "0")}`,
    label: "همراه",
    is_primary: true,
  }));
  data.dealTypes = [
    "فروش",
    "رهن و اجاره",
    "رهن کامل",
    "پیش‌فروش",
    "مشارکت",
    "معاوضه",
  ].map((name, i) => ({
    id: ids[i],
    code: [
      "SALE",
      "RENT",
      "FULL_MORTGAGE",
      "PRE_SALE",
      "PARTNERSHIP",
      "EXCHANGE",
    ][i],
    name,
    behavior_type: ids[i].toUpperCase(),
    is_active: true,
  }));
  const fieldNames = {
    sale_price: "قیمت فروش",
    deposit: "ودیعه",
    monthly_rent: "اجاره ماهانه",
    down_payment: "پیش‌پرداخت",
    installments: "اقساط",
    delivery_date: "موعد تحویل",
    owner_contribution: "آورده مالک",
    builder_contribution: "آورده سازنده",
    owner_share: "سهم مالک",
    builder_share: "سهم سازنده",
    offered_asset: "دارایی پیشنهادی",
    asset_value: "ارزش دارایی",
    counter_asset_value: "ارزش دارایی مقابل",
    balance: "مابه‌التفاوت",
  };
  const fields = [
    ["sale_price"],
    ["deposit", "monthly_rent"],
    ["deposit"],
    ["sale_price", "down_payment", "installments", "delivery_date"],
    [
      "owner_contribution",
      "builder_contribution",
      "owner_share",
      "builder_share",
      "delivery_date",
    ],
    ["offered_asset", "asset_value", "counter_asset_value", "balance"],
  ];
  data.dealTypeVersions = ids.map((deal_type_id, i) => ({
    id: `dtv${i + 1}`,
    deal_type_id,
    version_number: 1,
    status: "PUBLISHED",
    field_definitions: fields[i].map((code) => ({
      code,
      name: fieldNames[code] || code,
      required: true,
      type: code.includes("date")
        ? "date"
        : code.includes("asset") || code.includes("contribution")
          ? "text"
          : "number",
    })),
    validation_rules: { required: fields[i], monthly_rent: i === 2 ? 0 : null },
    published_at: date(-200),
  }));
  data.properties = Array.from({ length: 12 }, (_, i) => ({
    id: `p${i + 1}`,
    internal_code: `P-${1001 + i}`,
    title: `آپارتمان ${90 + i * 10} متری ${data.districts[i % 5].name}`,
    management_scope_id: scope(i + 1),
    consultant_id: agent(i + 1),
    property_type_id: "apartment",
    property_usage_id: "residential",
    district_id: `district${(i % 5) + 1}`,
    address: `تهران، ${data.districts[i % 5].name}، خیابان بهار، پلاک ${i + 1}`,
    latitude: 35.76 + i * 0.001,
    longitude: 51.36 + i * 0.001,
    area: 90 + i * 10,
    rooms: 2 + (i % 3),
    floor: (i % 5) + 1,
    built_year: 1394 + (i % 9),
    description: "نورگیر، دسترسی مناسب و سند آماده بررسی",
    record_status: "ACTIVE",
    attribute_values: { parking: true, elevator: true, storage: i % 2 === 0 },
    images: [],
    version: 1,
  }));
  data.propertyContacts = data.properties.map((p, i) => ({
    id: `pc${i + 1}`,
    property_id: p.id,
    contact_id: `c${i + 1}`,
    relation_type: "OWNER",
    ownership_percent: i === 0 ? 60 : 100,
    is_primary: true,
  }));
  data.propertyContacts.push({
    id: "pc13",
    property_id: "p1",
    contact_id: "c13",
    relation_type: "OWNER",
    ownership_percent: 40,
    is_primary: false,
  });
  data.listings = Array.from({ length: 15 }, (_, i) => {
    const p = data.properties[i % 12],
      t = i % 6;
    return {
      id: `l${i + 1}`,
      code: `L-${1001 + i}`,
      property_id: p.id,
      registration_request_id: `r${(i % 12) + 1}`,
      assigned_to_id: p.consultant_id,
      created_by_id: p.consultant_id,
      deal_type_id: ids[t],
      deal_type_version_id: `dtv${t + 1}`,
      title: `${data.dealTypes[t].name} ${p.title}`,
      description: "شرایط عرضه با هماهنگی مالک",
      sale_price: [0, 3, 5].includes(t) ? 9000000000 + i * 500000000 : null,
      deposit: [1, 2].includes(t) ? 1200000000 + i * 50000000 : null,
      monthly_rent: t === 1 ? 20000000 + i * 1000000 : t === 2 ? 0 : null,
      additional_terms:
        t === 3
          ? {
              down_payment: 3000000000,
              installments: 12,
              delivery_date: date(365),
            }
          : t === 4
            ? {
                owner_contribution: "زمین",
                builder_contribution: "ساخت",
                owner_share: 60,
                builder_share: 40,
                delivery_date: date(730),
              }
            : t === 5
              ? {
                  offered_asset: "آپارتمان کوچک‌تر",
                  asset_value: 7000000000,
                  counter_asset_value: 9000000000,
                  balance: 2000000000,
                }
              : {},
      review_status:
        i === 8
          ? "PENDING"
          : i === 9
            ? "CHANGES_REQUIRED"
            : i === 10 || i === 11
              ? "DRAFT"
              : "APPROVED",
      status: i === 4 ? "PAUSED" : i >= 8 && i <= 11 ? "PAUSED" : "ACTIVE",
      review_requested_at: date(-6),
      approved_by_id:
        i >= 8 && i <= 11 ? null : p.management_scope_id === "s2" ? "u3" : "u2",
      approved_at: i >= 8 && i <= 11 ? null : date(-5),
      rejection_reason: i === 9 ? "تصویر سند و توضیح پارکینگ تکمیل شود" : null,
      terms_snapshot: { deal_type: ids[t], label: "شرایط نمونه نمایشی" },
      version: 1,
      closed_at: null,
      closure_reason: null,
    };
  });
  return buildDemoScenarios(data,{date,scope,agent});
}

// Rename only the original demo identities; never reset dossiers or custom names.
export function updateDemoStaff(db) {
  const changes = {
    u1: ["علی رضایی", "مرتضی کاظمی"],
    u2: ["مریم احمدی", "خانم زرعکانی"],
    u3: ["حسین کریمی", "امین زارعی"],
  };
  return { ...db, staffProfiles: db.staffProfiles.map(profile => {
    const change = changes[profile.user_id];
    return change && profile.full_name === change[0] ? { ...profile, full_name: change[1] } : profile;
  }) };
}
