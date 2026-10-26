> **مرجع تطبیق جدید — ۲۰ اکتبر ۲۰۲۶:** [راهنمای جامع و شواهد کد](docs/developer/README.fa.md). این فایل سابقه طرح است؛ ادعاهای قدیمی درباره وجود Contact، PropertyRegistrationRequest و ManagementScope در backend با checkout فعلی تأیید نشدند. برای تفکیک پیاده‌سازی واقعی، mock و پیشنهاد، به بسته جدید رجوع کنید.

# مرجع پیشنهادی بک‌اند Crm گروه سرمایه گذاری کلان فردا
این سند از راهنمای محلی نمونه تولید شده است؛ API و دیتابیس واقعی در این نمونه پیاده نشده‌اند.
# راهنمای تحویل Sample به تیم توسعه

تاریخ تطبیق Sample: 2026-10-20؛ مبنای مقایسه ZaminexB: 2026-10-18 (بررسی مجدد نشده).

این بسته برای تحویل Sample به تیم توسعه است. وضعیت Sample از کد ۲۰ اکتبر ۲۰۲۶ استخراج شده؛ اطلاعات ZaminexB از بازبینی ثبت‌شده ۱۸ اکتبر ۲۰۲۶ است و بررسی زنده امروز نیست.

Sample یک React/Vite با store محلی مرورگر است. تغییر کاربر نمایشی احراز هویت واقعی نیست؛ عملیات در services/operations.js اجرا می‌شوند و APIهای /api/v1 صرفاً قرارداد پیشنهادی‌اند.

بک‌اند از صفر شروع نمی‌شود: هویت و گروه‌های Django، اشخاص، رنج و عضویت، درخواست ثبت ملک، ملک، فایل عرضه، تعاریف پایه، وظیفه، پیگیری، اعلان و فعالیت در مبنای بررسی وجود دارند؛ وجود مدل به معنی تکمیل API، مجوز، تراکنش یا گردش جدید نیست.

بخش‌های توسعه اصلی عبارت‌اند از پذیرش و ارجاع نسخه‌دار، بررسی مستقل ملک، فایل‌های چندنوعی، نیاز متقاضی و تطبیق، معرفی و بازدید، مذاکره و قرارداد، کمیسیون و تخصیص وجوه. وضعیت مدل‌به‌مدل و منبع در تب تغییرات ZaminexB آمده است.

مرجع دسترسی عملیاتی مسئول فعلی پرونده پس از پذیرش است؛ ثبت‌کننده سرنخ مالک عملیات نیست. گروه اجازه اقدام و عضویت فعال رنج دامنه داده را تعیین می‌کند. فهرست، جزئیات، فرمان، شمارش و گزارش باید همین سیاست را اعمال کنند.

تأیید متعلق به Property و گزارش کارشناسی است. پس از تأیید، برای هر زوج ملک و نوع معامله حداکثر یک Listing ساخته یا ویرایش می‌شود. قیمت و شرایط هر فایل مستقل‌اند؛ فایل تأیید مدیریتی مستقل ندارد.

درخواست متقاضی با همان اجزای پرونده ملک به صورت مرحله‌ای و با سوابق و کار/پیگیری مودالی اجرا می‌شود؛ نیاز و بودجه با saveInquiryNeeds و وضعیت با changeInquiryCaseStatus ثبت شوند. بستن نیاز مشتری فایل ملک را متوقف نمی‌کند. هر فایل معرفی‌شده مسیر مستقل بازدید/مذاکره دارد.

سوابق ملک محل ثبت نتیجه بازدید و مذاکره است؛ بازدید مناسب → شروع مذاکره مرتبط → موفق/ناموفق. موفقیت، کار تنظیم قرارداد برای مدیرکل ایجاد می‌کند؛ دسترسی خود قرارداد و امضا و اصلاحیه فقط GENERAL_MANAGER است.

مسیر جاری مذاکره، ثبت نتیجه موفق/ناموفق و سپس تعیین مبلغ در قرارداد است. Offer و endpointهای قدیمی submitOffer/acceptOffer سابقه طرح‌اند؛ در Sample فعلی خطا می‌دهند و مسیر پذیرش محصول نیستند.

معیار تحویل سرور: احراز هویت واقعی، مجوز رکورد و حوزه، اعتبارسنجی دامنه، تراکنش، کنترل تعارض نسخه و تکرار امن، تاریخچه معتبر و آزمون هم‌زمانی. وجود شبیه‌سازی محلی اثبات این موارد در سرور نیست.


## ترتیب اجرا و معیار تحویل

1. ابتدا وضعیت واقعی شاخه و محیط ZaminexB را با snapshot تاریخ‌دار تطبیق دهید؛ serializer، view، route، permission و تست هر مدل موجود را بررسی و اختلاف را ثبت کنید. این بسته ممیزی جدید بک‌اند نیست.

2. هویت و گروه‌ها، عضویت رنج، حوزه دسترسی و نگاشت شناسه/enum موجود را تثبیت کنید. شناسه‌های واقعی را صرفاً برای شبیه‌شدن به mock به UUID تبدیل نکنید.

3. پذیرش مدیر، ارجاع، پذیرش مسئول، رد، تمدید و انتقال رنج را با Task و history اتمیک پیاده کنید؛ سپس کارشناسی و بررسی مستقل Property را متصل کنید.

4. Listing چندنوعی، اعتبار شرایط، snapshot معرفی و projection عمومی امن را تکمیل کنید؛ داده قدیمی مبهم را برای تعیین تکلیف نگه دارید، خودکار تأیید یا حذف نکنید.

5. نیاز متقاضی، تطبیق، معرفی، بازدید و پیگیری را بسازید؛ سپس نتیجه مذاکره، قرارداد، امضا و قطعی‌سازی را به هم متصل کنید.

6. کمیسیون، وصول، تخصیص و پرداخت سهم را جدا پیاده کنید؛ قفل و آزمون رقابت مالی و قرارداد ناسازگار پیش از بهره‌برداری الزامی‌اند.

7. برای هر صفحه، حالت بدون داده، خطای اعتبارسنجی، عدم مجوز، تعارض نسخه، لینک مستقیم، refresh و برگشت از پنجره فرزند را بررسی کنید؛ داده نمونه و حساب نمایشی وارد محیط عملیاتی نشود.


## راهنمای صفحه‌به‌صفحه


### /dashboard

مسئول: همه کاربران در حوزه مجاز

جریان: ورود ← آمار و کارهای مرتبط ← رفتن به پرونده یا کارتابل

معیار پذیرش: شمارش از همان رکوردهای مجاز؛ ثمن معامله، کمیسیون و وصول جدا.

منبع در Sample: src/App.jsx


### /tasks

مسئول: فقط مسئول همان وظیفه

جریان: کارهای من ← موضوع وظیفه ← فرم اقدام ← ثبت نتیجه

معیار پذیرش: تکمیل عمومی جای نتیجه بازدید یا پیگیری را نگیرد؛ موعدها هماهنگ باشند.

منبع در Sample: src/features/SecondaryPages.jsx


### /lead-submit

مسئول: مشاور با عضویت فعال رنج

جریان: ثبت مشخصات حداقلی ملک یا متقاضی ← پذیرش مدیر رنج

معیار پذیرش: رنج از عضویت استخراج شود؛ ثبت ملک، Property/Listing تأییدشده نسازد.

منبع در Sample: src/features/IntakeWorkspace.jsx


### /leads

مسئول: مدیر رنج مسئول و مدیر کل

جریان: سرنخ پذیرفته‌شده ← تعیین مسئول و موعد ← انتظار پذیرش مشاور

معیار پذیرش: ثبت مدیر مستقیم آماده ارجاع است؛ سرنخ مشاور قبل از پذیرش در کارتابل مدیر می‌ماند.

منبع در Sample: src/features/IntakeWorkspace.jsx


### /inbox

مسئول: مسئول ارجاع و مدیر حوزه متناسب با اقدام

جریان: پذیرش سرنخ مدیر / پذیرش یا رد ارجاع / بررسی تمدید / بررسی ملک

معیار پذیرش: lead_status، acceptance_status، assigned_at و due_at مستقل؛ درخواست تمدید تا تأیید موعد را تغییر ندهد.

منبع در Sample: src/features/IntakeWorkspace.jsx


### /pipelines

مسئول: مشاور مسئول؛ مدیر در حوزه خودش

جریان: انتخاب چرخه ← مشاهده مرحله ← اقدام مجاز ← ثبت موفق ← تازه‌شدن فهرست و کارت

معیار پذیرش: مشاور صف پذیرش مدیر را نبیند؛ مراحل پایانی در فهرست بمانند؛ drag مرحله را مستقیم تغییر ندهد.

منبع در Sample: src/features/PipelineWorkspace.jsx; src/services/pipelines.js


### /teams

مسئول: مدیر مجاز رنج‌ها

جریان: رنج ← اعضای فعال و سوابق ← تغییر عضویت یا انتقال پرونده با فرمان مستقل

معیار پذیرش: تغییر عضویت، تغییر مسئول و انتقال رنج یک عمل نیستند؛ داده وابسته همسو شود.

منبع در Sample: src/features/SecondaryPages.jsx


### /staff

مسئول: مدیر دارای مجوز کارکنان

جریان: هویت کاربر ← پروفایل ← گروه‌ها ← عضویت رنج

معیار پذیرش: حساب غیرفعال مسئول جدید نشود؛ گروه با رنج اشتباه نشود؛ مدیریت نمایشی معادل IAM واقعی نیست.

منبع در Sample: src/features/SecondaryPages.jsx


### /groups

مسئول: دارنده مجوز مدیریت گروه

جریان: گروه و مجوز ← تخصیص به کاربر ← اعمال بر منو، مسیر و عملیات

معیار پذیرش: منع مستقیم URL و فرمان لازم است؛ مخفی‌کردن منو کافی نیست.

منبع در Sample: src/features/SecondaryPages.jsx; src/services/intake.js


### /contacts

مسئول: کاربر مجاز در ارتباط با پرونده

جریان: جست‌وجوی شخص ← بررسی شماره تکراری ← ایجاد/ویرایش ← پیوند به پرونده

معیار پذیرش: شخص مشترک با نقش‌های متعدد؛ شماره مشابه مجوز ادغام یا افشای مالک نیست.

منبع در Sample: src/App.jsx; src/services/operations.js


### /requests

مسئول: مشاور مسئول پذیرفته‌شده و مدیر حوزه

جریان: فهرست هماهنگ با ویزارد ← مشاهده مرحله و مسئول ← requests/{id} با مسیر مرحله‌ای مشترک ← اقدام مجاز؛ view=history برای سوابق و گزینه‌های بیشتر

معیار پذیرش: فیلتر و صفحه‌بندی و کاریز حفظ شوند؛ مرحله از همان پرونده/ملک محاسبه شود؛ ثبت و ارسال و تصمیم مدیر مسیر موازی نداشته باشند.

منبع در Sample: src/features/PropertyRequestsList.jsx; src/features/PropertyFlowWizard.jsx


### /reviews

مسئول: مدیر رنج ملک یا مدیر کل

جریان: صف Propertyهای PENDING ← بررسی نسخه و گزارش ← تأیید یا برگشت با دلیل

معیار پذیرش: تأیید بدون Listing ممکن باشد؛ عنوان لازم است؛ تغییر version پس از ارسال تصمیم را رد کند.

منبع در Sample: src/features/PropertyWorkspace.jsx


### /properties

مسئول: مشاور مسئول فعلی و مدیر طبق حوزه

جریان: املاک تأییدشده ← جزئیات ملک ← فایل‌های همان ملک ← ثبت نوع معامله

معیار پذیرش: ثبت‌کننده ملاک دسترسی نباشد؛ مشاور قبلی بعد از انتقال دسترسی عملیاتی نداشته باشد.

منبع در Sample: src/features/PropertyWorkspace.jsx; src/services/property-listings.js


### /listings

مسئول: مشاور مسئول؛ مدیر کل با شرایط سرویس

جریان: ملک تأییدشده ← انتخاب نوع معامله ← ایجاد یا ویرایش فایل همان نوع ← ACTIVE یا PAUSED

معیار پذیرش: زوج property_id/deal_type_id یکتا؛ نسخه و تاریخچه شرایط حفظ شود؛ فایل‌های دیگر تغییر نکنند.

منبع در Sample: src/features/PropertyWorkspace.jsx


### /explore

مسئول: کاربر دارای دسترسی به اکسپلور

جریان: فایل فعال قابل عرضه از مشاوران ← جزئیات عمومی ← انتخاب شناسه دقیق فایل در معرفی

معیار پذیرش: خواندنی؛ اطلاعات محرمانه مالک و نشانی خصوصی نمایش داده نشود؛ مجوز ویرایش ایجاد نکند.

منبع در Sample: src/features/PropertyWorkspace.jsx; src/services/operations.js


### /inquiries

مسئول: مسئول نیاز پس از پذیرش و مدیر حوزه

جریان: تکمیل نیاز و بودجه هر نوع ← تطبیق ← معرفی صریح فایل ← پیگیری تا قرارداد

معیار پذیرش: GET تطبیق معرفی نسازد؛ شروط ضروری و دلیل عدم تطبیق مشخص باشند.

منبع در Sample: src/App.jsx; src/services/operations.js


### /introductions

مسئول: مسئول نیاز مجاز

جریان: انتخاب listing_id دقیق ← snapshot شرایط ← ثبت بازخورد ← بازدید یا مذاکره

معیار پذیرش: شناسه اولین فایل ملک جای انتخاب واقعی استفاده نشود؛ تغییر قیمت سابقه معرفی را عوض نکند.

منبع در Sample: src/components/ManualListingIntroduction.jsx; src/services/operations.js


### /viewings

مسئول: مشاور بازدید مجاز

جریان: معرفی ← زمان و مسئول بازدید ← ثبت نتیجه ← مذاکره در صورت مجازبودن

معیار پذیرش: بازدید مشتری با کارشناسی ملک فرق دارد؛ ثبت نتیجه Task مرتبط را هم تکمیل کند.

منبع در Sample: src/components/ViewingCalendar.jsx; src/services/operations.js


### /followups

مسئول: مسئول پیگیری

جریان: موضوع و شخص ← زمان و اقدام ← انجام یا تعویق با دلیل ← نتیجه و اقدام بعدی

معیار پذیرش: تاریخچه تعویق حذف نشود؛ زمان وظیفه و پیگیری یکسان بماند.

منبع در Sample: src/components/CaseActivities.jsx; src/services/operations.js


### /deals

مسئول: مسئول مذاکره و مدیر مجاز

جریان: معرفی معتبر ← مذاکره ← نتیجه موفق یا ناموفق ← قرارداد برای نتیجه موفق

معیار پذیرش: succeedDeal مرحله AGREED می‌سازد؛ closeDeal دلیل می‌خواهد؛ مبلغ توافق در قرارداد است.

منبع در Sample: src/services/operations.js; src/services/action-availability.js


### /contracts

مسئول: مسئول قرارداد و نقش مجاز سرویس

جریان: مذاکره موفق ← شرایط و مبلغ ← طرفین و پیوست ← امضاها ← قطعی‌سازی ← اصلاحیه در صورت نیاز

معیار پذیرش: پس از امضا شرایط آزادانه عوض نشود؛ قرارداد ناسازگار دوم رد شود؛ امضای mock امضای حقوقی نیست.

منبع در Sample: src/App.jsx; src/services/operations.js


### /finance

مسئول: نقش مالی مجاز

جریان: مطالبه کمیسیون ← تأیید سهم ← دریافت و تخصیص ← پرداخت سهم ← برگشت مستقل در صورت اصلاح

معیار پذیرش: تخصیص از وجه/مانده بیشتر نشود؛ پرداخت سهم از وصول مرتبط بیشتر نشود؛ حذف وجه قطعی ممنوع.

منبع در Sample: src/features/SecondaryPages.jsx; src/services/operations.js


### /reports

مسئول: دارنده مجوز گزارش در حوزه مجاز

جریان: انتخاب گزارش و فیلتر ← تجمیع داده مجاز ← مراجعه به منبع

معیار پذیرش: شاخص و واحد پول مشخص؛ ثمن و ودیعه و اجاره در جمع مبهم ادغام نشوند.

منبع در Sample: src/features/SecondaryPages.jsx


### /notifications

مسئول: گیرنده اعلان و کاربر مجاز موضوع

جریان: اعلان شخصی ← بازکردن موضوع مجاز ← ثبت خوانده‌شدن؛ مرور خط زمانی

معیار پذیرش: operation_id مشترک مجوز مشاهده موضوع دیگر نیست؛ اعلان تکراری تولید نشود.

منبع در Sample: src/features/SecondaryPages.jsx


### /settings

مسئول: دارنده مجوز تنظیمات

جریان: نوع معامله با یکی از شش رفتار ← نسخه پیش‌نویس ← انتشار ← استفاده در رکورد جدید

معیار پذیرش: انتشار نسخه جدید snapshot و نسخه پرونده‌های قبلی را تغییر ندهد؛ موتور فرمول دلخواه وجود ندارد.

منبع در Sample: src/features/SecondaryPages.jsx; src/services/operations.js


### /guide

مسئول: تیم توسعه و تحلیل محصول

جریان: راهنمای کلی ← جریان کامل ← راهنمای صفحه ← مدل/API ← فاصله با ZaminexB

معیار پذیرش: موجود، پیشنهادی، سازگاری قدیمی و نیاز توسعه جدا باشند؛ snapshot backend با بررسی امروز اشتباه نشود.

منبع در Sample: src/features/developerGuide/


### /property-register

مسئول: ثبت‌کننده، مدیر رنج و مشاور مسئول؛ هر کدام در مرحله خودش

جریان: ثبت سرنخ ← پذیرش مدیر ← ارجاع ← پذیرش مشاور ← کارشناسی ← تأیید ملک ← ساخت فایل عرضه

معیار پذیرش: مرحله از داده واقعی مشتق می‌شود؛ فرم‌های قبلی باقی‌اند؛ آخرین پرونده هر کاربر برای ادامه مسیر مشخص است؛ تصمیم مدیر و ثبت شرایط عرضه قابل دورزدن نیست.

منبع در Sample: src/features/PropertyFlowWizard.jsx; src/services/property-wizard.js
# جریان کامل CRM فردا

مبنای رفتار: Sample در 2026-10-20؛ قرارداد سرور پیشنهادی است.


## پذیرش و ارجاع مشترک

سرنخ مشاور → پذیرش مدیر → ارجاع و موعد → پذیرش مسئول → چرخه عملیاتی

1. createLead برای مشاور رنج را از عضویت می‌گیرد؛ مدیر مسئول مستقیماً سرنخ پذیرفته‌شده می‌سازد. acceptLead کار پذیرش مدیر را تکمیل می‌کند.

2. assignCase مسئول و موعد را ثبت می‌کند. acceptAssignment فقط برای مسئول فعلی است؛ rejectAssignment دلیل دارد و پرونده را برای تعیین تکلیف به مدیر برمی‌گرداند.

3. ارجاع بی‌پاسخ بعد از ۴۸ ساعت از assigned_at قابل تعویض است؛ پس از رد می‌توان دوباره ارجاع داد. postponeAssignment درخواست تمدید پس از پذیرش و انقضای موعد است؛ approveAssignmentExtension موعد را تغییر می‌دهد و rejectAssignmentExtension موعد قبلی را حفظ می‌کند.

4. transferScope و تغییر مسئول باید پرونده، ملک، همه فایل‌ها، وظایف و دسترسی قبلی را هماهنگ کنند. عامل و زمان از نشست سرور تعیین شوند.


## تأمین ملک و فایل عرضه

پرونده پذیرفته‌شده → کارشناسی → بررسی ملک → ملک تأییدشده → فایل‌های مستقل → اکسپلور

1. startAppraisal / saveWorkspace مشخصات ملک و گزارش را ذخیره می‌کنند؛ Listing ساخته نمی‌شود. عنوان با setPropertyTitle در اختیار مدیر است.

2. submitPropertyForReview آدرس، منطقه، متراژ مثبت و گزارش کامل را بررسی و snapshot ملک و کارشناسی و نسخه ارسالی را نگه می‌دارد؛ درخواست PENDING_REVIEW می‌شود.

3. reviewProperty با APPROVED عنوان و تطابق نسخه را لازم دارد؛ درخواست COMPLETED و ملک قابل استفاده می‌شود. CHANGES_REQUIRED دلیل می‌خواهد و پس از اصلاح باید دوباره ارسال شود. تأیید، فایل جدید نمی‌سازد و فایل متوقف را خودکار فعال نمی‌کند.

4. savePropertyListing فقط روی ملک تأییدشده دارای مسئول فعال اجرا می‌شود. نوع فعال و نسخه منتشرشده و شرایط معتبر لازم‌اند؛ فایل همان نوع ویرایش و سابقه قیمت حفظ می‌شود؛ چند رکورد قدیمی هم‌نوع نیازمند تعیین تکلیف مدیرند.

5. نمای عمومی از فایل ACTIVE معتبر و ملک تأییدشده ساخته می‌شود. معرفی و مذاکره به listing_id دقیق وابسته‌اند؛ شرایط یک فایل روی فایل دیگر نوشته نشود.

6. reopenAppraisal گزارش قبلی را حفظ و عرضه را تا تأیید مجدد متوقف می‌کند؛ پرونده دارای قرارداد قطعی به عرضه بازنمی‌گردد. markDuplicateCase با دلیل و پیوند پرونده اصلی سابقه را نگه می‌دارد و ادغام خودکار ندارد.


## متقاضی تا بازدید

نیاز پذیرفته‌شده → معیار و بودجه → تطبیق → معرفی → بازخورد / بازدید → مذاکره

1. هر Contact می‌تواند چند Inquiry داشته باشد؛ ترجیح هر نوع معامله بودجه مستقل دارد. تطبیق شرط ضروری، منطقه، نوع ملک، متراژ و بودجه را ارزیابی می‌کند.

2. introduceListing فرمان صریح است و introduced_terms_snapshot می‌سازد. خروجی جست‌وجو فقط پیشنهاد است؛ با مشاهده نتیجه، معرفی ثبت نمی‌شود.

3. scheduleViewing بازدید متصل به معرفی و وظیفه هم‌موعد می‌سازد؛ completeViewing نتیجه را ثبت و وظیفه را می‌بندد. follow-up موضوع، زمان، نتیجه و اقدام بعدی مستقل دارد.


## مذاکره و قرارداد

معرفی → NEGOTIATION → AGREED → CONTRACT → FINALIZED؛ یا LOST با دلیل

1. createDeal مذاکره مستقل روی فایل دقیق می‌سازد؛ succeedDeal نتیجه موفق را ثبت و کار آماده‌سازی قرارداد ایجاد می‌کند؛ closeDeal برای عدم توافق دلیل می‌خواهد.

2. createContract و saveContractTerms محل مبلغ و شرایط توافق هستند. submitOffer و acceptOffer در Sample فعلی غیرفعال‌اند؛ مدل Offer صرفاً سابقه طراحی و داده قدیمی است.

3. طرفین و هویت و شرایط در snapshot قرارداد نگه داشته می‌شوند؛ signContract پس از کنترل نقش و طرف انجام می‌شود؛ ویرایش عادی شرایط پس از امضا ممنوع است.

4. finalizeContract امضای همه طرف‌ها، شرایط نوع معامله و عدم قرارداد ناسازگار ملک را کنترل می‌کند؛ بستن فایل، تکمیل نیاز و ثبت آثار وابسته باید اتمیک باشند. اصلاحیه سند قبلی را بازنویسی نمی‌کند.


## مالی، گزارش و سوابق

قرارداد قطعی → مطالبه → سهم‌ها → وصول و تخصیص → پرداخت سهم → گزارش مانده

1. Commission از قرارداد و نسخه سیاست با snapshot محاسبه می‌شود؛ این اعداد نمونه‌اند و تعرفه مصوب محسوب نمی‌شوند.

2. Payment ورودی به مطالبه و خروجی به سهم درست تخصیص می‌یابد؛ مبلغ تخصیص از وجه و مانده بیشتر نمی‌شود. تأیید سهم معادل پرداخت سهم نیست.

3. reversePayment برگشت مرتبط ایجاد می‌کند؛ سند مالی تأییدشده حذف نمی‌شود. گزارش از همان رکوردهای مجاز و با تفکیک ارزش معامله، مطالبه، وصول و پرداخت خوانده می‌شود.

4. StageTransitionHistory، AssignmentHistory و تاریخچه تخصصی همراه فرمان ثبت شوند؛ Notification شخصی با کلید رویداد یکتا ساخته شود. این الزامات سرور نیازمند تراکنش و آزمون رقابت‌اند.
# وضعیت مبنای ZaminexB و کار باقی‌مانده

مبنای موجودی: بررسی مدل‌ها در 2026-10-18. نیاز مقصد: Sample در 2026-10-19. این سند وضعیت زنده شاخه یا سرور امروز را تأیید نمی‌کند.

## تا کجا پیش رفته است؟

زیرساخت هویت، سازمان، شخص، ملک، عرضه و بخشی از کارهای روزمره در مدل‌ها وجود دارد؛ توسعه CRM کامل هنوز به مدل‌ها و فرمان‌های جدید، مجوز حوزه و تراکنش‌های قابل اتکا نیاز دارد. درصد پیشرفت قابل دفاع از موجودی مدل‌ها به دست نمی‌آید؛ API، serializer، permission، migration اجراشده و تست سرور در این نوبت بررسی نشده‌اند.


## هویت، گروه و رنج

موجود در مبنا: User/Group و StaffProfile و ManagementScope/ScopeMembership در مبنای مدل‌ها وجود دارند.

کار لازم: مرجع مجوز گروه‌ها، حذف تدریجی role موازی، کنترل حوزه رکورد و عضویت جاری؛ احراز هویت و endpointهای واقعی دوباره بررسی شوند.


## سرنخ، ارجاع و پذیرش

موجود در مبنا: PropertyRegistrationRequest و AssignmentHistory قابل استفاده‌اند؛ این به معنی وجود جریان پذیرش جدید نیست.

کار لازم: lead_status و acceptance_status مستقل، assigned_at و due_at، رد و تمدید با تصمیم مدیر، وظیفه و تاریخچه انتقال؛ ایجاد Inquiry برای شاخه متقاضی.


## ملک و کارشناسی

موجود در مبنا: Property و گزارش PDF یک‌به‌یک PropertyAppraisalReport موجودند؛ PDF گزارش ساخت‌یافته نیست.

کار لازم: گزارش ساخت‌یافته نسخه‌دار و سابقه کارشناسی مجدد؛ بررسی مستقل ملک و PropertyReview؛ عنوان مدیریتی، مسئول فعلی و snapshot نسخه.


## عرضه و تعاریف معامله

موجود در مبنا: Listing، DealType و تعریف ویژگی‌ها موجودند؛ نسخه منتشرشده رفتار معامله مستقل در مبنا وجود ندارد.

کار لازم: چند فایل مستقل با زوج یکتای ملک/نوع؛ DealTypeVersion، شروط معتبر، تاریخچه قیمت، عرضه پس از تأیید ملک و serializer عمومی امن؛ بدون صف تأیید مستقل فایل.


## متقاضی و ارتباط با عرضه

موجود در مبنا: Contact و راه‌های تماس موجودند؛ Inquiry، Introduction و Viewing مدل مستقل متناظر در snapshot ندارند.

کار لازم: نیاز و ترجیح/بودجه و معیارها، تطبیق توضیح‌پذیر، معرفی صریح با snapshot و بازدید متصل؛ کنترل محرمانگی و listing_id دقیق.


## کارها و پیگیری

موجود در مبنا: Task و FollowUp موجودند؛ موعد Task در مبنا DateField و پیگیری دارای نام متنی و enum قدیمی است.

کار لازم: due_at با ساعت، FK شخص و موضوع معتبر، هماهنگی رویداد و وظیفه، تاریخچه تعویق؛ ساعت قدیمی ناموجود جعل نشود.


## مذاکره و قرارداد

موجود در مبنا: Deal، Contract و اجزای طرفین/امضا/اصلاحیه در snapshot مدل مستقل متناظر ندارند.

کار لازم: مذاکره موفق/ناموفق، قرارداد با مبلغ و شروط، snapshot هویت، محافظت پس از امضا و قطعی‌سازی اتمیک؛ Offer جزو مسیر جاری الزامی نیست.


## مالی، اعلان و گزارش

موجود در مبنا: Notification و ActivityLog موجودند؛ مجموعه مدل‌های کمیسیون، سهم، وجه و تخصیص در snapshot متناظر ندارد.

کار لازم: مطالبه و وصول و پرداخت سهم جدا، برگشت مستقل، قفل مالی و گزارش حوزه‌مند؛ history تخصصی و idempotency فراتر از ActivityLog لازم است.

## مواردی که پیش از برآورد باید تأیید شوند

تیم بک‌اند باید وجود route و serializer هر قابلیت، سیاست واقعی دسترسی، migration اعمال‌شده، داده قدیمی متعارض، پوشش تست، ذخیره و بارگذاری واقعی پیوست، روش امضای معتبر و محیط استقرار را بررسی کند. این موارد با وجود یک مدل یا رفتار نمایشی Sample تأیید نمی‌شوند.

## تغییرات فوری نسبت به راهنمای قبلی

