'use strict';

import { showToast } from './navigation.js';

const VIT_GRADES = { S:10, 'A+':9, A:8, 'B+':7, B:6, C:5, F:0 };
const GRADE_OPTIONS = Object.keys(VIT_GRADES).map(g => `<option value="${g}">${g} (${VIT_GRADES[g]})</option>`).join('');

let gpaRows = [];
let semRows = [];

export function addGPARow() {
  const id = Date.now() + Math.random();
  gpaRows.push(id);
  const container = document.getElementById('gpa-courses');
  if (!container) return;
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

export function removeGPARow(id) {
  gpaRows = gpaRows.filter(r => r !== id);
  document.getElementById('gpa-row-' + id)?.remove();
}

export function calcGPA() {
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
  if (g >= 9.5) return 'S';
  if (g >= 8.5) return 'A+';
  if (g >= 7.5) return 'A';
  if (g >= 6.5) return 'B+';
  if (g >= 5.5) return 'B';
  if (g >= 4.5) return 'C';
  return 'F';
}

export function addSemRow() {
  const id = Date.now() + Math.random();
  semRows.push(id);
  const container = document.getElementById('cgpa-sems');
  if (!container) return;
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

export function removeSemRow(id) {
  semRows = semRows.filter(r => r !== id);
  document.getElementById('sem-row-' + id)?.remove();
}

export function calcCGPA() {
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

export function calcPredictor() {
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
  if (!box || !val || !msg) return;

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

export function initCGPACalculator() {
  window.removeGPARow = removeGPARow;
  window.removeSemRow = removeSemRow;
  window.calcGPA = calcGPA;
  window.calcCGPA = calcCGPA;
  window.calcPredictor = calcPredictor;

  // Add initial GPA and CGPA rows
  addGPARow(); addGPARow();
  addSemRow(); addSemRow();

  // Listeners
  document.getElementById('btn-add-gpa-course')?.addEventListener('click', addGPARow);
  document.getElementById('btn-add-sem')?.addEventListener('click', addSemRow);
}
