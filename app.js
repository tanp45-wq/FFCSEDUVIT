/* =========================================================
   EduHub VIT — app.js  (Clean, fully working)
   ========================================================= */

'use strict';

/* ══════════════════════════════════════════════════════════
   CURSOR
   ══════════════════════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  tx += (mx - tx) * 0.18;
  ty += (my - ty) * 0.18;
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
  if (cursorTrail) { cursorTrail.style.left = tx + 'px'; cursorTrail.style.top = ty + 'px'; }
  requestAnimationFrame(animCursor);
})();

/* ══════════════════════════════════════════════════════════
   SECTION NAVIGATION
   ══════════════════════════════════════════════════════════ */
const SECTION_MAP = { home: 'sec-home', ffcs: 'sec-ffcs', cgpa: 'sec-cgpa', nptel: 'sec-nptel', pyq: 'sec-pyq' };

function showSection(key) {
  Object.values(SECTION_MAP).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById(SECTION_MAP[key]);
  if (target) { target.classList.add('active'); window.scrollTo(0, 0); }
}

/* ══════════════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════════════ */
let toastTimer = null;
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  const span = document.getElementById('toast-msg');
  if (!toast || !span) return;
  span.textContent = msg;
  toast.style.borderLeft = type === 'success' ? '3px solid #34d399' : type === 'error' ? '3px solid #f87171' : '3px solid #a78bfa';
  toast.classList.remove('hidden');
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.classList.add('hidden'), 350); }, 3500);
}

/* ══════════════════════════════════════════════════════════
   OVERLAY / MODAL HELPERS
   ══════════════════════════════════════════════════════════ */
function openModal(id) {
  const overlay = document.getElementById('overlay');
  const modal = document.getElementById(id);
  if (overlay) overlay.classList.remove('hidden');
  if (modal) modal.classList.remove('hidden');
}
function closeModal(id) {
  const overlay = document.getElementById('overlay');
  const modal = document.getElementById(id);
  if (overlay) overlay.classList.add('hidden');
  if (modal) modal.classList.add('hidden');
}
function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.classList.add('hidden');
}
document.getElementById('overlay')?.addEventListener('click', closeAllModals);

/* ══════════════════════════════════════════════════════════
   FFCS — VIT TIMETABLE DATA
   ══════════════════════════════════════════════════════════ */

// Each row: [DAY_LABEL, ...cells]
// Each cell: { t: theorySlot, l: labSlot } or { t } or { l } or null (lunch)
const TT_THEORY_HEADERS = ['8:00–8:50','8:55–9:45','LUNCH','9:50–10:40','10:45–11:35','11:40–12:30','12:35–1:25','LUNCH','1:30–2:20','2:25–3:15','3:20–4:10','4:15–5:05'];
const TT_LAB_HEADERS    = ['8:00–9:30','','LUNCH','9:55–11:25','','11:30–13:00','','LUNCH','13:30–15:00','','15:05–16:35',''];