۱. انتقال بررسی از Listing به Property و snapshot گزارش.
۲. حذف ایجاد خودکار فایل در saveWorkspace.
۳. چند فایل نوع‌دار برای ملک تأییدشده و اکسپلور محدود.
۴. مرجع مالکیت مسئول فعلی پذیرفته‌شده، نه created_by.
۵. نتیجه موفق/ناموفق مذاکره و تعیین مبلغ در قرارداد؛ مسیر Offer غیرفعال.
۶. حفظ داده قدیمی، گزارش تعارض و نگاشت تدریجی شناسه و enum؛ بدون حذف یا تأیید خودکار داده مبهم.
## مقایسه با بک‌اند موجود ZaminexB
تاریخ بررسی منبع: 2026-10-18. این مبنا snapshot مدل‌هاست و در ۱۹ اکتبر بررسی زنده نشده؛ نیازهای مقصد بر اساس Sample به‌روز شده‌اند. وجود مدل، تکمیل API یا گردش کار را اثبات نمی‌کند؛ migration یا تغییر بک‌اند اجرا نشده است.
نام جدول‌ها و UUID در فرهنگ مدل‌ها مفهومی‌اند؛ PK و db_table فعلی جنگو را حفظ کنید مگر با طرح مهاجرت مستقل. APIهای /api/v1 پیشنهادی‌اند و مسیرهای موجود نیستند.
|مدل پیشنهادی|وضعیت و منبع موجود|وضعیت فعلی|تغییر لازم|مهاجرت و کنترل پذیرش|
|---|---|---|---|---|
|AssignmentRescheduleHistory|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|تاریخچه تعویق پرونده با FK به درخواست ملک یا متقاضی، موعد قبلی و جدید، دلیل و کارشناس؛ assigned_at مستقل است. فیلدهای مقصد: id, registration_request_id, inquiry_id, request_kind, status, requested_due_at, requested_by_id, requested_at, decided_by_id, decided_at, decision_reason, old_scheduled_at, new_scheduled_at, changed_by_id, changed_at, reason|این پیشنهاد از گردش جدید Sample است و بررسی تازه بک‌اند نیست؛ سابقه داده موجود حفظ شود و فقط رویدادهای واقعی جدید ثبت شوند.|
|User|اصلاح مدل موجود؛ accounts/models.py · User|AbstractUser با role=ADMIN/AGENT؛ groups و user_permissions از جنگو به ارث می‌رسند.|مرجع مجوز را groups/permissions قرار دهید؛ is_admin_role، is_agent_role و limit_choices_to وابسته به role را هم مهاجرت دهید. گروه جای عضویت رنج را نمی‌گیرد. فیلدهای مقصد: id, username, is_active, group_ids|ADMIN/AGENT قدیمی را با بررسی دسترسی واقعی نگاشت کنید؛ ADMIN را خودکار به superuser تبدیل نکنید. دوره سازگاری و سپس حذف role؛ PK فعلی حفظ شود.|
|Group|اصلاح مدل موجود؛ django.contrib.auth.models.Group (از AbstractUser)|گروه و مجوز استاندارد جنگو موجود است؛ مدل groups جدید لازم نیست.|گروه‌های مصوب و permissionهای دامنه را تعریف کنید؛ code در Group استاندارد موجود نیست، نام یکتا یا نگاشت تنظیمات استفاده شود. فیلدهای مقصد: id, code, name, permission_codes|مجوزهای فعلی را حفظ کنید؛ seed فقط گروه و مجوز مصوب، بدون کاربر یا پرونده جعلی.|
|UserGroup|اصلاح مدل موجود؛ accounts/models.py · User.groups (رابط ارث‌رسیده)|رابط چندبه‌چند کاربر و Group از قبل موجود است.|از همان through استاندارد استفاده کنید؛ group_ids صرفاً projection در serializer است، جدول موازی نسازید. فیلدهای مقصد: id, user_id, group_id|شناسه گروه‌ها و روابط قبلی حفظ شود؛ اضافه کردن عضویت گروه با ممیزی مجوز انجام شود.|
|StaffProfile|اصلاح مدل موجود؛ accounts/models.py · ConsultantProfile / AdminProfile|دو پروفایل مستقل با user، full_name، mobile، branch، hired_at و is_active وجود دارد.|پروفایل مشترک کارکنان با OneToOne(user) بسازید؛ شعبه متنی را با رابطه به تعریف شعبه در صورت نیاز جایگزین کنید. گروه و رنج در پروفایل ذخیره نشوند. فیلدهای مقصد: id, user_id, full_name, mobile, avatar, hired_at, notes|پروفایل‌های تکراری یک user و موبایل‌های متعارض را گزارش کنید؛ فایل تصویر و مسیر رسانه حفظ شود؛ APIهای consultant_profile/admin_profile دوره سازگاری داشته باشند.|
|ManagementScope|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|حوزه عملیاتی مستقل با name، code و is_active؛ مدیر از ScopeMembership فعال خوانده شود. فیلدهای مقصد: id, name, code, description, is_active, created_by_id|رنج واقعی با تأیید مدیر تعریف شود؛ branch آزاد را خودکار رنج فرض نکنید.|
|ScopeMembership|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|FK به user و scope؛ membership_role، joined_at و left_at؛ عضویت بازِ تکراری با constraint مشروط منع شود. فیلدهای مقصد: id, scope_id, user_id, membership_role, joined_at, left_at, assigned_by_id|اعضای واقعی تعیین شوند؛ تغییر گروه، عضویت را جابه‌جا نکند؛ نقش عضویت با گروه مجوز فرق دارد.|
|ScopeTransferHistory|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|انتقال حوزه با from_scope، to_scope، reason، transferred_by_id، transferred_at و operation_id؛ append-only. فیلدهای مقصد: id, property_id, registration_request_id, inquiry_id, from_scope_id, to_scope_id, transferred_by_id, transferred_at, reason, operation_id|انتقال درخواست/ملک/عرضه وابسته در یک transaction؛ مسئول مقصد عضو فعال باشد یا پرونده در صف قرار گیرد؛ عضویت کارمند تغییر نکند.|
|AssignmentHistory|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|تغییر مسئول قبلی/جدید با reason، assigned_by_id و assigned_at؛ مستقل از انتقال رنج. فیلدهای مقصد: id, registration_request_id, property_id, listing_id, inquiry_id, deal_id, previous_assignee_id, new_assignee_id, assigned_by_id, assigned_at, reason, operation_id|سابقه جعلی ایجاد نکنید؛ مسئول فعلی نقطه شروع مهاجرت است؛ وظایف باز مسئول قبلی هماهنگ شوند.|
|Contact|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|هویت شخص حقیقی/حقوقی مستقل از User؛ نام، نوع، شناسه و اطلاعات ارتباطی؛ مالک و متقاضی می‌توانند یک Contact باشند. فیلدهای مقصد: id, person_type, first_name, last_name, company_name, national_id, notes, created_by_id, archived_at, merged_into_id|از owner_* و FollowUp.contact_name نامزد استخراج کنید؛ بدون شماره/شناسه معتبر ادغام خودکار نکنید؛ تعارض‌ها در گزارش بازبینی ثبت شوند.|
|ContactPhone|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|FK به Contact، شماره canonical، نوع و is_primary؛ یکتایی و سیاست شماره مشترک صریح باشد. فیلدهای مقصد: id, contact_id, phone_number, label, is_primary|ارقام فارسی/عربی، +98 و 0098 یکسان‌سازی شوند؛ داده مبهم حذف یا بی‌صدا ادغام نشود.|
|PropertyContact|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|رابط Property و Contact با relation_type، ownership_percent و is_primary؛ سهم در بازه ۰ تا ۱۰۰. فیلدهای مقصد: id, property_id, contact_id, relation_type, ownership_percent, is_primary|owner_first_name/owner_last_name/owner_phone به رابطه تبدیل شوند؛ جمع سهم مالکیت در سرویس قفل‌شده کنترل شود؛ داده قدیمی تا تطبیق حفظ شود.|
|PropertyRegistrationRequest|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|درخواست حداقلی پیش از ایجاد Property با contact، scope، assigned_to، description، status و due_at؛ تبدیل به ملک قابل ردیابی باشد. چرخه CLOSED/CANCELLED/DUPLICATE و بازگشایی با سابقه معتبر اضافه شود؛ تکمیل کارشناسی با بستن کل پرونده یکی نیست. آثار وابسته و تاریخچه و اعلان اتمیک؛ قرارداد امضاشده/قطعی محافظت شود. فیلدهای مقصد: title, title_set_by_id, title_set_at, title_history, duplicate_of_id, duplicate_decided_by_id, duplicate_decided_at, reopened_by_id, reopened_at, reappraisal_history, lead_status, lead_accepted_by_id, lead_accepted_at, id, code, contact_id, initial_contact_name, initial_contact_phone, source, source_details, district_id, approximate_address, property_type_id, requested_deal_type_ids, description, management_scope_id, assigned_to_id, priority, due_at, status, resulting_property_id, created_by_id, created_at, closed_at, closure_reason, case_close_snapshot, case_status_history|برای املاک قبلی درخواست ساختگی با تاریخچه اختراعی نسازید؛ رابطه legacy می‌تواند nullable باشد؛ درخواست جدید از مسیر واقعی ایجاد شود.|
|Property|اصلاح مدل موجود؛ properties/models.py · Property|consultant، owner_*، property_type قدیمی، property_type_ref، property_usage، district، neighborhood، price منسوخ، deal_type و وضعیت عرضه در یک مدل هستند.|بررسی مستقل ملک با review_status، نسخه ارسال، زمان/عامل تصمیم و سابقه snapshot ملک و کارشناسی اضافه شود؛ تأیید بدون Listing ممکن باشد. مسئول ملک از پرونده پذیرفته‌شده و عنوان از عملیات مدیر خوانده شود. فیلدهای مقصد: id, internal_code, title, management_scope_id, consultant_id, property_type_id, property_usage_id, district_id, address, latitude, longitude, area, rooms, floor, built_year, description, record_status, attribute_values, images, version, review_status, review_submitted_version, review_requested_at, reviewed_at, reviewed_by_id, review_reason|price/deal_type/property_type/neighborhood را پیش از حذف با Listing و مراجع تطبیق دهید؛ SOLD/RESERVED و CLOSED نمونه را مستقیم معادل نگیرید؛ فیلد nullable، backfill، گزارش تعارض، سپس constraint.|
|PropertyAppraisal|اصلاح مدل موجود؛ properties/models.py · PropertyAppraisalReport|مدل موجود فایل PDF یک‌به‌یک با Property است؛ گزارش ساخت‌یافته کارشناسی نیست.|گزارش بازدید PropertyAppraisal با appraiser_id، findings، scheduled_at و completed_at جدا تعریف شود؛ قیمت کارشناسی جزو فرم جاری نیست و مبلغ پیشنهادی در Listing ثبت می‌شود؛ PDF موجود پیوست گزارش باقی بماند. فیلدهای مقصد: id, registration_request_id, property_id, appraiser_id, scheduled_at, performed_at, status, findings, estimated_price, valuation_notes, report_attachments, completed_at|PDF را به متن findings یا قیمت تخمینی تبدیل نکنید؛ داده قدیمی به‌عنوان گزارش legacy حفظ شود؛ برای چند نوبت کارشناسی رابطه یک‌به‌چند در نظر بگیرید.|
|Listing|اصلاح مدل موجود؛ listings/models.py · Listing|FK به Property و DealType؛ status پیش‌فرض ACTIVE، sale_price/deposit/monthly_rent، price_details، assigned_to، review_requested_at و rejection_reason.|رابطه چند فایل با ملک با UNIQUE(property,deal_type)؛ نسخه شرایط و سابقه قیمت مستقل؛ مالکیت از مسئول فعلی پرونده. ساخت/ویرایش فقط پس از تأیید Property؛ فعال‌سازی با شرایط معتبر. تأیید مستقل فایل طراحی نشود. فیلدهای مقصد: id, code, property_id, registration_request_id, assigned_to_id, created_by_id, deal_type_id, deal_type_version_id, title, description, sale_price, deposit, monthly_rent, additional_terms, review_status, status, review_requested_at, approved_by_id, approved_at, rejection_reason, terms_snapshot, version, closed_at, closure_reason|عرضه‌های ACTIVE قدیمی را بی‌صدا draft نکنید؛ شاخه legacy یا بازبینی مصوب مشخص شود. SOLD با CLOSED نمونه نگاشت صریح شود؛ FK فعلی property از CASCADE برای سوابق قراردادی به سیاست حفاظتی بازبینی شود.|
|ListingReview|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|این مدل مربوط به طرح قدیمی Sample است؛ مسیر جدید PropertyReview است. وجود یا نبود مدل تازه در بک‌اند بعد از snapshot بررسی نشده؛ برای مسیر جاری جدول بررسی مستقل Listing لازم نیست. فیلدهای مقصد: id, listing_id, submitted_by_id, submitted_at, submitted_version, submitted_snapshot, reviewed_by_id, reviewed_at, decision, reason|review_requested_at/rejection_reason قدیمی سابقه کامل نیست؛ آن را legacy علامت بزنید؛ از ساختن تصمیم/زمان غیرواقعی خودداری کنید.|
|DealType|اصلاح مدل موجود؛ basics/models.py · DealType / DealTypeAttribute|نوع معامله پویا و ویژگی‌های مرتبط از قبل وجود دارد؛ behavior_type و نسخه منتشرشده مستقل ندارد.|code و behavior_type برای شش خانواده تأییدشده اضافه کنید؛ Attribute و روابط فعلی دوباره ساخته نشوند. فیلدهای مقصد: id, code, name, behavior_type, is_active|برای هر DealType واقعی نگاشت رفتار تعیین کنید؛ SALE/RENT قدیمی Property یک مرجع دوم دائمی نباشد؛ داده نامشخص نیازمند بازبینی است.|
|DealTypeVersion|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|نسخه immutable قواعد و فیلدهای نوع معامله با deal_type، version_number، status و published_at؛ unique(deal_type, version_number). فیلدهای مقصد: id, deal_type_id, version_number, status, field_definitions, validation_rules, published_at|از تعریف فعلی یک نسخه مبنا با برچسب مهاجرت بسازید؛ Listing/Inquiry/Offer/Contract به نسخه معین وصل شوند؛ تغییر نسخه، سوابق را عوض نکند.|
|Inquiry|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|درخواست مستقل متقاضی با contact، scope، assigned_to، status و next_action_at؛ هر شخص چند درخواست دارد. فیلدهای مقصد: lead_status, lead_accepted_by_id, lead_accepted_at, id, code, contact_id, management_scope_id, assigned_to_id, district_ids, property_type_ids, min_area, max_area, min_rooms, priority, status, next_action, next_action_at, notes, created_by_id, closed_at, closure_reason, needs_status, needs_confirmed_at, needs_confirmed_by_id, case_close_snapshot, case_status_history|از پیگیری‌های آزاد به‌تنهایی درخواست خرید استنتاج نکنید؛ فقط با داده معتبر/تأیید کاربر منتقل شود.|
|InquiryDealPreference|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|رابط درخواست با DealTypeVersion و بودجه/شرایط اختصاصی؛ کنترل min/max و مبالغ نامنفی. فیلدهای مقصد: id, inquiry_id, deal_type_id, min_sale_price, max_sale_price, min_deposit, max_deposit, min_monthly_rent, max_monthly_rent, additional_terms|بودجه و قیمت عرضه دو مفهوم جدا هستند؛ criteriaهای قدیمی فقط با نگاشت مشخص منتقل شوند.|
|InquiryAttributeCriterion|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|criterion با FK ویژگی، operator، مقدار typed و is_required؛ ویژگی نامعتبر یا خارج از نسخه رد شود. فیلدهای مقصد: id, inquiry_id, attribute_code, operator, value, is_required|از Attribute، AttributeOption و روابط search موجود استفاده کنید؛ شرط ضروری ناموفق باید تطبیق را رد کند.|
|Introduction|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|معرفی صریح Inquiry به Listing با consultant، introduced_at، status و feedback؛ نتیجه تطبیق به‌تنهایی معرفی نیست. فیلدهای مقصد: id, inquiry_id, listing_id, introduced_by_id, introduced_at, channel, status, feedback, rejection_reason, introduced_terms_snapshot, next_action, next_action_at|فقط در عملیات واقعی ایجاد شود؛ معرفی تکراری فعال با قید/سیاست دامنه کنترل شود.|
|Viewing|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|بازدید مستقل متصل به Introduction با consultant، scheduled_at، status و outcome؛ نتیجه، Task مرتبط را هم ببندد. فیلدهای مقصد: id, introduction_id, consultant_id, scheduled_at, performed_at, status, outcome, customer_feedback, cancellation_reason, interest|Task با task_type=VIEWING به‌تنهایی دارای معرفی/متقاضی معتبر نیست؛ موارد نامشخص در صف بازبینی بمانند.|
|Task|اصلاح مدل موجود؛ tasks/models.py · Task|due_date از نوع DateField؛ property اختیاری، assigned_to، status، completed_at و task_type موجودند.|due_at از نوع DateTimeField برای موعد ساعتی؛ موضوع معتبر و رابطه با درخواست/بازدید/پیگیری؛ تکمیل رویداد و Task اتمیک باشد. فیلدهای مقصد: id, title, description, assigned_to_id, created_by_id, due_at, priority, status, task_type, subject_type, subject_id, generation_key, completed_at, cancellation_reason|due_date فاقد ساعت است؛ ساعت را از کاربر/سیاست مصوب تعیین کنید، دقت دقیقه‌ای اختراع نکنید؛ DUE_DATE قدیمی تا انتقال کامل حفظ شود.|
|FollowUp|اصلاح مدل موجود؛ followups/models.py · FollowUp|contact_name متنی، consultant/property و نام‌های ذخیره‌شده، scheduled_at، outcome، status=scheduled/completed و نوع‌های Call/Meeting/Email/Site Visit.|contact و موضوع پرونده FK؛ next_action و next_action_at، completed_at و تاریخچه تعویق اضافه شود؛ وضعیت‌ها/نوع‌ها adapter صریح داشته باشند. فیلدهای مقصد: id, contact_id, consultant_id, subject_type, subject_id, follow_up_type, scheduled_at, status, notes, outcome, next_action, next_action_at, completed_at|نام متنی را خودکار Contact قطعی نگیرید؛ enumهای کوچک فعلی را مستقیم با حروف بزرگ نمونه جایگزین نکنید؛ رابطه property و آرشیو فعلی حفظ شود.|
|FollowUpRescheduleHistory|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|previous_scheduled_at، new_scheduled_at، reason، changed_by_id و changed_at؛ append-only و FK به FollowUp. فیلدهای مقصد: id, followup_id, previous_scheduled_at, new_scheduled_at, changed_by_id, changed_at, reason|تعویق، due_at وظیفه فعال را در همان تراکنش عوض کند؛ سوابق قدیمیِ موجود نبودن تاریخچه جعل نشوند.|
|Deal|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|مذاکره متصل به Inquiry و Listing دقیق؛ موفقیت با succeedDeal و مرحله AGREED، عدم توافق با دلیل؛ کار آماده‌سازی قرارداد ساخته شود. مبلغ توافق در قرارداد است و accepted_offer پیش‌نیاز اجباری مسیر جاری نیست. فیلدهای مقصد: id, code, listing_id, inquiry_id, assigned_to_id, management_scope_id, deal_type_version_id, stage, accepted_offer_id, next_action, next_action_at, started_at, closed_at, closure_reason, version, result_notes|صرف تغییر وضعیت Property به SOLD را معامله/قرارداد واقعی فرض نکنید؛ تبدیل رکورد قدیمی نیازمند مدارک است.|
|DealParticipant|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|رابط Deal/Contact با participant_role و is_primary؛ خریدار/فروشنده/نماینده صریح. فیلدهای مقصد: id, deal_id, contact_id, participant_role, is_primary|از مالکیت ملک و متقاضی فقط پس از تأیید طرفین، شرکت‌کنندگان ساخته شوند.|
|Offer|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|طرح قدیمی پیشنهاد قیمت؛ در Sample فعلی submitOffer و acceptOffer خطا می‌دهند. برای مسیر جاری، نتیجه موفق/ناموفق مذاکره و مبلغ/شرایط قرارداد پیاده شود؛ مدل Offer شرط راه‌اندازی مسیر فعلی نیست. فیلدهای مقصد: id, deal_id, offered_by_contact_id, recorded_by_id, sale_price, deposit, monthly_rent, terms, valid_until, status, previous_offer_id, responded_at, response_notes|پذیرش پیشنهاد، خودبه‌خود عرضه را نبندد؛ زنجیره نسخه‌ها و انقضا در تراکنش قفل‌شده کنترل شوند.|
|Contract|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|قرارداد از مذاکره موفق با شرایط و مبلغ نسخه‌دار و snapshot طرفین؛ قبل از امضا قابل اصلاح، پس از امضا محافظت‌شده؛ قطعی‌سازی اتمیک با کنترل امضاها و قرارداد ناسازگار ملک؛ accepted_offer شرط اجباری مسیر جاری نیست. فیلدهای مقصد: id, deal_id, contract_number, deal_type_version_id, template_version_id, accepted_offer_id, terms_snapshot, sale_price, deposit, monthly_rent, status, signed_at, effective_at, finalized_at, created_by_id, finalized_by_id, version|در قطعیت، Property/Listing و قراردادهای رقیب قفل شوند؛ برای یک ملک قرارداد قطعی ناسازگار دوم رد شود؛ سوابق پولی حفظ شوند.|
|ContractParty|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|طرف قرارداد با FK Contact و snapshot هویت/نقش هنگام تنظیم؛ ویرایش Contact سند قطعی را تغییر ندهد. فیلدهای مقصد: id, contract_id, contact_id, party_role, identity_snapshot|امضاکنندگان از طرفین تأییدشده Deal ساخته شوند؛ مالکیت به‌تنهایی اختیار امضا را اثبات نمی‌کند.|
|ContractSignature|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|FK به ContractParty، وضعیت، زمان و ثبت‌کننده؛ قید جلوگیری از امضای تکراری. فیلدهای مقصد: id, contract_party_id, status, signed_at, recorded_by_id|امضای Sample فقط نمایشی است؛ در محصول واقعی روش امضا و مدارک احراز آن باید جدا مشخص شوند.|
|ContractAttachment|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|فایل واقعی با storage key، original_name، size، checksum و uploaded_by؛ دسترسی از قرارداد ارث ببرد. فیلدهای مقصد: id, contract_id, document_type, filename, uploaded_by_id, uploaded_at|Sample فقط نام فایل نگه می‌دارد؛ آن را آپلود واقعی تلقی نکنید؛ فایل‌های قدیمی بدون مدرک به قرارداد متصل نشوند.|
|ContractAmendment|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|reason، effective_at، previous/new terms_snapshot و وضعیت تأیید؛ سند قطعی بازنویسی نشود. فیلدهای مقصد: id, contract_id, amendment_number, reason, previous_terms_snapshot, new_terms_snapshot, effective_at, status, approved_by_id|تغییر دارای اثر مالی با ثبت تعدیل/برگشت مستقل هماهنگ شود؛ تاریخچه سند قبلی بماند.|
|CommissionPolicyVersion|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|نسخه immutable سیاست با خانواده معامله، نرخ/مبلغ، تاریخ اثر و قواعد سهم؛ واحد پول مشخص. فیلدهای مقصد: id, name, deal_type_id, version_number, calculation_method, parameters, rounding_rule, status|فقط سیاست واقعی مصوب seed شود؛ اعداد نمونه تعرفه عملیاتی نیستند.|
|Commission|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|مطالبه کمیسیون از debtor_contact بر اساس Contract و PolicyVersion؛ مبلغ Decimal و snapshot محاسبه. فیلدهای مقصد: id, contract_id, debtor_contact_id, policy_version_id, calculation_snapshot, calculated_amount, adjustment_amount, final_amount, adjustment_reason, due_at, status|ارزش معامله، مطالبه، وصول و مانده مجزا؛ شناسه مبنا جلوی تولید دوباره مطالبه را بگیرد.|
|CommissionShare|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|سهم ذی‌نفع از مطالبه با beneficiary و amount؛ تأیید و پرداخت مستقل. فیلدهای مقصد: id, commission_id, beneficiary_type, beneficiary_user_id, share_percent, amount, status|جمع سهم از سقف مجاز بیشتر نشود؛ وصول مشتری با پرداخت سهم کارمند یکی نشود.|
|Payment|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|IN/OUT، payer/payee، amount، paid_at، status، reference و reversal_of؛ برگشت مستقل و غیرقابل حذف. فیلدهای مقصد: id, contact_id, user_id, direction, amount, paid_at, method, reference_number, status, recorded_by_id, reversal_of_id|شناسه یکتای عملیات به کاربر/فرمان/ورودی bind شود؛ ثبت مالی در transaction و مبلغ Decimal با واحد مشخص انجام شود.|
|PaymentAllocation|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|رابط دریافت/پرداخت با مطالبه یا سهم و مبلغ تخصیص؛ بیش از مانده/مبلغ پرداخت رد شود. فیلدهای مقصد: id, payment_id, commission_id, commission_share_id, amount|سطرهای مربوط با select_for_update قفل شوند؛ IN به مطالبه و OUT به سهم درست وصل شود؛ برگشت، تخصیص و مانده را هماهنگ کند.|
|StageTransitionHistory|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|موضوع معتبر، from_stage، to_stage، reason، changed_by_id، changed_at و operation_id؛ append-only. فیلدهای مقصد: id, subject_type, subject_id, from_stage, to_stage, changed_by_id, changed_at, reason, operation_id|از ActivityLog آزاد، مراحل قدیمی حدس زده نشوند؛ برای رخدادهای جدید همراه فرمان دامنه ثبت شود.|
|Notification|اصلاح مدل موجود؛ notifications/models.py · Notification|user، type، title، message، is_read و metadata موجودند؛ لینک موضوع در metadata است.|نوع‌های جدید workflow و موضوع معتبر/operation_id اضافه شوند؛ read_at در صورت نیاز؛ اعلان فقط برای افراد مجاز. فیلدهای مقصد: id, user_id, type, title, message, subject_type, subject_id, event_key, is_read, created_at|اعلان‌های فعلی حفظ شوند؛ در transaction ثبت یا پس از commit از outbox ارسال شود؛ retry اعلان تکراری نسازد.|
|ActivityLog|اصلاح مدل موجود؛ activity/models.py · ActivityLog|user، action، target_type، target_id عددی، description و metadata؛ target_id فاقد FK به موضوع است.|operation_id، حوزه و مرجع موضوع معتبر اضافه شود؛ برای idempotency واقعی جدول CommandReceipt با key، actor، action، request_hash و result پیشنهاد می‌شود. فیلدهای مقصد: id, user_id, action, subject_type, subject_id, description, operation_id, created_at|ActivityLog جای تاریخچه تخصصی یا قید FK نیست؛ metadata قبلی حفظ شود؛ هش ورودی به‌جای ذخیره متن حساس درخواست؛ رویدادهای تاریخی قابل ویرایش عمومی نباشند.|
|District|اصلاح مدل موجود؛ basics/models.py · District / City / Province|سلسله‌مراتب جغرافیایی و قید یکتایی تعریف پایه موجود است.|از FK فعلی استفاده کنید؛ District جغرافیایی را با ManagementScope سازمانی یکی نکنید. فیلدهای مقصد: id, code, name, is_active|نام‌های آزاد neighborhood را با صف تطبیق به district وصل کنید؛ شناسه‌های فعلی باقی بمانند.|
|PropertyType|اصلاح مدل موجود؛ basics/models.py · PropertyType|تعریف پویا با property_usage و روابط Attribute/SearchAttribute موجود است.|property_type_ref مرجع نوع ملک شود؛ property_type قدیمی صرفاً سازگاری موقت. فیلدهای مقصد: id, code, name, is_active|enum قدیمی به FK با جدول نگاشت صریح منتقل شود؛ انتخاب‌های ناشناخته نیازمند اصلاح‌اند.|
|PropertyUsage|اصلاح مدل موجود؛ basics/models.py · PropertyUsage|تعریف کاربری پویا موجود است.|سازگاری Property.property_usage با PropertyType.property_usage در serializer و سرویس کنترل شود. فیلدهای مقصد: id, code, name, is_active|تعاریف فعال موجود و روابط ویژگی‌ها حفظ شوند؛ جدول موازی از روی mock ساخته نشود.|
|RegistrationRequestDealType|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|رابط درخواست اولیه و DealType؛ یک درخواست می‌تواند چند نوع عرضه مطلوب داشته باشد. فیلدهای مقصد: id, registration_request_id, deal_type_id|رابط جدید است؛ deal_type ملک قدیمی را بدون درخواست معتبر به آن منتقل نکنید؛ pair یکتا باشد.|
|InquiryDistrict|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|رابط یکتای Inquiry/District برای چند محله مطلوب؛ FK به District فعلی. فیلدهای مقصد: id, inquiry_id, district_id|نام محله JSON یا متن آزاد جایگزین FK نشود؛ داده واقعی از ثبت درخواست ایجاد شود.|
|InquiryPropertyType|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|رابط یکتای Inquiry/PropertyType برای چند نوع ملک مطلوب؛ FK به تعریف پایه فعلی. فیلدهای مقصد: id, inquiry_id, property_type_id|از جدول PropertyType موجود استفاده کنید؛ داده عملیاتی seed نشود.|
|PropertyReview|افزودن مدل؛ در مدل‌های فعلی apps تعریف نشده|مدل مستقل متناظر یافت نشد؛ این قابلیت فقط در Sample شبیه‌سازی شده است.|سابقه بررسی خود ملک با FK ملک، نسخه ارسال، snapshot ملک و کارشناسی، ارسال‌کننده، تصمیم و دلیل و مدیر؛ در Sample review_history توکار است. این نیاز از تغییرات ۱۹ اکتبر استخراج شده و وجود آن در بک‌اند امروز بررسی نشده است. فیلدهای مقصد: id, property_id, submitted_by_id, submitted_at, version, snapshot, appraisal_snapshot, decision, reason, reviewed_by_id, reviewed_at|تصمیم معتبر قدیمی فقط با سند نسخه و مالکیت قابل اتکا منتقل شود؛ داده مبهم تأیید خودکار نشود؛ سابقه فایل قدیمی حذف نشود.|

## اصول پایگاه داده
- این طرح برای یک پایگاه داده رابطه‌ای مشترک پیشنهاد شده است؛ هر صفحه دیتابیس جدا نمی‌خواهد. نام جدول‌ها و نوع‌ها برای PostgreSQL پیشنهاد شده‌اند و با بک‌اند نهایی تطبیق داده می‌شوند.
- شناسه‌های رابطه‌ای FK واقعی باشند؛ نام شخص، کارمند، رنج یا نوع معامله جای شناسه ذخیره نشود. جدول واسط برای رابطه چندبه‌چند مانند گروه‌های کاربر و مالکان ملک ساخته شود.
- فیلدهای وضعیت و انتخاب ثابت با enum یا CHECK محدود شوند؛ کدهای قدیمی نمونه پیش از migration به کد واحد نگاشت شوند. aliasهای mock مجوز ساخت enumهای متناقض نیستند.
- همه مبالغ تومان با عدد دقیق بدون اعشار ذخیره شوند؛ float برای پول استفاده نشود. درصدها numeric با محدوده ۰ تا ۱۰۰ باشند. تاریخ‌ها timestamptz/ISO و نمایش رابط شمسی است.
- JSONB برای snapshot تاریخی، ویژگی‌های انعطاف‌پذیر و تعریف فرم نسخه‌دار مناسب است؛ روابط ثابت را به JSON یا متن آزاد تبدیل نکنید.
- برای subject_type/subject_id نمونه، FK عمومی به چند جدول ممکن نیست. در بک‌اند ستون‌های FK تایپ‌شده nullable + CHECK دقیقاً یک موضوع، یا جدول subject مرکزی با FK معتبر انتخاب شود؛ صرف اعتبارسنجی نام جدول در فرانت‌اند طراحی دیتابیس نیست.
- ارجاع، تغییر مرحله، فعال‌سازی، قطعی‌سازی و وجه در تراکنش اتمیک اجرا شوند. کنترل مانده وجه/سهم و قرارداد ناسازگار، قفل ردیف و آزمون هم‌زمانی سمت سرور می‌خواهد.
- version/lock_version برای aggregateهای قابل‌تغییر پیشنهاد می‌شود؛ If-Match نسخه‌ای که کاربر دیده را بفرستد. نسخه قدیمی با 409 و بدون ثبت جزئی رد شود.
- برای فرمان‌های تغییردهنده، Idempotency-Key لازم است؛ کلید همراه actor، نام فرمان و hash بدنه یکتا باشد. ارسال مجدد همان بدنه همان نتیجه را برگرداند و همان کلید با بدنه متفاوت 409 بدهد.
- سوابق ارجاع/انتقال/مراحل و snapshotهای منتشرشده append-only باشند. موجودیت استفاده‌شده soft-delete/غیرفعال شود؛ وجه تأییدشده با برگشت مرتبط اصلاح شود، نه DELETE.
- ایندکس‌های scope+status+assignee، due_at، شماره نرمال‌شده، شناسه‌های FK و subject+time بر اساس queryهای همین صفحه ساخته شوند. مجموع بین چند ردیف صرفاً CHECK تک‌ردیفی نیست و داخل تراکنش کنترل می‌شود.
- کنترل مجوز در سرور هم برای endpoint و هم برای رکورد انجام شود. serializer کارت عمومی فایل، شماره و هویت خصوصی مالک را برنگرداند؛ شمارش و گزارش هم از همان scope مجاز استفاده کنند.

