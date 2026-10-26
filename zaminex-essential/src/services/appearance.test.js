import test from 'node:test';
import assert from 'node:assert/strict';
import { colorThemes, normalizeAppearance } from './appearance.js';
import { createSeed, updateDemoStaff } from '../mock/seed.js';

test('appearance has six valid themes and safe defaults for unavailable preferences', () => {
  assert.equal(colorThemes.length, 6);
  assert.equal(new Set(colorThemes.map(theme => theme.color)).size, 6);
  assert.equal(colorThemes.find(theme => theme.id === 'midnight').color, '#191970');
  assert.deepEqual(normalizeAppearance(null), { color: 'green', mode: 'light' });
  assert.deepEqual(normalizeAppearance({color:'unknown',mode:'invalid'}), { color: 'green', mode: 'light' });
  assert.deepEqual(normalizeAppearance({color:'petroleum',mode:'dark'}), { color: 'petroleum', mode: 'dark' });
});

test('demo staff rename preserves records, IDs and customized profile names', () => {
  const db = createSeed();
  const originalRecords = structuredClone(db.registrationRequests);
  db.staffProfiles.find(profile => profile.user_id === 'u1').full_name = 'علی رضایی';
  db.staffProfiles.find(profile => profile.user_id === 'u2').full_name = 'مریم احمدی';
  db.staffProfiles.find(profile => profile.user_id === 'u3').full_name = 'حسین کریمی';
  const updated = updateDemoStaff(db);
  assert.equal(updated.staffProfiles.find(profile => profile.user_id === 'u1').full_name, 'مرتضی کاظمی');
  assert.equal(updated.staffProfiles.find(profile => profile.user_id === 'u2').full_name, 'خانم زرعکانی');
  assert.equal(updated.staffProfiles.find(profile => profile.user_id === 'u3').full_name, 'امین زارعی');
  assert.deepEqual(updated.registrationRequests, originalRecords);
  db.staffProfiles.find(profile => profile.user_id === 'u1').full_name = 'نام سفارشی';
  assert.equal(updateDemoStaff(db).staffProfiles.find(profile => profile.user_id === 'u1').full_name, 'نام سفارشی');
});
