import test from 'node:test';
import assert from 'node:assert/strict';
import {createSeed,schemaVersion} from '../mock/seed.js';
import {propertyWizardStage,propertyWizardSteps} from './property-wizard.js';
import {inquiryWizardStage,inquiryWizardSteps} from './inquiry-wizard.js';
import {canUseAction} from './action-availability.js';
import {operate} from './operations.js';
test('demo covers every actionable wizard stage with explicit intake and assignment',()=>{
 const db=createSeed();assert.equal(schemaVersion,3);
 for(const [collection,steps,stage] of [['registrationRequests',propertyWizardSteps,propertyWizardStage],['inquiries',inquiryWizardSteps,inquiryWizardStage]]){
  const stages=new Set(db[collection].map(r=>stage(db,r)));for(const [key] of steps.filter(([k])=>k!=='lead'))assert(stages.has(key),`${collection}: missing ${key}`);
  for(const r of db[collection]){assert(db.contacts.some(c=>c.id===r.contact_id));if(r.assigned_to_id)assert(db.memberships.some(m=>m.user_id===r.assigned_to_id&&m.scope_id===r.management_scope_id&&!m.left_at));}
 }
});
test('demo commercial paths have exact introductions, positive visits and coherent deal types',()=>{
 const db=createSeed();
 for(const intro of db.introductions){const q=db.inquiries.find(q=>q.id===intro.inquiry_id),l=db.listings.find(l=>l.id===intro.listing_id);assert(q&&l);assert(db.inquiryPreferences.some(p=>p.inquiry_id===q.id&&p.deal_type_id===l.deal_type_id));assert.equal(intro.buyer_consultant_id,q.assigned_to_id);assert.equal(intro.seller_consultant_id,l.assigned_to_id);assert(db.users.some(u=>u.id===intro.introduced_by_id));}
 for(const v of db.viewings){const intro=db.introductions.find(i=>i.id===v.introduction_id);assert(intro);assert.notEqual(intro.status,'REJECTED');assert(Date.parse(v.scheduled_at)>=Date.parse(intro.introduced_at));if(v.status==='COMPLETED')assert(['INTERESTED','NOT_INTERESTED'].includes(v.interest));else assert.equal(v.performed_at,null);}
 for(const d of db.deals){const v=db.viewings.find(v=>v.id===d.viewing_id),intro=db.introductions.find(i=>i.id===v?.introduction_id);assert.equal(v?.status,'COMPLETED');assert.equal(v.interest,'INTERESTED');assert.equal(intro.inquiry_id,d.inquiry_id);assert.equal(intro.listing_id,d.listing_id);assert(Date.parse(d.started_at)>=Date.parse(v.performed_at));assert.equal(d.deal_type_version_id,db.listings.find(l=>l.id===d.listing_id).deal_type_version_id);}
 assert.equal(db.offers.length,0);
});
test('demo lists only approved properties, with no orphan appraisal or premature supply file',()=>{
 const db=createSeed();for(const l of db.listings){const p=db.properties.find(p=>p.id===l.property_id),r=db.registrationRequests.find(r=>r.id===l.registration_request_id);assert(p&&r);assert.equal(p.review_status,'APPROVED');assert.equal(r.resulting_property_id,p.id);assert.equal(r.status,'COMPLETED');assert.equal(l.assigned_to_id,r.assigned_to_id);}
 for(const a of db.appraisals){assert(db.properties.some(p=>p.id===a.property_id));assert(db.registrationRequests.some(r=>r.id===a.registration_request_id&&r.resulting_property_id===a.property_id));}
 for(const c of db.propertyContacts)assert(db.properties.some(p=>p.id===c.property_id));
});
test('demo contracts are general-manager owned and finalization has consistent effects',()=>{
 const db=createSeed();for(const c of db.contracts){const d=db.deals.find(d=>d.id===c.deal_id),q=db.inquiries.find(q=>q.id===d.inquiry_id);assert.equal(c.created_by_id,'u1');assert.equal(c.accepted_offer_id,null);assert.equal(c.agreement_basis,'CONTRACT_TERMS');assert.equal(c.terms_snapshot.deal_type_version_id,c.deal_type_version_id);const parties=db.contractParties.filter(p=>p.contract_id===c.id);assert(parties.length>=2);if(c.status==='FINALIZED'){assert.equal(d.stage,'FINALIZED');assert.equal(q.status,'COMPLETED');assert.equal(c.finalized_by_id,'u1');assert.equal(db.listings.find(l=>l.id===d.listing_id).status,'CLOSED');for(const p of parties)assert(db.signatures.some(s=>s.contract_party_id===p.id&&s.status==='SIGNED'));}else assert.equal(d.stage,'CONTRACT');}
 const ready=db.deals.find(d=>d.id==='d4');assert.equal(canUseAction(db,'u1','deals',ready,'createContract'),true);assert.equal(canUseAction(db,'u2','deals',ready,'createContract'),false);
 const prepared=operate(db,'u1','createContract',{deal_id:ready.id,sale_price:10500000000,additional_terms:{down_payment:3000000000,installments:12,delivery_date:'2030-01-01'}});assert.equal(prepared.contracts.length,db.contracts.length+1);
});
test('demo collaboration and parallel introductions are independent, with usable next actions',()=>{
 const db=createSeed();const shared=db.introductions.find(i=>i.inquiry_id==='i17');assert.notEqual(shared.buyer_consultant_id,shared.seller_consultant_id);
 const choices=db.introductions.filter(i=>i.inquiry_id==='i10');assert.equal(choices.length,2);for(const i of choices)assert(canUseAction(db,'u5','introductions',i,'viewing'));
 const positive=db.viewings.find(v=>db.introductions.find(i=>i.id===v.introduction_id)?.inquiry_id==='i8');assert(canUseAction(db,'u5','viewings',positive,'createDeal'));
 for(const f of db.followUps){const q=db.inquiries.find(q=>q.id===f.subject_id);assert(q);assert(!['CANCELLED','COMPLETED'].includes(q.status));assert.equal(f.consultant_id,q.assigned_to_id);}
 for(const t of db.tasks){const collections={property:'properties',registration_request:'registrationRequests',deal:'deals',introduction:'introductions',inquiry:'inquiries'};assert(db[collections[t.subject_type]].some(r=>r.id===t.subject_id));assert(db.users.some(u=>u.id===t.assigned_to_id));}
});
test('demo next actions can actually advance property review, visit, negotiation and contract',()=>{
 let db=createSeed();db=operate(db,'u3','reviewProperty',{id:'p9',decision:'APPROVED'});assert.equal(db.properties.find(p=>p.id==='p9').review_status,'APPROVED');
 const intro=db.introductions.find(i=>i.inquiry_id==='i10');db=operate(db,'u5','scheduleViewing',{introduction_id:intro.id,scheduled_at:new Date(Date.now()+86400000).toISOString(),consultant_id:'u5'});const v=db._result.id;
 db=operate(db,'u5','completeViewing',{id:v,interest:'INTERESTED',outcome:'بازدید انجام شد؛ موقعیت مناسب است.'});db=operate(db,'u5','createDeal',{viewing_id:v});const d=db._result.id;db=operate(db,'u5','succeedDeal',{id:d,notes:'طرفین بر قیمت توافق کردند.'});
 db=operate(db,'u1','createContract',{deal_id:d,sale_price:12000000000});assert(db.contracts.some(c=>c.deal_id===d));
 const pending=db.contracts.find(c=>c.id==='ct2');for(const party of db.contractParties.filter(p=>p.contract_id===pending.id))db=operate(db,'u1','signContract',{id:pending.id,contract_party_id:party.id});
 db=operate(db,'u1','finalizeContract',{id:pending.id});assert.equal(db.contracts.find(c=>c.id==='ct2').status,'FINALIZED');
});
