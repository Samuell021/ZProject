import CaseExtensionStatus from '../components/CaseExtensionStatus';
import {pendingWithdrawal} from '../services/intake';
import InquiryStageActivities from './InquiryStageActivities';
import PropertyCommercialActions,{commercialActions} from './PropertyCommercialActions';
import {propertyCommercialHistory} from '../services/property-commercial-history';
import React from 'react';
import {Link,useNavigate,useSearchParams} from 'react-router-dom';
import {Field,Form,Modal,staff,person,num,money} from '../components/ui';
import PropertyJourney from '../components/PropertyJourney';
import PropertyCasePanels from './PropertyCasePanels';
import PropertyCasePicker from './PropertyCasePicker';
import PropertyCaseStatus from './PropertyCaseStatus';
import InquiryRegistrationWizard from './InquiryRegistrationWizard';
import InquiryNeedsEditor from './InquiryNeedsEditor';
import InquiryMatching from './InquiryMatching';
import {CaseIntakeActions} from './IntakeWorkspace';
import {canAccess} from '../services/operations';
import {canManageCase,canReassign} from '../services/intake';
import {activityOpen} from '../services/activities';
import {inquiryWizardStage,inquiryWizardSteps,inquiryStageResponsible} from '../services/inquiry-wizard';
import './property-registration-wizard.css';
export default function InquiryFlowWizard({db,actorId,run,busy,renderAction,requestId}){
 const [q,setQ]=useSearchParams(),navigate=useNavigate(),id=requestId||q.get('case');
 const inquiry=db.inquiries.find(r=>r.id===id),allowed=inquiry&&canAccess(db,actorId,'inquiries',inquiry);
 const stage=allowed?inquiryWizardStage(db,inquiry):'lead',steps=inquiryWizardSteps;
 const selected=steps.some(([key])=>key===q.get('stage'))?q.get('stage'):stage;
 const current=steps.findIndex(([key])=>key===stage),selectedIndex=steps.findIndex(([key])=>key===selected);
 const manager=allowed&&canManageCase(db,actorId,inquiry),mine=allowed&&inquiry.assigned_to_id===actorId;
 const active=allowed&&activityOpen(db,'inquiries',inquiry);
 const open=(key,value='1')=>{const next=new URLSearchParams(q);next.set(key,value);setQ(next);};
 const clear=keys=>{const next=new URLSearchParams(q);for(const key of keys)next.delete(key);setQ(next);};
 const execute=async(name,payload)=>{const result=await run(name,payload);if(result&&['acceptLead','assignCase','acceptAssignment','rejectAssignment','saveInquiryNeeds'].includes(name))clear(['stage','editNeeds']);return result;};
 const choose=value=>navigate(value?`/inquiries/${value}`:'/inquiry-register');
 const preferences=allowed?db.inquiryPreferences.filter(p=>p.inquiry_id===id):[];
 const history=()=>open('casePanel','history');
 const events=allowed?propertyCommercialHistory(db,actorId,id,'inquiries'):{introductions:[],viewings:[],deals:[],contracts:[]};
 const canChooseVisit=active&&events.introductions.length>0;
 const canChooseNegotiation=active&&(events.deals.length>0||events.viewings.some(v=>commercialActions(db,actorId,'viewings',v.id).some(([name])=>name==='createDeal')));
 const activities=key=><InquiryStageActivities stage={key} db={db} inquiry={inquiry} actorId={actorId} run={execute} busy={busy}/>;
 const pendingVisits=allowed?db.viewings.filter(v=>v.status==='SCHEDULED'&&db.introductions.some(i=>i.id===v.introduction_id&&i.inquiry_id===id)).length:0;
 const introduced=allowed&&db.introductions.some(i=>i.inquiry_id===id&&!['REJECTED','CANCELLED'].includes(i.status));
 const summary=allowed&&<div className="inquiry-needs-summary"><p>متراژ: {num(inquiry.min_area||0)} تا {inquiry.max_area?num(inquiry.max_area):'بدون سقف'} · حداقل اتاق: {num(inquiry.min_rooms||0)}</p>{preferences.map(p=><p key={p.id}>{db.dealTypes.find(t=>t.id===p.deal_type_id)?.name} · {Number(p.max_sale_price)>0?`بودجه خرید ${money(p.max_sale_price)}`:Number(p.max_deposit)>0||Number(p.max_monthly_rent)>0?`ودیعه ${money(p.max_deposit)} · اجاره ${money(p.max_monthly_rent)}`:'بودجه تعیین نشده'}</p>)}<p>{inquiry.notes||inquiry.description}</p></div>;
 return <div className="property-flow inquiry-flow">
  {requestId&&<Link className="back-link" to="/inquiries">→ بازگشت به درخواست‌های متقاضیان</Link>}
  <section className={`panel flow-navigation ${id?'has-case':''}`}><div><h2>{id?`مسیر درخواست ${inquiry?.code||'متقاضی'}`:'ثبت درخواست از سرنخ تا قرارداد'}</h2><p className="muted">نیاز متقاضی و اقدام بعدی مشخص است؛ هر فایل معرفی‌شده مسیر مستقل خود را دارد.</p></div>
   <div className="toolbar wrap flow-header-actions"><button onClick={()=>choose('')}>ثبت جدید</button><button className="secondary" onClick={()=>open('chooseCase')}>پرونده‌ها</button>{allowed&&<><button className="secondary" onClick={history}>سوابق</button><button className="secondary" onClick={()=>open('caseStatus')}>وضعیت درخواست</button></>}</div>
  </section>
  {q.get('chooseCase')==='1'&&<PropertyCasePicker db={db} records={db.inquiries.filter(r=>canAccess(db,actorId,'inquiries',r)).map(r=>({...r,title:r.initial_contact_name||person(db,r.contact_id)}))} currentId={id} onChoose={choose} pageType="inquiries"/>}
  {allowed&&q.get('caseStatus')==='1'&&<PropertyCaseStatus db={db} request={inquiry} actorId={actorId} run={execute} busy={busy} page="inquiries"/>}
  {allowed&&q.get('inquiryIntake')==='1'&&<Modal title="ارجاع و مهلت درخواست" parameter="inquiryIntake"><CaseIntakeActions db={db} actorId={actorId} row={inquiry} collection="inquiries" run={execute} busy={busy}/></Modal>}
  <div className={`property-case-layout ${allowed?'has-work':''}`}><div className="property-case-main">
   <PropertyJourney db={db} request={allowed?inquiry:null} page="inquiries" inline/>
   {!id?<InquiryRegistrationWizard db={db} actorId={actorId} run={execute} busy={busy} onCreated={choose}/>:!allowed?<section className="panel"><p role="alert">درخواست پیدا نشد یا دسترسی به آن مجاز نیست.</p></section>:<section className="panel flow-current" aria-labelledby="inquiry-current-title">
    <div className="section-head"><div><small>{inquiry.code}</small><h2 id="inquiry-current-title">{stage==='closed'?'درخواست بسته شده':steps[selectedIndex]?.[1]}</h2></div><span className="badge">مسئول این مرحله: {stage==='closed'?'—':inquiryStageResponsible(db,inquiry,selected)}</span></div>
    <CaseExtensionStatus db={db} actorId={actorId} request={inquiry} collection="inquiries"/>
    <p><strong>متقاضی: {inquiry.initial_contact_name||person(db,inquiry.contact_id)}</strong></p>
    {selected!==stage&&((selected==='viewings'&&canChooseVisit)||(selected==='negotiation'&&canChooseNegotiation))?<>{activities(selected)}<button className="secondary" onClick={()=>clear(['stage'])}>رفتن به مرحله فعلی درخواست</button></>:selected!==stage?<><p>{selectedIndex<current?'این بخش برای مرور مسیر است؛ فعالیت‌های هر فایل را در سوابق ببینید.':'اقدام این مرحله پس از تکمیل پیش‌نیازها نمایش داده می‌شود.'}</p>{selected==='matching'&&active&&inquiry.needs_status!=='DRAFT'?<>{activities('matching')}<InquiryMatching db={db} inquiry={inquiry} actorId={actorId} run={execute} busy={busy} onHistory={history}/></>:selected==='needs'&&active?<InquiryNeedsEditor db={db} inquiry={inquiry} run={execute} busy={busy}/>:summary}<button onClick={()=>clear(['stage'])}>رفتن به مرحله فعلی درخواست</button></>:<>
     {stage==='reception'&&(manager?<><p>اطلاعات اولیه را بررسی کنید و درخواست را برای ارجاع بپذیرید.</p>{summary}<button disabled={busy} onClick={()=>execute('acceptLead',{collection:'inquiries',id})}>پذیرش درخواست و ادامه</button></>:<p role="status">درخواست ثبت شده و منتظر پذیرش مدیر رنج است.</p>)}
     {stage==='assignment'&&(manager&&canReassign(db,'inquiries',inquiry)?<><p>مشاور مسئول و موعد رسیدگی را مشخص کنید.</p>{inquiry.rejection_reason&&<p className="alert error">{inquiry.rejection_reason}</p>}{renderAction('assign',inquiry,execute)}</>:<p role="status">مدیر رنج باید مشاور مسئول را تعیین کند.</p>)}
     {stage==='acceptance'&&(pendingWithdrawal(db,'inquiries',inquiry)?<p role="status">درخواست انصراف شما در انتظار تصمیم مدیر است؛ مسئول پرونده هنوز تغییر نکرده است.</p>:mine?<><p>با پذیرش، رسیدگی به نیاز این متقاضی را آغاز می‌کنید.</p><button disabled={busy} onClick={()=>execute('acceptAssignment',{collection:'inquiries',id})}>پذیرش و شروع رسیدگی</button><p><button className="secondary" onClick={()=>open('inquiryIntake')}>درخواست انصراف یا بررسی مهلت</button></p></>:<p role="status">در انتظار پذیرش {staff(db,inquiry.assigned_to_id)}</p>)}
     {stage==='needs'&&(active?<><p>نیاز و بودجه را ثبت کنید تا پیشنهادهای فایل متناسب نمایش داده شوند.</p><InquiryNeedsEditor db={db} inquiry={inquiry} run={execute} busy={busy}/></>:<p>تکمیل نیاز بر عهده مشاور مسئول است.</p>)}
     {['matching','viewings','negotiation','contract'].includes(stage)&&<>
      {summary}
      {stage==='matching'?q.get('editNeeds')==='1'&&active?<InquiryNeedsEditor db={db} inquiry={inquiry} run={execute} busy={busy}/>:<>
       {active&&<button className="secondary" onClick={()=>open('editNeeds')}>ویرایش نیاز و بودجه</button>}
       {introduced&&activities('matching')}
       {active?<InquiryMatching db={db} inquiry={inquiry} actorId={actorId} run={execute} busy={busy} onHistory={history}/>:<p>جست‌وجو و معرفی برای درخواست بسته فعال نیست.</p>}
      </>:['viewings','negotiation','contract'].includes(stage)?<>{activities(stage)}{stage==='contract'&&pendingVisits>0&&<p className="muted">{num(pendingVisits)} بازدید دیگر برای پیگیری در مرحله بازدید باقی مانده است.</p>}</>:<div className="flow-next-action"><strong>الان چه کاری انجام بدهم؟</strong><p>{inquiry.status==='COMPLETED'?'درخواست با قرارداد قطعی تکمیل شده است؛ سوابق حفظ می‌شوند.':'مذاکره موفق آماده قرارداد است؛ تنظیم قرارداد فقط در اختیار مدیرکل است.'}</p><button onClick={history}>مشاهده سوابق و قرارداد</button>
       {pendingVisits>0&&<p className="muted">{num(pendingVisits)} بازدید دیگر هم برای پیگیری در سوابق باقی مانده است.</p>}
      </div>}

     </>}
     {stage==='closed'&&<><p>{inquiry.closure_reason||'رسیدگی به این درخواست پایان یافته است؛ اطلاعات و سوابق حفظ شده‌اند.'}</p><button className="secondary" onClick={history}>مشاهده سوابق درخواست</button></>}
    </>}
   </section>}
  </div>{allowed&&<PropertyCasePanels db={db} request={inquiry} actorId={actorId} run={execute} busy={busy} renderAction={renderAction} page="inquiries"/>}</div>
  {allowed&&q.get('casePanel')!=='history'&&<PropertyCommercialActions key={q.get('commercialAction')+q.get('commercialRecord')} db={db} actorId={actorId} rows={events} run={execute} busy={busy}/>}
 </div>;
}
