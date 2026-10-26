const digits = s => String(s).replace(/[۰-۹٠-٩]/g, c => '۰۱۲۳۴۵۶۷۸۹'.includes(c) ? '۰۱۲۳۴۵۶۷۸۹'.indexOf(c) : '٠١٢٣٤٥٦٧٨٩'.indexOf(c));
const fa = s => String(s).replace(/\d/g, c => '۰۱۲۳۴۵۶۷۸۹'[c]);
const persian = new Intl.DateTimeFormat('en-US', {calendar:'persian',numberingSystem:'latn',timeZone:'UTC',year:'numeric',month:'2-digit',day:'2-digit'});
const tehran = new Intl.DateTimeFormat('en-US', {calendar:'gregory',numberingSystem:'latn',timeZone:'Asia/Tehran',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const parts = (formatter, date) => Object.fromEntries(formatter.formatToParts(date).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
const pad = n => String(n).padStart(2,'0');
export function jalaliToISO(value, withTime=false) {
 const match=digits(value).trim().match(withTime ? /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})\s+(\d{1,2}):(\d{2})$/ : /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
 if(!match)return null;
 const [jy,jm,jd,h=0,m=0]=match.slice(1).map(Number);
 if(jy<1200||jy>1600||jm<1||jm>12||jd<1||jd>31||h>23||m>59)return null;
 const target=jy*10000+jm*100+jd;
 let low=Math.floor(Date.UTC(jy+621,2,1)/86400000),high=Math.floor(Date.UTC(jy+622,3,1)/86400000),day=null;
 while(low<=high){const mid=Math.floor((low+high)/2);const p=parts(persian,new Date(mid*86400000+43200000));const key=p.year*10000+p.month*100+p.day;if(key===target){day=mid;break;}if(key<target)low=mid+1;else high=mid-1;}
 if(day===null)return null;
 if(!withTime)return new Date(day*86400000).toISOString().slice(0,10);
 const desired=day*86400000+h*3600000+m*60000;
 let instant=desired-210*60000;
 for(let i=0;i<4;i++){const p=parts(tehran,new Date(instant));const actual=Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute);if(actual===desired)return new Date(instant).toISOString();instant+=desired-actual;}
 return null;
}
export function isoToJalaliInput(value,withTime=false){
 if(!value)return '';
 const date=new Date(withTime?value:String(value).slice(0,10)+'T12:00:00Z');
 if(Number.isNaN(date.getTime()))return '';
 const civil=withTime?parts(tehran,date):null;
 const calendarDate=civil?new Date(Date.UTC(civil.year,civil.month-1,civil.day,12)):date;
 const p=parts(persian,calendarDate);
 return fa(`${p.year}/${pad(p.month)}/${pad(p.day)}${withTime?` ${pad(civil.hour)}:${pad(civil.minute)}`:''}`);
}