## AssignmentRescheduleHistory — assignment_reschedule_history
درخواست تصمیم درباره تمدید مهلت یا انصراف مشاور؛ مستقل از ارجاع جدید
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK|بله|—|شناسه تاریخچه|
|registration_request_id|uuid FK nullable|خیر/شرطی|PropertyRegistrationRequest.id|پرونده ملک؛ در نمونه subject_type/subject_id|
|inquiry_id|uuid FK nullable|خیر/شرطی|Inquiry.id|پرونده متقاضی؛ در نمونه subject_type/subject_id|
|request_kind|enum ASSIGNMENT_EXTENSION \| CONSULTANT_WITHDRAWAL|بله|—|نوع درخواست؛ انصراف فاقد موعد جدید است|
|status|enum PENDING \| APPROVED \| REJECTED \| CANCELLED|خیر/شرطی|—|تصمیم مدیر؛ تا تأیید مسئول یا موعد تغییر نمی‌کند|
|requested_due_at|timestamptz|خیر/شرطی|—|موعد پیشنهادی اولیه کارشناس؛ مستقل از موعد تأییدشده|
|requested_by_id|uuid FK|خیر/شرطی|User.id|کارشناس درخواست‌کننده|
|requested_at|timestamptz|خیر/شرطی|—|زمان ثبت درخواست|
|decided_by_id|uuid FK nullable|خیر/شرطی|User.id|مدیر تصمیم‌گیرنده یا عامل لغو ارجاع|
|decided_at|timestamptz nullable|خیر/شرطی|—|زمان تصمیم|
|decision_reason|text|خیر/شرطی|—|دلیل تأیید، رد یا لغو|
|old_scheduled_at|timestamptz|خیر/شرطی|—|موعد قبلی رسیدگی|
|new_scheduled_at|timestamptz|خیر/شرطی|—|موعد جدید رسیدگی|
|changed_by_id|uuid FK|خیر/شرطی|User.id|کارشناس مسئول|
|changed_at|timestamptz|خیر/شرطی|—|زمان ثبت تعویق|
|reason|text|خیر/شرطی|—|دلیل الزامی تعویق|
- دقیقاً یکی از دو موضوع پرونده تعیین شود؛ تمدید باید موعد معتبر جدید داشته باشد. انصراف تا تأیید مدیر مسئول فعلی را حفظ و ارجاع جدید را مسدود کند.
ایندکس‌ها: INDEX (registration_request_id, changed_at)؛ INDEX (inquiry_id, changed_at)

## User — users
حساب ورود؛ مجوزها از عضویت چندگروهی خوانده می‌شوند.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|username|text|بله|—|نام کاربری ورود؛ یکتا.|
|is_active|boolean|بله|—|فعال‌بودن حساب یا تعریف پایه.|
|group_ids|رابط نرمال / نمای API|خیر/شرطی|UserGroup / user_groups|نمای خواندنی شناسه گروه‌ها؛ در پایگاه داده از جدول user_groups ساخته شود.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- username یکتا؛ نقش موازی role ذخیره نشود؛ group_ids فقط projection از UserGroup است.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (username)

## Group — groups
گروه دسترسی و کدهای مجاز عملیات.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|code|text|بله|—|کد ثابت یا شماره قابل جست‌وجوی پرونده.|
|name|text|بله|—|عنوان خوانای تعریف.|
|permission_codes|رابط نرمال / نمای API|خیر/شرطی|group_permissions|کدهای مجوز؛ در طراحی پیشنهادی از جدول group_permissions خوانده شود.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- code یکتا؛ گروه‌ها GENERAL_MANAGER، RANGE_MANAGER، AGENT، CONTRACT_OFFICER و FINANCE هستند.
- permission_codes از رابطه group_permissions و فهرست کدهای مجاز تأمین شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (code)

## StaffProfile — staff_profiles
هویت کاری تمام کارکنان؛ مستقل از گروه و رنج.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|user_id|uuid FK (mock: string)|بله|User.id|ارجاع به رکورد User؛ با کلید خارجی واقعی.|
|full_name|text|خیر/شرطی|—|نام کامل قابل نمایش کارمند.|
|mobile|text|خیر/شرطی|—|شماره همراه با قالب استاندارد.|
|avatar|text|خیر/شرطی|—|نشانی تصویر کارمند؛ اختیاری.|
|hired_at|timestamptz / ISO 8601|خیر/شرطی|—|تاریخ شروع همکاری.|
|notes|text|خیر/شرطی|—|یادداشت تکمیلی داخلی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- هر User حداکثر یک StaffProfile دارد.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (user_id)

## ManagementScope — management_scopes
حوزه مسئولیت تیم و پرونده‌ها.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|name|text|بله|—|عنوان خوانای تعریف.|
|code|text|بله|—|کد ثابت یا شماره قابل جست‌وجوی پرونده.|
|description|text|خیر/شرطی|—|توضیح کاربردی رکورد.|
|is_active|boolean|بله|—|فعال‌بودن حساب یا تعریف پایه.|
|created_by_id|uuid FK (mock: string)|بله|User.id|ایجادکننده؛ با کلید خارجی واقعی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- code یکتا؛ بستن رنج باید تکلیف پرونده‌ها و عضویت‌های فعال را روشن کند.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (code)

## ScopeMembership — scope_memberships
عضویت زمان‌دار کارمند در تیم؛ مستقل از انتقال پرونده.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|scope_id|uuid FK (mock: string)|بله|ManagementScope.id|ارجاع به رکورد ManagementScope؛ با کلید خارجی واقعی.|
|user_id|uuid FK (mock: string)|بله|User.id|ارجاع به رکورد User؛ با کلید خارجی واقعی.|
|membership_role|enum / CHECK|بله|—|نقش کاربر در این تیم؛ جدا از گروه دسترسی. کدها: MANAGER \| CONSULTANT.|
|joined_at|timestamptz / ISO 8601|بله|—|زمان شروع عضویت.|
|left_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان پایان عضویت؛ NULL یعنی عضویت جاری.|
|assigned_by_id|uuid FK (mock: string)|بله|User.id|ثبت‌کننده ارجاع یا عضویت؛ با کلید خارجی واقعی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- CHECK (left_at IS NULL OR left_at >= joined_at).
- یک عضویت CONSULTANT جاری برای هر کاربر: unique جزئی روی user_id با left_at IS NULL و membership_role = CONSULTANT.
- انتقال عضویت کارمند هیچ پرونده‌ای را خودکار منتقل نمی‌کند.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (user_id) WHERE left_at IS NULL AND membership_role = CONSULTANT؛ INDEX (scope_id, left_at)

## ScopeTransferHistory — scope_transfer_history
سابقه تغییر حوزه مسئولیت یک پرونده.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|property_id|uuid FK (mock: string)|بله|Property.id|ارجاع به رکورد Property؛ با کلید خارجی واقعی.|
|registration_request_id|uuid FK (mock: string)|خیر/شرطی|PropertyRegistrationRequest.id|ارجاع به رکورد PropertyRegistrationRequest؛ با کلید خارجی واقعی.|
|inquiry_id|uuid FK (mock: string)|بله|Inquiry.id|ارجاع به رکورد Inquiry؛ با کلید خارجی واقعی.|
|from_scope_id|uuid FK (mock: string)|بله|ManagementScope.id|رنج مبدأ؛ با کلید خارجی واقعی.|
|to_scope_id|uuid FK (mock: string)|بله|ManagementScope.id|رنج مقصد؛ با کلید خارجی واقعی.|
|transferred_by_id|uuid FK (mock: string)|بله|User.id|ثبت‌کننده انتقال؛ با کلید خارجی واقعی.|
|transferred_at|timestamptz / ISO 8601|بله|—|زمان ثبت انتقال حوزه مسئولیت.|
|reason|text|بله|—|دلیل مستند عملیات؛ برای انتقال، تعویق و برگشت الزامی.|
|operation_id|text|بله|—|شناسه مشترک یک عملیات اتمیک برای ردیابی و جلوگیری از تکرار.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- CHECK num_nonnulls(property_id, registration_request_id, inquiry_id) = 1.
- دلیل غیرخالی، مبدأ و مقصد متفاوت؛ سابقه append-only و تغییر/حذف معمول ممنوع.
- انتقال پرونده تبدیل‌شده، درخواست و ملک و فایل‌های مرتبط را در یک تراکنش هماهنگ می‌کند.
- مسئول مقصد باید عضویت جاری معتبر داشته باشد؛ در غیر این صورت پرونده وارد صف ارجاع می‌شود.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (operation_id)؛ INDEX (property_id, transferred_at)؛ INDEX (registration_request_id, transferred_at)؛ INDEX (inquiry_id, transferred_at)

## AssignmentHistory — assignment_history
سابقه تغییر مسئول یک پرونده بدون الزام به تغییر رنج.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|registration_request_id|uuid FK (mock: string)|خیر/شرطی|PropertyRegistrationRequest.id|ارجاع به رکورد PropertyRegistrationRequest؛ با کلید خارجی واقعی.|
|property_id|uuid FK (mock: string)|بله|Property.id|ارجاع به رکورد Property؛ با کلید خارجی واقعی.|
|listing_id|uuid FK (mock: string)|بله|Listing.id|ارجاع به رکورد Listing؛ با کلید خارجی واقعی.|
|inquiry_id|uuid FK (mock: string)|بله|Inquiry.id|ارجاع به رکورد Inquiry؛ با کلید خارجی واقعی.|
|deal_id|uuid FK (mock: string)|بله|Deal.id|ارجاع به رکورد Deal؛ با کلید خارجی واقعی.|
|previous_assignee_id|uuid FK (mock: string)|خیر/شرطی|User.id|مسئول قبلی؛ NULL در اولین ارجاع؛ با کلید خارجی واقعی.|
|new_assignee_id|uuid FK (mock: string)|خیر/شرطی|User.id|مسئول جدید؛ NULL برای صف ارجاع؛ با کلید خارجی واقعی.|
|assigned_by_id|uuid FK (mock: string)|بله|User.id|ثبت‌کننده ارجاع یا عضویت؛ با کلید خارجی واقعی.|
|assigned_at|timestamptz / ISO 8601|بله|—|زمان تغییر مسئول پرونده.|
|reason|text|بله|—|دلیل مستند عملیات؛ برای انتقال، تعویق و برگشت الزامی.|
|operation_id|text|بله|—|شناسه مشترک یک عملیات اتمیک برای ردیابی و جلوگیری از تکرار.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- CHECK num_nonnulls(registration_request_id, property_id, listing_id, inquiry_id, deal_id) = 1.
- تاریخچه append-only؛ new_assignee_id تهی یعنی صف ارجاع؛ ارجاع به کاربر فاقد عضویت مقصد ممنوع.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (operation_id)؛ INDEX (new_assignee_id, assigned_at)

## Contact — contacts
هویت شخص حقیقی یا حقوقی؛ نقش او از روابط پرونده تعیین می‌شود.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|person_type|enum / CHECK|بله|—|نوع هویت حقیقی یا حقوقی. کدها: NATURAL در عملیات جاری؛ INDIVIDUAL در seed قدیمی؛ COMPANY پیشنهاد هویت حقوقی است و پیش از CHECK باید فهرست و مهاجرت کدها تعیین شود.|
|first_name|text|خیر/شرطی|—|نام شخص حقیقی.|
|last_name|text|خیر/شرطی|—|نام خانوادگی شخص حقیقی.|
|company_name|text|خیر/شرطی|—|نام شخص حقوقی.|
|national_id|text|خیر/شرطی|—|شناسه ملی یا کد ملی؛ رشته برای حفظ صفر ابتدایی.|
|notes|text|خیر/شرطی|—|یادداشت تکمیلی داخلی.|
|created_by_id|uuid FK (mock: string)|بله|User.id|ایجادکننده؛ با کلید خارجی واقعی.|
|archived_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان بایگانی؛ NULL یعنی بایگانی نشده.|
|merged_into_id|uuid FK (mock: string)|خیر/شرطی|Contact.id|شخص مقصد ادغام دستی؛ NULL یعنی ادغام نشده؛ با کلید خارجی واقعی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- هویت نقش واحد مالک/خریدار ندارد؛ نقش‌ها روی روابط ثبت می‌شوند.
- برای INDIVIDUAL نام شخص و برای COMPANY نام شرکت اعتبارسنجی شود؛ merged_into_id نباید به خود یا چرخه ادغام اشاره کند.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (national_id)؛ INDEX (archived_at)؛ INDEX (merged_into_id)

## ContactPhone — contact_phones
شماره‌های تماس شخص و شماره اصلی.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|contact_id|uuid FK (mock: string)|بله|Contact.id|ارجاع به رکورد Contact؛ با کلید خارجی واقعی.|
|phone_number|text|بله|—|شماره نرمال‌شده؛ مشابهت هشدار می‌دهد و باعث ادغام خودکار نمی‌شود.|
|label|text|خیر/شرطی|—|عنوان شماره مانند همراه یا محل کار.|
|is_primary|boolean|بله|—|علامت رابطه یا شماره اصلی در محدوده والد.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- حداکثر یک شماره اصلی برای هر شخص؛ شماره نرمال شود؛ اشتراک شماره بین اشخاص هشدار است و ادغام خودکار نیست.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (contact_id, phone_number)؛ UNIQUE (contact_id) WHERE is_primary = true؛ INDEX (phone_number)

## PropertyContact — property_contacts
رابط ملک و اشخاص، شامل مالکیت و سهم.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|property_id|uuid FK (mock: string)|بله|Property.id|ارجاع به رکورد Property؛ با کلید خارجی واقعی.|
|contact_id|uuid FK (mock: string)|بله|Contact.id|ارجاع به رکورد Contact؛ با کلید خارجی واقعی.|
|relation_type|enum / CHECK|بله|—|نوع رابطه شخص و ملک؛ مانند مالک. کدها: OWNER (در seed؛ سایر رابطه‌ها نیازمند تعریف enum مصوب).|
|ownership_percent|numeric(7,4) درصد|خیر/شرطی|—|درصد مالکیت با دقت اعشاری؛ برای غیرمالک اختیاری.|
|is_primary|boolean|بله|—|علامت رابطه یا شماره اصلی در محدوده والد.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- CHECK ownership_percent BETWEEN 0 AND 100؛ مجموع سهم مالکیت هر ملک حداکثر ۱۰۰ با قفل تراکنشی بررسی شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (property_id, contact_id, relation_type)؛ INDEX (contact_id)

## PropertyRegistrationRequest — property_registration_requests
ورودی حداقلی ملک، پذیرش و ارجاع، کارشناسی و بررسی ملک؛ پس از تأیید ساخت فایل مستقل ممکن است.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|title|text nullable|خیر/شرطی|—|عنوان مدیریتی ملک؛ مستقل از توضیح سرنخ و برای مشاور فقط خواندنی|
|title_set_by_id|uuid FK nullable|خیر/شرطی|User.id|مدیر تعیین‌کننده عنوان ملک|
|title_set_at|timestamptz nullable|خیر/شرطی|—|زمان تعیین عنوان توسط مدیر|
|title_history|jsonb audit array|خیر/شرطی|—|عنوان قبلی و جدید با مدیر تغییر‌دهنده و زمان؛ مجزا از نسخه اطلاعات کارشناسی|
|duplicate_of_id|uuid FK nullable|خیر/شرطی|PropertyRegistrationRequest.id|پرونده اصلی با تأیید صریح مدیر؛ بدون ادغام خودکار|
|duplicate_decided_by_id|uuid FK nullable|خیر/شرطی|User.id|مدیر تأییدکننده تکراری بودن|
|duplicate_decided_at|timestamptz nullable|خیر/شرطی|—|زمان تأیید تکراری بودن|
|reopened_by_id|uuid FK nullable|خیر/شرطی|User.id|مدیر درخواست‌کننده کارشناسی مجدد|
|reopened_at|timestamptz nullable|خیر/شرطی|—|زمان آخرین درخواست کارشناسی مجدد|
|reappraisal_history|jsonb snapshot array|خیر/شرطی|—|نسخه‌های محفوظ گزارش، ملک و عرضه پیش از بازگشایی، همراه دلیل و عامل؛ در بک‌اند رابطه تاریخچه مستقل توصیه می‌شود|
|lead_status|enum NEW \| ACCEPTED|خیر/شرطی|—|پذیرش اولیه مدیر؛ مستقل از پذیرش ارجاع کارشناس|
|lead_accepted_by_id|uuid FK nullable|خیر/شرطی|User.id|مدیری که سرنخ را برای رسیدگی پذیرفته است|
|lead_accepted_at|timestamptz nullable|خیر/شرطی|—|زمان پذیرش مدیر و انتقال به فهرست سرنخ‌ها|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|code|text|بله|—|کد ثابت یا شماره قابل جست‌وجوی پرونده.|
|contact_id|uuid FK (mock: string)|خیر/شرطی|Contact.id|ارجاع به رکورد Contact؛ با کلید خارجی واقعی.|
|initial_contact_name|text|خیر/شرطی|—|نام اعلام‌شده تماس اولیه پیش از تکمیل هویت.|
|initial_contact_phone|text|خیر/شرطی|—|شماره تماس اعلام‌شده در ورودی اولیه.|
|source|text|خیر/شرطی|—|کانال ورود درخواست.|
|source_details|text|خیر/شرطی|—|شرح منشأ ورود برای ردیابی.|
|district_id|uuid FK (mock: string)|خیر/شرطی|District.id|ارجاع به رکورد District؛ با کلید خارجی واقعی.|
|approximate_address|text|خیر/شرطی|—|نشانی تقریبی؛ شروع پرونده نیازمند نشانی کامل نیست.|
|property_type_id|uuid FK (mock: string)|خیر/شرطی|PropertyType.id|ارجاع به رکورد PropertyType؛ با کلید خارجی واقعی.|
|requested_deal_type_ids|رابط نرمال / نمای API|خیر/شرطی|registration_request_deal_types|انواع معامله درخواستی؛ در طراحی پیشنهادی از جدول registration_request_deal_types خوانده شود.|
|description|text|خیر/شرطی|—|توضیح کاربردی رکورد.|
|management_scope_id|uuid FK (mock: string)|بله|ManagementScope.id|ارجاع به رکورد ManagementScope؛ با کلید خارجی واقعی.|
|assigned_to_id|uuid FK (mock: string)|خیر/شرطی|User.id|مسئول پرونده یا مأموریت؛ با کلید خارجی واقعی.|
|priority|enum / CHECK|بله|—|اولویت عملیاتی پرونده یا کار. کدهای نمونه: LOW \| NORMAL \| HIGH.|
|due_at|timestamptz / ISO 8601|خیر/شرطی|—|موعد اقدام یا سررسید طلب.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: NEW \| ASSIGNED \| IN_PROGRESS \| PENDING_REVIEW \| CHANGES_REQUIRED \| COMPLETED \| CANCELLED \| DUPLICATE. CLOSED پایان رسیدگی پرونده است؛ COMPLETED فقط تکمیل بررسی ملک است. بازگشایی از فرمان دامنه و با سابقه معتبر انجام شود.|
|resulting_property_id|uuid FK (mock: string)|خیر/شرطی|Property.id|ملک حاصل از تکمیل درخواست؛ با کلید خارجی واقعی.|
|created_by_id|uuid FK (mock: string)|بله|User.id|ایجادکننده؛ با کلید خارجی واقعی.|
|created_at|timestamptz / ISO 8601|بله|—|زمان ایجاد رکورد با منطقه زمانی.|
|closed_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان پایان پرونده.|
|closure_reason|text|خیر/شرطی|—|دلیل پایان یا لغو؛ هنگام بستن الزامی.|
|case_close_snapshot|jsonb snapshot|خیر/شرطی|—|وضعیت قبل از بستن/لغو برای بازگشایی امن؛ بازگشایی تأیید یا فایل فعال نمی‌سازد.|
|case_status_history|نمای API / سابقه append-only|خیر/شرطی|StageTransitionHistory|عامل، دلیل، زمان، وضعیت قبل/بعد و operation_id تعیین تکلیف پرونده؛ در Sample آرایه توکار است.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- شروع پرونده فقط اطلاعات حداقلی تماس، رنج و شرح می‌خواهد؛ قیمت و مشخصات کامل در شروع الزامی نیست.
- resulting_property_id پس از تبدیل معتبر شود؛ بستن درخواست و ارجاع/تغییر مرحله باید تاریخچه و اعلان متناظر بسازد.
- requested_deal_type_ids به جدول واسط registration_request_deal_types با دو FK واقعی تبدیل شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (code)؛ INDEX (management_scope_id, status, due_at)؛ INDEX (assigned_to_id, status)؛ INDEX (resulting_property_id)

## Property — properties
مشخصات خود دارایی؛ قیمت عرضه در Listing نگهداری می‌شود.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|internal_code|text|بله|—|کد داخلی یکتای دارایی.|
|title|text|بله|—|عنوان قابل نمایش رکورد.|
|management_scope_id|uuid FK (mock: string)|بله|ManagementScope.id|ارجاع به رکورد ManagementScope؛ با کلید خارجی واقعی.|
|consultant_id|uuid FK (mock: string)|خیر/شرطی|User.id|مشاور مسئول؛ با کلید خارجی واقعی.|
|property_type_id|uuid FK (mock: string)|خیر/شرطی|PropertyType.id|ارجاع به رکورد PropertyType؛ با کلید خارجی واقعی.|
|property_usage_id|uuid FK (mock: string)|خیر/شرطی|PropertyUsage.id|ارجاع به رکورد PropertyUsage؛ با کلید خارجی واقعی.|
|district_id|uuid FK (mock: string)|خیر/شرطی|District.id|ارجاع به رکورد District؛ با کلید خارجی واقعی.|
|address|text|خیر/شرطی|—|نشانی کامل ملک.|
|latitude|numeric(10,7)|خیر/شرطی|—|عرض جغرافیایی از منفی ۹۰ تا ۹۰.|
|longitude|numeric(10,7)|خیر/شرطی|—|طول جغرافیایی از منفی ۱۸۰ تا ۱۸۰.|
|area|numeric(12,2) m²|خیر/شرطی|—|مساحت ملک به متر مربع.|
|rooms|integer|خیر/شرطی|—|تعداد اتاق؛ عدد صحیح نامنفی.|
|floor|integer|خیر/شرطی|—|طبقه ملک؛ طبقات زیرزمین می‌توانند منفی باشند.|
|built_year|integer|خیر/شرطی|—|سال ساخت؛ قرارداد تقویم سال باید در API مشخص باشد.|
|description|text|خیر/شرطی|—|توضیح کاربردی رکورد.|
|record_status|enum / CHECK|بله|—|وضعیت نگهداری خود دارایی، مستقل از وضعیت عرضه. کدها: DRAFT \| ACTIVE.|
|attribute_values|رابط نرمال / نمای API|خیر/شرطی|property_attribute_values|مقادیر ویژگی‌ها؛ در طراحی پیشنهادی جدول property_attribute_values با مقدار نوع‌دار.|
|images|رابط نرمال / نمای API|خیر/شرطی|property_images|تصاویر ملک؛ در طراحی پیشنهادی جدول property_images با نشانی، ترتیب و شناسه ملک.|
|version|integer|بله|—|شماره نسخه برای کنترل هم‌زمانی؛ هر تغییر مجاز آن را افزایش می‌دهد.|
|review_status|enum DRAFT / PENDING / CHANGES_REQUIRED / APPROVED|بله|—|وضعیت بررسی خود ملک؛ مستقل از فایل عرضه.|
|review_submitted_version|integer|خیر/شرطی|—|نسخه ملک در زمان ارسال؛ مبنای کنترل تصمیم مدیر.|
|review_requested_at|timestamptz|خیر/شرطی|—|زمان ارسال ملک برای بررسی.|
|reviewed_at|timestamptz|خیر/شرطی|—|زمان تصمیم مدیر.|
|reviewed_by_id|FK|خیر/شرطی|User.id|مدیر تصمیم‌گیرنده از نشست سرور.|
|review_reason|text|خیر/شرطی|—|دلیل برگشت برای اصلاح.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- قیمت و نوع عرضه در این جدول ذخیره نشوند؛ یک ملک می‌تواند چند Listing داشته باشد.
- CHECK area > 0، rooms >= 0، latitude BETWEEN -90 AND 90 و longitude BETWEEN -180 AND 180.
- ویژگی‌ها، تصاویر و مدارک در روابط نوع‌دار جدا نگهداری شوند؛ JSONB جایگزین FK نیست.
- UPDATE با version موردانتظار و افزایش آن برای جلوگیری از بازنویسی هم‌زمان.
- ارسال و تصمیم متعلق به نسخه ملک و snapshot کارشناسی است؛ تأیید به وجود Listing وابسته نیست.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (internal_code)؛ INDEX (management_scope_id, consultant_id)؛ INDEX (district_id, property_type_id, area)

## PropertyAppraisal — property_appraisals
کارشناسی اولیه ملک و برآورد مستقل از قیمت عرضه.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|registration_request_id|uuid FK (mock: string)|خیر/شرطی|PropertyRegistrationRequest.id|ارجاع به رکورد PropertyRegistrationRequest؛ با کلید خارجی واقعی.|
|property_id|uuid FK (mock: string)|خیر/شرطی|Property.id|ارجاع به رکورد Property؛ با کلید خارجی واقعی.|
|appraiser_id|uuid FK (mock: string)|خیر/شرطی|User.id|کارشناس ملک؛ با کلید خارجی واقعی.|
|scheduled_at|timestamptz / ISO 8601|بله|—|زمان برنامه‌ریزی‌شده اقدام.|
|performed_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان واقعی انجام اقدام.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: SCHEDULED \| COMPLETED.|
|findings|text|خیر/شرطی|—|مشاهدات و نتیجه کارشناسی ملک.|
|estimated_price|numeric(20,0) تومان|خیر/شرطی|—|فیلد قدیمی صرفاً برای حفظ سابقه؛ در فرم فعلی ثبت یا الزامی نمی‌شود. مبلغ پیشنهادی روی فایل عرضه است.|
|valuation_notes|text|خیر/شرطی|—|توضیح مبنای برآورد و محدودیت آن.|
|report_attachments|رابط نرمال / نمای API|خیر/شرطی|appraisal_attachments|مدارک کارشناسی؛ در طراحی پیشنهادی جدول appraisal_attachments با FK کارشناسی.|
|completed_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان تکمیل واقعی عملیات.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- کارشناسی به همان پرونده و ملک ارجاع دهد؛ completed_at و findings در تکمیل معتبر شوند.
- گزارش بازدید قیمت ساخت‌یافته لازم ندارد؛ estimated_price قدیمی صرفاً حفظ سابقه است؛ مبلغ پیشنهادی در Listing ثبت می‌شود.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (registration_request_id)؛ INDEX (property_id, scheduled_at)

## Listing — listings
شرایط عرضه دارایی با نوع و نسخه قواعد معامله و بررسی مدیر.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|code|text|بله|—|کد ثابت یا شماره قابل جست‌وجوی پرونده.|
|property_id|uuid FK (mock: string)|بله|Property.id|ارجاع به رکورد Property؛ با کلید خارجی واقعی.|
|registration_request_id|uuid FK (mock: string)|خیر/شرطی|PropertyRegistrationRequest.id|ارجاع به رکورد PropertyRegistrationRequest؛ با کلید خارجی واقعی.|
|assigned_to_id|uuid FK (mock: string)|خیر/شرطی|User.id|مسئول پرونده یا مأموریت؛ با کلید خارجی واقعی.|
|created_by_id|uuid FK (mock: string)|بله|User.id|ایجادکننده؛ با کلید خارجی واقعی.|
|deal_type_id|uuid FK (mock: string)|بله|DealType.id|ارجاع به رکورد DealType؛ با کلید خارجی واقعی.|
|deal_type_version_id|uuid FK (mock: string)|بله|DealTypeVersion.id|ارجاع به رکورد DealTypeVersion؛ با کلید خارجی واقعی.|
|title|text|بله|—|عنوان قابل نمایش رکورد.|
|description|text|خیر/شرطی|—|توضیح کاربردی رکورد.|
|sale_price|numeric(20,0) تومان|خیر/شرطی|—|ارزش فروش پیشنهادی یا توافقی به تومان.|
|deposit|numeric(20,0) تومان|خیر/شرطی|—|مبلغ رهن یا ودیعه به تومان.|
|monthly_rent|numeric(20,0) تومان|خیر/شرطی|—|اجاره ماهانه به تومان؛ در رهن کامل صفر.|
|additional_terms|رابط نوع‌دار / نمای API|خیر/شرطی|—|شرایط نوع معامله؛ در طراحی پیشنهادی جدول شرایط نوع‌دار مرتبط با والد، با FK و CHECK سهم‌ها و اقساط.|
|review_status|enum / CHECK|بله|—|سازگاری داده قدیمی؛ مرجع تصمیم مدیر روی Property است و این فیلد تأیید مستقل فایل نیست. DRAFT / PENDING / CHANGES_REQUIRED / APPROVED|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: ACTIVE \| PAUSED \| EXPIRED \| ARCHIVED \| CLOSED.|
|review_requested_at|timestamptz / ISO 8601|خیر/شرطی|—|سازگاری داده قدیمی؛ مرجع تصمیم مدیر روی Property است و این فیلد تأیید مستقل فایل نیست. |
|approved_by_id|uuid FK (mock: string)|خیر/شرطی|User.id|سازگاری داده قدیمی؛ مرجع تصمیم مدیر روی Property است و این فیلد تأیید مستقل فایل نیست. |
|approved_at|timestamptz / ISO 8601|خیر/شرطی|—|سازگاری داده قدیمی؛ مرجع تصمیم مدیر روی Property است و این فیلد تأیید مستقل فایل نیست. |
|rejection_reason|text|خیر/شرطی|—|سازگاری داده قدیمی؛ مرجع تصمیم مدیر روی Property است و این فیلد تأیید مستقل فایل نیست. |
|terms_snapshot|jsonb snapshot|خیر/شرطی|—|تصویر ثابت شرایط معامله طبق نسخه قواعد در لحظه ثبت.|
|version|integer|بله|—|شماره نسخه برای کنترل هم‌زمانی؛ هر تغییر مجاز آن را افزایش می‌دهد.|
|closed_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان پایان پرونده.|
|closure_reason|text|خیر/شرطی|—|دلیل پایان یا لغو؛ هنگام بستن الزامی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- deal_type_version_id باید متعلق به deal_type_id و نسخه منتشرشده باشد؛ پیشنهاد FK مرکب (deal_type_version_id, deal_type_id).
- رهن کامل monthly_rent = 0؛ الزام قیمت و شرایط هر رفتار معامله با نسخه مربوط اعتبارسنجی شود.
- تغییر ملک یا شرایط بررسی‌شده نسخه را افزایش می‌دهد؛ تأیید فقط submitted_version جاری مجاز است.
- UNIQUE(property_id, deal_type_id)؛ ساخت/ویرایش فقط روی ملک تأییدشده با شرایط معتبر؛ وضعیت پایان‌یافته محافظت شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (code)؛ INDEX (property_id)؛ INDEX (assigned_to_id, review_status)؛ INDEX (status, deal_type_id)؛ INDEX (registration_request_id)

## ListingReview — listing_reviews
سابقه طرح قدیمی بررسی فایل؛ مسیر جاری بررسی PropertyReview است. برای گردش جدید جدول بررسی فایل نسازید؛ داده قدیمی حفظ شود.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|listing_id|uuid FK (mock: string)|بله|Listing.id|ارجاع به رکورد Listing؛ با کلید خارجی واقعی.|
|submitted_by_id|uuid FK (mock: string)|بله|User.id|ارسال‌کننده نسخه برای بررسی؛ با کلید خارجی واقعی.|
|submitted_at|timestamptz / ISO 8601|بله|—|زمان ارسال نسخه برای بررسی.|
|submitted_version|integer|بله|—|شماره دقیق نسخه‌ای که مدیر بررسی می‌کند.|
|submitted_snapshot|jsonb snapshot|بله|—|تصویر ثابت ملک و شرایط ارسال‌شده؛ نسخه قدیمی قابل تأیید نیست.|
|reviewed_by_id|uuid FK (mock: string)|خیر/شرطی|User.id|مدیر بررسی‌کننده؛ با کلید خارجی واقعی.|
|reviewed_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان ثبت تصمیم بررسی.|
|decision|enum / CHECK|خیر/شرطی|—|تصمیم مدیر درباره نسخه ارسال‌شده. کدها: APPROVED \| CHANGES_REQUIRED.|
|reason|text|خیر/شرطی|—|دلیل مستند عملیات؛ برای انتقال، تعویق و برگشت الزامی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- ثبت ارسال و تصمیم برای نسخه مشخص؛ سابقه بررسی حذف یا بازنویسی نشود؛ فقط تصمیم اولین بار از تهی به مقدار می‌رود.
- در CHANGES_REQUIRED دلیل غیرخالی؛ هنگام تأیید قفل نسخه ملک/فایل و مقایسه submitted_version لازم است.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (listing_id, submitted_version)؛ INDEX (reviewed_by_id, reviewed_at)

