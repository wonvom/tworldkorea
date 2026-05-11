const colorLibrary = {
  white: { nameKr: "화이트", nameCn: "白色", nameEn: "White", hex: "#F7F4EE" },
  offWhite: { nameKr: "오프화이트", nameCn: "米白", nameEn: "Off White", hex: "#F1EDE3" },
  melange: { nameKr: "멜란지", nameCn: "麻灰", nameEn: "Melange", hex: "#B9B9B5" },
  deepMelange: { nameKr: "딥멜란지", nameCn: "深麻灰", nameEn: "Deep Melange", hex: "#777872" },
  black: { nameKr: "블랙", nameCn: "黑色", nameEn: "Black", hex: "#111111" },
  ivory: { nameKr: "아이보리", nameCn: "象牙白", nameEn: "Ivory", hex: "#EFE8D8" },
  beige: { nameKr: "베이지", nameCn: "米色", nameEn: "Beige", hex: "#D8C7A9" },
  lightCamel: { nameKr: "라이트카멜", nameCn: "浅驼", nameEn: "Light Camel", hex: "#CBA77F" },
  oatmeal: { nameKr: "오트밀", nameCn: "燕麦色", nameEn: "Oatmeal", hex: "#D9D0C1" },
  sand: { nameKr: "샌드", nameCn: "沙色", nameEn: "Sand", hex: "#C8B99D" },
  brown: { nameKr: "브라운", nameCn: "深棕", nameEn: "Brown", hex: "#6B5545" },
  ashTone: { nameKr: "어스톤", nameCn: "大地色", nameEn: "Earth Tone", hex: "#9E9A8E" },
  lightGreen: { nameKr: "라이트그린", nameCn: "浅绿", nameEn: "Light Green", hex: "#C9CEB4" },
  avocado: { nameKr: "아보카도", nameCn: "牛油果绿", nameEn: "Avocado", hex: "#8FDB78" },
  oliveGreen: { nameKr: "올리브그린", nameCn: "橄榄绿", nameEn: "Olive Green", hex: "#5F6753" },
  darkGreen: { nameKr: "다크그린", nameCn: "深墨绿", nameEn: "Dark Green", hex: "#154B3D" },
  forestGreen: { nameKr: "포레스트그린", nameCn: "森林绿", nameEn: "Forest Green", hex: "#146F72" },
  khaki: { nameKr: "카키", nameCn: "卡其", nameEn: "Khaki", hex: "#77745F" },
  mint: { nameKr: "민트", nameCn: "薄荷绿", nameEn: "Mint", hex: "#BFD1C5" },
  peacockBlue: { nameKr: "아쿠아", nameCn: "水鸭色", nameEn: "Aqua", hex: "#007C98" },
  emerald: { nameKr: "에메랄드", nameCn: "翠绿色", nameEn: "Emerald", hex: "#00B8A9" },
  tiffany: { nameKr: "티파니", nameCn: "蒂芬妮绿", nameEn: "Tiffany", hex: "#00C6D1" },
  aquaBlue: { nameKr: "아쿠아블루", nameCn: "水蓝", nameEn: "Aqua Blue", hex: "#79E2E8" },
  skyBlue: { nameKr: "스카이블루", nameCn: "天空蓝", nameEn: "Sky Blue", hex: "#C4DDEC" },
  navyBlue: { nameKr: "네이비블루", nameCn: "海军蓝", nameEn: "Navy Blue", hex: "#007AC2" },
  royalBlue: { nameKr: "로얄블루", nameCn: "宝蓝", nameEn: "Royal Blue", hex: "#004AA6" },
  darkNavy: { nameKr: "다크네이비", nameCn: "藏蓝", nameEn: "Dark Navy", hex: "#172A43" },
  blueGray: { nameKr: "블루그레이", nameCn: "蓝灰", nameEn: "Blue Gray", hex: "#7F929C" },
  lavender: { nameKr: "라벤더", nameCn: "薰衣草紫", nameEn: "Lavender", hex: "#C9C4E4" },
  grayPurple: { nameKr: "그레이퍼플", nameCn: "灰紫色", nameEn: "Gray Purple", hex: "#91859E" },
  violet: { nameKr: "바이올렛", nameCn: "紫罗兰", nameEn: "Violet", hex: "#584B73" },
  purple: { nameKr: "퍼플", nameCn: "紫色", nameEn: "Purple", hex: "#714ED8" },
  pink: { nameKr: "핑크", nameCn: "粉色", nameEn: "Pink", hex: "#F7A7B8" },
  hotPink: { nameKr: "로즈레드", nameCn: "玫红", nameEn: "Rose Red", hex: "#FF3E9D" },
  babyPink: { nameKr: "베이비핑크", nameCn: "浅粉", nameEn: "Baby Pink", hex: "#E8C9C8" },
  red: { nameKr: "레드", nameCn: "大红", nameEn: "Red", hex: "#E6002D" },
  mapleRed: { nameKr: "메이플레드", nameCn: "枫叶红", nameEn: "Maple Red", hex: "#6E1026" },
  anglaRed: { nameKr: "앙고라레드", nameCn: "安哥拉红", nameEn: "Angora Red", hex: "#A71925" },
  orange: { nameKr: "오렌지", nameCn: "橙色", nameEn: "Orange", hex: "#FF671E" },
  mellowOrange: { nameKr: "멜로오렌지", nameCn: "蜜瓜橙", nameEn: "Mellow Orange", hex: "#FF9E72" },
  gingerYellow: { nameKr: "진저옐로우", nameCn: "姜黄", nameEn: "Ginger Yellow", hex: "#D97E2E" },
  eggYellow: { nameKr: "에그옐로우", nameCn: "蛋黄", nameEn: "Egg Yellow", hex: "#EEB22C" },
  creamYellow: { nameKr: "크림옐로우", nameCn: "奶油黄", nameEn: "Cream Yellow", hex: "#EFE59A" },
  gray: { nameKr: "그레이", nameCn: "灰色", nameEn: "Gray", hex: "#9B9A95" },
  darkGray: { nameKr: "다크그레이", nameCn: "深灰", nameEn: "Dark Gray", hex: "#494C50" },
  charcoal: { nameKr: "차콜", nameCn: "炭灰", nameEn: "Charcoal", hex: "#3C3B37" },
  washedGray: { nameKr: "워시드그레이", nameCn: "水洗灰", nameEn: "Washed Gray", hex: "#777873" },
  washedBlue: { nameKr: "워시드블루", nameCn: "水洗蓝", nameEn: "Washed Blue", hex: "#5E7182" },
  washedKhaki: { nameKr: "워시드카키", nameCn: "水洗卡其", nameEn: "Washed Khaki", hex: "#77705F" },
  dustyPink: { nameKr: "더스티핑크", nameCn: "灰粉", nameEn: "Dusty Pink", hex: "#C98694" },
  apricot: { nameKr: "살구", nameCn: "杏色", nameEn: "Apricot", hex: "#F3B28D" }
};

