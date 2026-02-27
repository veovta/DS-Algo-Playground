var DSA = window.DSA || {};

(function() {
  'use strict';

  /**
   * Challenge Mode — Users perform algorithm steps by clicking.
   * System validates against expected steps with visual feedback.
   *
   * Usage:
   *   var ch = DSA.challenge.create('bubble-sort-challenge', {
   *     canvas: canvasEl,
   *     correctSteps: [...],
   *     onUserAction: function(clickData, state) { return actionResult; },
   *     onValidate: function(action, expected, stepIndex) { return bool; },
   *     onRender: function(ctx, state, meta) { },
   *     onComplete: function(score) { }
   *   });
   */

  function create(id, opts) {
    var canvas = opts.canvas;
    var ctx = canvas.getContext('2d');
    var correctSteps = opts.correctSteps || [];
    var currentStepIndex = 0;
    var score = 0;
    var mistakes = 0;
    var maxMistakes = opts.maxMistakes || 3;
    var hints = opts.hints || [];
    var state = opts.initialState ? JSON.parse(JSON.stringify(opts.initialState)) : {};
    var active = false;
    var completed = false;
    var feedbackTimer = null;
    var feedbackColor = null;
    var dpr = window.devicePixelRatio || 1;

    // Container for UI
    var container = canvas.closest('.viz-container') || canvas.parentElement;

    function resizeCanvas() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    }

    function render() {
      var w = canvas.width / dpr;
      var h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      if (opts.onRender) {
        opts.onRender(ctx, state, {
          width: w,
          height: h,
          stepIndex: currentStepIndex,
          totalSteps: correctSteps.length,
          score: score,
          mistakes: mistakes,
          active: active,
          completed: completed
        });
      }

      // Flash feedback overlay
      if (feedbackColor) {
        ctx.fillStyle = feedbackColor;
        ctx.fillRect(0, 0, w, h);
      }
    }

    function showFeedback(correct) {
      feedbackColor = correct ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      render();
      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(function() {
        feedbackColor = null;
        render();
      }, 400);
    }

    function updateScoreDisplay() {
      var scoreEl = container.querySelector('.challenge-score');
      if (scoreEl) {
        scoreEl.textContent = 'Score: ' + score + '/' + correctSteps.length +
          (mistakes > 0 ? ' (' + mistakes + ' mistake' + (mistakes > 1 ? 's' : '') + ')' : '');
      }
      var progressEl = container.querySelector('.challenge-progress-fill');
      if (progressEl) {
        var pct = correctSteps.length > 0 ? Math.round(100 * currentStepIndex / correctSteps.length) : 0;
        progressEl.style.width = pct + '%';
      }
    }

    function handleClick(e) {
      if (!active || completed) return;
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      if (!opts.onUserAction) return;
      var action = opts.onUserAction({ x: x, y: y }, state);
      if (!action) return; // click didn't hit anything meaningful

      var expected = correctSteps[currentStepIndex];
      var isCorrect = false;

      if (opts.onValidate) {
        isCorrect = opts.onValidate(action, expected, currentStepIndex);
      } else {
        // Default: compare action string
        isCorrect = JSON.stringify(action) === JSON.stringify(expected);
      }

      showFeedback(isCorrect);

      if (isCorrect) {
        score++;
        currentStepIndex++;

        // Apply the action to state
        if (opts.onApplyAction) {
          opts.onApplyAction(action, state);
        }

        updateScoreDisplay();
        render();

        if (currentStepIndex >= correctSteps.length) {
          completed = true;
          active = false;
          updateScoreDisplay();
          if (opts.onComplete) {
            opts.onComplete(score, mistakes);
          }
          showCompletionMessage();
        }
      } else {
        mistakes++;
        updateScoreDisplay();

        if (mistakes >= maxMistakes && hints.length > 0) {
          showHint();
        }
      }
    }

    function showHint() {
      var feedbackEl = container.querySelector('.challenge-feedback');
      if (!feedbackEl) return;
      var hintIndex = Math.min(currentStepIndex, hints.length - 1);
      if (hints[hintIndex]) {
        feedbackEl.textContent = 'Hint: ' + hints[hintIndex];
        feedbackEl.style.display = 'block';
        setTimeout(function() {
          feedbackEl.style.display = 'none';
        }, 3000);
      }
    }

    function showCompletionMessage() {
      var feedbackEl = container.querySelector('.challenge-feedback');
      if (!feedbackEl) return;
      var pct = correctSteps.length > 0 ? Math.round(100 * score / correctSteps.length) : 0;
      var msg = 'Challenge complete! ';
      if (mistakes === 0) {
        msg += 'Perfect score!';
      } else {
        msg += pct + '% accuracy with ' + mistakes + ' mistake' + (mistakes > 1 ? 's' : '') + '.';
      }
      feedbackEl.textContent = msg;
      feedbackEl.className = 'challenge-feedback challenge-feedback--complete';
      feedbackEl.style.display = 'block';
    }

    function start() {
      currentStepIndex = 0;
      score = 0;
      mistakes = 0;
      completed = false;
      active = true;
      state = opts.initialState ? JSON.parse(JSON.stringify(opts.initialState)) : {};
      feedbackColor = null;

      var feedbackEl = container.querySelector('.challenge-feedback');
      if (feedbackEl) {
        feedbackEl.style.display = 'none';
        feedbackEl.className = 'challenge-feedback';
      }

      updateScoreDisplay();
      render();
    }

    function stop() {
      active = false;
    }

    function setSteps(steps, newHints) {
      correctSteps = steps || [];
      if (newHints) hints = newHints;
    }

    function setState(newState) {
      state = newState;
      render();
    }

    // Bind events
    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return {
      start: start,
      stop: stop,
      render: render,
      setSteps: setSteps,
      setState: setState,
      getState: function() { return state; },
      getScore: function() { return { score: score, mistakes: mistakes, total: correctSteps.length }; },
      isActive: function() { return active; },
      isCompleted: function() { return completed; },
      resize: resizeCanvas
    };
  }

  /**
   * Helper: create challenge mode UI elements inside a container
   */
  function createUI(container) {
    if (!container) return;

    // Check if already created
    if (container.querySelector('.challenge-mode')) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'challenge-mode';
    wrapper.innerHTML =
      '<div class="challenge-header">' +
        '<span class="challenge-score">Score: 0/0</span>' +
        '<div class="challenge-progress"><div class="challenge-progress-fill"></div></div>' +
        '<button class="btn btn--primary btn--sm challenge-start-btn">Start Challenge</button>' +
      '</div>' +
      '<div class="challenge-feedback" style="display:none;"></div>';

    container.appendChild(wrapper);
    return wrapper;
  }

  DSA.challenge = {
    create: create,
    createUI: createUI
  };
})();
