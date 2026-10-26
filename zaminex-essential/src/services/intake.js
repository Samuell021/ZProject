import {propertyReviewState} from "./property-listings.js";
const closed = new Set(['COMPLETED', 'CANCELLED', 'DUPLICATE', 'CLOSED']);
export function groupsFor(db, userId) {
  const user = db.users.find(u => u.id === userId && u.is_active);
  return user ? db.groups.filter(g => user.group_ids.includes(g.id)) : [];
}
export function canManageCase(db, userId, row) {
  const codes = groupsFor(db, userId).map(g => g.code);
  return codes.includes('GENERAL_MANAGER') || codes.includes('RANGE_MANAGER') && db.memberships.some(m => m.user_id === userId && !m.left_at && m.membership_role === 'MANAGER' && m.scope_id === row.management_scope_id);
}
export function canOpenPage(db, userId, page) {
  const groups=groupsFor(db,userId), codes=groups.map(g=>g.code);
  if(!groups.length)return false;
  if(codes.includes('GENERAL_MANAGER'))return true;
  if(page==='contracts')return false;
  const has=(...permissions)=>groups.some(g=>g.permission_codes?.some(p=>p==='*'||permissions.includes(p)));
  const manager=codes.includes('RANGE_MANAGER')&&db.memberships.some(m=>m.user_id===userId&&!m.left_at&&m.membership_role==='MANAGER');
  if(['dashboard','tasks','notifications'].includes(page))return true;
  if(['groups','settings','guide'].includes(page))return false;
  if(page==='leads')return manager&&has('registration','inquiry');
  if(page==='inquiry-register')return canOpenPage(db,userId,'lead-submit')&&has('inquiry');
  if(page==='property-register')return canOpenPage(db,userId,'lead-submit');
  if(page==='lead-submit')return (manager||codes.includes('AGENT')&&db.memberships.some(m=>m.user_id===userId&&!m.left_at&&m.membership_role==='CONSULTANT'))&&has('registration','inquiry');
  if(['teams','staff','reports'].includes(page))return manager&&has('team');
  if(page==='reviews')return manager&&has('team')&&has('registration');
  if(page==='contacts')return has('registration','inquiry','contract','finance');
  if(page==='pipelines')return has('registration','inquiry','deal');
  if(page==='deals')return has('deal')||codes.includes('CONTRACT_OFFICER')&&has('contract');
  if(page==='contracts')return has('contract')||codes.includes('FINANCE')&&has('finance');
  const permission={inbox:['registration','inquiry'],requests:['registration'],properties:['registration'],listings:['deal'],explore:['deal'],inquiries:['inquiry'],introductions:['inquiry'],viewings:['deal'],followups:['deal'],finance:['finance']}[page];
  return !!permission&&has(...permission);
}
export function leadState(row) {
  return row.lead_status || (row.assigned_to_id || ['COMPLETED','CANCELLED','DUPLICATE','CLOSED'].includes(row.status) ? 'ACCEPTED' : 'NEW');
}
export function assignmentState(db, collection, row) {
  if (row.acceptance_status) return row.acceptance_status;
  if (!row.assigned_to_id) return 'UNASSIGNED';
  return collection === 'registrationRequests' && row.status === 'ASSIGNED' ? 'PENDING' : 'ACCEPTED';
}
export function assignedAt(db, collection, row) {
  const field = collection === 'inquiries' ? 'inquiry_id' : 'registration_request_id';
  return row.assigned_at || db.assignmentHistory.filter(h => h[field] === row.id).at(-1)?.assigned_at || row.created_at;
}
export function canReassign(db, collection, row, now = Date.now()) {
  if (closed.has(row.status) || leadState(row)==='NEW'||pendingWithdrawal(db,collection,row)) return false;
  const state = assignmentState(db, collection, row);
  if (state === 'UNASSIGNED' || state === 'REJECTED') return true;
  return state === 'PENDING' && now - new Date(assignedAt(db, collection, row)).getTime() >= 48 * 3600000;
}
export function inOperationalPipeline(collection, row) {
  if (["COMPLETED","CANCELLED","DUPLICATE","FINALIZED","LOST","WON","CLOSED"].includes(row.stage||row.status)) return false;
  if (collection === 'registrationRequests') return !['NEW', 'ASSIGNED'].includes(row.status) && (!row.acceptance_status || row.acceptance_status === 'ACCEPTED');
  if (collection === 'inquiries') return !['NEW', 'OPEN'].includes(row.status) && (!row.acceptance_status || row.acceptance_status === 'ACCEPTED');
  return true;
}
export function pendingExtension(db, collection, row) {
 const type=collection==='inquiries'?'inquiry':'registration_request';
 return db.rescheduleHistory.find(h=>h.request_kind==='ASSIGNMENT_EXTENSION'&&h.subject_type===type&&h.subject_id===row.id&&h.status==='PENDING');
}
export function pendingWithdrawal(db,collection,row) {
 const type=collection==='inquiries'?'inquiry':'registration_request';
 return db.rescheduleHistory.find(h=>h.request_kind==='CONSULTANT_WITHDRAWAL'&&h.subject_type===type&&h.subject_id===row.id&&h.status==='PENDING');
}
export function isInAcceptanceInbox(db, actorId, collection, row) {
 if(closed.has(row.status))return false;
 if(pendingWithdrawal(db,collection,row))return canManageCase(db,actorId,row)||row.assigned_to_id===actorId;
 if(leadState(row)==='NEW')return canManageCase(db,actorId,row);
 const state=assignmentState(db,collection,row);
 if(canManageCase(db,actorId,row))return (collection==='registrationRequests'&&row.status==='PENDING_REVIEW'&&propertyReviewState(db,db.properties.find(p=>p.id===row.resulting_property_id))==='PENDING')||!!pendingExtension(db,collection,row);
 return row.assigned_to_id===actorId&&(state==='PENDING'||!!pendingExtension(db,collection,row));
}

