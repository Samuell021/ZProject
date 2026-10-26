import { backendWorkstreams, handoffOverview, deliverySteps, pageHandoffs, workflowChapters } from "./handoff";
import BackendComparison, { BackendModelNote } from "./BackendComparison";
import { exportDeveloperReference } from "./reference";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Modal, num, label } from "../../components/ui";
import { modelCatalog, modelOrder } from "./models";
import { apiCatalog } from "./apis";
import { guideSections } from "./sections";
import { databaseRules, apiRules, pipelineRules } from "./shared";
import { pipelineDefinitions } from "../../services/pipelines";
const tabs = [
  ["handoff", "راهنمای تحویل این صفحه"],
  ["overview", "راهنمای کلی توسعه"],
  ["flow", "جریان کامل برنامه"],
  ["models", "مدل‌ها و جدول‌ها"],
  ["backend", "تغییرات ZaminexB"],
  ["apis", "APIها و عملیات"],
  ["pipeline", "کاریز و گردش کار"],
  ["database", "قواعد مشترک بک‌اند"],
];
export default function DeveloperGuide({ page, recordId }) {
  const [q, setQ] = useSearchParams();
  const [search, setSearch] = useState("");
  const section = guideSections[page] || guideSections.guide;
  const tab = tabs.some(([id]) => id === q.get("helpTab"))
    ? q.get("helpTab")
    : "handoff";
  const all = q.get("helpAll") === "1";
  const update = (key, value) => {
    const next = new URLSearchParams(q);
    value ? next.set(key, value) : next.delete(key);
    setQ(next);
  };
  const models = (all ? modelOrder : section.models)
    .map((name) => modelCatalog[name])
    .filter(Boolean)
    .filter(
      (m) =>
        !search ||
        [
          m.name,
          m.table,
          m.purpose,
          ...m.fields.map((f) => f.name + " " + f.description),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
    );
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([exportDeveloperReference()], {
        type: "text/markdown;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "CRM-Farda-Backend-Reference.md";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const relevantPipelines = section.pipelines.length
    ? section.pipelines
    : Object.keys(pipelineDefinitions);
  return (
    <Modal
      title={`راهنمای برنامه‌نویس · ${section.title}`}
      parameter="help"
      className="developer-guide"
    >
      <div className="developer-intro">
        <span className="badge status-PENDING">
          طرح پیشنهادی بک‌اند · نمونه محلی
        </span>
        <p>{section.purpose}</p>
        <small>
          مدل‌ها و عملیات این راهنما برای پیاده‌سازی سرور هستند؛ APIهای پیشنهادی
          هنوز سرویس واقعی نیستند.
          {recordId
            ? " این راهنما برای نوع پروندهٔ همین صفحه باز شده است و اطلاعات خصوصی رکورد را صادر نمی‌کند."
            : ""}
        </small>
        <button className="secondary" onClick={download}>
          دریافت بسته کامل تحویل توسعه
        </button>
      </div>
      <div
        className="developer-tabs"
        role="tablist"
        aria-label="بخش‌های راهنمای برنامه‌نویس"
      >
        {tabs.map(([id, title]) => (
          <button
            role="tab"
            aria-selected={tab === id}
            tabIndex={tab === id ? 0 : -1}
            onKeyDown={(event) => {
              const current = tabs.findIndex(([key]) => key === id);
              const index = { ArrowLeft: (current + 1) % tabs.length, ArrowRight: (current + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
              if (index === undefined) return;
              event.preventDefault();
              update("helpTab", tabs[index][0]);
              event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[index].focus();
            }}
            aria-controls={`developer-${id}`}
            id={`developer-tab-${id}`}
            className={tab === id ? "" : "secondary"}
            key={id}
            onClick={() => update("helpTab", id)}
          >
            {title}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`developer-${tab}`}
        aria-labelledby={`developer-tab-${tab}`}
      >
        {tab === "handoff" && (() => {
          const [owner, flow, acceptance, source] = pageHandoffs[page] || pageHandoffs.guide;
          return <>
            <h3>قرارداد تحویل {section.title}</h3>
            <p><b>مسئول و دسترسی: </b>{owner}</p>
            <p><b>جریان صفحه: </b>{flow}</p>
            <p><b>معیار پذیرش: </b>{acceptance}</p>
            <p><b>منبع رفتار در Sample: </b><code dir="ltr">{source}</code></p>
            <h4>نکات پیاده‌سازی این صفحه</h4>
            <ul>{section.checks.map((x,i)=><li key={i}>{x}</li>)}</ul>
            <h4>تا کجا در ZaminexB وجود دارد و چه باید تغییر کند؟</h4>
            <p>مبنای موجودی مدل‌ها: ۱۸ اکتبر ۲۰۲۶؛ بررسی زنده امروز نیست. نیاز مقصد: Sample در ۱۹ اکتبر. جزئیات فیلد و انتقال داده در تب تغییرات ZaminexB است.</p>
            <BackendComparison names={section.models}/>
          </>;
        })()}
        {tab === "overview" && <>
          <h3>راهنمای کلی تحویل تیم توسعه</h3>
          {handoffOverview.map((x,i)=><p key={i}>{x}</p>)}
          <h4>پیشرفت مبنای ZaminexB و کار باقی‌مانده</h4>
          {backendWorkstreams.map(([title,current,next])=><section key={title}><h4>{title}</h4><p><b>موجود در مبنا: </b>{current}</p><p><b>کار لازم: </b>{next}</p></section>)}
          <h4>ترتیب اجرا</h4><ol>{deliverySteps.map((x,i)=><li key={i}>{x}</li>)}</ol>
        </>}
        {tab === "flow" && <>
          <h3>جریان کامل برنامه</h3>
          {workflowChapters.map(([title,flow,steps])=><section className="developer-flow" key={title}>
            <h4>{title}</h4><p>{flow}</p><ol>{steps.map((x,i)=><li key={i}>{x}</li>)}</ol>
          </section>)}
        </>}
        {tab === "models" && (
          <>
            <div className="section-head">
              <div>
                <h3>مدل‌ها و طراحی جدول‌های {section.title}</h3>
                <small>
                  یک پایگاه دادهٔ مشترک؛ مدل‌های این بخش با بخش‌های دیگر رابطه
                  دارند.
                </small>
              </div>
              <label className="developer-check">
                <input
                  type="checkbox"
                  checked={all}
                  onChange={(e) =>
                    update("helpAll", e.target.checked ? "1" : "")
                  }
                />
                همه مدل‌ها ({num(modelOrder.length)})
              </label>
            </div>
            <input
              className="search"
              aria-label="جست‌وجوی مدل یا فیلد"
              placeholder="جست‌وجوی مدل، جدول یا فیلد…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <p className="muted">
              {num(models.length)} مدل · جزئیات هر مدل را باز کنید.
            </p>
            {!models.length && <p className="empty">مدلی با این عبارت پیدا نشد؛ جست‌وجو را تغییر دهید یا «همه مدل‌ها» را فعال کنید.</p>}
            {models.map((m) => (
              <details className="developer-model" key={m.name}>
                <summary>
                  <strong dir="ltr">{m.name}</strong>
                  <code dir="ltr">{m.table}</code>
                  <span>{num(m.fields.length)} فیلد</span>
                </summary>
                <p>{m.purpose}</p>
                <BackendModelNote name={m.name} />
                {m.collection && (
                  <small>
                    نام منبع در نمونه: <code>{m.collection}</code>
                  </small>
                )}
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>فیلد</th>
                        <th>نوع پیشنهادی</th>
                        <th>الزام پایه</th>
                        <th>رابطه</th>
                        <th>مسئولیت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {m.fields.map((f) => (
                        <tr key={f.name}>
                          <td>
                            <code dir="ltr">{f.name}</code>
                          </td>
                          <td>{f.type}</td>
                          <td>{f.required ? "الزامی" : "اختیاری / شرطی"}</td>
                          <td>
                            <code dir="ltr">{f.relation || "—"}</code>
                          </td>
                          <td>{f.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h4>محدودیت‌های دیتابیس و سرویس</h4>
                <ul>
                  {m.constraints.map((text, i) => (
                    <li key={i}>{text}</li>
                  ))}
                </ul>
                <h4>ایندکس‌های پیشنهادی</h4>
                <ul>
                  {m.indexes.map((text, i) => (
                    <li key={i}>
                      <code dir="ltr">{text}</code>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </>
        )}
        {tab === "backend" && <BackendComparison names={section.models} />}
        {tab === "apis" && (
          <>
            <h3>APIهای پیشنهادی این بخش</h3>
            <p className="muted">
              مثال‌های request الگوی ورودی‌اند؛ پاسخ‌ها envelope پیشنهادی هستند
              و باید با قرارداد نهایی سرور تکمیل شوند.
            </p>
            {section.apis.map((key) => {
              const api = apiCatalog[key];
              return (
                api && (
                  <details className="developer-api" key={key}>
                    <summary>
                      <code dir="ltr">
                        {api.method} {api.path}
                      </code>
                      <span>{api.summary}</span>
                    </summary>
                    <p>
                      <b>مجوز:</b> {api.permission}
                    </p>
                    <p>
                      <b>مدل‌های مرتبط:</b>{" "}
                      <span dir="ltr">{api.models.join(" · ")}</span>
                    </p>
                    {api.mock && (
                      <p>
                        <b>رفتار متناظر در نمونه:</b> <code>{api.mock}</code>
                      </p>
                    )}
                    <p>
                      <b>ثبت اتمیک:</b>{" "}
                      {api.transaction
                        ? "بله؛ تغییرات وابسته و سوابق در یک تراکنش"
                        : "خواندن؛ بدون تغییر داده"}
                    </p>
                    {api.filters?.length > 0 && (
                      <p>
                        فیلتر/گسترش پاسخ:{" "}
                        <code dir="ltr">{api.filters.join(", ")}</code>
                      </p>
                    )}
                    <h4>اثر و قواعد عملیات</h4>
                    <ul>
                      {api.effects.map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                    <h4>نمونه ورودی</h4>
                    {api.request ? (
                      <pre>{JSON.stringify(api.request, null, 2)}</pre>
                    ) : (
                      <p>بدون بدنه؛ شناسه در مسیر و فیلترها در query.</p>
                    )}
                    <h4>الگوی پاسخ</h4>
                    <pre>{JSON.stringify(api.response, null, 2)}</pre>
                    <h4>خطاهای قابل انتظار</h4>
                    <ul>
                      {api.errors.map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </details>
                )
              );
            })}
            <h3>قرارداد عمومی API</h3>
            <ul>
              {apiRules.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </>
        )}
        {tab === "pipeline" && (
          <>
            <h3>کاریز، کارت‌ها و انتقال مرحله</h3>
            <ul>
              {pipelineRules.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
            {relevantPipelines.map((key) => {
              const p = pipelineDefinitions[key];
              return (
                <section className="developer-flow" key={key}>
                  <div className="section-head">
                    <h3>{p.title}</h3>
                    <Link
                      className="button secondary"
                      to={`/pipelines?pipeline=${key}`}
                    >
                      مشاهده کاریز {p.title} ←
                    </Link>
                  </div>
                  <p>
                    منبع مرحله:{" "}
                    <code dir="ltr">
                      {p.model}.{p.field}
                    </code>
                  </p>
                  <div className="developer-stages">
                    {p.stages.map((stage) => (
                      <span className="badge" key={stage}>
                        {label(stage)} <code>{stage}</code>
                      </span>
                    ))}
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>از مرحله</th>
                          <th>به مرحله</th>
                          <th>فرمان</th>
                          <th>فرم / الزام</th>
                          <th>مجوز</th>
                          <th>تغییرات وابسته</th>
                        </tr>
                      </thead>
                      <tbody>
                        {p.transitions.map((t, i) => (
                          <tr key={i}>
                            <td>{t.from.map(label).join(" / ")}</td>
                            <td>{label(t.to)}</td>
                            <td>
                              <code>{t.command}</code>
                            </td>
                            <td>{t.required}</td>
                            <td>{t.permission}</td>
                            <td>{t.effects}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="muted">
                    حرکت کارت، فرم اقدام لازم را باز می‌کند؛ ثبت موفق همان
                    فرمان، مرحلهٔ فهرست و کاریز را با هم تغییر می‌دهد.
                  </p>
                </section>
              );
            })}
          </>
        )}
        {tab === "database" && (
          <>
            <h3>کارهای لازم بک‌اند برای همین بخش</h3>
            <ol>
              {section.checks.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ol>
            <h3>اصول طراحی پایگاه داده</h3>
            <ul>
              {databaseRules.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
            <h3>پیشنهاد ترتیب پیاده‌سازی</h3>
            <ol>
              <li>
                جدول‌های اصلی و واسط همین بخش، FKها، enumها، CHECKها و ایندکس‌ها
                را migration کنید.
              </li>
              <li>
                مجوز گروه و محدوده رنج را در query و command سمت سرور اعمال
                کنید.
              </li>
              <li>
                endpointهای خواندن و فرمان‌های دامنه را طبق تب API با ورودی، خطا
                و پاسخ مشخص بسازید.
              </li>
              <li>
                تغییرات وابسته، history و notification را اتمیک ثبت و
                تکرار/تعارض نسخه را آزمون کنید.
              </li>
              <li>
                همین صفحه، حالت خطا و لینک مستقیم، فهرست و کاریز را به API وصل و
                سناریوی مرتبط را تکرار کنید.
              </li>
            </ol>
          </>
        )}
      </div>
    </Modal>
  );
}
