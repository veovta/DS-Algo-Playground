var DSA = window.DSA || {};

(function() {
  'use strict';

  var instances = {};
  var activeId = null;

  /**
   * Create a visualization controller.
   * @param {string} id - Unique identifier
   * @param {object} opts - { canvas, onRender(ctx, step, data), onStepChange(step, data) }
   */
  function create(id, opts) {
    var canvas = opts.canvas;
    var ctx = canvas.getContext('2d');
    var steps = [];
    var currentStep = 0;
    var playing = false;
    var speed = 500; // ms per step
    var timer = null;
    var dpr = window.devicePixelRatio || 1;

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
      if (opts.onRender && steps.length > 0) {
        opts.onRender(ctx, steps[currentStep], { width: w, height: h, step: currentStep, totalSteps: steps.length });
      } else if (opts.onRender) {
        opts.onRender(ctx, null, { width: w, height: h, step: 0, totalSteps: 0 });
      }
      updateControls();
    }

    function updateControls() {
      var container = canvas.closest('.viz-container');
      if (!container) return;

      var stepInfo = container.querySelector('.viz-step-info');
      if (stepInfo) {
        stepInfo.textContent = steps.length > 0 ? 'Step ' + (currentStep + 1) + ' / ' + steps.length : 'No steps';
      }

      var playBtn = container.querySelector('[data-viz-action="play"]');
      if (playBtn) {
        playBtn.innerHTML = playing
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
      }

      var prevBtn = container.querySelector('[data-viz-action="prev"]');
      if (prevBtn) prevBtn.disabled = currentStep <= 0;

      var nextBtn = container.querySelector('[data-viz-action="next"]');
      if (nextBtn) nextBtn.disabled = currentStep >= steps.length - 1;

      if (opts.onStepChange) {
        opts.onStepChange(steps[currentStep], { step: currentStep, totalSteps: steps.length });
      }
    }

    function play() {
      if (steps.length === 0) return;
      playing = true;
      clearInterval(timer);
      timer = setInterval(function() {
        if (currentStep < steps.length - 1) {
          currentStep++;
          render();
        } else {
          pause();
        }
      }, speed);
      updateControls();
    }

    function pause() {
      playing = false;
      clearInterval(timer);
      updateControls();
    }

    function togglePlay() {
      if (playing) pause(); else play();
    }

    function stepForward() {
      if (currentStep < steps.length - 1) {
        pause();
        currentStep++;
        render();
      }
    }

    function stepBackward() {
      if (currentStep > 0) {
        pause();
        currentStep--;
        render();
      }
    }

    function reset() {
      pause();
      currentStep = 0;
      render();
    }

    function setSteps(newSteps) {
      steps = newSteps || [];
      currentStep = 0;
      playing = false;
      clearInterval(timer);
      render();
    }

    function setSpeed(ms) {
      speed = ms;
      if (playing) {
        pause();
        play();
      }
    }

    function getStep() { return currentStep; }
    function getSteps() { return steps; }
    function isPlaying() { return playing; }

    // Bind controls
    var container = canvas.closest('.viz-container');
    if (container) {
      container.addEventListener('click', function(e) {
        var action = e.target.closest('[data-viz-action]');
        if (!action) return;
        var act = action.getAttribute('data-viz-action');
        if (act === 'play') togglePlay();
        else if (act === 'prev') stepBackward();
        else if (act === 'next') stepForward();
        else if (act === 'reset') reset();
      });

      var speedSlider = container.querySelector('.viz-controls__speed');
      if (speedSlider) {
        speedSlider.addEventListener('input', function() {
          var val = parseInt(speedSlider.value, 10);
          setSpeed(1100 - val); // invert: slider right = faster
        });
      }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    var inst = {
      render: render,
      play: play,
      pause: pause,
      togglePlay: togglePlay,
      stepForward: stepForward,
      stepBackward: stepBackward,
      reset: reset,
      setSteps: setSteps,
      setSpeed: setSpeed,
      getStep: getStep,
      getSteps: getSteps,
      isPlaying: isPlaying,
      resize: resizeCanvas,
      ctx: ctx,
      canvas: canvas
    };

    instances[id] = inst;
    activeId = id;
    return inst;
  }

  // Global controls for keyboard shortcuts
  function isActive() { return activeId !== null; }

  function togglePlay() {
    if (activeId && instances[activeId]) instances[activeId].togglePlay();
  }

  function stepForward() {
    if (activeId && instances[activeId]) instances[activeId].stepForward();
  }

  function stepBackward() {
    if (activeId && instances[activeId]) instances[activeId].stepBackward();
  }

  DSA.vizCore = {
    create: create,
    isActive: isActive,
    togglePlay: togglePlay,
    stepForward: stepForward,
    stepBackward: stepBackward,
    instances: instances
  };
})();
