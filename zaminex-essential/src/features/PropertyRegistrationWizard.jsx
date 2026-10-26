import {showError,showValidationError} from "../services/alerts";
import { scopeManagerNames } from "../services/property-wizard";
import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, House, UserRound, ClipboardCheck } from 'lucide-react';
import SelectBox from '../components/SelectBox';
import { canAccess } from '../services/operations';
import { canOpenPage } from '../services/intake';
import { num } from '../components/ui';
import './property-registration-wizard.css';

const steps = [ ['اطلاعات تماس', UserRound], ['اطلاعات اولیه ملک', House], ['مرور و ثبت', ClipboardCheck] ];
const normalizePhone = value => value.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[\s-]/g, '');
const blank = { name: '', phone: '', title: '', description: '', scope: '' };
export default function PropertyRegistrationWizard({ db, actorId, run, busy, onCreated }) {
  const [q, setQ] = useSearchParams();
  const key = `farda-property-wizard:${actorId}`;
  const [draft, setDraft] = useState(() => {
    try { return { ...blank, ...JSON.parse(sessionStorage.getItem(key) || '{}') }; } catch { return { ...blank }; }
  });
  const [draftWarning, setDraftWarning] = useState(false);
  const heading = useRef(null), submitting = useRef(false);
  const manager = canOpenPage(db, actorId, 'leads');
  const scopes = db.scopes.filter(s => s.is_active && canAccess(db, actorId, 'scopes', s));
  const scope = draft.scope || (scopes.length === 1 ? scopes[0].id : '');
  const validContact = draft.name.trim() && /^\d{11}$/.test(normalizePhone(draft.phone));
  const validDetails = !manager || scopes.some(s => s.id === scope);
  const rawStep = Number(q.get('step') || 1);
  const requested = Number.isInteger(rawStep) ? Math.min(3, Math.max(1, rawStep)) : 1;
  const step = !validContact ? 1 : !validDetails ? Math.min(2, requested || 1) : Math.min(3, Math.max(1, Number.isInteger(requested) ? requested : 1));
  const receipt = db.registrationRequests.find(r => r.id === q.get('submitted') && r.created_by_id === actorId);
  useEffect(() => {
    if (receipt) return;
    try { sessionStorage.setItem(key, JSON.stringify(draft)); setDraftWarning(false); } catch { setDraftWarning(true); }
  }, [draft, key, receipt]);
  useEffect(() => { heading.current?.focus(); }, [step, receipt?.id]);
  const change = name => e => { setDraft(d => ({ ...d, [name]: e.target.value }));  };
  const go = nextStep => { const next = new URLSearchParams(q); next.set('step', String(nextStep)); setQ(next);  };
  const submit = async event => {
    event.preventDefault();
    if (busy || submitting.current) return;
    if (!validContact) { void showError('نام و شماره تماس ۱۱ رقمی را کامل کنید.'); return; }
    if (step < 3) { go(step + 1); return; }
    if (!validDetails) { void showError('رنج مسئول را انتخاب کنید.'); return; }
    submitting.current = true;
    
    try {
      const result = await run('createLead', {
        lead_type: 'PROPERTY', initial_contact_name: draft.name.trim(), initial_contact_phone: normalizePhone(draft.phone),
        description: draft.description.trim(), ...(manager ? { management_scope_id: scope, title: draft.title.trim() } : {}),
      });
      if (result?.id) {
        try { sessionStorage.removeItem(key); } catch {}
        if(onCreated) onCreated(result);
        else { const next = new URLSearchParams(q); next.delete('step'); next.set('submitted', result.id); setQ(next, { replace: true }); }
      }
    } catch (e) { void showError(e.message || 'ثبت انجام نشد؛ دوباره تلاش کنید.'); }
    finally { submitting.current = false; }
  };
  const restart = () => { setDraft({ ...blank }); const next = new URLSearchParams(q); next.delete('submitted'); next.delete('step'); setQ(next, { replace: true }); };
  if (receipt) return <section className="panel property-wizard wizard-success" aria-labelledby="wizard-success-title">
    <span className="wizard-success-icon"><Check aria-hidden="true" /></span>
    <h2 id="wizard-success-title" tabIndex={-1} ref={heading}>اطلاعات ملک ثبت شد</h2>
    <p>کد پیگیری: <strong>{receipt.code}</strong></p>
    <p>{receipt.lead_status === 'ACCEPTED' ? 'پرونده آماده ارجاع به مشاور است.' : 'اطلاعات برای پذیرش به مدیر رنج ارسال شد. پس از ارجاع، ادامه کار از کارتابل پذیرش انجام می‌شود.'}</p>
    <div className="toolbar wrap"><button onClick={restart}>ثبت ملک دیگر</button><Link className="button secondary" to='/inbox'>{manager ? 'مشاهده موارد آماده ارجاع' : 'رفتن به کارتابل پذیرش'}</Link></div>
  </section>;
  return <section className="panel property-wizard" aria-labelledby="property-wizard-title">
    <div className="wizard-intro"><span className="eyebrow">ثبت گام‌به‌گام</span><h2 id="property-wizard-title">ثبت سرنخ ملک</h2><p className="muted">این مرحله آغاز پرونده است؛ پس از ثبت سرنخ، پذیرش، ارجاع و تکمیل ملک در همین مسیر ادامه پیدا می‌کند.</p></div>
    <ol className="wizard-steps" aria-label="مراحل ثبت ملک">{steps.map(([title, Icon], i) => <li key={title} aria-current={step === i + 1 ? 'step' : undefined} className={step > i + 1 ? 'is-complete' : ''}>
      <span className="wizard-step-icon">{step > i + 1 ? <Check size={20} aria-hidden="true" /> : <Icon size={20} aria-hidden="true" />}</span><span><small>مرحله {num(i + 1)}</small><strong>{title}</strong></span>
    </li>)}</ol>
    {draftWarning && <p role="status" className="alert error">ذخیره پیش‌نویس در مرورگر ممکن نیست؛ تا پایان ثبت، این صفحه را تازه نکنید.</p>}
    <form onInvalidCapture={showValidationError} onSubmit={submit} aria-busy={busy}>
      <fieldset disabled={busy} className="wizard-fields">
        <legend className="wizard-step-title" tabIndex={-1} ref={heading}>{steps[step - 1][0]}</legend>
        <p className="muted">{step === 1 ? 'مشخصات مالک یا فردی که برای ثبت ملک تماس گرفته را بنویسید.' : step === 2 ? 'هر اطلاعاتی که فعلاً از ملک دارید بنویسید؛ نیازی به گزارش کارشناسی یا قیمت نهایی نیست.' : 'اطلاعات را بررسی کنید. فقط با ثبت نهایی، پرونده ایجاد می‌شود.'}</p>
        {step === 1 && <div className="form-grid">
          <label className="field">نام و نام خانوادگی <input required value={draft.name} onChange={change('name')} autoComplete="name" maxLength={150} /></label>
          <label className="field">شماره تماس <input required type="tel" inputMode="tel" dir="ltr" value={draft.phone} onChange={change('phone')} autoComplete="tel" maxLength={20} placeholder="۰۹۱۲۳۴۵۶۷۸۹" /></label>
        </div>}
        {step === 2 && <div className="form-grid">
          {manager && <><label className="field">عنوان ملک (اختیاری)<input value={draft.title} onChange={change('title')} maxLength={200} placeholder="مثلاً آپارتمان دوخوابه در مرکز شهر" /></label>
          <label className="field">رنج مسئول<SelectBox aria-label="رنج مسئول" required value={scope} onChange={change('scope')}><option value="">انتخاب کنید</option>{scopes.map(s => <option key={s.id} value={s.id}>{s.name} · {scopeManagerNames(db,s.id)}</option>)}</SelectBox></label></>}
          <label className="field wizard-full">توضیحات اولیه ملک (اختیاری)<textarea rows={5} value={draft.description} onChange={change('description')} placeholder="مثلاً محله، متراژ تقریبی، فروش یا اجاره و توضیحات مالک…" /></label>
        </div>}
        {step === 3 && <><dl className="wizard-summary">
          <div><dt>نام تماس‌گیرنده</dt><dd>{draft.name}</dd></div><div><dt>شماره تماس</dt><dd dir="ltr">{draft.phone}</dd></div>
          {manager && <><div><dt>عنوان ملک</dt><dd>{draft.title || 'تعیین نشده'}</dd></div><div><dt>رنج مسئول</dt><dd>{scopes.find(s => s.id === scope)?.name} · {scopeManagerNames(db,scope)}</dd></div></>}
          <div className="wizard-full"><dt>توضیحات اولیه</dt><dd>{draft.description || 'توضیحی وارد نشده'}</dd></div>
        </dl><p className="wizard-next">{manager ? 'پس از ثبت، پرونده برای ارجاع به مشاور آماده می‌شود.' : 'پس از ثبت، اطلاعات برای پذیرش به مدیر رنج شما ارسال می‌شود.'}</p></>}
      </fieldset>
      <div className="wizard-footer"><span className="muted">مرحله {num(step)} از {num(steps.length)}</span><div className="toolbar">
        {step > 1 && <button type="button" className="secondary" disabled={busy} onClick={() => go(step - 1)}><ChevronRight size={18} aria-hidden="true" />مرحله قبل</button>}
        <button disabled={busy || (step === 2 && !validDetails)} type="submit">{busy ? 'در حال ثبت…' : step === 3 ? 'ثبت سرنخ و ادامه' : 'ادامه'}{step < 3 && <ChevronLeft size={18} aria-hidden="true" />}</button>
      </div></div>
    </form>
  </section>;
}
