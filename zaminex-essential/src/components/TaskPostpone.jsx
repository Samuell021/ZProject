import React from 'react';
import {useSearchParams} from 'react-router-dom';
import {Field,Form,Modal,date} from './ui';
export default function TaskPostpone({task,run,busy}) {
 const [q,setQ]=useSearchParams();
 const close=()=>{const next=new URLSearchParams(q);next.delete('postponeTask');setQ(next);};
 const active=task.task_type==='MANUAL'&&!['COMPLETED','DONE','CANCELLED'].includes(task.status);
 return <>
  {active&&<button className="secondary" onClick={()=>{const next=new URLSearchParams(q);next.set('postponeTask',task.id);setQ(next);}}>تعویق با دلیل</button>}
  {task.postponements?.length>0&&<details><summary>سابقه تعویق کار</summary>{task.postponements.map((item,index)=><p key={index}>{date(item.previous_due_at)} ← {date(item.new_due_at)}<br/>{item.reason}</p>)}</details>}
  {active&&q.get('postponeTask')===task.id&&<Modal title="تعویق کار" parameter="postponeTask"><Form busy={busy} onSubmit={async fields=>{if(await run('rescheduleTask',{id:task.id,...fields}))close();}}><p className="muted full-width">مهلت فعلی: {date(task.due_at)}</p><Field name="due_at" title="مهلت جدید کار" type="datetime-local" calendar required/><Field name="reason" title="دلیل تعویق" type="textarea" required/></Form></Modal>}
 </>;
}
