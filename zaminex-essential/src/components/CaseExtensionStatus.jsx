import React from 'react';
import {Link} from 'react-router-dom';
import {Clock3} from 'lucide-react';
import {canAccess} from '../services/operations';
import {canManageCase,pendingExtension} from '../services/intake';
import {date,staff} from './ui';
export default function CaseExtensionStatus({db,actorId,request,collection}){
 if(!request||!canAccess(db,actorId,collection,request))return null;
 const type=collection==='inquiries'?'inquiry':'registration_request';
 const history=db.rescheduleHistory.filter(h=>h.request_kind==='ASSIGNMENT_EXTENSION'&&h.subject_type===type&&h.subject_id===request.id);
 const pending=pendingExtension(db,collection,request),entry=pending||history.at(-1);
 if(!entry)return null;
 const title={PENDING:'درخواست تمدید مهلت در انتظار تأیید مدیر',APPROVED:'درخواست تمدید مهلت تأیید شده است',REJECTED:'درخواست تمدید مهلت رد شده است',CANCELLED:'درخواست تمدید مهلت لغو شده است'}[entry.status]||'وضعیت درخواست تمدید مهلت';
 const manager=canManageCase(db,actorId,request);
 const inbox=`/inbox?${new URLSearchParams({state:'EXTENSION_PENDING',search:request.code||'',type:collection==='inquiries'?'INQUIRY':'PROPERTY'})}`;
 return <section className="case-extension-status extension-notice" aria-label="وضعیت تمدید مهلت" role="status">
  <strong className="case-extension-title"><Clock3 size={20} aria-hidden="true"/>{title}</strong>
  <div className="case-extension-dates"><span>مهلت فعلی: <b>{request.due_at?date(request.due_at):'تعیین نشده'}</b></span><span>{entry.status==='APPROVED'?'مهلت تأییدشده':'مهلت پیشنهادی'}: <b>{entry.new_scheduled_at?date(entry.new_scheduled_at):'تعیین نشده'}</b></span></div>
  <p>دلیل درخواست: {entry.reason}</p>
  <p className="muted">درخواست‌کننده: {staff(db,entry.requested_by_id||entry.changed_by_id)}{entry.requested_at?` · ${date(entry.requested_at)}`:''}</p>
  {pending?<><p>تا تأیید مدیر، مهلت فعلی پرونده تغییر نمی‌کند.</p>{manager&&<Link className="button secondary" to={inbox}>بررسی تمدید در کارتابل پذیرش ←</Link>}</>:entry.decision_reason&&<p>نظر مدیر: {entry.decision_reason}{entry.decided_by_id?` · ${staff(db,entry.decided_by_id)}`:''}</p>}
 </section>;
}
