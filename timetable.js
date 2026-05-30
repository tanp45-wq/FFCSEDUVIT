'use strict';

/* ═══════════════════════════════════════════════════════════════
   FFCS ON THE GO — Vellore Campus
   Exact timetable grid from official VIT Vellore FFCS schedule
   ═══════════════════════════════════════════════════════════════ */

/* ── EXACT GRID DATA ────────────────────────────────────────────
   14 data columns per row + 1 LUNCH marker = 15 entries
   Each cell: { t: theorySlot, l: labSlot }
   Empty string = no slot in that position
   ─────────────────────────────────────────────────────────────── */
const GRID = [
  /* MON */ [
    {t:'A1',l:'L1'}, {t:'F1',l:'L2'}, {t:'D1',l:'L3'},
    {t:'TB1',l:'L4'}, {t:'TG1',l:'L5'}, {t:'',l:'L6'},
    'LUNCH',
    {t:'A2',l:'L31'}, {t:'F2',l:'L32'}, {t:'D2',l:'L33'},
    {t:'TB2',l:'L34'}, {t:'TG2',l:'L35'}, {t:'',l:'L36'},
    {t:'V3',l:''}
  ],
  /* TUE */ [
    {t:'B1',l:'L7'}, {t:'G1',l:'L8'}, {t:'E1',l:'L9'},
    {t:'TC1',l:'L10'}, {t:'TAA1',l:'L11'}, {t:'',l:'L12'},
    'LUNCH',
    {t:'B2',l:'L37'}, {t:'G2',l:'L38'}, {t:'E2',l:'L39'},
    {t:'TC2',l:'L40'}, {t:'TAA2',l:'L41'}, {t:'',l:'L42'},
    {t:'V4',l:''}
  ],
  /* WED */ [
    {t:'C1',l:'L13'}, {t:'A1',l:'L14'}, {t:'F1',l:'L15'},
    {t:'V1',l:'L16'}, {t:'V2',l:'L17'}, {t:'',l:'L18'},
    'LUNCH',
    {t:'C2',l:'L43'}, {t:'A2',l:'L44'}, {t:'F2',l:'L45'},
    {t:'TD2',l:'L46'}, {t:'TBB2',l:'L47'}, {t:'',l:'L48'},
    {t:'V5',l:''}
  ],
  /* THU */ [
    {t:'D1',l:'L19'}, {t:'B1',l:'L20'}, {t:'G1',l:'L21'},
    {t:'TE1',l:'L22'}, {t:'TCC1',l:'L23'}, {t:'',l:'L24'},
    'LUNCH',
    {t:'D2',l:'L49'}, {t:'B2',l:'L50'}, {t:'G2',l:'L51'},
    {t:'TE2',l:'L52'}, {t:'TCC2',l:'L53'}, {t:'',l:'L54'},
    {t:'V6',l:''}
  ],
  /* FRI */ [
    {t:'E1',l:'L25'}, {t:'C1',l:'L26'}, {t:'TA1',l:'L27'},
    {t:'TF1',l:'L28'}, {t:'TD1',l:'L29'}, {t:'',l:'L30'},
    'LUNCH',
    {t:'E2',l:'L55'}, {t:'C2',l:'L56'}, {t:'TA2',l:'L57'},
    {t:'TF2',l:'L58'}, {t:'TDD2',l:'L59'}, {t:'',l:'L60'},
    {t:'V7',l:''}
  ]
];

const DAYS = ['MON','TUE','WED','THU','FRI'];

/* Theory column headers (13 cols, col index maps to array index, skipping lunch) */
const TH_THEORY = [
  '8:00 AM<br>to<br>8:50 AM',
  '9:00 AM<br>to<br>9:50 AM',
  '10:00 AM<br>to<br>10:50 AM',
  '11:00 AM<br>to<br>11:50 AM',
  '12:00 PM<br>to<br>12:50 PM',
  '',                                   /* col 5 — blank for theory */
  null,                                 /* LUNCH placeholder */
  '2:00 PM<br>to<br>2:50 PM',
  '3:00 PM<br>to<br>3:50 PM',
  '4:00 PM<br>to<br>4:50 PM',
  '5:00 PM<br>to<br>5:50 PM',
  '6:00 PM<br>to<br>6:50 PM',
  '6:51 PM<br>to<br>7:00 PM',
  '7:01 PM<br>to<br>7:50 PM'
];

