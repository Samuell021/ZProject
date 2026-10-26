import {propertyReviewState} from "./property-listings.js";
import {introductionConsultants} from './collaboration.js';
export const activitySubjects={requests:'registration_request',inquiries:'inquiry',introductions:'introduction',viewings:'viewing',deals:'deal'};
const closed=new Set(['COMPLETED','CANCELLED','DUPLICATE','FINALIZED','LOST','WON','CLOSED','REJECTED']);
export function activityInquiry(db,collection,row) {
 const intro=collection==='viewings'?db.introductions.find(i=>i.id===row.introduction_id):row;
 return collection==='inquiries'?row:db.inquiries.find(i=>i.id===intro?.inquiry_id);
}
export function activityOpen(db,collection,row) {
 if(!row)return false;
 // Completion here ends intake/appraisal, not the ongoing approved property dossier.
 if(collection==='registrationRequests'&&row.status==='COMPLETED') {
  const property=db.properties.find(p=>p.id===row.resulting_property_id);
  const accepted=row.acceptance_status?row.acceptance_status==='ACCEPTED':!!row.assigned_to_id;
  const listingIds=new Set(db.listings.filter(l=>l.property_id===property?.id).map(l=>l.id));
  const dealIds=new Set(db.deals.filter(d=>listingIds.has(d.listing_id)).map(d=>d.id));
  const finalized=db.contracts.some(c=>c.status==='FINALIZED'&&dealIds.has(c.deal_id));
  return !!property&&property.record_status==='ACTIVE'&&propertyReviewState(db,property)==='APPROVED'&&!!row.assigned_to_id&&accepted&&!finalized;
 }
 if(['registrationRequests','inquiries'].includes(collection))return !closed.has(row.status)&&!!row.assigned_to_id&&(row.acceptance_status?row.acceptance_status==='ACCEPTED':collection!=='registrationRequests'||row.status!=='ASSIGNED');
 if(collection==='viewings') {
  const intro=db.introductions.find(i=>i.id===row.introduction_id),inquiry=activityInquiry(db,collection,row);
  return row.status!=='CANCELLED'&&!!intro&&!closed.has(intro.status)&&!!inquiry&&!closed.has(inquiry.status);
 }
 if(collection==='introductions'){const inquiry=activityInquiry(db,collection,row);return !closed.has(row.status)&&!!inquiry&&!closed.has(inquiry.status);}
 return collection==='deals'&&!closed.has(row.stage||row.status);
}
export function activityAssignees(db,actorId,collection,row) {
 const intro=collection==='viewings'?db.introductions.find(i=>i.id===row.introduction_id):row;
 const partners=['introductions','viewings','deals'].includes(collection)?introductionConsultants(db,intro):{};
 return [...new Set([actorId,row.assigned_to_id,row.consultant_id,partners.buyer,partners.seller].filter(Boolean))].filter(id=>db.users.some(u=>u.id===id&&u.is_active));
}
