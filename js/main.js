var DSA = window.DSA || {};

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // Core modules
    if (DSA.theme) DSA.theme.init();
    if (DSA.sidebar) DSA.sidebar.init();
    if (DSA.search) DSA.search.init();
    if (DSA.progress) DSA.progress.init();
    if (DSA.keyboard) DSA.keyboard.init();

    // Topic page modules
    if (DSA.codeBlock) DSA.codeBlock.init();
    if (DSA.quiz) DSA.quiz.init();

    // Topic-specific visualizations
    if (DSA.arraysViz) DSA.arraysViz.init();
    if (DSA.linkedListsViz) DSA.linkedListsViz.init();
    if (DSA.bubbleSortViz) DSA.bubbleSortViz.init();
    if (DSA.binarySearchViz) DSA.binarySearchViz.init();

    // Scroll reveal animation
    initScrollReveal();
  });

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    var elements = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(function(el) { observer.observe(el); });
  }
})();
