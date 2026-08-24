/**
 * Squarespace → Settings → Advanced → Code Injection → Footer
 * Shows a “Join PTA meeting” pill when meet.weareedison.org reports open.
 */
(function () {
  var MEET_STATUS_URL = 'https://meet.weareedison.org/api/zoom/status';
  var MEET_JOIN_URL = 'https://meet.weareedison.org/';
  var BANNER_ID = 'edison-meet-banner';

  function ensureBanner() {
    var existing = document.getElementById(BANNER_ID);
    if (existing) return existing;

    var banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.style.cssText =
      'display:none;position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:9999;max-width:min(92vw,520px);width:100%;';

    banner.innerHTML =
      '<a href="' +
      MEET_JOIN_URL +
      '" style="display:block;text-align:center;background:#5f9cff;color:#fff;font-family:Overpass,system-ui,sans-serif;font-weight:700;text-transform:uppercase;text-decoration:none;padding:14px 22px;border-radius:999px;box-shadow:0 10px 30px rgba(53,72,116,.25);">Join PTA meeting in your browser</a>';

    document.body.appendChild(banner);
    return banner;
  }

  function refresh() {
    fetch(MEET_STATUS_URL, { credentials: 'omit' })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        var banner = ensureBanner();
        banner.style.display = data && data.open ? 'block' : 'none';
      })
      .catch(function () {
        var banner = document.getElementById(BANNER_ID);
        if (banner) banner.style.display = 'none';
      });
  }

  refresh();
  setInterval(refresh, 60 * 1000);
})();
