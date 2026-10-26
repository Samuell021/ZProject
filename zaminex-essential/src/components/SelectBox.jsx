import React, { Children, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import './selectbox.css';
const textOf = node => Array.isArray(node) ? node.map(textOf).join('') : React.isValidElement(node) ? textOf(node.props.children) : node == null ? '' : String(node);
const normalize = value => String(value).trim().toLocaleLowerCase('fa').replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/[\u200c\u200e\u200f]/g, ' ').replace(/\s+/g, ' ');
/** DiakoLight's searchable, keyboard-friendly select pattern adapted to Sample. */
export default function SelectBox({
  children,
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  required = false,
  searchable = false,
  className = '',
  ...props
}) {
  const options = Children.toArray(children).filter(React.isValidElement).map(option => ({
    value: String(option.props.value ?? textOf(option.props.children)),
    label: textOf(option.props.children),
    disabled: !!option.props.disabled
  }));
  const [local, setLocal] = useState(() => String(defaultValue ?? options[0]?.value ?? ''));
  const raw = String(value ?? local),
    current = options.some(o => o.value === raw) ? raw : options[0]?.value ?? '';
  const selected = options.find(o => o.value === current);
  const [open, setOpen] = useState(false),
    [filter, setFilter] = useState(''),
    [active, setActive] = useState(-1),
    [invalid, setInvalid] = useState(false);
  const trigger = useRef(null),
    panel = useRef(null),
    searchInput = useRef(null),
    typeahead = useRef({
      text: '',
      at: 0
    });
  const id = useId();
  const filtered = useMemo(() => options.filter(o => !searchable || !filter || normalize(o.label).includes(normalize(filter))), [children, filter, searchable]);
  const enabled = filtered.map((o, i) => o.disabled ? -1 : i).filter(i => i >= 0);
  const close = () => {
    panel.current?.hidePopover?.();
    setOpen(false);
    setFilter('');
  };
  const show = (last = false) => {
    if (disabled) return;
    setFilter('');
    const selectedIndex = options.findIndex(o => o.value === current && !o.disabled);
    setActive(selectedIndex >= 0 ? selectedIndex : last ? options.length - 1 : options.findIndex(o => !o.disabled));
    setOpen(true);
  };
  const choose = index => {
    const option = filtered[index];
    if (!option || option.disabled || disabled) return;
    if (value === undefined) setLocal(option.value);
    setInvalid(false);
    onChange?.({
      target: {
        name,
        value: option.value
      },
      currentTarget: {
        name,
        value: option.value
      }
    });
    close();
    trigger.current?.focus();
  };
  useEffect(() => {
    if (!open || disabled) return;
    const element = panel.current;
    const position = () => {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize),
        gap = 0.375 * rem;
      const below = window.innerHeight - rect.bottom - gap * 2,
        above = rect.top - gap * 2;
      const up = below < Math.min(element.scrollHeight, 18 * rem) && above > below;
      const width = Math.min(Math.max(rect.width, 10 * rem), window.innerWidth - gap * 2);
      Object.assign(element.style, {
        width: `${width / rem}rem`,
        maxHeight: `${Math.max(0, Math.min(18 * rem, up ? above : below)) / rem}rem`,
        left: `${Math.max(gap, Math.min(rect.left, window.innerWidth - width - gap)) / rem}rem`,
        top: up ? 'auto' : `${(rect.bottom + gap) / rem}rem`,
        bottom: up ? `${(window.innerHeight - rect.top + gap) / rem}rem` : 'auto'
      });
    };
    element.showPopover?.();
    position();
    const outside = e => {
      if (!element.contains(e.target) && !trigger.current?.contains(e.target)) close();
    };
    const toggle = e => {
      if (e.newState === 'closed') {
        setOpen(false);
        setFilter('');
      }
    };
    element.addEventListener('toggle', toggle);
    window.addEventListener('resize', position);
    document.addEventListener('scroll', position, true);
    document.addEventListener('pointerdown', outside);
    const frame = requestAnimationFrame(() => {
      if (searchable) searchInput.current?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('toggle', toggle);
      window.removeEventListener('resize', position);
      document.removeEventListener('scroll', position, true);
      document.removeEventListener('pointerdown', outside);
      if (element.isConnected) element.hidePopover?.();
    };
  }, [open, disabled, searchable]);
  useEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({
      block: 'nearest'
    });
  }, [active, open, id]);
  useEffect(() => {
    if (disabled) close();
  }, [disabled]);
  const keyDown = e => {
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      e.stopPropagation();
      close();
      trigger.current?.focus();
      return;
    }
    if (e.key === 'Tab') {
      close();
      return;
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      if (!open) {
        show(e.key === 'ArrowUp' || e.key === 'End');
        return;
      }
      if (!enabled.length) return;
      if (e.key === 'Home') setActive(enabled[0]);else if (e.key === 'End') setActive(enabled.at(-1));else setActive(enabled[(enabled.indexOf(active) + (e.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length]);
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && e.target !== searchInput.current) {
      e.preventDefault();
      open ? choose(active) : show();
      return;
    }
    if (e.key === 'Enter' && e.target === searchInput.current) {
      e.preventDefault();
      choose(active);
      return;
    }
    if (e.target !== searchInput.current && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      typeahead.current = {
        text: Date.now() - typeahead.current.at > 700 ? e.key : typeahead.current.text + e.key,
        at: Date.now()
      };
      const index = filtered.findIndex(o => !o.disabled && normalize(o.label).startsWith(normalize(typeahead.current.text)));
      if (index >= 0) {
        if (!open) show();
        setActive(index);
      }
    }
  };
  return <span className={`selectbox ${className}`}>
  <select className="selectbox-native" aria-hidden="true" tabIndex={-1} name={name} value={current} disabled={disabled} required={required} onChange={e => {
      setLocal(e.target.value);
      onChange?.(e);
    }} onInvalid={e => {
      e.preventDefault();
      setInvalid(true);
      trigger.current?.focus();
      show();
    }}>
   {options.map(o => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
  </select>
  <button {...props} ref={trigger} type="button" role="combobox" className="selectbox-trigger" disabled={disabled} aria-expanded={open} aria-required={required} aria-invalid={invalid || undefined} aria-controls={id} aria-haspopup="listbox" aria-activedescendant={open && active >= 0 ? `${id}-${active}` : undefined} onClick={() => open ? close() : show()} onKeyDown={keyDown}>
   <span className={!current ? 'selectbox-placeholder' : ''}>{selected?.label || 'انتخاب کنید'}</span><ChevronDown size={16} aria-hidden="true" />
  </button>
  <span ref={panel} id={id} popover="auto" role="listbox" aria-label="گزینه‌های قابل انتخاب" dir="rtl" className="selectbox-menu" style={{
      display: open ? 'flex' : 'none'
    }} onKeyDown={keyDown} onClick={e => e.preventDefault()}>
   {searchable && <span className="selectbox-search"><Search size={16} aria-hidden="true" /><input ref={searchInput} type="search" aria-label="جست‌وجو در گزینه‌ها" placeholder="جست‌وجو…" value={filter} onChange={e => {
          setFilter(e.target.value);
          setActive(0);
        }} /></span>}
   <span className="selectbox-options">{filtered.map((option, index) => <span key={option.value} id={`${id}-${index}`} data-value={option.value} role="option" aria-selected={option.value === current} aria-disabled={option.disabled} className={`selectbox-option ${active === index ? 'is-active' : ''}`} onPointerMove={() => !option.disabled && setActive(index)} onPointerDown={e => e.preventDefault()} onClick={() => choose(index)}><span>{option.label}</span>{option.value === current && <Check size={16} aria-hidden="true" />}</span>)}
    {!filtered.length && <span className="selectbox-empty">موردی پیدا نشد.</span>}
   </span>
  </span>
  {invalid && <small role="alert" className="selectbox-error">یک گزینه انتخاب کنید.</small>}
 </span>;
}
