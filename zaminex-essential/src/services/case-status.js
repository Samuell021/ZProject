import {canManageCase} from './intake.js';
export const terminalCaseStatuses=['CLOSED','CANCELLED','DUPLICATE'];
export function caseRelations(db,request) {
 const property=db.properties.find(p=>p.id===request?.resulting_property_id);
 const listings=db.listings.filter(l=>request&&((property&&l.property_id===property.id)||l.registration_request_id===request.id));
 const listingIds=new Set(listings.map(l=>l.id));
 const deals=db.deals.filter(d=>listingIds.has(d.listing_id));
 const dealIds=new Set(deals.map(d=>d.id));
 const contracts=db.contracts.filter(c=>dealIds.has(c.deal_id));
 const partyIds=new Set(db.contractParties.filter(p=>contracts.some(c=>c.id===p.contract_id)).map(p=>p.id));
 const locked=contracts.some(c=>c.status==='FINALIZED')||db.signatures.some(s=>partyIds.has(s.contract_party_id)&&s.status==='SIGNED');
 return {property,listings,deals,contracts,locked};
}
export function caseStatusActions(db,actorId,request) {
 if(!request||!canManageCase(db,actorId,request))return [];
 if(caseRelations(db,request).locked)return [];
 if(['CLOSED','CANCELLED'].includes(request.status))return request.case_close_snapshot?['REOPEN']:[];
 if(request.status==='DUPLICATE')return [];
 return ['CLOSED','CANCELLED','DUPLICATE'];
}
