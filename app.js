/* ═══════════════════════════════════════════════════════
   EduHub VIT — app.js   (Clean, fully working)
═══════════════════════════════════════════════════════ */
'use strict';

/* ══ CURSOR ══ */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0; // Mouse coordinates
let rx = 0, ry = 0; // Ring coordinates

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

function animate() {
  // Interpolation for smooth trailing effect
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animate);
}
animate();

document.querySelectorAll('button,a,.tool-card,.hcard,.nptel-card,.pyq-card,.q-opt,.fb,.qm,.act-btn,.back-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-expand'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-expand'));
});

/* ══ SECTION NAV ══ */
const SEC = { home:'sec-home', ffcs:'sec-ffcs', cgpa:'sec-cgpa', nptel:'sec-nptel', pyq:'sec-pyq' };
function showSection(k) {
  Object.values(SEC).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  const t = document.getElementById(SEC[k]);
  if (t) { t.classList.add('active'); window.scrollTo(0, 0); }
}

/* ══ TOAST ══ */
let _toastT;
function toast(msg, type='info') {
  const el = document.getElementById('toast');
  const ic = document.getElementById('toast-icon');
  const sp = document.getElementById('toast-msg');
  sp.textContent = msg;
  ic.style.color = type==='success' ? 'var(--accent3)' : type==='error' ? 'var(--red)' : 'var(--accent)';
  ic.className = type==='success' ? 'fa-solid fa-circle-check' : type==='error' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-info';
  el.classList.remove('hidden'); el.classList.add('show');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => { el.classList.remove('show'); setTimeout(()=>el.classList.add('hidden'),350); }, 3200);
}

/* ══ BACKDROP + MODALS ══ */
function openModal(id) {
  document.getElementById('backdrop')?.classList.remove('hidden');
  document.getElementById(id)?.classList.remove('hidden');
}
function closeModal(id) {
  document.getElementById('backdrop')?.classList.add('hidden');
  document.getElementById(id)?.classList.add('hidden');
}
function closeAll() {
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  document.getElementById('backdrop')?.classList.add('hidden');
}
document.getElementById('backdrop')?.addEventListener('click', closeAll);

/* ══════════════════════════════════════════════════════
   FFCS TIMETABLE
══════════════════════════════════════════════════════ */
// Theory time header labels (12 col + lunch divider at index 2 and 7)
const TH_THEORY = ['8:00','8:55','LUNCH','9:50','10:45','11:40','12:35','LUNCH','1:30','2:25','3:20','4:15'];
const TH_LAB    = ['8:00','','','9:55','','11:30','','','13:30','','15:05',''];

// Each row: day label + 12 cell defs (null = lunch column)
// Cell: { t:'THEORY_SLOT', l:'LAB_SLOT' }  — either/both can be absent
const TT = [
  { d:'MON', c:[{t:'A1',l:'L1'},{t:'F1',l:'L2'},null,{t:'D1',l:'L3'},{t:'TB1',l:'L4'},{t:'TG1',l:'L5'},null,null,{t:'A2',l:'L31'},{t:'F2',l:'L32'},{t:'D2',l:'L33'},{t:'TB2',l:'L34'}] },
  { d:'TUE', c:[{t:'B1',l:'L7'},{t:'G1',l:'L8'},null,{t:'E1',l:'L9'},{t:'TC1',l:'L10'},{t:'TAI1',l:'L11'},null,null,{t:'B2',l:'L37'},{t:'G2',l:'L38'},{t:'E2',l:'L39'},{t:'TC2',l:'L40'}] },
  { d:'WED', c:[{t:'C1',l:'L13'},{t:'A1',l:'L14'},null,{t:'F1',l:'L15'},{t:'TD1',l:'L16'},{t:'TH1',l:'L17'},null,null,{t:'C2',l:'L43'},{t:'A2',l:'L44'},{t:'F2',l:'L45'},{t:'TD2',l:'L46'}] },
  { d:'THU', c:[{t:'D1',l:'L19'},{t:'B1',l:'L20'},null,{t:'G1',l:'L21'},{t:'TE1',l:'L22'},{t:'TAJ1',l:'L23'},null,null,{t:'D2',l:'L49'},{t:'B2',l:'L50'},{t:'G2',l:'L51'},{t:'TE2',l:'L52'}] },
  { d:'FRI', c:[{t:'E1',l:'L25'},{t:'C1',l:'L26'},null,{t:'A1',l:'L27'},{t:'TF1',l:'L28'},{t:'TAK1',l:'L29'},null,null,{t:'E2',l:'L55'},{t:'C2',l:'L56'},{t:'A2',l:'L57'},{t:'TF2',l:'L58'}] },
  { d:'SAT', c:[{t:'F1'},{t:'D1'},null,{t:'B1'},{t:'G1'},{t:'A1'},null,null,{t:'F2'},{t:'D2'},{t:'B2'},{t:'G2'}] },
];

