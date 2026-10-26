import {inquiryRelations,inquiryStatusActions} from './inquiry-status.js';
import {caseRelations,caseStatusActions,terminalCaseStatuses} from "./case-status.js";
import {activityOpen,activityAssignees} from "./activities.js";
import {introductionConsultants,latestCompletedViewing} from "./collaboration.js";
import {canEditPropertyListings, ownsProperty, propertyOwner, propertyRequest, propertyReviewState, syncPropertyListings} from "./property-listings.js";
import { assignmentState, canReassign, pendingExtension, pendingWithdrawal, leadState, syncLeadAcceptanceTasks } from "./intake.js";
const canonicalPhone = (value) => {
  const digits = String(value ?? "")
    .replace(/[۰-۹٠-٩]/g, (char) =>
      String(
        "۰۱۲۳۴۵۶۷۸۹".includes(char)
          ? "۰۱۲۳۴۵۶۷۸۹".indexOf(char)
          : "٠١٢٣٤٥٦٧٨٩".indexOf(char),
      ),
    )
    .replace(/\D/g, "");
  return digits.replace(/^0098(?=9\d{9}$)/, "0").replace(/^98(?=9\d{9}$)/, "0");
};
const actionTitles = {
  saveInquiryNeeds:"ذخیره نیاز و بودجه متقاضی",
  changeInquiryCaseStatus:"تغییر وضعیت درخواست متقاضی",
  reopenAppraisal: "درخواست کارشناسی مجدد",
  setPropertyTitle: "تعیین عنوان ملک توسط مدیر",
  changePropertyCaseStatus: "تغییر وضعیت پرونده ملک",
  markDuplicateCase: "تأیید تکراری بودن پرونده",
  createLead: "ثبت سرنخ و ایجاد پرونده",
  submitPropertyForReview: "ارسال ملک برای بررسی",
  reviewProperty: "بررسی ملک",
  savePropertyListing: "ذخیره قیمت و شرایط عرضه",
  acceptLead: "پذیرش سرنخ توسط مدیر",
  assignCase: "ارجاع پرونده به کارشناس",
  acceptAssignment: "پذیرش و شروع رسیدگی",
  rejectAssignment: "درخواست انصراف مشاور",
  reviewConsultantWithdrawal: "تصمیم درباره انصراف مشاور",
  postponeAssignment: "درخواست تمدید مهلت",
  approveAssignmentExtension: "تأیید تمدید مهلت",
  rejectAssignmentExtension: "رد درخواست تمدید مهلت",
  createContact: "ثبت شخص",
  createRegistrationRequest: "ثبت درخواست ملک",
  assignRegistrationRequest: "ارجاع درخواست ملک",
  startAppraisal: "شروع کارشناسی",
  saveWorkspace: "ذخیره کارشناسی و شرایط عرضه",
  submitListingForReview: "ارسال فایل برای بررسی",
  requestListingChanges: "برگشت پرونده برای اصلاح",
  approveListing: "تأیید و فعال‌سازی فایل",
  transferScope: "انتقال پرونده بین رنج‌ها",
  changeAssignee: "تغییر مشاور مسئول",
  changeMembership: "تغییر عضویت تیم",
  createInquiry: "ثبت درخواست مشتری",
  introduceListing: "معرفی فایل به مشتری",
  updateIntroduction: "ثبت نتیجه معرفی",
  scheduleViewing: "برنامه‌ریزی بازدید",
  completeViewing: "ثبت نتیجه بازدید",
  createFollowUp: "ثبت پیگیری",
  createTask: "ثبت کار",
  rescheduleTask: "تعویق کار",
  rescheduleFollowUp: "تعویق پیگیری",
  completeFollowUp: "تکمیل پیگیری",
  completeTask: "تکمیل وظیفه",
  createDeal: "شروع مذاکره",
  submitOffer: "ثبت پیشنهاد مالی",
  acceptOffer: "پذیرش پیشنهاد",
  createContract: "ایجاد قرارداد نمایشی",
  signContract: "ثبت امضای نمایشی",
  finalizeContract: "قطعی‌کردن قرارداد",
  addContractAttachment: "ثبت پیوست محلی نمایشی",
  createAmendment: "ثبت اصلاحیه قرارداد",
  approveCommission: "تصویب کمیسیون و سهم‌ها",
  confirmPayment: "تأیید وجه و تخصیص مبلغ",
  reversePayment: "ثبت برگشت وجه",
  createDealType: "ایجاد نوع معامله",
  publishDealTypeVersion: "انتشار نسخه جدید نوع معامله",
  markNotificationRead: "خواندن اعلان",
  setListingStatus: "تغییر وضعیت عرضه",
  updateInquiry: "به‌روزرسانی درخواست مشتری",
  closeDeal: "مذاکره ناموفق",
  succeedDeal: "مذاکره موفق",
  saveContractTerms: "ثبت مبلغ و شرایط قرارداد",
};
const clone = (value) => structuredClone(value);
const now = () => new Date().toISOString();
const uid = (prefix) =>
  `${prefix}_${globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)}`;
