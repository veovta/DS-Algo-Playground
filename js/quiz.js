var DSA = window.DSA || {};

(function() {
  'use strict';

  function initQuiz(quizEl) {
    var topicId = document.body.getAttribute('data-topic');
    var questions = quizEl.querySelectorAll('.quiz__question');
    var submitBtn = quizEl.querySelector('.quiz__submit');
    var retryBtn = quizEl.querySelector('.quiz__retry');
    var scoreEl = quizEl.querySelector('.quiz__score');
    var answered = {};
    var submitted = false;

    questions.forEach(function(q, qi) {
      var options = q.querySelectorAll('.quiz__option');
      options.forEach(function(opt) {
        opt.addEventListener('click', function() {
          if (submitted) return;
          options.forEach(function(o) { o.classList.remove('quiz__option--selected'); });
          opt.classList.add('quiz__option--selected');
          answered[qi] = opt.getAttribute('data-value');
        });
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', function() {
        if (submitted) return;
        submitted = true;
        var score = 0;
        var total = questions.length;

        questions.forEach(function(q, qi) {
          var correct = q.getAttribute('data-answer');
          var options = q.querySelectorAll('.quiz__option');
          var explanation = q.querySelector('.quiz__explanation');

          options.forEach(function(opt) {
            if (opt.getAttribute('data-value') === correct) {
              opt.classList.add('quiz__option--correct');
            }
            if (opt.classList.contains('quiz__option--selected') && opt.getAttribute('data-value') !== correct) {
              opt.classList.add('quiz__option--incorrect');
            }
          });

          if (answered[qi] === correct) score++;
          if (explanation) explanation.classList.add('visible');
        });

        if (scoreEl) {
          scoreEl.textContent = score + ' / ' + total;
          scoreEl.style.display = 'inline';
        }

        submitBtn.style.display = 'none';
        if (retryBtn) retryBtn.style.display = 'inline-flex';

        if (topicId && DSA.progress) {
          DSA.progress.saveQuizScore(topicId, score, total);
        }
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', function() {
        submitted = false;
        answered = {};
        questions.forEach(function(q) {
          var options = q.querySelectorAll('.quiz__option');
          options.forEach(function(opt) {
            opt.classList.remove('quiz__option--selected', 'quiz__option--correct', 'quiz__option--incorrect');
          });
          var explanation = q.querySelector('.quiz__explanation');
          if (explanation) explanation.classList.remove('visible');
        });
        if (scoreEl) scoreEl.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'inline-flex';
        retryBtn.style.display = 'none';
      });
    }
  }

  function init() {
    var quizzes = document.querySelectorAll('.quiz');
    quizzes.forEach(initQuiz);
  }

  DSA.quiz = { init: init };
})();
