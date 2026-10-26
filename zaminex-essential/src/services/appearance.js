export const APPEARANCE_KEY = 'kalan-farda-appearance';
export const colorThemes = [
  { id: 'green', name: 'سبز فردا', color: '#176552' },
  { id: 'petroleum', name: 'آبی نفتی', color: '#164E63' },
  { id: 'midnight', name: 'آبی نیمه‌شب', color: '#191970' },
  { id: 'plum', name: 'آلویی', color: '#6B3D80' },
  { id: 'copper', name: 'مسی', color: '#92502F' },
  { id: 'slate', name: 'خاکستری‌آبی', color: '#475569' },
];
export function normalizeAppearance(value) {
  return {
    color: colorThemes.some(theme => theme.id === value?.color) ? value.color : 'green',
    mode: value?.mode === 'dark' ? 'dark' : 'light',
  };
}
export function readAppearance() {
  try { return normalizeAppearance(JSON.parse(localStorage.getItem(APPEARANCE_KEY))); }
  catch { return normalizeAppearance(); }
}
export function applyAppearance(value) {
  const settings = normalizeAppearance(value);
  const theme = colorThemes.find(theme => theme.id === settings.color);
  document.documentElement.dataset.mode = settings.mode;
  document.documentElement.dataset.accent = settings.color;
  document.documentElement.style.setProperty('--primary', theme.color);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', settings.mode === 'dark' ? '#111820' : theme.color);
}
