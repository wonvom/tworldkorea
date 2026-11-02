(function () {
  const endpoint = 'https://members.tworldkorea.co.kr/account/shop/api/session';
  let flight = null;
  let lastCheck = 0;

  function paint(signedIn) {
    document.querySelectorAll('.nav-mypage').forEach(link => { link.hidden = !signedIn; });
    document.querySelectorAll('.nav-login, .nav-signup').forEach(link => { link.hidden = signedIn; });
  }

  function refresh() {
    if (document.hidden || flight || Date.now() - lastCheck < 2000) return flight;
    lastCheck = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    flight = fetch(endpoint, {
      method: 'GET', credentials: 'include', cache: 'no-store',
      signal: controller.signal, referrerPolicy: 'strict-origin-when-cross-origin'
    }).then(response => response.ok ? response.json() : { signedIn: false })
      .then(value => paint(value?.signedIn === true))
      .catch(() => paint(false))
      .finally(() => { clearTimeout(timer); flight = null; });
    return flight;
  }

  paint(false);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', refresh);
  refresh();
})();