## DealType — deal_types
تعریف شش رفتار معامله با کد ثابت و عنوان قابل نمایش.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|code|text|بله|—|کد ثابت یا شماره قابل جست‌وجوی پرونده.|
|name|text|بله|—|عنوان خوانای تعریف.|
|behavior_type|enum / CHECK|بله|—|رفتار ثابت فرم و قواعد نوع معامله؛ اجرای کد آزاد مجاز نیست. کدها: SALE \| RENT \| MORTGAGE \| PRESALE \| PARTNERSHIP \| EXCHANGE.|
|is_active|boolean|بله|—|فعال‌بودن حساب یا تعریف پایه.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- code یکتا؛ رفتارهای محدود SALE، RENT، MORTGAGE، PRESALE، PARTNERSHIP و EXCHANGE؛ اجرای فرمول یا کد آزاد ممنوع.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (code)

## DealTypeVersion — deal_type_versions
نسخه قواعد و فیلدهای هر نوع معامله؛ منتشرشده تغییرناپذیر است.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|deal_type_id|uuid FK (mock: string)|بله|DealType.id|ارجاع به رکورد DealType؛ با کلید خارجی واقعی.|
|version_number|integer|بله|—|شماره افزایشی نسخه در محدوده تعریف والد.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: DRAFT \| PUBLISHED.|
|field_definitions|jsonb field definitions|بله|—|تعریف محدود فیلدها و نوع داده برای رفتارهای پشتیبانی‌شده؛ JSONB بدون کد اجرایی.|
|validation_rules|رابط نوع‌دار / نمای API|خیر/شرطی|—|قواعد اعتبارسنجی نسخه؛ طراحی پیشنهادی deal_type_validation_rules با عملگر و مقدار نوع‌دار.|
|published_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان انتشار نسخه و آغاز تغییرناپذیری آن.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- UNIQUE (deal_type_id, version_number)؛ شماره نسخه مثبت.
- نسخه PUBLISHED و قواعدش تغییرناپذیر؛ تغییر قواعد رکورد نسخه جدید می‌سازد؛ ارجاع‌های قبلی حفظ شوند.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (deal_type_id, version_number)؛ UNIQUE (id, deal_type_id)

## Inquiry — inquiries
نیاز یک متقاضی در حوزه مسئولیت تیم و مشاور.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|lead_status|enum NEW \| ACCEPTED|خیر/شرطی|—|پذیرش اولیه مدیر؛ مستقل از پذیرش ارجاع کارشناس|
|lead_accepted_by_id|uuid FK nullable|خیر/شرطی|User.id|مدیری که سرنخ را برای رسیدگی پذیرفته است|
|lead_accepted_at|timestamptz nullable|خیر/شرطی|—|زمان پذیرش مدیر و انتقال به فهرست سرنخ‌ها|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|code|text|بله|—|کد ثابت یا شماره قابل جست‌وجوی پرونده.|
|contact_id|uuid FK (mock: string)|بله|Contact.id|ارجاع به رکورد Contact؛ با کلید خارجی واقعی.|
|management_scope_id|uuid FK (mock: string)|بله|ManagementScope.id|ارجاع به رکورد ManagementScope؛ با کلید خارجی واقعی.|
|assigned_to_id|uuid FK (mock: string)|خیر/شرطی|User.id|مسئول پرونده یا مأموریت؛ با کلید خارجی واقعی.|
|district_ids|رابط نرمال / نمای API|خیر/شرطی|inquiry_districts|مناطق مطلوب؛ در طراحی پیشنهادی جدول inquiry_districts با FK واقعی.|
|property_type_ids|رابط نرمال / نمای API|خیر/شرطی|inquiry_property_types|انواع ملک مطلوب؛ در طراحی پیشنهادی جدول inquiry_property_types با FK واقعی.|
|min_area|numeric(12,2) m²|خیر/شرطی|—|کمترین مساحت قابل قبول به متر مربع.|
|max_area|numeric(12,2) m²|خیر/شرطی|—|بیشترین مساحت قابل قبول به متر مربع.|
|min_rooms|integer|خیر/شرطی|—|حداقل تعداد اتاق مطلوب.|
|priority|enum / CHECK|بله|—|اولویت عملیاتی پرونده یا کار. کدهای نمونه: LOW \| NORMAL \| HIGH.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: OPEN \| INTRODUCED \| VIEWING \| NEGOTIATION \| COMPLETED \| CANCELLED؛ داده قدیمی seed: NEW \| SEARCHING \| NEGOTIATING؛ قبل از CHECK مهاجرت به کد جاری لازم است.|
|next_action|text|خیر/شرطی|—|شرح روشن اقدام بعدی مسئول.|
|next_action_at|timestamptz / ISO 8601|خیر/شرطی|—|موعد اقدام بعدی.|
|notes|text|خیر/شرطی|—|یادداشت تکمیلی داخلی.|
|created_by_id|uuid FK (mock: string)|بله|User.id|ایجادکننده؛ با کلید خارجی واقعی.|
|closed_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان پایان پرونده.|
|closure_reason|text|خیر/شرطی|—|دلیل پایان یا لغو؛ هنگام بستن الزامی.|
|needs_status|enum DRAFT \| CONFIRMED nullable|خیر/شرطی|—|نیاز اولیه درخواست جدید پیش از معرفی باید ذخیره شود؛ null سازگاری داده قدیمی است.|
|needs_confirmed_at|timestamptz nullable|خیر/شرطی|—|زمان آخرین ذخیره نیاز|
|needs_confirmed_by_id|uuid FK nullable|خیر/شرطی|User.id|عامل ذخیره نیاز|
|case_close_snapshot|jsonb snapshot nullable|خیر/شرطی|—|وضعیت و پذیرش پیش از بستن برای بازگشایی امن|
|case_status_history|نمای API append-only|خیر/شرطی|StageTransitionHistory|عامل، زمان، دلیل و وضعیت قبل/بعد تعیین تکلیف درخواست|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- برای هر بازه کمینه <= بیشینه؛ مساحت، اتاق و بودجه نامنفی.
- district_ids و property_type_ids روابط چندبه‌چند با FK واقعی‌اند؛ شخص می‌تواند چند درخواست مستقل داشته باشد.
- تطبیق خواندنی است و تا اقدام صریح Introduction ایجاد نمی‌کند.
- بستن درخواست متقاضی نباید وضعیت ملک یا فایل عرضه آن را تغییر دهد؛ رویدادهای متقاضیان دیگر مستقل‌اند. نیاز اولیه DRAFT پیش از معرفی باید CONFIRMED شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (code)؛ INDEX (management_scope_id, status, next_action_at)؛ INDEX (contact_id)؛ INDEX (assigned_to_id, status)

## InquiryDealPreference — inquiry_deal_preferences
بودجه و شرایط مطلوب متقاضی برای یک نوع معامله.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|inquiry_id|uuid FK (mock: string)|بله|Inquiry.id|ارجاع به رکورد Inquiry؛ با کلید خارجی واقعی.|
|deal_type_id|uuid FK (mock: string)|بله|DealType.id|ارجاع به رکورد DealType؛ با کلید خارجی واقعی.|
|min_sale_price|numeric(20,0) تومان|خیر/شرطی|—|کف بودجه خرید به تومان.|
|max_sale_price|numeric(20,0) تومان|خیر/شرطی|—|سقف بودجه خرید به تومان.|
|min_deposit|numeric(20,0) تومان|خیر/شرطی|—|کف ودیعه قابل پرداخت به تومان.|
|max_deposit|numeric(20,0) تومان|خیر/شرطی|—|سقف ودیعه قابل پرداخت به تومان.|
|min_monthly_rent|numeric(20,0) تومان|خیر/شرطی|—|کف اجاره ماهانه به تومان.|
|max_monthly_rent|numeric(20,0) تومان|خیر/شرطی|—|سقف اجاره ماهانه به تومان.|
|additional_terms|رابط نوع‌دار / نمای API|خیر/شرطی|—|شرایط نوع معامله؛ در طراحی پیشنهادی جدول شرایط نوع‌دار مرتبط با والد، با FK و CHECK سهم‌ها و اقساط.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- هر نوع معامله حداکثر یک ترجیح در درخواست؛ بودجه نامنفی و کمینه <= بیشینه.
- additional_terms باید در رابطه نوع‌دار و هماهنگ با رفتار DealType ذخیره شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (inquiry_id, deal_type_id)

## InquiryAttributeCriterion — inquiry_attribute_criteria
شرط تطبیق ویژگی ملک با عملگر مشخص و ضرورت آن.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|inquiry_id|uuid FK (mock: string)|بله|Inquiry.id|ارجاع به رکورد Inquiry؛ با کلید خارجی واقعی.|
|attribute_code|text|بله|—|کد ویژگی؛ در طراحی پیشنهادی FK به property_attributes.code.|
|operator|enum / CHECK|بله|—|عملگر تطبیق مقدار با ویژگی؛ نوع مقدار باید با تعریف ویژگی سازگار باشد. کدها: EQUALS (در seed؛ سایر عملگرها نیازمند فهرست مصوب).|
|value|text \| numeric \| boolean (ستون‌های مجزا + CHECK)|بله|—|مقدار شرط؛ ستون نوع‌دار text/numeric/boolean و CHECK دقیقاً یک مقدار.|
|is_required|boolean|بله|—|شرط ضروری؛ عدم تطبیق آن نتیجه را حذف می‌کند.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- attribute_code به تعریف ویژگی محدود شود؛ operator فقط عملگر پشتیبانی‌شده و مقدار متناسب با نوع ویژگی.
- برای value ستون‌های مجزای نوع‌دار و CHECK دقیقاً یک مقدار؛ شرط ضروری نامنطبق فایل را حذف می‌کند.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (inquiry_id, attribute_code)

## Introduction — introductions
ثبت صریح معرفی یک فایل به یک نیاز با تصویر شرایط همان لحظه.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|inquiry_id|uuid FK (mock: string)|بله|Inquiry.id|ارجاع به رکورد Inquiry؛ با کلید خارجی واقعی.|
|listing_id|uuid FK (mock: string)|بله|Listing.id|ارجاع به رکورد Listing؛ با کلید خارجی واقعی.|
|introduced_by_id|uuid FK (mock: string)|بله|User.id|ثبت‌کننده معرفی؛ با کلید خارجی واقعی.|
|introduced_at|timestamptz / ISO 8601|بله|—|زمان اقدام صریح معرفی، مستقل از جست‌وجو.|
|channel|enum / CHECK|خیر/شرطی|—|روش ارائه فایل به مشتری. کدها: PHONE \| IN_PERSON؛ سایر روش‌ها نیازمند فهرست مصوب.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: INTRODUCED \| INTERESTED \| REJECTED.|
|feedback|text|خیر/شرطی|—|بازخورد مشتری از معرفی.|
|rejection_reason|text|خیر/شرطی|—|دلیل رد یا برگشت برای اصلاح.|
|introduced_terms_snapshot|jsonb snapshot|بله|—|تصویر ثابت شرایط عرضه هنگام معرفی.|
|next_action|text|خیر/شرطی|—|شرح روشن اقدام بعدی مسئول.|
|next_action_at|timestamptz / ISO 8601|خیر/شرطی|—|موعد اقدام بعدی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- فایل باید فعال، تأییدشده و قابل مشاهده باشد؛ شرایط معرفی snapshot تغییرناپذیرند.
- ثبت تکراری یک معرفی باز با قفل و کلید idempotency مهار شود؛ معرفی دوباره پس از بسته‌شدن نیازمند عملیات صریح است.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (inquiry_id, introduced_at)؛ INDEX (listing_id)؛ INDEX (introduced_by_id, status)

## Viewing — viewings
قرار بازدید مشتری و نتیجه آن؛ مستقل از کارشناسی ملک.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|introduction_id|uuid FK (mock: string)|بله|Introduction.id|ارجاع به رکورد Introduction؛ با کلید خارجی واقعی.|
|consultant_id|uuid FK (mock: string)|بله|User.id|مشاور مسئول؛ با کلید خارجی واقعی.|
|scheduled_at|timestamptz / ISO 8601|بله|—|زمان برنامه‌ریزی‌شده اقدام.|
|performed_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان واقعی انجام اقدام.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: SCHEDULED \| COMPLETED \| CANCELLED.|
|outcome|text|خیر/شرطی|—|نتیجه ثبت‌شده اقدام یا بازدید.|
|customer_feedback|text|خیر/شرطی|—|نظر مشتری پس از بازدید.|
|cancellation_reason|text|خیر/شرطی|—|دلیل لغو اقدام.|
|interest|enum INTERESTED \| NOT_INTERESTED nullable|خیر/شرطی|—|تمایل متقاضی بعد از بازدید؛ نتیجه منفی مانع شروع مذاکره از این بازدید یا معرفی است؛ null برای سابقه قدیمی حفظ می‌شود.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- بازدید از Introduction مشتق می‌شود؛ زمان انجام در COMPLETED و دلیل لغو در CANCELLED الزامی.
- حداکثر یک بازدید باز برای یک معرفی با کنترل تراکنشی.
- نتیجه فقط یک بار روی بازدید SCHEDULED ثبت شود؛ نتیجه تمایل و گزارش در همان تراکنش و با زمان/عامل نگهداری شوند.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (consultant_id, scheduled_at)؛ UNIQUE (introduction_id) WHERE status = SCHEDULED

## Task — tasks
مأموریت قابل انجام با مسئول و موعد و منشأ عملیاتی.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|title|text|بله|—|عنوان قابل نمایش رکورد.|
|description|text|خیر/شرطی|—|توضیح کاربردی رکورد.|
|assigned_to_id|uuid FK (mock: string)|بله|User.id|مسئول پرونده یا مأموریت؛ با کلید خارجی واقعی.|
|created_by_id|uuid FK (mock: string)|بله|User.id|ایجادکننده؛ با کلید خارجی واقعی.|
|due_at|timestamptz / ISO 8601|بله|—|موعد اقدام یا سررسید طلب.|
|priority|enum / CHECK|بله|—|اولویت عملیاتی پرونده یا کار. کدهای نمونه: LOW \| NORMAL \| HIGH.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: OPEN \| COMPLETED \| CANCELLED.|
|task_type|enum / CHECK|بله|—|نوع مأموریت تولیدشده یا دستی. کدها: APPRAISAL \| WORKFLOW.|
|subject_type|text|خیر/شرطی|—|نوع موضوع؛ در mock همراه subject_id اعتبارسنجی می‌شود؛ طراحی نهایی به FK نوع‌دار نیاز دارد.|
|subject_id|text|خیر/شرطی|—|شناسه موضوع در mock؛ FK عمومی به چند جدول وجود ندارد؛ طراحی پیشنهادی ستون‌های FK نوع‌دار با CHECK تک‌موضوعی.|
|generation_key|text|خیر/شرطی|—|کلید یکتای تولید مأموریت برای جلوگیری از ایجاد تکراری.|
|completed_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان تکمیل واقعی عملیات.|
|cancellation_reason|text|خیر/شرطی|—|دلیل لغو اقدام.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- generation_key غیرتهی یکتا؛ تولید مجدد همان رویداد مأموریت تکراری نسازد.
- completed_at برای COMPLETED و cancellation_reason برای CANCELLED لازم است.
- subject_type/subject_id فقط قرارداد mock هستند، FK عمومی SQL به چند جدول نیستند.
- طرح پیشنهادی: FKهای تهی‌پذیر مجزا follow_up_id، registration_request_id، property_id، listing_id، inquiry_id، introduction_id، viewing_id، deal_id، contract_id، commission_id و payment_id؛ CHECK دقیقاً یک FK غیرتهی و subject_type متناظر. برای اعلان/لاگ عمومی، صفر FK نیز با نوع عمومی صریح مجاز شود.
- API می‌تواند subject_type/subject_id را از ستون‌های FK نوع‌دار بسازد؛ FKها حذف موضوع مرجع را RESTRICT کنند.
- موضوع کار الزامی است؛ nullable بودن دو فیلد نمای API به معنی اختیاری‌بودن موضوع نیست؛ CHECK تک‌موضوعی روی FKهای نوع‌دار اعمال می‌شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (generation_key) WHERE generation_key IS NOT NULL؛ INDEX (assigned_to_id, status, due_at)

## FollowUp — follow_ups
برنامه تماس یا اقدام بعدی با مشتری و نتیجه پیگیری.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|contact_id|uuid FK (mock: string)|بله|Contact.id|ارجاع به رکورد Contact؛ با کلید خارجی واقعی.|
|consultant_id|uuid FK (mock: string)|بله|User.id|مشاور مسئول؛ با کلید خارجی واقعی.|
|subject_type|text|بله|—|نوع موضوع؛ در mock همراه subject_id اعتبارسنجی می‌شود؛ طراحی نهایی به FK نوع‌دار نیاز دارد.|
|subject_id|text|بله|—|شناسه موضوع در mock؛ FK عمومی به چند جدول وجود ندارد؛ طراحی پیشنهادی ستون‌های FK نوع‌دار با CHECK تک‌موضوعی.|
|follow_up_type|enum / CHECK|خیر/شرطی|—|نوع اقدام پیگیری. کدها: CALL (در seed).|
|scheduled_at|timestamptz / ISO 8601|بله|—|زمان برنامه‌ریزی‌شده اقدام.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: SCHEDULED \| COMPLETED \| CANCELLED.|
|notes|text|خیر/شرطی|—|یادداشت تکمیلی داخلی.|
|outcome|text|خیر/شرطی|—|نتیجه ثبت‌شده اقدام یا بازدید.|
|next_action|text|خیر/شرطی|—|شرح روشن اقدام بعدی مسئول.|
|next_action_at|timestamptz / ISO 8601|خیر/شرطی|—|موعد اقدام بعدی.|
|completed_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان تکمیل واقعی عملیات.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- تعویق موعد فقط با دلیل و FollowUpRescheduleHistory در همان تراکنش.
- نتیجه، زمان تکمیل و اقدام بعدی در بستن پیگیری بررسی شوند.
- subject_type/subject_id فقط قرارداد mock هستند، FK عمومی SQL به چند جدول نیستند.
- طرح پیشنهادی: FKهای تهی‌پذیر مجزا follow_up_id، registration_request_id، property_id، listing_id، inquiry_id، introduction_id، viewing_id، deal_id، contract_id، commission_id و payment_id؛ CHECK دقیقاً یک FK غیرتهی و subject_type متناظر. برای اعلان/لاگ عمومی، صفر FK نیز با نوع عمومی صریح مجاز شود.
- API می‌تواند subject_type/subject_id را از ستون‌های FK نوع‌دار بسازد؛ FKها حذف موضوع مرجع را RESTRICT کنند.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (consultant_id, status, scheduled_at)؛ INDEX (contact_id)

## FollowUpRescheduleHistory — follow_up_reschedule_history
تاریخچه دلیل‌دار تعویق موعد پیگیری.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|followup_id|uuid FK (mock: string)|بله|FollowUp.id|ارجاع به رکورد FollowUp؛ با کلید خارجی واقعی.|
|previous_scheduled_at|timestamptz / ISO 8601|بله|—|موعد قبل از تعویق.|
|new_scheduled_at|timestamptz / ISO 8601|بله|—|موعد جدید پس از تعویق.|
|changed_by_id|uuid FK (mock: string)|بله|User.id|ثبت‌کننده تغییر؛ با کلید خارجی واقعی.|
|changed_at|timestamptz / ISO 8601|بله|—|زمان ثبت تغییر در تاریخچه.|
|reason|text|بله|—|دلیل مستند عملیات؛ برای انتقال، تعویق و برگشت الزامی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- append-only؛ previous_scheduled_at باید با موعد فعلی تطبیق کند؛ دلیل غیرخالی و زمان جدید معتبر باشد.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (followup_id, changed_at)

## Deal — deals
پرونده مذاکره مستقل میان فایل عرضه و درخواست مشتری.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|code|text|بله|—|کد ثابت یا شماره قابل جست‌وجوی پرونده.|
|listing_id|uuid FK (mock: string)|بله|Listing.id|ارجاع به رکورد Listing؛ با کلید خارجی واقعی.|
|inquiry_id|uuid FK (mock: string)|بله|Inquiry.id|ارجاع به رکورد Inquiry؛ با کلید خارجی واقعی.|
|assigned_to_id|uuid FK (mock: string)|بله|User.id|مسئول پرونده یا مأموریت؛ با کلید خارجی واقعی.|
|management_scope_id|uuid FK (mock: string)|بله|ManagementScope.id|ارجاع به رکورد ManagementScope؛ با کلید خارجی واقعی.|
|deal_type_version_id|uuid FK (mock: string)|بله|DealTypeVersion.id|ارجاع به رکورد DealTypeVersion؛ با کلید خارجی واقعی.|
|stage|enum / CHECK|خیر/شرطی|—|مرحله مذاکره؛ منبع مشترک فهرست و کاریز. کدها: NEGOTIATION \| OFFERED \| AGREED \| CONTRACT \| FINALIZED \| LOST.|
|accepted_offer_id|uuid FK (mock: string)|خیر/شرطی|Offer.id|رابط اختیاری سازگاری طرح قدیمی؛ در مسیر جاری موفقیت مذاکره و شرایط قرارداد ملاک‌اند و Offer لازم نیست.|
|next_action|text|خیر/شرطی|—|شرح روشن اقدام بعدی مسئول.|
|next_action_at|timestamptz / ISO 8601|خیر/شرطی|—|موعد اقدام بعدی.|
|started_at|timestamptz / ISO 8601|بله|—|زمان آغاز مذاکره.|
|closed_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان پایان پرونده.|
|closure_reason|text|خیر/شرطی|—|دلیل پایان یا لغو؛ هنگام بستن الزامی.|
|version|integer|بله|—|شماره نسخه برای کنترل هم‌زمانی؛ هر تغییر مجاز آن را افزایش می‌دهد.|
|result_notes|text|خیر/شرطی|—|توضیحات توافق موفق؛ عدم توافق در closure_reason ثبت می‌شود؛ مبلغ نهایی در قرارداد است.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- در مسیر جاری، مذاکره موفق و شرایط معتبر قرارداد مبنا هستند؛ اگر رابطه Offer قدیمی حفظ شد باید به همان مذاکره تعلق داشته باشد و پیش‌نیاز مسیر جدید نیست.
- در مسیر جاری، مذاکره موفق و شرایط معتبر قرارداد مبنا هستند؛ اگر رابطه Offer قدیمی حفظ شد باید به همان مذاکره تعلق داشته باشد و پیش‌نیاز مسیر جدید نیست.
- version برای کنترل هم‌زمانی؛ مجوز و انتقال مرحله در سرویس مشترک فهرست/کاریز بررسی شوند.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (code)؛ INDEX (listing_id, stage)؛ INDEX (inquiry_id)؛ INDEX (management_scope_id, stage, next_action_at)

## DealParticipant — deal_participants
اشخاص حاضر در مذاکره با نقش قراردادی یا معاملاتی.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|deal_id|uuid FK (mock: string)|بله|Deal.id|ارجاع به رکورد Deal؛ با کلید خارجی واقعی.|
|contact_id|uuid FK (mock: string)|بله|Contact.id|ارجاع به رکورد Contact؛ با کلید خارجی واقعی.|
|participant_role|enum / CHECK|بله|—|نقش شخص در این مذاکره. کدها: BUYER \| SELLER در عملیات؛ OWNER \| CUSTOMER در seed قدیمی؛ تبدیل کدهای قدیمی پیش از CHECK.|
|is_primary|boolean|بله|—|علامت رابطه یا شماره اصلی در محدوده والد.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- شخص و نقش در محدوده مذاکره تکراری نباشد.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (deal_id, contact_id, participant_role)

## Offer — offers
سابقه طرح پیشنهاد قیمت؛ فرمان‌های submitOffer/acceptOffer در Sample فعلی غیرفعال‌اند. مسیر جاری نتیجه مذاکره و شرایط قرارداد است؛ داده قدیمی حفظ شود.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|deal_id|uuid FK (mock: string)|بله|Deal.id|ارجاع به رکورد Deal؛ با کلید خارجی واقعی.|
|offered_by_contact_id|uuid FK (mock: string)|بله|Contact.id|شخص ارائه‌کننده پیشنهاد؛ با کلید خارجی واقعی.|
|recorded_by_id|uuid FK (mock: string)|بله|User.id|ثبت‌کننده سند یا پاسخ؛ با کلید خارجی واقعی.|
|sale_price|numeric(20,0) تومان|خیر/شرطی|—|ارزش فروش پیشنهادی یا توافقی به تومان.|
|deposit|numeric(20,0) تومان|خیر/شرطی|—|مبلغ رهن یا ودیعه به تومان.|
|monthly_rent|numeric(20,0) تومان|خیر/شرطی|—|اجاره ماهانه به تومان؛ در رهن کامل صفر.|
|terms|رابط نوع‌دار / نمای API|خیر/شرطی|—|شرایط پیشنهادی؛ طراحی پیشنهادی offer_terms نوع‌دار؛ پیشنهاد قبلی بازنویسی نمی‌شود.|
|valid_until|text|خیر/شرطی|—|آخرین زمان اعتبار پیشنهاد.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: PENDING \| ACCEPTED \| REJECTED \| SUPERSEDED.|
|previous_offer_id|uuid FK (mock: string)|خیر/شرطی|Offer.id|پیشنهاد قبلی از همین مذاکره؛ با کلید خارجی واقعی.|
|responded_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان پاسخ به پیشنهاد.|
|response_notes|text|خیر/شرطی|—|توضیح پاسخ یا رد پیشنهاد.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- اصلاح پیشنهاد رکورد جدید با previous_offer_id می‌سازد؛ مبالغ و شرایط رکورد قبلی بازنویسی نشوند.
- previous_offer_id از همین Deal و بدون چرخه؛ حداکثر یک ACCEPTED برای هر Deal با قفل تراکنشی.
- مبالغ نامنفی و شرایط مطابق نسخه معامله؛ پیشنهاد منقضی پذیرفته نشود.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (deal_id, status)؛ UNIQUE (deal_id) WHERE status = ACCEPTED؛ UNIQUE (id, deal_id)

## Contract — contracts
توافق ثبت‌شده از مذاکره موفق با مبلغ و شرایط قرارداد و snapshot نسخه و طرفین.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|deal_id|uuid FK (mock: string)|بله|Deal.id|ارجاع به رکورد Deal؛ با کلید خارجی واقعی.|
|contract_number|text|بله|—|شماره یکتای قرارداد.|
|deal_type_version_id|uuid FK (mock: string)|بله|DealTypeVersion.id|ارجاع به رکورد DealTypeVersion؛ با کلید خارجی واقعی.|
|template_version_id|uuid FK پیشنهادی|خیر/شرطی|ContractTemplateVersion.id (پیشنهادی؛ بدون collection مستقل)|FK پیشنهادی به contract_template_versions؛ این مدل در seed مستقل وجود ندارد.|
|accepted_offer_id|uuid FK (mock: string)|خیر/شرطی|Offer.id|رابط اختیاری سازگاری طرح قدیمی؛ در مسیر جاری موفقیت مذاکره و شرایط قرارداد ملاک‌اند و Offer لازم نیست.|
|terms_snapshot|jsonb snapshot|بله|—|تصویر ثابت شرایط معامله طبق نسخه قواعد در لحظه ثبت.|
|sale_price|numeric(20,0) تومان|خیر/شرطی|—|ارزش فروش پیشنهادی یا توافقی به تومان.|
|deposit|numeric(20,0) تومان|خیر/شرطی|—|مبلغ رهن یا ودیعه به تومان.|
|monthly_rent|numeric(20,0) تومان|خیر/شرطی|—|اجاره ماهانه به تومان؛ در رهن کامل صفر.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: DRAFT \| PENDING_SIGNATURE \| SIGNED \| FINALIZED؛ seed قدیمی: AWAITING_SIGNATURE، نیازمند تبدیل به PENDING_SIGNATURE.|
|signed_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان امضا یا تکمیل امضاها.|
|effective_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان اثرگذاری توافق یا اصلاحیه.|
|finalized_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان قطعی‌شدن قرارداد پس از اعتبارسنجی امضاها.|
|created_by_id|uuid FK (mock: string)|بله|User.id|ایجادکننده؛ با کلید خارجی واقعی.|
|finalized_by_id|uuid FK (mock: string)|خیر/شرطی|User.id|قطعی‌کننده قرارداد؛ با کلید خارجی واقعی.|
|version|integer|بله|—|شماره نسخه برای کنترل هم‌زمانی؛ هر تغییر مجاز آن را افزایش می‌دهد.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- در مسیر جاری، مذاکره موفق و شرایط معتبر قرارداد مبنا هستند؛ اگر رابطه Offer قدیمی حفظ شد باید به همان مذاکره تعلق داشته باشد و پیش‌نیاز مسیر جدید نیست.
- قطعی‌سازی فقط با امضای همه طرف‌های لازم و مجوز معتبر؛ نسخه قطعی غیرقابل ویرایش معمول است.
- template_version_id مرجع پیشنهادی واقعی به نسخه قالب است؛ تا تعریف جدول آن، ادعای FK اجرایی وجود ندارد.
- اصلاح قرارداد قطعی از مسیر ContractAmendment؛ جلوگیری از قرارداد قطعی هم‌زمان متعارض روی یک فایل با قفل تراکنشی.
- مشاهده و همه عملیات قرارداد و طرفین، امضا، پیوست و اصلاحیه فقط برای GENERAL_MANAGER فعال؛ مدیر رنج، مشاور، مسئول قرارداد قدیمی و مالی دسترسی پرونده قرارداد ندارند.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (contract_number)؛ INDEX (deal_id, status)؛ INDEX (deal_type_version_id)

## ContractParty — contract_parties
طرف قرارداد با تصویر ثابت اطلاعات هویتی زمان تنظیم.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|contract_id|uuid FK (mock: string)|بله|Contract.id|ارجاع به رکورد Contract؛ با کلید خارجی واقعی.|
|contact_id|uuid FK (mock: string)|بله|Contact.id|ارجاع به رکورد Contact؛ با کلید خارجی واقعی.|
|party_role|enum / CHECK|بله|—|نقش شخص در قرارداد. کدها: BUYER \| SELLER در عملیات؛ OWNER \| CUSTOMER در seed قدیمی؛ تبدیل کدهای قدیمی پیش از CHECK.|
|identity_snapshot|jsonb snapshot|بله|—|تصویر ثابت هویت طرف هنگام تنظیم؛ تغییر Contact آن را عوض نمی‌کند.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- هویت زمان تنظیم snapshot است؛ تغییر هویت Contact محتوای قرارداد قبلی را عوض نمی‌کند.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (contract_id, contact_id, party_role)

## ContractSignature — contract_signatures
وضعیت و زمان ثبت امضای هر طرف قرارداد.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|contract_party_id|uuid FK (mock: string)|بله|ContractParty.id|ارجاع به رکورد ContractParty؛ با کلید خارجی واقعی.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: PENDING \| SIGNED.|
|signed_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان امضا یا تکمیل امضاها.|
|recorded_by_id|uuid FK (mock: string)|بله|User.id|ثبت‌کننده سند یا پاسخ؛ با کلید خارجی واقعی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- یک وضعیت امضای جاری برای هر طرف؛ SIGNED نیازمند signed_at و recorded_by_id است.
- این ثبت نمایشی است و امضای دیجیتال حقوقی یا احراز هویت واقعی نیست.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (contract_party_id)