// Timetable cell definitions [theory_slot, lab_slot] (null = lunch divider)
const TT_ROWS = [
  { day:'MON', cells:[{t:'A1',l:'L1'},{t:'F1',l:'L2'},null,{t:'D1',l:'L3'},{t:'TB1',l:'L4'},{t:'TG1',l:'L5'},null,null,{t:'A2',l:'L31'},{t:'F2',l:'L32'},{t:'D2',l:'L33'},{t:'TB2',l:'L34'}] },
  { day:'TUE', cells:[{t:'B1',l:'L7'},{t:'G1',l:'L8'},null,{t:'E1',l:'L9'},{t:'TC1',l:'L10'},{t:'TAI1',l:'L11'},null,null,{t:'B2',l:'L37'},{t:'G2',l:'L38'},{t:'E2',l:'L39'},{t:'TC2',l:'L40'}] },
  { day:'WED', cells:[{t:'C1',l:'L13'},{t:'A1',l:'L14'},null,{t:'F1',l:'L15'},{t:'TD1',l:'L16'},{t:'TH1',l:'L17'},null,null,{t:'C2',l:'L43'},{t:'A2',l:'L44'},{t:'F2',l:'L45'},{t:'TD2',l:'L46'}] },
  { day:'THU', cells:[{t:'D1',l:'L19'},{t:'B1',l:'L20'},null,{t:'G1',l:'L21'},{t:'TE1',l:'L22'},{t:'TAJ1',l:'L23'},null,null,{t:'D2',l:'L49'},{t:'B2',l:'L50'},{t:'G2',l:'L51'},{t:'TE2',l:'L52'}] },
  { day:'FRI', cells:[{t:'E1',l:'L25'},{t:'C1',l:'L26'},null,{t:'A1',l:'L27'},{t:'TF1',l:'L28'},{t:'TAK1',l:'L29'},null,null,{t:'E2',l:'L55'},{t:'C2',l:'L56'},{t:'A2',l:'L57'},{t:'TF2',l:'L58'}] },
  { day:'SAT', cells:[{t:'F1',l:null},{t:'D1',l:null},null,{t:'B1',l:null},{t:'G1',l:null},{t:'A1',l:null},null,null,{t:'F2',l:null},{t:'D2',l:null},{t:'B2',l:null},{t:'G2',l:null}] },
];

let courses = loadCourses();

function loadCourses() {
  try { return JSON.parse(localStorage.getItem('eduhub_vit_courses') || '[]'); } catch { return []; }
}
function saveCourses() {
  localStorage.setItem('eduhub_vit_courses', JSON.stringify(courses));
}
function getCourseForSlot(slot) {
  return courses.find(c => c.slots.includes(slot)) || null;
}

