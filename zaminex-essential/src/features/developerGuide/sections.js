const section = (title, purpose, models, apis, checks, pipelines = []) => ({
  title,
  purpose,
  models,
  apis,
  checks,
  pipelines,
});
export const guideSections = {
  "lead-submit": section("ثبت سرنخ مشاور", "مشاور فقط در رنج خود ثبت می‌کند؛ پذیرش و ارجاع با مدیر است.", ["PropertyRegistrationRequest","Inquiry"], ["createLead"], ["ثبت مشاور برای مدیر رنج خودش وظیفه پذیرش بسازد؛ ثبت مدیر مسئول پذیرش جداگانه نمی‌خواهد."]),
  leads: section("سرنخ‌ها", "سرنخ ملک یا متقاضی پرونده ایجاد می‌کند؛ کاریز مشاور از شروع رسیدگی است؛ کاریز مدیر صف سرنخ و ارجاع را هم دارد.", ["Contact","PropertyRegistrationRequest","Inquiry","AssignmentHistory"], ["createLead","acceptLead","assignCase"], ["ساخت شخص و پرونده اتمیک باشد؛ مجوز گروه و رنج کنترل شود."]),
  inbox: section("کارتابل پذیرش", "پذیرش و رد ارجاع، تعیین تکلیف مدیر و درخواست تمدید مهلت با تأیید مدیر؛ ارجاع بی‌پاسخ پس از دو روز قابل تعویض است.", ["PropertyRegistrationRequest","Inquiry","AssignmentHistory","AssignmentRescheduleHistory"], ["assignCase","acceptAssignment","rejectAssignment","postponeAssignment","approveAssignmentExtension","rejectAssignmentExtension"], ["فقط مسئول فعلی بپذیرد؛ ثبت درخواست تمدید موعد را تغییر ندهد؛ رد ارجاع از صف کارشناس خارج شود؛ سابقه حفظ شود."]),
  groups: section("گروه‌ها و سطح دسترسی", "مجوز گروه مستقل از عضویت رنج است.", ["Group","User","ScopeMembership"], ["users"], ["مسیر مستقیم و منو تابع همان دسترسی باشند."]),
  dashboard: section(
    "نمای کلی",
    "تجمیع عملیاتی برای کاربر فعلی؛ آمار از همان داده‌های پرونده‌ها خوانده شود.",
    [
      "User",
      "Group",
      "StaffProfile",
      "ScopeMembership",
      "Task",
      "Listing",
      "Inquiry",
      "Deal",
      "Commission",
    ],
    ["dashboard", "reports"],
    [
      "شمارش رکوردهای خارج از حوزه در آمار افشا نشود.",
      "ارزش معامله، کمیسیون، وصول و سهم پرداختی جدا بمانند.",
    ],
    ["requests", "inquiries", "deals"],
  ),
  tasks: section(
    "کارهای من",
    "وظیفه با مسئول، موعد و دقیقاً یک موضوع معتبر.",
    ["Task", "FollowUp", "Viewing", "Notification", "StageTransitionHistory"],
    ["tasks", "completeTask", "completeFollowUp", "completeViewing"],
    [
      "موعد وظیفه پیگیری/بازدید با scheduled_at برابر باشد.",
      "ثبت نتیجه رویداد، وظیفه مرتبط را در همان تراکنش تکمیل کند؛ دکمه تکمیل عمومی نباید نتیجه را دور بزند.",
    ],
  ),
  teams: section(
    "رنج‌ها و اعضای تیم",
    "حوزه اختیار از عضویت جاری خوانده می‌شود؛ مجوز از گروه کاربر.",
    [
      "ManagementScope",
      "ScopeMembership",
      "StaffProfile",
      "ScopeTransferHistory",
      "AssignmentHistory",
      "PropertyRegistrationRequest",
      "Property",
      "Listing",
    ],
    [
      "scopes",
      "scopeDetails",
      "createScope",
      "changeMembership",
      "transferScope",
      "changeAssignee",
    ],
    [
      "هر مشاور در نمونه یک عضویت فعال داشته باشد؛ تاریخچه عضویت حذف نشود.",
      "تغییر عضویت کارمند، انتقال پرونده و تغییر مسئول سه فرمان مستقل‌اند.",
      "درخواست تبدیل‌شده، ملک و عرضه‌های وابسته هنگام انتقال حوزه هماهنگ بمانند.",
    ],
  ),
  staff: section(
    "کارکنان و گروه‌ها",
    "هویت ورود، اطلاعات کارمند و گروه‌های چندگانه از هم جدا باشند.",
    ["User", "Group", "UserGroup", "StaffProfile", "ScopeMembership"],
    ["users", "createUser", "userGroups", "changeMembership"],
    [
      "User فیلد role موازی نداشته باشد؛ permission_codes از مجموع گروه‌ها جمع شود.",
      "گروه اجازه عمل می‌دهد و عضویت رنج دامنه داده را تعیین می‌کند.",
    ],
  ),
  contacts: section(
    "اشخاص",
    "شخص هویت مشترک است و می‌تواند هم‌زمان مالک، متقاضی و طرف قرارداد باشد.",
    [
      "Contact",
      "ContactPhone",
      "PropertyContact",
      "Inquiry",
      "Introduction",
      "Viewing",
      "DealParticipant",
      "ContractParty",
      "FollowUp",
    ],
    ["contacts", "contactDetails", "createContact", "editContact"],
    [
      "شماره نرمال‌شده هشدار تکراری بدهد؛ ادغام خودکار ممنوع.",
      "اطلاعات خصوصی مالک در کارت عمومی فایل یا جست‌وجوی مشاور دیگر افشا نشود.",
      "مسئول قرارداد فقط اشخاص مرتبط با مذاکرات/قراردادهای مجاز خود را ببیند.",
    ],
  ),
  requests: section(
    "درخواست ملک و فضای کاری کارشناسی",
    "ثبت حداقلی و ارجاع، سپس تکمیل پیوسته ملک و عرضه بدون ثبت تکراری.",
    [
      "PropertyRegistrationRequest",
      "RegistrationRequestDealType",
      "Contact",
      "Property",
      "PropertyContact",
      "PropertyAppraisal",
      "Listing",
      "PropertyReview",
      "AssignmentHistory",
      "ScopeTransferHistory",
      "Task",
      "Notification",
    ],
    [
      "requests",
      "requestDetails",
      "createRegistrationRequest",
      "assignRegistrationRequest",
      "setPropertyTitle",
      "reopenAppraisal",
      "markDuplicateCase",
      "startAppraisal",
      "saveWorkspace",
      "submitListingForReview",
      "transferScope",
      "changeAssignee",
    ],
    [
      "ثبت اولیه بدون قیمت و ده‌ها فیلد ملک ممکن باشد.",
      "ساخت ملک و عرضه به همان درخواست وصل شود؛ قیمت عرضه و کارشناسی جدا باشند.",
      "واگذاری، وظیفه و اعلان و تاریخچه در یک تراکنش ثبت شوند.",
    ],
    ["requests"],
  ),
  reviews: section(
    "صف بررسی مدیر رنج",
    "مدیر مشخصات دارایی و شرایط عرضه همان نسخه ارسالی را کنار هم بررسی می‌کند.",
    [
      "PropertyReview",
      "Listing",
      "Property",
      "PropertyAppraisal",
      "PropertyRegistrationRequest",
      "Notification",
      "StageTransitionHistory",
    ],
    ["reviews", "requestDetails", "approveListing", "requestListingChanges"],
    [
      "تأیید پس از تغییر version ملک یا فایل رد شود؛ snapshot ارسال‌شده مبناست.",
      "برگشت دلیل الزامی دارد؛ تأیید معتبر، فایل فعال و درخواست تکمیل می‌کند.",
    ],
    ["requests"],
  ),
  properties: section(
    "املاک",
    "دارایی فیزیکی مستقل از شرایط فروش یا اجاره است.",
    [
      "Property",
      "PropertyContact",
      "Contact",
      "PropertyAppraisal",
      "Listing",
      "District",
      "PropertyType",
      "PropertyUsage",
    ],
    [
      "properties",
      "propertyDetails",
      "saveWorkspace",
      "transferScope",
      "changeAssignee",
    ],
    [
      "sale_price، deposit و monthly_rent روی Property ذخیره نشوند.",
      "مالکیت چندنفره از جدول واسط با سهم و مالک اصلی خوانده شود.",
      "شناسه رنج و مشاور با درخواست و عرضه هماهنگ بماند.",
    ],
  ),
  listings: section(
    "فایل‌های عرضه",
    "هر عرضه، یک ملک و یک نوع و نسخه مشخص و شرایط مالی دارد.",
    [
      "Listing",
      "Property",
      "PropertyReview",
      "DealType",
      "DealTypeVersion",
      "PropertyRegistrationRequest",
    ],
    [
      "listings",
      "listingDetails",
      "saveWorkspace",
      "submitListingForReview",
      "approveListing",
      "requestListingChanges",
      "setListingStatus",
    ],
    [
      "review_status با status عرضه دو مفهوم مستقل‌اند.",
      "کارت عمومی فقط برای ACTIVE + APPROVED و با serializer محدود باشد.",
      "شرایط معرفی‌شده و قراردادهای قبلی snapshot خود را حفظ کنند.",
    ],
  ),
  inquiries: section(
    "نیاز مشتری و تطبیق",
    "هر شخص چند نیاز مستقل؛ برای هر نوع معامله یک بودجه و معیار مجزا.",
    [
      "Inquiry",
      "InquiryDealPreference",
      "InquiryAttributeCriterion",
      "InquiryDistrict",
      "InquiryPropertyType",
      "Contact",
      "Listing",
      "Property",
      "Introduction",
      "Task",
    ],
    [
      "inquiries",
      "inquiryDetails",
      "createInquiry",
      "updateInquiry",
      "matches",
      "introduceListing",
      "createFollowUp",
      "transferScope",
    ],
    [
      "تطبیق نوع، منطقه، نوع ملک، متراژ، بودجه و شروط ضروری دلیل صریح داشته باشد.",
      "در GET تطبیق هیچ Introduction ساخته نشود؛ معرفی فرمان صریح است.",
    ],
    ["inquiries"],
  ),
  introductions: section(
    "معرفی‌ها",
    "رابط یک درخواست متقاضی با یک عرضه در یک لحظه مشخص.",
    ["Introduction", "Inquiry", "Listing", "Viewing", "Deal", "FollowUp"],
    [
      "introductions",
      "introduceListing",
      "updateIntroduction",
      "scheduleViewing",
      "createDeal",
      "createFollowUp",
    ],
    [
      "introduced_terms_snapshot ثبت شود تا تغییر بعدی قیمت، سابقه معرفی را عوض نکند.",
      "علاقه و رد با بازخورد ثبت شوند؛ رد دلیل داشته باشد.",
    ],
  ),
  viewings: section(
    "بازدیدها و تقویم",
    "بازدید مشتری به معرفی وصل است و کارشناسی اولیه ملک نیست.",
    ["Viewing", "Introduction", "Inquiry", "Task", "Notification"],
    ["viewings", "scheduleViewing", "completeViewing"],
    [
      "داده‌ها ISO و تقویم/ساعت رابط بر مبنای تهران باشد؛ API بازه زمانی و مسئول را فیلتر کند.",
      "موعد Task با Viewing برابر و ثبت نتیجه، وظیفه مرتبط را تکمیل کند.",
    ],
  ),
  followups: section(
    "پیگیری‌ها",
    "تماس یا اقدام برنامه‌ریزی‌شده درباره شخص و پرونده.",
    ["FollowUp", "FollowUpRescheduleHistory", "Task", "Contact", "ActivityLog"],
    ["followups", "createFollowUp", "rescheduleFollowUp", "completeFollowUp"],
    [
      "تعویق دلیل و زمان قبل/بعد داشته باشد؛ سابقه append-only بماند.",
      "اقدام بعدی و موعد آن با هم اعتبارسنجی و ذخیره شوند.",
    ],
  ),
  deals: section(
    "مذاکرات و پیشنهادها",
    "هر فایل چند مذاکره مستقل دارد؛ پیشنهادها زنجیره تاریخچه‌اند.",
    [
      "Deal",
      "DealParticipant",
      "Offer",
      "Listing",
      "Inquiry",
      "Introduction",
      "DealTypeVersion",
      "Contract",
    ],
    [
      "deals",
      "dealDetails",
      "createDeal",
      "submitOffer",
      "acceptOffer",
      "createContract",
      "closeDeal",
      "createFollowUp",
    ],
    [
      "Offer اصلاح‌شده رکورد جدید با previous_offer_id بسازد.",
      "پذیرش پیشنهاد فایل را قطعی نفروشد؛ قطعی‌سازی فقط از قرارداد معتبر انجام شود.",
    ],
    ["deals"],
  ),
  contracts: section(
    "قراردادها",
    "توافق تثبیت‌شده، طرفین و امضاها با نسخه و snapshot نگهداری می‌شوند.",
    [
      "Contract",
      "ContractParty",
      "ContractSignature",
      "ContractAttachment",
      "ContractAmendment",
      "Deal",
      "Offer",
      "DealTypeVersion",
      "Contact",
    ],
    [
      "contracts",
      "contractDetails",
      "createContract",
      "signContract",
      "addContractAttachment",
      "finalizeContract",
      "createAmendment",
    ],
    [
      "قبل از قطعی‌سازی همه امضاها، نوع/نسخه و شرایط مالی بررسی شوند.",
      "هم‌زمانی دو قرارداد ناسازگار یک ملک با قفل ردیف و کنترل دیتابیس مدیریت شود.",
      "قرارداد قطعی و snapshot هویت از ویرایش عادی محافظت شوند؛ اصلاحیه مسیر جدا دارد.",
    ],
    ["deals"],
  ),
  finance: section(
    "کمیسیون و دریافت‌وپرداخت",
    "مطالبات، سهم‌ها و وجوه از ارزش معامله جدا ثبت و محاسبه شوند.",
    [
      "CommissionPolicyVersion",
      "Commission",
      "CommissionShare",
      "Payment",
      "PaymentAllocation",
      "Contract",
      "Contact",
      "User",
    ],
    [
      "commissions",
      "approveCommission",
      "payments",
      "confirmPayment",
      "reversePayment",
    ],
    [
      "تخصیص کل از وجه و تخصیص به یک مطالبه از مانده آن بیشتر نباشد.",
      "مجموع سهم‌ها از مبلغ قابل تقسیم بیشتر نشود؛ سهم پرداختی از وصول مرتبط بیشتر نشود.",
      "وجوه تأییدشده حذف نشوند؛ برگشت مرتبط و idempotent ثبت شود.",
    ],
  ),
  reports: section(
    "گزارش‌ها",
    "خواندن تجمیعی همان رکوردهای مجاز؛ پایگاه جدا یا داده تکراری نیاز نیست.",
    [
      "Task",
      "Listing",
      "Inquiry",
      "Introduction",
      "Viewing",
      "Deal",
      "Contract",
      "Commission",
      "CommissionShare",
      "Payment",
      "PaymentAllocation",
    ],
    ["reports", "dashboard"],
    [
      "شاخص تبدیل مبنای شمارش مشخص داشته باشد؛ اشخاص چنددرخواستی بدون تعریف شاخص چندبار شمرده نشوند.",
      "ثمن، ودیعه، اجاره و ارزش مشارکت/معاوضه در جمع مبهم ادغام نشوند.",
    ],
  ),
  notifications: section(
    "اعلان‌ها و سوابق",
    "اعلان شخصی و تاریخچه غیرقابل بازنویسی رویدادها.",
    [
      "Notification",
      "ActivityLog",
      "StageTransitionHistory",
      "AssignmentHistory",
      "ScopeTransferHistory",
      "PropertyReview",
      "FollowUpRescheduleHistory",
    ],
    ["notifications", "markNotificationRead", "timeline"],
    [
      "event_key یکتا مانع اعلان تکراری شود؛ operation_id رویدادهای یک فرمان را مرتبط کند.",
      "اشتراک operation_id مجوز مشاهده پرونده نامرتبط نیست؛ خط زمانی باید روابط و مجوز تک‌تک موضوع‌ها را بررسی کند.",
    ],
  ),
  settings: section(
    "انواع معامله و نسخه‌ها",
    "شش خانواده رفتاری مشخص با نسخه‌های منتشرشده غیرقابل بازنویسی.",
    [
      "DealType",
      "DealTypeVersion",
      "CommissionPolicyVersion",
      "Listing",
      "Deal",
      "Contract",
    ],
    ["dealTypes", "createDealType", "publishDealTypeVersion"],
    [
      "نوع ملک با نوع معامله یکی نیست؛ behavior_type فقط یکی از رفتارهای پشتیبانی‌شده باشد.",
      "نسخه جدید، سوابق قبلی را خودکار مهاجرت نکند؛ نسخه و snapshot قرارداد پابرجا باشند.",
      "سیاست کمیسیون نمونه است؛ تغییر آن نباید calculation_snapshot کمیسیون قدیمی را عوض کند.",
    ],
  ),
  guide: section(
    "نقشه کامل سامانه",
    "مرجع ارتباط همه مدل‌ها و سه چرخه اصلی برای طراحی بک‌اند.",
    [
      "Contact",
      "PropertyRegistrationRequest",
      "Property",
      "PropertyAppraisal",
      "Listing",
      "Inquiry",
      "Introduction",
      "Viewing",
      "Deal",
      "Offer",
      "Contract",
      "Commission",
      "Payment",
      "Task",
      "FollowUp",
    ],
    [
      "requestDetails",
      "inquiryDetails",
      "dealDetails",
      "contractDetails",
      "timeline",
    ],
    [
      "از تب «همه مدل‌ها» فرهنگ کامل جدول‌ها را ببینید.",
      "مرز سه چرخه حفظ شود؛ رابط یکپارچه دلیل ادغام جدول‌های مستقل نیست.",
    ],
    ["requests", "inquiries", "deals"],
  ),
  pipelines: section(
    "کاریز عملیات",
    "کاریز نمایش همان رکوردهای واقعی است؛ وضعیت مستقلی روی کارت کپی نشود.",
    [
      "PropertyRegistrationRequest",
      "Inquiry",
      "Deal",
      "Task",
      "StageTransitionHistory",
      "AssignmentHistory",
      "Notification",
    ],
    [
      "requests",
      "inquiries",
      "deals",
      "assignRegistrationRequest",
      "submitListingForReview",
      "approveListing",
      "introduceListing",
      "submitOffer",
      "acceptOffer",
      "finalizeContract",
    ],
    [
      "GETهای فهرست و کاریز باید فیلتر و شمارش و مجوز یکسان داشته باشند.",
      "کشیدن و دکمه یک فرمان دامنه را فراخوانی کنند؛ PATCH آزاد status/stage پذیرفته نشود.",
      "کارت دارای کد، شخص، مسئول، رنج، موعد، اقدام بعدی، توقف و هشدار نقص/تأخیر باشد.",
    ],
    ["requests", "inquiries", "deals"],
  ),
};