const assert = (ok, message) => {
  if (!ok) throw new Error(message);
};
export function groupCodes(db, actorId) {
  const user = db.users.find((x) => x.id === actorId);
  return (user?.group_ids || [])
    .map((id) => db.groups.find((g) => g.id === id)?.code)
    .filter(Boolean);
}
export function hasGroup(db, actorId, ...codes) {
  return groupCodes(db, actorId).some((c) => codes.includes(c));
}
export function hasPermission(db, actorId, code) {
  return (
    hasGroup(db, actorId, "GENERAL_MANAGER") ||
    db.groups.some(
      (g) =>
        db.users.find((u) => u.id === actorId)?.group_ids.includes(g.id) &&
        (g.permission_codes?.includes(code) || g.permission_codes?.includes("*")),
    )
  );
}
export function activeMemberships(db, actorId) {
  return db.memberships.filter((x) => x.user_id === actorId && !x.left_at);
}
function context(db, collection, record, seen = new Set()) {
  if (!record || seen.has(record)) return {};
  seen.add(record);
  if (record.management_scope_id)
    return {
      scope: record.management_scope_id,
      assignee: record.assigned_to_id || record.consultant_id,
    };
  if (record.scope_id)
    return { scope: record.scope_id, assignee: record.user_id };
  const links = [
    ["registration_request_id", "registrationRequests"],
    ["property_id", "properties"],
    ["inquiry_id", "inquiries"],
    ["listing_id", "listings"],
    ["introduction_id", "introductions"],
    ["deal_id", "deals"],
    ["contract_id", "contracts"],
    ["commission_id", "commissions"],
    ["commission_share_id", "commissionShares"],
    ["contract_party_id", "contractParties"],
  ];
  for (const [key, c] of links)
    if (record[key]) {
      const result = context(
        db,
        c,
        db[c]?.find((x) => x.id === record[key]),
        seen,
      );
      if (result.scope) return result;
    }
  if (record.subject_id) {
    const c = subjectCollection(record.subject_type);
    if (c)
      return context(
        db,
        c,
        db[c]?.find((x) => x.id === record.subject_id),
        seen,
      );
  }
  return {
    assignee: record.assigned_to_id || record.consultant_id || record.user_id,
  };
}
export function canAccess(db, actorId, collection, record) {
  const user = db.users.find((x) => x.id === actorId);
  if (!user?.is_active || !record) return false;
  if (hasGroup(db, actorId, "GENERAL_MANAGER")) return true;
  if(["contracts","contractParties","signatures","attachments","amendments"].includes(collection)||collection==="tasks"&&record.task_type==="CONTRACT_PREPARATION")return false;
  const groups = groupCodes(db, actorId);
  const ctx = context(db, collection, record);
  if(["properties","listings"].includes(collection)) {
    const property=collection==="properties"?record:db.properties.find(p=>p.id===record.property_id);
    return ownsProperty(db,actorId,property)||(groups.includes("RANGE_MANAGER")&&activeMemberships(db,actorId).some(m=>m.membership_role==="MANAGER"&&m.scope_id===property?.management_scope_id));
  }
  if(collection==="introductions") {
    const consultants=introductionConsultants(db,record);
    return [consultants.buyer,consultants.seller].includes(actorId)||(groups.includes("RANGE_MANAGER")&&activeMemberships(db,actorId).some(m=>m.membership_role==="MANAGER"&&[consultants.buyerScope,consultants.sellerScope].includes(m.scope_id)));
  }
  if(collection==="deals") {
    const partners=introductionConsultants(db,record);
    if([partners.buyer,partners.seller].includes(actorId)||(groups.includes("RANGE_MANAGER")&&activeMemberships(db,actorId).some(m=>m.membership_role==="MANAGER"&&[partners.buyerScope,partners.sellerScope].includes(m.scope_id))))return true;
  }
  if(collection==="offers")return canAccess(db,actorId,"deals",db.deals.find(row=>row.id===record.deal_id));
  if(collection==="viewings")return canAccess(db,actorId,"introductions",db.introductions.find(row=>row.id===record.introduction_id));
  if (collection === "notifications") return record.user_id === actorId;
  if(collection==="followUps")return record.consultant_id===actorId||(groups.includes("RANGE_MANAGER")&&activeMemberships(db,actorId).some(m=>m.membership_role==="MANAGER"&&m.scope_id===ctx.scope));
  if (collection === "tasks") return record.assigned_to_id === actorId ||
    (groups.includes("RANGE_MANAGER") && activeMemberships(db,actorId).some(m=>m.membership_role === "MANAGER" && m.scope_id === ctx.scope));
  if (["registrationRequests","inquiries"].includes(collection) && record.acceptance_status === "REJECTED")
    return groups.includes("RANGE_MANAGER") && activeMemberships(db,actorId).some(m=>m.membership_role === "MANAGER" && m.scope_id === ctx.scope);
  if (
    [
      "groups",
      "dealTypes",
      "dealTypeVersions",
      "districts",
      "commissionPolicies",
    ].includes(collection)
  )
    return true;
  if (collection === "users" || collection === "staffProfiles") {
    const userId = collection === "users" ? record.id : record.user_id;
    return userId === actorId || (groups.includes("RANGE_MANAGER") &&
      activeMemberships(db, actorId).some(m => m.membership_role === "MANAGER" &&
        activeMemberships(db, userId).some(other => other.scope_id === m.scope_id)));
  }
  if (collection === "scopes")
    return activeMemberships(db, actorId).some((m) => m.scope_id === record.id);
  if (
    [
      "contracts",
      "contractParties",
      "signatures",
      "attachments",
      "amendments",
      "deals",
      "offers",
      "dealParticipants",
    ].includes(collection) &&
    groups.includes("CONTRACT_OFFICER")
  )
    return true;
  if (
    [
      "commissions",
      "commissionShares",
      "payments",
      "paymentAllocations",
      "contracts",
    ].includes(collection) &&
    groups.includes("FINANCE")
  )
    return true;
  if (collection === "contacts" || collection === "contactPhones") {
    const cid = collection === "contacts" ? record.id : record.contact_id;
    return (
      (groups.includes("CONTRACT_OFFICER") &&
        (db.contractParties.some(
          (party) =>
            party.contact_id === cid &&
            canAccess(
              db,
              actorId,
              "contracts",
              db.contracts.find((c) => c.id === party.contract_id),
            ),
        ) ||
          db.dealParticipants.some(
            (party) =>
              party.contact_id === cid &&
              canAccess(
                db,
                actorId,
                "deals",
                db.deals.find((d) => d.id === party.deal_id),
              ),
          ))) ||
      (groups.includes("FINANCE") &&
        db.commissions.some((c) => c.debtor_contact_id === cid)) ||
      record.created_by_id === actorId ||
      ["registrationRequests", "inquiries"].some((c) =>
        db[c].some((r) => r.contact_id === cid && canAccess(db, actorId, c, r)),
      ) ||
      db.propertyContacts.some(
        (pc) =>
          pc.contact_id === cid &&
          canAccess(
            db,
            actorId,
            "properties",
            db.properties.find((p) => p.id === pc.property_id),
          ),
      )
    );
  }
  return (
    (!ctx.assignee && record.created_by_id === actorId && ["registrationRequests", "inquiries"].includes(collection)) ||
    ctx.assignee === actorId ||
    (groups.includes("RANGE_MANAGER") &&
      activeMemberships(db, actorId).some(
        (m) => m.membership_role === "MANAGER" && m.scope_id === ctx.scope,
      ))
  );
}
export function canViewPublicListing(db, actorId, listing) {
  return (
    !!db.users.find((u) => u.id === actorId && u.is_active) &&
    listing?.status === "ACTIVE" &&
    listing.review_status === "APPROVED" &&
    propertyReviewState(db,db.properties.find(p=>p.id===listing.property_id)) === "APPROVED" &&
    !["CANCELLED","DUPLICATE","CLOSED"].includes(propertyRequest(db,db.properties.find(p=>p.id===listing.property_id))?.status)
  );
}
export function subjectCollection(type) {
  return (
    {
      Property: "properties",
      PROPERTY: "properties",
      Listing: "listings",
      LISTING: "listings",
      Inquiry: "inquiries",
      INQUIRY: "inquiries",
      Introduction: "introductions",
      INTRODUCTION: "introductions",
      Deal: "deals",
      DEAL: "deals",
      Contract: "contracts",
      CONTRACT: "contracts",
      property: "properties",
      listing: "listings",
      inquiry: "inquiries",
      introduction: "introductions",
      deal: "deals",
      contract: "contracts",
      viewing: "viewings",
      contact: "contacts",
      commission: "commissions",
      payment: "payments",
      follow_up: "followUps",
      PropertyRegistrationRequest: "registrationRequests",
      REGISTRATION_REQUEST: "registrationRequests",
      registration_request: "registrationRequests",
      Viewing: "viewings",
      VIEWING: "viewings",
      Contact: "contacts",
      CONTACT: "contacts",
    }[type] ||
    ([
      "properties",
      "listings",
      "inquiries",
      "introductions",
      "deals",
      "contracts",
      "registrationRequests",
      "viewings",
      "contacts",
    ].includes(type)
      ? type
      : null)
  );
}
export function matchListings(db, inquiryId) {
  const q = db.inquiries.find((x) => x.id === inquiryId);
  if (!q) return [];
  const prefs = db.inquiryPreferences.filter((x) => x.inquiry_id === q.id);
  const criteria = db.inquiryCriteria.filter(
    (x) => x.inquiry_id === q.id && x.is_required,
  );
  const between = (n, min, max) =>
    (min == null || min === "" || Number(n) >= Number(min)) &&
    (max == null || max === "" || Number(n) <= Number(max));
  return db.listings
    .filter((l) => l.review_status === "APPROVED" && l.status === "ACTIVE" && propertyReviewState(db,db.properties.find(p=>p.id===l.property_id)) === "APPROVED")
    .map((listing) => {
      const p = db.properties.find((x) => x.id === listing.property_id) || {};
      const pref = prefs.find((x) => x.deal_type_id === listing.deal_type_id);
      const reasons = [
        { label: "نوع معامله", passed: !!pref },
        {
          label: "منطقه",
          passed:
            !q.district_ids?.length || q.district_ids.includes(p.district_id),
        },
        {
          label: "نوع ملک",
          passed:
            !q.property_type_ids?.length ||
            q.property_type_ids.includes(p.property_type_id),
        },
        { label: "متراژ", passed: between(p.area, q.min_area, q.max_area) },
        {
          label: "تعداد اتاق",
          passed: !q.min_rooms || Number(p.rooms) >= Number(q.min_rooms),
        },
        {
          label: "بودجه",
          passed:
            !!pref &&
            between(
              listing.sale_price,
              pref.min_sale_price,
              pref.max_sale_price,
            ) &&
            between(listing.deposit, pref.min_deposit, pref.max_deposit) &&
            between(
              listing.monthly_rent,
              pref.min_monthly_rent,
              pref.max_monthly_rent,
            ),
        },
      ];
      criteria.forEach((c) => {
        const v = p.attribute_values?.[c.attribute_code];
        reasons.push({
          label: `شرط ضروری: ${c.attribute_code}`,
          passed:
            c.operator === "GTE"
              ? Number(v) >= Number(c.value)
              : c.operator === "LTE"
                ? Number(v) <= Number(c.value)
                : c.operator === "IN"
                  ? c.value?.includes(v)
                  : String(v) === String(c.value),
        });
      });
      return { listing, reasons, compatible: reasons.every((r) => r.passed) };
    })
    .sort((a, b) => Number(b.compatible) - Number(a.compatible));
}
export function operate(original, actorId, action, payload = {}) {
  const db = syncPropertyListings(clone(original));
  delete db._warning;
  const p = clone(payload);
  for (const key of ["phone_number", "phone", "initial_contact_phone"])
    if (p[key]) p[key] = canonicalPhone(p[key]);
  const actor = db.users.find((x) => x.id === actorId);
  assert(actor?.is_active, "کاربر فعال نیست.");
  for (const c of [
    "activityLogs",
    "notifications",
    "stageHistory",
    "assignmentHistory",
    "transferHistory",
    "rescheduleHistory",
  ])
    db[c] ||= [];
  for (const key of [
    "scheduled_at", "due_at", "next_action_at", "valid_until", "paid_at", "effective_at",
  ]) {
    if (p[key] == null || p[key] === "") continue;
    assert(typeof p[key] === "string" && Number.isFinite(Date.parse(p[key])),
      "تاریخ یا زمان واردشده معتبر نیست.");
    p[key] = new Date(p[key]).toISOString();
  }
  const requestSignature = JSON.stringify(p, function (key, value) {
    if (key === "operation_id") return undefined;
    return value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(Object.keys(value).sort().map((name) => [name, value[name]]))
      : value;
  });
  const repeated = p.operation_id && db.activityLogs.find((l) => l.operation_id === p.operation_id);
  if (repeated) {
    assert(repeated.user_id === actorId && repeated.action === action &&
      repeated.request_signature === requestSignature,
      "شناسه عملیات قبلاً با کاربر یا ورودی دیگری ثبت شده است؛ دوباره اقدام کنید.");
    const resultCollection = repeated.result_collection || subjectCollection(repeated.subject_type);
    const record = db[resultCollection]?.find((r) => r.id === repeated.subject_id);
    assert(record && canAccess(db, actorId, resultCollection, record),
      "اجازه دسترسی به نتیجه این عملیات را ندارید.");
    db._result = { collection: resultCollection, id: repeated.subject_id };
    return db;
  }
  const permissionCollection = ["submitPropertyForReview","reviewProperty","savePropertyListing"].includes(action) ? "registrationRequests" : ["createTask","createFollowUp"].includes(action) ? subjectCollection(p.subject_type) : action === "createLead" ? (p.lead_type === "INQUIRY" ? "inquiries" : "registrationRequests") :
    ["acceptLead","assignCase","acceptAssignment","reviewConsultantWithdrawal","rejectAssignment","postponeAssignment","approveAssignmentExtension","rejectAssignmentExtension","changeAssignee","transferScope"].includes(action) ? (p.collection || "registrationRequests") :
    ["changePropertyCaseStatus","setPropertyTitle","markDuplicateCase","reopenAppraisal","createRegistrationRequest","assignRegistrationRequest","startAppraisal","saveWorkspace","submitListingForReview","requestListingChanges","approveListing"].includes(action) ? "registrationRequests" :
    ["saveInquiryNeeds","changeInquiryCaseStatus","createInquiry","updateInquiry","introduceListing"].includes(action) ? "inquiries" : null;
  if (["registrationRequests","properties","inquiries"].includes(permissionCollection))
    assert(hasPermission(db,actorId,permissionCollection === "inquiries" ? "inquiry" : "registration"), "گروه کاربری شما مجوز این عملیات را ندارد.");
  const op = p.operation_id || uid("op");
  const time = now();
  let target = null,
    collection = null;
  const get = (c, id) => {
    const r = db[c]?.find((x) => x.id === id);
    assert(r, "رکورد مورد نظر پیدا نشد.");
    return r;
  };
  const access = (c, id) => {
    const r = get(c, id);
    assert(
      canAccess(db, actorId, c, r),
      "اجازه دسترسی به این پرونده را ندارید.",
    );
    return r;
  };
  const role = (...codes) =>
    assert(
      hasGroup(db, actorId, "GENERAL_MANAGER", ...codes),
      "این عملیات برای گروه کاربری شما مجاز نیست.",
    );
  const manager = (scope) => {
    role("RANGE_MANAGER");
    assert(
      hasGroup(db, actorId, "GENERAL_MANAGER") ||
        activeMemberships(db, actorId).some(
          (m) => m.scope_id === scope && m.membership_role === "MANAGER",
        ),
      "مدیریت این رنج در اختیار شما نیست.",
    );
  };
  const member = (user, scope) =>
    assert(
      !user ||
        activeMemberships(db, user).some(
          (m) => m.scope_id === scope && m.membership_role === "CONSULTANT",
        ),
      "مشاور باید عضو فعال رنج مقصد باشد.",
    );
  const add = (c, fields) => {
    db[c] ||= [];
    const r = { ...fields, id: uid(c) };
    db[c].push(r);
    target = r;
    collection = c;
    return r;
  };
  const result = (c, r) => {
    collection = c;
    target = r;
    return r;
  };
  const stage = (c, r, to, key = "status", reason = "") => {
    const from = r[key];
    if (from === to) return;
    r[key] = to;
    db.stageHistory.push({
      id: uid("stage"),
      subject_type: subjectType(c),
      subject_id: r.id,
      from_stage: from,
      to_stage: to,
      changed_by_id: actorId,
      changed_at: time,
      reason,
      operation_id: op,
    });
  };
  const notify = (user, type, title, c, id) => {
    if (
      user &&
      !db.notifications.some((n) => n.event_key === `${op}:${type}:${user}`)
    )
      db.notifications.push({
        id: uid("notification"),
        user_id: user,
        type,
        title,
        message: title,
        subject_type: subjectType(c),
        subject_id: id,
        event_key: `${op}:${type}:${user}`,
        is_read: false,
        created_at: time,
        operation_id: op,
      });
  };
  const subjectType = (c) =>
    ({
      registrationRequests: "registration_request",
      properties: "property",
      listings: "listing",
      inquiries: "inquiry",
      introductions: "introduction",
      viewings: "viewing",
      deals: "deal",
      contracts: "contract",
      commissions: "commission",
      payments: "payment",
      followUps: "follow_up",
    })[c] || c;
  const task = (user, c, id, title, type = "WORKFLOW") => {
    if (!db.tasks.some((t) => t.generation_key === `${op}:${action}:${id}:${user}:${type}`))
      add("tasks", {
        title,
        assigned_to_id: user,
        created_by_id: actorId,
        due_at: ["ASSIGNMENT_REVIEW","LEAD_REVIEW"].includes(type) ? new Date(Date.now()+86400000).toISOString() :
          db[c]?.find((record) => record.id === id)?.scheduled_at ||
          p.due_at ||
          db[c]?.find((record) => record.id === id)?.due_at ||
          new Date(Date.now() + 86400000).toISOString(),
        priority: "NORMAL",
        status: "OPEN",
        task_type: type,
        subject_type: subjectType(c),
        subject_id: id,
        generation_key: `${op}:${action}:${id}:${user}:${type}`,
        operation_id: op,
      });
    notify(user, "ASSIGNMENT", title, c, id);
  };
  const completeSubjectTasks = (collection, id) => {
    for (const task of db.tasks.filter(
      (t) =>
        subjectCollection(t.subject_type) === collection &&
        t.subject_id === id &&
        t.task_type !== "ASSIGNMENT_REVIEW" && t.task_type !== "MANUAL" &&
        !["COMPLETED", "DONE", "CANCELLED"].includes(t.status),
    )) {
      task.completed_at = time;
      stage("tasks", task, "COMPLETED");
    }
  };
  const completeReviewTasks = (c,id) => {
    for(const t of db.tasks.filter(t=>t.task_type === "ASSIGNMENT_REVIEW" && t.subject_id===id && subjectCollection(t.subject_type)===c && !["COMPLETED","CANCELLED"].includes(t.status))) {
      t.completed_at=time; stage("tasks",t,"COMPLETED");
    }
  };
  const validateTerms = (l) => {
    if (l.deal_type_version_id) {
      const v = get("dealTypeVersions", l.deal_type_version_id);
      assert(
        v.deal_type_id === l.deal_type_id && v.status === "PUBLISHED",
        "نسخه شرایط با نوع معامله سازگار نیست.",
      );
      const required = new Set([
        ...(v.validation_rules?.required || []),
        ...(v.field_definitions || [])
          .filter((f) => f.required)
          .map((f) => f.code),
      ]);
      for (const code of required) {
        const value = l[code] ?? l.additional_terms?.[code];
        assert(
          value !== undefined && value !== null && value !== "",
          `فیلد الزامی «${v.field_definitions?.find((f) => f.code === code)?.name || code}» را تکمیل کنید.`,
        );
      }
      for (const f of v.field_definitions || []) {
        const value = l[f.code] ?? l.additional_terms?.[f.code];
        if (value == null || value === "") continue;
        if (f.type === "number" && f.code !== "installments")
          assert(
            Number.isFinite(Number(value)),
            `مقدار «${f.name || f.code}» باید عدد باشد.`,
          );
        if (f.type === "date")
          assert(
            Number.isFinite(Date.parse(value)),
            `تاریخ «${f.name || f.code}» معتبر نیست.`,
          );
      }
    }
    const type = get("dealTypes", l.deal_type_id);
    const code = type.behavior_type || type.code;
    const terms = l.additional_terms || {};
    if (["SALE", "PRE_SALE", "PRESALE"].includes(code))
      assert(Number(l.sale_price) > 0, "قیمت فروش باید بیشتر از صفر باشد.");
    if (["RENT", "RENTAL", "FULL_MORTGAGE", "MORTGAGE"].includes(code))
      assert(
        Number(l.deposit) >= 0 &&
          Number(l.monthly_rent) >= 0 &&
          (Number(l.deposit) > 0 || Number(l.monthly_rent) > 0),
        "مبلغ ودیعه یا اجاره را کامل کنید.",
      );
    if (["FULL_MORTGAGE", "MORTGAGE"].includes(code))
      assert(
        Number(l.monthly_rent || 0) === 0,
        "اجاره در رهن کامل باید صفر باشد.",
      );
    if (["PRE_SALE", "PRESALE"].includes(code))
      assert(
        terms.delivery_date &&
          Number(terms.down_payment) >= 0 &&
          terms.installments,
        "پیش‌پرداخت، اقساط و زمان تحویل را تکمیل کنید.",
      );
    if (
      ["PARTNERSHIP", "PARTICIPATION"].includes(code) &&
      terms.owner_share !== undefined
    )
      assert(
        Number(terms.owner_share) + Number(terms.builder_share) === 100,
        "مجموع سهم طرفین مشارکت باید صد درصد باشد.",
      );
    if (["PARTNERSHIP", "PARTICIPATION"].includes(code))
      assert(
        (terms.contributions ||
          terms.owner_contribution ||
          terms.land_contribution) &&
          (terms.shares || terms.owner_share || terms.owner_share_percent) &&
          (terms.milestones || terms.delivery_date || terms.main_dates),
        "آورده‌ها، سهم‌ها و موعدهای مشارکت را کامل کنید.",
      );
    if (code === "EXCHANGE")
      assert(
        (terms.offered_asset || terms.proposed_asset) &&
          (terms.asset_values || terms.asset_value || terms.exchange_value) &&
          (terms.balance !== undefined || terms.difference !== undefined),
        "دارایی، ارزش‌ها و مابه‌التفاوت معاوضه را کامل کنید.",
      );
    if (["PRE_SALE", "PRESALE"].includes(code)) {
      assert(
        Number.isFinite(Number(terms.down_payment)) &&
          Number(terms.down_payment) <= Number(l.sale_price),
        "پیش‌پرداخت نباید از مبلغ کل پیش‌فروش بیشتر باشد.",
      );
    }
    if (["PARTNERSHIP", "PARTICIPATION"].includes(code)) {
      assert(
        [terms.owner_share, terms.builder_share].every(
          (value) =>
            Number.isFinite(Number(value)) &&
            Number(value) >= 0 &&
            Number(value) <= 100,
        ),
        "سهم هر طرف مشارکت باید بین صفر و صد درصد باشد.",
      );
      assert(
        terms.owner_contribution && terms.builder_contribution,
        "آورده هر دو طرف مشارکت باید مشخص باشد.",
      );
    }
    if (code === "EXCHANGE") {
      assert(
        [
          terms.asset_value,
          terms.counter_asset_value ?? terms.exchange_value,
        ].every((value) => Number.isFinite(Number(value)) && Number(value) > 0),
        "ارزش هر دو دارایی معاوضه باید مثبت باشد.",
      );
      assert(
        Number.isFinite(Number(terms.balance ?? terms.difference)) &&
          Number(terms.balance ?? terms.difference) >= 0,
        "مابه‌التفاوت معاوضه باید عدد نامنفی باشد.",
      );
    }
  };
  const family = (l) => {
    const type = get("dealTypes", l.deal_type_id);
    return ["RENT", "MORTGAGE", "FULL_MORTGAGE", "RENTAL"].includes(
      type.behavior_type || type.code,
    )
      ? "OCCUPANCY"
      : "OWNERSHIP";
  };
  const validateContract = (c) => {
    const d=get("deals",c.deal_id),l=get("listings",d.listing_id);
    if(c.agreement_basis!=="CONTRACT_TERMS") {
      const o=get("offers",c.accepted_offer_id);
      assert(o.deal_id===d.id&&o.status==="ACCEPTED"&&d.accepted_offer_id===o.id,"زنجیره پیشنهاد پذیرفته‌شده قرارداد معتبر نیست.");
    }
    assert(
      c.deal_type_version_id === d.deal_type_version_id &&
        c.deal_type_version_id === l.deal_type_version_id,
      "نسخه نوع معامله در پرونده و قرارداد همخوان نیست.",
    );
    const terms = c.terms_snapshot?.additional_terms || c.terms_snapshot?.terms;
    validateTerms({
      ...l,
      deal_type_version_id: c.deal_type_version_id,
      sale_price: c.sale_price,
      deposit: c.deposit,
      monthly_rent: c.monthly_rent,
      additional_terms: clone(
        typeof terms === "object" ? terms : c.terms_snapshot || {},
      ),
    });
    return { d, l };
  };
  const assign = (c, r, user, reason) => {
    assert(!pendingWithdrawal(db,c,r),"ابتدا درخواست انصراف مشاور را تعیین تکلیف کنید.");
    member(user, r.management_scope_id || context(db, c, r).scope);
    const key = c === "properties" ? "consultant_id" : "assigned_to_id";
    if (r[key] === user) return;
    assert(!user || get("users", user).is_active, "کارشناس انتخاب‌شده فعال نیست.");
    db.assignmentHistory.push({
      id: uid("assignment"),
      registration_request_id: null,
      property_id: null,
      listing_id: null,
      inquiry_id: null,
      deal_id: null,
      [{
        registrationRequests: "registration_request_id",
        properties: "property_id",
        listings: "listing_id",
        inquiries: "inquiry_id",
        deals: "deal_id",
      }[c]]: r.id,
      previous_assignee_id: r[key] || null,
      new_assignee_id: user || null,
      assigned_by_id: actorId,
      assigned_at: time,
      reason: reason || "ارجاع پرونده",
      operation_id: op,
    });
    for (const request of db.rescheduleHistory.filter(h=>h.request_kind === "ASSIGNMENT_EXTENSION" && h.subject_type === subjectType(c) && h.subject_id === r.id && h.status === "PENDING")) {
      request.status = "CANCELLED"; request.decided_by_id = actorId; request.decided_at = time; request.decision_reason = "تغییر کارشناس مسئول";
    }
    r[key] = user || null;
    if (["registrationRequests", "inquiries"].includes(c)) {
      r.assigned_at = user ? time : null;
      r.acceptance_status = user ? "PENDING" : "UNASSIGNED";
      r.accepted_at = null;
      r.rejected_at = null;
      r.rejection_reason = null;
    }
    db.tasks
      .filter(
        (t) =>
          t.subject_id === r.id &&
          ["WORKFLOW","ASSIGNMENT_REVIEW","LEAD_REVIEW","LEAD_ACCEPTANCE"].includes(t.task_type) &&
          !["COMPLETED", "CANCELLED"].includes(t.status),
      )
      .forEach((t) => {
        t.status = "CANCELLED";
        t.cancellation_reason = "تغییر مشاور مسئول";
      });
    if (user) task(user, c, r.id, "رسیدگی به پرونده ارجاع‌شده");
  };
  switch (action) {
    case "createLead": {
      role("AGENT","RANGE_MANAGER");
      const managerial=hasGroup(db,actorId,"GENERAL_MANAGER","RANGE_MANAGER");
      let scope=p.management_scope_id;
      if(!managerial) {
        const scopes=[...new Set(activeMemberships(db,actorId).filter(m=>m.membership_role==='CONSULTANT'&&db.scopes.some(s=>s.id===m.scope_id&&s.is_active)).map(m=>m.scope_id))];
        assert(scopes.length===1,"رنج فعال مشاور باید توسط مدیر مشخص شود.");
        assert(!scope||scope===scopes[0],"مشاور فقط برای رنج خودش سرنخ ثبت می‌کند.");
        scope=scopes[0];
      }
      assert(get("scopes",scope).is_active,"رنج فعال نیست.");
      assert(hasGroup(db,actorId,"GENERAL_MANAGER") || activeMemberships(db,actorId).some(m=>m.scope_id===scope&&(hasGroup(db,actorId,"RANGE_MANAGER")&&m.membership_role==="MANAGER"||hasGroup(db,actorId,"AGENT")&&m.membership_role==="CONSULTANT")),"ثبت سرنخ در این رنج مجاز نیست.");
      assert(["PROPERTY","INQUIRY"].includes(p.lead_type),"نوع سرنخ را انتخاب کنید.");
      assert(!p.assigned_to_id,"ارجاع سرنخ فقط پس از پذیرش مدیر انجام می‌شود.");
      if(!hasGroup(db,actorId,"GENERAL_MANAGER","RANGE_MANAGER"))assert(!p.due_at,"تعیین مهلت رسیدگی فقط برای مدیر مجاز است.");
      if(p.lead_type==="INQUIRY")assert(get("dealTypes",p.deal_type_id).is_active,"نوع معامله فعال را انتخاب کنید.");
      let contactId=p.contact_id;
      if(contactId)access("contacts",contactId);
      else {
        assert(p.initial_contact_name?.trim()&&p.initial_contact_phone,"نام و شماره تماس سرنخ الزامی است.");
        // Reuse only a visible contact; a known phone must not expose another dossier.
        const existing=db.contactPhones.find(phone=>canonicalPhone(phone.phone_number)===p.initial_contact_phone&&canAccess(db,actorId,"contacts",db.contacts.find(contact=>contact.id===phone.contact_id)));
        if(existing){contactId=existing.contact_id;}
        else {
          const next=operate(db,actorId,"createContact",{first_name:p.initial_contact_name,phone:p.initial_contact_phone});
          Object.assign(db,next);contactId=next._result.id;
        }
      }
      assert(managerial||!p.title,"تعیین عنوان ملک فقط برای مدیر مجاز است.");
      const c=p.lead_type==="PROPERTY"?"registrationRequests":"inquiries";
      const r=add(c,{code:`${c==="registrationRequests"?"R":"Q"}-${db[c].length+1001}`,contact_id:contactId,
        management_scope_id:scope,initial_contact_name:p.initial_contact_name,initial_contact_phone:p.initial_contact_phone,
        title:managerial?p.title?.trim()||"":"",description:p.description||"",notes:p.description||"",source:p.source||"PHONE",due_at:p.due_at||null,
        assigned_to_id:null,acceptance_status:"UNASSIGNED",lead_status:"NEW",lead_accepted_by_id:null,lead_accepted_at:null,
        status:c==="registrationRequests"?"NEW":"OPEN",priority:"NORMAL",created_by_id:actorId,created_at:time,
        ...(c==="registrationRequests"?{resulting_property_id:null,requested_deal_type_ids:[]}:{district_ids:[],property_type_ids:[]})});
      if(c==="inquiries")r.needs_status="DRAFT";
      if(c==="inquiries")add("inquiryPreferences",{inquiry_id:r.id,deal_type_id:p.deal_type_id});
      syncLeadAcceptanceTasks(db);
      if(leadState(r)==="NEW")for(const user of db.users.filter(u=>u.is_active&&hasGroup(db,u.id,"RANGE_MANAGER")&&activeMemberships(db,u.id).some(m=>m.scope_id===scope&&m.membership_role==="MANAGER")))
        notify(user.id,"LEAD","سرنخ جدید در انتظار پذیرش شماست",c,r.id);
      result(c,r);break;
    }
    case "acceptLead": {
      const c=p.collection;
      assert(["registrationRequests","inquiries"].includes(c),"نوع پرونده معتبر نیست.");
      const r=access(c,p.id);
      manager(r.management_scope_id);
      assert(leadState(r)==="NEW","این سرنخ قبلاً پذیرفته شده است.");
      assert(!["COMPLETED","CANCELLED","DUPLICATE","CLOSED"].includes(r.status),"پرونده بسته شده است.");
      r.lead_status="ACCEPTED";r.lead_accepted_by_id=actorId;r.lead_accepted_at=time;
      for(const pending of db.tasks.filter(t=>t.subject_type===subjectType(c)&&t.subject_id===r.id&&t.task_type==='LEAD_ACCEPTANCE'&&t.status==='OPEN')) {
        pending.status='COMPLETED';pending.completed_at=time;pending.completed_by_id=actorId;
      }
      notify(r.created_by_id,"LEAD","سرنخ شما توسط مدیر پذیرفته شد",c,r.id);
      result(c,r);break;
    }
    case "createContact": {
      role("RANGE_MANAGER", "AGENT", "CONTRACT_OFFICER");
      assert(p.first_name || p.company_name, "نام شخص را وارد کنید.");
      const r = add("contacts", {
        person_type: "NATURAL",
        ...p,
        created_by_id: actorId,
        archived_at: null,
        merged_into_id: null,
      });
      const phone = p.phone_number || p.phone;
      if (
        phone &&
        db.contactPhones.some(
          (x) => canonicalPhone(x.phone_number) === canonicalPhone(phone),
        )
      )
        db._warning = "این شماره قبلاً ثبت شده است؛ اشخاص ادغام نشده‌اند.";
      if (phone)
        add("contactPhones", {
          contact_id: r.id,
          phone_number: phone,
          label: "همراه",
          is_primary: true,
        });
      result("contacts", r);
      break;
    }
    case "createRegistrationRequest": {
      manager(p.management_scope_id);
      const scope = p.management_scope_id;
      assert(get("scopes", scope).is_active, "رنج فعال نیست.");
      assert(hasGroup(db, actorId, "GENERAL_MANAGER") || activeMemberships(db, actorId).some(m => m.scope_id === scope), "ثبت سرنخ در این رنج مجاز نیست.");
      if (p.assigned_to_id) manager(scope);
      if (p.contact_id) access("contacts", p.contact_id);
      assert(
        p.contact_id || p.initial_contact_name,
        "شخص تماس یا نام تماس‌گیرنده الزامی است.",
      );
      const r = add("registrationRequests", {
        code: `R-${db.registrationRequests.length + 1001}`,
        assigned_to_id: null,
        priority: "NORMAL",
        requested_deal_type_ids: [],
        ...p,
        status: "NEW",
        acceptance_status: "UNASSIGNED",
        lead_status: p.assigned_to_id ? "ACCEPTED" : "NEW",
        lead_accepted_by_id: p.assigned_to_id ? actorId : null,
        lead_accepted_at: p.assigned_to_id ? time : null,
        created_by_id: actorId,
        created_at: time,
        resulting_property_id: null,
        assigned_to_id: null,
      });
      if (p.assigned_to_id) {
        assign("registrationRequests", r, p.assigned_to_id);
        stage("registrationRequests", r, "ASSIGNED");
      }
      syncLeadAcceptanceTasks(db);
      result("registrationRequests", r);
      break;
    }
    case "assignCase":
    case "assignRegistrationRequest": {
      const c = action === "assignRegistrationRequest" ? "registrationRequests" : p.collection;
      assert(["registrationRequests", "inquiries"].includes(c), "نوع پرونده معتبر نیست.");
      const r = access(c, p.id);
      manager(r.management_scope_id);
      assert(!["COMPLETED", "CANCELLED", "DUPLICATE", "CLOSED"].includes(r.status), "پرونده بسته شده است.");
      assert(leadState(r)==="ACCEPTED", "ابتدا پذیرش سرنخ توسط مدیر را ثبت کنید.");
      assert(p.assigned_to_id && p.assigned_to_id !== r.assigned_to_id, "کارشناس جدید را انتخاب کنید.");
      assert(!pendingWithdrawal(db,c,r),"ابتدا درخواست انصراف مشاور را تعیین تکلیف کنید.");
      assert(canReassign(db, c, r), "برای ارجاع مجدد بدون پاسخ باید دو روز از ارجاع گذشته باشد.");
      r.due_at = p.due_at || (new Date(r.due_at) > new Date(time) ? r.due_at : null) || new Date(Date.now() + 86400000).toISOString();
      assert(new Date(r.due_at) > new Date(time), "موعد رسیدگی باید در آینده باشد.");
      assign(c, r, p.assigned_to_id, p.reason);
      if (c === "registrationRequests") stage(c, r, "ASSIGNED");
      else stage(c, r, "OPEN");
      result(c, r);
      break;
    }
    case "acceptAssignment": {
      const c = p.collection;
      assert(["registrationRequests", "inquiries"].includes(c), "نوع پرونده معتبر نیست.");
      const r = access(c, p.id);
      role("AGENT");
      assert(r.assigned_to_id === actorId, "فقط کارشناس مسئول می‌تواند پرونده را بپذیرد.");
      assert(assignmentState(db, c, r) === "PENDING", "این ارجاع در انتظار پذیرش نیست.");
      assert(!pendingWithdrawal(db,c,r),"درخواست انصراف در انتظار تصمیم مدیر است.");
      r.acceptance_status = "ACCEPTED";
      r.accepted_at = time;
      stage(c, r, c === "registrationRequests" ? "IN_PROGRESS" : "MATCHING");
      if (c === "registrationRequests" && !db.appraisals.some(a => a.registration_request_id === r.id))
        add("appraisals", { registration_request_id: r.id, property_id: r.resulting_property_id || null,
          appraiser_id: actorId, status: "IN_PROGRESS", scheduled_at: time, report_attachments: [] });
      completeSubjectTasks(c, r.id);
      task(actorId, c, r.id, c === "registrationRequests" ? "کارشناسی و تکمیل پرونده" : "رسیدگی به درخواست متقاضی");
      result(c, r);
      break;
    }
    case "rejectAssignment":
    case "postponeAssignment": {
      const c = p.collection;
      assert(["registrationRequests", "inquiries"].includes(c), "نوع پرونده معتبر نیست.");
      const r = access(c, p.id);
      role("AGENT");
      assert(r.assigned_to_id === actorId, "این اقدام فقط برای کارشناس مسئول است.");
      assert(!["COMPLETED", "CANCELLED", "DUPLICATE", "CLOSED"].includes(r.status), "پرونده بسته شده است.");
      assert(p.reason?.trim(), "دلیل اقدام الزامی است.");
      const state = assignmentState(db, c, r);
      if (action === "rejectAssignment") {
        assert(['PENDING','ACCEPTED'].includes(state),'مسئولیت فعلی قابل درخواست انصراف نیست.');
        assert(!pendingWithdrawal(db,c,r),'درخواست انصراف در انتظار تصمیم مدیر است.');
        add('rescheduleHistory',{request_kind:'CONSULTANT_WITHDRAWAL',status:'PENDING',subject_type:subjectType(c),subject_id:r.id,requested_by_id:actorId,requested_at:time,changed_by_id:actorId,changed_at:time,reason:p.reason.trim(),operation_id:op});
        db._warning='درخواست انصراف برای مدیر ارسال شد؛ تا تأیید مدیر مسئول پرونده تغییر نمی‌کند.';
      } else {
        assert(state==="ACCEPTED", "ابتدا باید ارجاع را پذیرفته باشید.");
        assert(Number.isFinite(Date.parse(r.due_at))&&Date.parse(r.due_at)<=Date.parse(time),"مهلت رسیدگی هنوز تمام نشده است.");
        assert(new Date(p.due_at) > new Date(time) && (!r.due_at || new Date(p.due_at) > new Date(r.due_at)), "موعد جدید باید از موعد قبلی و اکنون جلوتر باشد.");
        assert(!pendingExtension(db,c,r), "یک درخواست تمدید در انتظار تصمیم مدیر است.");
        add("rescheduleHistory", { request_kind:"ASSIGNMENT_EXTENSION", status:"PENDING", subject_type: subjectType(c), subject_id: r.id,
          old_scheduled_at: r.due_at || null, new_scheduled_at: p.due_at, requested_due_at:p.due_at,
          requested_by_id:actorId, requested_at:time, changed_by_id: actorId, changed_at: time, reason: p.reason, operation_id: op });
        db._warning = "درخواست تمدید برای مدیر ارسال شد؛ تا تأیید مدیر مهلت فعلی تغییر نمی‌کند.";
      }
      for (const user of db.users.filter(u => u.is_active && (hasGroup(db, u.id, "GENERAL_MANAGER") || (hasGroup(db, u.id, "RANGE_MANAGER") && activeMemberships(db,u.id).some(m=>m.membership_role==="MANAGER"&&m.scope_id===r.management_scope_id)))))
        task(user.id,c,r.id,action === "rejectAssignment" ? "بررسی درخواست انصراف مشاور" : "بررسی درخواست تمدید مهلت", "ASSIGNMENT_REVIEW");
      result(c, r);
      break;
    }
    case "reviewConsultantWithdrawal": {
      const c=p.collection;
      assert(['registrationRequests','inquiries'].includes(c),'نوع پرونده معتبر نیست.');
      const r=access(c,p.id);manager(r.management_scope_id);
      const request=pendingWithdrawal(db,c,r);
      assert(request&&request.id===p.request_id,'درخواست انصراف در انتظار تصمیم پیدا نشد.');
      assert(request.requested_by_id===r.assigned_to_id,'مسئول پرونده تغییر کرده است.');
      assert(!['COMPLETED','CANCELLED','DUPLICATE','CLOSED'].includes(r.status),'پرونده بسته شده است.');
      assert(['APPROVE','REJECT'].includes(p.decision)&&p.reason?.trim(),'تصمیم و دلیل مدیر الزامی است.');
      Object.assign(request,{status:p.decision==='APPROVE'?'APPROVED':'REJECTED',decided_at:time,decided_by_id:actorId,decision_reason:p.reason.trim(),decision_operation_id:op});
      completeReviewTasks(c,r.id);
      if(p.decision==='APPROVE'){
        const previous=r.assigned_to_id;
        r.acceptance_status='REJECTED';r.rejection_reason=request.reason;r.rejected_at=time;
        completeSubjectTasks(c,r.id);
        const extension=pendingExtension(db,c,r);if(extension)Object.assign(extension,{status:'CANCELLED',decided_at:time,decided_by_id:actorId,decision_reason:'تأیید انصراف مشاور'});
        r.assigned_to_id=null;r.assigned_at=null;r.accepted_at=null;r.due_at=null;
        add('assignmentHistory',{registration_request_id:c==='registrationRequests'?r.id:null,inquiry_id:c==='inquiries'?r.id:null,previous_assignee_id:previous,new_assignee_id:null,assigned_by_id:actorId,assigned_at:time,reason:p.reason.trim(),operation_id:op});
        if(c==='registrationRequests'&&r.resulting_property_id)get('properties',r.resulting_property_id).consultant_id=null;
        notify(previous,'ASSIGNMENT','انصراف شما تأیید شد؛ پرونده منتظر ارجاع مجدد است.',c,r.id);
      }else notify(r.assigned_to_id,'ASSIGNMENT','درخواست انصراف تأیید نشد؛ مسئولیت پرونده ادامه دارد.',c,r.id);
      result(c,r);break;
    }
    case "approveAssignmentExtension":
    case "rejectAssignmentExtension": {
      const c=p.collection;
      assert(["registrationRequests","inquiries"].includes(c), "نوع پرونده معتبر نیست.");
      const r=access(c,p.id);
      manager(r.management_scope_id);
      const request=pendingExtension(db,c,r);
      assert(request && request.id===p.request_id, "درخواست تمدید در انتظار تصمیم پیدا نشد.");
      assert(["PENDING","ACCEPTED"].includes(assignmentState(db,c,r)), "ارجاع فعلی قابل تمدید نیست.");
      assert(!["COMPLETED","CANCELLED","DUPLICATE","CLOSED"].includes(r.status), "پرونده بسته شده است.");
      assert(request.requested_by_id===r.assigned_to_id && (request.old_scheduled_at || null)===(r.due_at || null), "مسئول یا مهلت پرونده تغییر کرده است؛ درخواست قبلی معتبر نیست.");
      assert(p.reason?.trim(), "دلیل تصمیم مدیر الزامی است.");
      if(action === "approveAssignmentExtension") {
        const newDue=p.due_at || request.new_scheduled_at;
        assert(new Date(newDue)>new Date(time) && (!r.due_at || new Date(newDue)>new Date(r.due_at)), "موعد تأییدشده باید از اکنون و مهلت قبلی جلوتر باشد.");
        request.new_scheduled_at=newDue;
        r.due_at=newDue;
        request.status="APPROVED";
        db.tasks.filter(t=>t.subject_id===r.id && subjectCollection(t.subject_type)===c && t.task_type!=="ASSIGNMENT_REVIEW" && !["DONE","COMPLETED","CANCELLED"].includes(t.status)).forEach(t=>{t.due_at=newDue;});
      } else request.status="REJECTED";
      request.decided_by_id=actorId; request.decided_at=time; request.decision_reason=p.reason;
      request.decision_operation_id=op;
      completeReviewTasks(c,r.id);
      notify(r.assigned_to_id,"ASSIGNMENT",actionTitles[action],c,r.id);
      result(c,r);
      break;
    }
    case "changePropertyCaseStatus": {
      const r=access("registrationRequests",p.id);manager(r.management_scope_id);
      assert(p.reason?.trim(),"دلیل تغییر وضعیت را وارد کنید.");
      const relations=caseRelations(db,r),{property,listings,deals,contracts}=relations;
      assert(!relations.locked,"این ملک قرارداد قطعی یا امضاشده دارد؛ تغییر وضعیت از این مسیر مجاز نیست.");
      assert(caseStatusActions(db,actorId,r).includes(p.status),"این تغییر وضعیت برای پرونده فعلی مجاز نیست.");
      const previous=r.status;
      if(p.status==="REOPEN") {
        const snapshot=r.case_close_snapshot;
        assert(snapshot,"سابقه بستن معتبر برای بازگشایی وجود ندارد.");
        assert(!p.due_at||new Date(p.due_at)>new Date(time),"موعد رسیدگی دوباره باید در آینده باشد.");
        if(r.assigned_to_id){assert(get("users",r.assigned_to_id).is_active,"ابتدا مسئول فعال برای پرونده مشخص کنید.");member(r.assigned_to_id,r.management_scope_id);}
        const accepted=r.assigned_to_id&&snapshot.acceptance_status==="ACCEPTED";
        const next=property&&accepted?"CHANGES_REQUIRED":snapshot.status;
        if(property){property.record_status="DRAFT";property.review_status="CHANGES_REQUIRED";property.review_reason=p.reason.trim();property.version=(property.version||0)+1;}
        r.closed_at=null;r.closure_reason=null;r.duplicate_of_id=null;
        r.acceptance_status=snapshot.acceptance_status;
        if(accepted)r.due_at=p.due_at||new Date(Date.now()+86400000).toISOString();
        stage("registrationRequests",r,next,"status",p.reason.trim());
        if(accepted)task(r.assigned_to_id,"registrationRequests",r.id,"رسیدگی دوباره به پرونده");
      } else {
        if(p.status==="DUPLICATE") {
          assert(p.original_id&&p.original_id!==r.id,"پرونده اصلی معتبر را انتخاب کنید.");
          const original=access("registrationRequests",p.original_id);
          assert(!terminalCaseStatuses.includes(original.status),"پرونده اصلی نباید بسته، لغوشده یا تکراری باشد.");
          assert(!r.resulting_property_id||r.resulting_property_id!==original.resulting_property_id,"این دو پرونده به یک رکورد ملک مشترک متصل‌اند؛ ابتدا ارتباط ملک را تعیین تکلیف کنید.");
          r.duplicate_of_id=original.id;r.duplicate_decided_by_id=actorId;r.duplicate_decided_at=time;
        }
        r.case_close_snapshot={status:r.status,acceptance_status:assignmentState(db,"registrationRequests",r),property_review_status:property?.review_status,property_record_status:property?.record_status};
        r.closed_at=time;r.closure_reason=p.reason.trim();
        stage("registrationRequests",r,p.status,"status",p.reason.trim());
        if(property){property.record_status="ARCHIVED";property.review_status="CHANGES_REQUIRED";property.review_reason=p.reason.trim();property.version=(property.version||0)+1;
          for(const review of property.review_history||[])if(review.decision==="PENDING")Object.assign(review,{decision:"CANCELLED",reason:p.reason.trim(),reviewed_at:time,reviewed_by_id:actorId});
        }
        for(const listing of listings){if(!["CLOSED","SOLD","RENTED"].includes(listing.status))stage("listings",listing,"PAUSED","status",p.reason.trim());listing.version=(listing.version||0)+1;}
        const listingIds=new Set(listings.map(l=>l.id));
        const intros=db.introductions.filter(i=>listingIds.has(i.listing_id));
        const introIds=new Set(intros.map(i=>i.id));
        const viewings=db.viewings.filter(v=>introIds.has(v.introduction_id));
        for(const intro of intros)if(!["REJECTED","CANCELLED","COMPLETED"].includes(intro.status))stage("introductions",intro,"CANCELLED","status",p.reason.trim());
        for(const viewing of viewings)if(viewing.status==="SCHEDULED"){viewing.cancellation_reason=p.reason.trim();stage("viewings",viewing,"CANCELLED","status",p.reason.trim());}
        for(const deal of deals)if(!["LOST","FINALIZED","CANCELLED"].includes(deal.stage)){deal.closure_reason=p.reason.trim();deal.closed_at=time;stage("deals",deal,"LOST","stage",p.reason.trim());}
        for(const contract of contracts)if(["DRAFT","PENDING_SIGNATURE","AWAITING_SIGNATURE"].includes(contract.status)){contract.cancellation_reason=p.reason.trim();stage("contracts",contract,"CANCELLED","status",p.reason.trim());}
        const related=new Set([`registrationRequests:${r.id}`,...(property?[`properties:${property.id}`]:[]),...listings.map(l=>`listings:${l.id}`),...intros.map(i=>`introductions:${i.id}`),...viewings.map(v=>`viewings:${v.id}`),...deals.map(d=>`deals:${d.id}`)]);
        for(const followup of db.followUps.filter(f=>related.has(`${subjectCollection(f.subject_type)}:${f.subject_id}`))) {
          related.add(`followUps:${followup.id}`);
          if(!["COMPLETED","DONE","CANCELLED"].includes(followup.status)){followup.cancellation_reason=p.reason.trim();stage("followUps",followup,"CANCELLED","status",p.reason.trim());}
        }
        for(const item of db.tasks)if(related.has(`${subjectCollection(item.subject_type)}:${item.subject_id}`)&&!["COMPLETED","DONE","CANCELLED"].includes(item.status)){item.status="CANCELLED";item.cancellation_reason=p.reason.trim();}
        for(const extension of db.rescheduleHistory)if(extension.request_kind==="ASSIGNMENT_EXTENSION"&&extension.subject_type==="registration_request"&&extension.subject_id===r.id&&extension.status==="PENDING")Object.assign(extension,{status:"CANCELLED",decided_at:time,decided_by_id:actorId,decision_reason:p.reason.trim(),decision_operation_id:op});
        for(const inquiryId of new Set(intros.map(i=>i.inquiry_id).concat(deals.map(d=>d.inquiry_id)))) {
          const inquiry=db.inquiries.find(i=>i.id===inquiryId);
          if(!inquiry||!["NEGOTIATION","NEGOTIATING","INTRODUCED","VIEWING"].includes(inquiry.status))continue;
          const ongoing=db.deals.some(d=>d.inquiry_id===inquiryId&&!["LOST","FINALIZED","CANCELLED"].includes(d.stage));
          const otherIntro=db.introductions.some(i=>i.inquiry_id===inquiryId&&!["REJECTED","CANCELLED","COMPLETED"].includes(i.status));
          if(!ongoing)stage("inquiries",inquiry,otherIntro?"INTRODUCED":"MATCHING","status","تعیین تکلیف پرونده ملک مرتبط");
        }
      }
      r.case_status_history ||= [];
      r.case_status_history.push({id:uid("case-status"),from_status:previous,to_status:r.status,action:p.status,reason:p.reason.trim(),changed_by_id:actorId,changed_at:time,operation_id:op});
      notify(r.assigned_to_id||r.created_by_id,"REVIEW","وضعیت پرونده ملک تغییر کرد","registrationRequests",r.id);
      result("registrationRequests",r);break;
    }
    case "setPropertyTitle": {
      const r=access("registrationRequests",p.id);manager(r.management_scope_id);
      assert(p.title?.trim(),"عنوان ملک را وارد کنید.");
      const property=db.properties.find(property=>property.id===r.resulting_property_id);
      const previous=property?.title||r.title||"";
      r.title_history ||= [];
      r.title_history.push({previous_title:previous,title:p.title.trim(),changed_by_id:actorId,changed_at:time});
      r.title=p.title.trim();r.title_set_by_id=actorId;r.title_set_at=time;
      // Administrative display title has its own history; appraisal data versions remain separate.
      if(property)property.title=r.title;
      for(const listing of db.listings.filter(l=>l.registration_request_id===r.id))listing.title=r.title;
      result("registrationRequests",r);break;
    }
    case "markDuplicateCase": {
      const r=access("registrationRequests",p.id);manager(r.management_scope_id);
      assert(!["COMPLETED","CANCELLED","DUPLICATE","CLOSED"].includes(r.status),"پرونده پایان‌یافته قابل ثبت به‌عنوان تکراری نیست.");
      assert(p.original_id!==r.id,"پرونده اصلی و تکراری نمی‌توانند یکسان باشند.");
      const original=access("registrationRequests",p.original_id);
      assert(!["DUPLICATE","CANCELLED","CLOSED"].includes(original.status),"پرونده اصلی نباید تکراری یا لغوشده باشد.");
      assert(p.reason?.trim(),"دلیل تأیید تکراری بودن را بنویسید.");
      r.duplicate_of_id=original.id;r.duplicate_decided_by_id=actorId;r.duplicate_decided_at=time;
      r.closed_at=time;r.closure_reason=p.reason;
      stage("registrationRequests",r,"DUPLICATE","status",p.reason);
      for(const l of db.listings.filter(l=>l.registration_request_id===r.id)) {
        stage("listings",l,"PAUSED","status",p.reason);
        stage("listings",l,"CHANGES_REQUIRED","review_status",p.reason);
        for(const review of db.listingReviews.filter(review=>review.listing_id===l.id&&review.decision==='PENDING')) {
          review.decision='CHANGES_REQUIRED';review.reviewed_by_id=actorId;review.reviewed_at=time;review.reason=p.reason;
        }
      }
      for(const t of db.tasks.filter(t=>t.subject_type==='registration_request'&&t.subject_id===r.id&&!["COMPLETED","CANCELLED","DONE"].includes(t.status))) {
        t.status='CANCELLED';t.cancellation_reason=p.reason;
      }
      notify(r.created_by_id,"LEAD","سرنخ تکراری با پیوند به پرونده اصلی تعیین تکلیف شد","registrationRequests",r.id);
      result("registrationRequests",r);break;
    }
    case "reopenAppraisal": {
      const r=access("registrationRequests",p.id);
      manager(r.management_scope_id);
      assert(r.status==="COMPLETED","فقط پرونده تکمیل‌شده قابل کارشناسی مجدد است.");
      assert(p.reason?.trim(),"دلیل کارشناسی مجدد را بنویسید.");
      const listings=db.listings.filter(l=>l.registration_request_id===r.id);
      assert(listings.every(l=>l.review_status==="APPROVED"&&["ACTIVE","PAUSED"].includes(l.status)),"فایل بسته یا خارج از عرضه را نمی‌توان برای کارشناسی مجدد باز کرد.");
      assert(!db.contracts.some(c=>c.status==="FINALIZED"&&listings.some(l=>db.deals.find(d=>d.id===c.deal_id)?.listing_id===l.id)),"پرونده قرارداد قطعی دارد و قابل بازگشایی عرضه نیست.");
      assert(r.assigned_to_id&&get("users",r.assigned_to_id).is_active,"ابتدا کارشناس مسئول فعال را مشخص کنید.");
      member(r.assigned_to_id,r.management_scope_id);
      assert(!p.due_at||new Date(p.due_at)>new Date(time),"موعد کارشناسی مجدد باید در آینده باشد.");
      const prop=get("properties",r.resulting_property_id);
      const appraisal=db.appraisals.find(a=>a.registration_request_id===r.id);
      r.reappraisal_history ||= [];
      r.reappraisal_history.push({id:uid("reappraisal"),requested_by_id:actorId,requested_at:time,reason:p.reason,
        previous_closed_at:r.closed_at,property_snapshot:clone(prop),listing_snapshots:clone(listings),appraisal_snapshot:appraisal?clone(appraisal):null});
      r.closed_at=null;r.reopened_by_id=actorId;r.reopened_at=time;
      r.due_at=p.due_at||new Date(Date.now()+86400000).toISOString();
      for(const l of listings) {
        stage("listings",l,"PAUSED","status",p.reason);
        stage("listings",l,"CHANGES_REQUIRED","review_status",p.reason);
        l.version=(l.version||0)+1;
      }
      prop.record_status="DRAFT";prop.review_status="CHANGES_REQUIRED";
      if(appraisal){appraisal.status="IN_PROGRESS";appraisal.completed_at=null;}
      stage("registrationRequests",r,"CHANGES_REQUIRED","status",p.reason);
      task(r.assigned_to_id,"registrationRequests",r.id,"کارشناسی مجدد پرونده");
      result("registrationRequests",r);break;
    }
    case "startAppraisal": {
      role("AGENT", "RANGE_MANAGER");
      const r = access("registrationRequests", p.id);
      assert(
        ["ASSIGNED", "IN_PROGRESS", "CHANGES_REQUIRED"].includes(r.status),
        "ابتدا درخواست را به مشاور ارجاع دهید.",
      );
      assert(r.assigned_to_id === actorId, "شروع کارشناسی فقط برای کارشناس مسئول است.");
      assert(assignmentState(db, "registrationRequests", r) !== "REJECTED", "ارجاع رد شده است؛ مدیر باید دوباره ارجاع دهد.");
      r.acceptance_status = "ACCEPTED";
      r.accepted_at ||= time;
      completeSubjectTasks("registrationRequests", r.id);
      stage("registrationRequests", r, "IN_PROGRESS");
      let a = db.appraisals.find((x) => x.registration_request_id === r.id);
      if (!a)
        a = add("appraisals", {
          registration_request_id: r.id,
          property_id: r.resulting_property_id || null,
          appraiser_id: actorId,
          status: "IN_PROGRESS",
          scheduled_at: time,
          report_attachments: [],
        });
      result("registrationRequests", r);
      break;
    }
    case "saveWorkspace": {
      role("AGENT", "RANGE_MANAGER");
      const r = access("registrationRequests", p.id);
      assert(
        [
          "ASSIGNED",
          "IN_PROGRESS",
          "CHANGES_REQUIRED",
          "PENDING_REVIEW",
        ].includes(r.status),
        "این درخواست قابل ویرایش نیست.",
      );
      assert(r.assigned_to_id === actorId, "تکمیل پرونده فقط برای کارشناس مسئول است.");
      assert(assignmentState(db, "registrationRequests", r) === "ACCEPTED", "ابتدا ارجاع را بپذیرید و کارشناسی را شروع کنید.");
      let property = db.properties.find(
        (x) => x.id === r.resulting_property_id,
      );
      const managedTitle=property?.title||r.title||"";
      assert(!p.property||!("title" in p.property)||p.property.title===managedTitle,"عنوان ملک فقط توسط مدیر تعیین می‌شود.");
      assert(!p.listing||!("title" in p.listing)||p.listing.title===managedTitle,"عنوان ملک فقط توسط مدیر تعیین می‌شود.");
      if (!property) {
        property = add("properties", {
          title:managedTitle,
          internal_code: `P-${db.properties.length + 1001}`,
          record_status: "DRAFT",
          version: 0,
          images: [],
          attribute_values: {},
          management_scope_id: r.management_scope_id,
          consultant_id: r.assigned_to_id,
        });
        r.resulting_property_id = property.id;
        if (r.contact_id)
          add("propertyContacts", {
            property_id: property.id,
            contact_id: r.contact_id,
            relation_type: "OWNER",
            ownership_percent: 100,
            is_primary: true,
          });
      }
      const {
        title: ignoredTitle,
        sale_price,
        deposit,
        monthly_rent,
        deal_type_id,
        ...propertyFields
      } = p.property || {};
      Object.assign(property, propertyFields, {
        id: property.id,
        management_scope_id: r.management_scope_id,
        consultant_id: r.assigned_to_id,
        version: (property.version || 0) + 1,
      });
      property.review_status="DRAFT";
      property.record_status="DRAFT";
      for(const listing of db.listings.filter(l=>l.property_id===property.id&&l.status==="ACTIVE"))listing.status="PAUSED";
      let a = db.appraisals.find((x) => x.registration_request_id === r.id);
      if (!a)
        a = add("appraisals", {
          registration_request_id: r.id,
          appraiser_id: actorId,
        });
      Object.assign(a, p.appraisal || {}, {
        id: a.id,
        property_id: property.id,
      });
      stage("registrationRequests", r, "IN_PROGRESS");
      result("registrationRequests", r);
      break;
    }
    case "submitPropertyForReview": {
      role("AGENT","RANGE_MANAGER");
      const property=access("properties",p.id),request=propertyRequest(db,property);
      assert(ownsProperty(db,actorId,property),"ارسال ملک فقط توسط مشاور مسئول پس از پذیرش ارجاع مجاز است.");
      assert(["DRAFT","CHANGES_REQUIRED"].includes(property.review_status),"ملک قبلاً ارسال یا تأیید شده است.");
      assert(property.address&&Number(property.area)>0&&property.district_id,"آدرس، منطقه و متراژ ملک را کامل کنید.");
      const appraisal=db.appraisals.find(a=>a.property_id===property.id);
      assert(appraisal?.findings&&appraisal.status==="COMPLETED","ابتدا کارشناسی را تکمیل و ذخیره کنید.");
      property.review_status="PENDING";property.review_submitted_version=property.version||0;property.review_requested_at=time;
      property.review_history ||= [];
      property.review_history.push({submitted_at:time,submitted_by_id:actorId,version:property.version||0,decision:"PENDING",snapshot:clone({...property,review_history:undefined}),appraisal_snapshot:clone(appraisal)});
      if(request)stage("registrationRequests",request,"PENDING_REVIEW");
      for(const membership of db.memberships.filter(m=>!m.left_at&&m.scope_id===property.management_scope_id&&m.membership_role==="MANAGER")) {
        task(membership.user_id,"properties",property.id,"بررسی و تأیید ملک","PROPERTY_REVIEW");
        notify(membership.user_id,"REVIEW","ملک آماده بررسی است","properties",property.id);
      }
      result("properties",property);break;
    }
    case "reviewProperty": {
      const property=access("properties",p.id);manager(property.management_scope_id);
      const request=propertyRequest(db,property);
      assert(!["CANCELLED","DUPLICATE","CLOSED"].includes(request?.status),"پرونده بسته شده است.");
      assert(property.review_status==="PENDING","ملک در انتظار بررسی نیست.");
      assert(property.review_submitted_version===(property.version||0),"اطلاعات ملک تغییر کرده؛ دوباره برای بررسی ارسال شود.");
      const approved=p.decision==="APPROVED";
      assert(approved||p.decision==="CHANGES_REQUIRED","تصمیم معتبر نیست.");
      assert(approved?property.title?.trim():p.reason?.trim(),approved?"ابتدا عنوان ملک را تعیین کنید.":"دلیل اصلاح را بنویسید.");
      completeSubjectTasks("properties",property.id);
      property.review_status=p.decision;property.record_status=approved?"ACTIVE":"DRAFT";
      property.review_reason=p.reason||"";property.reviewed_at=time;property.reviewed_by_id=actorId;
      const review=property.review_history?.filter(r=>r.decision==="PENDING").at(-1);
      if(review)Object.assign(review,{decision:p.decision,reason:p.reason||"",reviewed_at:time,reviewed_by_id:actorId});
      if(request){stage("registrationRequests",request,approved?"COMPLETED":"CHANGES_REQUIRED");if(approved){request.closed_at=time;completeSubjectTasks("registrationRequests",request.id);}}
      for(const listing of db.listings.filter(l=>l.property_id===property.id)) {
        listing.review_status=approved?"APPROVED":"CHANGES_REQUIRED";
        if(!approved)listing.status="PAUSED";
      }
      notify(propertyOwner(db,property),"REVIEW",approved?"ملک شما تأیید شد":"ملک نیاز به اصلاح دارد","properties",property.id);
      result("properties",property);break;
    }
    case "savePropertyListing": {
      role("AGENT","RANGE_MANAGER");
      const property=access("properties",p.property_id);
      assert(canEditPropertyListings(db,actorId,property),"ثبت و ویرایش فایل عرضه فقط برای مشاور مسئول یا مدیر کل، روی ملک تأییدشده دارای مشاور فعال مجاز است.");
      assert(propertyReviewState(db,property)==="APPROVED","ساخت یا ویرایش فایل عرضه فقط پس از تأیید ملک توسط مدیر رنج مجاز است.");
      const type=get("dealTypes",p.deal_type_id);assert(type.is_active,"نوع معامله فعال نیست.");
      const existing=db.listings.filter(l=>l.property_id===property.id&&l.deal_type_id===type.id);
      assert(existing.length<=1,"برای این نوع معامله چند فایل قدیمی وجود دارد؛ ابتدا مدیر باید فایل‌های تکراری را تعیین تکلیف کند.");
      let listing=existing[0];
      assert(!listing||!["SOLD","RENTED","CLOSED","CANCELLED"].includes(listing.status),"فایل پایان‌یافته قابل تغییر نیست.");
      const version=listing?.deal_type_version_id?get("dealTypeVersions",listing.deal_type_version_id):db.dealTypeVersions.filter(v=>v.deal_type_id===type.id&&v.status==="PUBLISHED").at(-1);
      assert(version,"نسخه منتشرشده شرایط معامله وجود ندارد.");
      const fields={deal_type_id:type.id,deal_type_version_id:version.id,sale_price:p.sale_price||0,deposit:p.deposit||0,monthly_rent:p.monthly_rent||0,additional_terms:p.additional_terms||{},description:p.description||""};
      validateTerms(fields);
      const publicReady=propertyReviewState(db,property)==="APPROVED";
      assert(["ACTIVE","PAUSED"].includes(p.status),"وضعیت عرضه معتبر نیست.");
      assert(p.status!=="ACTIVE"||publicReady,"ابتدا ملک باید تأیید شود؛ فعلاً فایل را متوقف ذخیره کنید.");
      if(!listing)listing=add("listings",{code:`L-${db.listings.length+1001}`,property_id:property.id,registration_request_id:propertyRequest(db,property)?.id||null,created_by_id:actorId,created_at:time,version:0});
      listing.price_history ||= [];
      if(listing.version)listing.price_history.push({changed_at:time,changed_by_id:actorId,version:listing.version,sale_price:listing.sale_price,deposit:listing.deposit,monthly_rent:listing.monthly_rent,additional_terms:clone(listing.additional_terms||{})});
      Object.assign(listing,fields,{title:property.title,assigned_to_id:propertyOwner(db,property),status:p.status,review_status:publicReady?"APPROVED":"DRAFT",version:(listing.version||0)+1,updated_at:time});
      listing.terms_snapshot={listing:clone(fields),property:clone(property),property_version:property.version};
      result("listings",listing);break;
    }
    case "submitListingForReview": {
      const listing=access("listings",p.id);
      return operate(db,actorId,"submitPropertyForReview",{id:listing.property_id,operation_id:p.operation_id});
    }
    case "requestListingChanges":
    case "approveListing": {
      const listing=access("listings",p.id);
      return operate(db,actorId,"reviewProperty",{id:listing.property_id,decision:action==="approveListing"?"APPROVED":"CHANGES_REQUIRED",reason:p.reason||"",operation_id:p.operation_id});
    }
    case "transferScope": {
      const c = p.collection || p.subject_type || "registrationRequests";
      assert(
        ["registrationRequests", "properties", "inquiries"].includes(c),
        "موضوع انتقال معتبر نیست.",
      );
      const r = access(c, p.id);
      manager(r.management_scope_id);
      assert(p.reason?.trim(), "دلیل انتقال الزامی است.");
      assert(get("scopes", p.to_scope_id).is_active, "رنج مقصد فعال نیست.");
      assert(
        r.management_scope_id !== p.to_scope_id,
        "رنج مقصد با مبدأ یکسان است.",
      );
      member(p.assigned_to_id, p.to_scope_id);
      const from = r.management_scope_id;
      const linked = [r];
      if (c === "properties" || c === "registrationRequests") {
        const prop =
          c === "properties"
            ? r
            : db.properties.find((x) => x.id === r.resulting_property_id);
        const req =
          c === "registrationRequests"
            ? r
            : db.registrationRequests.find(
                (x) => x.resulting_property_id === r.id,
              );
        if (prop && !linked.includes(prop)) linked.push(prop);
        if (req && !linked.includes(req)) linked.push(req);
        if (prop)
          db.listings
            .filter((l) => l.property_id === prop.id)
            .forEach((l) => {
              l.assigned_to_id = p.assigned_to_id || null;
            });
      }
      linked.forEach((x) => {
        x.management_scope_id = p.to_scope_id;
        const subject = db.registrationRequests.includes(x) ? "registrationRequests" : db.inquiries.includes(x) ? "inquiries" : "properties";
        for(const pending of db.tasks.filter(t=>t.subject_type===subjectType(subject)&&t.subject_id===x.id&&t.task_type==='LEAD_ACCEPTANCE'&&t.status==='OPEN')) {
          pending.status='CANCELLED';pending.cancellation_reason='انتقال سرنخ به رنج دیگر';
        }
        const acceptance = x.acceptance_status;
        const terminal = ["COMPLETED","CANCELLED","DUPLICATE","CLOSED"].includes(x.status);
        assign(subject, x, p.assigned_to_id || null, p.reason);
        if (terminal) x.acceptance_status = acceptance;
        else if (subject === "registrationRequests") stage(subject,x,p.assigned_to_id ? "ASSIGNED" : "NEW");
        else if (subject === "inquiries") stage(subject,x,"OPEN");
      });
      add("transferHistory", {
        property_id: null,
        registration_request_id: null,
        inquiry_id: null,
        [{
          properties: "property_id",
          registrationRequests: "registration_request_id",
          inquiries: "inquiry_id",
        }[c]]: r.id,
        from_scope_id: from,
        to_scope_id: p.to_scope_id,
        transferred_by_id: actorId,
        transferred_at: time,
        reason: p.reason,
        operation_id: op,
      });
      syncLeadAcceptanceTasks(db);
      if (p.assigned_to_id)
        task(p.assigned_to_id, c, r.id, "پرونده منتقل‌شده به رنج شما");
      result(c, r);
      break;
    }
    case "changeAssignee": {
      // Keep old links/API calls subject to the same assignment rules.
      return operate(original, actorId, "assignCase", {...payload, collection: p.collection || "registrationRequests"});
    }
    case "changeMembership": {
      role();
      assert(p.reason?.trim(), "دلیل تغییر عضویت را بنویسید.");
      get("users", p.user_id);
      get("scopes", p.scope_id);
      db.memberships
        .filter((m) => m.user_id === p.user_id && !m.left_at)
        .forEach((m) => (m.left_at = time));
      add("memberships", {
        user_id: p.user_id,
        scope_id: p.scope_id,
        membership_role: p.membership_role || "CONSULTANT",
        joined_at: time,
        left_at: null,
        assigned_by_id: actorId,
        reason: p.reason,
        operation_id: op,
      });
      break;
    }
    case "createInquiry": {
      role("RANGE_MANAGER");
      access("contacts", p.contact_id);
      const scope =
        p.management_scope_id || activeMemberships(db, actorId)[0]?.scope_id;
      assert(scope, "رنج را انتخاب کنید.");
      manager(scope);
      assert(
        hasGroup(db, actorId, "GENERAL_MANAGER") ||
          activeMemberships(db, actorId).some((m) => m.scope_id === scope),
        "ثبت درخواست در این رنج مجاز نیست.",
      );
      const assignee = p.assigned_to_id || null;
      if (assignee && assignee !== actorId) manager(scope);
      assert(get("scopes", scope).is_active, "رنج فعال نیست.");
      member(assignee, scope);
      const r = add("inquiries", {
        code: `Q-${db.inquiries.length + 1001}`,
        district_ids: [],
        property_type_ids: [],
        priority: "NORMAL",
        status: "OPEN",
        ...p,
        management_scope_id: scope,
        assigned_to_id: null,
        acceptance_status: "UNASSIGNED",
        lead_status: assignee ? "ACCEPTED" : "NEW",
        lead_accepted_by_id: assignee ? actorId : null,
        lead_accepted_at: assignee ? time : null,
        status: "OPEN",
        created_by_id: actorId,
        created_at: time,
      });
      if (assignee) assign("inquiries", r, assignee, "ارجاع اولیه درخواست متقاضی");
      const preferences = p.preferences || [
        p.preference || {
          deal_type_id: p.deal_type_id,
          max_sale_price: p.max_sale_price,
        },
      ];
      assert(
        preferences.every((x) => x.deal_type_id),
        "نوع معامله را انتخاب کنید.",
      );
      preferences.forEach((x) =>
        add("inquiryPreferences", { ...x, inquiry_id: r.id }),
      );
      (p.criteria || []).forEach((x) =>
        add("inquiryCriteria", { ...x, inquiry_id: r.id }),
      );
      syncLeadAcceptanceTasks(db);
      result("inquiries", r);
      break;
    }
    case "introduceListing": {
      role("AGENT", "RANGE_MANAGER");
      const q = access("inquiries", p.inquiry_id);
      assert(!["COMPLETED","CANCELLED","CLOSED","WON","LOST"].includes(q.status),"درخواست متقاضی بسته شده است و معرفی جدید نمی‌پذیرد.");
      assert(q.needs_status!=="DRAFT","ابتدا نیاز و بودجه متقاضی را ذخیره کنید.");
      assert(assignmentState(db, "inquiries", q) === "ACCEPTED", "ابتدا ارجاع درخواست متقاضی را بپذیرید.");
      const l = get("listings", p.listing_id);
      assert(
        canViewPublicListing(db, actorId, l),
        "فقط فایل فعال و تأییدشده قابل معرفی است.",
      );
      const existing = db.introductions.find(
        (x) =>
          x.inquiry_id === q.id &&
          x.listing_id === l.id &&
          !["REJECTED", "CANCELLED"].includes(x.status),
      );
      if (existing) {
        result("introductions", existing);
        break;
      }
      const r = add("introductions", {
        ...p,
        buyer_consultant_id: q.assigned_to_id,
        seller_consultant_id: propertyOwner(db,get("properties",l.property_id)),
        introduced_by_id: actorId,
        introduced_at: time,
        status: "INTRODUCED",
        introduced_terms_snapshot: clone(l),
        channel: p.channel || "IN_PERSON",
      });
      const partners=[...new Set([r.buyer_consultant_id,r.seller_consultant_id].filter(Boolean))];
      if(partners.length>1)for(const partner of partners)task(partner,"introductions",r.id,"هماهنگی معرفی مشترک فایل عرضه","COLLABORATION");
      stage("inquiries", q, "INTRODUCED");
      result("introductions", r);
      break;
    }
    case "updateIntroduction": {
      role("AGENT", "RANGE_MANAGER");
      const r = access("introductions", p.id);
      assert(!["REJECTED","CANCELLED"].includes(r.status),"معرفی بسته شده است.");
      if(p.status==="CANCELLED"){
        const inquiry=access("inquiries",r.inquiry_id);
        assert(!["COMPLETED","CANCELLED","CLOSED","REJECTED","DUPLICATE"].includes(inquiry.status),"درخواست بسته شده است.");
        assert(!db.viewings.some(v=>v.introduction_id===r.id&&v.status!=="CANCELLED")&&!db.deals.some(d=>d.inquiry_id===r.inquiry_id&&d.listing_id===r.listing_id),"برای این معرفی بازدید یا مذاکره ثبت شده است؛ از همان بخش ادامه دهید.");
      }
      assert(
        p.status !== "REJECTED" || p.rejection_reason?.trim(),
        "دلیل رد فایل را وارد کنید.",
      );
      Object.assign(r, {
        feedback: p.feedback ?? r.feedback,
        rejection_reason: p.rejection_reason ?? r.rejection_reason,
        next_action: p.next_action ?? r.next_action,
        next_action_at: p.next_action_at ?? r.next_action_at,
      });
      if (p.status) stage("introductions", r, p.status);
      const consultants=introductionConsultants(db,r);
      for(const partner of new Set([consultants.buyer,consultants.seller].filter(id=>id&&id!==actorId)))notify(partner,"COLLABORATION","وضعیت معرفی مشترک به‌روز شد","introductions",r.id);
      result("introductions", r);
      break;
    }
    case "scheduleViewing": {
      role("AGENT", "RANGE_MANAGER");
      const i = access("introductions", p.introduction_id || p.id);
      assert(
        p.scheduled_at && Number.isFinite(Date.parse(p.scheduled_at)),
        "زمان بازدید را وارد کنید.",
      );
      assert(
        !["REJECTED", "CANCELLED"].includes(i.status),
        "برای معرفی ردشده بازدید ثبت نمی‌شود.",
      );
      const existing = db.viewings.find(
        (v) => v.introduction_id === i.id && v.status === "SCHEDULED",
      );
      if (existing) {
        result("viewings", existing);
        break;
      }
      assert(canViewPublicListing(db,actorId,get("listings",i.listing_id)),"برای ثبت بازدید جدید، فایل باید فعال و ملک تأییدشده باشد.");
      assert(!p.consultant_id||activityAssignees(db,actorId,"introductions",i).includes(p.consultant_id),"مشاور همراه باید فعال و مرتبط با معرفی باشد.");
      const r = add("viewings", {
        introduction_id: i.id,
        consultant_id: p.consultant_id || actorId,
        scheduled_at: p.scheduled_at,
        status: "SCHEDULED",
      });
      stage("introductions", i, "VIEWING_SCHEDULED");
      const partners=introductionConsultants(db,i);
      for(const partner of new Set([partners.buyer,partners.seller].filter(id=>id&&id!==actorId)))notify(partner,"COLLABORATION","بازدید فایل مشترک برنامه‌ریزی شد","introductions",i.id);
      task(r.consultant_id, "viewings", r.id, "انجام بازدید مشتری");
      result("viewings", r);
      break;
    }
    case "completeViewing": {
      role("AGENT", "RANGE_MANAGER");
      const r = access("viewings", p.id);
      assert(r.status === "SCHEDULED", "بازدید قبلاً تعیین تکلیف شده است.");
      assert(p.outcome?.trim(), "نتیجه بازدید را وارد کنید.");
      assert(!p.interest||["INTERESTED","NOT_INTERESTED"].includes(p.interest),"نتیجه تمایل متقاضی معتبر نیست.");
      Object.assign(r, {
        interest:p.interest||null,
        outcome: p.outcome,
        customer_feedback: p.customer_feedback,
        performed_at: time,
      });
      stage("viewings", r, "COMPLETED");
      completeSubjectTasks("viewings", r.id);
      stage("introductions", get("introductions", r.introduction_id), "VIEWED");
      result("viewings", r);
      break;
    }
    case "createTask": {
      role("AGENT", "RANGE_MANAGER");
      const c = subjectCollection(p.subject_type);
      assert(["registrationRequests","inquiries","introductions","viewings","deals"].includes(c), "نوع پرونده معتبر نیست.");
      const subject = access(c, p.subject_id);
      assert(activityOpen(db,c,subject),"این پرونده برای ثبت کار باز نیست یا ارجاع آن پذیرفته نشده است.");
      assert(p.title?.trim() && p.due_at, "عنوان و مهلت کار الزامی است.");
      const assignee=p.assigned_to_id||actorId;
      assert(activityAssignees(db,actorId,c,subject).includes(assignee),"مسئول باید خودتان یا مشاور فعال مرتبط با پرونده باشد.");
      const row=add("tasks", {title:p.title.trim(),description:p.description||"",due_at:p.due_at,
        assigned_to_id:assignee,created_by_id:actorId,task_type:"MANUAL",status:"OPEN",
        subject_type:p.subject_type,subject_id:subject.id,priority:"NORMAL"});
      notify(row.assigned_to_id,"ASSIGNMENT",row.title,c,subject.id);
      result("tasks",row);break;
    }
    case "createFollowUp": {
      role("AGENT", "RANGE_MANAGER", "CONTRACT_OFFICER");
      const c = subjectCollection(p.subject_type);
      assert(c && p.subject_id, "موضوع پیگیری معتبر نیست.");
      const subject=access(c, p.subject_id);
      assert(activityOpen(db,c,subject),"این پرونده برای ثبت پیگیری باز نیست یا ارجاع آن پذیرفته نشده است.");
      assert(
        p.scheduled_at && Number.isFinite(Date.parse(p.scheduled_at)),
        "زمان پیگیری را وارد کنید.",
      );
      const assignee=p.consultant_id||actorId;
      assert(activityAssignees(db,actorId,c,subject).includes(assignee),"مسئول باید خودتان یا مشاور فعال مرتبط با پرونده باشد.");
      const r = add("followUps", {
        ...p,
        consultant_id: assignee,
        status: "SCHEDULED",
        created_by_id: actorId,
      });
      task(r.consultant_id, "followUps", r.id, "انجام پیگیری");
      result("followUps", r);
      break;
    }
    case "rescheduleTask": {
      const row=access("tasks",p.id);
      assert(row.task_type==="MANUAL"&&!["COMPLETED","DONE","CANCELLED"].includes(row.status),"فقط کار ثبت‌شده و باز قابل تعویق است.");
      assert(p.reason?.trim()&&p.due_at&&Date.parse(p.due_at)>Math.max(Date.now(),Date.parse(row.due_at)||0),"دلیل و مهلت جدید، بعد از موعد قبلی و زمان فعلی را وارد کنید.");
      row.postponements ||= [];
      row.postponements.push({previous_due_at:row.due_at,new_due_at:p.due_at,reason:p.reason.trim(),changed_by_id:actorId,changed_at:time});
      row.due_at=p.due_at;
      result("tasks",row);break;
    }
    case "rescheduleFollowUp": {
      const r = access("followUps", p.id);
      assert(!["COMPLETED","DONE","CANCELLED"].includes(r.status), "پیگیری بسته‌شده قابل تعویق نیست.");
      assert(
        p.reason?.trim() &&
          p.scheduled_at &&
          Number.isFinite(Date.parse(p.scheduled_at)),
        "دلیل و زمان جدید پیگیری را وارد کنید.",
      );
      add("rescheduleHistory", {
        followup_id: r.id,
        previous_scheduled_at: r.scheduled_at,
        new_scheduled_at: p.scheduled_at,
        changed_by_id: actorId,
        changed_at: time,
        reason: p.reason,
        operation_id: op,
      });
      r.scheduled_at = p.scheduled_at;
      db.tasks
        .filter(
          (t) =>
            subjectCollection(t.subject_type) === "followUps" &&
            t.subject_id === r.id &&
            !["COMPLETED", "DONE", "CANCELLED"].includes(t.status),
        )
        .forEach((t) => (t.due_at = p.scheduled_at));
      result("followUps", r);
      break;
    }
    case "completeFollowUp":
    case "completeTask": {
      const c = action === "completeTask" ? "tasks" : "followUps";
      const r = access(c, p.id);
      if (r.status === "COMPLETED") {
        result(c, r);
        break;
      }
      if (
        c === "tasks" &&
        ["followUps", "viewings"].includes(subjectCollection(r.subject_type))
      ) {
        const subject = get(subjectCollection(r.subject_type), r.subject_id);
        assert(
          subject.status === "COMPLETED",
          "برای تکمیل این وظیفه، نتیجه پیگیری یا بازدید را در پرونده مرتبط ثبت کنید.",
        );
      }
      if(c==="tasks"&&r.task_type==="CONTRACT_PREPARATION")assert(db.contracts.some(c=>c.deal_id===r.subject_id),"ابتدا قرارداد مذاکره موفق را تنظیم کنید.");
      if(c==="tasks"&&r.task_type==="PROPERTY_REVIEW")assert(propertyReviewState(db,get("properties",r.subject_id))!=="PENDING","تصمیم بررسی را از صفحه ملک ثبت کنید.");
      if (c === "tasks" && r.task_type!=="MANUAL" && ["registrationRequests","inquiries"].includes(subjectCollection(r.subject_type))) {
        const subject = get(subjectCollection(r.subject_type),r.subject_id);
        assert(["COMPLETED","CANCELLED","DUPLICATE","CLOSED"].includes(subject.status), "رسیدگی به ارجاع را از پرونده مرتبط انجام دهید.");
      }
      if (c === "followUps")
        assert(p.outcome?.trim(), "نتیجه پیگیری را وارد کنید.");
      if (c === "followUps") {
        assert(
          (!p.next_action && !p.next_action_at) ||
            (p.next_action?.trim() &&
              p.next_action_at &&
              Number.isFinite(Date.parse(p.next_action_at))),
          "اقدام بعدی و موعد آن را با هم کامل کنید.",
        );
        Object.assign(r, {
          next_action: p.next_action || null,
          next_action_at: p.next_action_at || null,
        });
        completeSubjectTasks("followUps", r.id);
      }
      Object.assign(r, { outcome: p.outcome, completed_at: time });
      stage(c, r, "COMPLETED");
      result(c, r);
      break;
    }
    case "createDeal": {
      role("AGENT", "RANGE_MANAGER");
      const viewing=p.viewing_id?access("viewings",p.viewing_id):null;
      assert(!viewing||viewing.status==="COMPLETED","ابتدا نتیجه بازدید را ثبت کنید.");
      const introId=viewing?.introduction_id||p.introduction_id;
      let i=introId?access("introductions",introId):null;
      const q=i?get("inquiries",i.inquiry_id):access("inquiries",p.inquiry_id);
      const latest=i?latestCompletedViewing(db,i.id):null;
      assert(viewing?.interest!=="NOT_INTERESTED"&&latest?.interest!=="NOT_INTERESTED","نتیجه بازدید عدم تمایل متقاضی است؛ مذاکره قابل شروع نیست.");
      assert(!p.inquiry_id||p.inquiry_id===q.id,"متقاضی با معرفی مرتبط یکسان نیست.");
      assert(!i||!p.listing_id||p.listing_id===i.listing_id,"فایل با معرفی مرتبط یکسان نیست.");
      assert(!["COMPLETED","CANCELLED","CLOSED","DUPLICATE"].includes(q.status)&&(!i||!["REJECTED","CANCELLED"].includes(i.status)),"پرونده یا معرفی بسته شده است.");
      const l = get("listings", p.listing_id || i?.listing_id);
      assert(
        canViewPublicListing(db, actorId, l),
        "مذاکره فقط برای فایل فعال مجاز است.",
      );
      if(!i){
        const matching=[...db.introductions].reverse().find(x=>x.listing_id===l.id&&x.inquiry_id===q.id&&!["REJECTED","CANCELLED"].includes(x.status));
        assert(matching,"ابتدا فایل را به متقاضی معرفی کنید.");
        i=access("introductions",matching.id);
      }
      assert(latestCompletedViewing(db,i.id)?.interest!=="NOT_INTERESTED","نتیجه بازدید عدم تمایل متقاضی است؛ مذاکره قابل شروع نیست.");
      let r = db.deals.find(
        (x) =>
          x.listing_id === l.id &&
          x.inquiry_id === q.id &&
          !["LOST", "CANCELLED", "COMPLETED", "FINALIZED"].includes(x.stage),
      );
      if (r) {
        result("deals", r);
        break;
      }
      r = add("deals", {
        code: `D-${db.deals.length + 1001}`,
        viewing_id: viewing?.id||null,
        introduction_id: i?.id||null,
        listing_id: l.id,
        inquiry_id: q.id,
        assigned_to_id: q.assigned_to_id,
        management_scope_id: q.management_scope_id,
        deal_type_version_id: l.deal_type_version_id,
        stage: "NEGOTIATION",
        started_at: time,
        version: 1,
      });
      add("dealParticipants", {
        deal_id: r.id,
        contact_id: q.contact_id,
        participant_role: "BUYER",
        is_primary: true,
      });
      db.propertyContacts
        .filter(
          (pc) =>
            pc.property_id === l.property_id && pc.relation_type === "OWNER",
        )
        .forEach((pc) =>
          add("dealParticipants", {
            deal_id: r.id,
            contact_id: pc.contact_id,
            participant_role: "SELLER",
            is_primary: pc.is_primary,
          }),
        );
      stage("inquiries", q, "NEGOTIATION");
      result("deals", r);
      break;
    }
    case "submitOffer":
    case "acceptOffer":
      throw Error("مبلغ توافق در قرارداد ثبت می‌شود؛ نتیجه مذاکره را موفق یا ناموفق مشخص کنید.");
    case "succeedDeal": {
      role("AGENT","RANGE_MANAGER");
      const deal=access("deals",p.id);
      assert(["NEGOTIATION","OFFERED"].includes(deal.stage),"نتیجه این مذاکره قبلاً مشخص شده است.");
      stage("deals",deal,"AGREED","stage");deal.success_at=time;deal.success_by_id=actorId;deal.result_notes=p.notes?.trim()||"";
      for(const user of db.users.filter(u=>u.is_active&&hasGroup(db,u.id,"GENERAL_MANAGER")))task(user.id,"deals",deal.id,"تنظیم قرارداد مذاکره موفق","CONTRACT_PREPARATION");
      result("deals",deal);break;
    }
    case "saveContractTerms": {
      role();
      const contract=access("contracts",p.id),deal=get("deals",contract.deal_id),listing=get("listings",deal.listing_id);
      assert(["DRAFT","PENDING_SIGNATURE","AWAITING_SIGNATURE"].includes(contract.status),"قرارداد امضاشده یا قطعی قابل ویرایش نیست.");
      assert(!db.signatures.some(s=>s.status==="SIGNED"&&db.contractParties.some(party=>party.id===s.contract_party_id&&party.contract_id===contract.id)),"پس از امضای طرفین، مبلغ و شرایط قابل تغییر نیست.");
      const fields={deal_type_id:listing.deal_type_id,deal_type_version_id:contract.deal_type_version_id,sale_price:p.sale_price||0,deposit:p.deposit||0,monthly_rent:p.monthly_rent||0,additional_terms:p.additional_terms||{}};
      validateTerms(fields);
      contract.terms_history ||= [];contract.terms_history.push({changed_by_id:actorId,changed_at:time,version:contract.version,terms_snapshot:clone(contract.terms_snapshot)});
      Object.assign(contract,{sale_price:fields.sale_price,deposit:fields.deposit,monthly_rent:fields.monthly_rent,terms_snapshot:clone(fields),agreement_basis:"CONTRACT_TERMS",version:(contract.version||0)+1});
      result("contracts",contract);break;
    }
    case "createContract": {
      role();
      const d = access("deals", p.deal_id || p.id);
      const exists = db.contracts.find((c) => c.deal_id === d.id);
      if (exists) {
        result("contracts", exists);
        break;
      }
      assert(d.stage==="AGREED","ابتدا نتیجه مذاکره را موفق ثبت کنید.");
      const listing=get("listings",d.listing_id);
      const terms={deal_type_id:listing.deal_type_id,deal_type_version_id:d.deal_type_version_id,sale_price:p.sale_price||0,deposit:p.deposit||0,monthly_rent:p.monthly_rent||0,additional_terms:p.additional_terms||{}};
      validateTerms(terms);
      const r = add("contracts", {
        deal_id: d.id,
        contract_number: p.contract_number || `C-${db.contracts.length + 1001}`,
        deal_type_version_id: d.deal_type_version_id,
        accepted_offer_id: null,
        agreement_basis: "CONTRACT_TERMS",
        template_version_id: "demo-v1",
        source_listing_snapshot: clone(listing),
        terms_snapshot: clone(terms),
        sale_price: terms.sale_price,
        deposit: terms.deposit,
        monthly_rent: terms.monthly_rent,
        status: "PENDING_SIGNATURE",
        created_by_id: actorId,
        version: 1,
      });
      db.dealParticipants
        .filter((x) => x.deal_id === d.id)
        .forEach((x) =>
          add("contractParties", {
            contract_id: r.id,
            contact_id: x.contact_id,
            party_role: x.participant_role,
            identity_snapshot: clone(get("contacts", x.contact_id)),
          }),
        );
      stage("deals", d, "CONTRACT", "stage");
      for(const task of db.tasks.filter(t=>t.subject_type==="deal"&&t.subject_id===d.id&&t.task_type==="CONTRACT_PREPARATION"&&t.status==="OPEN")){task.status="COMPLETED";task.completed_at=time;}
      result("contracts", r);
      break;
    }
    case "signContract": {
      role();
      const r = access("contracts", p.id || p.contract_id);
      assert(
        ["AWAITING_SIGNATURE", "PENDING_SIGNATURE", "DRAFT", "SIGNED"].includes(
          r.status,
        ),
        "قرارداد قطعی قابل تغییر نیست.",
      );
      validateContract(r);
      const parties = db.contractParties.filter((x) => x.contract_id === r.id);
      const party = p.contract_party_id || p.party_id;
      assert(
        party && parties.some((x) => x.id === party),
        "طرف قرارداد را انتخاب کنید.",
      );
      const signature = db.signatures.find(
        (s) => s.contract_party_id === party,
      );
      if (signature)
        Object.assign(signature, {
          status: "SIGNED",
          signed_at: signature.signed_at || time,
          recorded_by_id: actorId,
        });
      else
        add("signatures", {
          contract_party_id: party,
          status: "SIGNED",
          signed_at: time,
          recorded_by_id: actorId,
        });
      if (
        parties.length >= 2 &&
        parties.every((x) =>
          db.signatures.some(
            (s) => s.contract_party_id === x.id && s.status === "SIGNED",
          ),
        )
      ) {
        stage("contracts", r, "SIGNED");
        r.signed_at = time;
      }
      result("contracts", r);
      break;
    }
    case "addContractAttachment": {
      role();
      const r = access("contracts", p.id || p.contract_id);
      assert(
        r.status !== "FINALIZED",
        "برای قرارداد قطعی از اصلاحیه استفاده کنید.",
      );
      assert(p.filename, "نام فایل نمایشی را وارد کنید.");
      add("attachments", {
        contract_id: r.id,
        document_type: p.document_type || "DEMO",
        filename: p.filename,
        uploaded_by_id: actorId,
        uploaded_at: time,
        local_demo_only: true,
      });
      result("contracts", r);
      break;
    }
    case "finalizeContract": {
      role();
      const r = access("contracts", p.id);
      if (r.status === "FINALIZED") {
        result("contracts", r);
        break;
      }
      validateContract(r);
      const parties = db.contractParties.filter((x) => x.contract_id === r.id);
      assert(
        parties.length >= 2 &&
          parties.every((x) =>
            db.signatures.some(
              (s) => s.contract_party_id === x.id && s.status === "SIGNED",
            ),
          ),
        "امضای همه طرف‌های قرارداد لازم است.",
      );
      const d = get("deals", r.deal_id);
      const l = get("listings", d.listing_id);
      assert(
        l.status === "ACTIVE",
        "این فایل دیگر فعال نیست؛ قرارداد موازی را بررسی کنید.",
      );
      const competing = db.contracts.find((c) => {
        if (c.id === r.id || c.status !== "FINALIZED") return false;
        const cd = get("deals", c.deal_id),
          cl = get("listings", cd.listing_id);
        return cl.property_id === l.property_id && family(cl) === family(l);
      });
      assert(
        !competing,
        "برای این ملک قرارداد قطعی ناسازگار دیگری ثبت شده است.",
      );
      Object.assign(r, {
        effective_at: p.effective_at || time,
        finalized_at: time,
        finalized_by_id: actorId,
      });
      stage("contracts", r, "FINALIZED");
      stage("deals", d, "FINALIZED", "stage");
      d.closed_at = time;
      stage("listings", l, "CLOSED");
      l.closed_at = time;
      l.closure_reason = "قرارداد قطعی";
      const siblingIds = db.listings
        .filter(
          (x) => x.property_id === l.property_id && family(x) === family(l),
        )
        .map((x) => x.id);
      db.listings
        .filter(
          (x) =>
            x.id !== l.id && siblingIds.includes(x.id) && x.status !== "CLOSED",
        )
        .forEach((x) => {
          stage("listings", x, "CLOSED");
          x.closed_at = time;
          x.closure_reason = "قرارداد قطعی روی همین ملک";
        });
      db.deals
        .filter(
          (x) =>
            x.id !== d.id &&
            siblingIds.includes(x.listing_id) &&
            !["FINALIZED", "LOST", "CANCELLED"].includes(x.stage),
        )
        .forEach((x) => {
          stage(
            "deals",
            x,
            "LOST",
            "stage",
            "قرارداد قطعی در پرونده دیگر همین ملک",
          );
          x.closed_at = time;
          x.closure_reason = "قرارداد قطعی در پرونده دیگر همین ملک";
        });
      stage("inquiries", get("inquiries", d.inquiry_id), "COMPLETED");
      db.users
        .filter((u) => u.is_active && hasGroup(db, u.id, "FINANCE"))
        .forEach((u) =>
          notify(
            u.id,
            "COMMISSION",
            "قرارداد قطعی آماده تصویب کمیسیون است",
            "contracts",
            r.id,
          ),
        );
      result("contracts", r);
      break;
    }
    case "createAmendment": {
      role();
      const c = access("contracts", p.contract_id || p.id);
      assert(c.status === "FINALIZED", "اصلاحیه برای قرارداد قطعی است.");
      assert(
        p.reason?.trim() && p.new_terms_snapshot,
        "دلیل و شرایط اصلاحیه الزامی است.",
      );
      add("amendments", {
        contract_id: c.id,
        amendment_number:
          db.amendments.filter((x) => x.contract_id === c.id).length + 1,
        reason: p.reason,
        previous_terms_snapshot: clone(c.terms_snapshot),
        new_terms_snapshot: clone(p.new_terms_snapshot),
        effective_at: p.effective_at || time,
        status: "APPROVED",
        approved_by_id: actorId,
      });
      break;
    }
    case "approveCommission": {
      role("FINANCE");
      const c = access("contracts", p.contract_id || p.id);
      assert(
        c.status === "FINALIZED",
        "کمیسیون فقط برای قرارداد قطعی محاسبه می‌شود.",
      );
      const existing = db.commissions.find(
        (x) => x.contract_id === c.id && x.status !== "CANCELLED",
      );
      if (existing) {
        result("commissions", existing);
        break;
      }
      const d = get("deals", c.deal_id),
        l = get("listings", d.listing_id);
      const policy = p.policy_version_id
        ? get("commissionPolicies", p.policy_version_id)
        : db.commissionPolicies.find(
            (x) =>
              x.deal_type_id === l.deal_type_id && x.status === "PUBLISHED",
          ) || db.commissionPolicies[0];
      assert(policy, "سیاست نمایشی کمیسیون موجود نیست.");
      const rate = Number(
        policy.parameters?.rate ?? policy.parameters?.percent / 100 ?? 0.005,
      );
      const base =
        Number(c.sale_price || c.deposit || 0) +
        Number(c.monthly_rent || 0) * 12;
      const calculated =
        policy.calculation_method === "FIXED"
          ? Number(policy.parameters?.amount)
          : Math.round(base * (Number.isFinite(rate) ? rate : 0.005));
      const adjustment = Number(p.adjustment_amount || 0);
      assert(
        !adjustment || p.adjustment_reason?.trim(),
        "دلیل تعدیل کمیسیون الزامی است.",
      );
      const amount = Number(p.final_amount ?? calculated + adjustment);
      assert(
        Number.isFinite(amount) && amount > 0,
        "مبلغ کمیسیون باید مثبت باشد.",
      );
      const r = add("commissions", {
        contract_id: c.id,
        debtor_contact_id:
          p.debtor_contact_id || get("inquiries", d.inquiry_id).contact_id,
        policy_version_id: policy.id,
        calculation_snapshot: {
          base,
          policy: clone(policy),
          label: "نمونه نمایشی",
        },
        calculated_amount: calculated,
        adjustment_amount: amount - calculated,
        adjustment_reason: p.adjustment_reason || "",
        final_amount: amount,
        due_at: p.due_at || time,
        status: "APPROVED",
      });
      const shares = p.shares || [
        {
          beneficiary_type: "CONSULTANT",
          beneficiary_user_id: d.assigned_to_id,
          share_percent: 50,
        },
        {
          beneficiary_type: "OFFICE",
          beneficiary_user_id: null,
          share_percent: 50,
        },
      ];
      let total = 0;
      shares.forEach((s) => {
        const a = Number(
          s.amount ?? Math.round((amount * Number(s.share_percent)) / 100),
        );
        assert(Number.isFinite(a) && a >= 0, "مبلغ سهم معتبر نیست.");
        total += a;
        add("commissionShares", {
          ...s,
          commission_id: r.id,
          amount: a,
          status: "APPROVED",
        });
      });
      assert(total <= amount, "مجموع سهم‌ها از کمیسیون مصوب بیشتر است.");
      result("commissions", r);
      break;
    }
    case "confirmPayment": {
      role("FINANCE");
      const amount = Number(p.amount);
      assert(
        Number.isFinite(amount) && amount > 0,
        "مبلغ پرداخت باید بیشتر از صفر باشد.",
      );
      assert(
        ["IN", "OUT", "INCOMING", "OUTGOING"].includes(p.direction),
        "جهت دریافت یا پرداخت را تعیین کنید.",
      );
      const incoming = ["IN", "INCOMING"].includes(p.direction);
      const allocations = p.allocations || [
        {
          commission_id: p.commission_id,
          commission_share_id: p.commission_share_id,
          amount,
        },
      ];
      assert(
        allocations.length &&
          allocations.every(
            (a) => Number.isFinite(Number(a.amount)) && Number(a.amount) > 0,
          ),
        "تخصیص وجه معتبر نیست.",
      );
      assert(
        allocations.reduce((s, a) => s + Number(a.amount), 0) <= amount,
        "مجموع تخصیص از مبلغ پرداخت بیشتر است.",
      );
      const payment = add("payments", {
        contact_id: p.contact_id || null,
        user_id: p.user_id || null,
        direction: incoming ? "IN" : "OUT",
        amount,
        paid_at: p.paid_at || time,
        method: p.method || "TRANSFER",
        reference_number: p.reference_number || "",
        status: "CONFIRMED",
        recorded_by_id: actorId,
        reversal_of_id: null,
      });
      const combined = new Map();
      allocations.forEach((a) => {
        assert(
          incoming
            ? !!a.commission_id && !a.commission_share_id
            : !!a.commission_share_id,
          "دریافت به کمیسیون و پرداخت به سهم تخصیص داده شود.",
        );
        const c = incoming ? "commissions" : "commissionShares";
        const id = incoming ? a.commission_id : a.commission_share_id;
        const r = access(c, id);
        const key = `${c}:${id}`;
        combined.set(key, (combined.get(key) || 0) + Number(a.amount));
        const prior = db.paymentAllocations
          .filter((x) =>
            incoming
              ? x.commission_id === id && !x.commission_share_id
              : x.commission_share_id === id,
          )
          .reduce((s, x) => {
            const pay = get("payments", x.payment_id);
            return (
              s +
              (pay.status === "CONFIRMED" && !pay.reversal_of_id
                ? Number(x.amount)
                : 0)
            );
          }, 0);
        assert(
          prior + combined.get(key) <=
            Number(incoming ? r.final_amount : r.amount),
          "مبلغ از مانده قابل تخصیص بیشتر است.",
        );
        if (!incoming) {
          const commission = get("commissions", r.commission_id);
          const received = db.paymentAllocations
            .filter(
              (x) =>
                x.commission_id === commission.id &&
                !x.commission_share_id &&
                get("payments", x.payment_id).status === "CONFIRMED",
            )
            .reduce((s, x) => s + Number(x.amount), 0);
          const paid = db.paymentAllocations
            .filter(
              (x) =>
                x.commission_share_id &&
                get("commissionShares", x.commission_share_id).commission_id ===
                  commission.id &&
                get("payments", x.payment_id).status === "CONFIRMED",
            )
            .reduce((s, x) => s + Number(x.amount), 0);
          assert(
            paid + allocations.reduce((s, x) => s + Number(x.amount), 0) <=
              received,
            "پرداخت سهم نباید از وصول کمیسیون بیشتر باشد.",
          );
        }
      });
      allocations.forEach((a) =>
        add("paymentAllocations", {
          payment_id: payment.id,
          commission_id:
            a.commission_id ||
            get("commissionShares", a.commission_share_id).commission_id,
          commission_share_id: a.commission_share_id || null,
          amount: Number(a.amount),
        }),
      );
      result("payments", payment);
      break;
    }
    case "reversePayment": {
      role("FINANCE");
      const r = access("payments", p.id);
      assert(p.reason?.trim(), "دلیل برگشت وجه الزامی است.");
      const prior = db.payments.find((x) => x.reversal_of_id === r.id);
      if (prior) {
        result("payments", prior);
        break;
      }
      assert(
        r.status === "CONFIRMED" && !r.reversal_of_id,
        "این وجه قابل برگشت نیست.",
      );
      if (r.direction === "IN") {
        const ids = db.paymentAllocations
          .filter((a) => a.payment_id === r.id)
          .map((a) => a.commission_id);
        for (const id of ids) {
          const total = (direction) =>
            db.paymentAllocations
              .filter(
                (a) =>
                  a.commission_id === id &&
                  get("payments", a.payment_id).direction === direction &&
                  get("payments", a.payment_id).status === "CONFIRMED" &&
                  a.payment_id !== r.id,
              )
              .reduce((s, a) => s + Number(a.amount), 0);
          assert(
            total("IN") >= total("OUT"),
            "ابتدا پرداخت سهم مرتبط را برگشت بزنید.",
          );
        }
      }
      r.status = "REVERSED";
      add("payments", {
        ...clone(r),
        id: undefined,
        direction: r.direction === "IN" ? "OUT" : "IN",
        status: "CONFIRMED",
        reversal_of_id: r.id,
        reason: p.reason,
        paid_at: time,
        recorded_by_id: actorId,
      });
      break;
    }
    case "createDealType": {
      role();
      assert(
        p.name?.trim() && p.code?.trim(),
        "نام و کد نوع معامله الزامی است.",
      );
      assert(
        !db.dealTypes.some((x) => x.code === p.code),
        "کد نوع معامله تکراری است.",
      );
      const behavior = p.behavior_type;
      const template = db.dealTypes.find(
        (x) =>
          x.id === p.template_id ||
          x.behavior_type === behavior ||
          x.code === behavior,
      );
      assert(template, "یکی از شش الگوی رفتاری موجود را انتخاب کنید.");
      const v = db.dealTypeVersions
        .filter(
          (x) => x.deal_type_id === template.id && x.status === "PUBLISHED",
        )
        .at(-1);
      const r = add("dealTypes", {
        code: p.code,
        name: p.name,
        behavior_type: template.behavior_type || template.code,
        is_active: true,
      });
      add("dealTypeVersions", {
        deal_type_id: r.id,
        version_number: 1,
        status: "PUBLISHED",
        field_definitions: clone(v?.field_definitions || []),
        validation_rules: clone(v?.validation_rules || {}),
        published_at: time,
      });
      result("dealTypes", r);
      break;
    }
    case "publishDealTypeVersion": {
      role();
      const r = get("dealTypes", p.deal_type_id || p.id);
      const previous = db.dealTypeVersions
        .filter((x) => x.deal_type_id === r.id)
        .at(-1);
      add("dealTypeVersions", {
        deal_type_id: r.id,
        version_number: (previous?.version_number || 0) + 1,
        status: "PUBLISHED",
        field_definitions: clone(
          p.field_definitions || previous?.field_definitions || [],
        ),
        validation_rules: clone(
          p.validation_rules || previous?.validation_rules || {},
        ),
        published_at: time,
      });
      result("dealTypes", r);
      break;
    }
    case "saveInquiryNeeds": {
      role("AGENT","RANGE_MANAGER");
      const r=access("inquiries",p.id);
      assert(!["COMPLETED","CLOSED","CANCELLED","DUPLICATE"].includes(r.status)&&assignmentState(db,"inquiries",r)==="ACCEPTED","ابتدا ارجاع باز درخواست را بپذیرید.");
      const preferences=p.preferences;
      assert(Array.isArray(preferences)&&preferences.length>0,"حداقل یک نوع معامله و بودجه را ثبت کنید.");
      assert(new Set(preferences.map(x=>x.deal_type_id)).size===preferences.length,"نوع معامله تکراری است.");
      for(const key of ["min_area","max_area","min_rooms"])assert(p[key]==null||p[key]===""||Number.isFinite(Number(p[key]))&&Number(p[key])>=0,"متراژ و تعداد اتاق معتبر نیست.");
      assert(!Number(p.max_area)||Number(p.max_area)>=Number(p.min_area||0),"حداکثر متراژ باید از حداقل کمتر نباشد.");
      for(const pref of preferences){
        assert(get("dealTypes",pref.deal_type_id).is_active,"نوع معامله فعال را انتخاب کنید.");
        for(const key of ["max_sale_price","max_deposit","max_monthly_rent"])assert(pref[key]==null||pref[key]===""||Number.isFinite(Number(pref[key]))&&Number(pref[key])>=0,"بودجه باید عدد نامنفی باشد.");
      }
      const districts=p.district_ids||r.district_ids||[];
      assert(Array.isArray(districts)&&districts.every(id=>db.districts.some(d=>d.id===id)),"منطقه معتبر نیست.");
      Object.assign(r,{min_area:Number(p.min_area)||null,max_area:Number(p.max_area)||null,min_rooms:Number(p.min_rooms)||0,notes:p.notes??r.notes,district_ids:districts,needs_status:"CONFIRMED",needs_confirmed_at:time,needs_confirmed_by_id:actorId});
      db.inquiryPreferences=db.inquiryPreferences.filter(x=>x.inquiry_id!==r.id);
      for(const pref of preferences)add("inquiryPreferences",{inquiry_id:r.id,deal_type_id:pref.deal_type_id,max_sale_price:Number(pref.max_sale_price)||0,max_deposit:Number(pref.max_deposit)||0,max_monthly_rent:Number(pref.max_monthly_rent)||0});
      if(["NEW","OPEN","SEARCHING"].includes(r.status))stage("inquiries",r,"MATCHING");
      result("inquiries",r);break;
    }
    case "changeInquiryCaseStatus": {
      const r=access("inquiries",p.id);manager(r.management_scope_id);
      assert(p.reason?.trim(),"دلیل تغییر وضعیت را وارد کنید.");
      const related=inquiryRelations(db,r);
      assert(!related.locked,"این درخواست قرارداد قطعی یا امضاشده دارد.");
      assert(inquiryStatusActions(db,actorId,r).includes(p.status),"این تغییر وضعیت برای درخواست مجاز نیست.");
      const previous=r.status;
      if(p.status==="REOPEN"){
        const snapshot=r.case_close_snapshot;assert(snapshot,"سابقه بستن معتبر وجود ندارد.");
        assert(!p.due_at||Date.parse(p.due_at)>Date.parse(time),"موعد بازگشایی باید در آینده باشد.");
        const validAssignee=r.assigned_to_id&&db.users.some(u=>u.id===r.assigned_to_id&&u.is_active)&&activeMemberships(db,r.assigned_to_id).some(m=>m.scope_id===r.management_scope_id&&m.membership_role==="CONSULTANT");
        r.acceptance_status=snapshot.acceptance_status;r.closed_at=null;r.closure_reason=null;r.duplicate_of_id=null;
        if(r.assigned_to_id&&!validAssignee)assign("inquiries",r,null,"بازگشایی؛ مشاور قبلی فعال یا عضو رنج نیست");
        else if(r.assigned_to_id&&snapshot.acceptance_status==="PENDING")assign("inquiries",r,r.assigned_to_id,"ارجاع دوباره پس از بازگشایی");
        const accepted=r.assigned_to_id&&r.acceptance_status==="ACCEPTED";
        stage("inquiries",r,accepted||!r.assigned_to_id?"OPEN":snapshot.status,"status",p.reason.trim());
        if(accepted){r.due_at=p.due_at||new Date(Date.parse(time)+86400000).toISOString();task(r.assigned_to_id,"inquiries",r.id,"رسیدگی دوباره به درخواست");}
      }else{
        if(p.status==="DUPLICATE"){
          const original=access("inquiries",p.original_id);
          assert(original.id!==r.id&&!["CLOSED","CANCELLED","DUPLICATE","COMPLETED"].includes(original.status),"درخواست اصلی معتبر نیست.");
          r.duplicate_of_id=original.id;
        }
        r.case_close_snapshot={status:r.status,acceptance_status:assignmentState(db,"inquiries",r)};
        r.closed_at=time;r.closure_reason=p.reason.trim();stage("inquiries",r,p.status,"status",p.reason.trim());
        for(const intro of related.introductions.filter(i=>!["REJECTED","CANCELLED"].includes(i.status)))stage("introductions",intro,"CANCELLED","status",p.reason);
        for(const v of related.viewings.filter(v=>v.status==="SCHEDULED")){v.cancellation_reason=p.reason;stage("viewings",v,"CANCELLED","status",p.reason);}
        for(const d of related.deals.filter(d=>!["LOST","FINALIZED","CANCELLED"].includes(d.stage))){d.closure_reason=p.reason;d.closed_at=time;stage("deals",d,"LOST","stage",p.reason);}
        for(const c of related.contracts.filter(c=>c.status!=="FINALIZED"))stage("contracts",c,"CANCELLED","status",p.reason);
        const subjects=new Set(["inquiries:"+r.id,...related.introductions.map(i=>"introductions:"+i.id),...related.viewings.map(v=>"viewings:"+v.id),...related.deals.map(d=>"deals:"+d.id)]);
        for(const f of db.followUps.filter(f=>subjects.has(subjectCollection(f.subject_type)+":"+f.subject_id)&&!["COMPLETED","CANCELLED"].includes(f.status))){stage("followUps",f,"CANCELLED","status",p.reason);subjects.add("followUps:"+f.id);}
        for(const t of db.tasks.filter(t=>subjects.has(subjectCollection(t.subject_type)+":"+t.subject_id)&&!["COMPLETED","CANCELLED"].includes(t.status)))stage("tasks",t,"CANCELLED","status",p.reason);
        for(const h of db.rescheduleHistory.filter(h=>h.subject_type==="inquiry"&&h.subject_id===r.id&&h.status==="PENDING")){h.status="CANCELLED";h.decision_reason=p.reason;h.decided_by_id=actorId;h.decided_at=time;}
      }
      r.case_status_history||=[];r.case_status_history.push({id:uid("case-status"),action:p.status,from_status:previous,to_status:r.status,reason:p.reason.trim(),changed_by_id:actorId,changed_at:time});
      notify(r.assigned_to_id,"ASSIGNMENT","وضعیت درخواست متقاضی تغییر کرد","inquiries",r.id);result("inquiries",r);break;
    }
    case "updateInquiry": {
      if(p.status==="CANCELLED")return operate(db,actorId,"changeInquiryCaseStatus",{id:p.id,status:"CANCELLED",reason:p.reason});
      role("AGENT", "RANGE_MANAGER");
      const r = access("inquiries", p.id);
      assert(
        !["COMPLETED", "CANCELLED","CLOSED","DUPLICATE"].includes(r.status),
        "درخواست بسته شده است.",
      );
      assert(assignmentState(db,"inquiries",r) === "ACCEPTED", "ابتدا ارجاع درخواست متقاضی را بپذیرید.");
      if (p.status)
        assert(
          ["OPEN", "MATCHING", "CANCELLED"].includes(p.status),
          "مرحله درخواست از مسیر عملیات مرتبط تغییر می‌کند.",
        );
      if (["OPEN", "MATCHING"].includes(p.status))
        assert(
          ["NEW", "OPEN", "SEARCHING", "MATCHING"].includes(r.status),
          "پس از معرفی، مرحله از مسیر عملیات مرتبط تغییر می‌کند.",
        );
      if (p.status === "MATCHING")
        assert(
          p.next_action?.trim() &&
            p.next_action_at &&
            Number.isFinite(Date.parse(p.next_action_at)),
          "اقدام بعدی و موعد جست‌وجو را کامل کنید.",
        );
      if (p.status === "CANCELLED")
        assert(p.reason?.trim(), "دلیل بستن درخواست را بنویسید.");
      Object.assign(r, {
        next_action: p.next_action ?? r.next_action,
        next_action_at: p.next_action_at ?? r.next_action_at,
        notes: p.notes ?? r.notes,
      });
      if (p.status) stage("inquiries", r, p.status, "status", p.reason);
      result("inquiries", r);
      break;
    }
    case "closeDeal": {
      role("AGENT", "RANGE_MANAGER");
      const r = access("deals", p.id);
      assert(
        ["NEGOTIATION","OFFERED","AGREED"].includes(r.stage),
        "مذاکره قراردادی از این مسیر بسته نمی‌شود.",
      );
      assert(p.reason?.trim(), "دلیل پایان مذاکره را بنویسید.");
      stage("deals", r, "LOST", "stage", p.reason);
      r.closed_at = time;
      r.closure_reason = p.reason;
      for(const t of db.tasks.filter(t=>t.subject_type==="deal"&&t.subject_id===r.id&&t.task_type==="CONTRACT_PREPARATION"&&t.status==="OPEN")){t.status="CANCELLED";t.cancellation_reason=p.reason;}
      result("deals", r);
      break;
    }
    case "markNotificationRead": {
      const r = access("notifications", p.id);
      r.is_read = true;
      result("notifications", r);
      break;
    }
    case "setListingStatus": {
      const r = access("listings", p.id);
      const root=propertyRequest(db,get("properties",r.property_id));
      assert(!root||!terminalCaseStatuses.includes(root.status),"پرونده ملک بسته است؛ ابتدا مدیر پرونده را بازگشایی کند.");
      manager(context(db, "listings", r).scope);
      assert(
        ["ACTIVE", "PAUSED", "EXPIRED", "ARCHIVED"].includes(p.status),
        "وضعیت عرضه معتبر نیست.",
      );
      assert(
        r.status !== "CLOSED",
        "فایل دارای قرارداد قطعی بازگشایی نمی‌شود.",
      );
      assert(
        p.status !== "ACTIVE" || (r.review_status === "APPROVED" && propertyReviewState(db,get("properties",r.property_id)) === "APPROVED"),
        "فعال‌سازی به تأیید مدیر نیاز دارد.",
      );
      stage("listings", r, p.status);
      result("listings", r);
      break;
    }
    default:
      throw new Error("عملیات در این نمونه تعریف نشده است.");
  }
  assert(target && collection, "عملیات نتیجه‌ای ایجاد نکرد.");
  db.activityLogs.push({
    id: uid("activity"),
    user_id: actorId,
    action,
    result_collection: collection,
    request_signature: requestSignature,
    subject_type: subjectType(collection),
    subject_id: target.id,
    description: p.reason || actionTitles[action] || "ثبت عملیات",
    operation_id: op,
    created_at: time,
  });
  db._result = { collection, id: target.id };
  return syncPropertyListings(db);
}
export const assignRegistrationRequest = (db, user, p) =>
  operate(db, user, "assignRegistrationRequest", p);
