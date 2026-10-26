import {commercialCaseRoute,retiredCommercialPages} from './services/commercial-case-route';
import InquiryFlowWizard from './features/InquiryFlowWizard';
import PropertyRequestsList from "./features/PropertyRequestsList";
import PropertyReviewSubmission from "./components/PropertyReviewSubmission";
import {promptPropertyReview} from "./services/alerts";
import ErrorAlerts from "./components/ErrorAlerts";
import "sweetalert2/dist/sweetalert2.min.css";
import PropertyJourney from "./components/PropertyJourney";
import LastVisitedRecord from "./components/LastVisitedRecord";
import PropertyFlowWizard from "./features/PropertyFlowWizard";
import ContractTermsEditor,{ContractTermsSummary} from "./components/ContractTermsEditor";
import {activitySubjects,activityAssignees,activityInquiry} from "./services/activities";
import {introductionConsultants} from "./services/collaboration";
import ManualListingIntroduction from "./components/ManualListingIntroduction";
import PropertyWorkspace from "./features/PropertyWorkspace";
import {propertyReviewState} from "./services/property-listings";
import CaseActivities from "./components/CaseActivities";
import {canUseAction,contextualFormActions} from "./services/action-availability";
import {pipelineStage} from "./services/pipelines";
import SelectBox from "./components/SelectBox";
import "./intake.css";
import SidebarNavigation from "./components/SidebarNavigation";
import IntakeWorkspace, {CaseIntakeActions} from "./features/IntakeWorkspace";
import {canOpenPage, canManageCase, canReassign, assignmentState, pendingExtension, possibleDuplicateCases, canRequestExtension} from "./services/intake";
import AppearanceSettings from "./components/AppearanceSettings";
import PipelineWorkspace from "./features/PipelineWorkspace";
import React, { useEffect, useState } from "react";
import {
  NavLink,
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  Users,
  ClipboardList,
  House,
  Search,
  Handshake,
  FileSignature,
  Wallet,
  BookOpen,
  Bell,
  Settings,
  CalendarDays,
  ChartNoAxesCombined,
  Menu,
  RotateCcw,
  Plus,
  ArrowUpLeft,
  CheckCircle2,
} from "lucide-react";
import { useCRM } from "./store/useCRM";
import {
  canAccess,
  canViewPublicListing,
  matchListings,
} from "./services/operations";
import {
  Badge,
  Field,
  Form,
  Modal,
  Timeline,
  Empty,
  num,
  money,
  date,
  remaining,
  label,
  person,
  staff,
  formatTerms,
} from "./components/ui";
import SecondaryPages from "./features/SecondaryPages";
import Board from "./components/Board";
const DeveloperGuide = React.lazy(
  () => import("./features/developerGuide/DeveloperGuide"),
);
const menu = [
  ["dashboard", "نمای کلی", LayoutDashboard],
  ["tasks", "کارهای من", ClipboardList],
  ["lead-submit", "ثبت سرنخ", Plus],
  ["inquiry-register", "ثبت درخواست متقاضی", Users],
  ["property-register", "ثبت ملک", House],
  ["inbox", "کارتابل پذیرش", ClipboardList],
  ["pipelines", "کاریز عملیات", LayoutDashboard],
  ["teams", "رنج‌ها و تیم‌ها", Users],
  ["staff", "کارکنان", Users],
  ["groups", "گروه‌ها و سطح دسترسی", Users],
  ["contacts", "اشخاص", Users],
  ["requests", "پرونده‌های ثبت ملک", ClipboardList],
  ["reviews", "صف بررسی", CheckCircle2],
  ["properties", "املاک من", House],
  ["listings", "فایل‌های عرضه من", Building2],
  ["explore", "اکسپلور فایل‌های عرضه", Search],
  ["inquiries", "درخواست متقاضیان", Search],
  ["introductions", "معرفی‌ها", ArrowUpLeft],
  ["viewings", "بازدیدها", CalendarDays],
  ["followups", "پیگیری‌ها", CalendarDays],
  ["deals", "مذاکرات", Handshake],
  ["contracts", "قراردادها", FileSignature],
  ["finance", "کمیسیون و وجوه", Wallet],
  ["reports", "گزارش‌ها", ChartNoAxesCombined],
  ["notifications", "اعلان‌ها و سوابق", Bell],
  ["settings", "تنظیمات معامله", Settings],
  ["guide", "راهنمای ساختار", BookOpen],
];
const mapping = {
  contacts: "contacts",
  requests: "registrationRequests",
  reviews: "properties",
  properties: "properties",
  listings: "listings",
  inquiries: "inquiries",
  introductions: "introductions",
  viewings: "viewings",
  deals: "deals",
  contracts: "contracts",
};
export default function App() {
  const s = useCRM();
  const { db, actorId, run, busy } = s;
  const location = useLocation(),
    navigate = useNavigate();
  const [q, setQ] = useSearchParams();
  const [sidebar, setSidebar] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 60000);
    return () => clearInterval(t);
  }, []);
  const [page = "dashboard", id] = location.pathname.split("/").filter(Boolean);
  useEffect(()=>{
    if(retiredCommercialPages.includes(page))navigate(commercialCaseRoute(db,actorId,page,id),{replace:true});
    if(page==="leads")navigate(q.get("action")==="createLead"?`/lead-submit?${q}`:`/inbox?${q}`,{replace:true});
  },[page,id,actorId,db,location.search,navigate]);
  const pageAllowed = canOpenPage(db, actorId, page);
  const title = menu.find((x) => x[0] === page)?.[1] || "صفحه پیدا نشد";
  const actor = db.users.find((x) => x.id === actorId);
  useEffect(() => {
    document.title = `${title} | گروه سرمایه گذاری کلان فردا · Crm`;
    setSidebar(false);
  }, [location.pathname, title]);
  const visible = (collection) =>
    (db[collection] || []).filter(
      (x) =>
        canAccess(db, actorId, collection, x),
    );
  const action = (name) => {
    const n = new URLSearchParams(q);
    n.set("action", name);
    setQ(n);
  };
  const perform = async (a, p) => {
    const startPath = window.location.pathname;
    const result = await run(a, p);
    if (result && q.has("action") && window.location.pathname === startPath) {
      const n = new URLSearchParams(q);
      n.delete("action");
      setQ(n);
    }
    return result;
  };
  const scopeOptions = db.scopes
    .filter((x) => x.is_active && canAccess(db, actorId, "scopes", x))
    .map((x) => ({ id: x.id, name: x.name }));
  const contactOptions = visible("contacts").map((x) => ({
    id: x.id,
    name: person(db, x.id),
  }));
  const record = mapping[page] && db[mapping[page]]?.find((x) => x.id === id);
  const allowed =
    record &&
    (canAccess(db, actorId, mapping[page], record) ||
      (page === "listings" && canViewPublicListing(db, actorId, record)));
  const list = mapping[page]
    ? visible(mapping[page]).filter(
        (x) => page !== "reviews" || x.review_status === "PENDING",
      )
    : [];
  const searchable = list.filter(
    (x) =>
      (page!=="requests"||!q.get("status")||x.status===q.get("status")) &&
      (!q.get("assignee") ||
        x.assigned_to_id === q.get("assignee") ||
        x.consultant_id === q.get("assignee")) &&
      (!q.get("scope") ||
        (x.management_scope_id ||
          db.properties.find((p) => p.id === x.property_id)
            ?.management_scope_id) === q.get("scope")) &&
      (!q.get("search") ||
        JSON.stringify(x).includes(q.get("search")) ||
        person(db, x.contact_id).includes(q.get("search"))),
  );
  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebar ? "is-open" : ""}`}>
        <Link className="brand" to="/">
          <span className="brand-icon">
            <Building2 size={26} />
          </span>
          <span>
            گروه سرمایه گذاری کلان فردا<small lang="en">Crm</small>
          </span>
        </Link>
        <div className="workspace-label">
          فضای کار دفتر املاک <span>نمونه</span>
        </div>
        <SidebarNavigation key={actorId} menu={menu} db={db} actorId={actorId} page={page} reviewCount={visible("properties").filter(x=>propertyReviewState(db,x)==="PENDING").length}/>
        <div className="sidebar-foot">
          <span className="live-dot" /> داده‌های نمایشی · ذخیره محلی
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setSidebar(!sidebar)}
            aria-label="منو"
          >
            <Menu />
          </button>
          <div className="breadcrumb">
            کلان فردا <span>/</span> <b>{title}</b>
          </div>
          <div className="topbar-actions">
            <AppearanceSettings />
            <span className="today">
              {new Date().toLocaleDateString("fa-IR", { dateStyle: "long" })}
            </span>
            <Link
              className="icon-button"
              to="/notifications"
              aria-label="اعلان‌ها"
            >
              <Bell size={20} />
              <i />
            </Link>
            <SelectBox
              disabled={busy}
              searchable
              aria-label="ورود نمایشی با کاربر"
              value={actorId}
              onChange={(e) => s.setActor(e.target.value)}
            >
              {db.users
                .filter((x) => x.is_active)
                .map((x) => (
                  <option key={x.id} value={x.id}>
                    {staff(db, x.id)} ·{" "}
                    {x.group_ids
                      .map((g) => db.groups.find((z) => z.id === g)?.name || g)
                      .join("، ")}
                  </option>
                ))}
            </SelectBox>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <p className="eyebrow">گروه سرمایه گذاری کلان فردا · Crm</p>
              <h1>{title}</h1>
              <p className="muted">
                {page === "dashboard"
                  ? `خوش آمدید، ${staff(db, actorId)}؛ وضعیت امروز دفتر را یک‌جا ببینید.`
                  : "اطلاعات مرتبط، مسئول مشخص و سابقه قابل پیگیری"}
              </p>
            </div>
            <div className="toolbar">
              {canOpenPage(db,actorId,"guide") && <><button
                className="secondary"
                onClick={() => {
                  const next = new URLSearchParams(q);
                  next.set("help", "developer");
                  setQ(next);
                }}
              >
                راهنمای برنامه‌نویس
              </button>
              <Link className="button secondary" to="/guide?scenario=1">
                <BookOpen size={16} /> دنبال‌کردن سناریوی نمونه
              </Link></>}
              {pageAllowed && (page === "contacts" || canOpenPage(db,actorId,"lead-submit")) && ["contacts", "requests", "inquiries"].includes(page) && !id && (
                <button onClick={() => page === "contacts" ? action("create") : page === "requests" ? navigate("/property-register") : navigate("/inquiry-register")}>
                  <Plus size={17} /> ثبت{" "}
                  {page === "contacts"
                    ? "شخص"
                    : page === "requests"
                      ? "ملک"
                      : "درخواست متقاضی"}
                </button>
              )}
            </div>
          </div>
          {s.storageWarning && <div role="alert" className="alert error">{s.storageWarning}</div>}
          {s.storageError && (
            <div className="alert error">{s.storageError}</div>
          )}
          <ErrorAlerts/>
          {s.message && (
            <div role="status" className="alert success">
              {s.message}
            </div>
          )}
          {pageAllowed&&<LastVisitedRecord key={actorId} db={db} actorId={actorId}/>}
          {!pageAllowed ? <div role="alert" className="alert error">دسترسی به این بخش برای گروه کاربری شما مجاز نیست.</div> : page === "inquiry-register" ? <InquiryFlowWizard key={actorId} db={db} actorId={actorId} run={run} busy={busy} renderAction={(name,request,execute)=><Actions key={`${request.id}:${name}`} actionName={name} page="inquiries" record={request} db={db} actorId={actorId} perform={execute} busy={busy} scopeOptions={scopeOptions} contactOptions={contactOptions} stayOnPage/>}/> : page === "property-register" ? <PropertyFlowWizard key={actorId} db={db} actorId={actorId} run={run} busy={busy} renderAction={(name,request,execute)=><Actions key={`${request.id}:${name}`} actionName={name} page="requests" record={request} db={db} actorId={actorId} perform={execute} busy={busy} scopeOptions={scopeOptions} contactOptions={contactOptions} stayOnPage/>}/> : ["leads","lead-submit","inbox"].includes(page) ? <IntakeWorkspace page={page} db={db} actorId={actorId} run={perform} busy={busy}/> : page === "dashboard" ? (
            <>
              <div className="stats">
                {[
                  [
                    "فایل فعال",
                    visible("listings").filter(
                      (x) =>
                        x.status === "ACTIVE" && x.review_status === "APPROVED",
                    ).length,
                    "آماده معرفی به مشتری",
                    "listings",
                  ],
                  [
                    "درخواست در جریان",
                    visible("registrationRequests").filter(
                      (x) => !["COMPLETED", "CANCELLED"].includes(x.status),
                    ).length,
                    "از ثبت اولیه تا تأیید",
                    "requests",
                  ],
                  [
                    "مذاکره باز",
                    visible("deals").filter(
                      (x) => !["WON", "LOST", "FINALIZED"].includes(x.stage),
                    ).length,
                    "فرصت‌های در حال پیگیری",
                    "deals",
                  ],
                  [
                    "کار عقب‌افتاده",
                    visible("tasks").filter(
                      (x) =>
                        new Date(x.due_at) < new Date() &&
                        !["DONE", "COMPLETED", "CANCELLED"].includes(x.status),
                    ).length,
                    "نیازمند اقدام شما",
                    "tasks",
                  ],
                ].filter(([, , ,route])=>canOpenPage(db,actorId,route)).map(([a, b, c], i) => (
                  <div className={`stat stat-${i}`} key={a}>
                    <span>{a}</span>
                    <strong>{num(b)}</strong>
                    <small>{c}</small>
                  </div>
                ))}
              </div>
              <div className="dashboard-grid">
                <section className="panel">
                  <div className="section-head">
                    <div>
                      <h2>جریان کار دفتر</h2>
                      <p className="muted">هر مرحله، ادامهٔ یک پروندهٔ مشترک</p>
                    </div>
                    {canOpenPage(db,actorId,"requests") && <Link to="/requests">مشاهده درخواست‌ها ←</Link>}
                  </div>
                  <div className="flow">
                    {[
                      ["درخواست اولیه", "requests", "۱۵"],
                      ["کارشناسی و تکمیل", "requests", "۱۲"],
                      ["فایل فعال", "listings", "۹"],
                      ["مشتری و بازدید", "inquiries", "۱۰"],
                      ["مذاکره و قرارداد", "deals", "۶"],
                    ].filter(([,url])=>canOpenPage(db,actorId,url)).map(([x, url, n], i) => (
                      <Link key={url + i} to={`/${url}`}>
                        <span>{num(i + 1)}</span>
                        <b>{x}</b>
                        <small>ورود به مرحله ←</small>
                      </Link>
                    ))}
                  </div>
                  <h3>پرونده‌های نیازمند توجه</h3>
                  <div className="compact-list">
                    {visible("registrationRequests")
                      .filter((x) =>
                        ["NEW", "CHANGES_REQUIRED", "PENDING_REVIEW"].includes(
                          x.status,
                        ),
                      )
                      .slice(0, 5)
                      .map((x) => (
                        <Link key={x.id} to={`/requests/${x.id}`}>
                          <span className="file-avatar">
                            <House size={20} />
                          </span>
                          <div>
                            <b>{x.description || x.code}</b>
                            <small>
                              {staff(db, x.assigned_to_id)} ·{" "}
                              {remaining(x.due_at)}
                            </small>
                          </div>
                          <Badge value={x.status} />
                          <ArrowUpLeft size={17} />
                        </Link>
                      ))}
                  </div>
                </section>
                <section className="panel dark-panel">
                  <p className="eyebrow">از سرنخ تا قرارداد</p>
                  <h2>تصویر روشن از کار روزانه</h2>
                  <p>
                    ابتدا مأموریت‌های امروز را ببینید، پرونده را تکمیل کنید و
                    قدم بعدی را برای مشتری مشخص کنید.
                  </p>
                  <Link className="button" to="/tasks">
                    مشاهده کارهای من <ArrowUpLeft size={17} />
                  </Link>
                  <div className="decor-house">
                    <Building2 size={140} strokeWidth={1} />
                  </div>
                  <small>تمام عملیات این محیط نمایشی است.</small>
                </section>
              </div>
              <section className="panel">
                <div className="section-head">
                  <h2>آخرین فعالیت‌های قابل مشاهده</h2>
                  <Link to="/notifications">مشاهده سوابق ←</Link>
                </div>
                {visible("activityLogs")
                  .slice(-5)
                  .reverse()
                  .map((x) => (
                    <div className="timeline-item" key={x.id}>
                      <b>{x.description}</b>
                      <small>
                        {staff(db, x.user_id)} · {date(x.created_at)}
                      </small>
                    </div>
                  ))}
              </section>
            </>
          ) : ["properties","listings","explore","reviews"].includes(page) ? (
            <PropertyWorkspace key={`${page}:${id||""}:${actorId}`} page={page} id={id} db={db} actorId={actorId} run={run} busy={busy}/>
          ) : page === "pipelines" ? (
            <PipelineWorkspace db={db} actorId={actorId} />
          ) : page === "viewings" && !id ? (
            <SecondaryPages page={page} db={db} actor={actor} run={perform}/>
          ) : mapping[page] ? (
            id ? (
              record ? (
                allowed ? (
                  page==="inquiries"&&q.get("view")!=="history" ? <InquiryFlowWizard key={`${actorId}:${id}`} requestId={id} db={db} actorId={actorId} run={run} busy={busy} renderAction={(name,request,execute)=><Actions key={`${request.id}:${name}`} actionName={name} page="inquiries" record={request} db={db} actorId={actorId} perform={execute} busy={busy} scopeOptions={scopeOptions} contactOptions={contactOptions} stayOnPage/>}/> : page==="requests"&&q.get("view")!=="history" ? <PropertyFlowWizard key={`${actorId}:${id}`} requestId={id} db={db} actorId={actorId} run={run} busy={busy} renderAction={(name,request,execute)=><Actions key={`${request.id}:${name}`} actionName={name} page="requests" record={request} db={db} actorId={actorId} perform={execute} busy={busy} scopeOptions={scopeOptions} contactOptions={contactOptions} stayOnPage/>}/> : <Detail
                    page={page}
                    record={record}
                    db={db}
                    actorId={actorId}
                    run={perform}
                    action={action}
                    busy={busy}
                    visible={visible}
                  />
                ) : (
                  <div className="alert error">
                    شما به این پرونده دسترسی ندارید.
                  </div>
                )
              ) : (
                <Empty />
              )
            ) : (
              <>
                <section className="panel">
                  <div className="section-head">
                    <div className="toolbar">
                      <input
                        className="search"
                        placeholder="جست‌وجو در کد، نام و توضیحات…"
                        value={q.get("search") || ""}
                        onChange={(e) => {
                          const n = new URLSearchParams(q);
                          n.set("search", e.target.value);
                          n.delete("p");
                          setQ(n);
                        }}
                      />
                      {[
                        "requests",
                        "reviews",
                        "properties",
                        "listings",
                        "inquiries",
                        "deals",
                      ].includes(page) && (
                        <SelectBox
                          aria-label="فیلتر رنج"
                          value={q.get("scope") || ""}
                          onChange={(e) => {
                            const next = new URLSearchParams(q);
                            e.target.value
                              ? next.set("scope", e.target.value)
                              : next.delete("scope");
                            next.delete("p");
                            setQ(next);
                          }}
                        >
                          <option value="">همه رنج‌های مجاز</option>
                          {scopeOptions.map((scope) => (
                            <option key={scope.id} value={scope.id}>
                              {scope.name}
                            </option>
                          ))}
                        </SelectBox>
                      )}
                      {["requests", "inquiries", "deals"].includes(page) && (
                        <SelectBox
                          aria-label="فیلتر مسئول"
                          value={q.get("assignee") || ""}
                          onChange={(e) => {
                            const next = new URLSearchParams(q);
                            e.target.value
                              ? next.set("assignee", e.target.value)
                              : next.delete("assignee");
                            next.delete("p");
                            setQ(next);
                          }}
                        >
                          <option value="">همه مسئول‌ها</option>
                          {db.staffProfiles.filter(p=>canAccess(db,actorId,"staffProfiles",p)).map((profile) => (
                            <option key={profile.id} value={profile.user_id}>
                              {profile.full_name}
                            </option>
                          ))}
                        </SelectBox>
                      )}
                      {page==='requests'&&q.get('view')!=='board'&&<SelectBox aria-label="وضعیت پرونده" value={q.get('status')||''} onChange={e=>{const n=new URLSearchParams(q);e.target.value?n.set('status',e.target.value):n.delete('status');n.delete('p');setQ(n);}}>
                        <option value="">همه وضعیت‌ها</option>
                        {['IN_PROGRESS','PENDING_REVIEW','CHANGES_REQUIRED','COMPLETED','CANCELLED','DUPLICATE','CLOSED'].map(status=><option key={status} value={status}>{label(status)}</option>)}
                      </SelectBox>}
                      {["requests", "inquiries", "deals"].includes(page) && (
                        <div className="segmented">
                          {[
                            ["list", "فهرست"],
                            ["board", "کاریز"],
                          ].map(([v, t]) => (
                            <button
                              className={
                                (q.get("view") || "list") === v
                                  ? ""
                                  : "secondary"
                              }
                              key={v}
                              onClick={() => {
                                const n = new URLSearchParams(q);
                                n.set("view", v);
                                setQ(n);
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="muted">{num(q.get("view")==="board"?searchable.filter(row=>pipelineStage(db,actorId,page,row)).length:searchable.length)} مورد</span>
                  </div>
                  {q.get("view") === "board" ? (
                    <Board page={page} rows={searchable} db={db} actorId={actorId} />
                  ) : (
                    page==="inquiries" ? <PropertyRequestsList pageType="inquiries" rows={searchable} db={db} actorId={actorId} run={run} busy={busy} renderAction={(name,request,execute)=><Actions key={`${request.id}:${name}`} actionName={name} page="inquiries" record={request} db={db} actorId={actorId} perform={execute} busy={busy} scopeOptions={scopeOptions} contactOptions={contactOptions} stayOnPage/>}/> : page==="requests" ? <PropertyRequestsList rows={searchable} db={db} actorId={actorId} run={run} busy={busy} renderAction={(name,request,execute)=><Actions key={`${request.id}:${name}`} actionName={name} page="requests" record={request} db={db} actorId={actorId} perform={execute} busy={busy} scopeOptions={scopeOptions} contactOptions={contactOptions} stayOnPage/>}/> : <RecordList page={page} rows={searchable} db={db} />
                  )}
                </section>
              </>
            )
          ) : (
            <SecondaryPages page={page} db={db} actor={actor} run={perform} />
          )}
          {pageAllowed && !["properties","listings","explore","reviews"].includes(page) && q.get("action") &&
            (q.get("action") === "reset" ||
              (mapping[page] &&
                (q.get("action") === "create"
                  ? !id && (page === "contacts" || canOpenPage(db,actorId,"leads")) && ["contacts", "requests", "inquiries"].includes(page)
                  : Boolean(
                      record && canAccess(db, actorId, mapping[page], record) &&
                      (!["assign", "assignee", "transfer", "reviewExtension"].includes(q.get("action")) ||
                        (canManageCase(db, actorId, {...record, management_scope_id: record.management_scope_id || db.properties.find(p=>p.id===record.property_id)?.management_scope_id}) &&
                          (["transfer", "reviewExtension"].includes(q.get("action")) || canReassign(db,mapping[page],record)))) &&
                      (!["workspace", "rejectAssignment", "postponeAssignment"].includes(q.get("action")) || record.assigned_to_id === actorId) &&
                      (q.get("action")!=="reopenAppraisal" || (page==="requests"&&record.status==="COMPLETED"&&canManageCase(db,actorId,record))) &&
                      (!contextualFormActions.includes(q.get("action"))||canUseAction(db,actorId,page,record,q.get("action"))) &&
                      (q.get("action")!=="postponeAssignment"||canRequestExtension(db,actorId,mapping[page],record)) &&
                      (q.get("action")!=="propertyTitle"||(page==="requests"&&canManageCase(db,actorId,record))) &&
                      (q.get("action")!=="duplicateCase" || (page==="requests"&&!["COMPLETED","CANCELLED","DUPLICATE","CLOSED"].includes(record.status)&&canManageCase(db,actorId,record))),
                    )))) && (
              <Modal title={actionTitles[q.get("action")] || "ثبت عملیات"}>
                <Actions
                  actionName={q.get("action")}
                  page={page}
                  record={record}
                  db={db}
                  actorId={actorId}
                  perform={perform}
                  busy={busy}
                  scopeOptions={scopeOptions}
                  contactOptions={contactOptions}
                />
              </Modal>
            )}
          {pageAllowed&&q.get("reviewRequest")&&<PropertyReviewSubmission db={db} actorId={actorId} run={run} busy={busy}/>}
          {canOpenPage(db,actorId,"guide") && q.get("help") === "developer" && (
            <React.Suspense
              fallback={
                <p role="status">در حال آماده‌سازی راهنمای برنامه‌نویس…</p>
              }
            >
              <DeveloperGuide page={page} recordId={id} />
            </React.Suspense>
          )}
          <footer>
            <span>نمونهٔ مفهومی · مبالغ تومان · تاریخ شمسی</span>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={s.failNext}
                  onChange={(e) =>
                    useCRM.setState({ failNext: e.target.checked })
                  }
                />{" "}
                شکست نمایشی عملیات بعدی
              </label>
              <button className="text-button" onClick={() => action("reset")}>
                <RotateCcw size={14} /> بازنشانی داده نمایشی
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
const actionTitles = {
  create: "ثبت اطلاعات جدید",
  assign: "ارجاع پرونده",
  rejectAssignment: "درخواست انصراف با دلیل",
  postponeAssignment: "درخواست تمدید مهلت",
  reviewExtension: "بررسی درخواست تمدید مهلت",
  workspace: "کارشناسی و تکمیل پرونده",
  reopenAppraisal: "درخواست کارشناسی مجدد",
  duplicateCase: "بررسی تکراری بودن پرونده",
  propertyTitle: "تعیین عنوان ملک",
  changes: "برگشت برای اصلاح",
  transfer: "انتقال رنج",
  assignee: "تغییر مشاور",
  offer: "ثبت پیشنهاد مالی",
  closeDeal: "مذاکره ناموفق",
  createContract: "تنظیم قرارداد",
  contractTerms: "مبلغ و شرایط قرارداد",
  viewing: "برنامه‌ریزی بازدید",
  followup: "ثبت پیگیری",
  viewingResult: "ثبت نتیجه بازدید",
  createTask: "ثبت کار",
  reset: "بازنشانی داده نمایشی",
};
function RecordList({ page, rows, db }) {
  const actorId=useCRM(state=>state.actorId);
  const [params, setParams] = useSearchParams();
  const count = Math.max(1, Math.ceil(rows.length / 8));
  const current = Math.max(1, Math.min(count, Number(params.get("p")) || 1));
  const change = (n) => {
    const q = new URLSearchParams(params);
    q.set("p", n);
    setParams(q);
  };
  if (!rows.length) return <Empty />;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>پرونده / عنوان</th>
            <th>شخص مرتبط</th>
            <th>مسئول و رنج</th>
            <th>وضعیت</th>
            <th>موعد / اقدام بعدی</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.slice((current - 1) * 8, current * 8).map((x) => {
            const p = db.properties.find((z) => z.id === x.property_id);
            const l = db.listings.find((z) => z.id === x.listing_id);
            return (
              <tr key={x.id}>
                <td>
                  <Link className="record-title" to={`/${page}/${x.id}`}>
                    {x.title ||
                      x.code ||
                      x.contract_number ||
                      l?.title ||
                      person(db, x.id)}
                  </Link>
                  <small>
                    {x.internal_code || x.code || x.description?.slice(0, 50)}
                  </small>
                </td>
                <td>
                  {(()=>{const contactId=x.contact_id||db.inquiries.find(z=>z.id===x.inquiry_id)?.contact_id||db.registrationRequests.find(z=>z.resulting_property_id===(p?.id||x.id))?.contact_id;return canAccess(db,actorId,"contacts",db.contacts.find(contact=>contact.id===contactId))?person(db,contactId):"هماهنگی از طریق مشاور مسئول";})()}
                </td>
                <td>
                  {staff(db, x.assigned_to_id || x.consultant_id)}
                  <small>
                    {db.scopes.find(
                      (z) =>
                        z.id ===
                        (x.management_scope_id || p?.management_scope_id),
                    )?.name || "—"}
                  </small>
                </td>
                <td>
                  <Badge
                    value={
                      x.stage || x.review_status || x.record_status || x.status
                    }
                  />
                </td>
                <td>
                  <span
                    className={
                      new Date(x.due_at || x.next_action_at) < new Date()
                        ? "overdue"
                        : ""
                    }
                  >
                    {remaining(x.due_at || x.next_action_at)}
                  </span>
                  <small>{x.next_action || "مشاهده و تکمیل پرونده"}</small>
                </td>
                <td>
                  <Link
                    className="row-link"
                    to={`/${page}/${x.id}`}
                    aria-label="مشاهده جزئیات"
                  >
                    <ArrowUpLeft size={18} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <span>
          {num(rows.length)} مورد · صفحه {num(current)} از {num(count)}
        </span>
        <div className="toolbar">
          <button
            className="secondary"
            disabled={current === 1}
            onClick={() => change(current - 1)}
          >
            قبلی
          </button>
          <button
            className="secondary"
            disabled={current === count}
            onClick={() => change(current + 1)}
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}
function Detail({ page, record: r, db, actorId, run, action, busy, visible }) {
  const nav = useNavigate();
  const req =
    page === "requests"
      ? r
      : db.registrationRequests.find(
          (x) =>
            x.resulting_property_id ===
            (page === "properties" ? r.id : r.property_id),
        );
  const prop =
    page === "properties"
      ? r
      : db.properties.find(
          (x) => x.id === r.property_id || x.id === r.resulting_property_id,
        );
  const listing =
    page === "listings" || page === "reviews"
      ? r
      : null;
  const inquiry = db.inquiries.find((x) => x.id === r.inquiry_id);
  const deal = db.deals.find((x) => x.id === r.deal_id);
  const viewingIntro=page==="viewings"?db.introductions.find(i=>i.id===r.introduction_id):null;
  const viewingDeal=viewingIntro?db.deals.find(d=>d.inquiry_id===viewingIntro.inquiry_id&&d.listing_id===viewingIntro.listing_id&&!["LOST","CANCELLED","FINALIZED"].includes(d.stage)):null;
  const can= (name,related)=>canUseAction(db,actorId,page,r,name,related);
  const execute = async (a, p) => {
    const v = await run(a, p);
    if (v?.collection && v.id) {
      const route = Object.entries(mapping).find(
        ([k, c]) => c === v.collection && k !== "reviews",
      )?.[0];
      if (route) nav(`/${route}/${v.id}`);
    }
  };
  return (
    <>
      {page==="requests"&&<PropertyJourney db={db} request={r}/>}
      <Link className="back-link" to={(["requests", "inquiries"].includes(page) && assignmentState(db,mapping[page],r) !== "ACCEPTED" && !["COMPLETED","CANCELLED","DUPLICATE","CLOSED"].includes(r.status)) ? "/inbox" : `/${page}`}>
        → بازگشت به فهرست
      </Link>
      <div className={["requests","inquiries","introductions","viewings","deals"].includes(page)?"case-detail-layout":undefined}><div>
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">
              {r.code || r.internal_code || r.contract_number}
            </p>
            <h2>
              {page==="viewings"?`بازدید ${date(r.scheduled_at)}`:page==="introductions"?`معرفی ${db.listings.find(l=>l.id===r.listing_id)?.title||"فایل عرضه"}`:page==="requests" ? (prop?.title||r.title||"عنوان تعیین نشده") : r.title || person(db, r.contact_id || r.id)}
            </h2>
          </div>
          <Badge
            value={r.stage || r.review_status || r.status || r.record_status}
          />
        </div>
        {page==="requests"&&r.description&&<p><b>شرح سرنخ:</b> {r.description}</p>}
        <div className="detail-grid">
          <div>
            <small>مسئول پرونده</small>
            <b>{staff(db, r.assigned_to_id || r.consultant_id)}</b>
          </div>
          <div>
            <small>شخص مرتبط</small>
            <b>{canAccess(db,actorId,"contacts",db.contacts.find(contact=>contact.id===(r.contact_id||inquiry?.contact_id)))?person(db,r.contact_id||inquiry?.contact_id):"هماهنگی از طریق مشاور مسئول"}</b>
          </div>
          <div>
            <small>رنج مسئول</small>
            <b>
              {db.scopes.find(
                (x) =>
                  x.id === (r.management_scope_id || prop?.management_scope_id),
              )?.name || "—"}
            </b>
          </div>
          <div>
            <small>موعد اقدام</small>
            <b>{date(r.due_at || r.next_action_at)}</b>
          </div>
        </div>
        {page==='requests'&&r.status==='DUPLICATE'&&r.duplicate_of_id&&<p className="extension-notice">این پرونده با تصمیم مدیر تکراری تشخیص داده شده است. {canAccess(db,actorId,'registrationRequests',db.registrationRequests.find(original=>original.id===r.duplicate_of_id))&&<Link to={`/requests/${r.duplicate_of_id}`}>مشاهده پرونده اصلی ←</Link>}</p>}
        {page==='requests'&&r.reappraisal_history?.length>0&&<details><summary>سوابق کارشناسی مجدد ({num(r.reappraisal_history.length)})</summary>
          {r.reappraisal_history.map(history=><article className="card" key={history.id}><b>{date(history.requested_at)} · {staff(db,history.requested_by_id)}</b><p>دلیل: {history.reason}</p><p>گزارش کارشناسی قبلی: {history.appraisal_snapshot?.findings||'ثبت نشده'}</p></article>)}
        </details>}
        <div className="toolbar wrap">
          {page==="requests"&&prop&&r.status==="PENDING_REVIEW"&&canManageCase(db,actorId,r)&&<Link className="button" to={`/inbox?review=${prop.id}`}>بررسی و تأیید ملک</Link>}
          {page=== "requests"&&prop&&<Link className="button secondary" to={`/properties/${prop.id}`}>{propertyReviewState(db,prop)==="APPROVED"?"ملک تأییدشده و فایل‌های عرضه":"وضعیت بررسی ملک"}</Link>}
          {page==='requests'&&canManageCase(db,actorId,r)&&<button className="secondary" onClick={()=>action('propertyTitle')}>{prop?.title||r.title?'ویرایش عنوان ملک':'تعیین عنوان ملک'}</button>}
          {page==='requests'&&r.status==='COMPLETED'&&canManageCase(db,actorId,r)&&prop&&<button className="secondary" onClick={()=>action('reopenAppraisal')}>درخواست کارشناسی مجدد</button>}
          {can("workspace") && <>
            <button onClick={() => action("workspace")}>کارشناسی و تکمیل پرونده</button>
            {prop&&can("submitPropertyForReview")&&["DRAFT","CHANGES_REQUIRED"].includes(propertyReviewState(db,prop))&&<button disabled={busy} onClick={()=>run("submitPropertyForReview",{id:prop.id})}>ارسال ملک برای تأیید</button>}
          </>}
          {["listings", "reviews"].includes(page) &&
            canAccess(db, actorId, "listings", r) && canManageCase(db,actorId,{management_scope_id:prop?.management_scope_id}) && (
              <>
                {r.review_status === "PENDING" && (
                  <>
                    {!prop?.title&&req&&<Link className="button" to={`/requests/${req.id}?action=propertyTitle`}>تعیین عنوان ملک</Link>}
                    {prop?.title&&<button
                      disabled={busy}
                      onClick={() => run("approveListing", { id: r.id })}
                    >
                      تأیید و فعال‌سازی
                    </button>}
                    <button
                      className="secondary"
                      onClick={() => action("changes")}
                    >
                      برگشت برای اصلاح
                    </button>
                  </>
                )}
                {r.review_status === "APPROVED" &&
                  ["ACTIVE", "PAUSED"].includes(r.status) && (
                    <button
                      className="secondary"
                      disabled={busy}
                      onClick={() =>
                        run("setListingStatus", {
                          id: r.id,
                          status: r.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
                        })
                      }
                    >
                      {r.status === "ACTIVE" ? "توقف عرضه" : "فعال‌کردن عرضه"}
                    </button>
                  )}
                {req && (
                  <Link className="button secondary" to={`/requests/${req.id}`}>
                    پرونده کارشناسی
                  </Link>
                )}
              </>
            )}
          {page === "inquiries" && assignmentState(db,"inquiries",r) === "ACCEPTED" && (
            <>
              {can("match") && (
                <button className="secondary" onClick={() => action("match")}>
                  شروع جست‌وجوی فایل
                </button>
              )}


            </>
          )}
          {page === "introductions" && (
            <>
              {can("viewing")&&<button onClick={() => action("viewing")}>
                برنامه‌ریزی بازدید
              </button>}
              {can("interested")&&<button
                className="secondary"
                onClick={() =>
                  run("updateIntroduction", {
                    id: r.id,
                    status: "INTERESTED",
                    feedback: "علاقه‌مندی مشتری ثبت شد",
                  })
                }
              >
                ثبت علاقه مشتری
              </button>}
              {can("rejectIntroduction")&&<button
                className="secondary"
                onClick={() => action("rejectIntroduction")}
              >
                ثبت دلیل رد
              </button>}
              {can("createDeal")&&<button
                onClick={() =>
                  execute("createDeal", {
                    introduction_id: r.id,
                    listing_id: r.listing_id,
                    inquiry_id: r.inquiry_id,
                  })
                }
              >
                ورود به مذاکره
              </button>}
            </>
          )}
          {page === "deals" && (
            <>
              {can("closeDeal") && (
                <button
                  className="secondary"
                  onClick={() => action("closeDeal")}
                >
                  مذاکره ناموفق
                </button>
              )}
              {can("succeedDeal")&&<button disabled={busy} onClick={()=>run("succeedDeal",{id:r.id})}>مذاکره موفق</button>}
              {can("createContract") && (
                <button
                  disabled={busy}
                  onClick={() => action("createContract")}
                >
                  تنظیم قرارداد
                </button>
              )}

            </>
          )}
          {page === "contracts" && (
            <>
              {can("finalizeContract") && (
                <button
                  disabled={busy}
                  onClick={() => run("finalizeContract", { id: r.id })}
                >
                  قطعی‌کردن قرارداد
                </button>
              )}
              {r.status === "FINALIZED" && (
                <>
                  {canOpenPage(db,actorId,"finance")&&<Link className="button" to="/finance">
                    مشاهده کمیسیون و دریافت
                  </Link>}
                  {can("amendment")&&<button
                    className="secondary"
                    onClick={() => action("amendment")}
                  >
                    ثبت اصلاحیه جداگانه
                  </button>}
                </>
              )}
            </>
          )}
        </div>
        {["requests", "inquiries"].includes(page) && <CaseIntakeActions db={db} actorId={actorId} collection={mapping[page]} row={r} run={run} busy={busy}/>}
      </section>
      {page === "contacts" && (
        <>
          <section className="panel">
            <h3>شماره‌های تماس</h3>
            {db.contactPhones
              .filter((x) => x.contact_id === r.id)
              .map((x) => (
                <p key={x.id} dir="ltr">
                  {x.phone_number} · {x.label}
                </p>
              ))}
          </section>
          {[
            [
              "املاک",
              "properties",
              db.propertyContacts
                .filter((x) => x.contact_id === r.id)
                .map((x) => db.properties.find((y) => y.id === x.property_id)),
            ],
            [
              "درخواست‌های متقاضی",
              "inquiries",
              visible("inquiries").filter((x) => x.contact_id === r.id),
            ],
            [
              "درخواست‌های ثبت ملک",
              "requests",
              visible("registrationRequests").filter(
                (x) => x.contact_id === r.id,
              ),
            ],
            [
              "مذاکرات",
              "deals",
              visible("deals").filter((x) =>
                db.dealParticipants.some(
                  (p) => p.deal_id === x.id && p.contact_id === r.id,
                ),
              ),
            ],
            [
              "قراردادها",
              "contracts",
              visible("contracts").filter((x) =>
                db.contractParties.some(
                  (p) => p.contract_id === x.id && p.contact_id === r.id,
                ),
              ),
            ],
          ].map(([title, p, rows]) => (
            <section className="panel" key={p}>
              <h3>{title}</h3>
              <RecordList
                page={p}
                rows={rows
                  .filter(Boolean)
                  .filter((x) => canAccess(db, actorId, mapping[p], x))}
                db={db}
              />
            </section>
          ))}
        </>
      )}
      {page === "contacts" && (
        <section className="panel">
          <h3>معرفی‌ها، بازدیدها و پیگیری‌های مرتبط</h3>
          {visible("introductions")
            .filter((x) =>
              db.inquiries.some(
                (i) => i.id === x.inquiry_id && i.contact_id === r.id,
              ),
            )
            .map((x) => (
              <div className="timeline-item" key={x.id}>
                <Link to={`/introductions/${x.id}`}>
                  معرفی {db.listings.find((l) => l.id === x.listing_id)?.title}
                </Link>
                {db.viewings
                  .filter((v) => v.introduction_id === x.id)
                  .map((v) => (
                    <small key={v.id}>
                      بازدید {date(v.scheduled_at)} · {label(v.status)}
                    </small>
                  ))}
              </div>
            ))}
          {visible("followUps")
            .filter((x) => x.contact_id === r.id)
            .map((x) => (
              <p key={x.id}>
                <Link to="/followups">{x.notes || x.next_action}</Link> ·{" "}
                {date(x.scheduled_at)} · {label(x.status)}
              </p>
            ))}
        </section>
      )}
      {prop && (
        <section className="panel">
          <h3>مشخصات ملک و شرایط عرضه</h3>
          <div className="detail-grid">
            {[
              ["عنوان ملک", prop.title],
              ["متراژ", `${num(prop.area)} متر`],
              ["اتاق", num(prop.rooms)],
              [
                "نشانی",
                canAccess(db, actorId, "properties", prop)
                  ? prop.address
                  : "فقط منطقه عمومی؛ نشانی خصوصی است",
              ],
              [
                "نوع معامله",
                db.dealTypes.find((x) => x.id === listing?.deal_type_id)?.name,
              ],
              ["قیمت عرضه", money(listing?.sale_price)],
              ["ودیعه", money(listing?.deposit)],
              ["اجاره ماهانه", money(listing?.monthly_rent)],
            ].map(([k, v]) => (
              <div key={k}>
                <small>{k}</small>
                <b>{v || "—"}</b>
              </div>
            ))}
          </div>
          <div className="toolbar">
            {canAccess(db, actorId, "properties", prop) && (
              <Link to={`/properties/${prop.id}`}>مشاهده ملک ←</Link>
            )}
            {listing && (
              <Link target="_blank" rel="noopener noreferrer" to={`/listings/${listing.id}`}>مشاهده فایل عرضه ←</Link>
            )}
          </div>
          {listing?.additional_terms && (
            <p>{formatTerms(listing.additional_terms)}</p>
          )}
          {req && canAccess(db, actorId, "registrationRequests", req) && (
            <p>
              مالک / معرف:{" "}
              <Link to={`/contacts/${req.contact_id}`}>
                {person(db, req.contact_id)}
              </Link>
            </p>
          )}
          {listing?.rejection_reason && (
            <div className="alert error">
              دلیل اصلاح: {listing.rejection_reason}
            </div>
          )}
        </section>
      )}
      {page === "properties" && (
        <section className="panel">
          <h3>فایل‌های عرضهٔ این ملک</h3>
          <RecordList
            page="listings"
            rows={visible("listings").filter((x) => x.property_id === r.id)}
            db={db}
          />
        </section>
      )}
      {page === "inquiries" && assignmentState(db,"inquiries",r) === "ACCEPTED" && (
        <>
          <section className="panel">
            <h3>نیاز متقاضی</h3>
            <p>
              متراژ {num(r.min_area)} تا {num(r.max_area)} متر · حداقل{" "}
              {num(r.min_rooms)} اتاق · {r.notes}
            </p>
            {db.inquiryPreferences
              .filter((x) => x.inquiry_id === r.id)
              .map((x) => (
                <p key={x.id}>
                  {db.dealTypes.find((t) => t.id === x.deal_type_id)?.name} ·
                  حداکثر خرید {money(x.max_sale_price)} · ودیعه{" "}
                  {money(x.max_deposit)} · اجاره {money(x.max_monthly_rent)}
                </p>
              ))}
          </section>
          <section className="panel">
            <div className="section-head"><h3>جست‌وجو و معرفی فایل عرضه</h3><ManualListingIntroduction db={db} actorId={actorId} inquiry={r} run={run} busy={busy}/></div>
            <h4>پیشنهادهای تطبیق؛ همراه دلیل</h4>
            <p className="muted">
              جست‌وجو به معنی معرفی نیست؛ برای ثبت سابقه، معرفی را انتخاب کنید.
            </p>
            <div className="grid">
              {matchListings(db, r.id)
                .filter(
                  (x) =>
                    canAccess(db, actorId, "listings", x.listing) ||
                    canViewPublicListing(db, actorId, x.listing),
                )
                .map(({ listing: l, reasons, compatible }) => (
                  <div className="card" key={l.id}>
                    <div className="section-head">
                      <Link to={`/${canAccess(db,actorId,"listings",l)?"listings":"explore"}/${l.id}`}>
                        <h3>{l.title}</h3>
                      </Link>
                      <span
                        className={`badge ${compatible ? "status-APPROVED" : "status-CHANGES_REQUIRED"}`}
                      >
                        {compatible ? "سازگار" : "ناسازگار"}
                      </span>
                    </div>
                    <p>{money(l.sale_price || l.deposit)}</p>
                    {reasons.map((v, i) => (
                      <small
                        className={v.passed ? "text-success" : "overdue"}
                        key={i}
                      >
                        {v.passed ? "✓" : "×"} {v.label}
                      </small>
                    ))}
                    {compatible&&can("introduceListing",l)&&<button
                      disabled={busy}
                      onClick={() =>
                        run("introduceListing", {
                          inquiry_id: r.id,
                          listing_id: l.id,
                          channel: "IN_PERSON",
                        })
                      }
                    >
                      معرفی صریح به مشتری
                    </button>}
                  </div>
                ))}
            </div>
          </section>
          <section className="panel">
            <h3>معرفی‌های ثبت‌شده</h3>
            <RecordList
              page="introductions"
              rows={visible("introductions").filter(
                (x) => x.inquiry_id === r.id,
              )}
              db={db}
            />
          </section>
        </>
      )}
      {page==="viewings"&&<section className="panel"><h3>جزئیات بازدید</h3><p>زمان بازدید: {date(r.scheduled_at)}</p><p>مشاور همراه: {staff(db,r.consultant_id)}</p><p>نتیجه: {r.outcome||"هنوز ثبت نشده"}</p><p>{r.customer_feedback}</p><div className="toolbar"><Link to={`/introductions/${r.introduction_id}`}>معرفی مرتبط</Link>{can("viewingResult")&&<button onClick={()=>action('viewingResult')}>ثبت نتیجه بازدید</button>}{can("createDeal")&&<button disabled={busy} onClick={()=>execute('createDeal',{viewing_id:r.id})}>ثبت مذاکره</button>}{viewingDeal&&<Link className="button" to={`/deals/${viewingDeal.id}`}>مشاهده مذاکره</Link>}</div></section>}
      {page === "introductions" && (
        <section className="panel">
          <h3>مشاوران همکار</h3>
          <div className="detail-grid"><div><small>مشاور متقاضی</small><b>{staff(db,introductionConsultants(db,r).buyer)}</b></div><div><small>مشاور ملک و فایل عرضه</small><b>{staff(db,introductionConsultants(db,r).seller)}</b></div></div>
          <p className="muted">بازخورد و برنامه بازدید این معرفی برای هر دو مشاور قابل پیگیری است.</p>
          <h3>پرونده‌های مرتبط</h3>
          <div className="toolbar">
            {canAccess(db,actorId,"inquiries",inquiry)&&<Link to={`/inquiries/${r.inquiry_id}`}>درخواست متقاضی ←</Link>}
            <Link to={`/${canAccess(db,actorId,"listings",db.listings.find(l=>l.id===r.listing_id))?"listings":"explore"}/${r.listing_id}`}>فایل معرفی‌شده ←</Link>
          </div>
          <p>بازخورد: {r.feedback || "ثبت نشده"}</p>
          {db.viewings
            .filter((x) => x.introduction_id === r.id)
            .map((x) => (
              <p key={x.id}>
                {date(x.scheduled_at)} · {label(x.status)} ·{" "}
                {x.customer_feedback}
              </p>
            ))}
        </section>
      )}
      {page === "deals" && (
        <>
          <section className="panel"><h3>نتیجه مذاکره</h3><p>{r.stage==="LOST"?`ناموفق · ${r.closure_reason||"دلیل ثبت نشده"}`:["AGREED","CONTRACT","FINALIZED"].includes(r.stage)?"موفق؛ مبلغ قطعی در قرارداد ثبت می‌شود.":"در حال مذاکره؛ نتیجه را موفق یا ناموفق مشخص کنید."}</p></section>
          <section className="panel">
            <div className="toolbar">
              <Link to={`/${canAccess(db,actorId,"listings",db.listings.find(l=>l.id===r.listing_id))?"listings":"explore"}/${r.listing_id}`}>فایل عرضه ←</Link>
              <Link to={`/inquiries/${r.inquiry_id}`}>درخواست متقاضی ←</Link>
              {db.contracts
                .filter((x) => x.deal_id === r.id && canAccess(db,actorId,"contracts",x))
                .map((x) => (
                  <Link key={x.id} to={`/contracts/${x.id}`}>
                    قرارداد {x.contract_number} ←
                  </Link>
                ))}
            </div>
          </section>
        </>
      )}
      {page === "contracts" && (
        <>
          <ContractTermsSummary db={db} contract={r}/>
          {can("contractTerms")&&<section className="panel"><button onClick={()=>action("contractTerms")}>ویرایش مبلغ و شرایط قرارداد</button></section>}
          <section className="panel">
            <h3>طرفین و امضاهای نمایشی</h3>
            <p className="muted">
              این ثبت، امضای حقوقی یا الکترونیکی رسمی نیست.
            </p>
            {db.contractParties
              .filter((x) => x.contract_id === r.id)
              .map((x) => {
                const sig = db.signatures.find(
                  (z) => z.contract_party_id === x.id,
                );
                return (
                  <div className="offer-row" key={x.id}>
                    <b>{person(db, x.contact_id)}</b>
                    {canAccess(
                      db,
                      actorId,
                      "contacts",
                      db.contacts.find((c) => c.id === x.contact_id),
                    ) && (
                      <Link to={`/contacts/${x.contact_id}`}>پرونده شخص ←</Link>
                    )}
                    <span>{label(x.party_role)}</span>
                    <Badge value={sig?.status || "PENDING"} />
                    {can("signContract",x)&&<button
                      disabled={busy}
                      onClick={() =>
                        run("signContract", {
                          id: r.id,
                          contract_party_id: x.id,
                          party_id: x.id,
                        })
                      }
                    >
                      ثبت امضای این طرف
                    </button>}
                  </div>
                );
              })}
            <p>
              شرایط تثبیت‌شده: {money(r.sale_price || r.deposit)} · اجاره{" "}
              {money(r.monthly_rent)}
            </p>
            <Link to={`/deals/${r.deal_id}`}>بازگشت به مذاکره ←</Link>
          </section>
          <section className="panel">
            <h3>پیوست‌های محلی نمایشی</h3>
            <p className="muted">
              صرفاً نام فایل در مرورگر ذخیره می‌شود و فایلی به سرور ارسال
              نمی‌شود.
            </p>
            {can("attachment")&&<input
              aria-label="انتخاب پیوست نمایشی"
              type="file"
              disabled={r.status === "FINALIZED"}
              onChange={(e) => {
                if (e.target.files[0])
                  run("addContractAttachment", {
                    id: r.id,
                    filename: e.target.files[0].name,
                    document_type: "IDENTITY",
                  });
              }}
            />
            }
            {db.attachments
              .filter((x) => x.contract_id === r.id)
              .map((x) => (
                <p key={x.id}>{x.filename}</p>
              ))}
          </section>
        </>
      )}
      {canAccess(db, actorId, mapping[page], r) && (
        <Timeline
          db={db}
          id={r.id}
          collection={mapping[page]}
          actorId={actorId}
        />
      )}
      </div>
      {["requests","inquiries","introductions","viewings","deals"].includes(page)&&<CaseActivities page={page} row={r} db={db} visible={visible} can={can} action={action} run={run} busy={busy}/>}
      </div>
    </>
  );
}
function Actions({
  actionName: a,
  page,
  record: r,
  db,
  actorId,
  perform,
  busy,
  scopeOptions,
  contactOptions,
  stayOnPage = false,
}) {
  const [type, setType] = useState("sale"),
    [scope, setScope] = useState(a==="transfer"?"":r?.management_scope_id || scopeOptions[0]?.id || "");
  const nav = useNavigate();
  const crm = useCRM();
  const request =
    page === "requests"
      ? r
      : db.registrationRequests.find(
          (x) => x.resulting_property_id === r?.property_id,
        );
  const p = db.properties.find((x) => x.id === request?.resulting_property_id);
  const appraisal = db.appraisals.find(
    (x) => x.registration_request_id === request?.id,
  );
  const behavior =
    db.dealTypes.find((x) => x.id === type)?.behavior_type?.toLowerCase() ||
    type;
  const agentOptions = db.memberships
    .filter(
      (x) =>
        x.scope_id === scope &&
        !x.left_at &&
        x.membership_role === "CONSULTANT" && db.users.some(u=>u.id===x.user_id&&u.is_active) && x.user_id !== (["assign","assignee"].includes(a) ? r?.assigned_to_id : null),
    )
    .map((x) => ({ id: x.user_id, name: staff(db, x.user_id) }));
  const submit = async (name, payload) => {
    const v = await perform(name, payload);
    if (!stayOnPage && v?.collection && v.id) {
      const route = Object.entries(mapping).find(
        ([k, c]) => c === v.collection && k !== "reviews",
      )?.[0];
      if (route) nav(`/${route}/${v.id}`);
    }
  };
  if (a === "reset")
    return (
      <>
        <p>همهٔ تغییرات محلی این نمونه پاک و داده اولیه جایگزین می‌شود.</p>
        <button
          onClick={() => {
            crm.reset();
            nav("/");
          }}
        >
          تأیید بازنشانی داده نمایشی
        </button>
      </>
    );
  if (a === "create" && page === "contacts")
    return (
      <Form
        busy={busy}
        onSubmit={(x) =>
          submit("createContact", {
            ...x,
            person_type: "INDIVIDUAL",
            phone_number: x.phone_number,
          })
        }
      >
        <Field name="first_name" title="نام" required />
        <Field name="last_name" title="نام خانوادگی" required />
        <Field
          name="phone_number"
          title="شماره همراه"
          required
          pattern="[0-9۰-۹]{11}"
        />
        <Field name="national_id" title="کد ملی (اختیاری)" />
        <Field name="notes" title="یادداشت" type="textarea" />
      </Form>
    );
  if(a==='propertyTitle')return <Form busy={busy} onSubmit={fields=>submit('setPropertyTitle',{id:r.id,title:fields.title})}>
    <Field name="title" title="عنوان ملک" value={p?.title||r.title||''} required/>
  </Form>;
  if(a==='duplicateCase')return <Form busy={busy} submit="تأیید تکراری بودن پرونده" onSubmit={fields=>submit('markDuplicateCase',{...fields,id:r.id})}>
    <p className="muted">مالک مشترک به معنی ملک تکراری نیست. پس از تطبیق مشخصات، پرونده اصلی را انتخاب کنید. هر دو پرونده و سابقه آن‌ها حفظ می‌شوند.</p>
    {possibleDuplicateCases(db,actorId,r).map(candidate=><p key={candidate.id}><Link to={`/requests/${candidate.id}`} target="_blank" rel="noreferrer">بررسی {candidate.code} · {candidate.initial_contact_name||person(db,candidate.contact_id)} ←</Link></p>)}
    <Field name="original_id" title="پرونده اصلی" required options={db.registrationRequests.filter(candidate=>candidate.id!==r.id&&!['DUPLICATE','CANCELLED'].includes(candidate.status)&&canAccess(db,actorId,'registrationRequests',candidate)).map(candidate=>({id:candidate.id,name:`${candidate.code} · ${candidate.initial_contact_name||person(db,candidate.contact_id)}`}))}/>
    <Field name="reason" title="دلیل تکراری بودن" type="textarea" required/>
  </Form>;
  if(a==='reopenAppraisal')return <Form busy={busy} submit="ثبت درخواست کارشناسی مجدد" onSubmit={fields=>submit('reopenAppraisal',{...fields,id:r.id})}>
    <p className="muted">پرونده به همان کارشناس برمی‌گردد و تا تأیید دوباره، عرضه فایل متوقف می‌شود. گزارش و تأییدهای قبلی محفوظ می‌مانند.</p>
    <Field name="reason" title="دلیل کارشناسی مجدد" type="textarea" required/>
    <Field name="due_at" title="موعد کارشناسی مجدد" type="datetime-local"/>
    <p className="muted">اگر موعد تعیین نکنید، مهلت یک‌روزه در نظر گرفته می‌شود.</p>
  </Form>;
  if (a === "create" && page === "requests")
    return (
      <Form
        busy={busy}
        onSubmit={(x) =>
          submit("createRegistrationRequest", {
            ...x,
            management_scope_id: scope,
            requested_deal_type_ids: x.deal_type_id ? [x.deal_type_id] : [],
            priority: "NORMAL",
          })
        }
      >
        <Field
          name="contact_id"
          title="شخص ثبت‌شده (اختیاری)"
          options={contactOptions}
        />
        <Field name="initial_contact_name" title="نام مالک یا معرف" required />
        <Field name="title" title="عنوان ملک"/>
        <Field
          name="initial_contact_phone"
          title="شماره تماس اولیه"
          required
          pattern="[0-9۰-۹]{11}"
        />
        <Field
          name="management_scope_id"
          title="رنج مسئول"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          options={scopeOptions}
          required
        />
        <Field name="district_id" title="منطقه" options={db.districts} />
        <Field
          name="deal_type_id"
          title="نوع عرضه اولیه (اختیاری)"
          options={db.dealTypes.filter((x) => x.is_active)}
        />
        <Field name="approximate_address" title="نشانی حدودی" />
        <Field name="description" title="توضیحات اولیه" type="textarea" />
      </Form>
    );
  if (a === "create" && page === "inquiries")
    return (
      <Form
        busy={busy}
        onSubmit={(x) =>
          submit("createInquiry", {
            ...x,
            management_scope_id: scope,
            district_ids: x.district_id ? [x.district_id] : [],
            property_type_ids: x.property_type_id ? [x.property_type_id] : [],
            preference: {
              deal_type_id: x.deal_type_id,
              max_sale_price: x.max_sale_price,
              max_deposit: x.max_deposit,
              max_monthly_rent: x.max_monthly_rent,
            },
            preferences: [
              {
                deal_type_id: x.deal_type_id,
                max_sale_price: x.max_sale_price,
                max_deposit: x.max_deposit,
                max_monthly_rent: x.max_monthly_rent,
              },
              ...(x.second_deal_type_id
                ? [
                    {
                      deal_type_id: x.second_deal_type_id,
                      max_sale_price: x.second_max_sale_price,
                      max_deposit: x.second_max_deposit,
                      max_monthly_rent: x.second_max_monthly_rent,
                    },
                  ]
                : []),
            ],
            criteria: [
              ...(x.required_parking === "yes"
                ? [
                    {
                      attribute_code: "parking",
                      operator: "EQ",
                      value: true,
                      is_required: true,
                    },
                  ]
                : []),
              ...(x.required_elevator === "yes"
                ? [
                    {
                      attribute_code: "elevator",
                      operator: "EQ",
                      value: true,
                      is_required: true,
                    },
                  ]
                : []),
            ],
            priority: "NORMAL",
            status: "OPEN",
          })
        }
      >
        <Field
          name="contact_id"
          title="متقاضی"
          options={contactOptions}
          required
        />
        <Field
          name="management_scope_id"
          title="رنج مسئول"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          options={scopeOptions}
          required
        />
        <Field
          name="assigned_to_id"
          title="مشاور مسئول"
          options={agentOptions}
          required
        />
        <Field
          name="district_id"
          title="منطقه موردنظر"
          options={db.districts}
        />
        <Field
          name="deal_type_id"
          title="نوع معامله"
          options={db.dealTypes.filter((x) => x.is_active)}
          required
        />
        <Field
          name="property_type_id"
          title="نوع ملک"
          options={[
            { id: "apartment", name: "آپارتمان" },
            { id: "villa", name: "ویلا" },
            { id: "land", name: "زمین" },
          ]}
        />
        <Field name="min_area" title="حداقل متراژ" type="number" min="0" />
        <Field name="max_area" title="حداکثر متراژ" type="number" min="1" />
        <Field name="min_rooms" title="حداقل اتاق" type="number" min="0" />
        <Field
          name="max_sale_price"
          title="حداکثر بودجه خرید (تومان)"
          type="number"
          min="0"
        />
        <Field
          name="max_deposit"
          title="حداکثر ودیعه (تومان)"
          type="number"
          min="0"
        />
        <Field
          name="max_monthly_rent"
          title="حداکثر اجاره (تومان)"
          type="number"
          min="0"
        />
        <Field
          name="required_parking"
          title="پارکینگ شرط ضروری است؟"
          options={[
            { id: "yes", name: "بله؛ بدون پارکینگ نامناسب است" },
            { id: "no", name: "خیر" },
          ]}
        />
        <Field
          name="required_elevator"
          title="آسانسور شرط ضروری است؟"
          options={[
            { id: "yes", name: "بله؛ بدون آسانسور نامناسب است" },
            { id: "no", name: "خیر" },
          ]}
        />
        <h3 className="full-width">نوع معامله دوم (اختیاری؛ بودجه مستقل)</h3>
        <Field
          name="second_deal_type_id"
          title="نوع معامله جایگزین"
          options={db.dealTypes.filter((x) => x.is_active)}
        />
        <Field
          name="second_max_sale_price"
          title="سقف خرید جایگزین (تومان)"
          type="number"
          min="0"
        />
        <Field
          name="second_max_deposit"
          title="سقف ودیعه جایگزین (تومان)"
          type="number"
          min="0"
        />
        <Field
          name="second_max_monthly_rent"
          title="سقف اجاره جایگزین (تومان)"
          type="number"
          min="0"
        />
        <Field name="next_action" title="اقدام بعدی" required />
        <Field
          name="next_action_at"
          title="موعد اقدام"
          type="datetime-local"
          required
        />
        <Field name="notes" title="توضیحات نیاز" type="textarea" />
      </Form>
    );
  if (a === "reviewExtension") {
    const extension = pendingExtension(db,mapping[page],r);
    if(!extension)return <p>درخواست تمدیدی در انتظار تصمیم نیست.</p>;
    return <Form busy={busy} submit="ثبت تصمیم مدیر" onSubmit={x=>perform(x.decision === "APPROVE" ? "approveAssignmentExtension" : "rejectAssignmentExtension",{...x,id:r.id,collection:mapping[page],request_id:extension.id})}>
      <p className="full-width muted">موعد فعلی: {date(r.due_at)} · موعد پیشنهادی کارشناس: {date(extension.new_scheduled_at)}<br/>دلیل درخواست: {extension.reason}</p>
      <Field name="decision" title="تصمیم مدیر" required options={[{id:"APPROVE",name:"تأیید تمدید مهلت"},{id:"REJECT",name:"رد درخواست تمدید"}]}/>
      <Field name="due_at" title="موعد تأییدشده رسیدگی" value={extension.new_scheduled_at} type="datetime-local" calendar/>
      <Field name="reason" title="دلیل تصمیم مدیر" required type="textarea"/>
    </Form>;
  }
  if (["rejectAssignment", "postponeAssignment"].includes(a))
    return <Form busy={busy} submit={a === "rejectAssignment" ? "ارسال درخواست انصراف" : "ثبت درخواست تمدید"} onSubmit={async x=>{const result=await perform(a,{...x,id:r.id,collection:mapping[page]});if(result && a === "rejectAssignment")nav("/inbox");}}>
      {a === "postponeAssignment" && <><p className="full-width muted">موعد فعلی: {date(r.due_at)}؛ تمدید فقط پس از تأیید مدیر معتبر است. مهلت دو روزه پاسخ به ارجاع با درخواست تمدید تغییر نمی‌کند.</p><Field name="due_at" title="موعد پیشنهادی رسیدگی" type="datetime-local" required calendar/></>}
      <Field name="reason" title={a === "rejectAssignment" ? "دلیل انصراف" : "دلیل درخواست تمدید"} type="textarea" required/>
    </Form>;
  if (["assign", "assignee"].includes(a))
    return (
      <Form
        busy={busy}
        onSubmit={(x) =>
          perform(
            "assignCase",
            {
              ...x,
              id: r.id,
              subject_type:
                page === "requests" ? "registration_request" : "inquiry",
              subject_id: r.id,
              collection: mapping[page],
              new_assignee_id: x.assigned_to_id,
            },
          )
        }
      >
        <Field
          name="assigned_to_id"
          title="مشاور رنج پرونده"
          options={agentOptions}
          required
        />
        <Field
          name="due_at"
          title="موعد تکمیل"
          calendar
          type="datetime-local"
          required
        />
        <Field
          name="reason"
          title="توضیحات ارجاع (اختیاری)"
          type="textarea"
        />
      </Form>
    );
  if (a === "transfer")
    return (
      <Form
        busy={busy}
        onSubmit={(x) =>
          perform("transferScope", {
            ...x,
            id: r.id,
            subject_id: r.id,
            subject_type:
              page === "inquiries" ? "inquiry" : "registration_request",
            collection: mapping[page],
            to_scope_id: scope,
            new_assignee_id: x.assigned_to_id || null,
            assignment_mode: x.assigned_to_id ? "ASSIGN" : "QUEUE",
          })
        }
      >
        <p className="muted">
          درخواست تبدیل‌شده، ملک و فایل‌های وابسته با هم منتقل می‌شوند.
          خالی‌گذاشتن مشاور یعنی صف ارجاع مقصد.
        </p>
        <Field
          name="to_scope_id"
          title="رنج مقصد"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          options={db.scopes.filter(candidate=>candidate.is_active&&candidate.id!==r.management_scope_id)}
          required
        />
        <Field
          name="assigned_to_id"
          title="مشاور مقصد یا صف ارجاع"
          options={agentOptions}
        />
        <Field name="reason" title="دلیل انتقال" type="textarea" required />
      </Form>
    );
  if (a === "workspace")
    return (
      <Form
        busy={busy}
        submit="ذخیره کارشناسی ملک"
        onSubmit={async (x) => {
          const startPath=window.location.pathname;
          const saved=await perform("saveWorkspace", {
            id: r.id,
            property: {
              address: x.address,
              area: x.area,
              rooms: x.rooms,
              floor: x.floor,
              built_year: x.built_year,
              property_type_id: x.property_type_id,
              property_usage_id: "residential",
              district_id: x.district_id,
              description: x.description,
              attribute_values: {
                ...p?.attribute_values,
                parking: x.parking === "yes",
                elevator: x.elevator === "yes",
              },
            },
            appraisal: {
              status: "COMPLETED",
              findings: x.findings,
              performed_at: new Date().toISOString(),
              valuation_notes: x.valuation_notes,
            },
          });
          if(!saved||useCRM.getState().actorId!==actorId||window.location.pathname!==startPath)return;
          const response=await promptPropertyReview();
          if(response.isConfirmed&&useCRM.getState().actorId===actorId&&window.location.pathname===startPath){
            const next=new URLSearchParams(window.location.search);next.set('reviewRequest',r.id);nav(`${startPath}?${next.toString()}`);
          }
        }}
      >
        <h3 className="full-width">۱. مشخصات دارایی</h3>
        <Field
          name="title"
          title="عنوان ملک"
          value={p?.title || r.title || ""}
          placeholder="عنوان تعیین نشده"
          readOnly
        />
        <Field
          name="address"
          title="نشانی کامل"
          value={p?.address || r.approximate_address}
          required
        />
        <Field
          name="district_id"
          title="منطقه"
          value={p?.district_id || r.district_id}
          options={db.districts}
          required
        />
        <Field
          name="property_type_id"
          title="نوع ملک"
          value={p?.property_type_id || "apartment"}
          options={[
            { id: "apartment", name: "آپارتمان" },
            { id: "villa", name: "ویلا" },
            { id: "land", name: "زمین" },
          ]}
          required
        />
        <Field
          name="area"
          title="متراژ"
          type="number"
          min="1"
          value={p?.area}
          required
        />
        <Field
          name="rooms"
          title="اتاق"
          type="number"
          min="0"
          value={p?.rooms || 0}
          required
        />
        <Field name="floor" title="طبقه" type="number" value={p?.floor || 0} />
        <Field
          name="built_year"
          title="سال ساخت شمسی"
          type="number"
          value={p?.built_year || 1400}
        />
        <Field
          name="parking"
          title="پارکینگ"
          value={p?.attribute_values?.parking ? "yes" : "no"}
          options={[
            { id: "yes", name: "دارد" },
            { id: "no", name: "ندارد" },
          ]}
        />
        <Field
          name="elevator"
          title="آسانسور"
          value={p?.attribute_values?.elevator ? "yes" : "no"}
          options={[
            { id: "yes", name: "دارد" },
            { id: "no", name: "ندارد" },
          ]}
        />
        <h3 className="full-width">۲. گزارش بازدید و بررسی ملک</h3>
        <Field
          name="findings"
          value={appraisal?.findings}
          title="نتیجه تماس و کارشناسی"
          type="textarea"
          required
        />
        <Field
          name="valuation_notes"
          value={appraisal?.valuation_notes}
          title="توضیحات تکمیلی بازدید"
          type="textarea"
        />
      </Form>
    );
  if (a === "match")
    return (
      <Form
        busy={busy}
        onSubmit={(x) =>
          perform("updateInquiry", { id: r.id, status: "MATCHING", ...x })
        }
      >
        <Field name="next_action" title="اقدام بعدی" required />
        <Field
          name="next_action_at"
          title="موعد اقدام بعدی"
          type="datetime-local"
          required
        />
      </Form>
    );
  if (a === "closeDeal")
    return (
      <Form
        busy={busy}
        onSubmit={(x) => perform("closeDeal", { id: r.id, ...x })}
      >
        <Field
          name="reason"
          title="دلیل ناموفق پایان‌دادن مذاکره"
          required
          type="textarea"
        />
      </Form>
    );
  if (a === "changes")
    return (
      <Form
        busy={busy}
        onSubmit={(x) => perform("requestListingChanges", { id: r.id, ...x })}
      >
        <Field
          name="reason"
          title="دلیل برگشت برای اصلاح"
          type="textarea"
          required
        />
      </Form>
    );
  if (a === "rejectIntroduction")
    return (
      <Form
        busy={busy}
        onSubmit={(x) =>
          perform("updateIntroduction", { id: r.id, status: "REJECTED", ...x })
        }
      >
        <Field
          name="rejection_reason"
          title="دلیل رد فایل توسط مشتری"
          required
          type="textarea"
        />
      </Form>
    );
  if (a === "viewing")
    return (
      <Form
        busy={busy}
        onSubmit={(x) =>
          perform("scheduleViewing", { id: r.id, introduction_id: r.id, ...x })
        }
      >
        <Field
          name="scheduled_at"
          title="زمان بازدید"
          type="datetime-local"
          required
        />
        <Field
          name="consultant_id"
          title="مشاور همراه"
          options={db.users
            .filter((x) => x.group_ids.includes("AGENT"))
            .map((x) => ({ id: x.id, name: staff(db, x.id) }))}
          required
        />
      </Form>
    );
  if(a==="createContract"||a==="contractTerms")return <ContractTermsEditor db={db} deal={a==="createContract"?r:db.deals.find(d=>d.id===r.deal_id)} contract={a==="contractTerms"?r:null} perform={perform} busy={busy} onSaved={result=>nav(`/contracts/${result.id}`)}/>;
  if(a==="viewingResult")return <Form busy={busy} onSubmit={fields=>perform("completeViewing",{id:r.id,...fields})}><Field name="outcome" title="نتیجه بازدید" type="textarea" required/><Field name="customer_feedback" title="بازخورد مشتری" type="textarea"/></Form>;
  if (a === "createTask")
    return <Form busy={busy} onSubmit={x=>perform("createTask",{...x,subject_type:activitySubjects[page],subject_id:r.id})}>
      <Field name="title" title="عنوان کار" required/>
      <Field name="description" title="توضیحات کار" type="textarea"/>
      <Field name="due_at" title="مهلت انجام کار" type="datetime-local" calendar required/>
      <Field name="assigned_to_id" title="ارجاع به" value={["requests","inquiries"].includes(page)?(r.assigned_to_id||actorId):actorId} options={activityAssignees(db,actorId,mapping[page],r).map(id=>({id,name:id===actorId?"خودم":staff(db,id)}))} required/>
    </Form>;
  if (a === "followup")
    return (
      <Form
        busy={busy}
        onSubmit={(x) =>
          perform("createFollowUp", {
            ...x,
            contact_id:
              r.contact_id ||
              activityInquiry(db,mapping[page],r)?.contact_id,
            consultant_id: x.consultant_id || actorId,
            subject_type: activitySubjects[page],
            subject_id: r.id,
            follow_up_type: "CALL",
          })
        }
      >
        <Field
          name="scheduled_at"
          title="زمان پیگیری"
          type="datetime-local"
          calendar
          required
        />
        <Field name="consultant_id" title="ارجاع به" value={["requests","inquiries"].includes(page)?(r.assigned_to_id||actorId):actorId} options={activityAssignees(db,actorId,mapping[page],r).map(id=>({id,name:id===actorId?"خودم":staff(db,id)}))} required/>
        <Field name="notes" title="موضوع پیگیری" type="textarea" required />
        <Field name="next_action" title="اقدام بعدی" required />
      </Form>
    );
  if (a === "amendment")
    return (
      <Form
        busy={busy}
        onSubmit={(x) =>
          perform("createAmendment", {
            id: r.id,
            contract_id: r.id,
            ...x,
            new_terms_snapshot: { note: x.note },
          })
        }
      >
        <Field name="reason" title="دلیل اصلاحیه" required />
        <Field
          name="note"
          title="شرایط جدید اصلاحیه نمایشی"
          required
          type="textarea"
        />
        <Field name="effective_at" title="تاریخ اثر" type="date" required />
      </Form>
    );
  return <p>این عملیات از بخش مربوط در صفحه انجام می‌شود.</p>;
}