// Apply self-registration policy and restore reception work without resetting dossiers.
export function syncLeadAcceptanceTasks(db) {
 for(const collection of ['registrationRequests','inquiries'])for(const row of db[collection]) {
  if(leadState(row)!=='NEW'||closed.has(row.status))continue;
  const subject_type=collection==='registrationRequests'?'registration_request':'inquiry';
  if(canOpenPage(db,row.created_by_id,'leads')&&canManageCase(db,row.created_by_id,row)) {
   row.lead_status='ACCEPTED';row.lead_accepted_by_id=row.created_by_id;row.lead_accepted_at=row.created_at;
   for(const task of db.tasks.filter(t=>t.subject_type===subject_type&&t.subject_id===row.id&&t.task_type==='LEAD_ACCEPTANCE'&&t.status==='OPEN')) {
    task.status='CANCELLED';task.cancellation_reason='ثبت سرنخ توسط مدیر مسئول؛ پذیرش جداگانه لازم نیست';
   }
   continue;
  }
  const managers=db.users.filter(user=>canOpenPage(db,user.id,'leads')&&groupsFor(db,user.id).some(g=>g.code==='RANGE_MANAGER')&&canManageCase(db,user.id,row));
  for(const manager of managers) {
   if(db.tasks.some(t=>t.subject_type===subject_type&&t.subject_id===row.id&&t.assigned_to_id===manager.id&&t.task_type==='LEAD_ACCEPTANCE'&&t.status==='OPEN'))continue;
   const id=`lead-acceptance:${subject_type}:${row.id}:${manager.id}:${db.tasks.length}`;
   db.tasks.push({id,title:`پذیرش سرنخ ${row.code}`,assigned_to_id:manager.id,created_by_id:row.created_by_id,
    due_at:new Date(new Date(row.created_at||Date.now()).getTime()+86400000).toISOString(),priority:'NORMAL',status:'OPEN',
    task_type:'LEAD_ACCEPTANCE',subject_type,subject_id:row.id,generation_key:id,created_at:row.created_at});
  }
 }
 return db;
}

export function possibleDuplicateCases(db,actorId,row) {
 if(!canOpenPage(db,actorId,'leads')||!canManageCase(db,actorId,row))return [];
 // Shared contact is a warning only: one owner may have several properties.
 const phone=row.initial_contact_phone?.replace(/\D/g,'');
 return db.registrationRequests.filter(other=>other.id!==row.id&&!['DUPLICATE','CANCELLED','CLOSED'].includes(other.status)&&canManageCase(db,actorId,other)&&(
  row.contact_id&&other.contact_id===row.contact_id||phone&&other.initial_contact_phone?.replace(/\D/g,'')===phone||row.resulting_property_id&&other.resulting_property_id===row.resulting_property_id));
}

export function canRequestExtension(db,actorId,collection,row,now=Date.now()) {
 return row.assigned_to_id===actorId&&!closed.has(row.status)&&assignmentState(db,collection,row)==='ACCEPTED'&&
  Number.isFinite(Date.parse(row.due_at))&&Date.parse(row.due_at)<=now&&!pendingExtension(db,collection,row)&&!pendingWithdrawal(db,collection,row);
}
