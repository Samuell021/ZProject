> **مرجع تطبیق جدید — ۲۰ اکتبر ۲۰۲۶:** [راهنمای جامع و شواهد کد](docs/developer/README.fa.md). این فایل سابقه طرح است؛ ادعاهای قدیمی درباره وجود Contact، PropertyRegistrationRequest و ManagementScope در backend با checkout فعلی تأیید نشدند. برای تفکیک پیاده‌سازی واقعی، mock و پیشنهاد، به بسته جدید رجوع کنید.

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