// Current page contracts supersede the earlier listing-level review design.
Object.assign(guideSections.requests, {
 purpose: "پرونده پس از پذیرش مسئول به کارشناسی و بررسی مستقل ملک می‌رسد؛ ذخیره کارشناسی فایل عرضه ایجاد نمی‌کند.",
 apis: ["requests","requestDetails","createRegistrationRequest","assignCase","acceptAssignment","setPropertyTitle","reopenAppraisal","markDuplicateCase","startAppraisal","saveWorkspace","submitPropertyForReview","transferScope","changeAssignee"],
 checks: ["ذخیره کارشناسی فقط ملک و گزارش را بسازد یا تکمیل کند؛ Listing خودکار نسازید.","عنوان در اختیار مدیر؛ ارسال نسخه ملک و گزارش مستقل از وجود فایل است.","ثبت‌کننده، مسئول فعلی و مدیر پذیرنده سه مفهوم مستقل‌اند؛ تاریخچه و وظایف اتمیک باشند."]
});
Object.assign(guideSections.reviews, {
 purpose: "صف ملک‌های در انتظار بررسی؛ تأیید مدیر متعلق به ملک و گزارش کارشناسی است، مستقل از فایل عرضه.",
 apis: ["reviews","propertyDetails","reviewProperty"],
 checks: ["review_submitted_version با نسخه جاری ملک یکسان باشد؛ تأیید نیازمند عنوان است.","برگشت دلیل الزامی دارد؛ تأیید درخواست را تکمیل می‌کند و فایل جدید یا فعال‌سازی خودکار نمی‌سازد."]
});
Object.assign(guideSections.properties, {
 title: "املاک من", purpose: "املاک تأییدشده مسئول فعلی؛ دارایی فیزیکی از فایل‌های عرضه مستقل است.",
 apis: ["properties","propertyDetails","savePropertyListing","transferScope","changeAssignee"]
});
Object.assign(guideSections.listings, {
 title: "فایل‌های عرضه من", purpose: "برای هر ملک تأییدشده یک فایل مستقل به ازای هر نوع معامله؛ شرایط و تاریخچه هر فایل جداست.",
 apis: ["listings","listingDetails","savePropertyListing","setListingStatus"],
 checks: ["UNIQUE(property_id,deal_type_id)؛ داده هم‌نوع تکراری قدیمی ابتدا تعیین تکلیف شود.","review_status قدیمی فایل فقط سازگاری است؛ منبع تأیید Property است و صف بررسی فایل مستقل نسازید.","فعال‌سازی به تأیید ملک و شرایط معتبر وابسته؛ اکسپلور projection خواندنی با اطلاعات محدود است.","انتخاب معرفی و مذاکره همیشه listing_id دقیق را حفظ کند؛ تغییر یک نوع سایر فایل‌ها را بازنویسی نکند."]
});
guideSections.explore = section("اکسپلور فایل‌های عرضه", "فایل‌های فعال و معتبر همه مشاوران با اطلاعات قابل عرضه؛ بدون مجوز ویرایش.", ["Property","Listing","DealTypeVersion","Introduction"], ["publicListings","publicListingDetails","introduceListing"], ["serializer عمومی فاقد نشانی خصوصی و مشخصات محرمانه مالک باشد؛ لینک مستقیم همان محدودیت فهرست را رعایت کند."]);
Object.assign(guideSections.deals, {
 purpose: "مذاکره روی فایل دقیق؛ نتیجه موفق یا ناموفق ثبت می‌شود و مبلغ توافق در قرارداد تعیین می‌شود.",
 apis: ["deals","dealDetails","createDeal","succeedDeal","createContract","closeDeal","createFollowUp"],
 checks: ["submitOffer و acceptOffer در نمونه فعلی غیرفعال‌اند؛ Offer مسیر جاری محصول نیست.","نتیجه موفق AGREED است؛ قطعی‌شدن و بسته‌شدن فایل فقط پس از قرارداد معتبر است."]
});
guideSections.contracts.apis.push("saveContractTerms");
guideSections.inbox.models.push("Property","PropertyAppraisal","PropertyReview");
guideSections.inbox.apis.push("acceptLead","reviews","reviewProperty");
guideSections.guide.apis = ["requestDetails","propertyDetails","savePropertyListing","inquiryDetails","dealDetails","contractDetails","timeline"];
guideSections.pipelines.apis = ["requests","inquiries","deals","assignCase","submitPropertyForReview","reviewProperty","introduceListing","succeedDeal","finalizeContract"];

