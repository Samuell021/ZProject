import test from 'node:test';
import assert from 'node:assert/strict';
import {createSeed} from '../mock/seed.js';
import {operate,canAccess} from './operations.js';
import {canOpenPage,isInAcceptanceInbox,syncLeadAcceptanceTasks} from './intake.js';
const fields={lead_type:'PROPERTY',management_scope_id:'s1',initial_contact_name:'سرنخ مشاور',initial_contact_phone:'09123330000'};
for(const lead_type of ['PROPERTY','INQUIRY'])test(`${lead_type}: consultant submits; only scope manager accepts; reception creates manager work; acceptance completes it`,()=>{
 let db=operate(createSeed(),'u4','createLead',{...fields,lead_type,deal_type_id:'sale'});
 const {collection,id}=db._result,row=db[collection].find(r=>r.id===id);
 assert.equal(row.assigned_to_id,null);
 assert.equal(row.lead_status,'NEW');
 const reception=db.tasks.filter(t=>t.subject_id===id&&t.task_type==='LEAD_ACCEPTANCE'&&t.status==='OPEN');
 assert.deepEqual(reception.map(t=>t.assigned_to_id),['u2']);
 assert.equal(row.created_by_id,'u4');
 assert.equal(isInAcceptanceInbox(db,'u2',collection,row),true);
 assert.equal(isInAcceptanceInbox(db,'u3',collection,row),false);
 assert.equal(isInAcceptanceInbox(db,'u4',collection,row),false);
 assert.throws(()=>operate(db,'u4','acceptLead',{collection,id}),/گروه|مدیریت/);
 assert.throws(()=>operate(db,'u3','acceptLead',{collection,id}),/دسترسی|مدیریت/);
 assert.throws(()=>operate(db,'u2','assignCase',{collection,id,assigned_to_id:'u5'}),/پذیرش سرنخ/);
 db=operate(db,'u2','acceptLead',{collection,id});
 assert.equal(db[collection].find(r=>r.id===id).lead_status,'ACCEPTED');
 const task=db.tasks.find(t=>t.subject_id===id&&t.task_type==='LEAD_ACCEPTANCE');
 assert.equal(task.status,'COMPLETED');
 assert.equal(isInAcceptanceInbox(db,'u2',collection,db[collection].find(r=>r.id===id)),false);
 assert.equal(canAccess(db,'u4','tasks',task),false);
 assert.throws(()=>operate(db,'u2','acceptLead',{collection,id}),/پذیرفته/);
 db=operate(db,'u2','assignCase',{collection,id,assigned_to_id:'u5',reason:'رسیدگی تخصصی'});
 assert(db.tasks.find(t=>t.id===task.id).status!=='OPEN');
 assert(db.tasks.some(t=>t.subject_id===id&&t.assigned_to_id==='u5'&&t.status==='OPEN'));
});
test('navigation obeys permissions and distinguishes submit-only from managerial lead access',()=>{
 const db=createSeed();
 assert.equal(canOpenPage(db,'u4','lead-submit'),true);
 for(const page of ['leads','groups','staff','teams','reviews','reports','finance','settings','guide'])assert.equal(canOpenPage(db,'u4',page),false,page);
 assert.equal(canOpenPage(db,'u2','leads'),true);
 assert.equal(canOpenPage(db,'u2','groups'),false);
 assert.equal(canOpenPage(db,'u7','deals'),true);
 db.groups.find(g=>g.code==='CONTRACT_OFFICER').permission_codes=[];
 assert.equal(canOpenPage(db,'u7','deals'),false);
 db.groups.find(g=>g.code==='AGENT').permission_codes=[];
 assert.equal(canOpenPage(db,'u4','lead-submit'),false);
});
test('consultants cannot choose another range or self-assign on submission',()=>{
 const db=createSeed();
 assert.throws(()=>operate(db,'u4','createLead',{...fields,management_scope_id:'s2'}),/رنج/);
 assert.throws(()=>operate(db,'u4','createLead',{...fields,assigned_to_id:'u4'}),/ارجاع/);
});

test('saved pending leads get reception tasks once without losing dossiers',()=>{
 let db=operate(createSeed(),'u4','createLead',fields);
 const id=db._result.id;
 db.tasks=db.tasks.filter(t=>t.subject_id!==id);
 syncLeadAcceptanceTasks(db);syncLeadAcceptanceTasks(db);
 assert.equal(db.tasks.filter(t=>t.subject_id===id&&t.task_type==='LEAD_ACCEPTANCE').length,1);
 assert.equal(db.registrationRequests.find(r=>r.id===id).created_by_id,'u4');
});

