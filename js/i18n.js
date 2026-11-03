(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TworldI18n = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  const storageKey = "tworld-language";
  const pairs = [
    ["Swipe sideways to view the full table.", "표를 좌우로 밀어 확인하세요."],
    ["e.g. 01OA1 T-shirt", "예: 01OA1 반팔 티셔츠"],
    ["Office location map", "사무실 위치 지도"],
    ["T-WORLD KOREA office building location", "티월드코리아 사무실 건물 위치 지도"],
    ["View products", "제품 보기"],
    ["HOME", "홈"], ["ABOUT", "회사 소개"], ["PRODUCTS", "제품"], ["LOOKBOOK", "룩북"], ["CONTACT", "문의"],
    ["Log in", "로그인"], ["Sign up", "회원가입"], ["My Page", "마이페이지"],
    ["Logout", "로그아웃"], ["Are you sure you want to log out?", "로그아웃하시겠습니까?"],
    ["Could not log out. Please try again.", "로그아웃을 완료하지 못했습니다. 다시 시도해주세요."],
    ["Cart", "장바구니"], ["Open cart", "장바구니 열기"], ["Close cart", "장바구니 접기"],
    ["Cart items and stock", "장바구니 품목과 재고"],
    ["Choose colors and sizes and check supplier stock", "색상과 사이즈 선택 및 본사 재고"],
    ["Checking price", "단가 확인 중"], ["Your company price / VAT excluded", "업체 적용 단가 / 부가세 별도"],
    ["Product filters", "제품 필터"],
    ["Model wearing everyday apparel", "모델이 기본 의류를 착용한 메인 이미지"],
    ["Additional model photo", "모델 착용컷 보조 이미지"],
    ["Enlarge lookbook image", "룩북 이미지 크게 보기"], ["Close image", "이미지 닫기"],
    ["Selected lookbook image", "선택한 룩북 이미지"],
    ["CATEGORY INDEX", "제품 분류"], ["PRODUCT CATEGORIES", "카테고리별 제품"],
    ["FEATURED LINEUP", "추천 라인업"], ["SELECTED PRODUCTS", "추천 제품"], ["All Products", "전체 제품 보기"],
    ["FABRIC GUIDE", "원단 안내"], ["EXPLORE OUR FABRICS", "원단별로 살펴보기"],
    ["Washed 20s 230G", "워싱 20수 230G"], ["Fleece lining", "기모 안감"],
    ["16s 250G", "16수 250G"], ["20s 230G", "20수 230G"], ["24s 180G", "24수 180G"], ["20s", "20수"],
    ["COMPANY AND FACTORY", "회사와 생산 시설"], ["OUR FACTORY AND SHOWROOM", "공장과 쇼룸"],
    ["Korea Office", "한국 지사"], ["China Office", "중국 본사"], ["Korea Showroom", "한국 쇼룸"],
    ["Warehouse at our Korean office", "한국 지사 창고 전경"],
    ["Factory in China", "중국 본사 공장 전경"],
    ["Korean showroom", "한국 쇼룸 전경"],
    ["Production Facility", "생산 시설"], ["LOOKBOOK PREVIEW", "룩북 미리보기"], ["MODEL FIT ARCHIVE", "모델 착용컷"],
    ["View Lookbook", "룩북 보기"], ["WHOLESALE CONTACT", "도매 상담"], ["Contact Us", "문의하기"],
    ["ABOUT COMPANY", "회사 안내"], ["T-SHIRTS AND EVERYDAY APPAREL", "티셔츠와 기본 의류를 공급합니다"],
    ["OUR WORK", "우리가 하는 일"], ["MADE IN CHINA, SUPPORTED IN KOREA", "중국에서 생산하고 한국에서 상담합니다"],
    ["WHOLESALE", "도매 구매"], ["BEFORE YOU ORDER", "구매 전 살펴보세요"],
    ["OUR PRODUCTS", "제품 안내"], ["PRODUCT LINEUP", "제품 라인업"], ["CATEGORY", "카테고리"],
    ["FIT AND WEIGHT", "핏과 중량"], ["All", "전체"], ["Regular Fit", "레귤러핏"], ["Relaxed Fit", "릴렉스핏"],
    ["Oversized Fit", "오버핏"], ["Loose Fit", "루즈핏"], ["Heavy Weight", "고중량"],
    ["Short Sleeve", "반팔"], ["Sleeveless", "민소매"], ["Long Sleeve", "긴팔"], ["Polo Shirt", "카라티"],
    ["Sweatshirt", "맨투맨"], ["Hoodie", "후드"], ["Pants", "바지"],
    ["BUYING GUIDE", "구매 안내"], ["MODEL NO.", "모델명"], ["View Detail", "상세 보기"],
    ["Made to order", "주문제작"], ["Minimum 100 pieces", "최소 100장"],
    ["Category", "제품 분류"], ["Fit", "핏"], ["Fabric", "소재와 혼용률"],
    ["Weight", "중량"], ["Size", "사이즈"], ["COLOR", "색상"],
    ["Order", "주문하기"], ["Check stock", "재고 확인"],
    ["PRODUCT DETAILS", "제품 상세 정보"], ["PRODUCT PHOTOS", "제품 사진"],
    ["SIZE GUIDE", "사이즈 안내"], ["MEASUREMENT", "실측 사이즈"],
    ["COLOR VARIATIONS", "색상 구성"], ["COLOR NAMES", "색상명 안내"], ["COLOR IMAGES", "색상별 이미지"],
    ["Chip", "색상표"], ["Color Code", "색상 코드"], ["DETAIL CLOSE UP", "확대 보기"], ["DETAIL IMAGES", "상세 이미지"],
    ["Korean", "한국어"], ["Chinese", "중국어"], ["English", "영어"], ["Japanese", "일본어"],
    ["RELATED PRODUCTS", "함께 볼 제품"], ["SAME CATEGORY", "같은 카테고리 제품"],
    ["Front Image", "앞면"], ["Back Image", "뒷면"],
    ["Shoulder", "어깨"], ["Chest", "가슴"], ["Sleeve", "소매"], ["Length", "총장"],
    ["Recommended height", "추천 키"], ["Recommended weight", "추천 몸무게"], ["Waist", "허리둘레"], ["Hip", "엉덩이둘레"],
    ["Thigh", "허벅지둘레"], ["Leg Opening", "밑단둘레"],
    ["Fit", "핏"], ["FABRIC", "소재"], ["STYLING", "스타일링"], ["Close", "닫기"],
    ["CONTACT US", "문의 안내"], ["MOBILE", "전화 상담"], ["BUSINESS", "회사 정보"], ["KAKAO", "카카오톡"],
    ["LOCATION", "오시는 길"], ["OFFICE MAP", "사무실 위치"], ["Open Naver Map", "네이버 지도 열기"], ["Open Kakao Map", "카카오맵 열기"],
    ["KakaoTalk inquiry", "카카오톡 문의하기"], ["Inquiry form", "문의 양식"], ["Company", "회사명"], ["Name", "성함"],
    ["Phone", "연락처"], ["Email", "이메일"], ["Product of interest", "관심 제품"], ["Message", "문의 내용"],
    ["Copy inquiry", "내용 복사하기"], ["Enter your company name", "회사명을 입력하세요"], ["Enter your name", "성함을 입력하세요"],
    ["Enter your inquiry", "문의 내용을 입력하세요"], ["Home", "홈으로 이동"], ["Open menu", "메뉴 열기"],
    ["PRODUCT NOT FOUND", "제품을 찾을 수 없습니다"], ["This product could not be found. Please choose another from the product list.", "요청하신 제품이 없습니다. 제품 목록에서 다시 선택해 주세요."],
    ["Back to products", "제품 목록으로 돌아가기"], ["T-WORLD KOREA inquiry", "T-WORLD KOREA 문의"],
    ["Could not copy your inquiry. Please copy your entries manually and send them.", "복사하지 못했습니다. 입력한 내용을 직접 복사해 보내주세요."],
    ["Inquiry copied. Paste it into KakaoTalk or an email to send it.", "문의 내용을 복사했습니다. 카카오톡이나 이메일에 붙여넣어 보내주세요."],
    ["Material", "원단"], ["Gender", "성별"], ["Unisex", "남녀공용"], ["Season", "시즌"], ["Care", "세탁"],
    ["Spring / Summer", "봄/여름"], ["Spring / Autumn / Winter", "봄/가을/겨울"], ["Spring / Summer / Winter", "봄/여름/겨울"],
    ["Wash separately with neutral detergent at or below 30°C. Do not bleach.", "30℃ 이하 중성세제 단독세탁 / 표백제 사용 금지"],
    ["Wash separately with neutral detergent at or below 30°C. Do not bleach. Dry inside out.", "30℃ 이하 중성세제 단독세탁 / 표백제 사용 금지 / 뒤집어 건조"],
    ["Vintage washed, loose fit", "워싱 빈티지 가공, 루즈핏"], ["Vintage washed long-sleeve T-shirt", "빈티지 워싱 긴팔 티셔츠"],
    ["T-WORLD KOREA Wholesale T-Shirts", "티월드코리아 티셔츠 도매 총판"], ["T-WORLD KOREA", "티월드코리아"],
    ["About | T-WORLD KOREA Wholesale T-Shirts", "회사 소개 | 티월드코리아 티셔츠 도매 총판"],
    ["Products | T-WORLD KOREA Wholesale T-Shirts", "제품 라인업 | 티월드코리아 티셔츠 도매 총판"],
    ["Product Details | T-WORLD KOREA Wholesale T-Shirts", "제품 상세 | 티월드코리아 티셔츠 도매 총판"],
    ["Lookbook | T-WORLD KOREA Wholesale T-Shirts", "룩북 | 티월드코리아 티셔츠 도매 총판"],
    ["Wholesale Inquiries | T-WORLD KOREA Wholesale T-Shirts", "도매 문의 | 티월드코리아 티셔츠 도매 총판"],
    ["© 2026 T-WORLD KOREA. All rights reserved. Designed by Wonjong Kim.", "© 2026 티월드코리아. 모든 권리 보유. 디자인: Wonjong Kim."],
    ["Choose from cotton T-shirts, washed styles and fleece-lined garments.", "면 티셔츠부터 워싱 제품, 기모 안감을 더한 옷까지 용도에 맞는 원단을 골라보세요."],
    ["Relaxed short-sleeve T-shirts in 100% cotton", "면 100% 소재의 여유 있는 반팔 티셔츠"],
    ["Short sleeves, long sleeves and sleeveless styles", "기본 반팔부터 긴팔, 민소매까지"],
    ["Everyday T-shirts for adults and children", "성인용과 아동용 기본 반팔 티셔츠"],
    ["Vintage-washed T-shirts and sleeveless tops", "빈티지 워싱을 더한 반팔과 민소매"],
    ["Sweatshirts and hoodies with brushed fleece lining", "기모 안감을 덧댄 맨투맨과 후드티"],
    ["Contact our Korean office in Guri for wholesale purchases and dispatch schedules.", "경기도 구리의 한국 지사에서 도매 구매와 출고 일정을 상담해 드립니다."],
    ["Our China factory has knitting, dyeing, cutting and sewing facilities, a warehouse and a showroom.", "중국 본사 공장에는 제직, 염색, 재단, 봉제 시설과 창고, 쇼룸이 있습니다."],
    ["Visit our showroom to see the colors and fits and feel the fabrics.", "쇼룸에서 옷의 색상과 핏을 살펴보고 원단을 직접 만져보세요."],
    ["Talk to us about products and orders", "제품과 주문에 관해 문의해 주세요"],
    ["Tell us the product and quantity you need, and we will check pricing and delivery dates.", "제품명과 필요한 수량을 알려주시면 가격과 납품 일정을 확인해 드립니다."],
    ["Wholesale T-shirts and everyday apparel. Contact us for help with products and delivery dates.", "티셔츠와 기본 의류 도매. 제품 선택부터 납품 일정까지 상담해 드립니다."],
    ["T-WORLD KOREA sells T-shirts, sweatshirts, hoodies, pants and other everyday apparel, wholesale and retail.", "티월드코리아는 티셔츠, 맨투맨, 후드티와 바지 등 기본 의류를 도매와 소매로 판매합니다."],
    ["We produce apparel at our China factory. Our Korean office handles product and delivery inquiries.", "중국 본사 공장에서 의류를 생산하고, 한국 지사에서 제품과 납품을 상담합니다."],
    ["Our China factory has knitting, dyeing, cutting and sewing facilities, along with a warehouse and showroom.", "중국 본사 공장은 제직, 염색, 재단, 봉제 시설과 창고, 쇼룸을 갖추고 있습니다."],
    ["Our Korean office includes a warehouse and showroom. See the products in person and discuss quantities and dispatch dates.", "한국 지사에는 창고와 쇼룸이 있습니다. 제품을 직접 살펴보고 구매 수량과 출고 일정을 상담해 보세요."],
    ["If you are sourcing uniforms or apparel for your brand, tell us the fabrics, fits and quantities you need.", "단체복이나 브랜드 의류로 사용할 제품을 찾으신다면 원하는 소재와 핏, 수량을 알려주세요."],
    ["Product range", "제품 라인업"], ["Fabric options", "원단 선택"], ["Size options", "사이즈 선택"], ["Color selection", "색상 확인"],
    ["Purchase inquiries", "구매 상담"], ["Choosing your products", "제품 선택 안내"],
    ["We supply essential apparel including short sleeves, sleeveless tops, long sleeves, sweatshirts, hoodies and pants.", "반팔 티셔츠부터 민소매, 긴팔, 맨투맨, 후드, 바지까지 다양한 기본 의류를 공급합니다."],
    ["Compare cotton, stretch blends, polyester and fleece by composition and fabric weight.", "면 100%부터 스판 혼방, 폴리에스터, 기모까지 제품별 소재와 중량을 비교해 보세요."],
    ["Compare the size chart with the measurements of clothes you already wear.", "평소 입는 옷의 치수와 제품별 실측표를 비교해 사이즈를 골라주세요."],
    ["Compare color charts and model photos to choose your preferred colors.", "제품별 색상표와 착용 사진을 비교해 원하는 색상을 선택해 주세요."],
    ["Contact us for blank T-shirt wholesale and apparel supply. Let us know the products and quantities you need for uniforms or your brand collection.", "무지 티셔츠 도매와 기본 의류 납품을 상담해 드립니다. 단체복이나 브랜드 의류로 사용할 제품과 필요한 수량을 알려주세요."],
    ["Need help choosing? Tell us how you plan to use the garments and the fit you prefer.", "제품 선택이 어렵다면 사용 목적과 원하는 핏을 알려주세요. 상담을 통해 함께 골라드립니다."],
    ["We produce and sell T-shirts and everyday apparel.", "티셔츠와 기본 의류를 생산하고 판매합니다."],
    ["Browse T-shirts, sleeveless tops, long sleeves, polos, sweatshirts, hoodies and pants.", "반팔, 민소매, 긴팔, 카라티, 맨투맨, 후드티와 바지를 한곳에서 살펴보세요."],
    ["Essential apparel for your needs", "용도에 맞는 기본 의류"],
    ["Looking for blank apparel for uniforms or your brand? Choose your fabric and fit, then contact us about quantities and delivery dates.", "단체복과 브랜드 의류에 사용할 무지 제품을 찾고 계신가요? 원하는 소재와 핏으로 제품을 고른 뒤 수량과 납품 일정을 문의해 주세요."],
    ["Short-sleeve T-shirts", "반팔 티셔츠"], ["Long-sleeve T-shirts", "긴팔 티셔츠"], ["Hoodies", "후드티"],
    ["Choose from classic cotton T-shirts, oversized fits, cropped styles and washed finishes.", "기본 면 티셔츠부터 오버핏, 크롭, 워싱 제품까지 준비되어 있습니다."],
    ["Choose sleeveless tops to wear on their own or as a base layer.", "단독으로 입거나 다른 옷 안에 받쳐 입을 민소매를 골라보세요."],
    ["Browse classic long sleeves, ribbed cuffs and roomy oversized fits.", "기본 긴팔부터 소매 끝을 잡아주는 시보리 제품, 여유 있는 오버핏까지 만나보세요."],
    ["Compare polo shirts made with Sorona, polyester, nylon and other fabrics.", "소로나, 폴리에스터, 나일론 등 소재별 카라티를 비교해 보세요."],
    ["Choose from classic sweatshirts, washed styles and bonded designs with brushed fleece lining.", "기본 맨투맨과 워싱 제품, 기모 안감을 더한 본딩 맨투맨이 있습니다."],
    ["Browse classic hoodies, heavyweight oversized fits and zip-up styles.", "기본 후드티부터 두툼한 오버핏, 지퍼가 달린 집업 후드까지 골라보세요."],
    ["Sweatpants and joggers to pair with T-shirts and sweatshirts.", "티셔츠나 맨투맨에 맞춰 입기 좋은 스웨트바지와 조거바지입니다."],
    ["Compare fabrics and fits to find the products you need.", "소재와 핏을 비교해 필요한 제품을 골라보세요."],
    ["Questions about a product? Contact us by phone, email or KakaoTalk.", "제품에 관해 궁금한 점은 전화나 이메일, 카카오톡으로 문의해 주세요."],
    ["Explore product fits and silhouettes through our model photos.", "제품별 착용 사진으로 핏과 실루엣을 살펴보세요."],
    ["See how it fits", "입었을 때의 핏을 살펴보세요"], ["A closer look at the fabric", "가까이서 살펴보는 원단"],
    ["Everyday outfit ideas", "일상에서 함께 입는 옷"], ["See how each product fits and where the hem falls.", "착용 사진으로 제품의 핏과 기장을 살펴보세요."],
    ["Contact us for help with products, quantities and delivery dates.", "제품 선택, 구매 수량, 납품 일정이 궁금하시면 편하게 문의해 주세요."],
    ["Please tell us the product, color, quantity and preferred delivery date.", "제품명과 색상, 필요한 수량, 납품 희망일을 알려주세요."],
    ["T-WORLD KOREA Co., Ltd.", "(주)티월드코리아"],
    ["Our Korean office handles wholesale and delivery inquiries.", "한국 지사에서 도매 구매와 납품을 상담합니다."],
    ["Send us a message on KakaoTalk.", "카카오톡 채널로 문의해 주세요."],
    ["Consultation hours: weekdays, 10:00–18:00.", "평일 10:00부터 18:00까지 상담 가능합니다."],
    ["WRITE YOUR INQUIRY", "문의 내용을 작성해 주세요"],
    ["Fill in the form, copy it, then send it through KakaoTalk or email. This page does not send your inquiry.", "아래 내용을 입력하고 복사한 뒤 카카오톡이나 이메일로 보내주세요. 이 화면에서는 문의가 전송되지 않습니다."],
    ["Contact us for product and wholesale inquiries.", "제품과 도매 구매에 관해 문의해 주세요."]
  ];

  function koreanFabric(value) {
    return String(value).replace(/DuPont Sorona|Cooling Fiber|Polyester|Spandex|Cotton|Rayon|Nylon|Sorona|Span|Outer:|Lining:/g,
      word => ({ "DuPont Sorona": "듀폰 소로나", "Cooling Fiber": "냉감 섬유", Polyester: "폴리에스터", Spandex: "스판", Cotton: "면", Rayon: "레이온", Nylon: "나일론", Sorona: "소로나", Span: "스판", "Outer:": "겉감:", "Lining:": "안감:" })[word]);
  }

  function createTranslator(products = [], extraPairs = []) {
    const dictionary = new Map();
    function add(en, ko) {
      if (!en || !ko) return;
      dictionary.set(en, { ko, en });
      if (!dictionary.has(ko)) dictionary.set(ko, { ko, en });
    }
    pairs.forEach(([en, ko]) => add(en, ko));
    dictionary.set("회사소개", { ko: "회사소개", en: "ABOUT" });
    extraPairs.forEach(([en, ko]) => add(en, ko));
    for (const product of products) {
      add(product.nameEn, product.name);
      add(`${product.nameEn} | T-WORLD KOREA`, `${product.name} | 티월드코리아`);
      add(product.fabric, koreanFabric(product.fabric));
      add(product.descriptionEn, product.description);
      for (const color of product.colors || []) {
        add(color.nameEn, color.nameKr);
        for (const ko of [`${color.nameKr} ${color.nameCn} ${color.nameEn}`, `${color.nameKr} ${color.nameCn} ${color.nameEn} ${color.nameJa || ''}`.trim(), `${color.nameKr} ${color.nameEn}`]) {
          dictionary.set(ko, {ko, en:color.nameEn});
        }
        add(`${product.nameEn} - ${color.nameEn}`, `${product.name} ${color.nameKr} 컬러 이미지`);
      }
      for (const [ko, en] of [['대표 이미지','main image'],['앞면 이미지','front view'],['뒷면 이미지','back view']]) {
        add(`${product.nameEn} - ${en}`, `${product.name} ${ko}`);
      }
    }
    return function translate(value, language = "ko") {
      const original = String(value);
      const text = original.trim();
      let result = dictionary.get(text)?.[language];
      if (result === undefined) {
        const price = text.match(/^([\d,]+)원(~)?$/);
        const cart = text.match(/^장바구니 열기 \/ ([\d,]+)장$/);
        const products = text.match(/^(\d+) Products$/) || text.match(/^제품 (\d+)개$/);
        const colors = text.match(/^(.*?)\s+(\d+) Colors$/) || text.match(/^(.*?)\s+(\d+)색상$/);
        const page = text.match(/^(\d+) Page$/) || text.match(/^(\d+)페이지$/);
        const slot = text.match(/^(Model Fit|Detail Close Up|Detail|Lookbook) (\d+)$/) || text.match(/^(모델 착용컷|확대 디테일|상세|룩북) (\d+)$/);
        const category = text.match(/^(Short Sleeve|Sleeveless|Long Sleeve|Polo Shirt|Sweatshirt|Hoodie|Pants) (\d+) Styles$/) || text.match(/^(반팔|민소매|긴팔|카라티|맨투맨|후드|바지) (\d+)종$/);
        const image = text.match(/^(.*?) (모델 착용 이미지|확대 디테일 이미지|원단 봉제 디테일) (\d+)$/);
        const lookbook = text.match(/^룩북 모델 착용컷 (\d+)$/);
        const categoryImage = text.match(/^(반팔|민소매|긴팔|카라티|맨투맨|후드|바지) 제품 대표 이미지$/);
        const limit = text.match(/^([\d.]+\s*(?:cm|kg)) (이하|이상)$/);
        if (price) result = language === "ko" ? text : `KRW ${price[1]}${price[2] ? '+' : ''}`;
        else if (cart) result = language === "ko" ? text : `Open cart / ${cart[1]} pieces`;
        else if (products) result = language === "ko" ? `제품 ${products[1]}개` : `${products[1]} Products`;
        else if (colors) result = language === "ko" ? `${colors[1]} ${colors[2]}색상` : `${colors[1]} ${colors[2]} Colors`;
        else if (page) result = language === "ko" ? `${page[1]}페이지` : `${page[1]} Page`;
        else if (image && dictionary.has(image[1])) result = language === 'ko' ? text : `${dictionary.get(image[1]).en} - ${{'모델 착용 이미지':'model photo','확대 디테일 이미지':'close-up','원단 봉제 디테일':'fabric and stitching detail'}[image[2]]} ${image[3]}`;
        else if (lookbook) result = language === 'ko' ? text : `Lookbook model photo ${lookbook[1]}`;
        else if (categoryImage) result = language === 'ko' ? text : `${dictionary.get(categoryImage[1]).en} main image`;
        else if (limit) result = language === 'ko' ? text : `${limit[1]} or ${limit[2] === '이하' ? 'less' : 'more'}`;
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
  try { const requested=new URLSearchParams(root.location?.search||'').get('lang');language=['en','ko'].includes(requested)?requested:readLanguage(root.localStorage);if(requested===language)root.localStorage?.setItem(storageKey,language); } catch { /* Korean remains the default. */ }
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
    for(const link of scope.querySelectorAll('a[href]')){
      try{const url=new URL(link.getAttribute('href'),root.location.href);if(url.origin==='https://members.tworldkorea.co.kr'&&/^\/account(?:\/|$)/.test(url.pathname)&&!url.pathname.startsWith('/account/actions/')){url.searchParams.set('lang',language);link.href=url.href;}}catch{}
    }
  }
  function setLanguage(value) {
    language = value === "en" ? "en" : "ko";
    try { root.localStorage.setItem(storageKey, language); } catch { /* Switching still works without storage. */ }
    try { const url = new URL(root.location.href); url.searchParams.set('lang', language); root.history.replaceState(root.history.state, '', url.pathname + url.search + url.hash); } catch { /* Language changes still work without history access. */ }
    apply();
    announce();
  }
  function announce(){if(typeof root.dispatchEvent==='function'&&typeof root.CustomEvent==='function')root.dispatchEvent(new root.CustomEvent('tworld:language',{detail:{language}}));}
  function init() {
    for (const button of root.document.querySelectorAll("[data-language]")) button.addEventListener("click", () => setLanguage(button.dataset.language));
    apply();
    announce();
  }
  return { init, apply, setLanguage, readLanguage, createTranslator, koreanFabric, text: value => translate(value, language), welcome: name => language==='en'?`Welcome, ${name}`:`${name}님 반갑습니다.`, get language() { return language; } };
});