guideSections.tasks.apis.push("createTask","rescheduleTask");

guideSections['property-register'] = section("ثبت ملک", "ویزارد مستقل ثبت اولیه ملک؛ سرنخ مفهوم فنی زیرساخت createLead است. فرم‌های قبلی حفظ شده‌اند.", ["Contact","PropertyRegistrationRequest","Task","Notification"], ["createLead"], ["پیش از تأیید نهایی هیچ رکورد دامنه ساخته نشود؛ فقط پیش‌نویس موقت همین کاربر در نشست مرورگر ذخیره می‌شود.","مشاور عنوان و رنج تعیین نمی‌کند؛ مدیر عنوان اختیاری و رنج مجاز را مشخص می‌کند.","ثبت نهایی همان createLead با lead_type=PROPERTY است؛ Property یا Listing تأییدشده نمی‌سازد؛ پذیرش و ارجاع فعلی حفظ شوند."]);

Object.assign(guideSections['property-register'], {
 purpose: "ویزارد کامل از ثبت سرنخ تا پذیرش مدیر، ارجاع، پذیرش مشاور، کارشناسی، تأیید ملک و فایل عرضه؛ هر مرحله متعلق به نقش مسئول است.",
 models: ["Contact","PropertyRegistrationRequest","AssignmentHistory","Property","PropertyAppraisal","PropertyReview","Listing","Task","Notification"],
 apis: ["createLead","acceptLead","assignCase","acceptAssignment","rejectAssignment","saveWorkspace","setPropertyTitle","submitPropertyForReview","reviewProperty","savePropertyListing"],
 checks: ["مرحله جاری از وضعیت ذخیره‌شده پرونده و ملک مشتق شود؛ query مرحله مجوز عبور از پذیرش یا تأیید نیست.","case شناسه همان درخواست است؛ فرم‌های قدیمی حفظ شده‌اند و عملیات نسخه جدا ندارد.","ثبت‌کننده می‌تواند مسیر پرونده خودش را پیگیری کند؛ عملیات و داده کارشناسی فقط با مجوز رکورد و نقش نمایش داده شوند.","آخرین پرونده هر فهرست به تفکیک کاربر در sessionStorage ذخیره شود؛ لینک بازگشت فقط با دسترسی فعلی نمایش داده شود."]
});

