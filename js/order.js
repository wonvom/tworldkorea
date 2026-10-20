(function () {
  "use strict";
  const $ = id => document.getElementById(id), M = window.TworldPartnerModel;
  const products = window.products || [], inventoryOrigin = "https://tworld-inventory-api.halestork64.chatgpt.site";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const n = value => value.toLocaleString("ko-KR");
  const money = (value, pending = "확인 예정") => value === null ? pending : `${n(value)}원`;
  const element = (tag, value, className) => { const el = document.createElement(tag); el.textContent = value; if (className) el.className = className; return el; };
  // Prototype state is intentionally memory-only. No order/profile/PII request reaches the OS or gateway.
  let entered = false, lines = [], orders = [], inquiries = [], historyView = "orders", statement = null, orderCharges = {};
  let stockSession = null, stockController = null, stockSequence = 0, stockTimer = null, postcodePromise = null, accessController = null;
  const currentProduct = () => products.find(p => p.code === $("order-product").value);
  const newId = kind => `DEMO-${kind}-${M.dayISO().replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  function showTab(name, focus = true) {
    document.querySelectorAll("[data-tab]").forEach(button => { const active = button.dataset.tab === name; button.setAttribute("aria-selected", String(active)); button.tabIndex = active ? 0 : -1; $("panel-" + button.dataset.tab).hidden = !active; });
    if (focus) $("tab-" + name).focus();
    if (name === "mypage") renderHistory();
    if (name === "order") loadStock(); else cancelStock();
  }
  document.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => showTab(button.dataset.tab)));
  document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => showTab(button.dataset.go)));
  document.querySelector(".partner-tabs").addEventListener("keydown", event => {
    const tabs = [...document.querySelectorAll("[data-tab]")], index = tabs.indexOf(event.target);
    if (index < 0 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    showTab(tabs[next].dataset.tab);
  });
  $("order-code-form").addEventListener("submit", async event => {
    event.preventDefault();
    if (accessController) return;
    const controller = new AbortController(), button = $("order-code-form").querySelector("button");
    accessController = controller; button.disabled = true; $("order-access-status").textContent = "주문코드를 확인하고 있습니다…";
    const body = JSON.stringify({ code: $("order-code").value.trim() }); $("order-code").value = "";
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(inventoryOrigin + "/stock/partner-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body, credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer", signal: controller.signal });
      if (accessController !== controller) return;
      if (!response.ok) {
        $("order-access-status").textContent = response.status === 401 || response.status === 400 ? "주문코드를 확인해주세요." : response.status === 429 ? "입력 횟수가 많습니다. 잠시 후 다시 시도해주세요." : "주문코드를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.";
        return;
      }
      const value = await response.json();
      if (accessController !== controller) return;
      if (typeof value.token !== "string" || !Number.isFinite(value.expiresAt) || value.expiresAt <= Date.now() || value.expiresAt > Date.now() + 3605000) throw Error();
      stockSession = { token: value.token, expiresAt: value.expiresAt };
      entered = true; $("order-access-status").textContent = ""; $("order-access").hidden = true; $("partner-app").hidden = false;
      showTab(new URL(location.href).searchParams.has("product") ? "order" : "mypage");
      document.querySelector(".partner-tabs").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch { if (accessController === controller) $("order-access-status").textContent = "연결이 지연되고 있습니다. 잠시 후 다시 시도해주세요."; }
    finally { clearTimeout(timeout); if (accessController === controller) { accessController = null; button.disabled = false; } }
  });
  function leavePartner() {
    accessController?.abort(); accessController = null; $("order-code-form").querySelector("button").disabled = false;
    entered = false; cancelStock(); stockSession = null; lines = []; orders = []; inquiries = []; statement = null; orderCharges = {};
    document.querySelectorAll("dialog[open]").forEach(dialog => dialog.close());
    $("order-check-form").reset(); $("inquiry-form").reset(); $("order-code-form").reset();
    syncDelivery();
    $("statement-document").replaceChildren(); $("postcode-embed").replaceChildren(); $("postcode-panel").hidden = true;
    for (const id of ["order-access-status", "order-item-status", "order-review-status", "inquiry-status", "address-status"]) $(id).textContent = "";
    $("partner-app").hidden = true; $("order-access").hidden = false; renderLines(); renderHistory(); renderInquiries(); renderProduct(); $("order-code").focus();
  }
  $("partner-logout").addEventListener("click", leavePartner);
  function renderProduct() {
    const p = currentProduct(); if (!p) return;
    $("order-product-code").textContent = p.code; $("order-product-name").textContent = p.name;
    $("order-image").src = p.thumbnail; $("order-image").alt = p.name; $("order-product-link").href = `product-detail.html?id=${encodeURIComponent(p.id)}`;
    renderSizes();
  }
  function renderSizes() {
    cancelStock(); const p = currentProduct(); if (!p) return;
    const table = element("table", "", "quantity-table"), head = document.createElement("thead"), heading = document.createElement("tr"), body = document.createElement("tbody");
    table.append(element("caption", `${p.code} 색상·사이즈별 주문 수량과 현재 재고`, "sr-only"));
    const colorHeading = element("th", "COLOR"); colorHeading.scope = "col"; heading.append(colorHeading);
    for (const s of p.sizes) { const th = element("th", s.size); th.scope = "col"; heading.append(th); }
    head.append(heading); table.append(head, body);
    p.colors.forEach((c, colorIndex) => {
      const row = document.createElement("tr"), label = document.createElement("th"), color = element("span", "", "matrix-color"), swatch = element("span", "", "color-swatch");
      label.scope = "row"; swatch.setAttribute("aria-hidden", "true"); if (/^#[0-9a-f]{6}$/i.test(c.hex)) swatch.style.backgroundColor = c.hex;
      color.append(swatch, element("span", c.nameKr)); label.append(color); row.append(label);
      p.sizes.forEach((s, sizeIndex) => {
        const cell = document.createElement("td"), stock = element("small", "-", "matrix-stock"), input = document.createElement("input");
        Object.assign(input, { type: "number", min: "0", max: "9999", step: "1", value: "0", inputMode: "numeric", id: `quantity-${colorIndex}-${sizeIndex}` });
        input.dataset.size = s.size; input.dataset.color = c.code; input.setAttribute("aria-label", `${c.nameKr} ${s.size} 주문 수량`);
        const clearZero = () => { if (input.value !== "" && Number(input.value) === 0) input.value = ""; };
        input.addEventListener("focus", clearZero);
        input.addEventListener("click", clearZero);
        input.addEventListener("blur", () => { if (input.value === "" && !input.validity.badInput) input.value = "0"; });
        stock.dataset.stockSize = s.size; stock.dataset.stockColor = c.code; stock.id = `stock-${colorIndex}-${sizeIndex}`; stock.setAttribute("aria-label", `${c.nameKr} ${s.size} 현재 재고 미확인`); input.setAttribute("aria-describedby", stock.id);
        cell.append(input, stock); row.append(cell);
      });
      body.append(row);
    });
    $("order-sizes").replaceChildren(table); $("order-sizes").scrollTop = 0; $("order-sizes").scrollLeft = 0;
    $("order-item-status").textContent = ""; loadStock();
  }
  $("order-image").addEventListener("error", () => { const p = currentProduct(); if (p && !$("order-image").src.endsWith(p.thumbnail)) $("order-image").src = p.thumbnail; });
  for (const p of products) { const o = element("option", `${p.code} · ${p.name}`); o.value = p.code; $("order-product").append(o); }
  const selected = new URL(location.href).searchParams.get("product"), initial = products.find(p => p.id === selected || p.code === selected);
  if (initial) $("order-product").value = initial.code;
  $("order-product").addEventListener("change", renderProduct);
  function amountSummary(total, hasItems) {
    const summary = element("dl", "", "amount-summary");
    const pending = total.confirmed ? "금액 확인 후 안내" : "단가 확인 후 안내";
    for (const [label, value, fallback] of [
      ["상품금액 (공급가액)", total.supply, "단가 확인 후 안내"],
      ["부가세", total.vat, "확인 예정"],
      ["배송비", total.shipping, "확인 예정"],
      ["총 주문금액", total.total, pending]
    ]) {
      const row = element("div", "", label === "총 주문금액" ? "amount-grand-total" : "");
      const amount = element("dd", hasItems ? money(value, fallback) : "-");
      amount.dataset.pending = String(!hasItems || value === null);
      row.append(element("dt", label), amount); summary.append(row);
    }
    return summary;
  }
  function renderLines() {
    $("order-items").replaceChildren(...lines.map((line, index) => {
      const row = element("article", "", "order-line"), info = document.createElement("div"), controls = element("div", "", "line-controls");
      info.append(element("strong", line.productCode), element("p", line.productName), element("small", `${line.color} · ${line.size}`));
      const input = document.createElement("input"); Object.assign(input, { type: "number", min: "1", max: "9999", step: "1", value: String(line.quantity), inputMode: "numeric" }); input.setAttribute("aria-label", `${line.productCode} ${line.color} ${line.size} 주문 수량`);
      input.addEventListener("change", () => { const value = Number(input.value); if (!Number.isInteger(value) || value < 1 || value > 9999) { input.value = String(line.quantity); return; } lines[index].quantity = value; orderCharges = {}; renderLines(); });
      const remove = element("button", "삭제", "order-remove"); remove.type = "button"; remove.setAttribute("aria-label", `${line.productCode} ${line.color} ${line.size} 삭제`); remove.addEventListener("click", () => { lines.splice(index, 1); orderCharges = {}; renderLines(); });
      info.append(element("p", `상품금액 ${money(M.lineAmount(line), "단가 확인 후 안내")}`, "line-amount"));
      controls.append(input, element("span", "장"), remove); row.append(info, controls); return row;
    }));
    $("order-empty").hidden = lines.length > 0; $("order-item-count").textContent = `${lines.length}개 조합`; $("cart-count").textContent = String(lines.length);
    const total = M.totals(lines, orderCharges);
    $("order-total").replaceChildren(document.createTextNode(n(total.quantity)), element("small", "장"));
    $("order-amounts").replaceChildren(amountSummary(total, lines.length > 0));
  }
  $("order-add").addEventListener("click", () => {
    const p = currentProduct(), inputs = [...document.querySelectorAll("#order-sizes input")];
    if (inputs.some(input => input.validity.badInput || !Number.isInteger(Number(input.value)) || Number(input.value) < 0 || Number(input.value) > 9999)) { $("order-item-status").textContent = "주문 수량은 0~9,999 사이의 정수로 입력해주세요."; return; }
    const added = inputs.filter(input => Number(input.value) > 0).map(input => { const c = p.colors.find(color => color.code === input.dataset.color); return { productCode: p.code, productName: p.name, colorCode: c.code, color: c.nameKr, size: input.dataset.size, quantity: Number(input.value), unitPrice: null }; });
    if (!added.length) { $("order-item-status").textContent = "한 개 이상의 사이즈에 주문 수량을 입력해주세요."; return; }
    try { lines = M.combine(lines, added); orderCharges = {}; renderLines(); inputs.forEach(input => input.value = "0"); $("order-item-status").textContent = `${added.length}개 조합을 주문서에 담았습니다.`; }
    catch(error) { $("order-item-status").textContent = error.message; }
  });
  function syncDelivery() {
    const useNew = document.querySelector('[name="delivery"]:checked').value === "NEW_ADDRESS";
    $("business-address").hidden = useNew; $("new-address").hidden = !useNew; $("new-address").disabled = !useNew;
    if (!useNew) { $("postcode-panel").hidden = true; $("postcode-embed").replaceChildren(); }
  }
  document.querySelectorAll('[name="delivery"]').forEach(input => input.addEventListener("change", syncDelivery));
  $("recipient-phone").addEventListener("input", () => $("recipient-phone").setCustomValidity(""));
  function postcodeLibrary() {
    if (window.kakao?.Postcode) return Promise.resolve();
    if (!postcodePromise) postcodePromise = new Promise((resolve, reject) => {
      const script = document.createElement("script"); script.src = "https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"; script.async = true; script.referrerPolicy = "no-referrer";
      const timeout = setTimeout(() => { script.remove(); postcodePromise = null; reject(Error()); }, 12000);
      script.onload = () => { clearTimeout(timeout); if (window.kakao?.Postcode) resolve(); else { postcodePromise = null; reject(Error()); } };
      script.onerror = () => { clearTimeout(timeout); script.remove(); postcodePromise = null; reject(Error()); }; document.head.append(script);
    });
    return postcodePromise;
  }
  $("address-search").addEventListener("click", async () => {
    const button = $("address-search"); button.disabled = true; $("address-status").textContent = "주소 검색을 여는 중입니다…";
    try { await postcodeLibrary(); if (!entered || $("new-address").disabled) return; $("postcode-panel").hidden = false; $("postcode-embed").replaceChildren();
      new window.kakao.Postcode({ width: "100%", height: "100%", oncomplete(data) {
        if (!entered || $("new-address").disabled) return;
        $("delivery-postcode").value = data.zonecode || ""; $("delivery-address").value = data.address || data.roadAddress || data.jibunAddress || "";
        $("postcode-panel").hidden = true; $("delivery-detail").focus(); $("address-status").textContent = "주소가 선택되었습니다. 상세 주소를 확인해주세요.";
      } }).embed($("postcode-embed")); $("address-status").textContent = "도로명, 건물명 또는 지번으로 검색해주세요.";
    } catch { $("address-status").textContent = "주소 검색을 열지 못했습니다. 다시 시도하거나 우편번호와 주소를 직접 입력해주세요."; }
    finally { button.disabled = false; }
  });
  $("address-close").addEventListener("click", () => { $("postcode-panel").hidden = true; $("postcode-embed").replaceChildren(); $("address-search").focus(); });
  document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => $(button.dataset.close).close()));
  $("order-check-form").addEventListener("submit", event => {
    event.preventDefault(); if (!entered) return;
    if (!lines.length) { $("order-review-status").textContent = "상품을 먼저 주문서에 담아주세요."; $("order-product").focus(); return; }
    const newAddress = document.querySelector('[name="delivery"]:checked').value === "NEW_ADDRESS";
    if (newAddress && !M.validPhone($("recipient-phone").value)) { $("recipient-phone").setCustomValidity("연락 가능한 전화번호를 숫자와 하이픈으로 입력해주세요."); $("recipient-phone").reportValidity(); return; }
    if (newAddress && (!$("recipient-name").value.trim() || !$("delivery-address").value.trim())) { $("order-review-status").textContent = "수령인 이름과 기본 주소를 입력해주세요."; return; }
    statement = { id: newId("ORDER"), createdAt: M.dayISO(), items: lines.map(line => ({ ...line })), charges: { ...orderCharges }, delivery: newAddress ? { type: "NEW_ADDRESS", name: $("recipient-name").value.trim(), phone: $("recipient-phone").value.trim(), postcode: $("delivery-postcode").value, address: $("delivery-address").value.trim(), detail: $("delivery-detail").value.trim() } : { type: "BUSINESS_ADDRESS", name: "등록 담당자 · 연결 예정", phone: "등록 연락처 · 연결 예정", postcode: "", address: "사업자등록증 등록 주소 · OS 연결 후 표시", detail: "" }, confirmed: false };
    $("order-review-status").textContent = ""; showStatement(statement);
  });
  function showStatement(order) {
    statement = order; const total = M.totals(order.items, order.charges), d = order.delivery;
    $("statement-document").className = "statement-document";
    $("statement-document").innerHTML = `<div class="statement-head"><div><p>T-WORLD KOREA</p><h2 id="statement-title">거래명세서</h2><p>확인용 · ${total.confirmed ? "단가 반영" : "단가 미확정"} · 시연 문서</p></div><div>${esc(order.createdAt)}<br><span class="mini-tag">${order.confirmed ? "시연 내역" : "주문 미리보기"}</span></div></div><div class="statement-parties"><div><span>공급자</span><strong>주식회사 티월드코리아</strong><p>사업자 정보는 사내 OS 연결 후 표시됩니다.</p></div><div><span>공급받는 자</span><strong>시연용 거래처</strong><p>사업자등록증 기준 정보 · 연결 예정</p></div></div><div class="statement-table-wrap"><table class="statement-table"><thead><tr><th>상품</th><th>색상 / 사이즈</th><th>수량</th><th>단가</th><th>공급가액</th></tr></thead><tbody>${order.items.map(line => `<tr><td>${esc(line.productCode)}<small>${esc(line.productName)}</small></td><td>${esc(line.color)} / ${esc(line.size)}</td><td>${n(line.quantity)}장</td><td>${M.lineAmount(line) === null ? "확인 예정" : money(line.unitPrice)}</td><td>${money(M.lineAmount(line), "-")}</td></tr>`).join("")}</tbody></table></div><div class="statement-summary"><span>총 수량 <strong>${n(total.quantity)}장</strong></span></div><div class="statement-delivery"><strong>배송 정보</strong><br>${d.type === "BUSINESS_ADDRESS" ? "사업자등록증 주소 (기본)" : "새 배송지"}<br>${esc([d.postcode, d.address, d.detail].filter(Boolean).join(" "))}<br>수령인: ${esc(d.name)} · 연락처: ${esc(d.phone)}</div><p class="statement-warning">${esc(order.id)}<br>이 문서는 화면 확인용이며 거래 확정, 결제 또는 세금계산서 발행을 의미하지 않습니다. 공급단가·부가세·배송비와 납기는 담당자 확인 후 확정됩니다. 입력 내용은 사내 OS로 전송되지 않습니다.</p>`;
    $("statement-document").querySelector(".statement-summary").append(amountSummary(total, true));
    $("statement-confirm").hidden = order.confirmed; $("statement-edit").hidden = order.confirmed; $("statement-status").textContent = ""; $("statement-dialog").showModal(); $("statement-dialog").scrollTop = 0;
  }
  $("statement-edit").addEventListener("click", () => { $("statement-dialog").close(); $("order-review").focus(); });
  $("statement-print").addEventListener("click", () => window.print());
  $("statement-confirm").addEventListener("click", () => {
    if (!entered || !statement || statement.confirmed) return;
    statement.confirmed = true; orders.unshift(statement); lines = []; orderCharges = {}; renderLines(); $("order-check-form").reset(); syncDelivery(); $("statement-dialog").close(); historyView = "orders"; showTab("mypage");
  });
  function empty(container, title, detail, action) { container.replaceChildren(); const box = element("div", "", "empty-state"); box.append(element("span", "―"), element("p", title), element("small", detail)); if (action) { const b = element("button", "첫 주문 작성하기 →", "text-button"); b.type = "button"; b.addEventListener("click", () => showTab("order")); box.append(b); } container.append(box); }
  function renderHistory() {
    $("metric-orders").replaceChildren(document.createTextNode(String(orders.length)), element("small", "건")); $("metric-pending").replaceChildren(document.createTextNode(String(orders.length)), element("small", "건"));
    document.querySelectorAll("[data-history]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.history === historyView)));
    if (historyView === "shipments") { empty($("history-list"), "아직 발송 내역이 없습니다.", "OS 연결 후 택배사, 운송장과 배송 상태가 이곳에 표시됩니다."); return; }
    if (!orders.length) { empty($("history-list"), "아직 주문 내역이 없습니다.", "주문 확인 후 시연 내역에 추가해보세요.", true); return; }
    $("history-list").replaceChildren(...orders.map(order => {
      const row = element("article", "", "history-row"), top = element("div", "", "history-top"), actions = element("div", "", "history-actions"), total = M.totals(order.items);
      top.append(element("span", order.createdAt), element("span", "시연 · 확인 대기", "status-pill")); row.append(top, element("h4", order.items[0].productCode + (order.items.length > 1 ? ` 외 ${order.items.length - 1}개 조합` : "")), element("p", `${order.id}\n총 ${n(total.quantity)}장`));
      const button = element("button", "거래명세서 보기 →", "text-button"); button.type = "button"; button.addEventListener("click", () => showStatement(order)); actions.append(element("span", "실제 접수 전", "subtle"), button); row.append(actions); return row;
    }));
  }
  document.querySelectorAll("[data-history]").forEach(b => b.addEventListener("click", () => { historyView = b.dataset.history; renderHistory(); }));
  function renderInquiries() {
    $("metric-inquiries").replaceChildren(document.createTextNode(String(inquiries.length)), element("small", "건"));
    if (!inquiries.length) { empty($("inquiry-history"), "남긴 문의가 없습니다.", "시연 문의를 작성하면 이곳에서 확인할 수 있습니다."); return; }
    $("inquiry-history").replaceChildren(...inquiries.map(inquiry => { const row = element("article", "", "history-row"); row.append(element("span", "시연 · 미전송", "status-pill"), element("h4", inquiry.type), element("p", inquiry.message), element("p", `${inquiry.date}${inquiry.reference ? " · " + inquiry.reference : ""}`)); return row; }));
  }
  $("inquiry-form").addEventListener("submit", event => { event.preventDefault(); if (!entered || !$("inquiry-message").value.trim()) return; inquiries.unshift({ type: $("inquiry-type").value, message: $("inquiry-message").value.trim(), reference: $("inquiry-reference").value.trim(), date: M.dayISO() }); renderInquiries(); $("inquiry-form").reset(); $("inquiry-status").textContent = "현재 화면의 시연 내역에 추가했습니다. 담당자에게 전송되지 않았습니다."; });
  function cancelStock() { $("order-sizes").setAttribute("aria-busy", "false"); stockSequence++; stockController?.abort(); stockController = null; clearTimeout(stockTimer); }
  function stockActive() { return stockSession && stockSession.expiresAt > Date.now(); }
  function paintStock(payload) {
    const p = currentProduct(), colors = new Map();
    if (payload) for (const c of p.colors) colors.set(c.code, window.TworldInventory.quantitiesFor(payload, p, c.code));
    document.querySelectorAll("[data-stock-size]").forEach(span => {
      const value = colors.get(span.dataset.stockColor)?.get(span.dataset.stockSize), known = Number.isSafeInteger(value) && value >= 0;
      span.textContent = known ? n(value) : "-"; span.dataset.stock = known ? (value === 0 ? "empty" : "known") : "unknown";
      span.setAttribute("aria-label", `현재 재고 ${known ? n(value) + "장" : "미확인"}`);
    });
  }
  function renewPartnerAccess() {
    cancelStock(); stockSession = null; entered = false; paintStock();
    $("partner-app").hidden = true; $("order-access").hidden = false;
    $("order-access-status").textContent = "이용 시간이 만료되었습니다. 주문코드를 다시 입력해주세요. 작성 중인 주문서는 유지됩니다.";
    $("order-code").focus();
  }
  async function loadStock() {
    cancelStock(); const p = currentProduct();
    if (!entered || !p || $("panel-order").hidden || document.hidden) return;
    if (!stockActive()) { paintStock(); renewPartnerAccess(); return; }
    const seq = stockSequence, controller = new AbortController(); stockController = controller;
    const timer = setTimeout(() => controller.abort(), 10000); $("stock-status").textContent = "전체 색상 재고 조회 중…"; $("order-sizes").setAttribute("aria-busy", "true");
    try {
      const response = await fetch(`${inventoryOrigin}/stock?product=${encodeURIComponent(p.code)}`, { headers: { Authorization: `Bearer ${stockSession.token}` }, cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer", signal: controller.signal });
      if (seq !== stockSequence) return;
      if ([401, 403].includes(response.status)) { renewPartnerAccess(); return; }
      if (!response.ok) throw Error(); const payload = await response.json(); if (seq !== stockSequence) return;
      paintStock(payload);
      $("stock-status").textContent = payload.availability === "inquiry" ? "문의 상품의 재고는 모두 -로 표시됩니다." : payload.availability === "unavailable" ? "현재 재고를 확인할 수 없습니다. 수량은 -로 표시됩니다." : `${new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })} 조회 · 입력칸 아래는 현재 재고(장)입니다. 실제 주문 가능 수량은 담당자가 확인합니다.`;
    } catch { if (seq === stockSequence) { paintStock(); $("stock-status").textContent = "현재 재고를 확인할 수 없습니다. 재고 새로고침을 눌러 다시 시도해주세요."; } }
    finally { clearTimeout(timer); if (seq === stockSequence) { $("order-sizes").setAttribute("aria-busy", "false"); stockController = null; if (stockActive()) stockTimer = setTimeout(loadStock, 30000); } }
  }
  $("stock-refresh").addEventListener("click", loadStock);
  document.addEventListener("visibilitychange", () => document.hidden ? cancelStock() : loadStock()); window.addEventListener("pagehide", leavePartner);
  const navToggle = document.querySelector("[data-nav-toggle]"), header = document.querySelector("[data-header]");
  navToggle.addEventListener("click", () => { const open = navToggle.getAttribute("aria-expanded") !== "true"; navToggle.setAttribute("aria-expanded", String(open)); navToggle.classList.toggle("is-active", open); header.classList.toggle("is-open", open); document.querySelector("[data-nav]").classList.toggle("is-open", open); document.body.classList.toggle("is-nav-open", open); });
  window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 20), { passive: true });
  renderProduct(); renderLines(); renderHistory(); renderInquiries(); syncDelivery();
})();
