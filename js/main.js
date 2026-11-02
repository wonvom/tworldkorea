(function () {
  if (window.top !== window.self) {
    try {
      window.top.location.replace(window.self.location.href);
    } catch (error) {
      document.documentElement.style.display = "none";
    }
  }

  const productData = window.products || [];
  const page = document.body.dataset.page;
  const catalogSummary = window.catalogSummary || {};
  const assetVersion = "20261012-multilingual-color-codes";


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

  const customOrderProductCodes = new Set([
    "27012",
    "A23014",
    "CK280",
    "LK3401",
    "YL3200",
    "LM3200",
    "QXX5200"
  ]);

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

  function safeCssColor(value) {
    const color = String(value || "").trim();
    return /^#[0-9a-f]{3,8}$/i.test(color) ? color : "#ffffff";
  }

  function assetUrl(src) {
    const value = String(src || "").trim();
    if (!value) return "";
    try {
      const url = new URL(value, window.location.href);
      if (url.origin !== window.location.origin) return "";
      url.searchParams.set("v", assetVersion);
      return url.href;
    } catch (error) {
      return "";
    }
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
    const detailHref = `product-detail.html?id=${encodeURIComponent(product.code)}`;
    const customOrderBadge = isCustomOrderProduct(product) ? `<span class="custom-order-badge">주문제작</span>` : "";
    return `
      <a class="product-card image-card" href="${escapeHtml(detailHref)}">
        <span class="image-frame" data-label="${escapeHtml(product.code)} Front Image">
          ${customOrderBadge}
          <img src="${escapeHtml(assetUrl(product.thumbnail))}" alt="${escapeHtml(product.name)} 대표 이미지" loading="lazy">
        </span>
        <p class="product-code"><span>MODEL NO.</span>${escapeHtml(product.code)}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <div class="product-meta">
          <span>${escapeHtml(label.kr)} <small>${escapeHtml(label.en)}</small></span>
          <span>${escapeHtml(product.fit)}</span>
          <span>${escapeHtml(product.fabric)}</span>
          <span>${escapeHtml(product.weight)} ${product.colors.length} Colors</span>
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
    return product.colors.map((color) => `<span class="swatch" title="${escapeHtml(`${color.nameKr} ${color.nameCn} ${color.nameEn}`)}" style="background:${safeCssColor(color.hex)}"></span>`).join("");
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
              ${fields.map((field) => `<th><span>${escapeHtml(field.label)}</span><small>${escapeHtml(field.labelCn)} ${escapeHtml(field.labelEn)}</small></th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${product.sizes.map((size) => `
              <tr>
                ${fields.map((field) => `<td>${escapeHtml(size[field.key] || "-")}</td>`).join("")}
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
        <div class="image-frame wide" data-label="${escapeHtml(label)}">
          <img src="${escapeHtml(assetUrl(image))}" alt="${escapeHtml(alt)}">
        </div>
        <p>${escapeHtml(label)}</p>
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
      mount.innerHTML = `<div class="page-hero"><h1>PRODUCT NOT FOUND</h1><p>제품 데이터를 찾을 수 없습니다.</p><a class="btn btn-dark" href="products.html">제품 목록으로 돌아가기</a></div>`;
      return;
    }
    document.title = `${product.name} | 티월드코리아`;
    const detailUrl = new URL("product-detail.html", window.location.href);
    detailUrl.searchParams.set("id", product.code);
    const canonical = qs('link[rel="canonical"]');
    const ogUrl = qs('meta[property="og:url"]');
    const ogTitle = qs('meta[property="og:title"]');
    const ogImage = qs('meta[property="og:image"]');
    if (canonical) canonical.href = detailUrl.href;
    if (ogUrl) ogUrl.content = detailUrl.href;
    if (ogTitle) ogTitle.content = `${product.name} | 티월드코리아`;
    if (ogImage) ogImage.content = new URL(product.thumbnail, window.location.href).href;
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
          <div class="detail-main-image image-frame" data-label="${escapeHtml(product.code)} Front Image">
            ${customOrderBadge}
            <img src="${escapeHtml(assetUrl(product.images[0] || product.thumbnail))}" alt="${escapeHtml(product.name)} 대표 이미지" data-main-product-image>
          </div>
          <div class="gallery-thumbs">
            ${slotImages.map((slot) => `
              <button class="gallery-thumb image-frame" type="button" data-image="${escapeHtml(assetUrl(slot.image))}" data-label="${escapeHtml(slot.label)}">
                <img src="${escapeHtml(assetUrl(slot.image))}" alt="${escapeHtml(slot.alt)}" loading="lazy">
              </button>
            `).join("")}
          </div>
        </div>
        <aside class="detail-summary">
          <p class="product-detail-code"><span>MODEL NO.</span>${escapeHtml(product.code)}</p>
          <h1>${escapeHtml(product.name)}</h1>
          ${product.nameCn || product.nameEn ? `<p class="product-subtitle">${[product.nameCn, product.nameEn].filter(Boolean).map(escapeHtml).join("<br>")}</p>` : ""}
          ${product.description && product.description.trim().toLowerCase() !== String(product.nameEn || "").trim().toLowerCase() ? `<p>${escapeHtml(product.description)}</p>` : ""}
          <dl class="summary-list">
            <div><dt>Category</dt><dd>${escapeHtml(categoryLabel(product.category).kr)} ${escapeHtml(categoryLabel(product.category).en)}</dd></div>
            ${product.fit ? `<div><dt>Fit</dt><dd>${escapeHtml(product.fit)}</dd></div>` : ""}
            ${product.fabric ? `<div><dt>Fabric</dt><dd>${escapeHtml(product.fabric)}</dd></div>` : ""}
            ${product.weight ? `<div><dt>Weight</dt><dd>${escapeHtml(product.weight)}</dd></div>` : ""}
            ${product.pdfPage ? `<div><dt>PDF Page</dt><dd>${escapeHtml(product.pdfPage)} Page</dd></div>` : ""}
            <div><dt>Size</dt><dd>${escapeHtml(product.sizes.map((size) => size.size).join(", "))}</dd></div>
          </dl>
          <p class="filter-label">COLOR</p>
          <div class="swatch-row">${colorSwatches(product)}</div>
          <div class="member-order-actions">
            <a class="btn btn-dark full" href="https://members.tworldkorea.co.kr/account/shop?product=${encodeURIComponent(product.code)}">주문하기</a>
            <a class="btn btn-light full" href="https://members.tworldkorea.co.kr/account/shop?product=${encodeURIComponent(product.code)}#stock">재고 확인</a>
          </div>
        </aside>
      </div>

      <section class="detail-section">
        <p class="eyebrow">PRODUCT DESCRIPTION</p>
        <h2>DETAIL NOTES</h2>
        ${product.description ? `<p class="detail-copy">${escapeHtml(product.description)}</p>` : ""}
        <div class="detail-info-grid">
          ${product.details.map((detail) => `<article><h3>${escapeHtml(detail.title)}</h3><p>${escapeHtml(detail.text)}</p></article>`).join("")}
        </div>
      </section>

      <section class="detail-section">
        <p class="eyebrow">IMAGE PLACEMENT</p>
        <h2>PRODUCT ASSETS</h2>
        ${slots.guide ? `<p class="detail-copy">${escapeHtml(slots.guide)}</p>` : ""}
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
                  <td><span class="color-table-chip" style="background:${safeCssColor(color.hex)}" title="${escapeHtml(`${color.nameKr} ${color.nameCn} ${color.nameEn} ${color.nameJa || ""}`)}"></span></td>
                  <td>${escapeHtml(color.code || "")}</td>
                  <td>${escapeHtml(color.nameKr)}</td>
                  <td>${escapeHtml(color.nameCn)}</td>
                  <td>${escapeHtml(color.nameEn)}</td>
                  <td>${escapeHtml(color.nameJa || "")}</td>
                  <td>${escapeHtml(color.hex)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <h2 class="subsection-title">COLOR IMAGES</h2>
        <div class="color-image-grid">
          ${product.colors.filter((color) => color.image).map((color) => `
            <article class="color-image">
              <div class="image-frame" data-label="${escapeHtml(color.nameKr)} ${escapeHtml(color.nameEn)}">
                <img src="${escapeHtml(assetUrl(color.image))}" alt="${escapeHtml(product.name)} ${escapeHtml(color.nameKr)} 컬러 이미지" loading="lazy" data-fallback-src="${escapeHtml((color.fallbackImages || []).map(assetUrl).filter(Boolean).join("|"))}">
              </div>
              <h3>${escapeHtml(color.nameKr)}</h3>
              <p>${escapeHtml(color.nameCn)}<br>${escapeHtml(color.nameEn)}</p>
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
                <img src="${escapeHtml(assetUrl(image))}" alt="${escapeHtml(product.name)} 원단 봉제 디테일 ${index + 1}" loading="lazy">
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

  renderFeaturedProducts();
  renderProductsPage();
  renderProductDetail();
  initLookbookModal();
  initInquiryTemplate();
})();