guideSections['property-register'].checks.push("نوار مسیر در جزئیات پرونده، ملک و فایل به همان case و stage لینک می‌دهد؛ انتخاب مرحله قبلی یا آینده فقط مرور است و فرمانی اجرا نمی‌کند.");

guideSections['property-register'].checks.push("عنوان رنج مسئول حفظ شود؛ نام مدیر از عضویت MANAGER فعال همان رنج خوانده شود. نام مسئول هر مرحله از ثبت‌کننده، مدیر جاری یا مشاور فعلی مشتق شود؛ در نبود مسئول، وضعیت تعیین‌نشده نمایش داده شود.");

guideSections['property-register'].checks.push("ادامه پرونده قبلی با chooseCase=1 پنجره جست‌وجو و انتخاب رکورد مجاز باز کند؛ بستن آن case و stage و پیش‌نویس را حفظ کند. خطای فرمان و اعتبارسنجی با SweetAlert2 نمایش داده شود؛ شکست عملیات پیش‌نویس را پاک نکند.");

guideSections.requests.checks.push("فرم بررسی ملک شامل قیمت کارشناسی نیست؛ گزارش وضعیت و موقعیت ثبت شود. مبلغ پیشنهادی فقط در فایل عرضه است و توضیح درباره قیمت در صورت نیاز متن آزاد گزارش است؛ داده مالی قدیمی حذف نشود.");

