var DSA = window.DSA || {};

(function() {
  'use strict';

  /**
   * Code Trace - Highlights code lines in sync with visualization steps.
   * Each viz step can carry optional `codeLine` (number) and `variables` (object).
   *
   * Usage:
   *   var trace = DSA.codeTrace.init('.my-code-trace');
   *   // On each viz step:
   *   DSA.codeTrace.highlightLine(trace, 3);
   *   DSA.codeTrace.showVariables(trace, { i: 0, j: 1, temp: 5 });
   */

  function wrapCodeLines(container) {
    var codeEl = container.querySelector('.code-trace__code');
    if (!codeEl) return;

    // Already wrapped?
    if (codeEl.querySelector('.code-line')) return;

    var text = codeEl.textContent;
    var lines = text.split('\n');
    // Remove trailing empty line
    if (lines.length > 0 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }

    codeEl.innerHTML = '';
    for (var i = 0; i < lines.length; i++) {
      var span = document.createElement('span');
      span.className = 'code-line';
      span.setAttribute('data-line', String(i + 1));
      span.textContent = lines[i];
      codeEl.appendChild(span);
    }
  }

  function highlightLine(container, lineNumber) {
    if (!container) return;
    var lines = container.querySelectorAll('.code-line');
    for (var i = 0; i < lines.length; i++) {
      if (parseInt(lines[i].getAttribute('data-line'), 10) === lineNumber) {
        lines[i].classList.add('code-line--active');
      } else {
        lines[i].classList.remove('code-line--active');
      }
    }

    // Scroll active line into view
    var active = container.querySelector('.code-line--active');
    if (active) {
      var codeEl = container.querySelector('.code-trace__code');
      if (codeEl) {
        var top = active.offsetTop - codeEl.offsetTop - codeEl.clientHeight / 2 + active.offsetHeight / 2;
        codeEl.scrollTop = Math.max(0, top);
      }
    }
  }

  function clearHighlight(container) {
    if (!container) return;
    var lines = container.querySelectorAll('.code-line--active');
    for (var i = 0; i < lines.length; i++) {
      lines[i].classList.remove('code-line--active');
    }
  }

  var previousVars = {};

  function showVariables(container, vars) {
    if (!container) return;
    var panel = container.querySelector('.code-trace__vars');
    if (!panel) {
      // Create panel
      panel = document.createElement('div');
      panel.className = 'code-trace__vars';
      container.appendChild(panel);
    }

    if (!vars || Object.keys(vars).length === 0) {
      panel.innerHTML = '<span class="code-trace__vars-title">Variables</span><span style="color:var(--text-tertiary);font-size:12px;">No active variables</span>';
      previousVars = {};
      return;
    }

    var html = '<span class="code-trace__vars-title">Variables</span>';
    var keys = Object.keys(vars);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var v = vars[k];
      var displayVal = (v === null || v === undefined) ? 'null' : (typeof v === 'object' ? JSON.stringify(v) : String(v));
      var changed = previousVars[k] !== undefined && String(previousVars[k]) !== String(v);
      html += '<span class="code-trace__var' + (changed ? ' code-trace__var--changed' : '') + '">';
      html += '<span class="code-trace__var-name">' + k + '</span>';
      html += '<span class="code-trace__var-eq">=</span>';
      html += '<span class="code-trace__var-value">' + escapeHtml(displayVal) + '</span>';
      html += '</span>';
    }
    panel.innerHTML = html;

    // Store for change detection
    previousVars = {};
    for (var j = 0; j < keys.length; j++) {
      previousVars[keys[j]] = vars[keys[j]];
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /**
   * Apply step data to code trace.
   * step should have optional .codeLine and .variables
   */
  function applyStep(container, step) {
    if (!container || !step) {
      clearHighlight(container);
      return;
    }
    if (step.codeLine) {
      highlightLine(container, step.codeLine);
    } else {
      clearHighlight(container);
    }
    if (step.variables) {
      showVariables(container, step.variables);
    }
  }

  function initContainer(selector) {
    var container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!container) return null;
    wrapCodeLines(container);
    return container;
  }

  DSA.codeTrace = {
    init: initContainer,
    highlightLine: highlightLine,
    clearHighlight: clearHighlight,
    showVariables: showVariables,
    applyStep: applyStep
  };
})();
