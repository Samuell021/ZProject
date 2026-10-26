// Proposed backend contracts. These endpoints are documentation; no network requests are made.
const read = (path, summary, models, filters = []) => ({
  method: "GET",
  path,
  summary,
  models,
  filters,
  permission:
    "دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل",
  request: null,
  response:
    path.includes("/{id}") && !path.endsWith("/matches")
      ? { data: { id: "record-uuid", version: 1, relationships: {} } }
      : { data: [], meta: { page: 1, page_size: 20, total: 0 } },
  effects: [
    "خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.",
  ],
  errors: ["401: کاربر وارد نشده", "403/404: رکورد غیرمجاز یا ناموجود"],
  transaction: false,
});
const command = (
  path,
  summary,
  models,
  permission,
  request,
  effects,
  mock,
  method = "POST",
) => ({
  method,
  path,
  summary,
  models,
  permission,
  request,
  response: {
    data: { id: "record-uuid", status: "resulting_status", version: 2 },
    operation_id: "operation-uuid",
  },
  effects,
  mock,
  transaction: true,
  errors: [
    "403: عملیات یا حوزه غیرمجاز",
    "409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده",
    "422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود",
  ],
});
const operational = [
  "management_scope_id",
  "assigned_to_id",
  "status",
  "search",
  "page",
  "page_size",
];
export const apiCatalog = {
  setPropertyTitle: command("/api/v1/registration-requests/{id}/title", "تعیین یا ویرایش عنوان مدیریتی ملک", ["PropertyRegistrationRequest","Property","Listing"], "مدیر رنج مسئول یا مدیر کل", {title:"string required"}, ["عنوان از توضیح سرنخ مستقل است؛ مشاور فقط می‌خواند؛ تاریخچه عنوان حفظ می‌شود"], "setPropertyTitle"),
  markDuplicateCase: command("/api/v1/registration-requests/{id}/duplicate", "تأیید تکراری بودن با پیوند به پرونده اصلی", ["PropertyRegistrationRequest","Task"], "مدیر رنج مسئول یا مدیر کل", {original_id:"uuid required",reason:"string required"}, ["حفظ هر دو پرونده و تاریخچه؛ بستن کارهای پرونده تکراری؛ بدون ادغام خودکار"], "markDuplicateCase"),
  reopenAppraisal: command("/api/v1/registration-requests/{id}/reopen-appraisal", "درخواست کارشناسی مجدد همان پرونده", ["PropertyRegistrationRequest","Listing","PropertyAppraisal","Task"], "مدیر رنج مسئول یا مدیر کل", {reason:"string required",due_at:"ISO optional"}, ["بایگانی گزارش قبلی؛ توقف عرضه تا تأیید دوباره؛ حفظ شناسه پرونده؛ وظیفه جدید کارشناس"], "reopenAppraisal"),
  acceptLead: command("/api/v1/leads/{id}/accept", "پذیرش سرنخ و انتقال به فهرست سرنخ‌ها", ["PropertyRegistrationRequest","Inquiry","Task"], "فقط مدیر کل یا مدیر رنج مسئول", {collection:"registrationRequests | inquiries"}, ["ثبت مدیر پذیرنده و زمان؛ تکمیل وظیفه پذیرش مدیر؛ ورود به فهرست سرنخ‌های قابل ارجاع"], "acceptLead"),
  approveAssignmentExtension: command("/api/v1/cases/{id}/extensions/{request_id}/approve", "تأیید تمدید مهلت", ["AssignmentRescheduleHistory","Task"], "مدیر کل یا مدیر همین رنج", {collection:"registrationRequests | inquiries",request_id:"uuid",due_at:"ISO optional",reason:"string"}, ["ثبت تصمیم مستقل، تغییر موعد پرونده و وظایف مسئول، بستن وظایف بررسی مدیران؛ ساعت ارجاع ثابت است"], "approveAssignmentExtension"),
  rejectAssignmentExtension: command("/api/v1/cases/{id}/extensions/{request_id}/reject", "رد درخواست تمدید", ["AssignmentRescheduleHistory","Task"], "مدیر کل یا مدیر همین رنج", {collection:"registrationRequests | inquiries",request_id:"uuid",reason:"string"}, ["حفظ موعد قبلی و ثبت دلیل رد؛ درخواست قبلی حذف نمی‌شود"], "rejectAssignmentExtension"),
  createLead: command("/api/v1/leads", "ثبت سرنخ و ایجاد پرونده ملک یا متقاضی", ["PropertyRegistrationRequest", "Inquiry", "Contact"], "مشاور فقط ثبت در رنج خود؛ پذیرش و ارجاع با مدیر", {lead_type:"PROPERTY | INQUIRY",management_scope_id:"uuid فقط مدیر؛ برای مشاور از عضویت فعال تعیین می‌شود",initial_contact_name:"string",initial_contact_phone:"string"}, ["ساخت اتمیک شخص و پرونده؛ صف مدیریتی از ابتدا؛ کاریز عملیاتی مشاور پس از پذیرش"], "createLead"),
  assignCase: command("/api/v1/cases/{id}/assign", "ارجاع یا ارجاع مجدد پرونده", ["AssignmentHistory", "Task"], "مدیر کل یا مدیر همین رنج؛ ارجاع بی‌پاسخ پس از ۴۸ ساعت، یا بلافاصله پس از رد", {collection:"registrationRequests | inquiries",assigned_to_id:"uuid",due_at:"ISO",reason:"string optional"}, ["حفظ تاریخچه، لغو وظایف قبلی، انتظار پذیرش مسئول جدید"], "assignCase"),
  acceptAssignment: command("/api/v1/cases/{id}/accept", "پذیرش و شروع رسیدگی", ["PropertyRegistrationRequest", "Inquiry"], "فقط کارشناس مسئول ارجاع", {collection:"registrationRequests | inquiries"}, ["ثبت accepted_at و ورود به کارشناسی یا تطبیق"], "acceptAssignment"),
  rejectAssignment: command("/api/v1/cases/{id}/reject", "رد ارجاع با دلیل", ["ActivityLog"], "فقط کارشناس مسئول پیش از پذیرش", {collection:"registrationRequests | inquiries",reason:"string"}, ["حفظ پرونده و سابقه؛ امکان ارجاع مجدد توسط مدیر"], "rejectAssignment"),
  postponeAssignment: command("/api/v1/cases/{id}/postpone", "درخواست تمدید مهلت", ["AssignmentRescheduleHistory", "Task"], "فقط کارشناس مسئول پس از پذیرش ارجاع و انقضای موعد", {collection:"registrationRequests | inquiries",due_at:"ISO",reason:"string"}, ["ثبت درخواست تمدید در انتظار تأیید؛ موعد تا تصمیم مدیر تغییر نمی‌کند؛ ساعت پذیرش ارجاع ثابت می‌ماند"], "postponeAssignment"),
  dashboard: read(
    "/api/v1/dashboard",
    "داشبورد متناسب با کاربر",
    ["Task", "Listing", "Deal", "Commission"],
    ["management_scope_id", "from", "to"],
  ),
  tasks: read(
    "/api/v1/tasks",
    "وظایف امروز، عقب‌افتاده و آینده",
    ["Task"],
    ["assigned_to_id", "due_from", "due_to", "status"],
  ),
  completeTask: command(
    "/api/v1/tasks/{id}/complete",
    "تکمیل وظیفه عمومی",
    ["Task", "ActivityLog"],
    "صاحب وظیفه یا مدیر حوزه",
    {},
    [
      "ثبت completed_at و تاریخچه؛ وظیفه وابسته به بازدید یا پیگیری فقط از مسیر ثبت نتیجه همان رویداد بسته شود.",
    ],
    "completeTask",
  ),
  scopes: read(
    "/api/v1/management-scopes",
    "رنج‌ها با اعضای جاری و سابق و آمار",
    ["ManagementScope", "ScopeMembership"],
    ["is_active"],
  ),
  scopeDetails: read(
    "/api/v1/management-scopes/{id}",
    "پرونده‌ها، فایل‌ها و آمار یک رنج",
    [
      "ManagementScope",
      "ScopeMembership",
      "PropertyRegistrationRequest",
      "Property",
      "Listing",
    ],
    ["include=members,requests,listings,statistics"],
  ),
  createScope: command(
    "/api/v1/management-scopes",
    "تعریف رنج",
    ["ManagementScope"],
    "مدیر کل",
    {
      name: "رنج شمال",
      code: "NORTH",
      description: "حوزه فعالیت",
      is_active: true,
    },
    ["code یکتا؛ created_by از کاربر نشست گرفته شود."],
    null,
  ),
  changeMembership: command(
    "/api/v1/scope-memberships/transfer",
    "تغییر عضویت کارمند",
    ["ScopeMembership", "ActivityLog"],
    "مدیر کل یا مدیر مجاز حوزه",
    {
      user_id: "user-uuid",
      scope_id: "scope-uuid",
      membership_role: "CONSULTANT",
      reason: "تغییر تیم",
    },
    [
      "عضویت فعال قبلی بسته و عضویت جدید ایجاد شود؛ سابقه حذف نشود.",
      "پرونده‌های کارمند خودکار منتقل نشوند؛ نقش گروه با نقش عضویت یکی نیست.",
    ],
    "changeMembership",
  ),
  users: read("/api/v1/users", "کاربران و پروفایل کارکنان", [
    "User",
    "Group",
    "StaffProfile",
    "ScopeMembership",
  ]),
  createUser: command(
    "/api/v1/users",
    "ثبت کارمند و گروه‌ها",
    ["User", "StaffProfile", "UserGroup"],
    "مدیر کل",
    {
      username: "consultant",
      group_ids: ["group-uuid"],
      staff_profile: { full_name: "نام کارمند", mobile: "09120000000" },
    },
    [
      "User، StaffProfile و سطرهای عضویت گروه در یک تراکنش ساخته شوند.",
      "فیلد role موازی روی User ساخته نشود.",
    ],
    null,
  ),
  userGroups: command(
    "/api/v1/users/{id}/groups",
    "تغییر گروه‌های دسترسی",
    ["User", "Group", "UserGroup"],
    "مدیر کل",
    { group_ids: ["group-uuid"] },
    [
      "مجوز گروه‌ها بررسی و سابقه ثبت شود؛ تغییر گروه، عضویت رنج را تغییر ندهد.",
    ],
    null,
    "PUT",
  ),
  contacts: read(
    "/api/v1/contacts",
    "اشخاص مجاز و جست‌وجوی شماره",
    ["Contact", "ContactPhone"],
    ["search", "phone", "archived", "page"],
  ),
  contactDetails: read(
    "/api/v1/contacts/{id}",
    "پرونده شخص با ارتباط‌های مجاز",
    [
      "Contact",
      "ContactPhone",
      "PropertyContact",
      "Inquiry",
      "Introduction",
      "Deal",
      "Contract",
      "FollowUp",
    ],
    [
      "include=phones,properties,inquiries,introductions,viewings,deals,contracts,followups",
    ],
  ),
  createContact: command(
    "/api/v1/contacts",
    "ثبت هویت و شماره تماس",
    ["Contact", "ContactPhone"],
    "مدیر رنج، مشاور یا کاربر مجاز",
    {
      person_type: "INDIVIDUAL",
      first_name: "علی",
      last_name: "احمدی",
      phone_number: "09120000000",
    },
    [
      "شماره فارسی/بین‌المللی نرمال شود؛ تطابق شماره هشدار تکراری بسازد و اشخاص خودکار ادغام نشوند.",
      "Contact نقش ثابت مالک یا خریدار ندارد؛ نقش از روابط خوانده شود.",
    ],
    "createContact",
  ),
  editContact: command(
    "/api/v1/contacts/{id}",
    "اصلاح اطلاعات هویت",
    ["Contact", "ContactPhone"],
    "کاربر مجاز پرونده",
    { first_name: "علی", last_name: "احمدی" },
    ["تغییر هویت جاری، identity_snapshot قراردادهای قبلی را بازنویسی نکند."],
    null,
    "PATCH",
  ),
  requests: read(
    "/api/v1/registration-requests",
    "فهرست و داده مشترک کاریز درخواست ملک",
    ["PropertyRegistrationRequest"],
    operational,
  ),
  requestDetails: read(
    "/api/v1/registration-requests/{id}",
    "فضای کاری یکپارچه درخواست، ملک و عرضه",
    ["PropertyRegistrationRequest", "Property", "PropertyAppraisal", "Listing"],
    ["include=contact,assignment,property,appraisal,listings,timeline"],
  ),
  createRegistrationRequest: command(
    "/api/v1/registration-requests",
    "ثبت حداقلی درخواست ملک",
    ["PropertyRegistrationRequest"],
    "مدیر رنج در حوزه خود",
    {
      contact_id: null,
      initial_contact_name: "نام معرف",
      initial_contact_phone: "09120000000",
      management_scope_id: "scope-uuid",
      district_id: "district-uuid",
      requested_deal_type_ids: ["deal-type-uuid"],
      description: "اطلاعات اولیه",
    },
    [
      "حداقل یک راه تماس معتبر لازم است؛ قیمت و مشخصات کامل ملک در شروع الزامی نشوند.",
      "وضعیت NEW؛ ارجاع مسئول یک فرمان جداست.",
    ],
    "createRegistrationRequest",
  ),
  assignRegistrationRequest: command(
    "/api/v1/registration-requests/{id}/assign",
    "ارجاع درخواست و تعیین موعد",
    [
      "PropertyRegistrationRequest",
      "AssignmentHistory",
      "Task",
      "Notification",
      "StageTransitionHistory",
    ],
    "مدیر رنج مجاز",
    {
      assigned_to_id: "agent-uuid",
      due_at: "2030-01-01T10:00:00+03:30",
      reason: "کارشناسی اولیه",
    },
    [
      "مشاور عضو فعال رنج مقصد باشد؛ درخواست ASSIGNED شود.",
      "وظیفه با موعد همان درخواست، اعلان و سابقه ارجاع ساخته شوند؛ وظیفه قدیمی در تغییر مسئول لغو شود.",
    ],
    "assignRegistrationRequest",
  ),
  startAppraisal: command(
    "/api/v1/registration-requests/{id}/appraisal/start",
    "شروع تماس و کارشناسی",
    [
      "PropertyRegistrationRequest",
      "PropertyAppraisal",
      "StageTransitionHistory",
    ],
    "مشاور مسئول یا مدیر حوزه",
    {},
    [
      "درخواست ASSIGNED یا CHANGES_REQUIRED به IN_PROGRESS برود؛ رکورد کارشناسی یکتا ایجاد/بازیابی شود.",
    ],
    "startAppraisal",
  ),
  saveWorkspace: command(
    "/api/v1/registration-requests/{id}/workspace",
    "ذخیره هم‌زمان کارشناسی، مشخصات ملک و شرایط عرضه",
    [
      "PropertyRegistrationRequest",
      "Property",
      "PropertyContact",
      "PropertyAppraisal",
      "Listing",
      "DealTypeVersion",
    ],
    "فقط کارشناس مسئول پذیرفته‌شده؛ عنوان ملک با عملیات مدیریتی جداگانه",
    {
      property: {
        area: 110,
        rooms: 2,
        district_id: "district-uuid",
        address: "نشانی",
        attribute_values: { parking: true },
      },
      appraisal: { findings: "گزارش بازدید و بررسی ملک" },
      listing: {
        deal_type_id: "deal-type-uuid",
        sale_price: 8500000000,
        additional_terms: {},
      },
    },
    [
      "در اولین ذخیره Property و ارتباط مالک ایجاد، resulting_property_id پر و Listing متصل ساخته شود.",
      "مبلغ پیشنهادی فقط روی Listing ثبت شود؛ گزارش بازدید فیلد قیمت ندارد.",
      "نسخه ملک و فایل افزایش یابد؛ تغییر پس از ارسال، تأیید قدیمی را نامعتبر کند.",
    ],
    "saveWorkspace",
    "PUT",
  ),
  submitListingForReview: command(
    "/api/v1/listings/{id}/submit-review",
    "ارسال نسخه مشخص برای بررسی مدیر",
    [
      "Listing",
      "ListingReview",
      "Property",
      "PropertyRegistrationRequest",
      "Notification",
    ],
    "مشاور مسئول یا مدیر حوزه",
    {},
    [
      "الزامات نوع معامله و تکمیل ملک/کارشناسی کنترل شود.",
      "snapshot ملک و شرایط عرضه با هر دو version ذخیره شود؛ Listing=PENDING و درخواست=PENDING_REVIEW؛ اعلان مدیر.",
    ],
    "submitListingForReview",
  ),
  reviews: read(
    "/api/v1/listing-reviews",
    "صف بررسی حوزه مدیر",
    ["ListingReview", "Listing", "Property"],
    ["management_scope_id", "decision=PENDING", "assigned_to_id"],
  ),
  approveListing: command(
    "/api/v1/listings/{id}/approve",
    "تأیید نسخه بررسی‌شده",
    [
      "Listing",
      "ListingReview",
      "PropertyRegistrationRequest",
      "StageTransitionHistory",
    ],
    "مدیر رنج همان حوزه",
    { review_id: "review-uuid", submitted_version: 3, property_version: 2 },
    [
      "نسخه فعلی ملک و فایل باید با snapshot ارسال‌شده یکسان باشند؛ تأیید قدیمی 409 بدهد.",
      "review=APPROVED، Listing=ACTIVE، درخواست=COMPLETED؛ تاریخچه و اعلان هماهنگ.",
    ],
    "approveListing",
  ),
  requestListingChanges: command(
    "/api/v1/listings/{id}/request-changes",
    "برگشت برای اصلاح با دلیل",
    ["Listing", "ListingReview", "PropertyRegistrationRequest", "Notification"],
    "مدیر رنج همان حوزه",
    { reason: "تکمیل مدارک مالکیت" },
    ["دلیل الزامی؛ فایل و درخواست CHANGES_REQUIRED و مسئول مطلع شود."],
    "requestListingChanges",
  ),
  transferScope: command(
    "/api/v1/scope-transfers",
    "انتقال پرونده به رنج جدید",
    [
      "ScopeTransferHistory",
      "AssignmentHistory",
      "PropertyRegistrationRequest",
      "Property",
      "Listing",
      "Inquiry",
      "Task",
    ],
    "مدیر کل یا مدیر مجاز انتقال",
    {
      subject_type: "registration_request",
      subject_id: "request-uuid",
      to_scope_id: "scope-uuid",
      assigned_to_id: null,
      reason: "تغییر حوزه",
    },
    [
      "دقیقاً یک موضوع انتقال؛ انتخاب مشاور معتبر مقصد یا صف ارجاع الزامی است.",
      "درخواست تبدیل‌شده، ملک و فایل‌های وابسته یک حوزه مشترک دارند؛ هم‌زمان منتقل شوند.",
      "عضویت کارمند تغییر نکند؛ سوابق انتقال و تغییر مسئول append-only و مرتبط با operation_id باشند.",
    ],
    "transferScope",
  ),
  changeAssignee: command(
    "/api/v1/assignments",
    "تغییر مشاور بدون انتقال رنج",
    ["AssignmentHistory", "Task", "Notification"],
    "مدیر حوزه",
    {
      subject_type: "registration_request",
      subject_id: "request-uuid",
      assigned_to_id: "agent-uuid",
      reason: "توزیع کار",
    },
    [
      "رنج ثابت بماند؛ مسئول عضو همان رنج باشد؛ وظیفه قبلی لغو و وظیفه جدید ایجاد شود.",
    ],
    "changeAssignee",
  ),
  properties: read(
    "/api/v1/properties",
    "املاک و مشخصات دارایی",
    ["Property", "PropertyContact"],
    [
      "management_scope_id",
      "consultant_id",
      "district_id",
      "property_type_id",
      "search",
    ],
  ),
  propertyDetails: read(
    "/api/v1/properties/{id}",
    "مشخصات، مالکان و عرضه‌های مجاز ملک",
    ["Property", "PropertyContact", "Contact", "Listing", "PropertyAppraisal"],
  ),
  listings: read(
    "/api/v1/listings",
    "فایل‌های عرضه خصوصی و کارت عمومی فایل فعال",
    ["Listing", "Property", "DealTypeVersion"],
    [
      "management_scope_id",
      "deal_type_id",
      "district_id",
      "status",
      "review_status",
      "visibility=public",
    ],
  ),
  listingDetails: read(
    "/api/v1/listings/{id}",
    "شرایط عرضه و نسخه معتبر فایل",
    ["Listing", "Property", "ListingReview", "DealTypeVersion"],
  ),
  setListingStatus: command(
    "/api/v1/listings/{id}/status",
    "توقف یا فعال‌سازی عرضه تأییدشده",
    ["Listing", "StageTransitionHistory"],
    "مدیر حوزه",
    { status: "PAUSED", reason: "درخواست مالک" },
    [
      "فعال‌سازی نیازمند APPROVED است؛ فایل بسته با قرارداد قطعی از این مسیر باز نشود.",
    ],
    "setListingStatus",
  ),
  inquiries: read(
    "/api/v1/inquiries",
    "فهرست و کاریز نیاز مشتری",
    ["Inquiry", "InquiryDealPreference", "InquiryAttributeCriterion"],
    operational,
  ),
  inquiryDetails: read(
    "/api/v1/inquiries/{id}",
    "نیاز، بودجه مستقل انواع و معرفی‌ها",
    [
      "Inquiry",
      "InquiryDealPreference",
      "InquiryAttributeCriterion",
      "Introduction",
    ],
  ),
  createInquiry: command(
    "/api/v1/inquiries",
    "ثبت نیاز مستقل متقاضی",
    ["Inquiry", "InquiryDealPreference", "InquiryAttributeCriterion"],
    "مشاور یا مدیر حوزه",
    {
      contact_id: "contact-uuid",
      management_scope_id: "scope-uuid",
      assigned_to_id: "agent-uuid",
      district_ids: ["district-uuid"],
      min_area: 90,
      max_area: 130,
      preferences: [{ deal_type_id: "sale-uuid", max_sale_price: 9000000000 }],
      criteria: [
        {
          attribute_code: "parking",
          operator: "EQ",
          value: true,
          is_required: true,
        },
      ],
      next_action: "معرفی فایل",
      next_action_at: "2030-01-01T10:00:00+03:30",
    },
    [
      "هر شخص چند نیاز مستقل؛ ترجیح هر نوع معامله بودجه مستقل دارد.",
      "روابط و بازه‌ها اعتبارسنجی شوند؛ شروط ضروری در تطبیق اعمال شوند.",
    ],
    "createInquiry",
  ),
  updateInquiry: command(
    "/api/v1/inquiries/{id}",
    "تغییر وضعیت یا اقدام بعدی نیاز مشتری",
    ["Inquiry", "StageTransitionHistory"],
    "مسئول یا مدیر حوزه",
    {
      status: "MATCHING",
      next_action: "بررسی فایل‌ها",
      next_action_at: "2030-01-01T10:00:00+03:30",
    },
    [
      "بستن نیاز دلیل بخواهد؛ مرحله و اقدام بعدی از همان منبع کاریز تغییر کنند.",
    ],
    "updateInquiry",
    "PATCH",
  ),
  matches: read(
    "/api/v1/inquiries/{id}/matches",
    "تطبیق با دلیل سازگاری و عدم سازگاری",
    [
      "Inquiry",
      "InquiryDealPreference",
      "InquiryAttributeCriterion",
      "Listing",
      "Property",
    ],
    ["compatible_only", "deal_type_id", "page"],
  ),
  introductions: read(
    "/api/v1/introductions",
    "معرفی‌های صریح مشتری",
    ["Introduction", "Inquiry", "Listing"],
    ["inquiry_id", "listing_id", "status", "assigned_to_id"],
  ),
  introduceListing: command(
    "/api/v1/introductions",
    "معرفی صریح فایل",
    ["Introduction", "Inquiry", "Listing", "ActivityLog"],
    "مسئول نیاز یا مدیر حوزه",
    {
      inquiry_id: "inquiry-uuid",
      listing_id: "listing-uuid",
      channel: "IN_PERSON",
    },
    [
      "فایل باید فعال و تأییدشده باشد؛ جست‌وجو معرفی ایجاد نکند.",
      "introduced_terms_snapshot از نسخه و شرایط همان لحظه ثبت شود.",
    ],
    "introduceListing",
  ),
  updateIntroduction: command(
    "/api/v1/introductions/{id}",
    "علاقه، رد و بازخورد مشتری",
    ["Introduction"],
    "مسئول نیاز یا مدیر حوزه",
    {
      status: "REJECTED",
      rejection_reason: "عدم تناسب بودجه",
      feedback: "نظر مشتری",
    },
    ["رد، دلیل بخواهد؛ سابقه معرفی و snapshot حفظ شود."],
    "updateIntroduction",
    "PATCH",
  ),
  viewings: read(
    "/api/v1/viewings",
    "تقویم و فهرست بازدید مشتری",
    ["Viewing", "Introduction", "Inquiry"],
    ["from", "to", "consultant_id", "management_scope_id", "status"],
  ),
  scheduleViewing: command(
    "/api/v1/viewings",
    "برنامه‌ریزی بازدید مشتری",
    ["Viewing", "Introduction", "Task", "Notification"],
    "مشاور مجاز یا مدیر حوزه",
    {
      introduction_id: "introduction-uuid",
      consultant_id: "agent-uuid",
      scheduled_at: "2030-01-01T10:00:00+03:30",
    },
    [
      "Viewing با کارشناسی ملک فرق دارد؛ به Introduction وصل است.",
      "وظیفه با همان موعد ساخته شود؛ معرفی VIEWING_SCHEDULED شود؛ درخواست تکراری بازدید فعال مضاعف نسازد.",
    ],
    "scheduleViewing",
  ),
  completeViewing: command(
    "/api/v1/viewings/{id}/complete",
    "ثبت نتیجه بازدید",
    ["Viewing", "Introduction", "Task", "StageTransitionHistory"],
    "مشاور مجاز",
    { outcome: "مناسب برای مذاکره", customer_feedback: "نظر مشتری" },
    ["نتیجه الزامی؛ Viewing=COMPLETED، معرفی=VIEWED و وظیفه مرتبط تکمیل شود."],
    "completeViewing",
  ),
  followups: read(
    "/api/v1/followups",
    "پیگیری‌های شخص و پرونده",
    ["FollowUp", "FollowUpRescheduleHistory"],
    ["contact_id", "consultant_id", "status", "from", "to"],
  ),
  createFollowUp: command(
    "/api/v1/followups",
    "ثبت پیگیری آینده",
    ["FollowUp", "Task", "Notification"],
    "کاربر مجاز موضوع",
    {
      contact_id: "contact-uuid",
      subject_type: "inquiry",
      subject_id: "inquiry-uuid",
      consultant_id: "agent-uuid",
      scheduled_at: "2030-01-01T10:00:00+03:30",
      notes: "تماس با مشتری",
    },
    ["موضوع موجود و مجاز؛ وظیفه با موعد برابر scheduled_at ساخته شود."],
    "createFollowUp",
  ),
  rescheduleFollowUp: command(
    "/api/v1/followups/{id}/reschedule",
    "تعویق همراه تاریخچه",
    ["FollowUp", "FollowUpRescheduleHistory", "Task"],
    "مسئول یا مدیر حوزه",
    { scheduled_at: "2030-01-02T10:00:00+03:30", reason: "درخواست مشتری" },
    ["زمان قبل و بعد و دلیل ثبت شود؛ موعد وظیفه مرتبط هماهنگ بماند."],
    "rescheduleFollowUp",
  ),
  completeFollowUp: command(
    "/api/v1/followups/{id}/complete",
    "ثبت نتیجه و اقدام بعدی",
    ["FollowUp", "Task", "StageTransitionHistory"],
    "مسئول یا مدیر حوزه",
    {
      outcome: "تماس انجام شد",
      next_action: "ارسال مدارک",
      next_action_at: "2030-01-02T10:00:00+03:30",
    },
    [
      "نتیجه الزامی؛ اقدام بعدی و موعد با هم اعتبارسنجی شوند؛ وظیفه مرتبط تکمیل شود.",
    ],
    "completeFollowUp",
  ),
  deals: read(
    "/api/v1/deals",
    "فهرست و کاریز مذاکره",
    ["Deal", "DealParticipant", "Offer"],
    operational,
  ),
  dealDetails: read("/api/v1/deals/{id}", "پیشنهادها، طرفین و قرارداد مذاکره", [
    "Deal",
    "DealParticipant",
    "Offer",
    "Contract",
  ]),
  createDeal: command(
    "/api/v1/deals",
    "ایجاد پرونده مذاکره مستقل",
    ["Deal", "DealParticipant", "Introduction"],
    "مسئول نیاز یا مدیر حوزه",
    { introduction_id: "introduction-uuid" },
    [
      "معرفی قبلی لازم است؛ هر فایل چند مذاکره مستقل دارد.",
      "listing/inquiry/نسخه معامله و طرفین مرتبط تثبیت شوند.",
    ],
    "createDeal",
  ),
  submitOffer: command(
    "/api/v1/deals/{id}/offers",
    "ثبت پیشنهاد جدید یا اصلاح‌شده",
    ["Offer", "Deal"],
    "مسئول مذاکره",
    {
      offered_by_contact_id: "contact-uuid",
      sale_price: 8400000000,
      deposit: 0,
      monthly_rent: 0,
      terms: "شرایط توافقی",
      valid_until: "2030-01-03T10:00:00+03:30",
      previous_offer_id: null,
    },
    [
      "پیشنهاد قبلی بازنویسی نشود؛ previous_offer_id زنجیره را نگه دارد.",
      "قواعد مالی همان نوع و نسخه اعمال و مرحله OFFERED شود.",
    ],
    "submitOffer",
  ),
  acceptOffer: command(
    "/api/v1/offers/{id}/accept",
    "پذیرش پیشنهاد معتبر",
    ["Offer", "Deal"],
    "مسئول مذاکره یا مدیر",
    {},
    [
      "پیشنهاد متعلق به همان پرونده باشد؛ accepted_offer_id ثبت و Deal=AGREED شود.",
      "پذیرش به‌تنهایی ملک یا فایل را فروخته‌شده نکند.",
    ],
    "acceptOffer",
  ),
  closeDeal: command(
    "/api/v1/deals/{id}/close",
    "پایان ناموفق مذاکره",
    ["Deal", "StageTransitionHistory"],
    "مسئول یا مدیر حوزه",
    { reason: "عدم توافق طرفین" },
    [
      "دلیل الزامی؛ LOST و closed_at ثبت شود؛ مذاکره دارای قرارداد از این مسیر بسته نشود.",
    ],
    "closeDeal",
  ),
  contracts: read(
    "/api/v1/contracts",
    "قراردادهای مجاز",
    ["Contract", "ContractParty", "ContractSignature"],
    ["status", "deal_id", "management_scope_id"],
  ),
  contractDetails: read(
    "/api/v1/contracts/{id}",
    "طرفین، امضاها و پیوست و اصلاحیه",
    [
      "Contract",
      "ContractParty",
      "ContractSignature",
      "ContractAttachment",
      "ContractAmendment",
    ],
  ),
  createContract: command(
    "/api/v1/deals/{id}/contract",
    "ساخت قرارداد از توافق پذیرفته‌شده",
    ["Contract", "ContractParty", "Offer", "Deal"],
    "مسئول قرارداد یا مدیر دارای مجوز",
    {},
    [
      "accepted_offer و نسخه‌ها سازگار باشند؛ طرفین و هویت و شرایط در snapshot قرارداد ثبت شوند.",
      "برای یک مذاکره قرارداد تکراری ساخته نشود.",
    ],
    "createContract",
  ),
  signContract: command(
    "/api/v1/contracts/{id}/signatures",
    "ثبت امضای نمایشی طرف قرارداد",
    ["ContractSignature", "ContractParty", "Contract"],
    "مسئول قرارداد یا مدیر دارای مجوز",
    { contract_party_id: "party-uuid" },
    [
      "قواعد نوع معامله و زنجیره پیشنهاد کنترل شوند؛ امضای یک طرف دوبار ثبت نشود.",
      "با امضای همه طرفین وضعیت SIGNED شود؛ این ثبت جای امضای حقوقی واقعی نیست.",
    ],
    "signContract",
  ),
  addContractAttachment: command(
    "/api/v1/contracts/{id}/attachments",
    "ثبت مدرک قرارداد",
    ["ContractAttachment"],
    "مسئول قرارداد",
    { document_type: "IDENTITY", filename: "identity.pdf" },
    [
      "نمونه فقط نام فایل را محلی نگه می‌دارد؛ در محصول واقعی ذخیره فایل امن و دسترسی کنترل‌شده مستقل طراحی شود.",
      "قرارداد قطعی از ویرایش عادی محافظت شود.",
    ],
    "addContractAttachment",
  ),
  finalizeContract: command(
    "/api/v1/contracts/{id}/finalize",
    "قطعی‌سازی تراکنشی قرارداد",
    [
      "Contract",
      "ContractSignature",
      "Deal",
      "Listing",
      "Inquiry",
      "Notification",
    ],
    "مسئول قرارداد یا مدیر دارای مجوز",
    {},
    [
      "امضای همه طرف‌ها، قواعد snapshot و نبود قرارداد ناسازگار همان ملک بررسی شوند.",
      "ردیف‌های ملک/فایل مرتبط قفل شوند؛ فقط یک عملیات قطعی موفق شود.",
      "قرارداد FINALIZED، مذاکره FINALIZED، فایل‌ها در خانواده ناسازگار CLOSED و نیاز COMPLETED شوند؛ مالی اعلان بگیرد.",
      "ساخت کمیسیون در این نمونه فرمان جدا و مجاز مالی است؛ تکرار نهایی‌سازی اثر مالی مضاعف نسازد.",
    ],
    "finalizeContract",
  ),
  createAmendment: command(
    "/api/v1/contracts/{id}/amendments",
    "اصلاحیه مستقل قرارداد قطعی",
    ["ContractAmendment", "Contract"],
    "مسئول قرارداد یا مدیر مجاز",
    {
      reason: "اصلاح شرایط",
      new_terms_snapshot: { note: "شرایط جدید نمایشی" },
      effective_at: "2030-01-02T00:00:00+03:30",
    },
    [
      "قرارداد اصلی بازنویسی نشود؛ snapshot قبل و بعد، شماره اصلاحیه و تأییدکننده ذخیره شوند.",
    ],
    "createAmendment",
  ),
  commissions: read(
    "/api/v1/commissions",
    "مطالبات و مانده وصول",
    ["Commission", "CommissionShare", "PaymentAllocation", "Payment"],
    ["contract_id", "debtor_contact_id", "status"],
  ),
  approveCommission: command(
    "/api/v1/contracts/{id}/commission",
    "تصویب کمیسیون و سهم‌ها",
    ["Commission", "CommissionPolicyVersion", "CommissionShare"],
    "مالی",
    {
      policy_version_id: "policy-uuid",
      adjustment_amount: 0,
      adjustment_reason: null,
      shares: [
        {
          beneficiary_type: "CONSULTANT",
          beneficiary_user_id: "agent-uuid",
          share_percent: 40,
        },
        {
          beneficiary_type: "OFFICE",
          beneficiary_user_id: null,
          share_percent: 60,
        },
      ],
    },
    [
      "فقط قرارداد قطعی؛ سیاست نمایشی نسخه‌دار با calculation_snapshot ثبت شود.",
      "تعدیل غیرصفر دلیل بخواهد؛ مجموع سهم‌ها از final_amount بیشتر نباشد؛ برای قرارداد دوباره کمیسیون تولید نشود.",
    ],
    "approveCommission",
  ),
  payments: read(
    "/api/v1/payments",
    "وجوه و تخصیص و برگشت",
    ["Payment", "PaymentAllocation"],
    ["direction", "contact_id", "user_id", "from", "to"],
  ),
  confirmPayment: command(
    "/api/v1/payments",
    "ثبت وجه تأییدشده و تخصیص",
    ["Payment", "PaymentAllocation", "Commission", "CommissionShare"],
    "مالی",
    {
      direction: "IN",
      contact_id: "contact-uuid",
      amount: 1000000,
      method: "TRANSFER",
      reference_number: "DEMO-001",
      allocations: [{ commission_id: "commission-uuid", amount: 1000000 }],
    },
    [
      "مبلغ مثبت؛ تخصیص کل ≤ وجه؛ تخصیص به هر مطالبه/سهم ≤ مانده آن.",
      "دریافت به Commission و پرداخت به CommissionShare وصل شود؛ پرداخت سهم از وصول مرتبط بیشتر نشود.",
      "برای OUT از user_id و commission_share_id استفاده شود؛ ردیف‌ها برای کنترل سقف در یک تراکنش قفل شوند.",
    ],
    "confirmPayment",
  ),
  reversePayment: command(
    "/api/v1/payments/{id}/reverse",
    "برگشت مرتبط وجه تأییدشده",
    ["Payment", "PaymentAllocation", "ActivityLog"],
    "مالی",
    { reason: "اصلاح ثبت وجه" },
    [
      "وجه تأییدشده حذف نشود؛ reversal_of_id یکتا و پرداخت معکوس ایجاد شود.",
      "اگر دریافت قبلاً خرج سهم شده، ابتدا پرداخت سهم مرتبط برگشت بخورد؛ مانده‌ها از وجوه مؤثر محاسبه شوند.",
    ],
    "reversePayment",
  ),
  reports: read(
    "/api/v1/reports/operations",
    "گزارش عملکرد، تبدیل و مالی مجاز",
    [
      "Task",
      "Listing",
      "Inquiry",
      "Introduction",
      "Viewing",
      "Deal",
      "Contract",
      "Commission",
      "PaymentAllocation",
    ],
    ["management_scope_id", "assigned_to_id", "deal_type_id", "from", "to"],
  ),
  notifications: read(
    "/api/v1/notifications",
    "اعلان‌های خود کاربر",
    ["Notification"],
    ["is_read", "page"],
  ),
  markNotificationRead: command(
    "/api/v1/notifications/{id}/read",
    "خوانده‌شدن اعلان",
    ["Notification"],
    "صاحب اعلان",
    {},
    ["تنها is_read اعلان همان کاربر تغییر کند."],
    "markNotificationRead",
  ),
  timeline: read(
    "/api/v1/timeline",
    "خط زمانی ترکیبیِ موضوع مجاز",
    [
      "ActivityLog",
      "AssignmentHistory",
      "ScopeTransferHistory",
      "StageTransitionHistory",
      "ListingReview",
      "FollowUpRescheduleHistory",
    ],
    ["subject_type", "subject_id", "cursor"],
  ),
  dealTypes: read(
    "/api/v1/deal-types",
    "انواع فعال و نسخه‌های تاریخی مجاز",
    ["DealType", "DealTypeVersion"],
    ["is_active", "include_versions"],
  ),
  createDealType: command(
    "/api/v1/deal-types",
    "تعریف نوع از شش رفتار پشتیبانی‌شده",
    ["DealType", "DealTypeVersion"],
    "مدیر کل یا مجوز اختصاصی مدیریت نوع",
    { code: "SALE_SPECIAL", name: "فروش ویژه", behavior_type: "SALE" },
    [
      "کد ثابت و یکتا؛ الگوی رفتار موجود کپی و نسخه اول منتشر شود؛ موتور کد یا فرمول آزاد نسازید.",
    ],
    "createDealType",
  ),
  publishDealTypeVersion: command(
    "/api/v1/deal-types/{id}/versions",
    "انتشار نسخه جدید شرایط",
    ["DealTypeVersion"],
    "مدیر کل یا مجوز اختصاصی انتشار",
    {
      field_definitions: [
        {
          code: "sale_price",
          name: "قیمت فروش",
          type: "number",
          required: true,
        },
      ],
      validation_rules: { required: ["sale_price"] },
    },
    [
      "ساختار فیلدها، نام‌های تکراری و قواعد متناقض رد شوند.",
      "نسخه منتشرشده append-only است؛ فایل و قرارداد قبلی روی نسخه خود بمانند.",
    ],
    "publishDealTypeVersion",
  ),
};

