(function () {
  "use strict";
  const $ = id => document.getElementById(id), M = window.TworldPartnerModel;
  const products = window.products || [], inventoryOrigin = "https://tworld-inventory-api.halestork64.chatgpt.site";
  const stockKey = `tworld-stock-session-v1:${inventoryOrigin}`;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const n = value => value.toLocaleString("ko-KR");
  const element = (tag, value, className) => { const el = document.createElement(tag); el.textContent = value; if (className) el.className = className; return el; };
  // Prototype state is intentionally memory-only. No order/profile/PII request reaches the OS or gateway.
  let entered = false, lines = [], orders = [], inquiries = [], historyView = "orders", statement = null;
  let stockSession = null, stockController = null, stockSequence = 0, stockTimer = null, postcodePromise = null;
  let calendarYear, calendarMonth;
  const currentProduct = () => products.find(p => p.code === $("order-product").value);
  const currentColor = () => currentProduct()?.colors.find(c => c.code === $("order-color").value);
  const dateText = value => value ? new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short", timeZone: "Asia/Seoul" }).format(new Date(value + "T12:00:00+09:00")) : "미지정";
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
  $("order-code-form").addEventListener("submit", event => {
    event.preventDefault();
    if ($("order-code").value.trim() !== "9876") { $("order-access-status").textContent = "시연용 주문코드를 확인해주세요. 실제 거래처 인증은 아직 연결되지 않았습니다."; return; }
    $("order-code").value = ""; entered = true; $("order-access").hidden = true; $("partner-app").hidden = false;
    showTab(new URL(location.href).searchParams.has("product") ? "order" : "mypage");
    document.querySelector(".partner-tabs").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  function leavePartner() {
    entered = false; cancelStock(); stockSession = null; lines = []; orders = []; inquiries = []; statement = null;
    document.querySelectorAll("dialog[open]").forEach(dialog => dialog.close());
    $("order-check-form").reset(); $("inquiry-form").reset(); $("order-code-form").reset();
    $("order-date").value = ""; $("order-date-label").textContent = "날짜를 선택해주세요"; syncDelivery();
    $("statement-document").replaceChildren(); $("postcode-embed").replaceChildren(); $("postcode-panel").hidden = true;
    for (const id of ["order-access-status", "order-item-status", "order-review-status", "inquiry-status", "address-status"]) $(id).textContent = "";
    $("partner-app").hidden = true; $("order-access").hidden = false; renderLines(); renderHistory(); renderInquiries(); renderProduct(); $("order-code").focus();
  }
  $("partner-logout").addEventListener("click", leavePartner);
  function renderProduct() {
    const p = currentProduct(); if (!p) return;
    $("order-product-code").textContent = p.code; $("order-product-name").textContent = p.name;
    $("order-image").src = p.thumbnail; $("order-image").alt = p.name; $("order-product-link").href = `product-detail.html?id=${encodeURIComponent(p.id)}`;
    $("order-color").replaceChildren(...p.colors.map(c => { const o = element("option", c.nameKr); o.value = c.code; return o; }));
    renderSizes();
  }
  function renderSizes() {
    cancelStock(); const p = currentProduct(), c = currentColor(); if (!p || !c) return;
    $("order-image").src = c.image || p.thumbnail;
    $("order-sizes").replaceChildren(...p.sizes.map((s, index) => {
      const row = element("div", "", "quantity-row"), info = document.createElement("div"), label = element("label", s.size), stock = element("small", "현재 재고 -"), input = document.createElement("input");
      Object.assign(input, { type: "number", min: "0", max: "9999", step: "1", value: "0", inputMode: "numeric", id: `quantity-${index}` }); input.dataset.size = s.size; input.setAttribute("aria-label", `${s.size} 주문 수량`);
      label.htmlFor = input.id; stock.dataset.stockSize = s.size; info.append(label, stock); row.append(info, input); return row;
    }));
    $("order-item-status").textContent = ""; loadStock();
  }
  $("order-image").addEventListener("error", () => { const p = currentProduct(); if (p && !$("order-image").src.endsWith(p.thumbnail)) $("order-image").src = p.thumbnail; });
  for (const p of products) { const o = element("option", `${p.code} · ${p.name}`); o.value = p.code; $("order-product").append(o); }
  const selected = new URL(location.href).searchParams.get("product"), initial = products.find(p => p.id === selected || p.code === selected);
  if (initial) $("order-product").value = initial.code;
  $("order-product").addEventListener("change", renderProduct); $("order-color").addEventListener("change", renderSizes);
  function renderLines() {
    $("order-items").replaceChildren(...lines.map((line, index) => {
      const row = element("article", "", "order-line"), info = document.createElement("div"), controls = element("div", "", "line-controls");
      info.append(element("strong", line.productCode), element("p", line.productName), element("small", `${line.color} · ${line.size}`));
      const input = document.createElement("input"); Object.assign(input, { type: "number", min: "1", max: "9999", step: "1", value: String(line.quantity), inputMode: "numeric" }); input.setAttribute("aria-label", `${line.productCode} ${line.color} ${line.size} 주문 수량`);
      input.addEventListener("change", () => { const value = Number(input.value); if (!Number.isInteger(value) || value < 1 || value > 9999) { input.value = String(line.quantity); return; } lines[index].quantity = value; renderLines(); });
      const remove = element("button", "삭제", "order-remove"); remove.type = "button"; remove.setAttribute("aria-label", `${line.productCode} ${line.color} ${line.size} 삭제`); remove.addEventListener("click", () => { lines.splice(index, 1); renderLines(); });
      controls.append(input, element("span", "장"), remove); row.append(info, controls); return row;
    }));
    $("order-empty").hidden = lines.length > 0; $("order-item-count").textContent = `${lines.length}개 조합`; $("cart-count").textContent = String(lines.length);
    $("order-total").replaceChildren(document.createTextNode(n(M.totals(lines).quantity)), element("small", "장"));
  }
  $("order-add").addEventListener("click", () => {
    const p = currentProduct(), c = currentColor(), inputs = [...document.querySelectorAll("#order-sizes input")];
    if (inputs.some(input => !Number.isInteger(Number(input.value)) || Number(input.value) < 0 || Number(input.value) > 9999)) { $("order-item-status").textContent = "주문 수량은 0~9,999 사이의 정수로 입력해주세요."; return; }
    const added = inputs.filter(input => Number(input.value) > 0).map(input => ({ productCode: p.code, productName: p.name, colorCode: c.code, color: c.nameKr, size: input.dataset.size, quantity: Number(input.value), unitPrice: null }));
    if (!added.length) { $("order-item-status").textContent = "한 개 이상의 사이즈에 주문 수량을 입력해주세요."; return; }
    try { lines = M.combine(lines, added); renderLines(); inputs.forEach(input => input.value = "0"); $("order-item-status").textContent = `${added.length}개 조합을 주문서에 담았습니다.`; }
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
  function openCalendar() { const base = $("order-date").value || M.dayISO(); [calendarYear, calendarMonth] = base.split("-").map(Number); renderCalendar(); $("date-dialog").showModal(); }
  function renderCalendar() {
    const today = M.dayISO(), last = M.addDays(today, 365), days = new Date(Date.UTC(calendarYear, calendarMonth, 0)).getUTCDate(), offset = new Date(Date.UTC(calendarYear, calendarMonth - 1, 1)).getUTCDay();
    $("calendar-month").textContent = `${calendarYear}년 ${calendarMonth}월`; $("calendar-days").replaceChildren();
    for (let i = 0; i < offset; i++) $("calendar-days").append(element("span", ""));
    for (let day = 1; day <= days; day++) {
      const iso = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`, button = element("button", String(day)); button.type = "button"; button.dataset.date = iso;
      button.disabled = !M.validDate(iso, today); button.setAttribute("aria-label", dateText(iso)); button.setAttribute("aria-pressed", String($("order-date").value === iso));
      button.addEventListener("click", () => { $("order-date").value = iso; $("order-date-label").textContent = dateText(iso); $("date-dialog").close(); $("order-date-open").focus(); }); $("calendar-days").append(button);
    }
    const monthKey = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}`; $("calendar-prev").disabled = monthKey <= today.slice(0, 7); $("calendar-next").disabled = monthKey >= last.slice(0, 7);
  }
  function shiftMonth(delta) { const date = new Date(Date.UTC(calendarYear, calendarMonth - 1 + delta, 1)); calendarYear = date.getUTCFullYear(); calendarMonth = date.getUTCMonth() + 1; renderCalendar(); }
  $("order-date-open").addEventListener("click", openCalendar); $("calendar-prev").addEventListener("click", () => shiftMonth(-1)); $("calendar-next").addEventListener("click", () => shiftMonth(1));
  $("calendar-clear").addEventListener("click", () => { $("order-date").value = ""; $("order-date-label").textContent = "날짜를 선택해주세요"; $("date-dialog").close(); });
  $("calendar-days").addEventListener("keydown", event => {
    if (!event.target.dataset.date || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault(); const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key], iso = M.addDays(event.target.dataset.date, delta);
    if (!M.validDate(iso)) return; [calendarYear, calendarMonth] = iso.split("-").map(Number); renderCalendar(); $("calendar-days").querySelector(`[data-date="${iso}"]`)?.focus();
  });
  document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => $(button.dataset.close).close()));
  $("order-check-form").addEventListener("submit", event => {
    event.preventDefault(); if (!entered) return;
    if (!lines.length) { $("order-review-status").textContent = "상품을 먼저 주문서에 담아주세요."; $("order-product").focus(); return; }
    const newAddress = document.querySelector('[name="delivery"]:checked').value === "NEW_ADDRESS";
    if (newAddress && !M.validPhone($("recipient-phone").value)) { $("recipient-phone").setCustomValidity("연락 가능한 전화번호를 숫자와 하이픈으로 입력해주세요."); $("recipient-phone").reportValidity(); return; }
    if (!M.validDate($("order-date").value)) { $("order-review-status").textContent = "배송 희망일을 다시 선택해주세요."; openCalendar(); return; }
    if (newAddress && (!$("recipient-name").value.trim() || !$("delivery-address").value.trim())) { $("order-review-status").textContent = "수령인 이름과 기본 주소를 입력해주세요."; return; }
    statement = { id: newId("ORDER"), createdAt: M.dayISO(), items: lines.map(line => ({ ...line })), requestedDate: $("order-date").value, memo: $("delivery-memo").value.trim(), delivery: newAddress ? { type: "NEW_ADDRESS", name: $("recipient-name").value.trim(), phone: $("recipient-phone").value.trim(), postcode: $("delivery-postcode").value, address: $("delivery-address").value.trim(), detail: $("delivery-detail").value.trim() } : { type: "BUSINESS_ADDRESS", name: "등록 담당자 · 연결 예정", phone: "등록 연락처 · 연결 예정", postcode: "", address: "사업자등록증 등록 주소 · OS 연결 후 표시", detail: "" }, confirmed: false };
    $("order-review-status").textContent = ""; showStatement(statement);
  });
  function showStatement(order) {
    statement = order; const total = M.totals(order.items), d = order.delivery;
    $("statement-document").className = "statement-document";
    $("statement-document").innerHTML = `<div class="statement-head"><div><p>T-WORLD KOREA</p><h2 id="statement-title">거래명세서</h2><p>확인용 · 단가 미확정 · 시연 문서</p></div><div>${esc(order.createdAt)}<br><span class="mini-tag">${order.confirmed ? "시연 내역" : "주문 미리보기"}</span></div></div><div class="statement-parties"><div><span>공급자</span><strong>주식회사 티월드코리아</strong><p>사업자 정보는 사내 OS 연결 후 표시됩니다.</p></div><div><span>공급받는 자</span><strong>시연용 거래처</strong><p>사업자등록증 기준 정보 · 연결 예정</p></div></div><div class="statement-table-wrap"><table class="statement-table"><thead><tr><th>상품</th><th>색상 / 사이즈</th><th>수량</th><th>단가</th><th>공급가액</th></tr></thead><tbody>${order.items.map(line => `<tr><td>${esc(line.productCode)}<small>${esc(line.productName)}</small></td><td>${esc(line.color)} / ${esc(line.size)}</td><td>${n(line.quantity)}장</td><td>확인 예정</td><td>-</td></tr>`).join("")}</tbody></table></div><div class="statement-summary"><span>총 수량 <strong>${n(total.quantity)}장</strong></span><span>공급가액 · 부가세 · 합계 <strong>단가 확인 후 안내</strong></span></div><div class="statement-delivery"><strong>배송 정보</strong><br>${d.type === "BUSINESS_ADDRESS" ? "사업자등록증 주소 (기본)" : "새 배송지"}<br>${esc([d.postcode, d.address, d.detail].filter(Boolean).join(" "))}<br>수령인: ${esc(d.name)} · 연락처: ${esc(d.phone)}<br>배송 희망일: ${esc(dateText(order.requestedDate))}${order.memo ? `<br>요청사항: ${esc(order.memo)}` : ""}</div><p class="statement-warning">${esc(order.id)}<br>이 문서는 화면 확인용이며 거래 확정, 결제 또는 세금계산서 발행을 의미하지 않습니다. 공급단가·부가세·배송비와 납기는 담당자 확인 후 확정됩니다. 입력 내용은 사내 OS로 전송되지 않습니다.</p>`;
    $("statement-confirm").hidden = order.confirmed; $("statement-edit").hidden = order.confirmed; $("statement-status").textContent = ""; $("statement-dialog").showModal(); $("statement-dialog").scrollTop = 0;
  }
  $("statement-edit").addEventListener("click", () => { $("statement-dialog").close(); $("order-review").focus(); });
  $("statement-print").addEventListener("click", () => window.print());
  $("statement-confirm").addEventListener("click", () => {
    if (!entered || !statement || statement.confirmed) return;
    statement.confirmed = true; orders.unshift(statement); lines = []; renderLines(); $("order-check-form").reset(); $("order-date").value = ""; $("order-date-label").textContent = "날짜를 선택해주세요"; syncDelivery(); $("statement-dialog").close(); historyView = "orders"; showTab("mypage");
  });
  function empty(container, title, detail, action) { container.replaceChildren(); const box = element("div", "", "empty-state"); box.append(element("span", "―"), element("p", title), element("small", detail)); if (action) { const b = element("button", "첫 주문 작성하기 →", "text-button"); b.type = "button"; b.addEventListener("click", () => showTab("order")); box.append(b); } container.append(box); }
  function renderHistory() {
    $("metric-orders").replaceChildren(document.createTextNode(String(orders.length)), element("small", "건")); $("metric-pending").replaceChildren(document.createTextNode(String(orders.length)), element("small", "건"));
    document.querySelectorAll("[data-history]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.history === historyView)));
    if (historyView === "shipments") { empty($("history-list"), "아직 발송 내역이 없습니다.", "OS 연결 후 택배사, 운송장과 배송 상태가 이곳에 표시됩니다."); return; }
    if (!orders.length) { empty($("history-list"), "아직 주문 내역이 없습니다.", "주문 확인 후 시연 내역에 추가해보세요.", true); return; }
    $("history-list").replaceChildren(...orders.map(order => {
      const row = element("article", "", "history-row"), top = element("div", "", "history-top"), actions = element("div", "", "history-actions"), total = M.totals(order.items);
      top.append(element("span", order.createdAt), element("span", "시연 · 확인 대기", "status-pill")); row.append(top, element("h4", order.items[0].productCode + (order.items.length > 1 ? ` 외 ${order.items.length - 1}개 조합` : "")), element("p", `${order.id}\n총 ${n(total.quantity)}장 · 배송 희망일 ${dateText(order.requestedDate)}`));
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
  function cancelStock() { stockSequence++; stockController?.abort(); stockController = null; clearTimeout(stockTimer); }
  function stockActive() { return stockSession && stockSession.expiresAt > Date.now(); }
  function paintStock(quantities = new Map()) { document.querySelectorAll("[data-stock-size]").forEach(span => { const value = quantities.get(span.dataset.stockSize), known = Number.isSafeInteger(value) && value >= 0; span.textContent = `현재 재고 ${known ? n(value) + "장" : "-"}`; span.dataset.stock = value === 0 ? "empty" : "unknown"; }); }
  async function loadStock() {
    cancelStock(); paintStock(); const p = currentProduct(), c = currentColor();
    if (!entered || !p || !c || $("panel-order").hidden || document.hidden) return;
    if (!stockActive()) { $("stock-status").textContent = "재고 확인을 누르고 기존 재고 키워드로 인증해주세요. 확인 전에는 -로 표시됩니다."; return; }
    const seq = stockSequence, controller = new AbortController(); stockController = controller; const timer = setTimeout(() => controller.abort(), 10000); $("stock-status").textContent = `${c.nameKr} 재고 조회 중…`;
    try {
      const response = await fetch(`${inventoryOrigin}/stock?product=${encodeURIComponent(p.code)}`, { headers: { Authorization: `Bearer ${stockSession.token}` }, cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer", signal: controller.signal });
      if (seq !== stockSequence) return;
      if ([401, 403].includes(response.status)) { stockSession = null; $("stock-status").textContent = "재고 인증이 만료되었습니다. 재고 확인을 다시 눌러주세요."; return; }
      if (!response.ok) throw Error(); const payload = await response.json(); if (seq !== stockSequence) return;
      paintStock(window.TworldInventory.quantitiesFor(payload, p, c.code));
      $("stock-status").textContent = payload.availability === "inquiry" ? `${c.nameKr} · 문의 상품의 재고는 모두 -로 표시됩니다.` : payload.availability === "unavailable" ? "현재 재고를 확인할 수 없습니다. 수량은 -로 표시됩니다." : `${c.nameKr} · ${new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })} 조회 · 실제 주문 가능 수량은 담당자가 확인합니다.`;
    } catch { if (seq === stockSequence) $("stock-status").textContent = "현재 재고를 확인할 수 없습니다. 재고 확인을 눌러 다시 시도해주세요."; }
    finally { clearTimeout(timer); if (seq === stockSequence) { stockController = null; if (stockActive()) stockTimer = setTimeout(loadStock, 30000); } }
  }
  $("stock-refresh").addEventListener("click", () => { if (stockActive()) loadStock(); else { $("stock-keyword").value = ""; $("stock-auth-status").textContent = ""; $("stock-dialog").showModal(); } });
  $("stock-auth-form").addEventListener("submit", async event => {
    event.preventDefault(); const button = $("stock-auth-form").querySelector('[type="submit"]'); button.disabled = true; const keyword = $("stock-keyword").value; $("stock-keyword").value = "";
    try { const response = await fetch(inventoryOrigin + "/stock/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keyword }), credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer", signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw Error(response.status === 401 ? "재고 키워드를 확인해주세요." : "재고 인증이 지연되고 있습니다. 잠시 후 다시 시도해주세요.");
      const value = await response.json(); if (typeof value.token !== "string" || !Number.isFinite(value.expiresAt) || value.expiresAt <= Date.now()) throw Error("재고 인증 응답을 확인할 수 없습니다.");
      if (!entered || !$("stock-dialog").open) return; stockSession = { token: value.token, expiresAt: value.expiresAt }; $("stock-dialog").close(); loadStock();
    } catch(error) { $("stock-auth-status").textContent = error.message === "재고 키워드를 확인해주세요." ? error.message : "재고를 확인할 수 없습니다. 잠시 후 다시 시도해주세요."; }
    finally { button.disabled = false; }
  });
  $("stock-dialog").addEventListener("close", () => $("stock-keyword").value = "");
  try { const saved = JSON.parse(sessionStorage.getItem(stockKey) || "null"); if (typeof saved?.token === "string" && saved.expiresAt > Date.now() && saved.expiresAt < Date.now() + 3605000) stockSession = saved; } catch { /* Existing stock sign-in is optional; no partner data is persisted. */ }
  document.addEventListener("visibilitychange", () => document.hidden ? cancelStock() : loadStock()); window.addEventListener("pagehide", leavePartner);
  const navToggle = document.querySelector("[data-nav-toggle]"), header = document.querySelector("[data-header]");
  navToggle.addEventListener("click", () => { const open = navToggle.getAttribute("aria-expanded") !== "true"; navToggle.setAttribute("aria-expanded", String(open)); navToggle.classList.toggle("is-active", open); header.classList.toggle("is-open", open); document.querySelector("[data-nav]").classList.toggle("is-open", open); document.body.classList.toggle("is-nav-open", open); });
  window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 20), { passive: true });
  renderProduct(); renderLines(); renderHistory(); renderInquiries(); syncDelivery();
})();
