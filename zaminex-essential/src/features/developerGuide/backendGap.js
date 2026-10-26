// Snapshot of model source inspected on 2026-10-18; these are migration recommendations.
import { modelCatalog } from './models.js';
export const backendReviewDate = '2026-10-18';
const existing = (source, current, change, migration) => ({ status: 'اصلاح مدل موجود', source, current, change, migration });
const addition = (change, migration) => ({ status: 'افزودن مدل', source: 'در مدل‌های فعلی apps تعریف نشده', current: 'مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.', change, migration });
export const backendGap = {
  AssignmentRescheduleHistory: addition('تاریخچه تعویق پرونده با FK به درخواست ملک یا متقاضی، موعد قبلی و جدید، دلیل و کارشناس؛ assigned_at مستقل است.', 'این پیشنهاد از گردش جدید Sample است و بررسی تازه بک‌اند نیست؛ سابقه داده موجود حفظ شود و فقط رویدادهای واقعی جدید ثبت شوند.'),
  User: existing('accounts/models.py · User',
    'AbstractUser با role=ADMIN/AGENT؛ groups و user_permissions از جنگو به ارث می‌رسند.',
    'مرجع مجوز را groups/permissions قرار دهید؛ is_admin_role، is_agent_role و limit_choices_to وابسته به role را هم مهاجرت دهید. گروه جای عضویت رنج را نمی‌گیرد.',
    'ADMIN/AGENT قدیمی را با بررسی دسترسی واقعی نگاشت کنید؛ ADMIN را خودکار به superuser تبدیل نکنید. دوره سازگاری و سپس حذف role؛ PK فعلی حفظ شود.'),
  Group: existing('django.contrib.auth.models.Group (از AbstractUser)',
    'گروه و مجوز استاندارد جنگو موجود است؛ مدل groups جدید لازم نیست.',
    'گروه‌های مصوب و permissionهای دامنه را تعریف کنید؛ code در Group استاندارد موجود نیست، نام یکتا یا نگاشت تنظیمات استفاده شود.',
    'مجوزهای فعلی را حفظ کنید؛ seed فقط گروه و مجوز مصوب، بدون کاربر یا پرونده جعلی.'),
  UserGroup: existing('accounts/models.py · User.groups (رابط ارث‌رسیده)',
    'رابط چندبه‌چند کاربر و Group از قبل موجود است.',
    'از همان through استاندارد استفاده کنید؛ group_ids صرفاً projection در serializer است، جدول موازی نسازید.',
    'شناسه گروه‌ها و روابط قبلی حفظ شود؛ اضافه کردن عضویت گروه با ممیزی مجوز انجام شود.'),
  StaffProfile: existing('accounts/models.py · ConsultantProfile / AdminProfile',
    'دو پروفایل مستقل با user، full_name، mobile، branch، hired_at و is_active وجود دارد.',
    'پروفایل مشترک کارکنان با OneToOne(user) بسازید؛ شعبه متنی را با رابطه به تعریف شعبه در صورت نیاز جایگزین کنید. گروه و رنج در پروفایل ذخیره نشوند.',
    'پروفایل‌های تکراری یک user و موبایل‌های متعارض را گزارش کنید؛ فایل تصویر و مسیر رسانه حفظ شود؛ APIهای consultant_profile/admin_profile دوره سازگاری داشته باشند.'),
  ManagementScope: addition('حوزه عملیاتی مستقل با name، code و is_active؛ مدیر از ScopeMembership فعال خوانده شود.', 'رنج واقعی با تأیید مدیر تعریف شود؛ branch آزاد را خودکار رنج فرض نکنید.'),
  ScopeMembership: addition('FK به user و scope؛ membership_role، joined_at و left_at؛ عضویت بازِ تکراری با constraint مشروط منع شود.', 'اعضای واقعی تعیین شوند؛ تغییر گروه، عضویت را جابه‌جا نکند؛ نقش عضویت با گروه مجوز فرق دارد.'),
  ScopeTransferHistory: addition('انتقال حوزه با from_scope، to_scope، reason، transferred_by_id، transferred_at و operation_id؛ append-only.', 'انتقال درخواست/ملک/عرضه وابسته در یک transaction؛ مسئول مقصد عضو فعال باشد یا پرونده در صف قرار گیرد؛ عضویت کارمند تغییر نکند.'),
  AssignmentHistory: addition('تغییر مسئول قبلی/جدید با reason، assigned_by_id و assigned_at؛ مستقل از انتقال رنج.', 'سابقه جعلی ایجاد نکنید؛ مسئول فعلی نقطه شروع مهاجرت است؛ وظایف باز مسئول قبلی هماهنگ شوند.'),
  Contact: addition('هویت شخص حقیقی/حقوقی مستقل از User؛ نام، نوع، شناسه و اطلاعات ارتباطی؛ مالک و متقاضی می‌توانند یک Contact باشند.', 'از owner_* و FollowUp.contact_name نامزد استخراج کنید؛ بدون شماره/شناسه معتبر ادغام خودکار نکنید؛ تعارض‌ها در گزارش بازبینی ثبت شوند.'),
  ContactPhone: addition('FK به Contact، شماره canonical، نوع و is_primary؛ یکتایی و سیاست شماره مشترک صریح باشد.', 'ارقام فارسی/عربی، +98 و 0098 یکسان‌سازی شوند؛ داده مبهم حذف یا بی‌صدا ادغام نشود.'),
  PropertyContact: addition('رابط Property و Contact با relation_type، ownership_percent و is_primary؛ سهم در بازه ۰ تا ۱۰۰.', 'owner_first_name/owner_last_name/owner_phone به رابطه تبدیل شوند؛ جمع سهم مالکیت در سرویس قفل‌شده کنترل شود؛ داده قدیمی تا تطبیق حفظ شود.'),
  PropertyRegistrationRequest: addition('درخواست حداقلی پیش از ایجاد Property با contact، scope، assigned_to، description، status و due_at؛ تبدیل به ملک قابل ردیابی باشد.', 'برای املاک قبلی درخواست ساختگی با تاریخچه اختراعی نسازید؛ رابطه legacy می‌تواند nullable باشد؛ درخواست جدید از مسیر واقعی ایجاد شود.'),
  Property: existing('properties/models.py · Property',
    'consultant، owner_*، property_type قدیمی، property_type_ref، property_usage، district، neighborhood، price منسوخ، deal_type و وضعیت عرضه در یک مدل هستند.',
    'مشخصات فیزیکی و جغرافیایی را نگه دارید؛ scope و روابط مالک را اضافه کنید؛ قیمت و شرایط عرضه در Listing مرجع باشند؛ کنترل نسخه برای ویرایش هم‌زمان اضافه شود.',
    'price/deal_type/property_type/neighborhood را پیش از حذف با Listing و مراجع تطبیق دهید؛ SOLD/RESERVED و CLOSED نمونه را مستقیم معادل نگیرید؛ فیلد nullable، backfill، گزارش تعارض، سپس constraint.'),
  PropertyAppraisal: existing('properties/models.py · PropertyAppraisalReport',
    'مدل موجود فایل PDF یک‌به‌یک با Property است؛ گزارش ساخت‌یافته کارشناسی نیست.',
    'گزارش بازدید PropertyAppraisal با appraiser_id، findings، scheduled_at و completed_at جدا تعریف شود؛ قیمت کارشناسی جزو فرم جاری نیست و مبلغ پیشنهادی در Listing ثبت می‌شود؛ PDF موجود پیوست گزارش باقی بماند.',
    'PDF را به متن findings یا قیمت تخمینی تبدیل نکنید؛ داده قدیمی به‌عنوان گزارش legacy حفظ شود؛ برای چند نوبت کارشناسی رابطه یک‌به‌چند در نظر بگیرید.'),
  Listing: existing('listings/models.py · Listing',
    'FK به Property و DealType؛ status پیش‌فرض ACTIVE، sale_price/deposit/monthly_rent، price_details، assigned_to، review_requested_at و rejection_reason.',
    'برای جریان جدید پیش‌فرض DRAFT، review_status، deal_type_version، terms_snapshot و version لازم است؛ حوزه از Property خوانده شود؛ قید مبالغ نامنفی و ترتیب start_date/end_date اضافه شود.',
    'عرضه‌های ACTIVE قدیمی را بی‌صدا draft نکنید؛ شاخه legacy یا بازبینی مصوب مشخص شود. SOLD با CLOSED نمونه نگاشت صریح شود؛ FK فعلی property از CASCADE برای سوابق قراردادی به سیاست حفاظتی بازبینی شود.'),
  ListingReview: addition('نسخه دقیق عرضه و ملک هنگام ارسال، submitted_by، reviewed_by، decision و reason را ثبت کنید؛ تغییر snapshot تأیید قبلی را نامعتبر کند.', 'review_requested_at/rejection_reason قدیمی سابقه کامل نیست؛ آن را legacy علامت بزنید؛ از ساختن تصمیم/زمان غیرواقعی خودداری کنید.'),
  DealType: existing('basics/models.py · DealType / DealTypeAttribute',
    'نوع معامله پویا و ویژگی‌های مرتبط از قبل وجود دارد؛ behavior_type و نسخه منتشرشده مستقل ندارد.',
    'code و behavior_type برای شش خانواده تأییدشده اضافه کنید؛ Attribute و روابط فعلی دوباره ساخته نشوند.',
    'برای هر DealType واقعی نگاشت رفتار تعیین کنید؛ SALE/RENT قدیمی Property یک مرجع دوم دائمی نباشد؛ داده نامشخص نیازمند بازبینی است.'),
  DealTypeVersion: addition('نسخه immutable قواعد و فیلدهای نوع معامله با deal_type، version_number، status و published_at؛ unique(deal_type, version_number).', 'از تعریف فعلی یک نسخه مبنا با برچسب مهاجرت بسازید؛ Listing/Inquiry/Offer/Contract به نسخه معین وصل شوند؛ تغییر نسخه، سوابق را عوض نکند.'),
  Inquiry: addition('درخواست مستقل متقاضی با contact، scope، assigned_to، status و next_action_at؛ هر شخص چند درخواست دارد.', 'از پیگیری‌های آزاد به‌تنهایی درخواست خرید استنتاج نکنید؛ فقط با داده معتبر/تأیید کاربر منتقل شود.'),
  InquiryDealPreference: addition('رابط درخواست با DealTypeVersion و بودجه/شرایط اختصاصی؛ کنترل min/max و مبالغ نامنفی.', 'بودجه و قیمت عرضه دو مفهوم جدا هستند؛ criteriaهای قدیمی فقط با نگاشت مشخص منتقل شوند.'),
  InquiryAttributeCriterion: addition('criterion با FK ویژگی، operator، مقدار typed و is_required؛ ویژگی نامعتبر یا خارج از نسخه رد شود.', 'از Attribute، AttributeOption و روابط search موجود استفاده کنید؛ شرط ضروری ناموفق باید تطبیق را رد کند.'),
  Introduction: addition('معرفی صریح Inquiry به Listing با consultant، introduced_at، status و feedback؛ نتیجه تطبیق به‌تنهایی معرفی نیست.', 'فقط در عملیات واقعی ایجاد شود؛ معرفی تکراری فعال با قید/سیاست دامنه کنترل شود.'),
  Viewing: addition('بازدید مستقل متصل به Introduction با consultant، scheduled_at، status و outcome؛ نتیجه، Task مرتبط را هم ببندد.', 'Task با task_type=VIEWING به‌تنهایی دارای معرفی/متقاضی معتبر نیست؛ موارد نامشخص در صف بازبینی بمانند.'),
  Task: existing('tasks/models.py · Task',
    'due_date از نوع DateField؛ property اختیاری، assigned_to، status، completed_at و task_type موجودند.',
    'due_at از نوع DateTimeField برای موعد ساعتی؛ موضوع معتبر و رابطه با درخواست/بازدید/پیگیری؛ تکمیل رویداد و Task اتمیک باشد.',
    'due_date فاقد ساعت است؛ ساعت را از کاربر/سیاست مصوب تعیین کنید، دقت دقیقه‌ای اختراع نکنید؛ DUE_DATE قدیمی تا انتقال کامل حفظ شود.'),
  FollowUp: existing('followups/models.py · FollowUp',
    'contact_name متنی، consultant/property و نام‌های ذخیره‌شده، scheduled_at، outcome، status=scheduled/completed و نوع‌های Call/Meeting/Email/Site Visit.',
    'contact و موضوع پرونده FK؛ next_action و next_action_at، completed_at و تاریخچه تعویق اضافه شود؛ وضعیت‌ها/نوع‌ها adapter صریح داشته باشند.',
    'نام متنی را خودکار Contact قطعی نگیرید؛ enumهای کوچک فعلی را مستقیم با حروف بزرگ نمونه جایگزین نکنید؛ رابطه property و آرشیو فعلی حفظ شود.'),
  FollowUpRescheduleHistory: addition('previous_scheduled_at، new_scheduled_at، reason، changed_by_id و changed_at؛ append-only و FK به FollowUp.', 'تعویق، due_at وظیفه فعال را در همان تراکنش عوض کند؛ سوابق قدیمیِ موجود نبودن تاریخچه جعل نشوند.'),
  Deal: addition('مذاکره مستقل با Inquiry، Listing، مسئول، scope، stage و accepted_offer؛ مانع بازکردن مذاکره برای عرضه بسته.', 'صرف تغییر وضعیت Property به SOLD را معامله/قرارداد واقعی فرض نکنید؛ تبدیل رکورد قدیمی نیازمند مدارک است.'),
  DealParticipant: addition('رابط Deal/Contact با participant_role و is_primary؛ خریدار/فروشنده/نماینده صریح.', 'از مالکیت ملک و متقاضی فقط پس از تأیید طرفین، شرکت‌کنندگان ساخته شوند.'),
  Offer: addition('نسخه‌های پیشنهاد immutable با Deal، previous_offer، offered_by، valid_until و snapshot شرایط؛ پذیرش فقط یک نسخه معتبر.', 'پذیرش پیشنهاد، خودبه‌خود عرضه را نبندد؛ زنجیره نسخه‌ها و انقضا در تراکنش قفل‌شده کنترل شوند.'),
  Contract: addition('شماره یکتا، Deal، accepted_offer، شرایط snapshot، وضعیت و finalized_at؛ قرارداد قطعی شرط بستن عرضه است.', 'در قطعیت، Property/Listing و قراردادهای رقیب قفل شوند؛ برای یک ملک قرارداد قطعی ناسازگار دوم رد شود؛ سوابق پولی حفظ شوند.'),
  ContractParty: addition('طرف قرارداد با FK Contact و snapshot هویت/نقش هنگام تنظیم؛ ویرایش Contact سند قطعی را تغییر ندهد.', 'امضاکنندگان از طرفین تأییدشده Deal ساخته شوند؛ مالکیت به‌تنهایی اختیار امضا را اثبات نمی‌کند.'),
  ContractSignature: addition('FK به ContractParty، وضعیت، زمان و ثبت‌کننده؛ قید جلوگیری از امضای تکراری.', 'امضای Sample فقط نمایشی است؛ در محصول واقعی روش امضا و مدارک احراز آن باید جدا مشخص شوند.'),
  ContractAttachment: addition('فایل واقعی با storage key، original_name، size، checksum و uploaded_by؛ دسترسی از قرارداد ارث ببرد.', 'Sample فقط نام فایل نگه می‌دارد؛ آن را آپلود واقعی تلقی نکنید؛ فایل‌های قدیمی بدون مدرک به قرارداد متصل نشوند.'),
  ContractAmendment: addition('reason، effective_at، previous/new terms_snapshot و وضعیت تأیید؛ سند قطعی بازنویسی نشود.', 'تغییر دارای اثر مالی با ثبت تعدیل/برگشت مستقل هماهنگ شود؛ تاریخچه سند قبلی بماند.'),
  CommissionPolicyVersion: addition('نسخه immutable سیاست با خانواده معامله، نرخ/مبلغ، تاریخ اثر و قواعد سهم؛ واحد پول مشخص.', 'فقط سیاست واقعی مصوب seed شود؛ اعداد نمونه تعرفه عملیاتی نیستند.'),
  Commission: addition('مطالبه کمیسیون از debtor_contact بر اساس Contract و PolicyVersion؛ مبلغ Decimal و snapshot محاسبه.', 'ارزش معامله، مطالبه، وصول و مانده مجزا؛ شناسه مبنا جلوی تولید دوباره مطالبه را بگیرد.'),
  CommissionShare: addition('سهم ذی‌نفع از مطالبه با beneficiary و amount؛ تأیید و پرداخت مستقل.', 'جمع سهم از سقف مجاز بیشتر نشود؛ وصول مشتری با پرداخت سهم کارمند یکی نشود.'),
  Payment: addition('IN/OUT، payer/payee، amount، paid_at، status، reference و reversal_of؛ برگشت مستقل و غیرقابل حذف.', 'شناسه یکتای عملیات به کاربر/فرمان/ورودی bind شود؛ ثبت مالی در transaction و مبلغ Decimal با واحد مشخص انجام شود.'),
  PaymentAllocation: addition('رابط دریافت/پرداخت با مطالبه یا سهم و مبلغ تخصیص؛ بیش از مانده/مبلغ پرداخت رد شود.', 'سطرهای مربوط با select_for_update قفل شوند؛ IN به مطالبه و OUT به سهم درست وصل شود؛ برگشت، تخصیص و مانده را هماهنگ کند.'),
  StageTransitionHistory: addition('موضوع معتبر، from_stage، to_stage، reason، changed_by_id، changed_at و operation_id؛ append-only.', 'از ActivityLog آزاد، مراحل قدیمی حدس زده نشوند؛ برای رخدادهای جدید همراه فرمان دامنه ثبت شود.'),
  Notification: existing('notifications/models.py · Notification',
    'user، type، title، message، is_read و metadata موجودند؛ لینک موضوع در metadata است.',
    'نوع‌های جدید workflow و موضوع معتبر/operation_id اضافه شوند؛ read_at در صورت نیاز؛ اعلان فقط برای افراد مجاز.',
    'اعلان‌های فعلی حفظ شوند؛ در transaction ثبت یا پس از commit از outbox ارسال شود؛ retry اعلان تکراری نسازد.'),
  ActivityLog: existing('activity/models.py · ActivityLog',
    'user، action، target_type، target_id عددی، description و metadata؛ target_id فاقد FK به موضوع است.',
    'operation_id، حوزه و مرجع موضوع معتبر اضافه شود؛ برای idempotency واقعی جدول CommandReceipt با key، actor، action، request_hash و result پیشنهاد می‌شود.',
    'ActivityLog جای تاریخچه تخصصی یا قید FK نیست؛ metadata قبلی حفظ شود؛ هش ورودی به‌جای ذخیره متن حساس درخواست؛ رویدادهای تاریخی قابل ویرایش عمومی نباشند.'),
  District: existing('basics/models.py · District / City / Province',
    'سلسله‌مراتب جغرافیایی و قید یکتایی تعریف پایه موجود است.',
    'از FK فعلی استفاده کنید؛ District جغرافیایی را با ManagementScope سازمانی یکی نکنید.',
    'نام‌های آزاد neighborhood را با صف تطبیق به district وصل کنید؛ شناسه‌های فعلی باقی بمانند.'),
  PropertyType: existing('basics/models.py · PropertyType',
    'تعریف پویا با property_usage و روابط Attribute/SearchAttribute موجود است.',
    'property_type_ref مرجع نوع ملک شود؛ property_type قدیمی صرفاً سازگاری موقت.',
    'enum قدیمی به FK با جدول نگاشت صریح منتقل شود؛ انتخاب‌های ناشناخته نیازمند اصلاح‌اند.'),
  PropertyUsage: existing('basics/models.py · PropertyUsage',
    'تعریف کاربری پویا موجود است.',
    'سازگاری Property.property_usage با PropertyType.property_usage در serializer و سرویس کنترل شود.',
    'تعاریف فعال موجود و روابط ویژگی‌ها حفظ شوند؛ جدول موازی از روی mock ساخته نشود.'),
  RegistrationRequestDealType: addition('رابط درخواست اولیه و DealType؛ یک درخواست می‌تواند چند نوع عرضه مطلوب داشته باشد.', 'رابط جدید است؛ deal_type ملک قدیمی را بدون درخواست معتبر به آن منتقل نکنید؛ pair یکتا باشد.'),
  InquiryDistrict: addition('رابط یکتای Inquiry/District برای چند محله مطلوب؛ FK به District فعلی.', 'نام محله JSON یا متن آزاد جایگزین FK نشود؛ داده واقعی از ثبت درخواست ایجاد شود.'),
  InquiryPropertyType: addition('رابط یکتای Inquiry/PropertyType برای چند نوع ملک مطلوب؛ FK به تعریف پایه فعلی.', 'از جدول PropertyType موجود استفاده کنید؛ داده عملیاتی seed نشود.'),
};