// Shapes needed by aggregate and matching screens are explicit, rather than generic lists.
apiCatalog.dashboard.response = {
  data: {
    active_listings: 8,
    open_requests: 6,
    open_deals: 3,
    overdue_tasks: 2,
    upcoming_tasks: [],
  },
};
apiCatalog.reports.response = {
  data: {
    filters: { management_scope_id: "scope-uuid" },
    counts: { introductions: 15, viewings: 8, contracts: 3 },
    financial: {
      approved_commission: 45000000,
      received: 20000000,
      receivable_balance: 25000000,
      consultant_share: 18000000,
      paid_share: 5000000,
    },
  },
};
apiCatalog.matches.response = {
  data: [
    {
      listing: {
        id: "listing-uuid",
        code: "L-1001",
        title: "آپارتمان",
        deal_type_id: "sale-uuid",
        sale_price: 8500000000,
      },
      compatible: true,
      reasons: [
        { code: "DEAL_TYPE", label: "نوع معامله", passed: true },
        { code: "BUDGET", label: "بودجه خرید", passed: true },
      ],
    },
  ],
  meta: { page: 1, page_size: 20, total: 1 },
};
for (const key of ["requests", "inquiries", "deals"]) {
  apiCatalog[key].filters.push("view=list|kanban");
  apiCatalog[key].response = {
    data: [
      {
        id: "record-uuid",
        code: "CASE-1001",
        title: "عنوان پرونده",
        contact_summary: { id: "contact-uuid", display_name: "نام شخص" },
        assignee: { id: "user-uuid", full_name: "نام مسئول" },
        scope: { id: "scope-uuid", name: "رنج شمال" },
        stage:
          key === "requests"
            ? "NEW"
            : key === "inquiries"
              ? "OPEN"
              : "NEGOTIATION",
        due_at: "2030-01-01T10:00:00+03:30",
        next_action: "اقدام لازم",
        stage_entered_at: "2030-01-01T08:00:00+03:30",
        missing_fields: [],
        warnings: [],
        version: 1,
        allowed_transitions: [],
      },
    ],
    meta: { page: 1, page_size: 20, total: 1, stage_counts: {} },
  };
}