guideSections['property-register'].checks.push("پس از ذخیره موفق گزارش بازدید، پیام مرور و ارسال نمایش داده شود؛ انصراف ارسال نمی‌کند. reviewRequest شناسه درخواست در URL، مودال خلاصه اطلاعات ذخیره‌شده است؛ فقط تأیید صریح submitPropertyForReview را اجرا کند. شکست ذخیره پیام موفقیت یا ارسال ایجاد نکند.");

guideSections.requests.purpose = "فهرست پرونده‌ها با خلاصه مراحل، مسئول مرحله و ادامه مسیر؛ جزئیات requests/{id} همان ویزارد مشترک است و view=history سوابق و گزینه‌های قبلی را نگه می‌دارد.";
guideSections.requests.checks.push("فهرست و جزئیات از propertyWizardStage و PropertyFlowWizard مشترک استفاده کنند؛ مرحله موازی یا فرمان جدا نسازید. فیلترها، صفحه‌بندی، کاریز و مجوزها حفظ شوند؛ مراحل آینده فقط مرورند.");

guideSections.requests.checks.push("نمای کارشناس ابتدا فقط اقدام بعدی را نشان دهد: تکمیل گزارش یا مرور و ارسال. فرم با edit=workspace باز شود؛ با ذخیره موفق به حالت مرور برگردد. در جزئیات، ثبت جدید، پرونده‌ها و سوابق دکمه‌های ثابت بالا باشند؛ سوابق مودال و کارها و پیگیری‌ها باکس کنار مراحل باشند. در بررسی مدیر، دکمه تأیید بالای تغییر عنوان قرار گیرد و در نبود عنوان علت غیرفعال‌بودن مشخص باشد.");

guideSections.requests.checks.push("casePanel=history سوابق را در مودال باز کند؛ کارها و پیگیری‌ها در باکس ثابت کنار مراحل باشند. activityAction و activityRecord فرم فرزند را نگه دارند؛ بستن فرم فرزند، پرونده و باکس کار را حفظ کند. فهرست کار و پیگیری و سوابق فقط داده مجاز همان پرونده را بخواند.");

guideSections.requests.checks.push("COMPLETED درخواست ثبت، پایان کارشناسی است نه پایان پرونده ملک؛ برای ملک APPROVED و ACTIVE با ارجاع پذیرفته‌شده و بدون قرارداد قطعی، ثبت کار و پیگیری فعال بماند. لغو/تکراری، عدم پذیرش و ملک بایگانی یا قرارداد قطعی مجاز نیستند؛ مجوز UI و فرمان از activityOpen مشترک استفاده کنند.");

guideSections.requests.checks.push("سوابق ملک علاوه بر خط زمانی، بازدید، مذاکره و قرارداد تمام فایل‌های همان ملک را با نام متقاضی و شناسه فایل دقیق نشان دهد. نام متقاضی projection حداقلی رویداد مجاز است و شماره تماس یا دسترسی کامل شخص ایجاد نمی‌کند؛ هر رویداد و لینک جزئیات مجوز مستقل داشته باشد. نشان مرحله جاری بدون متن اضافه و با aria-current نمایش داده شود.");