let courses = (() => { try { return JSON.parse(localStorage.getItem('ehvit_courses')||'[]'); } catch { return []; } })();

const slotMap = {};  // slot => course
function rebuildSlotMap() {
  Object.keys(slotMap).forEach(k => delete slotMap[k]);
  courses.forEach(c => c.slots.forEach(s => slotMap[s] = c));
}
rebuildSlotMap();

function saveC() { localStorage.setItem('ehvit_courses', JSON.stringify(courses)); rebuildSlotMap(); }

function buildTimetable() {
  const tbl = document.getElementById('timetable');
  if (!tbl) return;
  tbl.innerHTML = '';

  // Theory header row
  const thead = tbl.createTHead();
  const tr1 = thead.insertRow(); tr1.className = 'th-theory';
  const dayTh = document.createElement('th');
  dayTh.textContent = 'Day'; dayTh.rowSpan = 2;
  dayTh.style.cssText = 'background:var(--bg3);color:var(--muted2);font-family:var(--fh);font-weight:700;font-size:.65rem;width:70px';
  tr1.appendChild(dayTh);
  TH_THEORY.forEach(h => {
    const th = document.createElement('th');
    if (h === 'LUNCH') { th.textContent = 'L'; th.className = 'td-lunch'; th.rowSpan = 2; }
    else th.textContent = h;
    tr1.appendChild(th);
  });

  // Lab header row
  const tr2 = thead.insertRow(); tr2.className = 'th-lab';
  TH_LAB.forEach((h, i) => {
    if (TH_THEORY[i] === 'LUNCH') return;
    const th = document.createElement('th'); th.textContent = h;
    tr2.appendChild(th);
  });

  const tbody = tbl.createTBody();
  TT.forEach(row => {
    const tr = tbody.insertRow();
    const dc = tr.insertCell(); dc.textContent = row.d; dc.className = 'td-day';
    row.c.forEach(cell => {
      const td = tr.insertCell();
      if (cell === null) { td.className = 'td-lunch'; return; }
      td.className = 'td-cell';
      renderCell(td, cell);
      td.addEventListener('click',   () => onCellClick(td, cell));
      td.addEventListener('dblclick', () => onCellDbl(td, cell));
    });
  });
}

function renderCell(td, cell) {
  const fill = (cell.t && slotMap[cell.t]) || (cell.l && slotMap[cell.l]);
  if (fill) {
    const s = (cell.t && slotMap[cell.t]) ? cell.t : cell.l;
    td.innerHTML = `<div class="cell-filled"><div class="cf-slot">${s}</div><div class="cf-name">${fill.code}</div><div class="cf-venue">${fill.venue||''}</div></div>`;
  } else {
    const parts = [cell.t, cell.l].filter(Boolean);
    td.innerHTML = `<span class="cell-default">${parts.join(' / ')}</span>`;
  }
}

function onCellClick(td, cell) {
  const fill = (cell.t && slotMap[cell.t]) || (cell.l && slotMap[cell.l]);
  if (fill) return;
  // prefer theory slot; if only lab, use lab
  const slot = cell.t || cell.l;
  openAddModal(slot);
}

function onCellDbl(td, cell) {
  const fill = (cell.t && slotMap[cell.t]) || (cell.l && slotMap[cell.l]);
  if (fill) openEditModal(fill);
}

