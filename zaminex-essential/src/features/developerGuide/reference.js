import { exportHandoff, exportWorkflow, exportBackendStatus } from "./handoff.js";
import { exportBackendGap } from "./backendGap.js";
import { modelCatalog } from "./models.js";
import { apiCatalog } from "./apis.js";
import { guideSections } from "./sections.js";
import { databaseRules, apiRules, pipelineRules } from "./shared.js";
import { pipelineDefinitions } from "../../services/pipelines.js";
const markdownCell = (value) =>
  String(value ?? "—")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, "<br/>");
export function exportDeveloperReference() {
  const lines = [
    "# مرجع پیشنهادی بک‌اند Crm گروه سرمایه گذاری کلان فردا",
    "این سند از راهنمای محلی نمونه تولید شده است؛ API و دیتابیس واقعی در این نمونه پیاده نشده‌اند.",
    exportHandoff(),
    exportWorkflow(),
    exportBackendStatus(),
    exportBackendGap(),
    "\n## اصول پایگاه داده",
    ...databaseRules.map((x) => "- " + x),
  ];
  for (const model of Object.values(modelCatalog)) {
    lines.push(
      `\n## ${model.name} — ${model.table}`,
      model.purpose,
      "|فیلد|نوع|الزام|رابطه|شرح|",
      "|---|---|---|---|---|",
      ...model.fields.map(
        (f) =>
          `|${[f.name, f.type, f.required ? "بله" : "خیر/شرطی", f.relation || "—", f.description].map(markdownCell).join("|")}|`,
      ),
      ...model.constraints.map((x) => "- " + x),
      "ایندکس‌ها: " + model.indexes.join("؛ "),
    );
  }
  lines.push("\n## اصول API", ...apiRules.map((x) => "- " + x));
  for (const [key, api] of Object.entries(apiCatalog))
    lines.push(
      `\n### ${api.method} ${api.path}`,
      api.summary,
      `مجوز: ${api.permission}`,
      `سرویس نمونه: ${api.mock || "قرارداد پیشنهادی خواندن/مدیریت"}`,
      `ثبت اتمیک: ${api.transaction ? "لازم" : "خواندن"}`,
      `فیلترها: ${(api.filters || []).join(", ") || "—"}`,
      ...api.effects.map((x) => "- " + x),
      "خطاها: " + api.errors.join("؛ "),
      api.request
        ? "```json\n" + JSON.stringify(api.request, null, 2) + "\n```"
        : "بدون بدنه درخواست",
      "```json\n" + JSON.stringify(api.response, null, 2) + "\n```",
    );
  lines.push("\n## کاریز", ...pipelineRules.map((x) => "- " + x));
  for (const [key, p] of Object.entries(pipelineDefinitions)) {
    lines.push(
      `\n### ${p.title} — ${p.model}.${p.field}`,
      ...p.transitions.map(
        (t) =>
          `${t.from.join("/")} → ${t.to}: ${t.command}؛ الزامات: ${t.required}؛ مجوز: ${t.permission}؛ اثر: ${t.effects}`,
      ),
    );
  }
  lines.push("\n## نقشه پیاده‌سازی هر بخش");
  for (const s of Object.values(guideSections))
    lines.push(
      `\n### ${s.title}`,
      s.purpose,
      "مدل‌ها: " + s.models.join(", "),
      "APIها: " +
        s.apis
          .map((key) => `${apiCatalog[key].method} ${apiCatalog[key].path}`)
          .join("؛ "),
      ...s.checks.map((x) => "- " + x),
    );
  return lines.join("\n");
}
