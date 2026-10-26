import test from 'node:test';import assert from 'node:assert/strict';
import {createSeed} from '../mock/seed.js';import {operate} from './operations.js';
function setup(){let db=createSeed();db=operate(db,'u2','createLead',{lead_type:'PROPERTY',management_scope_id:'s1',initial_contact_name:'تغییر وضعیت',initial_contact_phone:'09123456789'});return {db,id:db._result.id};}
test('manager closes with reason, cancels outstanding work and reopens without manufacturing an assignment',()=>{
 let {db,id}=setup();db.tasks.push({id:'open-case-task',subject_type:'registration_request',subject_id:id,status:'OPEN',assigned_to_id:'u2'});
 assert.throws(()=>operate(db,'u2','changePropertyCaseStatus',{id,status:'CLOSED'}),/دلیل/);
 db=operate(db,'u2','changePropertyCaseStatus',{id,status:'CLOSED',reason:'پایان رسیدگی',operation_id:'close-once'});
 assert.equal(db.registrationRequests.find(r=>r.id===id).status,'CLOSED');assert.equal(db.tasks.find(t=>t.id==='open-case-task').status,'CANCELLED');
 const replay=operate(db,'u2','changePropertyCaseStatus',{id,status:'CLOSED',reason:'پایان رسیدگی',operation_id:'close-once'});assert.equal(replay.stageHistory.length,db.stageHistory.length);
 db=operate(db,'u2','changePropertyCaseStatus',{id,status:'REOPEN',reason:'درخواست مجدد مالک'});
 const r=db.registrationRequests.find(r=>r.id===id);assert.equal(r.status,'NEW');assert.equal(r.assigned_to_id,null);assert.equal(r.case_status_history.length,2);
});
test('consultants and managers of another scope cannot close the dossier',()=>{
 const {db,id}=setup();for(const actor of ['u4','u3'])assert.throws(()=>operate(db,actor,'changePropertyCaseStatus',{id,status:'CANCELLED',reason:'لغو'}));
});
test('signed or finalized contracts block closing without partial changes',()=>{
 const db=createSeed();const c=db.contracts.find(c=>c.status==='FINALIZED');const d=db.deals.find(d=>d.id===c.deal_id);const l=db.listings.find(l=>l.id===d.listing_id);const r=db.registrationRequests.find(r=>r.resulting_property_id===l.property_id);
 const original=JSON.stringify(db);assert.throws(()=>operate(db,'u1','changePropertyCaseStatus',{id:r.id,status:'CANCELLED',reason:'ممنوع'}),/قرارداد/);assert.equal(JSON.stringify(db),original);
});
test('cancellation pauses supply, cancels related work and drafts, and reopening requires review without reviving old events',()=>{
 let {db,id}=setup();
 db=operate(db,'u2','assignCase',{id,collection:'registrationRequests',assigned_to_id:'u4',due_at:'2030-01-01T10:00:00Z'});
 db=operate(db,'u4','acceptAssignment',{id,collection:'registrationRequests'});
 db=operate(db,'u4','saveWorkspace',{id,property:{address:'نشانی',district_id:'district1',area:100},appraisal:{findings:'گزارش',status:'COMPLETED'}});
 const propertyId=db.registrationRequests.find(r=>r.id===id).resulting_property_id;
 db=operate(db,'u2','setPropertyTitle',{id,title:'ملک وضعیت'});db=operate(db,'u4','submitPropertyForReview',{id:propertyId});db=operate(db,'u2','reviewProperty',{id:propertyId,decision:'APPROVED'});
 db=operate(db,'u4','savePropertyListing',{property_id:propertyId,deal_type_id:'sale',sale_price:1000000000,status:'ACTIVE'});const listingId=db._result.id;
 db.introductions.push({id:'status-intro',listing_id:listingId,inquiry_id:'i7',status:'INTERESTED'});
 db.viewings.push({id:'status-view',introduction_id:'status-intro',status:'SCHEDULED'});
 db.deals.push({id:'status-deal',listing_id:listingId,inquiry_id:'i7',stage:'AGREED'});
 db.contracts.push({id:'status-contract',deal_id:'status-deal',status:'DRAFT'});
 db.followUps.push({id:'status-follow',subject_type:'introduction',subject_id:'status-intro',status:'SCHEDULED'});
 db.tasks.push({id:'status-task',subject_type:'follow_up',subject_id:'status-follow',status:'OPEN'});
 db=operate(db,'u2','changePropertyCaseStatus',{id,status:'CANCELLED',reason:'انصراف مالک'});
 assert.equal(db.listings.find(l=>l.id===listingId).status,'PAUSED');assert.equal(db.viewings.find(v=>v.id==='status-view').status,'CANCELLED');
 assert.equal(db.deals.find(d=>d.id==='status-deal').stage,'LOST');assert.equal(db.contracts.find(c=>c.id==='status-contract').status,'CANCELLED');assert.equal(db.tasks.find(t=>t.id==='status-task').status,'CANCELLED');
 assert.throws(()=>operate(db,'u2','setListingStatus',{id:listingId,status:'ACTIVE'}),/بسته/);
 db=operate(db,'u2','changePropertyCaseStatus',{id,status:'REOPEN',reason:'بازگشت مالک'});
 assert.equal(db.registrationRequests.find(r=>r.id===id).status,'CHANGES_REQUIRED');assert.equal(db.properties.find(p=>p.id===propertyId).review_status,'CHANGES_REQUIRED');assert.equal(db.listings.find(l=>l.id===listingId).status,'PAUSED');assert.equal(db.viewings.find(v=>v.id==='status-view').status,'CANCELLED');
});
