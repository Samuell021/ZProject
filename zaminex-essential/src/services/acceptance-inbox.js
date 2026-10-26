import {canAccess} from './operations.js';
import {assignmentState,canManageCase,isInAcceptanceInbox,leadState,pendingExtension,pendingWithdrawal} from './intake.js';
export const acceptanceTabs=[
 ['NEW','پذیرش اولیه'],
 ['PENDING','پذیرش مشاور'],['PROPERTY_REVIEW','تأیید کارشناسی ملک'],
 ['EXTENSION_PENDING','تأیید تمدید مهلت'],['WITHDRAWAL_PENDING','تأیید انصراف مشاور']
];
export function acceptanceRecords(db,actorId){
 return ['registrationRequests','inquiries'].flatMap(collection=>db[collection]
  .filter(row=>canAccess(db,actorId,collection,row)&&isInAcceptanceInbox(db,actorId,collection,row))
  .map(row=>{
   const manager=canManageCase(db,actorId,row);
   const state=pendingWithdrawal(db,collection,row)?'WITHDRAWAL_PENDING':manager&&collection==='registrationRequests'&&row.status==='PENDING_REVIEW'?'PROPERTY_REVIEW':leadState(row)==='NEW'?'NEW':assignmentState(db,collection,row);
   return {collection,row,state,extension:!!pendingExtension(db,collection,row)};
  }));
}
export function matchesAcceptanceTab(record,tab){
 return tab==='ALL'||(tab==='INTAKE'?true:tab==='EXTENSION_PENDING'?record.extension:record.state===tab);
}
