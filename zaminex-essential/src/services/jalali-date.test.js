import test from 'node:test';import assert from 'node:assert/strict';import {jalaliToISO,isoToJalaliInput} from './jalali-date.js';
test('Jalali entry stores Gregorian ISO dates and accepts Persian digits',()=>{
 assert.equal(jalaliToISO('۱۴۰۳/۰۱/۰۱'),'2024-03-20');assert.equal(jalaliToISO('1403/12/30'),'2025-03-20');assert.equal(jalaliToISO('1404/12/30'),null);assert.equal(jalaliToISO('1405/07/32'),null);assert.equal(jalaliToISO('2026-11-01'),null);assert.equal(jalaliToISO('١٤٠٣/٠١/٠١'),'2024-03-20');
});
test('date-time entry uses Tehran time independently of the browser timezone',()=>{
 assert.equal(jalaliToISO('۱۴۰۵/۰۸/۱۰ ۱۰:۰۰',true),'2026-11-01T06:30:00.000Z');assert.equal(jalaliToISO('1405/08/10 25:00',true),null);assert.equal(isoToJalaliInput('2026-11-01T06:30:00.000Z',true),'۱۴۰۵/۰۸/۱۰ ۱۰:۰۰');assert.equal(isoToJalaliInput('2024-03-20'),'۱۴۰۳/۰۱/۰۱');
});
