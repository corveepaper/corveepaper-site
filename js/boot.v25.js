// Boot script — mounts the React tree and wires up the scroll progress bar +
// splash fadeout. Extracted from an inline <script> so the CSP can disallow
// inline scripts (script-src 'self' only — no 'unsafe-inline').
(function () {
  ReactDOM.createRoot(document.getElementById('root'))
    .render(React.createElement(DirectionEditorial));

  // Scroll progress bar — updates on window scroll
  var bar = document.getElementById('cp-progress-bar');
  var onScroll = function () {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hide splash once mounted (small delay so React commits + custom CSS
  // injects before the cream layer fades away — avoids a flash of unstyled
  // content).
  setTimeout(function () {
    var sp = document.getElementById('splash');
    if (sp) {
      sp.classList.add('gone');
      setTimeout(function () { sp.remove(); }, 500);
    }
  }, 150);
})();
