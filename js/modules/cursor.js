'use strict';

export function initCursor() {
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');
  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  document.addEventListener('mouseover', e => {
    const interactive = e.target.closest('a, button, select, input, textarea, .hcard, .tool-card, .td-cell, .td-v, .pf-btn, .tact-btn, .modal-x');
    if (interactive) {
      cursor?.classList.add('cursor-hover');
      cursorTrail?.classList.add('trail-hover');
    } else {
      cursor?.classList.remove('cursor-hover');
      cursorTrail?.classList.remove('trail-hover');
    }
  });

  function animCursor() {
    tx += (mx - tx) * 0.18;
    ty += (my - ty) * 0.18;
    if (cursor) {
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    }
    if (cursorTrail) {
      cursorTrail.style.left = tx + 'px';
      cursorTrail.style.top = ty + 'px';
    }
    requestAnimationFrame(animCursor);
  }

  animCursor();
}