const TH_LAB = [
  '08:00 AM<br>to<br>08:50 AM',
  '08:51 AM<br>to<br>09:40 AM',
  '09:51 AM<br>to<br>10:40 AM',
  '10:41 AM<br>to<br>11:30 AM',
  '11:40 AM<br>to<br>12:30 PM',
  '12:31 PM<br>to<br>1:20 PM',
  null,                                 /* LUNCH placeholder */
  '2:00 PM<br>to<br>2:50 PM',
  '2:51 PM<br>to<br>3:40 PM',
  '3:51 PM<br>to<br>4:40 PM',
  '4:41 PM<br>to<br>5:30 PM',
  '5:40 PM<br>to<br>6:30 PM',
  '6:31 PM<br>to<br>7:20 PM',
  ''                                    /* col 13 — blank for lab */
];

/* ── Collect all unique slot names from grid ─────────────────── */
const ALL_SLOTS = [];
const _seenSlots = new Set();
GRID.forEach(row => {
  row.forEach(cell => {
    if (!cell || cell === 'LUNCH') return;
    [cell.t, cell.l].filter(Boolean).forEach(s => {
      if (!_seenSlots.has(s)) { _seenSlots.add(s); ALL_SLOTS.push(s); }
    });
  });
});
ALL_SLOTS.sort((a, b) => {
  const aL = /^L\d/.test(a), bL = /^L\d/.test(b);
  if (aL !== bL) return aL ? 1 : -1;
  return a.localeCompare(b, undefined, {numeric: true});
});

/* ── Build reverse lookup: slotName → [{day, col}] ───────────── */
const SLOT_POS = {};
GRID.forEach((row, di) => {
  row.forEach((cell, ci) => {
    if (!cell || cell === 'LUNCH') return;
    [cell.t, cell.l].filter(Boolean).forEach(s => {
      if (!SLOT_POS[s]) SLOT_POS[s] = [];
      SLOT_POS[s].push({day: di, col: ci});
    });
  });
});