for(const lead_type of ['PROPERTY','INQUIRY'])test(`${lead_type}: manager's own lead bypasses reception`,()=>{
 const db=operate(createSeed(),'u2','createLead',{...fields,lead_type,deal_type_id:'sale'});
 const {collection,id}=db._result,row=db[collection].find(r=>r.id===id);
 assert.equal(row.lead_status,'ACCEPTED');
 assert.equal(row.lead_accepted_by_id,'u2');
 assert.equal(row.lead_accepted_at,row.created_at);
 assert.equal(row.created_by_id,'u2');
 assert.equal(row.assigned_to_id,null);
 assert.equal(isInAcceptanceInbox(db,'u2',collection,row),false);
 assert.equal(db.tasks.filter(t=>t.subject_id===id).length,0);
 assert.equal(db.notifications.filter(n=>n.subject_id===id&&n.title?.includes('انتظار پذیرش')).length,0);
 const assigned=operate(db,'u2','assignCase',{collection,id,assigned_to_id:'u4'});
 assert.equal(assigned[collection].find(r=>r.id===id).acceptance_status,'PENDING');
});
test('saved manager leads leave reception without resetting records',()=>{
 let db=operate(createSeed(),'u4','createLead',fields);
 const {collection,id}=db._result,row=db[collection].find(r=>r.id===id);
 row.created_by_id='u2';
 syncLeadAcceptanceTasks(db);syncLeadAcceptanceTasks(db);
 assert.equal(row.lead_status,'ACCEPTED');
 assert.equal(row.lead_accepted_by_id,'u2');
 assert(!db.tasks.some(t=>t.subject_id===id&&t.task_type==='LEAD_ACCEPTANCE'&&t.status==='OPEN'));
});
test('legacy manager lead forms also bypass reception',()=>{
 for(const [action,payload,collection] of [
  ['createRegistrationRequest',{management_scope_id:'s1',initial_contact_name:'مالک'},'registrationRequests'],
  ['createInquiry',{management_scope_id:'s1',contact_id:'c1',preference:{deal_type_id:'sale'}},'inquiries']
 ]) {
  const db=operate(createSeed(),'u2',action,payload),id=db._result.id;
  assert.equal(db[collection].find(r=>r.id===id).lead_status,'ACCEPTED');
  assert(!db.tasks.some(t=>t.subject_id===id&&t.task_type==='LEAD_ACCEPTANCE'&&t.status==='OPEN'));
 }
});

for(const lead_type of ['PROPERTY','INQUIRY'])test(`${lead_type}: consultant scope is resolved without form input`,()=>{
 const {management_scope_id,...input}=fields;
 const db=operate(createSeed(),'u4','createLead',{...input,lead_type,deal_type_id:'sale'});
 const {collection,id}=db._result;
 assert.equal(db[collection].find(r=>r.id===id).management_scope_id,'s1');
 assert(db.tasks.some(t=>t.subject_id===id&&t.assigned_to_id==='u2'&&t.task_type==='LEAD_ACCEPTANCE'));
});
test('manager can redirect a pending consultant lead to the colleague reception',()=>{
 let db=operate(createSeed(),'u4','createLead',fields);
 const {collection,id}=db._result;
 assert.throws(()=>operate(db,'u4','transferScope',{collection,id,to_scope_id:'s2',reason:'رنج دیگر'}),/مدیریت|گروه/);
 db=operate(db,'u2','transferScope',{collection,id,to_scope_id:'s2',reason:'مربوط به محدوده همکار'});
 assert.equal(db[collection].find(r=>r.id===id).created_by_id,'u4');
 assert(!db.tasks.some(t=>t.subject_id===id&&t.assigned_to_id==='u2'&&t.task_type==='LEAD_ACCEPTANCE'&&t.status==='OPEN'));
 assert(db.tasks.some(t=>t.subject_id===id&&t.assigned_to_id==='u3'&&t.task_type==='LEAD_ACCEPTANCE'&&t.status==='OPEN'));
 db=operate(db,'u3','transferScope',{collection,id,to_scope_id:'s1',reason:'بازگرداندن به همکار'});
 assert.equal(db.tasks.filter(t=>t.subject_id===id&&t.assigned_to_id==='u2'&&t.task_type==='LEAD_ACCEPTANCE'&&t.status==='OPEN').length,1);
 const ids=db.tasks.filter(t=>t.subject_id===id).map(t=>t.id);assert.equal(new Set(ids).size,ids.length);
});

