import CaseExtensionStatus from '../components/CaseExtensionStatus';
import ConsultantWithdrawal from '../components/ConsultantWithdrawal';
import PropertyHistoryModal from "./PropertyHistoryModal";
import React from 'react';
import {useSearchParams} from 'react-router-dom';
import {Modal,Form,Field} from '../components/ui';
import CaseActivities from '../components/CaseActivities';
import {canAccess} from '../services/operations';
import {canUseAction} from '../services/action-availability';
export default function PropertyCasePanels({db,request,actorId,run,busy,renderAction,modal=false,page="requests"}) {
 const [q,setQ]=useSearchParams();
 const collection=page==='inquiries'?'inquiries':'registrationRequests';
 const subject=page==='inquiries'?'inquiry':'registration_request';
 const panel=q.get('casePanel');
 if(!canAccess(db,actorId,collection,request))return null;
 const action=q.get('activityAction');
 const visible=collection=>(db[collection]||[]).filter(row=>canAccess(db,actorId,collection,row));
 const open=(name,id)=>{const next=new URLSearchParams(q);next.set('activityAction',name);if(id)next.set('activityRecord',id);else next.delete('activityRecord');setQ(next);};
 const closeAction=()=>{const next=new URLSearchParams(q);next.delete('activityAction');next.delete('activityRecord');setQ(next);};
 const perform=async(name,payload)=>{const result=await run(name,payload);if(result)closeAction();return result;};
 const followup=visible('followUps').find(f=>f.id===q.get('activityRecord')&&f.subject_type===subject&&f.subject_id===request.id&&!['COMPLETED','DONE','CANCELLED'].includes(f.status));
 const creation=['followup','createTask'].includes(action)&&canUseAction(db,actorId,page,request,action);
 const work=<div className="flow-work-panel">{modal&&<CaseExtensionStatus db={db} actorId={actorId} request={request} collection={collection}/>}<ConsultantWithdrawal db={db} actorId={actorId} request={request} collection={collection} run={run} busy={busy}/><CaseActivities page={page} row={request} db={db} visible={visible} can={name=>canUseAction(db,actorId,page,request,name)} action={name=>open(name)} run={run} busy={busy} onFollowupAction={(name,row)=>open(name,row.id)}/></div>;
 return <>
  {panel==='history'&&<PropertyHistoryModal db={db} actorId={actorId} request={request} parameter="casePanel" collection={collection} run={run} busy={busy}/>}
  {modal?<Modal title="کارها و پیگیری‌های پرونده" className="property-work-modal" parameter="workCase" clearParameters={['activityAction','activityRecord','postponeTask']}><p className="muted">{request.code} · {request.title||request.initial_contact_name}</p>{work}</Modal>:work}
   {(creation||followup&&['result','reschedule'].includes(action))&&<Modal title={{followup:'ثبت پیگیری',createTask:'ثبت کار',result:'ثبت نتیجه پیگیری',reschedule:'تعویق پیگیری'}[action]} parameter="activityAction" clearParameters={['activityRecord']}>
    {creation?renderAction(action,request,perform):<Form busy={busy} onSubmit={fields=>perform(action==='result'?'completeFollowUp':'rescheduleFollowUp',{id:followup.id,...fields})}>
     {action==='result'?<><Field name="outcome" title="نتیجه پیگیری" type="textarea" required/><Field name="next_action" title="اقدام بعدی (اختیاری)"/><Field name="next_action_at" title="موعد اقدام بعدی" type="datetime-local" calendar/></>:<><Field name="scheduled_at" title="زمان جدید پیگیری" type="datetime-local" calendar required/><Field name="reason" title="دلیل تعویق" type="textarea" required/></>}
    </Form>}
   </Modal>}
 </>;
}
