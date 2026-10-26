import test from "node:test";
import assert from "node:assert/strict";
import {
  tehranDay,
  startOfWeek,
  weekDays,
  validDay,
  shiftDay,
} from "./calendar.js";
test("Tehran day boundaries and Saturday week preserve Gregorian keys with Persian display", () => {
  assert.equal(tehranDay("2026-10-17T21:00:00Z"), "2026-10-18");
  assert.equal(tehranDay("2026-10-17T20:00:00Z"), "2026-10-17");
  assert.equal(startOfWeek("2026-10-18"), "2026-10-17");
  assert.equal(startOfWeek("2026-10-17"), "2026-10-17");
  assert.equal(weekDays("2026-10-18").length, 7);
  assert.equal(shiftDay("2026-12-31", 1), "2027-01-01");
  assert.equal(validDay("2026-02-31"), false);
  assert.equal(validDay("bad"), false);
  assert.equal(weekDays("bad").length, 7);
});
