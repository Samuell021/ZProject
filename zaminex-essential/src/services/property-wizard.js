import { leadState } from './intake.js';
import { propertyReviewState } from './property-listings.js';
export const propertyWizardSteps = [
 ['lead','ثبت سرنخ','ثبت‌کننده'], ['reception','پذیرش مدیر','مدیر رنج'], ['assignment','ارجاع','مدیر رنج'],
 ['acceptance','پذیرش مشاور','مشاور مسئول'], ['appraisal','کارشناسی ملک','مشاور مسئول'], ['review','تأیید ملک','مدیر رنج'], ['listing','فایل عرضه','مشاور مسئول'],
];
export function propertyWizardStage(db, request) {
 if(['CANCELLED','DUPLICATE','CLOSED'].includes(request.status))return 'closed';
 if(leadState(request)==='NEW')return 'reception';
 if(!request.assigned_to_id||request.acceptance_status==='REJECTED')return 'assignment';
 if(request.acceptance_status==='PENDING'||(!request.acceptance_status&&request.status==='ASSIGNED'))return 'acceptance';
 const property=db.properties.find(p=>p.id===request.resulting_property_id);
 const review=property&&propertyReviewState(db,property);
 if(review==='APPROVED')return 'listing';
 if(review==='PENDING')return 'review';
 return 'appraisal';
}

const personName = (db, id) => db.staffProfiles.find(p=>p.user_id===id)?.full_name || '';
export function scopeManagerNames(db, scopeId) {
 const ids=[...new Set(db.memberships.filter(m=>m.scope_id===scopeId&&m.membership_role==='MANAGER'&&!m.left_at&&db.users.some(u=>u.id===m.user_id&&u.is_active)).map(m=>m.user_id))];
 return ids.map(id=>personName(db,id)).filter(Boolean).join('، ') || 'مدیر فعال تعیین نشده';
}
export function propertyStageResponsible(db, request, stage) {
 if(!request)return '';
 if(stage==='lead')return personName(db,request.created_by_id)||'ثبت‌کننده مشخص نشده';
 if(['reception','assignment','review'].includes(stage))return scopeManagerNames(db,request.management_scope_id);
 return personName(db,request.assigned_to_id)||'مشاور هنوز تعیین نشده';
}