apiCatalog.createRegistrationRequest.models.push("RegistrationRequestDealType");
apiCatalog.createInquiry.models.push("InquiryDistrict", "InquiryPropertyType");

// Current Sample operations; /api/v1 paths remain proposed, not deployed routes.
Object.assign(apiCatalog, {
 submitPropertyForReview: command("/api/v1/properties/{id}/submit-review", "ارسال ملک و کارشناسی برای بررسی", ["Property","PropertyAppraisal","PropertyReview","PropertyRegistrationRequest","Task","Notification"], "فقط مسئول فعلی پس از پذیرش ارجاع", {}, ["آدرس، منطقه، متراژ مثبت و گزارش کامل لازم‌اند؛ نسخه و snapshot ملک و گزارش ثبت شوند؛ درخواست PENDING_REVIEW؛ وظیفه و اعلان مدیر."], "submitPropertyForReview"),
 reviewProperty: command("/api/v1/properties/{id}/review", "تأیید ملک یا برگشت با دلیل", ["Property","PropertyReview","PropertyRegistrationRequest","Task","Notification"], "مدیر رنج همان حوزه یا مدیر کل", {decision:"APPROVED | CHANGES_REQUIRED",reason:"برای برگشت الزامی"}, ["فقط ملک PENDING با نسخه ارسال‌شده معتبر؛ برای تأیید عنوان لازم است.","تکمیل وظایف بررسی؛ ثبت تصمیم و اعلان؛ تأیید درخواست را COMPLETED می‌کند، بدون ساخت یا فعال‌سازی خودکار فایل."], "reviewProperty"),
 savePropertyListing: command("/api/v1/properties/{id}/listings", "ساخت یا ویرایش فایل نوع معامله", ["Property","Listing","DealType","DealTypeVersion"], "مشاور مسئول فعلی یا مدیر کل؛ ملک تأییدشده و دارای مسئول فعال", {property_id:"uuid",deal_type_id:"uuid",sale_price:0,deposit:0,monthly_rent:0,additional_terms:{},status:"ACTIVE | PAUSED"}, ["نوع فعال، نسخه منتشرشده و شرایط معتبر؛ زوج ملک و نوع یکتا؛ فایل پایان‌یافته ویرایش نشود.","فقط همان فایل تغییر کند؛ نسخه، snapshot و سابقه شرایط قبلی حفظ شوند؛ این فرم تأیید مستقل فایل ندارد."], "savePropertyListing", "PUT"),
 succeedDeal: command("/api/v1/deals/{id}/succeed", "ثبت نتیجه موفق مذاکره", ["Deal","Task"], "مسئول مجاز مذاکره", {}, ["فقط NEGOTIATION یا OFFERED به AGREED؛ ثبت عامل و زمان موفقیت و وظیفه آماده‌سازی قرارداد؛ مبلغ در قرارداد تعیین شود."], "succeedDeal"),
 saveContractTerms: command("/api/v1/contracts/{id}/terms", "ویرایش شرایط قرارداد پیش از امضا", ["Contract","Deal","Listing","ContractSignature"], "مسئول قرارداد یا نقش مجاز در حوزه", {sale_price:0,deposit:0,monthly_rent:0,additional_terms:{}}, ["قرارداد پیش‌نویس یا در انتظار امضا؛ با وجود هر امضای ثبت‌شده تغییر شرایط رد شود؛ اعتبارسنجی طبق نوع و نسخه قرارداد."], "saveContractTerms", "PUT"),
 publicListings: read("/api/v1/public-listings", "اکسپلور فایل‌های فعال با اطلاعات عمومی محدود", ["Listing","Property","DealTypeVersion"], ["search","deal_type_id","page","page_size"]),
 publicListingDetails: read("/api/v1/public-listings/{id}", "جزئیات عمومی فایل مشخص", ["Listing","Property","DealTypeVersion"]),
});
apiCatalog.reviews = read("/api/v1/property-reviews", "صف بررسی ملک‌های حوزه مدیر", ["PropertyReview","Property","PropertyAppraisal"], ["management_scope_id","decision=PENDING","assigned_to_id"]);
Object.assign(apiCatalog.saveWorkspace, {
 summary: "ذخیره کارشناسی و مشخصات ملک، بدون ایجاد فایل عرضه",
 models: ["PropertyRegistrationRequest","Property","PropertyContact","PropertyAppraisal"],
 request: {property:{area:110,rooms:2,district_id:"district-uuid",address:"نشانی",attribute_values:{parking:true}},appraisal:{findings:"گزارش بازدید و بررسی ملک"}},
 effects: ["ساخت یا تکمیل Property و رابطه مالک و گزارش؛ resulting_property_id حفظ شود؛ Listing ساخته نشود.","گزارش، وضعیت و موقعیت ملک را ثبت می‌کند؛ مبلغ پیشنهادی فقط در فایل عرضه ثبت شود؛ توضیح اختیاری درباره مبلغ در متن گزارش ممکن است. تغییر ملک نیازمند بررسی مجدد نسخه است."]
});
for (const key of ["submitListingForReview","approveListing","requestListingChanges"]) {
 const api = apiCatalog[key];
 api.summary = "سازگاری قدیمی: " + api.summary;
 api.effects = ["فرمان سازگاری با شناسه Listing به submitPropertyForReview یا reviewProperty روی ملک مرتبط هدایت می‌شود؛ برای محصول جدید از API ملک استفاده کنید؛ بررسی مستقل فایل وجود ندارد."];
}
for (const key of ["submitOffer","acceptOffer"]) {
 apiCatalog[key].summary = "غیرفعال در Sample فعلی؛ سابقه طراحی پیشنهاد قیمت";
 apiCatalog[key].effects = ["عملیات فعلی خطا می‌دهد؛ نتیجه مذاکره با succeedDeal/closeDeal و مبلغ توافق در قرارداد ثبت می‌شود. این endpoint معیار پیاده‌سازی مسیر جاری نیست."];
}
Object.assign(apiCatalog.createContract, {
 summary: "ساخت قرارداد از مذاکره موفق و شرایط توافق",
 request: {sale_price:0,deposit:0,monthly_rent:0,additional_terms:{}},
 effects: ["مذاکره AGREED و شرایط معتبر نوع معامله لازم‌اند؛ مبلغ در قرارداد ثبت شود و accepted_offer اجباری نیست.","طرفین، هویت، نوع و نسخه و شرایط در snapshot قرارداد ثبت شوند؛ برای یک مذاکره قرارداد تکراری ساخته نشود."]
});
apiCatalog.properties.effects.push("فهرست املاک من برای مشاور فقط ملک‌های تأییدشده تحت مسئولیت فعلی است؛ مدیر طبق حوزه دسترسی دارد.");
apiCatalog.listings.summary = "فایل‌های عرضه تحت مسئولیت فعلی؛ مستقل از اکسپلور عمومی";
for (const key of ["publicListings","publicListingDetails"]) {
 apiCatalog[key].permission = "کاربر دارای مجوز اکسپلور؛ فقط فایل فعال معتبر با ملک تأییدشده؛ دسترسی خواندن عمومی داخل سامانه، نه endpoint ناشناس اینترنت";
 apiCatalog[key].effects.push("projection محدود بدون نشانی خصوصی و هویت/شماره محرمانه مالک؛ بدون امکان ویرایش؛ listing_id دقیق در انتخاب‌ها حفظ شود.");
}
apiCatalog.setListingStatus.effects = ["فعال‌سازی به تأیید Property و شرایط معتبر فایل وابسته است؛ review_status فایل سازگاری قدیمی است؛ فایل بسته با قرارداد قطعی باز نشود."];
apiCatalog.createTask = command("/api/v1/tasks", "ثبت کار دستی روی پرونده باز", ["Task","Notification"], "کاربر مجاز موضوع؛ مسئول خود یا مشاور فعال مرتبط", {subject_type:"registration_request | inquiry | introduction | viewing | deal",subject_id:"uuid",title:"عنوان الزامی",due_at:"ISO",assigned_to_id:"uuid optional"}, ["موضوع مجاز و باز و ارجاع پذیرفته‌شده لازم‌اند؛ کار MANUAL و اعلان مسئول ساخته شوند."], "createTask");
apiCatalog.rescheduleTask = command("/api/v1/tasks/{id}/reschedule", "تعویق کار دستی باز", ["Task"], "کاربر مجاز همان وظیفه", {due_at:"ISO",reason:"دلیل الزامی"}, ["فقط کار MANUAL باز؛ موعد جدید بعد از زمان فعلی و موعد قبلی؛ سابقه قبلی/جدید و عامل حفظ شود."], "rescheduleTask");
apiCatalog.changePropertyCaseStatus = command('/api/v1/registration-requests/{id}/lifecycle', 'بستن، لغو، تکراری یا بازگشایی پرونده ملک', ['PropertyRegistrationRequest','Property','Listing','Task','FollowUp','Introduction','Viewing','Deal','Contract','StageTransitionHistory'], 'مدیر کل یا مدیر رنج همان پرونده با مجوز ثبت ملک', {status:'CLOSED | CANCELLED | DUPLICATE | REOPEN',reason:'دلیل الزامی',original_id:'برای تکراری الزامی',due_at:'ISO اختیاری برای بازگشایی'}, ['CLOSED پایان رسیدگی عملیاتی است؛ COMPLETED فقط تکمیل ثبت و کارشناسی است. دلیل، عامل، زمان و وضعیت قبل و بعد حفظ شوند.', 'قرارداد قطعی یا امضاشده تغییر از این مسیر را مسدود کند. فایل‌ها متوقف؛ کارها، پیگیری‌ها، معرفی‌ها و بازدیدهای باز لغو؛ مذاکرات باز ناموفق و قرارداد پیش‌نویس بدون امضا لغو شوند؛ اطلاعات حذف نشود.', 'متقاضی به خاطر بسته‌شدن یک ملک بسته نشود؛ وضعیت جست‌وجوی او بر اساس روابط باقی‌مانده تنظیم شود.', 'بازگشایی نیازمند سابقه بستن معتبر است؛ ملک برای بررسی مجدد برگردد و عرضه، قرارها و مذاکرات قبلی خودکار فعال نشوند.', 'در تکراری، اصل معتبر و مجاز و متفاوت لازم است؛ بستن پرونده دارای ملک مشترک با اصل از این مسیر رد شود. تمام آثار و تاریخچه و اعلان در یک تراکنش باشند.'], 'changePropertyCaseStatus');
for(const key of ['contracts','contractDetails','createContract','saveContractTerms','signContract','addContractAttachment','finalizeContract','createAmendment']){
 if(apiCatalog[key]){apiCatalog[key].permission='فقط مدیرکل فعال (GENERAL_MANAGER)';apiCatalog[key].effects.push('مجوز در فهرست، جزئیات، داده‌های وابسته و فرمان مستقیم کنترل شود؛ مخفی‌کردن دکمه کافی نیست.');}
}
apiCatalog.completeViewing.request={outcome:'گزارش بازدید',customer_feedback:'نظر متقاضی',interest:'INTERESTED | NOT_INTERESTED'};
apiCatalog.completeViewing.effects.push('interest در بازدید ثبت شود؛ NOT_INTERESTED شروع مذاکره از بازدید و معرفی را مسدود کند. بازدید قبلاً تعیین تکلیف‌شده بازنویسی نشود.');
apiCatalog.succeedDeal.request={notes:'توضیحات توافق'};
apiCatalog.succeedDeal.effects.push('result_notes نگهداری و کار CONTRACT_PREPARATION فقط برای مدیرکل‌های فعال ایجاد شود؛ قرارداد را خودکار ایجاد نکند.');
apiCatalog.createDeal.effects.push('در صورت وجود نتیجه منفی در آخرین بازدید تکمیل‌شده معرفی، شروع مذاکره رد شود؛ رابطه viewing_id و متقاضی و فایل دقیق حفظ شود.');
apiCatalog.saveInquiryNeeds=command('/api/v1/inquiries/{id}/needs','ذخیره نیاز و بودجه متقاضی',['Inquiry','InquiryDealPreference'],'مشاور مسئول پذیرفته‌شده یا مدیر مجاز رنج',{min_area:90,max_area:120,min_rooms:2,district_ids:[],notes:'اولویت‌ها',preferences:[{deal_type_id:'uuid',max_sale_price:9000000000,max_deposit:0,max_monthly_rent:0}]},['درخواست باز و ارجاع پذیرفته‌شده لازم است؛ نوع معامله فعال و غیرتکراری، مبالغ نامنفی و ترتیب متراژ کنترل شوند.','کل نیازها و بودجه‌ها اتمیک ذخیره شوند؛ معرفی و بازدید و مذاکره قبلی حذف نشوند. نیاز اولیه DRAFT پس از ذخیره CONFIRMED و زمان/عامل ثبت شود.','برای داده قدیمی بدون needs_status از وضعیت جاری و سابقه عملیات استفاده شود؛ مسیر پیشرفته به ابتدا برنگردد.'],'saveInquiryNeeds','PUT');
apiCatalog.changeInquiryCaseStatus=command('/api/v1/inquiries/{id}/lifecycle','بستن، لغو، تکراری و بازگشایی درخواست متقاضی',['Inquiry','InquiryDealPreference','Introduction','Viewing','Deal','Contract','Task','FollowUp'],'مدیرکل یا مدیر رنج همین درخواست',{status:'CLOSED | CANCELLED | DUPLICATE | REOPEN',reason:'دلیل',original_id:'پرونده اصلی در تکراری',due_at:'موعد اختیاری بازگشایی'},['قرارداد قطعی/امضاشده تغییر را مسدود کند؛ در حضور قرارداد باز فقط مدیرکل بتواند تعیین تکلیف کند.','فقط معرفی‌ها، بازدیدها، مذاکرات و کارها/پیگیری‌های همین درخواست بسته شوند؛ فایل عرضه ملک برای متقاضیان دیگر هرگز متوقف یا بایگانی نشود.','snapshot وضعیت و عامل/دلیل/زمان نگهداری شود؛ بازگشایی رویدادهای قبلی را زنده نکند و رسیدگی مجدد نیازمند مشاور فعال و موعد تازه باشد.'],'changeInquiryCaseStatus');
apiCatalog.introduceListing.effects.push('برای درخواست جدید با needs_status=DRAFT، معرفی فایل تا ذخیره نیاز و بودجه رد شود؛ سابقه قدیمی بدون این فیلد حفظ شود.');
apiCatalog.scheduleViewing.effects.push('بازدید جدید فقط برای فایل فعال با ملک تأییدشده ثبت شود؛ پس از ثبت زمان، فرم زمان بسته شود؛ نتیجه فقط با دکمه ردیف همان بازدید در سوابق باز شود و بازشدن خودکار نداشته باشد.');
apiCatalog.completeViewing.effects.push('تاریخ قرار شرط ثبت نتیجه نیست؛ حتی اگر scheduled_at در آینده باشد، کاربر مجاز می‌تواند نتیجه را همین حالا ثبت کند. performed_at زمان واقعی ثبت نتیجه است.');