const colorSets = {
  fullTee: ["white", "melange", "peacockBlue", "beige", "lightCamel", "ashTone", "lightGreen", "avocado", "tiffany", "emerald", "lavender", "grayPurple", "violet", "pink", "skyBlue", "aquaBlue", "anglaRed", "gingerYellow", "eggYellow", "hotPink", "mellowOrange", "mapleRed", "red", "orange", "purple", "navyBlue", "royalBlue", "brown", "forestGreen", "oliveGreen", "darkGreen", "deepMelange", "darkNavy", "darkGray", "black"],
  basic: ["white", "melange", "black"],
  neutral: ["white", "ivory", "melange", "gray", "charcoal", "black"],
  vintage: ["washedGray", "washedBlue", "washedKhaki", "charcoal", "black"],
  women: ["white", "babyPink", "dustyPink", "gray", "black"],
  long: ["white", "ivory", "melange", "beige", "khaki", "darkGreen", "darkNavy", "black"],
  sweat: ["oatmeal", "melange", "gray", "khaki", "darkNavy", "black"],
  hoodie: ["ivory", "brown", "khaki", "gray", "hotPink", "black"],
  pants: ["melange", "gray", "charcoal", "black"]
};

const sizeTemplates = {
  topS5: {
    sizeFields: [
      { key: "size", label: "사이즈", labelCn: "尺码表", labelEn: "Size" },
      { key: "chest", label: "가슴", labelCn: "胸围", labelEn: "Chest" },
      { key: "length", label: "총장", labelCn: "衣长", labelEn: "Length" },
      { key: "shoulder", label: "어깨", labelCn: "肩宽", labelEn: "Shoulder" },
      { key: "sleeve", label: "소매", labelCn: "袖长", labelEn: "Sleeve" },
      { key: "height", label: "추천 키", labelCn: "推荐身高", labelEn: "Height" },
      { key: "weight", label: "추천 몸무게", labelCn: "推荐体重", labelEn: "Weight" }
    ],
    sizes: [
      { size: "S", chest: "47", length: "65", shoulder: "43", sleeve: "19", height: "160-165cm", weight: "45-55kg" },
      { size: "M", chest: "50", length: "67", shoulder: "47", sleeve: "20", height: "165-170cm", weight: "55-65kg" },
      { size: "L", chest: "53", length: "70", shoulder: "50", sleeve: "21", height: "170-175cm", weight: "65-80kg" },
      { size: "XL", chest: "56", length: "73", shoulder: "53", sleeve: "22", height: "175-180cm", weight: "80-90kg" },
      { size: "2XL", chest: "59", length: "75", shoulder: "56", sleeve: "23", height: "180-185cm", weight: "90-100kg" },
      { size: "3XL", chest: "62", length: "77.5", shoulder: "59", sleeve: "24", height: "185-190cm", weight: "100-110kg" },
      { size: "4XL", chest: "65", length: "80.5", shoulder: "62", sleeve: "25", height: "190-200cm", weight: "110-120kg" },
      { size: "5XL", chest: "68", length: "83", shoulder: "65", sleeve: "26", height: "200-210cm", weight: "120-130kg" }
    ]
  },
  slimWomen: {
    sizeFields: [
      { key: "size", label: "사이즈", labelCn: "尺码", labelEn: "Size" },
      { key: "chest", label: "가슴", labelCn: "胸围", labelEn: "Chest" },
      { key: "length", label: "총장", labelCn: "衣长", labelEn: "Length" },
      { key: "shoulder", label: "어깨", labelCn: "肩宽", labelEn: "Shoulder" },
      { key: "sleeve", label: "소매", labelCn: "袖长", labelEn: "Sleeve" }
    ],
    sizes: [
      { size: "S", chest: "38", length: "52", shoulder: "34", sleeve: "15" },
      { size: "M", chest: "40", length: "54", shoulder: "36", sleeve: "16" },
      { size: "L", chest: "42", length: "56", shoulder: "38", sleeve: "17" }
    ]
  },
  pants: {
    sizeFields: [
      { key: "size", label: "사이즈", labelCn: "尺码", labelEn: "Size" },
      { key: "waist", label: "허리", labelCn: "腰围", labelEn: "Waist" },
      { key: "hip", label: "엉덩이", labelCn: "臀围", labelEn: "Hip" },
      { key: "rise", label: "밑위", labelCn: "前档", labelEn: "Rise" },
      { key: "thigh", label: "허벅지", labelCn: "大腿围", labelEn: "Thigh" },
      { key: "length", label: "총장", labelCn: "裤长", labelEn: "Length" }
    ],
    sizes: [
      { size: "M", waist: "34", hip: "52", rise: "31", thigh: "31", length: "100" },
      { size: "L", waist: "36", hip: "55", rise: "32", thigh: "32", length: "102" },
      { size: "XL", waist: "38", hip: "58", rise: "33", thigh: "33", length: "104" },
      { size: "2XL", waist: "40", hip: "61", rise: "34", thigh: "34", length: "106" }
    ]
  }
};

