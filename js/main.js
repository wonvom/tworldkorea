(function () {
  const productData = window.products || [];
  const page = document.body.dataset.page;
  const catalogSummary = window.catalogSummary || {};
  const assetVersion = "20260611-seo-title";
  const sampleListKey = "tworld-sample-list-v1";
  const sampleContactKey = "tworld-sample-contact-v1";
  const kakaoTalkUrl = "https://open.kakao.com/o/spcUfEvi";

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const categoryLabels = {
    "Short Sleeve": { kr: "반팔", en: "Short Sleeve" },
    "Sleeveless": { kr: "민소매", en: "Sleeveless" },
    "Long Sleeve": { kr: "긴팔", en: "Long Sleeve" },
    "Polo Shirt": { kr: "카라티", en: "Polo Shirt" },
    "Sweatshirt": { kr: "맨투맨", en: "Sweatshirt" },
    "Hoodie": { kr: "후드", en: "Hoodie" },
    "Pants": { kr: "바지", en: "Pants" }
  };

  function categoryLabel(category) {
    return categoryLabels[category] || { kr: category, en: category };
  }

  const customOrderProductCodes = new Set(["A23014", "3505", "3508"]);

  function isCustomOrderProduct(product) {
    return product.category === "Pants" || customOrderProductCodes.has(product.code);
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function assetUrl(src) {
    if (!src || /^(https?:|data:|blob:)/.test(src)) return src || "";
    return `${src}${src.includes("?") ? "&" : "?"}v=${assetVersion}`;
  }

  function readSampleList() {
    try {
      const parsed = JSON.parse(localStorage.getItem(sampleListKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function readSampleContact() {
    try {
      const parsed = JSON.parse(localStorage.getItem(sampleContactKey) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function writeSampleContact(contact) {
    localStorage.setItem(sampleContactKey, JSON.stringify(contact));
  }

  function collectSampleContact() {
    const root = qs("[data-sample-contact]");
    if (!root) return readSampleContact();
    const contact = {
      company: String(qs('[name="sample-company"]', root)?.value || "").trim(),
      name: String(qs('[name="sample-name"]', root)?.value || "").trim(),
      phone: String(qs('[name="sample-phone"]', root)?.value || "").trim(),
      email: String(qs('[name="sample-email"]', root)?.value || "").trim()
    };
    writeSampleContact(contact);
    return contact;
  }

  function fillSampleContact() {
    const root = qs("[data-sample-contact]");
    if (!root) return;
    const contact = readSampleContact();
    const values = {
      "sample-company": contact.company || "",
      "sample-name": contact.name || "",
      "sample-phone": contact.phone || "",
      "sample-email": contact.email || ""
    };
    Object.entries(values).forEach(([name, value]) => {
      const input = qs(`[name="${name}"]`, root);
      if (input && input.value !== value) input.value = value;
    });
  }

  function writeSampleList(list) {
    localStorage.setItem(sampleListKey, JSON.stringify(list));
    updateSampleListButton();
    renderSampleListPanel();
  }

  function updateSampleListButton() {
    const count = readSampleList().length;
    qsa("[data-sample-count]").forEach((target) => {
      target.textContent = String(count);
    });
    qsa("[data-sample-count-label]").forEach((target) => {
      target.textContent = count ? `담은 샘플 ${count}개` : "담은 샘플 없음";
    });
  }

  function buildSampleMessage() {
    const list = readSampleList();
    const contact = collectSampleContact();
    const lines = [
      "T-WORLD KOREA 샘플 신청",
      "",
      `회사명: ${contact.company || "-"}`,
      `성함: ${contact.name || "-"}`,
      `연락처: ${contact.phone || "-"}`,
      `이메일: ${contact.email || "-"}`,
      "",
      "샘플 신청할 제품:"
    ];

    if (list.length === 0) {
      lines.push("- 선택한 제품이 없습니다.");
    } else {
      list.forEach((item, index) => {
        lines.push(
          "",
          `${index + 1}. ${item.code} ${item.name}`,
          `분류: ${item.category || "-"}`,
          `색상: ${item.color || (item.colors && item.colors.length ? item.colors.join(", ") : "-")}`,
          `사이즈: ${item.size || (item.sizes && item.sizes.length ? item.sizes.join(", ") : "-")}`,
          `메모: ${item.memo || "-"}`
        );
      });
    }

    lines.push("", "문의 내용:");
    return lines.join("\n");
  }

  function addSampleItem(product, selections) {
    const list = readSampleList();
    const label = categoryLabel(product.category);
    const nextColor = selections.color || "색상 상담 필요";
    const nextSize = selections.size || "사이즈 상담 필요";
    const existing = list.find((item) => (
      item.code === product.code &&
      (item.color || (item.colors || [])[0]) === nextColor &&
      (item.size || (item.sizes || [])[0]) === nextSize
    ));

    if (existing) {
      existing.color = nextColor;
      existing.size = nextSize;
      existing.image = selections.image || existing.image || "";
      delete existing.colors;
      delete existing.sizes;
      existing.memo = selections.memo || existing.memo || "";
      existing.updatedAt = Date.now();
    } else {
      list.push({
        code: product.code,
        name: product.name,
        category: `${label.kr} ${label.en}`,
        color: nextColor,
        size: nextSize,
        image: selections.image || "",
        memo: selections.memo,
        updatedAt: Date.now()
      });
    }

    writeSampleList(list);
  }

  function sampleItemImage(item) {
    if (item.image) return item.image;
    const product = productData.find((entry) => entry.code === item.code || entry.id === item.code);
    const color = product?.colors?.find((entry) => entry.nameKr === item.color);
    return color?.image || product?.thumbnail || "";
  }

  function renderSampleListPanel() {
    const listRoot = qs("[data-sample-list]");
    const empty = qs("[data-sample-empty]");
    if (!listRoot || !empty) return;
    const list = readSampleList();

    empty.hidden = list.length > 0;
    listRoot.innerHTML = list.map((item, index) => `
      <article class="sample-list-item">
        <div class="sample-list-card">
          <div>
            <p class="product-code">${escapeHtml(item.code)}</p>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.category)}</p>
          </div>
          ${sampleItemImage(item) ? `
            <div class="sample-list-image image-frame" data-label="${escapeHtml(item.color || "선택 색상")}">
              <img src="${assetUrl(sampleItemImage(item))}" alt="${escapeHtml(item.name)} ${escapeHtml(item.color || "")} 색상 이미지" loading="lazy">
            </div>
          ` : ""}
        </div>
        <dl>
          <div><dt>색상</dt><dd>${escapeHtml(item.color || (item.colors || []).join(", ") || "-")}</dd></div>
          <div><dt>사이즈</dt><dd>${escapeHtml(item.size || (item.sizes || []).join(", ") || "-")}</dd></div>
          <div><dt>메모</dt><dd>${escapeHtml(item.memo || "-")}</dd></div>
        </dl>
        <button type="button" class="text-button" data-remove-sample="${index}">삭제</button>
      </article>
    `).join("");
    updateSampleListButton();
    initImageFallbacks(listRoot);
  }

  function openSamplePanel() {
    const panel = qs("[data-sample-panel]");
    if (!panel) return;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-sample-panel-open");
    renderSampleListPanel();
  }

  function closeSamplePanel() {
    const panel = qs("[data-sample-panel]");
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-sample-panel-open");
  }

  function initSampleListUi() {
    if (qs("[data-sample-panel]")) return;

    document.body.insertAdjacentHTML("beforeend", `
      <button class="sample-floating-button" type="button" data-open-sample-list aria-label="샘플 장바구니 열기">
        <span>장바구니</span>
        <strong data-sample-count>0</strong>
      </button>
      <aside class="sample-panel" data-sample-panel aria-hidden="true" aria-labelledby="sample-panel-title">
        <div class="sample-panel-backdrop" data-close-sample-list></div>
        <div class="sample-panel-body" role="dialog" aria-modal="true">
          <div class="sample-panel-header">
            <div>
              <p class="eyebrow">샘플 장바구니</p>
              <h2 id="sample-panel-title">샘플 신청할 제품</h2>
              <p data-sample-count-label>담은 샘플 없음</p>
            </div>
            <button class="sample-panel-close" type="button" data-close-sample-list aria-label="샘플 장바구니 닫기">닫기</button>
          </div>
          <p class="sample-panel-help">샘플 신청할 제품과 색상을 담은 뒤 내용을 복사해서 카카오톡으로 보내주세요.</p>
          <p class="sample-color-notice">제품의 실제 색상은 사용하는 모니터 설정, 디스플레이 패널 종류, 기기 밝기에 따라 화면과 다르게 보일 수 있습니다. 가능하시다면 쇼룸에 방문하셔서 직접 확인 후 선택하시는 것을 추천드립니다.</p>
          <div class="sample-contact-fields" data-sample-contact>
            <label>
              <span>회사명</span>
              <input type="text" name="sample-company" placeholder="회사명을 입력하세요">
            </label>
            <label>
              <span>성함</span>
              <input type="text" name="sample-name" placeholder="성함을 입력하세요">
            </label>
            <label>
              <span>연락처</span>
              <input type="tel" name="sample-phone" placeholder="010-1234-5678">
            </label>
            <label>
              <span>이메일</span>
              <input type="email" name="sample-email" placeholder="contact@example.com">
            </label>
          </div>
          <p class="sample-empty" data-sample-empty>아직 샘플 장바구니에 담은 제품이 없습니다.</p>
          <div class="sample-list" data-sample-list></div>
          <p class="template-status" data-sample-status role="status" aria-live="polite"></p>
          <div class="sample-panel-actions">
            <button class="btn btn-dark full" type="button" data-copy-sample-list>내용 복사하기</button>
            <a class="btn btn-light full" href="${kakaoTalkUrl}" target="_blank" rel="noopener" data-kakao-sample>카카오톡 문의하기</a>
            <button class="text-button" type="button" data-clear-sample-list>목록 비우기</button>
          </div>
        </div>
      </aside>
    `);

    document.addEventListener("click", (event) => {
      const openButton = event.target.closest("[data-open-sample-list]");
      const closeButton = event.target.closest("[data-close-sample-list]");
      const removeButton = event.target.closest("[data-remove-sample]");
      const clearButton = event.target.closest("[data-clear-sample-list]");
      const copyButton = event.target.closest("[data-copy-sample-list]");
      const kakaoButton = event.target.closest("[data-kakao-sample]");
      const status = qs("[data-sample-status]");

      if (openButton) openSamplePanel();
      if (closeButton) closeSamplePanel();
      if (removeButton) {
        const index = Number(removeButton.dataset.removeSample);
        const list = readSampleList();
        list.splice(index, 1);
        writeSampleList(list);
      }
      if (clearButton) writeSampleList([]);
      if (copyButton || kakaoButton) {
        if (kakaoButton) event.preventDefault();
        if (kakaoButton) window.open(kakaoTalkUrl, "_blank", "noopener");
        const text = buildSampleMessage();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text)
            .then(() => {
              if (status) status.textContent = "내용이 복사되었습니다. 카카오톡에 붙여넣어 보내주세요.";
            })
            .catch(() => {
              if (status) status.textContent = "복사가 되지 않으면 내용을 직접 선택해서 복사해주세요.";
            });
        } else if (status) {
          status.textContent = "복사가 되지 않으면 내용을 직접 선택해서 복사해주세요.";
        }
      }
    });

    document.addEventListener("input", (event) => {
      if (!event.target.closest("[data-sample-contact]")) return;
      collectSampleContact();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeSamplePanel();
    });

    updateSampleListButton();
    renderSampleListPanel();
    fillSampleContact();
  }

  function initHeader() {
    const header = qs("[data-header]");
    const nav = qs("[data-nav]");
    const toggle = qs("[data-nav-toggle]");
    const current = location.pathname.split("/").pop() || "index.html";

    qsa(".site-nav a").forEach((link) => {
      const href = new URL(link.getAttribute("href"), window.location.href).pathname.split("/").pop();
      if (href === current) link.classList.add("is-active");
    });

    const setScrolled = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        toggle.classList.toggle("is-active", isOpen);
        header.classList.toggle("is-open", isOpen);
        document.body.classList.toggle("is-nav-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }
  }

  function initFade() {
    const targets = qsa(".fade-up");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -8% 0px" });

    targets.forEach((target) => observer.observe(target));
  }

  function initImageFallbacks(root = document) {
    function useFallback(img) {
      const fallbacks = (img.dataset.fallbackSrc || "").split("|").filter(Boolean);
      const next = fallbacks.find((src) => src !== img.getAttribute("src"));
      if (next) {
        img.dataset.fallbackSrc = fallbacks.filter((src) => src !== next).join("|");
        img.src = next;
        return;
      }
      const frame = img.closest(".image-frame");
      const removable = img.closest(".gallery-thumb, .color-image, .placement-card");
      if (removable) {
        removable.hidden = true;
        return;
      }
      if (frame && frame.parentElement && frame.parentElement.classList.contains("color-image-grid")) {
        frame.hidden = true;
        return;
      }
      if (frame) frame.classList.add("is-missing");
    }

    qsa(".image-frame img", root).forEach((img) => {
      if (img.dataset.fallbackBound) return;
      img.dataset.fallbackBound = "true";
      img.addEventListener("error", () => useFallback(img));
      if (img.complete && img.naturalWidth === 0) useFallback(img);
    });
  }

  function productCard(product) {
    const label = categoryLabel(product.category);
    const detailHref = `product-detail.html?id=${encodeURIComponent(product.code)}&v=20260611-seo-title`;
    const customOrderBadge = isCustomOrderProduct(product) ? `<span class="custom-order-badge">주문제작</span>` : "";
    return `
      <a class="product-card image-card" href="${detailHref}">
        <span class="image-frame" data-label="${product.code} Front Image">
          ${customOrderBadge}
          <img src="${assetUrl(product.thumbnail)}" alt="${product.name} 대표 이미지" loading="lazy">
        </span>
        <p class="product-code"><span>MODEL NO.</span>${product.code}</p>
        <h3>${product.name}</h3>
        <div class="product-meta">
          <span>${label.kr} <small>${label.en}</small></span>
          <span>${product.fit}</span>
          <span>${product.fabric}</span>
          <span>${product.weight} ${product.colors.length} Colors</span>
        </div>
        <span class="card-link">View Detail</span>
      </a>
    `;
  }

  function renderFeaturedProducts() {
    const mount = qs("[data-featured-products]");
    if (!mount || productData.length === 0) return;
    const featuredIds = ["01oa1", "t210", "03xa5", "o3000", "7001", "23012"];
    const featured = featuredIds.map((id) => productData.find((product) => product.id === id)).filter(Boolean);
    mount.innerHTML = featured.map(productCard).join("");
    initImageFallbacks(mount);
  }

  function renderProductsPage() {
    const grid = qs("[data-products-grid]");
    if (!grid) return;

    const count = qs("[data-product-count]");
    let categoryFilter = new URLSearchParams(location.search).get("category") || "All";
    let typeFilter = "All";

    const categoryButtons = qsa("[data-category-filters] .filter-btn");
    const typeButtons = qsa("[data-type-filters] .filter-btn");

    function syncButtons(buttons, value) {
      buttons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.filter === value);
      });
    }

    function matchesType(product) {
      if (typeFilter === "All") return true;
      if (typeFilter === "Heavy Weight") return product.tags.includes("Heavy Weight");
      return product.fit === typeFilter;
    }

    function render() {
      const filtered = productData.filter((product) => {
        const categoryMatch = categoryFilter === "All" || product.category === categoryFilter;
        return categoryMatch && matchesType(product);
      });

      grid.innerHTML = filtered.map(productCard).join("");
      count.textContent = `${filtered.length} Products`;
      syncButtons(categoryButtons, categoryFilter);
      syncButtons(typeButtons, typeFilter);
      initImageFallbacks(grid);
    }

    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        categoryFilter = button.dataset.filter;
        render();
      });
    });

    typeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        typeFilter = button.dataset.filter;
        render();
      });
    });

    render();
  }

  function colorSwatches(product) {
    return product.colors.map((color) => `<span class="swatch" title="${color.nameKr} ${color.nameCn} ${color.nameEn}" style="background:${color.hex}"></span>`).join("");
  }

  function sizeTable(product) {
    const fields = product.sizeFields || [
      { key: "size", label: "사이즈", labelCn: "尺码", labelEn: "Size" },
      { key: "shoulder", label: "어깨", labelCn: "肩宽", labelEn: "Shoulder" },
      { key: "chest", label: "가슴", labelCn: "胸围", labelEn: "Chest" },
      { key: "sleeve", label: "소매", labelCn: "袖长", labelEn: "Sleeve" },
      { key: "length", label: "총장", labelCn: "衣长", labelEn: "Length" }
    ];

    return `
      <div class="size-table-wrap">
        <table class="size-table">
          <thead>
            <tr>
              ${fields.map((field) => `<th><span>${field.label}</span><small>${field.labelCn} ${field.labelEn}</small></th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${product.sizes.map((size) => `
              <tr>
                ${fields.map((field) => `<td>${size[field.key] || "-"}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function placementCard(label, image, alt) {
    return `
      <article class="placement-card">
        <div class="image-frame wide" data-label="${label}">
          <img src="${assetUrl(image)}" alt="${alt}">
        </div>
        <p>${label}</p>
      </article>
    `;
  }

  function normalizeProductId(value) {
    const aliases = {
      "010a1": "01oa1"
    };
    const normalized = String(value || "").trim().toLowerCase();
    return aliases[normalized] || normalized;
  }

  function renderProductDetail() {
    const mount = qs("[data-product-detail]");
    if (!mount) return;

    const id = normalizeProductId(new URLSearchParams(location.search).get("id") || mount.dataset.productId);
    const product = productData.find((item) => (
      normalizeProductId(item.id) === id || normalizeProductId(item.code) === id
    ));

    mount.classList.add("is-visible");

    if (!product) {
      mount.innerHTML = `<div class="page-hero"><h1>PRODUCT NOT FOUND</h1><p>제품 데이터를 찾을 수 없습니다.</p><a class="btn btn-dark" href="products.html?v=20260611-seo-title">제품 목록으로 돌아가기</a></div>`;
      return;
    }
    document.title = `${product.name} | 티월드코리아`;
    const related = productData.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
    const slots = product.imageSlots || {};
    const modelImages = slots.model || [];
    const detailImages = slots.detail || [];
    const customOrderBadge = isCustomOrderProduct(product) ? `<span class="custom-order-badge">주문제작</span>` : "";
    const slotImages = [
      { label: "Front Image", image: slots.front, alt: `${product.name} 앞면 이미지` },
      { label: "Back Image", image: slots.back, alt: `${product.name} 뒷면 이미지` },
      ...modelImages.map((image, index) => ({ label: `Model Fit ${index + 1}`, image, alt: `${product.name} 모델 착용 이미지 ${index + 1}` })),
      ...detailImages.map((image, index) => ({ label: `Detail Close Up ${index + 1}`, image, alt: `${product.name} 확대 디테일 이미지 ${index + 1}` }))
    ].filter((slot) => slot.image);

    mount.innerHTML = `
      <div class="detail-grid">
        <div class="detail-gallery">
          <div class="detail-main-image image-frame" data-label="${product.code} Front Image">
            ${customOrderBadge}
            <img src="${assetUrl(product.images[0] || product.thumbnail)}" alt="${product.name} 대표 이미지" data-main-product-image>
          </div>
          <div class="gallery-thumbs">
            ${slotImages.map((slot) => `
              <button class="gallery-thumb image-frame" type="button" data-image="${assetUrl(slot.image)}" data-label="${slot.label}">
                <img src="${assetUrl(slot.image)}" alt="${slot.alt}" loading="lazy">
              </button>
            `).join("")}
          </div>
        </div>
        <aside class="detail-summary">
          <p class="product-detail-code"><span>MODEL NO.</span>${product.code}</p>
          <h1>${product.name}</h1>
          <p class="product-subtitle">${product.nameCn}<br>${product.nameEn}</p>
          <p>${product.description}</p>
          <dl class="summary-list">
            <div><dt>Category</dt><dd>${categoryLabel(product.category).kr} ${categoryLabel(product.category).en}</dd></div>
            <div><dt>Fit</dt><dd>${product.fit}</dd></div>
            <div><dt>Fabric</dt><dd>${product.fabric}</dd></div>
            <div><dt>Weight</dt><dd>${product.weight}</dd></div>
            <div><dt>PDF Page</dt><dd>${product.pdfPage} Page</dd></div>
            <div><dt>Size</dt><dd>${product.sizes.map((size) => size.size).join(", ")}</dd></div>
          </dl>
          <p class="filter-label">COLOR</p>
          <div class="swatch-row">${colorSwatches(product)}</div>
          <div class="sample-selector" data-sample-selector>
            <p class="filter-label">샘플 신청 선택</p>
            <p>색상과 사이즈를 하나씩 선택해서 담아주세요. 담은 뒤에는 선택값이 초기화됩니다.</p>
            <p class="sample-color-notice">제품의 실제 색상은 사용하는 모니터 설정, 디스플레이 패널 종류, 기기 밝기에 따라 화면과 다르게 보일 수 있습니다. 가능하시다면 쇼룸에 방문하셔서 직접 확인 후 선택하시는 것을 추천드립니다.</p>
            <div class="sample-choice-block">
              <h3>색상 선택</h3>
              <div class="sample-choice-grid">
                ${product.colors.map((color) => `
                  <label class="sample-choice">
                    <input type="radio" name="sample-color" value="${escapeHtml(color.nameKr)}" data-color-image="${escapeHtml(color.image || product.thumbnail)}">
                    <span class="swatch small" style="background:${color.hex}"></span>
                    <span>${escapeHtml(color.nameKr)}</span>
                  </label>
                `).join("")}
              </div>
            </div>
            <div class="sample-choice-block">
              <h3>사이즈 선택</h3>
              <div class="sample-size-grid">
                ${product.sizes.map((size) => `
                  <label class="sample-size">
                    <input type="radio" name="sample-size" value="${escapeHtml(size.size)}">
                    <span>${escapeHtml(size.size)}</span>
                  </label>
                `).join("")}
              </div>
            </div>
            <label class="sample-memo">
              <span>메모</span>
              <textarea name="sample-memo" rows="3" placeholder="예: 블랙은 L 사이즈 샘플 먼저 확인하고 싶습니다."></textarea>
            </label>
            <p class="template-status" data-sample-add-status role="status" aria-live="polite"></p>
            <div class="sample-actions">
              <button class="btn btn-dark full" type="button" data-add-sample>샘플 장바구니에 담기</button>
              <button class="btn btn-light full" type="button" data-open-sample-list>장바구니 보기</button>
            </div>
          </div>
        </aside>
      </div>

      <section class="detail-section">
        <p class="eyebrow">PRODUCT DESCRIPTION</p>
        <h2>DETAIL NOTES</h2>
        <p class="detail-copy">${product.description}</p>
        <div class="detail-info-grid">
          ${product.details.map((detail) => `<article><h3>${detail.title}</h3><p>${detail.text}</p></article>`).join("")}
        </div>
      </section>

      <section class="detail-section">
        <p class="eyebrow">IMAGE PLACEMENT</p>
        <h2>PRODUCT ASSETS</h2>
        <p class="detail-copy">${slots.guide || "제품 이미지는 앞면, 뒷면, 모델 착용컷, 확대 디테일컷으로 분리해서 넣어주세요."}</p>
        <div class="placement-grid">
          ${slotImages.map((slot) => placementCard(slot.label, slot.image, slot.alt)).join("")}
        </div>
      </section>

      <section class="detail-section">
        <p class="eyebrow">SIZE GUIDE</p>
        <h2>MEASUREMENT</h2>
        ${sizeTable(product)}
      </section>

      <section class="detail-section" id="color-names">
        <p class="eyebrow">COLOR VARIATIONS</p>
        <h2>COLOR NAMES</h2>
        <div class="color-name-table-wrap">
          <table class="color-name-table">
            <thead>
              <tr>
                <th>Chip</th>
                <th>Color Code</th>
                <th>한국어</th>
                <th>中文</th>
                <th>English</th>
                <th>일본어</th>
                <th>HEX</th>
              </tr>
            </thead>
            <tbody>
              ${product.colors.map((color) => `
                <tr>
                  <td><span class="color-table-chip" style="background:${color.hex}" title="${color.nameKr} ${color.nameCn} ${color.nameEn} ${color.nameJa || ""}"></span></td>
                  <td>${color.code || ""}</td>
                  <td>${color.nameKr}</td>
                  <td>${color.nameCn}</td>
                  <td>${color.nameEn}</td>
                  <td>${color.nameJa || ""}</td>
                  <td>${color.hex}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <h2 class="subsection-title">COLOR IMAGES</h2>
        <div class="color-image-grid">
          ${product.colors.filter((color) => color.image).map((color) => `
            <article class="color-image">
              <div class="image-frame" data-label="${color.nameKr} ${color.nameEn}">
                <img src="${assetUrl(color.image)}" alt="${product.name} ${color.nameKr} 컬러 이미지" loading="lazy" data-fallback-src="${(color.fallbackImages || []).map(assetUrl).join("|")}">
              </div>
              <h3>${color.nameKr}</h3>
              <p>${color.nameCn}<br>${color.nameEn}</p>
            </article>
          `).join("")}
        </div>
      </section>

      ${detailImages.length ? `
        <section class="detail-section">
          <p class="eyebrow">DETAIL CLOSE UP</p>
          <h2>DETAIL IMAGES</h2>
          <div class="color-image-grid">
            ${detailImages.map((image, index) => `
              <div class="image-frame wide" data-label="Detail ${index + 1}">
                <img src="${assetUrl(image)}" alt="${product.name} 원단 봉제 디테일 ${index + 1}" loading="lazy">
              </div>
            `).join("")}
          </div>
        </section>
      ` : ""}

      <section class="detail-section">
        <p class="eyebrow">RELATED PRODUCTS</p>
        <h2>SAME CATEGORY</h2>
        <div class="related-grid">${related.map(productCard).join("")}</div>
      </section>
    `;

    qsa(".gallery-thumb", mount).forEach((button) => {
      button.addEventListener("click", () => {
        const main = qs("[data-main-product-image]", mount);
        main.src = button.dataset.image;
      });
    });

    const addButton = qs("[data-add-sample]", mount);
    if (addButton) {
      addButton.addEventListener("click", () => {
        const selector = qs("[data-sample-selector]", mount);
        const colorInput = qs('input[name="sample-color"]:checked', selector);
        const sizeInput = qs('input[name="sample-size"]:checked', selector);
        const memoInput = qs('[name="sample-memo"]', selector);
        const memo = String(memoInput?.value || "").trim();
        const status = qs("[data-sample-add-status]", selector);

        if (!colorInput || !sizeInput) {
          if (status) status.textContent = "색상과 사이즈를 하나씩 선택해주세요.";
          return;
        }

        addSampleItem(product, { color: colorInput.value, size: sizeInput.value, image: colorInput.dataset.colorImage, memo });
        const addedText = `${colorInput.value} ${sizeInput.value}`;
        qsa('input[name="sample-color"], input[name="sample-size"]', selector).forEach((input) => {
          input.checked = false;
        });
        if (memoInput) memoInput.value = "";
        if (status) status.textContent = `${addedText} 조합을 샘플 장바구니에 담았습니다.`;
      });
    }

    initImageFallbacks(mount);
  }

  function initLookbookModal() {
    const modal = qs("[data-modal]");
    if (!modal) return;
    const image = qs("[data-modal-image]");
    const close = qs("[data-modal-close]");

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      image.src = "";
    }

    qsa("[data-full]").forEach((button) => {
      button.addEventListener("click", () => {
        image.src = button.dataset.full;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
      });
    });

    close.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
  }
  function initInquiryTemplate() {
    const template = qs("[data-inquiry-template]");
    const copyButton = qs("[data-copy-inquiry]");
    const status = qs("[data-template-status]");
    if (!template || !copyButton) return;

    const productName = new URLSearchParams(location.search).get("product");
    if (productName) {
      const productInput = qs('input[name="product"]', template);
      if (productInput) productInput.value = productName;
    }

    copyButton.addEventListener("click", () => {
      const getValue = (name) => String(qs(`[name="${name}"]`, template)?.value || "").trim();
      const text = [
        "T-WORLD KOREA 문의",
        "",
        `회사명: ${getValue("company") || "-"}`,
        `성함: ${getValue("name") || "-"}`,
        `연락처: ${getValue("phone") || "-"}`,
        `이메일: ${getValue("email") || "-"}`,
        `관심 제품: ${getValue("product") || "-"}`,
        "",
        "문의 내용:",
        getValue("message") || "-"
      ].join("\n");
      const showStatus = (message) => {
        if (status) status.textContent = message;
      };

      if (!navigator.clipboard) {
        showStatus("양식을 직접 선택해서 복사해주세요.");
        return;
      }

      navigator.clipboard
        .writeText(text)
        .then(() => showStatus("문의 양식이 복사되었습니다. 카카오톡이나 이메일에 붙여넣어 보내주세요."))
        .catch(() => showStatus("양식을 직접 선택해서 복사해주세요."));
    });
  }

  initHeader();
  initFade();
  initImageFallbacks();
  initSampleListUi();
  renderFeaturedProducts();
  renderProductsPage();
  renderProductDetail();
  initLookbookModal();
  initInquiryTemplate();
})();
