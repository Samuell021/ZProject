import {propertyOwner} from './property-listings.js';
export function introductionConsultants(db,introduction) {
 const inquiry=db.inquiries.find(row=>row.id===introduction?.inquiry_id);
 const listing=db.listings.find(row=>row.id===introduction?.listing_id);
 const property=db.properties.find(row=>row.id===listing?.property_id);
 return {
  buyer:inquiry?inquiry.assigned_to_id:introduction?.buyer_consultant_id,
  seller:property?propertyOwner(db,property):introduction?.seller_consultant_id,
  buyerScope:inquiry?.management_scope_id,
  sellerScope:property?.management_scope_id,
 };
}

export function latestCompletedViewing(db,introductionId) {
 return db.viewings.filter(v=>v.introduction_id===introductionId&&v.status==='COMPLETED')
  .reduce((latest,v)=>!latest||(Date.parse(v.performed_at||v.scheduled_at)||0)>=(Date.parse(latest.performed_at||latest.scheduled_at)||0)?v:latest,null);
}