export const transferScope = (db, user, p) =>
  operate(db, user, "transferScope", p);
export const startAppraisal = (db, user, p) =>
  operate(db, user, "startAppraisal", p);
export const submitListingForReview = (db, user, p) =>
  operate(db, user, "submitListingForReview", p);
export const requestListingChanges = (db, user, p) =>
  operate(db, user, "requestListingChanges", p);
export const approveListing = (db, user, p) =>
  operate(db, user, "approveListing", p);
export const introduceListing = (db, user, p) =>
  operate(db, user, "introduceListing", p);
export const scheduleViewing = (db, user, p) =>
  operate(db, user, "scheduleViewing", p);
export const rescheduleFollowUp = (db, user, p) =>
  operate(db, user, "rescheduleFollowUp", p);
export const createDeal = (db, user, p) => operate(db, user, "createDeal", p);
export const submitOffer = (db, user, p) => operate(db, user, "submitOffer", p);
export const acceptOffer = (db, user, p) => operate(db, user, "acceptOffer", p);
export const finalizeContract = (db, user, p) =>
  operate(db, user, "finalizeContract", p);
export const approveCommission = (db, user, p) =>
  operate(db, user, "approveCommission", p);
export const confirmPayment = (db, user, p) =>
  operate(db, user, "confirmPayment", p);
