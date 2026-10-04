(function () {
  'use strict';

  // Only measure the public site, never local previews or deployment previews.
  if (!['sorforsikringsmegling.no', 'www.sorforsikringsmegling.no'].includes(window.location.hostname)) return;
  if (window.sorAnalyticsLoaded) return;
  window.sorAnalyticsLoaded = true;

  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
  window.va('beforeSend', function (event) {
    var url = new URL(event.url);
    url.search = '';
    url.hash = '';
    return Object.assign({}, event, { url: url.toString() });
  });

  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);

  // Custom events require a Vercel Pro or Enterprise plan.
  // Record the action and page only, never form contents or contact details.
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    var name;
    if (/^tel:/i.test(href)) name = 'Telefonklikk';
    else if (/^mailto:/i.test(href)) name = 'Epostklikk';
    else {
      var target = new URL(href, window.location.href);
      if (target.origin === window.location.origin && /^\/kontakt(?:\.html|\/)?$/.test(target.pathname)) {
        name = 'Kontaktklikk';
      }
    }
    if (name) window.va('event', { name: name, data: { side: window.location.pathname } });
  });
})();