/* ── Colors per slot prefix ──────────────────────────────────── */
const SLOT_COLORS = {
  A:'#3b82f6', B:'#8b5cf6', C:'#0891b2', D:'#10b981',
  E:'#f59e0b', F:'#ef4444', G:'#ec4899', V:'#64748b',
  L:'#14b8a6', T:'#6366f1'
};
function slotColor(s) {
  if (!s) return '#7c3aed';
  if (/^L\d/.test(s)) return SLOT_COLORS.L;
  if (/^V/.test(s))   return SLOT_COLORS.V;
  if (/^T/.test(s))   return SLOT_COLORS.T;
  return SLOT_COLORS[s[0]] || '#7c3aed';
}
function toRgba(hex, a) {
  const r = parseInt(hex.slice(1,3),16),
        g = parseInt(hex.slice(3,5),16),
        b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ═══════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════ */
let courses   = [];
let selSlot   = null;
let quickView = false;
let idCtr     = 1;

function save() {
  try {
    localStorage.setItem('ffcs_vellore_courses', JSON.stringify(courses));
    localStorage.setItem('ffcs_vellore_id',      String(idCtr));
  } catch(e) {}
}
function loadSaved() {
  try {
    const c = localStorage.getItem('ffcs_vellore_courses');
    const i = localStorage.getItem('ffcs_vellore_id');
    if (c) courses = JSON.parse(c);
    if (i) idCtr   = parseInt(i, 10) || 1;
  } catch(e) {}
}

/* ═══════════════════════════════════════════════════════════════
   BUILD TIMETABLE TABLE
   Matches the exact visual from the screenshot:
   - Row 1 header: corner(rowspan=2) | THEORY HOURS | time cols | LUNCH(rowspan=2) | time cols
   - Row 2 header: LAB HOURS | time cols | time cols
   - Body rows: day label | data cells | lunch | data cells
   ═══════════════════════════════════════════════════════════════ */
function buildTable() {
  const tbl = document.getElementById('timetable');
  tbl.innerHTML = '';
  const thead = document.createElement('thead');

  /* ── Header Row 1: THEORY HOURS ── */
  const tr1 = document.createElement('tr');

  /* Corner cell spans 2 header rows */
  const tdCorner = mkTH('', 'th-corner');
  tdCorner.rowSpan = 2;
  tr1.appendChild(tdCorner);

  /* "THEORY HOURS" label */
  tr1.appendChild(mkTH('THEORY<br>HOURS', 'th-type'));

  /* Morning time cols 0-5 */
  for (let c = 0; c <= 5; c++) {
    const cls = (c < 5) ? 'th-time' : 'th-time th-time-blank';
    tr1.appendChild(mkTH(TH_THEORY[c] || '', cls));
  }

  /* LUNCH header spans 2 rows */
  const tdLunch = mkTH('LUNCH', 'th-lunch');
  tdLunch.rowSpan = 2;
  tr1.appendChild(tdLunch);

  /* Afternoon cols 7-13 (indices in TH_THEORY) */
  for (let c = 7; c <= 13; c++) {
    const isV = c === 13;
    tr1.appendChild(mkTH(TH_THEORY[c] || '', isV ? 'th-v' : 'th-time'));
  }
  thead.appendChild(tr1);

  /* ── Header Row 2: LAB HOURS ── */
  const tr2 = document.createElement('tr');
  tr2.appendChild(mkTH('LAB<br>HOURS', 'th-type'));

  /* Morning lab cols 0-5 */
  for (let c = 0; c <= 5; c++) {
    tr2.appendChild(mkTH(TH_LAB[c] || '', 'th-time th-time-lab'));
  }

  /* Afternoon lab cols 7-13 */
  for (let c = 7; c <= 13; c++) {
    const isV = c === 13;
    tr2.appendChild(mkTH(TH_LAB[c] || '', isV ? 'th-v' : 'th-time th-time-lab'));
  }
  thead.appendChild(tr2);
  tbl.appendChild(thead);

  /* ── Body Rows ── */
  const tbody = document.createElement('tbody');
  GRID.forEach((row, di) => {
    const tr = document.createElement('tr');

    /* Day label */
    const dayTd = document.createElement('td');
    dayTd.className = 'td-day';
    dayTd.textContent = DAYS[di];
    tr.appendChild(dayTd);

    row.forEach((cell, ci) => {
      if (cell === 'LUNCH') {
        const td = document.createElement('td');
        td.className = 'td-lunch-body';
        tr.appendChild(td);
        return;
      }
      const td = document.createElement('td');
      td.className = (ci === 13) ? 'td-v' : 'td-cell';
      td.dataset.day = di;
      td.dataset.col = ci;
      td.addEventListener('dblclick', () => onCellDbl(di, ci));
      renderCellDefault(td, cell);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
}

function mkTH(html, cls) {
  const th = document.createElement('th');
  th.innerHTML = html;
  th.className = cls;
  return th;
}

/* ═══════════════════════════════════════════════════════════════
   CELL RENDERING
   ═══════════════════════════════════════════════════════════════ */
function renderCellDefault(td, cell) {
  if (!cell) { td.innerHTML = ''; td.style.background = ''; return; }
  const parts = [cell.t, cell.l].filter(Boolean).join(' / ');
  td.innerHTML = `<span class="cell-default">${parts}</span>`;
  td.style.background = '';
}

function renderCellFilled(td, cell, course) {
  const color = slotColor(course.slot);
  const bg    = toRgba(color, 0.18);
  td.style.background = bg;

  const theoryPart = cell.t ? `<span>${cell.t}</span>` : '';
  const labPart    = cell.l ? `<span>${cell.l}</span>` : '';
  const sep        = (cell.t && cell.l) ? ' / ' : '';
  const slotLabel  = [cell.t, cell.l].filter(Boolean).join(' / ');

  const shortName = quickView ? '' :
    `<div class="cf-name" title="${escHtml(course.title || course.code || '')}">${escHtml((course.code || course.title || '').substring(0, 10))}</div>`;

  td.innerHTML = `
    <div class="cell-filled" style="color:${color}">
      <div class="cf-slot">${escHtml(slotLabel)}</div>
      ${shortName}
    </div>`;
}

function refreshAllCells() {
  GRID.forEach((row, di) => {
    row.forEach((cell, ci) => {
      if (!cell || cell === 'LUNCH') return;
      const td = document.querySelector(`#timetable td[data-day="${di}"][data-col="${ci}"]`);
      if (!td) return;
      const course = courses.find(c =>
        (SLOT_POS[c.slot] || []).some(p => p.day === di && p.col === ci)
      );
      if (course) renderCellFilled(td, cell, course);
      else        renderCellDefault(td, cell);
    });
  });
}

function onCellDbl(di, ci) {
  const course = courses.find(c =>
    (SLOT_POS[c.slot] || []).some(p => p.day === di && p.col === ci)
  );
  if (course) loadCourseToPanel(course);
}

/* ═══════════════════════════════════════════════════════════════
   SLOT SELECTOR PANEL
   ═══════════════════════════════════════════════════════════════ */
function buildSlotSelector() {
  const container = document.getElementById('slot-selector');
  container.innerHTML = '';

  /* Group slots: Theory first, then Lab */
  const theory = ALL_SLOTS.filter(s => !/^L\d/.test(s));
  const lab    = ALL_SLOTS.filter(s =>  /^L\d/.test(s));

  /* Theory label */
  const tLabel = document.createElement('span');
  tLabel.style.cssText = 'font-size:0.68rem;font-weight:700;color:#6366f1;align-self:center;padding:0 4px;';
  tLabel.textContent = 'THEORY:';
  container.appendChild(tLabel);

  theory.forEach(slot => container.appendChild(makeSlotBtn(slot)));

  /* Lab label */
  const lLabel = document.createElement('span');
  lLabel.style.cssText = 'font-size:0.68rem;font-weight:700;color:#14b8a6;align-self:center;padding:0 4px;margin-left:6px;';
  lLabel.textContent = 'LAB:';
  container.appendChild(lLabel);

  lab.forEach(slot => container.appendChild(makeSlotBtn(slot)));
}

function makeSlotBtn(slot) {
  const btn = document.createElement('button');
  btn.className = 'slot-chip-btn';
  btn.textContent = slot;
  btn.dataset.slot = slot;
  /* Assign stype for CSS colour */
  if      (/^L\d/.test(slot)) btn.dataset.stype = 'L';
  else if (/^V/.test(slot))   btn.dataset.stype = 'V';
  else if (/^T/.test(slot))   btn.dataset.stype = 'T';
  else                        btn.dataset.stype = slot[0];

  btn.addEventListener('click', () => pickSlot(slot, btn));
  return btn;
}

function pickSlot(slot, btn) {
  document.querySelectorAll('.slot-chip-btn').forEach(b => b.classList.remove('slot-selected'));
  selSlot = slot;
  btn.classList.add('slot-selected');
  const info = document.getElementById('selected-slot-info');
  info.textContent = `Selected: ${slot}`;
  info.classList.add('has-slot');
}

function refreshSlotSelector() {
  const used = new Set(courses.map(c => c.slot));
  document.querySelectorAll('.slot-chip-btn').forEach(btn => {
    btn.classList.toggle('slot-occupied', used.has(btn.dataset.slot));
  });
}

/* ═══════════════════════════════════════════════════════════════
   ADD COURSE
   ═══════════════════════════════════════════════════════════════ */
function addCourse() {
  const code    = document.getElementById('inp-code').value.trim().toUpperCase();
  const title   = document.getElementById('inp-title').value.trim();
  const faculty = document.getElementById('inp-faculty').value.trim();
  const venue   = document.getElementById('inp-venue').value.trim();
  const credits = document.getElementById('inp-credits').value.trim();

  if (!code && !title) { showToast('Enter a Course Code or Title.'); return; }
  if (!selSlot)        { showToast('Select a slot first.');           return; }

  /* Conflict check */
  const conflict = courses.find(c => c.slot === selSlot);
  if (conflict) {
    document.getElementById('modal-conflict-msg').textContent =
      `Slot "${selSlot}" is already used by "${conflict.title || conflict.code}". Remove it first or choose a different slot.`;
    openModal('modal-conflict');
    return;
  }

  const course = {
    id: idCtr++,
    code, title, faculty, venue, credits,
    slot: selSlot
  };
  courses.push(course);
  save();
  refreshAllCells();
  renderCourseList();
  refreshSlotSelector();
  clearForm();
  showToast(`✓ "${code || title}" added to slot ${selSlot}`);
}

/* ═══════════════════════════════════════════════════════════════
   REMOVE COURSE
   ═══════════════════════════════════════════════════════════════ */
function removeCourse(id) {
  courses = courses.filter(c => c.id !== id);
  save();
  refreshAllCells();
  renderCourseList();
  refreshSlotSelector();
}

/* ═══════════════════════════════════════════════════════════════
   LOAD COURSE BACK INTO PANEL
   ═══════════════════════════════════════════════════════════════ */
function loadCourseToPanel(course) {
  document.getElementById('inp-code').value    = course.code    || '';
  document.getElementById('inp-title').value   = course.title   || '';
  document.getElementById('inp-faculty').value = course.faculty || '';
  document.getElementById('inp-venue').value   = course.venue   || '';
  document.getElementById('inp-credits').value = course.credits || '';

  const btn = document.querySelector(`.slot-chip-btn[data-slot="${course.slot}"]`);
  if (btn) pickSlot(course.slot, btn);

  /* Scroll to panel */
  document.getElementById('course-panel').scrollIntoView({ behavior: 'smooth' });
  showToast('Course loaded into panel — edit and re-add.');
}

/* ═══════════════════════════════════════════════════════════════
   CLEAR FORM
   ═══════════════════════════════════════════════════════════════ */
function clearForm() {
  ['inp-code','inp-title','inp-faculty','inp-venue','inp-credits']
    .forEach(id => { document.getElementById(id).value = ''; });
  selSlot = null;
  document.querySelectorAll('.slot-chip-btn').forEach(b => b.classList.remove('slot-selected'));
  const info = document.getElementById('selected-slot-info');
  info.textContent = 'No slot selected';
  info.classList.remove('has-slot');
}

/* ═══════════════════════════════════════════════════════════════
   RENDER COURSE LIST TABLE
   ═══════════════════════════════════════════════════════════════ */
function renderCourseList() {
  const tbody = document.getElementById('courselist-body');
  tbody.innerHTML = '';

  if (courses.length === 0) {
    const tr = document.createElement('tr');
    tr.className = 'empty-courselist';
    tr.innerHTML = `<td colspan="7">No courses added yet. Add your first course above.</td>`;
    tbody.appendChild(tr);
    document.getElementById('total-credits').textContent = '0';
    return;
  }

  let totalCredits = 0;
  courses.forEach(c => {
    totalCredits += parseInt(c.credits) || 0;
    const color = slotColor(c.slot);
    const tr = document.createElement('tr');
    tr.dataset.id = c.id;
    tr.title = 'Double-click to load back into panel';
    tr.innerHTML = `
      <td>
        <span class="cl-slot-badge" style="background:${toRgba(color,.15)};color:${color};border:1px solid ${toRgba(color,.4)}">
          ${escHtml(c.slot)}
        </span>
      </td>
      <td>${escHtml(c.code || '—')}</td>
      <td style="font-weight:500;color:#1e293b">${escHtml(c.title || '—')}</td>
      <td>${escHtml(c.faculty || '—')}</td>
      <td>${escHtml(c.venue || '—')}</td>
      <td style="text-align:center">${escHtml(c.credits || '—')}</td>
      <td style="text-align:center">
        <button class="cl-remove-btn" data-id="${c.id}" title="Remove">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>`;
    tr.addEventListener('dblclick', () => loadCourseToPanel(c));
    tbody.appendChild(tr);
  });

  document.getElementById('total-credits').textContent = totalCredits;

  /* Wire remove buttons */
  tbody.querySelectorAll('.cl-remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      removeCourse(parseInt(btn.dataset.id));
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   RESET
   ═══════════════════════════════════════════════════════════════ */
function resetAll() {
  courses = [];
  save();
  refreshAllCells();
  renderCourseList();
  refreshSlotSelector();
  clearForm();
  showToast('Timetable has been reset.');
}

/* ═══════════════════════════════════════════════════════════════
   QUICK VISUALIZATION
   Hides course names, shows only slot codes in cells
   ═══════════════════════════════════════════════════════════════ */
function toggleQuickView() {
  quickView = !quickView;
  const btn = document.getElementById('btn-quickvis');
  if (quickView) {
    btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Disable Quick Visualization';
    btn.classList.add('qv-active');
  } else {
    btn.innerHTML = '<i class="fa-regular fa-eye"></i> Enable Quick Visualization';
    btn.classList.remove('qv-active');
  }
  refreshAllCells();
}

/* ═══════════════════════════════════════════════════════════════
   DOWNLOAD
   ═══════════════════════════════════════════════════════════════ */
function downloadCSV() {
  if (courses.length === 0) { showToast('No courses to export.'); return; }
  const headers = ['Slot','Course Code','Course Title','Faculty','Venue','Credits'];
  const rows = courses.map(c => [c.slot, c.code, c.title, c.faculty, c.venue, c.credits]);
  const csv = [headers, ...rows]
    .map(r => r.map(x => `"${(x || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const a = document.createElement('a');
  a.href     = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'ffcs-timetable.csv';
  a.click();
  showToast('CSV downloaded!');
}

/* ═══════════════════════════════════════════════════════════════
   MODAL HELPERS
   ═══════════════════════════════════════════════════════════════ */
function openModal(id) {
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById(id).classList.remove('hidden');
}
function closeModals() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
}

/* ═══════════════════════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════════════════════ */
let _toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  el.classList.remove('hidden');
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.classList.add('hidden'), 300);
  }, 2800);
}

/* ═══════════════════════════════════════════════════════════════
   UTILITY
   ═══════════════════════════════════════════════════════════════ */
function escHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadSaved();
  buildTable();
  buildSlotSelector();
  refreshAllCells();
  renderCourseList();
  refreshSlotSelector();

  /* Panel */
  document.getElementById('btn-add').addEventListener('click', addCourse);
  document.getElementById('btn-clear-form').addEventListener('click', clearForm);
  ['inp-code','inp-title','inp-faculty','inp-venue','inp-credits'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') addCourse();
    });
  });

  /* Action bar */
  document.getElementById('btn-download-tt').addEventListener('click', () => openModal('modal-download'));
  document.getElementById('btn-quickvis').addEventListener('click', toggleQuickView);
  document.getElementById('btn-reset').addEventListener('click', () => openModal('modal-reset'));
  document.getElementById('btn-default-table').addEventListener('click', () =>
    showToast('You are on the Default Table (Vellore Campus).')
  );
  document.getElementById('btn-add-table').addEventListener('click', () =>
    showToast('Only one table is supported in this version.')
  );

  /* Modal: conflict */
  document.getElementById('modal-conflict-ok').addEventListener('click', closeModals);

  /* Modal: reset */
  document.getElementById('modal-reset-cancel').addEventListener('click', closeModals);
  document.getElementById('modal-reset-confirm').addEventListener('click', () => {
    closeModals(); resetAll();
  });

  /* Modal: download */
  document.getElementById('dl-print').addEventListener('click', () => {
    closeModals();
    showToast('Opening print dialog — choose "Save as PDF".');
    setTimeout(() => window.print(), 500);
  });
  document.getElementById('dl-csv').addEventListener('click', () => {
    closeModals(); downloadCSV();
  });
  document.getElementById('dl-cancel').addEventListener('click', closeModals);

  /* Overlay click */
  document.getElementById('modal-overlay').addEventListener('click', closeModals);
});
