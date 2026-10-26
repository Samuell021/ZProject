import React,{useState} from 'react';
import {Form,Field} from '../components/ui';
export default function InquiryNeedsEditor({db,inquiry,run,busy,onSaved}){
 const saved=db.inquiryPreferences.filter(p=>p.inquiry_id===inquiry.id);
 const [preferences,setPreferences]=useState(saved.length?saved.map(p=>({...p,key:p.id})):[{key:'first',deal_type_id:db.dealTypes.find(t=>t.is_active)?.id}]);
 const [districts,setDistricts]=useState(inquiry.district_ids||[]);
 return <Form busy={busy} submit="ذخیره نیاز و ادامه" onSubmit={async fields=>{
  const next=preferences.map(p=>({deal_type_id:p.deal_type_id,max_sale_price:fields['sale_'+p.key]||0,max_deposit:fields['deposit_'+p.key]||0,max_monthly_rent:fields['rent_'+p.key]||0}));
  const result=await run('saveInquiryNeeds',{id:inquiry.id,min_area:fields.min_area,max_area:fields.max_area,min_rooms:fields.min_rooms,notes:fields.notes,district_ids:districts,preferences:next});
  if(result)onSaved?.();
 }}>
  <Field name="min_area" title="حداقل متراژ" type="number" min="0" value={inquiry.min_area||''}/>
  <Field name="max_area" title="حداکثر متراژ" type="number" min="0" value={inquiry.max_area||''}/>
  <Field name="min_rooms" title="حداقل اتاق" type="number" min="0" value={inquiry.min_rooms||0}/>
  <div className="wizard-full"><span>مناطق موردنظر</span><div className="toolbar wrap">{db.districts.map(d=><label key={d.id}><input type="checkbox" checked={districts.includes(d.id)} onChange={e=>setDistricts(e.target.checked?[...districts,d.id]:districts.filter(id=>id!==d.id))}/>{d.name}</label>)}</div></div>
  <div className="wizard-full">{preferences.map((p,index)=>{
   const type=db.dealTypes.find(t=>t.id===p.deal_type_id),sale=['SALE','PRE_SALE','PRESALE'].includes(type?.behavior_type||type?.code);
   return <section className="inquiry-preferences" key={p.key}><div className="section-head"><strong>نوع معامله و بودجه {index+1}</strong>{preferences.length>1&&<button type="button" className="secondary" onClick={()=>setPreferences(preferences.filter(x=>x.key!==p.key))}>حذف این نیاز</button>}</div>
    <Field name={'type_'+p.key} title="نوع معامله" required value={p.deal_type_id} onChange={e=>setPreferences(preferences.map(x=>x.key===p.key?{...x,deal_type_id:e.target.value}:x))} options={db.dealTypes.filter(t=>t.is_active).map(t=>({id:t.id,name:t.name}))}/>
    {sale?<Field name={'sale_'+p.key} title="حداکثر بودجه خرید (تومان)" type="number" min="0" value={p.max_sale_price||''}/>:<><Field name={'deposit_'+p.key} title="حداکثر ودیعه (تومان)" type="number" min="0" value={p.max_deposit||''}/><Field name={'rent_'+p.key} title="حداکثر اجاره ماهانه (تومان)" type="number" min="0" value={p.max_monthly_rent||''}/></>}
   </section>;
  })}<button type="button" className="secondary" disabled={preferences.length>=db.dealTypes.filter(t=>t.is_active).length} onClick={()=>setPreferences([...preferences,{key:crypto.randomUUID(),deal_type_id:db.dealTypes.find(t=>t.is_active&&!preferences.some(p=>p.deal_type_id===t.id))?.id}])}>افزودن نوع معامله دیگر</button></div>
  <Field name="notes" title="توضیحات و اولویت‌های متقاضی" type="textarea" value={inquiry.notes||inquiry.description||''}/>
 </Form>;
}
