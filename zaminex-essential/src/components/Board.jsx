import {canOpenPage} from "../services/intake";
import React, { useState, useRef, useEffect, useId } from "react";
import {ArrowLeft,ArrowRight} from "lucide-react";
import {
  pipelineDefinitions, pipelineStage, intakePipelineStages,
  pipelineRoute, sortPipelineRows,
  pipelineWarnings,
  transitionFor,
} from "../services/pipelines";
import { Link, useNavigate } from "react-router-dom";
import {
  DndContext,
  pointerWithin,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { staff, person, remaining, num, label } from "./ui";
function Card({ row: r, page, db, actorId }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: r.id,
  });
  const warnings = pipelineWarnings(page, r, db);
  return (
    <article
      className="kanban-card"
      ref={setNodeRef}
      style={
        transform
          ? {
              transform: `translate(${transform.x}px,${transform.y}px)`,
              zIndex: 2,
            }
          : undefined
      }
    >
      <button
        className="drag-handle secondary"
        {...listeners}
        {...attributes}
        aria-label="کشیدن کارت"
      >
        ⠿
      </button>
      <small>{r.code}</small>
      <Link to={`/${page}/${r.id}`}>
        <h3>{page==='requests' ? (db.properties.find(p=>p.id===r.resulting_property_id)?.title||r.title||r.initial_contact_name||'عنوان تعیین نشده') : r.title || person(db,r.contact_id)}</h3>
      </Link>
      <p className="kanban-contact">
        {person(
          db,
          r.contact_id ||
            db.inquiries.find((x) => x.id === r.inquiry_id)?.contact_id,
        )}
      </p>
      <small>
        {staff(db, r.assigned_to_id)} ·{" "}
        {db.scopes.find((x) => x.id === r.management_scope_id)?.name}
      </small>
      {intakePipelineStages.includes(pipelineStage(db,actorId,page,r))&&<small>ثبت‌کننده: {staff(db,r.created_by_id)}</small>}
      <small
        className={
          new Date(r.due_at || r.next_action_at) < new Date() ? "overdue" : ""
        }
      >
        {remaining(r.due_at || r.next_action_at)}
      </small>
      {warnings.length > 0 && <small className="kanban-warning" title={warnings.join(' · ')}>{warnings[0]}{warnings.length>1?` · ${num(warnings.length-1)} هشدار دیگر`:''}</small>}
      <Link className="button secondary" to={pipelineRoute(page, r, db,undefined,actorId)}>
        اقدام بعدی ←
      </Link>
    </article>
  );
}
function Column({ stage, rows, page, db, actorId }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <section
      className={`kanban-column ${isOver ? "drag-over" : ""}`}
      ref={setNodeRef}
      data-stage={stage}
      aria-label={`مرحله ${label(stage)}`}
    >
      <h3>
        {label(stage)} <span>{num(rows.length)}</span>
      </h3>
      {rows.map((r) => (
        <Card key={r.id} row={r} page={page} db={db} actorId={actorId} />
      ))}
    </section>
  );
}
export default function Board({ page, rows: allRows, db, actorId }) {
  const rows=sortPipelineRows(allRows.filter(row=>pipelineStage(db,actorId,page,row)));
  const management=canOpenPage(db,actorId,"leads")&&["requests","inquiries"].includes(page);
  const nav = useNavigate();
  const [error, setError] = useState("");
  const scrollRef=useRef(null), boardId=useId();
  const [scrollable,setScrollable]=useState({left:false,right:false});
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  const stages = [
    ...new Set([
      ...(management?intakePipelineStages:[]),
      ...pipelineDefinitions[page].stages,
      ...rows.map((r) => pipelineStage(db,actorId,page,r)),
    ]),
  ];
  useEffect(()=>{
    const board=scrollRef.current;if(!board)return;
    const update=()=>{
      const rect=board.getBoundingClientRect(),first=board.firstElementChild?.getBoundingClientRect(),last=board.lastElementChild?.getBoundingClientRect();
      const next={left:!!last&&last.left<rect.left-2,right:!!first&&first.right>rect.right+2};
      setScrollable(previous=>previous.left===next.left&&previous.right===next.right?previous:next);
    };
    const observer=new ResizeObserver(update);observer.observe(board);
    for(const column of board.children)observer.observe(column);
    board.addEventListener('scroll',update,{passive:true});update();
    return ()=>{observer.disconnect();board.removeEventListener('scroll',update);};
  },[page,stages.length,rows.length]);
  useEffect(()=>{scrollRef.current?.scrollTo({left:0,behavior:'instant'});},[page]);
  const move=direction=>{
    const board=scrollRef.current;if(!board)return;
    const step=(board.firstElementChild?.getBoundingClientRect().width||240)+10;
    board.scrollBy({left:direction*step,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  return (
    <>
      <p className="muted">
        ترتیب کارت‌ها: موعدگذشته‌ها، نزدیک‌ترین مهلت رسیدگی و سپس بدون مهلت.
        جابجایی، پرونده را برای انجام اقدام معتبر باز می‌کند؛ ثبت مرحله پس از
        تکمیل الزامات انجام می‌شود.
      </p>
      {error && (
        <p role="alert" className="alert error">
          {error}
        </p>
      )}
      <div className="kanban-scroll-controls" role="group" aria-label="جابه‌جایی افقی کاریز" dir="ltr">
        <button className="secondary" aria-label="حرکت کاریز به چپ" title="حرکت به چپ" aria-controls={boardId} disabled={!scrollable.left} onClick={()=>move(-1)}><ArrowLeft size={18}/></button>
        <span dir="rtl">حرکت بین مراحل</span>
        <button className="secondary" aria-label="حرکت کاریز به راست" title="حرکت به راست" aria-controls={boardId} disabled={!scrollable.right} onClick={()=>move(1)}><ArrowRight size={18}/></button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragEnd={({ active, over }) => {
          if (!over) return;
          const row = rows.find((x) => x.id === active.id);
          const target = over.id;
          if (!row || target === pipelineStage(db,actorId,page,row)) return;
          if (!transitionFor(page, row, target)) {
            setError(
              "این انتقال مستقیم مجاز نیست؛ اقدام بعدی پرونده را انجام دهید.",
            );
            return;
          }
          setError("");
          nav(pipelineRoute(page, row, db, target,actorId));
        }}
      >
        <div className="kanban" id={boardId} ref={scrollRef} role="region" aria-label="ستون‌های کاریز" tabIndex={0} onKeyDown={event=>{
          if(event.target!==event.currentTarget||!['ArrowLeft','ArrowRight'].includes(event.key))return;
          event.preventDefault();move(event.key==='ArrowLeft'?-1:1);
        }}>
          {stages.map((stage) => (
            <Column
              key={stage}
              stage={stage}
              rows={rows.filter((r) => pipelineStage(db,actorId,page,r) === stage)}
              page={page}
              db={db}
              actorId={actorId}
            />
          ))}
        </div>
      </DndContext>
    </>
  );
}
