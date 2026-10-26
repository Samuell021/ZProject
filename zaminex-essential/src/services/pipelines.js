import {canManageCase,canOpenPage,leadState,assignmentState,inOperationalPipeline} from "./intake.js";
export const pipelineDefinitions = {
  requests: {
    title: "تأمین فایل",
    model: "PropertyRegistrationRequest",
    collection: "registrationRequests",
    field: "status",
    historySubject: "registration_request",
    stages: [
      "IN_PROGRESS",
      "PENDING_REVIEW",
      "CHANGES_REQUIRED",
    ],
    terminalStages: ["COMPLETED","CANCELLED","DUPLICATE","CLOSED"],
    transitions: [
      {
        from: ["CHANGES_REQUIRED"],
        to: "IN_PROGRESS",
        action: "workspace",
        command: "startAppraisal / saveWorkspace",
        required: "تماس، گزارش کارشناسی و اطلاعات تدریجی پرونده",
        permission: "مشاور مسئول",
        effects: "کارشناسی و مشخصات ملک؛ افزایش نسخه",
      },
      {
        from: ["IN_PROGRESS", "CHANGES_REQUIRED"],
        to: "PENDING_REVIEW",
        command: "submitPropertyForReview",
        required: "اطلاعات کامل ملک و گزارش کارشناسی",
        permission: "مشاور مسئول",
        effects: "snapshot نسخه ملک و گزارش کارشناسی + صف بررسی ملک",
      },
      {
        from: ["PENDING_REVIEW"],
        to: "CHANGES_REQUIRED",
        command: "reviewProperty",
        required: "دلیل برگشت",
        permission: "مدیر رنج",
        effects: "برگشت ملک و درخواست برای اصلاح؛ توقف عرضه‌های مرتبط + اعلان",
      },
      {
        from: ["PENDING_REVIEW"],
        to: "COMPLETED",
        command: "reviewProperty",
        required: "تأیید همان نسخه ملک ارسال‌شده؛ عنوان مدیریتی الزامی",
        permission: "مدیر رنج",
        effects: "ملک APPROVED و درخواست COMPLETED؛ بدون ساخت یا فعال‌سازی خودکار فایل",
      },
    ],
  },
  inquiries: {
    title: "متقاضیان",
    model: "Inquiry",
    collection: "inquiries",
    field: "status",
    historySubject: "inquiry",
    stages: [
      "MATCHING",
      "INTRODUCED",
      "NEGOTIATION",
    ],
    terminalStages: ["COMPLETED","CANCELLED"],
    transitions: [
      {
        from: ["OPEN"],
        to: "MATCHING",
        action: "match",
        command: "updateInquiry",
        required: "اقدام بعدی و موعد پیگیری",
        permission: "مشاور مسئول",
        effects: "مرحله جست‌وجو؛ جست‌وجو معرفی نمی‌سازد",
      },
      {
        from: ["OPEN", "MATCHING"],
        to: "INTRODUCED",
        command: "introduceListing",
        required: "انتخاب صریح فایل فعال و نیاز مجاز",
        permission: "مسئول نیاز",
        effects: "Introduction با snapshot شرایط",
      },
      {
        from: ["INTRODUCED", "VIEWING"],
        to: "NEGOTIATION",
        command: "createDeal",
        required: "معرفی قبلی و فایل فعال",
        permission: "مسئول نیاز",
        effects: "مذاکره و طرفین مستقل",
      },
      {
        from: ["NEGOTIATION", "NEGOTIATING"],
        to: "COMPLETED",
        command: "finalizeContract",
        required: "قرارداد معتبر با امضای تمام طرف‌ها",
        permission: "فقط مدیرکل",
        effects: "تکمیل نیاز از قرارداد؛ انتقال دستی ممنوع",
      },
    ],
  },
  deals: {
    title: "مذاکرات",
    model: "Deal",
    collection: "deals",
    field: "stage",
    historySubject: "deal",
    stages: [
      "NEGOTIATION",
      "AGREED",
      "CONTRACT",
    ],
    terminalStages: ["FINALIZED","LOST"],
    transitions: [
      {
        from: ["NEGOTIATION","OFFERED"],
        to: "AGREED",
        command: "succeedDeal",
        required: "ثبت نتیجه موفق؛ مبلغ در قرارداد تعیین می‌شود",
        permission: "مسئول مذاکره",
        effects: "آماده تنظیم قرارداد",
      },
      {
        from: ["AGREED"],
        to: "CONTRACT",
        action: "createContract",
        command: "createContract",
        required: "مذاکره موفق؛ مبلغ و شرایط قطعی متناسب با نوع معامله",
        permission: "فقط مدیرکل",
        effects: "پیش‌نویس قرارداد و snapshot هویت",
      },
      {
        from: ["CONTRACT"],
        to: "FINALIZED",
        command: "finalizeContract",
        required: "امضاها، قواعد نوع و کنترل قرارداد ناسازگار",
        permission: "فقط مدیرکل",
        effects: "قرارداد قطعی، فایل بسته، نیاز تکمیل",
      },
      {
        from: ["NEGOTIATION", "OFFERED", "AGREED"],
        to: "LOST",
        action: "closeDeal",
        command: "closeDeal",
        required: "دلیل عدم توافق",
        permission: "مسئول مذاکره",
        effects: "بستن مذاکره بدون قرارداد",
      },
    ],
  },
};
export function transitionFor(page, row, target) {
  const definition = pipelineDefinitions[page];
  return definition?.transitions.find(
    (t) => t.to === target && t.from.includes(row[definition.field]),
  );
}
export function pipelineRoute(page, row, db, target, actorId) {
  if(page==="requests"&&row.status==="PENDING_REVIEW"&&row.resulting_property_id)
    return `/inbox?review=${row.resulting_property_id}${target==="CHANGES_REQUIRED"?"&action=propertyChanges":""}`;
  const transition = target ? transitionFor(page,row,target) : null;
  if(transition?.action)return `/${page}/${row.id}?action=${transition.action}`;
  if (
    page === "deals" &&
    (target === "FINALIZED" || row.stage === "CONTRACT")
  ) {
    const contract = db.contracts.find((c) => c.deal_id === row.id);
    if (contract&&(!actorId||canOpenPage(db,actorId,"contracts"))) return `/contracts/${contract.id}`;
  }
  if (page === "inquiries" && target === "NEGOTIATION") {
    const intro = db.introductions.find(
      (i) =>
        i.inquiry_id === row.id &&
        !["REJECTED", "CANCELLED"].includes(i.status),
    );
    if (intro) return `/introductions/${intro.id}`;
  }
  return `/${page}/${row.id}`;
}
export function pipelineWarnings(page, row, db) {
  const warnings = [];
  const closed = [
    "COMPLETED",
    "CANCELLED",
    "DUPLICATE",
    "FINALIZED",
    "LOST",
    "WON",
    "CLOSED",
  ].includes(row.stage || row.status);
  if (closed) return warnings;
  if (!row.assigned_to_id) warnings.push("در صف ارجاع؛ مسئول تعیین نشده");
  if (!(row.due_at || row.next_action_at))
    warnings.push("موعد اقدام تعیین نشده");
  if (page === "requests" && !row.contact_id && !row.initial_contact_phone)
    warnings.push("راه تماس ثبت نشده");
  if (
    page === "requests" &&
    ["IN_PROGRESS", "PENDING_REVIEW"].includes(row.status) &&
    !row.resulting_property_id
  )
    warnings.push("مشخصات ملک هنوز کامل نیست");
  if (
    page === "inquiries" &&
    !db.inquiryPreferences.some((p) => p.inquiry_id === row.id)
  )
    warnings.push("نوع معامله و بودجه نیاز تکمیل است");
  if (new Date(row.due_at || row.next_action_at) < new Date())
    warnings.push("موعد اقدام گذشته است");
  return warnings;
}

