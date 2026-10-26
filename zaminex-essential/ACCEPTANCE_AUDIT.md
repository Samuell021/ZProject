# Original-scope acceptance audit

Read-only source audit, 2026-10-18. Governing scope: `/home/sajjad/.codex/attachments/fa4b48a5-57bf-4742-be67-b531cded99ec/Pasted text.txt` (sections 1–25). The proposal is supplementary; backend, real payment, SMS, real authentication and production security are expressly outside this delivery. “Done” below means the requested implementation is present in the inspected source, not that every permutation has been browser-verified.

Graphify query was used for navigation. Existing VERIFICATION.md records successful build/service/browser checks; those checks do not establish all original requirements. This audit ran only small in-memory service reproductions and seed counts, with no browser suite or source edits. References are relative to Sample and refer to the inspected snapshot; concurrent parent fixes may shift lines.

## Ranked findings (maximum six)

1. **Resolved in subsequent implementation — Case timeline omits the explicit assignment/review/transfer/stage records and linked workflow operations.** `src/components/ui.jsx:192–214` renders only `activityLogs` whose exact `subject_id` equals the detail ID; `src/App.jsx:1280–1282` passes only that ID. For example review approval writes request stage history but the generic activity result belongs to the listing (`src/services/operations.js:950–1000`, `2016–2025`), so the request timeline misses that approval/completion event. Seed assignment `ah1` for `r2` is separate (`src/mock/seed.js:836–850`) and its previous/new assignees never appear in Timeline. Expected: timeline shows actor, previous/new assignment or stage, reason, review decision and operation linkage, including associated request/property/listing changes within permitted access. This is a gap in original section 18 even though history arrays exist.

2. **Resolved in subsequent implementation — Date entry does not satisfy “dates in UI are Jalali”.** Display formatting uses `fa-IR` (`src/components/ui.jsx:5–10`) and the visit calendar is Persian, but the shared Field renders raw native inputs (`78–129`) and primary request/visit/follow-up forms use `type="datetime-local"` (for example `src/App.jsx:1579–1585`, `2026–2031`, `2107–2111`; `src/features/SecondaryPages.jsx:760–765`). There is no Jalali input conversion/control, so the entry UI is browser Gregorian rather than a Persian calendar. Expected: meaningful Jalali date entry while stored values remain ISO.

3. **Resolved in subsequent implementation — Range page lacks the requested range-specific request/file presentation.** `src/features/SecondaryPages.jsx:81–150` displays members and two counts (requests and properties); its only records link goes to the unfiltered `/requests`. It shows no listings/files or range-specific request rows. Expected original section 6: manager, active/former members, requests, files and team statistics within that range, with working scoped links.

4. **Resolved through contextual developer guide — Structure guide documents only a subset of the requested entities.** `src/features/SecondaryPages.jsx:1021–1088` defines only 12 model entries. User/Group/StaffProfile, scope/membership, transfer/assignment history, registration request, appraisal, offer, review, contract party/signature/amendment, commission policy/share, payment, notification and activity/history responsibilities/fields are absent from these entries. The general workflow explanations (`1113–1207`) do not supply those model contracts or per-operation record effects. Expected original section 4: each entity's responsibility, relationships and stored information, and a clear record-change explanation for operations. The present diagram and scenario are useful but incomplete.

## Coverage against the 25 original sections