// Requirements refreshed from Sample, not a fresh inspection of ZaminexB.
backendGap.Property.change = "بررسی مستقل ملک با review_status، نسخه ارسال، زمان/عامل تصمیم و سابقه snapshot ملک و کارشناسی اضافه شود؛ تأیید بدون Listing ممکن باشد. مسئول ملک از پرونده پذیرفته‌شده و عنوان از عملیات مدیر خوانده شود.";
backendGap.Listing.change = "رابطه چند فایل با ملک با UNIQUE(property,deal_type)؛ نسخه شرایط و سابقه قیمت مستقل؛ مالکیت از مسئول فعلی پرونده. ساخت/ویرایش فقط پس از تأیید Property؛ فعال‌سازی با شرایط معتبر. تأیید مستقل فایل طراحی نشود.";
backendGap.ListingReview.change = "این مدل مربوط به طرح قدیمی Sample است؛ مسیر جدید PropertyReview است. وجود یا نبود مدل تازه در بک‌اند بعد از snapshot بررسی نشده؛ برای مسیر جاری جدول بررسی مستقل Listing لازم نیست.";
backendGap.PropertyReview = addition("سابقه بررسی خود ملک با FK ملک، نسخه ارسال، snapshot ملک و کارشناسی، ارسال‌کننده، تصمیم و دلیل و مدیر؛ در Sample review_history توکار است. این نیاز از تغییرات ۱۹ اکتبر استخراج شده و وجود آن در بک‌اند امروز بررسی نشده است.", "تصمیم معتبر قدیمی فقط با سند نسخه و مالکیت قابل اتکا منتقل شود؛ داده مبهم تأیید خودکار نشود؛ سابقه فایل قدیمی حذف نشود.");
backendGap.Offer.change = "طرح قدیمی پیشنهاد قیمت؛ در Sample فعلی submitOffer و acceptOffer خطا می‌دهند. برای مسیر جاری، نتیجه موفق/ناموفق مذاکره و مبلغ/شرایط قرارداد پیاده شود؛ مدل Offer شرط راه‌اندازی مسیر فعلی نیست.";
backendGap.Deal.change = "مذاکره متصل به Inquiry و Listing دقیق؛ موفقیت با succeedDeal و مرحله AGREED، عدم توافق با دلیل؛ کار آماده‌سازی قرارداد ساخته شود. مبلغ توافق در قرارداد است و accepted_offer پیش‌نیاز اجباری مسیر جاری نیست.";
backendGap.Contract.change = "قرارداد از مذاکره موفق با شرایط و مبلغ نسخه‌دار و snapshot طرفین؛ قبل از امضا قابل اصلاح، پس از امضا محافظت‌شده؛ قطعی‌سازی اتمیک با کنترل امضاها و قرارداد ناسازگار ملک؛ accepted_offer شرط اجباری مسیر جاری نیست.";

