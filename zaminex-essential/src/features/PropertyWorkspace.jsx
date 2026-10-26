import PropertyJourney from "../components/PropertyJourney";
import React from 'react';
import {Link,useNavigate,useSearchParams} from 'react-router-dom';
import {Badge,Empty,Field,Form,Modal,date,money,staff,formatTerms} from '../components/ui';
import {canAccess,canViewPublicListing} from '../services/operations';
import {canManageCase} from '../services/intake';
import {canEditPropertyListings,ownsProperty,propertyOwner,propertyRequest,propertyReviewState} from '../services/property-listings';

export function ListingEditor({db,actorId,property,existing,run,busy,onSaved,typeId}) {
 const version=existing?.deal_type_version_id?db.dealTypeVersions.find(v=>v.id===existing.deal_type_version_id):db.dealTypeVersions.filter(v=>v.deal_type_id===typeId&&v.status==='PUBLISHED').at(-1);
 const type=db.dealTypes.find(t=>t.id===typeId);
 const definitions=version?.field_definitions||[];
 const codes=new Set(definitions.map(f=>f.code));
 const behavior=type?.behavior_type||type?.code;
 const fallback=[];
 if(['SALE','PRE_SALE','PRESALE'].includes(behavior)&&!codes.has('sale_price'))fallback.push({code:'sale_price',name:'قیمت عرضه (تومان)',type:'number',required:true});
 if(['RENT','RENTAL','MORTGAGE','FULL_MORTGAGE'].includes(behavior)) {
  if(!codes.has('deposit'))fallback.push({code:'deposit',name:'ودیعه (تومان)',type:'number',required:true});
  if(['RENT','RENTAL'].includes(behavior)&&!codes.has('monthly_rent'))fallback.push({code:'monthly_rent',name:'اجاره ماهانه (تومان)',type:'number',required:true});
 }
 return <Form busy={busy} submit={existing?'ذخیره تغییرات فایل':'ثبت فایل عرضه'} onSubmit={async fields=>{
  const additional_terms={...(existing?.additional_terms||{})};
  for(const field of [...definitions,...fallback])if(!['sale_price','deposit','monthly_rent'].includes(field.code))additional_terms[field.code]=fields[field.code];
  const result=await run('savePropertyListing',{property_id:property.id,deal_type_id:typeId,sale_price:fields.sale_price,deposit:fields.deposit,monthly_rent:fields.monthly_rent,status:fields.status,description:fields.description,additional_terms});
  if(result)onSaved(result);
 }}>
  <p className="full-width">مسئول فایل: {staff(db,propertyOwner(db,property))}</p>
  <p className="full-width">{property.title||property.internal_code} · {type?.name}{existing?' — فایل این نوع معامله موجود است؛ شرایط همان فایل ویرایش می‌شود.':''}</p>
  {!version&&<p className="alert error">برای این معامله نسخه شرایط منتشرشده وجود ندارد.</p>}
  {[...definitions,...fallback].map(field=><Field key={field.code} name={field.code} title={field.name||field.code} type={field.type==='number'&&field.code!=='installments'?'number':field.type==='date'?'date':'text'} min={field.type==='number'?'0':undefined} calendar={field.type==='date'} value={existing?.[field.code]??existing?.additional_terms?.[field.code]??''} required={field.required||(version?.validation_rules?.required||[]).includes(field.code)} />)}
  <Field name="status" title="وضعیت عرضه" value={existing?.status==='ACTIVE'?'ACTIVE':'PAUSED'} options={[{id:'PAUSED',name:'متوقف / پیش‌نویس'},...(propertyReviewState(db,property)==='APPROVED'?[{id:'ACTIVE',name:'فعال در اکسپلور'}]:[])]} required/>
  <Field name="description" title="توضیحات عرضه" type="textarea" value={existing?.description||''}/>
  {propertyReviewState(db,property)!=='APPROVED'&&<p className="muted full-width">فعال‌سازی عرضه پس از تأیید ملک امکان‌پذیر است.</p>}
 </Form>;
}

