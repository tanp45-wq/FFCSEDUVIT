'use strict';

import { PYQ_PAPERS } from '../data/pyq-papers.js';
import { showToast } from './navigation.js';

let pyqFilterType = 'all';
let pyqFilterYear = 'all';
let pyqSearch = '';

export function filterPYQ() {
  const searchInput = document.getElementById('pyq-search');
  if (searchInput) {
    pyqSearch = searchInput.value.toLowerCase();
  }
  renderPYQ();
}

export function renderPYQ() {
  const grid = document.getElementById('pyq-grid');
  if (!grid) return;

  let list = PYQ_PAPERS;
  if (pyqFilterType !== 'all') {
    list = list.filter(p => p.type === pyqFilterType);
  }
  if (pyqFilterYear !== 'all') {
    list = list.filter(p => p.year === parseInt(pyqFilterYear, 10));
  }
  if (pyqSearch) {
    list = list.filter(p =>
      p.subject.toLowerCase().includes(pyqSearch) ||
      p.code.toLowerCase().includes(pyqSearch)
    );
  }

  // Show all or cap for performance
  const shown = list.slice(0, 100);

  grid.innerHTML = shown.map(p => `
    <div class="pyq-card" onclick="openPaperLink('${p.url}', '${p.subject}', '${p.type}', '${p.year}')">
      <div class="pyq-card-top">
        <span class="pyq-badge-type ${p.type.toLowerCase()}">${p.type}</span>
        <span class="pyq-year">${p.year}</span>
      </div>
      <div class="pyq-card-title">${p.subject}</div>
      <div class="pyq-card-code">${p.code}</div>
      <div class="pyq-card-footer">
        <span class="pyq-view-btn"><i class="fa-solid fa-file-pdf"></i> View Paper</span>
        <span style="font-size:0.75rem;color:var(--muted)">PDF</span>
      </div>
    </div>
  `).join('');

  if (shown.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);padding:40px;text-align:center;grid-column:1/-1;">No papers found for selected filters.</p>';
  }
}

export function openPaperLink(url, subject, type, year) {
  window.open(url, '_blank', 'noopener');
  showToast(`Opening ${subject} ${type} ${year}...`, 'info');
}

export function initPYQPapers() {
  window.openPaperLink = openPaperLink;
  window.filterPYQ = filterPYQ;

  renderPYQ();

  // PYQ filter buttons
  document.getElementById('pf-type')?.addEventListener('click', e => {
    const btn = e.target.closest('.pf-btn');
    if (!btn) return;
    document.querySelectorAll('#pf-type .pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    pyqFilterType = btn.dataset.val;
    renderPYQ();
  });

  document.getElementById('pf-year')?.addEventListener('click', e => {
    const btn = e.target.closest('.pf-btn');
    if (!btn) return;
    document.querySelectorAll('#pf-year .pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    pyqFilterYear = btn.dataset.val;
    renderPYQ();
  });

  document.getElementById('pyq-search')?.addEventListener('input', filterPYQ);
}