| # | Section | Status | Evidence / remaining boundary |
|---|---|---|---|
| 1 | Three connected product cycles | Done | `src/services/operations.js:729–1835` connects request/property/listing, inquiry/introduction/viewing, deal/contract/finance by IDs. Task lifecycle fixes were independently rechecked in memory. |
| 2 | Technology, separation, shared/versioned persistence | Done | `package.json:1`; `src/store/useCRM.js:1–99`; `src/mock/seed.js:1–80`. React/Vite/Router/Tailwind/DnD/Lucide/Zustand present; confirmation UI at `src/App.jsx:1336–1345`. |
| 3 | Persian/RTL/readable responsive daily UI | Partial | Persian display helpers `src/components/ui.jsx:3–15`; mobile verification documented in VERIFICATION.md. Native Gregorian entry remains finding 2. No fresh visual sweep performed. |
| 4 | Complete conceptual guide | Partial | Guide/diagram/scenario at `src/features/SecondaryPages.jsx:1021–1207`; missing entities/effects in finding 4. |
| 5 | Users/groups/StaffProfile/demo login | Done | `src/mock/seed.js:14–33,82–160`; selector in `src/App.jsx`; contracts in `src/types/models.js:7–11`. No parallel User.role. |
| 6 | Scope/membership and range page | Partial | Membership history and team cards at `src/features/SecondaryPages.jsx:81–150`; missing per-range records/files in finding 3. |
| 7 | Scope transfer vs assignee vs staff membership | Done | Distinct `transferScope`, `changeAssignee`, `changeMembership` at `src/services/operations.js:1003–1093`; immutable append histories at `661–698`. |
| 8 | Contacts/phones/ownership and related records | Done | `src/App.jsx:900–992`; canonical duplicate detection and creation at `src/services/operations.js:1–11,701–728`; related contract contact access at `127–220`. |
| 9 | Minimal registration request and assignment | Done | `src/services/operations.js:729–791`; creation and assignment forms in `src/App.jsx:1350–1418,1589–1638`. |
| 10 | Continuous appraisal/property/listing/review | Done | `src/services/operations.js:771–1001`; workspace form `src/App.jsx:1640–1988`; stale review/version guards `950–962`. |
| 11 | Six transaction behaviors and immutable versions | Done | Validation `src/services/operations.js:505–608`; version creation `1883–1943`; version form `src/features/SecondaryPages.jsx:970–1019`. Fixed behavior families, no arbitrary formula engine. |
| 12 | Inquiry/preferences/necessary-condition matching | Done | `src/services/operations.js:278–345,1095–1138`; inquiry form `src/App.jsx:1420–1587`, matching detail `1060–1140`. |
| 13 | Explicit introductions, results and customer visits | Done | `src/services/operations.js:1139–1233`; generated task deadline/completion was fixed and rechecked. |
| 14 | Tasks, follow-ups, postponement and typed subjects | Partial | Tasks/results `src/features/SecondaryPages.jsx:202–301,746–787`; service `1230–1286`. Task deadlines/completion and submitted next action/date were fixed and rechecked. Subject contract is JS JSDoc (`src/types/models.js:12–34`), not literal TypeScript as section 14 requests, although runtime validation exists and the overall project explicitly requests JavaScript. |
| 15 | Deals/participants/immutable offers | Done | `src/services/operations.js:1289–1406`; prior offers preserved and accepted offer does not itself close property/listing. |
| 16 | Contracts/parties/signatures/attachments/amendments | Done | `src/services/operations.js:1407–1630`; display and local-only attachment UI `src/App.jsx:1200–1277`. No real signing/upload promised. |
| 17 | Distinct commission/receipts/shares/payouts/reversals | Done | `src/services/operations.js:1632–1882`; distinct balances and allocations `src/features/SecondaryPages.jsx:390–543`; capped allocations/reversal path present. |
| 18 | Full timeline/history/notifications | Partial | Arrays and operation IDs exist (`src/services/operations.js:439–472,661–684,2016–2025`), but timeline rendering misses them (finding 1). |
| 19 | Requested pages, links and recoverable forms | Done | Navigation/mapping `src/App.jsx:54–86`; operational detail/action routes; secondary views `src/features/SecondaryPages.jsx:43–969`. Existing browser coverage reported; this audit did not rerun every URL. |
| 20 | Three shared-data kanbans and guarded transition | Partial | `src/components/Board.jsx:12–158`: three boards, owner/team/stage/time/action, action navigation. No explicit missing-information warning on cards; overdue is only a CSS class at `65–70`. Valid transitions occur through detail actions, not direct drag mutation. |
| 21 | Mock service atomicity/permissions/loading/failure/history | Done | Cloned transaction + authorization `src/services/operations.js:346–425`; controlled delay/failure/persistence `src/store/useCRM.js:73–97`. Dependent task date/completion fixes are now present. |
| 22 | Shared meaningful seed counts and special cases | Done | In-memory `createSeed()` count check: 8 users, 3 scopes, 20 contacts, 15 requests, 12 properties, 15 listings, 10 inquiries, 15 introductions, 8 viewings, 6 deals/12 offers, 3 contracts. Histories and partial money records exist; `src/mock/seed.js:36–80,836–886`. |
| 23 | Service and direct-URL demo access | Done | Access helper `src/services/operations.js:127–228`, operation `access` at `395–401`; direct detail gating in App. Parent's latest contract-related contact access verification is separate from this audit. Frontend controls only. |
| 24 | Entire acceptance scenario plus consistency | Partial | Existing end-to-end evidence in VERIFICATION.md covers main path; the incomplete case timeline prevents claiming every required related history view is complete. No backend dependency required. |
| 25 | Runnable delivery/instructions/users/scenario/honest limits | Partial | README.md provides run command, users, scenario and frontend boundaries; VERIFICATION.md records checks. Full completion claim must remain qualified until outstanding findings are resolved and targeted verification recorded. |

