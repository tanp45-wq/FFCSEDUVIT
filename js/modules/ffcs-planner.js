'use strict';

import { showToast, openModal, closeModal } from './navigation.js';

const TT_THEORY_HEADERS = ['8:00–8:50','8:55–9:45','LUNCH','9:50–10:40','10:45–11:35','11:40–12:30','12:35–1:25','LUNCH','1:30–2:20','2:25–3:15','3:20–4:10','4:15–5:05'];
const TT_LAB_HEADERS    = ['8:00–9:30','','LUNCH','9:55–11:25','','11:30–13:00','','LUNCH','13:30–15:00','','15:05–16:35',''];

const TT_ROWS = [
  { day:'MON', cells:[{t:'A1',l:'L1'},{t:'F1',l:'L2'},null,{t:'D1',l:'L3'},{t:'TB1',l:'L4'},{t:'TG1',l:'L5'},null,null,{t:'A2',l:'L31'},{t:'F2',l:'L32'},{t:'D2',l:'L33'},{t:'TB2',l:'L34'}] },
  { day:'TUE', cells:[{t:'B1',l:'L7'},{t:'G1',l:'L8'},null,{t:'E1',l:'L9'},{t:'TC1',l:'L10'},{t:'TAI1',l:'L11'},null,null,{t:'B2',l:'L37'},{t:'G2',l:'L38'},{t:'E2',l:'L39'},{t:'TC2',l:'L40'}] },
  { day:'WED', cells:[{t:'C1',l:'L13'},{t:'A1',l:'L14'},null,{t:'F1',l:'L15'},{t:'TD1',l:'L16'},{t:'TH1',l:'L17'},null,null,{t:'C2',l:'L43'},{t:'A2',l:'L44'},{t:'F2',l:'L45'},{t:'TD2',l:'L46'}] },
  { day:'THU', cells:[{t:'D1',l:'L19'},{t:'B1',l:'L20'},null,{t:'G1',l:'L21'},{t:'TE1',l:'L22'},{t:'TAJ1',l:'L23'},null,null,{t:'D2',l:'L49'},{t:'B2',l:'L50'},{t:'G2',l:'L51'},{t:'TE2',l:'L52'}] },
  { day:'FRI', cells:[{t:'E1',l:'L25'},{t:'C1',l:'L26'},null,{t:'A1',l:'L27'},{t:'TF1',l:'L28'},{t:'TAK1',l:'L29'},null,null,{t:'E2',l:'L55'},{t:'C2',l:'L56'},{t:'A2',l:'L57'},{t:'TF2',l:'L58'}] },
  { day:'SAT', cells:[{t:'F1',l:null},{t:'D1',l:null},null,{t:'B1',l:null},{t:'G1',l:null},{t:'A1',l:null},null,null,{t:'F2',l:null},{t:'D2',l:null},{t:'B2',l:null},{t:'G2',l:null}] },
];

const ALL_THEORY_SLOTS = [
  'A1','B1','C1','D1','E1','F1','G1','A2','B2','C2','D2','E2','F2','G2',
  'TB1','TC1','TD1','TE1','TF1','TG1','TAI1','TAJ1','TAK1','TH1',
  'TB2','TC2','TD2','TE2','TF2'
];

let courses = [];
let addSlot = '';
let editingCourseId = '';

export function loadCourses() {
  try {
    courses = JSON.parse(localStorage.getItem('eduhub_vit_courses') || '[]');
  } catch {
    courses = [];
  }
  return courses;
}

export function saveCourses() {
  localStorage.setItem('eduhub_vit_courses', JSON.stringify(courses));
}

export function getCourseForSlot(slot) {
  return courses.find(c => c.slots.includes(slot)) || null;
}

export function buildTimetable() {
  const table = document.getElementById('timetable');
  if (!table) return;
  table.innerHTML = '';

  const thead1 = table.createTHead();
  const theoryRow = thead1.insertRow();
  theoryRow.className = 'theory-head';
  const dayTh1 = document.createElement('th');
  dayTh1.textContent = 'Day';
  dayTh1.rowSpan = 2;
  dayTh1.style.background = 'var(--surface2)';
  theoryRow.appendChild(dayTh1);

  TT_THEORY_HEADERS.forEach((h, i) => {
    const th = document.createElement('th');
    if (h === 'LUNCH') {
      th.textContent = 'LUNCH';
      th.className = 'td-lunch';
      th.rowSpan = 2;
    } else {
      th.textContent = h;
    }
    theoryRow.appendChild(th);
  });

  const labRow = thead1.insertRow();
  labRow.className = 'lab-head';
  TT_LAB_HEADERS.forEach((h, i) => {
    if (TT_THEORY_HEADERS[i] === 'LUNCH') return;
    const th = document.createElement('th');
    th.textContent = h;
    labRow.appendChild(th);
  });

  const tbody = table.createTBody();
  TT_ROWS.forEach(rowDef => {
    const tr = tbody.insertRow();
    const dayCell = tr.insertCell();
    dayCell.textContent = rowDef.day;
    dayCell.className = 'td-day';

    rowDef.cells.forEach((cell, ci) => {
      const td = tr.insertCell();
      if (cell === null) {
        td.className = 'td-lunch';
        td.textContent = '';
        return;
      }
      td.className = 'td-cell';
      renderCell(td, cell);
      td.addEventListener('click', () => handleCellClick(td, cell));
      td.addEventListener('dblclick', () => handleCellDblClick(td, cell));
    });
  });
}