## ContractAttachment — contract_attachments
فراداده مدرک قرارداد؛ فایل‌های نمونه فقط محلی‌اند.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|contract_id|uuid FK (mock: string)|بله|Contract.id|ارجاع به رکورد Contract؛ با کلید خارجی واقعی.|
|document_type|text|بله|—|نوع مدرک قراردادی.|
|filename|text|بله|—|نام فایل مدرک؛ نمونه محلی است، بک‌اند نیازمند شناسه ذخیره‌سازی خصوصی است.|
|uploaded_by_id|uuid FK (mock: string)|بله|User.id|ثبت‌کننده مدرک؛ با کلید خارجی واقعی.|
|uploaded_at|timestamptz / ISO 8601|بله|—|زمان ثبت مدرک.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- در نمونه نام فایل محلی است؛ ذخیره واقعی نیازمند شناسه فایل و کنترل دسترسی خصوصی با FK قرارداد است.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (contract_id, uploaded_at)

## ContractAmendment — contract_amendments
اصلاح مستقل قرارداد به همراه شرایط قبلی و جدید.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|contract_id|uuid FK (mock: string)|بله|Contract.id|ارجاع به رکورد Contract؛ با کلید خارجی واقعی.|
|amendment_number|integer|بله|—|شماره یکتای اصلاحیه در محدوده قرارداد.|
|reason|text|بله|—|دلیل مستند عملیات؛ برای انتقال، تعویق و برگشت الزامی.|
|previous_terms_snapshot|jsonb snapshot|بله|—|تصویر ثابت شرایط پیش از اصلاح.|
|new_terms_snapshot|jsonb snapshot|بله|—|تصویر ثابت شرایط پس از اصلاح.|
|effective_at|timestamptz / ISO 8601|خیر/شرطی|—|زمان اثرگذاری توافق یا اصلاحیه.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: DRAFT \| APPROVED.|
|approved_by_id|uuid FK (mock: string)|خیر/شرطی|User.id|تأییدکننده؛ با کلید خارجی واقعی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- فقط روی قرارداد قطعی؛ شماره یکتا در قرارداد؛ snapshot قبلی/جدید و دلیل الزامی.
- اصلاحیه مصوب تغییرناپذیر و با تأییدکننده و تاریخ اثر معتبر است.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (contract_id, amendment_number)

## CommissionPolicyVersion — commission_policy_versions
نسخه سیاست محاسبه کمیسیون؛ اعداد نمونه، تعرفه رسمی نیستند.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|name|text|بله|—|عنوان خوانای تعریف.|
|deal_type_id|uuid FK (mock: string)|بله|DealType.id|ارجاع به رکورد DealType؛ با کلید خارجی واقعی.|
|version_number|integer|بله|—|شماره افزایشی نسخه در محدوده تعریف والد.|
|calculation_method|enum / CHECK|بله|—|روش محاسبه محدود و از پیش تعریف‌شده؛ در نمونه FIXED. کدها: FIXED.|
|parameters|رابط نوع‌دار / نمای API|خیر/شرطی|—|پارامترهای سیاست؛ طراحی پیشنهادی commission_policy_parameters با ستون‌های عددی نوع‌دار.|
|rounding_rule|enum / CHECK|بله|—|قاعده گردکردن مبلغ تومان. کدها: ROUND.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: DRAFT \| PUBLISHED.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- نسخه منتشرشده تغییرناپذیر؛ تغییر پارامترها نسخه جدید می‌سازد.
- سیاست نمونه تعرفه رسمی نیست؛ JSONB آزاد برای پارامتر مالی پیشنهاد نمی‌شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (deal_type_id, name, version_number)

## Commission — commissions
طلب کمیسیون از یک بدهکار با محاسبه و تعدیل مستند.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|contract_id|uuid FK (mock: string)|بله|Contract.id|ارجاع به رکورد Contract؛ با کلید خارجی واقعی.|
|debtor_contact_id|uuid FK (mock: string)|بله|Contact.id|شخص بدهکار کمیسیون؛ با کلید خارجی واقعی.|
|policy_version_id|uuid FK (mock: string)|بله|CommissionPolicyVersion.id|ارجاع به رکورد CommissionPolicyVersion؛ با کلید خارجی واقعی.|
|calculation_snapshot|jsonb snapshot|بله|—|تصویر ثابت فرمول محدود، مبنا و اعداد محاسبه هنگام صدور.|
|calculated_amount|numeric(20,0) تومان|بله|—|مبلغ محاسبه اولیه کمیسیون به تومان.|
|adjustment_amount|numeric(20,0) تومان|بله|—|تعدیل مثبت یا منفی کمیسیون به تومان.|
|final_amount|numeric(20,0) تومان|بله|—|مبلغ نهایی کمیسیون؛ حاصل محاسبه و تعدیل.|
|adjustment_reason|text|خیر/شرطی|—|دلیل الزامی هر تعدیل غیرصفر.|
|due_at|timestamptz / ISO 8601|بله|—|موعد اقدام یا سررسید طلب.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: DRAFT \| APPROVED.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- فقط قرارداد قطعی؛ policy_version_id منتشرشده و مرتبط با نوع معامله قرارداد باشد.
- CHECK final_amount = calculated_amount + adjustment_amount و final_amount >= 0؛ تعدیل غیرصفر دلیل می‌خواهد.
- مبلغ مصوب، وصول و مانده جدا محاسبه شوند؛ مانده از تخصیص‌های معتبر وجه مشتق شود.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (contract_id)؛ INDEX (debtor_contact_id, status, due_at)

## CommissionShare — commission_shares
سهم مصوب ذی‌نفع از کمیسیون، مستقل از وجه پرداخت‌شده.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|commission_id|uuid FK (mock: string)|بله|Commission.id|ارجاع به رکورد Commission؛ با کلید خارجی واقعی.|
|beneficiary_type|enum / CHECK|بله|—|نوع ذی‌نفع سهم؛ دفتر یا مشاور. کدها: CONSULTANT \| OFFICE.|
|beneficiary_user_id|uuid FK (mock: string)|خیر/شرطی|User.id|کاربر ذی‌نفع؛ فقط برای سهم مشاور؛ با کلید خارجی واقعی.|
|share_percent|numeric(7,4) درصد|بله|—|درصد سهم ذی‌نفع از مبلغ قابل تقسیم.|
|amount|numeric(20,0) تومان|بله|—|مبلغ صحیح تومان؛ بدون اعشار پولی.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: APPROVED.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- CHECK share_percent BETWEEN 0 AND 100 و amount >= 0.
- CONSULTANT نیازمند beneficiary_user_id؛ OFFICE آن را تهی می‌گذارد؛ CHECK متناظر.
- مجموع مبلغ سهم‌ها <= مبلغ قابل تقسیم و مجموع درصدها <= ۱۰۰؛ کنترل با قفل Commission در تراکنش.
- پرداخت‌شده از تخصیص‌های معتبر OUT مشتق می‌شود؛ status به‌تنهایی سند پرداخت نیست.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (commission_id)؛ INDEX (beneficiary_user_id, status)

## Payment — payments
دریافت یا پرداخت وجه و سند برگشت مرتبط؛ مستقل از ارزش معامله.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|contact_id|uuid FK (mock: string)|خیر/شرطی|Contact.id|ارجاع به رکورد Contact؛ با کلید خارجی واقعی.|
|user_id|uuid FK (mock: string)|خیر/شرطی|User.id|ارجاع به رکورد User؛ با کلید خارجی واقعی.|
|direction|enum / CHECK|بله|—|جهت وجه؛ IN دریافت و OUT پرداخت. کدها: IN \| OUT.|
|amount|numeric(20,0) تومان|بله|—|مبلغ صحیح تومان؛ بدون اعشار پولی.|
|paid_at|timestamptz / ISO 8601|بله|—|زمان واقعی دریافت یا پرداخت.|
|method|enum / CHECK|بله|—|روش پرداخت وجه. کدها: CASH \| CARD \| TRANSFER.|
|reference_number|text|خیر/شرطی|—|شماره مرجع رسید یا تراکنش بانکی.|
|status|enum / CHECK|بله|—|وضعیت چرخه عمر این رکورد؛ فقط انتقال مجاز سرویس پذیرفته شود. کدها: DRAFT \| CONFIRMED \| REVERSED.|
|recorded_by_id|uuid FK (mock: string)|بله|User.id|ثبت‌کننده سند یا پاسخ؛ با کلید خارجی واقعی.|
|reversal_of_id|uuid FK (mock: string)|خیر/شرطی|Payment.id|وجه اصلی که این سند آن را برگشت می‌دهد؛ با کلید خارجی واقعی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- CHECK amount > 0 و direction IN (IN, OUT).
- تأییدشده حذف یا بازنویسی مالی نشود؛ برگشت رکورد جدید با reversal_of_id، جهت معکوس و مبلغ متناظر می‌سازد.
- حداکثر یک برگشت کامل برای سند اصلی؛ از برگشت زنجیره‌ای یا دوباره‌برگشت جلوگیری شود.
- contact_id برای دریافت از بدهکار و user_id برای پرداخت سهم مشاور با جهت و تخصیص اعتبارسنجی شود.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (direction, status, paid_at)؛ INDEX (contact_id)؛ INDEX (user_id)؛ UNIQUE (reversal_of_id) WHERE reversal_of_id IS NOT NULL

## PaymentAllocation — payment_allocations
تخصیص یک وجه به وصول کمیسیون یا تسویه سهم.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|payment_id|uuid FK (mock: string)|بله|Payment.id|ارجاع به رکورد Payment؛ با کلید خارجی واقعی.|
|commission_id|uuid FK (mock: string)|خیر/شرطی|Commission.id|ارجاع به رکورد Commission؛ با کلید خارجی واقعی.|
|commission_share_id|uuid FK (mock: string)|خیر/شرطی|CommissionShare.id|ارجاع به رکورد CommissionShare؛ با کلید خارجی واقعی.|
|amount|numeric(20,0) تومان|بله|—|مبلغ صحیح تومان؛ بدون اعشار پولی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- CHECK amount > 0؛ دقیقاً یکی از commission_id و commission_share_id مقدار داشته باشد.
- IN فقط به طلب Commission و OUT فقط به CommissionShare تخصیص یابد؛ ذی‌نفع و بدهکار با Payment تطبیق کنند.
- مجموع تخصیص‌های هر Payment <= مبلغ آن؛ مجموع وصول <= مانده طلب و مجموع پرداخت سهم <= مانده سهم.
- قفل Payment و Commission/Share در یک تراکنش برای جلوگیری از اضافه‌تخصیص هم‌زمان؛ برگشت اثر تخصیص سند اصلی را خنثی کند.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (payment_id)؛ INDEX (commission_id)؛ INDEX (commission_share_id)

## StageTransitionHistory — stage_transition_history
وقایع تغییر مرحله برای محاسبه زمان توقف و خط زمانی کاریز.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|subject_type|text|بله|—|نوع موضوع؛ در mock همراه subject_id اعتبارسنجی می‌شود؛ طراحی نهایی به FK نوع‌دار نیاز دارد.|
|subject_id|text|بله|—|شناسه موضوع در mock؛ FK عمومی به چند جدول وجود ندارد؛ طراحی پیشنهادی ستون‌های FK نوع‌دار با CHECK تک‌موضوعی.|
|from_stage|text|خیر/شرطی|—|مرحله پیش از عملیات؛ در ایجاد اولیه می‌تواند خالی باشد.|
|to_stage|text|بله|—|مرحله پس از عملیات معتبر.|
|changed_by_id|uuid FK (mock: string)|بله|User.id|ثبت‌کننده تغییر؛ با کلید خارجی واقعی.|
|changed_at|timestamptz / ISO 8601|بله|—|زمان ثبت تغییر در تاریخچه.|
|reason|text|بله|—|دلیل مستند عملیات؛ برای انتقال، تعویق و برگشت الزامی.|
|operation_id|text|بله|—|شناسه مشترک یک عملیات اتمیک برای ردیابی و جلوگیری از تکرار.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- append-only؛ از/به باید در ماشین حالت موضوع معتبر باشند؛ زمان توقف از آخرین changed_at مشتق می‌شود.
- operation_id رویداد مرحله را به ارجاع، اعلان و ActivityLog همان عملیات وصل می‌کند.
- subject_type/subject_id فقط قرارداد mock هستند، FK عمومی SQL به چند جدول نیستند.
- طرح پیشنهادی: FKهای تهی‌پذیر مجزا follow_up_id، registration_request_id، property_id، listing_id، inquiry_id، introduction_id، viewing_id، deal_id، contract_id، commission_id و payment_id؛ CHECK دقیقاً یک FK غیرتهی و subject_type متناظر. برای اعلان/لاگ عمومی، صفر FK نیز با نوع عمومی صریح مجاز شود.
- API می‌تواند subject_type/subject_id را از ستون‌های FK نوع‌دار بسازد؛ FKها حذف موضوع مرجع را RESTRICT کنند.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (subject_type, subject_id, changed_at)؛ INDEX (operation_id)

## Notification — notifications
اعلان رویداد برای کاربر مشخص با وضعیت خوانده‌شدن.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|user_id|uuid FK (mock: string)|بله|User.id|ارجاع به رکورد User؛ با کلید خارجی واقعی.|
|type|text|خیر/شرطی|—|کد نوع رویداد اعلان.|
|title|text|بله|—|عنوان قابل نمایش رکورد.|
|message|text|خیر/شرطی|—|متن اعلان مناسب دریافت‌کننده.|
|subject_type|text|خیر/شرطی|—|نوع موضوع؛ در mock همراه subject_id اعتبارسنجی می‌شود؛ طراحی نهایی به FK نوع‌دار نیاز دارد.|
|subject_id|text|خیر/شرطی|—|شناسه موضوع در mock؛ FK عمومی به چند جدول وجود ندارد؛ طراحی پیشنهادی ستون‌های FK نوع‌دار با CHECK تک‌موضوعی.|
|event_key|text|بله|—|کلید رفع تکرار رویداد برای هر گیرنده.|
|is_read|boolean|بله|—|آیا دریافت‌کننده اعلان را خوانده است.|
|created_at|timestamptz / ISO 8601|بله|—|زمان ایجاد رکورد با منطقه زمانی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- UNIQUE (user_id, event_key) برای جلوگیری از اعلان تکراری؛ تنها وضعیت خواندن قابل تغییر معمول است.
- subject_type/subject_id فقط قرارداد mock هستند، FK عمومی SQL به چند جدول نیستند.
- طرح پیشنهادی: FKهای تهی‌پذیر مجزا follow_up_id، registration_request_id، property_id، listing_id، inquiry_id، introduction_id، viewing_id، deal_id، contract_id، commission_id و payment_id؛ CHECK دقیقاً یک FK غیرتهی و subject_type متناظر. برای اعلان/لاگ عمومی، صفر FK نیز با نوع عمومی صریح مجاز شود.
- API می‌تواند subject_type/subject_id را از ستون‌های FK نوع‌دار بسازد؛ FKها حذف موضوع مرجع را RESTRICT کنند.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (user_id, event_key)؛ INDEX (user_id, is_read, created_at)

## ActivityLog — activity_logs
ردپای عملیات قابل پیگیری با شناسه عملیات مشترک.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK (mock: string)|بله|—|شناسه پایدار رکورد؛ در نمونه رشته و در طراحی پیشنهادی UUID.|
|user_id|uuid FK (mock: string)|بله|User.id|ارجاع به رکورد User؛ با کلید خارجی واقعی.|
|action|text|بله|—|کد عملیات ثبت‌شده در ردپای فعالیت.|
|subject_type|text|خیر/شرطی|—|نوع موضوع؛ در mock همراه subject_id اعتبارسنجی می‌شود؛ طراحی نهایی به FK نوع‌دار نیاز دارد.|
|subject_id|text|خیر/شرطی|—|شناسه موضوع در mock؛ FK عمومی به چند جدول وجود ندارد؛ طراحی پیشنهادی ستون‌های FK نوع‌دار با CHECK تک‌موضوعی.|
|description|text|خیر/شرطی|—|توضیح کاربردی رکورد.|
|operation_id|text|بله|—|شناسه مشترک یک عملیات اتمیک برای ردیابی و جلوگیری از تکرار.|
|created_at|timestamptz / ISO 8601|بله|—|زمان ایجاد رکورد با منطقه زمانی.|
- طرح پیشنهادی بک‌اند؛ collection و شناسه‌های رشته‌ای مربوط به mock فعلی‌اند؛ جدول SQL در این تغییر ساخته نمی‌شود.
- required الزام پایه ذخیره‌سازی است؛ الزامات وابسته به مرحله در تراکنش سرویس بررسی شوند.
- append-only؛ اطلاعات حساس هویت یا پرداخت در description بی‌دلیل تکرار نشوند.
- subject_type/subject_id فقط قرارداد mock هستند، FK عمومی SQL به چند جدول نیستند.
- طرح پیشنهادی: FKهای تهی‌پذیر مجزا follow_up_id، registration_request_id، property_id، listing_id، inquiry_id، introduction_id، viewing_id، deal_id، contract_id، commission_id و payment_id؛ CHECK دقیقاً یک FK غیرتهی و subject_type متناظر. برای اعلان/لاگ عمومی، صفر FK نیز با نوع عمومی صریح مجاز شود.
- API می‌تواند subject_type/subject_id را از ستون‌های FK نوع‌دار بسازد؛ FKها حذف موضوع مرجع را RESTRICT کنند.
ایندکس‌ها: PRIMARY KEY (id)؛ INDEX (operation_id)؛ INDEX (subject_type, subject_id, created_at)؛ INDEX (user_id, created_at)

## UserGroup — user_groups
رابط نرمال چندبه‌چند کاربر و گروه؛ جایگزین ذخیره group_ids روی User.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK|بله|—|شناسه یکتای رکورد پیشنهادی.|
|user_id|uuid FK|بله|User.id|کاربر عضو گروه.|
|group_id|uuid FK|بله|Group.id|گروه مجوز کاربر.|
- طراحی پیشنهادی بک‌اند؛ این جدول در mock ایجاد نشده است.
- نقش تکی role روی User تعریف نشود؛ حذف رابطه مجوز مشتق‌شده را تغییر می‌دهد.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (user_id, group_id)؛ INDEX (group_id)

## District — districts
فهرست مناطق؛ در seed مجموعه districts وجود دارد.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK|بله|—|شناسه یکتای رکورد پیشنهادی.|
|code|text|بله|—|کد پایدار و یکتای مرجع.|
|name|text|بله|—|عنوان فارسی مرجع.|
|is_active|boolean|بله|—|قابل انتخاب بودن در پرونده جدید.|
- طراحی پیشنهادی بک‌اند؛ این جدول در mock ایجاد نشده است.
- ارجاع پرونده‌ها FK واقعی؛ تعریف استفاده‌شده حذف نشود و فقط غیرفعال شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (code)

## PropertyType — property_types
مرجع پیشنهادی نوع ملک؛ مانند آپارتمان و زمین.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK|بله|—|شناسه یکتای رکورد پیشنهادی.|
|code|text|بله|—|کد پایدار و یکتای مرجع.|
|name|text|بله|—|عنوان فارسی مرجع.|
|is_active|boolean|بله|—|قابل انتخاب بودن در پرونده جدید.|
- طراحی پیشنهادی بک‌اند؛ این جدول در mock ایجاد نشده است.
- ارجاع پرونده‌ها FK واقعی؛ تعریف استفاده‌شده حذف نشود و فقط غیرفعال شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (code)

## PropertyUsage — property_usages
مرجع پیشنهادی کاربری ملک؛ مانند مسکونی و تجاری.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK|بله|—|شناسه یکتای رکورد پیشنهادی.|
|code|text|بله|—|کد پایدار و یکتای مرجع.|
|name|text|بله|—|عنوان فارسی مرجع.|
|is_active|boolean|بله|—|قابل انتخاب بودن در پرونده جدید.|
- طراحی پیشنهادی بک‌اند؛ این جدول در mock ایجاد نشده است.
- ارجاع پرونده‌ها FK واقعی؛ تعریف استفاده‌شده حذف نشود و فقط غیرفعال شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (code)

## RegistrationRequestDealType — registration_request_deal_types
نوع‌های عرضه اولیهٔ یک درخواست؛ پشت فیلد requested_deal_type_ids. تعیین نوع در درخواست اولیه اختیاری است.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK|بله|—|شناسه رکورد جدول واسط پیشنهادی.|
|registration_request_id|uuid FK|بله|PropertyRegistrationRequest.id|ارجاع واقعی به رکورد والد؛ نام یا JSON جایگزین FK نشود.|
|deal_type_id|uuid FK|بله|DealType.id|ارجاع واقعی به گزینه انتخاب‌شده؛ قبل از ثبت اعتبارسنجی شود.|
- این جدول واسط در طراحی بک‌اند پیشنهاد می‌شود؛ داده mock آن را به صورت آرایه شناسه نمایش می‌دهد.
- UNIQUE (registration_request_id, deal_type_id)؛ یک گزینه برای یک والد دوبار ثبت نشود.
- دو FK واقعی و NOT NULL؛ حذف رکورد مرجع استفاده‌شده محدود و به‌صورت غیرفعال‌سازی مدیریت شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (registration_request_id, deal_type_id)؛ INDEX (deal_type_id)

## InquiryDistrict — inquiry_districts
منطقه‌های مطلوب یک نیاز؛ پشت فیلد district_ids و ورودی تطبیق.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK|بله|—|شناسه رکورد جدول واسط پیشنهادی.|
|inquiry_id|uuid FK|بله|Inquiry.id|ارجاع واقعی به رکورد والد؛ نام یا JSON جایگزین FK نشود.|
|district_id|uuid FK|بله|District.id|ارجاع واقعی به گزینه انتخاب‌شده؛ قبل از ثبت اعتبارسنجی شود.|
- این جدول واسط در طراحی بک‌اند پیشنهاد می‌شود؛ داده mock آن را به صورت آرایه شناسه نمایش می‌دهد.
- UNIQUE (inquiry_id, district_id)؛ یک گزینه برای یک والد دوبار ثبت نشود.
- دو FK واقعی و NOT NULL؛ حذف رکورد مرجع استفاده‌شده محدود و به‌صورت غیرفعال‌سازی مدیریت شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (inquiry_id, district_id)؛ INDEX (district_id)

## InquiryPropertyType — inquiry_property_types
نوع‌های ملک مطلوب یک نیاز؛ پشت فیلد property_type_ids.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|uuid PK|بله|—|شناسه رکورد جدول واسط پیشنهادی.|
|inquiry_id|uuid FK|بله|Inquiry.id|ارجاع واقعی به رکورد والد؛ نام یا JSON جایگزین FK نشود.|
|property_type_id|uuid FK|بله|PropertyType.id|ارجاع واقعی به گزینه انتخاب‌شده؛ قبل از ثبت اعتبارسنجی شود.|
- این جدول واسط در طراحی بک‌اند پیشنهاد می‌شود؛ داده mock آن را به صورت آرایه شناسه نمایش می‌دهد.
- UNIQUE (inquiry_id, property_type_id)؛ یک گزینه برای یک والد دوبار ثبت نشود.
- دو FK واقعی و NOT NULL؛ حذف رکورد مرجع استفاده‌شده محدود و به‌صورت غیرفعال‌سازی مدیریت شود.
ایندکس‌ها: PRIMARY KEY (id)؛ UNIQUE (inquiry_id, property_type_id)؛ INDEX (property_type_id)

## PropertyReview — property_reviews
سابقه ارسال و تصمیم مدیر درباره نسخه ملک و گزارش؛ در Sample داخل review_history ملک نگهداری می‌شود.
|فیلد|نوع|الزام|رابطه|شرح|
|---|---|---|---|---|
|id|PK پیشنهادی|بله|—|شناسه مستقل سمت سرور؛ در تاریخچه توکار نمونه الزاماً وجود ندارد.|
|property_id|FK|بله|Property.id|ملک موضوع بررسی؛ نه شناسه فایل عرضه.|
|submitted_by_id|FK|بله|User.id|ارسال‌کننده.|
|submitted_at|timestamptz|بله|—|زمان ارسال.|
|version|integer|بله|—|نسخه ملک هنگام ارسال.|
|snapshot|json snapshot|بله|—|اطلاعات ملک در لحظه ارسال.|
|appraisal_snapshot|json snapshot|بله|—|گزارش کارشناسی مبنای تصمیم.|
|decision|enum|بله|—|PENDING / APPROVED / CHANGES_REQUIRED.|
|reason|text|خیر/شرطی|—|دلیل برگشت الزامی است.|
|reviewed_by_id|FK|خیر/شرطی|User.id|مدیر تصمیم‌گیرنده.|
|reviewed_at|timestamptz|خیر/شرطی|—|زمان تصمیم.|
- نسخه جاری باید با نسخه ارسال‌شده برابر باشد؛ برگشت دلیل و تأیید عنوان لازم دارد.
- snapshot ارسال‌شده بازنویسی نشود؛ تصمیم و عامل آن حفظ شوند.
ایندکس‌ها: INDEX(property_id,submitted_at)؛ INDEX(decision,submitted_at)

## اصول API
- مسیرهای /api/v1 این راهنما قرارداد پیشنهادی‌اند؛ این نمونه هیچ endpoint واقعی را فراخوانی نمی‌کند. نام سرویس mock فقط برای پیدا کردن رفتار فعلی در کد آمده است.
- GET جزئیات به شکل {data: {...}} و GET فهرست به شکل {data: [...], meta: {page,page_size,total}} برگردد. includeهای مجاز و serializer هر endpoint به‌طور مشخص پیاده‌سازی شوند.
- نمونه پاسخ فرمان الگوی envelope است؛ data باید رکورد/نسخه واقعی و شناسه رکوردهای وابسته لازم برای تازه‌سازی صفحه را برگرداند. عمل چندرکوردی یک operation_id مشترک داشته باشد.
- نمونه‌های request illustrative هستند؛ فیلدهای شرطی نوع معامله و فرم الزامی‌اند. actor، created_by، approved_by، زمان ثبت و permission از نشست سرور گرفته شوند و از بدنه کاربر پذیرفته نشوند.
- نمونه خطای اعتبارسنجی: {error:{code:"VALIDATION_ERROR",message:"اطلاعات کامل نیست",fields:{reason:["دلیل الزامی است"]}},operation_id:"..."}. خطا باید فارسی قابل نمایش و code پایدار داشته باشد.
- روش استاندارد نسخه: If-Match: "3"؛ روش تکرار امن: Idempotency-Key: UUID. هیچ PATCH آزاد status یا stage نباید الزامات دامنه را دور بزند.
- برای PATCH وضعیت نمونه، API واقعی فقط transitionهای فهرست‌شده و مجوز/فیلدهای همان انتقال را بپذیرد. نیاز به endpoint عمومی اجرای فرمول یا نام سرویس دلخواه نیست.

### POST /api/v1/registration-requests/{id}/title
تعیین یا ویرایش عنوان مدیریتی ملک
مجوز: مدیر رنج مسئول یا مدیر کل
سرویس نمونه: setPropertyTitle
ثبت اتمیک: لازم
فیلترها: —
- عنوان از توضیح سرنخ مستقل است؛ مشاور فقط می‌خواند؛ تاریخچه عنوان حفظ می‌شود
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "title": "string required"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/registration-requests/{id}/duplicate
تأیید تکراری بودن با پیوند به پرونده اصلی
مجوز: مدیر رنج مسئول یا مدیر کل
سرویس نمونه: markDuplicateCase
ثبت اتمیک: لازم
فیلترها: —
- حفظ هر دو پرونده و تاریخچه؛ بستن کارهای پرونده تکراری؛ بدون ادغام خودکار
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "original_id": "uuid required",
  "reason": "string required"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/registration-requests/{id}/reopen-appraisal
درخواست کارشناسی مجدد همان پرونده
مجوز: مدیر رنج مسئول یا مدیر کل
سرویس نمونه: reopenAppraisal
ثبت اتمیک: لازم
فیلترها: —
- بایگانی گزارش قبلی؛ توقف عرضه تا تأیید دوباره؛ حفظ شناسه پرونده؛ وظیفه جدید کارشناس
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "reason": "string required",
  "due_at": "ISO optional"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/leads/{id}/accept
پذیرش سرنخ و انتقال به فهرست سرنخ‌ها
مجوز: فقط مدیر کل یا مدیر رنج مسئول
سرویس نمونه: acceptLead
ثبت اتمیک: لازم
فیلترها: —
- ثبت مدیر پذیرنده و زمان؛ تکمیل وظیفه پذیرش مدیر؛ ورود به فهرست سرنخ‌های قابل ارجاع
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "collection": "registrationRequests | inquiries"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/cases/{id}/extensions/{request_id}/approve
تأیید تمدید مهلت
مجوز: مدیر کل یا مدیر همین رنج
سرویس نمونه: approveAssignmentExtension
ثبت اتمیک: لازم
فیلترها: —
- ثبت تصمیم مستقل، تغییر موعد پرونده و وظایف مسئول، بستن وظایف بررسی مدیران؛ ساعت ارجاع ثابت است
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "collection": "registrationRequests | inquiries",
  "request_id": "uuid",
  "due_at": "ISO optional",
  "reason": "string"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/cases/{id}/extensions/{request_id}/reject
رد درخواست تمدید
مجوز: مدیر کل یا مدیر همین رنج
سرویس نمونه: rejectAssignmentExtension
ثبت اتمیک: لازم
فیلترها: —
- حفظ موعد قبلی و ثبت دلیل رد؛ درخواست قبلی حذف نمی‌شود
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "collection": "registrationRequests | inquiries",
  "request_id": "uuid",
  "reason": "string"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/leads
ثبت سرنخ و ایجاد پرونده ملک یا متقاضی
مجوز: مشاور فقط ثبت در رنج خود؛ پذیرش و ارجاع با مدیر
سرویس نمونه: createLead
ثبت اتمیک: لازم
فیلترها: —
- ساخت اتمیک شخص و پرونده؛ صف مدیریتی از ابتدا؛ کاریز عملیاتی مشاور پس از پذیرش
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "lead_type": "PROPERTY | INQUIRY",
  "management_scope_id": "uuid فقط مدیر؛ برای مشاور از عضویت فعال تعیین می‌شود",
  "initial_contact_name": "string",
  "initial_contact_phone": "string"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/cases/{id}/assign
ارجاع یا ارجاع مجدد پرونده
مجوز: مدیر کل یا مدیر همین رنج؛ ارجاع بی‌پاسخ پس از ۴۸ ساعت، یا بلافاصله پس از رد
سرویس نمونه: assignCase
ثبت اتمیک: لازم
فیلترها: —
- حفظ تاریخچه، لغو وظایف قبلی، انتظار پذیرش مسئول جدید
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "collection": "registrationRequests | inquiries",
  "assigned_to_id": "uuid",
  "due_at": "ISO",
  "reason": "string optional"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/cases/{id}/accept
پذیرش و شروع رسیدگی
مجوز: فقط کارشناس مسئول ارجاع
سرویس نمونه: acceptAssignment
ثبت اتمیک: لازم
فیلترها: —
- ثبت accepted_at و ورود به کارشناسی یا تطبیق
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "collection": "registrationRequests | inquiries"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/cases/{id}/reject
درخواست انصراف مشاور با تأیید مدیر
مجوز: فقط کارشناس مسئول پیش از پذیرش
سرویس نمونه: rejectAssignment
ثبت اتمیک: لازم
فیلترها: —
- مشاور مسئول در حالت PENDING یا ACCEPTED با دلیل، درخواست CONSULTANT_WITHDRAWAL در انتظار تصمیم بسازد؛ مسئولیت یا پذیرش فوراً تغییر نکند. درخواست در کارتابل تأیید مدیر نمایش داده شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "collection": "registrationRequests | inquiries",
  "reason": "string"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/cases/{id}/postpone
