'use strict';

const SECTION_MAP = {
  home: 'sec-home',
  ffcs: 'sec-ffcs',
  cgpa: 'sec-cgpa',
  nptel: 'sec-nptel',
  pyq: 'sec-pyq'
};

export function showSection(key) {
  Object.values(SECTION_MAP).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById(SECTION_MAP[key]);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
}

let toastTimer = null;
export function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  const span = document.getElementById('toast-msg');
  if (!toast || !span) return;
  span.textContent = msg;
  toast.style.borderLeft = type === 'success' ? '3px solid #34d399' : type === 'error' ? '3px solid #f87171' : '3px solid #a78bfa';
  toast.classList.remove('hidden');
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 350);
  }, 3500);
}

export function openModal(id) {
  const overlay = document.getElementById('overlay');
  const modal = document.getElementById(id);
  if (overlay) overlay.classList.remove('hidden');
  if (modal) modal.classList.remove('hidden');
}

export function closeModal(id) {
  const overlay = document.getElementById('overlay');
  const modal = document.getElementById(id);
  if (overlay) overlay.classList.add('hidden');
  if (modal) modal.classList.add('hidden');
}

export function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.classList.add('hidden');
}

export function initNavigation() {
  // Bind globally so HTML onclick works
  window.showSection = showSection;
  window.showToast = showToast;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.closeAllModals = closeAllModals;

  document.getElementById('overlay')?.addEventListener('click', closeAllModals);
}