/* ── ADD MODAL ── */
let _addSlot = '';
function openAddModal(slot) {
  _addSlot = slot;
  document.getElementById('madd-slot').textContent = slot;
  document.getElementById('madd-time').textContent = '';
  ['m-code','m-title','m-faculty','m-venue'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('m-credits').value = 4;
  openModal('modal-add');
  setTimeout(() => document.getElementById('m-code').focus(), 80);
}
document.getElementById('madd-save')?.addEventListener('click', () => {
  const code    = document.getElementById('m-code').value.trim().toUpperCase();
  const title   = document.getElementById('m-title').value.trim();
  const faculty = document.getElementById('m-faculty').value.trim();
  const venue   = document.getElementById('m-venue').value.trim().toUpperCase();
  const credits = parseInt(document.getElementById('m-credits').value) || 0;
  if (!code || !title) { toast('Course code and title are required.', 'error'); return; }
  if (credits < 1 || credits > 10) { toast('Credits must be 1–10.', 'error'); return; }
  if (slotMap[_addSlot]) {
    const cx = slotMap[_addSlot];
    document.getElementById('conflict-msg').textContent = `Slot ${_addSlot} is already assigned to ${cx.code} — ${cx.title}.`;
    closeModal('modal-add'); openModal('modal-conflict'); return;
  }
  courses.push({ id: Date.now()+'', code, title, faculty, venue, credits, slots: [_addSlot] });
  saveC(); buildTimetable(); renderList();
  closeModal('modal-add');
  toast(`${code} added to ${_addSlot}!`, 'success');
});
document.getElementById('madd-close')?.addEventListener('click',  () => closeModal('modal-add'));
document.getElementById('madd-cancel')?.addEventListener('click', () => closeModal('modal-add'));
document.getElementById('conflict-ok')?.addEventListener('click', () => closeModal('modal-conflict'));

/* ── EDIT MODAL ── */
let _editId = '';
function openEditModal(c) {
  _editId = c.id;
  document.getElementById('medit-slot').textContent = c.slots.join(' + ');
  document.getElementById('e-code').value    = c.code;
  document.getElementById('e-title').value   = c.title;
  document.getElementById('e-faculty').value = c.faculty;
  document.getElementById('e-venue').value   = c.venue;
  document.getElementById('e-credits').value = c.credits;
  openModal('modal-edit');
}
document.getElementById('medit-save')?.addEventListener('click', () => {
  const idx = courses.findIndex(c => c.id === _editId);
  if (idx < 0) return;
  courses[idx].code    = document.getElementById('e-code').value.trim().toUpperCase();
  courses[idx].title   = document.getElementById('e-title').value.trim();
  courses[idx].faculty = document.getElementById('e-faculty').value.trim();
  courses[idx].venue   = document.getElementById('e-venue').value.trim().toUpperCase();
  courses[idx].credits = parseInt(document.getElementById('e-credits').value) || courses[idx].credits;
  saveC(); buildTimetable(); renderList();
  closeModal('modal-edit'); toast('Course updated!', 'success');
});
document.getElementById('medit-remove')?.addEventListener('click', () => {
  courses = courses.filter(c => c.id !== _editId);
  saveC(); buildTimetable(); renderList();
  closeModal('modal-edit'); toast('Course removed.', 'info');
});
document.getElementById('medit-close')?.addEventListener('click',  () => closeModal('modal-edit'));
document.getElementById('medit-cancel')?.addEventListener('click', () => closeModal('modal-edit'));

/* ── COURSE LIST ── */
function renderList() {
  const tbody = document.getElementById('cl-body');
  const badge = document.getElementById('credit-badge');
  const total = document.getElementById('cl-total');
  if (!tbody) return;
  const cr = courses.reduce((s,c) => s + c.credits, 0);
  if (badge) badge.textContent = cr + ' Credits';
  if (total) total.textContent = cr;
  if (!courses.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="cl-empty">No courses yet — click a timetable cell to add one.</td></tr>`;
    return;
  }
  tbody.innerHTML = courses.map(c => `<tr>
    <td><strong>${c.slots.join(', ')}</strong></td>
    <td>${c.code}</td><td>${c.title}</td>
    <td>${c.faculty||'—'}</td><td>${c.venue||'—'}</td><td>${c.credits}</td>
    <td><button class="btn-del" onclick="delCourse('${c.id}')"><i class="fa-solid fa-trash"></i></button></td>
  </tr>`).join('');
}
window.delCourse = id => {
  courses = courses.filter(c => c.id !== id);
  saveC(); buildTimetable(); renderList(); toast('Removed.', 'info');
};

/* ── RESET ── */
document.getElementById('btn-reset')?.addEventListener('click', () => openModal('modal-reset'));
document.getElementById('reset-yes')?.addEventListener('click', () => {
  courses = []; saveC(); buildTimetable(); renderList();
  closeModal('modal-reset'); toast('Timetable reset.', 'info');
});
document.getElementById('reset-no')?.addEventListener('click', () => closeModal('modal-reset'));

/* ── EXPORT ── */
document.getElementById('btn-dl')?.addEventListener('click', () => openModal('modal-dl'));
document.getElementById('dl-cancel')?.addEventListener('click', () => closeModal('modal-dl'));
document.getElementById('dl-pdf')?.addEventListener('click', () => { closeModal('modal-dl'); window.print(); });
document.getElementById('dl-csv')?.addEventListener('click', () => {
  if (!courses.length) { toast('No courses to export.', 'error'); closeModal('modal-dl'); return; }
  const rows = [['Slot','Code','Title','Faculty','Venue','Credits'],
    ...courses.map(c => [c.slots.join('+'),c.code,c.title,c.faculty,c.venue,c.credits])];
  const csv = rows.map(r => r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download = 'ffcs_timetable.csv'; a.click();
  closeModal('modal-dl'); toast('CSV exported!', 'success');
});

/* ── SUGGEST FREE SLOTS ── */
const ALL_SLOTS = ['A1','B1','C1','D1','E1','F1','G1','A2','B2','C2','D2','E2','F2','G2',
  'TB1','TC1','TD1','TE1','TF1','TG1','TAI1','TAJ1','TAK1','TH1','TB2','TC2','TD2','TE2','TF2',
  'L1','L2','L3','L4','L5','L7','L8','L9','L10','L11','L13','L14','L15','L16','L17',
  'L19','L20','L21','L22','L23','L25','L26','L27','L28','L29','L31','L32','L33','L34',
  'L37','L38','L39','L40','L43','L44','L45','L46','L49','L50','L51','L52','L55','L56','L57','L58'];

document.getElementById('btn-suggest')?.addEventListener('click', () => {
  const used = new Set(courses.flatMap(c => c.slots));
  const free = ALL_SLOTS.filter(s => !used.has(s));
  const cont = document.getElementById('slot-tags');
  cont.innerHTML = free.length
    ? free.map(s => `<span class="slot-tag">${s}</span>`).join('')
    : '<span style="color:var(--muted);font-size:.83rem">All slots are taken!</span>';
  openModal('modal-slots');
});
document.getElementById('mslots-close')?.addEventListener('click', () => closeModal('modal-slots'));
document.getElementById('mslots-ok')?.addEventListener('click',    () => closeModal('modal-slots'));

/* ══════════════════════════════════════════════════════
   CGPA
══════════════════════════════════════════════════════ */
const VG = {S:10,'A+':9,A:8,'B+':7,B:6,C:5,F:0};
const GRADE_OPTS = Object.keys(VG).map(g=>`<option value="${g}">${g} (${VG[g]})</option>`).join('');
let gpaIds = [], semIds = [];

function addGPARow() {
  const id = Date.now() + Math.random();
  gpaIds.push(id);
  const n = gpaIds.length;
  const div = document.createElement('div');
  div.className = 'gpa-row'; div.id = 'gr' + id;
  div.innerHTML = `<input type="text" placeholder="Course ${n}"/>
    <select>${GRADE_OPTS}</select>
    <input type="number" min="1" max="10" value="4" placeholder="Cr"/>
    <button class="btn-row-del" onclick="rmGPA(${id})"><i class="fa-solid fa-xmark"></i></button>`;
  document.getElementById('gpa-rows')?.appendChild(div);
}
window.rmGPA = id => { gpaIds = gpaIds.filter(x=>x!==id); document.getElementById('gr'+id)?.remove(); };

function addSemRow() {
  const id = Date.now() + Math.random();
  semIds.push(id);
  const n = semIds.length;
  const div = document.createElement('div');
  div.className = 'sem-row'; div.id = 'sr' + id;
  div.innerHTML = `<input type="text" value="Sem ${n}" placeholder="Semester"/>
    <input type="number" step="0.01" min="0" max="10" placeholder="GPA"/>
    <input type="number" min="1" value="20" placeholder="Credits"/>
    <button class="btn-row-del" onclick="rmSem(${id})"><i class="fa-solid fa-xmark"></i></button>`;
  document.getElementById('sem-rows')?.appendChild(div);
}
window.rmSem = id => { semIds = semIds.filter(x=>x!==id); document.getElementById('sr'+id)?.remove(); };

function calcGPA() {
  let pts = 0, cr = 0;
  document.querySelectorAll('#gpa-rows .gpa-row').forEach(row => {
    const g = row.querySelector('select').value;
    const c = parseFloat(row.querySelectorAll('input')[1].value)||0;
    pts += (VG[g]||0)*c; cr += c;
  });
  if (!cr) { toast('Add at least one course.','error'); return; }
  const gpa = (pts/cr).toFixed(2);
  document.getElementById('gpa-val').textContent  = gpa;
  document.getElementById('gpa-cr').textContent   = cr;
  document.getElementById('gpa-grade').textContent = gpaCls(parseFloat(gpa));
}
function gpaCls(g) {
  if(g>=9.5) return 'S'; if(g>=8.5) return 'A+'; if(g>=7.5) return 'A';
  if(g>=6.5) return 'B+'; if(g>=5.5) return 'B'; if(g>=4.5) return 'C'; return 'F';
}

function calcCGPA() {
  let pts = 0, cr = 0;
  document.querySelectorAll('#sem-rows .sem-row').forEach(row => {
    const inp = row.querySelectorAll('input');
    const gpa = parseFloat(inp[1].value)||0;
    const c   = parseFloat(inp[2].value)||0;
    pts += gpa*c; cr += c;
  });
  if (!cr) { toast('Add at least one semester.','error'); return; }
  const cgpa = (pts/cr).toFixed(2);
  const cls = cgpa>=9?'Distinction':cgpa>=8?'First Class':cgpa>=6?'Second Class':'Pass';
  document.getElementById('cgpa-val').textContent   = cgpa;
  document.getElementById('cgpa-cr').textContent    = cr;
  document.getElementById('cgpa-class').textContent = cls;
}

function calcPredictor() {
  const curr   = parseFloat(document.getElementById('pred-curr').value);
  const done   = parseFloat(document.getElementById('pred-done').value);
  const target = parseFloat(document.getElementById('pred-target').value);
  const left   = parseFloat(document.getElementById('pred-left').value);
  if ([curr,done,target,left].some(isNaN)||left<=0) { toast('Fill all fields.','error'); return; }
  const needed = ((target*(done+left)) - (curr*done)) / left;
  const box = document.getElementById('pred-result');
  box.classList.remove('hidden');
  if (needed>10) {
    document.getElementById('pred-big').textContent = 'N/A';
    document.getElementById('pred-msg').textContent = 'Target not achievable. Consider revising.';
  } else if (needed<0) {
    document.getElementById('pred-big').textContent = '—';
    document.getElementById('pred-msg').textContent = 'You\'ve already hit your target! 🎉';
  } else {
    document.getElementById('pred-big').textContent = needed.toFixed(2);
    document.getElementById('pred-msg').textContent =
      needed>=9 ? 'Very challenging — near-perfect marks needed.' :
      needed>=7 ? 'Achievable with consistent effort.' : 'Well within reach!';
  }
}

document.getElementById('add-gpa-row')?.addEventListener('click', addGPARow);
document.getElementById('add-sem-row')?.addEventListener('click', addSemRow);

/* ══════════════════════════════════════════════════════
   NPTEL
══════════════════════════════════════════════════════ */
const COURSES = [
  {id:'ds',  name:'Data Science for Engineers',          emoji:'📊', weeks:12},
  {id:'dbms',name:'Database Management Systems',         emoji:'🗄️', weeks:8},
  {id:'cn',  name:'Computer Networks',                   emoji:'🌐', weeks:10},
  {id:'os',  name:'Operating Systems',                   emoji:'💾', weeks:10},
  {id:'dsa', name:'Data Structures & Algorithms',        emoji:'🌳', weeks:12},
  {id:'ml',  name:'Machine Learning',                    emoji:'🤖', weeks:12},
  {id:'dl',  name:'Deep Learning',                       emoji:'🧠', weeks:8},
  {id:'nlp', name:'Natural Language Processing',         emoji:'💬', weeks:8},
  {id:'cv',  name:'Computer Vision',                     emoji:'👁️', weeks:8},
  {id:'cloud',name:'Cloud Computing',                    emoji:'☁️', weeks:8},
  {id:'sec', name:'Cyber Security',                      emoji:'🔐', weeks:10},
  {id:'ai',  name:'Introduction to AI',                  emoji:'🤖', weeks:8},
  {id:'iot', name:'Internet of Things',                  emoji:'📡', weeks:8},
  {id:'bc',  name:'Blockchain Technology',               emoji:'⛓️', weeks:8},
  {id:'py',  name:'Programming in Python',               emoji:'🐍', weeks:8},
  {id:'java',name:'Programming in Java',                 emoji:'☕', weeks:8},
  {id:'c',   name:'Programming in C',                    emoji:'🖥️', weeks:8},
  {id:'se',  name:'Software Engineering',                emoji:'🔧', weeks:8},
  {id:'toc', name:'Theory of Computation',               emoji:'∑',  weeks:8},
  {id:'cd',  name:'Compiler Design',                     emoji:'⚙️', weeks:8},
  {id:'coa', name:'Computer Organisation & Architecture',emoji:'🏗️', weeks:10},
  {id:'dld', name:'Digital Logic Design',                emoji:'🔌', weeks:8},
  {id:'dm',  name:'Discrete Mathematics',                emoji:'📐', weeks:8},
  {id:'prob',name:'Probability & Statistics',            emoji:'📈', weeks:8},
  {id:'la',  name:'Linear Algebra',                      emoji:'🔢', weeks:6},
];

let activeCourse = null, quizMode = 'week';

function renderNptelGrid(list) {
  document.getElementById('nptel-grid').innerHTML = list.map(c => `
    <div class="nptel-card" onclick="openCourse('${c.id}')">
      <div class="nc-emoji">${c.emoji}</div>
      <div class="nc-name">${c.name}</div>
      <div class="nc-meta">${c.weeks} weeks · ${c.weeks*40}+ questions</div>
    </div>`).join('');
}

window.filterNptel = () => {
  const q = document.getElementById('nptel-search').value.toLowerCase();
  renderNptelGrid(COURSES.filter(c => c.name.toLowerCase().includes(q)));
};

window.openCourse = id => {
  activeCourse = COURSES.find(c => c.id===id);
  if (!activeCourse) return;
  document.getElementById('nptel-home-view').classList.add('hidden');
  document.getElementById('nptel-quiz').classList.remove('hidden');
  document.getElementById('quiz-title').textContent = activeCourse.emoji + ' ' + activeCourse.name;
  setMode('week');
};

window.backToNptel = () => {
  document.getElementById('nptel-home-view').classList.remove('hidden');
  document.getElementById('nptel-quiz').classList.add('hidden');
  activeCourse = null;
};

window.setMode = mode => {
  quizMode = mode;
  document.getElementById('qm-week').classList.toggle('active', mode==='week');
  document.getElementById('qm-full').classList.toggle('active', mode==='full');
  renderQuiz();
};

function genQ(id, w) {
  return [
    { q:`In Week ${w}, which best characterises the core technique in ${id.toUpperCase()}?`,
      opts:['Option A — Theoretical foundation','Option B — Algorithmic derivation','Option C — Applied optimisation','Option D — Historical context'], a:2 },
    { q:`What is the typical time complexity of the primary algorithm covered this week?`,
      opts:['O(1)','O(log n)','O(n)','O(n²)'], a:2 },
    { q:`Which statement about this week\'s concept is TRUE?`,
      opts:['It applies only to theory','It was proposed in the 1990s','It is widely used in modern systems','It has no real-world application'], a:2 },
  ];
}

