(function () {
  "use strict";
  const API = "https://tworld-inventory-api.halestork64.chatgpt.site";
  const KEY = "tworld-order-draft-v1";
  const $ = id => document.getElementById(id);
  const products = window.products || [];
  let verified = false, busy = false, demo = false, draft = { items: [], requestedDate: "", delivery: "EXISTING_ADDRESS", requestId: crypto.randomUUID(), pending: false };
  try { const saved = JSON.parse(sessionStorage.getItem(KEY) || "null"); if (saved && Array.isArray(saved.items) && typeof saved.requestId === "string") draft = saved; } catch {}
  const productByCode = code => products.find(p => p.code === code);
  draft.items = draft.items.filter(i => { const p = productByCode(i.productCode); return p && p.colors.some(c => c.code === i.colorCode) && p.sizes.some(s => s.size === i.size) && Number.isInteger(i.quantity) && i.quantity > 0 && i.quantity <= 9999; });
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(draft)); } catch {} }
  const text = (tag, value, className) => { const node = document.createElement(tag); node.textContent = value; if (className) node.className = className; return node; };
  function change() { draft.requestId = crypto.randomUUID(); save(); }
  async function request(path, body) {
    const response = await fetch(API + (body.code === "9876" ? "/demo" : "") + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store", credentials: "omit", signal: AbortSignal.timeout(20000) });
    const value = await response.json();
    if (!response.ok) { const error = new Error(value.error || "요청을 처리하지 못했습니다."); error.status = response.status; throw error; }
    return value;
  }
  function lock() {
    $("order-product").disabled = busy || draft.pending;
    $("order-color").disabled = busy || draft.pending;
    $("order-add").disabled = busy || draft.pending;
    $("order-date").disabled = busy || draft.pending;
    $("order-delivery").disabled = busy || draft.pending;
    $("order-agree").disabled = busy;
    $("order-submit").disabled = busy || !draft.items.length;
    $("order-submit").textContent = busy ? "접수 확인 중…" : draft.pending ? "같은 주문 접수 결과 확인 · 재시도" : demo ? "시연 주문 보내기" : "주문 요청 보내기";
    document.querySelectorAll("#order-items input, #order-items button, #order-sizes input").forEach(n => { n.disabled = busy || draft.pending; });
  }
  function renderDraft() {
    $("order-items").replaceChildren();
    for (const [index, item] of draft.items.entries()) {
      const p = productByCode(item.productCode), color = p.colors.find(c => c.code === item.colorCode);
      const row = text("article", "", "order-line");
      const info = document.createElement("div"); info.append(text("strong", p.code), text("p", p.name), text("small", `${color.nameKr} · ${item.size}`));
      const qty = document.createElement("input"); Object.assign(qty, { type: "number", min: "1", max: "9999", step: "1", value: String(item.quantity) }); qty.setAttribute("aria-label", `${p.code} ${color.nameKr} ${item.size} 요청 수량`);
      qty.addEventListener("change", () => { const n = Number(qty.value); if (!Number.isInteger(n) || n < 1 || n > 9999) { qty.value = String(item.quantity); return; } draft.items[index].quantity = n; change(); renderDraft(); });
      const remove = text("button", "삭제", "order-remove"); remove.type = "button"; remove.setAttribute("aria-label", `${p.code} ${color.nameKr} ${item.size} 삭제`); remove.addEventListener("click", () => { draft.items.splice(index, 1); change(); renderDraft(); });
      const controls = document.createElement("div"); controls.append(qty, text("span", "장"), remove); row.append(info, controls); $("order-items").append(row);
    }
    $("order-empty").hidden = draft.items.length > 0;
    $("order-item-count").textContent = `${draft.items.length}개 조합`;
    $("order-total").textContent = `${draft.items.reduce((sum, i) => sum + i.quantity, 0).toLocaleString()}장`;
    lock();
  }
  function renderProduct() {
    const p = products.find(p => p.code === $("order-product").value); if (!p) return;
    $("order-product-name").textContent = `${p.code} · ${p.name}`;
    $("order-image").src = p.thumbnail; $("order-image").alt = p.name;
    $("order-product-link").href = `product-detail.html?id=${encodeURIComponent(p.id)}`;
    $("order-color").replaceChildren();
    for (const c of p.colors) { const option = text("option", c.nameKr); option.value = c.code; $("order-color").append(option); }
    $("order-sizes").replaceChildren();
    for (const s of p.sizes) { const label = document.createElement("label"), input = document.createElement("input"); Object.assign(input, { type: "number", min: "0", max: "9999", step: "1", value: "0", inputMode: "numeric" }); input.dataset.size = s.size; input.setAttribute("aria-label", `${s.size} 수량`); label.append(text("span", s.size), input); $("order-sizes").append(label); }
    lock();
  }
  for (const p of products) { const option = text("option", `${p.code} · ${p.name}`); option.value = p.code; $("order-product").append(option); }
  const selected = new URL(location.href).searchParams.get("product");
  const initial = products.find(p => p.id === selected || p.code === selected); if (initial) $("order-product").value = initial.code;
  $("order-product").addEventListener("change", renderProduct);
  $("order-color").addEventListener("change", () => { document.querySelectorAll("#order-sizes input").forEach(input => input.value = "0"); });
  $("order-date").min = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date());
  $("order-date").value = draft.requestedDate || ""; $("order-delivery").value = draft.delivery;
  $("order-date").addEventListener("change", () => { draft.requestedDate = $("order-date").value; change(); });
  $("order-delivery").addEventListener("change", () => { draft.delivery = $("order-delivery").value; change(); });
  $("order-code-form").addEventListener("submit", async event => {
    event.preventDefault(); if (busy) return; busy = true; lock(); $("order-access-status").textContent = "코드를 확인하고 있습니다…";
    try { const result = await request("/orders/verify", { code: $("order-code").value.trim() }); verified = true; demo = result.demo === true; $("order-demo-notice").hidden = !demo; $("order-editor").hidden = false; $("order-access-status").textContent = demo ? "시연 코드가 확인되었습니다. 테스트 주문서를 작성할 수 있습니다." : "주문코드가 확인되었습니다."; $("order-editor").scrollIntoView({ behavior: "smooth", block: "start" }); }
    catch (error) { verified = false; $("order-editor").hidden = true; $("order-access-status").textContent = error.message || "연결을 확인한 뒤 다시 시도해주세요."; }
    finally { busy = false; lock(); }
  });
  $("order-code").addEventListener("input", () => { verified = false; $("order-editor").hidden = true; $("order-access-status").textContent = ""; });
  $("order-add").addEventListener("click", () => {
    if (draft.pending || busy) return;
    const inputs = [...document.querySelectorAll("#order-sizes input")];
    if (inputs.some(n => !Number.isInteger(Number(n.value)) || Number(n.value) < 0 || Number(n.value) > 9999)) { $("order-item-status").textContent = "수량은 0~9,999 사이의 정수로 입력해주세요."; return; }
    const added = inputs.filter(n => Number(n.value) > 0); if (!added.length) { $("order-item-status").textContent = "한 개 이상의 사이즈에 수량을 입력해주세요."; return; }
    const next = draft.items.map(i => ({ ...i }));
    for (const input of added) { const item = { productCode: $("order-product").value, colorCode: $("order-color").value, size: input.dataset.size, quantity: Number(input.value) }; const old = next.find(i => i.productCode === item.productCode && i.colorCode === item.colorCode && i.size === item.size); if (old) old.quantity += item.quantity; else next.push(item); }
    if (next.length > 100 || next.some(i => i.quantity > 9999)) { $("order-item-status").textContent = "주문은 100개 조합까지, 조합별 수량은 9,999장까지 담을 수 있습니다."; return; }
    draft.items = next; change(); renderDraft(); inputs.forEach(n => n.value = "0"); $("order-item-status").textContent = `${added.length}개 조합을 주문서에 담았습니다.`;
  });
  $("order-submit-form").addEventListener("submit", async event => {
    event.preventDefault(); if (!verified || busy || !draft.items.length || !$("order-agree").checked) return;
    busy = true; draft.pending = true; save(); lock(); $("order-submit-status").textContent = "주문을 접수하고 있습니다. 잠시 기다려주세요.";
    try {
      const result = await request("/orders", { code: $("order-code").value.trim(), requestId: draft.requestId, items: draft.items, requestedDate: draft.requestedDate || null, delivery: draft.delivery, noticeVersion: "2026-10-20" });
      $("order-success").querySelector("h2").textContent = result.demo ? "시연 주문이 접수되었습니다." : "주문 요청이 접수되었습니다.";
      $("order-success").querySelector("h2 + p").textContent = result.demo ? "Mac Studio의 시연 접수함에서 확인할 수 있습니다. 실제 주문·배송은 진행되지 않습니다." : "담당자가 내용을 확인한 뒤 기존 연락처로 안내드립니다.";
      $("order-receipt").textContent = result.receiptId; $("order-received-at").textContent = new Date(result.submittedAt).toLocaleString("ko-KR");
      $("order-editor").hidden = true; $("order-access").hidden = true; $("order-success").hidden = false; $("order-code").value = ""; verified = false;
      draft = { items: [], requestedDate: "", delivery: "EXISTING_ADDRESS", requestId: crypto.randomUUID(), pending: false }; save();
      $("order-success").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      if ([400, 401, 403, 409, 410, 413, 415, 429].includes(error.status)) { draft.pending = false; if ([409, 410].includes(error.status)) draft.requestId = crypto.randomUUID(); save(); }
      $("order-submit-status").textContent = (error.message || "연결이 끊겼습니다.") + (draft.pending ? " 같은 주문으로 다시 확인해주세요. 중복 접수되지 않습니다." : "");
    } finally { busy = false; lock(); }
  });
  $("order-new").addEventListener("click", () => { $("order-success").hidden = true; $("order-access").hidden = false; $("order-access-status").textContent = ""; $("order-date").value = ""; $("order-delivery").value = "EXISTING_ADDRESS"; $("order-agree").checked = false; $("order-submit-status").textContent = ""; renderDraft(); $("order-code").focus(); });
  if (draft.pending) $("order-submit-status").textContent = "이전에 제출한 주문의 접수 결과를 확인해야 합니다. 주문코드를 입력하고 같은 주문으로 재시도해주세요.";
  renderProduct(); renderDraft();
})();
