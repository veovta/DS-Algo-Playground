var DSA = window.DSA || {};

(function() {
  'use strict';

  var STORAGE_KEY = 'dsa-progress';

  function getData() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function markVisited(topicId) {
    var data = getData();
    if (!data[topicId]) data[topicId] = {};
    data[topicId].visited = true;
    data[topicId].lastVisited = Date.now();
    saveData(data);
    updateBadges();
  }

  function saveQuizScore(topicId, score, total) {
    var data = getData();
    if (!data[topicId]) data[topicId] = {};
    data[topicId].quizScore = score;
    data[topicId].quizTotal = total;
    data[topicId].quizCompleted = true;
    saveData(data);
    updateBadges();
  }

  function getTopicProgress(topicId) {
    var data = getData();
    return data[topicId] || { visited: false, quizScore: 0, quizTotal: 0, quizCompleted: false };
  }

  function getOverallPercent(topicIds) {
    var data = getData();
    if (!topicIds || topicIds.length === 0) return 0;
    var total = 0;
    topicIds.forEach(function(id) {
      var p = data[id];
      if (p) {
        if (p.visited) total += 50;
        if (p.quizCompleted && p.quizTotal > 0) {
          total += 50 * (p.quizScore / p.quizTotal);
        }
      }
    });
    return Math.round(total / topicIds.length);
  }

  function updateBadges() {
    var data = getData();
    var links = document.querySelectorAll('.sidebar__link[data-topic]');
    links.forEach(function(link) {
      var topicId = link.getAttribute('data-topic');
      var existing = link.querySelector('.sidebar__progress');
      var p = data[topicId];
      if (p && p.quizCompleted) {
        var pct = p.quizTotal > 0 ? Math.round(100 * p.quizScore / p.quizTotal) : 0;
        if (existing) {
          existing.textContent = pct + '%';
        } else {
          var badge = document.createElement('span');
          badge.className = 'sidebar__progress';
          badge.textContent = pct + '%';
          link.appendChild(badge);
        }
      }
    });

    var overallBar = document.querySelector('.progress-bar__fill');
    if (overallBar) {
      // Dynamically collect all topic IDs from sidebar links
      var allIds = [];
      var topicLinks = document.querySelectorAll('.sidebar__link[data-topic]');
      topicLinks.forEach(function(link) {
        var tid = link.getAttribute('data-topic');
        if (tid && allIds.indexOf(tid) === -1) allIds.push(tid);
      });
      // Fallback if sidebar not yet built
      if (allIds.length === 0) {
        allIds = ['arrays', 'linked-lists', 'stack', 'queue', 'hash-table', 'bst', 'heap',
                  'bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort',
                  'binary-search', 'bfs', 'dfs',
                  'two-pointers', 'sliding-window', 'dynamic-programming', 'recursion'];
      }
      var pct = getOverallPercent(allIds);
      overallBar.style.width = pct + '%';
      var label = document.querySelector('.progress-percent');
      if (label) label.textContent = pct + '%';
    }
  }

  function init() {
    var pageId = document.body.getAttribute('data-topic');
    if (pageId) markVisited(pageId);
    updateBadges();
  }

  DSA.progress = {
    init: init,
    markVisited: markVisited,
    saveQuizScore: saveQuizScore,
    getTopicProgress: getTopicProgress,
    getOverallPercent: getOverallPercent,
    updateBadges: updateBadges
  };
})();
