import test from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from '../mock/seed.js';
import { operate } from './operations.js';

test('operation replay is bound to actor, action and original input', () => {
  const payload = { operation_id: 'audit-contact', first_name: 'آزمون', last_name: 'تکرار', phone: '09121116666' };
  const db = operate(createSeed(), 'u1', 'createContact', payload);
  const snapshot = structuredClone(db);
  assert.throws(() => operate(db, 'u4', 'createContact', payload), /شناسه عملیات/);
  assert.throws(() => operate(db, 'u1', 'createContact', { ...payload, first_name: 'متفاوت' }), /شناسه عملیات/);
  assert.throws(() => operate(db, 'u1', 'createRegistrationRequest', payload), /شناسه عملیات/);
  const replay = operate(db, 'u1', 'createContact', Object.fromEntries(Object.entries(payload).reverse()));
  assert.equal(replay.contacts.length, db.contacts.length);
  assert.deepEqual(replay._result, db._result);
  assert.deepEqual(db, snapshot);
});

test('invalid command dates never enter stored records', () => {
  const db = createSeed();
  const snapshot = structuredClone(db);
  for (const key of ['due_at', 'next_action_at', 'valid_until', 'paid_at', 'effective_at', 'scheduled_at']) {
    assert.throws(() => operate(db, 'u1', 'createRegistrationRequest', {
      management_scope_id: 's1', contact_id: 'c1', description: 'بررسی تاریخ', [key]: 'not-a-date',
    }), /تاریخ/);
  }
  assert.deepEqual(db, snapshot);
});

test('task buckets do not duplicate overdue tasks today and use Tehran day boundaries', async () => {
  const { taskBucket } = await import('./calendar.js');
  const now = '2026-10-18T21:00:00Z'; // 00:30 the next day in Tehran
  assert.equal(taskBucket({ status: 'PENDING', due_at: '2026-10-18T20:45:00Z' }, now), 'overdue');
  assert.equal(taskBucket({ status: 'PENDING', due_at: '2026-10-18T22:00:00Z' }, now), 'today');
  assert.equal(taskBucket({ status: 'COMPLETED', due_at: '2026-10-18T20:45:00Z' }, now), 'other');
  assert.equal(taskBucket({ status: 'PENDING', due_at: '2026-10-20T00:00:00Z' }, now), 'other');
  assert.equal(taskBucket({ status: 'PENDING' }, now), 'other');
});
