import {person} from './ui';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { canAccess } from '../services/operations';
const collections = {leads:'registrationRequests',inbox:'registrationRequests',requests:'registrationRequests',inquiries:'inquiries',properties:'properties',reviews:'properties',listings:'listings',explore:'listings',contacts:'contacts',deals:'deals',contracts:'contracts',introductions:'introductions',viewings:'viewings','inquiry-register':'inquiries','property-register':'registrationRequests'};
export default function LastVisitedRecord({ db, actorId }) {
 const location=useLocation();
 const [page='dashboard',id]=location.pathname.split('/').filter(Boolean);
 const key=`farda-last-visited:${actorId}`;
 const [records,setRecords]=useState(()=>{try{return JSON.parse(sessionStorage.getItem(key))||{};}catch{return {};}});
 const caseId=['property-register','inquiry-register'].includes(page)?new URLSearchParams(location.search).get('case'):id;
 const collection=collections[page];
 const current=collection&&db[collection]?.find(r=>r.id===caseId);
 const permitted=row=>row&&(canAccess(db,actorId,collection,row)||(page==='property-register'&&row.created_by_id===actorId));
 useEffect(()=>{
  if(!current||!permitted(current))return;
  const href=['property-register','inquiry-register'].includes(page)?`/${page}?case=${encodeURIComponent(current.id)}`:`/${page}/${encodeURIComponent(current.id)}`;
  setRecords(previous=>{
   if(previous[page]?.id===current.id&&previous[page]?.href===href)return previous;
   const entry={id:current.id,href};
   const next={...previous,[page]:entry,...(page==='requests'?{leads:entry,inbox:entry}:{}),...(page==='inquiries'?{inbox:{...entry,collection:'inquiries'}}:{}),...(page==='reviews'?{inbox:{...entry,collection:'properties'}}:{})};
   try{sessionStorage.setItem(key,JSON.stringify(next));}catch{}
   return next;
  });
 },[page,caseId,actorId,current?.id,location.pathname]);
 if(caseId||!collection)return null;
 const last=records[page];
 const lastCollection=last?.collection||collection;
 const row=last&&db[lastCollection]?.find(r=>r.id===last.id);
 if(!row||!(canAccess(db,actorId,lastCollection,row)||(page==='property-register'&&row.created_by_id===actorId)))return null;
 const title=row.title||row.initial_contact_name||[row.first_name,row.last_name].filter(Boolean).join(' ')||(lastCollection==='inquiries'?person(db,row.contact_id):row.code);
 return <aside className="last-visited-record" aria-label="آخرین پرونده مشاهده‌شده"><div><strong>آخرین بار اینجا بودید</strong><p>{row.code&&<span>{row.code} · </span>}{title||'پرونده قبلی'}</p></div><Link className="button secondary" to={last.href}>ادامه از همین پرونده ←</Link></aside>;
}
