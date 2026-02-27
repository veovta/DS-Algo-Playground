var DSA = window.DSA || {};

(function() {
  'use strict';

  // Category display order
  var categoryOrder = ['Data Structures', 'Sorting', 'Searching', 'Techniques'];

  // Category icons for sidebar section titles
  var categoryIcons = {
    'Data Structures': '',
    'Sorting': '',
    'Searching': '',
    'Techniques': ''
  };

  function getBasePath() {
    // Determine if we are inside topics/ or at root level
    var path = window.location.pathname;
    if (path.indexOf('/topics/') !== -1) {
      return '../';
    }
    return '';
  }

  function getTopicPath(url) {
    var base = getBasePath();
    return base + url;
  }

  function getCurrentTopicId() {
    return document.body.getAttribute('data-topic') || '';
  }

  function getCurrentPage() {
    var path = window.location.pathname;
    var filename = path.split('/').pop();
    return filename || 'index.html';
  }

  function buildSidebar(topics) {
    var nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    var base = getBasePath();
    var currentTopicId = getCurrentTopicId();
    var currentPage = getCurrentPage();
    var html = '';

    // Overview section
    html += '<div class="sidebar__section-title">Overview</div>';
    html += '<a href="' + base + 'index.html" class="sidebar__link' +
      (currentPage === 'index.html' && !currentTopicId ? ' sidebar__link--active' : '') +
      '">Home</a>';
    html += '<a href="' + base + 'complexity.html" class="sidebar__link' +
      (currentPage === 'complexity.html' ? ' sidebar__link--active' : '') +
      '">Complexity</a>';
    html += '<a href="' + base + 'compare.html" class="sidebar__link' +
      (currentPage === 'compare.html' ? ' sidebar__link--active' : '') +
      '">Compare</a>';
    html += '<a href="' + base + 'race.html" class="sidebar__link' +
      (currentPage === 'race.html' ? ' sidebar__link--active' : '') +
      '">Race</a>';
    html += '<a href="' + base + 'about.html" class="sidebar__link' +
      (currentPage === 'about.html' ? ' sidebar__link--active' : '') +
      '">About</a>';

    // Group topics by category
    var groups = {};
    for (var i = 0; i < topics.length; i++) {
      var t = topics[i];
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    }

    // Render by category order
    for (var c = 0; c < categoryOrder.length; c++) {
      var cat = categoryOrder[c];
      var items = groups[cat];
      if (!items || items.length === 0) continue;

      html += '<div class="sidebar__section-title">' + cat + '</div>';
      for (var j = 0; j < items.length; j++) {
        var topic = items[j];
        var isActive = topic.id === currentTopicId;
        html += '<a href="' + getTopicPath(topic.url) + '" class="sidebar__link' +
          (isActive ? ' sidebar__link--active' : '') +
          '" data-topic="' + topic.id + '">' + topic.title + '</a>';
      }
    }

    nav.innerHTML = html;
  }

  function init() {
    var nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    var base = getBasePath();
    var url = base + 'data/topics.json';

    // Fetch topics data
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          var topics = JSON.parse(xhr.responseText);
          buildSidebar(topics);
          // Re-run progress badges after sidebar is built
          if (DSA.progress && DSA.progress.updateBadges) {
            DSA.progress.updateBadges();
          }
        } catch (e) {
          // Fallback: leave sidebar as-is
        }
      }
    };
    xhr.send();
  }

  DSA.sidebarNav = { init: init };
})();