function renderCell(td, cell) {
  const theoryFill = cell.t ? getCourseForSlot(cell.t) : null;
  const labFill = cell.l ? getCourseForSlot(cell.l) : null;
  const fill = theoryFill || labFill;

  if (fill) {
    const filledSlot = theoryFill ? cell.t : cell.l;
    td.innerHTML = `<div class="cell-filled">
      <div class="cf-slot">${filledSlot}</div>
      <div class="cf-name">${filledSlot === cell.t ? fill.code : fill.code + ' (Lab)'}</div>
      <div class="cf-venue">${fill.venue || ''}</div>
    </div>`;
  } else {
    const parts = [cell.t, cell.l].filter(Boolean);
    td.innerHTML = `<span class="cell-default">${parts.join(' / ')}</span>`;
  }
}

function handleCellClick(td, cell) {
  const theoryFill = cell.t ? getCourseForSlot(cell.t) : null;
  const labFill = cell.l ? getCourseForSlot(cell.l) : null;
  if (theoryFill || labFill) return;

  const slots = [cell.t, cell.l].filter(Boolean);
  if (slots.length === 0) return;

  if (slots.length === 1) {
    openAddModal(slots[0]);
  } else {
    openAddModal(slots[0]); // default to theory, user can choice
  }
}

function handleCellDblClick(td, cell) {
  const theoryFill = cell.t ? getCourseForSlot(cell.t) : null;
  const labFill = cell.l ? getCourseForSlot(cell.l) : null;
  const fill = theoryFill || labFill;
  if (fill) openEditModal(fill);
}

function openAddModal(slot) {
  addSlot = slot;
  document.getElementById('modal-slot-tag').textContent = slot;
  document.getElementById('modal-times').textContent = getSlotTimes(slot);
  document.getElementById('m-code').value = '';
  document.getElementById('m-title').value = '';
  document.getElementById('m-faculty').value = '';
  document.getElementById('m-venue').value = '';
  document.getElementById('m-credits').value = '4';
  openModal('modal-add');
  setTimeout(() => document.getElementById('m-code').focus(), 100);
}

function getSlotTimes(slot) {
  const map = {
    A1:'8:00–8:50', B1:'8:55–9:45', C1:'9:50–10:40', D1:'10:45–11:35',
    E1:'11:40–12:30', F1:'12:35–1:25', G1:'1:30–2:20', TB1:'9:50–10:40',
    A2:'1:30–2:20', B2:'2:25–3:15', C2:'3:20–4:10', D2:'4:15–5:05',
    F2:'2:25–3:15', E2:'4:15–5:05', G2:'3:20–4:10',
  };
  return map[slot] ? `Time: ${map[slot]}` : '';
}

function openEditModal(course) {
  editingCourseId = course.id;
  document.getElementById('edit-slot-tag').textContent = course.slots.join(' + ');
  document.getElementById('e-code').value = course.code;
  document.getElementById('e-title').value = course.title;
  document.getElementById('e-faculty').value = course.faculty;
  document.getElementById('e-venue').value = course.venue;
  document.getElementById('e-credits').value = course.credits;
  openModal('modal-edit');
}

