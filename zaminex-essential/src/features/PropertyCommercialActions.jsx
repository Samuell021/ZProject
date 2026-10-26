import React,{useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Modal,Form,Field} from '../components/ui';
import ContractTermsEditor from '../components/ContractTermsEditor';
import {activityAssignees} from '../services/activities';
import {staff} from '../components/ui';
import {canUseAction} from '../services/action-availability';
export function commercialActions(db,actorId,kind,id){
 const page=kind==='introductions'?'introductions':kind==='viewings'?'viewings':'deals',record=db[page].find(r=>r.id===id);
 const can=name=>canUseAction(db,actorId,page,record,name);
 if(kind==='introductions')return [...(can('viewing')?[['viewing','برنامه‌ریزی بازدید']]:[]),...(can('rejectIntroduction')?[['rejectIntroduction','ثبت عدم تمایل به فایل']]:[]),...(can('deleteIntroduction')?[['deleteIntroduction','حذف معرفی']]:[])];
 if(kind==='viewings')return can('viewingResult')?[['viewingResult','ثبت نتیجه بازدید']]:can('createDeal')?[['createDeal','شروع مذاکره']]:[];
 if(kind==='deals')return can('succeedDeal')?[['dealResult','ثبت نتیجه مذاکره']]:can('createContract')?[['createContract','تنظیم قرارداد']]:[];
 return [];
}
export default function PropertyCommercialActions({db,actorId,rows,run,busy}){
 const [q,setQ]=useSearchParams();
 const action=q.get('commercialAction'),id=q.get('commercialRecord');
 const kind=['introductions','viewings','deals'].find(key=>(rows[key]||[]).some(r=>r.id===id&&commercialActions(db,actorId,key,id).some(([name])=>name===action)));
 const [decision,setDecision]=useState('SUCCESS');
 if(!kind||!run)return null;
 const record=db[kind].find(r=>r.id===id),summary=rows[kind].find(r=>r.id===id);
 const close=()=>{const next=new URLSearchParams(q);next.delete('commercialAction');next.delete('commercialRecord');setQ(next);};
 const perform=async(name,payload)=>{
  const result=await run(name,payload);
  if(result){
   const next=new URLSearchParams(q);next.delete('commercialAction');next.delete('commercialRecord');
   if(['scheduleViewing','completeViewing','createDeal','succeedDeal','closeDeal'].includes(name))next.delete('stage');
   setQ(next);
  }
  return result;
 };
 return <Modal title={{deleteIntroduction:'حذف معرفی',rejectIntroduction:'ثبت عدم تمایل به فایل',viewing:'برنامه‌ریزی بازدید',viewingResult:'ثبت نتیجه بازدید',createDeal:'شروع مذاکره',dealResult:'ثبت نتیجه مذاکره',createContract:'تنظیم قرارداد'}[action]} parameter="commercialAction" clearParameters={['commercialRecord']}>
  <p>متقاضی: {summary.applicantName} · {summary.listingCode}</p>
  {action==='createContract'?<ContractTermsEditor db={db} deal={record} perform={run} busy={busy} onSaved={close}/>:<Form busy={busy} submit={action==='deleteIntroduction'?'حذف معرفی':action==='viewing'?'ثبت بازدید':action==='createDeal'?'شروع مذاکره':'ثبت نتیجه'} onSubmit={fields=>action==='deleteIntroduction'?perform('updateIntroduction',{id,status:'CANCELLED',feedback:'معرفی توسط کاربر حذف شد'}):action==='rejectIntroduction'?perform('updateIntroduction',{id,status:'REJECTED',...fields}):action==='viewing'?perform('scheduleViewing',{introduction_id:id,...fields}):action==='viewingResult'
   ?perform('completeViewing',{id,...fields})
   :action==='createDeal'?perform('createDeal',{viewing_id:id})
   :perform(fields.decision==='SUCCESS'?'succeedDeal':'closeDeal',{id,notes:fields.notes,reason:fields.notes})}>
   {action==='viewingResult'&&<p className="muted full-width">می‌توانید نتیجه را همین حالا ثبت کنید؛ تاریخ قرار محدودیتی ایجاد نمی‌کند. اگر نتیجه هنوز مشخص نیست، فرم را ببندید و بعداً ادامه دهید.</p>}
   {action==='deleteIntroduction'?<p className="full-width">این فایل از فهرست معرفی‌های متقاضی حذف شود؟ خود ملک حذف نمی‌شود و سابقه این اقدام باقی می‌ماند.</p>:action==='rejectIntroduction'?<Field name="rejection_reason" title="دلیل عدم تمایل متقاضی" type="textarea" required/>:action==='viewing'?<>
    <Field name="scheduled_at" title="زمان بازدید" type="datetime-local" calendar required/>
    <Field name="consultant_id" title="مشاور همراه" value={db.inquiries.find(i=>i.id===record.inquiry_id)?.assigned_to_id||actorId} options={activityAssignees(db,actorId,'introductions',record).map(id=>({id,name:staff(db,id)}))} required/>
   </>:action==='viewingResult'?<>
    <Field name="interest" title="نظر متقاضی پس از بازدید" required options={[{id:'INTERESTED',name:'مناسب است؛ ادامه برای مذاکره'},{id:'NOT_INTERESTED',name:'تمایلی به مذاکره ندارد'}]}/>
    <Field name="outcome" title="گزارش و نتیجه بازدید" type="textarea" required/>
    <Field name="customer_feedback" title="توضیحات متقاضی (اختیاری)" type="textarea"/>
   </>:action==='dealResult'?<>
    <Field name="decision" title="نتیجه مذاکره" required value={decision} onChange={e=>setDecision(e.target.value)} options={[{id:'SUCCESS',name:'موفق؛ ارسال برای قرارداد'},{id:'FAILED',name:'ناموفق؛ پایان مذاکره'}]}/>
    <Field name="notes" title={decision==='SUCCESS'?'توضیحات توافق':'دلیل عدم توافق'} type="textarea" required/>
    <p className="muted full-width">{decision==='SUCCESS'?'تنظیم قرارداد به مدیرکل سپرده می‌شود؛ مبلغ قطعی در قرارداد ثبت خواهد شد.':'همین مذاکره ناموفق بسته می‌شود و سابقه آن حفظ خواهد شد.'}</p>
   </>:<p className="muted full-width">مذاکره برای همین متقاضی و فایل عرضه ایجاد می‌شود؛ مبلغ توافق در قرارداد ثبت خواهد شد.</p>}
  </Form>}
 </Modal>;
}
