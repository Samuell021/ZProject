import {latestCompletedViewing} from './collaboration.js';
import {activityOpen} from "./activities.js";
import {canAccess,canViewPublicListing} from './operations.js';
import {assignmentState,canOpenPage,groupsFor} from './intake.js';
const collections={requests:'registrationRequests',inquiries:'inquiries',introductions:'introductions',viewings:'viewings',deals:'deals',contracts:'contracts'};
const closed=new Set(['COMPLETED','CANCELLED','DUPLICATE','FINALIZED','LOST','WON','CLOSED','REJECTED']);
export const contextualFormActions=['workspace','match','createTask','followup','viewingResult','viewing','rejectIntroduction','offer','closeDeal','createContract','contractTerms','amendment'];
export function canUseAction(db,actorId,page,row,action,related) {
 const collection=collections[page];
 if(!row||!collection||!canOpenPage(db,actorId,page)||!canAccess(db,actorId,collection,row))return false;
 const codes=groupsFor(db,actorId).map(g=>g.code);
 const operator=codes.some(c=>['GENERAL_MANAGER','RANGE_MANAGER','AGENT'].includes(c));
 const contracts=codes.includes('GENERAL_MANAGER');
 const active=!closed.has(row.stage||row.status);
 if(action==='workspace')return page==='requests'&&operator&&row.assigned_to_id===actorId&&assignmentState(db,collection,row)==='ACCEPTED'&&['IN_PROGRESS','CHANGES_REQUIRED'].includes(row.status);
 if(['submitListingForReview','submitPropertyForReview'].includes(action)) {
  if(!canUseAction(db,actorId,page,row,'workspace'))return false;
  const property=db.properties.find(p=>p.id===row.resulting_property_id);
  const appraisal=db.appraisals.find(a=>a.registration_request_id===row.id);
  return !!property?.address&&Number(property.area)>0&&!!property.district_id&&!!appraisal?.findings&&appraisal.status==="COMPLETED";
 }
 if(action==='match')return page==='inquiries'&&row.needs_status!=='DRAFT'&&operator&&active&&assignmentState(db,collection,row)==='ACCEPTED'&&['NEW','OPEN','SEARCHING'].includes(row.status);
 if(action==='createTask'||action==='followup')return (operator||action==='followup'&&codes.includes('CONTRACT_OFFICER'))&&activityOpen(db,collection,row);
 if(action==='createDeal'&&page==='viewings') {
  const intro=db.introductions.find(i=>i.id===row.introduction_id);
  return row.status==='COMPLETED'&&row.interest!=='NOT_INTERESTED'&&!!intro&&canUseAction(db,actorId,'introductions',intro,'createDeal');
 }
 if(action==='viewingResult')return page==='viewings'&&operator&&row.status==='SCHEDULED';
 if(action==='offer'||action==='acceptOffer')return false;
 if(action==='succeedDeal')return page==='deals'&&operator&&['NEGOTIATION','OFFERED'].includes(row.stage);
 if(action==='closeDeal')return page==='deals'&&operator&&['NEGOTIATION','OFFERED','AGREED'].includes(row.stage);
 if(action==='createContract')return page==='deals'&&contracts&&row.stage==='AGREED'&&!db.contracts.some(c=>c.deal_id===row.id);
 if(action==='contractTerms')return page==='contracts'&&contracts&&['DRAFT','PENDING_SIGNATURE','AWAITING_SIGNATURE'].includes(row.status)&&!db.signatures.some(s=>s.status==='SIGNED'&&db.contractParties.some(p=>p.id===s.contract_party_id&&p.contract_id===row.id));
 if(action==='amendment')return page==='contracts'&&contracts&&row.status==='FINALIZED';
 if(action==='attachment')return page==='contracts'&&contracts&&['DRAFT','PENDING_SIGNATURE','AWAITING_SIGNATURE','SIGNED'].includes(row.status);
 if(action==='signContract')return page==='contracts'&&contracts&&['DRAFT','PENDING_SIGNATURE','AWAITING_SIGNATURE','SIGNED'].includes(row.status)&&!!related&&!db.signatures.some(s=>s.contract_party_id===related.id&&s.status==='SIGNED');
 if(action==='finalizeContract') {
  if(page!=='contracts'||!contracts||!['DRAFT','PENDING_SIGNATURE','AWAITING_SIGNATURE','SIGNED'].includes(row.status))return false;
  const parties=db.contractParties.filter(p=>p.contract_id===row.id),deal=db.deals.find(d=>d.id===row.deal_id);
  return parties.length>=2&&parties.every(p=>db.signatures.some(s=>s.contract_party_id===p.id&&s.status==='SIGNED'))&&db.listings.some(l=>l.id===deal?.listing_id&&l.status==='ACTIVE');
 }
 if(action==='introduceListing')return page==='inquiries'&&row.needs_status!=='DRAFT'&&operator&&active&&assignmentState(db,collection,row)==='ACCEPTED'&&(!related||canViewPublicListing(db,actorId,related)&&!db.introductions.some(i=>i.inquiry_id===row.id&&i.listing_id===related.id&&!['REJECTED','CANCELLED'].includes(i.status)));
 if(page==='introductions') {
  const inquiry=db.inquiries.find(i=>i.id===row.inquiry_id),listing=db.listings.find(l=>l.id===row.listing_id);
  const deal=db.deals.find(d=>d.inquiry_id===row.inquiry_id&&d.listing_id===row.listing_id&&!['LOST','CANCELLED','FINALIZED'].includes(d.stage));
  if(action==='deleteIntroduction')return operator&&active&&!!inquiry&&!closed.has(inquiry.status)&&!db.viewings.some(v=>v.introduction_id===row.id&&v.status!=='CANCELLED')&&!db.deals.some(d=>d.inquiry_id===row.inquiry_id&&d.listing_id===row.listing_id);
  if(!operator||!active||!inquiry||closed.has(inquiry.status)||deal||!canViewPublicListing(db,actorId,listing))return false;
  if(action==='viewing')return !db.viewings.some(v=>v.introduction_id===row.id&&v.status==='SCHEDULED');
  if(action==='interested')return row.status!=='INTERESTED';
  if(action==='rejectIntroduction')return true;
  if(action==='createDeal')return latestCompletedViewing(db,row.id)?.interest!=='NOT_INTERESTED';
 }
 return false;
}