backendGap.PropertyRegistrationRequest.change += ' چرخه CLOSED/CANCELLED/DUPLICATE و بازگشایی با سابقه معتبر اضافه شود؛ تکمیل کارشناسی با بستن کل پرونده یکی نیست. آثار وابسته و تاریخچه و اعلان اتمیک؛ قرارداد امضاشده/قطعی محافظت شود.';

export function exportBackendGap() {
  const escape = value => String(value).replace(/\|/g, '\\|').replace(/\n/g, '<br/>');
  const lines = [
    '## مقایسه با بک‌اند موجود ZaminexB',
    `تاریخ بررسی منبع: ${backendReviewDate}. این مبنا snapshot مدل‌هاست و در ۱۹ اکتبر بررسی زنده نشده؛ نیازهای مقصد بر اساس Sample به‌روز شده‌اند. وجود مدل، تکمیل API یا گردش کار را اثبات نمی‌کند؛ migration یا تغییر بک‌اند اجرا نشده است.`,
    'نام جدول‌ها و UUID در فرهنگ مدل‌ها مفهومی‌اند؛ PK و db_table فعلی جنگو را حفظ کنید مگر با طرح مهاجرت مستقل. APIهای /api/v1 پیشنهادی‌اند و مسیرهای موجود نیستند.',
    '|مدل پیشنهادی|وضعیت و منبع موجود|وضعیت فعلی|تغییر لازم|مهاجرت و کنترل پذیرش|',
    '|---|---|---|---|---|',
  ];
  for (const [name, gap] of Object.entries(backendGap)) {
    lines.push(`|${[name, gap.status + '؛ ' + gap.source, gap.current, gap.change + ' فیلدهای مقصد: ' + modelCatalog[name].fields.map(f => f.name).join(', '), gap.migration].map(escape).join('|')}|`);
  }
  return lines.join('\n');
}
