export function propertyRequest(db, property) {
 return db.registrationRequests.find(r=>r.resulting_property_id===property?.id);
}
export function propertyOwner(db, property) {
 const request=propertyRequest(db,property);
 return request ? request.assigned_to_id : property?.consultant_id;
}
export function ownsProperty(db, actorId, property) {
 const request=propertyRequest(db,property);
 return !!property&&propertyOwner(db,property)===actorId&&(!request||(request.acceptance_status?request.acceptance_status==='ACCEPTED':request.status!=='ASSIGNED'))&&!['CANCELLED','DUPLICATE','CLOSED'].includes(request?.status);
}
export function propertyReviewState(db,property) {
 if(property?.review_status)return property.review_status;
 const request=propertyRequest(db,property);
 if(request?.status==='PENDING_REVIEW')return 'PENDING';
 if(request?.status==='CHANGES_REQUIRED')return 'CHANGES_REQUIRED';
 return property?.record_status==='ACTIVE'&&(!request||request.status==='COMPLETED')?'APPROVED':'DRAFT';
}
export function syncPropertyListings(db) {
 for(const property of db.properties) {
  const linkedRequest=propertyRequest(db,property);
  if(!property.review_status||(linkedRequest?.status==='PENDING_REVIEW'&&property.review_status==='DRAFT')){
   property.review_status=linkedRequest?.status==='PENDING_REVIEW'?'PENDING':propertyReviewState(db,property);
   if(property.review_status==='PENDING')property.review_submitted_version=property.version||0;
  }
  const request=propertyRequest(db,property);
  if(request)property.consultant_id=request.assigned_to_id;
 }
 for(const listing of db.listings) {
  const property=db.properties.find(p=>p.id===listing.property_id);
  if(property)listing.assigned_to_id=propertyOwner(db,property);
 }
 return db;
}

export function canEditPropertyListings(db, actorId, property) {
 const actor=db.users.find(user=>user.id===actorId&&user.is_active);
 if(!actor||!property||propertyReviewState(db,property)!=='APPROVED')return false;
 const owner=propertyOwner(db,property);
 if(!db.users.some(user=>user.id===owner&&user.is_active)||!ownsProperty(db,owner,property))return false;
 const generalManager=db.groups.some(group=>group.code==='GENERAL_MANAGER'&&actor.group_ids?.includes(group.id));
 return generalManager||ownsProperty(db,actorId,property);
}
