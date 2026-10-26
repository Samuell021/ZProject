import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { canOpenPage } from '../services/intake';
const sections = [['workspace', 'فضای کار', ['dashboard', 'tasks', 'inbox', 'notifications']], ['cases', 'پرونده‌ها', ['contacts', 'property-register', 'inquiry-register', 'requests', 'inquiries', 'properties', 'listings', 'explore']], ['operations', 'پیگیری عملیات', ['pipelines', 'followups']], ['finance', 'قرارداد و مالی', ['contracts', 'finance', 'reports']], ['people', 'مدیریت کاربران و دسترسی', ['staff', 'groups', 'teams']], ['settings', 'تنظیمات و راهنما', ['settings', 'guide']]];
export default function SidebarNavigation({
  menu,
  db,
  actorId,
  page,
  reviewCount
}) {
  const storageKey = `farda-crm-menu:${actorId}`;
  const current = sections.find(([,, keys]) => keys.includes(page))?.[0];
  const [expanded, setExpanded] = useState(() => {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {}
    return {
      ...saved,
      ...(current ? {
        [current]: true
      } : {})
    };
  });
  useEffect(() => {
    if (current) setExpanded(previous => ({
      ...previous,
      [current]: true
    }));
  }, [current]);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(expanded));
    } catch {}
  }, [expanded, storageKey]);
  return <nav aria-label="منوی اصلی">{sections.map(([id, heading, keys]) => {
      const items = keys.map(key => menu.find(m => m[0] === key)).filter(([url]) => canOpenPage(db, actorId, url) && (url!=="lead-submit" || !canOpenPage(db,actorId,"leads")));
      if (!items.length) return null;
      const open = !!expanded[id];
      return <section className="nav-group" key={id}>
   <button className="nav-section-toggle" type="button" aria-expanded={open} aria-controls={`nav-${id}`} onClick={() => setExpanded(previous => ({
          ...previous,
          [id]: !previous[id]
        }))}>
    <span>{heading}</span><ChevronDown size={16} className={open ? 'is-expanded' : ''} />
   </button>
   <div id={`nav-${id}`} hidden={!open}>{items.map(([url, text, Icon]) => <NavLink key={url} to={url === 'dashboard' ? '/' : `/${url}`} end>
    <Icon size={18} />{text}{url === 'reviews' && <em>{reviewCount}</em>}
   </NavLink>)}</div>
  </section>;
    })}</nav>;
}
