import React from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {canViewPublicListing} from '../services/operations';
import {canUseAction} from '../services/action-availability';
import {Field,Form,Modal,Empty,money} from './ui';
export default function ManualListingIntroduction({db,actorId,inquiry,run,busy}) {
 const [q,setQ]=useSearchParams();
 const update=(key,value)=>{const next=new URLSearchParams(q);value?next.set(key,value):next.delete(key);if(key!=='manualPage')next.delete('manualPage');setQ(next);};
 if(!canUseAction(db,actorId,'inquiries',inquiry,'introduceListing'))return null;
 const search=q.get('listingSearch')||'',type=q.get('listingType')||'';
 const listings=db.listings.filter(l=>canViewPublicListing(db,actorId,l)&&(!type||l.deal_type_id===type)&&[l.title,l.code,db.properties.find(p=>p.id===l.property_id)?.title].filter(Boolean).join(' ').includes(search));
 const pages=Math.max(1,Math.ceil(listings.length/6)),current=Math.max(1,Math.min(pages,Number(q.get('manualPage'))||1));
 const selected=db.listings.find(l=>l.id===q.get('manualListing')&&canViewPublicListing(db,actorId,l));
 const typeName=l=>db.dealTypes.find(t=>t.id===l.deal_type_id)?.name;
 return <>
  <button className="secondary" onClick={()=>update('manualListing','select')}>انتخاب و معرفی دستی فایل عرضه</button>
  {q.has('manualListing')&&<Modal title="معرفی دستی فایل عرضه" parameter="manualListing">
   <p className="muted">می‌توانید مستقل از نتیجه تطبیق، یکی از فایل‌های عرضه فعال را انتخاب و به این متقاضی معرفی کنید.</p>
   {selected?<>
    <h3>{selected.title} · {typeName(selected)}</h3><p>{selected.code} · قیمت {money(selected.sale_price)} · ودیعه {money(selected.deposit)} · اجاره {money(selected.monthly_rent)}</p>
    <Link to={`/explore/${selected.id}`} target="_blank" rel="noreferrer">مشاهده اطلاعات فایل عرضه</Link>
    <button className="secondary" onClick={()=>update('manualListing','select')}>انتخاب فایل دیگر</button>
    {canUseAction(db,actorId,'inquiries',inquiry,'introduceListing',selected)?<Form busy={busy} submit="ثبت معرفی به متقاضی" onSubmit={async fields=>{
      if(await run('introduceListing',{...fields,inquiry_id:inquiry.id,listing_id:selected.id,selection_method:'MANUAL'})){const next=new URLSearchParams(q);next.delete('manualListing');setQ(next);}
    }}>
     <Field name="channel" title="روش معرفی" value="IN_PERSON" options={[{id:'IN_PERSON',name:'حضوری'},{id:'PHONE',name:'تلفنی'}]} required/>
     <Field name="notes" title="توضیحات معرفی (اختیاری)" type="textarea"/>
    </Form>:<p>این فایل قبلاً به متقاضی معرفی شده است.</p>}
   </>:<>
    <div className="toolbar wrap"><input aria-label="جست‌وجوی دستی فایل عرضه" placeholder="عنوان یا کد فایل…" value={search} onChange={e=>update('listingSearch',e.target.value)}/></div>
    <Field name="listing_type_filter" title="نوع معامله فایل" value={type} onChange={e=>update('listingType',e.target.value)} options={[{id:'',name:'همه معاملات'},...db.dealTypes.map(t=>({id:t.id,name:t.name}))]}/>
    <div className="grid">{listings.slice((current-1)*6,current*6).map(l=><article className="card" key={l.id}>
     <h3>{l.title||l.code}</h3><p>{typeName(l)} · {l.code}</p><p>قیمت {money(l.sale_price)} · ودیعه {money(l.deposit)} · اجاره {money(l.monthly_rent)}</p>
     <button className="secondary" disabled={!canUseAction(db,actorId,'inquiries',inquiry,'introduceListing',l)} onClick={()=>update('manualListing',l.id)}>{canUseAction(db,actorId,'inquiries',inquiry,'introduceListing',l)?'انتخاب فایل':'قبلاً معرفی شده'}</button>
    </article>)}</div>
    {!listings.length&&<Empty/>}
    {pages>1&&<div className="toolbar"><button className="secondary" disabled={current===1} onClick={()=>update('manualPage',String(current-1))}>قبلی</button><span>{current} از {pages}</span><button className="secondary" disabled={current===pages} onClick={()=>update('manualPage',String(current+1))}>بعدی</button></div>}
   </>}
  </Modal>}
 </>;
}
