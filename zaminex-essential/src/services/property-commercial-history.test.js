import test from 'node:test';
import assert from 'node:assert/strict';
import {createSeed} from '../mock/seed.js';
import {propertyCommercialHistory} from './property-commercial-history.js';
test('commercial history joins each event to its exact listing and applicant across multiple property listings',()=>{
 const db=createSeed(),r=db.registrationRequests.find(r=>r.resulting_property_id);
 const first=db.listings.find(l=>l.property_id===r.resulting_property_id);
 db.listings.push({...first,id:'history-listing-two',code:'L-H2',deal_type_id:'rent'});
 db.introductions.push({id:'history-intro',listing_id:'history-listing-two',inquiry_id:'i2'});
 db.viewings.push({id:'history-view',introduction_id:'history-intro',scheduled_at:'2030-01-01T10:00:00Z',status:'SCHEDULED'});
 db.deals.push({id:'history-deal',listing_id:'history-listing-two',inquiry_id:'i2',stage:'AGREED'});
 db.contracts.push({id:'history-contract',deal_id:'history-deal',contract_number:'H-1',status:'FINALIZED'});
 const result=propertyCommercialHistory(db,'u1',r.id);
 for(const [section,id] of [['viewings','history-view'],['deals','history-deal'],['contracts','history-contract']]){
  const row=result[section].find(x=>x.id===id);assert.ok(row);assert.equal(row.listingCode,'L-H2');assert.equal(row.inquiryId,'i2');assert.ok(row.applicantName);
  assert.equal('phone' in row,false);assert.equal('contact' in row,false);
 }
 const unrelated=db.viewings.find(v=>db.introductions.find(i=>i.id===v.introduction_id)?.listing_id!==first.id&&v.id!=='history-view');
 if(unrelated)assert.equal(result.viewings.some(v=>v.id===unrelated.id),false);
});
test('history never exposes another scope or private event through an accessible property',()=>{
 const db=createSeed();const r=db.registrationRequests.find(r=>r.assigned_to_id==='u4'&&r.resulting_property_id);
 assert.deepEqual(propertyCommercialHistory(db,'u6',r.id),{introductions:[],viewings:[],deals:[],contracts:[]});
 const l=db.listings.find(l=>l.property_id===r.resulting_property_id);
 db.contracts.push({id:'private-contract',deal_id:'private-deal',status:'DRAFT'});
 db.deals.push({id:'private-deal',listing_id:l.id,inquiry_id:'i6',assigned_to_id:'u6',management_scope_id:'s2'});
 const result=propertyCommercialHistory(db,'u4',r.id);
 assert.equal(result.contracts.some(c=>c.id==='private-contract'),false);
});
test('paused sample introduction explains the missing viewing action and points the owner to the property dossier',()=>{
 const db=createSeed();const result=propertyCommercialHistory(db,'u5','i10','inquiries');
 const intro=result.introductions.find(i=>i.id==='intro10');assert(intro);
 assert.match(intro.listingBlockReason,/تکمیل|فعال نیست/);assert.equal(intro.listingCaseHref,'/requests/r10');
});
test('collaboration identifies both recorded consultants and a distinct introducer across the exact viewing and deal',()=>{
 const db=createSeed(),intro=db.introductions.find(i=>i.id==='intro10');
 Object.assign(intro,{buyer_consultant_id:'u4',seller_consultant_id:'u5',introduced_by_id:'u2'});
 db.viewings.push({id:'team-view',introduction_id:intro.id,status:'COMPLETED'});
 db.deals.push({id:'team-deal',viewing_id:'team-view',listing_id:intro.listing_id,inquiry_id:intro.inquiry_id,stage:'NEGOTIATION'});
 const rows=propertyCommercialHistory(db,'u1',intro.inquiry_id,'inquiries');
 const expected={buyerName:db.staffProfiles.find(p=>p.user_id==='u4').full_name,sellerName:db.staffProfiles.find(p=>p.user_id==='u5').full_name,introducerName:db.staffProfiles.find(p=>p.user_id==='u2').full_name,shared:true};
 assert.deepEqual(rows.introductions.find(r=>r.id===intro.id).collaboration,expected);
 assert.deepEqual(rows.viewings.find(r=>r.id==='team-view').collaboration,expected);
 assert.deepEqual(rows.deals.find(r=>r.id==='team-deal').collaboration,expected);
 intro.seller_consultant_id='u4';intro.introduced_by_id='u4';
 const same=propertyCommercialHistory(db,'u1',intro.inquiry_id,'inquiries').introductions.find(r=>r.id===intro.id).collaboration;
 assert.equal(same.shared,false);assert.equal(same.introducerName,null);
});
