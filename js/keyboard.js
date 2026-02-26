var DSA = window.DSA || {};

(function() {
  'use strict';

  var modalEl;

  var shortcuts = [
    { key: 't', desc: 'Toggle theme' },
    { key: '/', desc: 'Focus search' },
    { key: 'Space', desc: 'Play / Pause visualization' },
    { key: '\u2190', desc: 'Step backward' },
    { key: '\u2192', desc: 'Step forward' },
    { key: '?', desc: 'Show shortcuts' },
    { key: 'Esc', desc: 'Close modal / search' }
  ];

  function showModal() {
    if (!modalEl) return;
    modalEl.classList.add('active');
  }

  function hideModal() {
    if (!modalEl) return;
    modalEl.classList.remove('active');
  }

  function isInputFocused() {
    var el = document.activeElement;
    if (!el) return false;
    var tag = el.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
  }

  function init() {
    // Build shortcuts modal
    modalEl = document.querySelector('.shortcuts-modal');

    document.addEventListener('keydown', function(e) {
      // Don't capture when typing in inputs
      if (isInputFocused() && e.key !== 'Escape') return;

      switch (e.key) {
        case 't':
          if (DSA.theme) DSA.theme.toggle();
          break;
        case '/':
          e.preventDefault();
          var searchInput = document.querySelector('.search-input');
          if (searchInput) searchInput.focus();
          break;
        case ' ':
          if (DSA.vizCore && DSA.vizCore.isActive()) {
            e.preventDefault();
            DSA.vizCore.togglePlay();
          }
          break;
        case 'ArrowLeft':
          if (DSA.vizCore && DSA.vizCore.isActive()) {
            e.preventDefault();
            DSA.vizCore.stepBackward();
          }
          break;
        case 'ArrowRight':
          if (DSA.vizCore && DSA.vizCore.isActive()) {
            e.preventDefault();
            DSA.vizCore.stepForward();
          }
          break;
        case '?':
          showModal();
          break;
        case 'Escape':
          hideModal();
          break;
      }
    });
  }

  DSA.keyboard = { init: init, shortcuts: shortcuts };
})();
