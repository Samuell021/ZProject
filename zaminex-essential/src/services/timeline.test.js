import test from "node:test";
import assert from "node:assert/strict";
import { createSeed } from "../mock/seed.js";
import { timelineEntries } from "./timeline.js";
test("property case timeline includes assignment, linked transfer, reviews and stages", () => {
  const db = createSeed();
  const entries = timelineEntries(db, "u2", "registrationRequests", "r2");
  assert.ok(
    entries.some((e) => e.kind === "assignment" && e.source_id === "ah1"),
  );
  assert.ok(
    entries.some((e) => e.kind === "transfer" && e.source_id === "tr1"),
  );
  assert.ok(entries.some((e) => e.kind === "review"));
  assert.ok(entries.some((e) => e.kind === "stage"));
  assert.equal(new Set(entries.map((e) => e.id)).size, entries.length);
});
test("timeline rejects private root and does not expand unrelated operation ids", () => {
  const db = createSeed();
  assert.deepEqual(timelineEntries(db, "u6", "registrationRequests", "r2"), []);
  db.activityLogs.push({
    id: "private-log",
    subject_type: "contact",
    subject_id: "c20",
    operation_id: "op-transfer1",
    description: "PRIVATE",
  });
  assert.ok(
    !timelineEntries(db, "u2", "registrationRequests", "r2").some(
      (e) => e.source_id === "private-log",
    ),
  );
});
