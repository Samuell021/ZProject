import { showValidationError } from "../services/alerts";
import SelectBox from "./SelectBox";
import JalaliDatePicker from "./JalaliDatePicker";
import JalaliDateInput from "./JalaliDateInput";
import { timelineEntries } from "../services/timeline";
import React, { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
let openModalCount = 0;
let savedBodyOverflow = "";
export const num = (x) => Number(x || 0).toLocaleString("fa-IR");
export const money = (x) => `${num(x)} تومان`;
export const date = (x) =>
  x
    ? new Date(x).toLocaleString("fa-IR", {
        timeZone: "Asia/Tehran",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "تعیین نشده";
export function remaining(x) {
  if (!x) return "بدون موعد";
  const m = Math.round((new Date(x) - Date.now()) / 60000);
  return `${num(Math.abs(m) < 60 ? Math.abs(m) : Math.round(Math.abs(m) / 60))} ${Math.abs(m) < 60 ? "دقیقه" : "ساعت"} ${m < 0 ? "گذشته" : "مانده"}`;
}
export const labels = {
  LEAD_RECEPTION: "پذیرش سرنخ",
  LEAD_READY: "سرنخ و ارجاع",
  ASSIGNMENT_PENDING: "منتظر پاسخ کارشناس",
  CONTRACT: "قرارداد",
  SEARCHING: "جست‌وجو",
  OWNER: "مالک",
  CUSTOMER: "متقاضی",
  OFFICE: "دفتر",
  NEW: "تازه",
  ASSIGNED: "ارجاع شده",
  IN_PROGRESS: "در حال تکمیل",
  PENDING_REVIEW: "منتظر بررسی",
  CHANGES_REQUIRED: "نیازمند اصلاح",
  COMPLETED: "تکمیل شده",
  CANCELLED: "لغو شده",
  DUPLICATE: "تکراری",
  DRAFT: "پیش‌نویس",
  PENDING: "در انتظار",
  APPROVED: "تأیید شده",
  ACTIVE: "فعال",
  PAUSED: "متوقف",
  EXPIRED: "منقضی",
  ARCHIVED: "بایگانی",
  CLOSED: "بسته",
  OPEN: "باز",
  MATCHING: "تطبیق",
  INTRODUCED: "معرفی شده",
  VIEWING: "بازدید",
  NEGOTIATING: "مذاکره",
  NEGOTIATION: "مذاکره",
  AGREED: "توافق",
  WON: "موفق",
  LOST: "ناموفق",
  FINALIZED: "قطعی",
  SIGNED: "امضا شده",
  AWAITING_SIGNATURE: "منتظر امضا",
  PENDING_SIGNATURE: "منتظر امضا",
  ACCEPTED: "پذیرفته",
  REJECTED: "رد شده",
  SCHEDULED: "برنامه‌ریزی شده",
  DONE: "انجام شده",
  HIGH: "بالا",
  NORMAL: "عادی",
  URGENT: "فوری",
  INTERESTED: "علاقه‌مند",
  CONFIRMED: "تأیید شده",
  PARTIAL: "وصول جزئی",
  PAID: "تسویه",
  MANAGER: "مدیر",
  CONSULTANT: "مشاور",
};
export const label = (x) => labels[x] || x || "—";
export function Badge({ value }) {
  return <span className={`badge status-${value}`}>{label(value)}</span>;
}
export const person = (db, id) => {
  const c = db.contacts.find((x) => x.id === id);
  return c
    ? [c.first_name, c.last_name, c.company_name].filter(Boolean).join(" ")
    : "ثبت نشده";
};
export const staff = (db, id) =>
  db.staffProfiles.find((x) => x.user_id === id)?.full_name || "صف ارجاع";
export function Field({
  name,
  title,
  type = "text",
  value,
  onChange,
  options,
  required = false,
  calendar = false,
  ...rest
}) {
  return (
    <div className="field">
      <span>
        {title}
        {required ? " *" : ""}
      </span>
      {options ? (
        <SelectBox
          aria-label={title + (required ? " *" : "")}
          name={name}
          searchable={options.length > 7}
          {...(onChange
            ? { value: value ?? "", onChange }
            : { defaultValue: value ?? "" })}
          required={required}
          {...rest}
        >
          <option value="">انتخاب کنید</option>
          {options.map((x) => (
            <option key={x.id ?? x.value} value={x.id ?? x.value}>
              {x.name ?? x.label}
            </option>
          ))}
        </SelectBox>
      ) : ["date", "datetime-local"].includes(type) ? (
        calendar ? <JalaliDatePicker aria-label={title + (required ? " *" : "")} name={name} value={value} onChange={onChange} withTime={type === "datetime-local"} required={required} {...rest} /> : <JalaliDateInput aria-label={title + (required ? " *" : "")} name={name} value={value} onChange={onChange} withTime={type === "datetime-local"} required={required} {...rest} />
      ) : type === "textarea" ? (
        <textarea
          aria-label={title + (required ? " *" : "")}
          name={name}
          defaultValue={value}
          onChange={onChange}
          required={required}
          {...rest}
        />
      ) : (
        <input
          aria-label={title + (required ? " *" : "")}
          name={name}
          type={type}
          defaultValue={value}
          onChange={onChange}
          required={required}
          {...rest}
        />
      )}
    </div>
  );
}
export function Form({
  children,
  onSubmit,
  submit = "ثبت اطلاعات",
  busy = false,
}) {
  return (
    <form
      onInvalidCapture={showValidationError}
      onSubmit={(e) => {
        e.preventDefault();
        const raw = Object.fromEntries(new FormData(e.currentTarget));
        for (const el of e.currentTarget.elements)
          if (el.name && el.type === "number" && raw[el.name] !== "")
            raw[el.name] = Number(raw[el.name]);
        onSubmit(raw);
      }}
    >
      <div className="form-grid">{children}</div>
      <div className="form-actions">
        <button disabled={busy} type="submit">
          {busy ? "در حال ثبت…" : submit}
        </button>
      </div>
    </form>
  );
}
export function Modal({
  title,
  children,
  parameter = "action",
  className = "",
  clearParameters = [],
}) {
  const [q, setQ] = useSearchParams();
  const close = () => {
    const next = new URLSearchParams(q);
    next.delete(parameter);
    for(const key of clearParameters)next.delete(key);
    if (parameter === "help") {
      next.delete("helpTab");
      next.delete("helpAll");
    }
    setQ(next);
  };
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
    if (openModalCount++ === 0) {
      savedBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    return () => {
      dialog.close();
      if (--openModalCount === 0) document.body.style.overflow = savedBodyOverflow;
      queueMicrotask(() => { if (previousFocus?.isConnected) previousFocus.focus(); });
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      className={`modal ${className}`}
      aria-modal="true"
      aria-label={title}
      onCancel={(event) => { event.preventDefault(); event.stopPropagation(); close(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        event.stopPropagation();
        const controls = [...event.currentTarget.querySelectorAll('button, a[href], input, select, textarea, summary, [tabindex]')]
          .filter((element) => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length);
        const first = controls[0], last = controls.at(-1);
        if (!first) { event.preventDefault(); return; }
        if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom) close();
      }}
    >
      <div className="section-head modal-heading">
        <h2>{title}</h2>
        {parameter === "action" && (
          <button type="button" className="secondary" onClick={() => {
            const next = new URLSearchParams(q);
            next.set("help", "developer");
            setQ(next);
          }}>راهنمای برنامه‌نویس</button>
        )}
        <button type="button" className="secondary modal-close" onClick={close} aria-label="بستن">×</button>
      </div>
      {children}
    </dialog>
  );
}

export function Empty() {
  return <div className="empty">هنوز موردی در این بخش ثبت نشده است.</div>;
}
export function Timeline({ db, id, collection, actorId }) {
  const rows = timelineEntries(db, actorId, collection, id);
  const scope = (id) => db.scopes.find((s) => s.id === id)?.name || "صف ارجاع";
  return (
    <section className="panel" aria-label="خط زمانی پرونده">
      <h3>خط زمانی پرونده</h3>
      {rows.length ? (
        rows.map((x) => (
          <div className="timeline-item" key={x.id} data-event-kind={x.kind}>
            <b>{x.description}</b>
            {x.kind === "stage" && (
              <p>
                {label(x.from_stage)} ← {label(x.to_stage)}
              </p>
            )}
            {x.kind === "assignment" && (
              <p>
                {staff(db, x.previous_assignee_id)} ←{" "}
                {staff(db, x.new_assignee_id)}
              </p>
            )}
            {x.kind === "transfer" && (
              <p>
                {scope(x.from_scope_id)} ← {scope(x.to_scope_id)}
              </p>
            )}
            {(x.kind === "review" || x.kind === "reschedule_decision" || (x.kind === "reschedule" && x.decision)) && <Badge value={x.decision} />}
            {x.kind === "submission" && (
              <small>نسخه ارسال‌شده: {num(x.submitted_version)}</small>
            )}
            {(x.kind === "reschedule" || (x.kind === "reschedule_decision" && x.decision === "APPROVED")) && (
              <p>
                {date(x.previous_scheduled_at)} ← {date(x.new_scheduled_at)}
              </p>
            )}
            {x.reason && <p>دلیل: {x.reason}</p>}
            <small>
              {staff(db, x.actor_id)} · {date(x.occurred_at)}
            </small>
            {x.operation_id && <small>شناسه عملیات: {x.operation_id}</small>}
          </div>
        ))
      ) : (
        <Empty />
      )}
    </section>
  );
}

export const termNames = {
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
  proposed_asset: "دارایی پیشنهادی",
  asset_value: "ارزش دارایی",
  counter_asset_value: "ارزش دارایی مقابل",
  exchange_value: "ارزش دارایی مقابل",
  balance: "مابه‌التفاوت",
  difference: "مابه‌التفاوت",
  note: "توضیحات",
  parking: "پارکینگ",
  elevator: "آسانسور",
  storage: "انباری",
};
export const formatTerms = (x) =>
  typeof x === "string"
    ? x
    : Object.entries(x || {})
        .filter(([k, v]) => v !== undefined && v !== null && v !== "")
        .filter(
          ([k]) =>
            !["proposed_asset", "exchange_value", "difference"].includes(k),
        )
        .map(
          ([k, v]) =>
            `${termNames[k] || "شرط تکمیلی"}: ${typeof v === "object" ? formatTerms(v) : typeof v === "boolean" ? (v ? "دارد" : "ندارد") : v}`,
        )
        .join(" · ");
