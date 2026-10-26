import SelectBox from "../../components/SelectBox";
import React, { useState } from 'react';
import { backendGap, backendReviewDate } from './backendGap';
import { num } from '../../components/ui';
export function BackendModelNote({ name }) {
  const gap = backendGap[name];
  if (!gap) return null;
  return <aside className="backend-model-note" aria-label={`وضعیت ${name} در بک‌اند`}>
    <span className={`badge ${gap.status === 'افزودن مدل' ? 'status-PENDING' : 'status-APPROVED'}`}>{gap.status}</span>
    <p><b>منبع فعلی: </b><code dir="ltr">{gap.source}</code></p>
    <p><b>در مبنای بررسی: </b>{gap.current}</p>
    <p><b>تغییر لازم: </b>{gap.change}</p>
    <p><b>انتقال داده و پذیرش: </b>{gap.migration}</p>
  </aside>;
}
export default function BackendComparison({ names }) {
  const [filter, setFilter] = useState('section');
  const [search, setSearch] = useState('');
  const entries = Object.entries(backendGap).filter(([name, gap]) =>
    (filter !== 'section' || names.includes(name)) &&
    (filter !== 'new' || gap.status === 'افزودن مدل') &&
    (filter !== 'existing' || gap.status !== 'افزودن مدل') &&
    `${name} ${gap.source} ${gap.current} ${gap.change}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <>
    <h3>مسیر تغییر از ZaminexB به نمونه</h3>
    <p>این جدول حاصل بررسی فایل‌های مدل در <code>ZaminexB/apps</code> در تاریخ <code>{backendReviewDate}</code> است؛ بررسی زنده امروز نیست. نیازهای مقصد با Sample در ۱۹ اکتبر تطبیق داده شده‌اند. وجود مدل به معنی تکمیل endpoint، مجوز و گردش نیست. تغییرات بک‌اند در این کار اجرا نشده‌اند.</p>
    <div className="backend-notice">
      <b>پیش از نوشتن migration</b>
      <p>شناسه و نام جدول‌های فعلی جنگو حفظ شوند؛ UUID و نام جدول‌های تب مدل‌ها طرح مفهومی‌اند. گروه‌ها و داده‌های پایه موجود دوباره ساخته نشوند. مسیرهای API راهنما پیشنهادی‌اند.</p>
    </div>
    <div className="backend-filters">
      <label className="field"><span>دامنه مقایسه</span><SelectBox aria-label="دامنه مقایسه بک‌اند" value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="section">مدل‌های همین بخش</option><option value="all">همه مدل‌ها</option>
        <option value="existing">مدل‌های موجود و قابل اصلاح</option><option value="new">مدل‌های پیشنهادی جدید</option>
      </SelectBox></label>
      <label className="field"><span>جست‌وجو در مقایسه</span><input type="search" placeholder="نام مدل، فیلد یا تغییر…" value={search} onChange={e => setSearch(e.target.value)} /></label>
    </div>
    <p className="muted" role="status">{num(entries.length)} مدل در این مقایسه</p>
    {entries.length ? entries.map(([name, gap]) => <details className="developer-model" key={name}>
      <summary><strong dir="ltr">{name}</strong><span>{gap.status}</span></summary>
      <BackendModelNote name={name} />
    </details>) : <p className="empty">مدلی با این عبارت پیدا نشد؛ عبارت یا دامنه مقایسه را تغییر دهید.</p>}
    <h3>ترتیب امن تحویل به برنامه‌نویس</h3>
    <ol>
      <li>فهرست migrationهای اجراشده، نسخه دیتابیس و نسخه پشتیبان را بررسی کنید؛ migration قدیمی را ویرایش نکنید.</li>
      <li>گروه‌ها، کارکنان، رنج‌ها و اشخاص؛ سپس درخواست اولیه و چرخه کارشناسی/عرضه را پیاده کنید.</li>
      <li>درخواست متقاضی، معرفی و بازدید؛ سپس مذاکره، پیشنهاد و قرارداد را اضافه کنید.</li>
      <li>کمیسیون، وصول، تخصیص، سهم و برگشت را با Decimal، قفل هم‌زمانی و تکرار امن فرمان پیاده کنید.</li>
      <li>فیلد جدید nullable، انتقال داده قابل تکرار، گزارش موارد مبهم و سپس قیود؛ حذف فیلد قدیمی بعد از قطع وابستگی خواندن/نوشتن انجام شود.</li>
    </ol>
  </>;
}
