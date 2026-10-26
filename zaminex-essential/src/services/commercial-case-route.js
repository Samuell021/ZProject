import {canAccess} from './operations.js';
import {canOpenPage} from './intake.js';
export const retiredCommercialPages=['introductions','viewings','deals'];
export function commercialCaseRoute(db,actorId,page,id){
 if(!retiredCommercialPages.includes(page))return null;
 const fallback=canOpenPage(db,actorId,'inquiries')?'/inquiries':canOpenPage(db,actorId,'requests')?'/requests':'/dashboard';
 const row=db[page].find(r=>r.id===id);
 if(!row||!canAccess(db,actorId,page,row))return fallback;
 const intro=page==='viewings'?db.introductions.find(i=>i.id===row.introduction_id):row;
 const inquiry=db.inquiries.find(i=>i.id===intro?.inquiry_id);
 if(inquiry&&canOpenPage(db,actorId,'inquiries')&&canAccess(db,actorId,'inquiries',inquiry))return `/inquiries/${inquiry.id}?casePanel=history`;
 const listing=db.listings.find(l=>l.id===intro?.listing_id);
 const request=listing?.property_id&&db.registrationRequests.find(r=>r.resulting_property_id===listing.property_id);
 return request&&canOpenPage(db,actorId,'requests')&&canAccess(db,actorId,'registrationRequests',request)?`/requests/${request.id}?casePanel=history`:fallback;
}
