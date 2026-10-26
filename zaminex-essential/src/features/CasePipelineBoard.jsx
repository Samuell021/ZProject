import {canManageCase,pendingWithdrawal} from '../services/intake';
import React,{useRef} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import {num,staff,person,remaining} from '../components/ui';
import {propertyWizardStage,propertyWizardSteps} from '../services/property-wizard';
import {inquiryWizardStage,inquiryWizardSteps} from '../services/inquiry-wizard';
import {sortPipelineRows} from '../services/pipelines';
const inboxAction=(db,page,row,stage,actorId)=>stage==='acceptance'?row.assigned_to_id===actorId||!!pendingWithdrawal(db,page==='requests'?'registrationRequests':'inquiries',row)&&canManageCase(db,actorId,row):['lead','reception'].includes(stage)&&canManageCase(db,actorId,row);
export function casePipelineStage(db,page,row){
 const stage=page==='requests'?propertyWizardStage(db,row):inquiryWizardStage(db,row);
 return stage==='closed'?null:stage;
}
export default function CasePipelineBoard({db,page,rows,actorId}){
 const scroll=useRef(null);
 const steps=(page==='requests'?propertyWizardSteps:inquiryWizardSteps);
 const sorted=sortPipelineRows(rows);
 const move=direction=>scroll.current?.scrollBy({left:direction*300,behavior:'smooth'});
 return <>
  <p className="muted">همه مراحل پرونده در این مسیر دیده می‌شوند؛ پذیرش و تأیید در کارتابل پذیرش و ارجاع در خود پرونده انجام می‌شود.</p>
  <div className="kanban-scroll-controls" role="group" aria-label="جابه‌جایی افقی کاریز" dir="ltr"><button className="secondary" aria-label="حرکت کاریز به چپ" onClick={()=>move(-1)}><ArrowLeft size={18}/></button><button className="secondary" aria-label="حرکت کاریز به راست" onClick={()=>move(1)}><ArrowRight size={18}/></button></div>
  <div className="kanban" ref={scroll} key={page} role="region" aria-label="ستون‌های کاریز" tabIndex={0}>
   {steps.map(([stage,title])=>{const cards=sorted.filter(row=>casePipelineStage(db,page,row)===stage);return <section className="kanban-column" key={stage} data-stage={stage} aria-label={`مرحله ${stage==='lead'?(page==='requests'?'ثبت ملک':'ثبت درخواست'):title}`}><h3>{stage==='lead'?(page==='requests'?'ثبت ملک':'ثبت درخواست'):title} <span>{num(cards.length)}</span></h3>
    {cards.map(row=>{const name=page==='requests'?(db.properties.find(p=>p.id===row.resulting_property_id)?.title||row.title||row.initial_contact_name):row.initial_contact_name||person(db,row.contact_id);return <article className="kanban-card" key={row.id}><small>{row.code}</small><Link to={`/${page}/${row.id}`}><h3>{name||'عنوان تعیین نشده'}</h3></Link><small>مشاور مسئول: {row.assigned_to_id?staff(db,row.assigned_to_id):'تعیین نشده'}</small><small>{db.scopes.find(s=>s.id===row.management_scope_id)?.name}</small>{(row.due_at||row.next_action_at)&&<small className={Date.parse(row.due_at||row.next_action_at)<Date.now()?'overdue':''}>{remaining(row.due_at||row.next_action_at)}</small>}<Link className="button secondary" to={inboxAction(db,page,row,stage,actorId)?`/inbox?${new URLSearchParams({search:row.code||row.initial_contact_name||'',type:page==='requests'?'PROPERTY':'INQUIRY'})}`:`/${page}/${row.id}`}>{inboxAction(db,page,row,stage,actorId)?'ادامه در کارتابل پذیرش':'مشاهده و ادامه پرونده'} ←</Link></article>;})}
   </section>;})}
  </div>
 </>;
}
