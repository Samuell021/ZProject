import {inquiryWizardSteps,inquiryWizardStage,inquiryStageResponsible} from '../services/inquiry-wizard';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { num } from './ui';
import { propertyStageResponsible, propertyWizardStage, propertyWizardSteps } from '../services/property-wizard';
import '../features/property-registration-wizard.css';
export default function PropertyJourney({ db, request, inline = false, page="requests" }) {
 const [q,setQ]=useSearchParams();
 const inquiry=page==='inquiries',steps=inquiry?inquiryWizardSteps:propertyWizardSteps,stageFor=inquiry?inquiryWizardStage:propertyWizardStage,responsible=inquiry?inquiryStageResponsible:propertyStageResponsible;
 const stage=request?stageFor(db,request):'lead';
 const current=steps.findIndex(([key])=>key===stage);
 const selected=q.get('stage')||stage;
 const go=key=>{const next=new URLSearchParams(q);next.set('stage',key);setQ(next);};
 return <nav className={`property-journey ${inquiry?"inquiry-journey":""}`} aria-label={inquiry?"مسیر درخواست متقاضی":"مسیر پرونده ملک"}><ol className="flow-steps">{steps.map(([key,title,owner],i)=>{
  const content=<><span>{current>i?<Check size={18} aria-hidden="true"/>:num(i+1)}</span><strong>{title}</strong><small>{owner}</small>{request&&<small>{responsible(db,request,key)}</small>}{key===stage&&<i className="journey-current-marker" aria-hidden="true"/>}</>;
  return <li key={key} className={`${current>i?'is-complete':''} ${selected===key?'is-selected':''}`} aria-current={key===stage?'step':undefined}>
   {!request?<div>{content}</div>:inline?<button type="button" aria-pressed={selected===key} onClick={()=>go(key)}>{content}</button>:<Link to={`/property-register?case=${encodeURIComponent(request.id)}&stage=${key}`}>{content}</Link>}
  </li>;
 })}</ol></nav>;
}