guideSections.requests.apis.push('changePropertyCaseStatus');
guideSections['property-register'].apis.push('changePropertyCaseStatus');
guideSections.requests.checks.push("دکمه وضعیت پرونده با caseStatus=1 باز شود؛ تغییر برای مدیر مجاز و با دلیل است. CLOSED از COMPLETED جداست؛ بستن، لغو، تکراری و بازگشایی به فرمان دامنه اتمیک متصل باشند. قرارداد دارای امضا/قطعی مسدود؛ بازگشایی، عرضه و برنامه‌های قبلی را خودکار فعال نکند.");
guideSections.requests.checks.push("در فهرست، دکمه وضعیت ملک با caseStatus=شناسه‌پرونده و سوابق با historyCase=شناسه‌پرونده مودال مشترک جزئیات را باز کنند؛ مسیر /requests، جست‌وجو، فیلتر و p هنگام بازکردن، تازه‌سازی و بستن حفظ شوند. شناسه مودال فقط از پرونده مجاز انتخاب شود؛ تغییر وضعیت مجوز مستقل مدیر را حفظ کند.");
guideSections.requests.checks.push("پیگیری کار در فهرست با workCase=شناسه پرونده مودال باز کند؛ ثبت کار و پیگیری در فرم فرزند activityAction انجام شود. مدیر رنجِ مجاز و مدیرکل بتوانند به مشاور فعال مرتبط ارجاع دهند و در پرونده ملک پیش‌فرض مسئول همان assigned_to_id باشد. ذخیره، مودال اصلی و فیلترهای فهرست را نگه دارد؛ بستن والد پارامترهای فرم فرزند را پاک کند. پرونده بسته یا ارجاع نپذیرفته همچنان مجاز به ثبت نیست.");
guideSections.inbox.purpose="کارتابل واحد پذیرش و تأیید برای مدیرکل، مدیر رنج مسئول و مشاور: نمای پیش‌فرض پذیرش اولیه برای مدیر و پذیرش مشاور برای مشاور؛ تب‌های پذیرش اولیه، ارجاع به مشاور، پذیرش ارجاع، تأیید کارشناسی ملک، تمدید و ارجاع‌های ردشده. هر نقش فقط موارد و تصمیم‌های مجاز خود را می‌بیند.";
guideSections.inbox.checks.push("تب پیش‌فرض ALL باشد؛ state در URL و تازه‌سازی حفظ شود. شمارنده هر تب از داده مجاز و فیلتر جست‌وجو/نوع پرونده محاسبه شود. آماده ارجاع‌های بدون مشاور که قبلاً در سرنخ‌ها بودند از قلم نیفتند. درخواست تمدید معلق برای مشاور صاحب پرونده قابل مشاهده ولی تصمیم آن فقط برای مدیر مجاز باشد. تب‌ها با کیبورد و aria-selected کار کنند.");
guideSections.leads.purpose="صفحه مستقل سرنخ‌ها از رابط حذف و آدرس قدیمی /leads به /inbox هدایت می‌شود؛ ایجاد اولیه پرونده در ویزارد و ثبت درخواست متقاضی حفظ شده است. داده‌های قبلی حذف نمی‌شوند. درخواست قدیمی action=createLead به فرم اولیه سازگار هدایت شود.";
guideSections.requests.checks.push("لینک فایل عرضه در جزئیات ویزارد در تب/پنجره جدید با target=_blank و rel=noopener noreferrer باز شود تا مسیر و مرحله پرونده مبدأ باقی بماند.");
guideSections.properties.checks.push("فایل‌های عرضه و ویرایش شرایط از جزئیات ملک در تب/پنجره جدید باز شوند؛ صفحه ملک مبدأ حفظ شود.");
guideSections.requests.checks.push("در مودال سوابق، روی هر ردیف مجاز اقدام بعدی نمایش داده شود: ثبت نتیجه بازدید → شروع مذاکره برای همان متقاضی/فایل → نتیجه موفق یا ناموفق. commercialAction/commercialRecord فرم فرزند را بازیابی کنند؛ رفرش، بستن یا Escape فرم فرزند، مودال سوابق و فیلتر فهرست را نگه دارند. شناسه جعلی یا رکورد متعلق به ملک دیگر هیچ فرم عملیاتی باز نکند.");
guideSections.viewings.checks.push("نتیجه تمایل INTERESTED یا NOT_INTERESTED به همراه گزارش ثبت شود؛ نتیجه منفی اجازه مذاکره ندهد و نتیجه بازدید تکمیل‌شده قابل بازنویسی نباشد. شروع مذاکره به همان viewing_id، listing_id و inquiry_id متصل بماند.");
guideSections.deals.checks.push("نتیجه موفق با توضیحات به AGREED برسد و کار تنظیم قرارداد فقط برای مدیرکل فعال بسازد؛ ناموفق با دلیل LOST شود. مذاکره فعال تکراری برای همان متقاضی و فایل ساخته نشود. قرارداد و مبلغ قطعی فقط در دسترس مدیرکل باشند.");
guideSections.contracts.purpose="تنظیم، ویرایش، امضا، قطعی‌سازی و اصلاحیه قرارداد فقط توسط مدیرکل؛ ورودی مذاکره موفق است و مبلغ توافق در قرارداد ثبت می‌شود.";
guideSections.contracts.checks.push("انحصار GENERAL_MANAGER در منو، مسیر مستقیم، query فرم، canAccess رکورد و داده وابسته و فرمان‌های createContract/saveContractTerms/signContract/addContractAttachment/finalizeContract/createAmendment اعمال شود. نقش CONTRACT_OFFICER سابق یا FINANCE مجوز پرونده قرارداد ایجاد نکند. کارهای قدیمی CONTRACT_PREPARATION برای نقش‌های دیگر پنهان و غیرقابل اجرا باشند.");
guideSections.inquiries.purpose="درخواست متقاضی با الگوی مشترک پرونده ملک: ثبت مرحله‌ای، پذیرش مدیر، ارجاع، پذیرش مشاور، تکمیل نیاز، معرفی فایل، بازدید، مذاکره و قرارداد. مراحل از داده واقعی مشتق شوند و هر فایل معرفی‌شده مسیر مستقل دارد.";
guideSections.inquiries.apis.push('saveInquiryNeeds','changeInquiryCaseStatus');
guideSections.inquiries.checks.push("جزئیات /inquiries/{id} به‌صورت پیش‌فرض ویزارد مشترک است؛ فهرست کارت‌های جمع‌وجور با مراحل، مسئول واقعی، فیلتر مرحله، صفحه‌بندی، وضعیت درخواست، سوابق و پیگیری کار در مودال باشد. queryها و شماره صفحه حفظ شوند؛ آخرین پرونده بعد از Back قابل پیدا کردن باشد.");
guideSections.inquiries.checks.push("سوابق شامل معرفی‌های همین متقاضی در تمام ملک‌ها، بازدید، مذاکره و قرارداد مجاز است. برنامه‌ریزی بازدید و ثبت نتیجه، شروع مذاکره از بازدید مناسب، نتیجه موفق/ناموفق و تنظیم قرارداد مدیرکل از همان مودال انجام شوند. شناسه رویداد متقاضی دیگر در query هیچ فرمی باز نکند.");
guideSections.inquiries.checks.push("کارها و پیگیری‌ها در جزئیات کنار مراحل و در فهرست داخل مودال باشند؛ مدیرکل/مدیر رنج بتوانند برای مشاور مسئول درخواست ثبت کنند و مسئول پیش‌فرض همان assigned_to_id باشد. پرونده بسته یا ارجاع نپذیرفته مجاز نیست.");
guideSections.inquiries.checks.push("نمای فعلی با چند فایل موازی، پیشرفت معتبر جلوتر را نشان دهد؛ فقط مذاکره ثبت‌شده به مرحله مذاکره و مذاکره موفق به قرارداد برسد و بازدید باز دیگر مرحله را عقب نبرد؛ تمام مسیرهای فایل‌ها در سوابق باقی بمانند. بازدید منفی بدون مذاکره فعال درخواست را به جست‌وجوی فایل دیگر برگرداند. بستن درخواست فقط رویدادهای خودش را لغو کند و هرگز فایل ملک را متوقف نکند.");
guideSections['inquiry-register']={...guideSections.inquiries,title:'ثبت درخواست متقاضی',models:[...guideSections.inquiries.models],apis:[...guideSections.inquiries.apis,'createLead'],checks:[...guideSections.inquiries.checks,'فرم سه بخش مشخصات متقاضی، نوع درخواست و مرور نهایی داشته باشد؛ ثبت نهایی پرونده جدید ایجاد و ادامه به همان شناسه منتقل شود. مشاور رنج خودش و مدیر فقط رنج مجاز را انتخاب کند. ثبت شخص موجود صرفاً با دسترسی مجاز باشد.']};
guideSections.inquiries.checks.push("فیلترهای ۹ مرحله همیشه و به ترتیب مسیر نمایش داده شوند؛ مرحله بدون پرونده با شمارنده صفر قابل انتخاب باشد. فهرست متقاضیان همه درخواست‌های مجاز از پذیرش اولیه و ارجاع تا قرارداد را شامل شود؛ فقط موارد پذیرفته‌شده را محدود نکند. شمارنده و نتایج همچنان تابع دسترسی و فیلترهای جاری باشند.");
guideSections.requests.checks.push("هر ۷ فیلتر مرحله همیشه از ثبت اولیه تا فایل عرضه نمایش داده شوند، حتی با شمارنده صفر؛ فهرست همه پرونده‌های مجازِ پذیرش و ارجاع را نیز شامل شود و شمارنده‌ها از همان مجموعه محاسبه شوند.");
for(const key of ['introductions','viewings','deals'])guideSections[key].checks.push("صفحه مستقل از منوی محصول حذف شده است؛ عملیات و داده دامنه حفظ می‌شوند و در سوابق پرونده ملک/متقاضی اجرا می‌شوند. مسیر قدیمی فهرست به پرونده‌ها و شناسه رویداد به سوابق پرونده مرتبط با کنترل دسترسی فعلی هدایت شود؛ مشاور ملک بدون دسترسی به متقاضی به پرونده ملک خودش برود.");
guideSections.requests.checks.push("پس از حذف صفحات مستقل، معرفی‌های ملک هم در سوابق نمایش داده شوند؛ مشاور سمت ملک بتواند بدون ورود به پرونده خصوصی متقاضی، بازدید برنامه‌ریزی یا عدم تمایل را با دلیل ثبت کند. هیچ لینک مستقل معرفی/بازدید/مذاکره از سوابق تولید نشود؛ قرارداد مجاز همچنان صفحه مستقل دارد.");
guideSections.inquiries.checks.push("صرف معرفی فایل، مرحله را به بازدید نبرد؛ ورود به بازدید با ثبت قرار واقعی باشد و بازدید تکمیل‌شده نیازمند تعیین تکلیف مذاکره حفظ شود. بعد از scheduleViewing، فقط فرم زمان بسته و سوابق حفظ شود؛ فرم نتیجه خودکار باز نشود و دکمه ثبت نتیجه روی ردیف همان بازدید/فایل نمایش داده شود؛ scheduled_at در آینده مانع completeViewing نیست. بستن فرم نتیجه قرار ثبت‌شده را لغو نکند. فایل متوقف/ملک نیازمند اصلاح، علت و مسیر مجاز پیگیری وضعیت را نشان دهد.");

