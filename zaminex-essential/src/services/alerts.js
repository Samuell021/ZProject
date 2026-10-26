let pending = null;
export function showError(message) {
 if(pending)return pending;
 pending=import('sweetalert2').then(({default:Swal})=>{
  const dialogs=[...document.querySelectorAll('dialog[open]')];
  return Swal.fire({
   icon:'error',title:'ثبت انجام نشد',text:String(message||'دوباره تلاش کنید.'),confirmButtonText:'متوجه شدم',
   target:dialogs.at(-1)||document.body,returnFocus:true,heightAuto:false,stopKeydownPropagation:true,
   customClass:{popup:'crm-error-popup',confirmButton:'crm-error-confirm'},buttonsStyling:false,
  });
 }).finally(()=>{pending=null;});
 return pending;
}
let validationQueued=false;
export function showValidationError(event) {
 event.preventDefault();
 if(validationQueued)return;
 validationQueued=true;
 const field=event.target;
 const title=(field.getAttribute('aria-label')||field.labels?.[0]?.textContent||'اطلاعات این بخش').replace(/\s*\*\s*$/,'').trim();
 const message=field.validity.valueMissing?`لطفاً «${title}» را تکمیل کنید.`:`مقدار «${title}» معتبر نیست؛ اطلاعات را بررسی کنید.`;
 queueMicrotask(()=>{validationQueued=false;void showError(message);});
}
export async function promptPropertyReview() {
 const {default:Swal}=await import('sweetalert2');
 return Swal.fire({
  icon:'success',title:'اطلاعات ملک ذخیره شد',text:'اطلاعات و گزارش بازدید را مرور کنید و برای بررسی مدیر رنج بفرستید.',
  confirmButtonText:'مرور و ارسال برای مدیر',cancelButtonText:'فعلاً ادامه می‌دهم',showCancelButton:true,
  target:[...document.querySelectorAll('dialog[open]')].at(-1)||document.body,
  returnFocus:true,heightAuto:false,stopKeydownPropagation:true,buttonsStyling:false,
  customClass:{popup:'crm-error-popup',confirmButton:'crm-error-confirm',cancelButton:'secondary'},
 });
}
