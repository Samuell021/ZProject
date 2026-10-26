import {useSearchParams} from 'react-router-dom';
import PropertyCommercialActions from './PropertyCommercialActions';
import {propertyCommercialHistory} from '../services/property-commercial-history';
import React from 'react';
import {Modal,Timeline,person} from '../components/ui';
import {canAccess} from '../services/operations';
import PropertyCommercialHistory from './PropertyCommercialHistory';
export default function PropertyHistoryModal({db,actorId,request,parameter,run,busy,collection="registrationRequests"}) {
 const [q]=useSearchParams();
 if(!canAccess(db,actorId,collection,request))return null;
 return <><Modal title="سوابق پرونده" parameter={parameter} className="property-case-panel" clearParameters={['commercialAction','commercialRecord']}>
  <p className="muted">{request.code} · {request.title||request.initial_contact_name||(collection==='inquiries'?person(db,request.contact_id):'پرونده ملک')}</p>
  <PropertyCommercialHistory db={db} actorId={actorId} requestId={request.id} run={run} busy={busy} collection={collection}/>
  <Timeline db={db} id={request.id} collection={collection} actorId={actorId}/>
 </Modal><PropertyCommercialActions key={q.get("commercialAction")+q.get("commercialRecord")} db={db} actorId={actorId} rows={propertyCommercialHistory(db,actorId,request.id,collection)} run={run} busy={busy}/></>;
}
