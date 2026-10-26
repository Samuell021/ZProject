import {inquiryRelations,inquiryStatusActions} from '../services/inquiry-status';
import React,{useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Modal,Form,Field,Badge,date} from '../components/ui';
import {canAccess} from '../services/operations';
import {canManageCase} from '../services/intake';
import {caseRelations,caseStatusActions,terminalCaseStatuses} from '../services/case-status';
const names={CLOSED:'بستن پرونده',CANCELLED:'لغو پرونده',DUPLICATE:'ثبت به‌عنوان تکراری',REOPEN:'بازگشایی برای رسیدگی'};
export default function PropertyCaseStatus({db,request,actorId,run,busy,page="requests"}) {
 const [q,setQ]=useSearchParams();
 const inquiry=page==="inquiries",collection=inquiry?"inquiries":"registrationRequests";
 const actions=(inquiry?inquiryStatusActions:caseStatusActions)(db,actorId,request);
 const [selected,setSelected]=useState(actions[0]||'');
 const chosen=actions.includes(selected)?selected:actions[0]||'';
 const manager=canManageCase(db,actorId,request);
 const related=(inquiry?inquiryRelations:caseRelations)(db,request);
 const close=()=>{const next=new URLSearchParams(q);next.delete('caseStatus');setQ(next);};
 if(!canAccess(db,actorId,collection,request))return null;
 const originals=db[collection].filter(r=>r.id!==request.id&&(!request.resulting_property_id||r.resulting_property_id!==request.resulting_property_id)&&!terminalCaseStatuses.includes(r.status)&&(!inquiry||r.status!=='COMPLETED')&&canAccess(db,actorId,collection,r));
 return <Modal title="وضعیت پرونده" parameter="caseStatus">
  <p>پرونده {request.code} · <Badge value={request.status}/></p>
  {request.closure_reason&&<p>دلیل آخرین تعیین تکلیف: {request.closure_reason}</p>}
  {!manager?<p className="muted">تغییر وضعیت پرونده در اختیار مدیر رنج مسئول یا مدیر کل است.</p>:related.locked?<p className="alert error">این پرونده قرارداد قطعی یا امضاشده دارد؛ لغو و بستن از این مسیر مجاز نیست. سوابق قرارداد حفظ می‌شود.</p>:inquiry&&related.contracts.some(c=>c.status!=="CANCELLED")&&!actions.length?<p className="muted">این درخواست قرارداد در حال تنظیم دارد؛ تعیین تکلیف آن با مدیرکل است.</p>:actions.length?<Form key={chosen} busy={busy} submit={names[chosen]} onSubmit={async fields=>{
    const result=await run(inquiry?'changeInquiryCaseStatus':'changePropertyCaseStatus',{id:request.id,status:chosen,reason:fields.reason,...(chosen==='DUPLICATE'?{original_id:fields.original_id}:{}),...(chosen==='REOPEN'&&fields.due_at?{due_at:fields.due_at}:{})});if(result)close();
   }}>
    <Field name="status" title="اقدام موردنظر" required value={chosen} onChange={e=>setSelected(e.target.value)} options={actions.map(id=>({id,name:names[id]}))}/>
    {chosen==='DUPLICATE'&&<Field name="original_id" title="پرونده اصلی" required options={originals.map(r=>({id:r.id,name:`${r.code} · ${r.title||r.initial_contact_name||'پرونده ملک'}`}))}/>}
    <Field name="reason" title="دلیل تغییر وضعیت" type="textarea" required/>
    {chosen==='REOPEN'&&<Field name="due_at" title="موعد رسیدگی دوباره (اختیاری)" type="datetime-local" calendar/>}
    <p className="muted full-width">{inquiry?(chosen==='REOPEN'?'درخواست برای رسیدگی دوباره باز می‌شود؛ معرفی، بازدید و مذاکره قبلی خودکار فعال نمی‌شوند.':'فقط فعالیت‌های همین متقاضی بسته می‌شوند؛ فایل عرضه ملک برای متقاضیان دیگر فعال می‌ماند.'):chosen==='REOPEN'?'پرونده برای رسیدگی و تأیید مجدد باز می‌شود؛ فایل‌های عرضه، قرارها و مذاکرات قبلی خودکار فعال نمی‌شوند.':'فایل‌های عرضه متوقف و کارها، پیگیری‌ها، بازدیدها و مذاکرات باز مرتبط تعیین تکلیف می‌شوند؛ داده و سوابق حذف نمی‌شوند.'}</p>
   </Form>:<p className="muted">تغییر وضعیت دیگری در این مرحله مجاز نیست؛ سوابق پرونده قابل مشاهده است.</p>}
  {!inquiry&&manager&&!terminalCaseStatuses.includes(request.status)&&related.listings.some(l=>['ACTIVE','PAUSED'].includes(l.status))&&<section className="listing-status-section"><h3>توقف عرضه فایل مشخص</h3><p className="muted">توقف یک فایل، پرونده ملک و فایل‌های دیگر را نمی‌بندد.</p>{related.listings.filter(l=>['ACTIVE','PAUSED'].includes(l.status)).map(listing=><div className="section-head" key={listing.id}><span>{listing.code} · {db.dealTypes.find(t=>t.id===listing.deal_type_id)?.name} · <Badge value={listing.status}/></span><button className="secondary" disabled={busy||listing.status!=='ACTIVE'} onClick={()=>run('setListingStatus',{id:listing.id,status:'PAUSED'})}>{listing.status==='ACTIVE'?'توقف عرضه':'متوقف شده'}</button></div>)}</section>}
  {!!request.case_status_history?.length&&<section><h3>سابقه تعیین تکلیف</h3>{[...request.case_status_history].reverse().map(h=><p key={h.id}>{date(h.changed_at)} · {names[h.action]||h.to_status} · {h.reason}</p>)}</section>}
 </Modal>;
}
