(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TworldI18n = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  const storageKey = "tworld-language";
  const pairs = [
    ["HOME", "홈"], ["ABOUT", "회사 소개"], ["PRODUCTS", "제품"], ["LOOKBOOK", "룩북"], ["CONTACT", "문의"],
    ["Log in", "로그인"], ["Sign up", "회원가입"], ["My Page", "마이페이지"],
    ["CATEGORY INDEX", "제품 분류"], ["PRODUCT CATEGORIES", "카테고리별 제품"],
    ["FEATURED LINEUP", "추천 라인업"], ["SELECTED PRODUCTS", "추천 제품"], ["All Products", "전체 제품 보기"],
    ["MATERIAL STANDARD", "원단 기준"], ["FABRIC AND QUALITY", "소재와 품질"],
    ["Washed 20s 230G", "워싱 20수 230G"], ["Fleece 270G", "기모 270G"],
    ["16s 250G", "16수 250G"], ["20s 230g", "20수 230g"], ["24s 180G", "24수 180G"], ["20s", "20수"],
    ["COMPANY AND FACTORY", "회사와 생산 시설"], ["SUPPLY NETWORK", "생산 및 공급 기반"],
    ["Korea Office", "한국 지사"], ["China Office", "중국 본사"], ["Korea Showroom", "한국 쇼룸"],
    ["Production Facility", "생산 시설"], ["LOOKBOOK PREVIEW", "룩북 미리보기"], ["MODEL FIT ARCHIVE", "모델 착용컷"],
    ["View Lookbook", "룩북 보기"], ["WHOLESALE CONTACT", "도매 상담"], ["Contact Us", "문의하기"],
    ["ABOUT COMPANY", "회사 안내"], ["FACTORY, SHOWROOM AND WHOLESALE", "공장, 쇼룸, 도매 공급"],
    ["OUR WORK", "우리가 하는 일"], ["DOMESTIC COMMUNICATION AND OVERSEAS PRODUCTION", "국내 상담과 해외 생산"],
    ["SUPPLY VALUE", "공급 서비스"], ["WHAT WE SUPPORT", "거래처 지원 안내"],
    ["PRODUCT CATALOG", "제품 카탈로그"], ["PRODUCT LINEUP", "제품 라인업"], ["CATEGORY", "카테고리"],
    ["FIT AND WEIGHT", "핏과 중량"], ["All", "전체"], ["Regular Fit", "레귤러핏"], ["Relaxed Fit", "릴렉스핏"],
    ["Oversized Fit", "오버핏"], ["Loose Fit", "루즈핏"], ["Heavy Weight", "고중량"],
    ["Short Sleeve", "반팔"], ["Sleeveless", "민소매"], ["Long Sleeve", "긴팔"], ["Polo Shirt", "카라티"],
    ["Sweatshirt", "맨투맨"], ["Hoodie", "후드"], ["Pants", "바지"],
    ["CATALOG GUIDE", "카탈로그 안내"], ["MODEL NO.", "모델명"], ["View Detail", "상세 보기"],
    ["Made to order", "주문제작"], ["Category", "제품 분류"], ["Fit", "핏"], ["Fabric", "소재와 혼용률"],
    ["Weight", "중량"], ["PDF Page", "카탈로그 페이지"], ["Size", "사이즈"], ["COLOR", "색상"],
    ["Order", "주문하기"], ["Check stock", "재고 확인"],
    ["PRODUCT DESCRIPTION", "제품 설명"], ["DETAIL NOTES", "상세 안내"], ["IMAGE PLACEMENT", "제품 이미지 안내"],
    ["PRODUCT ASSETS", "제품 이미지"], ["SIZE GUIDE", "사이즈 안내"], ["MEASUREMENT", "실측 사이즈"],
    ["COLOR VARIATIONS", "색상 구성"], ["COLOR NAMES", "색상명 안내"], ["COLOR IMAGES", "색상별 이미지"],
    ["Chip", "색상표"], ["Color Code", "색상 코드"], ["DETAIL CLOSE UP", "확대 보기"], ["DETAIL IMAGES", "상세 이미지"],
    ["Korean", "한국어"], ["Chinese", "중국어"], ["English", "영어"], ["Japanese", "일본어"],
    ["RELATED PRODUCTS", "함께 볼 제품"], ["SAME CATEGORY", "같은 카테고리 제품"],
    ["Front Image", "앞면"], ["Back Image", "뒷면"], ["Catalog Source", "카탈로그 출처"], ["Image Plan", "이미지 구성"],
    ["Color Language", "색상명 표기"], ["Shoulder", "어깨"], ["Chest", "가슴"], ["Sleeve", "소매"], ["Length", "총장"],
    ["Recommended height", "추천 키"], ["Recommended weight", "추천 몸무게"], ["Waist", "허리둘레"], ["Hip", "엉덩이둘레"],
    ["Thigh", "허벅지둘레"], ["Leg Opening", "밑단둘레"],
    ["ESSENTIAL FORM", "기본 실루엣"], ["QUIET TEXTURE", "차분한 소재감"], ["DAILY UNIFORM", "편안한 일상복"], ["Close", "닫기"],
    ["CONTACT US", "문의 안내"], ["MOBILE", "전화 상담"], ["BUSINESS", "회사 정보"], ["KAKAO", "카카오톡"],
    ["LOCATION", "오시는 길"], ["OFFICE MAP", "사무실 위치"], ["Open Naver Map", "네이버 지도 열기"], ["Open Kakao Map", "카카오맵 열기"],
    ["KakaoTalk inquiry", "카카오톡 문의하기"], ["Inquiry form", "문의 양식"], ["Company", "회사명"], ["Name", "성함"],
    ["Phone", "연락처"], ["Email", "이메일"], ["Product of interest", "관심 제품"], ["Message", "문의 내용"],
    ["Copy inquiry", "내용 복사하기"], ["Enter your company name", "회사명을 입력하세요"], ["Enter your name", "성함을 입력하세요"],
    ["Enter your inquiry", "문의 내용을 입력하세요"], ["Home", "홈으로 이동"], ["Open menu", "메뉴 열기"],
    ["PRODUCT NOT FOUND", "제품을 찾을 수 없습니다"], ["Product data is unavailable.", "제품 데이터를 찾을 수 없습니다."],
    ["Back to products", "제품 목록으로 돌아가기"], ["T-WORLD KOREA inquiry", "T-WORLD KOREA 문의"],
    ["Please select and copy the form manually.", "양식을 직접 선택해서 복사해주세요."],
    ["Inquiry copied. Paste it into KakaoTalk or an email to send it.", "문의 양식이 복사되었습니다. 카카오톡이나 이메일에 붙여넣어 보내주세요."],
    ["Material", "원단"], ["Gender", "성별"], ["Unisex", "남녀공용"], ["Season", "시즌"], ["Care", "세탁"],
    ["Spring / Summer", "봄/여름"], ["Spring / Autumn / Winter", "봄/가을/겨울"], ["Spring / Summer / Winter", "봄/여름/겨울"],
    ["Wash separately with neutral detergent at or below 30°C. Do not bleach.", "30℃ 이하 중성세제 단독세탁 / 표백제 사용 금지"],
    ["Wash separately with neutral detergent at or below 30°C. Do not bleach. Dry inside out.", "30℃ 이하 중성세제 단독세탁 / 표백제 사용 금지 / 뒤집어 건조"],
    ["Vintage washed, loose fit", "워싱 빈티지 가공, 루즈핏"], ["Vintage washed long-sleeve T-shirt", "빈티지 워싱 긴팔 티셔츠"],
    ["Includes front, back, color and close-up images.", "앞면, 뒷면, 색상, 상세 확대 이미지를 포함했습니다."],
    ["Color names are provided in Korean, Chinese, English and Japanese.", "색상명은 한국어, 중국어, 영어, 일본어를 함께 노출하도록 구성했습니다."],
    ["T-WORLD KOREA Wholesale T-Shirts", "티월드코리아 티셔츠 도매 총판"], ["T-WORLD KOREA", "티월드코리아"],
    ["About | T-WORLD KOREA Wholesale T-Shirts", "회사 소개 | 티월드코리아 티셔츠 도매 총판"],
    ["Products | T-WORLD KOREA Wholesale T-Shirts", "제품 라인업 | 티월드코리아 티셔츠 도매 총판"],
    ["Product Details | T-WORLD KOREA Wholesale T-Shirts", "제품 상세 | 티월드코리아 티셔츠 도매 총판"],
    ["Lookbook | T-WORLD KOREA Wholesale T-Shirts", "룩북 | 티월드코리아 티셔츠 도매 총판"],
    ["Wholesale Inquiries | T-WORLD KOREA Wholesale T-Shirts", "도매 문의 | 티월드코리아 티셔츠 도매 총판"],
    ["© 2026 T-WORLD KOREA. All rights reserved. Designed by Wonjong Kim.", "© 2026 티월드코리아. 모든 권리 보유. 디자인: Wonjong Kim."],
    ["Fabric count, weight, composition, wash finish and size ranges are listed by product in the PDF catalog.", "PDF 카탈로그 제품 기준으로 수, 중량, 혼용률, 워싱 여부, 사이즈 대응 범위를 제품별로 안내합니다."],
    ["Heavyweight T-shirts for oversized and loose silhouettes", "오버사이즈와 루즈핏에 적합한 고중량 티셔츠 라인"],
    ["A balanced weight for semi drop-shoulder and everyday T-shirts", "세미 드롭숄더와 기본 티셔츠에 안정적인 중량감"],
    ["Light and soft essentials for everyday wear", "가볍고 부드러운 데일리 라인"],
    ["Distinctive colors across vintage-washed and women's washed styles", "빈티지 워싱과 여성 워싱 라인으로 색감 차별화"],
    ["Winter options including sweatshirts, hoodies and joggers", "맨투맨, 후드, 조거바지까지 겨울 시즌 대응"],
    ["Our Korean office and warehouse in Guri support domestic wholesale inquiries and dispatch consultations.", "경기도 구리 한국 지사와 창고를 기반으로 국내 도매 고객 응대와 출고 상담을 진행합니다."],
    ["Our China factory includes knitting, dyeing, cutting, sewing, warehousing and showroom facilities.", "제직, 염색, 재단, 봉제, 창고, 쇼룸을 갖춘 중국 본사 공장 기반을 소개합니다."],
    ["Showroom images help you review actual colors, fits and fabric textures.", "실제 컬러와 핏, 원단감을 확인할 수 있는 쇼룸 이미지를 배치하면 신뢰도를 높일 수 있습니다."],
    ["Need help with bulk purchases or our product catalog?", "대량 구매, 제품 카탈로그 문의가 필요하신가요?"],
    ["Contact us about reliable supply and competitive pricing.", "안정적인 공급과 합리적인 가격으로 상담을 도와드립니다."],
    ["A brand website for wholesale apparel supply and product catalog inquiries.", "기본 의류 도매 공급과 제품 카탈로그 문의를 위한 브랜드 사이트입니다."],
    ["T-WORLD KOREA supplies premium T-shirts for wholesale and retail, presenting both its products and production facilities.", "티월드코리아는 프리미엄 티셔츠 도매 및 소매 총판을 중심으로 제품 라인업과 생산 기반을 함께 보여주는 의류 회사입니다."],
    ["The PDF catalog introduces our China factory, Korean warehouse and showroom before presenting individual product details.", "PDF 카탈로그는 중국 본사 공장과 한국 지사 창고, 쇼룸을 먼저 보여준 뒤 제품별 상세 정보를 이어서 안내하는 구조입니다."],
    ["The China factory section presents knitting, dyeing, cutting, sewing, warehousing and showroom facilities.", "중국 본사 공장 파트는 공장 전경, 제직, 염색, 재단, 봉제, 창고, 쇼룸 이미지를 통해 생산 기반을 설명합니다."],
    ["Our Korean warehouse and showroom help wholesale customers review product colors, sizes and fabric textures.", "한국 지사 파트는 창고와 쇼룸 이미지를 중심으로 국내 도매 고객이 제품 컬러, 사이즈, 원단감을 빠르게 확인할 수 있는 기반을 보여줍니다."],
    ["Our catalog covers T-shirts, sleeveless tops, long sleeves, sweatshirts, hoodies and pants. Compare colors, sizes, fabrics and weights for wholesale and supply inquiries.", "티월드코리아는 반팔 티셔츠, 긴팔 티셔츠, 민소매, 맨투맨, 후드티, 바지 등 기본 의류 라인업을 카탈로그 형태로 정리합니다. 제품별 색상, 사이즈, 원단, 중량 정보를 확인하고 도매 상담이나 납품 검토에 필요한 자료를 빠르게 살펴볼 수 있도록 구성했습니다."],
    ["Product range", "제품 라인업"], ["Fabric options", "원단 대응"], ["Size range", "사이즈 구성"], ["Color support", "컬러 운영"],
    ["Inquiry information", "상담 기준"], ["About this catalog", "카탈로그 역할"],
    ["The PDF-based catalog includes 33 products across short sleeves, sleeveless tops, long sleeves, sweatshirts, hoodies and pants.", "반팔, 나시, 긴팔, 맨투맨, 후드, 바지까지 PDF 기준 33개 제품을 카탈로그화했습니다."],
    ["Review composition and weight by product, including cotton, stretch blends, polyester blends, mercerized cotton and fleece.", "면 100%, 스판 혼방, 폴리 혼방, 실켓 코튼, 기모 등 제품별 혼용률과 중량을 안내합니다."],
    ["Measurement fields vary for tops, sleeveless styles and pants, based on each product's size chart.", "제품별 실측표를 기반으로 상의, 나시, 바지 사이즈 항목을 다르게 보여줍니다."],
    ["Color names in Korean, Chinese and English support both local inquiries and communication with production in China.", "색상명은 한국어, 중국어, 영어를 함께 표기해 국내 상담과 중국 생산 커뮤니케이션을 모두 고려합니다."],
    ["Product information supports blank T-shirt wholesale, apparel supply, uniforms and essential brand collections.", "무지 티셔츠 도매, 기본 의류 납품, 단체복 검토, 브랜드 기본 라인업 확인에 필요한 제품 정보를 우선 정리합니다."],
    ["Compare colors, fits, fabrics and sizes before sending a product inquiry.", "구매 기능보다 제품 정보 확인에 집중하여 업체가 컬러, 핏, 소재, 사이즈를 비교한 뒤 문의할 수 있도록 안내합니다."],
    ["About our wholesale apparel company", "기본 의류 도매 공급 회사 소개"],
    ["Browse short sleeves, sleeveless tops, long sleeves, sweatshirts, hoodies and pants from the PDF catalog.", "PDF 카탈로그 기준 반팔, 민소매, 긴팔, 맨투맨, 후드, 바지 라인업을 확인하세요."],
    ["A wholesale catalog for reviewing product information", "제품 정보 확인용 도매 카탈로그"],
    ["This static wholesale catalog helps businesses review colors, sizes, materials, weights and fits for blank T-shirts, apparel supply, uniforms and essential collections.", "티월드코리아 제품 라인업은 쇼핑몰이 아니라 도매 상담과 제품 검토를 위한 정적 카탈로그입니다. 무지 티셔츠 도매, 기본 의류 납품, 단체복 검토, 브랜드 기본 라인업 확인에 필요한 색상, 사이즈, 소재, 중량, 핏 정보를 제품별로 정리합니다."],
    ["Short-sleeve T-shirts", "반팔 티셔츠"], ["Long-sleeve T-shirts", "긴팔 티셔츠"], ["Hoodies", "후드티"],
    ["Weights from 180G to 300G and a variety of fits for blank T-shirt wholesale and essential collections.", "180G부터 300G까지 다양한 중량과 핏으로 구성되어 있으며 무지 티셔츠 도매와 기본 반팔 라인업 검토에 적합합니다."],
    ["Review colors, sizes and compositions for summer essentials and layering.", "여름 시즌 기본 의류와 이너 라인업을 확인할 수 있도록 컬러, 사이즈, 혼용률 정보를 함께 안내합니다."],
    ["Compare essential long sleeves, rib cuffs and loose fits for seasonal supply inquiries.", "기본 긴팔 티셔츠, 립 소매, 루즈핏 제품 등 계절별 납품 상담에 필요한 제품 정보를 비교할 수 있습니다."],
    ["Review materials, weights, colors and recommended sizes for functional polos and polo shirts.", "기능성 카라 셔츠와 폴로 셔츠 라인을 중심으로 소재, 중량, 색상, 권장 사이즈 정보를 확인할 수 있습니다."],
    ["Compare textures, weights and fits across basic and washed sweatshirts from 270G to 350G.", "270G부터 350G까지 기본 맨투맨과 워싱 제품을 중심으로 원단감, 중량, 핏 정보를 확인할 수 있습니다."],
    ["Browse colors and detailed images for basic and heavyweight wholesale hoodies.", "기본 후드티와 고중량 후드티 라인을 도매 상담 기준으로 정리하여 색상과 상세 이미지를 함께 제공합니다."],
    ["Explore sweatpants and joggers to coordinate with essential tops.", "스웨트바지와 조거바지 라인업을 중심으로 상의 제품과 함께 검토할 수 있는 기본 의류 구성을 안내합니다."],
    ["Check materials, weights and colors for each product.", "제품별 소재, 중량, 컬러 정보를 확인하세요."],
    ["Contact us by phone, email or KakaoTalk for product details.", "제품 상세 문의는 전화, 이메일, 카카오톡으로 가능합니다."],
    ["An image collection focused on the mood and silhouette of each product.", "판매 화면보다 제품의 분위기와 실루엣을 차분하게 보여주는 이미지북입니다."],
    ["A refined essential silhouette", "기본을 정돈한 실루엣"], ["Clothing with a focus on texture", "소재감이 먼저 보이는 옷"],
    ["Balanced for everyday wear", "매일 입기 좋은 균형"], ["Model looks and product silhouettes", "모델 착용컷과 제품 실루엣 아카이브"],
    ["Contact us below for bulk purchases, supply arrangements and product catalog inquiries.", "대량 구매, 납품, 제품 카탈로그 문의가 필요하시면 아래 연락처로 상담을 요청해주세요."],
    ["Include the product name, quantity, delivery schedule and preferred colors for a faster response.", "제품명, 수량, 납품 일정, 희망 컬러를 함께 보내주시면 빠르게 확인합니다."],
    ["T-WORLD KOREA Co., Ltd.", "(주)티월드코리아"],
    ["Product support backed by our China factory, Korean warehouse and showroom", "중국 본사 공장, 한국 지사 창고, 쇼룸 기반 제품 상담"],
    ["You can contact us through our KakaoTalk channel.", "카카오톡 채널에서 문의 가능합니다."],
    ["Consultation hours: weekdays, 10:00–18:00.", "평일 10:00부터 18:00까지 상담 가능합니다."],
    ["Please include the following information", "문의 시 아래 내용을 함께 보내주세요"],
    ["Fill in the form, then copy and send it through KakaoTalk to help us respond to your inquiry.", "아래 내용을 작성한 뒤 복사해서 카카오톡으로 보내주시면 제품 확인과 상담이 더 빠르게 진행됩니다."],
    ["Wholesale inquiries and product support", "도매 문의와 제품 상담 안내"]
  ];

  function koreanFabric(value) {
    return String(value).replace(/DuPont Sorona|Cooling Fiber|Polyester|Spandex|Cotton|Rayon|Nylon|Sorona|Span|Outer:|Lining:/g,
      word => ({ "DuPont Sorona": "듀폰 소로나", "Cooling Fiber": "냉감 섬유", Polyester: "폴리에스터", Spandex: "스판", Cotton: "면", Rayon: "레이온", Nylon: "나일론", Sorona: "소로나", Span: "스판", "Outer:": "겉감:", "Lining:": "안감:" })[word]);
  }

  function createTranslator(products = []) {
    const dictionary = new Map();
    function add(en, ko) {
      if (!en || !ko) return;
      dictionary.set(en, { ko, en });
      if (!dictionary.has(ko)) dictionary.set(ko, { ko, en });
    }
    pairs.forEach(([en, ko]) => add(en, ko));
    for (const product of products) {
      add(product.nameEn, product.name);
      add(`${product.nameEn} | T-WORLD KOREA`, `${product.name} | 티월드코리아`);
      add(product.fabric, koreanFabric(product.fabric));
      if (product.description?.includes("PDF 카탈로그 기준으로")) {
        add(`${product.code}: model looks, front and back views, close-ups and color references from the PDF catalog.`, product.description);
      } else if (/^[\x00-\x7F]+$/.test(product.description || "") && product.description) {
        add(product.description, product.name);
      }
      if (product.imageSlots?.guide) add(`${product.code} ${product.nameEn}: front, back, close-up and color images.`, product.imageSlots.guide);
    }
    return function translate(value, language = "ko") {
      const original = String(value);
      const text = original.trim();
      let result = dictionary.get(text)?.[language];
      if (result === undefined) {
        const products = text.match(/^(\d+) Products$/) || text.match(/^제품 (\d+)개$/);
        const colors = text.match(/^(.*?)\s+(\d+) Colors$/) || text.match(/^(.*?)\s+(\d+)색상$/);
        const page = text.match(/^(\d+) Page$/) || text.match(/^(\d+)페이지$/);
        const source = text.match(/^PDF 카탈로그 (\d+)페이지 기준 제품입니다\.$/) || text.match(/^Based on page (\d+) of the PDF catalog\.$/);
        const slot = text.match(/^(Model Fit|Detail Close Up|Detail|Lookbook) (\d+)$/) || text.match(/^(모델 착용컷|확대 디테일|상세|룩북) (\d+)$/);
        const category = text.match(/^(Short Sleeve|Sleeveless|Long Sleeve|Polo Shirt|Sweatshirt|Hoodie|Pants) (\d+) Styles$/) || text.match(/^(반팔|민소매|긴팔|카라티|맨투맨|후드|바지) (\d+)종$/);
        if (products) result = language === "ko" ? `제품 ${products[1]}개` : `${products[1]} Products`;
        else if (colors) result = language === "ko" ? `${colors[1]} ${colors[2]}색상` : `${colors[1]} ${colors[2]} Colors`;
        else if (page) result = language === "ko" ? `${page[1]}페이지` : `${page[1]} Page`;
        else if (source) result = language === "ko" ? `PDF 카탈로그 ${source[1]}페이지 기준 제품입니다.` : `Based on page ${source[1]} of the PDF catalog.`;
        else if (slot) {
          const names = { "Model Fit": ["모델 착용컷", "Model Fit"], "Detail Close Up": ["확대 디테일", "Detail Close Up"], Detail: ["상세", "Detail"], Lookbook: ["룩북", "Lookbook"] };
          const pair = names[slot[1]] || Object.values(names).find(pair => pair[0] === slot[1]);
          result = `${pair[language === "ko" ? 0 : 1]} ${slot[2]}`;
        } else if (category) result = `${dictionary.get(category[1])?.[language] || category[1]} ${category[2]}${language === "ko" ? "종" : " Styles"}`;
      }
      return result === undefined ? original : original.replace(text, () => result);
    };
  }

  function readLanguage(storage) {
    try { return storage?.getItem(storageKey) === "en" ? "en" : "ko"; } catch { return "ko"; }
  }
  let language = "ko";
  try { language = readLanguage(root.localStorage); } catch { /* Korean remains the default. */ }
  const translate = createTranslator(root.products || []);
  const originals = new WeakMap();
  const attributes = new WeakMap();
  function apply(scope = root.document) {
    if (!scope || !root.document) return;
    const document = root.document;
    const walker = document.createTreeWalker(scope, 4);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('script, style, textarea, [translate="no"], [data-language-switch]')) continue;
      const previous = originals.get(node);
      const source = previous?.rendered === node.nodeValue ? previous.source : node.nodeValue;
      const rendered = translate(source, language);
      if (node.nodeValue !== rendered) node.nodeValue = rendered;
      originals.set(node, { source, rendered });
    }
    for (const element of scope.querySelectorAll("[alt], [title], [aria-label], [placeholder], [data-label]")) {
      if (element.closest('[translate="no"], [data-language-switch]')) continue;
      const saved = attributes.get(element) || {};
      for (const name of ["alt", "title", "aria-label", "placeholder", "data-label"]) {
        if (!element.hasAttribute(name)) continue;
        const current = element.getAttribute(name);
        const source = saved[name]?.rendered === current ? saved[name].source : current;
        const rendered = translate(source, language);
        if (current !== rendered) element.setAttribute(name, rendered);
        saved[name] = { source, rendered };
      }
      attributes.set(element, saved);
    }
    document.documentElement.lang = language;
    for (const button of document.querySelectorAll("[data-language]")) {
      button.setAttribute("aria-pressed", String(button.dataset.language === language));
    }
  }
  function setLanguage(value) {
    language = value === "en" ? "en" : "ko";
    try { root.localStorage.setItem(storageKey, language); } catch { /* Switching still works without storage. */ }
    apply();
  }
  function init() {
    for (const button of root.document.querySelectorAll("[data-language]")) button.addEventListener("click", () => setLanguage(button.dataset.language));
    apply();
  }
  return { init, apply, setLanguage, readLanguage, createTranslator, koreanFabric, text: value => translate(value, language), get language() { return language; } };
});