درخواست تمدید مهلت
مجوز: فقط کارشناس مسئول پس از پذیرش ارجاع و انقضای موعد
سرویس نمونه: postponeAssignment
ثبت اتمیک: لازم
فیلترها: —
- ثبت درخواست تمدید در انتظار تأیید؛ موعد تا تصمیم مدیر تغییر نمی‌کند؛ ساعت پذیرش ارجاع ثابت می‌ماند
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "collection": "registrationRequests | inquiries",
  "due_at": "ISO",
  "reason": "string"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/dashboard
داشبورد متناسب با کاربر
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: management_scope_id, from, to
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": {
    "active_listings": 8,
    "open_requests": 6,
    "open_deals": 3,
    "overdue_tasks": 2,
    "upcoming_tasks": []
  }
}
```

### GET /api/v1/tasks
وظایف امروز، عقب‌افتاده و آینده
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: assigned_to_id, due_from, due_to, status
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### POST /api/v1/tasks/{id}/complete
تکمیل وظیفه عمومی
مجوز: صاحب وظیفه یا مدیر حوزه
سرویس نمونه: completeTask
ثبت اتمیک: لازم
فیلترها: —
- ثبت completed_at و تاریخچه؛ وظیفه وابسته به بازدید یا پیگیری فقط از مسیر ثبت نتیجه همان رویداد بسته شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/management-scopes
رنج‌ها با اعضای جاری و سابق و آمار
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: is_active
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### GET /api/v1/management-scopes/{id}
پرونده‌ها، فایل‌ها و آمار یک رنج
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: include=members,requests,listings,statistics
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": {
    "id": "record-uuid",
    "version": 1,
    "relationships": {}
  }
}
```

### POST /api/v1/management-scopes
تعریف رنج
مجوز: مدیر کل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: لازم
فیلترها: —
- code یکتا؛ created_by از کاربر نشست گرفته شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "name": "رنج شمال",
  "code": "NORTH",
  "description": "حوزه فعالیت",
  "is_active": true
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/scope-memberships/transfer
تغییر عضویت کارمند
مجوز: مدیر کل یا مدیر مجاز حوزه
سرویس نمونه: changeMembership
ثبت اتمیک: لازم
فیلترها: —
- عضویت فعال قبلی بسته و عضویت جدید ایجاد شود؛ سابقه حذف نشود.
- پرونده‌های کارمند خودکار منتقل نشوند؛ نقش گروه با نقش عضویت یکی نیست.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "user_id": "user-uuid",
  "scope_id": "scope-uuid",
  "membership_role": "CONSULTANT",
  "reason": "تغییر تیم"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/users
کاربران و پروفایل کارکنان
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: —
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### POST /api/v1/users
ثبت کارمند و گروه‌ها
مجوز: مدیر کل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: لازم
فیلترها: —
- User، StaffProfile و سطرهای عضویت گروه در یک تراکنش ساخته شوند.
- فیلد role موازی روی User ساخته نشود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "username": "consultant",
  "group_ids": [
    "group-uuid"
  ],
  "staff_profile": {
    "full_name": "نام کارمند",
    "mobile": "09120000000"
  }
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### PUT /api/v1/users/{id}/groups
تغییر گروه‌های دسترسی
مجوز: مدیر کل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: لازم
فیلترها: —
- مجوز گروه‌ها بررسی و سابقه ثبت شود؛ تغییر گروه، عضویت رنج را تغییر ندهد.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "group_ids": [
    "group-uuid"
  ]
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/contacts
اشخاص مجاز و جست‌وجوی شماره
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: search, phone, archived, page
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### GET /api/v1/contacts/{id}
پرونده شخص با ارتباط‌های مجاز
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: include=phones,properties,inquiries,introductions,viewings,deals,contracts,followups
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": {
    "id": "record-uuid",
    "version": 1,
    "relationships": {}
  }
}
```

### POST /api/v1/contacts
ثبت هویت و شماره تماس
مجوز: مدیر رنج، مشاور یا کاربر مجاز
سرویس نمونه: createContact
ثبت اتمیک: لازم
فیلترها: —
- شماره فارسی/بین‌المللی نرمال شود؛ تطابق شماره هشدار تکراری بسازد و اشخاص خودکار ادغام نشوند.
- Contact نقش ثابت مالک یا خریدار ندارد؛ نقش از روابط خوانده شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "person_type": "INDIVIDUAL",
  "first_name": "علی",
  "last_name": "احمدی",
  "phone_number": "09120000000"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### PATCH /api/v1/contacts/{id}
اصلاح اطلاعات هویت
مجوز: کاربر مجاز پرونده
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: لازم
فیلترها: —
- تغییر هویت جاری، identity_snapshot قراردادهای قبلی را بازنویسی نکند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "first_name": "علی",
  "last_name": "احمدی"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/registration-requests
فهرست و داده مشترک کاریز درخواست ملک
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: management_scope_id, assigned_to_id, status, search, page, page_size, view=list|kanban, view=list|kanban, view=list|kanban
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [
    {
      "id": "record-uuid",
      "code": "CASE-1001",
      "title": "عنوان پرونده",
      "contact_summary": {
        "id": "contact-uuid",
        "display_name": "نام شخص"
      },
      "assignee": {
        "id": "user-uuid",
        "full_name": "نام مسئول"
      },
      "scope": {
        "id": "scope-uuid",
        "name": "رنج شمال"
      },
      "stage": "NEW",
      "due_at": "2030-01-01T10:00:00+03:30",
      "next_action": "اقدام لازم",
      "stage_entered_at": "2030-01-01T08:00:00+03:30",
      "missing_fields": [],
      "warnings": [],
      "version": 1,
      "allowed_transitions": []
    }
  ],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 1,
    "stage_counts": {}
  }
}
```

### GET /api/v1/registration-requests/{id}
فضای کاری یکپارچه درخواست، ملک و عرضه
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: include=contact,assignment,property,appraisal,listings,timeline
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": {
    "id": "record-uuid",
    "version": 1,
    "relationships": {}
  }
}
```

### POST /api/v1/registration-requests
ثبت حداقلی درخواست ملک
مجوز: مدیر رنج در حوزه خود
سرویس نمونه: createRegistrationRequest
ثبت اتمیک: لازم
فیلترها: —
- حداقل یک راه تماس معتبر لازم است؛ قیمت و مشخصات کامل ملک در شروع الزامی نشوند.
- وضعیت NEW؛ ارجاع مسئول یک فرمان جداست.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "contact_id": null,
  "initial_contact_name": "نام معرف",
  "initial_contact_phone": "09120000000",
  "management_scope_id": "scope-uuid",
  "district_id": "district-uuid",
  "requested_deal_type_ids": [
    "deal-type-uuid"
  ],
  "description": "اطلاعات اولیه"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/registration-requests/{id}/assign
ارجاع درخواست و تعیین موعد
مجوز: مدیر رنج مجاز
سرویس نمونه: assignRegistrationRequest
ثبت اتمیک: لازم
فیلترها: —
- مشاور عضو فعال رنج مقصد باشد؛ درخواست ASSIGNED شود.
- وظیفه با موعد همان درخواست، اعلان و سابقه ارجاع ساخته شوند؛ وظیفه قدیمی در تغییر مسئول لغو شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "assigned_to_id": "agent-uuid",
  "due_at": "2030-01-01T10:00:00+03:30",
  "reason": "کارشناسی اولیه"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/registration-requests/{id}/appraisal/start
شروع تماس و کارشناسی
مجوز: مشاور مسئول یا مدیر حوزه
سرویس نمونه: startAppraisal
ثبت اتمیک: لازم
فیلترها: —
- درخواست ASSIGNED یا CHANGES_REQUIRED به IN_PROGRESS برود؛ رکورد کارشناسی یکتا ایجاد/بازیابی شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### PUT /api/v1/registration-requests/{id}/workspace
ذخیره کارشناسی و مشخصات ملک، بدون ایجاد فایل عرضه
مجوز: فقط کارشناس مسئول پذیرفته‌شده؛ عنوان ملک با عملیات مدیریتی جداگانه
سرویس نمونه: saveWorkspace
ثبت اتمیک: لازم
فیلترها: —
- ساخت یا تکمیل Property و رابطه مالک و گزارش؛ resulting_property_id حفظ شود؛ Listing ساخته نشود.
- گزارش، وضعیت و موقعیت ملک را ثبت می‌کند؛ مبلغ پیشنهادی فقط در فایل عرضه ثبت شود؛ توضیح اختیاری درباره مبلغ در متن گزارش ممکن است. تغییر ملک نیازمند بررسی مجدد نسخه است.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "property": {
    "area": 110,
    "rooms": 2,
    "district_id": "district-uuid",
    "address": "نشانی",
    "attribute_values": {
      "parking": true
    }
  },
  "appraisal": {
    "findings": "گزارش بازدید و بررسی ملک"
  }
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/listings/{id}/submit-review
سازگاری قدیمی: ارسال نسخه مشخص برای بررسی مدیر
مجوز: مشاور مسئول یا مدیر حوزه
سرویس نمونه: submitListingForReview
ثبت اتمیک: لازم
فیلترها: —
- فرمان سازگاری با شناسه Listing به submitPropertyForReview یا reviewProperty روی ملک مرتبط هدایت می‌شود؛ برای محصول جدید از API ملک استفاده کنید؛ بررسی مستقل فایل وجود ندارد.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/property-reviews
صف بررسی ملک‌های حوزه مدیر
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: management_scope_id, decision=PENDING, assigned_to_id
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### POST /api/v1/listings/{id}/approve
سازگاری قدیمی: تأیید نسخه بررسی‌شده
مجوز: مدیر رنج همان حوزه
سرویس نمونه: approveListing
ثبت اتمیک: لازم
فیلترها: —
- فرمان سازگاری با شناسه Listing به submitPropertyForReview یا reviewProperty روی ملک مرتبط هدایت می‌شود؛ برای محصول جدید از API ملک استفاده کنید؛ بررسی مستقل فایل وجود ندارد.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "review_id": "review-uuid",
  "submitted_version": 3,
  "property_version": 2
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/listings/{id}/request-changes
سازگاری قدیمی: برگشت برای اصلاح با دلیل
مجوز: مدیر رنج همان حوزه
سرویس نمونه: requestListingChanges
ثبت اتمیک: لازم
فیلترها: —
- فرمان سازگاری با شناسه Listing به submitPropertyForReview یا reviewProperty روی ملک مرتبط هدایت می‌شود؛ برای محصول جدید از API ملک استفاده کنید؛ بررسی مستقل فایل وجود ندارد.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "reason": "تکمیل مدارک مالکیت"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/scope-transfers
انتقال پرونده به رنج جدید
مجوز: مدیر کل یا مدیر مجاز انتقال
سرویس نمونه: transferScope
ثبت اتمیک: لازم
فیلترها: —
- دقیقاً یک موضوع انتقال؛ انتخاب مشاور معتبر مقصد یا صف ارجاع الزامی است.
- درخواست تبدیل‌شده، ملک و فایل‌های وابسته یک حوزه مشترک دارند؛ هم‌زمان منتقل شوند.
- عضویت کارمند تغییر نکند؛ سوابق انتقال و تغییر مسئول append-only و مرتبط با operation_id باشند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "subject_type": "registration_request",
  "subject_id": "request-uuid",
  "to_scope_id": "scope-uuid",
  "assigned_to_id": null,
  "reason": "تغییر حوزه"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/assignments
تغییر مشاور بدون انتقال رنج
مجوز: مدیر حوزه
سرویس نمونه: changeAssignee
ثبت اتمیک: لازم
فیلترها: —
- رنج ثابت بماند؛ مسئول عضو همان رنج باشد؛ وظیفه قبلی لغو و وظیفه جدید ایجاد شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "subject_type": "registration_request",
  "subject_id": "request-uuid",
  "assigned_to_id": "agent-uuid",
  "reason": "توزیع کار"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/properties
املاک و مشخصات دارایی
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: management_scope_id, consultant_id, district_id, property_type_id, search
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
- فهرست املاک من برای مشاور فقط ملک‌های تأییدشده تحت مسئولیت فعلی است؛ مدیر طبق حوزه دسترسی دارد.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### GET /api/v1/properties/{id}
مشخصات، مالکان و عرضه‌های مجاز ملک
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: —
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": {
    "id": "record-uuid",
    "version": 1,
    "relationships": {}
  }
}
```

### GET /api/v1/listings
فایل‌های عرضه تحت مسئولیت فعلی؛ مستقل از اکسپلور عمومی
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: management_scope_id, deal_type_id, district_id, status, review_status, visibility=public
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### GET /api/v1/listings/{id}
شرایط عرضه و نسخه معتبر فایل
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: —
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": {
    "id": "record-uuid",
    "version": 1,
    "relationships": {}
  }
}
```

### POST /api/v1/listings/{id}/status
توقف یا فعال‌سازی عرضه تأییدشده
مجوز: مدیر حوزه
سرویس نمونه: setListingStatus
ثبت اتمیک: لازم
فیلترها: —
- فعال‌سازی به تأیید Property و شرایط معتبر فایل وابسته است؛ review_status فایل سازگاری قدیمی است؛ فایل بسته با قرارداد قطعی باز نشود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "status": "PAUSED",
  "reason": "درخواست مالک"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/inquiries
فهرست و کاریز نیاز مشتری
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: management_scope_id, assigned_to_id, status, search, page, page_size, view=list|kanban, view=list|kanban, view=list|kanban
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [
    {
      "id": "record-uuid",
      "code": "CASE-1001",
      "title": "عنوان پرونده",
      "contact_summary": {
        "id": "contact-uuid",
        "display_name": "نام شخص"
      },
      "assignee": {
        "id": "user-uuid",
        "full_name": "نام مسئول"
      },
      "scope": {
        "id": "scope-uuid",
        "name": "رنج شمال"
      },
      "stage": "OPEN",
      "due_at": "2030-01-01T10:00:00+03:30",
      "next_action": "اقدام لازم",
      "stage_entered_at": "2030-01-01T08:00:00+03:30",
      "missing_fields": [],
      "warnings": [],
      "version": 1,
      "allowed_transitions": []
    }
  ],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 1,
    "stage_counts": {}
  }
}
```

### GET /api/v1/inquiries/{id}
نیاز، بودجه مستقل انواع و معرفی‌ها
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: —
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": {
    "id": "record-uuid",
    "version": 1,
    "relationships": {}
  }
}
```

### POST /api/v1/inquiries
ثبت نیاز مستقل متقاضی
مجوز: مشاور یا مدیر حوزه
سرویس نمونه: createInquiry
ثبت اتمیک: لازم
فیلترها: —
- هر شخص چند نیاز مستقل؛ ترجیح هر نوع معامله بودجه مستقل دارد.
- روابط و بازه‌ها اعتبارسنجی شوند؛ شروط ضروری در تطبیق اعمال شوند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "contact_id": "contact-uuid",
  "management_scope_id": "scope-uuid",
  "assigned_to_id": "agent-uuid",
  "district_ids": [
    "district-uuid"
  ],
  "min_area": 90,
  "max_area": 130,
  "preferences": [
    {
      "deal_type_id": "sale-uuid",
      "max_sale_price": 9000000000
    }
  ],
  "criteria": [
    {
      "attribute_code": "parking",
      "operator": "EQ",
      "value": true,
      "is_required": true
    }
  ],
  "next_action": "معرفی فایل",
  "next_action_at": "2030-01-01T10:00:00+03:30"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### PATCH /api/v1/inquiries/{id}
تغییر وضعیت یا اقدام بعدی نیاز مشتری
مجوز: مسئول یا مدیر حوزه
سرویس نمونه: updateInquiry
ثبت اتمیک: لازم
فیلترها: —
- بستن نیاز دلیل بخواهد؛ مرحله و اقدام بعدی از همان منبع کاریز تغییر کنند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "status": "MATCHING",
  "next_action": "بررسی فایل‌ها",
  "next_action_at": "2030-01-01T10:00:00+03:30"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/inquiries/{id}/matches
تطبیق با دلیل سازگاری و عدم سازگاری
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: compatible_only, deal_type_id, page
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [
    {
      "listing": {
        "id": "listing-uuid",
        "code": "L-1001",
        "title": "آپارتمان",
        "deal_type_id": "sale-uuid",
        "sale_price": 8500000000
      },
      "compatible": true,
      "reasons": [
        {
          "code": "DEAL_TYPE",
          "label": "نوع معامله",
          "passed": true
        },
        {
          "code": "BUDGET",
          "label": "بودجه خرید",
          "passed": true
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 1
  }
}
```

### GET /api/v1/introductions
معرفی‌های صریح مشتری
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: inquiry_id, listing_id, status, assigned_to_id
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### POST /api/v1/introductions
معرفی صریح فایل
مجوز: مسئول نیاز یا مدیر حوزه
سرویس نمونه: introduceListing
ثبت اتمیک: لازم
فیلترها: —
- فایل باید فعال و تأییدشده باشد؛ جست‌وجو معرفی ایجاد نکند.
- introduced_terms_snapshot از نسخه و شرایط همان لحظه ثبت شود.
- برای درخواست جدید با needs_status=DRAFT، معرفی فایل تا ذخیره نیاز و بودجه رد شود؛ سابقه قدیمی بدون این فیلد حفظ شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "inquiry_id": "inquiry-uuid",
  "listing_id": "listing-uuid",
  "channel": "IN_PERSON"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### PATCH /api/v1/introductions/{id}
علاقه، رد و بازخورد مشتری
مجوز: مسئول نیاز یا مدیر حوزه
سرویس نمونه: updateIntroduction
ثبت اتمیک: لازم
فیلترها: —
- رد، دلیل بخواهد؛ سابقه معرفی و snapshot حفظ شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "status": "REJECTED",
  "rejection_reason": "عدم تناسب بودجه",
  "feedback": "نظر مشتری"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/viewings
تقویم و فهرست بازدید مشتری
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: from, to, consultant_id, management_scope_id, status
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### POST /api/v1/viewings
برنامه‌ریزی بازدید مشتری
مجوز: مشاور مجاز یا مدیر حوزه
سرویس نمونه: scheduleViewing
ثبت اتمیک: لازم
فیلترها: —
- Viewing با کارشناسی ملک فرق دارد؛ به Introduction وصل است.
- وظیفه با همان موعد ساخته شود؛ معرفی VIEWING_SCHEDULED شود؛ درخواست تکراری بازدید فعال مضاعف نسازد.
- بازدید جدید فقط برای فایل فعال با ملک تأییدشده ثبت شود؛ پس از ثبت زمان، فرم زمان بسته شود؛ نتیجه فقط با دکمه ردیف همان بازدید در سوابق باز شود و بازشدن خودکار نداشته باشد.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "introduction_id": "introduction-uuid",
  "consultant_id": "agent-uuid",
  "scheduled_at": "2030-01-01T10:00:00+03:30"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/viewings/{id}/complete
ثبت نتیجه بازدید
مجوز: مشاور مجاز
سرویس نمونه: completeViewing
ثبت اتمیک: لازم
فیلترها: —
- نتیجه الزامی؛ Viewing=COMPLETED، معرفی=VIEWED و وظیفه مرتبط تکمیل شود.
- interest در بازدید ثبت شود؛ NOT_INTERESTED شروع مذاکره از بازدید و معرفی را مسدود کند. بازدید قبلاً تعیین تکلیف‌شده بازنویسی نشود.
- تاریخ قرار شرط ثبت نتیجه نیست؛ حتی اگر scheduled_at در آینده باشد، کاربر مجاز می‌تواند نتیجه را همین حالا ثبت کند. performed_at زمان واقعی ثبت نتیجه است.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "outcome": "گزارش بازدید",
  "customer_feedback": "نظر متقاضی",
  "interest": "INTERESTED | NOT_INTERESTED"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/followups
پیگیری‌های شخص و پرونده
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: contact_id, consultant_id, status, from, to
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### POST /api/v1/followups
ثبت پیگیری آینده
مجوز: کاربر مجاز موضوع
سرویس نمونه: createFollowUp
ثبت اتمیک: لازم
فیلترها: —
- موضوع موجود و مجاز؛ وظیفه با موعد برابر scheduled_at ساخته شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "contact_id": "contact-uuid",
  "subject_type": "inquiry",
  "subject_id": "inquiry-uuid",
  "consultant_id": "agent-uuid",
  "scheduled_at": "2030-01-01T10:00:00+03:30",
  "notes": "تماس با مشتری"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/followups/{id}/reschedule
تعویق همراه تاریخچه
مجوز: مسئول یا مدیر حوزه
سرویس نمونه: rescheduleFollowUp
ثبت اتمیک: لازم
فیلترها: —
- زمان قبل و بعد و دلیل ثبت شود؛ موعد وظیفه مرتبط هماهنگ بماند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "scheduled_at": "2030-01-02T10:00:00+03:30",
  "reason": "درخواست مشتری"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/followups/{id}/complete
ثبت نتیجه و اقدام بعدی
مجوز: مسئول یا مدیر حوزه
سرویس نمونه: completeFollowUp
ثبت اتمیک: لازم
فیلترها: —
- نتیجه الزامی؛ اقدام بعدی و موعد با هم اعتبارسنجی شوند؛ وظیفه مرتبط تکمیل شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "outcome": "تماس انجام شد",
  "next_action": "ارسال مدارک",
  "next_action_at": "2030-01-02T10:00:00+03:30"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/deals
فهرست و کاریز مذاکره
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: management_scope_id, assigned_to_id, status, search, page, page_size, view=list|kanban, view=list|kanban, view=list|kanban
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [
    {
      "id": "record-uuid",
      "code": "CASE-1001",
      "title": "عنوان پرونده",
      "contact_summary": {
        "id": "contact-uuid",
        "display_name": "نام شخص"
      },
      "assignee": {
        "id": "user-uuid",
        "full_name": "نام مسئول"
      },
      "scope": {
        "id": "scope-uuid",
        "name": "رنج شمال"
      },
      "stage": "NEGOTIATION",
      "due_at": "2030-01-01T10:00:00+03:30",
      "next_action": "اقدام لازم",
      "stage_entered_at": "2030-01-01T08:00:00+03:30",
      "missing_fields": [],
      "warnings": [],
      "version": 1,
      "allowed_transitions": []
    }
  ],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 1,
    "stage_counts": {}
  }
}
```

### GET /api/v1/deals/{id}
پیشنهادها، طرفین و قرارداد مذاکره
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: —
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": {
    "id": "record-uuid",
    "version": 1,
    "relationships": {}
  }
}
```

### POST /api/v1/deals
ایجاد پرونده مذاکره مستقل
مجوز: مسئول نیاز یا مدیر حوزه
سرویس نمونه: createDeal
ثبت اتمیک: لازم
فیلترها: —
- معرفی قبلی لازم است؛ هر فایل چند مذاکره مستقل دارد.
- listing/inquiry/نسخه معامله و طرفین مرتبط تثبیت شوند.
- در صورت وجود نتیجه منفی در آخرین بازدید تکمیل‌شده معرفی، شروع مذاکره رد شود؛ رابطه viewing_id و متقاضی و فایل دقیق حفظ شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "introduction_id": "introduction-uuid"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/deals/{id}/offers
غیرفعال در Sample فعلی؛ سابقه طراحی پیشنهاد قیمت
مجوز: مسئول مذاکره
سرویس نمونه: submitOffer
ثبت اتمیک: لازم
فیلترها: —
- عملیات فعلی خطا می‌دهد؛ نتیجه مذاکره با succeedDeal/closeDeal و مبلغ توافق در قرارداد ثبت می‌شود. این endpoint معیار پیاده‌سازی مسیر جاری نیست.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "offered_by_contact_id": "contact-uuid",
  "sale_price": 8400000000,
  "deposit": 0,
  "monthly_rent": 0,
  "terms": "شرایط توافقی",
  "valid_until": "2030-01-03T10:00:00+03:30",
  "previous_offer_id": null
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/offers/{id}/accept
غیرفعال در Sample فعلی؛ سابقه طراحی پیشنهاد قیمت
مجوز: مسئول مذاکره یا مدیر
سرویس نمونه: acceptOffer
ثبت اتمیک: لازم
فیلترها: —
- عملیات فعلی خطا می‌دهد؛ نتیجه مذاکره با succeedDeal/closeDeal و مبلغ توافق در قرارداد ثبت می‌شود. این endpoint معیار پیاده‌سازی مسیر جاری نیست.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/deals/{id}/close
پایان ناموفق مذاکره
مجوز: مسئول یا مدیر حوزه
سرویس نمونه: closeDeal
ثبت اتمیک: لازم
فیلترها: —
- دلیل الزامی؛ LOST و closed_at ثبت شود؛ مذاکره دارای قرارداد از این مسیر بسته نشود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "reason": "عدم توافق طرفین"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/contracts
قراردادهای مجاز
مجوز: فقط مدیرکل فعال (GENERAL_MANAGER)
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: status, deal_id, management_scope_id
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
- مجوز در فهرست، جزئیات، داده‌های وابسته و فرمان مستقیم کنترل شود؛ مخفی‌کردن دکمه کافی نیست.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### GET /api/v1/contracts/{id}
طرفین، امضاها و پیوست و اصلاحیه
مجوز: فقط مدیرکل فعال (GENERAL_MANAGER)
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: —
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
- مجوز در فهرست، جزئیات، داده‌های وابسته و فرمان مستقیم کنترل شود؛ مخفی‌کردن دکمه کافی نیست.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": {
    "id": "record-uuid",
    "version": 1,
    "relationships": {}
  }
}
```

### POST /api/v1/deals/{id}/contract
ساخت قرارداد از مذاکره موفق و شرایط توافق
مجوز: فقط مدیرکل فعال (GENERAL_MANAGER)
سرویس نمونه: createContract
ثبت اتمیک: لازم
فیلترها: —
- مذاکره AGREED و شرایط معتبر نوع معامله لازم‌اند؛ مبلغ در قرارداد ثبت شود و accepted_offer اجباری نیست.
- طرفین، هویت، نوع و نسخه و شرایط در snapshot قرارداد ثبت شوند؛ برای یک مذاکره قرارداد تکراری ساخته نشود.
- مجوز در فهرست، جزئیات، داده‌های وابسته و فرمان مستقیم کنترل شود؛ مخفی‌کردن دکمه کافی نیست.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "sale_price": 0,
  "deposit": 0,
  "monthly_rent": 0,
  "additional_terms": {}
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/contracts/{id}/signatures
ثبت امضای نمایشی طرف قرارداد
مجوز: فقط مدیرکل فعال (GENERAL_MANAGER)
سرویس نمونه: signContract
ثبت اتمیک: لازم
فیلترها: —
- قواعد نوع معامله و زنجیره پیشنهاد کنترل شوند؛ امضای یک طرف دوبار ثبت نشود.
- با امضای همه طرفین وضعیت SIGNED شود؛ این ثبت جای امضای حقوقی واقعی نیست.
- مجوز در فهرست، جزئیات، داده‌های وابسته و فرمان مستقیم کنترل شود؛ مخفی‌کردن دکمه کافی نیست.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "contract_party_id": "party-uuid"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/contracts/{id}/attachments
ثبت مدرک قرارداد
مجوز: فقط مدیرکل فعال (GENERAL_MANAGER)
سرویس نمونه: addContractAttachment
ثبت اتمیک: لازم
فیلترها: —
- نمونه فقط نام فایل را محلی نگه می‌دارد؛ در محصول واقعی ذخیره فایل امن و دسترسی کنترل‌شده مستقل طراحی شود.
- قرارداد قطعی از ویرایش عادی محافظت شود.
- مجوز در فهرست، جزئیات، داده‌های وابسته و فرمان مستقیم کنترل شود؛ مخفی‌کردن دکمه کافی نیست.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "document_type": "IDENTITY",
  "filename": "identity.pdf"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/contracts/{id}/finalize
قطعی‌سازی تراکنشی قرارداد
مجوز: فقط مدیرکل فعال (GENERAL_MANAGER)
سرویس نمونه: finalizeContract
ثبت اتمیک: لازم
فیلترها: —
- امضای همه طرف‌ها، قواعد snapshot و نبود قرارداد ناسازگار همان ملک بررسی شوند.
- ردیف‌های ملک/فایل مرتبط قفل شوند؛ فقط یک عملیات قطعی موفق شود.
- قرارداد FINALIZED، مذاکره FINALIZED، فایل‌ها در خانواده ناسازگار CLOSED و نیاز COMPLETED شوند؛ مالی اعلان بگیرد.
- ساخت کمیسیون در این نمونه فرمان جدا و مجاز مالی است؛ تکرار نهایی‌سازی اثر مالی مضاعف نسازد.
- مجوز در فهرست، جزئیات، داده‌های وابسته و فرمان مستقیم کنترل شود؛ مخفی‌کردن دکمه کافی نیست.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/contracts/{id}/amendments
اصلاحیه مستقل قرارداد قطعی
مجوز: فقط مدیرکل فعال (GENERAL_MANAGER)
سرویس نمونه: createAmendment
ثبت اتمیک: لازم
فیلترها: —
- قرارداد اصلی بازنویسی نشود؛ snapshot قبل و بعد، شماره اصلاحیه و تأییدکننده ذخیره شوند.
- مجوز در فهرست، جزئیات، داده‌های وابسته و فرمان مستقیم کنترل شود؛ مخفی‌کردن دکمه کافی نیست.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "reason": "اصلاح شرایط",
  "new_terms_snapshot": {
    "note": "شرایط جدید نمایشی"
  },
  "effective_at": "2030-01-02T00:00:00+03:30"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/commissions
مطالبات و مانده وصول
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: contract_id, debtor_contact_id, status
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### POST /api/v1/contracts/{id}/commission
تصویب کمیسیون و سهم‌ها
مجوز: مالی
سرویس نمونه: approveCommission
ثبت اتمیک: لازم
فیلترها: —
- فقط قرارداد قطعی؛ سیاست نمایشی نسخه‌دار با calculation_snapshot ثبت شود.
- تعدیل غیرصفر دلیل بخواهد؛ مجموع سهم‌ها از final_amount بیشتر نباشد؛ برای قرارداد دوباره کمیسیون تولید نشود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "policy_version_id": "policy-uuid",
  "adjustment_amount": 0,
  "adjustment_reason": null,
  "shares": [
    {
      "beneficiary_type": "CONSULTANT",
      "beneficiary_user_id": "agent-uuid",
      "share_percent": 40
    },
    {
      "beneficiary_type": "OFFICE",
      "beneficiary_user_id": null,
      "share_percent": 60
    }
  ]
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/payments
وجوه و تخصیص و برگشت
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: direction, contact_id, user_id, from, to
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### POST /api/v1/payments
ثبت وجه تأییدشده و تخصیص
مجوز: مالی
سرویس نمونه: confirmPayment
ثبت اتمیک: لازم
فیلترها: —
- مبلغ مثبت؛ تخصیص کل ≤ وجه؛ تخصیص به هر مطالبه/سهم ≤ مانده آن.
- دریافت به Commission و پرداخت به CommissionShare وصل شود؛ پرداخت سهم از وصول مرتبط بیشتر نشود.
- برای OUT از user_id و commission_share_id استفاده شود؛ ردیف‌ها برای کنترل سقف در یک تراکنش قفل شوند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "direction": "IN",
  "contact_id": "contact-uuid",
  "amount": 1000000,
  "method": "TRANSFER",
  "reference_number": "DEMO-001",
  "allocations": [
    {
      "commission_id": "commission-uuid",
      "amount": 1000000
    }
  ]
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/payments/{id}/reverse
برگشت مرتبط وجه تأییدشده
مجوز: مالی
سرویس نمونه: reversePayment
ثبت اتمیک: لازم
فیلترها: —
- وجه تأییدشده حذف نشود؛ reversal_of_id یکتا و پرداخت معکوس ایجاد شود.
- اگر دریافت قبلاً خرج سهم شده، ابتدا پرداخت سهم مرتبط برگشت بخورد؛ مانده‌ها از وجوه مؤثر محاسبه شوند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "reason": "اصلاح ثبت وجه"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/reports/operations
گزارش عملکرد، تبدیل و مالی مجاز
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: management_scope_id, assigned_to_id, deal_type_id, from, to
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": {
    "filters": {
      "management_scope_id": "scope-uuid"
    },
    "counts": {
      "introductions": 15,
      "viewings": 8,
      "contracts": 3
    },
    "financial": {
      "approved_commission": 45000000,
      "received": 20000000,
      "receivable_balance": 25000000,
      "consultant_share": 18000000,
      "paid_share": 5000000
    }
  }
}
```