test('only the scope manager can mark a repeated submission against an existing case',()=>{
 let db=operate(createSeed(),'u4','createLead',{...fields,contact_id:'c1'});
 const {collection,id}=db._result;
 assert.throws(()=>operate(db,'u4','markDuplicateCase',{id,original_id:'r1',reason:'همان ملک'}),/گروه|مدیریت/);
 assert.throws(()=>operate(db,'u3','markDuplicateCase',{id,original_id:'r1',reason:'همان ملک'}),/دسترسی|مدیریت/);
 assert.throws(()=>operate(db,'u2','markDuplicateCase',{id,original_id:id,reason:'همان ملک'}),/یکسان|خود/);
 const original=structuredClone(db.registrationRequests.find(r=>r.id==='r1'));
 db=operate(db,'u2','markDuplicateCase',{id,original_id:'r1',reason:'این سرنخ مربوط به همان ملک است'});
 const row=db[collection].find(r=>r.id===id);
 assert.equal(row.status,'DUPLICATE');assert.equal(row.duplicate_of_id,'r1');assert.equal(row.duplicate_decided_by_id,'u2');
 assert.equal(row.created_by_id,'u4');
 assert(!db.tasks.some(t=>t.subject_id===id&&t.status==='OPEN'));
 assert.deepEqual(db.registrationRequests.find(r=>r.id==='r1'),original);
});

test('a known accessible caller can submit another property without duplicating the contact',()=>{
 const before=createSeed(),phone=before.contactPhones.find(p=>p.contact_id==='c1').phone_number;
 const db=operate(before,'u4','createLead',{...fields,initial_contact_phone:phone});
 assert.equal(db.registrationRequests.find(r=>r.id===db._result.id).contact_id,'c1');
 assert.equal(db.contacts.length,before.contacts.length);
});

test('property title is independent of lead notes and can only be set by its manager',()=>{
 let db=operate(createSeed(),'u4','createLead',{...fields,description:'شرح تماس اولیه؛ عنوان ملک نیست'});
 const id=db._result.id;
 assert.throws(()=>operate(db,'u4','setPropertyTitle',{id,title:'عنوان غیرمجاز'}),/گروه|مدیریت/);
 db=operate(db,'u2','setPropertyTitle',{id,title:'آپارتمان دوخوابه بهار'});
 assert.equal(db.registrationRequests.find(r=>r.id===id).title,'آپارتمان دوخوابه بهار');
 assert.equal(db.registrationRequests.find(r=>r.id===id).description,'شرح تماس اولیه؛ عنوان ملک نیست');
 assert.equal(db.registrationRequests.find(r=>r.id===id).resulting_property_id,null);
 db=operate(db,'u2','acceptLead',{collection:'registrationRequests',id});
 db=operate(db,'u2','assignCase',{collection:'registrationRequests',id,assigned_to_id:'u4'});
 db=operate(db,'u4','acceptAssignment',{collection:'registrationRequests',id});
 assert.throws(()=>operate(db,'u4','saveWorkspace',{id,property:{title:'عنوان غیرمجاز'}}),/عنوان.*مدیر/);
 db=operate(db,'u4','saveWorkspace',{id,property:{address:'تهران',area:100,district_id:'district1'},appraisal:{findings:'گزارش'}});
 const propertyId=db.registrationRequests.find(r=>r.id===id).resulting_property_id;
 assert.equal(db.properties.find(p=>p.id===propertyId).title,'آپارتمان دوخوابه بهار');
 db=operate(db,'u2','setPropertyTitle',{id,title:'عنوان اصلاح‌شده مدیر'});
 assert.equal(db.properties.find(p=>p.id===propertyId).title,'عنوان اصلاح‌شده مدیر');
 assert.equal(db.listings.find(l=>l.registration_request_id===id).title,'عنوان اصلاح‌شده مدیر');
});

for(const lead_type of ['PROPERTY','INQUIRY'])test(`${lead_type}: a caller hidden from the consultant can submit without exposing their existing contact`,()=>{
 const before=createSeed();
 const contact=before.contacts.find(c=>!canAccess(before,'u4','contacts',c)&&before.contactPhones.some(p=>p.contact_id===c.id));
 assert(contact,'fixture must contain an inaccessible caller');
 const phone=before.contactPhones.find(p=>p.contact_id===contact.id).phone_number;
 const db=operate(before,'u4','createLead',{...fields,lead_type,deal_type_id:'sale',initial_contact_phone:phone});
 const {collection,id}=db._result,row=db[collection].find(r=>r.id===id);
 assert.notEqual(row.contact_id,contact.id);
 assert.equal(db.contacts.length,before.contacts.length+1);
 assert.equal(canAccess(db,'u4','contacts',db.contacts.find(c=>c.id===contact.id)),false);
 assert.deepEqual(db.contacts.find(c=>c.id===contact.id),contact);
 assert.equal(row.lead_status,'NEW');
 assert(db.tasks.some(t=>t.subject_id===id&&t.assigned_to_id==='u2'&&t.task_type==='LEAD_ACCEPTANCE'));
 assert.throws(()=>operate(before,'u4','createLead',{...fields,contact_id:contact.id}),/دسترسی/);
});
