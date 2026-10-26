import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { modelCatalog } from "../features/developerGuide/models.js";
import { guideSections } from "../features/developerGuide/sections.js";
import { apiCatalog } from "../features/developerGuide/apis.js";
import {
  pipelineDefinitions,
  transitionFor,
  pipelineWarnings,
} from "./pipelines.js";
import { createSeed } from "../mock/seed.js";
test("every page guide references complete model and API contracts", () => {
  for (const [page, s] of Object.entries(guideSections)) {
    assert.ok(s.models.length && s.apis.length && s.checks.length, page);
    for (const model of s.models)
      assert.ok(modelCatalog[model], `${page}: ${model}`);
    for (const api of s.apis) assert.ok(apiCatalog[api], `${page}: ${api}`);
  }
  for (const m of Object.values(modelCatalog)) {
    assert.ok(
      m.fields.some((f) => f.name === "id"),
      m.name,
    );
    assert.equal(
      new Set(m.fields.map((f) => f.name)).size,
      m.fields.length,
      m.name,
    );
    assert.ok(m.constraints.length && m.indexes.length, m.name);
    for (const f of m.fields)
      assert.ok(f.type && f.description, m.name + "." + f.name);
  }
  for (const api of Object.values(apiCatalog))
    for (const model of api.models)
      assert.ok(modelCatalog[model], `${api.path}: ${model}`);
});
test("every current mock command is documented and pipeline commands remain guarded", () => {
  const source = readFileSync(
    new URL("./operations.js", import.meta.url),
    "utf8",
  );
  const actions = [...source.matchAll(/case "([A-Za-z]+)":/g)].map((m) => m[1]);
  for (const action of actions)
    assert.ok(
      Object.values(apiCatalog).some((api) => api.mock === action),
      `undocumented: ${action}`,
    );
  const db = createSeed();
  assert.equal(
    transitionFor("requests", { status: "NEW" }, "COMPLETED"),
    undefined,
  );
  assert.equal(
    transitionFor("requests", { status: "NEW" }, "ASSIGNED"),
    undefined,
  );
  assert.equal(
    transitionFor("deals", { stage: "CONTRACT" }, "FINALIZED").command,
    "finalizeContract",
  );
  assert.ok(
    pipelineWarnings("requests", { id: "test", status: "NEW" }, db).length > 0,
  );
  for (const p of Object.values(pipelineDefinitions))
    for (const t of p.transitions) {
      assert.ok([...p.stages,...(p.terminalStages||[])].includes(t.to));
      assert.ok(t.required && t.effects && t.permission);
    }
});

test("downloadable handoff includes all models, API and pipeline contracts with valid table cells", async () => {
  const { exportDeveloperReference } =
    await import("../features/developerGuide/reference.js");
  const text = exportDeveloperReference();
  for (const model of Object.keys(modelCatalog))
    assert.ok(text.includes(`## ${model} —`), model);
  for (const api of Object.values(apiCatalog))
    assert.ok(text.includes(`${api.method} ${api.path}`), api.path);
  assert.ok(text.includes("Idempotency-Key"));
  assert.ok(text.includes("submitListingForReview"));
  for (const row of text.split("\n").filter((line) => line.startsWith("|")))
    assert.equal([...row.matchAll(/(?<!\\)\|/g)].length, 6, row);
});

test("inquiry matching is a valid search transition but derived stages cannot be set freely", async () => {
  const { operate } = await import("./operations.js");
  let db = createSeed();
  db = operate(db, "u1", "updateInquiry", {
    id: "i6",
    status: "MATCHING",
    next_action: "تطبیق",
    next_action_at: "2030-01-01T10:00:00Z",
  });
  assert.equal(db.inquiries.find((i) => i.id === "i6").status, "MATCHING");
  assert.throws(
    () =>
      operate(db, "u1", "updateInquiry", { id: "i6", status: "INTRODUCED" }),
    /عملیات مرتبط/,
  );
});
