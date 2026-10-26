import TaskPostpone from "../components/TaskPostpone";
import { taskBucket } from "../services/calendar";
import ViewingCalendar from "../components/ViewingCalendar";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { canAccess, hasGroup } from "../services/operations";
import {
  Badge,
  Field,
  Form,
  Modal,
  Empty,
  num,
  money,
  date,
  remaining,
  person,
  staff,
} from "../components/ui";
const subjects = {
  registration_request: "requests",
  property: "properties",
  listing: "listings",
  inquiry: "inquiries",
  deal: "deals",
  contract: "contracts",
  contact: "contacts",
  introduction: "introductions",
};
const titleMap = {
  teams: "تغییر تیم کارمند",
  followups: "تعویق پیگیری",
  viewings: "ثبت نتیجه بازدید",
  finance: "ثبت وجه و تخصیص",
  settings: "نوع معامله و قواعد",
};
const behaviorNames = {
  SALE: "فروش",
  RENT: "رهن و اجاره",
  MORTGAGE: "رهن کامل",
  PRESALE: "پیش‌فروش",
  PARTNERSHIP: "مشارکت",
  EXCHANGE: "معاوضه",
};
export default function SecondaryPages({ page, db, actor, run }) {
  const [q, setQ] = useSearchParams();
  const [pending, setPending] = useState(false);
  const [direction, setDirection] = useState("IN");
  const rows = (k) => db[k] || [];
  const visible = (k) => rows(k).filter((x) => canAccess(db, actor.id, k, x));
  const open = (a, id) => {
    const n = new URLSearchParams(q);
    n.set("action", a);
    if (id) n.set("record", id);
    else n.delete("record");
    setQ(n);
  };
  const commit = async (name, payload) => {
    setPending(true);
    try {
      const ok = await run(name, payload);
      if (ok) {
        const n = new URLSearchParams(q);
        n.delete("action");
        n.delete("record");
        setQ(n);
      }
      return ok;
    } finally {
      setPending(false);
    }
  };
  const selected = q.get("record"),
    action = q.get("action");
  const targetLink = (r) =>
    r.task_type === "PROPERTY_REVIEW" ? `/inbox?review=${r.subject_id}` : r.subject_type === "follow_up"
      ? `/followups?action=followupResult&record=${r.subject_id}`
      : r.subject_type === "viewing"
        ? `/viewings/${r.subject_id}`
        : subjects[r.subject_type]
          ? `/${subjects[r.subject_type]}/${r.subject_id}`
          : null;
  const related = (r) =>
    targetLink(r) ? <Link to={targetLink(r)}>بازکردن پرونده ←</Link> : null;
  const scopeName = (id) =>
    rows("scopes").find((x) => x.id === id)?.name || "بدون رنج";
  let body;
  if (page === "teams")
    body = (
      <>
        <div className="grid">
          {visible("scopes").map((s) => {
            const members = rows("memberships").filter(
              (m) => m.scope_id === s.id,
            );
            return (
              <section key={s.id} className="panel">
                <h2>{s.name}</h2>
                <p className="muted">{s.description}</p>
                <h3>اعضای فعال</h3>
                {members
                  .filter((m) => !m.left_at)
                  .map((m) => (
                    <div className="offer-row" key={m.id}>
                      <span>
                        {staff(db, m.user_id)}{" "}
                        <Badge value={m.membership_role} />
                        <small>از {date(m.joined_at)}</small>
                      </span>
                      {hasGroup(db,actor.id,"GENERAL_MANAGER") && <button
                        className="secondary"
                        onClick={() => open("membership", m.user_id)}
                      >
                        تغییر تیم
                      </button>}
                    </div>
                  ))}
                <details>
                  <summary>
                    اعضای قبلی ({num(members.filter((m) => m.left_at).length)})
                  </summary>
                  {members
                    .filter((m) => m.left_at)
                    .map((m) => (
                      <p key={m.id}>
                        {staff(db, m.user_id)} · تا {date(m.left_at)}
                      </p>
                    ))}
                </details>
                <p>
                  درخواست‌ها:{" "}
                  {num(
                    visible("registrationRequests").filter(
                      (x) => x.management_scope_id === s.id,
                    ).length,
                  )}{" "}
                  · املاک:{" "}
                  {num(
                    visible("properties").filter(
                      (x) => x.management_scope_id === s.id,
                    ).length,
                  )}
                </p>
                <h3>درخواست‌های این رنج</h3>
                {visible("registrationRequests")
                  .filter((r) => r.management_scope_id === s.id)
                  .slice(0, 5)
                  .map((r) => (
                    <div className="timeline-item" key={r.id}>
                      <Link to={`/requests/${r.id}`}>
                        {r.code} · {r.description || r.initial_contact_name}
                      </Link>
                      <small>
                        {staff(db, r.assigned_to_id)} · {remaining(r.due_at)}
                      </small>
                      <Badge value={r.status} />
                    </div>
                  ))}
                <Link to={`/requests?scope=${s.id}`}>
                  همه درخواست‌های این رنج ←
                </Link>
                <h3 style={{ marginTop: "1rem" }}>فایل‌های این رنج</h3>
                {visible("listings")
                  .filter(
                    (l) =>
                      rows("properties").find((p) => p.id === l.property_id)
                        ?.management_scope_id === s.id,
                  )
                  .slice(0, 5)
                  .map((l) => (
                    <div className="timeline-item" key={l.id}>
                      <Link to={`/listings/${l.id}`}>
                        {l.code} · {l.title}
                      </Link>
                      <small>{staff(db, l.assigned_to_id)}</small>
                      <Badge value={l.status} />
                    </div>
                  ))}
                <Link to={`/listings?scope=${s.id}`}>
                  همه فایل‌های این رنج ←
                </Link>
              </section>
            );
          })}
        </div>
        <div className="panel">
          <h3>تیم و مسئول پرونده مستقل‌اند</h3>
          <p>
            تغییر تیم کارمند، پرونده‌های او را خودکار جابه‌جا نمی‌کند. برای
            انتقال پرونده، از جزئیات همان پرونده اقدام کنید؛ انتقال به صف مقصد
            یا مشاور معتبر مقصد انجام می‌شود.
          </p>
        </div>
      </>
    );
  else if (page === "groups")
    body = <section className="panel table-wrap"><h2>گروه‌ها و سطح دسترسی</h2><p className="muted">گروه، مجوز عملیات را مشخص می‌کند؛ عضویت رنج، محدوده پرونده‌های قابل مشاهده را تعیین می‌کند.</p><table><thead><tr><th>گروه</th><th>دسترسی‌ها</th><th>اعضای قابل مشاهده</th></tr></thead><tbody>{db.groups.map(g=><tr key={g.id}><td>{g.name}</td><td>{g.permission_codes.map(p=>({'*':'تمام دسترسی‌ها',registration:'ثبت ملک و کارشناسی',inquiry:'درخواست متقاضی',deal:'عملیات معامله',team:'مدیریت رنج',contract:'قرارداد',finance:'امور مالی'}[p]||p)).join('، ')}</td><td>{visible('users').filter(u=>u.group_ids.includes(g.id)).map(u=>staff(db,u.id)).join('، ')||'—'}</td></tr>)}</tbody></table></section>;
  else if (page === "staff")
    body = (
      <section className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>کارمند</th>
              <th>گروه‌های دسترسی</th>
              <th>عضویت جاری</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {visible("users").map((u) => (
              <tr key={u.id}>
                <td>
                  {staff(db, u.id)}
                  <small>
                    {
                      rows("staffProfiles").find((p) => p.user_id === u.id)
                        ?.mobile
                    }
                  </small>
                </td>
                <td>
                  {u.group_ids
                    .map(
                      (g) => rows("groups").find((x) => x.id === g)?.name || g,
                    )
                    .join("، ")}
                </td>
                <td>
                  {rows("memberships")
                    .filter((m) => m.user_id === u.id && !m.left_at)
                    .map((m) => scopeName(m.scope_id))
                    .join("، ") || "بدون عضویت رنج"}
                </td>
                <td>
                  <Badge value={u.is_active ? "ACTIVE" : "PAUSED"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted">
          گروه تعیین می‌کند چه کاری مجاز است؛ عضویت تیم محدوده پرونده‌ها را مشخص
          می‌کند.
        </p>
      </section>
    );
  else if (page === "tasks") {
    const tasks = visible("tasks").filter(task=>task.assigned_to_id===actor.id);
    body = (
      <div className="grid">
        {[
          ["عقب‌افتاده", (x) => taskBucket(x) === "overdue"],
          ["امروز", (x) => taskBucket(x) === "today"],
          ["آینده و انجام‌شده", (x) => taskBucket(x) === "other"],
        ].map(([name, test]) => (
          <section className="panel" key={name}>
            <h2>{name}</h2>
            {tasks.filter(test).map((t) => (
              <article className="card" key={t.id}>
                <h3>{t.title}</h3>
                <p>{t.description}</p>
                {t.task_type==='LEAD_ACCEPTANCE'&&<p><b>ثبت‌کننده سرنخ: {staff(db,t.created_by_id)}</b></p>}
                <Badge value={t.status} />
                <small>
                  {staff(db, t.assigned_to_id)} · {remaining(t.due_at)}
                </small>
                <small>{date(t.due_at)}</small>
                {related(t)}
                {t.task_type==='MANUAL'&&<TaskPostpone task={t} run={commit} busy={pending}/>}
                {!["COMPLETED", "DONE", "CANCELLED"].includes(t.status) &&
                  (t.task_type=== "MANUAL" || t.task_type!=="PROPERTY_REVIEW" && !["follow_up", "viewing", "registration_request", "inquiry"].includes(t.subject_type)) && (
                    <button
                      disabled={pending}
                      onClick={() => commit("completeTask", { id: t.id })}
                    >
                      انجام شد
                    </button>
                  )}
              </article>
            ))}
            {!tasks.filter(test).length && <Empty />}
          </section>
        ))}
      </div>
    );
  } else if (page === "followups")
    body = (
      <section className="panel">
        <div className="grid">
          {visible("followUps").map((f) => (
            <article className="card" key={f.id}>
              <h3>{person(db, f.contact_id)}</h3>
              <p>{f.notes}</p>
              <small>
                {staff(db, f.consultant_id)} · {date(f.scheduled_at)} ·{" "}
                {remaining(f.scheduled_at)}
              </small>
              <Badge value={f.status} />
              <p>{f.outcome || f.next_action}</p>
              {related(f)}
              {!["COMPLETED", "DONE", "CANCELLED"].includes(f.status) && (
                <div className="toolbar">
                  <button
                    className="secondary"
                    onClick={() => open("reschedule", f.id)}
                  >
                    تعویق با دلیل
                  </button>
                  <button onClick={() => open("followupResult", f.id)}>
                    ثبت نتیجه
                  </button>
                </div>
              )}
              <details>
                <summary>سابقه تعویق</summary>
                {rows("rescheduleHistory")
                  .filter((h) => h.followup_id === f.id)
                  .map((h) => (
                    <p key={h.id}>
                      {date(h.previous_scheduled_at)} ←{" "}
                      {date(h.new_scheduled_at)}
                      <small>
                        {h.reason} · {staff(db, h.changed_by_id)}
                      </small>
                    </p>
                  ))}
              </details>
            </article>
          ))}
        </div>
        {!visible("followUps").length && <Empty />}
      </section>
    );
  else if (page === "viewings") {
    const viewings = visible("viewings");
    body = (
      <section className="panel">
        <div className="section-head">
          <p className="muted">بازدید مشتری مستقل از کارشناسی ملک است.</p>
          <div className="toolbar">
            <button
              className="secondary"
              onClick={() => {
                const n = new URLSearchParams(q);
                n.set(
                  "view",
                  q.get("view") === "calendar" ? "list" : "calendar",
                );
                setQ(n);
              }}
            >
              {q.get("view") === "calendar" ? "نمای فهرست" : "نمای تقویم"}
            </button>
          </div>
        </div>
        {q.get("view") === "calendar" ? (
          <ViewingCalendar
            viewings={viewings}
            db={db}
            onResult={(id) => open("viewingResult", id)}
          />
        ) : (
          <div className="grid">
            {viewings
              .slice()
              .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))
              .map((v) => {
                const intro = rows("introductions").find(
                  (i) => i.id === v.introduction_id,
                );
                const inquiry = rows("inquiries").find(
                  (i) => i.id === intro?.inquiry_id,
                );
                return (
                  <article key={v.id} className="card">
                    <h3><Link to={`/viewings/${v.id}`}>{date(v.scheduled_at)}</Link></h3>
                    <Link className="button secondary" to={`/viewings/${v.id}`}>جزئیات، کارها و پیگیری‌ها</Link>
                    <p>{person(db, inquiry?.contact_id)}</p>
                    <small>مشاور همراه: {staff(db, v.consultant_id)}</small>
                    <Badge value={v.status} />
                    <p>{v.outcome || "نتیجه بازدید هنوز ثبت نشده"}</p>
                    <Link to={`/introductions/${v.introduction_id}`}>
                      معرفی مرتبط ←
                    </Link>
                    {!["COMPLETED", "DONE", "CANCELLED"].includes(v.status) && (
                      <p>
                        <button onClick={() => open("viewingResult", v.id)}>
                          ثبت نتیجه بازدید
                        </button>
                      </p>
                    )}
                  </article>
                );
              })}
          </div>
        )}
        {!viewings.length && <Empty />}
      </section>
    );
  } else if (page === "finance") {
    const commissions = visible("commissions"),
      shares = visible("commissionShares"),
      payments = visible("payments");
    const activePayment = (id) => {
      const p = rows("payments").find((x) => x.id === id);
      return (
        p &&
        p.status === "CONFIRMED" &&
        !p.reversal_of_id &&
        !rows("payments").some((r) => r.reversal_of_id === p.id)
      );
    };
    const allocated = (id, share = false) =>
      rows("paymentAllocations")
        .filter(
          (a) =>
            (share
              ? a.commission_share_id === id
              : a.commission_id === id && !a.commission_share_id) &&
            activePayment(a.payment_id),
        )
        .reduce((s, a) => s + Number(a.amount), 0);
    const total = commissions.reduce(
        (s, c) => s + Number(c.final_amount || 0),
        0,
      ),
      received = commissions.reduce((s, c) => s + allocated(c.id), 0),
      shareTotal = shares
        .filter((x) => x.beneficiary_type !== "OFFICE")
        .reduce((s, c) => s + Number(c.amount), 0),
      sharePaid = shares
        .filter((x) => x.beneficiary_type !== "OFFICE")
        .reduce((s, c) => s + allocated(c.id, true), 0);
    body = (
      <>
        <p className="alert success">
          سیاست کمیسیون و قراردادها صرفاً نمونه نمایشی هستند؛ تعرفه رسمی نیستند.
        </p>
        <div className="stats">
          {[
            ["کمیسیون مصوب", total],
            ["وصول شده", received],
            ["مانده مطالبات", total - received],
            ["سهم مشاوران", shareTotal],
            ["سهم پرداخت شده", sharePaid],
            ["مانده سهم", shareTotal - sharePaid],
          ].map(([t, v]) => (
            <div className="stat" key={t}>
              <span>{t}</span>
              <strong style={{ fontSize: "1.3rem" }}>{money(v)}</strong>
            </div>
          ))}
        </div>
        <section className="panel">
          <div className="section-head">
            <h2>مطالبات قراردادها</h2>
            <button onClick={() => open("payment")}>
              ثبت دریافت یا پرداخت
            </button>
          </div>
          {visible("contracts")
            .filter(
              (c) =>
                c.status === "FINALIZED" &&
                !commissions.some((x) => x.contract_id === c.id),
            )
            .map((c) => (
              <p key={c.id}>
                <Link to={`/contracts/${c.id}`}>{c.contract_number}</Link>{" "}
                <button
                  disabled={pending}
                  onClick={() => commit("approveCommission", { id: c.id })}
                >
                  تصویب کمیسیون با سیاست نمایشی
                </button>
              </p>
            ))}
          {commissions.map((c) => (
            <details key={c.id}>
              <summary>
                {person(db, c.debtor_contact_id)} · {money(c.final_amount)} ·
                مانده {money(Number(c.final_amount) - allocated(c.id))}
              </summary>
              {canAccess(db,actor.id,"contracts",rows("contracts").find(x=>x.id===c.contract_id))&&<Link to={`/contracts/${c.contract_id}`}>قرارداد مرتبط ←</Link>}
              <p>
                ارزش قراردادی:{" "}
                {(() => {
                  const contract = rows("contracts").find(
                    (k) => k.id === c.contract_id,
                  );
                  const dt = rows("dealTypeVersions").find(
                    (v) => v.id === contract?.deal_type_version_id,
                  );
                  const type = rows("dealTypes").find(
                    (t) => t.id === dt?.deal_type_id,
                  );
                  return (
                    <span>
                      {type?.name} ·{" "}
                      {contract?.sale_price
                        ? `مبلغ معامله ${money(contract.sale_price)}`
                        : `ودیعه ${money(contract?.deposit)} · اجاره ماهانه ${money(contract?.monthly_rent)}`}
                    </span>
                  );
                })()}
              </p>
              <p>
                مبلغ محاسبه: {money(c.calculated_amount)} · تعدیل:{" "}
                {money(c.adjustment_amount)}
                <small>{c.adjustment_reason}</small>
              </p>
              <p>مبنای محاسبه ذخیره‌شده در زمان تصویب:</p>
              <p>
                مبنای مبلغ: {money(c.calculation_snapshot?.base)} · سیاست:{" "}
                {c.calculation_snapshot?.policy?.name ||
                  "سیاست نمایشی ذخیره‌شده"}{" "}
                · نسخه{" "}
                {num(c.calculation_snapshot?.policy?.version_number || 1)}
              </p>
              {shares
                .filter((s) => s.commission_id === c.id)
                .map((s) => (
                  <p key={s.id}>
                    {s.beneficiary_type === "OFFICE"
                      ? "دفتر"
                      : staff(db, s.beneficiary_user_id)}{" "}
                    · {num(s.share_percent)}٪ · {money(s.amount)} · پرداخت شده{" "}
                    {money(allocated(s.id, true))}
                  </p>
                ))}
            </details>
          ))}
          {!commissions.length && <Empty />}
        </section>
        <section className="panel">
          <h2>وجوه و برگشت‌های مرتبط</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>جهت و طرف حساب</th>
                  <th>مبلغ</th>
                  <th>تاریخ</th>
                  <th>شناسه پیگیری</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.direction === "IN" ? "دریافت" : "پرداخت"} ·{" "}
                      {p.contact_id
                        ? person(db, p.contact_id)
                        : staff(db, p.user_id)}
                      {p.reversal_of_id && (
                        <small>برگشت مرتبط با {p.reversal_of_id}</small>
                      )}
                    </td>
                    <td>{money(p.amount)}</td>
                    <td>{date(p.paid_at)}</td>
                    <td>{p.reference_number || "—"}</td>
                    <td>
                      {activePayment(p.id) && (
                        <button
                          className="secondary"
                          onClick={() => open("reverse", p.id)}
                        >
                          ثبت برگشت
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  } else if (page === "settings")
    body = (
      <>
        <section className="panel">
          <div className="section-head">
            <h2>انواع معامله و نسخه‌های قواعد</h2>
            <button onClick={() => open("newType")}>افزودن نوع معامله</button>
          </div>
          <p className="muted">
            فایل و قرارداد روی نسخه زمان ایجاد باقی می‌مانند. تغییر قواعد فقط
            نسخه جدید منتشر می‌کند.
          </p>
          <div className="grid">
            {rows("dealTypes").map((t) => (
              <article className="card" key={t.id}>
                <h3>{t.name}</h3>
                <small>رفتار: {behaviorNames[t.behavior_type] || t.name}</small>
                {rows("dealTypeVersions")
                  .filter((v) => v.deal_type_id === t.id)
                  .map((v) => (
                    <details key={v.id}>
                      <summary>
                        نسخه {num(v.version_number)} ·{" "}
                        {v.status === "PUBLISHED"
                          ? "منتشرشده و غیرقابل ویرایش"
                          : "پیش‌نویس"}
                      </summary>
                      {v.field_definitions.map((f) => (
                        <p key={f.code}>
                          {fieldNames[f.code] || f.name} ·{" "}
                          {f.required ? "الزامی" : "اختیاری"}
                        </p>
                      ))}
                    </details>
                  ))}
                <button
                  className="secondary"
                  onClick={() => open("version", t.id)}
                >
                  انتشار نسخه جدید
                </button>
              </article>
            ))}
          </div>
        </section>
      </>
    );
  else if (page === "notifications")
    body = (
      <div className="grid">
        <section className="panel">
          <h2>اعلان‌های شما</h2>
          {visible("notifications")
            .filter((n) => n.user_id === actor.id)
            .slice()
            .reverse()
            .map((n) => (
              <article className="card" key={n.id}>
                <h3>{n.title}</h3>
                <p>{n.message}</p>
                <small>{date(n.created_at)}</small>
                {related(n)}
                {!n.is_read && (
                  <button
                    className="secondary"
                    onClick={() => commit("markNotificationRead", { id: n.id })}
                  >
                    خوانده شد
                  </button>
                )}
              </article>
            ))}
        </section>
        <section className="panel">
          <h2>سوابق عملیات مجاز</h2>
          {visible("activityLogs")
            .slice()
            .reverse()
            .map((l) => (
              <div className="timeline-item" key={l.id}>
                <b>{l.description}</b>
                <small>
                  {staff(db, l.user_id)} · {date(l.created_at)}
                </small>
                {related(l)}
                <small>شناسه عملیات: {l.operation_id}</small>
              </div>
            ))}
        </section>
      </div>
    );
  else if (page === "reports")
    body = (
      <>
        <div className="stats">
          {[
            ["درخواست ثبت ملک", visible("registrationRequests").length],
            [
              "فایل فعال تأییدشده",
              visible("listings").filter(
                (x) => x.status === "ACTIVE" && x.review_status === "APPROVED",
              ).length,
            ],
            [
              "نرخ تبدیل معرفی به بازدید",
              `${num(Math.round((100 * visible("viewings").length) / Math.max(1, visible("introductions").length)))}٪`,
            ],
            [
              "قرارداد قطعی",
              visible("contracts").filter((x) => x.status === "FINALIZED")
                .length,
            ],
          ].map(([t, n]) => (
            <div className="stat" key={t}>
              <span>{t}</span>
              <strong>{typeof n === "number" ? num(n) : n}</strong>
            </div>
          ))}
        </div>
        <section className="panel">
          <h2>عملکرد رنج‌ها</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>رنج</th>
                  <th>درخواست</th>
                  <th>ملک</th>
                  <th>مذاکره</th>
                  <th>درخواست مشتری</th>
                </tr>
              </thead>
              <tbody>
                {visible("scopes").map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    {[
                      "registrationRequests",
                      "properties",
                      "deals",
                      "inquiries",
                    ].map((k) => (
                      <td key={k}>
                        {num(
                          visible(k).filter(
                            (x) => x.management_scope_id === s.id,
                          ).length,
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted">
            گزارش بر اساس داده‌های قابل مشاهده برای کاربر فعلی محاسبه می‌شود.
            ارزش معامله از کمیسیون و دریافت وجه جداست.
          </p>
        </section>
      </>
    );
  else if (page === "guide") body = <Guide db={db} />;
  else body = <Empty />;
  const selectedFollow = visible("followUps").find((x) => x.id === selected&&!["COMPLETED","DONE","CANCELLED"].includes(x.status)),
    selectedViewing = visible("viewings").find((x) => x.id === selected&&x.status==="SCHEDULED"),
    selectedType = rows("dealTypes").find((x) => x.id === selected);
  return (
    <>
      {body}
      {action && (page!=="followups"||selectedFollow) && (page!=="viewings"||selectedViewing) && (
        <Modal title={titleMap[page] || "ثبت اطلاعات"}>
          {page === "teams" && action === "membership" ? (
            <Form
              busy={pending}
              onSubmit={(x) =>
                commit("changeMembership", { user_id: selected, ...x })
              }
            >
              <p className="full-width">
                تغییر تیم {staff(db, selected)}؛ پرونده‌های قبلی منتقل نمی‌شوند.
              </p>
              <Field
                name="scope_id"
                title="تیم مقصد"
                options={visible("scopes")}
                required
              />
              <Field
                name="membership_role"
                title="نوع عضویت"
                options={[
                  { id: "CONSULTANT", name: "مشاور" },
                  { id: "MANAGER", name: "مدیر" },
                ]}
                required
              />
              <Field name="reason" title="دلیل تغییر تیم" required />
            </Form>
          ) : page === "followups" && selectedFollow ? (
            <Form
              busy={pending}
              onSubmit={(x) =>
                commit(
                  action === "reschedule"
                    ? "rescheduleFollowUp"
                    : "completeFollowUp",
                  { id: selected, ...x },
                )
              }
            >
              {action === "reschedule" ? (
                <>
                  <Field
                    name="scheduled_at"
                    title="زمان جدید"
                    type="datetime-local"
                    required
                  />
                  <Field
                    name="reason"
                    title="دلیل تعویق"
                    type="textarea"
                    required
                  />
                </>
              ) : (
                <>
                  <Field
                    name="outcome"
                    title="نتیجه پیگیری"
                    type="textarea"
                    required
                  />
                  <Field name="next_action" title="اقدام بعدی" />
                  <Field
                    name="next_action_at"
                    title="موعد اقدام بعدی"
                    type="datetime-local"
                  />
                </>
              )}
            </Form>
          ) : page === "viewings" && selectedViewing ? (
            <Form
              busy={pending}
              onSubmit={(x) =>
                commit("completeViewing", { id: selected, ...x })
              }
            >
              <Field
                name="outcome"
                title="نتیجه بازدید"
                type="textarea"
                required
              />
              <Field
                name="customer_feedback"
                title="بازخورد مشتری"
                type="textarea"
              />
            </Form>
          ) : page === "finance" && action === "reverse" ? (
            <Form
              busy={pending}
              onSubmit={(x) => commit("reversePayment", { id: selected, ...x })}
            >
              <Field
                name="reason"
                title="دلیل برگشت وجه تأییدشده"
                required
                type="textarea"
              />
            </Form>
          ) : page === "finance" && action === "payment" ? (
            <Form
              busy={pending}
              onSubmit={(x) =>
                commit("confirmPayment", {
                  direction,
                  amount: x.amount,
                  contact_id: direction === "IN" ? x.party_id : null,
                  user_id: direction === "OUT" ? x.party_id : null,
                  method: x.method,
                  reference_number: x.reference_number,
                  allocations: [
                    {
                      [direction === "IN"
                        ? "commission_id"
                        : "commission_share_id"]: x.target_id,
                      amount: x.allocation_amount,
                    },
                  ],
                })
              }
            >
              <Field
                name="direction"
                title="جهت وجه"
                options={[
                  { id: "IN", name: "دریافت از مشتری" },
                  { id: "OUT", name: "پرداخت سهم مشاور" },
                ]}
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                required
              />
              <Field
                key={direction + "party"}
                name="party_id"
                title="طرف حساب"
                options={
                  direction === "IN"
                    ? visible("contacts").map((c) => ({
                        id: c.id,
                        name: person(db, c.id),
                      }))
                    : rows("users").map((u) => ({
                        id: u.id,
                        name: staff(db, u.id),
                      }))
                }
                required
              />
              <Field
                name="amount"
                title="مبلغ وجه (تومان)"
                type="number"
                min="1"
                required
              />
              <Field
                key={direction + "target"}
                name="target_id"
                title="تخصیص به"
                options={
                  direction === "IN"
                    ? visible("commissions").map((c) => ({
                        id: c.id,
                        name: `${person(db, c.debtor_contact_id)} · ${money(c.final_amount)}`,
                      }))
                    : visible("commissionShares")
                        .filter((s) => s.beneficiary_type !== "OFFICE")
                        .map((s) => ({
                          id: s.id,
                          name: `${staff(db, s.beneficiary_user_id)} · ${money(s.amount)}`,
                        }))
                }
                required
              />
              <Field
                name="allocation_amount"
                title="مبلغ تخصیص (تومان)"
                type="number"
                min="1"
                required
              />
              <Field
                name="method"
                title="روش پرداخت"
                options={[
                  { id: "BANK_TRANSFER", name: "انتقال بانکی" },
                  { id: "CASH", name: "نقدی" },
                  { id: "CARD", name: "کارت" },
                ]}
                required
              />
              <Field name="reference_number" title="شماره پیگیری" required />
            </Form>
          ) : page === "settings" && action === "newType" ? (
            <Form busy={pending} onSubmit={(x) => commit("createDealType", x)}>
              <Field name="name" title="نام نوع معامله" required />
              <Field
                name="code"
                title="شناسه لاتین یکتا"
                pattern="[A-Za-z_]+"
                required
              />
              <Field
                name="behavior_type"
                title="رفتار مالی پایه"
                options={Object.entries(behaviorNames).map(([id, name]) => ({
                  id,
                  name,
                }))}
                required
              />
              <p className="full-width muted">
                قواعد اولیه رفتار انتخاب‌شده استفاده می‌شود؛ اجرای فرمول یا کد
                دلخواه در نمونه وجود ندارد.
              </p>
            </Form>
          ) : page === "settings" && action === "version" && selectedType ? (
            <VersionForm
              type={selectedType}
              db={db}
              busy={pending}
              commit={commit}
            />
          ) : (
            <p>این عملیات یا رکورد برای کاربر فعلی در دسترس نیست.</p>
          )}
        </Modal>
      )}
    </>
  );
}
const fieldNames = {
  sale_price: "قیمت فروش",
  deposit: "ودیعه",
  monthly_rent: "اجاره ماهانه",
  down_payment: "پیش‌پرداخت",
  installments: "شرح اقساط",
  delivery_date: "موعد تحویل",
  owner_contribution: "آورده مالک",
  builder_contribution: "آورده سازنده",
  owner_share: "سهم مالک",
  builder_share: "سهم سازنده",
  offered_asset: "دارایی پیشنهادی",
  asset_value: "ارزش دارایی اول",
  counter_asset_value: "ارزش دارایی مقابل",
  balance: "مابه‌التفاوت",
};
function VersionForm({ type, db, busy, commit }) {
  const latest = (db.dealTypeVersions || [])
    .filter((v) => v.deal_type_id === type.id)
    .sort((a, b) => b.version_number - a.version_number)[0];
  return (
    <Form
      busy={busy}
      submit="انتشار نسخه جدید"
      onSubmit={(x) => {
        const fields = (latest?.field_definitions || []).map((f, i) => ({
          ...f,
          name: x["name" + i] || fieldNames[f.code] || f.name,
          required: x["required" + i] === "true",
        }));
        commit("publishDealTypeVersion", {
          id: type.id,
          field_definitions: fields,
          validation_rules: {
            ...latest?.validation_rules,
            required: fields.filter((f) => f.required).map((f) => f.code),
          },
        });
      }}
    >
      <p className="full-width">
        {type.name} · نسخه جدید با حفظ نسخه‌های قبلی ساخته می‌شود. رفتار مالی
        پایه حفظ خواهد شد.
      </p>
      {(latest?.field_definitions || []).map((f, i) => (
        <React.Fragment key={f.code}>
          <Field
            name={"name" + i}
            title={"عنوان " + (fieldNames[f.code] || "فیلد")}
            value={fieldNames[f.code] || f.name}
            required
          />
          <Field
            name={"required" + i}
            title="تکمیل این فیلد"
            value={String(f.required)}
            options={[
              { id: "true", name: "الزامی" },
              { id: "false", name: "اختیاری" },
            ]}
            required
          />
        </React.Fragment>
      ))}
    </Form>
  );
}
function Guide({ db }) {
  const models = [
    [
      "Contact",
      "هویت شخص؛ نقش او از ارتباط پرونده‌ها خوانده می‌شود.",
      "first_name, last_name, national_id",
    ],
    [
      "Property",
      "ویژگی‌های خود دارایی؛ قیمت عرضه روی این مدل نیست.",
      "area, rooms, district_id, attribute_values",
    ],
    [
      "Listing",
      "شرایط عرضه و نسخه بررسی‌شده ملک.",
      "property_id, deal_type_version_id, sale_price, review_status",
    ],
    [
      "Inquiry",
      "نیاز یک شخص؛ هر شخص چند درخواست مستقل دارد.",
      "contact_id, district_ids, min_area, assigned_to_id",
    ],
    [
      "Introduction",
      "معرفی صریح یک فایل به یک درخواست با تصویر شرایط همان زمان.",
      "inquiry_id, listing_id, introduced_terms_snapshot",
    ],
    [
      "Viewing",
      "بازدید مشتری؛ جدا از کارشناسی اولیه ملک.",
      "introduction_id, scheduled_at, outcome",
    ],
    [
      "Deal",
      "پرونده مذاکره با پیشنهادهای تاریخچه‌دار.",
      "listing_id, inquiry_id, accepted_offer_id, stage",
    ],
    [
      "Contract",
      "توافق و هویت طرفین در لحظه قرارداد؛ قطعی‌شدن نیازمند امضاست.",
      "deal_id, terms_snapshot, status, finalized_at",
    ],
    [
      "Task",
      "وظیفه اجرایی مرتبط با دقیقاً یک موضوع.",
      "subject_type, subject_id, assigned_to_id, due_at",
    ],
    [
      "FollowUp",
      "ارتباط برنامه‌ریزی‌شده و قابل تعویق با شخص.",
      "contact_id, scheduled_at, outcome",
    ],
    [
      "Commission",
      "مطالبه دفتر بر مبنای سیاست نسخه‌دار نمایشی.",
      "contract_id, calculated_amount, final_amount",
    ],
    [
      "PaymentAllocation",
      "اتصال بخشی از وجه به مطالبه یا سهم مشاور.",
      "payment_id, commission_id, commission_share_id, amount",
    ],
  ];
  return (
    <>
      <section className="panel">
        <h2>نقشه ارتباط اطلاعات</h2>
        <div className="guide-diagram" dir="ltr">
          {[
            "Contact",
            "RegistrationRequest",
            "Property",
            "Listing",
            "Introduction",
            "Viewing",
            "Deal",
            "Contract",
            "Commission",
            "Payment",
          ].map((m, i) => (
            <React.Fragment key={m}>
              {i > 0 && <span>→</span>}
              <span className="guide-node">{m}</span>
            </React.Fragment>
          ))}
        </div>
        <p className="muted">
          Contact → Inquiry → Introduction شاخه مشتری را به فایل متصل می‌کند.
          کارشناس و بازدیدکننده یک نوع رویداد نیستند.
        </p>
      </section>
      <section className="panel">
        <h2>دنبال‌کردن سناریوی نمونه</h2>
        <ol>
          <li>
            <Link to="/requests">
              با مدیر رنج یک درخواست بسازید و ارجاع دهید.
            </Link>{" "}
            وظیفه، اعلان و سابقه ارجاع ساخته می‌شود.
          </li>
          <li>
            با مشاور وارد شوید؛ در همان درخواست کارشناسی، مشخصات ملک و شرایط
            عرضه را تکمیل و برای بررسی ارسال کنید.
          </li>
          <li>
            <Link to="/reviews">با مدیر رنج بررسی کنید:</Link> برگشت با دلیل،
            اصلاح مشاور و تأیید نسخه جدید. تأیید، فایل را فعال و درخواست را
            تکمیل می‌کند.
          </li>
          <li>
            <Link to="/inquiries">درخواست مشتری را باز کنید:</Link> تطبیق را
            ببینید و صریحاً معرفی ثبت کنید؛ جست‌وجو معرفی محسوب نمی‌شود.
          </li>
          <li>
            <Link to="/introductions">معرفی</Link> ← بازدید ← نتیجه ← مذاکره ←
            پیشنهاد ← پذیرش.
          </li>
          <li>
            <Link to="/contracts">
              با مسئول قرارداد امضاها را ثبت و قرارداد را قطعی کنید.
            </Link>{" "}
            سپس با مالی کمیسیون و سهم‌ها را تصویب کنید.
          </li>
          <li>
            <Link to="/finance">با مالی دریافت جزئی ثبت کنید.</Link> مانده‌ها پس
            از تخصیص وجه تغییر می‌کنند و با رفرش حفظ می‌شوند.
          </li>
        </ol>
        <div className="toolbar wrap">
          {(db.registrationRequests || []).slice(0, 1).map((r) => (
            <Link className="button" key={r.id} to={`/requests/${r.id}`}>
              شروع از پرونده {r.code}
            </Link>
          ))}
          <Link className="button secondary" to="/contracts">
            نمونه قرارداد و وصول جزئی
          </Link>
        </div>
      </section>
      <section className="panel">
        <h2>مسئولیت مدل‌ها و فیلدهای اصلی</h2>
        <div className="grid">
          {models.map(([name, desc, fields]) => (
            <article className="card" key={name}>
              <h3 dir="ltr">{name}</h3>
              <p>{desc}</p>
              <small dir="ltr">{fields}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <h2>قواعد عملیات و محدودیت نمونه</h2>
        <ul>
          <li>
            انتقال پرونده: یک موضوع اصلی، دلیل الزامی، سابقه غیرقابل ویرایش و
            ارجاع معتبر مقصد. درخواست تبدیل‌شده، ملک و فایل‌های آن حوزه مشترک
            دارند و هماهنگ منتقل می‌شوند.
          </li>
          <li>
            تغییر مشاور و تغییر عضویت تیم دو عملیات جدا هستند. تغییر تیم کارمند
            پرونده‌ها را خودکار منتقل نمی‌کند.
          </li>
          <li>
            نسخه منتشرشده نوع معامله و تصویر شرایط قراردادهای قبلی حفظ می‌شوند.
            پیشنهاد اصلاح‌شده رکورد جدید می‌سازد.
          </li>
          <li>
            پذیرش پیشنهاد به‌تنهایی فروش قطعی نیست. قرارداد قطعی از ویرایش عادی
            محافظت می‌شود و مسیر اصلاحیه جداست.
          </li>
          <li>
            وجوه تأییدشده حذف نمی‌شوند؛ برگشت مرتبط ثبت می‌شود. تخصیص وجه و
            سهم‌ها به سقف مبلغ محدود هستند.
          </li>
          <li>
            ارتباط subject_type و subject_id در سرویس‌های نمونه اعتبارسنجی
            می‌شود؛ این قرارداد نمایشی طراحی نهایی دیتابیس نیست.
          </li>
          <li>
            هر عملیات وابسته به‌صورت یک تغییر مشترک ذخیره می‌شود؛ operation_id
            اعلان و سابقه‌های همان عملیات را مرتبط می‌کند.
          </li>
          <li>
            دسترسی‌ها، ورود و ذخیره محلی نمایشی و سمت مرورگر هستند؛ امنیت و
            احراز هویت بک‌اند واقعی محسوب نمی‌شوند. پرداخت، پیامک و آپلود بیرونی
            وجود ندارد.
          </li>
        </ul>
      </section>
    </>
  );
}
