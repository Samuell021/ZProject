# پیوست شواهد کد واقعی — ۲۰ اکتبر ۲۰۲۶

[راهنمای اصلی](README.fa.md)

این فهرست با خواندن فایل فعلی و AST پایتون تولید شده است؛ اجرای سرور، introspection دیتابیس یا OpenAPI تولیدی نیست. مسیرها نسبت به ریشه مخزن هستند؛ #L شماره خط در زمان بررسی است. نقل کد URL/router باید با include والد ترکیب شود. متد CRUD پایه را از کلاس والد و overrideها تعیین کنید؛ وجود ModelViewSet تضمین بازبودن همه متدها نیست.

## مبنای قابل بازبینی

HEAD محلی: `3754b3dae109dde435e4cb8d4449b2cb6de6608c`. تغییرهای کاربر نیز در بررسی لحاظ شده‌اند. فایل‌های خارج از Sample فقط خوانده شدند.

## مدل‌ها و enumهای واقعی Django

### ZaminexB/apps/accounts/models.py

منبع: [ZaminexB/apps/accounts/models.py:1](../../../ZaminexB/apps/accounts/models.py#L1)

#### `UserRole` — `models.TextChoices`

تعریف: [ZaminexB/apps/accounts/models.py:8](../../../ZaminexB/apps/accounts/models.py#L8)

مقادیر enum: `ADMIN = ('ADMIN', 'مدیر')`؛ `RANGE_MANAGER = ('RANGE_MANAGER', 'مدیر رنج')`؛ `AGENT = ('AGENT', 'کارشناس')`

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `User` — `AbstractUser`

تعریف: [ZaminexB/apps/accounts/models.py:14](../../../ZaminexB/apps/accounts/models.py#L14)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `role` | `models.CharField` | `` | default=UserRole.AGENT؛ db_index=True؛ max_length=20؛ choices=UserRole.choices | 15 |

متدها: `is_admin_role` (خط 28)، `is_range_manager_role` (خط 32)، `is_agent_role` (خط 36)، `is_staff_member` (خط 40)

#### `RolePermission` — `models.Model`

تعریف: [ZaminexB/apps/accounts/models.py:44](../../../ZaminexB/apps/accounts/models.py#L44)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `code` | `models.CharField` | `` | unique=True؛ max_length=64 | 45 |
| `name` | `models.CharField` | `` | max_length=160 | 46 |
| `group` | `models.CharField` | `` | max_length=80 | 47 |
| `group_order` | `models.PositiveSmallIntegerField` | `` | default=0 | 48 |
| `sort_order` | `models.PositiveSmallIntegerField` | `` | default=0 | 49 |

متدها: `__str__` (خط 56)

#### `Role` — `models.Model`

تعریف: [ZaminexB/apps/accounts/models.py:60](../../../ZaminexB/apps/accounts/models.py#L60)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `code` | `models.CharField` | `` | unique=True؛ max_length=20؛ choices=UserRole.choices | 61 |
| `name` | `models.CharField` | `` | max_length=80 | 67 |
| `sort_order` | `models.PositiveSmallIntegerField` | `` | default=0 | 68 |
| `is_locked` | `models.BooleanField` | `` | default=False | 69 |
| `permissions` | `models.ManyToManyField` | `RolePermission` | blank=True؛ related_name='roles' | 70 |

متدها: `__str__` (خط 82)

#### `SalesRange` — `models.Model`

تعریف: [ZaminexB/apps/accounts/models.py:86](../../../ZaminexB/apps/accounts/models.py#L86)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `name` | `models.CharField` | `` | unique=True؛ max_length=120 | 87 |
| `managers` | `models.ManyToManyField` | `settings.AUTH_USER_MODEL` | blank=True؛ related_name='managed_ranges'؛ limit_choices_to={'role': UserRole.RANGE_MANAGER} | 88 |
| `members` | `models.ManyToManyField` | `settings.AUTH_USER_MODEL` | blank=True؛ related_name='sales_ranges'؛ limit_choices_to={'role': UserRole.AGENT} | 95 |
| `is_active` | `models.BooleanField` | `` | default=True | 102 |
| `created_at` | `models.DateTimeField` | `` |  | 103 |

متدها: `__str__` (خط 110)

#### `LoginAttempt` — `models.Model`

تعریف: [ZaminexB/apps/accounts/models.py:114](../../../ZaminexB/apps/accounts/models.py#L114)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `username` | `models.CharField` | `` | unique=True؛ db_index=True؛ max_length=255 | 115 |
| `failed_attempts` | `models.PositiveSmallIntegerField` | `` | default=0 | 116 |
| `locked_until` | `models.DateTimeField` | `` | null=True؛ blank=True؛ db_index=True | 117 |
| `last_failed_at` | `models.DateTimeField` | `` | null=True؛ blank=True | 118 |
| `last_ip` | `models.GenericIPAddressField` | `` | null=True؛ blank=True | 119 |
| `last_user_agent` | `models.CharField` | `` | blank=True؛ max_length=255 | 120 |
| `updated_at` | `models.DateTimeField` | `` |  | 121 |

متدها: `__str__` (خط 128)

#### `ConsultantProfile` — `models.Model`

تعریف: [ZaminexB/apps/accounts/models.py:132](../../../ZaminexB/apps/accounts/models.py#L132)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `user` | `models.OneToOneField` | `settings.AUTH_USER_MODEL` | on_delete=models.CASCADE؛ related_name='consultant_profile' | 138 |
| `full_name` | `models.CharField` | `` | max_length=255 | 144 |
| `mobile` | `models.CharField` | `` | null=True؛ blank=True؛ unique=True؛ max_length=11 | 145 |
| `branch` | `models.CharField` | `` | max_length=255 | 146 |
| `profile_image` | `models.ImageField` | `` | null=True؛ blank=True؛ db_index=True | 147 |
| `hired_at` | `models.DateField` | `` | default=datetime.date.today | 149 |
| `notes` | `models.TextField` | `` | blank=True | 150 |
| `is_active` | `models.BooleanField` | `` | default=True | 151 |

متدها: `__str__` (خط 158)

#### `LoginMethod` — `models.TextChoices`

تعریف: [ZaminexB/apps/accounts/models.py:162](../../../ZaminexB/apps/accounts/models.py#L162)

مقادیر enum: `PASSWORD = ('password', 'رمز عبور')`؛ `SMS = ('sms', 'کد پیامکی')`

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `LoginSettings` — `models.Model`

تعریف: [ZaminexB/apps/accounts/models.py:167](../../../ZaminexB/apps/accounts/models.py#L167)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `method` | `models.CharField` | `` | default=LoginMethod.PASSWORD؛ max_length=20؛ choices=LoginMethod.choices | 168 |
| `updated_at` | `models.DateTimeField` | `` |  | 174 |

متدها: `__str__` (خط 180)، `get_solo` (خط 186)

#### `SmsProviderSettings` — `models.Model`

تعریف: [ZaminexB/apps/accounts/models.py:191](../../../ZaminexB/apps/accounts/models.py#L191)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `smsir_api_key` | `models.CharField` | `` | blank=True؛ max_length=1024 | 192 |
| `smsir_line_number` | `models.CharField` | `` | blank=True؛ max_length=32 | 193 |
| `smsir_template_id` | `models.CharField` | `` | blank=True؛ max_length=64 | 199 |
| `kavenegar_api_key` | `models.CharField` | `` | blank=True؛ max_length=1024 | 205 |
| `kavenegar_sender` | `models.CharField` | `` | blank=True؛ default='20006535'؛ max_length=32 | 206 |
| `kavenegar_template_name` | `models.CharField` | `` | blank=True؛ max_length=128 | 212 |
| `kavenegar_message` | `models.CharField` | `` | blank=True؛ default='کد ورود شما به زمینکس: {code}'؛ max_length=500 | 218 |
| `updated_at` | `models.DateTimeField` | `` |  | 225 |

متدها: `__str__` (خط 231)، `smsir_api_key_plain` (خط 235)، `kavenegar_api_key_plain` (خط 241)، `save` (خط 246)، `get_solo` (خط 266)

#### `SmsLoginCode` — `models.Model`

تعریف: [ZaminexB/apps/accounts/models.py:271](../../../ZaminexB/apps/accounts/models.py#L271)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `mobile` | `models.CharField` | `` | db_index=True؛ max_length=16 | 272 |
| `code_hash` | `models.CharField` | `` | max_length=255 | 273 |
| `created_at` | `models.DateTimeField` | `` |  | 274 |
| `expires_at` | `models.DateTimeField` | `` | db_index=True | 275 |
| `attempts` | `models.PositiveSmallIntegerField` | `` | default=0 | 276 |
| `consumed_at` | `models.DateTimeField` | `` | null=True؛ blank=True | 277 |

متدها: `__str__` (خط 284)

#### `AdminProfile` — `models.Model`

تعریف: [ZaminexB/apps/accounts/models.py:288](../../../ZaminexB/apps/accounts/models.py#L288)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `user` | `models.OneToOneField` | `settings.AUTH_USER_MODEL` | on_delete=models.CASCADE؛ related_name='admin_profile' | 294 |
| `full_name` | `models.CharField` | `` | blank=True؛ max_length=255 | 300 |
| `mobile` | `models.CharField` | `` | null=True؛ blank=True؛ max_length=11 | 301 |
| `branch` | `models.CharField` | `` | blank=True؛ default='شعبه مرکزی'؛ max_length=255 | 302 |
| `profile_image` | `models.ImageField` | `` | null=True؛ blank=True؛ db_index=True | 303 |
| `hired_at` | `models.DateField` | `` | default=datetime.date.today | 305 |
| `notes` | `models.TextField` | `` | blank=True | 306 |
| `is_active` | `models.BooleanField` | `` | default=True | 307 |

متدها: `__str__` (خط 314)

### ZaminexB/apps/activity/models.py

منبع: [ZaminexB/apps/activity/models.py:1](../../../ZaminexB/apps/activity/models.py#L1)

#### `ActivityLog` — `models.Model`

تعریف: [ZaminexB/apps/activity/models.py:5](../../../ZaminexB/apps/activity/models.py#L5)

مقادیر `ActionType`: `CREATE = ('create', 'ایجاد')`؛ `UPDATE = ('update', 'بروزرسانی')`؛ `DELETE = ('delete', 'حذف')`؛ `ARCHIVE = ('archive', 'بایگانی')`؛ `COMPLETE = ('complete', 'تکمیل')`؛ `STATUS_CHANGE = ('status_change', 'تغییر وضعیت')`؛ `APPROVE = ('approve', 'تایید')`؛ `REJECT = ('reject', 'رد')`؛ `EXPORT = ('export', 'خروجی')`

مقادیر `TargetType`: `PROPERTY = ('property', 'ملک')`؛ `LISTING = ('listing', 'آگهی')`؛ `TASK = ('task', 'وظیفه')`؛ `FOLLOWUP = ('followup', 'پیگیری')`؛ `TICKET = ('ticket', 'تیکت')`؛ `CONSULTANT = ('consultant', 'کارشناس')`؛ `SYSTEM = ('system', 'سیستم')`

قید/ایندکس `indexes`: `[models.Index(fields=['user', '-created_at']), models.Index(fields=['target_type', '-created_at']), models.Index(fields=['action', '-created_at'])]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `user` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | null=True؛ blank=True؛ on_delete=models.SET_NULL؛ related_name='activity_logs' | 26 |
| `action` | `models.CharField` | `` | db_index=True؛ max_length=20؛ choices=ActionType.choices | 34 |
| `target_type` | `models.CharField` | `` | db_index=True؛ max_length=20؛ choices=TargetType.choices | 35 |
| `target_id` | `models.IntegerField` | `` | null=True؛ blank=True | 36 |
| `description` | `models.CharField` | `` | max_length=500 | 37 |
| `metadata` | `models.JSONField` | `` | blank=True؛ default=dict | 38 |
| `created_at` | `models.DateTimeField` | `` | db_index=True | 39 |

متدها: `__str__` (خط 52)

### ZaminexB/apps/analytics/models.py

منبع: [ZaminexB/apps/analytics/models.py:1](../../../ZaminexB/apps/analytics/models.py#L1)

#### `AIInsightCache` — `models.Model`

تعریف: [ZaminexB/apps/analytics/models.py:4](../../../ZaminexB/apps/analytics/models.py#L4)

قید/ایندکس `constraints`: `[models.UniqueConstraint(fields=['entity', 'entity_id'], name='uniq_ai_insight_entity')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `entity` | `models.CharField` | `` | max_length=20 | 5 |
| `entity_id` | `models.PositiveIntegerField` | `` |  | 6 |
| `fingerprint` | `models.CharField` | `` | max_length=64 | 7 |
| `payload` | `models.JSONField` | `` |  | 8 |
| `created_at` | `models.DateTimeField` | `` |  | 9 |
| `updated_at` | `models.DateTimeField` | `` |  | 10 |

متدها: `__str__` (خط 22)

### ZaminexB/apps/basics/models.py

منبع: [ZaminexB/apps/basics/models.py:1](../../../ZaminexB/apps/basics/models.py#L1)

#### `PropertyUsage` — `ReferenceDataModel`

تعریف: [ZaminexB/apps/basics/models.py:12](../../../ZaminexB/apps/basics/models.py#L12)

قید/ایندکس `constraints`: `[ReferenceDataModel.alive_name_unique('property_usage')]`

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `PropertyType` — `ReferenceDataModel`

تعریف: [ZaminexB/apps/basics/models.py:22](../../../ZaminexB/apps/basics/models.py#L22)

قید/ایندکس `constraints`: `[ReferenceDataModel.alive_name_unique('property_type')]`

قید/ایندکس `indexes`: `[models.Index(fields=['property_usage', 'sort_order'])]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `property_usage` | `models.ForeignKey` | `PropertyUsage` | on_delete=models.PROTECT؛ related_name='property_types' | 23 |
| `slug` | `models.SlugField` | `` | null=True؛ blank=True؛ unique=True؛ max_length=255 | 29 |
| `attributes` | `models.ManyToManyField` | `'basics.Attribute'` | related_name='property_types' | 37 |

#### `DealType` — `ReferenceDataModel`

تعریف: [ZaminexB/apps/basics/models.py:54](../../../ZaminexB/apps/basics/models.py#L54)

قید/ایندکس `constraints`: `[ReferenceDataModel.alive_name_unique('deal_type')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `attributes` | `models.ManyToManyField` | `'basics.Attribute'` | related_name='deal_types' | 55 |

#### `AttributeCategory` — `ReferenceDataModel`

تعریف: [ZaminexB/apps/basics/models.py:71](../../../ZaminexB/apps/basics/models.py#L71)

قید/ایندکس `constraints`: `[ReferenceDataModel.alive_name_unique('attribute_category')]`

متدها: `is_system_category` (خط 81)، `attribute_count` (خط 84)

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `Attribute` — `ReferenceDataModel`

تعریف: [ZaminexB/apps/basics/models.py:88](../../../ZaminexB/apps/basics/models.py#L88)

مقادیر `DataType`: `TEXT = ('text', 'متن')`؛ `INTEGER = ('integer', 'عدد صحیح')`؛ `DECIMAL = ('decimal', 'عدد اعشاری')`؛ `BOOLEAN = ('boolean', 'بله / خیر')`؛ `DATE = ('date', 'تاریخ')`؛ `SELECT = ('select', 'انتخاب یکی')`؛ `MULTISELECT = ('multiselect', 'انتخاب چندتایی')`

مقادیر `InputType`: `DEFAULT = ('default', 'پیش\u200cفرض')`؛ `PRICE = ('price', 'مبلغ')`

مقادیر `FilterType`: `NONE = ('none', 'بدون فیلتر')`؛ `EXACT = ('exact', 'تطابق دقیق')`؛ `RANGE = ('range', 'بازه\u200cای')`؛ `RANGE_FAST = ('range_fast', 'بازه\u200cای (سریع)')`؛ `EXISTS = ('exists', 'وجود دارد')`

مقادیر `Entity`: `PROPERTY = ('property', 'ملک')`؛ `LISTING = ('listing', 'آگهی')`

مقادیر `Category`: `ESSENTIAL = (ESSENTIAL_CATEGORY, 'ویژگی ضروری')`؛ `NON_ESSENTIAL = (NON_ESSENTIAL_CATEGORY, 'ویژگی غیر ضروری')`

قید/ایندکس `constraints`: `[ReferenceDataModel.alive_name_unique('attribute')]`

قید/ایندکس `indexes`: `[models.Index(fields=['entity', 'sort_order']), models.Index(fields=['is_facility'], condition=models.Q(is_facility=True), name='idx_attribute_facility')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `data_type` | `models.CharField` | `` | max_length=20؛ choices=DataType.choices | 117 |
| `input_type` | `models.CharField` | `` | default=InputType.DEFAULT؛ max_length=20؛ choices=InputType.choices | 122 |
| `filter_type` | `models.CharField` | `` | default=FilterType.NONE؛ max_length=20؛ choices=FilterType.choices | 129 |
| `entity` | `models.CharField` | `` | default=Entity.PROPERTY؛ db_index=True؛ max_length=20؛ choices=Entity.choices | 135 |
| `unit` | `models.CharField` | `` | blank=True؛ max_length=50 | 142 |
| `category` | `models.CharField` | `` | default=Category.NON_ESSENTIAL؛ db_index=True؛ max_length=100 | 149 |
| `is_facility` | `models.BooleanField` | `` | default=False | 160 |
| `is_core` | `models.BooleanField` | `` | default=False | 166 |
| `core_field` | `models.CharField` | `` | blank=True؛ max_length=50 | 174 |

متدها: `clean` (خط 197)، `value_field` (خط 214)

#### `AttributeOption` — `SoftDeleteModel`

تعریف: [ZaminexB/apps/basics/models.py:226](../../../ZaminexB/apps/basics/models.py#L226)

قید/ایندکس `constraints`: `[models.UniqueConstraint(fields=['attribute', 'value'], condition=models.Q(deleted_at__isnull=True), name='uq_attribute_option_value_alive')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `attribute` | `models.ForeignKey` | `Attribute` | on_delete=models.CASCADE؛ related_name='options' | 227 |
| `value` | `models.CharField` | `` | max_length=100 | 233 |
| `display_name` | `models.CharField` | `` | max_length=255 | 238 |
| `sort_order` | `models.DecimalField` | `` | default=0؛ max_digits=10؛ decimal_places=2 | 239 |

متدها: `__str__` (خط 256)

#### `AttributeLink` — `models.Model`

تعریف: [ZaminexB/apps/basics/models.py:260](../../../ZaminexB/apps/basics/models.py#L260)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `attribute` | `models.ForeignKey` | `Attribute` | on_delete=models.CASCADE | 261 |
| `sort_order` | `models.DecimalField` | `` | default=0؛ max_digits=10؛ decimal_places=2 | 266 |
| `is_active` | `models.BooleanField` | `` | default=True | 269 |

#### `PropertyTypeAttribute` — `AttributeLink`

تعریف: [ZaminexB/apps/basics/models.py:275](../../../ZaminexB/apps/basics/models.py#L275)

قید/ایندکس `constraints`: `[models.UniqueConstraint(fields=['property_type', 'attribute'], name='uq_property_type_attribute')]`

قید/ایندکس `indexes`: `[models.Index(fields=['property_type', 'is_active', 'sort_order'])]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `property_type` | `models.ForeignKey` | `PropertyType` | on_delete=models.CASCADE؛ related_name='attribute_links' | 276 |
| `is_required` | `models.BooleanField` | `` | default=False | 282 |

متدها: `__str__` (خط 297)، `clean` (خط 300)

#### `DealTypeAttribute` — `AttributeLink`

تعریف: [ZaminexB/apps/basics/models.py:308](../../../ZaminexB/apps/basics/models.py#L308)

قید/ایندکس `constraints`: `[models.UniqueConstraint(fields=['deal_type', 'attribute'], name='uq_deal_type_attribute')]`

قید/ایندکس `indexes`: `[models.Index(fields=['deal_type', 'is_active', 'sort_order'])]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `deal_type` | `models.ForeignKey` | `DealType` | on_delete=models.CASCADE؛ related_name='attribute_links' | 309 |
| `is_required` | `models.BooleanField` | `` | default=False | 315 |

متدها: `__str__` (خط 330)، `clean` (خط 333)

#### `PropertyTypeSearchAttribute` — `AttributeLink`

تعریف: [ZaminexB/apps/basics/models.py:341](../../../ZaminexB/apps/basics/models.py#L341)

قید/ایندکس `constraints`: `[models.UniqueConstraint(fields=['property_type', 'attribute'], name='uq_property_type_search_attribute')]`

قید/ایندکس `indexes`: `[models.Index(fields=['property_type', 'is_active', 'sort_order'])]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `property_type` | `models.ForeignKey` | `PropertyType` | on_delete=models.CASCADE؛ related_name='search_attribute_links' | 342 |

متدها: `__str__` (خط 362)

#### `DealTypeSearchAttribute` — `AttributeLink`

تعریف: [ZaminexB/apps/basics/models.py:366](../../../ZaminexB/apps/basics/models.py#L366)

قید/ایندکس `constraints`: `[models.UniqueConstraint(fields=['deal_type', 'attribute'], name='uq_deal_type_search_attribute')]`

قید/ایندکس `indexes`: `[models.Index(fields=['deal_type', 'is_active', 'sort_order'])]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `deal_type` | `models.ForeignKey` | `DealType` | on_delete=models.CASCADE؛ related_name='search_attribute_links' | 367 |

متدها: `__str__` (خط 387)

#### `Province` — `ReferenceDataModel`

تعریف: [ZaminexB/apps/basics/models.py:391](../../../ZaminexB/apps/basics/models.py#L391)

قید/ایندکس `constraints`: `[ReferenceDataModel.alive_name_unique('province')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `slug` | `models.SlugField` | `` | null=True؛ blank=True؛ unique=True؛ max_length=255 | 392 |

#### `City` — `ReferenceDataModel`

تعریف: [ZaminexB/apps/basics/models.py:410](../../../ZaminexB/apps/basics/models.py#L410)

قید/ایندکس `constraints`: `[models.UniqueConstraint(fields=['province', 'name'], condition=models.Q(deleted_at__isnull=True), name='uq_city_name_per_province_alive')]`

قید/ایندکس `indexes`: `[models.Index(fields=['province', 'sort_order'])]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `province` | `models.ForeignKey` | `Province` | on_delete=models.PROTECT؛ related_name='cities' | 411 |
| `slug` | `models.SlugField` | `` | null=True؛ blank=True؛ unique=True؛ max_length=255 | 417 |

#### `District` — `ReferenceDataModel`

تعریف: [ZaminexB/apps/basics/models.py:442](../../../ZaminexB/apps/basics/models.py#L442)

قید/ایندکس `constraints`: `[models.UniqueConstraint(fields=['city', 'name'], condition=models.Q(deleted_at__isnull=True), name='uq_district_name_per_city_alive')]`

قید/ایندکس `indexes`: `[models.Index(fields=['city', 'sort_order'])]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `city` | `models.ForeignKey` | `City` | on_delete=models.PROTECT؛ related_name='districts' | 443 |
| `slug` | `models.SlugField` | `` | null=True؛ blank=True؛ unique=True؛ max_length=255 | 449 |

متدها: `full_path` (خط 474)

### ZaminexB/apps/common/models.py

منبع: [ZaminexB/apps/common/models.py:1](../../../ZaminexB/apps/common/models.py#L1)

#### `District` — `models.Model`

تعریف: [ZaminexB/apps/common/models.py:5](../../../ZaminexB/apps/common/models.py#L5)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `name` | `models.CharField` | `` | unique=True؛ max_length=255 | 7 |
| `is_active` | `models.BooleanField` | `` | default=True | 8 |
| `created_at` | `models.DateTimeField` | `` |  | 9 |
| `updated_at` | `models.DateTimeField` | `` |  | 10 |

متدها: `__str__` (خط 17)

#### `CompanySettings` — `models.Model`

تعریف: [ZaminexB/apps/common/models.py:21](../../../ZaminexB/apps/common/models.py#L21)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `company_name` | `models.CharField` | `` | max_length=255 | 22 |
| `license_number` | `models.CharField` | `` | blank=True؛ max_length=50 | 23 |
| `email` | `models.EmailField` | `` | blank=True | 24 |
| `phone` | `models.CharField` | `` | blank=True؛ max_length=50 | 25 |
| `address` | `models.TextField` | `` | blank=True | 26 |
| `ai_enabled` | `models.BooleanField` | `` | default=False | 27 |
| `ai_api_base_url` | `models.CharField` | `` | blank=True؛ max_length=500 | 30 |
| `ai_api_key` | `models.CharField` | `` | blank=True؛ max_length=2048 | 35 |
| `ai_model` | `models.CharField` | `` | max_length=200 | 40 |
| `ai_last_test` | `models.JSONField` | `` | null=True؛ blank=True | 45 |
| `updated_at` | `models.DateTimeField` | `` |  | 51 |

متدها: `__str__` (خط 57)، `ai_api_key_plain` (خط 61)، `set_ai_api_key` (خط 65)، `save` (خط 69)، `clean` (خط 75)، `get_solo` (خط 108)، `DistrictModel` (خط 114)

#### `AIConfiguration` — `CompanySettings`

تعریف: [ZaminexB/apps/common/models.py:118](../../../ZaminexB/apps/common/models.py#L118)

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

### ZaminexB/apps/followups/models.py

منبع: [ZaminexB/apps/followups/models.py:1](../../../ZaminexB/apps/followups/models.py#L1)

#### `FollowUpType` — `models.TextChoices`

تعریف: [ZaminexB/apps/followups/models.py:7](../../../ZaminexB/apps/followups/models.py#L7)

مقادیر enum: `CALL = ('Call', 'تماس تلفنی')`؛ `MEETING = ('Meeting', 'جلسه حضوری')`؛ `EMAIL = ('Email', 'ارسال پیام/ایمیل')`؛ `SITE_VISIT = ('Site Visit', 'بازدید میدانی ملک')`

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `FollowUpStatus` — `models.TextChoices`

تعریف: [ZaminexB/apps/followups/models.py:14](../../../ZaminexB/apps/followups/models.py#L14)

مقادیر enum: `SCHEDULED = ('scheduled', 'برنامه\u200cریزی\u200cشده')`؛ `COMPLETED = ('completed', 'تکمیل\u200cشده')`

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `FollowUpQuerySet` — `models.QuerySet`

تعریف: [ZaminexB/apps/followups/models.py:19](../../../ZaminexB/apps/followups/models.py#L19)

متدها: `active` (خط 20)، `archived` (خط 23)، `scheduled` (خط 26)، `completed` (خط 29)، `overdue` (خط 32)

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `FollowUp` — `models.Model`

تعریف: [ZaminexB/apps/followups/models.py:40](../../../ZaminexB/apps/followups/models.py#L40)

قید/ایندکس `indexes`: `[models.Index(fields=['consultant', 'status']), models.Index(fields=['property']), models.Index(fields=['scheduled_at']), models.Index(fields=['is_archived'])]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `title` | `models.CharField` | `` | max_length=255 | 41 |
| `follow_up_type` | `models.CharField` | `` | default=FollowUpType.CALL؛ max_length=20؛ choices=FollowUpType.choices | 42 |
| `contact_name` | `models.CharField` | `` | max_length=255 | 48 |
| `scheduled_at` | `models.DateTimeField` | `` | default=timezone.now | 49 |
| `consultant` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | on_delete=models.PROTECT؛ related_name='followups'؛ limit_choices_to={'role__in': ['AGENT', 'RANGE_MANAGER']} | 51 |
| `consultant_name` | `models.CharField` | `` | blank=True؛ max_length=255 | 58 |
| `property` | `models.ForeignKey` | `'properties.Property'` | null=True؛ blank=True؛ on_delete=models.SET_NULL؛ related_name='followups' | 60 |
| `property_title` | `models.CharField` | `` | null=True؛ blank=True؛ max_length=255 | 68 |
| `notes` | `models.TextField` | `` | null=True؛ blank=True | 70 |
| `outcome` | `models.TextField` | `` | null=True؛ blank=True | 71 |
| `status` | `models.CharField` | `` | default=FollowUpStatus.SCHEDULED؛ max_length=20؛ choices=FollowUpStatus.choices | 72 |
| `probability` | `models.PositiveSmallIntegerField` | `` | null=True؛ blank=True | 78 |
| `is_archived` | `models.BooleanField` | `` | default=False | 86 |
| `archived_at` | `models.DateTimeField` | `` | null=True؛ blank=True | 87 |
| `created_at` | `models.DateTimeField` | `` |  | 89 |
| `updated_at` | `models.DateTimeField` | `` |  | 90 |

متدها: `__str__` (خط 105)، `save` (خط 108)، `is_overdue` (خط 119)، `archive` (خط 126)، `unarchive` (خط 132)

### ZaminexB/apps/listings/models.py

منبع: [ZaminexB/apps/listings/models.py:1](../../../ZaminexB/apps/listings/models.py#L1)

#### `Listing` — `models.Model`

تعریف: [ZaminexB/apps/listings/models.py:7](../../../ZaminexB/apps/listings/models.py#L7)

مقادیر `Status`: `DRAFT = ('DRAFT', 'پیش\u200cنویس')`؛ `ACTIVE = ('ACTIVE', 'منتشرشده (فعال)')`؛ `PAUSED = ('PAUSED', 'متوقف\u200cشده')`؛ `SOLD = ('SOLD', 'فروخته\u200cشده')`؛ `EXPIRED = ('EXPIRED', 'منقضی\u200cشده')`؛ `ARCHIVED = ('ARCHIVED', 'بایگانی\u200cشده')`

مقادیر `PublishChannel`: `WEBSITE = ('WEBSITE', 'وب\u200cسایت')`؛ `INSTAGRAM = ('INSTAGRAM', 'اینستاگرام')`؛ `TELEGRAM = ('TELEGRAM', 'تلگرام')`؛ `OTHER = ('OTHER', 'سایر')`

مقادیر `Priority`: `LOW = (1, 'اولویت کم')`؛ `NORMAL = (2, 'اولویت عادی')`؛ `HIGH = (3, 'اولویت بالا')`؛ `URGENT = (4, 'اولویت فوری')`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `property` | `models.ForeignKey` | `'properties.Property'` | on_delete=models.CASCADE؛ related_name='listings' | 28 |
| `deal_type` | `models.ForeignKey` | `'basics.DealType'` | null=True؛ blank=True؛ on_delete=models.PROTECT؛ related_name='listings' | 35 |
| `title` | `models.CharField` | `` | max_length=255 | 44 |
| `description` | `models.TextField` | `` | blank=True | 45 |
| `status` | `models.CharField` | `` | default=Status.ACTIVE؛ max_length=20؛ choices=Status.choices | 47 |
| `rejection_reason` | `models.TextField` | `` | blank=True؛ default='' | 53 |
| `review_requested_at` | `models.DateTimeField` | `` | null=True؛ blank=True؛ db_index=True | 56 |
| `publish_channel` | `models.CharField` | `` | max_length=30؛ choices=PublishChannel.choices | 63 |
| `start_date` | `models.DateTimeField` | `` | null=True؛ blank=True | 69 |
| `end_date` | `models.DateTimeField` | `` | null=True؛ blank=True | 70 |
| `assigned_to` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | null=True؛ blank=True؛ on_delete=models.SET_NULL؛ related_name='assigned_listings' | 72 |
| `created_by` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | on_delete=models.PROTECT؛ related_name='created_listings' | 81 |
| `priority` | `models.IntegerField` | `` | default=Priority.NORMAL؛ choices=Priority.choices | 88 |
| `is_featured` | `models.BooleanField` | `` | default=False | 94 |
| `sale_price` | `models.DecimalField` | `` | null=True؛ blank=True؛ db_index=True؛ max_digits=18؛ decimal_places=0 | 96 |
| `deposit` | `models.DecimalField` | `` | null=True؛ blank=True؛ db_index=True؛ max_digits=18؛ decimal_places=0 | 104 |
| `monthly_rent` | `models.DecimalField` | `` | null=True؛ blank=True؛ db_index=True؛ max_digits=18؛ decimal_places=0 | 112 |
| `price_details` | `models.JSONField` | `` | blank=True؛ default=dict | 121 |
| `created_at` | `models.DateTimeField` | `` |  | 125 |
| `updated_at` | `models.DateTimeField` | `` |  | 126 |

متدها: `__str__` (خط 133)

#### `ListingAttributeValue` — `BaseAttributeValue`

تعریف: [ZaminexB/apps/listings/models.py:137](../../../ZaminexB/apps/listings/models.py#L137)

قید/ایندکس `constraints`: `[models.UniqueConstraint(fields=['listing', 'attribute'], name='uq_listing_attribute_value')]`

قید/ایندکس `indexes`: `[models.Index(fields=['attribute', 'value_integer'], name='idx_lav_attr_int'), models.Index(fields=['attribute', 'value_decimal'], name='idx_lav_attr_dec'), models.Index(fields=['attribute', 'value_boolean'], name='idx_lav_attr_bool'), models.Index(fields=['attribute', 'value_date'], name='idx_lav_attr_date')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `listing` | `models.ForeignKey` | `'listings.Listing'` | on_delete=models.CASCADE؛ related_name='attribute_values' | 138 |

### ZaminexB/apps/notifications/models.py

منبع: [ZaminexB/apps/notifications/models.py:1](../../../ZaminexB/apps/notifications/models.py#L1)

#### `Notification` — `models.Model`

تعریف: [ZaminexB/apps/notifications/models.py:5](../../../ZaminexB/apps/notifications/models.py#L5)

مقادیر `NotificationType`: `PASSWORD_RESET_REQUEST = ('password_reset_request', 'درخواست تغییر رمز عبور')`؛ `PASSWORD_CHANGED = ('password_changed', 'تغییر رمز عبور')`؛ `TASK_ASSIGNED = ('task_assigned', 'وظیفه جدید')`؛ `TASK_STATUS_CHANGED = ('task_status_changed', 'تغییر وضعیت وظیفه')`؛ `FOLLOWUP_CREATED = ('followup_created', 'پیگیری جدید')`؛ `PROPERTY_ASSIGNED = ('property_assigned', 'ملک جدید')`؛ `PROPERTY_PENDING_REVIEW = ('property_pending_review', 'ملک در انتظار تأیید')`؛ `PROPERTY_APPROVED = ('property_approved', 'تایید ملک')`؛ `PROPERTY_REJECTED = ('property_rejected', 'رد ملک')`؛ `LISTING_PENDING_REVIEW = ('listing_pending_review', 'آگهی در انتظار تأیید')`؛ `LISTING_APPROVED = ('listing_approved', 'تایید آگهی')`؛ `LISTING_REJECTED = ('listing_rejected', 'رد آگهی')`؛ `TICKET_CREATED = ('ticket_created', 'تیکت جدید')`؛ `TICKET_REPLY = ('ticket_reply', 'پاسخ جدید تیکت')`؛ `TICKET_STATUS_CHANGED = ('ticket_status_changed', 'تغییر وضعیت تیکت')`

قید/ایندکس `indexes`: `[models.Index(fields=['user', '-created_at']), models.Index(fields=['user', 'is_read'])]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `user` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | on_delete=models.CASCADE؛ related_name='notifications' | 23 |
| `type` | `models.CharField` | `` | max_length=50؛ choices=NotificationType.choices | 29 |
| `title` | `models.CharField` | `` | max_length=255 | 30 |
| `message` | `models.TextField` | `` |  | 31 |
| `is_read` | `models.BooleanField` | `` | default=False | 32 |
| `created_at` | `models.DateTimeField` | `` |  | 33 |
| `metadata` | `models.JSONField` | `` | blank=True؛ default=dict | 34 |

متدها: `__str__` (خط 46)

### ZaminexB/apps/properties/models.py

منبع: [ZaminexB/apps/properties/models.py:1](../../../ZaminexB/apps/properties/models.py#L1)

#### `ActivePropertyManager` — `models.Manager`

تعریف: [ZaminexB/apps/properties/models.py:15](../../../ZaminexB/apps/properties/models.py#L15)

متدها: `get_queryset` (خط 16)

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `Property` — `models.Model`

تعریف: [ZaminexB/apps/properties/models.py:22](../../../ZaminexB/apps/properties/models.py#L22)

مقادیر `Status`: `AVAILABLE = ('AVAILABLE', 'آماده واگذاری')`؛ `RESERVED = ('RESERVED', 'رزرو شده')`؛ `SOLD = ('SOLD', 'فروخته/واگذارشده')`؛ `INACTIVE = ('INACTIVE', 'بایگانی\u200cشده')`؛ `DRAFT = ('DRAFT', 'پیش\u200cنویس')`

مقادیر `DealType`: `SALE = ('SALE', 'فروش')`؛ `RENT = ('RENT', 'اجاره')`

مقادیر `PropertyType`: `APARTMENT = ('APARTMENT', 'آپارتمان')`؛ `VILLA = ('VILLA', 'ویلا')`؛ `TOWNHOUSE = ('TOWNHOUSE', 'خانه ویلایی')`؛ `STUDIO = ('STUDIO', 'استودیو')`؛ `PENTHOUSE = ('PENTHOUSE', 'پنت\u200cهاوس')`؛ `COMMERCIAL = ('COMMERCIAL', 'تجاری/اداری')`؛ `OFFICE = ('OFFICE', 'دفتر کار')`؛ `SHOP = ('SHOP', 'مغازه')`؛ `LAND = ('LAND', 'زمین')`؛ `OTHER = ('OTHER', 'سایر')`

قید/ایندکس `indexes`: `[models.Index(fields=['-created_at'], name='idx_property_created_at'), models.Index(fields=['status', '-created_at'], name='idx_property_status_created'), models.Index(fields=['deal_type', '-created_at'], name='idx_property_deal_created'), models.Index(fields=['property_type'], name='idx_property_type'), models.Index(fields=['area'], name='idx_property_area'), models.Index(fields=['price'], name='idx_property_price')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `title` | `models.CharField` | `` | max_length=255 | 46 |
| `internal_code` | `models.CharField` | `` | unique=True؛ max_length=50 | 47 |
| `consultant` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | on_delete=models.PROTECT؛ related_name='properties'؛ limit_choices_to={'role__in': ['AGENT', 'RANGE_MANAGER']} | 49 |
| `property_type` | `models.CharField` | `` | max_length=20؛ choices=PropertyType.choices | 57 |
| `property_usage` | `models.ForeignKey` | `'basics.PropertyUsage'` | null=True؛ blank=True؛ on_delete=models.PROTECT؛ related_name='properties' | 63 |
| `property_type_ref` | `models.ForeignKey` | `'basics.PropertyType'` | null=True؛ blank=True؛ on_delete=models.PROTECT؛ related_name='properties' | 71 |
| `deal_type` | `models.CharField` | `` | max_length=20؛ choices=DealType.choices | 80 |
| `price` | `models.DecimalField` | `` | null=True؛ blank=True؛ max_digits=18؛ decimal_places=0 | 86 |
| `area` | `models.PositiveIntegerField` | `` |  | 93 |
| `rooms` | `models.PositiveIntegerField` | `` | default=0 | 94 |
| `floor` | `models.IntegerField` | `` | null=True؛ blank=True | 95 |
| `built_year` | `models.PositiveIntegerField` | `` | null=True؛ blank=True | 96 |
| `address` | `models.TextField` | `` |  | 98 |
| `neighborhood` | `models.CharField` | `` | blank=True؛ max_length=255 | 99 |
| `district` | `models.ForeignKey` | `'basics.District'` | null=True؛ blank=True؛ on_delete=models.PROTECT؛ related_name='properties' | 103 |
| `description` | `models.TextField` | `` | blank=True | 111 |
| `latitude` | `models.DecimalField` | `` | null=True؛ blank=True؛ max_digits=9؛ decimal_places=6 | 113 |
| `longitude` | `models.DecimalField` | `` | null=True؛ blank=True؛ max_digits=9؛ decimal_places=6 | 120 |
| `status` | `models.CharField` | `` | default=Status.AVAILABLE؛ max_length=20؛ choices=Status.choices | 128 |
| `rejection_reason` | `models.TextField` | `` | blank=True؛ default='' | 134 |
| `review_requested_at` | `models.DateTimeField` | `` | null=True؛ blank=True؛ db_index=True | 137 |
| `is_shared` | `models.BooleanField` | `` | default=False | 144 |
| `owner_first_name` | `models.CharField` | `` | blank=True؛ default=''؛ max_length=100 | 150 |
| `owner_last_name` | `models.CharField` | `` | blank=True؛ default=''؛ max_length=100 | 153 |
| `owner_phone` | `models.CharField` | `` | blank=True؛ default=''؛ max_length=20 | 156 |
| `created_at` | `models.DateTimeField` | `` |  | 160 |
| `updated_at` | `models.DateTimeField` | `` |  | 161 |
| `objects` | `models.Manager` | `` |  | 163 |

متدها: `__str__` (خط 183)، `save` (خط 186)

#### `PropertyAttributeValue` — `BaseAttributeValue`

تعریف: [ZaminexB/apps/properties/models.py:257](../../../ZaminexB/apps/properties/models.py#L257)

قید/ایندکس `constraints`: `[models.UniqueConstraint(fields=['property', 'attribute'], name='uq_property_attribute_value')]`

قید/ایندکس `indexes`: `[models.Index(fields=['attribute', 'value_integer'], name='idx_pav_attr_int'), models.Index(fields=['attribute', 'value_decimal'], name='idx_pav_attr_dec'), models.Index(fields=['attribute', 'value_boolean'], name='idx_pav_attr_bool'), models.Index(fields=['attribute', 'value_date'], name='idx_pav_attr_date')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `property` | `models.ForeignKey` | `'properties.Property'` | on_delete=models.CASCADE؛ related_name='attribute_values' | 258 |

#### `PropertyImage` — `models.Model`

تعریف: [ZaminexB/apps/properties/models.py:283](../../../ZaminexB/apps/properties/models.py#L283)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `property` | `models.ForeignKey` | `'properties.Property'` | on_delete=models.CASCADE؛ related_name='images' | 284 |
| `image` | `models.ImageField` | `` | db_index=True | 290 |
| `sort_order` | `models.PositiveIntegerField` | `` | default=0 | 296 |

متدها: `__str__` (خط 303)

#### `PropertyAppraisalReport` — `models.Model`

تعریف: [ZaminexB/apps/properties/models.py:314](../../../ZaminexB/apps/properties/models.py#L314)

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `property` | `models.OneToOneField` | `'properties.Property'` | on_delete=models.CASCADE؛ related_name='appraisal_report' | 315 |
| `file` | `models.FileField` | `` |  | 321 |
| `original_filename` | `models.CharField` | `` | max_length=255 | 327 |
| `file_size` | `models.PositiveIntegerField` | `` |  | 328 |
| `uploaded_by` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | null=True؛ blank=True؛ on_delete=models.SET_NULL؛ related_name='uploaded_appraisal_reports' | 329 |
| `created_at` | `models.DateTimeField` | `` |  | 337 |
| `updated_at` | `models.DateTimeField` | `` |  | 338 |

متدها: `__str__` (خط 344)، `delete` (خط 347)

### ZaminexB/apps/tasks/models.py

منبع: [ZaminexB/apps/tasks/models.py:1](../../../ZaminexB/apps/tasks/models.py#L1)

#### `Task` — `models.Model`

تعریف: [ZaminexB/apps/tasks/models.py:6](../../../ZaminexB/apps/tasks/models.py#L6)

مقادیر `Status`: `PENDING = ('PENDING', 'در انتظار انجام')`؛ `IN_PROGRESS = ('IN_PROGRESS', 'در حال انجام')`؛ `COMPLETED = ('COMPLETED', 'تکمیل\u200cشده')`؛ `CANCELLED = ('CANCELLED', 'لغوشده')`

مقادیر `Priority`: `LOW = ('LOW', 'اولویت کم')`؛ `MEDIUM = ('MEDIUM', 'اولویت عادی')`؛ `HIGH = ('HIGH', 'اولویت بالا')`؛ `URGENT = ('URGENT', 'اولویت فوری')`

مقادیر `TaskType`: `VIEWING = ('VIEWING', 'بازدید ملک')`؛ `DOCUMENT = ('DOCUMENT', 'بررسی مدارک')`؛ `NEGOTIATION = ('NEGOTIATION', 'مذاکره و نشست')`؛ `FOLLOW_UP = ('FOLLOW_UP', 'پیگیری مستمر')`؛ `ADMINISTRATIVE = ('ADMINISTRATIVE', 'امور اداری و دفتری')`؛ `SITE_VISIT = ('SITE_VISIT', 'کارشناسی میدانی')`؛ `CONTRACT = ('CONTRACT', 'عقد قرارداد')`؛ `INSPECTION = ('INSPECTION', 'بازرسی فنی')`

قید/ایندکس `indexes`: `[models.Index(fields=['assigned_to', 'status']), models.Index(fields=['due_date', 'status'])]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `title` | `models.CharField` | `` | max_length=255 | 29 |
| `description` | `models.TextField` | `` | blank=True | 34 |
| `note` | `models.TextField` | `` | blank=True؛ default='' | 39 |
| `status` | `models.CharField` | `` | default=Status.PENDING؛ db_index=True؛ max_length=20؛ choices=Status.choices | 46 |
| `priority` | `models.CharField` | `` | default=Priority.MEDIUM؛ max_length=20؛ choices=Priority.choices | 53 |
| `task_type` | `models.CharField` | `` | default=TaskType.VIEWING؛ max_length=20؛ choices=TaskType.choices | 59 |
| `assigned_to` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | null=True؛ blank=True؛ on_delete=models.SET_NULL؛ related_name='assigned_tasks'؛ limit_choices_to={'role': 'AGENT'} | 66 |
| `created_by` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | on_delete=models.PROTECT؛ related_name='created_tasks' | 76 |
| `property` | `models.ForeignKey` | `'properties.Property'` | null=True؛ blank=True؛ on_delete=models.SET_NULL؛ related_name='tasks' | 83 |
| `due_date` | `models.DateField` | `` |  | 93 |
| `completed_at` | `models.DateTimeField` | `` | null=True؛ blank=True | 97 |
| `created_at` | `models.DateTimeField` | `` |  | 103 |
| `updated_at` | `models.DateTimeField` | `` |  | 104 |

متدها: `__str__` (خط 115)، `mark_completed` (خط 118)، `is_overdue` (خط 123)

### ZaminexB/apps/tickets/models.py

منبع: [ZaminexB/apps/tickets/models.py:1](../../../ZaminexB/apps/tickets/models.py#L1)

#### `TicketSubject` — `models.TextChoices`

تعریف: [ZaminexB/apps/tickets/models.py:15](../../../ZaminexB/apps/tickets/models.py#L15)

مقادیر enum: `PROPERTY = ('PROPERTY', 'املاک موجود')`؛ `LISTING = ('LISTING', 'آگهی\u200cهای موجود')`؛ `FOLLOWUP = ('FOLLOWUP', 'پیگیری\u200cهای موجود')`؛ `TASK = ('TASK', 'وظایف موجود')`؛ `TICKET = ('TICKET', 'تیکت\u200cهای موجود')`

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `TicketType` — `models.TextChoices`

تعریف: [ZaminexB/apps/tickets/models.py:23](../../../ZaminexB/apps/tickets/models.py#L23)

مقادیر enum: `QUESTION = ('QUESTION', 'پرسش')`؛ `REQUEST = ('REQUEST', 'درخواست')`؛ `ALERT = ('ALERT', 'هشدار')`؛ `ISSUE = ('ISSUE', 'گزارش مشکل')`؛ `COMPLAINT = ('COMPLAINT', 'شکایت')`؛ `ANNOUNCEMENT = ('ANNOUNCEMENT', 'اطلاع\u200cرسانی')`؛ `OTHER = ('OTHER', 'سایر')`

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `TicketPriority` — `models.TextChoices`

تعریف: [ZaminexB/apps/tickets/models.py:33](../../../ZaminexB/apps/tickets/models.py#L33)

مقادیر enum: `NORMAL = ('NORMAL', 'عادی')`؛ `IMPORTANT = ('IMPORTANT', 'مهم')`؛ `URGENT = ('URGENT', 'فوری')`

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `TicketStatus` — `models.TextChoices`

تعریف: [ZaminexB/apps/tickets/models.py:39](../../../ZaminexB/apps/tickets/models.py#L39)

مقادیر enum: `OPEN = ('OPEN', 'باز')`؛ `WAITING_REPLY = ('WAITING_REPLY', 'در انتظار پاسخ')`؛ `ANSWERED = ('ANSWERED', 'پاسخ\u200cداده\u200cشده')`؛ `CLOSED = ('CLOSED', 'بسته')`

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `TicketParticipantRole` — `models.TextChoices`

تعریف: [ZaminexB/apps/tickets/models.py:46](../../../ZaminexB/apps/tickets/models.py#L46)

مقادیر enum: `OWNER = ('OWNER', 'ثبت\u200cکننده')`؛ `RECIPIENT = ('RECIPIENT', 'گیرنده')`

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `TicketAuditAction` — `models.TextChoices`

تعریف: [ZaminexB/apps/tickets/models.py:51](../../../ZaminexB/apps/tickets/models.py#L51)

مقادیر enum: `CREATED = ('CREATED', 'ایجاد تیکت')`؛ `REPLIED = ('REPLIED', 'ارسال پاسخ')`؛ `READ = ('READ', 'مشاهده تیکت')`؛ `CLOSED = ('CLOSED', 'بستن تیکت')`؛ `REOPENED = ('REOPENED', 'بازگشایی تیکت')`؛ `UPDATED = ('UPDATED', 'ویرایش تیکت')`؛ `RECIPIENT_ADDED = ('RECIPIENT_ADDED', 'افزودن گیرنده')`

فیلد مستقیم models.* در این کلاس تعریف نشده؛ ممکن است enum، proxy یا زیرکلاس مدل مشترک باشد.

#### `Ticket` — `models.Model`

تعریف: [ZaminexB/apps/tickets/models.py:121](../../../ZaminexB/apps/tickets/models.py#L121)

قید/ایندکس `indexes`: `[models.Index(fields=['created_by', '-created_at'], name='ticket_creator_created_idx'), models.Index(fields=['subject_type', 'subject_id'], name='ticket_subject_idx'), models.Index(fields=['status', '-updated_at'], name='ticket_status_updated_idx'), models.Index(fields=['priority', '-updated_at'], name='ticket_priority_updated_idx')]`

قید/ایندکس `constraints`: `[models.CheckConstraint(condition=models.Q(subject_type=TicketSubject.PROPERTY) & models.Q(property__isnull=False) & models.Q(listing__isnull=True) & models.Q(followup__isnull=True) & models.Q(task__isnull=True) & models.Q(related_ticket__isnull=True)  /  models.Q(subject_type=TicketSubject.LISTING) & models.Q(property__isnull=True) & models.Q(listing__isnull=False) & models.Q(followup__isnull=True) & models.Q(task__isnull=True) & models.Q(related_ticket__isnull=True)  /  models.Q(subject_type=TicketSubject.FOLLOWUP) & models.Q(property__isnull=True) & models.Q(listing__isnull=True) & models.Q(followup__isnull=False) & models.Q(task__isnull=True) & models.Q(related_ticket__isnull=True)  /  models.Q(subject_type=TicketSubject.TASK) & models.Q(property__isnull=True) & models.Q(listing__isnull=True) & models.Q(followup__isnull=True) & models.Q(task__isnull=False) & models.Q(related_ticket__isnull=True)  /  models.Q(subject_type=TicketSubject.TICKET) & models.Q(property__isnull=True) & models.Q(listing__isnull=True) & models.Q(followup__isnull=True) & models.Q(task__isnull=True) & models.Q(related_ticket__isnull=False), name='ticket_exactly_one_subject')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `ticket_number` | `models.CharField` | `` | null=True؛ blank=True؛ unique=True؛ max_length=32 | 122 |
| `title` | `models.CharField` | `` | blank=True؛ max_length=255 | 130 |
| `ticket_type` | `models.CharField` | `` | default=TicketType.OTHER؛ db_index=True؛ max_length=20؛ choices=TicketType.choices | 131 |
| `priority` | `models.CharField` | `` | default=TicketPriority.NORMAL؛ db_index=True؛ max_length=20؛ choices=TicketPriority.choices | 138 |
| `status` | `models.CharField` | `` | default=TicketStatus.WAITING_REPLY؛ db_index=True؛ max_length=20؛ choices=TicketStatus.choices | 145 |
| `subject_type` | `models.CharField` | `` | db_index=True؛ max_length=20؛ choices=TicketSubject.choices | 152 |
| `subject_id` | `models.PositiveBigIntegerField` | `` |  | 158 |
| `property` | `models.ForeignKey` | `'properties.Property'` | null=True؛ blank=True؛ on_delete=models.PROTECT؛ related_name='tickets' | 160 |
| `listing` | `models.ForeignKey` | `'listings.Listing'` | null=True؛ blank=True؛ on_delete=models.PROTECT؛ related_name='tickets' | 168 |
| `followup` | `models.ForeignKey` | `'followups.FollowUp'` | null=True؛ blank=True؛ on_delete=models.PROTECT؛ related_name='tickets' | 176 |
| `task` | `models.ForeignKey` | `'tasks.Task'` | null=True؛ blank=True؛ on_delete=models.PROTECT؛ related_name='tickets' | 184 |
| `related_ticket` | `models.ForeignKey` | `'self'` | null=True؛ blank=True؛ on_delete=models.PROTECT؛ related_name='child_tickets' | 192 |
| `created_by` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | on_delete=models.PROTECT؛ related_name='created_tickets' | 201 |
| `sla_due_at` | `models.DateTimeField` | `` | null=True؛ blank=True؛ db_index=True | 213 |
| `closed_at` | `models.DateTimeField` | `` | null=True؛ blank=True | 216 |
| `closed_by` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | null=True؛ blank=True؛ on_delete=models.SET_NULL؛ related_name='closed_tickets' | 217 |
| `reply_count` | `models.PositiveIntegerField` | `` | default=0 | 226 |
| `last_message_at` | `models.DateTimeField` | `` | null=True؛ blank=True؛ db_index=True | 227 |
| `last_message_sender` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | null=True؛ blank=True؛ on_delete=models.SET_NULL؛ related_name='last_ticket_messages' | 230 |
| `created_at` | `models.DateTimeField` | `` |  | 238 |
| `updated_at` | `models.DateTimeField` | `` |  | 239 |

متدها: `__str__` (خط 307)، `save` (خط 310)، `has_reply` (خط 320)، `is_overdue` (خط 324)، `subject_object` (خط 332)

#### `TicketParticipant` — `models.Model`

تعریف: [ZaminexB/apps/tickets/models.py:342](../../../ZaminexB/apps/tickets/models.py#L342)

قید/ایندکس `constraints`: `[models.UniqueConstraint(fields=['ticket', 'user'], name='ticket_unique_participant'), models.UniqueConstraint(fields=['ticket'], condition=models.Q(role=TicketParticipantRole.OWNER), name='ticket_single_owner')]`

قید/ایندکس `indexes`: `[models.Index(fields=['user', 'is_read'], name='ticket_part_user_read_idx'), models.Index(fields=['ticket', 'role'], name='ticket_part_ticket_role_idx'), models.Index(fields=['user', 'last_visible_sender'], name='ticket_part_user_sender_idx')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `ticket` | `models.ForeignKey` | `Ticket` | on_delete=models.CASCADE؛ related_name='participants' | 343 |
| `user` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | on_delete=models.CASCADE؛ related_name='ticket_participations' | 349 |
| `role` | `models.CharField` | `` | max_length=12؛ choices=TicketParticipantRole.choices | 355 |
| `is_read` | `models.BooleanField` | `` | default=False؛ db_index=True | 358 |
| `read_at` | `models.DateTimeField` | `` | null=True؛ blank=True | 361 |
| `last_visible_message_at` | `models.DateTimeField` | `` | null=True؛ blank=True | 362 |
| `visible_reply_count` | `models.PositiveIntegerField` | `` | default=0 | 365 |
| `last_visible_sender` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | null=True؛ blank=True؛ on_delete=models.SET_NULL؛ related_name='ticket_visible_last_senders' | 369 |
| `created_at` | `models.DateTimeField` | `` |  | 377 |

متدها: `__str__` (خط 401)

#### `TicketMessage` — `models.Model`

تعریف: [ZaminexB/apps/tickets/models.py:405](../../../ZaminexB/apps/tickets/models.py#L405)

قید/ایندکس `indexes`: `[models.Index(fields=['ticket', 'created_at'], name='ticket_msg_ticket_created_idx'), models.Index(fields=['ticket', 'thread_recipient', 'created_at'], name='ticket_msg_thread_idx')]`

قید/ایندکس `constraints`: `[models.UniqueConstraint(fields=['ticket'], condition=models.Q(is_initial=True), name='ticket_one_initial_message')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `ticket` | `models.ForeignKey` | `Ticket` | on_delete=models.CASCADE؛ related_name='messages' | 406 |
| `sender` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | on_delete=models.PROTECT؛ related_name='ticket_messages' | 409 |
| `thread_recipient` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | null=True؛ blank=True؛ on_delete=models.PROTECT؛ related_name='ticket_thread_messages' | 415 |
| `body` | `models.TextField` | `` |  | 423 |
| `is_initial` | `models.BooleanField` | `` | default=False | 424 |
| `created_at` | `models.DateTimeField` | `` |  | 425 |

متدها: `__str__` (خط 448)

#### `TicketAttachment` — `models.Model`

تعریف: [ZaminexB/apps/tickets/models.py:452](../../../ZaminexB/apps/tickets/models.py#L452)

قید/ایندکس `indexes`: `[models.Index(fields=['message', 'created_at'], name='ticket_attach_msg_idx')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `message` | `models.ForeignKey` | `TicketMessage` | on_delete=models.CASCADE؛ related_name='attachments' | 453 |
| `file` | `models.FileField` | `` |  | 459 |
| `original_name` | `models.CharField` | `` | max_length=255 | 467 |
| `content_type` | `models.CharField` | `` | blank=True؛ max_length=100 | 468 |
| `size` | `models.PositiveIntegerField` | `` | default=0 | 471 |
| `created_at` | `models.DateTimeField` | `` |  | 476 |

متدها: `__str__` (خط 486)، `clean` (خط 489)

#### `TicketAuditEvent` — `models.Model`

تعریف: [ZaminexB/apps/tickets/models.py:495](../../../ZaminexB/apps/tickets/models.py#L495)

قید/ایندکس `indexes`: `[models.Index(fields=['ticket', '-created_at'], name='ticket_audit_ticket_idx'), models.Index(fields=['actor', '-created_at'], name='ticket_audit_actor_idx')]`

| فیلد | نوع | مقصد رابطه / آرگومان | قیود | خط |
|---|---|---|---|---|
| `ticket` | `models.ForeignKey` | `Ticket` | on_delete=models.CASCADE؛ related_name='audit_events' | 496 |
| `actor` | `models.ForeignKey` | `settings.AUTH_USER_MODEL` | null=True؛ blank=True؛ on_delete=models.SET_NULL؛ related_name='ticket_audit_events' | 502 |
| `action` | `models.CharField` | `` | db_index=True؛ max_length=24؛ choices=TicketAuditAction.choices | 510 |
| `metadata` | `models.JSONField` | `` | blank=True؛ default=dict | 516 |
| `created_at` | `models.DateTimeField` | `` | db_index=True | 517 |

متدها: `__str__` (خط 534)

## URLها و routerهای واقعی

پیشوندهای config: accounts، properties، listings، followups/api، tasks/api، tickets/api، common/api، basics/api؛ reports از ریشه include می‌شود. برای مثال register("tasks") زیر tasks/api یعنی `/tasks/api/tasks/`.

### ZaminexB/config/urls.py

منبع: [ZaminexB/config/urls.py:1](../../../ZaminexB/config/urls.py#L1)

| خط | تعریف مسیر / router |
|---|---|
| 11 | `path('admin/', admin.site.urls)` |
| 12 | `path('', views.dashboard, name='dashboard')` |
| 13 | `path('app/', views.dashboard, name='app-shell')` |
| 14 | `path('app/<path:app_path>/', views.dashboard, name='app-route')` |
| 15 | `path('accounts/', include('apps.accounts.urls'))` |
| 16 | `path('properties/', include('apps.properties.urls'))` |
| 17 | `path('listings/', include('apps.listings.urls'))` |
| 18 | `path('followups/api/', include('apps.followups.urls'))` |
| 19 | `path('tasks/api/', include('apps.tasks.urls'))` |
| 20 | `path('tickets/api/', include('apps.tickets.urls'))` |
| 21 | `path('common/api/', include('apps.common.urls'))` |
| 22 | `path('basics/api/', include('apps.basics.urls'))` |
| 23 | `path('', include('apps.reports.urls'))` |
| 24 | `path('media/<path:path>', serve_media, name='protected-media')` |

### ZaminexB/apps/accounts/urls.py

منبع: [ZaminexB/apps/accounts/urls.py:1](../../../ZaminexB/apps/accounts/urls.py#L1)

| خط | تعریف مسیر / router |
|---|---|
| 21 | `router.register('consultants', ConsultantProfileViewSet, basename='consultant')` |
| 22 | `router.register('admins', AdminProfileViewSet, basename='admin-profile')` |
| 23 | `router.register('ranges', SalesRangeViewSet, basename='sales-range')` |
| 26 | `path('login/', CustomLoginView.as_view(), name='login')` |
| 27 | `path('logout/', auth_views.LogoutView.as_view(), name='logout')` |
| 28 | `path('login-options/', LoginOptionsView.as_view(), name='login-options')` |
| 29 | `path('me/permissions/', MePermissionsView.as_view(), name='me-permissions')` |
| 34 | `path('role-permissions/', RolePermissionMatrixView.as_view(), name='role-permissions')` |
| 39 | `path('range-users/', RangeUserOptionsView.as_view(), name='range-users')` |
| 44 | `path('sms-login/request/', SmsLoginRequestView.as_view(), name='sms-login-request')` |
| 45 | `path('sms-login/verify/', SmsLoginVerifyView.as_view(), name='sms-login-verify')` |
| 46 | `path('', include(router.urls))` |

### ZaminexB/apps/basics/urls.py

منبع: [ZaminexB/apps/basics/urls.py:1](../../../ZaminexB/apps/basics/urls.py#L1)

| خط | تعریف مسیر / router |
|---|---|
| 25 | `router.register('property-usages', PropertyUsageViewSet, basename='property-usage')` |
| 26 | `router.register('property-types', PropertyTypeViewSet, basename='property-type')` |
| 27 | `router.register('deal-types', DealTypeViewSet, basename='deal-type')` |
| 28 | `router.register('attributes', AttributeViewSet, basename='attribute')` |
| 29 | `router.register('attribute-categories', AttributeCategoryViewSet, basename='attribute-category')` |
| 34 | `router.register('property-type-attributes', PropertyTypeAttributeViewSet, basename='property-type-attribute')` |
| 39 | `router.register('deal-type-attributes', DealTypeAttributeViewSet, basename='deal-type-attribute')` |
| 42 | `router.register('provinces', ProvinceViewSet, basename='province')` |
| 43 | `router.register('cities', CityViewSet, basename='city')` |
| 44 | `router.register('districts', DistrictViewSet, basename='district')` |
| 47 | `path('catalog/', BasicsCatalogView.as_view(), name='catalog')` |
| 48 | `path('locations/', LocationTreeView.as_view(), name='location-tree')` |
| 49 | `path('schema/property-form/', PropertyFormSchemaView.as_view(), name='schema-property-form')` |
| 54 | `path('schema/listing-form/', ListingFormSchemaView.as_view(), name='schema-listing-form')` |
| 59 | `path('schema/search/', SearchSchemaView.as_view(), name='schema-search')` |
| 60 | `path('', include(router.urls))` |

### ZaminexB/apps/common/urls.py

منبع: [ZaminexB/apps/common/urls.py:1](../../../ZaminexB/apps/common/urls.py#L1)

| خط | تعریف مسیر / router |
|---|---|
| 24 | `path('company-settings/', CompanySettingsView.as_view(), name='company-settings')` |
| 25 | `path('districts/', DistrictListView.as_view(), name='districts-list')` |
| 26 | `path('districts/manage/', DistrictManageView.as_view(), name='districts-manage')` |
| 27 | `path('districts/manage/<int:pk>/', DistrictManageView.as_view(), name='districts-manage-detail')` |
| 28 | `path('geocode/', GeocodeView.as_view(), name='geocode')` |
| 29 | `path('analytics/consultants/', ConsultantAnalyticsView.as_view(), name='analytics-consultants')` |
| 30 | `path('analytics/consultants/<int:pk>/', ConsultantDetailAnalyticsView.as_view(), name='analytics-consultant-detail')` |
| 31 | `path('analytics/properties/', PropertyAnalyticsView.as_view(), name='analytics-properties')` |
| 32 | `path('analytics/listings/', ListingAnalyticsView.as_view(), name='analytics-listings')` |
| 33 | `path('analytics/dashboard/', AnalyticsDashboardView.as_view(), name='analytics-dashboard')` |
| 34 | `path('ai/<str:entity>/<int:pk>/', AIInsightView.as_view(), name='ai-insight')` |
| 35 | `path('activity-log/users/', ActivityLogUserListView.as_view(), name='activity-log-users')` |
| 36 | `path('activity-log/', ActivityLogListView.as_view(), name='activity-log')` |
| 37 | `path('notifications/', NotificationListView.as_view(), name='notifications-list')` |
| 38 | `path('notifications/<int:pk>/read/', NotificationMarkReadView.as_view(), name='notification-mark-read')` |
| 39 | `path('login-stats/', LoginStatsView.as_view(), name='login-stats')` |
| 40 | `path('password-reset-request/', PasswordResetRequestView.as_view(), name='password-reset-request')` |
| 41 | `path('admin-password-change/<int:user_id>/', AdminPasswordChangeView.as_view(), name='admin-password-change')` |

### ZaminexB/apps/followups/urls.py

منبع: [ZaminexB/apps/followups/urls.py:1](../../../ZaminexB/apps/followups/urls.py#L1)

| خط | تعریف مسیر / router |
|---|---|
| 7 | `router.register('followups', FollowUpViewSet, basename='followup')` |

### ZaminexB/apps/listings/urls.py

منبع: [ZaminexB/apps/listings/urls.py:1](../../../ZaminexB/apps/listings/urls.py#L1)

| خط | تعریف مسیر / router |
|---|---|
| 8 | `router.register('api/listings', views.ListingViewSet, basename='listing-api')` |
| 11 | `path('explore/', views.public_listing_explorer, name='public-explore')` |
| 12 | `path('<int:pk>/', views.public_listing_detail, name='public-detail')` |
| 13 | `path('api/explore/', views.PublicListingExploreView.as_view(), name='public-explore-api')` |
| 18 | `path('api/public/<int:pk>/', views.PublicListingDetailView.as_view(), name='public-detail-api')` |
| 23 | `path('', views.listing_list, name='listing-list')` |
| 24 | `path('', include(router.urls))` |

### ZaminexB/apps/properties/urls.py

منبع: [ZaminexB/apps/properties/urls.py:1](../../../ZaminexB/apps/properties/urls.py#L1)

| خط | تعریف مسیر / router |
|---|---|
| 8 | `router.register('', views.PropertyViewSet, basename='api-properties')` |
| 11 | `path('', views.property_list, name='property-list')` |
| 12 | `path('add/', views.property_create_view, name='property-create')` |
| 13 | `path('<int:pk>/', views.property_detail, name='property-detail')` |
| 14 | `path('<int:pk>/edit/', views.property_edit_view, name='property-update')` |
| 15 | `path('<int:pk>/archive/', views.property_archive, name='property-archive')` |
| 16 | `path('<int:pk>/images/', views.property_image_manage, name='property-image-manage')` |
| 18 | `path('api/properties/', include(router.urls))` |

### ZaminexB/apps/reports/urls.py

منبع: [ZaminexB/apps/reports/urls.py:1](../../../ZaminexB/apps/reports/urls.py#L1)

| خط | تعریف مسیر / router |
|---|---|
| 14 | `path('api/reports/properties/<int:property_id>/export/', PropertyReportExportView.as_view(), name='property-report-export')` |
| 19 | `path('api/reports/properties/<int:property_id>/', PropertyReportView.as_view(), name='property-report')` |
| 24 | `path('api/reports/scope/', ConsultantScopeReportView.as_view(), name='consultant-scope-report')` |
| 29 | `path('api/reports/property-options/', PropertyOptionsView.as_view(), name='property-report-options')` |
| 34 | `path('reports/properties/<int:property_id>/print/', property_report_print, name='property-report-print')` |

### ZaminexB/apps/tasks/urls.py

منبع: [ZaminexB/apps/tasks/urls.py:1](../../../ZaminexB/apps/tasks/urls.py#L1)

| خط | تعریف مسیر / router |
|---|---|
| 7 | `router.register('tasks', TaskViewSet, basename='task-api')` |

### ZaminexB/apps/tickets/urls.py

منبع: [ZaminexB/apps/tickets/urls.py:1](../../../ZaminexB/apps/tickets/urls.py#L1)

| خط | تعریف مسیر / router |
|---|---|
| 16 | `router.register('tickets', TicketViewSet, basename='ticket')` |
| 19 | `path('listing-inquiries/', PublicListingInquiryView.as_view(), name='listing-inquiry')` |
| 20 | `path('meta/', TicketMetaView.as_view(), name='ticket-meta')` |
| 21 | `path('subjects/', TicketSubjectOptionsView.as_view(), name='ticket-subject-options')` |
| 24 | `path('recipients/', TicketRecipientOptionsView.as_view(), name='ticket-recipient-options')` |
| 29 | `path('unread-count/', TicketUnreadCountView.as_view(), name='ticket-unread-count')` |
| 30 | `path('attachments/<int:pk>/download/', TicketAttachmentDownloadView.as_view(), name='ticket-attachment-download')` |
| 35 | `path('', include(router.urls))` |

## کنترل‌های واقعی view و actionهای سفارشی

این نمایه برای پیدا کردن کد است؛ علاوه بر permission_classes باید get_queryset، serializer و بدنهٔ action را خواند. جدول نام تابع، متدهای HTTP action و مسیر override را ثبت می‌کند.

### ZaminexB/apps/accounts/views.py

| تابع | قرارداد/کنترل | منبع |
|---|---|---|
| `CustomLoginView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:68](../../../ZaminexB/apps/accounts/views.py#L68) |
| `LoginOptionsView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:129](../../../ZaminexB/apps/accounts/views.py#L129) |
| `LoginOptionsView.patch` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:136](../../../ZaminexB/apps/accounts/views.py#L136) |
| `SmsLoginRequestView.post` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:153](../../../ZaminexB/apps/accounts/views.py#L153) |
| `SmsLoginVerifyView.post` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:198](../../../ZaminexB/apps/accounts/views.py#L198) |
| `ConsultantProfileViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:272](../../../ZaminexB/apps/accounts/views.py#L272) |
| `ConsultantProfileViewSet.create` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:288](../../../ZaminexB/apps/accounts/views.py#L288) |
| `ConsultantProfileViewSet.perform_create` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:302](../../../ZaminexB/apps/accounts/views.py#L302) |
| `ConsultantProfileViewSet.update` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:314](../../../ZaminexB/apps/accounts/views.py#L314) |
| `ConsultantProfileViewSet.destroy` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:335](../../../ZaminexB/apps/accounts/views.py#L335) |
| `ConsultantProfileViewSet.me` | action(detail=False, methods=['get', 'patch'], url_path='me') | [ZaminexB/apps/accounts/views.py:367](../../../ZaminexB/apps/accounts/views.py#L367) |
| `ConsultantProfileViewSet.change_password` | action(detail=False, methods=['post'], url_path='change-password') | [ZaminexB/apps/accounts/views.py:402](../../../ZaminexB/apps/accounts/views.py#L402) |
| `ConsultantProfileViewSet.change_password_me` | action(detail=False, methods=['post'], url_path='me/change-password') | [ZaminexB/apps/accounts/views.py:406](../../../ZaminexB/apps/accounts/views.py#L406) |
| `AdminProfileViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:414](../../../ZaminexB/apps/accounts/views.py#L414) |
| `AdminProfileViewSet.me` | action(detail=False, methods=['get', 'patch'], url_path='me') | [ZaminexB/apps/accounts/views.py:430](../../../ZaminexB/apps/accounts/views.py#L430) |
| `AdminProfileViewSet.change_password` | action(detail=False, methods=['post'], url_path='change-password') | [ZaminexB/apps/accounts/views.py:443](../../../ZaminexB/apps/accounts/views.py#L443) |
| `AdminProfileViewSet.change_password_me` | action(detail=False, methods=['post'], url_path='me/change-password') | [ZaminexB/apps/accounts/views.py:447](../../../ZaminexB/apps/accounts/views.py#L447) |
| `MePermissionsView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:454](../../../ZaminexB/apps/accounts/views.py#L454) |
| `RolePermissionMatrixView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:498](../../../ZaminexB/apps/accounts/views.py#L498) |
| `RolePermissionMatrixView.patch` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:501](../../../ZaminexB/apps/accounts/views.py#L501) |
| `SalesRangeViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:541](../../../ZaminexB/apps/accounts/views.py#L541) |
| `SalesRangeViewSet.create` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:556](../../../ZaminexB/apps/accounts/views.py#L556) |
| `SalesRangeViewSet.update` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:561](../../../ZaminexB/apps/accounts/views.py#L561) |
| `SalesRangeViewSet.partial_update` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:566](../../../ZaminexB/apps/accounts/views.py#L566) |
| `SalesRangeViewSet.destroy` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:571](../../../ZaminexB/apps/accounts/views.py#L571) |
| `RangeUserOptionsView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/accounts/views.py:580](../../../ZaminexB/apps/accounts/views.py#L580) |

### ZaminexB/apps/activity/views.py

| تابع | قرارداد/کنترل | منبع |
|---|---|---|
| `ActivityLogListView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/activity/views.py:35](../../../ZaminexB/apps/activity/views.py#L35) |
| `ActivityLogListView.delete` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/activity/views.py:115](../../../ZaminexB/apps/activity/views.py#L115) |
| `ActivityLogUserListView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/activity/views.py:139](../../../ZaminexB/apps/activity/views.py#L139) |

### ZaminexB/apps/analytics/views.py

| تابع | قرارداد/کنترل | منبع |
|---|---|---|
| `ConsultantDetailAnalyticsView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/analytics/views.py:518](../../../ZaminexB/apps/analytics/views.py#L518) |
| `ConsultantAnalyticsView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/analytics/views.py:542](../../../ZaminexB/apps/analytics/views.py#L542) |
| `PropertyAnalyticsView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/analytics/views.py:625](../../../ZaminexB/apps/analytics/views.py#L625) |
| `ListingAnalyticsView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/analytics/views.py:644](../../../ZaminexB/apps/analytics/views.py#L644) |
| `AnalyticsDashboardView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/analytics/views.py:764](../../../ZaminexB/apps/analytics/views.py#L764) |
| `AIInsightView.post` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/analytics/views.py:897](../../../ZaminexB/apps/analytics/views.py#L897) |

### ZaminexB/apps/basics/views.py

| تابع | قرارداد/کنترل | منبع |
|---|---|---|
| `BasicsViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:65](../../../ZaminexB/apps/basics/views.py#L65) |
| `BasicsViewSet.restore` | action(detail=True, methods=['post']) | [ZaminexB/apps/basics/views.py:76](../../../ZaminexB/apps/basics/views.py#L76) |
| `PropertyTypeViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:102](../../../ZaminexB/apps/basics/views.py#L102) |
| `PropertyTypeViewSet.attributes` | action(detail=True, methods=['get'], url_path='attributes') | [ZaminexB/apps/basics/views.py:113](../../../ZaminexB/apps/basics/views.py#L113) |
| `DealTypeViewSet.attributes` | action(detail=True, methods=['get'], url_path='attributes') | [ZaminexB/apps/basics/views.py:128](../../../ZaminexB/apps/basics/views.py#L128) |
| `AttributeCategoryViewSet.perform_create` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:142](../../../ZaminexB/apps/basics/views.py#L142) |
| `AttributeViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:171](../../../ZaminexB/apps/basics/views.py#L171) |
| `AttributeViewSet.options` | action(detail=True, methods=['get', 'post'], url_path='options') | [ZaminexB/apps/basics/views.py:201](../../../ZaminexB/apps/basics/views.py#L201) |
| `AttributeViewSet.delete_option` | action(detail=True, methods=['delete'], url_path='options/(?P<option_id>\\d+)') | [ZaminexB/apps/basics/views.py:226](../../../ZaminexB/apps/basics/views.py#L226) |
| `PropertyTypeAttributeViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:306](../../../ZaminexB/apps/basics/views.py#L306) |
| `PropertyTypeAttributeViewSet.perform_create` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:313](../../../ZaminexB/apps/basics/views.py#L313) |
| `PropertyTypeAttributeViewSet.perform_update` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:317](../../../ZaminexB/apps/basics/views.py#L317) |
| `PropertyTypeAttributeViewSet.reorder` | action(detail=False, methods=['post'], url_path='reorder') | [ZaminexB/apps/basics/views.py:326](../../../ZaminexB/apps/basics/views.py#L326) |
| `DealTypeAttributeViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:362](../../../ZaminexB/apps/basics/views.py#L362) |
| `DealTypeAttributeViewSet.perform_create` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:369](../../../ZaminexB/apps/basics/views.py#L369) |
| `DealTypeAttributeViewSet.perform_update` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:373](../../../ZaminexB/apps/basics/views.py#L373) |
| `PropertyFormSchemaView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:604](../../../ZaminexB/apps/basics/views.py#L604) |
| `ListingFormSchemaView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:628](../../../ZaminexB/apps/basics/views.py#L628) |
| `SearchSchemaView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:649](../../../ZaminexB/apps/basics/views.py#L649) |
| `BasicsCatalogView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:689](../../../ZaminexB/apps/basics/views.py#L689) |
| `_GeographyViewSet.perform_create` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:694](../../../ZaminexB/apps/basics/views.py#L694) |
| `ProvinceViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:707](../../../ZaminexB/apps/basics/views.py#L707) |
| `CityViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:724](../../../ZaminexB/apps/basics/views.py#L724) |
| `DistrictViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:748](../../../ZaminexB/apps/basics/views.py#L748) |
| `LocationTreeView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/basics/views.py:781](../../../ZaminexB/apps/basics/views.py#L781) |

### ZaminexB/apps/common/views.py

| تابع | قرارداد/کنترل | منبع |
|---|---|---|
| `DistrictListView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/common/views.py:15](../../../ZaminexB/apps/common/views.py#L15) |
| `DistrictManageView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/common/views.py:38](../../../ZaminexB/apps/common/views.py#L38) |
| `DistrictManageView.post` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/common/views.py:46](../../../ZaminexB/apps/common/views.py#L46) |
| `DistrictManageView.delete` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/common/views.py:61](../../../ZaminexB/apps/common/views.py#L61) |
| `DistrictManageView.patch` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/common/views.py:72](../../../ZaminexB/apps/common/views.py#L72) |
| `CompanySettingsView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/common/views.py:90](../../../ZaminexB/apps/common/views.py#L90) |
| `CompanySettingsView.patch` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/common/views.py:106](../../../ZaminexB/apps/common/views.py#L106) |
| `PasswordResetRequestView.post` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/common/views.py:117](../../../ZaminexB/apps/common/views.py#L117) |
| `LoginStatsView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/common/views.py:148](../../../ZaminexB/apps/common/views.py#L148) |
| `AdminPasswordChangeView.post` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/common/views.py:171](../../../ZaminexB/apps/common/views.py#L171) |
| `GeocodeView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/common/views.py:242](../../../ZaminexB/apps/common/views.py#L242) |

### ZaminexB/apps/followups/views.py

| تابع | قرارداد/کنترل | منبع |
|---|---|---|
| `FollowUpViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/followups/views.py:40](../../../ZaminexB/apps/followups/views.py#L40) |
| `FollowUpViewSet.get_serializer_class` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/followups/views.py:87](../../../ZaminexB/apps/followups/views.py#L87) |
| `FollowUpViewSet.create` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/followups/views.py:94](../../../ZaminexB/apps/followups/views.py#L94) |
| `FollowUpViewSet.update` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/followups/views.py:104](../../../ZaminexB/apps/followups/views.py#L104) |
| `FollowUpViewSet.partial_update` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/followups/views.py:116](../../../ZaminexB/apps/followups/views.py#L116) |
| `FollowUpViewSet.destroy` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/followups/views.py:121](../../../ZaminexB/apps/followups/views.py#L121) |
| `FollowUpViewSet.archive` | action(detail=True, methods=['post']) | [ZaminexB/apps/followups/views.py:128](../../../ZaminexB/apps/followups/views.py#L128) |
| `FollowUpViewSet.unarchive` | action(detail=True, methods=['post']) | [ZaminexB/apps/followups/views.py:138](../../../ZaminexB/apps/followups/views.py#L138) |
| `FollowUpViewSet.my_followups` | action(detail=False, methods=['get'], url_path='my-followups') | [ZaminexB/apps/followups/views.py:148](../../../ZaminexB/apps/followups/views.py#L148) |
| `FollowUpViewSet.summary` | action(detail=False, methods=['get'], url_path='summary') | [ZaminexB/apps/followups/views.py:169](../../../ZaminexB/apps/followups/views.py#L169) |

### ZaminexB/apps/listings/views.py

| تابع | قرارداد/کنترل | منبع |
|---|---|---|
| `PublicListingExploreView.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/listings/views.py:254](../../../ZaminexB/apps/listings/views.py#L254) |
| `PublicListingDetailView.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/listings/views.py:279](../../../ZaminexB/apps/listings/views.py#L279) |
| `ListingViewSet.get_serializer_class` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/listings/views.py:326](../../../ZaminexB/apps/listings/views.py#L326) |
| `ListingViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/listings/views.py:343](../../../ZaminexB/apps/listings/views.py#L343) |
| `ListingViewSet.explore` | action(detail=False, methods=['get'], url_path='explore') | [ZaminexB/apps/listings/views.py:468](../../../ZaminexB/apps/listings/views.py#L468) |
| `ListingViewSet.explore_detail` | action(detail=False, methods=['get'], url_path='explore/(?P<pk>[^/.]+)') | [ZaminexB/apps/listings/views.py:484](../../../ZaminexB/apps/listings/views.py#L484) |
| `ListingViewSet.recommendations` | action(detail=False, methods=['get'], url_path='recommendations') | [ZaminexB/apps/listings/views.py:494](../../../ZaminexB/apps/listings/views.py#L494) |
| `ListingViewSet.perform_create` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/listings/views.py:510](../../../ZaminexB/apps/listings/views.py#L510) |
| `ListingViewSet.perform_update` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/listings/views.py:536](../../../ZaminexB/apps/listings/views.py#L536) |
| `ListingViewSet.approve` | action(detail=True, methods=['post']) | [ZaminexB/apps/listings/views.py:577](../../../ZaminexB/apps/listings/views.py#L577) |
| `ListingViewSet.reject` | action(detail=True, methods=['post']) | [ZaminexB/apps/listings/views.py:602](../../../ZaminexB/apps/listings/views.py#L602) |
| `ListingViewSet.pause` | action(detail=True, methods=['post']) | [ZaminexB/apps/listings/views.py:627](../../../ZaminexB/apps/listings/views.py#L627) |
| `ListingViewSet.archive` | action(detail=True, methods=['post']) | [ZaminexB/apps/listings/views.py:647](../../../ZaminexB/apps/listings/views.py#L647) |
| `ListingViewSet.unarchive` | action(detail=True, methods=['post']) | [ZaminexB/apps/listings/views.py:660](../../../ZaminexB/apps/listings/views.py#L660) |
| `ListingViewSet.destroy` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/listings/views.py:674](../../../ZaminexB/apps/listings/views.py#L674) |
| `ListingViewSet.sold` | action(detail=True, methods=['post']) | [ZaminexB/apps/listings/views.py:683](../../../ZaminexB/apps/listings/views.py#L683) |
| `ListingViewSet.set_status` | action(detail=True, methods=['post']) | [ZaminexB/apps/listings/views.py:697](../../../ZaminexB/apps/listings/views.py#L697) |

### ZaminexB/apps/notifications/views.py

| تابع | قرارداد/کنترل | منبع |
|---|---|---|
| `NotificationListView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/notifications/views.py:17](../../../ZaminexB/apps/notifications/views.py#L17) |
| `NotificationMarkReadView.post` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/notifications/views.py:54](../../../ZaminexB/apps/notifications/views.py#L54) |

### ZaminexB/apps/properties/views.py

| تابع | قرارداد/کنترل | منبع |
|---|---|---|
| `PropertyViewSet.get_serializer_class` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/properties/views.py:154](../../../ZaminexB/apps/properties/views.py#L154) |
| `PropertyViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/properties/views.py:159](../../../ZaminexB/apps/properties/views.py#L159) |
| `PropertyViewSet.perform_create` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/properties/views.py:290](../../../ZaminexB/apps/properties/views.py#L290) |
| `PropertyViewSet.perform_update` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/properties/views.py:324](../../../ZaminexB/apps/properties/views.py#L324) |
| `PropertyViewSet.approve` | action(detail=True, methods=['post'], url_path='approve') | [ZaminexB/apps/properties/views.py:385](../../../ZaminexB/apps/properties/views.py#L385) |
| `PropertyViewSet.reject` | action(detail=True, methods=['post'], url_path='reject') | [ZaminexB/apps/properties/views.py:415](../../../ZaminexB/apps/properties/views.py#L415) |
| `PropertyViewSet.destroy` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/properties/views.py:440](../../../ZaminexB/apps/properties/views.py#L440) |
| `PropertyViewSet.create_draft` | action(detail=False, methods=['post'], url_path='draft') | [ZaminexB/apps/properties/views.py:455](../../../ZaminexB/apps/properties/views.py#L455) |
| `PropertyViewSet.next_internal_code` | action(detail=False, methods=['get'], url_path='next-internal-code') | [ZaminexB/apps/properties/views.py:500](../../../ZaminexB/apps/properties/views.py#L500) |
| `PropertyViewSet.options` | action(detail=False, methods=['get'], url_path='options') | [ZaminexB/apps/properties/views.py:504](../../../ZaminexB/apps/properties/views.py#L504) |
| `PropertyViewSet.toggle_shared` | action(detail=True, methods=['post'], url_path='toggle-shared') | [ZaminexB/apps/properties/views.py:561](../../../ZaminexB/apps/properties/views.py#L561) |
| `PropertyViewSet.upload_images` | action(detail=True, methods=['post'], url_path='images') | [ZaminexB/apps/properties/views.py:568](../../../ZaminexB/apps/properties/views.py#L568) |
| `PropertyViewSet.delete_image` | action(detail=True, methods=['delete'], url_path='images/(?P<image_id>\\d+)') | [ZaminexB/apps/properties/views.py:623](../../../ZaminexB/apps/properties/views.py#L623) |
| `PropertyViewSet.reorder_images` | action(detail=True, methods=['patch'], url_path='images-reorder') | [ZaminexB/apps/properties/views.py:647](../../../ZaminexB/apps/properties/views.py#L647) |
| `PropertyViewSet.appraisal_report` | action(detail=True, methods=['post', 'delete'], url_path='appraisal-report') | [ZaminexB/apps/properties/views.py:686](../../../ZaminexB/apps/properties/views.py#L686) |
| `PropertyViewSet.download_appraisal_report` | action(detail=True, methods=['get'], url_path='appraisal-report/download', url_name='appraisal-report-download') | [ZaminexB/apps/properties/views.py:763](../../../ZaminexB/apps/properties/views.py#L763) |

### ZaminexB/apps/reports/views.py

| تابع | قرارداد/کنترل | منبع |
|---|---|---|
| `PropertyReportView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/reports/views.py:53](../../../ZaminexB/apps/reports/views.py#L53) |
| `PropertyReportExportView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/reports/views.py:64](../../../ZaminexB/apps/reports/views.py#L64) |
| `ConsultantScopeReportView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/reports/views.py:196](../../../ZaminexB/apps/reports/views.py#L196) |
| `PropertyOptionsView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/reports/views.py:209](../../../ZaminexB/apps/reports/views.py#L209) |

### ZaminexB/apps/tasks/views.py

| تابع | قرارداد/کنترل | منبع |
|---|---|---|
| `TaskViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tasks/views.py:42](../../../ZaminexB/apps/tasks/views.py#L42) |
| `TaskViewSet.perform_create` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tasks/views.py:106](../../../ZaminexB/apps/tasks/views.py#L106) |
| `TaskViewSet.perform_update` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tasks/views.py:117](../../../ZaminexB/apps/tasks/views.py#L117) |
| `TaskViewSet.complete` | action(detail=True, methods=['post']) | [ZaminexB/apps/tasks/views.py:132](../../../ZaminexB/apps/tasks/views.py#L132) |
| `TaskViewSet.history` | action(detail=True, methods=['get'], url_path='history') | [ZaminexB/apps/tasks/views.py:142](../../../ZaminexB/apps/tasks/views.py#L142) |
| `TaskViewSet.summary` | action(detail=False, methods=['get'], url_path='summary') | [ZaminexB/apps/tasks/views.py:147](../../../ZaminexB/apps/tasks/views.py#L147) |
| `TaskViewSet.types` | action(detail=False, methods=['get'], url_path='types') | [ZaminexB/apps/tasks/views.py:164](../../../ZaminexB/apps/tasks/views.py#L164) |

### ZaminexB/apps/tickets/views.py

| تابع | قرارداد/کنترل | منبع |
|---|---|---|
| `PublicListingInquiryView.post` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tickets/views.py:91](../../../ZaminexB/apps/tickets/views.py#L91) |
| `TicketViewSet.get_serializer_class` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tickets/views.py:189](../../../ZaminexB/apps/tickets/views.py#L189) |
| `TicketViewSet.get_queryset` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tickets/views.py:200](../../../ZaminexB/apps/tickets/views.py#L200) |
| `TicketViewSet.create` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tickets/views.py:515](../../../ZaminexB/apps/tickets/views.py#L515) |
| `TicketViewSet.update` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tickets/views.py:532](../../../ZaminexB/apps/tickets/views.py#L532) |
| `TicketViewSet.partial_update` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tickets/views.py:535](../../../ZaminexB/apps/tickets/views.py#L535) |
| `TicketViewSet.destroy` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tickets/views.py:555](../../../ZaminexB/apps/tickets/views.py#L555) |
| `TicketViewSet.read` | action(detail=True, methods=['post']) | [ZaminexB/apps/tickets/views.py:559](../../../ZaminexB/apps/tickets/views.py#L559) |
| `TicketViewSet.reply` | action(detail=True, methods=['post']) | [ZaminexB/apps/tickets/views.py:568](../../../ZaminexB/apps/tickets/views.py#L568) |
| `TicketViewSet.close` | action(detail=True, methods=['post']) | [ZaminexB/apps/tickets/views.py:614](../../../ZaminexB/apps/tickets/views.py#L614) |
| `TicketViewSet.reopen` | action(detail=True, methods=['post']) | [ZaminexB/apps/tickets/views.py:625](../../../ZaminexB/apps/tickets/views.py#L625) |
| `TicketViewSet.audit` | action(detail=True, methods=['get']) | [ZaminexB/apps/tickets/views.py:636](../../../ZaminexB/apps/tickets/views.py#L636) |
| `TicketViewSet.unread_count` | action(detail=False, methods=['get'], url_path='unread-count') | [ZaminexB/apps/tickets/views.py:659](../../../ZaminexB/apps/tickets/views.py#L659) |
| `TicketViewSet.export` | action(detail=False, methods=['get']) | [ZaminexB/apps/tickets/views.py:663](../../../ZaminexB/apps/tickets/views.py#L663) |
| `TicketMetaView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tickets/views.py:746](../../../ZaminexB/apps/tickets/views.py#L746) |
| `TicketSubjectOptionsView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tickets/views.py:777](../../../ZaminexB/apps/tickets/views.py#L777) |
| `TicketRecipientOptionsView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tickets/views.py:888](../../../ZaminexB/apps/tickets/views.py#L888) |
| `TicketUnreadCountView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tickets/views.py:929](../../../ZaminexB/apps/tickets/views.py#L929) |
| `TicketAttachmentDownloadView.get` | متد view؛ مسیر در جدول URL | [ZaminexB/apps/tickets/views.py:936](../../../ZaminexB/apps/tickets/views.py#L936) |

## صفحات و اتصال API در ZaminexF

مرجع route: [ZaminexF/src/shared/lib/appRouting.ts:1](../../../ZaminexF/src/shared/lib/appRouting.ts#L1)؛ مرجع نمایش: [ZaminexF/src/app/App.tsx:1457](../../../ZaminexF/src/app/App.tsx#L1457)؛ منو: [ZaminexF/src/shared/lib/navPages.ts:1](../../../ZaminexF/src/shared/lib/navPages.ts#L1)؛ permission map: [ZaminexF/src/shared/lib/permissions.tsx:1](../../../ZaminexF/src/shared/lib/permissions.tsx#L1).

### همه کلیدهای صفحه در router

| کلید | عنوان |
|---|---|
| `login` | ورود |
| `forgot` | بازیابی رمز عبور |
| `admin-dashboard` | داشبورد مدیریت |
| `properties` | همه املاک |
| `property-detail` | جزئیات ملک |
| `add-property` | ثبت ملک جدید |
| `edit-property` | ویرایش ملک |
| `listings` | همه آگهی‌ها |
| `listings-explore` | اکسپلور آگهی‌ها |
| `create-listing` | ثبت آگهی |
| `listing-detail` | جزئیات آگهی |
| `edit-listing` | ویرایش آگهی |
| `tasks-kanban` | تخته وظایف |
| `tasks-calendar` | تقویم وظایف |
| `create-task` | افزودن وظیفه |
| `consultants` | کارشناسان |
| `add-consultant` | افزودن کارشناس |
| `edit-consultant` | ویرایش کارشناس |
| `follow-ups` | پیگیری‌ها |
| `create-followup` | ایجاد پیگیری |
| `edit-followup` | ویرایش پیگیری |
| `tickets-sent` | تیکت‌های ارسالی |
| `tickets-received` | تیکت‌های دریافتی |
| `tickets-all` | همه تیکت‌ها |
| `create-ticket` | ثبت تیکت |
| `property-reports` | گزارش ملک |
| `activity` | گزارش فعالیت |
| `settings-workspace` | تنظیمات فضای کاری |
| `settings-users` | کاربران |
| `settings-permissions` | دسترسی‌ها |
| `settings-ranges` | رنج‌ها |
| `settings-login-options` | گزینه‌های ورود |
| `manage-districts` | مدیریت مناطق |
| `districts` | مناطق |
| `manage-attributes` | مدیریت ویژگی‌ها |
| `consultant-dashboard` | داشبورد کارشناس |
| `my-properties` | املاک من |
| `all-properties` | املاک من |
| `my-listings` | آگهی‌های من |
| `my-tasks` | وظایف من |
| `my-followups` | پیگیری‌های من |
| `my-profile` | پروفایل من |
| `my-profile-edit` | ویرایش پروفایل |
| `my-profile-security` | امنیت حساب |

### منابع صفحه و literalهای API مصرفی

الگوهای دارای `${...}` پویا هستند؛ بعضی APIها از App یا props تزریق می‌شوند. نبود literal در فایل، نبود API را ثابت نمی‌کند.

#### ZaminexF/src/features/activity/pages/ActivityLogPage.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/common/api/activity-log/?${qs.toString()}` | [ZaminexF/src/features/activity/pages/ActivityLogPage.tsx:60](../../../ZaminexF/src/features/activity/pages/ActivityLogPage.tsx#L60) |
| `/common/api/activity-log/users/` | [ZaminexF/src/features/activity/pages/ActivityLogPage.tsx:68](../../../ZaminexF/src/features/activity/pages/ActivityLogPage.tsx#L68) |
| `/common/api/activity-log/` | [ZaminexF/src/features/activity/pages/ActivityLogPage.tsx:107](../../../ZaminexF/src/features/activity/pages/ActivityLogPage.tsx#L107) |

#### ZaminexF/src/features/attributes/pages/AttributesPage.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/basics/api/attributes/?all=1` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:146](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L146) |
| `/basics/api/catalog/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:157](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L157) |
| `/basics/api/attribute-categories/?all=1` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:170](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L170) |
| `/basics/api/property-type-attributes/?propertyType=${bindTypeId}` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:195](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L195) |
| `/basics/api/deal-type-attributes/?dealType=${bindTypeId}` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:196](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L196) |
| `/basics/api/attributes/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:215](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L215) |
| `/basics/api/attributes/${row.id}/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:243](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L243) |
| `/basics/api/attribute-categories/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:272](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L272) |
| `/basics/api/attributes/${pending.attribute.id}/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:330](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L330) |
| `/basics/api/attribute-categories/${category.id}/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:367](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L367) |
| `/basics/api/attributes/${row.id}/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:400](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L400) |
| `/basics/api/attributes/${attr.id}/options/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:418](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L418) |
| `/basics/api/attributes/${attr.id}/options/${option.id}/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:437](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L437) |
| `/basics/api/property-type-attributes/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:458](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L458) |
| `/basics/api/deal-type-attributes/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:459](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L459) |
| `/basics/api/property-type-attributes/${row.id}/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:484](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L484) |
| `/basics/api/deal-type-attributes/${row.id}/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:485](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L485) |
| `/basics/api/property-type-attributes/${row.id}/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:503](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L503) |
| `/basics/api/deal-type-attributes/${row.id}/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:504](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L504) |
| `/basics/api/property-type-attributes/reorder/` | [ZaminexF/src/features/attributes/pages/AttributesPage.tsx:533](../../../ZaminexF/src/features/attributes/pages/AttributesPage.tsx#L533) |

#### ZaminexF/src/features/auth/LoginPage.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/common/api/login-stats/` | [ZaminexF/src/features/auth/LoginPage.tsx:47](../../../ZaminexF/src/features/auth/LoginPage.tsx#L47) |
| `/accounts/sms-login/request/` | [ZaminexF/src/features/auth/LoginPage.tsx:97](../../../ZaminexF/src/features/auth/LoginPage.tsx#L97) |
| `/accounts/sms-login/verify/` | [ZaminexF/src/features/auth/LoginPage.tsx:126](../../../ZaminexF/src/features/auth/LoginPage.tsx#L126) |
| `/listings/explore/` | [ZaminexF/src/features/auth/LoginPage.tsx:194](../../../ZaminexF/src/features/auth/LoginPage.tsx#L194) |

#### ZaminexF/src/features/consultants/components/ConsultantAnalyticsSection.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/common/api/analytics/consultants/${consultantId}/` | [ZaminexF/src/features/consultants/components/ConsultantAnalyticsSection.tsx:114](../../../ZaminexF/src/features/consultants/components/ConsultantAnalyticsSection.tsx#L114) |

#### ZaminexF/src/features/districts/pages/DistrictsPage.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/basics/api/provinces/` | [ZaminexF/src/features/districts/pages/DistrictsPage.tsx:42](../../../ZaminexF/src/features/districts/pages/DistrictsPage.tsx#L42) |
| `/basics/api/cities/` | [ZaminexF/src/features/districts/pages/DistrictsPage.tsx:43](../../../ZaminexF/src/features/districts/pages/DistrictsPage.tsx#L43) |
| `/basics/api/districts/` | [ZaminexF/src/features/districts/pages/DistrictsPage.tsx:44](../../../ZaminexF/src/features/districts/pages/DistrictsPage.tsx#L44) |
| `/basics/api/provinces/?all=1` | [ZaminexF/src/features/districts/pages/DistrictsPage.tsx:67](../../../ZaminexF/src/features/districts/pages/DistrictsPage.tsx#L67) |
| `/basics/api/cities/?all=1` | [ZaminexF/src/features/districts/pages/DistrictsPage.tsx:68](../../../ZaminexF/src/features/districts/pages/DistrictsPage.tsx#L68) |

#### ZaminexF/src/features/listings/components/ListingDetailModal.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/listings/api/listings/explore/${listingId}/` | [ZaminexF/src/features/listings/components/ListingDetailModal.tsx:67](../../../ZaminexF/src/features/listings/components/ListingDetailModal.tsx#L67) |
| `/tickets/api/listing-inquiries/` | [ZaminexF/src/features/listings/components/ListingDetailModal.tsx:145](../../../ZaminexF/src/features/listings/components/ListingDetailModal.tsx#L145) |

#### ZaminexF/src/features/listings/components/ListingExplorer.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/listings/api/listings/explore/?${params.toString()}` | [ZaminexF/src/features/listings/components/ListingExplorer.tsx:62](../../../ZaminexF/src/features/listings/components/ListingExplorer.tsx#L62) |

#### ZaminexF/src/features/listings/components/MatchAssistantDrawer.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/listings/api/listings/recommendations/?${params.toString()}` | [ZaminexF/src/features/listings/components/MatchAssistantDrawer.tsx:115](../../../ZaminexF/src/features/listings/components/MatchAssistantDrawer.tsx#L115) |

#### ZaminexF/src/features/listings/pages/ListingsPage.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/listings/api/listings/?${params.toString()}` | [ZaminexF/src/features/listings/pages/ListingsPage.tsx:148](../../../ZaminexF/src/features/listings/pages/ListingsPage.tsx#L148) |
| `/listings/api/listings/?${activeParams.toString()}` | [ZaminexF/src/features/listings/pages/ListingsPage.tsx:166](../../../ZaminexF/src/features/listings/pages/ListingsPage.tsx#L166) |

#### ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/accounts/login/?next=${encodeURIComponent(next)}` | [ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx:67](../../../ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx#L67) |
| `/listings/api/public/${listingId}/` | [ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx:79](../../../ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx#L79) |
| `/tickets/api/listing-inquiries/` | [ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx:105](../../../ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx#L105) |
| `/listings/explore/` | [ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx:134](../../../ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx#L134) |
| `/accounts/login/` | [ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx:140](../../../ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx#L140) |
| `/listings/explore/` | [ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx:148](../../../ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx#L148) |
| `/listings/explore/` | [ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx:161](../../../ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx#L161) |
| `/listings/explore/` | [ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx:268](../../../ZaminexF/src/features/listings/pages/PublicListingDetailPage.tsx#L268) |

#### ZaminexF/src/features/listings/pages/PublicListingsPage.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/listings/api/explore/?${params.toString()}` | [ZaminexF/src/features/listings/pages/PublicListingsPage.tsx:77](../../../ZaminexF/src/features/listings/pages/PublicListingsPage.tsx#L77) |
| `/listings/explore/` | [ZaminexF/src/features/listings/pages/PublicListingsPage.tsx:136](../../../ZaminexF/src/features/listings/pages/PublicListingsPage.tsx#L136) |
| `/accounts/login/` | [ZaminexF/src/features/listings/pages/PublicListingsPage.tsx:147](../../../ZaminexF/src/features/listings/pages/PublicListingsPage.tsx#L147) |
| `/listings/${listing.id}/` | [ZaminexF/src/features/listings/pages/PublicListingsPage.tsx:259](../../../ZaminexF/src/features/listings/pages/PublicListingsPage.tsx#L259) |
| `/accounts/login/` | [ZaminexF/src/features/listings/pages/PublicListingsPage.tsx:298](../../../ZaminexF/src/features/listings/pages/PublicListingsPage.tsx#L298) |

#### ZaminexF/src/features/profile/pages/MyProfilePage.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/accounts/admins/` | [ZaminexF/src/features/profile/pages/MyProfilePage.tsx:45](../../../ZaminexF/src/features/profile/pages/MyProfilePage.tsx#L45) |
| `/accounts/consultants/` | [ZaminexF/src/features/profile/pages/MyProfilePage.tsx:45](../../../ZaminexF/src/features/profile/pages/MyProfilePage.tsx#L45) |

#### ZaminexF/src/features/properties/PropertiesPage.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/properties/api/properties/?${params.toString()}` | [ZaminexF/src/features/properties/PropertiesPage.tsx:149](../../../ZaminexF/src/features/properties/PropertiesPage.tsx#L149) |

#### ZaminexF/src/features/properties/components/AddPropertyWizard.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/properties/api/properties/next-internal-code/` | [ZaminexF/src/features/properties/components/AddPropertyWizard.tsx:93](../../../ZaminexF/src/features/properties/components/AddPropertyWizard.tsx#L93) |

#### ZaminexF/src/features/properties/pages/MyPropertiesPage.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/properties/api/properties/?${params.toString()}` | [ZaminexF/src/features/properties/pages/MyPropertiesPage.tsx:102](../../../ZaminexF/src/features/properties/pages/MyPropertiesPage.tsx#L102) |

#### ZaminexF/src/features/properties/pages/PropertyDetail.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/listings/api/listings/?${params.toString()}` | [ZaminexF/src/features/properties/pages/PropertyDetail.tsx:131](../../../ZaminexF/src/features/properties/pages/PropertyDetail.tsx#L131) |
| `/tasks/api/tasks/?propertyId=${propertyKey}` | [ZaminexF/src/features/properties/pages/PropertyDetail.tsx:161](../../../ZaminexF/src/features/properties/pages/PropertyDetail.tsx#L161) |
| `/followups/api/followups/?propertyId=${propertyKey}` | [ZaminexF/src/features/properties/pages/PropertyDetail.tsx:187](../../../ZaminexF/src/features/properties/pages/PropertyDetail.tsx#L187) |
| `/tickets/api/tickets/?${params.toString()}` | [ZaminexF/src/features/properties/pages/PropertyDetail.tsx:216](../../../ZaminexF/src/features/properties/pages/PropertyDetail.tsx#L216) |

#### ZaminexF/src/features/settings/pages/SettingsPage.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/common/api/company-settings/` | [ZaminexF/src/features/settings/pages/SettingsPage.tsx:98](../../../ZaminexF/src/features/settings/pages/SettingsPage.tsx#L98) |
| `/accounts/login-options/` | [ZaminexF/src/features/settings/pages/SettingsPage.tsx:125](../../../ZaminexF/src/features/settings/pages/SettingsPage.tsx#L125) |
| `/accounts/login-options/` | [ZaminexF/src/features/settings/pages/SettingsPage.tsx:149](../../../ZaminexF/src/features/settings/pages/SettingsPage.tsx#L149) |
| `/accounts/role-permissions/` | [ZaminexF/src/features/settings/pages/SettingsPage.tsx:174](../../../ZaminexF/src/features/settings/pages/SettingsPage.tsx#L174) |
| `/accounts/role-permissions/` | [ZaminexF/src/features/settings/pages/SettingsPage.tsx:205](../../../ZaminexF/src/features/settings/pages/SettingsPage.tsx#L205) |
| `/accounts/ranges/` | [ZaminexF/src/features/settings/pages/SettingsPage.tsx:232](../../../ZaminexF/src/features/settings/pages/SettingsPage.tsx#L232) |
| `/accounts/range-users/` | [ZaminexF/src/features/settings/pages/SettingsPage.tsx:238](../../../ZaminexF/src/features/settings/pages/SettingsPage.tsx#L238) |
| `/accounts/ranges/${editingRangeId}/` | [ZaminexF/src/features/settings/pages/SettingsPage.tsx:283](../../../ZaminexF/src/features/settings/pages/SettingsPage.tsx#L283) |
| `/accounts/ranges/` | [ZaminexF/src/features/settings/pages/SettingsPage.tsx:283](../../../ZaminexF/src/features/settings/pages/SettingsPage.tsx#L283) |
| `/accounts/ranges/${range.id}/` | [ZaminexF/src/features/settings/pages/SettingsPage.tsx:306](../../../ZaminexF/src/features/settings/pages/SettingsPage.tsx#L306) |
| `/common/api/company-settings/` | [ZaminexF/src/features/settings/pages/SettingsPage.tsx:322](../../../ZaminexF/src/features/settings/pages/SettingsPage.tsx#L322) |

#### ZaminexF/src/features/tickets/components/PropertyTicketModal.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/tickets/api/tickets/` | [ZaminexF/src/features/tickets/components/PropertyTicketModal.tsx:45](../../../ZaminexF/src/features/tickets/components/PropertyTicketModal.tsx#L45) |

#### ZaminexF/src/features/tickets/pages/TicketsPage.tsx

| مسیر مصرفی | منبع |
|---|---|
| `/tickets/api/subjects/?type=${encodeURIComponent(type)}&q=${encodeURIComponent(query)}&page_size=25` | [ZaminexF/src/features/tickets/pages/TicketsPage.tsx:140](../../../ZaminexF/src/features/tickets/pages/TicketsPage.tsx#L140) |
| `/tickets/api/recipients/?q=${encodeURIComponent(query)}&limit=100` | [ZaminexF/src/features/tickets/pages/TicketsPage.tsx:276](../../../ZaminexF/src/features/tickets/pages/TicketsPage.tsx#L276) |
| `/tickets/api/tickets/` | [ZaminexF/src/features/tickets/pages/TicketsPage.tsx:613](../../../ZaminexF/src/features/tickets/pages/TicketsPage.tsx#L613) |
| `/tickets/api/tickets/${detail.id}/reply/` | [ZaminexF/src/features/tickets/pages/TicketsPage.tsx:822](../../../ZaminexF/src/features/tickets/pages/TicketsPage.tsx#L822) |
| `/tickets/api/tickets/${detail.id}/${action}/` | [ZaminexF/src/features/tickets/pages/TicketsPage.tsx:839](../../../ZaminexF/src/features/tickets/pages/TicketsPage.tsx#L839) |
| `/tickets/api/tickets/?${buildQuery().toString()}` | [ZaminexF/src/features/tickets/pages/TicketsPage.tsx:968](../../../ZaminexF/src/features/tickets/pages/TicketsPage.tsx#L968) |
| `/tickets/api/tickets/${id}/` | [ZaminexF/src/features/tickets/pages/TicketsPage.tsx:984](../../../ZaminexF/src/features/tickets/pages/TicketsPage.tsx#L984) |
| `/tickets/api/recipients/?limit=100&includeSelf=true&includeInactive=true` | [ZaminexF/src/features/tickets/pages/TicketsPage.tsx:1021](../../../ZaminexF/src/features/tickets/pages/TicketsPage.tsx#L1021) |
| `/tickets/api/tickets/export/?${params.toString()}` | [ZaminexF/src/features/tickets/pages/TicketsPage.tsx:1035](../../../ZaminexF/src/features/tickets/pages/TicketsPage.tsx#L1035) |

## فرمان‌های واقعاً موجود در Sample

وجود branch به معنی دسترسی آزاد یا endpoint سرور نیست. submitOffer/acceptOffer عمداً خطا می‌دهند؛ aliasهای قدیمی Listing به review ملک هدایت می‌شوند.

| فرمان | منبع |
|---|---|
| `createLead` | [src/services/operations.js:795](../../src/services/operations.js#L795) |
| `acceptLead` | [src/services/operations.js:838](../../src/services/operations.js#L838) |
| `createContact` | [src/services/operations.js:852](../../src/services/operations.js#L852) |
| `createRegistrationRequest` | [src/services/operations.js:880](../../src/services/operations.js#L880) |
| `assignCase` | [src/services/operations.js:915](../../src/services/operations.js#L915) |
| `assignRegistrationRequest` | [src/services/operations.js:916](../../src/services/operations.js#L916) |
| `acceptAssignment` | [src/services/operations.js:934](../../src/services/operations.js#L934) |
| `rejectAssignment` | [src/services/operations.js:953](../../src/services/operations.js#L953) |
| `postponeAssignment` | [src/services/operations.js:954](../../src/services/operations.js#L954) |
| `reviewConsultantWithdrawal` | [src/services/operations.js:983](../../src/services/operations.js#L983) |
| `approveAssignmentExtension` | [src/services/operations.js:1006](../../src/services/operations.js#L1006) |
| `rejectAssignmentExtension` | [src/services/operations.js:1007](../../src/services/operations.js#L1007) |
| `changePropertyCaseStatus` | [src/services/operations.js:1033](../../src/services/operations.js#L1033) |
| `setPropertyTitle` | [src/services/operations.js:1096](../../src/services/operations.js#L1096) |
| `markDuplicateCase` | [src/services/operations.js:1109](../../src/services/operations.js#L1109) |
| `reopenAppraisal` | [src/services/operations.js:1132](../../src/services/operations.js#L1132) |
| `startAppraisal` | [src/services/operations.js:1161](../../src/services/operations.js#L1161) |
| `saveWorkspace` | [src/services/operations.js:1187](../../src/services/operations.js#L1187) |
| `submitPropertyForReview` | [src/services/operations.js:1259](../../src/services/operations.js#L1259) |
| `reviewProperty` | [src/services/operations.js:1277](../../src/services/operations.js#L1277) |
| `savePropertyListing` | [src/services/operations.js:1299](../../src/services/operations.js#L1299) |
| `submitListingForReview` | [src/services/operations.js:1323](../../src/services/operations.js#L1323) |
| `requestListingChanges` | [src/services/operations.js:1327](../../src/services/operations.js#L1327) |
| `approveListing` | [src/services/operations.js:1328](../../src/services/operations.js#L1328) |
| `transferScope` | [src/services/operations.js:1332](../../src/services/operations.js#L1332) |
| `changeAssignee` | [src/services/operations.js:1404](../../src/services/operations.js#L1404) |
| `changeMembership` | [src/services/operations.js:1408](../../src/services/operations.js#L1408) |
| `createInquiry` | [src/services/operations.js:1428](../../src/services/operations.js#L1428) |
| `introduceListing` | [src/services/operations.js:1482](../../src/services/operations.js#L1482) |
| `updateIntroduction` | [src/services/operations.js:1519](../../src/services/operations.js#L1519) |
| `scheduleViewing` | [src/services/operations.js:1544](../../src/services/operations.js#L1544) |
| `completeViewing` | [src/services/operations.js:1577](../../src/services/operations.js#L1577) |
| `createTask` | [src/services/operations.js:1595](../../src/services/operations.js#L1595) |
| `createFollowUp` | [src/services/operations.js:1610](../../src/services/operations.js#L1610) |
| `rescheduleTask` | [src/services/operations.js:1632](../../src/services/operations.js#L1632) |
| `rescheduleFollowUp` | [src/services/operations.js:1641](../../src/services/operations.js#L1641) |
| `completeFollowUp` | [src/services/operations.js:1671](../../src/services/operations.js#L1671) |
| `completeTask` | [src/services/operations.js:1672](../../src/services/operations.js#L1672) |
| `createDeal` | [src/services/operations.js:1716](../../src/services/operations.js#L1716) |
| `submitOffer` | [src/services/operations.js:1785](../../src/services/operations.js#L1785) |
| `acceptOffer` | [src/services/operations.js:1786](../../src/services/operations.js#L1786) |
| `succeedDeal` | [src/services/operations.js:1788](../../src/services/operations.js#L1788) |
| `saveContractTerms` | [src/services/operations.js:1796](../../src/services/operations.js#L1796) |
| `createContract` | [src/services/operations.js:1807](../../src/services/operations.js#L1807) |
| `signContract` | [src/services/operations.js:1850](../../src/services/operations.js#L1850) |
| `addContractAttachment` | [src/services/operations.js:1896](../../src/services/operations.js#L1896) |
| `finalizeContract` | [src/services/operations.js:1915](../../src/services/operations.js#L1915) |
| `createAmendment` | [src/services/operations.js:2008](../../src/services/operations.js#L2008) |
| `approveCommission` | [src/services/operations.js:2029](../../src/services/operations.js#L2029) |
| `confirmPayment` | [src/services/operations.js:2119](../../src/services/operations.js#L2119) |
| `reversePayment` | [src/services/operations.js:2233](../../src/services/operations.js#L2233) |
| `createDealType` | [src/services/operations.js:2280](../../src/services/operations.js#L2280) |
| `publishDealTypeVersion` | [src/services/operations.js:2320](../../src/services/operations.js#L2320) |
| `saveInquiryNeeds` | [src/services/operations.js:2341](../../src/services/operations.js#L2341) |
| `changeInquiryCaseStatus` | [src/services/operations.js:2362](../../src/services/operations.js#L2362) |
| `updateInquiry` | [src/services/operations.js:2399](../../src/services/operations.js#L2399) |
| `closeDeal` | [src/services/operations.js:2436](../../src/services/operations.js#L2436) |
| `markNotificationRead` | [src/services/operations.js:2451](../../src/services/operations.js#L2451) |
| `setListingStatus` | [src/services/operations.js:2457](../../src/services/operations.js#L2457) |

## تغییرات backend نسبت به HEAD

این فهرست نام فایل و اندازه diff را ثبت می‌کند؛ اختلاف زیاد ممکن است ناشی از قالب/پایان‌خط باشد. attribution نویسنده و استقرار از آن مشخص نیست. شرح تغییرهای معنایی بررسی‌شده در راهنمای اصلی آمده است.

```text
 ZaminexB/apps/accounts/admin.py                    |  71 ++
 ZaminexB/apps/accounts/models.py                   |  85 +-
 ZaminexB/apps/accounts/permissions.py              |  71 +-
 ZaminexB/apps/accounts/serializers.py              |  73 +-
 ZaminexB/apps/accounts/signals.py                  |   1 +
 ZaminexB/apps/accounts/sms.py                      | 717 +++++++--------
 ZaminexB/apps/accounts/urls.py                     |  20 +
 ZaminexB/apps/accounts/views.py                    | 968 +++++++++++++--------
 ZaminexB/apps/activity/models.py                   |   2 +-
 ZaminexB/apps/activity/signals.py                  |   6 +-
 .../tests/test_activity_log_user_filter.py         |   2 +-
 ZaminexB/apps/activity/views.py                    |  58 +-
 ZaminexB/apps/analytics/views.py                   | 121 ++-
 ZaminexB/apps/basics/views.py                      |   9 +-
 ZaminexB/apps/common/access.py                     |  18 +-
 ZaminexB/apps/common/admin.py                      | 716 +++++++--------
 .../admin/common/aiconfiguration/change_form.html  | 824 +++++++++---------
 ZaminexB/apps/common/views.py                      |  46 +-
 ZaminexB/apps/followups/models.py                  |   6 +-
 ZaminexB/apps/followups/serializers.py             |  18 +-
 ZaminexB/apps/followups/views.py                   |  26 +-
 ZaminexB/apps/listings/serializers.py              |  16 +-
 ZaminexB/apps/listings/views.py                    |  96 +-
 ZaminexB/apps/notifications/services.py            |  33 +-
 ZaminexB/apps/properties/models.py                 |   8 +-
 ZaminexB/apps/properties/permissions.py            |   9 +-
 ZaminexB/apps/properties/serializers.py            |   4 +-
 ZaminexB/apps/properties/views.py                  | 214 ++---
 ZaminexB/apps/reports/printing.py                  |   2 +-
 ZaminexB/apps/reports/services.py                  |  15 +-
 ZaminexB/apps/reports/views.py                     |  11 +
 ZaminexB/apps/tasks/serializers.py                 |  25 +
 ZaminexB/apps/tasks/views.py                       |  19 +-
 ZaminexB/apps/tickets/access.py                    |  51 +-
 ZaminexB/apps/tickets/serializers.py               |   2 +-
 ZaminexB/apps/tickets/views.py                     |  46 +-
 36 files changed, 2628 insertions(+), 1781 deletions(-)
```

### فایل‌های جدید backend در checkout

- [ZaminexB/apps/accounts/migrations/0012_rolepermission_alter_user_role_role_salesrange.py:1](../../../ZaminexB/apps/accounts/migrations/0012_rolepermission_alter_user_role_role_salesrange.py#L1)
- [ZaminexB/apps/accounts/migrations/0013_seed_roles_permissions.py:1](../../../ZaminexB/apps/accounts/migrations/0013_seed_roles_permissions.py#L1)
- [ZaminexB/apps/accounts/migrations/0014_alter_consultantprofile_options.py:1](../../../ZaminexB/apps/accounts/migrations/0014_alter_consultantprofile_options.py#L1)
- [ZaminexB/apps/accounts/permission_catalog.py:1](../../../ZaminexB/apps/accounts/permission_catalog.py#L1)
- [ZaminexB/apps/accounts/presentation.py:1](../../../ZaminexB/apps/accounts/presentation.py#L1)
- [ZaminexB/apps/accounts/scoping.py:1](../../../ZaminexB/apps/accounts/scoping.py#L1)
- [ZaminexB/apps/activity/migrations/0002_alter_activitylog_target_type.py:1](../../../ZaminexB/apps/activity/migrations/0002_alter_activitylog_target_type.py#L1)
- [ZaminexB/apps/followups/migrations/0005_alter_followup_consultant_and_more.py:1](../../../ZaminexB/apps/followups/migrations/0005_alter_followup_consultant_and_more.py#L1)
- [ZaminexB/apps/followups/migrations/0006_alter_followup_consultant.py:1](../../../ZaminexB/apps/followups/migrations/0006_alter_followup_consultant.py#L1)
- [ZaminexB/apps/properties/migrations/0023_alter_property_consultant.py:1](../../../ZaminexB/apps/properties/migrations/0023_alter_property_consultant.py#L1)
- [ZaminexB/apps/properties/migrations/0024_alter_property_is_shared.py:1](../../../ZaminexB/apps/properties/migrations/0024_alter_property_is_shared.py#L1)

## اثرانگشت منابع کلیدی بررسی

برای تشخیص تغییر بعدی source؛ این hash امضای انتشار نیست.

| فایل | SHA-256 |
|---|---|

| `Sample/src/App.jsx` | `3c2ee9d07b5753e8ca0cf0216c526464035673a2b9753834fcaa54bdfa4576ea` |
| `Sample/src/services/operations.js` | `53523e4a1d4d3d42cc559b844fe82d81ad4b4c9e55c66861705718b55cfa6af5` |
| `Sample/src/services/intake.js` | `830cface813181ef2d5dc60a1d520efd81e54ef98613090d2f52d72da707b716` |
| `Sample/src/services/property-wizard.js` | `b603998543f6414d1d661ee489782c70fab28df7118705771b246025585a7fa7` |
| `Sample/src/services/inquiry-wizard.js` | `68ff5503e7ce58df9e8510c7830d46f0745dbb68a1a63d067161642bd237cc6c` |
| `ZaminexB/apps/accounts/models.py` | `1c2ef89319fd2882d14acee8357cfadb19c442251d2966ac652ab4f76cb30884` |
| `ZaminexB/apps/accounts/scoping.py` | `ba6ddd54ffe5d7f925e02b9e5623f7499f1a3c690e35a8b7918979904e75f6b1` |
| `ZaminexB/apps/properties/models.py` | `401093baeed00ad6b355097bdab865eb5118c290df28ba10224879adbe8d6703` |
| `ZaminexB/apps/properties/views.py` | `33b6561eb2e05572dde7dfa1645f4df7939a7bd7e65e8479ce463174d9fc534d` |
| `ZaminexB/apps/listings/models.py` | `abe8d19ecd248dddd04f76f15b302a8886fd5bff7fa1d7b7663f2db78ca0dad4` |
| `ZaminexB/apps/listings/views.py` | `d040b1fd144d5b34ce498941c7a920209e19bcba101073bed42b8a6f5dbf5bd3` |
| `ZaminexF/src/app/App.tsx` | `4a066a90b3662d0b36e89a84cf91a4a516d35a2d5122a3990d1260798b08db9a` |
| `ZaminexF/src/shared/lib/appRouting.ts` | `321beda46aecfe4777d26d1a13645bfe362be5b70de2da88eb36d76a0465b19d` |

## serializerهای واقعی و نقاط اعتبارسنجی API

fields و read_only_fields زیر عین تعریف Meta هستند؛ `__all__` یا وراثت به معنی فهرست صریح و نهایی پاسخ نیست. فیلد محاسباتی و محدودسازی پویا به request وابسته است. برای بدنه معتبر، متد validate و create/update همین کلاس و کنترل view را با هم بخوانید.

### ZaminexB/apps/accounts/serializers.py

| کلاس | مدل / فیلدهای Meta | کنترل / ذخیره | منبع |
|---|---|---|---|
| `ConsultantProfileSerializer` | model=ConsultantProfile؛ fields=['id', 'first_name', 'last_name', 'username', 'email', 'password', 'role', 'full_name', 'mobile', 'branch', 'profile_image', 'hired_at', 'notes', 'is_active']؛ read_only_fields=['id'] | validate_mobile:53, validate:60, create:82, update:118, to_representation:148 | [ZaminexB/apps/accounts/serializers.py:13](../../../ZaminexB/apps/accounts/serializers.py#L13) |
| `AdminProfileSerializer` | model=AdminProfile؛ fields=['id', 'first_name', 'last_name', 'username', 'email', 'password', 'full_name', 'mobile', 'branch', 'profile_image', 'hired_at', 'notes', 'is_active']؛ read_only_fields=['id', 'is_active'] | validate_mobile:206, validate:213, update:227, to_representation:256 | [ZaminexB/apps/accounts/serializers.py:172](../../../ZaminexB/apps/accounts/serializers.py#L172) |
| `RangeUserSerializer` | model=User؛ fields=['id', 'username', 'name', 'role'] |  | [ZaminexB/apps/accounts/serializers.py:270](../../../ZaminexB/apps/accounts/serializers.py#L270) |
| `SalesRangeSerializer` | model=SalesRange؛ fields=['id', 'name', 'is_active', 'managers', 'members', 'manager_ids', 'member_ids', 'created_at']؛ read_only_fields=['id', 'created_at'] | validate_name:313 | [ZaminexB/apps/accounts/serializers.py:281](../../../ZaminexB/apps/accounts/serializers.py#L281) |

### ZaminexB/apps/basics/serializers.py

| کلاس | مدل / فیلدهای Meta | کنترل / ذخیره | منبع |
|---|---|---|---|
| `SystemKeyFromLabelMixin` |  |  | [ZaminexB/apps/basics/serializers.py:22](../../../ZaminexB/apps/basics/serializers.py#L22) |
| `AttributeOptionSerializer` | model=AttributeOption؛ fields=['id', 'value', 'displayName', 'sortOrder', 'isActive'] | validate:58 | [ZaminexB/apps/basics/serializers.py:46](../../../ZaminexB/apps/basics/serializers.py#L46) |
| `AttributeCategorySerializer` | model=AttributeCategory؛ fields=['id', 'name', 'displayName', 'sortOrder', 'isActive', 'attributeCount', 'isSystem'] | validate_name:112, validate:129 | [ZaminexB/apps/basics/serializers.py:92](../../../ZaminexB/apps/basics/serializers.py#L92) |
| `AttributeSerializer` | model=Attribute؛ fields=['id', 'name', 'displayName', 'dataType', 'inputType', 'filterType', 'entity', 'unit', 'category', 'isFacility', 'isCore', 'coreField', 'sortOrder', 'isActive', 'options', 'usageCount'] | validate_name:182, validate_category:199, validate:211 | [ZaminexB/apps/basics/serializers.py:150](../../../ZaminexB/apps/basics/serializers.py#L150) |
| `AttributeMiniSerializer` | model=Attribute؛ fields=['id', 'name', 'displayName', 'dataType', 'inputType', 'filterType', 'unit', 'isFacility', 'isCore', 'coreField', 'options'] |  | [ZaminexB/apps/basics/serializers.py:278](../../../ZaminexB/apps/basics/serializers.py#L278) |
| `PropertyUsageSerializer` | model=PropertyUsage؛ fields=['id', 'name', 'displayName', 'sortOrder', 'isActive', 'propertyTypeCount'] |  | [ZaminexB/apps/basics/serializers.py:304](../../../ZaminexB/apps/basics/serializers.py#L304) |
| `PropertyTypeSerializer` | model=PropertyType؛ fields=['id', 'name', 'displayName', 'propertyUsage', 'propertyUsageName', 'slug', 'sortOrder', 'isActive', 'attributeCount', 'propertyCount'] |  | [ZaminexB/apps/basics/serializers.py:320](../../../ZaminexB/apps/basics/serializers.py#L320) |
| `DealTypeSerializer` | model=DealType؛ fields=['id', 'name', 'displayName', 'sortOrder', 'isActive', 'attributeCount', 'listingCount'] |  | [ZaminexB/apps/basics/serializers.py:349](../../../ZaminexB/apps/basics/serializers.py#L349) |
| `PropertyTypeAttributeSerializer` | model=PropertyTypeAttribute؛ fields=['id', 'propertyType', 'attribute', 'attributeDetail', 'isRequired', 'sortOrder', 'isActive'] | validate_attribute:390 | [ZaminexB/apps/basics/serializers.py:372](../../../ZaminexB/apps/basics/serializers.py#L372) |
| `DealTypeAttributeSerializer` | model=DealTypeAttribute؛ fields=['id', 'dealType', 'attribute', 'attributeDetail', 'isRequired', 'sortOrder', 'isActive'] | validate_attribute:416 | [ZaminexB/apps/basics/serializers.py:398](../../../ZaminexB/apps/basics/serializers.py#L398) |
| `FormFieldSerializer` |  |  | [ZaminexB/apps/basics/serializers.py:424](../../../ZaminexB/apps/basics/serializers.py#L424) |
| `SearchFilterSerializer` |  |  | [ZaminexB/apps/basics/serializers.py:453](../../../ZaminexB/apps/basics/serializers.py#L453) |
| `ProvinceSerializer` | model=Province؛ fields=['id', 'name', 'displayName', 'sortOrder', 'isActive', 'cityCount'] | validate:496 | [ZaminexB/apps/basics/serializers.py:480](../../../ZaminexB/apps/basics/serializers.py#L480) |
| `CitySerializer` | model=City؛ fields=['id', 'name', 'displayName', 'province', 'provinceName', 'sortOrder', 'isActive', 'districtCount'] | validate:533 | [ZaminexB/apps/basics/serializers.py:500](../../../ZaminexB/apps/basics/serializers.py#L500) |
| `DistrictSerializer` | model=District؛ fields=['id', 'name', 'displayName', 'city', 'cityName', 'provinceId', 'provinceName', 'fullPath', 'sortOrder', 'isActive', 'propertyCount'] | validate:577 | [ZaminexB/apps/basics/serializers.py:538](../../../ZaminexB/apps/basics/serializers.py#L538) |

### ZaminexB/apps/common/serializers.py

| کلاس | مدل / فیلدهای Meta | کنترل / ذخیره | منبع |
|---|---|---|---|
| `DistrictSerializer` | model=District؛ fields=['id', 'name', 'is_active', 'created_at', 'updated_at'] |  | [ZaminexB/apps/common/serializers.py:6](../../../ZaminexB/apps/common/serializers.py#L6) |
| `CompanySettingsSerializer` | model=CompanySettings؛ fields=['companyName', 'licenseNumber', 'email', 'phone', 'address', 'updated_at']؛ read_only_fields=['updated_at'] |  | [ZaminexB/apps/common/serializers.py:12](../../../ZaminexB/apps/common/serializers.py#L12) |

### ZaminexB/apps/followups/serializers.py

| کلاس | مدل / فیلدهای Meta | کنترل / ذخیره | منبع |
|---|---|---|---|
| `FollowUpListSerializer` | model=FollowUp؛ fields=['id', 'title', 'type', 'contact', 'date', 'consultant', 'consultantId', 'property', 'propertyId', 'outcome', 'status', 'probability', 'notes', 'is_archived', 'isOverdue', 'createdAt', 'updatedAt'] |  | [ZaminexB/apps/followups/serializers.py:10](../../../ZaminexB/apps/followups/serializers.py#L10) |
| `FollowUpWriteSerializer` | model=FollowUp؛ fields=['id', 'title', 'type', 'contact', 'date', 'consultantId', 'propertyId', 'notes', 'outcome', 'status', 'probability'] | validate_probability:101, validate:108 | [ZaminexB/apps/followups/serializers.py:48](../../../ZaminexB/apps/followups/serializers.py#L48) |
| `FollowUpArchiveSerializer` |  |  | [ZaminexB/apps/followups/serializers.py:144](../../../ZaminexB/apps/followups/serializers.py#L144) |

### ZaminexB/apps/listings/serializers.py

| کلاس | مدل / فیلدهای Meta | کنترل / ذخیره | منبع |
|---|---|---|---|
| `PropertyMiniSerializer` | model=Property؛ fields=['id', 'title', 'district', 'price', 'area', 'floor', 'internal_code', 'image_url'] |  | [ZaminexB/apps/listings/serializers.py:18](../../../ZaminexB/apps/listings/serializers.py#L18) |
| `UserMiniSerializer` | model=User؛ fields=['id', 'username', 'name', 'email', 'mobile', 'role'] |  | [ZaminexB/apps/listings/serializers.py:48](../../../ZaminexB/apps/listings/serializers.py#L48) |
| `ListingSerializer` | model=Listing؛ fields=['id', 'title', 'description', 'status', 'rejectionReason', 'publishChannel', 'start_date', 'end_date', 'assigned_to', 'created_by', 'priority', 'is_featured', 'created_at', 'updated_at', 'property', 'property_detail', 'created_by_detail', 'assigned_to_detail', 'channels', 'score', 'views', 'effectiveExposureDays', 'delegationIndicator', 'isBurnedListing', 'generatedHighProbLeads', 'contentRichnessScore', 'engagementHeatScore', 'dealType', 'dealTypeName', 'dealTypeDisplay', 'salePrice', 'deposit', 'monthlyRent', 'priceDetails', 'attributes', 'attributeDetails']؛ read_only_fields=['created_by', 'created_at', 'updated_at', 'status', 'rejectionReason'] | validate_salePrice:170, validate_deposit:175, validate_monthlyRent:180, validate:185, create:214, update:224 | [ZaminexB/apps/listings/serializers.py:63](../../../ZaminexB/apps/listings/serializers.py#L63) |
| `ListingListSerializer` | fields=[field for field in ListingSerializer.Meta.fields if field not in _LISTING_LIST_EXCLUDED] |  | [ZaminexB/apps/listings/serializers.py:249](../../../ZaminexB/apps/listings/serializers.py#L249) |
| `PublicListingSerializer` | model=Listing؛ fields=['id', 'title', 'description', 'dealTypeId', 'dealTypeName', 'dealTypeDisplay', 'salePrice', 'deposit', 'monthlyRent', 'propertyTitle', 'propertyType', 'area', 'district', 'city', 'imageUrl'] |  | [ZaminexB/apps/listings/serializers.py:267](../../../ZaminexB/apps/listings/serializers.py#L267) |
| `PublicListingDetailSerializer` | fields=PublicListingSerializer.Meta.fields + ['priceDetails', 'images', 'listingAttributes', 'listingAttributeDetails', 'propertyAttributes', 'propertyAttributeDetails'] |  | [ZaminexB/apps/listings/serializers.py:337](../../../ZaminexB/apps/listings/serializers.py#L337) |
| `StaffListingOwnerMixin` |  |  | [ZaminexB/apps/listings/serializers.py:523](../../../ZaminexB/apps/listings/serializers.py#L523) |
| `StaffListingCardSerializer` | fields=PublicListingSerializer.Meta.fields + ['consultantId', 'consultantName', 'consultantAvatar', 'channel', 'channelDisplay', 'propertyId', 'isMine'] |  | [ZaminexB/apps/listings/serializers.py:564](../../../ZaminexB/apps/listings/serializers.py#L564) |
| `StaffListingDetailSerializer` | fields=ListingSerializer.Meta.fields + ['area', 'propertyType', 'district', 'city', 'consultantId', 'consultantName', 'consultantAvatar', 'channelDisplay', 'isMine'] |  | [ZaminexB/apps/listings/serializers.py:583](../../../ZaminexB/apps/listings/serializers.py#L583) |

### ZaminexB/apps/properties/serializers.py

| کلاس | مدل / فیلدهای Meta | کنترل / ذخیره | منبع |
|---|---|---|---|
| `PropertyImageSerializer` | model=PropertyImage؛ fields=['id', 'url', 'sort_order'] |  | [ZaminexB/apps/properties/serializers.py:40](../../../ZaminexB/apps/properties/serializers.py#L40) |
| `PropertyAppraisalReportSerializer` | model=PropertyAppraisalReport؛ fields=['id', 'url', 'fileName', 'fileSize', 'uploadedBy', 'uploadedAt'] |  | [ZaminexB/apps/properties/serializers.py:55](../../../ZaminexB/apps/properties/serializers.py#L55) |
| `PropertySerializer` | model=Property؛ fields=['id', 'internalCode', 'title', 'type', 'transactionType', 'floor', 'constructionYear', 'fullAddress', 'propertyStatus', 'price', 'area', 'beds', 'district', 'consultant', 'consultantName', 'consultantId', 'consultantRole', 'date', 'updatedAt', 'description', 'images', 'appraisalReport', 'status', 'rejectionReason', 'pricePerSqm', 'imagesCount', 'daysOnMarket', 'spatialDensityRatio', 'priceDeviationIndex', 'geoPrecisionFlag', 'engagementHeatScore', 'views', 'propertyTypeRef', 'propertyTypeName', 'propertyTypeDisplay', 'propertyUsage', 'propertyUsageName', 'districtId', 'cityId', 'cityName', 'provinceId', 'provinceName', 'locationPath', 'latitude', 'longitude', 'attributes', 'attributeDetails', 'isShared', 'ownerFirstName', 'ownerLastName', 'ownerPhone'] | validate:270, create:366, update:377 | [ZaminexB/apps/properties/serializers.py:83](../../../ZaminexB/apps/properties/serializers.py#L83) |
| `PropertyListSerializer` | fields=[field for field in PropertySerializer.Meta.fields if field not in _PROPERTY_LIST_EXCLUDED] + ['imageUrl'] |  | [ZaminexB/apps/properties/serializers.py:404](../../../ZaminexB/apps/properties/serializers.py#L404) |

### ZaminexB/apps/tasks/serializers.py

| کلاس | مدل / فیلدهای Meta | کنترل / ذخیره | منبع |
|---|---|---|---|
| `UserMiniSerializer` | model=User؛ fields=['id', 'username', 'name', 'email', 'mobile', 'role'] |  | [ZaminexB/apps/tasks/serializers.py:13](../../../ZaminexB/apps/tasks/serializers.py#L13) |
| `PropertyMiniSerializer` | model=Property؛ fields=['id', 'title', 'district', 'price', 'area', 'floor', 'internal_code'] |  | [ZaminexB/apps/tasks/serializers.py:29](../../../ZaminexB/apps/tasks/serializers.py#L29) |
| `TaskSerializer` | model=Task؛ fields=['id', 'title', 'description', 'note', 'status', 'priority', 'task_type', 'taskType', 'assigned_to', 'assigned_to_detail', 'assignee', 'assigneeId', 'created_by', 'created_by_detail', 'creator', 'property', 'property_detail', 'propertyId', 'due_date', 'due', 'isOverdue', 'completed_at', 'completionDate', 'created_at', 'updated_at', 'statusLabel', 'priorityLabel']؛ read_only_fields=['created_by', 'created_at', 'updated_at', 'completed_at'] | validate:94, validate:180 | [ZaminexB/apps/tasks/serializers.py:45](../../../ZaminexB/apps/tasks/serializers.py#L45) |

### ZaminexB/apps/tickets/serializers.py

| کلاس | مدل / فیلدهای Meta | کنترل / ذخیره | منبع |
|---|---|---|---|
| `TicketAttachmentSerializer` | model=TicketAttachment؛ fields=['id', 'originalName', 'contentType', 'size', 'downloadUrl', 'createdAt'] |  | [ZaminexB/apps/tickets/serializers.py:178](../../../ZaminexB/apps/tickets/serializers.py#L178) |
| `TicketMessageSerializer` | model=TicketMessage؛ fields=['id', 'body', 'sender', 'threadRecipient', 'attachments', 'createdAt', 'isInitial'] |  | [ZaminexB/apps/tickets/serializers.py:199](../../../ZaminexB/apps/tickets/serializers.py#L199) |
| `TicketListSerializer` | model=Ticket؛ fields=['id', 'ticketNumber', 'title', 'ticketType', 'ticketTypeLabel', 'priority', 'priorityLabel', 'status', 'statusLabel', 'subjectType', 'subjectTypeLabel', 'subjectId', 'subject', 'createdBy', 'recipients', 'tags', 'hasReply', 'replyCount', 'lastMessageAt', 'lastMessageSender', 'createdAt', 'updatedAt', 'slaDueAt', 'isOverdue', 'isRead', 'isUnread', 'needsResponse', 'waitingForLabel'] |  | [ZaminexB/apps/tickets/serializers.py:225](../../../ZaminexB/apps/tickets/serializers.py#L225) |
| `TicketDetailSerializer` | fields=TicketListSerializer.Meta.fields + ['messages'] |  | [ZaminexB/apps/tickets/serializers.py:421](../../../ZaminexB/apps/tickets/serializers.py#L421) |
| `TicketCreateSerializer` |  | validate:495 | [ZaminexB/apps/tickets/serializers.py:442](../../../ZaminexB/apps/tickets/serializers.py#L442) |
| `TicketUpdateSerializer` |  | validate_tags:594 | [ZaminexB/apps/tickets/serializers.py:580](../../../ZaminexB/apps/tickets/serializers.py#L580) |
| `TicketReplySerializer` |  | validate:632 | [ZaminexB/apps/tickets/serializers.py:603](../../../ZaminexB/apps/tickets/serializers.py#L603) |
| `TicketRecipientSerializer` | model=User؛ fields=['id', 'username', 'name', 'email', 'role'] |  | [ZaminexB/apps/tickets/serializers.py:672](../../../ZaminexB/apps/tickets/serializers.py#L672) |
| `TicketAuditSerializer` | model=TicketAuditEvent؛ fields=['id', 'action', 'actionLabel', 'actor', 'metadata', 'createdAt'] | to_representation:688 | [ZaminexB/apps/tickets/serializers.py:683](../../../ZaminexB/apps/tickets/serializers.py#L683) |
