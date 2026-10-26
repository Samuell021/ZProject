import test from 'node:test';import assert from 'node:assert/strict';
import {createSeed} from '../mock/seed.js';import {operate} from './operations.js';
import {inquiryWizardStage} from './inquiry-wizard.js';import {propertyCommercialHistory} from './property-commercial-history.js';
function assigned(){
 let db=createSeed();db=operate(db,'u2','createLead',{lead_type:'INQUIRY',management_scope_id:'s1',initial_contact_name:'متقاضی مسیر',initial_contact_phone:'09123456789',deal_type_id:'sale'});const id=db._result.id;
 assert.equal(inquiryWizardStage(db,db.inquiries.find(r=>r.id===id)),'assignment');
 db=operate(db,'u2','assignCase',{collection:'inquiries',id,assigned_to_id:'u4',due_at:'2030-01-01T10:00:00Z'});
 assert.equal(inquiryWizardStage(db,db.inquiries.find(r=>r.id===id)),'acceptance');
 db=operate(db,'u4','acceptAssignment',{collection:'inquiries',id});return {db,id};
}
test('inquiry needs are saved before matching with validated budgets and same dossier',()=>{
 let {db,id}=assigned();assert.equal(inquiryWizardStage(db,db.inquiries.find(r=>r.id===id)),'needs');
 assert.throws(()=>operate(db,'u6','saveInquiryNeeds',{id,preferences:[{deal_type_id:'sale'}]}));
 assert.throws(()=>operate(db,'u4','saveInquiryNeeds',{id,min_area:200,max_area:100,preferences:[{deal_type_id:'sale'}]}));
 db=operate(db,'u4','saveInquiryNeeds',{id,min_area:90,max_area:120,min_rooms:2,notes:'نیاز ثبت‌شده',preferences:[{deal_type_id:'sale',max_sale_price:9000000000}]});
 assert.equal(inquiryWizardStage(db,db.inquiries.find(r=>r.id===id)),'matching');
 assert.equal(db.inquiryPreferences.filter(p=>p.inquiry_id===id).length,1);
});
test('closing an inquiry cancels its activities but never pauses the property listing',()=>{
 let {db,id}=assigned();const listing=db.listings.find(l=>l.status==='ACTIVE');
 db.introductions.push({id:'own-intro',inquiry_id:id,listing_id:listing.id,status:'VIEWING_SCHEDULED'});
 db.viewings.push({id:'own-view',introduction_id:'own-intro',status:'SCHEDULED'});
 assert.throws(()=>operate(db,'u4','changeInquiryCaseStatus',{id,status:'CLOSED',reason:'پایان'}));
 db=operate(db,'u2','changeInquiryCaseStatus',{id,status:'CLOSED',reason:'پایان درخواست'});
 assert.equal(db.listings.find(l=>l.id===listing.id).status,'ACTIVE');
 assert.equal(db.viewings.find(v=>v.id==='own-view').status,'CANCELLED');
 assert.equal(inquiryWizardStage(db,db.inquiries.find(r=>r.id===id)),'closed');
 db=operate(db,'u2','changeInquiryCaseStatus',{id,status:'REOPEN',reason:'بازگشت متقاضی'});
 assert.equal(db.viewings.find(v=>v.id==='own-view').status,'CANCELLED');
 assert.equal(db.inquiries.find(r=>r.id===id).status,'OPEN');
});
test('inquiry history includes only its own introductions and events across properties',()=>{
 const db=createSeed();const r=db.inquiries.find(r=>r.assigned_to_id==='u4');
 const own=db.introductions.find(i=>i.inquiry_id===r.id);
 const history=propertyCommercialHistory(db,'u4',r.id,'inquiries');
 assert(history.introductions.every(i=>i.inquiryId===r.id));
 assert(history.viewings.every(i=>i.inquiryId===r.id));
 assert.equal(propertyCommercialHistory(db,'u6',r.id,'inquiries').introductions.length,0);
 if(own)assert(history.introductions.some(i=>i.id===own.id));
});
test('reopening with an inactive consultant returns to assignment instead of stranding the dossier',()=>{
 let {db,id}=assigned();
 db=operate(db,'u2','changeInquiryCaseStatus',{id,status:'CLOSED',reason:'پایان رسیدگی'});
 db.users.find(u=>u.id==='u4').is_active=false;
 db=operate(db,'u2','changeInquiryCaseStatus',{id,status:'REOPEN',reason:'درخواست مجدد'});
 const r=db.inquiries.find(r=>r.id===id);assert.equal(r.assigned_to_id,null);assert.equal(r.acceptance_status,'UNASSIGNED');assert.equal(inquiryWizardStage(db,r),'assignment');
});
test('parallel files keep independent progress and a negative viewing does not finish the whole inquiry',()=>{
 const db=createSeed();const row={id:'parallel-inquiry',assigned_to_id:'u4',status:'INTRODUCED',acceptance_status:'ACCEPTED',lead_status:'ACCEPTED',needs_status:'CONFIRMED'};
 db.inquiries.push(row);db.introductions.push({id:'parallel-intro',inquiry_id:row.id,status:'VIEWED'});
 db.viewings.push({id:'negative-view',introduction_id:'parallel-intro',status:'COMPLETED',interest:'NOT_INTERESTED',performed_at:'2030-01-01T10:00:00Z'});
 assert.equal(inquiryWizardStage(db,row),'matching');
 db.viewings.push({id:'positive-view',introduction_id:'parallel-intro',status:'COMPLETED',interest:'INTERESTED',performed_at:'2030-01-02T10:00:00Z'});
 assert.equal(inquiryWizardStage(db,row),'viewings');
 db.viewings.push({id:'other-pending',introduction_id:'parallel-intro',status:'SCHEDULED'});assert.equal(inquiryWizardStage(db,row),'viewings');
 db.deals.push({id:'parallel-deal',inquiry_id:row.id,stage:'AGREED'});assert.equal(inquiryWizardStage(db,row),'contract');
 db.viewings.push({id:'new-view',introduction_id:'parallel-intro',status:'SCHEDULED'});assert.equal(inquiryWizardStage(db,row),'contract');
});
test('introduction alone does not advance to viewing; scheduling the visit does',()=>{
 const db=createSeed(),row={id:'introduced-only',status:'INTRODUCED',assigned_to_id:'u4',acceptance_status:'ACCEPTED',lead_status:'ACCEPTED',needs_status:'CONFIRMED'};
 db.inquiries.push(row);db.introductions.push({id:'intro-only',inquiry_id:row.id,status:'INTRODUCED'});
 assert.equal(inquiryWizardStage(db,row),'matching');
 db.viewings.push({id:'scheduled-only',introduction_id:'intro-only',status:'SCHEDULED',scheduled_at:'2030-01-01T10:00:00Z'});
 assert.equal(inquiryWizardStage(db,row),'viewings');
 db.viewings.find(v=>v.id==='scheduled-only').status='CANCELLED';
 assert.equal(inquiryWizardStage(db,row),'matching');
});
