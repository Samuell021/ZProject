import {person} from '../components/ui';
import {inquiryWizardSteps,inquiryWizardStage,inquiryStageResponsible} from '../services/inquiry-wizard';
import PropertyCasePanels from './PropertyCasePanels';
import PropertyHistoryModal from './PropertyHistoryModal';
import PropertyCaseStatus from './PropertyCaseStatus';
import {canAccess} from '../services/operations';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import { Empty, num, remaining } from '../components/ui';
import { propertyWizardStage, propertyWizardSteps, propertyStageResponsible } from '../services/property-wizard';
import './property-registration-wizard.css';
export default function PropertyRequestsList({ db, rows, actorId, run, busy, renderAction, pageType="requests" }) {
 const [q,setQ]=useSearchParams();
 const inquiry=pageType==="inquiries",collection=inquiry?"inquiries":"registrationRequests",steps=inquiry?inquiryWizardSteps:propertyWizardSteps,stageFor=inquiry?inquiryWizardStage:propertyWizardStage,responsible=inquiry?inquiryStageResponsible:propertyStageResponsible;
 const openModal=(key,id)=>{const next=new URLSearchParams(q);next.delete('historyCase');next.delete('caseStatus');next.delete('workCase');next.delete('activityAction');next.delete('activityRecord');next.delete('postponeTask');next.delete('commercialAction');next.delete('commercialRecord');next.set(key,id);setQ(next);};
 const modalRequest=key=>db[collection].find(r=>r.id===q.get(key)&&canAccess(db,actorId,collection,r));
 const historyRequest=modalRequest('historyCase'),statusRequest=modalRequest('caseStatus'),workRequest=modalRequest('workCase');
 const selected=q.get('flowStage')||'';
 const filtered=selected?rows.filter(r=>stageFor(db,r)===selected):rows;
 const total=Math.max(1,Math.ceil(filtered.length/8));
 const page=Math.max(1,Math.min(total,Number(q.get('p'))||1));
 const update=(key,value)=>{const next=new URLSearchParams(q);value?next.set(key,String(value)):next.delete(key);if(key!=='p')next.delete('p');setQ(next);};
 return <div className={`property-requests-list ${inquiry?"inquiry-requests-list":""}`}>
  <div className="requests-list-intro"><div><h2>پرونده‌ها در یک مسیر مشخص</h2><p className="muted">مرحله و مسئول هر پرونده را ببینید و از همان‌جا ادامه دهید.</p></div></div>
  <div className="requests-stage-filters" role="group" aria-label="فیلتر مرحله پرونده">
   <button className={!selected?'':'secondary'} aria-pressed={!selected} onClick={()=>update('flowStage','')}>همه پرونده‌ها <span>{num(rows.length)}</span></button>
   {[...steps,['closed','بسته‌شده']].map(([key,title])=>{
    const count=rows.filter(r=>stageFor(db,r)===key).length;
    return (count>0||key!=='closed')&&<button key={key} className={selected===key?'':'secondary'} aria-pressed={selected===key} onClick={()=>update('flowStage',key)}>{title} <span>{num(count)}</span></button>;
   })}
  </div>
  {!filtered.length?<Empty/>:<div className="requests-case-list">{filtered.slice((page-1)*8,page*8).map(request=>{
   const stage=stageFor(db,request),index=steps.findIndex(([key])=>key===stage);
   const title=steps[index]?.[1]||'پرونده بسته شده';
   const href=`/${pageType}/${request.id}`;
   return <article className="request-flow-card" key={request.id}>
    <div className="request-card-heading"><div><small>{request.code} · {db.scopes.find(s=>s.id===request.management_scope_id)?.name}</small><h3><Link to={href}>{inquiry?(request.initial_contact_name||person(db,request.contact_id)):request.title||request.initial_contact_name||'پرونده ملک'}</Link></h3></div><span className="badge">{title}</span></div>
    <div className="request-card-meta"><span>{inquiry?"متقاضی":"مالک / تماس"}: {request.initial_contact_name||person(db,request.contact_id)||'ثبت نشده'}</span><span>مسئول مرحله: <strong>{stage==='closed'?'—':responsible(db,request,stage)}</strong></span>{request.due_at&&stage!=='listing'&&stage!=='closed'&&<span>موعد: {remaining(request.due_at)}</span>}</div>
    {stage!=='closed'&&<ol className="request-mini-steps" aria-label={`مراحل ${request.code}`}>{steps.map(([key,name],i)=><li key={key} aria-current={key===stage?'step':undefined} className={i<index?'is-complete':''}><span>{i<index?<Check size={14} aria-hidden="true"/>:num(i+1)}</span><small>{name}</small></li>)}</ol>}
    <div className="request-card-footer"><div><span className="muted">{stage==='closed'?'پرونده و سابقه آن حفظ شده است.':`مرحله ${num(index+1)} از ${num(steps.length)} · ${title}`}</span><div className="case-tools"><button className="secondary" onClick={()=>openModal('caseStatus',request.id)}>{inquiry?"وضعیت درخواست":"وضعیت ملک"}</button><button className="secondary" onClick={()=>openModal('historyCase',request.id)}>سوابق</button><button className="secondary" onClick={()=>openModal('workCase',request.id)}>پیگیری کار</button></div></div><Link className="button secondary" to={href}>{stage==='closed'?'مشاهده پرونده':'مشاهده و ادامه مسیر'}<ArrowLeft size={16} aria-hidden="true"/></Link></div>
   </article>;
  })}</div>}
  <nav className="pagination" aria-label={inquiry?"صفحه‌بندی درخواست‌های متقاضیان":"صفحه‌بندی پرونده‌های ملک"}><span>{num(filtered.length)} پرونده · صفحه {num(page)} از {num(total)}</span><div className="toolbar"><button className="secondary" disabled={page===1} onClick={()=>update('p',page-1)}>قبلی</button><button className="secondary" disabled={page===total} onClick={()=>update('p',page+1)}>بعدی</button></div></nav>
  {workRequest&&<PropertyCasePanels key={workRequest.id} db={db} actorId={actorId} request={workRequest} run={run} busy={busy} renderAction={renderAction} page={pageType} modal/>}
  {historyRequest&&<PropertyHistoryModal key={historyRequest.id} db={db} actorId={actorId} request={historyRequest} parameter="historyCase" collection={collection} run={run} busy={busy}/>}
  {statusRequest&&<PropertyCaseStatus key={statusRequest.id} db={db} actorId={actorId} request={statusRequest} page={pageType} run={run} busy={busy}/>}
 </div>;
}
