import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal, num } from './ui';
import { canUseAction } from '../services/action-availability';
import { canAccess } from '../services/operations';
import { propertyStageResponsible } from '../services/property-wizard';
export default function PropertyReviewSubmission({ db, actorId, run, busy }) {
 const [q,setQ]=useSearchParams();
 const request=db.registrationRequests.find(r=>r.id===q.get('reviewRequest'));
 if(!request||!canAccess(db,actorId,'registrationRequests',request)||!canUseAction(db,actorId,'requests',request,'workspace'))return null;
 const property=db.properties.find(p=>p.id===request.resulting_property_id);
 const appraisal=db.appraisals.find(a=>a.registration_request_id===request.id);
 const missing=[!property?.address&&'نشانی ملک',!property?.district_id&&'منطقه',!(Number(property?.area)>0)&&'متراژ معتبر',!appraisal?.findings&&'گزارش بازدید',appraisal?.status!=='COMPLETED'&&'تکمیل گزارش'].filter(Boolean);
 const ready=canUseAction(db,actorId,'requests',request,'submitPropertyForReview');
 return <Modal title="مرور اطلاعات و ارسال برای مدیر" parameter="reviewRequest" className="property-review-submission">
  <p>اطلاعات ذخیره‌شده را مرور کنید. پس از ارسال، پرونده در انتظار بررسی <strong>{propertyStageResponsible(db,request,'review')}</strong> قرار می‌گیرد.</p>
  <dl className="wizard-summary">
   <div><dt>پرونده</dt><dd>{request.code}</dd></div><div><dt>عنوان ملک</dt><dd>{property?.title||'هنوز توسط مدیر تعیین نشده'}</dd></div>
   <div className="wizard-full"><dt>نشانی</dt><dd>{property?.address||'ثبت نشده'}</dd></div>
   <div><dt>منطقه</dt><dd>{db.districts.find(d=>d.id===property?.district_id)?.name||'ثبت نشده'}</dd></div>
   <div><dt>متراژ</dt><dd>{num(property?.area)} متر</dd></div><div><dt>اتاق</dt><dd>{num(property?.rooms)}</dd></div>
   <div><dt>طبقه</dt><dd>{property?.floor??'ثبت نشده'}</dd></div>
   <div className="wizard-full"><dt>گزارش بازدید</dt><dd>{appraisal?.findings||'ثبت نشده'}</dd></div>
   {appraisal?.valuation_notes&&<div className="wizard-full"><dt>توضیحات تکمیلی</dt><dd>{appraisal.valuation_notes}</dd></div>}
  </dl>
  {!!missing.length&&<p role="status" className="alert error">پیش از ارسال تکمیل کنید: {missing.join('، ')}</p>}
  <div className="toolbar wrap"><button type="button" disabled={busy||!ready} onClick={async()=>{
   const result=await run('submitPropertyForReview',{id:property.id});
   if(result){const next=new URLSearchParams(q);next.delete('reviewRequest');if(next.get('action')==='workspace')next.delete('action');setQ(next,{replace:true});}
  }}>{busy?'در حال ارسال…':'تأیید و ارسال برای مدیر'}</button>
  <button type="button" className="secondary" disabled={busy} onClick={()=>{const next=new URLSearchParams(q);next.delete('reviewRequest');next.set('edit','workspace');setQ(next);}}>برگشت برای ویرایش</button></div>
 </Modal>;
}
