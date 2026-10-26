import test from 'node:test';import assert from 'node:assert/strict';
import {createSeed} from '../mock/seed.js';import {operate} from './operations.js';import {pendingWithdrawal,canReassign} from './intake.js';import {acceptanceRecords} from './acceptance-inbox.js';
for(const [collection,id] of [['registrationRequests','r12'],['inquiries','i12']])test(`${collection}: withdrawal requires scoped approval before reassignment`,()=>{
 let db=createSeed();const original=db[collection].find(r=>r.id===id);db=operate(db,'u6','rejectAssignment',{collection,id,reason:'تداخل مأموریت'});let row=db[collection].find(r=>r.id===id),request=pendingWithdrawal(db,collection,row);
 assert(request);assert.equal(row.assigned_to_id,'u6');assert.equal(row.acceptance_status,original.acceptance_status);assert.equal(canReassign(db,collection,row),false);assert(acceptanceRecords(db,'u3').some(r=>r.row.id===id&&r.state==='WITHDRAWAL_PENDING'));
 assert.throws(()=>operate(db,'u3','assignCase',{collection,id,assigned_to_id:'u6',due_at:'2030-01-01'}));assert.throws(()=>operate(db,'u6','acceptAssignment',{collection,id}));assert.throws(()=>operate(db,'u6','rejectAssignment',{collection,id,reason:'دوباره'}));
 for(const actor of ['u2','u6'])assert.throws(()=>operate(db,actor,'reviewConsultantWithdrawal',{collection,id,request_id:request.id,decision:'APPROVE',reason:'تأیید'}));
 db=operate(db,'u3','reviewConsultantWithdrawal',{collection,id,request_id:request.id,decision:'APPROVE',reason:'تأیید انصراف'});row=db[collection].find(r=>r.id===id);assert.equal(row.assigned_to_id,null);assert.equal(canReassign(db,collection,row),true);assert(!acceptanceRecords(db,'u3').some(r=>r.row.id===id));
 assert.throws(()=>operate(db,'u3','reviewConsultantWithdrawal',{collection,id,request_id:request.id,decision:'APPROVE',reason:'دوباره'}));
 db=operate(db,'u3','assignCase',{collection,id,assigned_to_id:'u6',due_at:'2030-01-01'});assert.equal(db[collection].find(r=>r.id===id).acceptance_status,'PENDING');
});
test('rejecting withdrawal preserves accepted responsibility and demo covers all decisions',()=>{
 let db=createSeed();const row=db.inquiries.find(r=>r.id==='i18'),request=pendingWithdrawal(db,'inquiries',row);assert.equal(row.acceptance_status,'ACCEPTED');
 db=operate(db,'u3','reviewConsultantWithdrawal',{collection:'inquiries',id:'i18',request_id:request.id,decision:'REJECT',reason:'زمان‌بندی با متقاضی هماهنگ شد'});const saved=db.inquiries.find(r=>r.id==='i18');assert.equal(saved.assigned_to_id,'u6');assert.equal(saved.acceptance_status,'ACCEPTED');assert.equal(pendingWithdrawal(db,'inquiries',saved),undefined);
 const seed=createSeed();for(const status of ['PENDING','APPROVED','REJECTED'])assert(seed.rescheduleHistory.some(h=>h.request_kind==='CONSULTANT_WITHDRAWAL'&&h.status===status));
});
