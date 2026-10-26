import CaseExtensionStatus from '../components/CaseExtensionStatus';
import {pendingWithdrawal} from '../services/intake';
import PropertyCaseStatus from "./PropertyCaseStatus";
import PropertyCasePanels from "./PropertyCasePanels";
import PropertyCasePicker from "./PropertyCasePicker";
import {showError} from "../services/alerts";
import PropertyJourney from "../components/PropertyJourney";
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import PropertyRegistrationWizard from './PropertyRegistrationWizard';
import { ListingEditor } from './PropertyWorkspace';
import SelectBox from '../components/SelectBox';
import { Field, Form, num, staff } from '../components/ui';
import { canAccess } from '../services/operations';
import { canManageCase, canReassign } from '../services/intake';
import { canUseAction } from '../services/action-availability';
import { canEditPropertyListings } from '../services/property-listings';
import { propertyStageResponsible, propertyWizardStage, propertyWizardSteps } from '../services/property-wizard';
import './property-registration-wizard.css';

export default function PropertyFlowWizard({ db, actorId, run, busy, renderAction, requestId }) {
 const [q,setQ]=useSearchParams();
 const navigate=useNavigate();
 const [listingType,setListingType]=useState('');
 const id=requestId||q.get('case');
 const request=db.registrationRequests.find(r=>r.id===id);
 const permitted=request&&(canAccess(db,actorId,'registrationRequests',request)||request.created_by_id===actorId);
 const accessible=db.registrationRequests.filter(r=>r.created_by_id===actorId||canAccess(db,actorId,'registrationRequests',r));
 const choose=value=>{if(requestId){navigate(value?`/requests/${value}`:'/property-register');}else{const next=new URLSearchParams();if(value)next.set('case',value);setQ(next);}setListingType('');};
 const execute=async(name,payload)=>{try{const result=await run(name,payload);if(result&&(q.has('stage')||name==='saveWorkspace')){const next=new URLSearchParams(q);next.delete('stage');if(name==='saveWorkspace')next.delete('edit');setQ(next,{replace:true});}return result;}catch(e){void showError(e.message);return null;}};
 const stage=permitted?propertyWizardStage(db,request):'lead';
 const current=propertyWizardSteps.findIndex(([key])=>key===stage);
 const selected=propertyWizardSteps.some(([key])=>key===q.get('stage'))?q.get('stage'):stage;
 const selectedIndex=propertyWizardSteps.findIndex(([key])=>key===selected);
 const viewingOther=selected!==stage;
 const returnToCurrent=()=>{const next=new URLSearchParams(q);next.delete('stage');setQ(next);};
 const property=permitted&&db.properties.find(p=>p.id===request.resulting_property_id);
 const manager=permitted&&canManageCase(db,actorId,request);
 const recordAccess=permitted&&canAccess(db,actorId,'registrationRequests',request);
 const mine=recordAccess&&request.assigned_to_id===actorId;
 const listingEdit=property&&canEditPropertyListings(db,actorId,property);
 const listings=property?db.listings.filter(l=>l.property_id===property.id&&canAccess(db,actorId,'listings',l)):[];
 const type=listingType||db.dealTypes.find(t=>t.is_active)?.id||'';
 const existing=listings.find(l=>l.deal_type_id===type);
 const readyForReview=permitted&&canUseAction(db,actorId,'requests',request,'submitPropertyForReview');
 const editing=q.get('edit')==='workspace';
 const openEditor=()=>{const next=new URLSearchParams(q);next.set('edit','workspace');setQ(next);};
 const openReview=()=>{const next=new URLSearchParams(q);next.set('reviewRequest',request.id);setQ(next);};
 const openPanel=panel=>{const next=new URLSearchParams(q);next.set('casePanel',panel);for(const key of ['activityAction','activityRecord','postponeTask'])next.delete(key);setQ(next);};
 const responsible=permitted?propertyStageResponsible(db,request,selected):'ثبت‌کننده';
 return <div className="property-flow">
  {requestId&&<Link className="back-link" to="/requests">→ بازگشت به پرونده‌های ثبت ملک</Link>}
  <section className={`panel flow-navigation ${id?'has-case':''}`}><div><h2>{requestId?`مسیر پرونده ${request?.code||'ملک'}`:'ثبت ملک از سرنخ تا عرضه'}</h2><p className="muted">هر مرحله را مسئول همان کار انجام می‌دهد؛ ادامه مسیر با همان پرونده حفظ می‌شود.</p></div>
   <div className="toolbar wrap flow-header-actions"><button type="button" onClick={()=>choose('')}>ثبت جدید</button><button type="button" className="secondary" onClick={()=>{const next=new URLSearchParams(q);next.set('chooseCase','1');setQ(next);}}>پرونده‌ها</button>{recordAccess&&<><button className="secondary" onClick={()=>openPanel('history')}>سوابق</button><button className="secondary" onClick={()=>{const next=new URLSearchParams(q);next.set('caseStatus','1');setQ(next);}}>وضعیت پرونده</button></>}</div>
  </section>
  {recordAccess&&q.get('caseStatus')==='1'&&<PropertyCaseStatus db={db} request={request} actorId={actorId} run={execute} busy={busy}/>}
  {q.get('chooseCase')==='1'&&<PropertyCasePicker db={db} records={accessible} currentId={id} onChoose={choose}/>}
  <div className={`property-case-layout ${recordAccess?'has-work':''}`}><div className="property-case-main">
  <PropertyJourney db={db} request={permitted?request:null} inline/>
  {!id?<PropertyRegistrationWizard key={actorId} db={db} actorId={actorId} run={execute} busy={busy} onCreated={result=>choose(result.id)}/>:!permitted?<section className="panel"><p role="alert">پرونده پیدا نشد یا دسترسی به آن مجاز نیست.</p></section>:<>
   <section className="panel flow-current" aria-labelledby="flow-current-title"><div className="section-head"><div><small>{request.code}</small><h2 id="flow-current-title">{stage==='closed'?'پرونده بسته شده':propertyWizardSteps[viewingOther?selectedIndex:current]?.[1]}</h2></div><span className="badge">مسئول این مرحله: {responsible}</span></div>
    <CaseExtensionStatus db={db} actorId={actorId} request={request} collection="registrationRequests"/>
    <p>{request.title||request.initial_contact_name}</p>
    {viewingOther?<>
      <p>{selectedIndex<current?'این مرحله انجام شده است؛ مرور سابقه، وضعیت فعلی پرونده را تغییر نمی‌دهد.':'این مرحله در مسیر پرونده قرار دارد؛ اقدام آن پس از تکمیل پیش‌نیازها در دسترس خواهد بود.'}</p>
      <p><b>مسئول مرحله:</b> {propertyStageResponsible(db,request,selected)}</p>
      {selected==='lead'&&<><p>ثبت‌کننده: {staff(db,request.created_by_id)}</p><p className="flow-description">{request.description||'توضیحات اولیه ثبت نشده است.'}</p></>}
      {selected==='reception'&&request.lead_accepted_by_id&&<p>پذیرش توسط: {staff(db,request.lead_accepted_by_id)}</p>}
      {['assignment','acceptance'].includes(selected)&&request.assigned_to_id&&<p>مشاور فعلی: {staff(db,request.assigned_to_id)}</p>}
      {selected==='appraisal'&&recordAccess&&property&&<><p>متراژ: {num(property.area)}</p><p>{db.appraisals.find(a=>a.property_id===property.id)?.findings}</p></>}
      {selected==='review'&&recordAccess&&property&&<p>{property.review_status==='APPROVED'?'ملک تأیید شده است.':property.review_reason||'تصمیم نهایی هنوز ثبت نشده است.'}</p>}
      {selected==='listing'&&listings.map(l=><p key={l.id}><Link target="_blank" rel="noopener noreferrer" to={`/listings/${l.id}`}>{l.code}</Link></p>)}
      <button onClick={returnToCurrent}>رفتن به مرحله فعلی پرونده</button>
     </>:<>
    {stage==='reception'&&(manager?<><p>اطلاعات اولیه را بررسی کنید و برای آماده‌شدن ارجاع، سرنخ را بپذیرید.</p><p className="flow-description">{request.description||'توضیحات اولیه ثبت نشده است.'}</p><button disabled={busy} onClick={()=>execute('acceptLead',{id,collection:'registrationRequests'})}>پذیرش سرنخ و ادامه</button></>:<p role="status">سرنخ ثبت شده و منتظر پذیرش مدیر رنج است. در این مرحله کاری از طرف شما لازم نیست.</p>)}
    {stage==='assignment'&&(manager&&canReassign(db,'registrationRequests',request)?<><p>مشاور مسئول و موعد رسیدگی را مشخص کنید.</p>{request.rejection_reason&&<p className="alert error">دلیل رد ارجاع: {request.rejection_reason}</p>}{renderAction('assign',request,execute)}</>:<p role="status">مدیر رنج باید مشاور مسئول را تعیین کند.</p>)}
    {stage==='acceptance'&&(pendingWithdrawal(db,'registrationRequests',request)?<p role="status">درخواست انصراف شما در انتظار تصمیم مدیر است؛ مسئول پرونده هنوز تغییر نکرده است.</p>:mine?<><p>با پذیرش ارجاع، مسئولیت کارشناسی این ملک را می‌پذیرید.</p><button disabled={busy} onClick={()=>execute('acceptAssignment',{id,collection:'registrationRequests'})}>پذیرش و شروع کارشناسی</button><details><summary>درخواست انصراف</summary><Form busy={busy} submit="ارسال درخواست انصراف" onSubmit={fields=>execute('rejectAssignment',{id,collection:'registrationRequests',reason:fields.reason})}><Field name="reason" title="دلیل انصراف" type="textarea" required/></Form></details></>:<><p role="status">در انتظار پذیرش {staff(db,request.assigned_to_id)}؛ پس از پذیرش، مرحله کارشناسی باز می‌شود.</p>{manager&&canReassign(db,'registrationRequests',request)&&<details><summary>ارجاع مجدد پس از پایان مهلت پاسخ</summary>{renderAction('assign',request,execute)}</details>}</>)}
    {stage==='appraisal'&&(canUseAction(db,actorId,'requests',request,'workspace')?<>
      {property?.review_reason&&<p className="alert error">دلیل برگشت برای اصلاح: {property.review_reason}</p>}
      <div className="flow-next-action"><strong>الان چه کاری انجام بدهم؟</strong><p>{editing?'مشخصات و گزارش بازدید را کامل کنید و ذخیره را بزنید.':readyForReview?'اطلاعات ذخیره شده است؛ آن را مرور کنید و برای مدیر بفرستید.':'از ملک بازدید کنید و مشخصات و گزارش بررسی را ثبت کنید.'}</p>
      {!editing&&(readyForReview?<button disabled={busy} onClick={openReview}>مرور و ارسال برای مدیر</button>:<button onClick={openEditor}>تکمیل اطلاعات و گزارش بازدید</button>)}</div>
      {editing?renderAction('workspace',request,execute):readyForReview&&<details className="flow-secondary"><summary>اصلاح اطلاعات ذخیره‌شده</summary><button className="secondary" onClick={openEditor}>ویرایش مشخصات و گزارش</button></details>}
     </>:<p role="status">کارشناسی و تکمیل اطلاعات بر عهده {staff(db,request.assigned_to_id)} است.</p>)}
    {stage==='review'&&(manager&&property?<>
      <p>ملک و گزارش کارشناسی را بررسی کنید. تأیید، پرونده را آماده ساخت فایل عرضه می‌کند.</p>
      <dl className="wizard-summary"><div><dt>نشانی</dt><dd>{property.address}</dd></div><div><dt>متراژ</dt><dd>{num(property.area)}</dd></div><div><dt>اتاق</dt><dd>{num(property.rooms)}</dd></div><div><dt>منطقه</dt><dd>{db.districts.find(d=>d.id===property.district_id)?.name}</dd></div><div className="wizard-full"><dt>گزارش کارشناسی</dt><dd>{db.appraisals.find(a=>a.property_id===property.id)?.findings}</dd></div></dl>
      <button disabled={busy||!property.title?.trim()} onClick={()=>execute('reviewProperty',{id:property.id,decision:'APPROVED'})}>تأیید ملک و ادامه</button>
      {!property.title?.trim()&&<p className="muted">برای تأیید، ابتدا عنوان ملک را در بخش زیر تعیین کنید.</p>}
      <details open={!property.title}><summary>تعیین یا اصلاح عنوان ملک</summary>{renderAction('propertyTitle',request,execute)}</details>
      <details><summary>برگشت برای اصلاح</summary><Form busy={busy} submit="برگشت به کارشناس" onSubmit={fields=>execute('reviewProperty',{id:property.id,decision:'CHANGES_REQUIRED',reason:fields.reason})}><Field name="reason" title="دلیل اصلاح" type="textarea" required/></Form></details>
     </>:<p role="status">اطلاعات برای مدیر رنج ارسال شده و منتظر تصمیم اوست.</p>)}
    {stage==='listing'&&<><p>{listings.length?'ملک تأیید شده و فایل‌های زیر ثبت شده‌اند. برای نوع دیگر می‌توانید فایل مستقل بسازید.':'ملک تأیید شده است. اکنون مشاور مسئول می‌تواند شرایط فایل عرضه را ثبت کند.'}</p>
      {listings.map(l=><p key={l.id}><Link target="_blank" rel="noopener noreferrer" to={`/listings/${l.id}`}>{l.code} · {db.dealTypes.find(t=>t.id===l.deal_type_id)?.name}</Link> · {l.status==='ACTIVE'?'فعال':'متوقف'}</p>)}
      {listingEdit?<><label className="field">نوع معامله<SelectBox aria-label="نوع معامله فایل" value={type} onChange={e=>setListingType(e.target.value)}>{db.dealTypes.filter(t=>t.is_active).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</SelectBox></label>
       {type&&<ListingEditor key={`${id}:${type}:${existing?.version||0}`} db={db} actorId={actorId} property={property} existing={existing} typeId={type} run={execute} busy={busy} onSaved={()=>{}}/>}</>:<p role="status">ثبت شرایط عرضه بر عهده مشاور مسئول است.</p>}
     </>}
    {stage==='closed'&&<p>این پرونده بسته، لغو یا تکراری تشخیص داده شده است؛ ادامه مراحل عملیاتی مجاز نیست و سابقه حفظ شده است.</p>}
    </>}
   </section>
  </>}
  </div>{recordAccess&&<PropertyCasePanels db={db} request={request} actorId={actorId} run={execute} busy={busy} renderAction={renderAction}/>}</div>
 </div>;
}