No top-level section is wholly missing. That is not a claim of full acceptance: the partial sections above contain explicit scope gaps or reproduced behavior failures. 

## Issues found and resolved during this audit

Parent corrected generated visit/follow-up task deadlines to use scheduled_at, closes linked active tasks with completed_at when the event is completed, and persists follow-up next_action/next_action_at with pair validation. Source verified at `src/services/operations.js:488–509,1222–1233,1280–1297`; follow_up was added to the valid subject contract (`src/types/models.js:12–17`). A second independent in-memory reproduction confirmed the 2030 scheduled task keeps its 2030 date, becomes COMPLETED with the follow-up, and the submitted next action/date survive. Parent reports 26 passing service tests; related workflow tasks also cannot be independently marked complete without a recorded event result. These are resolved, not remaining ranked findings. No browser suite was rerun by this auditor.

## Subsequent remediation evidence

Timeline finding 1 resolved: src/services/timeline.js builds a bounded, permission-checked dossier view from activity, assignment, transfer, review, stage and rescheduling sources. src/components/ui.jsx renders the normalized events, and App passes the actor and collection. timeline.test.js and tests/timeline.spec.js verify shared-case histories and privacy, including absence of timeline on a public-only listing. New review submission/decision events carry operation IDs.

Range finding 3 resolved: SecondaryPages now lists each team's requests and listings with scoped links. App applies scope query filtering to the same rows used by the list and kanban; tests/scope-views.spec.js verifies the links, selected scope and refresh behavior. The historical observations above refer to the prior snapshot. Date entry, complete guide documentation and kanban missing-data warning remain open.

## Developer guide and kanban remediation

Finding 4 is resolved by the contextual DeveloperGuide, linked from every section and its forms: 48 model/table contracts (all original model fields plus normalized joins/lookups), 71 proposed API contracts, database/authorization/transaction rules and per-pipeline transition matrices. BACKEND_REFERENCE.md is generated from the same metadata. References are proposals, not deployed endpoints.

The card warning gap in section 20 is resolved by pipelineWarnings and visible warnings. /pipelines exposes all three boards; invalid drops are rejected and valid drops open required forms. tests/developer-guide.spec.js and tests/pipeline-ui.spec.js verify guide presence, parent/child URL persistence, download, drag rejection, valid form routing and matching via an ordinary button. The date-entry finding remains open.

## Final remediation status — 2026-10-18

All four ranked findings above are resolved in the current implementation. The historical coverage table records the earlier audit snapshot. Sections 3, 4, 6, 18, 20, 24 and 25 now have their identified gaps addressed by the remediation evidence above. Section 14 intentionally uses JavaScript plus a JSDoc discriminated subject contract and runtime validation, consistent with the user’s JavaScript technology choice; it does not deliver a TypeScript source file.

Date entry uses JalaliDateInput for every shared date/datetime Field. jalali-date.test.js checks known Gregorian/Jalali pairs, Persian/Arabic digits, invalid days and leap years, and Tehran time conversion. tests/jalali-entry.spec.js proves invalid entry cannot submit and that a New York browser stores Tehran 10:00 as 06:30Z. The full previous 19-browser suite passed again, including all six transaction workflows, guide and kanban tests. Together with the new browser test: 20 browser checks, 34 service checks, successful production build.

The delivered scope remains a local mock application and proposed backend contracts. Real backend, database migrations, authentication, SMS, payment and production security are outside this sample.