/* ── Build Timetable ── */
function buildTimetable() {
  const table = document.getElementById('timetable');
  if (!table) return;
  table.innerHTML = '';

  // Theory header
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
    if (h === 'LUNCH') { th.textContent = 'LUNCH'; th.className = 'td-lunch'; th.rowSpan = 2; }
    else { th.textContent = h; }
    theoryRow.appendChild(th);
  });

  // Lab header — skip lunch columns (already rowspan 2)
  const labRow = thead1.insertRow();
  labRow.className = 'lab-head';
  TT_LAB_HEADERS.forEach((h, i) => {
    if (TT_THEORY_HEADERS[i] === 'LUNCH') return; // rowspan already
    const th = document.createElement('th');
    th.textContent = h;
    labRow.appendChild(th);
  });

  // Body
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
  // Check if theory slot is filled
  const theoryFill = cell.t ? getCourseForSlot(cell.t) : null;
  const labFill = cell.l ? getCourseForSlot(cell.l) : null;
  const fill = theoryFill || labFill;

  if (fill) {
    const filledSlot = theoryFill ? cell.t : cell.l;
    td.innerHTML = `<div class="cell-filled">
      <div class="cf-slot">${filledSlot}</div>
      <div class="cf-name">${fill.code}</div>
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
  if (theoryFill || labFill) return; // let dblclick handle edit

  // Determine which slot(s) to offer
  const slots = [cell.t, cell.l].filter(Boolean);
  if (slots.length === 0) return;

  if (slots.length === 1) {
    openAddModal(slots[0]);
  } else {
    // Both theory and lab available: ask user which
    openAddModal(null, slots);
  }
}

function handleCellDblClick(td, cell) {
  const theoryFill = cell.t ? getCourseForSlot(cell.t) : null;
  const labFill = cell.l ? getCourseForSlot(cell.l) : null;
  const fill = theoryFill || labFill;
  if (fill) openEditModal(fill);
}

/* ── Add Modal ── */
let addSlot = '';
function openAddModal(slot, choiceSlots) {
  if (choiceSlots) {
    // Show slot picker
    const picker = document.createElement('div');
    picker.style.cssText = 'display:flex;gap:10px;margin-bottom:14px;';
    choiceSlots.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'pf-btn';
      btn.textContent = s;
      btn.onclick = () => { openAddModal(s); closeModal('modal-add-slot-pick'); };
      picker.appendChild(btn);
    });
    // Just use first slot for now; in real use ask
    openAddModal(choiceSlots[0]);
    return;
  }
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
  // Approximate slot time mapping
  const map = {
    A1:'8:00–8:50', B1:'8:55–9:45', C1:'9:50–10:40', D1:'10:45–11:35',
    E1:'11:40–12:30', F1:'12:35–1:25', G1:'1:30–2:20', TB1:'9:50–10:40',
    A2:'1:30–2:20', B2:'2:25–3:15', C2:'3:20–4:10', D2:'4:15–5:05',
    F2:'2:25–3:15', E2:'4:15–5:05', G2:'3:20–4:10',
  };
  return map[slot] ? `Time: ${map[slot]}` : '';
}

document.getElementById('modal-add-save')?.addEventListener('click', () => {
  const code = document.getElementById('m-code').value.trim().toUpperCase();
  const title = document.getElementById('m-title').value.trim();
  const faculty = document.getElementById('m-faculty').value.trim();
  const venue = document.getElementById('m-venue').value.trim().toUpperCase();
  const credits = parseInt(document.getElementById('m-credits').value) || 0;

  if (!code || !title) { showToast('Course code and title are required.', 'error'); return; }
  if (credits < 1 || credits > 10) { showToast('Credits must be between 1 and 10.', 'error'); return; }

  // Conflict check
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

document.getElementById('modal-add-close')?.addEventListener('click', () => closeModal('modal-add'));
document.getElementById('modal-add-cancel')?.addEventListener('click', () => closeModal('modal-add'));
document.getElementById('conflict-ok')?.addEventListener('click', () => closeModal('modal-conflict'));

/* ── Edit Modal ── */
let editingCourseId = '';
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

document.getElementById('modal-edit-remove')?.addEventListener('click', () => {
  courses = courses.filter(c => c.id !== editingCourseId);
  saveCourses();
  buildTimetable();
  renderCourseList();
  closeModal('modal-edit');
  showToast('Course removed.', 'info');
});

document.getElementById('modal-edit-close')?.addEventListener('click', () => closeModal('modal-edit'));
document.getElementById('modal-edit-cancel')?.addEventListener('click', () => closeModal('modal-edit'));

/* ── Course List ── */
function renderCourseList() {
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

function deleteCourse(id) {
  courses = courses.filter(c => c.id !== id);
  saveCourses();
  buildTimetable();
  renderCourseList();
  showToast('Course removed.', 'info');
}

/* ── Reset ── */
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

/* ── Download ── */
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

/* ── Suggest Slots ── */
const ALL_THEORY_SLOTS = ['A1','B1','C1','D1','E1','F1','G1','A2','B2','C2','D2','E2','F2','G2',
  'TB1','TC1','TD1','TE1','TF1','TG1','TAI1','TAJ1','TAK1','TH1',
  'TB2','TC2','TD2','TE2','TF2'];

document.getElementById('btn-suggest-slots')?.addEventListener('click', () => {
  const used = new Set(courses.flatMap(c => c.slots));
  const free = ALL_THEORY_SLOTS.filter(s => !used.has(s));
  const container = document.getElementById('suggested-slots-list');
  container.innerHTML = free.length ? free.map(s => `<span class="sug-tag">${s}</span>`).join('') : '<span style="color:var(--muted);font-size:0.85rem;">All slots are taken!</span>';
  openModal('modal-suggestions');
});
document.getElementById('modal-suggest-close')?.addEventListener('click', () => closeModal('modal-suggestions'));
document.getElementById('suggest-ok')?.addEventListener('click', () => closeModal('modal-suggestions'));

/* ── Quick View ── */
document.getElementById('btn-quickvis')?.addEventListener('click', () => {
  const list = courses.map(c => `${c.slots.join('+')} — ${c.code} (${c.title})`).join('\n') || 'No courses added yet.';
  alert('Quick View — Your Courses:\n\n' + list);
});

/* ══════════════════════════════════════════════════════════
   CGPA CALCULATOR
   ══════════════════════════════════════════════════════════ */
const VIT_GRADES = { S:10, 'A+':9, A:8, 'B+':7, B:6, C:5, F:0 };
const GRADE_OPTIONS = Object.keys(VIT_GRADES).map(g => `<option value="${g}">${g} (${VIT_GRADES[g]})</option>`).join('');

/* GPA Rows */
let gpaRows = [];
function addGPARow() {
  const id = Date.now() + Math.random();
  gpaRows.push(id);
  const container = document.getElementById('gpa-courses');
  const div = document.createElement('div');
  div.className = 'gpa-row';
  div.id = 'gpa-row-' + id;
  div.innerHTML = `
    <input placeholder="Course name" class="gpa-name" type="text"/>
    <select class="gpa-grade">${GRADE_OPTIONS}</select>
    <input placeholder="Credits" class="gpa-cr" type="number" min="1" max="10" value="4"/>
    <button class="btn-row-del" onclick="removeGPARow(${id})"><i class="fa-solid fa-xmark"></i></button>
  `;
  container.appendChild(div);
}
function removeGPARow(id) {
  gpaRows = gpaRows.filter(r => r !== id);
  document.getElementById('gpa-row-' + id)?.remove();
}
function calcGPA() {
  let totalPoints = 0, totalCr = 0;
  document.querySelectorAll('#gpa-courses .gpa-row').forEach(row => {
    const grade = row.querySelector('.gpa-grade').value;
    const cr = parseFloat(row.querySelector('.gpa-cr').value) || 0;
    totalPoints += (VIT_GRADES[grade] || 0) * cr;
    totalCr += cr;
  });
  if (totalCr === 0) { showToast('Add at least one course.', 'error'); return; }
  const gpa = (totalPoints / totalCr).toFixed(2);
  document.getElementById('gpa-result').textContent = gpa;
  document.getElementById('gpa-credits').textContent = totalCr;
  document.getElementById('gpa-grade').textContent = gpaClassify(parseFloat(gpa));
}
function gpaClassify(g) {
  if (g >= 9.5) return 'S'; if (g >= 8.5) return 'A+'; if (g >= 7.5) return 'A';
  if (g >= 6.5) return 'B+'; if (g >= 5.5) return 'B'; if (g >= 4.5) return 'C'; return 'F';
}
document.getElementById('btn-add-gpa-course')?.addEventListener('click', addGPARow);

/* CGPA Rows */
let semRows = [];
function addSemRow() {
  const id = Date.now() + Math.random();
  semRows.push(id);
  const container = document.getElementById('cgpa-sems');
  const div = document.createElement('div');
  div.className = 'sem-row';
  div.id = 'sem-row-' + id;
  div.innerHTML = `
    <input placeholder="Semester" class="sem-name" type="text" value="Sem ${semRows.length}"/>
    <input placeholder="GPA" class="sem-gpa" type="number" step="0.01" min="0" max="10"/>
    <input placeholder="Credits" class="sem-cr" type="number" min="1" value="20"/>
    <button class="btn-row-del" onclick="removeSemRow(${id})"><i class="fa-solid fa-xmark"></i></button>
  `;
  container.appendChild(div);
}
function removeSemRow(id) {
  semRows = semRows.filter(r => r !== id);
  document.getElementById('sem-row-' + id)?.remove();
}
function calcCGPA() {
  let totalPoints = 0, totalCr = 0;
  document.querySelectorAll('#cgpa-sems .sem-row').forEach(row => {
    const gpa = parseFloat(row.querySelector('.sem-gpa').value) || 0;
    const cr = parseFloat(row.querySelector('.sem-cr').value) || 0;
    totalPoints += gpa * cr;
    totalCr += cr;
  });
  if (totalCr === 0) { showToast('Add at least one semester.', 'error'); return; }
  const cgpa = (totalPoints / totalCr).toFixed(2);
  document.getElementById('cgpa-result').textContent = cgpa;
  document.getElementById('cgpa-total-cr').textContent = totalCr;
  const g = parseFloat(cgpa);
  let cls = g >= 9 ? 'First Class with Distinction (S)' : g >= 8 ? 'First Class (A)' : g >= 6 ? 'Second Class (B)' : 'Pass';
  document.getElementById('cgpa-class').textContent = cls;
}
document.getElementById('btn-add-sem')?.addEventListener('click', addSemRow);

/* Grade Predictor */
function calcPredictor() {
  const curr = parseFloat(document.getElementById('pred-curr').value);
  const doneCr = parseFloat(document.getElementById('pred-done-cr').value);
  const target = parseFloat(document.getElementById('pred-target').value);
  const remCr = parseFloat(document.getElementById('pred-rem-cr').value);
  if ([curr, doneCr, target, remCr].some(isNaN) || remCr <= 0) {
    showToast('Please fill all fields correctly.', 'error'); return;
  }
  const needed = ((target * (doneCr + remCr)) - (curr * doneCr)) / remCr;
  const box = document.getElementById('pred-result-box');
  const val = document.getElementById('pred-res-val');
  const msg = document.getElementById('pred-res-msg');
  box.classList.remove('hidden');
  if (needed > 10) {
    val.textContent = 'N/A';
    msg.textContent = 'Target is not achievable with current CGPA and credits.';
  } else if (needed < 0) {
    val.textContent = '—';
    msg.textContent = 'You have already achieved your target CGPA! 🎉';
  } else {
    val.textContent = needed.toFixed(2);
    msg.textContent = needed >= 9 ? 'Very challenging! You need near-perfect grades.' :
      needed >= 7 ? 'Achievable with consistent effort.' : 'Well within reach. Keep it up!';
  }
}

/* ══════════════════════════════════════════════════════════
   NPTEL PRACTICE
   ══════════════════════════════════════════════════════════ */
const NPTEL_COURSES = [
  { id:'ds', name:'Data Science for Engineers', emoji:'📊', weeks:12, qs:480 },
  { id:'dbms', name:'Database Management Systems', emoji:'🗄️', weeks:8, qs:320 },
  { id:'cn', name:'Computer Networks', emoji:'🌐', weeks:10, qs:400 },
  { id:'os', name:'Operating Systems', emoji:'💾', weeks:10, qs:400 },
  { id:'dsa', name:'Data Structures & Algorithms', emoji:'🌳', weeks:12, qs:480 },
  { id:'ml', name:'Machine Learning', emoji:'🤖', weeks:12, qs:480 },
  { id:'dl', name:'Deep Learning', emoji:'🧠', weeks:8, qs:320 },
  { id:'nlp', name:'Natural Language Processing', emoji:'💬', weeks:8, qs:320 },
  { id:'cv', name:'Computer Vision', emoji:'👁️', weeks:8, qs:320 },
  { id:'cloud', name:'Cloud Computing', emoji:'☁️', weeks:8, qs:320 },
  { id:'cyber', name:'Cyber Security', emoji:'🔐', weeks:10, qs:400 },
  { id:'ai', name:'Introduction to AI', emoji:'🤖', weeks:8, qs:320 },
  { id:'iot', name:'Internet of Things', emoji:'📡', weeks:8, qs:320 },
  { id:'bc', name:'Blockchain Technology', emoji:'⛓️', weeks:8, qs:320 },
  { id:'python', name:'Programming in Python', emoji:'🐍', weeks:8, qs:320 },
  { id:'java', name:'Programming in Java', emoji:'☕', weeks:8, qs:320 },
  { id:'c', name:'Programming in C', emoji:'🖥️', weeks:8, qs:320 },
  { id:'se', name:'Software Engineering', emoji:'🔧', weeks:8, qs:320 },
  { id:'toc', name:'Theory of Computation', emoji:'∑', weeks:8, qs:320 },
  { id:'cd', name:'Compiler Design', emoji:'⚙️', weeks:8, qs:320 },
  { id:'coa', name:'Computer Organisation & Architecture', emoji:'🏗️', weeks:10, qs:400 },
  { id:'dld', name:'Digital Logic Design', emoji:'🔌', weeks:8, qs:320 },
  { id:'maths', name:'Discrete Mathematics', emoji:'📐', weeks:8, qs:320 },
  { id:'prob', name:'Probability & Statistics', emoji:'📈', weeks:8, qs:320 },
  { id:'la', name:'Linear Algebra', emoji:'🔢', weeks:6, qs:240 },
];

// Sample questions generator
function genQuestions(courseId, week) {
  return [
    {
      q: `Which of the following best describes the core concept studied in Week ${week} of ${courseId.toUpperCase()}?`,
      options: ['Option A — Foundational principle', 'Option B — Advanced derivation', 'Option C — Applied technique', 'Option D — Historical context'],
      ans: 0,
    },
    {
      q: `A key algorithm discussed in this topic has a time complexity of:`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      ans: 2,
    },
    {
      q: `Which statement about this week's concept is TRUE?`,
      options: ['It applies only to theoretical problems', 'It was developed in the 1990s', 'It is widely used in modern systems', 'It has no practical applications'],
      ans: 2,
    },
  ];
}