export function renderCourseList() {
  const tbody = document.getElementById('cl-body');
  const badge = document.getElementById('credit-badge');
  const total = document.getElementById('cl-total');
  if (!tbody) return;

  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
  if (badge) badge.textContent = totalCredits + ' Credits';
  if (total) total.textContent = totalCredits;

  if (courses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="cl-empty">No courses yet. Click a timetable cell to add one.</td></tr>`;
    return;
  }
  tbody.innerHTML = courses.map(c => `
    <tr>
      <td><strong>${c.slots.join(', ')}</strong></td>
      <td>${c.code}</td>
      <td>${c.title}</td>
      <td>${c.faculty || '—'}</td>
      <td>${c.venue || '—'}</td>
      <td>${c.credits}</td>
      <td><button class="cl-del" onclick="deleteCourse('${c.id}')"><i class="fa-solid fa-trash"></i></button></td>
    </tr>
  `).join('');
}

export function deleteCourse(id) {
  courses = courses.filter(c => c.id !== id);
  saveCourses();
  buildTimetable();
  renderCourseList();
  showToast('Course removed.', 'info');
}

export function initFFCSPlanner() {
  window.deleteCourse = deleteCourse;

  loadCourses();
  buildTimetable();
  renderCourseList();

  // Add Save
  document.getElementById('modal-add-save')?.addEventListener('click', () => {
    const code = document.getElementById('m-code').value.trim().toUpperCase();
    const title = document.getElementById('m-title').value.trim();
    const faculty = document.getElementById('m-faculty').value.trim();
    const venue = document.getElementById('m-venue').value.trim().toUpperCase();
    const credits = parseInt(document.getElementById('m-credits').value) || 0;

    if (!code || !title) { showToast('Course code and title are required.', 'error'); return; }
    if (credits < 1 || credits > 10) { showToast('Credits must be between 1 and 10.', 'error'); return; }

    const conflict = courses.find(c => c.slots.includes(addSlot));
    if (conflict) {
      document.getElementById('conflict-msg').textContent = `Slot ${addSlot} is already used by ${conflict.code} — ${conflict.title}.`;
      closeModal('modal-add');
      openModal('modal-conflict');
      return;
    }

    courses.push({ id: Date.now() + '', code, title, faculty, venue, credits, slots: [addSlot] });
    saveCourses();
    buildTimetable();
    renderCourseList();
    closeModal('modal-add');
    showToast(`${code} added to slot ${addSlot}!`, 'success');
  });

  // Edit Save
  document.getElementById('modal-edit-save')?.addEventListener('click', () => {
    const idx = courses.findIndex(c => c.id === editingCourseId);
    if (idx === -1) return;
    courses[idx].code = document.getElementById('e-code').value.trim().toUpperCase();
    courses[idx].title = document.getElementById('e-title').value.trim();
    courses[idx].faculty = document.getElementById('e-faculty').value.trim();
    courses[idx].venue = document.getElementById('e-venue').value.trim().toUpperCase();
    courses[idx].credits = parseInt(document.getElementById('e-credits').value) || courses[idx].credits;
    saveCourses();
    buildTimetable();
    renderCourseList();
    closeModal('modal-edit');
    showToast('Course updated!', 'success');
  });

  // Remove
  document.getElementById('modal-edit-remove')?.addEventListener('click', () => {
    courses = courses.filter(c => c.id !== editingCourseId);
    saveCourses();
    buildTimetable();
    renderCourseList();
    closeModal('modal-edit');
    showToast('Course removed.', 'info');
  });

  // Wire up close buttons
  document.getElementById('modal-add-close')?.addEventListener('click', () => closeModal('modal-add'));
  document.getElementById('modal-add-cancel')?.addEventListener('click', () => closeModal('modal-add'));
  document.getElementById('conflict-ok')?.addEventListener('click', () => closeModal('modal-conflict'));
  document.getElementById('modal-edit-close')?.addEventListener('click', () => closeModal('modal-edit'));
  document.getElementById('modal-edit-cancel')?.addEventListener('click', () => closeModal('modal-edit'));

  // Reset
  document.getElementById('btn-reset')?.addEventListener('click', () => openModal('modal-reset-confirm'));
  document.getElementById('reset-ok')?.addEventListener('click', () => {
    courses = [];
    saveCourses();
    buildTimetable();
    renderCourseList();
    closeModal('modal-reset-confirm');
    showToast('Timetable reset.', 'info');
  });
  document.getElementById('reset-cancel')?.addEventListener('click', () => closeModal('modal-reset-confirm'));

  // Download
  document.getElementById('btn-download-tt')?.addEventListener('click', () => openModal('modal-dl'));
  document.getElementById('dl-cancel')?.addEventListener('click', () => closeModal('modal-dl'));
  document.getElementById('dl-print')?.addEventListener('click', () => { closeModal('modal-dl'); window.print(); });
  document.getElementById('dl-csv')?.addEventListener('click', () => {
    if (courses.length === 0) { showToast('No courses to export.', 'error'); closeModal('modal-dl'); return; }
    const rows = [['Slot','Code','Title','Faculty','Venue','Credits'],
      ...courses.map(c => [c.slots.join('+'), c.code, c.title, c.faculty, c.venue, c.credits])];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ffcs_timetable.csv';
    a.click();
    closeModal('modal-dl');
    showToast('CSV exported!', 'success');
  });

  // Suggest Slots
  document.getElementById('btn-suggest-slots')?.addEventListener('click', () => {
    const used = new Set(courses.flatMap(c => c.slots));
    const free = ALL_THEORY_SLOTS.filter(s => !used.has(s));
    const container = document.getElementById('suggested-slots-list');
    if (container) {
      container.innerHTML = free.length ? free.map(s => `<span class="sug-tag">${s}</span>`).join('') : '<span style="color:var(--muted);font-size:0.85rem;">All slots are taken!</span>';
    }
    openModal('modal-suggestions');
  });
  document.getElementById('modal-suggest-close')?.addEventListener('click', () => closeModal('modal-suggestions'));
  document.getElementById('suggest-ok')?.addEventListener('click', () => closeModal('modal-suggestions'));

  // Quick View
  document.getElementById('btn-quickvis')?.addEventListener('click', () => {
    const list = courses.map(c => `${c.slots.join('+')} — ${c.code} (${c.title})`).join('\n') || 'No courses added yet.';
    alert('Quick View — Your Courses:\n\n' + list);
  });
}
