import { canAccess, subjectCollection } from "./operations.js";
const subjects = {
  registration_request_id: "registrationRequests",
  property_id: "properties",
  listing_id: "listings",
  inquiry_id: "inquiries",
  deal_id: "deals",
};
/** Build a bounded dossier view. Operation IDs label events, never grant access. */
export function timelineEntries(db, actorId, collection, id) {
  const root = db[collection]?.find((r) => r.id === id);
  if (!root || !canAccess(db, actorId, collection, root)) return [];
  const included = new Map();
  const key = (c, id) => `${c}:${id}`;
  const add = (c, id) => {
    const record = db[c]?.find((r) => r.id === id);
    if (record && canAccess(db, actorId, c, record))
      included.set(key(c, id), { collection: c, record });
  };
  const has = (c, id) => included.has(key(c, id));
  add(collection, id);
  const propertyCase = (propertyId) => {
    if (!propertyId) return;
    add("properties", propertyId);
    db.registrationRequests
      .filter((r) => r.resulting_property_id === propertyId)
      .forEach((r) => add("registrationRequests", r.id));
    db.listings
      .filter((l) => l.property_id === propertyId)
      .forEach((l) => add("listings", l.id));
  };
  if (collection === "registrationRequests")
    propertyCase(root.resulting_property_id);
  if (collection === "properties") propertyCase(root.id);
  if (collection === "listings") propertyCase(root.property_id);
  if (collection === "contacts") {
    db.registrationRequests
      .filter((r) => r.contact_id === id)
      .forEach((r) => {
        add("registrationRequests", r.id);
        if (has("registrationRequests", r.id))
          propertyCase(r.resulting_property_id);
      });
    db.propertyContacts
      .filter((r) => r.contact_id === id)
      .forEach((r) => {
        if (
          canAccess(
            db,
            actorId,
            "properties",
            db.properties.find((p) => p.id === r.property_id),
          )
        )
          propertyCase(r.property_id);
      });
    db.inquiries
      .filter((r) => r.contact_id === id)
      .forEach((r) => add("inquiries", r.id));
    db.dealParticipants
      .filter((r) => r.contact_id === id)
      .forEach((r) => add("deals", r.deal_id));
    db.contractParties
      .filter((r) => r.contact_id === id)
      .forEach((r) => add("contracts", r.contract_id));
  }
  // Expand forward from known subjects, without walking into other customers via a listing.
  db.introductions
    .filter((r) => has("inquiries", r.inquiry_id))
    .forEach((r) => add("introductions", r.id));
  db.viewings
    .filter((r) => has("introductions", r.introduction_id))
    .forEach((r) => add("viewings", r.id));
  db.deals
    .filter(
      (r) =>
        has("inquiries", r.inquiry_id) ||
        has("listings", r.listing_id) ||
        (collection === "introductions" &&
          r.inquiry_id === root.inquiry_id &&
          r.listing_id === root.listing_id),
    )
    .forEach((r) => add("deals", r.id));
  if (collection === "contracts") add("deals", root.deal_id);
  db.offers
    .filter((r) => has("deals", r.deal_id))
    .forEach((r) => add("offers", r.id));
  db.contracts
    .filter((r) => has("deals", r.deal_id))
    .forEach((r) => add("contracts", r.id));
  for (const c of ["followUps", "tasks"])
    for (const r of db[c] || [])
      if (has(subjectCollection(r.subject_type), r.subject_id)) add(c, r.id);
  const entries = [];
  const push = (kind, r, fields) =>
    entries.push({ id: `${kind}:${r.id}`, source_id: r.id, kind, ...fields });
  for (const r of db.activityLogs)
    if (has(subjectCollection(r.subject_type), r.subject_id))
      push("activity", r, {
        description: r.description,
        actor_id: r.user_id,
        occurred_at: r.created_at,
        operation_id: r.operation_id,
      });
  for (const r of db.stageHistory)
    if (has(subjectCollection(r.subject_type), r.subject_id))
      push("stage", r, {
        description: "تغییر مرحله",
        actor_id: r.changed_by_id,
        occurred_at: r.changed_at,
        operation_id: r.operation_id,
        from_stage: r.from_stage,
        to_stage: r.to_stage,
        reason: r.reason,
      });
  for (const r of db.assignmentHistory)
    if (
      Object.entries(subjects).some(
        ([field, c]) => r[field] && has(c, r[field]),
      )
    )
      push("assignment", r, {
        description: "تغییر مشاور مسئول",
        actor_id: r.assigned_by_id,
        occurred_at: r.assigned_at,
        operation_id: r.operation_id,
        previous_assignee_id: r.previous_assignee_id,
        new_assignee_id: r.new_assignee_id,
        reason: r.reason,
      });
  for (const r of db.transferHistory)
    if (
      Object.entries(subjects).some(
        ([field, c]) => r[field] && has(c, r[field]),
      )
    )
      push("transfer", r, {
        description: "انتقال پرونده بین رنج‌ها",
        actor_id: r.transferred_by_id,
        occurred_at: r.transferred_at,
        operation_id: r.operation_id,
        from_scope_id: r.from_scope_id,
        to_scope_id: r.to_scope_id,
        reason: r.reason,
      });
  for (const r of db.listingReviews)
    if (has("listings", r.listing_id)) {
      push("submission", r, {
        description: "ارسال نسخه برای بررسی مدیر",
        actor_id: r.submitted_by_id,
        occurred_at: r.submitted_at,
        operation_id: r.submitted_operation_id,
        submitted_version: r.submitted_version,
      });
      if (r.reviewed_at)
        push("review", r, {
          description: "نتیجه بررسی مدیر",
          actor_id: r.reviewed_by_id,
          occurred_at: r.reviewed_at,
          operation_id: r.reviewed_operation_id,
          decision: r.decision,
          reason: r.reason,
        });
    }
  for (const r of db.rescheduleHistory) {
    if (!has("followUps",r.followup_id) && !(r.subject_id && has(subjectCollection(r.subject_type),r.subject_id))) continue;
    const extension = r.request_kind === "ASSIGNMENT_EXTENSION";
    push("reschedule",r,{
      description:extension ? "درخواست تمدید مهلت" : r.subject_id ? "تعویق موعد رسیدگی پرونده" : "تعویق پیگیری",
      actor_id:r.requested_by_id || r.changed_by_id, occurred_at:r.requested_at || r.changed_at,
      operation_id:r.operation_id, reason:r.reason,
      previous_scheduled_at:r.previous_scheduled_at || r.old_scheduled_at,
      new_scheduled_at:extension ? r.requested_due_at || r.new_scheduled_at : r.new_scheduled_at,
      decision:extension && r.status === "PENDING" ? "PENDING" : undefined,
    });
    if(extension && r.decided_at) push("reschedule_decision",r,{
      description:r.status === "APPROVED" ? "تأیید تمدید مهلت" : r.status === "REJECTED" ? "رد درخواست تمدید" : "لغو درخواست تمدید",
      actor_id:r.decided_by_id,occurred_at:r.decided_at,operation_id:r.decision_operation_id,
      reason:r.decision_reason,decision:r.status,previous_scheduled_at:r.old_scheduled_at,new_scheduled_at:r.new_scheduled_at,
    });
  }
  return entries.sort(
    (a, b) =>
      (Date.parse(b.occurred_at) || 0) - (Date.parse(a.occurred_at) || 0) ||
      a.id.localeCompare(b.id),
  );
}
