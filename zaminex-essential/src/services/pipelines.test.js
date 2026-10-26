import test from 'node:test';
import assert from 'node:assert/strict';
import {inOperationalPipeline} from './intake.js';
import {pipelineDefinitions} from './pipelines.js';
for(const [page,collection,terminal] of [
 ['requests','registrationRequests',['COMPLETED','CANCELLED','DUPLICATE']],
 ['inquiries','inquiries',['COMPLETED','CANCELLED']],
 ['deals','deals',['FINALIZED','LOST']],
])test(`${page}: terminal records stay out of operational columns`,()=>{
 for(const state of terminal){
  assert(!pipelineDefinitions[page].stages.includes(state));
  assert(pipelineDefinitions[page].terminalStages.includes(state));
  assert.equal(inOperationalPipeline(collection,{status:state,stage:page==='deals'?state:undefined,acceptance_status:'ACCEPTED'}),false);
 }
});

test('same contact suggests investigation rather than automatically marking two properties duplicate',async()=>{
 const {possibleDuplicateCases}=await import('./intake.js');
 const {createSeed}=await import('../mock/seed.js');
 const db=createSeed(),row={...db.registrationRequests[1],id:'another-property',status:'NEW',resulting_property_id:null};
 assert(possibleDuplicateCases(db,'u2',row).some(r=>r.id==='r2'));
 assert.deepEqual(possibleDuplicateCases(db,'u4',row),[]);
 assert.equal(row.status,'NEW');
});

test('manager pipeline includes intake but consultant pipeline includes only their active work',async()=>{
 const {pipelineStage}=await import('./pipelines.js');
 const {createSeed}=await import('../mock/seed.js');const db=createSeed();
 const lead={id:'new-lead',status:'NEW',lead_status:'NEW',management_scope_id:'s1',created_by_id:'u4',assigned_to_id:null};
 assert.equal(pipelineStage(db,'u2','requests',lead),'LEAD_RECEPTION');
 assert.equal(pipelineStage(db,'u1','requests',lead),'LEAD_RECEPTION');
 assert.equal(pipelineStage(db,'u3','requests',lead),null);
 assert.equal(pipelineStage(db,'u4','requests',lead),null);
 assert.equal(pipelineStage(db,'u2','requests',{...lead,lead_status:'ACCEPTED'}),'LEAD_READY');
 assert.equal(pipelineStage(db,'u2','requests',{...lead,lead_status:'ACCEPTED',assigned_to_id:'u4',acceptance_status:'PENDING'}),'ASSIGNMENT_PENDING');
 const active={...lead,status:'IN_PROGRESS',assigned_to_id:'u4',lead_status:'ACCEPTED',acceptance_status:'ACCEPTED'};
 assert.equal(pipelineStage(db,'u4','requests',active),'IN_PROGRESS');
 assert.equal(pipelineStage(db,'u5','requests',active),null);
 assert.equal(pipelineStage(db,'u2','requests',{...active,status:'COMPLETED'}),null);
});

test('pipeline cards put overdue and nearest deadlines first, undated last, without mutating input',async()=>{
 const {sortPipelineRows}=await import('./pipelines.js');
 const rows=[
  {id:'undated'},
  {id:'later',due_at:'2026-10-22T12:00:00Z'},
  {id:'near',next_action_at:'2026-10-20T12:00:00Z'},
  {id:'overdue',due_at:'2026-10-18T12:00:00Z'},
  {id:'oldest',due_at:'2026-10-17T12:00:00Z'},
  {id:'invalid',due_at:'invalid'},
  {id:'same',due_at:'2026-10-20T12:00:00Z'},
  {id:'due-priority',due_at:'2026-10-21T12:00:00Z',next_action_at:'2026-10-16T12:00:00Z'},
 ];
 const original=structuredClone(rows);
 assert.deepEqual(sortPipelineRows(rows).map(r=>r.id),['oldest','overdue','near','same','due-priority','later','undated','invalid']);
 assert.deepEqual(rows,original);
 assert.deepEqual(sortPipelineRows([]),[]);
});
