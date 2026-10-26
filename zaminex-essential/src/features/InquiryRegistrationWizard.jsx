import React,{useState} from 'react';
import {Form,Field} from '../components/ui';
import {canManageCase} from '../services/intake';
import {canAccess} from '../services/operations';
export default function InquiryRegistrationWizard({db,actorId,run,busy,onCreated}){
 const [step,setStep]=useState(0),[draft,setDraft]=useState({});
 const managerial=db.scopes.some(scope=>canManageCase(db,actorId,{management_scope_id:scope.id}));
 const scopes=db.scopes.filter(s=>s.is_active&&canAccess(db,actorId,'scopes',s));
 const contacts=db.contacts.filter(c=>canAccess(db,actorId,'contacts',c));
 return <section className="panel property-wizard"><h2>ثبت درخواست متقاضی</h2>
  <ol className="wizard-steps" aria-label="مراحل ثبت درخواست متقاضی">{['مشخصات متقاضی','درخواست اولیه','مرور و ثبت'].map((title,i)=><li key={title} aria-current={i===step?'step':undefined}><strong>{title}</strong></li>)}</ol>
  <Form key={step} busy={busy} submit={step===2?'ثبت درخواست و ادامه':'ادامه'} onSubmit={async fields=>{
   const next={...draft,...fields};setDraft(next);
   if(step<2){setStep(step+1);return;}
   const result=await run('createLead',{...next,lead_type:'INQUIRY',management_scope_id:next.management_scope_id||scopes[0]?.id});if(result)onCreated(result.id);
  }}>
   {step===0?<>
    {managerial&&<Field name="contact_id" title="انتخاب شخص ثبت‌شده (اختیاری)" value={draft.contact_id||''} onChange={e=>setDraft({...draft,contact_id:e.target.value})} options={contacts.map(c=>({id:c.id,name:[c.first_name,c.last_name,c.company_name].filter(Boolean).join(' ')}))}/>}
    {!draft.contact_id&&<><Field name="initial_contact_name" title="نام و نام خانوادگی متقاضی" required value={draft.initial_contact_name||''}/><Field name="initial_contact_phone" title="شماره تماس متقاضی" required pattern="[0-9۰-۹]{11}" value={draft.initial_contact_phone||''}/></>}
   </>:step===1?<>
    <Field name="deal_type_id" title="نوع معامله مورد تقاضا" required value={draft.deal_type_id||''} options={db.dealTypes.filter(t=>t.is_active)}/>
    {managerial&&<Field name="management_scope_id" title="رنج مسئول" required value={draft.management_scope_id||scopes[0]?.id} options={scopes}/>}
    <Field name="description" title="شرح اولیه درخواست" type="textarea" value={draft.description||''}/>
   </>:<div className="wizard-full wizard-summary"><p>متقاضی: {draft.initial_contact_name||contacts.find(c=>c.id===draft.contact_id)?.first_name}</p><p>تماس: {draft.initial_contact_phone||'شخص ثبت‌شده'}</p><p>نوع معامله: {db.dealTypes.find(t=>t.id===draft.deal_type_id)?.name}</p><p>{draft.description}</p><p className="muted">پس از ثبت، پذیرش و ارجاع روی همین پرونده ادامه پیدا می‌کند.</p></div>}
  </Form>
  {step>0&&<button type="button" className="secondary" disabled={busy} onClick={()=>setStep(step-1)}>قبلی</button>}
 </section>;
}
