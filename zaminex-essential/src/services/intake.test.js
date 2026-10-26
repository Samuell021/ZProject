import test from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from '../mock/seed.js';
import { operate, canAccess } from './operations.js';
import { canManageCase, assignmentState, canReassign, canOpenPage, inOperationalPipeline, isInAcceptanceInbox } from './intake.js';
function assigned(collection = 'registrationRequests') {
  let db = createSeed();
  if (collection === 'registrationRequests') {
    db = operate(db, 'u2', 'createRegistrationRequest', {
      management_scope_id: 's1',
      initial_contact_name: 'مالک آزمون'
    });
  } else {
    db = operate(db, 'u2', 'createInquiry', {
      management_scope_id: 's1',
      contact_id: 'c1',
      preference: {
        deal_type_id: 'sale'
      }
    });
  }
  const id = db._result.id;
  db = operate(db, 'u2', 'assignCase', {
    collection,
    id,
    assigned_to_id: 'u4',
    due_at: new Date(Date.now() + 86400000).toISOString(),
    reason: 'کارشناسی اولیه'
  });
  return {
    db,
    id
  };
}
test('menu access uses groups, permissions and scope management', () => {
  const db = createSeed();
  assert.equal(canOpenPage(db, 'u4', 'staff'), false);
  assert.equal(canOpenPage(db, 'u4', 'finance'), false);
  assert.equal(canOpenPage(db, 'u8', 'finance'), true);
  assert.equal(canOpenPage(db, 'u4', 'inbox'), true);
  assert.equal(canManageCase(db, 'u2', {
    management_scope_id: 's2'
  }), false);
});
for (const collection of ['registrationRequests', 'inquiries']) {
  test(`${collection}: intake creates dossier before operational pipeline and requires assigned consultant acceptance`, () => {
    let {
      db,
      id
    } = assigned(collection);
    let row = db[collection].find(r => r.id === id);
    assert.equal(assignmentState(db, collection, row), 'PENDING');
    assert.equal(inOperationalPipeline(collection, row), false);
    assert.throws(() => operate(db, 'u5', 'acceptAssignment', {
      collection,
      id
    }), /مسئول|دسترسی/);
    assert.throws(() => operate(db, 'u2', 'acceptAssignment', {
      collection,
      id
    }), /مسئول|گروه/);
    db = operate(db, 'u4', 'acceptAssignment', {
      collection,
      id
    });
    row = db[collection].find(r => r.id === id);
    assert.equal(row.acceptance_status, 'ACCEPTED');
    assert.equal(inOperationalPipeline(collection, row), true);
    assert.equal(row.status, collection === 'registrationRequests' ? 'IN_PROGRESS' : 'MATCHING');
  });
  test(`${collection}: managers can reassign unanswered cases after exactly 48 hours, preserving history`, () => {
    let {
      db,
      id
    } = assigned(collection);
    const row = db[collection].find(r => r.id === id);
    assert.equal(canReassign(db, collection, row), false);
    assert.throws(() => operate(db, 'u2', 'assignCase', {
      collection,
      id,
      assigned_to_id: 'u5',
      reason: 'تعویض زودهنگام'
    }), /دو روز/);
    row.assigned_at = new Date(Date.now() - 48 * 3600000).toISOString();
    assert.equal(canReassign(db, collection, row), true);
    db = operate(db, 'u2', 'assignCase', {
      collection,
      id,
      assigned_to_id: 'u5',
      reason: 'عدم پاسخ در دو روز'
    });
    assert.equal(db[collection].find(r => r.id === id).assigned_to_id, 'u5');
    const history = db.assignmentHistory.filter(h => h[collection === 'inquiries' ? 'inquiry_id' : 'registration_request_id'] === id);
    assert.equal(history.length, 2);
    assert.equal(history[1].previous_assignee_id, 'u4');
    assert.equal(history[1].new_assignee_id, 'u5');
    assert.equal(canAccess(db, 'u4', collection, db[collection].find(r => r.id === id)), false);
    assert(db.tasks.filter(t => t.subject_id === id && t.assigned_to_id === 'u4').every(t => t.status === 'CANCELLED'));
  });
  test(`${collection}: rejection records reason and allows manager reassignment, never by consultant`, () => {
    let {
      db,
      id
    } = assigned(collection);
    assert.throws(() => operate(db, 'u4', 'rejectAssignment', {
      collection,
      id,
      reason: ''
    }), /دلیل/);
    db = operate(db, 'u4', 'rejectAssignment', {
      collection,
      id,
      reason: 'خارج از تخصص'
    });
    assert.equal(db[collection].find(r => r.id === id).acceptance_status, 'REJECTED');
    assert.equal(isInAcceptanceInbox(db,'u4',collection,db[collection].find(r=>r.id===id)),false);
    assert.equal(canAccess(db,'u4',collection,db[collection].find(r=>r.id===id)),false);
    const managerTask=db.tasks.find(t=>t.subject_id===id&&t.assigned_to_id==='u2'&&t.task_type==='ASSIGNMENT_REVIEW');
    assert(managerTask);
    assert.equal(canAccess(db,'u4','tasks',managerTask),false);
    assert.equal(canAccess(db,'u2','tasks',managerTask),true);
    assert.equal(isInAcceptanceInbox(db,'u2',collection,db[collection].find(r=>r.id===id)),true);
    assert.throws(() => operate(db, 'u4', 'assignCase', {
      collection,
      id,
      assigned_to_id: 'u5',
      reason: 'تعویض'
    }), /گروه|مدیریت|دسترسی/);
    db = operate(db, 'u2', 'assignCase', {
      collection,
      id,
      assigned_to_id: 'u5',
      reason: 'پس از رد کارشناس'
    });
    assert.equal(db[collection].find(r => r.id === id).acceptance_status, 'PENDING');
    assert(db.activityLogs.some(l => l.action === 'rejectAssignment' && l.description === 'خارج از تخصص'));
  });
  test(`${collection}: postponement extends work deadline, records history, never extends acceptance clock`, () => {
    let {
      db,
      id
    } = assigned(collection);
    db=operate(db,"u4","acceptAssignment",{collection,id});
    db[collection].find(r=>r.id===id).due_at=new Date(Date.now()-3600000).toISOString();
    const before = db[collection].find(r => r.id === id);
    const assignedAt = before.assigned_at,
      oldDue = before.due_at;
    db = operate(db, 'u4', 'postponeAssignment', {
      collection,
      id,
      due_at: new Date(Date.now() + 3 * 86400000).toISOString(),
      reason: 'هماهنگی با مشتری'
    });
    const request=db.rescheduleHistory.find(h=>h.subject_id===id);
    assert.equal(db[collection].find(r=>r.id===id).due_at,oldDue);
    assert.equal(request.status,'PENDING');
    assert.throws(()=>operate(db,'u4','approveAssignmentExtension',{collection,id,request_id:request.id,reason:'خودتأییدی'}),/گروه|مدیریت/);
    db=operate(db,'u2','approveAssignmentExtension',{collection,id,request_id:request.id,reason:'زمان پیشنهادی مناسب است'});
    const after = db[collection].find(r => r.id === id);
    assert.equal(after.assigned_at, assignedAt);
    assert(after.due_at > oldDue);
    const h = db.rescheduleHistory.find(h => h.subject_id === id);
    assert.equal(h.old_scheduled_at, oldDue);
    assert.equal(h.new_scheduled_at, after.due_at);
  });
}
test('lead intake creates either dossier atomically, is retry-safe and never manufactures a property', () => {
  let db = createSeed();
  const properties = db.properties.length,
    contacts = db.contacts.length;
  const payload = {
    lead_type: 'PROPERTY',
    management_scope_id: 's1',
    initial_contact_name: 'سرنخ ملک',
    initial_contact_phone: '09121112222',
    operation_id: 'intake-retry'
  };
  db = operate(db, 'u2', 'createLead', payload);
  const id = db._result.id;
  assert.equal(db.properties.length, properties);
  assert.equal(db.registrationRequests.find(r => r.id === id).status, 'NEW');
  assert.equal(db.contacts.length, contacts + 1);
  const again = operate(db, 'u2', 'createLead', payload);
  assert.equal(again._result.id, id);
  assert.equal(again.contacts.length, db.contacts.length);
  db = operate(db, 'u2', 'createLead', {
    ...payload,
    operation_id: 'inquiry-lead',
    lead_type: 'INQUIRY',
    deal_type_id: 'sale'
  });
  assert.equal(db._result.collection, 'inquiries');
  const inquiry = db.inquiries.find(r => r.id === db._result.id);
  assert.equal(inquiry.assigned_to_id, null);
  assert.equal(assignmentState(db, 'inquiries', inquiry), 'UNASSIGNED');
  assert.equal(canAccess(db, 'u2', 'inquiries', inquiry), true);
  assert.throws(() => operate(db, 'u4', 'createLead', {
    ...payload,
    operation_id: 'invalid-scope',
    management_scope_id: 's2'
  }), /رنج|گروه/);
});
test('removing permission from a group denies command execution as well as navigation', () => {
  const {
    db,
    id
  } = assigned();
  db.groups.find(g => g.code === 'AGENT').permission_codes = [];
  assert.equal(canOpenPage(db, 'u4', 'inbox'), false);
  assert.throws(() => operate(db, 'u4', 'acceptAssignment', {
    collection: 'registrationRequests',
    id
  }), /مجوز/);
});
test('unaccepted inquiries cannot enter matching or introduce a listing via a direct command', () => {
  const {
    db,
    id
  } = assigned('inquiries');
  assert.throws(() => operate(db, 'u4', 'updateInquiry', {
    id,
    status: 'MATCHING',
    next_action: 'جست‌وجو',
    next_action_at: new Date(Date.now() + 86400000).toISOString()
  }), /بپذیرید/);
  assert.throws(() => operate(db, 'u4', 'introduceListing', {
    inquiry_id: id,
    listing_id: 'l7'
  }), /بپذیرید/);
});
test('lead inbox is exclusively managerial; consultants cannot create intake dossiers through any command', () => {
 const db=createSeed();
 for(const user of ['u4','u7','u8']) assert.equal(canOpenPage(db,user,'leads'),false);
 assert.equal(canOpenPage(db,'u1','leads'),true);
 assert.equal(canOpenPage(db,'u2','leads'),true);
 const fields={management_scope_id:'s1',lead_type:'PROPERTY',initial_contact_name:'سرنخ محدود',initial_contact_phone:'09121119999',contact_id:'c1',preference:{deal_type_id:'sale'}};
 for(const action of ['createRegistrationRequest','createInquiry'])assert.throws(()=>operate(db,'u4',action,fields),/گروه|مدیریت|مجوز/);
});
for (const collection of ['registrationRequests','inquiries']) {
 test(`${collection}: overdue extension waits for approval; rejection leaves the expired deadline intact`,()=>{
  let {db,id}=assigned(collection);
  const row=db[collection].find(r=>r.id===id);
  row.due_at=new Date(Date.now()-3600000).toISOString();
  const old=row.due_at,assignedTime=row.assigned_at;
  db=operate(db,'u4','acceptAssignment',{collection,id});
  db=operate(db,'u4','postponeAssignment',{collection,id,due_at:new Date(Date.now()+30*86400000).toISOString(),reason:'تمدید طولانی برای هماهنگی'});
  const request=db.rescheduleHistory.find(h=>h.subject_id===id);
  assert.equal(db[collection].find(r=>r.id===id).due_at,old);
  assert.equal(isInAcceptanceInbox(db,'u2',collection,db[collection].find(r=>r.id===id)),true);
  assert(db.tasks.some(t=>t.subject_id===id&&t.assigned_to_id==='u2'&&t.task_type==='ASSIGNMENT_REVIEW'&&t.status==='OPEN'));
  assert.throws(()=>operate(db,'u3','approveAssignmentExtension',{collection,id,request_id:request.id,reason:'خارج از رنج'}),/دسترسی|مدیریت/);
  db=operate(db,'u1','rejectAssignmentExtension',{collection,id,request_id:request.id,reason:'مدت پیشنهادی زیاد است'});
  assert.equal(db[collection].find(r=>r.id===id).due_at,old);
  assert.equal(db[collection].find(r=>r.id===id).assigned_at,assignedTime);
  assert.equal(db.rescheduleHistory.find(h=>h.id===request.id).status,'REJECTED');
  assert.equal(isInAcceptanceInbox(db,'u2',collection,db[collection].find(r=>r.id===id)),false);
  assert.throws(()=>operate(db,'u2','approveAssignmentExtension',{collection,id,request_id:request.id,reason:'تصمیم دوباره'}),/پیدا نشد/);
 });
 test(`${collection}: scope transfer cancels accepted consultant extension request`,()=>{
  let {db,id}=assigned(collection);
  db=operate(db,'u4','acceptAssignment',{collection,id});
  db[collection].find(r=>r.id===id).due_at=new Date(Date.now()-3600000).toISOString();
  db=operate(db,'u4','postponeAssignment',{collection,id,due_at:new Date(Date.now()+3*86400000).toISOString(),reason:'هماهنگی'});
  const request=db.rescheduleHistory.find(h=>h.subject_id===id);
  db=operate(db,'u2','transferScope',{collection,id,to_scope_id:'s2',assigned_to_id:'u6',reason:'انتقال به کارشناس رنج همکار'});
  assert.equal(db.rescheduleHistory.find(h=>h.id===request.id).status,'CANCELLED');
  assert.throws(()=>operate(db,'u3','approveAssignmentExtension',{collection,id,request_id:request.id,reason:'تأیید دیرهنگام'}),/پیدا نشد/);
 });
}

for(const collection of ['registrationRequests','inquiries'])test(`${collection}: extension requires acceptance and an expired deadline`,()=>{
 let {db,id}=assigned(collection);
 const payload={collection,id,due_at:new Date(Date.now()+7*86400000).toISOString(),reason:'هماهنگی بیشتر'};
 db[collection].find(r=>r.id===id).due_at=new Date(Date.now()-3600000).toISOString();
 assert.throws(()=>operate(db,'u4','postponeAssignment',payload),/پذیرش|پذیرفته/);
 db=operate(db,'u4','acceptAssignment',{collection,id});
 db[collection].find(r=>r.id===id).due_at=new Date(Date.now()+3600000).toISOString();
 assert.throws(()=>operate(db,'u4','postponeAssignment',payload),/مهلت.*تمام|پایان/);
 db[collection].find(r=>r.id===id).due_at=new Date(Date.now()-1000).toISOString();
 db=operate(db,'u4','postponeAssignment',payload);
 assert(db.rescheduleHistory.some(h=>h.subject_id===id&&h.status==='PENDING'));
});