### GET /api/v1/notifications
اعلان‌های خود کاربر
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: is_read, page
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### POST /api/v1/notifications/{id}/read
خوانده‌شدن اعلان
مجوز: صاحب اعلان
سرویس نمونه: markNotificationRead
ثبت اتمیک: لازم
فیلترها: —
- تنها is_read اعلان همان کاربر تغییر کند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/timeline
خط زمانی ترکیبیِ موضوع مجاز
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: subject_type, subject_id, cursor
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### GET /api/v1/deal-types
انواع فعال و نسخه‌های تاریخی مجاز
مجوز: دسترسی خواندن پس از محدودسازی رنج و مسئول؛ اطلاعات خصوصی مالک جدا از کارت عمومی فایل
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: is_active, include_versions
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### POST /api/v1/deal-types
تعریف نوع از شش رفتار پشتیبانی‌شده
مجوز: مدیر کل یا مجوز اختصاصی مدیریت نوع
سرویس نمونه: createDealType
ثبت اتمیک: لازم
فیلترها: —
- کد ثابت و یکتا؛ الگوی رفتار موجود کپی و نسخه اول منتشر شود؛ موتور کد یا فرمول آزاد نسازید.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "code": "SALE_SPECIAL",
  "name": "فروش ویژه",
  "behavior_type": "SALE"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/deal-types/{id}/versions
انتشار نسخه جدید شرایط
مجوز: مدیر کل یا مجوز اختصاصی انتشار
سرویس نمونه: publishDealTypeVersion
ثبت اتمیک: لازم
فیلترها: —
- ساختار فیلدها، نام‌های تکراری و قواعد متناقض رد شوند.
- نسخه منتشرشده append-only است؛ فایل و قرارداد قبلی روی نسخه خود بمانند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "field_definitions": [
    {
      "code": "sale_price",
      "name": "قیمت فروش",
      "type": "number",
      "required": true
    }
  ],
  "validation_rules": {
    "required": [
      "sale_price"
    ]
  }
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/properties/{id}/submit-review
ارسال ملک و کارشناسی برای بررسی
مجوز: فقط مسئول فعلی پس از پذیرش ارجاع
سرویس نمونه: submitPropertyForReview
ثبت اتمیک: لازم
فیلترها: —
- آدرس، منطقه، متراژ مثبت و گزارش کامل لازم‌اند؛ نسخه و snapshot ملک و گزارش ثبت شوند؛ درخواست PENDING_REVIEW؛ وظیفه و اعلان مدیر.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/properties/{id}/review
تأیید ملک یا برگشت با دلیل
مجوز: مدیر رنج همان حوزه یا مدیر کل
سرویس نمونه: reviewProperty
ثبت اتمیک: لازم
فیلترها: —
- فقط ملک PENDING با نسخه ارسال‌شده معتبر؛ برای تأیید عنوان لازم است.
- تکمیل وظایف بررسی؛ ثبت تصمیم و اعلان؛ تأیید درخواست را COMPLETED می‌کند، بدون ساخت یا فعال‌سازی خودکار فایل.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "decision": "APPROVED | CHANGES_REQUIRED",
  "reason": "برای برگشت الزامی"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### PUT /api/v1/properties/{id}/listings
ساخت یا ویرایش فایل نوع معامله
مجوز: مشاور مسئول فعلی یا مدیر کل؛ ملک تأییدشده و دارای مسئول فعال
سرویس نمونه: savePropertyListing
ثبت اتمیک: لازم
فیلترها: —
- نوع فعال، نسخه منتشرشده و شرایط معتبر؛ زوج ملک و نوع یکتا؛ فایل پایان‌یافته ویرایش نشود.
- فقط همان فایل تغییر کند؛ نسخه، snapshot و سابقه شرایط قبلی حفظ شوند؛ این فرم تأیید مستقل فایل ندارد.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "property_id": "uuid",
  "deal_type_id": "uuid",
  "sale_price": 0,
  "deposit": 0,
  "monthly_rent": 0,
  "additional_terms": {},
  "status": "ACTIVE | PAUSED"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/deals/{id}/succeed
