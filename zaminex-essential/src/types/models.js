/**
 * Mock CRM record contracts. IDs reference shared store collections.
 * All money amounts are integer toman; timestamps are ISO 8601.
 * Scope memberships define team access; User.group_ids define capabilities.
 * These frontend contracts do not prescribe a production database schema.
 *
 * @typedef {{id:string,username:string,is_active:boolean,group_ids:string[]}} User
 * @typedef {{id:string,code:string,name:string,permission_codes:string[]}} Group
 * @typedef {{id:string,user_id:string,full_name:string,mobile:string,avatar:?string,hired_at:string,notes:string}} StaffProfile
 * @typedef {{id:string,name:string,code:string,description:string,is_active:boolean,created_by_id:string}} ManagementScope
 * @typedef {{id:string,scope_id:string,user_id:string,membership_role:'MANAGER'|'CONSULTANT',joined_at:string,left_at:?string,assigned_by_id:string}} ScopeMembership
 * @typedef {{subject_type:'follow_up',subject_id:string}|{subject_type:'registration_request',subject_id:string}|{subject_type:'property',subject_id:string}|{subject_type:'listing',subject_id:string}|{subject_type:'inquiry',subject_id:string}|{subject_type:'introduction',subject_id:string}|{subject_type:'viewing',subject_id:string}|{subject_type:'deal',subject_id:string}|{subject_type:'contract',subject_id:string}|{subject_type:'commission',subject_id:string}|{subject_type:'payment',subject_id:string}} SubjectReference
 * @typedef {SubjectReference & {id:string,title:string,assigned_to_id:string,due_at:string,status:string,generation_key:?string}} Task
 * @typedef {SubjectReference & {id:string,contact_id:string,consultant_id:string,scheduled_at:string,status:string,notes:string}} FollowUp
 */
export const subjectCollections = {
  follow_up: "followUps",
  registration_request: "registrationRequests",
  property: "properties",
  listing: "listings",
  inquiry: "inquiries",
  introduction: "introductions",
  viewing: "viewings",
  deal: "deals",
  contract: "contracts",
  commission: "commissions",
  payment: "payments",
};
export function isValidSubject(data, subject) {
  const collection = subjectCollections[subject.subject_type];
  return Boolean(
    collection &&
    data[collection]?.some((record) => record.id === subject.subject_id),
  );
}