guideSections.inquiries.checks.push("بازدید COMPLETED با interest=INTERESTED و بدون مذاکره مرتبط، در مرحله بازدید باقی بماند و در فهرست انتخاب برای شروع مذاکره نمایش داده شود؛ شروع مذاکره فقط با انتخاب صریح همان بازدید و ثبت createDeal انجام شود. فهرست معرفی‌ها، بازدیدها و مذاکرات داخل مراحل نمایش داده شود و هر فایل مستقل بماند؛ قرارداد یا مذاکره فعال بر بازدیدهای موازیِ منتظر نتیجه مقدم باشد و تعداد بازدیدهای باقی‌مانده نمایش داده شود. نتیجه مثبت بعد از رفرش نیز مرحله بازدید را حفظ کند؛ query مرور stage پس از ثبت موفق عملیات پاک شود. نتیجه مثبتِ مصرف‌شده در مذاکره ناموفق دوباره پیشرفت مصنوعی نسازد.");

guideSections.inquiries.checks.push("در فهرست عملیاتی معرفی‌ها، فقط معرفی‌های ردنشده بدون بازدید SCHEDULED یا COMPLETED نمایش داده شوند؛ دکمه ثبت بازدید پس از ذخیره موفق، فایل را به بخش بازدیدها منتقل کند. معرفی اصلی از داده و سوابق حذف نشود و لغو فرم هیچ انتقالی ایجاد نکند.");

