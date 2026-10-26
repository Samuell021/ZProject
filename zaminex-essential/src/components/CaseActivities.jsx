import {activitySubjects} from "../services/activities";
import TaskPostpone from "./TaskPostpone";
import React from 'react';
import {Link} from 'react-router-dom';
import {Badge,date,Empty,staff} from './ui';
export default function CaseActivities({page,row,db,visible,can,action,run,busy,onFollowupAction}) {
 const subject=activitySubjects[page];
 const follows=visible('followUps').filter(f=>f.subject_type===subject&&f.subject_id===row.id);
 const tasks=visible('tasks').filter(t=>t.subject_type===subject&&t.subject_id===row.id&&t.task_type==='MANUAL');
 const entries=[...follows.map(f=>({...f,kind:'followup',time:f.scheduled_at})),...tasks.map(t=>({...t,kind:'task',time:t.due_at}))].sort((a,b)=>Date.parse(a.time)-Date.parse(b.time));
 return <aside className="panel case-activities" aria-label="کارها و پیگیری‌های پرونده">
  <h3>کارها و پیگیری‌ها</h3>
  <div className="action-row">
   {can('followup')&&<button onClick={()=>action('followup')}>ثبت پیگیری</button>}
   {can('createTask')&&<button className="secondary" onClick={()=>action('createTask')}>ثبت کار</button>}
  </div>
  {!can('followup')&&!can('createTask')&&<p className="muted">ثبت کار و پیگیری برای موارد باز و دارای دسترسی فعال است.</p>}
  {!entries.length&&<Empty/>}
  {entries.map(entry=><article className="card" key={`${entry.kind}:${entry.id}`}>
   <small>{entry.kind==='task'?'کار':'پیگیری'}</small>
   <h4>{entry.title||entry.notes||entry.next_action}</h4>
   <Badge value={entry.status}/>
   <p>{date(entry.time)}</p>
   <small>مسئول: {staff(db,entry.assigned_to_id||entry.consultant_id)}</small>
   {entry.description&&<p>{entry.description}</p>}
   {entry.next_action&&<p>اقدام بعدی: {entry.next_action}</p>}
   {entry.outcome&&<p>نتیجه: {entry.outcome}</p>}
   {!['COMPLETED','DONE','CANCELLED'].includes(entry.status)&&(entry.kind==='task'
    ?<div className="action-row"><button className="secondary" disabled={busy} onClick={()=>run('completeTask',{id:entry.id})}>انجام شد</button><TaskPostpone task={entry} run={run} busy={busy}/></div>
    :<div className="action-row">{onFollowupAction?<><button className="secondary" onClick={()=>onFollowupAction('result',entry)}>ثبت نتیجه</button><button className="secondary" onClick={()=>onFollowupAction('reschedule',entry)}>تعویق</button></>:<><Link className="button secondary" to={`/followups?action=followupResult&record=${entry.id}`}>ثبت نتیجه</Link><Link className="button secondary" to={`/followups?action=reschedule&record=${entry.id}`}>تعویق</Link></>}</div>)}
  </article>)}
 </aside>;
}