const catalogItems = [
  ["01OA1", "20수 230G 헤비웨이트 세미 드롭숄더 티셔츠", "重磅微落肩版T恤", "20s 230G Heavyweight Semi Drop Shoulder T-Shirt", "Short Sleeve", "Relaxed Fit", "Cotton 100%", "230G", "topS5", "fullTee", 3, ["Heavy Weight", "Tubular"]],
  ["7001", "24수 180G 코마 면 티셔츠", "24支180G精梳棉T恤", "24s 180G Combed Cotton T-Shirt", "Short Sleeve", "Regular Fit", "Cotton 100%", "180G", "topS5", "neutral", 4, []],
  ["03XA5", "16수 250G 세미 와이드 트렌디 티셔츠", "16支250G半宽松潮流T恤", "16s 250G Semi Wide Trend T-Shirt", "Short Sleeve", "Relaxed Fit", "Cotton 100%", "250G", "topS5", "neutral", 5, ["Heavy Weight"]],
  ["T210", "210G 실크 코튼 반팔 티셔츠", "210G丝光棉短袖T恤", "210G Silket Cotton T-Shirt", "Short Sleeve", "Regular Fit", "Silket Cotton 100%", "210G", "topS5", "fullTee", 6, []],
  ["O3000", "13수 300G 순면 오버사이즈 루즈핏 티셔츠", "13支300G纯棉宽松T恤", "13s 300G Cotton Oversized T-Shirt", "Short Sleeve", "Oversized Fit", "Cotton 100%", "300G", "topS5", "neutral", 7, ["Heavy Weight"]],
  ["23012", "20수 230G 빈티지 워싱 티셔츠", "20支230G复古水洗T恤", "20s 230G Vintage Washed T-Shirt", "Short Sleeve", "Relaxed Fit", "Cotton 100%", "230G", "topS5", "vintage", 8, []],
  ["27012", "16수 270G 빈티지 워싱 티셔츠", "16支270G复古水洗T恤", "16s 270G Vintage Washed T-Shirt", "Short Sleeve", "Relaxed Fit", "Cotton 100%", "270G", "topS5", "vintage", 9, ["Heavy Weight"]],
  ["S2000", "210G 순면 여성 크롭 티셔츠", "210G纯棉女款短版T恤", "210G Cotton Women's Crop T-Shirt", "Short Sleeve", "Regular Fit", "Cotton 100%", "210G", "slimWomen", "women", 10, []],
  ["08VS30", "20수 230G 순면 민소매 나시", "20支230G纯棉背心", "20s 230G Cotton Sleeveless", "Sleeveless", "Regular Fit", "Cotton 100%", "230G", "slimWomen", "basic", 11, []],
  ["2403", "240G 여성 워싱 나시", "240G女款水洗背心", "240G Women's Washed Sleeveless", "Sleeveless", "Regular Fit", "Cotton 95% Span 5%", "240G", "slimWomen", "women", 12, []],
  ["2406", "200G 여성 크롭 티셔츠", "200G女款短版T恤", "200G Women's Crop T-Shirt", "Short Sleeve", "Regular Fit", "Cotton 95% Span 5%", "200G", "slimWomen", "women", 13, []],
  ["2405", "240G 여성 워싱 티셔츠", "240G女款水洗T恤", "240G Women's Washed T-Shirt", "Short Sleeve", "Regular Fit", "Cotton 95% Span 5%", "240G", "slimWomen", "women", 14, []],
  ["2408", "200G 여성 슬림핏 티셔츠", "200G女款修身T恤", "200G Women's Slim Fit T-Shirt", "Short Sleeve", "Regular Fit", "Cotton 95% Span 5%", "200G", "slimWomen", "women", 15, []],
  ["3053", "60수 250G 반팔 티셔츠", "60支250G短袖T恤", "60s 250G T-Shirt", "Short Sleeve", "Regular Fit", "Cotton 63% Polyester 29% Span 8%", "250G", "topS5", "neutral", 16, []],
  ["7001-KIDS", "24수 180G 코마 면 키즈 티셔츠", "24支180G儿童精梳棉T恤", "24s 180G Kids Combed Cotton T-Shirt", "Short Sleeve", "Regular Fit", "Cotton 100%", "180G", "topS5", "fullTee", 17, []],
  ["T160", "190G 코튼 터치 반팔 티셔츠", "190G棉感短袖T恤", "190G Cotton Touch T-Shirt", "Short Sleeve", "Regular Fit", "Cotton Blend", "190G", "topS5", "basic", 18, []],
  ["Q2000", "21수 200G 산뜻한 컬러 티셔츠", "21支200G清爽色彩T恤", "21s 200G Fresh Color T-Shirt", "Short Sleeve", "Regular Fit", "Cotton 100%", "200G", "topS5", "fullTee", 19, []],
  ["HP004", "220G 베이직 나시", "220G基础背心", "220G Basic Sleeveless", "Sleeveless", "Regular Fit", "Cotton 95% Span 5%", "220G", "slimWomen", "women", 20, []],
  ["7001-LS", "24수 180G 코마 면 긴팔 티셔츠", "24支180G精梳棉长袖T恤", "24s 180G Combed Cotton Long Sleeve", "Long Sleeve", "Regular Fit", "Cotton 100%", "180G", "topS5", "basic", 21, []],
  ["QXK2521", "21수 230G 순면 긴팔 티셔츠", "21支230G纯棉长袖T恤", "21s 230G Cotton Long Sleeve", "Long Sleeve", "Relaxed Fit", "Cotton 100%", "230G", "topS5", "fullTee", 22, []],
  ["06OLK", "21수 230G 립 소매 긴팔 티셔츠", "21支230G罗纹袖长袖T恤", "21s 230G Rib Cuff Long Sleeve", "Long Sleeve", "Relaxed Fit", "Cotton 100%", "230G", "topS5", "long", 23, []],
  ["Q2450", "16수 260G 어깨라인 루즈핏 순면 긴팔 티셔츠", "16支260G肩线宽松纯棉长袖", "16s 260G Shoulder Line Relaxed Cotton Long Sleeve", "Long Sleeve", "Oversized Fit", "Cotton 100%", "260G", "topS5", "long", 24, ["Heavy Weight"]],
  ["0E2700", "270G 순면 크루넥 맨투맨", "270G纯棉圆领卫衣", "270G Cotton Crewneck Sweatshirt", "Sweatshirt", "Relaxed Fit", "Cotton 100%", "270G", "topS5", "sweat", 25, ["Heavy Weight"]],
  ["YL2800", "280G 맨투맨", "280G卫衣", "280G Sweatshirt", "Sweatshirt", "Regular Fit", "Cotton 90% Span 10%", "280G", "topS5", "sweat", 26, []],
  ["YL3200", "320G 맨투맨", "320G卫衣", "320G Sweatshirt", "Sweatshirt", "Relaxed Fit", "Cotton 87% Span 13%", "320G", "topS5", "fullTee", 27, ["Heavy Weight"]],
  ["LM2800", "280G 맨투맨", "280G卫衣", "280G Sweatshirt", "Sweatshirt", "Regular Fit", "Cotton 90% Span 10%", "280G", "topS5", "sweat", 28, []],
  ["LM3200", "320G 맨투맨", "320G卫衣", "320G Sweatshirt", "Sweatshirt", "Relaxed Fit", "Cotton 87% Span 13%", "320G", "topS5", "fullTee", 29, ["Heavy Weight"]],
  ["QXX5200", "480G 후드티", "480G连帽卫衣", "480G Hoodie", "Hoodie", "Oversized Fit", "Cotton 87% Span 13%", "480G", "topS5", "hoodie", 30, ["Heavy Weight"]],
  ["A23014", "230G 워싱 긴팔 티셔츠", "230G水洗长袖T恤", "230G Washed Long Sleeve", "Sweatshirt", "Regular Fit", "Cotton 100%", "230G", "topS5", "vintage", 31, []],
  ["3505", "350G 워싱 맨투맨", "350G水洗卫衣", "350G Washed Sweatshirt", "Sweatshirt", "Relaxed Fit", "Cotton 100%", "350G", "topS5", "hoodie", 32, ["Heavy Weight"]],
  ["3508", "350G 워싱 후드티", "350G水洗连帽卫衣", "350G Washed Hoodie", "Hoodie", "Relaxed Fit", "Cotton 100%", "350G", "topS5", "hoodie", 33, ["Heavy Weight"]],
  ["CK280", "280G 스웨트팬츠", "280G卫裤", "280G Sweatpants", "Pants", "Regular Fit", "Cotton 65% Polyester 35%", "280G", "pants", "pants", 34, []],
  ["LK3401", "340G 기모 조거팬츠", "340G加绒束脚裤", "340G Fleece Jogger Pants", "Pants", "Relaxed Fit", "Cotton 85% Polyester 15%", "340G", "pants", "pants", 35, ["Heavy Weight"]]
];

