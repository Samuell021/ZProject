import test from 'node:test';
import assert from 'node:assert/strict';
import {createSeed} from '../mock/seed.js';
import {activityOpen} from './activities.js';
import {canUseAction} from './action-availability.js';
import {operate} from './operations.js';
function approvedCase(){
 const db=createSeed();const r=db.registrationRequests.find(r=>r.status==='COMPLETED'&&r.assigned_to_id==='u4');
 const p=db.properties.find(p=>p.id===r.resulting_property_id);
 p.record_status='ACTIVE';p.review_status='APPROVED';r.acceptance_status='ACCEPTED';
 const ids=db.listings.filter(l=>l.property_id===p.id).map(l=>l.id);
 const deals=db.deals.filter(d=>ids.includes(d.listing_id)).map(d=>d.id);
 db.contracts=db.contracts.filter(c=>!deals.includes(c.deal_id));
 return {db,r,p};
}
test('approved registration completion keeps dossier tasks and follow-ups available to the current consultant',()=>{
 let {db,r}=approvedCase();
 assert.equal(activityOpen(db,'registrationRequests',r),true);
 assert.equal(canUseAction(db,'u4','requests',r,'createTask'),true);
 assert.equal(canUseAction(db,'u4','requests',r,'followup'),true);
 db=operate(db,'u4','createTask',{subject_type:'registration_request',subject_id:r.id,title:'هماهنگی مالک',due_at:'2030-01-01T10:00:00Z'});
 assert.equal(db.tasks.find(t=>t.id===db._result.id).subject_id,r.id);
 db=operate(db,'u4','createFollowUp',{subject_type:'registration_request',subject_id:r.id,contact_id:r.contact_id,scheduled_at:'2030-01-01T10:00:00Z',notes:'پیگیری عرضه'});
 assert.equal(db.followUps.find(f=>f.id===db._result.id).subject_id,r.id);
});
test('closed, unaccepted and unrelated dossiers remain protected',()=>{
 const {db,r,p}=approvedCase();
 for(const status of ['CANCELLED','DUPLICATE'])assert.equal(activityOpen(db,'registrationRequests',{...r,status}),false);
 assert.equal(activityOpen(db,'registrationRequests',{...r,acceptance_status:'PENDING'}),false);
 assert.equal(canUseAction(db,'u6','requests',r,'createTask'),false);
 p.record_status='ARCHIVED';assert.equal(activityOpen(db,'registrationRequests',r),false);
});
test('finalized property stays closed to new operational activities',()=>{
 const {db,r,p}=approvedCase();const listing=db.listings.find(l=>l.property_id===p.id);
 db.deals.push({id:'guard-deal',listing_id:listing.id});db.contracts.push({id:'guard-contract',deal_id:'guard-deal',status:'FINALIZED'});
 assert.equal(activityOpen(db,'registrationRequests',r),false);
 assert.throws(()=>operate(db,'u4','createTask',{subject_type:'registration_request',subject_id:r.id,title:'کار نامعتبر',due_at:'2030-01-01T10:00:00Z'}),/باز نیست|پذیرفته نشده/);
});