export const intakePipelineStages=['LEAD_RECEPTION','LEAD_READY','ASSIGNMENT_PENDING'];
export function pipelineStage(db,actorId,page,row) {
 const collection=pipelineDefinitions[page]?.collection;
 if(!collection||!canOpenPage(db,actorId,page)||['COMPLETED','CANCELLED','DUPLICATE','FINALIZED','LOST','WON','CLOSED'].includes(row.stage||row.status))return null;
 if(page==='deals'&&row.stage==='OFFERED')return 'NEGOTIATION';
 const manager=canOpenPage(db,actorId,'leads')&&canManageCase(db,actorId,row);
 if(canOpenPage(db,actorId,'leads')&&!manager)return null;
 if(manager&&['requests','inquiries'].includes(page)) {
  if(leadState(row)==='NEW')return 'LEAD_RECEPTION';
  const state=assignmentState(db,collection,row);
  if(['UNASSIGNED','REJECTED'].includes(state))return 'LEAD_READY';
  if(state==='PENDING')return 'ASSIGNMENT_PENDING';
 }
 if(!manager&&row.assigned_to_id!==actorId)return null;
 return inOperationalPipeline(collection,row)?row.stage||row.status:null;
}

export function sortPipelineRows(rows) {
  const deadline = row => {
    const timestamp = Date.parse(row.due_at || row.next_action_at);
    return Number.isFinite(timestamp) ? timestamp : Infinity;
  };
  return [...rows].sort((a, b) => {
    const first = deadline(a), second = deadline(b);
    return first === second ? 0 : first < second ? -1 : 1;
  });
}
