'use strict';

import { initCursor } from './modules/cursor.js';
import { initNavigation } from './modules/navigation.js';
import { initFFCSPlanner } from './modules/ffcs-planner.js';
import { initCGPACalculator } from './modules/cgpa-calculator.js';
import { initNptelPractice } from './modules/nptel-practice.js';
import { initPYQPapers } from './modules/pyq-papers.js';

async function loadSection(placeholderId, filePath) {
  const response = await fetch(filePath);
  if (!response.ok) throw new Error(`Failed to load ${filePath}`);
  const html = await response.text();
  const placeholder = document.getElementById(placeholderId);
  if (placeholder) {
    placeholder.outerHTML = html;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([
      loadSection('placeholder-home', 'sections/home.html'),
      loadSection('placeholder-ffcs', 'sections/ffcs.html'),
      loadSection('placeholder-cgpa', 'sections/cgpa.html'),
      loadSection('placeholder-nptel', 'sections/nptel.html'),
      loadSection('placeholder-pyq', 'sections/pyq.html'),
      loadSection('placeholder-modals', 'sections/modals.html')
    ]);

    initCursor();
    initNavigation();
    initFFCSPlanner();
    initCGPACalculator();
    initNptelPractice();
    initPYQPapers();
  } catch (err) {
    console.error("Error loading sections:", err);
  }
});
