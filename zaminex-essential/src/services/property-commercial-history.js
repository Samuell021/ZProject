import {introductionConsultants} from './collaboration.js';
import {canAccess,canViewPublicListing} from './operations.js';
import {propertyRequest,propertyReviewState} from './property-listings.js';
import {canOpenPage} from './intake.js';
const empty=()=>({introductions:[],viewings:[],deals:[],contracts:[]});
/** Property-side projection: authorized relationship summary only, never full customer details. */
export function propertyCommercialHistory(db,actorId,requestId,collection='registrationRequests') {
 const inquirySide=collection==='inquiries';
 const request=db[collection].find(r=>r.id===requestId);
 if(!request||!canAccess(db,actorId,collection,request))return {...empty(),...(inquirySide?{introductions:[]}: {})};
 const property=db.properties.find(p=>p.id===request.resulting_property_id);
 if(!inquirySide&&(!property||!canAccess(db,actorId,'properties',property)))return {...empty(),...(inquirySide?{introductions:[]}: {})};
 const listings=new Map(db.listings.filter(l=>inquirySide?db.introductions.some(i=>i.inquiry_id===request.id&&i.listing_id===l.id)||db.deals.some(d=>d.inquiry_id===request.id&&d.listing_id===l.id):l.property_id===property.id).map(l=>[l.id,l]));
 const introductions=new Map(db.introductions.filter(i=>listings.has(i.listing_id)&&(!inquirySide||i.inquiry_id===request.id)).map(i=>[i.id,i]));
 const deals=new Map(db.deals.filter(d=>listings.has(d.listing_id)&&(!inquirySide||d.inquiry_id===request.id)).map(d=>[d.id,d]));
 const summary=(listingId,inquiryId,introduction)=>{
  const listing=listings.get(listingId),inquiry=db.inquiries.find(i=>i.id===inquiryId);
  const contact=db.contacts.find(c=>c.id===inquiry?.contact_id);
  const consultants=introductionConsultants(db,introduction||{listing_id:listingId,inquiry_id:inquiryId});
  const buyerId=introduction?.buyer_consultant_id||consultants.buyer,sellerId=introduction?.seller_consultant_id||consultants.seller;
  const name=id=>id?(db.staffProfiles.find(p=>p.user_id===id)?.full_name||'نام ثبت نشده'):'تعیین نشده';
  const collaboration={buyerName:name(buyerId),sellerName:name(sellerId),shared:!!buyerId&&!!sellerId&&buyerId!==sellerId,introducerName:introduction?.introduced_by_id&&! [buyerId,sellerId].includes(introduction.introduced_by_id)?name(introduction.introduced_by_id):null};
  const listingProperty=db.properties.find(p=>p.id===listing?.property_id),root=propertyRequest(db,listingProperty);
  const blocked=listing&&!canViewPublicListing(db,actorId,listing);
  const needsReview=listingProperty&&propertyReviewState(db,listingProperty)!=='APPROVED';
  // A permitted viewing/deal may expose its applicant's name, without granting contact/inquiry access.
  return {collaboration,listingBlockReason:blocked?(needsReview?'این فایل برای ادامه بازدید به تکمیل یا تأیید ملک نیاز دارد.':listing.status!=='ACTIVE'?'عرضه این فایل فعال نیست؛ ابتدا وضعیت عرضه باید تعیین تکلیف شود.':'این فایل اکنون برای بازدید جدید در دسترس نیست.'):'',listingCaseHref:root&&canOpenPage(db,actorId,'requests')&&canAccess(db,actorId,'registrationRequests',root)?`/requests/${root.id}`:null,listingId,listingHref:listing&&(canAccess(db,actorId,'listings',listing)||canViewPublicListing(db,actorId,listing))?`/${canAccess(db,actorId,'listings',listing)?'listings':'explore'}/${listing.id}`:null,listingTitle:db.properties.find(p=>p.id===listing?.property_id)?.title||listing?.title||'',listingCode:listing?.code||'',dealType:db.dealTypes.find(t=>t.id===listing?.deal_type_id)?.name||'',
   inquiryId:inquiry?.id||null,inquiryCode:inquiry?.code||'',
   applicantName:[contact?.first_name,contact?.last_name,contact?.company_name].filter(Boolean).join(' ')||inquiry?.initial_contact_name||'متقاضی مشخص نشده',
   inquiryHref:inquiry&&canOpenPage(db,actorId,'inquiries')&&canAccess(db,actorId,'inquiries',inquiry)?`/inquiries/${inquiry.id}`:null};
 };
 const dealIntroduction=d=>introductions.get(d.introduction_id||db.viewings.find(v=>v.id===d.viewing_id)?.introduction_id);
 const link=(page,row)=>page==='contracts'&&canOpenPage(db,actorId,page)?`/${page}/${row.id}`:null;
 const sort=rows=>rows.sort((a,b)=>(Date.parse(b.occurredAt)||0)-(Date.parse(a.occurredAt)||0)||a.id.localeCompare(b.id));
 return {
  introductions:sort([...introductions.values()].filter(i=>canAccess(db,actorId,'introductions',i)).map(i=>({id:i.id,...summary(i.listing_id,i.inquiry_id,i),status:i.status,occurredAt:i.introduced_at,outcome:i.feedback||i.rejection_reason||'',href:link('introductions',i)}))),
  viewings:sort(db.viewings.filter(v=>introductions.has(v.introduction_id)&&canAccess(db,actorId,'introductions',introductions.get(v.introduction_id))&&canAccess(db,actorId,'viewings',v)).map(v=>{
   const intro=introductions.get(v.introduction_id);
   return {id:v.id,...summary(intro.listing_id,intro.inquiry_id,intro),status:v.status,interest:v.interest||null,occurredAt:v.performed_at||v.scheduled_at,outcome:v.customer_feedback||v.outcome||v.cancellation_reason||'',href:link('viewings',v)};
  })),
  deals:sort([...deals.values()].filter(d=>canAccess(db,actorId,'deals',d)).map(d=>({id:d.id,...summary(d.listing_id,d.inquiry_id,dealIntroduction(d)),code:d.code,status:d.stage,occurredAt:d.closed_at||d.started_at||d.created_at,outcome:d.closure_reason||d.result_notes||'',href:link('deals',d)}))),
  contracts:sort(db.contracts.filter(c=>deals.has(c.deal_id)&&canAccess(db,actorId,'deals',deals.get(c.deal_id))&&canAccess(db,actorId,'contracts',c)).map(c=>{
   const deal=deals.get(c.deal_id);
   return {id:c.id,...summary(deal.listing_id,deal.inquiry_id,dealIntroduction(deal)),code:c.contract_number,status:c.status,occurredAt:c.finalized_at||c.signed_at||c.created_at,href:link('contracts',c)};
  })),
 };
}