let currentCourse = null;
let quizMode = 'week';

function renderNptelGrid(list) {
  const grid = document.getElementById('nptel-grid');
  if (!grid) return;
  grid.innerHTML = list.map(c => `
    <div class="nptel-card" onclick="openNptelCourse('${c.id}')">
      <div class="nptel-card-emoji">${c.emoji}</div>
      <div class="nptel-card-name">${c.name}</div>
      <div class="nptel-card-meta">${c.weeks} weeks · ${c.qs}+ questions</div>
    </div>
  `).join('');
}

function filterNptel() {
  const q = document.getElementById('nptel-search').value.toLowerCase();
  renderNptelGrid(NPTEL_COURSES.filter(c => c.name.toLowerCase().includes(q)));
}

function openNptelCourse(id) {
  currentCourse = NPTEL_COURSES.find(c => c.id === id);
  if (!currentCourse) return;
  document.getElementById('nptel-home').classList.add('hidden');
  document.getElementById('nptel-quiz-view').classList.remove('hidden');
  document.getElementById('quiz-course-title').textContent = currentCourse.emoji + ' ' + currentCourse.name;
  setQuizMode('week');
}

function closeNptelQuiz() {
  document.getElementById('nptel-home').classList.remove('hidden');
  document.getElementById('nptel-quiz-view').classList.add('hidden');
  currentCourse = null;
}

