(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TworldInventory = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const refreshInterval = 30000;
  const requestTimeout = 10000;

  function quantitiesFor(payload, product, colorCode) {
    if (payload?.product !== product.code || !Array.isArray(payload.variants)) {
      throw new Error("Invalid inventory response");
    }
    const quantities = new Map();
    const seen = new Set();
    const sizes = new Set(product.sizes.map((size) => size.size));
    for (const variant of payload.variants) {
      if (!variant || variant.colorCode !== colorCode || !sizes.has(variant.size)) continue;
      const quantity = variant.quantity;
      quantities.set(variant.size, !seen.has(variant.size) && Number.isSafeInteger(quantity) && quantity >= 0 ? quantity : null);
      seen.add(variant.size);
    }
    return quantities;
  }

  function attach(selector, product, config) {
    if (!selector || config?.enabled !== true || !product?.code || !product.sizes?.length || !product.colors?.length || !config.endpoint) return null;
    let endpoint;
    try {
      endpoint = new URL(config.endpoint, location.href);
    } catch (error) {
      return null;
    }
    const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
    const localHttp = endpoint.protocol === "http:" && localHosts.has(location.hostname) && localHosts.has(endpoint.hostname);
    if (endpoint.protocol !== "https:" && !localHttp) return null;
    if (endpoint.username || endpoint.password) return null;
    const grid = selector.querySelector(".sample-size-grid");
    if (!grid) return null;
    const authEndpoint = new URL(endpoint);
    authEndpoint.pathname = `${authEndpoint.pathname.replace(/\/$/, "")}/auth`;
    authEndpoint.search = "";
    authEndpoint.hash = "";
    const storageKey = `tworld-stock-session-v1:${endpoint.origin}`;

    const heading = document.createElement("div");
    heading.className = "stock-heading";
    grid.before(heading);
    heading.append(grid.parentElement.querySelector("h3"));
    const refresh = document.createElement("button");
    refresh.type = "button";
    refresh.className = "stock-refresh";
    refresh.title = "재고 새로고침";
    refresh.setAttribute("aria-label", "재고 새로고침");
    const icon = document.createElement("img");
    icon.src = "images/icons/refresh-cw.svg?v=20261020-inventory-all";
    icon.alt = "";
    icon.width = 16;
    icon.height = 16;
    refresh.append(icon);
    const actions = document.createElement("div");
    actions.className = "stock-actions";
    const access = document.createElement("button");
    access.type = "button";
    access.className = "stock-access";
    access.textContent = "재고 확인";
    access.dataset.stockAccess = "";
    actions.append(access, refresh);
    heading.append(actions);

    const dialog = document.createElement("dialog");
    dialog.className = "stock-auth-dialog";
    dialog.setAttribute("aria-labelledby", "stock-auth-title");
    dialog.innerHTML = `<form class="stock-auth-form">
      <div class="stock-auth-heading"><h2 id="stock-auth-title">재고 확인</h2><button type="button" class="stock-auth-close" aria-label="닫기" title="닫기">\u00d7</button></div>
      <label for="stock-keyword">키워드</label>
      <input id="stock-keyword" name="stock-keyword" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="128" required aria-describedby="stock-auth-error">
      <p id="stock-auth-error" class="stock-auth-error" role="status" aria-live="polite"></p>
      <button type="submit" class="stock-auth-submit">확인</button>
    </form>`;
    document.body.append(dialog);
    const form = dialog.querySelector("form");
    const keywordInput = dialog.querySelector("input");
    const authError = dialog.querySelector(".stock-auth-error");
    const submit = dialog.querySelector('[type="submit"]');

    const status = document.createElement("p");
    status.className = "stock-status";
    status.dataset.stockStatus = "";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    grid.after(status);
    const entries = Array.from(grid.querySelectorAll(".sample-size")).map((label) => {
      const input = label.querySelector("input");
      const text = document.createElement("span");
      text.className = "size-stock";
      text.dataset.stockSize = input.value;
      label.classList.add("sample-size--stock");
      label.append(text);
      return { input, text };
    });

    let selected = null;
    let timer = null;
    let controller = null;
    let sequence = 0;
    let disposed = false;
    let nextRefreshAt = 0;
    let session = null;
    let expiryTimer = null;
    let authController = null;

    function authenticated() {
      return Boolean(session && session.expiresAt > Date.now());
    }

    function saveSession(value) {
      try {
        if (value) sessionStorage.setItem(storageKey, JSON.stringify(value));
        else sessionStorage.removeItem(storageKey);
      } catch { /* In-memory authentication still works when browser storage is blocked. */ }
    }

    function lock(message = "") {
      cancel();
      clearTimeout(expiryTimer);
      session = null;
      saveSession(null);
      paint("locked");
      access.textContent = "재고 확인";
      refresh.hidden = true;
      status.textContent = message;
      status.hidden = !message;
    }

    function unlock(value) {
      if (typeof value?.token !== "string" || !Number.isFinite(value.expiresAt) || value.expiresAt <= Date.now() || value.expiresAt > Date.now() + 3605000) throw new Error("Invalid authentication response");
      session = { token: value.token, expiresAt: value.expiresAt };
      saveSession(session);
      clearTimeout(expiryTimer);
      expiryTimer = setTimeout(() => lock("인증이 만료되었습니다."), session.expiresAt - Date.now());
      access.textContent = "재고 숨기기";
      refresh.hidden = false;
      status.hidden = false;
      refresh.disabled = !selected;
      paint("idle");
      status.textContent = "색상 미선택";
      if (selected) load();
    }

    function closeDialog() { dialog.close(); }

    function onDialogClose() {
      authController?.abort();
      authController = null;
      keywordInput.value = "";
      submit.disabled = false;
      submit.textContent = "확인";
    }

    function onAccess() {
      if (authenticated()) return lock();
      authError.textContent = "";
      keywordInput.value = "";
      dialog.showModal();
      keywordInput.focus();
    }

    async function authenticate(event) {
      event.preventDefault();
      if (authController) return;
      const request = new AbortController();
      authController = request;
      const timeout = setTimeout(() => request.abort(), requestTimeout);
      submit.disabled = true;
      submit.textContent = "확인 중";
      authError.textContent = "";
      const body = JSON.stringify({ keyword: keywordInput.value });
      keywordInput.value = "";
      try {
        const response = await fetch(authEndpoint, {
          method: "POST", body, cache: "no-store", credentials: "omit",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          signal: request.signal, referrerPolicy: "no-referrer"
        });
        if (authController !== request || disposed || !dialog.open) return;
        if (!response.ok) {
          authError.textContent = response.status === 401 ? "키워드를 확인해 주세요." : response.status === 429 ? "입력 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요." : response.status === 503 ? "재고 조회가 아직 설정되지 않았습니다." : "인증에 실패했습니다. 다시 시도해 주세요.";
          return;
        }
        const value = await response.json();
        if (authController !== request || disposed || !dialog.open) return;
        unlock(value);
        dialog.close();
      } catch {
        if (authController === request && dialog.open && !disposed) authError.textContent = "인증 서버에 연결하지 못했습니다. 다시 시도해 주세요.";
      } finally {
        clearTimeout(timeout);
        if (authController === request) {
          authController = null;
          submit.disabled = false;
          submit.textContent = "확인";
          if (dialog.open) keywordInput.focus();
        }
      }
    }

    function paint(state, quantities) {
      grid.dataset.stockState = state;
      grid.setAttribute("aria-busy", String(state === "loading"));
      for (const { input, text } of entries) {
        const locked = state === "locked";
        text.hidden = locked;
        text.closest(".sample-size").classList.toggle("sample-size--stock", !locked);
        if (locked) {
          text.textContent = "";
          input.removeAttribute("aria-label");
          continue;
        }
        const quantity = quantities?.get(input.value);
        const known = Number.isSafeInteger(quantity) && quantity >= 0;
        text.dataset.stockState = state === "ready" && known ? (quantity === 0 ? "empty" : "available") : state;
        text.textContent = state === "idle" ? "-" : state === "loading" ? "조회 중" : known ? (quantity === 0 ? "품절 (0장)" : `${quantity.toLocaleString("ko-KR")}장`) : "확인 불가";
        input.setAttribute("aria-label", `${input.value}, 재고 ${text.textContent}`);
      }
    }

    function cancel() {
      sequence += 1;
      clearTimeout(timer);
      timer = null;
      controller?.abort();
      controller = null;
    }

    function schedule() {
      clearTimeout(timer);
      timer = null;
      if (!disposed && authenticated() && selected && !document.hidden) timer = setTimeout(load, Math.max(0, nextRefreshAt - Date.now()));
    }

    async function load() {
      if (disposed || !selected || document.hidden) return;
      if (!authenticated()) return lock(session ? "인증이 만료되었습니다." : "");
      cancel();
      const current = sequence;
      const color = selected;
      nextRefreshAt = Date.now() + refreshInterval;
      const request = new AbortController();
      controller = request;
      const timeout = setTimeout(() => request.abort(), requestTimeout);
      refresh.disabled = true;
      paint("loading");
      status.textContent = `${color.name} 재고 조회 중`;
      try {
        const url = new URL(endpoint);
        url.searchParams.set("product", product.code);
        const response = await fetch(url, {
          cache: "no-store",
          credentials: "omit",
          headers: { Accept: "application/json", Authorization: `Bearer ${session.token}` },
          signal: request.signal,
          referrerPolicy: "no-referrer"
        });
        if (current !== sequence || disposed) return;
        if (response.status === 401 || response.status === 403) return lock("재고 확인을 위해 다시 인증해 주세요.");
        if (!response.ok) throw new Error(`Inventory HTTP ${response.status}`);
        const payload = await response.json();
        const quantities = quantitiesFor(payload, product, color.code);
        if (current !== sequence || disposed) return;
        paint("ready", quantities);
        const complete = entries.every(({ input }) => Number.isSafeInteger(quantities.get(input.value)));
        const time = new Date().toLocaleTimeString("ko-KR", { timeZone: "Asia/Seoul", hour12: false });
        status.textContent = payload.availability === "unavailable" ? `${color.name} · 원본 재고 확인 불가` : `${color.name} · ${time} 조회${complete ? "" : " · 일부 사이즈 확인 불가"}`;
      } catch (error) {
        if (current !== sequence || disposed) return;
        paint("error");
        status.textContent = `${color.name} · 재고 조회 실패`;
      } finally {
        clearTimeout(timeout);
        if (current === sequence && !disposed) {
          controller = null;
          refresh.disabled = false;
          schedule();
        }
      }
    }

    function choose(input) {
      const color = product.colors.find((entry) => entry.code === input.dataset.colorCode);
      if (!color) return;
      selected = { code: color.code, name: color.nameKr };
      load();
    }

    function onChange(event) {
      if (event.target.matches('input[name="sample-color"]') && event.target.dataset.colorCode !== selected?.code) choose(event.target);
    }

    function onClick(event) {
      // change covers keyboard selection; click also refreshes an already checked or restored radio.
      if (event.target.matches('input[name="sample-color"]')) choose(event.target);
    }

    function reset() {
      cancel();
      selected = null;
      if (!authenticated()) return lock();
      paint("idle");
      status.textContent = "색상 미선택";
      refresh.disabled = true;
    }

    function onVisibility() {
      if (document.hidden) {
        cancel();
        if (authenticated() && selected) {
          paint("paused");
          status.textContent = `${selected.name} · 조회 일시중지`;
        }
      } else if (selected) load();
    }

    function onPageShow(event) {
      if (event.persisted && selected) load();
    }

    function onPageHide() {
      cancel();
      if (dialog.open) dialog.close();
    }

    selector.addEventListener("change", onChange);
    selector.addEventListener("click", onClick);
    refresh.addEventListener("click", load);
    access.addEventListener("click", onAccess);
    form.addEventListener("submit", authenticate);
    dialog.querySelector(".stock-auth-close").addEventListener("click", closeDialog);
    dialog.addEventListener("close", onDialogClose);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    let stored = null;
    try {
      stored = JSON.parse(sessionStorage.getItem(storageKey));
    } catch { /* Storage is optional. */ }
    reset();
    try {
      if (stored) unlock(stored);
    } catch { lock(); }
    return {
      reset,
      destroy() {
        disposed = true;
        cancel();
        clearTimeout(expiryTimer);
        authController?.abort();
        dialog.remove();
        selector.removeEventListener("change", onChange);
        selector.removeEventListener("click", onClick);
        refresh.removeEventListener("click", load);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pagehide", onPageHide);
        window.removeEventListener("pageshow", onPageShow);
      }
    };
  }

  return Object.freeze({ attach, quantitiesFor, refreshInterval });
});
