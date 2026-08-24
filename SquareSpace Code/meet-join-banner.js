/**
 * Squarespace → Settings → Advanced → Code Injection → Footer
 *
 * Shows a "Join PTA meeting" pill while meet.weareedison.org reports the join
 * window is open. Schedule comes from Sanity → Meeting Settings.
 *
 * No polling. The status payload carries absolute timestamps, so this script
 * fetches once per page load and then sleeps until the next window boundary.
 * A typical visitor costs one request.
 */
(function () {
  var MEET_STATUS_URL = 'https://meet.weareedison.org/api/zoom/status';
  var MEET_JOIN_URL = 'https://meet.weareedison.org/';
  var BANNER_ID = 'edison-meet-banner';

  /* Wake up at least this often so a sleeping tab or clock drift can't strand us. */
  var MAX_SLEEP_MS = 30 * 60 * 1000;
  var MIN_SLEEP_MS = 15 * 1000;
  /* Re-fetch rather than reuse cached status once it is this old. */
  var STALE_AFTER_MS = 5 * 60 * 1000;

  var state = { data: null, fetchedAt: 0 };
  var timer = null;

  function ensureBanner(label) {
    var existing = document.getElementById(BANNER_ID);
    if (existing) return existing;

    var banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.style.cssText =
      'display:none;position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:9999;max-width:min(92vw,520px);width:100%;';

    var link = document.createElement('a');
    link.href = MEET_JOIN_URL;
    link.textContent = label;
    link.style.cssText =
      'display:block;text-align:center;background:#5f9cff;color:#fff;font-family:Overpass,system-ui,sans-serif;font-weight:700;text-transform:uppercase;text-decoration:none;padding:14px 22px;border-radius:999px;box-shadow:0 10px 30px rgba(53,72,116,.25);';

    banner.appendChild(link);
    document.body.appendChild(banner);
    return banner;
  }

  function setVisible(visible, label) {
    if (!visible) {
      var existing = document.getElementById(BANNER_ID);
      if (existing) existing.style.display = 'none';
      return;
    }
    var banner = ensureBanner(label);
    banner.firstChild.textContent = label;
    banner.style.display = 'block';
  }

  function ms(value) {
    var parsed = value ? Date.parse(value) : NaN;
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Recompute open/closed locally from the payload timestamps, and report when
   * the answer could next change.
   */
  function evaluate(data, now) {
    if (!data || !data.configured || data.enabled === false) {
      return { open: false, nextChangeAt: null };
    }

    var win = data.window;
    if (!win) {
      /* "Always" mode, or no schedule window — trust the server's flag. */
      return { open: data.open === true, nextChangeAt: null };
    }

    var start = ms(win.openStartsAt);
    var end = ms(win.openEndsAt);
    var next = ms(win.nextOpenAt);

    if (start !== null && end !== null && now >= start && now <= end) {
      return { open: true, nextChangeAt: end };
    }

    var upcoming = next !== null && next > now ? next : null;
    if (upcoming === null && start !== null && start > now) upcoming = start;

    return { open: false, nextChangeAt: upcoming };
  }

  function schedule(delayMs, refetch) {
    if (timer) clearTimeout(timer);
    var wait = Math.max(MIN_SLEEP_MS, Math.min(delayMs, MAX_SLEEP_MS));
    timer = setTimeout(function () {
      timer = null;
      if (refetch || Date.now() - state.fetchedAt > STALE_AFTER_MS) {
        load();
      } else {
        render();
      }
    }, wait);
  }

  function render() {
    var now = Date.now();
    var result = evaluate(state.data, now);
    var label =
      (state.data && state.data.title
        ? 'Join ' + state.data.title + ' in your browser'
        : 'Join PTA meeting in your browser');

    setVisible(result.open, label);

    if (result.nextChangeAt === null) {
      /* Nothing scheduled ahead — check again on the next long interval only. */
      schedule(MAX_SLEEP_MS, true);
      return;
    }

    /* Land just past the boundary so the recomputation flips cleanly. */
    schedule(result.nextChangeAt - now + 1000, false);
  }

  function load() {
    fetch(MEET_STATUS_URL, { credentials: 'omit' })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        state.data = data;
        state.fetchedAt = Date.now();
        render();
      })
      .catch(function () {
        setVisible(false);
        schedule(MAX_SLEEP_MS, true);
      });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') return;
    if (Date.now() - state.fetchedAt > STALE_AFTER_MS) load();
    else render();
  });

  load();
})();