export default function PropertyWorkspace({page,id,db,actorId,run,busy}) {
 const [q,setQ]=useSearchParams(),navigate=useNavigate();
 const publicPage=page==='explore',propertyPage=page==='properties'||page==='reviews';
 const manager=property=>canManageCase(db,actorId,{management_scope_id:property.management_scope_id});
 const propertyById=value=>db.properties.find(p=>p.id===value);
 const listing=id&&!propertyPage?db.listings.find(l=>l.id===id):null;
 const property=id?(propertyPage?(propertyById(id)||(page==='reviews'?propertyById(db.listings.find(l=>l.id===id)?.property_id):null)):propertyById(listing?.property_id)):null;
 const allowed=property&&(publicPage?canViewPublicListing(db,actorId,listing):canAccess(db,actorId,propertyPage?'properties':'listings',propertyPage?property:listing));
 const update=(key,value)=>{const next=new URLSearchParams(q);value?next.set(key,value):next.delete(key);if(key!=='p')next.delete('p');setQ(next);};
 const close=()=>{const next=new URLSearchParams(q);for(const key of ['action','property','type'])next.delete(key);setQ(next);};
 const editProperty=property||propertyById(q.get('property'));
 const selectedType=q.get('type')||listing?.deal_type_id||db.dealTypes.find(t=>t.is_active)?.id;
 const existing=editProperty&&db.listings.find(l=>l.property_id===editProperty.id&&l.deal_type_id===selectedType);
 const createLink=property=>`/listings?action=listing&property=${property.id}`;
 const search=q.get('search')||'';
 let rows=propertyPage?db.properties.filter(p=>canAccess(db,actorId,'properties',p)&&(page==='reviews'?propertyReviewState(db,p)==='PENDING':propertyReviewState(db,p)==='APPROVED')):db.listings.filter(l=>publicPage?canViewPublicListing(db,actorId,l):canAccess(db,actorId,'listings',l));
 rows=rows.filter(row=>[row.title,row.internal_code,row.code,db.dealTypes.find(t=>t.id===row.deal_type_id)?.name].filter(Boolean).join(' ').includes(search));
 const pages=Math.max(1,Math.ceil(rows.length/8)),current=Math.max(1,Math.min(pages,Number(q.get('p'))||1));
 const owned=db.properties.filter(p=>canEditPropertyListings(db,actorId,p));
 const renderListing=row=><article className="card" key={row.id}>
  <h3><Link target={id&&propertyPage?"_blank":undefined} rel={id&&propertyPage?"noopener noreferrer":undefined} to={`/${publicPage?'explore':'listings'}/${row.id}`}>{propertyById(row.property_id)?.title||row.title||row.code}</Link></h3>
  <p>{db.dealTypes.find(t=>t.id===row.deal_type_id)?.name} · {row.code}</p>
  <Badge value={row.status}/><p>مشاور: {staff(db,propertyOwner(db,propertyById(row.property_id)))}</p>
  {Number(row.sale_price)>0&&<p>قیمت: {money(row.sale_price)}</p>}
  {(Number(row.deposit)>0||Number(row.monthly_rent)>0)&&<p>ودیعه: {money(row.deposit)} · اجاره: {money(row.monthly_rent)}</p>}
  {!publicPage&&canEditPropertyListings(db,actorId,propertyById(row.property_id))&&propertyReviewState(db,propertyById(row.property_id))==='APPROVED'&&<Link target={id&&propertyPage?"_blank":undefined} rel={id&&propertyPage?"noopener noreferrer":undefined} className="button secondary" to={`/listings/${row.id}?action=listing&type=${row.deal_type_id}`}>ویرایش قیمت و شرایط</Link>}
 </article>;
 return <>
  {!id?<section className="panel">
   <div className="section-head"><p className="muted">{publicPage?'فایل‌های فعال همه مشاوران؛ مشاهده اطلاعات قابل عرضه':page==='reviews'?'بررسی و تأیید خود ملک، مستقل از فایل عرضه':propertyPage?'املاک تأییدشده تحت مسئولیت شما؛ از هر ملک می‌توانید فایل عرضه بسازید':'برای هر ملک از هر نوع معامله یک فایل؛ قیمت و شرایط همان فایل قابل ویرایش است.'}</p>
   {page==='listings'&&owned.length>0&&<button onClick={()=>update('action','listing')}>ثبت / ویرایش فایل عرضه</button>}
   {page==='properties'&&<Link className="button secondary" to="/requests">پرونده‌های ارجاع‌شده و ثبت ملک</Link>}</div>
   <input aria-label="جست‌وجوی ملک و فایل عرضه" placeholder="عنوان، کد یا نوع معامله…" value={search} onChange={e=>update('search',e.target.value)}/>
   <div className="grid">{rows.slice((current-1)*8,current*8).map(row=>propertyPage?<article className="card" key={row.id}>
    <h3><Link to={`/${page}/${row.id}`}>{row.title||row.internal_code}</Link></h3><Badge value={propertyReviewState(db,row)}/>
    <p>مسئول: {staff(db,propertyOwner(db,row))}</p><p>{row.area||'—'} متر · {db.districts.find(d=>d.id===row.district_id)?.name||'—'}</p>
    <p>{db.listings.filter(l=>l.property_id===row.id).length} فایل عرضه</p>
   </article>:renderListing(row))}</div>
   {!rows.length&&<Empty/>}
   {pages>1&&<div className="toolbar"><button className="secondary" disabled={current===1} onClick={()=>update('p',String(current-1))}>قبلی</button><span>{current} از {pages}</span><button className="secondary" disabled={current===pages} onClick={()=>update('p',String(current+1))}>بعدی</button></div>}
  </section>:!allowed?<p className="alert error">اجازه دسترسی به این مورد را ندارید.</p>:<>
   {!publicPage&&propertyRequest(db,property)&&<PropertyJourney db={db} request={propertyRequest(db,property)}/>}
   <Link className="back-link" to={page==='reviews'?'/inbox':`/${page}`}>بازگشت به فهرست</Link>
   <section className="panel"><h2>{property.title||property.internal_code}</h2>
    <Badge value={propertyPage?propertyReviewState(db,property):listing.status}/>
    <p>{property.area||'—'} متر · {property.rooms||'—'} اتاق · {db.districts.find(d=>d.id===property.district_id)?.name}</p>
    {!publicPage&&<p>نشانی: {property.address||'—'}</p>}
    <p>مشاور مسئول: {staff(db,propertyOwner(db,property))}</p>
    <div className="toolbar wrap">
    {!publicPage&&propertyRequest(db,property)&&<Link className="button secondary" to={`/requests/${propertyRequest(db,property).id}`}>کارشناسی و جزئیات پرونده ملک</Link>}
    {!publicPage&&canEditPropertyListings(db,actorId,property)&&propertyReviewState(db,property)==='APPROVED'&&<Link className="button" to={createLink(property)}>ثبت / ویرایش فایل عرضه</Link>}
    {!publicPage&&ownsProperty(db,actorId,property)&&['DRAFT','CHANGES_REQUIRED'].includes(propertyReviewState(db,property))&&<button disabled={busy} onClick={()=>run('submitPropertyForReview',{id:property.id})}>ارسال ملک برای تأیید</button>}
    {!publicPage&&manager(property)&&propertyReviewState(db,property)==='PENDING'&&<><button disabled={busy} onClick={()=>run('reviewProperty',{id:property.id,decision:'APPROVED'})}>تأیید ملک</button><button className="secondary" onClick={()=>update('action','propertyChanges')}>برگشت ملک برای اصلاح</button></>}
    </div>
    {!publicPage&&property.review_reason&&<p className="alert error">{property.review_reason}</p>}
    {!publicPage&&<p>{db.appraisals.find(a=>a.property_id===property.id)?.findings}</p>}
   </section>
   {listing&&<section className="panel"><h3>{db.dealTypes.find(t=>t.id===listing.deal_type_id)?.name} · {listing.code}</h3><p>قیمت: {money(listing.sale_price)}</p><p>ودیعه: {money(listing.deposit)} · اجاره ماهانه: {money(listing.monthly_rent)}</p><p>{formatTerms(listing.additional_terms||{})}</p><p>{listing.description}</p>
    {!publicPage&&canEditPropertyListings(db,actorId,property)&&propertyReviewState(db,property)==='APPROVED'&&<button onClick={()=>update('action','listing')}>ویرایش قیمت و شرایط</button>}
    {!publicPage&&listing.price_history?.length>0&&<details><summary>سابقه تغییر قیمت و شرایط</summary>{listing.price_history.map((h,index)=><p key={index}>{date(h.changed_at)} · فروش {money(h.sale_price)} · ودیعه {money(h.deposit)} · اجاره {money(h.monthly_rent)} · {formatTerms(h.additional_terms)}</p>)}</details>}
   </section>}
   {propertyPage&&<section className="panel"><h3>فایل‌های عرضه این ملک</h3><div className="grid">{db.listings.filter(l=>l.property_id===property.id&&canAccess(db,actorId,'listings',l)).map(renderListing)}</div></section>}
  </>}
  {q.get('action')==='listing'&&!publicPage&&(!id||allowed)&&<Modal title="شرایط فایل عرضه" onClose={close}>
   <Field name="selected_property" title="ملک" disabled={!!property} value={editProperty?.id||''} onChange={e=>{const next=new URLSearchParams(q);next.set('property',e.target.value);next.delete('type');setQ(next);}} options={owned.map(p=>({id:p.id,name:`${p.title||p.internal_code} · ${staff(db,propertyOwner(db,p))}`}))} required/>
   {editProperty&&canEditPropertyListings(db,actorId,editProperty)&&propertyReviewState(db,editProperty)==='APPROVED'&&<><Field name="selected_type" title="نوع معامله" value={selectedType} onChange={e=>update('type',e.target.value)} options={db.dealTypes.filter(t=>t.is_active).map(t=>({id:t.id,name:`${t.name}${db.listings.some(l=>l.property_id===editProperty.id&&l.deal_type_id===t.id)?' (ویرایش فایل موجود)':''}`}))} required/>
   <ListingEditor key={`${editProperty.id}:${selectedType}:${existing?.version||0}`} db={db} actorId={actorId} property={editProperty} existing={existing} typeId={selectedType} run={run} busy={busy} onSaved={result=>navigate(`/listings/${result.id}`)}/></>}
  </Modal>}
  {q.get('action')==='propertyChanges'&&allowed&&!publicPage&&manager(property)&&<Modal title="برگشت ملک برای اصلاح" onClose={close}><Form busy={busy} onSubmit={async fields=>{if(await run('reviewProperty',{id:property.id,decision:'CHANGES_REQUIRED',reason:fields.reason}))close();}}><Field name="reason" title="دلیل اصلاح" type="textarea" required/></Form></Modal>}
 </>;
}