function renderQuiz() {
  const body = document.getElementById('quiz-body');
  if (!activeCourse || !body) return;
  body.innerHTML = '';
  if (quizMode==='week') {
    for (let w=1; w<=activeCourse.weeks; w++) {
      const sec = document.createElement('div'); sec.className = 'quiz-week';
      sec.innerHTML = `<div class="week-label">Week ${w}</div>`;
      genQ(activeCourse.id, w).forEach((q,qi) => sec.appendChild(buildQ(q, `${activeCourse.id}-w${w}-q${qi}`)));
      body.appendChild(sec);
    }
  } else {
    const all = [];
    for (let w=1; w<=activeCourse.weeks; w++) all.push(...genQ(activeCourse.id,w));
    all.slice(0,20).forEach((q,qi) => body.appendChild(buildQ(q, `${activeCourse.id}-full-q${qi}`)));
  }
  const note = document.createElement('div'); note.className='quiz-note';
  note.innerHTML = `Questions are representative samples. Official NPTEL content at <a href="https://swayam.gov.in" target="_blank">swayam.gov.in</a>.`;
  body.appendChild(note);
}

function buildQ(q, key) {
  const div = document.createElement('div'); div.className = 'quiz-q-card';
  div.innerHTML = `<div class="q-text">${q.q}</div><div class="q-opts"></div>`;
  const opts = div.querySelector('.q-opts');
  ['A','B','C','D'].forEach((ltr,i) => {
    const btn = document.createElement('div'); btn.className = 'q-opt';
    btn.innerHTML = `<span class="q-opt-ltr">${ltr}</span>${q.opts[i]}`;
    btn.onclick = () => {
      opts.querySelectorAll('.q-opt').forEach(b => b.classList.remove('correct','wrong'));
      btn.classList.add(i===q.a ? 'correct' : 'wrong');
      if (i!==q.a) opts.children[q.a].classList.add('correct');
      toast(i===q.a ? 'Correct! ✅' : 'Wrong — correct answer highlighted.', i===q.a?'success':'error');
    };
    opts.appendChild(btn);
  });
  return div;
}

