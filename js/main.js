(function () {
  const productData = window.products || [];
  const page = document.body.dataset.page;

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function initHeader() {
    const header = qs("[data-header]");
    const nav = qs("[data-nav]");
    const toggle = qs("[data-nav-toggle]");
    const current = location.pathname.split("/").pop() || "index.html";

    qsa(".site-nav a").forEach((link) => {
      const href = link.getAttribute("href");
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
    }, { threshold: 0.14 });

    targets.forEach((target) => observer.observe(target));
  }

  function initImageFallbacks(root = document) {
    qsa(".image-frame img", root).forEach((img) => {
      if (img.dataset.fallbackBound) return;
      img.dataset.fallbackBound = "true";
      img.addEventListener("error", () => {
        const frame = img.closest(".image-frame");
        if (frame) frame.classList.add("is-missing");
      });
    });
  }

  function productCard(product) {
    return `
      <article class="product-card image-card">
        <a class="image-frame" href="product-detail.html?id=${product.id}" data-label="${product.category}">
          <img src="${product.thumbnail}" alt="${product.name} 대표 이미지">
        </a>
        <h3>${product.name}</h3>
        <div class="product-meta">
          <span>${product.category}</span>
          <span>${product.fit}</span>
          <span>${product.fabric}</span>
          <span>${product.weight} ${product.colors.length} Colors</span>
        </div>
        <a class="card-link" href="product-detail.html?id=${product.id}">View Detail</a>
      </article>
    `;
  }

  function renderFeaturedProducts() {
    const mount = qs("[data-featured-products]");
    if (!mount || productData.length === 0) return;
    const featuredIds = ["short-sleeve-01", "short-sleeve-04", "short-sleeve-09", "sleeveless-01", "long-sleeve-02", "pants-01"];
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
    return product.colors.map((color) => `<span class="swatch" title="${color.nameKr} ${color.nameEn}" style="background:${color.hex}"></span>`).join("");
  }

  function sizeTable(product) {
    return `
      <div class="size-table-wrap">
        <table class="size-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Shoulder</th>
              <th>Chest</th>
              <th>Sleeve</th>
              <th>Length</th>
            </tr>
          </thead>
          <tbody>
            ${product.sizes.map((size) => `
              <tr>
                <td>${size.size}</td>
                <td>${size.shoulder}</td>
                <td>${size.chest}</td>
                <td>${size.sleeve}</td>
                <td>${size.length}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderProductDetail() {
    const mount = qs("[data-product-detail]");
    if (!mount) return;

    const id = new URLSearchParams(location.search).get("id");
    const product = productData.find((item) => item.id === id) || productData[0];

    if (!product) {
      mount.innerHTML = `<div class="page-hero"><h1>PRODUCT NOT FOUND</h1><p>제품 데이터를 찾을 수 없습니다.</p><a class="btn btn-dark" href="products.html">Back to Products</a></div>`;
      return;
    }

    document.title = `${product.name} | BLANK STUDIO`;
    const related = productData.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);

    mount.innerHTML = `
      <div class="detail-grid">
        <div class="detail-gallery">
          <div class="detail-main-image image-frame" data-label="${product.name}">
            <img src="${product.images[0]}" alt="${product.name} 대표 이미지" data-main-product-image>
          </div>
          <div class="gallery-thumbs">
            ${product.images.map((image, index) => `
              <button class="gallery-thumb image-frame" type="button" data-image="${image}" data-label="Image ${index + 1}">
                <img src="${image}" alt="${product.name} 이미지 ${index + 1}">
              </button>
            `).join("")}
          </div>
        </div>
        <aside class="detail-summary">
          <p class="eyebrow">${product.code}</p>
          <h1>${product.name}</h1>
          <p>${product.description}</p>
          <dl class="summary-list">
            <div><dt>Category</dt><dd>${product.category}</dd></div>
            <div><dt>Fit</dt><dd>${product.fit}</dd></div>
            <div><dt>Fabric</dt><dd>${product.fabric}</dd></div>
            <div><dt>Weight</dt><dd>${product.weight}</dd></div>
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
        <p class="eyebrow">SIZE GUIDE</p>
        <h2>MEASUREMENT</h2>
        ${sizeTable(product)}
      </section>

      <section class="detail-section">
        <p class="eyebrow">COLOR VARIATIONS</p>
        <h2>COLOR IMAGES</h2>
        <div class="color-image-grid">
          ${product.colors.map((color) => `
            <article class="color-image">
              <div class="image-frame" data-label="${color.nameEn}">
                <img src="${color.image}" alt="${product.name} ${color.nameKr} 컬러 이미지">
              </div>
              <h3>${color.nameEn}</h3>
              <p>${color.nameKr}</p>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="detail-section">
        <p class="eyebrow">FABRIC AND SEWING</p>
        <h2>DETAIL IMAGE</h2>
        <div class="color-image-grid">
          ${product.detailImages.map((image, index) => `
            <div class="image-frame wide" data-label="Detail ${index + 1}">
              <img src="${image}" alt="${product.name} 원단 봉제 디테일 ${index + 1}">
            </div>
          `).join("")}
        </div>
      </section>

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