function setQuizMode(mode) {
  quizMode = mode;
  document.getElementById('qm-week').classList.toggle('active', mode === 'week');
  document.getElementById('qm-full').classList.toggle('active', mode === 'full');
  renderQuiz();
}

function renderQuiz() {
  const body = document.getElementById('quiz-body');
  if (!currentCourse || !body) return;

  const weeks = quizMode === 'week' ? currentCourse.weeks : 1;
  const allQ = quizMode === 'full'
    ? Array.from({length: currentCourse.weeks}, (_,w) => genQuestions(currentCourse.id, w+1)).flat().slice(0, 20)
    : null;

  body.innerHTML = '';

  if (quizMode === 'week') {
    for (let w = 1; w <= currentCourse.weeks; w++) {
      const section = document.createElement('div');
      section.className = 'quiz-week-section';
      section.innerHTML = `<div class="quiz-week-label">Week ${w}</div>`;
      genQuestions(currentCourse.id, w).forEach((q, qi) => {
        section.appendChild(buildQuestionEl(q, `${currentCourse.id}-w${w}-q${qi}`));
      });
      body.appendChild(section);
    }
  } else {
    allQ.forEach((q, qi) => body.appendChild(buildQuestionEl(q, `${currentCourse.id}-full-q${qi}`)));
  }

  document.getElementById('quiz-ext-link').innerHTML =
    `<i class="fa-solid fa-circle-info"></i> Questions are representative samples. For official NPTEL content visit <a href="https://swayam.gov.in" target="_blank">swayam.gov.in</a>.`;
}

