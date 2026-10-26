import React from 'react';
import {Field,Form,money} from './ui';
export function ContractTermsSummary({db,contract}) {
 const version=db.dealTypeVersions.find(v=>v.id===contract.deal_type_version_id),type=db.dealTypes.find(t=>t.id===version?.deal_type_id);
 return <section className="panel"><h3>مبلغ و شرایط قطعی قرارداد · {type?.name||'نوع معامله ثبت‌شده'}</h3>
  {(version?.field_definitions||[]).map(field=><p key={field.code}>{field.name||field.code}: {['sale_price','deposit','monthly_rent'].includes(field.code)?money(contract[field.code]):String(contract.terms_snapshot?.additional_terms?.[field.code]??'—')}</p>)}
 </section>;
}
export default function ContractTermsEditor({db,deal,contract,perform,busy,onSaved}) {
 const listing=db.listings.find(l=>l.id===deal?.listing_id);
 const version=db.dealTypeVersions.find(v=>v.id===(contract?.deal_type_version_id||deal?.deal_type_version_id));
 const type=db.dealTypes.find(t=>t.id===version?.deal_type_id);
 if(!listing||!version)return <p className="alert error">نوع یا نسخه شرایط فایل عرضه مشخص نیست.</p>;
 return <Form busy={busy} submit={contract?'ذخیره مبلغ و شرایط قرارداد':'ثبت پیش‌نویس قرارداد'} onSubmit={async fields=>{
  const additional_terms={};
  for(const field of version.field_definitions||[])if(!['sale_price','deposit','monthly_rent'].includes(field.code))additional_terms[field.code]=fields[field.code];
  const result=await perform(contract?'saveContractTerms':'createContract',{id:contract?.id,deal_id:deal.id,sale_price:fields.sale_price||0,deposit:fields.deposit||0,monthly_rent:fields.monthly_rent||0,additional_terms});
  if(result)onSaved(result);
 }}>
  <p className="full-width">نوع قرارداد: <b>{type?.name}</b> · فایل عرضه: {listing.code}</p>
  <p className="muted full-width">مبلغ توافق قطعی را وارد کنید؛ قیمت پیشنهادی فایل عرضه تغییر نمی‌کند.</p>
  {(version.field_definitions||[]).map(field=><Field key={field.code} name={field.code} title={field.name||field.code} type={field.type==='date'?'date':field.type==='number'&&field.code!=='installments'?'number':'text'} min={field.type==='number'?0:undefined} calendar={field.type==='date'} value={contract?.[field.code]??contract?.terms_snapshot?.additional_terms?.[field.code]??''} required={field.required||(version.validation_rules?.required||[]).includes(field.code)}/>)}
 </Form>;
}
