import {canManageCase,groupsFor} from './intake.js';
export function inquiryRelations(db,row){
 const introductions=db.introductions.filter(i=>i.inquiry_id===row?.id),ids=new Set(introductions.map(i=>i.id));
 const viewings=db.viewings.filter(v=>ids.has(v.introduction_id)),deals=db.deals.filter(d=>d.inquiry_id===row?.id);
 const dealIds=new Set(deals.map(d=>d.id)),contracts=db.contracts.filter(c=>dealIds.has(c.deal_id));
 const parties=new Set(db.contractParties.filter(p=>contracts.some(c=>c.id===p.contract_id)).map(p=>p.id));
 return {introductions,viewings,deals,contracts,listings:[],locked:contracts.some(c=>c.status==='FINALIZED')||db.signatures.some(s=>parties.has(s.contract_party_id)&&s.status==='SIGNED')};
}
export function inquiryStatusActions(db,actorId,row){
 if(!row||!canManageCase(db,actorId,row))return [];
 const related=inquiryRelations(db,row);
 if(related.locked||related.contracts.some(c=>!['CANCELLED'].includes(c.status))&&!groupsFor(db,actorId).some(g=>g.code==='GENERAL_MANAGER'))return [];
 if(['CLOSED','CANCELLED'].includes(row.status))return row.case_close_snapshot?['REOPEN']:[];
 if(['DUPLICATE','COMPLETED'].includes(row.status))return [];
 return ['CLOSED','CANCELLED','DUPLICATE'];
}
