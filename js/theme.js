var DSA = window.DSA || {};

(function() {
  'use strict';

  var STORAGE_KEY = 'dsa-theme';

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || getSystemPreference();
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcon(theme);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  function toggle() {
    var current = document.documentElement.getAttribute('data-theme') || getTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  function updateToggleIcon(theme) {
    var btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(function(btn) {
      btn.innerHTML = theme === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
    });
  }

  function init() {
    var theme = getTheme();
    setTheme(theme);

    var btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(function(btn) {
      btn.addEventListener('click', toggle);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  DSA.theme = { init: init, toggle: toggle, getTheme: getTheme };
})();
