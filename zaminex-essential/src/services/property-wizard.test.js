import test from 'node:test';
import assert from 'node:assert/strict';
import { propertyWizardStage } from './property-wizard.js';
const db = {properties: [], listings: []};
test('wizard follows persisted intake and review instead of a freely selected step', () => {
 const r={id:'r',status:'NEW',lead_status:'NEW',acceptance_status:'UNASSIGNED'};
 assert.equal(propertyWizardStage(db,r),'reception');
 r.lead_status='ACCEPTED';assert.equal(propertyWizardStage(db,r),'assignment');
 r.assigned_to_id='u';r.acceptance_status='PENDING';assert.equal(propertyWizardStage(db,r),'acceptance');
 r.acceptance_status='ACCEPTED';r.status='IN_PROGRESS';assert.equal(propertyWizardStage(db,r),'appraisal');
 r.resulting_property_id='p';db.properties.push({id:'p',review_status:'PENDING'});assert.equal(propertyWizardStage(db,r),'review');
 db.properties[0].review_status='CHANGES_REQUIRED';assert.equal(propertyWizardStage(db,r),'appraisal');
 db.properties[0].review_status='APPROVED';r.status='COMPLETED';assert.equal(propertyWizardStage(db,r),'listing');
 r.status='DUPLICATE';assert.equal(propertyWizardStage(db,r),'closed');
});
test('rejected assignment returns to manager and finalized supply stays on listing stage',()=>{
 assert.equal(propertyWizardStage(db,{lead_status:'ACCEPTED',assigned_to_id:'u',acceptance_status:'REJECTED'}),'assignment');
 assert.equal(propertyWizardStage(db,{status:'COMPLETED',lead_status:'ACCEPTED',assigned_to_id:'u',acceptance_status:'ACCEPTED',resulting_property_id:'p'}),'listing');
});
