import SelectBox from "../components/SelectBox";
import {canOpenPage} from "../services/intake";
import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import CasePipelineBoard,{casePipelineStage} from "./CasePipelineBoard";
import { canAccess } from "../services/operations";
import { pipelineDefinitions } from "../services/pipelines";
import { num } from "../components/ui";
export default function PipelineWorkspace({ db, actorId }) {
  const [q, setQ] = useSearchParams();
  const available=Object.entries(pipelineDefinitions).filter(([id])=>['requests','inquiries'].includes(id)&&canOpenPage(db,actorId,id));
  const key = available.some(([id])=>id===q.get("pipeline")) ? q.get("pipeline") : available[0]?.[0]||"requests";
  const definition = {...pipelineDefinitions[key],title:key==='requests'?'پرونده‌های ملک':'پرونده‌های متقاضی'};
  const update = (name, value) => {
    const next = new URLSearchParams(q);
    value ? next.set(name, value) : next.delete(name);
    setQ(next);
  };
  const rows = db[definition.collection].filter(
    (r) =>
      casePipelineStage(db,key,r) && canAccess(db, actorId, definition.collection, r) &&
      (!q.get("scope") || r.management_scope_id === q.get("scope")) &&
      (!q.get("assignee") || r.assigned_to_id === q.get("assignee")) &&
      (!q.get("search") ||
        [r.code, r.title, r.initial_contact_name, r.description, r.next_action, db.properties.find(p=>p.id===r.resulting_property_id)?.title]
          .filter(Boolean)
          .join(" ")
          .includes(q.get("search"))),
  );
  return (
    <section className="panel pipeline-workspace">
      <div className="pipeline-switcher" role="tablist" aria-label="مسیر کاریز">
        {available.map(([id, p]) => (
          <button
            role="tab"
            aria-selected={key === id}
            className={key === id ? "" : "secondary"}
            key={id}
            onClick={() => update("pipeline", id)}
          >
            {id==='requests'?'پرونده‌های ملک':'پرونده‌های متقاضی'}
          </button>
        ))}
      </div>
      <div className="section-head">
        <div>
          <h2>کاریز {definition.title}</h2>
          <p className="muted">
            {num(rows.length)} پرونده · پذیرش در کارتابل؛ ارجاع در پرونده
          </p>
        </div>
        <Link
          className="button secondary"
          to={`/${key}?${new URLSearchParams({ ...(q.get("scope") ? { scope: q.get("scope") } : {}), ...(q.get("search") ? { search: q.get("search") } : {}), ...(q.get("assignee") ? { assignee: q.get("assignee") } : {}) })}`}
        >
          نمای فهرست ←
        </Link>
      </div>
      <div className="toolbar pipeline-filters">
        <input
          aria-label="جست‌وجوی کاریز"
          placeholder="کد، عنوان یا اقدام بعدی…"
          value={q.get("search") || ""}
          onChange={(e) => update("search", e.target.value)}
        />
        <SelectBox
          aria-label="رنج کاریز"
          value={q.get("scope") || ""}
          onChange={(e) => update("scope", e.target.value)}
        >
          <option value="">همه رنج‌های مجاز</option>
          {db.scopes.filter(s=>canAccess(db,actorId,"scopes",s)).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </SelectBox>
        <SelectBox
          aria-label="مسئول کاریز"
          value={q.get("assignee") || ""}
          onChange={(e) => update("assignee", e.target.value)}
        >
          <option value="">همه مسئول‌ها</option>
          {db.staffProfiles.filter(s=>canAccess(db,actorId,"staffProfiles",s)).map((s) => (
            <option key={s.id} value={s.user_id}>
              {s.full_name}
            </option>
          ))}
        </SelectBox>
      </div>
      <CasePipelineBoard key={key} page={key} rows={rows} db={db} actorId={actorId} />
    </section>
  );
}
