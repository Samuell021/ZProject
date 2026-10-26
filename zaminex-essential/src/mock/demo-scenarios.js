// Deliberate demo stories. IDs are stable; timestamps are relative to opening the demo.
export function buildDemoScenarios(db,{date,scope,agent}) {
 const contact=id=>db.contacts.find(c=>c.id===id);
 const full=id=>{const c=contact(id);return `${c.first_name} ${c.last_name}`;};
 const manager=s=>s==='s2'?'u3':'u2';
 const copy=x=>JSON.parse(JSON.stringify(x));
 const oldListings=db.listings;
 const requestStates=['COMPLETED','COMPLETED','COMPLETED','COMPLETED','COMPLETED','COMPLETED','COMPLETED','COMPLETED','PENDING_REVIEW','CHANGES_REQUIRED','IN_PROGRESS','ASSIGNED','NEW','CANCELLED','DUPLICATE','NEW','NEW','ASSIGNED'];
 db.registrationRequests=requestStates.map((status,i)=>{
  const n=i+1,s=scope(n),assigned=[13,14,15,16,17].includes(n)?null:agent(n);
  const newLead=[13,17].includes(n);
  const description=n===18?'مشاور به دلیل تداخل بازدیدها درخواست انصراف داده است؛ تصمیم مدیر هنوز ثبت نشده.':n===9?'گزارش کارشناسی تکمیل و برای تأیید مدیر ارسال شده است.':n===10?'عکس پارکینگ باید تکمیل شود؛ پس از اصلاح دوباره برای مدیر ارسال کنید.':n===11?'بازدید کارشناسی هماهنگ شده؛ مشخصات و عکس‌های ملک را تکمیل کنید.':n===12?'در انتظار پذیرش ارجاع توسط مشاور مسئول.':n===13||n===17?'درخواست مالک ثبت شده و منتظر پذیرش مدیر رنج است.':n===16?'پذیرش اولیه انجام شده؛ مدیر رنج باید مشاور مسئول را انتخاب کند.':status==='COMPLETED'?'ملک تأیید شده و فایل عرضه آن در دسترس است.':status==='CANCELLED'?'مالک از ادامه ثبت ملک منصرف شده است.':'این درخواست با پرونده R-1002 تکراری است.';
  return {id:`r${n}`,code:`R-${1000+n}`,contact_id:`c${n}`,initial_contact_name:full(`c${n}`),initial_contact_phone:db.contactPhones.find(p=>p.contact_id===`c${n}`).phone_number,source:n%2?'WALK_IN':'PHONE',source_details:'مراجعه مستقیم به دفتر',district_id:`district${i%5+1}`,approximate_address:`تهران، ${db.districts[i%5].name}`,property_type_id:'apartment',requested_deal_type_ids:[db.dealTypes[i%6].id],description,management_scope_id:s,assigned_to_id:assigned,priority:n===10?'HIGH':'NORMAL',due_at:assigned?date(n===10?-1:2):null,status,resulting_property_id:n<=11?`p${n}`:null,created_by_id:newLead?(s==='s2'?'u6':'u4'):manager(s),created_at:date(-35),lead_status:newLead?'NEW':'ACCEPTED',lead_accepted_by_id:newLead?null:manager(s),lead_accepted_at:newLead?null:date(-34),acceptance_status:assigned?([12,18].includes(n)?'PENDING':'ACCEPTED'):null,assigned_at:assigned?date([12,18].includes(n)?0:-33):null,accepted_at:assigned&&![12,18].includes(n)?date(-32):null,closed_at:['COMPLETED','CANCELLED','DUPLICATE'].includes(status)?date(-20):null,closure_reason:['CANCELLED','DUPLICATE'].includes(status)?description:null,duplicate_of_id:n===15?'r2':null};
 });
 const withdrawalProperty=db.registrationRequests.find(r=>r.id==='r18');Object.assign(withdrawalProperty,{management_scope_id:'s1',assigned_to_id:'u5',created_by_id:'u2',lead_accepted_by_id:'u2'});
 const duplicate=db.registrationRequests.find(r=>r.id==='r15'),original=db.registrationRequests.find(r=>r.id==='r2');
 for(const key of ['contact_id','initial_contact_name','initial_contact_phone','district_id','approximate_address','requested_deal_type_ids'])duplicate[key]=copy(original[key]);
 db.properties=db.properties.filter(p=>Number(p.id.slice(1))<=11);
 db.propertyContacts=db.propertyContacts.filter(p=>db.properties.some(x=>x.id===p.property_id));
 db.properties.forEach((p,i)=>{
  p.review_status=i<8?'APPROVED':i===8?'PENDING':i===9?'CHANGES_REQUIRED':'DRAFT';p.record_status='ACTIVE';
  p.created_at=date(-31);p.review_submitted_version=i===8?1:null;p.review_requested_at=i===8?date(-2):null;p.approved_by_id=i<8?manager(p.management_scope_id):null;p.approved_at=i<8?date(-21):null;
  p.description=`${p.area} متر، ${p.rooms} اتاق؛ پارکینگ و آسانسور. ${i===9?'عکس پارکینگ نیاز به تکمیل دارد.':'اطلاعات اولیه با مالک تطبیق داده شده است.'}`;
 });
 db.appraisals=db.properties.map((p,i)=>({id:`ap${i+1}`,registration_request_id:`r${i+1}`,property_id:p.id,appraiser_id:p.consultant_id,scheduled_at:date(i<10?-25:1),performed_at:i<10?date(-24):null,status:i<10?'COMPLETED':'SCHEDULED',findings:i<10?'متراژ، اتاق‌ها و موقعیت ملک در محل بررسی شد. مدارک مالکیت برای تأیید مدیر آماده است.':'',valuation_notes:'',report_attachments:[],completed_at:i<10?date(-24):null}));
 for(const p of db.properties){
  const appraisal=db.appraisals.find(a=>a.property_id===p.id),pending=p.review_status==='PENDING',approved=p.review_status==='APPROVED';
  p.record_status=approved?'ACTIVE':'DRAFT';p.review_submitted_version=p.review_status==='DRAFT'?null:p.version;
  p.review_reason=p.review_status==='CHANGES_REQUIRED'?'عکس پارکینگ را تکمیل کنید.':'';
  p.reviewed_at=approved?date(-21):p.review_status==='CHANGES_REQUIRED'?date(-1):null;p.reviewed_by_id=p.reviewed_at?manager(p.management_scope_id):null;
  p.review_history=p.review_status==='DRAFT'?[]:[{submitted_at:pending?date(-2):date(-23),submitted_by_id:p.consultant_id,version:p.version,decision:p.review_status,reviewed_at:p.reviewed_at,reviewed_by_id:p.reviewed_by_id,reason:p.review_reason,snapshot:copy(p),appraisal_snapshot:copy(appraisal)}];
 }
 // Only approved properties have supply files. A property can have two independent deal types.
 db.listings=oldListings.filter(l=>[1,2,3,4,5,6,7,8,13,14,15].includes(Number(l.id.slice(1))));
 for(const l of db.listings){
  if(l.id==='l13')l.property_id='p2';if(l.id==='l14')l.property_id='p7';if(l.id==='l15')l.property_id='p6';
  const p=db.properties.find(p=>p.id===l.property_id),r=db.registrationRequests.find(r=>r.resulting_property_id===p.id);
  Object.assign(l,{registration_request_id:r.id,assigned_to_id:p.consultant_id,created_by_id:p.consultant_id,title:`${db.dealTypes.find(t=>t.id===l.deal_type_id).name} ${p.title}`,review_status:'APPROVED',status:l.id==='l1'?'CLOSED':'ACTIVE',review_requested_at:date(-23),approved_by_id:manager(p.management_scope_id),approved_at:date(-21),created_at:date(-20),rejection_reason:null,closed_at:l.id==='l1'?date(-2):null,closure_reason:l.id==='l1'?'قرارداد فروش همین ملک قطعی شده است.':null});
  l.terms_snapshot={deal_type_id:l.deal_type_id,sale_price:l.sale_price,deposit:l.deposit,monthly_rent:l.monthly_rent,additional_terms:copy(l.additional_terms)};
 }
 db.listingReviews=db.listings.map((l,i)=>({id:`lr${i+1}`,listing_id:l.id,submitted_by_id:l.assigned_to_id,submitted_at:date(-23),submitted_version:1,submitted_snapshot:copy(l),reviewed_by_id:l.approved_by_id,reviewed_at:date(-21),decision:'APPROVED',reason:''}));
 const stories=[
  ['COMPLETED','sale','قرارداد فروش قطعی شده است.'],['SEARCHING','rent','مذاکره قبلی ناموفق بود؛ فایل اجاره دیگری معرفی کنید.'],['INTRODUCED','mortgage','قرارداد رهن کامل در انتظار امضای طرفین است.'],['NEGOTIATION','presale','توافق اولیه ثبت شده؛ مدیرکل باید قرارداد را تنظیم کند.'],['NEGOTIATION','partnership','مذاکره درباره سهم مالک و سازنده در جریان است.'],['SEARCHING','exchange','مذاکره معاوضه بدون توافق بسته شده؛ گزینه دیگری بررسی شود.'],['VIEWING','sale','زمان بازدید ثبت شده و نتیجه هنوز مشخص نیست.'],['VIEWING','rent','بازدید مثبت ثبت شده؛ برای شروع مذاکره همین بازدید را انتخاب کنید.'],['SEARCHING','sale','نیاز تکمیل شده؛ هنوز هیچ فایلی معرفی نشده است.'],['INTRODUCED','sale','دو فایل معرفی شده‌اند؛ متقاضی باید مورد بازدید را انتخاب کند.'],['SEARCHING','rent','نیاز و بودجه هنوز باید توسط مشاور تکمیل شود.'],['ASSIGNED','sale','مشاور باید ارجاع درخواست را بپذیرد.'],['NEW','sale','ثبت اولیه انجام شده؛ منتظر پذیرش مدیر رنج.'],['NEW','rent','پذیرش مدیر انجام شده؛ منتظر انتخاب مشاور.'],['SEARCHING','sale','بازدید انجام شد ولی متقاضی نپسندید؛ معرفی فایل دیگری لازم است.'],['CANCELLED','rent','متقاضی فعلاً از جست‌وجوی ملک منصرف شده است.'],['NEGOTIATION','sale','پرونده مشترک دو مشاور: مشاور متقاضی رضا حسینی و مشاور ملک سارا محمدی.'],
  ['SEARCHING','rent','مشاور پس از پذیرش، به علت تداخل مأموریت درخواست انصراف داده است؛ منتظر تأیید مدیر.'],
  ['NEW','sale','انصراف مشاور قبلی تأیید شده است؛ مدیر باید در همین پرونده مشاور جدید تعیین کند.'],
  ['SEARCHING','rent','درخواست انصراف تأیید نشد؛ رضا حسینی همچنان مسئول رسیدگی است.']
 ];
 db.inquiries=stories.map(([status,type,notes],i)=>{
  const n=i+1,s=n===17?'s1':scope(n),assigned=[13,14,19].includes(n)?null:n===17?'u5':agent(n),cid=`c${18+n}`;
  const draft=n>=11&&n<=14;
  return {id:`i${n}`,code:`I-${1000+n}`,contact_id:cid,initial_contact_name:full(cid),initial_contact_phone:db.contactPhones.find(p=>p.contact_id===cid).phone_number,management_scope_id:s,assigned_to_id:assigned,created_by_id:n===13?'u4':manager(s),created_at:date(-18),lead_status:n===13?'NEW':'ACCEPTED',lead_accepted_by_id:n===13?null:manager(s),lead_accepted_at:n===13?null:date(-17),acceptance_status:n===19?'REJECTED':assigned?(n===12?'PENDING':'ACCEPTED'):null,assigned_at:assigned?date(n===12?0:-16):null,accepted_at:assigned&&n!==12?date(-15):null,needs_status:draft?'DRAFT':'CONFIRMED',needs_confirmed_at:draft?null:date(-14),district_ids:db.districts.map(d=>d.id),property_type_ids:['apartment'],min_area:70,max_area:250,min_rooms:2,priority:n===4||n===17?'HIGH':'NORMAL',status,notes,description:notes,next_action:notes,next_action_at:[1,16].includes(n)?null:date(n===7?1:2),closed_at:[1,16].includes(n)?date(-2):null,closure_reason:n===1?'قرارداد قطعی شد.':n===16?'انصراف متقاضی':null};
 });
 db.inquiryPreferences=stories.map(([,deal_type_id],i)=>({id:`ip${i+1}`,inquiry_id:`i${i+1}`,deal_type_id,min_sale_price:0,max_sale_price:['sale','presale'].includes(deal_type_id)?25000000000:0,min_deposit:0,max_deposit:['rent','mortgage'].includes(deal_type_id)?4000000000:0,min_monthly_rent:0,max_monthly_rent:deal_type_id==='rent'?100000000:0,additional_terms:{}}));
 db.inquiryCriteria=[{id:'ic1',inquiry_id:'i9',attribute_code:'parking',operator:'EQUALS',value:true,is_required:true}];
 const pairs=[[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[10,7],[10,13],[15,7],[17,7]];
 db.introductions=pairs.map(([inq,listing],i)=>{
  const q=db.inquiries.find(q=>q.id===`i${inq}`),l=db.listings.find(l=>l.id===`l${listing}`);
  return {id:`intro${i+1}`,inquiry_id:q.id,listing_id:l.id,buyer_consultant_id:q.assigned_to_id,seller_consultant_id:l.assigned_to_id,introduced_by_id:q.assigned_to_id,introduced_at:date(-12),channel:'PHONE',status:inq===10?'INTRODUCED':inq===7?'VIEWING_SCHEDULED':'VIEWED',feedback:inq===10?'اطلاعات فایل برای متقاضی توضیح داده شد؛ هنوز زمان بازدید تعیین نشده است.':'',rejection_reason:null,introduced_terms_snapshot:copy(l),next_action:inq===10?'انتخاب برای بازدید':null,next_action_at:inq===10?date(1):null};
 });
 db.viewings=db.introductions.filter(i=>i.inquiry_id!=='i10').map((intro,i)=>{
  const pending=intro.inquiry_id==='i7',negative=intro.inquiry_id==='i15';
  return {id:`v${i+1}`,introduction_id:intro.id,consultant_id:intro.buyer_consultant_id,scheduled_at:pending?date(1):date(-10),performed_at:pending?null:date(-10,1),status:pending?'SCHEDULED':'COMPLETED',interest:pending?null:negative?'NOT_INTERESTED':'INTERESTED',outcome:pending?null:negative?'متقاضی نور واحد را مناسب ندانست.':'بازدید انجام شد و متقاضی مایل به مذاکره است.',customer_feedback:pending?'':negative?'تمایلی به ادامه این فایل ندارد.':'موقعیت و امکانات مورد تأیید متقاضی است.',cancellation_reason:null};
 });
 const dealSpecs=[[1,'FINALIZED'],[2,'LOST'],[3,'CONTRACT'],[4,'AGREED'],[5,'NEGOTIATION'],[6,'LOST'],[17,'NEGOTIATION']];
 db.deals=dealSpecs.map(([n,stage],i)=>{
  const q=db.inquiries.find(q=>q.id===`i${n}`),intro=db.introductions.find(x=>x.inquiry_id===q.id),v=db.viewings.find(v=>v.introduction_id===intro.id),l=db.listings.find(l=>l.id===intro.listing_id);
  return {id:`d${i+1}`,code:`D-${1001+i}`,listing_id:l.id,inquiry_id:q.id,introduction_id:intro.id,viewing_id:v.id,assigned_to_id:q.assigned_to_id,buyer_consultant_id:intro.buyer_consultant_id,seller_consultant_id:intro.seller_consultant_id,management_scope_id:q.management_scope_id,deal_type_version_id:l.deal_type_version_id,stage,accepted_offer_id:null,started_at:date(-8),created_at:date(-8),closed_at:['FINALIZED','LOST'].includes(stage)?date(-2):null,closure_reason:stage==='LOST'?'طرفین درباره شرایط مالی به توافق نرسیدند.':null,result_notes:['AGREED','CONTRACT','FINALIZED'].includes(stage)?'طرفین بر شرایط اولیه توافق کردند؛ ثبت شرایط قطعی در قرارداد انجام می‌شود.':null,next_action:stage==='AGREED'?'تنظیم قرارداد توسط مدیرکل':'پیگیری نتیجه مذاکره',next_action_at:['LOST','FINALIZED'].includes(stage)?null:date(1),version:1};
 });
 db.dealParticipants=[];
 for(const d of db.deals){const l=db.listings.find(l=>l.id===d.listing_id),q=db.inquiries.find(q=>q.id===d.inquiry_id);for(const owner of db.propertyContacts.filter(p=>p.property_id===l.property_id))db.dealParticipants.push({id:`dp${db.dealParticipants.length+1}`,deal_id:d.id,contact_id:owner.contact_id,participant_role:'OWNER',is_primary:owner.is_primary});db.dealParticipants.push({id:`dp${db.dealParticipants.length+1}`,deal_id:d.id,contact_id:q.contact_id,participant_role:'CUSTOMER',is_primary:true});}
 db.offers=[];
 db.contracts=['d1','d3'].map((id,i)=>{
  const d=db.deals.find(d=>d.id===id),l=db.listings.find(l=>l.id===d.listing_id);
  const terms={deal_type_id:l.deal_type_id,deal_type_version_id:l.deal_type_version_id,sale_price:l.sale_price||0,deposit:l.deposit||0,monthly_rent:l.monthly_rent||0,additional_terms:copy(l.additional_terms)};
  return {id:`ct${i+1}`,deal_id:d.id,contract_number:`DEMO-${1001+i}`,deal_type_version_id:d.deal_type_version_id,template_version_id:'demo-v1',accepted_offer_id:null,agreement_basis:'CONTRACT_TERMS',source_listing_snapshot:{...copy(l),status:'ACTIVE',closed_at:null,closure_reason:null},terms_snapshot:terms,sale_price:terms.sale_price,deposit:terms.deposit,monthly_rent:terms.monthly_rent,status:i===0?'FINALIZED':'PENDING_SIGNATURE',signed_at:i===0?date(-3):null,effective_at:i===0?date(-2):null,finalized_at:i===0?date(-2):null,created_at:date(-5),created_by_id:'u1',finalized_by_id:i===0?'u1':null,version:1};
 });
 db.contractParties=[];db.signatures=[];
 for(const ct of db.contracts)for(const p of db.dealParticipants.filter(p=>p.deal_id===ct.deal_id)){
  const id=`party${db.contractParties.length+1}`;db.contractParties.push({id,contract_id:ct.id,contact_id:p.contact_id,party_role:p.participant_role,identity_snapshot:copy(contact(p.contact_id))});db.signatures.push({id:`sig${db.signatures.length+1}`,contract_party_id:id,status:ct.status==='FINALIZED'?'SIGNED':'PENDING',signed_at:ct.status==='FINALIZED'?date(-3):null,recorded_by_id:ct.status==='FINALIZED'?'u1':null});
 }
 db.tasks=[];db.followUps=[];
 const task=(subject_type,subject_id,assigned_to_id,title,type='CALL',days=2)=>db.tasks.push({id:`t${db.tasks.length+1}`,subject_type,subject_id,assigned_to_id,created_by_id:'u1',title,description:title,task_type:type,priority:days<0?'HIGH':'NORMAL',due_at:date(days),status:'OPEN',created_at:date(-1),completed_at:null,cancellation_reason:null});
 task('registration_request','r18','u2','بررسی درخواست انصراف رضا حسینی','ASSIGNMENT_REVIEW',1);
 task('inquiry','i18','u3','تصمیم درباره درخواست انصراف مشاور متقاضی','ASSIGNMENT_REVIEW',1);
 task('property','p9','u3','بررسی کارشناسی ملک و اعلام تأیید یا اصلاح','PROPERTY_REVIEW',1);
 task('registration_request','r10','u5','عکس پارکینگ را تکمیل و برای تأیید مدیر ارسال کنید.','APPRAISAL',-1);
 task('registration_request','r11','u4','عکس‌ها و گزارش بازدید کارشناسی را تکمیل کنید.','APPRAISAL',1);
 task('deal','d4','u1','تنظیم قرارداد پیش‌فروش پس از توافق طرفین','CONTRACT_PREPARATION',1);
 task('inquiry','i7','u4','هماهنگی حضور متقاضی در بازدید فردا','CALL',1);
 task('introduction','intro12','u4','هماهنگی مذاکره با مشاور متقاضی رضا حسینی','COLLABORATION',1);
 task('introduction','intro12','u5','هماهنگی مذاکره با مشاور ملک سارا محمدی','COLLABORATION',1);
 for(const n of [2,7,8,10,17]){const q=db.inquiries.find(q=>q.id===`i${n}`);db.followUps.push({id:`fu${db.followUps.length+1}`,contact_id:q.contact_id,consultant_id:q.assigned_to_id,subject_type:'inquiry',subject_id:q.id,follow_up_type:'CALL',scheduled_at:date(1),status:'SCHEDULED',notes:q.notes,outcome:null,next_action:n===10?'تماس برای انتخاب زمان بازدید':'تماس و ثبت نتیجه پیگیری',next_action_at:null,completed_at:null});}
 db.commissionPolicies=db.dealTypes.map((t,i)=>({id:`policy${i+1}`,name:'سیاست نمایشی؛ صرفاً برای نمایش محاسبات',deal_type_id:t.id,version_number:1,calculation_method:'FIXED',parameters:{amount:45000000},rounding_rule:'ROUND',status:'PUBLISHED'}));
 db.commissions=['c1',db.inquiries[0].contact_id].map((cid,i)=>({id:`cm${i+1}`,contract_id:'ct1',debtor_contact_id:cid,policy_version_id:'policy1',calculation_snapshot:{method:'FIXED',amount:45000000,label:'نمونه نمایشی'},calculated_amount:45000000,adjustment_amount:0,final_amount:45000000,adjustment_reason:null,due_at:date(3),status:'APPROVED'}));
 db.commissionShares=db.commissions.flatMap((c,i)=>[{id:`cs${i*2+1}`,commission_id:c.id,beneficiary_type:'CONSULTANT',beneficiary_user_id:'u4',share_percent:40,amount:18000000,status:'APPROVED'},{id:`cs${i*2+2}`,commission_id:c.id,beneficiary_type:'OFFICE',beneficiary_user_id:null,share_percent:60,amount:27000000,status:'APPROVED'}]);
 db.payments=[{id:'pay1',contact_id:db.inquiries[0].contact_id,user_id:null,direction:'IN',amount:20000000,paid_at:date(-1),method:'CARD',reference_number:'DEMO-001',status:'CONFIRMED',recorded_by_id:'u8',reversal_of_id:null},{id:'pay2',contact_id:null,user_id:'u4',direction:'OUT',amount:5000000,paid_at:date(),method:'TRANSFER',reference_number:'DEMO-002',status:'CONFIRMED',recorded_by_id:'u8',reversal_of_id:null}];
 db.paymentAllocations=[{id:'pa1',payment_id:'pay1',commission_id:'cm2',commission_share_id:null,amount:20000000},{id:'pa2',payment_id:'pay2',commission_id:null,commission_share_id:'cs3',amount:5000000}];
 db.attachments=[];db.rescheduleHistory=[
  {id:'wd1',request_kind:'CONSULTANT_WITHDRAWAL',subject_type:'registration_request',subject_id:'r18',status:'PENDING',requested_by_id:'u5',requested_at:date(0,-2),changed_by_id:'u5',changed_at:date(0,-2),reason:'با زمان بازدیدهای قبلی من تداخل دارد و امکان قبول این پرونده را ندارم.'},
  {id:'wd2',request_kind:'CONSULTANT_WITHDRAWAL',subject_type:'inquiry',subject_id:'i18',status:'PENDING',requested_by_id:'u6',requested_at:date(0,-1),changed_by_id:'u6',changed_at:date(0,-1),reason:'پس از پذیرش، مأموریت خارج از دفتر پیش آمده و زمان کافی برای رسیدگی ندارم.'},
  {id:'wd3',request_kind:'CONSULTANT_WITHDRAWAL',subject_type:'inquiry',subject_id:'i19',status:'APPROVED',requested_by_id:'u4',requested_at:date(-2),changed_by_id:'u4',changed_at:date(-2),reason:'به دلیل مرخصی امکان ادامه رسیدگی ندارم.',decided_by_id:'u2',decided_at:date(-1),decision_reason:'انصراف تأیید شد؛ پرونده برای ارجاع به مشاور دیگر آماده است.'},
  {id:'wd4',request_kind:'CONSULTANT_WITHDRAWAL',subject_type:'inquiry',subject_id:'i20',status:'REJECTED',requested_by_id:'u5',requested_at:date(-2),changed_by_id:'u5',changed_at:date(-2),reason:'درخواست کاهش حجم پرونده‌ها را دارم.',decided_by_id:'u2',decided_at:date(-1),decision_reason:'با هماهنگی زمان‌های بازدید، رسیدگی توسط مشاور فعلی ادامه یابد.'}
 ];
 db.inquiries.find(q=>q.id==='i2').due_at=date(-1);
 for(const [collection,id,requested_by_id] of [['registrationRequests','r10','u5'],['inquiries','i2','u5']]){
  const row=db[collection].find(r=>r.id===id);
  db.rescheduleHistory.push({id:`ext-${id}`,request_kind:'ASSIGNMENT_EXTENSION',subject_type:collection==='inquiries'?'inquiry':'registration_request',subject_id:id,status:'PENDING',old_scheduled_at:row.due_at,new_scheduled_at:date(3),requested_due_at:date(3),requested_by_id,requested_at:date(0,-2),changed_by_id:requested_by_id,changed_at:date(0,-2),reason:collection==='inquiries'?'متقاضی برای انتخاب فایل جایگزین سه روز زمان خواسته است.':'عکاسی تکمیلی پارکینگ با هماهنگی مالک سه روز دیگر انجام می‌شود.'});
  task(collection==='inquiries'?'inquiry':'registration_request',id,'u2','بررسی درخواست تمدید مهلت رسیدگی','ASSIGNMENT_REVIEW',1);
 }
 db.transferHistory=[];db.assignmentHistory=[];
 // Record actual milestones rather than a synthetic jump from NEW to the final state.
 db.stageHistory=[];
 for(const r of db.registrationRequests){const states=['NEW'];if(r.lead_status==='ACCEPTED')states.push('ACCEPTED');if(r.assigned_to_id)states.push('ASSIGNED');if(r.acceptance_status==='ACCEPTED')states.push('IN_PROGRESS');if(r.status==='COMPLETED')states.push('PENDING_REVIEW');if(!states.includes(r.status))states.push(r.status);states.slice(1).forEach((to_stage,j)=>db.stageHistory.push({id:`sh${db.stageHistory.length+1}`,subject_type:'registration_request',subject_id:r.id,from_stage:states[j],to_stage,changed_by_id:manager(r.management_scope_id),changed_at:to_stage==='ASSIGNED'?r.assigned_at:to_stage==='IN_PROGRESS'?r.accepted_at:to_stage==='COMPLETED'?date(-21):to_stage==='PENDING_REVIEW'?(r.status==='PENDING_REVIEW'?date(-2):date(-23)):to_stage==='CHANGES_REQUIRED'?date(-1):to_stage==='CANCELLED'||to_stage==='DUPLICATE'?r.closed_at:r.lead_accepted_at,reason:r.description,operation_id:`demo-${r.id}-${j}`}));if(r.assigned_to_id)db.assignmentHistory.push({id:`ah${db.assignmentHistory.length+1}`,registration_request_id:r.id,previous_assignee_id:null,new_assignee_id:r.assigned_to_id,assigned_by_id:manager(r.management_scope_id),assigned_at:r.assigned_at,reason:'ارجاع اولیه پرونده',operation_id:`demo-assign-${r.id}`});}
 for(const q of db.inquiries){
  const states=['NEW'];if(q.lead_status==='ACCEPTED')states.push('ACCEPTED');if(q.assigned_to_id)states.push('ASSIGNED');if(q.acceptance_status==='ACCEPTED')states.push('SEARCHING');
  const intros=db.introductions.filter(i=>i.inquiry_id===q.id),visits=db.viewings.filter(v=>intros.some(i=>i.id===v.introduction_id)),deals=db.deals.filter(d=>d.inquiry_id===q.id);
  if(intros.length)states.push('INTRODUCED');if(visits.length)states.push('VIEWING');if(deals.length)states.push('NEGOTIATION');if(q.status==='COMPLETED')states.push('COMPLETED');if(q.status==='CANCELLED')states.push('CANCELLED');if(deals.length&&deals.every(d=>d.stage==='LOST'))states.push('SEARCHING');
  states.slice(1).forEach((to_stage,j)=>db.stageHistory.push({id:`sh${db.stageHistory.length+1}`,subject_type:'inquiry',subject_id:q.id,from_stage:states[j],to_stage,changed_by_id:q.assigned_to_id||manager(q.management_scope_id),changed_at:to_stage==='ACCEPTED'?q.lead_accepted_at:to_stage==='ASSIGNED'?q.assigned_at:to_stage==='SEARCHING'?(j>4?date(-2):date(-14)):to_stage==='INTRODUCED'?date(-12):to_stage==='VIEWING'?date(-10):to_stage==='NEGOTIATION'?date(-8):date(-2),reason:q.notes,operation_id:`demo-${q.id}-${j}`}));
 }
 db.assignmentHistory.push({id:'ah-withdrawal-i19',inquiry_id:'i19',registration_request_id:null,previous_assignee_id:'u4',new_assignee_id:null,assigned_by_id:'u2',assigned_at:date(-1),reason:'انصراف مشاور تأیید شد؛ پرونده منتظر ارجاع جدید است.',operation_id:'demo-withdrawal-i19'});
 db.notifications=db.tasks.map((t,i)=>({id:`n${i+1}`,user_id:t.assigned_to_id,type:t.task_type==='CONTRACT_PREPARATION'?'CONTRACT':'ASSIGNMENT',title:t.title,message:t.description,subject_type:t.subject_type,subject_id:t.subject_id,is_read:false,created_at:date(-1),event_key:`demo-${t.id}`}));
 db.activityLogs=db.stageHistory.map((h,i)=>({id:`al${i+1}`,user_id:h.changed_by_id,action:'STAGE_CHANGED',subject_type:h.subject_type,subject_id:h.subject_id,description:h.reason,operation_id:h.operation_id,created_at:h.changed_at}));
 return db;
}
