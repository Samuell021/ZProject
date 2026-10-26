import React, {useEffect, useState} from 'react';
import {isoToJalaliInput,jalaliToISO} from '../services/jalali-date';
export default function JalaliDateInput({name,value,onChange,withTime=false,required=false,...rest}){
 const [text,setText]=useState(()=>isoToJalaliInput(value,withTime));
 const [stored,setStored]=useState(value||'');
 useEffect(()=>{setText(isoToJalaliInput(value,withTime));setStored(value||'');},[value,withTime]);
 return <><input {...rest} type="text" dir="ltr" value={text} required={required} placeholder={withTime?'۱۴۰۵/۰۸/۱۰ ۱۰:۰۰':'۱۴۰۵/۰۸/۱۰'} onChange={event=>{
 const next=event.target.value,iso=jalaliToISO(next,withTime);setText(next);setStored(iso||'');
 event.target.setCustomValidity(next&&!iso?'تاریخ شمسی معتبر وارد کنید؛ مانند ۱۴۰۵/۰۸/۱۰'+(withTime?' ۱۰:۰۰':''):'');
 onChange?.({target:{name,value:iso||''}});
 }}/><input type="hidden" name={name} value={stored}/><small>تاریخ شمسی{withTime?'، ساعت تهران':''}</small></>;
}
