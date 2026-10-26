import {Files,CalendarDays,Handshake,FileCheck2} from 'lucide-react';
import {commercialActions} from './PropertyCommercialActions';
import React,{useState} from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {Badge,date,num} from '../components/ui';
import {propertyCommercialHistory} from '../services/property-commercial-history';
const sections=[['introductions','معرفی‌های این ملک','مشاهده معرفی'],['viewings','بازدیدهای این ملک','مشاهده بازدید'],['deals','مذاکرات این ملک','مشاهده مذاکره'],['contracts','قراردادهای این ملک','مشاهده قرارداد']];
export default function PropertyCommercialHistory({db,actorId,requestId,run,busy,collection="registrationRequests",only,pendingIntroductions=false,readyForContract=false,readyForNegotiation=false,titles={}}) {
 const [q,setQ]=useSearchParams();
 const open=(action,id)=>{const next=new URLSearchParams(q);next.set("commercialAction",action);next.set("commercialRecord",id);setQ(next);};
 const rows=propertyCommercialHistory(db,actorId,requestId,collection);
 if(pendingIntroductions)rows.introductions=rows.introductions.filter(i=>!['REJECTED','CANCELLED'].includes(i.status)&&!db.viewings.some(v=>v.introduction_id===i.id&&['SCHEDULED','COMPLETED'].includes(v.status)));
 if(readyForNegotiation)rows.viewings=rows.viewings.filter(v=>commercialActions(db,actorId,'viewings',v.id).some(([name])=>name==='createDeal'));
 if(readyForContract)rows.deals=rows.deals.filter(d=>['AGREED','CONTRACT','FINALIZED'].includes(d.status));
 const headings=collection==="inquiries"?[['introductions','فایل‌های معرفی‌شده','مشاهده معرفی'],['viewings','بازدیدهای متقاضی','مشاهده بازدید'],['deals','مذاکرات متقاضی','مشاهده مذاکره'],['contracts','قراردادهای متقاضی','مشاهده قرارداد']]:sections;
 return <div className="property-commercial-history">{headings.filter(([key])=>!only||only.includes(key)).map(([key,title,action])=><HistorySection key={key} kind={key} title={titles[key]||title} fileFirst={!!only} rows={rows[key]||[]} action={action} actions={id=>run?commercialActions(db,actorId,key,id).map(([name,label])=>[name,pendingIntroductions&&name==='viewing'?'ثبت بازدید':label]):[]} open={open} busy={busy}/>) }</div>;
}
function HistorySection({title,rows,action,actions,open,busy,fileFirst,kind}) {
 const Icon={introductions:Files,viewings:CalendarDays,deals:Handshake,contracts:FileCheck2}[kind];
 const [limit,setLimit]=useState(5);
 return <section className="commercial-history-section" data-kind={kind} aria-label={title}>
  <div className="section-head"><h3>{fileFirst&&<Icon size={22} aria-hidden="true"/>}{title}</h3><span className="badge">{num(rows.length)} مورد</span></div>
  {!rows.length?<p className="muted">موردی در دسترس شما ثبت نشده است.</p>:rows.slice(0,limit).map(row=><article className="commercial-history-row" key={row.id}>
   <div className="commercial-history-heading"><div><strong>{fileFirst?(row.listingHref?<Link to={row.listingHref} target="_blank" rel="noopener noreferrer" title="مشاهده فایل عرضه در تب جدید">{row.listingTitle||row.listingCode}</Link>:row.listingTitle||row.listingCode):`متقاضی: ${row.applicantName}`}</strong>{row.inquiryCode&&<small>درخواست {row.inquiryHref?<Link to={row.inquiryHref}>{row.inquiryCode}</Link>:row.inquiryCode}</small>}</div><Badge value={row.status}/></div>
   <div className="commercial-history-meta">{row.code&&<span>{row.code}</span>}<span>{!fileFirst&&row.listingHref?<Link to={row.listingHref} target="_blank" rel="noopener noreferrer" title="مشاهده فایل عرضه در تب جدید">{row.listingTitle} · {row.listingCode}</Link>:<>{row.listingTitle} · {row.listingCode}</>} · {row.dealType}</span><span>{row.occurredAt?date(row.occurredAt):'تاریخ ثبت نشده'}</span></div>
   {row.collaboration&&<div className="commercial-collaboration" aria-label="مشاوران همکار">{row.collaboration.shared&&<strong>همکاری دو مشاور</strong>}<span>مشاور متقاضی: <b>{row.collaboration.buyerName}</b></span><span>مشاور ملک: <b>{row.collaboration.sellerName}</b></span>{row.collaboration.introducerName&&<span>ثبت‌کننده معرفی: <b>{row.collaboration.introducerName}</b></span>}</div>}
   {row.outcome&&<p>{row.outcome}</p>}
   {row.listingBlockReason&&title.includes('معرفی')&&<div className="alert error" role="status"><p>{row.listingBlockReason}</p>{row.listingCaseHref?<Link to={row.listingCaseHref}>پیگیری وضعیت ملک و عرضه ←</Link>:<p>وضعیت عرضه را با مشاور ملک یا مدیر رنج پیگیری کنید.</p>}</div>}
   {row.interest&&<p className="muted">{row.interest==="INTERESTED"?"متقاضی مایل به مذاکره است.":"متقاضی تمایلی به مذاکره ندارد."}</p>}
   {row.status==="AGREED"&&<p className="muted">مذاکره موفق؛ در انتظار تنظیم قرارداد توسط مدیرکل</p>}
   <div className="action-row">{actions(row.id).map(([name,label])=><button className="secondary" key={name} disabled={busy} onClick={()=>open(name,row.id)}>{label}</button>)}</div>
   {row.href&&<Link className="commercial-history-link" to={row.href}>{action} ←</Link>}
  </article>)}
  {rows.length>limit&&<button className="secondary" onClick={()=>setLimit(limit+5)}>نمایش موارد بیشتر</button>}
 </section>;
}