function slugifyCode(code) {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getImageSlots(slug, code, name) {
  const base = `images/products/${slug}`;
  return {
    main: `${base}/${slug}-front.jpg`,
    front: `${base}/${slug}-front.jpg`,
    back: `${base}/${slug}-back.jpg`,
    model: [`${base}/${slug}-model-01.jpg`, `${base}/${slug}-model-02.jpg`],
    detail: [`${base}/${slug}-detail-01.jpg`, `${base}/${slug}-detail-02.jpg`],
    fabric: [`${base}/${slug}-fabric-01.jpg`],
    colorChart: `${base}/${slug}-color-chart.jpg`,
    guide: `${code} ${name} 이미지는 ${base}/ 폴더에 앞면, 뒷면, 모델컷, 확대컷, 재질컷, 컬러별 이미지로 넣어주세요.`
  };
}

const productImageOverrides = {
  "01oa1": {
    thumbnail: "images/products/01OA1/01OA1_white_01.jpg",
    images: [
      "images/products/01OA1/01OA1_white_01.jpg",
      "images/products/01OA1/01OA1_image_01.png"
    ],
    imageSlots: {
      main: "images/products/01OA1/01OA1_white_01.jpg",
      front: "images/products/01OA1/01OA1_white_01.jpg",
      back: "images/products/01OA1/01OA1_image_01.png",
      model: ["images/products/01OA1/01OA1_image_01.png"],
      detail: ["images/products/01OA1/01OA1_white_01.jpg"],
      fabric: [],
      colorChart: "images/products/01OA1/01OA1_white_01.jpg"
    }
  },
  "t210": {
    thumbnail: "images/products/T210/T210_white_01.jpg",
    images: ["images/products/T210/T210_white_01.jpg"],
    imageSlots: {
      main: "images/products/T210/T210_white_01.jpg",
      front: "images/products/T210/T210_white_01.jpg",
      back: "images/products/T210/T210_white_01.jpg",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/T210/T210_white_01.jpg"
    }
  },
  "03xa5": {
    thumbnail: "images/products/03XA5/03XA5_white_01.jpg",
    images: ["images/products/03XA5/03XA5_white_01.jpg"],
    imageSlots: {
      main: "images/products/03XA5/03XA5_white_01.jpg",
      front: "images/products/03XA5/03XA5_white_01.jpg",
      back: "images/products/03XA5/03XA5_white_01.jpg",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/03XA5/03XA5_white_01.jpg"
    }
  },
  "o3000": {
    thumbnail: "images/products/O3000/O3000_white_01.jpg",
    images: ["images/products/O3000/O3000_white_01.jpg"],
    imageSlots: {
      main: "images/products/O3000/O3000_white_01.jpg",
      front: "images/products/O3000/O3000_white_01.jpg",
      back: "images/products/O3000/O3000_white_01.jpg",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/O3000/O3000_white_01.jpg"
    }
  },
  "7001": {
    thumbnail: "images/products/7001/7001_white_01.jpg",
    images: ["images/products/7001/7001_white_01.jpg"],
    imageSlots: {
      main: "images/products/7001/7001_white_01.jpg",
      front: "images/products/7001/7001_white_01.jpg",
      back: "images/products/7001/7001_white_01.jpg",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/7001/7001_white_01.jpg"
    }
  },
  "23012": {
    thumbnail: "images/products/23012/23012_white_01.jpg",
    images: ["images/products/23012/23012_white_01.jpg"],
    imageSlots: {
      main: "images/products/23012/23012_white_01.jpg",
      front: "images/products/23012/23012_white_01.jpg",
      back: "images/products/23012/23012_white_01.jpg",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/23012/23012_white_01.jpg"
    }
  },
  "08vs30": {
    thumbnail: "images/products/08VS30/08VS30_image_01.jpg",
    images: [
      "images/products/08VS30/08VS30_image_01.jpg",
      "images/products/08VS30/08VS30_white_01.jpg"
    ],
    imageSlots: {
      main: "images/products/08VS30/08VS30_image_01.jpg",
      front: "images/products/08VS30/08VS30_image_01.jpg",
      back: "images/products/08VS30/08VS30_white_01.jpg",
      model: [],
      detail: ["images/products/08VS30/08VS30_white_01.jpg"],
      fabric: [],
      colorChart: "images/products/08VS30/08VS30_white_01.jpg"
    }
  },
  "06olk": {
    thumbnail: "images/products/06OLK/06OLK_image_02.jpg",
    images: [
      "images/products/06OLK/06OLK_image_02.jpg",
      "images/products/06OLK/06OLK_image_01.jpg",
      "images/products/06OLK/06OLK_white_01.jpg"
    ],
    imageSlots: {
      main: "images/products/06OLK/06OLK_image_02.jpg",
      front: "images/products/06OLK/06OLK_image_02.jpg",
      back: "images/products/06OLK/06OLK_image_01.jpg",
      model: [],
      detail: ["images/products/06OLK/06OLK_white_01.jpg"],
      fabric: [],
      colorChart: "images/products/06OLK/06OLK_white_01.jpg"
    }
  },
  "0e2700": {
    thumbnail: "images/products/OE2700/OE2700_image_01.png",
    images: ["images/products/OE2700/OE2700_image_01.png"],
    imageSlots: {
      main: "images/products/OE2700/OE2700_image_01.png",
      front: "images/products/OE2700/OE2700_image_01.png",
      back: "images/products/OE2700/OE2700_image_01.png",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/OE2700/OE2700_image_01.png"
    }
  },
  "qxx5200": {
    thumbnail: "images/products/QXX5200/QXX5200_image_01.png",
    images: ["images/products/QXX5200/QXX5200_image_01.png"],
    imageSlots: {
      main: "images/products/QXX5200/QXX5200_image_01.png",
      front: "images/products/QXX5200/QXX5200_image_01.png",
      back: "images/products/QXX5200/QXX5200_image_01.png",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/QXX5200/QXX5200_image_01.png"
    }
  },
  "lk3401": {
    thumbnail: "images/products/LK3401/LK3401_image_01.png",
    images: ["images/products/LK3401/LK3401_image_01.png"],
    imageSlots: {
      main: "images/products/LK3401/LK3401_image_01.png",
      front: "images/products/LK3401/LK3401_image_01.png",
      back: "images/products/LK3401/LK3401_image_01.png",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/LK3401/LK3401_image_01.png"
    }
  }
};

const products = catalogItems.map(([code, name, nameCn, nameEn, category, fit, fabric, weight, sizeKey, colorSetKey, pdfPage, tags]) => {
  const id = slugifyCode(code);
  const slots = getImageSlots(id, code, name);
  const override = productImageOverrides[id];
  const imageSlots = override ? { ...slots, ...override.imageSlots } : slots;
  const colors = colorSets[colorSetKey].map((key) => ({
    key,
    ...colorLibrary[key],
    image: `images/products/${id}/colors/${id}-${key}.jpg`
  }));

  return {
    id,
    code,
    name,
    nameCn,
    nameEn,
    category,
    fit,
    fabric,
    weight,
    tags,
    pdfPage,
    description: `${code} 제품은 PDF 카탈로그 기준으로 모델 착용컷, 제품 앞면과 뒷면, 확대 디테일, 원단 재질컷, 색상표를 함께 보여주는 상세 페이지 구성이 적합합니다.`,
    thumbnail: override?.thumbnail || slots.main,
    images: override?.images || [slots.front, slots.back, ...slots.model, ...slots.detail, ...slots.fabric],
    imageSlots,
    colors,
    sizeFields: sizeTemplates[sizeKey].sizeFields,
    sizes: sizeTemplates[sizeKey].sizes,
    details: [
      { title: "Catalog Source", text: `PDF 카탈로그 ${pdfPage}페이지 기준 제품입니다.` },
      { title: "Image Plan", text: "앞면, 뒷면, 상세 확대, 원단 재질, 모델 착용컷을 분리해서 등록하는 구조입니다." },
      { title: "Color Language", text: "색상명은 한국어, 중국어, 영어를 함께 노출하도록 구성했습니다." }
    ]
  };
});

window.products = products;
window.catalogSummary = {
  companyName: "(주)티월드코리아",
  tel: "010-3585-4450",
  address: "경기도 구리시 갈매순환로166번길 46, 금강펜테리움 IX센터 8층 08-081호",
  sourcePdf: "티월드코리아 카탈로그 26.05.07",
  categories: [
    { name: "Short Sleeve", count: products.filter((product) => product.category === "Short Sleeve").length },
    { name: "Sleeveless", count: products.filter((product) => product.category === "Sleeveless").length },
    { name: "Long Sleeve", count: products.filter((product) => product.category === "Long Sleeve").length },
    { name: "Sweatshirt", count: products.filter((product) => product.category === "Sweatshirt").length },
    { name: "Hoodie", count: products.filter((product) => product.category === "Hoodie").length },
    { name: "Pants", count: products.filter((product) => product.category === "Pants").length }
  ]
};