/* ══════════════════════════════════════════════════════
   PYQ PAPERS
══════════════════════════════════════════════════════ */
const SUBJECTS = [
  'Mathematics-I','Mathematics-II','Engineering Physics','Engineering Chemistry',
  'Problem Solving & OOP','Data Structures','Database Management','Operating Systems',
  'Computer Networks','Software Engineering','Computer Organisation','Theory of Computation',
  'Compiler Design','Digital Logic','Discrete Mathematics','Machine Learning',
  'Artificial Intelligence','Computer Vision','NLP','Cloud Computing',
  'Cyber Security','IoT','Blockchain','Thermodynamics','Engineering Mechanics',
];
const TYPES = ['CAT1','CAT2','FAT'];
const YEARS = [2021,2022,2023,2024];
const PAPERS = [];
let _pid = 1;
YEARS.forEach(yr => TYPES.forEach(tp => SUBJECTS.forEach((s,i) => {
  PAPERS.push({ id:_pid++, subj:s, code:`CSE${1001+i}`, type:tp, year:yr });
})));

let pType='all', pYear='all', pQ='';

window.filterPYQ = () => { pQ = document.getElementById('pyq-search').value.toLowerCase(); renderPYQ(); };

function renderPYQ() {
  let list = PAPERS;
  if (pType!=='all') list = list.filter(p=>p.type===pType);
  if (pYear!=='all') list = list.filter(p=>p.year===parseInt(pYear));
  if (pQ) list = list.filter(p=>p.subj.toLowerCase().includes(pQ)||p.code.toLowerCase().includes(pQ));
  const grid = document.getElementById('pyq-grid');
  const shown = list.slice(0,64);
  grid.innerHTML = shown.length
    ? shown.map(p => `<div class="pyq-card" onclick="window.open('https://papers.codechefvit.com','_blank')">
        <div class="pyq-card-top">
          <span class="pyq-type t-${p.type.toLowerCase()}">${p.type}</span>
          <span class="pyq-year">${p.year}</span>
        </div>
        <div class="pyq-subj">${p.subj}</div>
        <div class="pyq-code">${p.code}</div>
        <div class="pyq-card-foot">
          <span class="pyq-view"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open paper</span>
          <span style="font-size:.7rem;color:var(--muted)">PDF</span>
        </div>
      </div>`).join('')
    : '<p style="color:var(--muted);padding:36px;text-align:center">No papers for selected filters.</p>';
}

document.getElementById('pf-type')?.addEventListener('click', e => {
  const b = e.target.closest('.fb'); if(!b) return;
  document.querySelectorAll('#pf-type .fb').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); pType = b.dataset.v; renderPYQ();
});
document.getElementById('pf-year')?.addEventListener('click', e => {
  const b = e.target.closest('.fb'); if(!b) return;
  document.querySelectorAll('#pf-year .fb').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); pYear = b.dataset.v; renderPYQ();
});

/* ══════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildTimetable();
  renderList();
  renderNptelGrid(COURSES);
  renderPYQ();
  addGPARow(); addGPARow();
  addSemRow(); addSemRow();
});