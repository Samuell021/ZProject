import test from 'node:test';
import assert from 'node:assert/strict';
import {createSeed} from '../mock/seed.js';
import {canUseAction} from './action-availability.js';
test('only actionable negotiation controls appear for the current role and stage',()=>{
 const db=createSeed(),d=db.deals[0];
 for(const stage of ['CONTRACT','FINALIZED','LOST'])assert.equal(canUseAction(db,'u1','deals',{...d,stage},'offer'),false);
 assert.equal(canUseAction(db,'u1','deals',{...d,stage:'NEGOTIATION'},'offer'),true);
 assert.equal(canUseAction(db,'u7','deals',{...d,stage:'NEGOTIATION'},'offer'),false);
 assert.equal(canUseAction(db,'u1','deals',{...d,stage:'NEGOTIATION',accepted_offer_id:null},'createContract'),false);
 assert.equal(canUseAction(db,'u1','deals',{...d,stage:'FINALIZED'},'followup'),false);
});
test('finalization appears after all signatures; completed signature and finance controls stay out of other roles',()=>{
 const db=createSeed(),c=db.contracts.find(c=>c.status!=='FINALIZED')||db.contracts[0];
 c.status='PENDING_SIGNATURE';
 const parties=db.contractParties.filter(p=>p.contract_id===c.id);
 db.signatures=db.signatures.filter(s=>!parties.some(p=>p.id===s.contract_party_id));
 assert.equal(canUseAction(db,'u1','contracts',c,'finalizeContract'),false);
 assert.equal(canUseAction(db,'u8','contracts',c,'signContract',parties[0]),false);
 assert.equal(canUseAction(db,'u1','contracts',c,'signContract',parties[0]),true);
 for(const party of parties)db.signatures.push({contract_party_id:party.id,status:'SIGNED'});
 const deal=db.deals.find(d=>d.id===c.deal_id);db.listings.find(l=>l.id===deal.listing_id).status='ACTIVE';
 assert.equal(canUseAction(db,'u1','contracts',c,'signContract',parties[0]),false);
 assert.equal(canUseAction(db,'u1','contracts',c,'finalizeContract'),parties.length>=2);
 assert.equal(canUseAction(db,'u8','contracts',c,'finalizeContract'),false);
});
test('closed inquiries and rejected introductions retain history but no future operations',()=>{
 const db=createSeed();
 assert.equal(canUseAction(db,'u1','inquiries',{...db.inquiries[0],status:'COMPLETED'},'followup'),false);
 for(const action of ['viewing','interested','rejectIntroduction','createDeal'])assert.equal(canUseAction(db,'u1','introductions',{...db.introductions[0],status:'REJECTED'},action),false);
});
