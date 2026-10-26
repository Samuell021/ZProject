import SelectBox from "./SelectBox";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { isoToJalaliInput, jalaliToISO } from '../services/jalali-date';
const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const latin = s => String(s).replace(/[۰-۹]/g, c => '۰۱۲۳۴۵۶۷۸۹'.indexOf(c));
const fa = n => Number(n).toLocaleString('fa-IR', {
  useGrouping: false
});
const parts = value => latin(isoToJalaliInput(value || new Date().toISOString(), true)).split(/[\/ :]/).map(Number);
export default function JalaliDatePicker({
  name,
  value,
  onChange,
  withTime = false,
  required = false,
  ...rest
}) {
  const [stored, setStored] = useState(value || '');
  const [open, setOpen] = useState(false);
  const initial = parts(value);
  const [year, setYear] = useState(initial[0]),
    [month, setMonth] = useState(initial[1]);
  const [hour, setHour] = useState(value ? initial[3] : 9),
    [minute, setMinute] = useState(value ? initial[4] : 0);
  const root = useRef(null),
    trigger = useRef(null),
    input = useRef(null),
    calendar = useRef(null);
  const label = rest['aria-label'] || 'تاریخ';
  useEffect(() => {
    setStored(value || '');
    if (value) {
      const p = parts(value);
      setYear(p[0]);
      setMonth(p[1]);
      setHour(p[3]);
      setMinute(p[4]);
    }
  }, [value]);
  useEffect(() => {
    if (!open) return;
    const element = calendar.current;
    const position = () => {
      const rect = root.current.getBoundingClientRect();
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize),
        gap = 0.375 * rem;
      const width = Math.min(21 * rem, window.innerWidth - gap * 2);
      const below = window.innerHeight - rect.bottom - gap * 2,
        above = rect.top - gap * 2;
      const up = below < Math.min(element.scrollHeight, 24 * rem) && above > below;
      Object.assign(element.style, {
        width: `${width / rem}rem`,
        maxHeight: `${Math.max(0, Math.min(window.innerHeight - gap * 2, up ? above : below)) / rem}rem`,
        left: `${Math.max(gap, Math.min(rect.right - width, window.innerWidth - width - gap)) / rem}rem`,
        top: up ? 'auto' : `${(rect.bottom + gap) / rem}rem`,
        bottom: up ? `${(window.innerHeight - rect.top + gap) / rem}rem` : 'auto'
      });
    };
    element.showPopover?.();
    position();
    const outside = e => {
      if (!root.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    window.addEventListener('resize', position);
    document.addEventListener('scroll', position, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      window.removeEventListener('resize', position);
      document.removeEventListener('scroll', position, true);
      if (element.isConnected) element.hidePopover?.();
    };
  }, [open]);
  useEffect(() => {
    input.current?.setCustomValidity(required && !stored ? 'تاریخ را از تقویم انتخاب کنید.' : '');
  }, [stored, required]);
  const days = useMemo(() => {
    const first = jalaliToISO(`${year}/${month}/1`);
    if (!first) return [];
    const offset = (new Date(first + 'T12:00:00Z').getUTCDay() + 1) % 7;
    return [...Array(offset).fill(null), ...Array.from({
      length: 31
    }, (_, i) => i + 1).filter(d => jalaliToISO(`${year}/${month}/${d}`))];
  }, [year, month]);
  const commit = (iso, close = true) => {
    setStored(iso || '');
    onChange?.({
      target: {
        name,
        value: iso || ''
      }
    });
    if (close) {
      setOpen(false);
      trigger.current?.focus();
    }
  };
  const choose = (y, m, d, h = hour, min = minute) => commit(jalaliToISO(`${y}/${m}/${d}${withTime ? ` ${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}` : ''}`, withTime));
  const changeTime = (h, m) => {
    setHour(h);
    setMinute(m);
    if (stored) {
      const p = parts(stored);
      commit(jalaliToISO(`${p[0]}/${p[1]}/${p[2]} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, true), false);
    }
  };
  const shift = delta => {
    const n = year * 12 + month - 1 + delta;
    setYear(Math.floor(n / 12));
    setMonth(n % 12 + 1);
  };
  const selected = stored ? parts(stored) : [];
  return <span className="jalali-picker" ref={root} onKeyDown={e => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      trigger.current?.focus();
    }
  }}>
  <span className="date-trigger-row">
   <input {...rest} ref={input} type="text" dir="ltr" inputMode="none" onChange={() => {}} value={isoToJalaliInput(stored, withTime)} placeholder="از تقویم انتخاب کنید" required={required} onClick={() => setOpen(true)} onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setOpen(true);
        }
      }} />
   <button type="button" className="secondary" ref={trigger} aria-label={`انتخاب تاریخ ${label}`} aria-expanded={open} onClick={() => setOpen(!open)}><CalendarDays size={18} /></button>
  </span>
  <input type="hidden" name={name} value={stored} />
  {open && <span ref={calendar} popover="manual" className="jalali-calendar" role="group" aria-label="تقویم شمسی">
   <span className="calendar-controls">
    <button type="button" className="secondary" aria-label="ماه قبل" onClick={() => shift(-1)}>→</button>
    <SelectBox aria-label="ماه تقویم" value={month} onChange={e => setMonth(Number(e.target.value))}>{months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</SelectBox>
    <SelectBox searchable aria-label="سال تقویم" value={year} onChange={e => setYear(Number(e.target.value))}>{Array.from({
            length: 101
          }, (_, i) => year - 50 + i).map(y => <option key={y} value={y}>{fa(y)}</option>)}</SelectBox>
    <button type="button" className="secondary" aria-label="ماه بعد" onClick={() => shift(1)}>←</button>
   </span>
   <span className="calendar-days">{['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((d, i) => <small key={i}>{d}</small>)}
    {days.map((d, i) => d ? <button type="button" key={i} className={selected[0] === year && selected[1] === month && selected[2] === d ? '' : 'secondary'} aria-label={`روز ${fa(d)}`} aria-pressed={selected[0] === year && selected[1] === month && selected[2] === d} onClick={() => choose(year, month, d)}>{fa(d)}</button> : <span key={i} />)}
   </span>
   {withTime && <span className="calendar-time"><span>ساعت تهران</span><SelectBox aria-label="ساعت" value={hour} onChange={e => changeTime(Number(e.target.value), minute)}>{Array.from({
            length: 24
          }, (_, i) => <option key={i} value={i}>{fa(i).padStart(2, '۰')}</option>)}</SelectBox><span>:</span><SelectBox aria-label="دقیقه" value={minute} onChange={e => changeTime(hour, Number(e.target.value))}>{Array.from({
            length: 60
          }, (_, i) => <option key={i} value={i}>{fa(i).padStart(2, '۰')}</option>)}</SelectBox></span>}
   <span className="calendar-controls"><button type="button" className="secondary" onClick={() => {
          const p = parts();
          choose(p[0], p[1], p[2]);
        }}>امروز</button><button type="button" className="secondary" onClick={() => commit('')}>پاک‌کردن</button><button type="button" onClick={() => {
          setOpen(false);
          trigger.current?.focus();
        }}>بستن تقویم</button></span>
  </span>}
 </span>;
}
