var DSA = window.DSA || {};

(function() {
  'use strict';

  var sidebar, overlay, hamburger;

  function open() {
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function markActiveLink() {
    var path = window.location.pathname;
    var filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    var links = document.querySelectorAll('.sidebar__link');
    links.forEach(function(link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkFile = href.substring(href.lastIndexOf('/') + 1);
      if (linkFile === filename) {
        link.classList.add('sidebar__link--active');
      } else {
        link.classList.remove('sidebar__link--active');
      }
    });
  }

  function init() {
    sidebar = document.querySelector('.sidebar');
    overlay = document.querySelector('.sidebar-overlay');
    hamburger = document.querySelector('.hamburger');

    if (hamburger) {
      hamburger.addEventListener('click', function() {
        if (sidebar && sidebar.classList.contains('open')) {
          close();
        } else {
          open();
        }
      });
    }

    if (overlay) {
      overlay.addEventListener('click', close);
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') close();
    });

    markActiveLink();
  }

  DSA.sidebar = { init: init, open: open, close: close };
})();
