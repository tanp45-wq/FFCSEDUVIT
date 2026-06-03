'use strict';

import { NPTEL_COURSES, genQuestions } from '../data/nptel-courses.js';
import { showToast } from './navigation.js';

let currentCourse = null;
let quizMode = 'week';

export function renderNptelGrid(list) {
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

export function filterNptel() {
  const q = document.getElementById('nptel-search').value.toLowerCase();
  renderNptelGrid(NPTEL_COURSES.filter(c => c.name.toLowerCase().includes(q)));
}

export function openNptelCourse(id) {
  currentCourse = NPTEL_COURSES.find(c => c.id === id);
  if (!currentCourse) return;
  document.getElementById('nptel-home').classList.add('hidden');
  document.getElementById('nptel-quiz-view').classList.remove('hidden');
  document.getElementById('quiz-course-title').textContent = currentCourse.emoji + ' ' + currentCourse.name;
  setQuizMode('week');
}

export function closeNptelQuiz() {
  document.getElementById('nptel-home').classList.remove('hidden');
  document.getElementById('nptel-quiz-view').classList.add('hidden');
  currentCourse = null;
}

export function setQuizMode(mode) {
  quizMode = mode;
  document.getElementById('qm-week').classList.toggle('active', mode === 'week');
  document.getElementById('qm-full').classList.toggle('active', mode === 'full');
  renderQuiz();
}

function renderQuiz() {
  const body = document.getElementById('quiz-body');
  if (!currentCourse || !body) return;

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
    const allQ = Array.from({length: currentCourse.weeks}, (_,w) => genQuestions(currentCourse.id, w+1)).flat().slice(0, 20);
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

export function initNptelPractice() {
  window.openNptelCourse = openNptelCourse;
  window.closeNptelQuiz = closeNptelQuiz;
  window.setQuizMode = setQuizMode;
  window.filterNptel = filterNptel;

  renderNptelGrid(NPTEL_COURSES);
}