apiCatalog.reviewConsultantWithdrawal=command('/api/v1/cases/{id}/withdrawal/decision','تأیید یا رد انصراف مشاور',['AssignmentHistory','AssignmentRescheduleHistory','Task','Notification'],'فقط مدیرکل یا مدیر رنج همان پرونده',{collection:'registrationRequests | inquiries',id:'uuid',request_id:'uuid',decision:'APPROVE | REJECT',reason:'دلیل الزامی'},['درخواست انصراف PENDING و متعلق به مشاور فعلی باشد. تا تصمیم مدیر، مسئول و پذیرش تغییر نکنند و ارجاع جدید مسدود باشد. تأیید، مسئول قبلی را آزاد و پرونده را آماده ارجاع مجدد کند؛ رد، مسئول قبلی را حفظ کند.'],'reviewConsultantWithdrawal');
apiCatalog.rejectAssignment.summary='درخواست انصراف مشاور با تأیید مدیر';
apiCatalog.rejectAssignment.effects=['مشاور مسئول در حالت PENDING یا ACCEPTED با دلیل، درخواست CONSULTANT_WITHDRAWAL در انتظار تصمیم بسازد؛ مسئولیت یا پذیرش فوراً تغییر نکند. درخواست در کارتابل تأیید مدیر نمایش داده شود.'];