ثبت نتیجه موفق مذاکره
مجوز: مسئول مجاز مذاکره
سرویس نمونه: succeedDeal
ثبت اتمیک: لازم
فیلترها: —
- فقط NEGOTIATION یا OFFERED به AGREED؛ ثبت عامل و زمان موفقیت و وظیفه آماده‌سازی قرارداد؛ مبلغ در قرارداد تعیین شود.
- result_notes نگهداری و کار CONTRACT_PREPARATION فقط برای مدیرکل‌های فعال ایجاد شود؛ قرارداد را خودکار ایجاد نکند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "notes": "توضیحات توافق"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### PUT /api/v1/contracts/{id}/terms
ویرایش شرایط قرارداد پیش از امضا
مجوز: فقط مدیرکل فعال (GENERAL_MANAGER)
سرویس نمونه: saveContractTerms
ثبت اتمیک: لازم
فیلترها: —
- قرارداد پیش‌نویس یا در انتظار امضا؛ با وجود هر امضای ثبت‌شده تغییر شرایط رد شود؛ اعتبارسنجی طبق نوع و نسخه قرارداد.
- مجوز در فهرست، جزئیات، داده‌های وابسته و فرمان مستقیم کنترل شود؛ مخفی‌کردن دکمه کافی نیست.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "sale_price": 0,
  "deposit": 0,
  "monthly_rent": 0,
  "additional_terms": {}
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### GET /api/v1/public-listings
اکسپلور فایل‌های فعال با اطلاعات عمومی محدود
مجوز: کاربر دارای مجوز اکسپلور؛ فقط فایل فعال معتبر با ملک تأییدشده؛ دسترسی خواندن عمومی داخل سامانه، نه endpoint ناشناس اینترنت
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: search, deal_type_id, page, page_size
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
- projection محدود بدون نشانی خصوصی و هویت/شماره محرمانه مالک؛ بدون امکان ویرایش؛ listing_id دقیق در انتخاب‌ها حفظ شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  }
}
```

### GET /api/v1/public-listings/{id}
جزئیات عمومی فایل مشخص
مجوز: کاربر دارای مجوز اکسپلور؛ فقط فایل فعال معتبر با ملک تأییدشده؛ دسترسی خواندن عمومی داخل سامانه، نه endpoint ناشناس اینترنت
سرویس نمونه: قرارداد پیشنهادی خواندن/مدیریت
ثبت اتمیک: خواندن
فیلترها: —
- خواندن از داده مشترک؛ شمارش، جست‌وجو و فیلتر فقط روی رکوردهای مجاز انجام شود.
- projection محدود بدون نشانی خصوصی و هویت/شماره محرمانه مالک؛ بدون امکان ویرایش؛ listing_id دقیق در انتخاب‌ها حفظ شود.
خطاها: 401: کاربر وارد نشده؛ 403/404: رکورد غیرمجاز یا ناموجود
بدون بدنه درخواست
```json
{
  "data": {
    "id": "record-uuid",
    "version": 1,
    "relationships": {}
  }
}
```

### POST /api/v1/tasks
ثبت کار دستی روی پرونده باز
مجوز: کاربر مجاز موضوع؛ مسئول خود یا مشاور فعال مرتبط
سرویس نمونه: createTask
ثبت اتمیک: لازم
فیلترها: —
- موضوع مجاز و باز و ارجاع پذیرفته‌شده لازم‌اند؛ کار MANUAL و اعلان مسئول ساخته شوند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "subject_type": "registration_request | inquiry | introduction | viewing | deal",
  "subject_id": "uuid",
  "title": "عنوان الزامی",
  "due_at": "ISO",
  "assigned_to_id": "uuid optional"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/tasks/{id}/reschedule
تعویق کار دستی باز
مجوز: کاربر مجاز همان وظیفه
سرویس نمونه: rescheduleTask
ثبت اتمیک: لازم
فیلترها: —
- فقط کار MANUAL باز؛ موعد جدید بعد از زمان فعلی و موعد قبلی؛ سابقه قبلی/جدید و عامل حفظ شود.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "due_at": "ISO",
  "reason": "دلیل الزامی"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/registration-requests/{id}/lifecycle
بستن، لغو، تکراری یا بازگشایی پرونده ملک
مجوز: مدیر کل یا مدیر رنج همان پرونده با مجوز ثبت ملک
سرویس نمونه: changePropertyCaseStatus
ثبت اتمیک: لازم
فیلترها: —
- CLOSED پایان رسیدگی عملیاتی است؛ COMPLETED فقط تکمیل ثبت و کارشناسی است. دلیل، عامل، زمان و وضعیت قبل و بعد حفظ شوند.
- قرارداد قطعی یا امضاشده تغییر از این مسیر را مسدود کند. فایل‌ها متوقف؛ کارها، پیگیری‌ها، معرفی‌ها و بازدیدهای باز لغو؛ مذاکرات باز ناموفق و قرارداد پیش‌نویس بدون امضا لغو شوند؛ اطلاعات حذف نشود.
- متقاضی به خاطر بسته‌شدن یک ملک بسته نشود؛ وضعیت جست‌وجوی او بر اساس روابط باقی‌مانده تنظیم شود.
- بازگشایی نیازمند سابقه بستن معتبر است؛ ملک برای بررسی مجدد برگردد و عرضه، قرارها و مذاکرات قبلی خودکار فعال نشوند.
- در تکراری، اصل معتبر و مجاز و متفاوت لازم است؛ بستن پرونده دارای ملک مشترک با اصل از این مسیر رد شود. تمام آثار و تاریخچه و اعلان در یک تراکنش باشند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "status": "CLOSED | CANCELLED | DUPLICATE | REOPEN",
  "reason": "دلیل الزامی",
  "original_id": "برای تکراری الزامی",
  "due_at": "ISO اختیاری برای بازگشایی"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### PUT /api/v1/inquiries/{id}/needs
ذخیره نیاز و بودجه متقاضی
مجوز: مشاور مسئول پذیرفته‌شده یا مدیر مجاز رنج
سرویس نمونه: saveInquiryNeeds
ثبت اتمیک: لازم
فیلترها: —
- درخواست باز و ارجاع پذیرفته‌شده لازم است؛ نوع معامله فعال و غیرتکراری، مبالغ نامنفی و ترتیب متراژ کنترل شوند.
- کل نیازها و بودجه‌ها اتمیک ذخیره شوند؛ معرفی و بازدید و مذاکره قبلی حذف نشوند. نیاز اولیه DRAFT پس از ذخیره CONFIRMED و زمان/عامل ثبت شود.
- برای داده قدیمی بدون needs_status از وضعیت جاری و سابقه عملیات استفاده شود؛ مسیر پیشرفته به ابتدا برنگردد.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "min_area": 90,
  "max_area": 120,
  "min_rooms": 2,
  "district_ids": [],
  "notes": "اولویت‌ها",
  "preferences": [
    {
      "deal_type_id": "uuid",
      "max_sale_price": 9000000000,
      "max_deposit": 0,
      "max_monthly_rent": 0
    }
  ]
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/inquiries/{id}/lifecycle
بستن، لغو، تکراری و بازگشایی درخواست متقاضی
مجوز: مدیرکل یا مدیر رنج همین درخواست
سرویس نمونه: changeInquiryCaseStatus
ثبت اتمیک: لازم
فیلترها: —
- قرارداد قطعی/امضاشده تغییر را مسدود کند؛ در حضور قرارداد باز فقط مدیرکل بتواند تعیین تکلیف کند.
- فقط معرفی‌ها، بازدیدها، مذاکرات و کارها/پیگیری‌های همین درخواست بسته شوند؛ فایل عرضه ملک برای متقاضیان دیگر هرگز متوقف یا بایگانی نشود.
- snapshot وضعیت و عامل/دلیل/زمان نگهداری شود؛ بازگشایی رویدادهای قبلی را زنده نکند و رسیدگی مجدد نیازمند مشاور فعال و موعد تازه باشد.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "status": "CLOSED | CANCELLED | DUPLICATE | REOPEN",
  "reason": "دلیل",
  "original_id": "پرونده اصلی در تکراری",
  "due_at": "موعد اختیاری بازگشایی"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

### POST /api/v1/cases/{id}/withdrawal/decision
تأیید یا رد انصراف مشاور
مجوز: فقط مدیرکل یا مدیر رنج همان پرونده
سرویس نمونه: reviewConsultantWithdrawal
ثبت اتمیک: لازم
فیلترها: —
- درخواست انصراف PENDING و متعلق به مشاور فعلی باشد. تا تصمیم مدیر، مسئول و پذیرش تغییر نکنند و ارجاع جدید مسدود باشد. تأیید، مسئول قبلی را آزاد و پرونده را آماده ارجاع مجدد کند؛ رد، مسئول قبلی را حفظ کند.
خطاها: 403: عملیات یا حوزه غیرمجاز؛ 409: نسخه/مرحله فعلی تغییر کرده یا فرمان با بدنه متفاوت تکرار شده؛ 422: فیلدها یا روابط نامعتبر؛ هیچ تغییر جزئی ثبت نشود
```json
{
  "collection": "registrationRequests | inquiries",
  "id": "uuid",
  "request_id": "uuid",
  "decision": "APPROVE | REJECT",
  "reason": "دلیل الزامی"
}
```
```json
{
  "data": {
    "id": "record-uuid",
    "status": "resulting_status",
    "version": 2
  },
  "operation_id": "operation-uuid"
}
```

## کاریز
- کارت یک projection از PropertyRegistrationRequest.status، Inquiry.status یا Deal.stage است. جدول جدا با وضعیت مستقل کارت نسازید؛ فهرست و کاریز یک منبع حقیقت دارند.
- پاسخ فهرست/کاریز باید id، code، title، contact_summary، assignee، scope، stage، due_at، next_action، stage_entered_at، missing_fields، warnings و version را داشته باشد؛ اطلاعات خصوصی در کارت عمومی حذف شود.
- stage_entered_at از آخرین StageTransitionHistory همان موضوع به دست می‌آید؛ ویرایش یادداشت یا تغییر مسئول، زمان ورود به مرحله را ریست نکند.
- قبل از drop یا فشردن دکمه، allowed_transitions برای همان کاربر و نسخه دریافت شود. انتقال با فیلد الزامی فرم باز کند. در نمونه drop فرم/جزئیات اقدام لازم را باز می‌کند؛ موفقیت فقط پس از ذخیره سرویس است.
- کشیدن کارت و دکمه باید همان endpoint دامنه را فراخوانی کنند. تا پاسخ موفق، کارت قطعی به ستون مقصد منتقل نشود؛ در 409/422 وضعیت قبلی نگه داشته و اطلاعات تازه خوانده شود.
- در موبایل و کیبورد، اقدام با دکمه و فرم ممکن باشد؛ اجرای عملیات به drag وابسته نباشد. برای ستون خالی، نقص اطلاعات و تأخیر وضعیت واضح نمایش داده شود.
- خواندن شمارش ستون‌ها و فیلترهای رنج/مشاور باید همان WHERE مجوز فهرست را استفاده کند. رکورد با مرحله ناشناخته پنهان نشود؛ در ستون وضعیت قدیمی با مسیر بررسی نمایش داده شود.
- نمونه‌های کد قدیمی مانند NEW/SEARCHING برای نیاز یا WON برای مذاکره قبل از قرارداد نهایی به نگاشت واحد نیاز دارند. انتشار نسخه جدید تنظیمات، مراحل پرونده‌های قدیمی را بی‌اجازه بازنویسی نکند.

### تأمین فایل — PropertyRegistrationRequest.status
CHANGES_REQUIRED → IN_PROGRESS: startAppraisal / saveWorkspace؛ الزامات: تماس، گزارش کارشناسی و اطلاعات تدریجی پرونده؛ مجوز: مشاور مسئول؛ اثر: کارشناسی و مشخصات ملک؛ افزایش نسخه
IN_PROGRESS/CHANGES_REQUIRED → PENDING_REVIEW: submitPropertyForReview؛ الزامات: اطلاعات کامل ملک و گزارش کارشناسی؛ مجوز: مشاور مسئول؛ اثر: snapshot نسخه ملک و گزارش کارشناسی + صف بررسی ملک
PENDING_REVIEW → CHANGES_REQUIRED: reviewProperty؛ الزامات: دلیل برگشت؛ مجوز: مدیر رنج؛ اثر: برگشت ملک و درخواست برای اصلاح؛ توقف عرضه‌های مرتبط + اعلان
PENDING_REVIEW → COMPLETED: reviewProperty؛ الزامات: تأیید همان نسخه ملک ارسال‌شده؛ عنوان مدیریتی الزامی؛ مجوز: مدیر رنج؛ اثر: ملک APPROVED و درخواست COMPLETED؛ بدون ساخت یا فعال‌سازی خودکار فایل

### متقاضیان — Inquiry.status
OPEN → MATCHING: updateInquiry؛ الزامات: اقدام بعدی و موعد پیگیری؛ مجوز: مشاور مسئول؛ اثر: مرحله جست‌وجو؛ جست‌وجو معرفی نمی‌سازد
OPEN/MATCHING → INTRODUCED: introduceListing؛ الزامات: انتخاب صریح فایل فعال و نیاز مجاز؛ مجوز: مسئول نیاز؛ اثر: Introduction با snapshot شرایط
INTRODUCED/VIEWING → NEGOTIATION: createDeal؛ الزامات: معرفی قبلی و فایل فعال؛ مجوز: مسئول نیاز؛ اثر: مذاکره و طرفین مستقل
NEGOTIATION/NEGOTIATING → COMPLETED: finalizeContract؛ الزامات: قرارداد معتبر با امضای تمام طرف‌ها؛ مجوز: فقط مدیرکل؛ اثر: تکمیل نیاز از قرارداد؛ انتقال دستی ممنوع

### مذاکرات — Deal.stage
NEGOTIATION/OFFERED → AGREED: succeedDeal؛ الزامات: ثبت نتیجه موفق؛ مبلغ در قرارداد تعیین می‌شود؛ مجوز: مسئول مذاکره؛ اثر: آماده تنظیم قرارداد
AGREED → CONTRACT: createContract؛ الزامات: مذاکره موفق؛ مبلغ و شرایط قطعی متناسب با نوع معامله؛ مجوز: فقط مدیرکل؛ اثر: پیش‌نویس قرارداد و snapshot هویت
CONTRACT → FINALIZED: finalizeContract؛ الزامات: امضاها، قواعد نوع و کنترل قرارداد ناسازگار؛ مجوز: فقط مدیرکل؛ اثر: قرارداد قطعی، فایل بسته، نیاز تکمیل
NEGOTIATION/OFFERED/AGREED → LOST: closeDeal؛ الزامات: دلیل عدم توافق؛ مجوز: مسئول مذاکره؛ اثر: بستن مذاکره بدون قرارداد

## نقشه پیاده‌سازی هر بخش

### ثبت سرنخ مشاور
مشاور فقط در رنج خود ثبت می‌کند؛ پذیرش و ارجاع با مدیر است.
مدل‌ها: PropertyRegistrationRequest, Inquiry
APIها: POST /api/v1/leads
- ثبت مشاور برای مدیر رنج خودش وظیفه پذیرش بسازد؛ ثبت مدیر مسئول پذیرش جداگانه نمی‌خواهد.

### سرنخ‌ها
صفحه مستقل سرنخ‌ها از رابط حذف و آدرس قدیمی /leads به /inbox هدایت می‌شود؛ ایجاد اولیه پرونده در ویزارد و ثبت درخواست متقاضی حفظ شده است. داده‌های قبلی حذف نمی‌شوند. درخواست قدیمی action=createLead به فرم اولیه سازگار هدایت شود.
مدل‌ها: Contact, PropertyRegistrationRequest, Inquiry, AssignmentHistory
APIها: POST /api/v1/leads؛ POST /api/v1/leads/{id}/accept؛ POST /api/v1/cases/{id}/assign
- ساخت شخص و پرونده اتمیک باشد؛ مجوز گروه و رنج کنترل شود.

### کارتابل پذیرش
کارتابل پذیرش فقط برای تصمیم‌های پذیرش اولیه، پذیرش مشاور، تأیید ملک و تأیید تمدید مهلت است؛ ارجاع و تغییر مسئول در مرحله ارجاع خود پرونده انجام می‌شود.
مدل‌ها: PropertyRegistrationRequest, Inquiry, AssignmentHistory, AssignmentRescheduleHistory, Property, PropertyAppraisal, PropertyReview
APIها: POST /api/v1/cases/{id}/assign؛ POST /api/v1/cases/{id}/accept؛ POST /api/v1/cases/{id}/reject؛ POST /api/v1/cases/{id}/postpone؛ POST /api/v1/cases/{id}/extensions/{request_id}/approve؛ POST /api/v1/cases/{id}/extensions/{request_id}/reject؛ POST /api/v1/leads/{id}/accept؛ GET /api/v1/property-reviews؛ POST /api/v1/properties/{id}/review؛ POST /api/v1/cases/{id}/withdrawal/decision
- فقط مسئول فعلی بپذیرد؛ ثبت درخواست تمدید موعد را تغییر ندهد؛ رد ارجاع از صف کارشناس خارج شود؛ سابقه حفظ شود.
- تب پیش‌فرض ALL باشد؛ state در URL و تازه‌سازی حفظ شود. شمارنده هر تب از داده مجاز و فیلتر جست‌وجو/نوع پرونده محاسبه شود. آماده ارجاع‌های بدون مشاور که قبلاً در سرنخ‌ها بودند از قلم نیفتند. درخواست تمدید معلق برای مشاور صاحب پرونده قابل مشاهده ولی تصمیم آن فقط برای مدیر مجاز باشد. تب‌ها با کیبورد و aria-selected کار کنند.
- پرونده UNASSIGNED یا REJECTED بدون تصمیم تأییدیِ معلق، در کارتابل پذیرش نمایش داده نشود؛ تب و دکمه ارجاع از کارتابل حذف باشند. ستون ارجاع کاریز به جزئیات همان پرونده وصل شود.
- انصراف مشاور تصمیم فوری نیست: درخواست pending تا تأیید مدیر رنج/مدیرکل مسئول قبلی را حفظ کند و ارجاع جدید را مسدود کند. پس از تأیید از کارتابل خارج و در مرحله ارجاع پرونده قابل واگذاری باشد. رد درخواست، همان مسئول را نگه دارد.
- کارت منتظر پذیرش مشاور فقط در کارتابل همان مشاور بیاید؛ مدیر رنج و مدیرکل آن را در کارتابل خود نبینند. درخواست انصراف مشاور به عنوان تصمیم مدیر مستقل از پذیرش مشاور نمایش داده شود.
- کارت‌ها سربرگ وضعیت، نام پرونده، مشخصات مسئول، خلاصه، اقدام اصلی و لینک سابقه با ترتیب ثابت داشته باشند؛ فرم تصمیم انصراف در مودال withdrawalReview با شناسه همان پرونده باز شود و پس از رفرش باز بماند.

### گروه‌ها و سطح دسترسی
مجوز گروه مستقل از عضویت رنج است.
مدل‌ها: Group, User, ScopeMembership
APIها: GET /api/v1/users
- مسیر مستقیم و منو تابع همان دسترسی باشند.

### نمای کلی
تجمیع عملیاتی برای کاربر فعلی؛ آمار از همان داده‌های پرونده‌ها خوانده شود.
مدل‌ها: User, Group, StaffProfile, ScopeMembership, Task, Listing, Inquiry, Deal, Commission
APIها: GET /api/v1/dashboard؛ GET /api/v1/reports/operations
- شمارش رکوردهای خارج از حوزه در آمار افشا نشود.
- ارزش معامله، کمیسیون، وصول و سهم پرداختی جدا بمانند.

### کارهای من
وظیفه با مسئول، موعد و دقیقاً یک موضوع معتبر.
مدل‌ها: Task, FollowUp, Viewing, Notification, StageTransitionHistory
APIها: GET /api/v1/tasks؛ POST /api/v1/tasks/{id}/complete؛ POST /api/v1/followups/{id}/complete؛ POST /api/v1/viewings/{id}/complete؛ POST /api/v1/tasks؛ POST /api/v1/tasks/{id}/reschedule
- موعد وظیفه پیگیری/بازدید با scheduled_at برابر باشد.
- ثبت نتیجه رویداد، وظیفه مرتبط را در همان تراکنش تکمیل کند؛ دکمه تکمیل عمومی نباید نتیجه را دور بزند.

### رنج‌ها و اعضای تیم
حوزه اختیار از عضویت جاری خوانده می‌شود؛ مجوز از گروه کاربر.
مدل‌ها: ManagementScope, ScopeMembership, StaffProfile, ScopeTransferHistory, AssignmentHistory, PropertyRegistrationRequest, Property, Listing
APIها: GET /api/v1/management-scopes؛ GET /api/v1/management-scopes/{id}؛ POST /api/v1/management-scopes؛ POST /api/v1/scope-memberships/transfer؛ POST /api/v1/scope-transfers؛ POST /api/v1/assignments
- هر مشاور در نمونه یک عضویت فعال داشته باشد؛ تاریخچه عضویت حذف نشود.
- تغییر عضویت کارمند، انتقال پرونده و تغییر مسئول سه فرمان مستقل‌اند.
- درخواست تبدیل‌شده، ملک و عرضه‌های وابسته هنگام انتقال حوزه هماهنگ بمانند.

### کارکنان و گروه‌ها
هویت ورود، اطلاعات کارمند و گروه‌های چندگانه از هم جدا باشند.
مدل‌ها: User, Group, UserGroup, StaffProfile, ScopeMembership
APIها: GET /api/v1/users؛ POST /api/v1/users؛ PUT /api/v1/users/{id}/groups؛ POST /api/v1/scope-memberships/transfer
- User فیلد role موازی نداشته باشد؛ permission_codes از مجموع گروه‌ها جمع شود.
- گروه اجازه عمل می‌دهد و عضویت رنج دامنه داده را تعیین می‌کند.

### اشخاص
شخص هویت مشترک است و می‌تواند هم‌زمان مالک، متقاضی و طرف قرارداد باشد.
مدل‌ها: Contact, ContactPhone, PropertyContact, Inquiry, Introduction, Viewing, DealParticipant, ContractParty, FollowUp
APIها: GET /api/v1/contacts؛ GET /api/v1/contacts/{id}؛ POST /api/v1/contacts؛ PATCH /api/v1/contacts/{id}
- شماره نرمال‌شده هشدار تکراری بدهد؛ ادغام خودکار ممنوع.
- اطلاعات خصوصی مالک در کارت عمومی فایل یا جست‌وجوی مشاور دیگر افشا نشود.
- مسئول قرارداد فقط اشخاص مرتبط با مذاکرات/قراردادهای مجاز خود را ببیند.

### درخواست ملک و فضای کاری کارشناسی
فهرست پرونده‌ها با خلاصه مراحل، مسئول مرحله و ادامه مسیر؛ جزئیات requests/{id} همان ویزارد مشترک است و view=history سوابق و گزینه‌های قبلی را نگه می‌دارد.
مدل‌ها: PropertyRegistrationRequest, RegistrationRequestDealType, Contact, Property, PropertyContact, PropertyAppraisal, Listing, PropertyReview, AssignmentHistory, ScopeTransferHistory, Task, Notification
APIها: GET /api/v1/registration-requests؛ GET /api/v1/registration-requests/{id}؛ POST /api/v1/registration-requests؛ POST /api/v1/cases/{id}/assign؛ POST /api/v1/cases/{id}/accept؛ POST /api/v1/registration-requests/{id}/title؛ POST /api/v1/registration-requests/{id}/reopen-appraisal؛ POST /api/v1/registration-requests/{id}/duplicate؛ POST /api/v1/registration-requests/{id}/appraisal/start؛ PUT /api/v1/registration-requests/{id}/workspace؛ POST /api/v1/properties/{id}/submit-review؛ POST /api/v1/scope-transfers؛ POST /api/v1/assignments؛ POST /api/v1/registration-requests/{id}/lifecycle
- ذخیره کارشناسی فقط ملک و گزارش را بسازد یا تکمیل کند؛ Listing خودکار نسازید.
- عنوان در اختیار مدیر؛ ارسال نسخه ملک و گزارش مستقل از وجود فایل است.
- ثبت‌کننده، مسئول فعلی و مدیر پذیرنده سه مفهوم مستقل‌اند؛ تاریخچه و وظایف اتمیک باشند.
- فرم بررسی ملک شامل قیمت کارشناسی نیست؛ گزارش وضعیت و موقعیت ثبت شود. مبلغ پیشنهادی فقط در فایل عرضه است و توضیح درباره قیمت در صورت نیاز متن آزاد گزارش است؛ داده مالی قدیمی حذف نشود.
- فهرست و جزئیات از propertyWizardStage و PropertyFlowWizard مشترک استفاده کنند؛ مرحله موازی یا فرمان جدا نسازید. فیلترها، صفحه‌بندی، کاریز و مجوزها حفظ شوند؛ مراحل آینده فقط مرورند.
- نمای کارشناس ابتدا فقط اقدام بعدی را نشان دهد: تکمیل گزارش یا مرور و ارسال. فرم با edit=workspace باز شود؛ با ذخیره موفق به حالت مرور برگردد. در جزئیات، ثبت جدید، پرونده‌ها و سوابق دکمه‌های ثابت بالا باشند؛ سوابق مودال و کارها و پیگیری‌ها باکس کنار مراحل باشند. در بررسی مدیر، دکمه تأیید بالای تغییر عنوان قرار گیرد و در نبود عنوان علت غیرفعال‌بودن مشخص باشد.
- casePanel=history سوابق را در مودال باز کند؛ کارها و پیگیری‌ها در باکس ثابت کنار مراحل باشند. activityAction و activityRecord فرم فرزند را نگه دارند؛ بستن فرم فرزند، پرونده و باکس کار را حفظ کند. فهرست کار و پیگیری و سوابق فقط داده مجاز همان پرونده را بخواند.
- COMPLETED درخواست ثبت، پایان کارشناسی است نه پایان پرونده ملک؛ برای ملک APPROVED و ACTIVE با ارجاع پذیرفته‌شده و بدون قرارداد قطعی، ثبت کار و پیگیری فعال بماند. لغو/تکراری، عدم پذیرش و ملک بایگانی یا قرارداد قطعی مجاز نیستند؛ مجوز UI و فرمان از activityOpen مشترک استفاده کنند.
- سوابق ملک علاوه بر خط زمانی، بازدید، مذاکره و قرارداد تمام فایل‌های همان ملک را با نام متقاضی و شناسه فایل دقیق نشان دهد. نام متقاضی projection حداقلی رویداد مجاز است و شماره تماس یا دسترسی کامل شخص ایجاد نمی‌کند؛ هر رویداد و لینک جزئیات مجوز مستقل داشته باشد. نشان مرحله جاری بدون متن اضافه و با aria-current نمایش داده شود.
- دکمه وضعیت پرونده با caseStatus=1 باز شود؛ تغییر برای مدیر مجاز و با دلیل است. CLOSED از COMPLETED جداست؛ بستن، لغو، تکراری و بازگشایی به فرمان دامنه اتمیک متصل باشند. قرارداد دارای امضا/قطعی مسدود؛ بازگشایی، عرضه و برنامه‌های قبلی را خودکار فعال نکند.
- در فهرست، دکمه وضعیت ملک با caseStatus=شناسه‌پرونده و سوابق با historyCase=شناسه‌پرونده مودال مشترک جزئیات را باز کنند؛ مسیر /requests، جست‌وجو، فیلتر و p هنگام بازکردن، تازه‌سازی و بستن حفظ شوند. شناسه مودال فقط از پرونده مجاز انتخاب شود؛ تغییر وضعیت مجوز مستقل مدیر را حفظ کند.
- پیگیری کار در فهرست با workCase=شناسه پرونده مودال باز کند؛ ثبت کار و پیگیری در فرم فرزند activityAction انجام شود. مدیر رنجِ مجاز و مدیرکل بتوانند به مشاور فعال مرتبط ارجاع دهند و در پرونده ملک پیش‌فرض مسئول همان assigned_to_id باشد. ذخیره، مودال اصلی و فیلترهای فهرست را نگه دارد؛ بستن والد پارامترهای فرم فرزند را پاک کند. پرونده بسته یا ارجاع نپذیرفته همچنان مجاز به ثبت نیست.
- لینک فایل عرضه در جزئیات ویزارد در تب/پنجره جدید با target=_blank و rel=noopener noreferrer باز شود تا مسیر و مرحله پرونده مبدأ باقی بماند.
- در مودال سوابق، روی هر ردیف مجاز اقدام بعدی نمایش داده شود: ثبت نتیجه بازدید → شروع مذاکره برای همان متقاضی/فایل → نتیجه موفق یا ناموفق. commercialAction/commercialRecord فرم فرزند را بازیابی کنند؛ رفرش، بستن یا Escape فرم فرزند، مودال سوابق و فیلتر فهرست را نگه دارند. شناسه جعلی یا رکورد متعلق به ملک دیگر هیچ فرم عملیاتی باز نکند.
- هر ۷ فیلتر مرحله همیشه از ثبت اولیه تا فایل عرضه نمایش داده شوند، حتی با شمارنده صفر؛ فهرست همه پرونده‌های مجازِ پذیرش و ارجاع را نیز شامل شود و شمارنده‌ها از همان مجموعه محاسبه شوند.
- پس از حذف صفحات مستقل، معرفی‌های ملک هم در سوابق نمایش داده شوند؛ مشاور سمت ملک بتواند بدون ورود به پرونده خصوصی متقاضی، بازدید برنامه‌ریزی یا عدم تمایل را با دلیل ثبت کند. هیچ لینک مستقل معرفی/بازدید/مذاکره از سوابق تولید نشود؛ قرارداد مجاز همچنان صفحه مستقل دارد.
- درخواست تمدید مهلت در محتوای اصلی جزئیات همان پرونده نمایش یابد؛ موعد فعلی، موعد پیشنهادی، دلیل، درخواست‌کننده و نتیجه تصمیم مدیر پس از رفرش حفظ شوند. اقدام تصمیم مدیر از جزئیات به کارتابل پذیرش هدایت شود.

### صف بررسی مدیر رنج
صف ملک‌های در انتظار بررسی؛ تأیید مدیر متعلق به ملک و گزارش کارشناسی است، مستقل از فایل عرضه.
مدل‌ها: PropertyReview, Listing, Property, PropertyAppraisal, PropertyRegistrationRequest, Notification, StageTransitionHistory
APIها: GET /api/v1/property-reviews؛ GET /api/v1/properties/{id}؛ POST /api/v1/properties/{id}/review
- review_submitted_version با نسخه جاری ملک یکسان باشد؛ تأیید نیازمند عنوان است.
- برگشت دلیل الزامی دارد؛ تأیید درخواست را تکمیل می‌کند و فایل جدید یا فعال‌سازی خودکار نمی‌سازد.

### املاک من
املاک تأییدشده مسئول فعلی؛ دارایی فیزیکی از فایل‌های عرضه مستقل است.
مدل‌ها: Property, PropertyContact, Contact, PropertyAppraisal, Listing, District, PropertyType, PropertyUsage
APIها: GET /api/v1/properties؛ GET /api/v1/properties/{id}؛ PUT /api/v1/properties/{id}/listings؛ POST /api/v1/scope-transfers؛ POST /api/v1/assignments
- sale_price، deposit و monthly_rent روی Property ذخیره نشوند.
- مالکیت چندنفره از جدول واسط با سهم و مالک اصلی خوانده شود.
- شناسه رنج و مشاور با درخواست و عرضه هماهنگ بماند.
- فایل‌های عرضه و ویرایش شرایط از جزئیات ملک در تب/پنجره جدید باز شوند؛ صفحه ملک مبدأ حفظ شود.

### فایل‌های عرضه من
برای هر ملک تأییدشده یک فایل مستقل به ازای هر نوع معامله؛ شرایط و تاریخچه هر فایل جداست.
مدل‌ها: Listing, Property, PropertyReview, DealType, DealTypeVersion, PropertyRegistrationRequest
APIها: GET /api/v1/listings؛ GET /api/v1/listings/{id}؛ PUT /api/v1/properties/{id}/listings؛ POST /api/v1/listings/{id}/status
- UNIQUE(property_id,deal_type_id)؛ داده هم‌نوع تکراری قدیمی ابتدا تعیین تکلیف شود.
- review_status قدیمی فایل فقط سازگاری است؛ منبع تأیید Property است و صف بررسی فایل مستقل نسازید.
- فعال‌سازی به تأیید ملک و شرایط معتبر وابسته؛ اکسپلور projection خواندنی با اطلاعات محدود است.
- انتخاب معرفی و مذاکره همیشه listing_id دقیق را حفظ کند؛ تغییر یک نوع سایر فایل‌ها را بازنویسی نکند.

### نیاز مشتری و تطبیق
درخواست متقاضی با الگوی مشترک پرونده ملک: ثبت مرحله‌ای، پذیرش مدیر، ارجاع، پذیرش مشاور، تکمیل نیاز، معرفی فایل، بازدید، مذاکره و قرارداد. مراحل از داده واقعی مشتق شوند و هر فایل معرفی‌شده مسیر مستقل دارد.
مدل‌ها: Inquiry, InquiryDealPreference, InquiryAttributeCriterion, InquiryDistrict, InquiryPropertyType, Contact, Listing, Property, Introduction, Task
APIها: GET /api/v1/inquiries؛ GET /api/v1/inquiries/{id}؛ POST /api/v1/inquiries؛ PATCH /api/v1/inquiries/{id}؛ GET /api/v1/inquiries/{id}/matches؛ POST /api/v1/introductions؛ POST /api/v1/followups؛ POST /api/v1/scope-transfers؛ PUT /api/v1/inquiries/{id}/needs؛ POST /api/v1/inquiries/{id}/lifecycle
- تطبیق نوع، منطقه، نوع ملک، متراژ، بودجه و شروط ضروری دلیل صریح داشته باشد.
- در GET تطبیق هیچ Introduction ساخته نشود؛ معرفی فرمان صریح است.
- جزئیات /inquiries/{id} به‌صورت پیش‌فرض ویزارد مشترک است؛ فهرست کارت‌های جمع‌وجور با مراحل، مسئول واقعی، فیلتر مرحله، صفحه‌بندی، وضعیت درخواست، سوابق و پیگیری کار در مودال باشد. queryها و شماره صفحه حفظ شوند؛ آخرین پرونده بعد از Back قابل پیدا کردن باشد.
- سوابق شامل معرفی‌های همین متقاضی در تمام ملک‌ها، بازدید، مذاکره و قرارداد مجاز است. برنامه‌ریزی بازدید و ثبت نتیجه، شروع مذاکره از بازدید مناسب، نتیجه موفق/ناموفق و تنظیم قرارداد مدیرکل از همان مودال انجام شوند. شناسه رویداد متقاضی دیگر در query هیچ فرمی باز نکند.
- کارها و پیگیری‌ها در جزئیات کنار مراحل و در فهرست داخل مودال باشند؛ مدیرکل/مدیر رنج بتوانند برای مشاور مسئول درخواست ثبت کنند و مسئول پیش‌فرض همان assigned_to_id باشد. پرونده بسته یا ارجاع نپذیرفته مجاز نیست.
- نمای فعلی با چند فایل موازی، پیشرفت معتبر جلوتر را نشان دهد؛ فقط مذاکره ثبت‌شده به مرحله مذاکره و مذاکره موفق به قرارداد برسد و بازدید باز دیگر مرحله را عقب نبرد؛ تمام مسیرهای فایل‌ها در سوابق باقی بمانند. بازدید منفی بدون مذاکره فعال درخواست را به جست‌وجوی فایل دیگر برگرداند. بستن درخواست فقط رویدادهای خودش را لغو کند و هرگز فایل ملک را متوقف نکند.
- فیلترهای ۹ مرحله همیشه و به ترتیب مسیر نمایش داده شوند؛ مرحله بدون پرونده با شمارنده صفر قابل انتخاب باشد. فهرست متقاضیان همه درخواست‌های مجاز از پذیرش اولیه و ارجاع تا قرارداد را شامل شود؛ فقط موارد پذیرفته‌شده را محدود نکند. شمارنده و نتایج همچنان تابع دسترسی و فیلترهای جاری باشند.
- صرف معرفی فایل، مرحله را به بازدید نبرد؛ ورود به بازدید با ثبت قرار واقعی باشد و بازدید تکمیل‌شده نیازمند تعیین تکلیف مذاکره حفظ شود. بعد از scheduleViewing، فقط فرم زمان بسته و سوابق حفظ شود؛ فرم نتیجه خودکار باز نشود و دکمه ثبت نتیجه روی ردیف همان بازدید/فایل نمایش داده شود؛ scheduled_at در آینده مانع completeViewing نیست. بستن فرم نتیجه قرار ثبت‌شده را لغو نکند. فایل متوقف/ملک نیازمند اصلاح، علت و مسیر مجاز پیگیری وضعیت را نشان دهد.
- بازدید COMPLETED با interest=INTERESTED و بدون مذاکره مرتبط، در مرحله بازدید باقی بماند و در فهرست انتخاب برای شروع مذاکره نمایش داده شود؛ شروع مذاکره فقط با انتخاب صریح همان بازدید و ثبت createDeal انجام شود. فهرست معرفی‌ها، بازدیدها و مذاکرات داخل مراحل نمایش داده شود و هر فایل مستقل بماند؛ قرارداد یا مذاکره فعال بر بازدیدهای موازیِ منتظر نتیجه مقدم باشد و تعداد بازدیدهای باقی‌مانده نمایش داده شود. نتیجه مثبت بعد از رفرش نیز مرحله بازدید را حفظ کند؛ query مرور stage پس از ثبت موفق عملیات پاک شود. نتیجه مثبتِ مصرف‌شده در مذاکره ناموفق دوباره پیشرفت مصنوعی نسازد.
- در فهرست عملیاتی معرفی‌ها، فقط معرفی‌های ردنشده بدون بازدید SCHEDULED یا COMPLETED نمایش داده شوند؛ دکمه ثبت بازدید پس از ذخیره موفق، فایل را به بخش بازدیدها منتقل کند. معرفی اصلی از داده و سوابق حذف نشود و لغو فرم هیچ انتقالی ایجاد نکند.
- حذف معرفی با تأیید کاربر و updateIntroduction با status=CANCELLED انجام شود؛ فقط معرفی باز بدون بازدید غیرلغوشده و بدون مذاکره مرتبط مجاز است. توقف عرضه مانع حذف معرفی نباشد. ملک، فایل عرضه و سابقه معرفی حفظ شوند؛ CANCELLED از فهرست عملیاتی کنار گذاشته شود.
- کارت معرفی، بازدید و مذاکره نام مشاور متقاضی و مشاور ملک را با عنوان نقش نشان دهد؛ در صورت متفاوت بودن دو نفر، نشان همکاری دو مشاور نمایش یابد. شناسه‌های ثبت‌شده روی معرفی بر مسئول جاری مقدم‌اند؛ ثبت‌کننده متفاوت معرفی جدا نمایش داده شود. ارتباط بازدید و مذاکره با معرفی دقیق حفظ شود.
- مرحله قرارداد فهرست مذاکرات موفق AGREED/CONTRACT/FINALIZED همان درخواست و قراردادهای قابل‌دسترسی را نمایش دهد؛ تنظیم قرارداد از روی مذاکره انتخاب‌شده باز شود. مذاکرات ناموفق در این فهرست نیایند. طبق قرارداد دسترسی فعلی، دکمه و فرمان تنظیم قرارداد فقط برای مدیرکل مجاز است.
- باکس وضعیت تمدید مهلت با همان رفتار پرونده ملک در جزئیات متقاضی نیز نمایش یابد؛ پرونده نامرتبط وضعیت تمدید را نبیند.

### معرفی‌ها
رابط یک درخواست متقاضی با یک عرضه در یک لحظه مشخص.
مدل‌ها: Introduction, Inquiry, Listing, Viewing, Deal, FollowUp
APIها: GET /api/v1/introductions؛ POST /api/v1/introductions؛ PATCH /api/v1/introductions/{id}؛ POST /api/v1/viewings؛ POST /api/v1/deals؛ POST /api/v1/followups
- introduced_terms_snapshot ثبت شود تا تغییر بعدی قیمت، سابقه معرفی را عوض نکند.
- علاقه و رد با بازخورد ثبت شوند؛ رد دلیل داشته باشد.
- صفحه مستقل از منوی محصول حذف شده است؛ عملیات و داده دامنه حفظ می‌شوند و در سوابق پرونده ملک/متقاضی اجرا می‌شوند. مسیر قدیمی فهرست به پرونده‌ها و شناسه رویداد به سوابق پرونده مرتبط با کنترل دسترسی فعلی هدایت شود؛ مشاور ملک بدون دسترسی به متقاضی به پرونده ملک خودش برود.

### بازدیدها و تقویم
بازدید مشتری به معرفی وصل است و کارشناسی اولیه ملک نیست.
مدل‌ها: Viewing, Introduction, Inquiry, Task, Notification
APIها: GET /api/v1/viewings؛ POST /api/v1/viewings؛ POST /api/v1/viewings/{id}/complete
- داده‌ها ISO و تقویم/ساعت رابط بر مبنای تهران باشد؛ API بازه زمانی و مسئول را فیلتر کند.
- موعد Task با Viewing برابر و ثبت نتیجه، وظیفه مرتبط را تکمیل کند.
- نتیجه تمایل INTERESTED یا NOT_INTERESTED به همراه گزارش ثبت شود؛ نتیجه منفی اجازه مذاکره ندهد و نتیجه بازدید تکمیل‌شده قابل بازنویسی نباشد. شروع مذاکره به همان viewing_id، listing_id و inquiry_id متصل بماند.
- صفحه مستقل از منوی محصول حذف شده است؛ عملیات و داده دامنه حفظ می‌شوند و در سوابق پرونده ملک/متقاضی اجرا می‌شوند. مسیر قدیمی فهرست به پرونده‌ها و شناسه رویداد به سوابق پرونده مرتبط با کنترل دسترسی فعلی هدایت شود؛ مشاور ملک بدون دسترسی به متقاضی به پرونده ملک خودش برود.

### پیگیری‌ها
تماس یا اقدام برنامه‌ریزی‌شده درباره شخص و پرونده.
مدل‌ها: FollowUp, FollowUpRescheduleHistory, Task, Contact, ActivityLog
APIها: GET /api/v1/followups؛ POST /api/v1/followups؛ POST /api/v1/followups/{id}/reschedule؛ POST /api/v1/followups/{id}/complete
- تعویق دلیل و زمان قبل/بعد داشته باشد؛ سابقه append-only بماند.
- اقدام بعدی و موعد آن با هم اعتبارسنجی و ذخیره شوند.

### مذاکرات و پیشنهادها
مذاکره روی فایل دقیق؛ نتیجه موفق یا ناموفق ثبت می‌شود و مبلغ توافق در قرارداد تعیین می‌شود.
مدل‌ها: Deal, DealParticipant, Offer, Listing, Inquiry, Introduction, DealTypeVersion, Contract
APIها: GET /api/v1/deals؛ GET /api/v1/deals/{id}؛ POST /api/v1/deals؛ POST /api/v1/deals/{id}/succeed؛ POST /api/v1/deals/{id}/contract؛ POST /api/v1/deals/{id}/close؛ POST /api/v1/followups
- submitOffer و acceptOffer در نمونه فعلی غیرفعال‌اند؛ Offer مسیر جاری محصول نیست.
- نتیجه موفق AGREED است؛ قطعی‌شدن و بسته‌شدن فایل فقط پس از قرارداد معتبر است.
- نتیجه موفق با توضیحات به AGREED برسد و کار تنظیم قرارداد فقط برای مدیرکل فعال بسازد؛ ناموفق با دلیل LOST شود. مذاکره فعال تکراری برای همان متقاضی و فایل ساخته نشود. قرارداد و مبلغ قطعی فقط در دسترس مدیرکل باشند.
- صفحه مستقل از منوی محصول حذف شده است؛ عملیات و داده دامنه حفظ می‌شوند و در سوابق پرونده ملک/متقاضی اجرا می‌شوند. مسیر قدیمی فهرست به پرونده‌ها و شناسه رویداد به سوابق پرونده مرتبط با کنترل دسترسی فعلی هدایت شود؛ مشاور ملک بدون دسترسی به متقاضی به پرونده ملک خودش برود.

### قراردادها
تنظیم، ویرایش، امضا، قطعی‌سازی و اصلاحیه قرارداد فقط توسط مدیرکل؛ ورودی مذاکره موفق است و مبلغ توافق در قرارداد ثبت می‌شود.
مدل‌ها: Contract, ContractParty, ContractSignature, ContractAttachment, ContractAmendment, Deal, Offer, DealTypeVersion, Contact
APIها: GET /api/v1/contracts؛ GET /api/v1/contracts/{id}؛ POST /api/v1/deals/{id}/contract؛ POST /api/v1/contracts/{id}/signatures؛ POST /api/v1/contracts/{id}/attachments؛ POST /api/v1/contracts/{id}/finalize؛ POST /api/v1/contracts/{id}/amendments؛ PUT /api/v1/contracts/{id}/terms
- قبل از قطعی‌سازی همه امضاها، نوع/نسخه و شرایط مالی بررسی شوند.
- هم‌زمانی دو قرارداد ناسازگار یک ملک با قفل ردیف و کنترل دیتابیس مدیریت شود.
- قرارداد قطعی و snapshot هویت از ویرایش عادی محافظت شوند؛ اصلاحیه مسیر جدا دارد.
- انحصار GENERAL_MANAGER در منو، مسیر مستقیم، query فرم، canAccess رکورد و داده وابسته و فرمان‌های createContract/saveContractTerms/signContract/addContractAttachment/finalizeContract/createAmendment اعمال شود. نقش CONTRACT_OFFICER سابق یا FINANCE مجوز پرونده قرارداد ایجاد نکند. کارهای قدیمی CONTRACT_PREPARATION برای نقش‌های دیگر پنهان و غیرقابل اجرا باشند.

### کمیسیون و دریافت‌وپرداخت
مطالبات، سهم‌ها و وجوه از ارزش معامله جدا ثبت و محاسبه شوند.
مدل‌ها: CommissionPolicyVersion, Commission, CommissionShare, Payment, PaymentAllocation, Contract, Contact, User
APIها: GET /api/v1/commissions؛ POST /api/v1/contracts/{id}/commission؛ GET /api/v1/payments؛ POST /api/v1/payments؛ POST /api/v1/payments/{id}/reverse
- تخصیص کل از وجه و تخصیص به یک مطالبه از مانده آن بیشتر نباشد.
- مجموع سهم‌ها از مبلغ قابل تقسیم بیشتر نشود؛ سهم پرداختی از وصول مرتبط بیشتر نشود.
- وجوه تأییدشده حذف نشوند؛ برگشت مرتبط و idempotent ثبت شود.

### گزارش‌ها
خواندن تجمیعی همان رکوردهای مجاز؛ پایگاه جدا یا داده تکراری نیاز نیست.
مدل‌ها: Task, Listing, Inquiry, Introduction, Viewing, Deal, Contract, Commission, CommissionShare, Payment, PaymentAllocation
APIها: GET /api/v1/reports/operations؛ GET /api/v1/dashboard
- شاخص تبدیل مبنای شمارش مشخص داشته باشد؛ اشخاص چنددرخواستی بدون تعریف شاخص چندبار شمرده نشوند.
- ثمن، ودیعه، اجاره و ارزش مشارکت/معاوضه در جمع مبهم ادغام نشوند.

### اعلان‌ها و سوابق
اعلان شخصی و تاریخچه غیرقابل بازنویسی رویدادها.
مدل‌ها: Notification, ActivityLog, StageTransitionHistory, AssignmentHistory, ScopeTransferHistory, PropertyReview, FollowUpRescheduleHistory
APIها: GET /api/v1/notifications؛ POST /api/v1/notifications/{id}/read؛ GET /api/v1/timeline
- event_key یکتا مانع اعلان تکراری شود؛ operation_id رویدادهای یک فرمان را مرتبط کند.
- اشتراک operation_id مجوز مشاهده پرونده نامرتبط نیست؛ خط زمانی باید روابط و مجوز تک‌تک موضوع‌ها را بررسی کند.

### انواع معامله و نسخه‌ها
شش خانواده رفتاری مشخص با نسخه‌های منتشرشده غیرقابل بازنویسی.
مدل‌ها: DealType, DealTypeVersion, CommissionPolicyVersion, Listing, Deal, Contract
APIها: GET /api/v1/deal-types؛ POST /api/v1/deal-types؛ POST /api/v1/deal-types/{id}/versions
- نوع ملک با نوع معامله یکی نیست؛ behavior_type فقط یکی از رفتارهای پشتیبانی‌شده باشد.
- نسخه جدید، سوابق قبلی را خودکار مهاجرت نکند؛ نسخه و snapshot قرارداد پابرجا باشند.
- سیاست کمیسیون نمونه است؛ تغییر آن نباید calculation_snapshot کمیسیون قدیمی را عوض کند.

### نقشه کامل سامانه
مرجع ارتباط همه مدل‌ها و سه چرخه اصلی برای طراحی بک‌اند.
مدل‌ها: Contact, PropertyRegistrationRequest, Property, PropertyAppraisal, Listing, Inquiry, Introduction, Viewing, Deal, Offer, Contract, Commission, Payment, Task, FollowUp
APIها: GET /api/v1/registration-requests/{id}؛ GET /api/v1/properties/{id}؛ PUT /api/v1/properties/{id}/listings؛ GET /api/v1/inquiries/{id}؛ GET /api/v1/deals/{id}؛ GET /api/v1/contracts/{id}؛ GET /api/v1/timeline
- از تب «همه مدل‌ها» فرهنگ کامل جدول‌ها را ببینید.
- مرز سه چرخه حفظ شود؛ رابط یکپارچه دلیل ادغام جدول‌های مستقل نیست.

### کاریز عملیات
دو کاریز پرونده‌های ملک و پرونده‌های متقاضی؛ تب مستقل مذاکرات حذف است. هر کارت همان پرونده اصلی است و مرحله از داده واقعی و منطق ویزارد مشتق می‌شود.
مدل‌ها: PropertyRegistrationRequest, Inquiry, Deal, Task, StageTransitionHistory, AssignmentHistory, Notification
APIها: GET /api/v1/registration-requests؛ GET /api/v1/inquiries؛ GET /api/v1/deals؛ POST /api/v1/cases/{id}/assign؛ POST /api/v1/properties/{id}/submit-review؛ POST /api/v1/properties/{id}/review؛ POST /api/v1/introductions؛ POST /api/v1/deals/{id}/succeed؛ POST /api/v1/contracts/{id}/finalize
- هر ۷ مرحله ملک و هر ۹ مرحله متقاضی حتی با شمارنده صفر نمایش یابد؛ مرحله جاری از propertyWizardStage و inquiryWizardStage خوانده شود.
- پذیرش و ارجاع در کاریز قابل مشاهده‌اند؛ پذیرش به کارتابل و ارجاع به مرحله ارجاع خود پرونده هدایت شود.
- کارت و شمارنده فقط رکوردهای مجاز با فیلتر رنج، مسئول و جست‌وجو را شامل شوند؛ فیلترها و تب در URL بمانند.
- مذاکرات جزئی از مسیر متقاضی هستند؛ انتقال نمایشی کارت وضعیت را تغییر ندهد. پرونده بسته در کاریز فعال نمایش داده نشود؛ پرونده دارای ملک تأییدشده در ستون فایل عرضه دیده شود.

### اکسپلور فایل‌های عرضه
فایل‌های فعال و معتبر همه مشاوران با اطلاعات قابل عرضه؛ بدون مجوز ویرایش.
مدل‌ها: Property, Listing, DealTypeVersion, Introduction
APIها: GET /api/v1/public-listings؛ GET /api/v1/public-listings/{id}؛ POST /api/v1/introductions
- serializer عمومی فاقد نشانی خصوصی و مشخصات محرمانه مالک باشد؛ لینک مستقیم همان محدودیت فهرست را رعایت کند.

### ثبت ملک
ویزارد کامل از ثبت سرنخ تا پذیرش مدیر، ارجاع، پذیرش مشاور، کارشناسی، تأیید ملک و فایل عرضه؛ هر مرحله متعلق به نقش مسئول است.
مدل‌ها: Contact, PropertyRegistrationRequest, AssignmentHistory, Property, PropertyAppraisal, PropertyReview, Listing, Task, Notification
APIها: POST /api/v1/leads؛ POST /api/v1/leads/{id}/accept؛ POST /api/v1/cases/{id}/assign؛ POST /api/v1/cases/{id}/accept؛ POST /api/v1/cases/{id}/reject؛ PUT /api/v1/registration-requests/{id}/workspace؛ POST /api/v1/registration-requests/{id}/title؛ POST /api/v1/properties/{id}/submit-review؛ POST /api/v1/properties/{id}/review؛ PUT /api/v1/properties/{id}/listings؛ POST /api/v1/registration-requests/{id}/lifecycle
- مرحله جاری از وضعیت ذخیره‌شده پرونده و ملک مشتق شود؛ query مرحله مجوز عبور از پذیرش یا تأیید نیست.
- case شناسه همان درخواست است؛ فرم‌های قدیمی حفظ شده‌اند و عملیات نسخه جدا ندارد.
- ثبت‌کننده می‌تواند مسیر پرونده خودش را پیگیری کند؛ عملیات و داده کارشناسی فقط با مجوز رکورد و نقش نمایش داده شوند.
- آخرین پرونده هر فهرست به تفکیک کاربر در sessionStorage ذخیره شود؛ لینک بازگشت فقط با دسترسی فعلی نمایش داده شود.
- نوار مسیر در جزئیات پرونده، ملک و فایل به همان case و stage لینک می‌دهد؛ انتخاب مرحله قبلی یا آینده فقط مرور است و فرمانی اجرا نمی‌کند.
- عنوان رنج مسئول حفظ شود؛ نام مدیر از عضویت MANAGER فعال همان رنج خوانده شود. نام مسئول هر مرحله از ثبت‌کننده، مدیر جاری یا مشاور فعلی مشتق شود؛ در نبود مسئول، وضعیت تعیین‌نشده نمایش داده شود.
- ادامه پرونده قبلی با chooseCase=1 پنجره جست‌وجو و انتخاب رکورد مجاز باز کند؛ بستن آن case و stage و پیش‌نویس را حفظ کند. خطای فرمان و اعتبارسنجی با SweetAlert2 نمایش داده شود؛ شکست عملیات پیش‌نویس را پاک نکند.
- پس از ذخیره موفق گزارش بازدید، پیام مرور و ارسال نمایش داده شود؛ انصراف ارسال نمی‌کند. reviewRequest شناسه درخواست در URL، مودال خلاصه اطلاعات ذخیره‌شده است؛ فقط تأیید صریح submitPropertyForReview را اجرا کند. شکست ذخیره پیام موفقیت یا ارسال ایجاد نکند.

### ثبت درخواست متقاضی
درخواست متقاضی با الگوی مشترک پرونده ملک: ثبت مرحله‌ای، پذیرش مدیر، ارجاع، پذیرش مشاور، تکمیل نیاز، معرفی فایل، بازدید، مذاکره و قرارداد. مراحل از داده واقعی مشتق شوند و هر فایل معرفی‌شده مسیر مستقل دارد.
مدل‌ها: Inquiry, InquiryDealPreference, InquiryAttributeCriterion, InquiryDistrict, InquiryPropertyType, Contact, Listing, Property, Introduction, Task
APIها: GET /api/v1/inquiries؛ GET /api/v1/inquiries/{id}؛ POST /api/v1/inquiries؛ PATCH /api/v1/inquiries/{id}؛ GET /api/v1/inquiries/{id}/matches؛ POST /api/v1/introductions؛ POST /api/v1/followups؛ POST /api/v1/scope-transfers؛ PUT /api/v1/inquiries/{id}/needs؛ POST /api/v1/inquiries/{id}/lifecycle؛ POST /api/v1/leads
- تطبیق نوع، منطقه، نوع ملک، متراژ، بودجه و شروط ضروری دلیل صریح داشته باشد.
- در GET تطبیق هیچ Introduction ساخته نشود؛ معرفی فرمان صریح است.
- جزئیات /inquiries/{id} به‌صورت پیش‌فرض ویزارد مشترک است؛ فهرست کارت‌های جمع‌وجور با مراحل، مسئول واقعی، فیلتر مرحله، صفحه‌بندی، وضعیت درخواست، سوابق و پیگیری کار در مودال باشد. queryها و شماره صفحه حفظ شوند؛ آخرین پرونده بعد از Back قابل پیدا کردن باشد.
- سوابق شامل معرفی‌های همین متقاضی در تمام ملک‌ها، بازدید، مذاکره و قرارداد مجاز است. برنامه‌ریزی بازدید و ثبت نتیجه، شروع مذاکره از بازدید مناسب، نتیجه موفق/ناموفق و تنظیم قرارداد مدیرکل از همان مودال انجام شوند. شناسه رویداد متقاضی دیگر در query هیچ فرمی باز نکند.
- کارها و پیگیری‌ها در جزئیات کنار مراحل و در فهرست داخل مودال باشند؛ مدیرکل/مدیر رنج بتوانند برای مشاور مسئول درخواست ثبت کنند و مسئول پیش‌فرض همان assigned_to_id باشد. پرونده بسته یا ارجاع نپذیرفته مجاز نیست.
- نمای فعلی با چند فایل موازی، پیشرفت معتبر جلوتر را نشان دهد؛ فقط مذاکره ثبت‌شده به مرحله مذاکره و مذاکره موفق به قرارداد برسد و بازدید باز دیگر مرحله را عقب نبرد؛ تمام مسیرهای فایل‌ها در سوابق باقی بمانند. بازدید منفی بدون مذاکره فعال درخواست را به جست‌وجوی فایل دیگر برگرداند. بستن درخواست فقط رویدادهای خودش را لغو کند و هرگز فایل ملک را متوقف نکند.
- فرم سه بخش مشخصات متقاضی، نوع درخواست و مرور نهایی داشته باشد؛ ثبت نهایی پرونده جدید ایجاد و ادامه به همان شناسه منتقل شود. مشاور رنج خودش و مدیر فقط رنج مجاز را انتخاب کند. ثبت شخص موجود صرفاً با دسترسی مجاز باشد.