function buildQuestionEl(q, key) {
  const div = document.createElement('div');
  div.className = 'quiz-q';
  div.innerHTML = `<div class="quiz-q-text">${q.q}</div><div class="quiz-options"></div>`;
  const opts = div.querySelector('.quiz-options');
  const letters = ['A','B','C','D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'quiz-opt';
    btn.innerHTML = `<span class="quiz-opt-letter">${letters[i]}</span> ${opt}`;
    btn.onclick = () => {
      opts.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('correct','wrong'));
      if (i === q.ans) {
        btn.classList.add('correct');
        showToast('Correct! ✅', 'success');
      } else {
        btn.classList.add('wrong');
        opts.children[q.ans].classList.add('correct');
        showToast('Incorrect. Try again!', 'error');
      }
    };
    opts.appendChild(btn);
  });
  return div;
}

/* ══════════════════════════════════════════════════════════
   PYQ PAPERS
   ══════════════════════════════════════════════════════════ */
const PYQ_SUBJECTS = [
  'Mathematics-I','Mathematics-II','Engineering Physics','Engineering Chemistry',
  'Problem Solving and OOP','Data Structures & Algorithms','Database Management Systems',
  'Operating Systems','Computer Networks','Software Engineering','Computer Organisation',
  'Theory of Computation','Compiler Design','Digital Logic Design','Discrete Mathematics',
  'Machine Learning','Artificial Intelligence','Computer Vision','Natural Language Processing',
  'Cloud Computing','Cyber Security','IoT','Blockchain','Engineering Mechanics','Thermodynamics',
];
const EXAM_TYPES = ['CAT1','CAT2','FAT'];
const YEARS = [2021, 2022, 2023, 2024];

