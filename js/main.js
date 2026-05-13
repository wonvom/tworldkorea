(function () {
  const productData = window.products || [];
  const page = document.body.dataset.page;
  const catalogSummary = window.catalogSummary || {};

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const categoryLabels = {
    "Short Sleeve": { kr: "반팔", en: "Short Sleeve" },
    "Sleeveless": { kr: "민소매", en: "Sleeveless" },
    "Long Sleeve": { kr: "긴팔", en: "Long Sleeve" },
    "Sweatshirt": { kr: "맨투맨", en: "Sweatshirt" },
    "Hoodie": { kr: "후드", en: "Hoodie" },
    "Pants": { kr: "팬츠", en: "Pants" }
  };

  function categoryLabel(category) {
    return categoryLabels[category] || { kr: category, en: category };
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
    const detailHref = `product-detail.html?id=${encodeURIComponent(product.code)}&v=20260513-work-assets`;
    return `
      <a class="product-card image-card" href="${detailHref}">
        <span class="image-frame" data-label="${product.code} Front Image">
          <img src="${product.thumbnail}" alt="${product.name} 대표 이미지" loading="lazy">
        </span>
        <p class="product-code">${product.code}</p>
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
          <img src="${image}" alt="${alt}">
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
      mount.innerHTML = `<div class="page-hero"><h1>PRODUCT NOT FOUND</h1><p>제품 데이터를 찾을 수 없습니다.</p><a class="btn btn-dark" href="products.html?v=20260513-work-assets">Back to Products</a></div>`;
      return;
    }
    document.title = `${product.name} | T-WORLD KOREA`;
    const related = productData.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
    const slots = product.imageSlots || {};
    const modelImages = slots.model || [];
    const detailImages = slots.detail || [];
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
            <img src="${product.images[0] || product.thumbnail}" alt="${product.name} 대표 이미지" data-main-product-image>
          </div>
          <div class="gallery-thumbs">
            ${slotImages.map((slot) => `
              <button class="gallery-thumb image-frame" type="button" data-image="${slot.image}" data-label="${slot.label}">
                <img src="${slot.image}" alt="${slot.alt}" loading="lazy">
              </button>
            `).join("")}
          </div>
        </div>
        <aside class="detail-summary">
          <p class="eyebrow">${product.code}</p>
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
          <a class="btn btn-dark full" href="contact.html?product=${encodeURIComponent(product.name)}">Wholesale Inquiry</a>
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
                <img src="${color.image}" alt="${product.name} ${color.nameKr} 컬러 이미지" loading="lazy" data-fallback-src="${(color.fallbackImages || []).join("|")}">
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
                <img src="${image}" alt="${product.name} 원단 봉제 디테일 ${index + 1}" loading="lazy">
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

  function initContactForm() {
    const form = qs("[data-contact-form]");
    if (!form) return;

    const productName = new URLSearchParams(location.search).get("product");
    if (productName) {
      const input = qs('input[name="product"]', form);
      if (input) input.value = productName;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      alert("문의 기능은 준비 중입니다. 전화 또는 이메일로 문의해주세요.");
    });
  }

  initHeader();
  initFade();
  initImageFallbacks();
  renderFeaturedProducts();
  renderProductsPage();
  renderProductDetail();
  initLookbookModal();
  initContactForm();
})();
