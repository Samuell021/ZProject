import ConsultantWithdrawal from '../components/ConsultantWithdrawal';
import {acceptanceRecords,acceptanceTabs,matchesAcceptanceTab} from '../services/acceptance-inbox';
import PropertyWorkspace from "./PropertyWorkspace";
import {propertyReviewState} from "../services/property-listings";
import SelectBox from "../components/SelectBox";
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { canAccess } from '../services/operations';
import { assignedAt, assignmentState, canManageCase, canReassign, groupsFor, pendingExtension, pendingWithdrawal, isInAcceptanceInbox, leadState, canOpenPage, possibleDuplicateCases, canRequestExtension } from '../services/intake';
import { Badge, Field, Form, Modal, Empty, num, date, remaining, staff, person } from '../components/ui';
const route = c => c === 'registrationRequests' ? 'requests' : 'inquiries';
export const intakeLabels = {
  NEW: 'در انتظار پذیرش مدیر رنج',
  UNASSIGNED: 'در انتظار ارجاع',
  PENDING: 'در انتظار پذیرش',
  ACCEPTED: 'پذیرفته و در حال رسیدگی',
  REJECTED: 'رد ارجاع توسط کارشناس',
  PROPERTY_REVIEW: 'کارشناسی در انتظار تأیید مدیر'
};
export function CaseIntakeActions({
  db,
  actorId,
  collection,
  row,
  run,
  busy = false,
  acceptanceOnly = false
}) {
  const state = assignmentState(db, collection, row);
  const withdrawal=pendingWithdrawal(db,collection,row);
  const navigate=useNavigate();
  const manager = canManageCase(db, actorId, row);
  const mine = row.assigned_to_id === actorId;
  const extension = pendingExtension(db,collection,row);
  const closed = ['COMPLETED', 'CANCELLED', 'DUPLICATE', 'CLOSED'].includes(row.status);
  const href = `/${route(collection)}/${row.id}`;
  const [q, setQ] = useSearchParams();
  const open = a => {
    const n = new URLSearchParams(q);
    n.set('action', a);
    setQ(n);
  };
  const isDetail = window.location.pathname === href;
  const control = (a, text, primary = false) => isDetail ? <button className={primary ? '' : 'secondary'} onClick={() => open(a)}>{text}</button> : <Link className={`button ${primary ? '' : 'secondary'}`} to={`${href}?action=${a}`}>{text}</Link>;
  const duplicates=collection==='registrationRequests'?possibleDuplicateCases(db,actorId,row):[];
  const duplicateControl=!closed&&manager&&duplicates.length>0?<>{isDetail&&<p className="extension-notice">{num(duplicates.length)} پرونده با مالک یا تماس مشترک وجود دارد؛ تکراری‌بودن ملک نیاز به بررسی دارد.</p>}{control('duplicateCase','بررسی احتمال تکراری')}</>:null;
  const late = state === 'PENDING' && canReassign(db, collection, row);
  const property=collection==='registrationRequests'?db.properties.find(p=>p.id===row.resulting_property_id):null;
  if(withdrawal)return <ConsultantWithdrawal db={db} actorId={actorId} request={row} collection={collection} run={run} busy={busy}/>;
  if(manager&&row.status==='PENDING_REVIEW'&&property&&propertyReviewState(db,property)==='PENDING')return <div className="intake-state"><p>کارشناسی ملک برای بررسی شما ارسال شده است.</p><div className="toolbar wrap intake-actions"><Link className="button" to={`/inbox?review=${property.id}`}>بررسی کارشناسی و تصمیم</Link>{!acceptanceOnly&&<><button className="secondary" disabled={busy} onClick={()=>run('reviewProperty',{id:property.id,decision:'APPROVED'})}>تأیید ملک</button><Link className="button secondary" to={`/inbox?review=${property.id}&action=propertyChanges`}>برگشت برای اصلاح</Link></>}</div></div>;

  if(leadState(row)==='NEW'&&!closed)return <div className="intake-state">{isDetail&&manager&&<p><b>ثبت‌کننده سرنخ: {row.created_by_id ? staff(db,row.created_by_id) : "نامشخص"}</b></p>}<p>در انتظار پذیرش مدیر رنج</p><div className="toolbar wrap intake-actions">{manager&&<button disabled={busy} onClick={async()=>{const result=await run('acceptLead',{collection,id:row.id});if(result&&isDetail)navigate('/inbox');}}>پذیرش پرونده</button>}{manager&&!acceptanceOnly&&control('transfer','انتقال به رنج دیگر')}{duplicateControl}</div></div>;
  return <>
  {isDetail&&manager&&<p><b>ثبت‌کننده سرنخ: {row.created_by_id ? staff(db,row.created_by_id) : "نامشخص"}</b></p>}
  {!closed && <div className={`intake-state ${late ? 'is-late' : ''}`}>
   <b>{intakeLabels[state]}</b>
   {state === 'PENDING' && <p>مهلت پاسخ به ارجاع: {remaining(new Date(new Date(assignedAt(db, collection, row)).getTime() + 48 * 3600000).toISOString())}{late&&!acceptanceOnly ? ' · امکان ارجاع مجدد توسط مدیر فراهم است.' : ''}</p>}
   {row.rejection_reason && state === 'REJECTED' && <p>دلیل رد: {row.rejection_reason}</p>}
   {extension && <p className="extension-notice">در انتظار تأیید تمدید مهلت · موعد پیشنهادی: {date(extension.new_scheduled_at)}<br/>دلیل: {extension.reason}</p>}
   {row.due_at && <small>موعد رسیدگی: {date(row.due_at)} · {remaining(row.due_at)}</small>}
  </div>}
  <div className="toolbar wrap intake-actions">
   {duplicateControl}
   {!closed && mine && state === 'PENDING' && <>
    <button disabled={busy} onClick={() => run('acceptAssignment', {
          collection,
          id: row.id
        })}>{collection === 'registrationRequests' ? 'تأیید و شروع کارشناسی' : 'تأیید و شروع رسیدگی'}</button>
    {control('rejectAssignment', 'درخواست انصراف با دلیل')}
   </>}
   {canRequestExtension(db,actorId,collection,row) && control('postponeAssignment', 'درخواست تمدید مهلت')}
   {!closed && manager && extension && control('reviewExtension','بررسی درخواست تمدید',true)}
   {!acceptanceOnly && !closed && manager && canReassign(db, collection, row) && control('assign', row.assigned_to_id ? 'ارجاع مجدد به کارشناس' : 'ارجاع به کارشناس', true)}
   {!acceptanceOnly && manager && !closed && isDetail && control('transfer', 'انتقال به رنج دیگر')}
  </div>
 </>;
}
export default function IntakeWorkspace({
  page,
  db,
  actorId,
  run,
  busy
}) {
  const [q, setQ] = useSearchParams(),
    navigate = useNavigate();

  if(page==='lead-submit') {
    const c=q.get('kind')==='INQUIRY'?'inquiries':'registrationRequests';
    const receipt=db[c].find(r=>r.id===q.get('submitted')&&r.created_by_id===actorId);
    return <section className="panel">{receipt?<><h2>سرنخ برای پذیرش مدیر رنج ثبت شد</h2><p>کد پیگیری: {receipt.code}</p><p className="muted">تعیین تکلیف و ارجاع با مدیر رنج است. پس از ارجاع به شما، پرونده در کارتابل پذیرش نمایش داده می‌شود.</p><button onClick={()=>navigate('/lead-submit')}>ثبت سرنخ جدید</button></>:<><h2>ثبت سرنخ</h2><p className="muted">سرنخ پس از ثبت برای پذیرش مدیر رنج ارسال می‌شود.</p><LeadForm db={db} actorId={actorId} run={run} busy={busy} onCreated={result=>navigate(canOpenPage(db,actorId,'leads')?`/${route(result.collection)}/${result.id}`:`/lead-submit?submitted=${result.id}&kind=${result.collection==='inquiries'?'INQUIRY':'PROPERTY'}`)}/></>}</section>;
  }
  const managerial = groupsFor(db, actorId).some(g => ['GENERAL_MANAGER', 'RANGE_MANAGER'].includes(g.code));
  if(page==='inbox'&&q.get('review')&&managerial)return <PropertyWorkspace key={q.get('review')} page="reviews" id={q.get('review')} db={db} actorId={actorId} run={run} busy={busy}/>;
  const source=acceptanceRecords(db,actorId);
  const requested=q.get('state');
  const tabs=acceptanceTabs.filter(([key])=>managerial?key!=='PENDING':['PENDING','EXTENSION_PENDING','WITHDRAWAL_PENDING'].includes(key));
  const filter=tabs.some(([key])=>key===requested)?requested:tabs[0][0];
  const searched=source.filter(({row,collection})=>(!q.get('type')||(q.get('type')==='PROPERTY')===(collection==='registrationRequests'))&&
    (!q.get('search')||[row.code,row.description,row.notes,row.initial_contact_name,person(db,row.contact_id)].join(' ').includes(q.get('search'))));
  const rows=searched.filter(record=>matchesAcceptanceTab(record,filter));
  const update = (name, value) => {
    const n = new URLSearchParams(q);
    value ? n.set(name, value) : n.delete(name);
    setQ(n);
  };
  return <>
  <div className="section-head"><p className="muted">{managerial?'پذیرش اولیه، پذیرش مشاور، تأیید انصراف، تأیید کارشناسی و درخواست‌های تمدید را همین‌جا رسیدگی کنید. ارجاع و تغییر مشاور در خود پرونده انجام می‌شود.':'ارجاع‌های خود را بپذیرید یا با دلیل رد کنید؛ وضعیت درخواست‌های تمدید شما هم اینجا دیده می‌شود.'}</p></div>
  <div className="requests-stage-filters" role="tablist" aria-label="دسته‌بندی کارتابل پذیرش">{tabs.map(([key,title])=><button key={key} role="tab" tabIndex={filter===key?0:-1} onKeyDown={e=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
   e.preventDefault();const index=tabs.findIndex(([id])=>id===key);
   const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowLeft'?1:-1)+tabs.length)%tabs.length;
   update('state',tabs[next][0]);document.getElementById(`inbox-tab-${tabs[next][0]}`)?.focus();
  }} id={`inbox-tab-${key}`} aria-selected={filter===key} aria-controls="inbox-results" className={filter===key?'':'secondary'} onClick={()=>update('state',key)}>{title} <span>{num(searched.filter(r=>matchesAcceptanceTab(r,key)).length)}</span></button>)}</div>
  <section className="panel">
   <div className="toolbar wrap">
    <input aria-label="جست‌وجوی سرنخ و ارجاع" placeholder="نام، کد پرونده یا توضیحات…" value={q.get('search') || ''} onChange={e => update('search', e.target.value)} />
    <SelectBox aria-label="نوع پرونده" value={q.get('type') || ''} onChange={e => update('type', e.target.value)}><option value="">همه انواع پرونده</option><option value="PROPERTY">ثبت ملک و فایل</option><option value="INQUIRY">درخواست متقاضی</option></SelectBox>
   </div>
   <p className="muted">{num(rows.length)} پرونده</p>
   <div className="acceptance-grid" role="tabpanel" id="inbox-results" aria-labelledby={`inbox-tab-${filter}`}>{rows.map(({
          collection,
          row,
          state, extension
        }) => <article className="card intake-card" key={collection + row.id}>
    <header className="intake-card-header"><small>{row.code} · {collection === 'registrationRequests' ? 'ثبت ملک' : 'درخواست متقاضی'}</small><span className="badge">{state==='WITHDRAWAL_PENDING'?'تأیید انصراف':state==='NEW'?'پذیرش اولیه':state==='PROPERTY_REVIEW'?'تأیید کارشناسی':extension?'تأیید تمدید مهلت':'پذیرش مشاور'}</span></header>
    <h2><Link to={`/${route(collection)}/${row.id}`}>{row.initial_contact_name || person(db, row.contact_id)}</Link></h2>
    <div className="intake-card-meta"><span>مشاور مسئول: <b>{row.assigned_to_id?staff(db,row.assigned_to_id):'تعیین نشده'}</b></span><span>{db.scopes.find(s => s.id === row.management_scope_id)?.name}</span>{canManageCase(db,actorId,row)&&<span>ثبت‌کننده: {row.created_by_id ? staff(db,row.created_by_id) : 'نامشخص'}</span>}</div>
    <p className="intake-card-summary">{row.description || row.notes}</p>
    <div className="intake-card-actions"><CaseIntakeActions db={db} actorId={actorId} collection={collection} row={row} run={run} busy={busy} acceptanceOnly /></div>
    <footer className="intake-card-footer"><Link to={`/${route(collection)}/${row.id}`}>مشاهده پرونده و سابقه ←</Link></footer>
   </article>)}</div>
   {!rows.length && <Empty />}
  </section>
 </>;
}
function LeadForm({db,actorId,run,busy,onCreated}) {
 const [q]=useSearchParams();
 const [type,setType]=useState(q.get('type')==='INQUIRY'?'INQUIRY':'PROPERTY');
 const manager=canOpenPage(db,actorId,'leads');
 const scopes=db.scopes.filter(scope=>scope.is_active&&canAccess(db,actorId,'scopes',scope));
 return <Form busy={busy} submit="ثبت سرنخ و ایجاد پرونده" onSubmit={async fields=>{const result=await run('createLead',fields);if(result?.id)onCreated(result);}}>
  <Field name="lead_type" title="نوع سرنخ" value={type} onChange={e=>setType(e.target.value)} required options={[{id:'PROPERTY',name:'ثبت ملک و فایل'},{id:'INQUIRY',name:'درخواست متقاضی'}]}/>
  <Field name="initial_contact_name" title="نام تماس‌گیرنده" required/>
  {manager&&type==='PROPERTY'&&<Field name="title" title="عنوان ملک"/>}
  <Field name="initial_contact_phone" title="شماره تماس" required pattern="[0-9۰-۹]{11}"/>
  {manager&&<Field name="management_scope_id" title="رنج مسئول" options={scopes} required/>}
  {type==='INQUIRY'&&<Field name="deal_type_id" title="نوع معامله مورد تقاضا" options={db.dealTypes.filter(t=>t.is_active)} required/>}
  {manager&&<Field name="due_at" title="موعد اولیه" type="datetime-local" calendar/>}
  <Field name="description" title="شرح اولیه سرنخ" type="textarea"/>
 </Form>;
}
