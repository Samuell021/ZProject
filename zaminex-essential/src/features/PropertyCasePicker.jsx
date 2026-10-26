import {inquiryWizardStage,inquiryWizardSteps} from '../services/inquiry-wizard';
import React,{useState} from 'react';
import {Modal,num} from '../components/ui';
import {propertyWizardStage,propertyWizardSteps} from '../services/property-wizard';
const normalize=value=>String(value||'').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).toLowerCase().trim();
export default function PropertyCasePicker({db,records,onChoose,currentId,pageType="requests"}) {
 const [search,setSearch]=useState(''),[page,setPage]=useState(1);
 const inquiry=pageType==='inquiries',steps=inquiry?inquiryWizardSteps:propertyWizardSteps,stageFor=inquiry?inquiryWizardStage:propertyWizardStage;
 const rows=records.filter(r=>normalize([r.code,r.title,r.initial_contact_name].join(' ')).includes(normalize(search)));
 const total=Math.max(1,Math.ceil(rows.length/8)),current=Math.min(page,total);
 return <Modal title="ادامه پرونده قبلی" parameter="chooseCase" className="property-case-picker">
  <p className="muted">پرونده را با نام یا کد پیدا کنید و از مرحله فعلی ادامه دهید.</p>
  <label className="field">جست‌وجوی پرونده<input autoFocus type="search" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder={inquiry?"نام متقاضی یا کد درخواست…":"نام مالک، عنوان ملک یا کد پرونده…"}/></label>
  <p className="muted">{num(rows.length)} پرونده در دسترس شماست.</p>
  <div className="case-picker-list">{rows.slice((current-1)*8,current*8).map(r=>{
   const stage=stageFor(db,r),title=steps.find(([key])=>key===stage)?.[1]||'پرونده بسته شده';
   return <button type="button" className="secondary case-picker-row" key={r.id} onClick={()=>onChoose(r.id)}>
    <span><strong>{r.title||r.initial_contact_name||'پرونده ملک'}</strong><small>{r.code} · {r.initial_contact_name}{currentId===r.id?' · پرونده باز فعلی':''}</small></span><span className="badge">{title}</span>
   </button>;
  })}</div>
  {!rows.length&&<p role="status" className="empty">پرونده‌ای پیدا نشد؛ عبارت جست‌وجو را تغییر دهید.</p>}
  <nav className="toolbar case-picker-pagination" aria-label="صفحه‌بندی پرونده‌ها"><button className="secondary" disabled={current===1} onClick={()=>setPage(current-1)}>قبلی</button><span>صفحه {num(current)} از {num(total)}</span><button className="secondary" disabled={current===total} onClick={()=>setPage(current+1)}>بعدی</button></nav>
 </Modal>;
}
