// BCX site behaviors: nav toggle, form validation, active nav state
(function () {
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Mark current page in nav
  var here = location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    var path = a.pathname.replace(/\/index\.html$/, '/');
    if (path === here) a.setAttribute('aria-current', 'page');
  });

  // Client-side form validation (server still validates via Netlify)
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var err = field.closest('div') && field.closest('div').querySelector('.error');
        var valid = field.checkValidity();
        if (err) err.style.display = valid ? 'none' : 'block';
        field.setAttribute('aria-invalid', valid ? 'false' : 'true');
        if (!valid) ok = false;
      });
      if (!ok) {
        e.preventDefault();
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
      }
    });
  });
})();
