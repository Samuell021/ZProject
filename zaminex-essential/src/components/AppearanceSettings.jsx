import React, { useEffect, useState } from 'react';
import { Palette, Sun, Moon, Check } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Modal } from './ui';
import { APPEARANCE_KEY, colorThemes, readAppearance, applyAppearance } from '../services/appearance';
export default function AppearanceSettings() {
  const [query, setQuery] = useSearchParams();
  const [settings, setSettings] = useState(readAppearance);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    applyAppearance(settings);
    try {
      localStorage.setItem(APPEARANCE_KEY, JSON.stringify(settings));
      setStorageError(false);
    } catch { setStorageError(true); }
  }, [settings]);
  return <>
    <button type="button" className="secondary appearance-trigger" aria-label="ظاهر برنامه" onClick={() => {
      const next = new URLSearchParams(query);
      next.set('appearance', '1');
      setQuery(next);
    }}><Palette size={18} /><span>ظاهر برنامه</span></button>
    {query.get('appearance') === '1' && <Modal title="ظاهر برنامه" parameter="appearance" className="appearance-modal">
      <p className="muted">رنگ و حالت دلخواهتان را انتخاب کنید؛ تغییرات همان لحظه در همه بخش‌ها دیده می‌شوند.</p>
      <h3>حالت نمایش</h3>
      <div className="appearance-modes" role="group" aria-label="حالت نمایش">
        <button type="button" className="secondary" aria-pressed={settings.mode === 'light'} onClick={() => setSettings(current => ({...current, mode:'light'}))}><Sun size={20} />روشن</button>
        <button type="button" className="secondary" aria-pressed={settings.mode === 'dark'} onClick={() => setSettings(current => ({...current, mode:'dark'}))}><Moon size={20} />تیره</button>
      </div>
      <fieldset className="appearance-colors"><legend>رنگ اصلی</legend>
        {colorThemes.map(theme => <label className="appearance-color" key={theme.id} style={{'--swatch':theme.color}}>
          <input type="radio" name="accent-color" value={theme.id} checked={settings.color === theme.id} onChange={() => setSettings(current => ({...current,color:theme.id}))} />
          <span className="color-swatch" aria-hidden="true">{settings.color === theme.id && <Check size={20} />}</span>
          <span>{theme.name}<small dir="ltr">{theme.color}</small></span>
        </label>)}
      </fieldset>
      <div className="appearance-preview"><span className="badge">پیش‌نمایش رنگ انتخابی</span><strong>گروه سرمایه گذاری کلان فردا</strong><span className="button" aria-hidden="true">ثبت اطلاعات</span></div>
      <p role="status" className="muted">{storageError ? 'ذخیره تنظیمات مرورگر در دسترس نیست؛ این انتخاب فقط تا تازه‌کردن صفحه باقی می‌ماند.' : 'انتخاب شما در همین مرورگر ذخیره می‌شود.'}</p>
    </Modal>}
  </>;
}