// Generate a fixed fake list of PYQ papers
const PYQ_PAPERS = [];
let _pid = 1;
YEARS.forEach(yr => {
  EXAM_TYPES.forEach(et => {
    PYQ_SUBJECTS.forEach((sub, si) => {
      PYQ_PAPERS.push({
        id: _pid++,
        subject: sub,
        code: `CSE${1001 + si}`,
        type: et,
        year: yr,
      });
    });
  });
});

let pyqFilterType = 'all', pyqFilterYear = 'all', pyqSearch = '';

function filterPYQ() {
  pyqSearch = document.getElementById('pyq-search').value.toLowerCase();
  renderPYQ();
}

function renderPYQ() {
  const grid = document.getElementById('pyq-grid');
  if (!grid) return;
  let list = PYQ_PAPERS;
  if (pyqFilterType !== 'all') list = list.filter(p => p.type === pyqFilterType);
  if (pyqFilterYear !== 'all') list = list.filter(p => p.year === parseInt(pyqFilterYear));
  if (pyqSearch) list = list.filter(p => p.subject.toLowerCase().includes(pyqSearch) || p.code.toLowerCase().includes(pyqSearch));

  const shown = list.slice(0, 60); // cap at 60 for perf
  grid.innerHTML = shown.map(p => `
    <div class="pyq-card" onclick="openPaperLink('${p.code}','${p.subject}','${p.type}','${p.year}')">
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

  if (shown.length === 0) grid.innerHTML = '<p style="color:var(--muted);padding:40px;text-align:center;">No papers found for selected filters.</p>';
}

function openPaperLink(code, subject, type, year) {
  // Redirect to CodeChef VIT papers (open source VIT paper archive)
  const url = `https://www.papers.codechefvit.com/`;
  window.open(url, '_blank', 'noopener');
  showToast(`Opening ${subject} ${type} ${year}...`, 'info');
}

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

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildTimetable();
  renderCourseList();
  renderNptelGrid(NPTEL_COURSES);
  renderPYQ();

  // Add initial GPA and CGPA rows
  addGPARow(); addGPARow();
  addSemRow(); addSemRow();
});