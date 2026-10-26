import React from 'react';
import PropertyCommercialHistory from './PropertyCommercialHistory';
export default function InquiryStageActivities({stage,db,inquiry,actorId,run,busy}){
 const props={db,actorId,requestId:inquiry.id,collection:'inquiries',run,busy,pendingIntroductions:true};
 if(stage==='contract')return <div className="inquiry-stage-lists"><p className="muted">مذاکره موفق موردنظر را برای تنظیم قرارداد انتخاب کنید. اقدام تنظیم قرارداد فقط برای مدیر مجاز نمایش داده می‌شود.</p><PropertyCommercialHistory {...props} only={['deals','contracts']} readyForContract titles={{deals:'مذاکرات موفق؛ انتخاب برای تنظیم قرارداد',contracts:'قراردادهای ثبت‌شده'}}/></div>;
 if(stage==='matching')return <PropertyCommercialHistory {...props} only={['introductions']} titles={{introductions:'فایل‌های معرفی‌شده؛ انتخاب برای بازدید'}}/>;
 if(stage==='viewings')return <div className="inquiry-stage-lists"><p className="muted">فایل موردنظر را برای ثبت بازدید انتخاب کنید. نتیجه و ادامه هر بازدید فقط روی همان فایل ثبت می‌شود.</p><PropertyCommercialHistory {...props} only={['introductions','viewings']} titles={{introductions:'انتخاب فایل معرفی‌شده برای بازدید'}}/></div>;
 return <div className="inquiry-stage-lists"><p className="muted">از بین بازدیدهای مناسب، موردی را که به مذاکره رسیده انتخاب کنید؛ معرفی‌ها و بازدیدهای دیگر تغییری نمی‌کنند.</p><PropertyCommercialHistory {...props} only={['viewings','deals']} readyForNegotiation titles={{viewings:'انتخاب بازدید برای شروع مذاکره',deals:'مذاکرات ثبت‌شده'}}/></div>;
}
