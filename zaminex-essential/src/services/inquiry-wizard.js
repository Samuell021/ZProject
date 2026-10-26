import {latestCompletedViewing} from './collaboration.js';
import {leadState,assignmentState} from './intake.js';
import {scopeManagerNames} from './property-wizard.js';
export const inquiryWizardSteps=[
 ['lead','ثبت درخواست','ثبت‌کننده'],['reception','پذیرش مدیر','مدیر رنج'],['assignment','ارجاع','مدیر رنج'],
 ['acceptance','پذیرش مشاور','مشاور مسئول'],['needs','تکمیل نیاز','مشاور مسئول'],['matching','معرفی فایل','مشاور مسئول'],
 ['viewings','بازدید','مشاور مسئول'],['negotiation','مذاکره','مشاور مسئول'],['contract','قرارداد','مدیرکل']
];
export function inquiryWizardStage(db,row){
 if(['CLOSED','CANCELLED','DUPLICATE','LOST'].includes(row.status))return 'closed';
 if(row.status==='COMPLETED')return 'contract';
 if(leadState(row)==='NEW')return 'reception';
 const state=assignmentState(db,'inquiries',row);
 if(!row.assigned_to_id||state==='REJECTED')return 'assignment';
 if(state==='PENDING')return 'acceptance';
 const intros=db.introductions.filter(i=>i.inquiry_id===row.id&&!['REJECTED','CANCELLED'].includes(i.status));
 const deals=db.deals.filter(d=>d.inquiry_id===row.id&&!['LOST','CANCELLED','COMPLETED'].includes(d.stage));
 if(row.needs_status==='DRAFT'||!row.needs_confirmed_at&&!['MATCHING','INTRODUCED','NEGOTIATION','SEARCHING'].includes(row.status)&&!intros.length&&!deals.length)return 'needs';
 const introIds=new Set(intros.map(i=>i.id));
 if(deals.some(d=>['AGREED','CONTRACT','FINALIZED'].includes(d.stage)))return 'contract';
 if(deals.some(d=>['NEGOTIATION','OFFERED'].includes(d.stage)))return 'negotiation';
 if(intros.some(i=>{
  const visit=latestCompletedViewing(db,i.id);
  return visit?.interest==='INTERESTED'&&!db.deals.some(d=>d.inquiry_id===row.id&&d.listing_id===i.listing_id&&(d.viewing_id===visit.id||!d.viewing_id));
 }))return 'viewings';
 if(db.viewings.some(v=>introIds.has(v.introduction_id)&&v.status==='SCHEDULED'))return 'viewings';
 if(intros.some(i=>{const visit=latestCompletedViewing(db,i.id);return visit&&!visit.interest;}))return 'viewings';
 return 'matching';
}
export function inquiryStageResponsible(db,row,stage){
 if(!row)return '';
 const name=id=>db.staffProfiles.find(p=>p.user_id===id)?.full_name||'مسئول تعیین نشده';
 if(stage==='lead')return name(row.created_by_id);
 if(['reception','assignment'].includes(stage))return scopeManagerNames(db,row.management_scope_id);
 if(stage==='contract')return db.users.filter(u=>u.is_active&&u.group_ids.some(id=>db.groups.find(g=>g.id===id)?.code==='GENERAL_MANAGER')).map(u=>name(u.id)).join('، ')||'مدیرکل فعال تعیین نشده';
 return name(row.assigned_to_id);
}
