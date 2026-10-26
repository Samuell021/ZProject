import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {matchListings,canViewPublicListing,canAccess} from '../services/operations';
import {canUseAction} from '../services/action-availability';
import {money,Empty,num} from '../components/ui';
import ManualListingIntroduction from '../components/ManualListingIntroduction';
export default function InquiryMatching({db,inquiry,actorId,run,busy,onHistory}){
 const [limit,setLimit]=useState(6);
 const rows=matchListings(db,inquiry.id).filter(x=>canViewPublicListing(db,actorId,x.listing)||canAccess(db,actorId,'listings',x.listing));
 return <section><div className="section-head"><h3>فایل‌های پیشنهادی برای متقاضی</h3><ManualListingIntroduction db={db} actorId={actorId} inquiry={inquiry} run={run} busy={busy}/></div>
  <p className="muted">معرفی هر فایل ثبت می‌شود؛ بازدید و مذاکره همان فایل را از سوابق ادامه دهید.</p>
  <div className="grid">{rows.slice(0,limit).map(({listing:l,reasons,compatible})=><article className="card" key={l.id}>
   <h3><Link target="_blank" rel="noopener noreferrer" to={`/${canAccess(db,actorId,'listings',l)?'listings':'explore'}/${l.id}`}>{l.title||db.properties.find(p=>p.id===l.property_id)?.title||l.code}</Link></h3>
   <small>{l.code} · {db.dealTypes.find(t=>t.id===l.deal_type_id)?.name}</small><p>{money(l.sale_price||l.deposit)}</p>
   <span className="badge">{compatible?'سازگار با نیاز':'نیاز به بررسی'}</span>
   <div>{reasons.map((r,i)=><p className="muted" key={i}>{r.passed?'✓':'×'} {r.label}</p>)}</div>
   {compatible&&canUseAction(db,actorId,'inquiries',inquiry,'introduceListing',l)&&<button disabled={busy} onClick={()=>run('introduceListing',{inquiry_id:inquiry.id,listing_id:l.id,channel:'IN_PERSON'})}>معرفی به متقاضی</button>}
   {db.introductions.some(i=>i.inquiry_id===inquiry.id&&i.listing_id===l.id&&!['REJECTED','CANCELLED'].includes(i.status))&&<button className="secondary" onClick={onHistory}>ادامه از سوابق</button>}
  </article>)}</div>
  {!rows.length&&<Empty/>}{rows.length>limit&&<button className="secondary" onClick={()=>setLimit(limit+6)}>نمایش فایل‌های بیشتر ({num(rows.length-limit)})</button>}
 </section>;
}