guideSections.inquiries.checks.push("حذف معرفی با تأیید کاربر و updateIntroduction با status=CANCELLED انجام شود؛ فقط معرفی باز بدون بازدید غیرلغوشده و بدون مذاکره مرتبط مجاز است. توقف عرضه مانع حذف معرفی نباشد. ملک، فایل عرضه و سابقه معرفی حفظ شوند؛ CANCELLED از فهرست عملیاتی کنار گذاشته شود.");

guideSections.inquiries.checks.push("کارت معرفی، بازدید و مذاکره نام مشاور متقاضی و مشاور ملک را با عنوان نقش نشان دهد؛ در صورت متفاوت بودن دو نفر، نشان همکاری دو مشاور نمایش یابد. شناسه‌های ثبت‌شده روی معرفی بر مسئول جاری مقدم‌اند؛ ثبت‌کننده متفاوت معرفی جدا نمایش داده شود. ارتباط بازدید و مذاکره با معرفی دقیق حفظ شود.");

Object.assign(guideSections.pipelines, {
 purpose: "دو کاریز پرونده‌های ملک و پرونده‌های متقاضی؛ تب مستقل مذاکرات حذف است. هر کارت همان پرونده اصلی است و مرحله از داده واقعی و منطق ویزارد مشتق می‌شود.",
 pipelines: ["requests","inquiries"],
 checks: ["هر ۷ مرحله ملک و هر ۹ مرحله متقاضی حتی با شمارنده صفر نمایش یابد؛ مرحله جاری از propertyWizardStage و inquiryWizardStage خوانده شود.","پذیرش و ارجاع در کاریز قابل مشاهده‌اند و اقدامشان به کارتابل پذیرش با فیلتر همان پرونده هدایت شود.","کارت و شمارنده فقط رکوردهای مجاز با فیلتر رنج، مسئول و جست‌وجو را شامل شوند؛ فیلترها و تب در URL بمانند.","مذاکرات جزئی از مسیر متقاضی هستند؛ انتقال نمایشی کارت وضعیت را تغییر ندهد. پرونده بسته در کاریز فعال نمایش داده نشود؛ پرونده دارای ملک تأییدشده در ستون فایل عرضه دیده شود."]
});

guideSections.inquiries.checks.push("مرحله قرارداد فهرست مذاکرات موفق AGREED/CONTRACT/FINALIZED همان درخواست و قراردادهای قابل‌دسترسی را نمایش دهد؛ تنظیم قرارداد از روی مذاکره انتخاب‌شده باز شود. مذاکرات ناموفق در این فهرست نیایند. طبق قرارداد دسترسی فعلی، دکمه و فرمان تنظیم قرارداد فقط برای مدیرکل مجاز است.");

guideSections.inbox.purpose="کارتابل پذیرش فقط برای تصمیم‌های پذیرش اولیه، پذیرش مشاور، تأیید ملک و تأیید تمدید مهلت است؛ ارجاع و تغییر مسئول در مرحله ارجاع خود پرونده انجام می‌شود.";
guideSections.inbox.checks.push("پرونده UNASSIGNED یا REJECTED بدون تصمیم تأییدیِ معلق، در کارتابل پذیرش نمایش داده نشود؛ تب و دکمه ارجاع از کارتابل حذف باشند. ستون ارجاع کاریز به جزئیات همان پرونده وصل شود.");
guideSections.pipelines.checks=guideSections.pipelines.checks.map(text=>text.replace('پذیرش و ارجاع در کاریز قابل مشاهده‌اند و اقدامشان به کارتابل پذیرش با فیلتر همان پرونده هدایت شود.','پذیرش و ارجاع در کاریز قابل مشاهده‌اند؛ پذیرش به کارتابل و ارجاع به مرحله ارجاع خود پرونده هدایت شود.'));

guideSections.inbox.apis.push('reviewConsultantWithdrawal');
guideSections.inbox.checks.push('انصراف مشاور تصمیم فوری نیست: درخواست pending تا تأیید مدیر رنج/مدیرکل مسئول قبلی را حفظ کند و ارجاع جدید را مسدود کند. پس از تأیید از کارتابل خارج و در مرحله ارجاع پرونده قابل واگذاری باشد. رد درخواست، همان مسئول را نگه دارد.');

guideSections.inbox.checks.push("کارت منتظر پذیرش مشاور فقط در کارتابل همان مشاور بیاید؛ مدیر رنج و مدیرکل آن را در کارتابل خود نبینند. درخواست انصراف مشاور به عنوان تصمیم مدیر مستقل از پذیرش مشاور نمایش داده شود.");

guideSections.inbox.checks.push("کارت‌ها سربرگ وضعیت، نام پرونده، مشخصات مسئول، خلاصه، اقدام اصلی و لینک سابقه با ترتیب ثابت داشته باشند؛ فرم تصمیم انصراف در مودال withdrawalReview با شناسه همان پرونده باز شود و پس از رفرش باز بماند.");
guideSections.requests.checks.push("درخواست تمدید مهلت در محتوای اصلی جزئیات همان پرونده نمایش یابد؛ موعد فعلی، موعد پیشنهادی، دلیل، درخواست‌کننده و نتیجه تصمیم مدیر پس از رفرش حفظ شوند. اقدام تصمیم مدیر از جزئیات به کارتابل پذیرش هدایت شود.");
guideSections.inquiries.checks.push("باکس وضعیت تمدید مهلت با همان رفتار پرونده ملک در جزئیات متقاضی نیز نمایش یابد؛ پرونده نامرتبط وضعیت تمدید را نبیند.");
