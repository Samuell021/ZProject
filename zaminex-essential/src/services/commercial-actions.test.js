import test from 'node:test';
import assert from 'node:assert/strict';
import {createSeed} from '../mock/seed.js';
import {operate,canAccess} from './operations.js';
import {canOpenPage} from './intake.js';
import {canUseAction} from './action-availability.js';
test('contract pages, private records and commands are exclusive to the general manager',()=>{
 const db=createSeed();const contract=db.contracts[0];
 const deal=db.deals.find(d=>d.id===contract.deal_id);deal.stage='AGREED';
 for(const actor of ['u2','u4','u7','u8']){
  assert.equal(canOpenPage(db,actor,'contracts'),false);
  for(const collection of ['contracts','contractParties','signatures','attachments','amendments']){
   const record=collection==='contracts'?contract:(db[collection][0]||{id:'fake',contract_id:contract.id});
   assert.equal(canAccess(db,actor,collection,record),false);
  }
  assert.equal(canUseAction(db,actor,'deals',deal,'createContract'),false);
  for(const command of ['createContract','saveContractTerms','signContract','finalizeContract','addContractAttachment','createAmendment']){
   assert.throws(()=>operate(db,actor,command,{id:contract.id,deal_id:deal.id,contract_id:contract.id}));
  }
 }
 assert.equal(canOpenPage(db,'u1','contracts'),true);
 assert.equal(canAccess(db,'u1','contracts',contract),true);
});
test('successful negotiation sends contract preparation only to active general managers',()=>{
 const db=createSeed();const deal=db.deals.find(d=>d.stage==='NEGOTIATION');
 const result=operate(db,'u1','succeedDeal',{id:deal.id,notes:'توافق طرفین'});
 const tasks=result.tasks.filter(t=>t.subject_id===deal.id&&t.task_type==='CONTRACT_PREPARATION'&&t.status==='OPEN');
 assert(tasks.length>0);assert(tasks.every(t=>result.users.find(u=>u.id===t.assigned_to_id).group_ids.includes('GENERAL_MANAGER')));
 assert.equal(result.deals.find(d=>d.id===deal.id).result_notes,'توافق طرفین');
});
test('negative viewing result cannot start negotiation and completed results cannot be overwritten',()=>{
 let db=createSeed();const v=db.viewings.find(v=>v.status==='SCHEDULED');
 const linked=db.introductions.find(i=>i.id===v.introduction_id);linked.status='VIEWING_SCHEDULED';
 const inquiry=db.inquiries.find(i=>i.id===linked.inquiry_id);inquiry.status='INTRODUCED';inquiry.acceptance_status='ACCEPTED';
 const listing=db.listings.find(l=>l.id===linked.listing_id);listing.status='ACTIVE';
 const property=db.properties.find(p=>p.id===listing.property_id);property.review_status='APPROVED';property.record_status='ACTIVE';
 const root=db.registrationRequests.find(r=>r.resulting_property_id===property.id);if(root){root.status='COMPLETED';root.acceptance_status='ACCEPTED';}

 db=operate(db,'u1','completeViewing',{id:v.id,outcome:'متقاضی نپسندید',customer_feedback:'نامناسب',interest:'NOT_INTERESTED'});
 assert.equal(db.viewings.find(x=>x.id===v.id).interest,'NOT_INTERESTED');
 assert.equal(canUseAction(db,'u1','viewings',db.viewings.find(x=>x.id===v.id),'createDeal'),false);
 assert.throws(()=>operate(db,'u1','createDeal',{viewing_id:v.id}));
 assert.throws(()=>operate(db,'u1','createDeal',{introduction_id:v.introduction_id}));
 const intro=db.introductions.find(i=>i.id===v.introduction_id);
 assert.throws(()=>operate(db,'u1','createDeal',{listing_id:intro.listing_id,inquiry_id:intro.inquiry_id}));
 assert.throws(()=>operate(db,'u1','completeViewing',{id:v.id,outcome:'تغییر نتیجه',interest:'INTERESTED'}));
});
test('viewing result can be recorded immediately even when scheduled date is in the future',()=>{
 let db=createSeed();const intro=db.introductions.find(i=>db.inquiries.find(q=>q.id===i.inquiry_id&&!['CLOSED','CANCELLED','COMPLETED'].includes(q.status)));
 const l=db.listings.find(l=>l.id===intro.listing_id),property=db.properties.find(p=>p.id===l.property_id);
 l.status='ACTIVE';l.review_status='APPROVED';property.review_status='APPROVED';property.record_status='ACTIVE';
 const root=db.registrationRequests.find(r=>r.resulting_property_id===property.id);if(root){root.status='COMPLETED';root.acceptance_status='ACCEPTED';}
 db.viewings=db.viewings.filter(v=>v.introduction_id!==intro.id);
 db=operate(db,'u1','scheduleViewing',{introduction_id:intro.id,scheduled_at:'2099-01-01T10:00:00Z'});
 const id=db._result.id;db=operate(db,'u1','completeViewing',{id,interest:'INTERESTED',outcome:'بازدید انجام شد و مناسب بود'});
 assert.equal(db.viewings.find(v=>v.id===id).status,'COMPLETED');
 assert(Date.parse(db.viewings.find(v=>v.id===id).performed_at)<Date.parse('2099-01-01T10:00:00Z'));
});
test('removing an introduction preserves history and property; scheduled visits cannot be removed',()=>{
 const db=createSeed(),intro=db.introductions.find(i=>i.id==='intro10');
 assert.equal(canUseAction(db,'u5','introductions',intro,'deleteIntroduction'),true);
 const saved=operate(db,'u5','updateIntroduction',{id:intro.id,status:'CANCELLED'});
 assert.equal(saved.introductions.find(i=>i.id===intro.id).status,'CANCELLED');assert.equal(saved.properties.length,db.properties.length);
 assert.equal(canUseAction(saved,'u5','introductions',saved.introductions.find(i=>i.id===intro.id),'deleteIntroduction'),false);
 db.viewings.push({id:'guard-delete',introduction_id:intro.id,status:'SCHEDULED'});
 assert.equal(canUseAction(db,'u5','introductions',intro,'deleteIntroduction'),false);
 assert.throws(()=>operate(db,'u5','updateIntroduction',{id:intro.id,status:'CANCELLED'}));
 assert.throws(()=>operate(db,'u8','updateIntroduction',{id:intro.id,status:'CANCELLED'}));
});
