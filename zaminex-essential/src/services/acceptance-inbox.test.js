import test from 'node:test';
import assert from 'node:assert/strict';
import {createSeed} from '../mock/seed.js';
import {operate,canAccess} from './operations.js';
import {acceptanceRecords,matchesAcceptanceTab,acceptanceTabs} from './acceptance-inbox.js';
test('accepted cases awaiting assignment stay in their dossiers rather than acceptance inbox',()=>{
 let db=createSeed();
 db=operate(db,'u2','createLead',{lead_type:'PROPERTY',management_scope_id:'s1',initial_contact_name:'آماده ارجاع',initial_contact_phone:'09123456789'});
 const id=db._result.id;
 for(const actor of ['u1','u2']){
  const row=acceptanceRecords(db,actor).find(r=>r.row.id===id);
  assert.equal(row,undefined);
 }
 assert.equal(acceptanceRecords(db,'u4').some(r=>r.row.id===id),false);
});
test('tabs retain scope, ownership and pending-action boundaries for every role',()=>{
 const db=createSeed();assert.equal(acceptanceTabs[0][0],'NEW');assert.equal(acceptanceTabs.some(([key])=>key==='ALL'),false);
 for(const actor of ['u1','u2','u4','u6']){
  for(const record of acceptanceRecords(db,actor)){
   assert.equal(canAccess(db,actor,record.collection,record.row),true);
   assert.equal(['CLOSED','CANCELLED','COMPLETED','DUPLICATE'].includes(record.row.status),false);
   if(actor==='u4'||actor==='u6'){
    assert.equal(record.row.assigned_to_id,actor);
    assert(['PENDING','WITHDRAWAL_PENDING'].includes(record.state));
   }
  }
 }
 const r={state:'ACCEPTED',extension:true};
 assert.equal(matchesAcceptanceTab(r,'EXTENSION_PENDING'),true);
 assert.equal(matchesAcceptanceTab(r,'PROPERTY_REVIEW'),false);
});
test('pending extension stays visible to its consultant without granting approval rights',()=>{
 let db=createSeed();const r=db.registrationRequests.find(r=>r.status==='IN_PROGRESS'&&r.assigned_to_id==='u4'&&r.management_scope_id==='s1');
 r.acceptance_status='ACCEPTED';r.due_at=new Date(Date.now()-3600000).toISOString();
 db=operate(db,'u4','postponeAssignment',{collection:'registrationRequests',id:r.id,due_at:new Date(Date.now()+86400000).toISOString(),reason:'هماهنگی بازدید'});
 const entry=acceptanceRecords(db,'u4').find(x=>x.row.id===r.id);assert(entry);
 assert.equal(matchesAcceptanceTab(entry,'EXTENSION_PENDING'),true);
 const request=db.rescheduleHistory.find(h=>h.subject_id===r.id&&h.status==='PENDING');
 assert.throws(()=>operate(db,'u4','approveAssignmentExtension',{collection:'registrationRequests',id:r.id,request_id:request.id,reason:'تأیید خودم'}));
 assert.equal(acceptanceRecords(db,'u6').some(x=>x.row.id===r.id),false);
});
test('pending consultant acceptance is visible only to that consultant, never their manager',()=>{
 const db=createSeed();for(const id of ['r12','i12']){const collection=id[0]==='r'?'registrationRequests':'inquiries';
  assert(acceptanceRecords(db,'u6').some(r=>r.collection===collection&&r.row.id===id));
  for(const manager of ['u1','u2','u3'])assert.equal(acceptanceRecords(db,manager).some(r=>r.collection===collection&&r.row.id===id),false);
 }
 for(const manager of ['u1','u3'])assert(acceptanceRecords(db,manager).some(r=>r.row.id==='i18'&&r.state==='WITHDRAWAL_PENDING'));
});
