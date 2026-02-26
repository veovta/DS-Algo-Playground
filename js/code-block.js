var DSA = window.DSA || {};

(function() {
  'use strict';

  // Regex-based syntax highlighter for Python, Java, C++
  var rules = {
    python: [
      { pattern: /(#.*$)/gm, cls: 'syn-comment' },
      { pattern: /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, cls: 'syn-string' },
      { pattern: /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|yield|lambda|pass|break|continue|and|or|not|in|is|True|False|None|raise|del|global|nonlocal|assert)\b/g, cls: 'syn-keyword' },
      { pattern: /\b(print|len|range|int|str|float|list|dict|set|tuple|type|isinstance|enumerate|zip|map|filter|sorted|reversed|any|all|min|max|sum|abs|input|open|append|pop|insert|remove|index)\b(?=\s*\()/g, cls: 'syn-function' },
      { pattern: /\b(\d+\.?\d*)\b/g, cls: 'syn-number' },
      { pattern: /([\+\-\*\/=%<>!&\|]+)/g, cls: 'syn-operator' }
    ],
    java: [
      { pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, cls: 'syn-comment' },
      { pattern: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, cls: 'syn-string' },
      { pattern: /\b(public|private|protected|static|final|void|class|interface|extends|implements|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|import|package|this|super|null|true|false|abstract|synchronized|volatile|transient|native|instanceof)\b/g, cls: 'syn-keyword' },
      { pattern: /\b(int|long|short|byte|float|double|char|boolean|String|Integer|Long|Double|Boolean|Object|List|ArrayList|LinkedList|Map|HashMap|Set|HashSet|Arrays|System|Math)\b/g, cls: 'syn-type' },
      { pattern: /\b([a-zA-Z_]\w*)\s*(?=\()/g, cls: 'syn-function' },
      { pattern: /\b(\d+\.?\d*[fFdDlL]?)\b/g, cls: 'syn-number' },
      { pattern: /([\+\-\*\/=%<>!&\|]+)/g, cls: 'syn-operator' }
    ],
    cpp: [
      { pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, cls: 'syn-comment' },
      { pattern: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, cls: 'syn-string' },
      { pattern: /(#\s*include\s*[<"][^>"]*[>"])/gm, cls: 'syn-keyword' },
      { pattern: /\b(int|long|short|float|double|char|bool|void|unsigned|signed|const|auto|size_t|string|vector|list|map|set|pair|iterator|nullptr)\b/g, cls: 'syn-type' },
      { pattern: /\b(if|else|for|while|do|switch|case|break|continue|return|class|struct|public|private|protected|virtual|override|new|delete|try|catch|throw|using|namespace|template|typename|typedef|static|extern|inline|constexpr|true|false|this|sizeof|include|endl)\b/g, cls: 'syn-keyword' },
      { pattern: /\b(cout|cin|push_back|pop_back|size|empty|begin|end|sort|find|erase|insert|printf|scanf|malloc|free)\b(?=\s*[\(<])/g, cls: 'syn-function' },
      { pattern: /\b(\d+\.?\d*[fFlL]?)\b/g, cls: 'syn-number' },
      { pattern: /([\+\-\*\/=%<>!&\|:]+|<<|>>)/g, cls: 'syn-operator' }
    ]
  };

  function highlight(code, lang) {
    var escaped = escapeHtml(code);
    var langRules = rules[lang] || rules.python;
    var tokens = [];
    var id = 0;

    langRules.forEach(function(rule) {
      escaped = escaped.replace(rule.pattern, function(match) {
        var placeholder = '\x00T' + id + '\x00';
        tokens.push({ id: id, html: '<span class="' + rule.cls + '">' + match + '</span>' });
        id++;
        return placeholder;
      });
    });

    // Restore tokens
    tokens.forEach(function(t) {
      escaped = escaped.replace('\x00T' + t.id + '\x00', t.html);
    });

    return escaped;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function initBlock(block) {
    var tabs = block.querySelectorAll('.code-block__tab');
    var panels = block.querySelectorAll('.code-block__panel');
    var copyBtn = block.querySelector('.code-block__copy');

    // Highlight all panels
    panels.forEach(function(panel) {
      var pre = panel.querySelector('.code-block__pre');
      if (!pre) return;
      var lang = panel.getAttribute('data-lang') || 'python';
      var raw = pre.textContent;
      panel.setAttribute('data-raw', raw);
      pre.innerHTML = highlight(raw, lang);
    });

    // Tab switching
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var lang = tab.getAttribute('data-lang');
        tabs.forEach(function(t) { t.classList.remove('code-block__tab--active'); });
        tab.classList.add('code-block__tab--active');
        panels.forEach(function(p) {
          if (p.getAttribute('data-lang') === lang) {
            p.classList.add('code-block__panel--active');
          } else {
            p.classList.remove('code-block__panel--active');
          }
        });
      });
    });

    // Copy button
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        var activePanel = block.querySelector('.code-block__panel--active');
        if (!activePanel) return;
        var text = activePanel.getAttribute('data-raw') || activePanel.textContent;
        navigator.clipboard.writeText(text).then(function() {
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('code-block__copy--copied');
          setTimeout(function() {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('code-block__copy--copied');
          }, 2000);
        });
      });
    }
  }

  function init() {
    var blocks = document.querySelectorAll('.code-block');
    blocks.forEach(initBlock);
  }

  DSA.codeBlock = { init: init, highlight: highlight };
})();
