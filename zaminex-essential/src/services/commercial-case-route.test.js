import test from 'node:test';import assert from 'node:assert/strict';
import {createSeed} from '../mock/seed.js';import {commercialCaseRoute} from './commercial-case-route.js';
test('seller consultant follows commercial events in property dossier without gaining applicant access',()=>{
 const db=createSeed(),r=db.registrationRequests.find(r=>r.assigned_to_id==='u4'&&r.resulting_property_id);
 const l=db.listings.find(l=>l.property_id===r.resulting_property_id);
 db.inquiries.push({id:'other-inquiry',management_scope_id:'s2',assigned_to_id:'u6',acceptance_status:'ACCEPTED'});
 db.introductions.push({id:'shared-event',inquiry_id:'other-inquiry',listing_id:l.id});
 assert.equal(commercialCaseRoute(db,'u4','introductions','shared-event'),`/requests/${r.id}?casePanel=history`);
 assert.equal(commercialCaseRoute(db,'u6','introductions','shared-event'),'/inquiries/other-inquiry?casePanel=history');
 assert.equal(commercialCaseRoute(db,'u5','introductions','shared-event'),'/inquiries');
});
test('broken or unknown event references never select an unrelated property dossier',()=>{
 const db=createSeed();db.introductions.push({id:'broken-intro',listing_id:'missing-listing'});
 assert.equal(commercialCaseRoute(db,'u1','introductions','broken-intro'),'/inquiries');
 assert.equal(commercialCaseRoute(db,'u1','viewings','missing'),'/inquiries');
});
