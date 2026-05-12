const colorLibrary = {
  white: { nameKr: "화이트", nameCn: "白色", nameEn: "White", hex: "#F7F4EE" },
  iceWhite: { nameKr: "아이스 화이트", nameCn: "雅典白", nameEn: "Ice White", hex: "#F8F8F4" },
  bechaBeige: { nameKr: "백차 베이지", nameCn: "白茶色", nameEn: "Becha Beige", hex: "#D7C2B4" },
  camelBrown: { nameKr: "카멜 브라운", nameCn: "鹿角棕", nameEn: "Camel Brown", hex: "#A8794F" },
  oilGreen: { nameKr: "유채 그린", nameCn: "油菜绿", nameEn: "Oil Green", hex: "#81D927" },
  bambooGreen: { nameKr: "대나무 그린", nameCn: "青竹绿", nameEn: "Bamboo Green", hex: "#008B74" },
  blossomPink: { nameKr: "벚꽃 핑크", nameCn: "樱花粉", nameEn: "Blossom Pink", hex: "#F47A9C" },
  vividRed: { nameKr: "선명한 레드", nameCn: "报春红", nameEn: "Vivid Red", hex: "#F00321" },
  navy: { nameKr: "네이비", nameCn: "藏青色", nameEn: "Navy", hex: "#172B48" },
  grayGreen: { nameKr: "그레이 그린", nameCn: "灰绿色", nameEn: "Gray Green", hex: "#B7C1B7" },
  classicBlack: { nameKr: "클래식 블랙", nameCn: "经典黑", nameEn: "Classic Black", hex: "#111111" },
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
  t210: ["iceWhite", "bechaBeige", "camelBrown", "oilGreen", "bambooGreen", "blossomPink", "vividRed", "navy", "grayGreen", "darkGray", "classicBlack"],
  basic: ["white", "melange", "black"],
  neutral: ["white", "ivory", "melange", "gray", "charcoal", "black"],
  vintage: ["washedGray", "washedBlue", "washedKhaki", "charcoal", "black"],
  women: ["white", "babyPink", "dustyPink", "gray", "black"],
  long: ["white", "ivory", "melange", "beige", "khaki", "darkGreen", "darkNavy", "black"],
  sweat: ["oatmeal", "melange", "gray", "khaki", "darkNavy", "black"],
  hoodie: ["ivory", "brown", "khaki", "gray", "hotPink", "black"],
  pants: ["melange", "gray", "charcoal", "black"]
};

const productColorData = {
  "01OA1": [
    {
      "code": "01OA1-01",
      "key": "01oa1-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F3F4F6",
      "rgb": "243, 244, 246",
      "pantone": "Cool Gray 1 C"
    },
    {
      "code": "01OA1-02",
      "key": "01oa1-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#1C1E22",
      "rgb": "28, 30, 34",
      "pantone": "Black 7 C"
    },
    {
      "code": "01OA1-03",
      "key": "01oa1-03",
      "nameKr": "라이트 그린",
      "nameCn": "浅绿",
      "nameEn": "Light Green",
      "hex": "#DDE4D4",
      "rgb": "221, 228, 212",
      "pantone": "621 C"
    },
    {
      "code": "01OA1-04",
      "key": "01oa1-04",
      "nameKr": "베이지",
      "nameCn": "米色",
      "nameEn": "Beige",
      "hex": "#E7D8C2",
      "rgb": "231, 216, 194",
      "pantone": "7506 C"
    },
    {
      "code": "01OA1-05",
      "key": "01oa1-05",
      "nameKr": "멜란지",
      "nameCn": "麻灰",
      "nameEn": "Melange",
      "hex": "#D9D9D2",
      "rgb": "217, 217, 210",
      "pantone": "Cool Gray 2 C"
    },
    {
      "code": "01OA1-06",
      "key": "01oa1-06",
      "nameKr": "핑크",
      "nameCn": "粉色",
      "nameEn": "Pink",
      "hex": "#EFC7CF",
      "rgb": "239, 199, 207",
      "pantone": "705 C"
    },
    {
      "code": "01OA1-07",
      "key": "01oa1-07",
      "nameKr": "라벤더",
      "nameCn": "薰衣草紫",
      "nameEn": "Lavender",
      "hex": "#D5D0E6",
      "rgb": "213, 208, 230",
      "pantone": "2635 C"
    },
    {
      "code": "01OA1-08",
      "key": "01oa1-08",
      "nameKr": "스카이 블루",
      "nameCn": "天空蓝",
      "nameEn": "Sky Blue",
      "hex": "#BFD7EC",
      "rgb": "191, 215, 236",
      "pantone": "290 C"
    },
    {
      "code": "01OA1-09",
      "key": "01oa1-09",
      "nameKr": "멜론 오렌지",
      "nameCn": "蜜瓜橙",
      "nameEn": "Melon Orange",
      "hex": "#F2B3A4",
      "rgb": "242, 179, 164",
      "pantone": "1625 C"
    },
    {
      "code": "01OA1-10",
      "key": "01oa1-10",
      "nameKr": "어스 톤",
      "nameCn": "大地色",
      "nameEn": "Earth Tone",
      "hex": "#C7C5B8",
      "rgb": "199, 197, 184",
      "pantone": "7527 C"
    },
    {
      "code": "01OA1-11",
      "key": "01oa1-11",
      "nameKr": "아쿠아 블루",
      "nameCn": "水蓝",
      "nameEn": "Aqua Blue",
      "hex": "#7ED7EC",
      "rgb": "126, 215, 236",
      "pantone": "304 C"
    },
    {
      "code": "01OA1-12",
      "key": "01oa1-12",
      "nameKr": "라이트 카멜",
      "nameCn": "浅驼",
      "nameEn": "Light Camel",
      "hex": "#D7BE9A",
      "rgb": "215, 190, 154",
      "pantone": "468 C"
    },
    {
      "code": "01OA1-13",
      "key": "01oa1-13",
      "nameKr": "아보카도 그린",
      "nameCn": "牛油果绿",
      "nameEn": "Avocado Green",
      "hex": "#99DC7A",
      "rgb": "153, 220, 122",
      "pantone": "7488 C"
    },
    {
      "code": "01OA1-14",
      "key": "01oa1-14",
      "nameKr": "에그 옐로우",
      "nameCn": "蛋黄",
      "nameEn": "Egg Yellow",
      "hex": "#F0B13A",
      "rgb": "240, 177, 58",
      "pantone": "136 C"
    },
    {
      "code": "01OA1-15",
      "key": "01oa1-15",
      "nameKr": "그레이 퍼플",
      "nameCn": "灰紫色",
      "nameEn": "Gray Purple",
      "hex": "#B7ADBE",
      "rgb": "183, 173, 190",
      "pantone": "5295 C 부근"
    },
    {
      "code": "01OA1-16",
      "key": "01oa1-16",
      "nameKr": "티파니 그린",
      "nameCn": "蒂芬妮绿",
      "nameEn": "Tiffany",
      "hex": "#17C5D6",
      "rgb": "23, 197, 214",
      "pantone": "3252 C"
    },
    {
      "code": "01OA1-17",
      "key": "01oa1-17",
      "nameKr": "오렌지",
      "nameCn": "橙色",
      "nameEn": "Orange",
      "hex": "#F47A24",
      "rgb": "244, 122, 36",
      "pantone": "1585 C"
    },
    {
      "code": "01OA1-18",
      "key": "01oa1-18",
      "nameKr": "로즈 핑크",
      "nameCn": "玫红",
      "nameEn": "Rose Pink",
      "hex": "#E85A9A",
      "rgb": "232, 90, 154",
      "pantone": "213 C"
    },
    {
      "code": "01OA1-19",
      "key": "01oa1-19",
      "nameKr": "진저 옐로우",
      "nameCn": "姜黄",
      "nameEn": "Ginger Yellow",
      "hex": "#C97A3A",
      "rgb": "201, 122, 58",
      "pantone": "7572 C"
    },
    {
      "code": "01OA1-20",
      "key": "01oa1-20",
      "nameKr": "에메랄드 그린",
      "nameCn": "翠绿色",
      "nameEn": "Emerald Green",
      "hex": "#00A7A7",
      "rgb": "0, 167, 167",
      "pantone": "321 C"
    },
    {
      "code": "01OA1-21",
      "key": "01oa1-21",
      "nameKr": "딥 멜란지",
      "nameCn": "深麻灰",
      "nameEn": "Deep Melange",
      "hex": "#8A8A75",
      "rgb": "138, 138, 117",
      "pantone": "416 C 부근"
    },
    {
      "code": "01OA1-22",
      "key": "01oa1-22",
      "nameKr": "레드",
      "nameCn": "大红",
      "nameEn": "Red",
      "hex": "#D90D3C",
      "rgb": "217, 13, 60",
      "pantone": "192 C"
    },
    {
      "code": "01OA1-23",
      "key": "01oa1-23",
      "nameKr": "퍼플",
      "nameCn": "紫色",
      "nameEn": "Purple",
      "hex": "#7A59D4",
      "rgb": "122, 89, 212",
      "pantone": "2665 C"
    },
    {
      "code": "01OA1-24",
      "key": "01oa1-24",
      "nameKr": "아쿠아",
      "nameCn": "水碧色",
      "nameEn": "Aqua",
      "hex": "#0F7AB0",
      "rgb": "15, 122, 176",
      "pantone": "7701 C"
    },
    {
      "code": "01OA1-25",
      "key": "01oa1-25",
      "nameKr": "포레스트 그린",
      "nameCn": "森林绿",
      "nameEn": "Forest Green",
      "hex": "#0A6C7C",
      "rgb": "10, 108, 124",
      "pantone": "7716 C"
    },
    {
      "code": "01OA1-26",
      "key": "01oa1-26",
      "nameKr": "다크 그레이",
      "nameCn": "深灰",
      "nameEn": "Dark Gray",
      "hex": "#585D67",
      "rgb": "88, 93, 103",
      "pantone": "431 C"
    },
    {
      "code": "01OA1-27",
      "key": "01oa1-27",
      "nameKr": "네이비 블루",
      "nameCn": "海军蓝",
      "nameEn": "Navy Blue",
      "hex": "#0D5EA8",
      "rgb": "13, 94, 168",
      "pantone": "285 C"
    },
    {
      "code": "01OA1-28",
      "key": "01oa1-28",
      "nameKr": "올리브 그린",
      "nameCn": "橄榄绿",
      "nameEn": "Olive Green",
      "hex": "#5A5F4F",
      "rgb": "90, 95, 79",
      "pantone": "446 C"
    },
    {
      "code": "01OA1-29",
      "key": "01oa1-29",
      "nameKr": "브라운",
      "nameCn": "深棕",
      "nameEn": "Brown",
      "hex": "#6E4D3C",
      "rgb": "110, 77, 60",
      "pantone": "7596 C"
    },
    {
      "code": "01OA1-30",
      "key": "01oa1-30",
      "nameKr": "로열 블루",
      "nameCn": "宝蓝",
      "nameEn": "Royal Blue",
      "hex": "#0047BB",
      "rgb": "0, 71, 187",
      "pantone": "2728 C"
    },
    {
      "code": "01OA1-31",
      "key": "01oa1-31",
      "nameKr": "바이올렛",
      "nameCn": "紫罗兰",
      "nameEn": "Violet",
      "hex": "#5A3791",
      "rgb": "90, 55, 145",
      "pantone": "268 C"
    },
    {
      "code": "01OA1-32",
      "key": "01oa1-32",
      "nameKr": "앙골라 레드",
      "nameCn": "安哥拉红",
      "nameEn": "Angola Red",
      "hex": "#8B1E2A",
      "rgb": "139, 30, 42",
      "pantone": "490 C"
    },
    {
      "code": "01OA1-33",
      "key": "01oa1-33",
      "nameKr": "다크 네이비",
      "nameCn": "藏蓝",
      "nameEn": "Dark Navy",
      "hex": "#123B74",
      "rgb": "18, 59, 116",
      "pantone": "540 C 부근"
    },
    {
      "code": "01OA1-34",
      "key": "01oa1-34",
      "nameKr": "다크 그린",
      "nameCn": "深墨绿",
      "nameEn": "Dark Green",
      "hex": "#33412A",
      "rgb": "51, 65, 42",
      "pantone": "5743 C"
    },
    {
      "code": "01OA1-35",
      "key": "01oa1-35",
      "nameKr": "메이플 레드",
      "nameCn": "枫叶红",
      "nameEn": "Maple Red",
      "hex": "#5A0F1B",
      "rgb": "90, 15, 27",
      "pantone": "209 C"
    }
  ],
  "7001": [
    {
      "code": "7001-01",
      "key": "7001-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#E9E8ED",
      "rgb": "233, 232, 237",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "7001-02",
      "key": "7001-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#1E1F23",
      "rgb": "30, 31, 35",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "7001-03",
      "key": "7001-03",
      "nameKr": "베이지",
      "nameCn": "米色",
      "nameEn": "Beige",
      "hex": "#E2D4C3",
      "rgb": "226, 212, 195",
      "pantone": "7506 C 부근"
    },
    {
      "code": "7001-04",
      "key": "7001-04",
      "nameKr": "핑크",
      "nameCn": "粉色",
      "nameEn": "Pink",
      "hex": "#EAC6CB",
      "rgb": "234, 198, 203",
      "pantone": "705 C 부근"
    },
    {
      "code": "7001-05",
      "key": "7001-05",
      "nameKr": "카키",
      "nameCn": "卡其",
      "nameEn": "Khaki",
      "hex": "#A09969",
      "rgb": "160, 153, 105",
      "pantone": "4525 C 부근"
    },
    {
      "code": "7001-06",
      "key": "7001-06",
      "nameKr": "레드",
      "nameCn": "大红",
      "nameEn": "Red",
      "hex": "#D02C3D",
      "rgb": "208, 44, 61",
      "pantone": "1795 C 부근"
    },
    {
      "code": "7001-07",
      "key": "7001-07",
      "nameKr": "멜란지",
      "nameCn": "麻灰",
      "nameEn": "Melange",
      "hex": "#767568",
      "rgb": "118, 117, 104",
      "pantone": "416 C 부근"
    },
    {
      "code": "7001-08",
      "key": "7001-08",
      "nameKr": "다크 그레이",
      "nameCn": "深灰",
      "nameEn": "Dark Gray",
      "hex": "#505054",
      "rgb": "80, 80, 84",
      "pantone": "Cool Gray 11 C 부근"
    },
    {
      "code": "7001-09",
      "key": "7001-09",
      "nameKr": "밀리터리 그린",
      "nameCn": "军绿",
      "nameEn": "Military Green",
      "hex": "#3C4032",
      "rgb": "60, 64, 50",
      "pantone": "5605 C 부근"
    },
    {
      "code": "7001-10",
      "key": "7001-10",
      "nameKr": "버건디",
      "nameCn": "酒红",
      "nameEn": "Burgundy",
      "hex": "#661009",
      "rgb": "102, 16, 9",
      "pantone": "7624 C 부근"
    },
    {
      "code": "7001-11",
      "key": "7001-11",
      "nameKr": "퍼플",
      "nameCn": "紫色",
      "nameEn": "Purple",
      "hex": "#442747",
      "rgb": "68, 39, 71",
      "pantone": "262 C 부근"
    },
    {
      "code": "7001-12",
      "key": "7001-12",
      "nameKr": "브라운",
      "nameCn": "褐色",
      "nameEn": "Brown",
      "hex": "#3F2A23",
      "rgb": "63, 42, 35",
      "pantone": "4975 C 부근"
    },
    {
      "code": "7001-13",
      "key": "7001-13",
      "nameKr": "네이비",
      "nameCn": "藏蓝",
      "nameEn": "Navy",
      "hex": "#132947",
      "rgb": "19, 41, 71",
      "pantone": "533 C 부근"
    }
  ],
  "03XA5": [
    {
      "code": "03XA5-01",
      "key": "03xa5-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#EDEEEF",
      "rgb": "237, 238, 239",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "03XA5-02",
      "key": "03xa5-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#171A20",
      "rgb": "23, 26, 32",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "03XA5-03",
      "key": "03xa5-03",
      "nameKr": "샌드 그레이",
      "nameCn": "沙色",
      "nameEn": "Sand Gray",
      "hex": "#BDBDBB",
      "rgb": "189, 189, 187",
      "pantone": "Cool Gray 4 C 부근"
    },
    {
      "code": "03XA5-04",
      "key": "03xa5-04",
      "nameKr": "그래스 그린",
      "nameCn": "草绿色",
      "nameEn": "Grass Green",
      "hex": "#5F685A",
      "rgb": "95, 104, 90",
      "pantone": "5615 C 부근"
    },
    {
      "code": "03XA5-05",
      "key": "03xa5-05",
      "nameKr": "다크 그레이",
      "nameCn": "深灰",
      "nameEn": "Dark Gray",
      "hex": "#3C4142",
      "rgb": "60, 65, 66",
      "pantone": "432 C 부근"
    }
  ],
  "T210": [
    {
      "code": "T210-01",
      "key": "t210-01",
      "nameKr": "아테네 화이트",
      "nameCn": "雅典白",
      "nameEn": "Athens White",
      "hex": "#E8E9E6",
      "rgb": "232, 233, 230",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "T210-02",
      "key": "t210-02",
      "nameKr": "클래식 블랙",
      "nameCn": "经典黑",
      "nameEn": "Classic Black",
      "hex": "#171816",
      "rgb": "23, 24, 22",
      "pantone": "Black 6 C 부근"
    },
    {
      "code": "T210-03",
      "key": "t210-03",
      "nameKr": "그레이 그린",
      "nameCn": "灰绿色",
      "nameEn": "Gray Green",
      "hex": "#BDC5C0",
      "rgb": "189, 197, 192",
      "pantone": "5517 C 부근"
    },
    {
      "code": "T210-04",
      "key": "t210-04",
      "nameKr": "백차 베이지",
      "nameCn": "白茶色",
      "nameEn": "White Tea Beige",
      "hex": "#BCAA9F",
      "rgb": "188, 170, 159",
      "pantone": "PANTONE 7528 C 추정"
    },
    {
      "code": "T210-05",
      "key": "t210-05",
      "nameKr": "유채 그린",
      "nameCn": "油菜绿",
      "nameEn": "Canola Green",
      "hex": "#94D83D",
      "rgb": "148, 216, 61",
      "pantone": "375 C 부근"
    },
    {
      "code": "T210-06",
      "key": "t210-06",
      "nameKr": "벚꽃 핑크",
      "nameCn": "樱花粉",
      "nameEn": "Cherry Blossom Pink",
      "hex": "#E47F9C",
      "rgb": "228, 127, 156",
      "pantone": "1905 C 부근"
    },
    {
      "code": "T210-07",
      "key": "t210-07",
      "nameKr": "카멜 브라운",
      "nameCn": "鹿角棕",
      "nameEn": "Antler Brown",
      "hex": "#A17B55",
      "rgb": "161, 123, 85",
      "pantone": "729 C 부근"
    },
    {
      "code": "T210-08",
      "key": "t210-08",
      "nameKr": "레드",
      "nameCn": "报春红",
      "nameEn": "Red",
      "hex": "#E6002C",
      "rgb": "230, 0, 44",
      "pantone": "185 C 부근"
    },
    {
      "code": "T210-09",
      "key": "t210-09",
      "nameKr": "대나무 그린",
      "nameCn": "青竹绿",
      "nameEn": "Bamboo Green",
      "hex": "#009572",
      "rgb": "0, 149, 114",
      "pantone": "3278 C 부근"
    },
    {
      "code": "T210-10",
      "key": "t210-10",
      "nameKr": "다크 그레이",
      "nameCn": "深灰色",
      "nameEn": "Dark Gray",
      "hex": "#6C686E",
      "rgb": "108, 104, 110",
      "pantone": "Cool Gray 10 C 부근"
    },
    {
      "code": "T210-11",
      "key": "t210-11",
      "nameKr": "네이비",
      "nameCn": "藏青色",
      "nameEn": "Navy",
      "hex": "#172947",
      "rgb": "23, 41, 71",
      "pantone": "533 C 부근"
    }
  ],
  "O3000": [
    {
      "code": "O3000-01",
      "key": "o3000-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#ECEDE9",
      "rgb": "236, 237, 233",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "O3000-02",
      "key": "o3000-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#171C20",
      "rgb": "23, 28, 32",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "O3000-03",
      "key": "o3000-03",
      "nameKr": "버치 베이지",
      "nameCn": "白桦",
      "nameEn": "Birch Beige",
      "hex": "#B7B3AA",
      "rgb": "183, 179, 170",
      "pantone": "Warm Gray 3 C 부근"
    },
    {
      "code": "O3000-04",
      "key": "o3000-04",
      "nameKr": "다크 그린",
      "nameCn": "暗绿",
      "nameEn": "Dark Green",
      "hex": "#2E3732",
      "rgb": "46, 55, 50",
      "pantone": "5605 C 부근"
    },
    {
      "code": "O3000-05",
      "key": "o3000-05",
      "nameKr": "다크 그레이",
      "nameCn": "深灰",
      "nameEn": "Dark Gray",
      "hex": "#2E3030",
      "rgb": "46, 48, 48",
      "pantone": "426 C 부근"
    },
    {
      "code": "O3000-06",
      "key": "o3000-06",
      "nameKr": "네이비",
      "nameCn": "藏蓝",
      "nameEn": "Navy",
      "hex": "#202142",
      "rgb": "32, 33, 66",
      "pantone": "2767 C 부근"
    }
  ],
  "23012": [
    {
      "code": "23012-02",
      "key": "23012-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#333335",
      "rgb": "51, 51, 53",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "23012-03",
      "key": "23012-03",
      "nameKr": "아이보리",
      "nameCn": "杏色",
      "nameEn": "Ivory",
      "hex": "#DCD3C6",
      "rgb": "220, 211, 198",
      "pantone": "7527 C 부근"
    },
    {
      "code": "23012-04",
      "key": "23012-04",
      "nameKr": "파파야 오렌지",
      "nameCn": "木瓜橙",
      "nameEn": "Papaya Orange",
      "hex": "#E77841",
      "rgb": "231, 120, 65",
      "pantone": "7578 C 부근"
    },
    {
      "code": "23012-05",
      "key": "23012-05",
      "nameKr": "로즈 핑크",
      "nameCn": "玫红色",
      "nameEn": "Rose Pink",
      "hex": "#CD4B81",
      "rgb": "205, 75, 129",
      "pantone": "7635 C 부근"
    },
    {
      "code": "23012-06",
      "key": "23012-06",
      "nameKr": "그래스 그린",
      "nameCn": "草绿",
      "nameEn": "Grass Green",
      "hex": "#4A878A",
      "rgb": "74, 135, 138",
      "pantone": "7475 C 부근"
    },
    {
      "code": "23012-07",
      "key": "23012-07",
      "nameKr": "올리브 그린",
      "nameCn": "橄榄绿",
      "nameEn": "Olive Green",
      "hex": "#817666",
      "rgb": "129, 118, 102",
      "pantone": "7530 C 부근"
    },
    {
      "code": "23012-08",
      "key": "23012-08",
      "nameKr": "브라운",
      "nameCn": "咖啡色",
      "nameEn": "Brown",
      "hex": "#916D61",
      "rgb": "145, 109, 97",
      "pantone": "7615 C 부근"
    },
    {
      "code": "23012-09",
      "key": "23012-09",
      "nameKr": "밀리터리 그린",
      "nameCn": "军绿",
      "nameEn": "Military Green",
      "hex": "#777869",
      "rgb": "119, 120, 105",
      "pantone": "417 C 부근"
    },
    {
      "code": "23012-10",
      "key": "23012-10",
      "nameKr": "퍼플",
      "nameCn": "紫色",
      "nameEn": "Purple",
      "hex": "#714876",
      "rgb": "113, 72, 118",
      "pantone": "7657 C 부근"
    },
    {
      "code": "23012-11",
      "key": "23012-11",
      "nameKr": "빈티지 블루",
      "nameCn": "巴黎世家蓝",
      "nameEn": "Vintage Blue",
      "hex": "#4C5877",
      "rgb": "76, 88, 119",
      "pantone": "7545 C 부근"
    },
    {
      "code": "23012-12",
      "key": "23012-12",
      "nameKr": "그레이",
      "nameCn": "灰色",
      "nameEn": "Gray",
      "hex": "#575759",
      "rgb": "87, 87, 89",
      "pantone": "Cool Gray 10 C 부근"
    }
  ],
  "27012": [
    {
      "code": "27012-02",
      "key": "27012-02",
      "nameKr": "워시드 블랙",
      "nameCn": "黑色",
      "nameEn": "Washed Black",
      "hex": "#282A2D",
      "rgb": "40, 42, 45",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "27012-03",
      "key": "27012-03",
      "nameKr": "오렌지",
      "nameCn": "橙色",
      "nameEn": "Orange",
      "hex": "#F47A3F",
      "rgb": "244, 122, 63",
      "pantone": "1645 C 부근"
    },
    {
      "code": "27012-04",
      "key": "27012-04",
      "nameKr": "로즈 레드",
      "nameCn": "玫红",
      "nameEn": "Rose Red",
      "hex": "#F06A9A",
      "rgb": "240, 106, 154",
      "pantone": "1905 C 부근"
    },
    {
      "code": "27012-05",
      "key": "27012-05",
      "nameKr": "퍼플",
      "nameCn": "紫色",
      "nameEn": "Purple",
      "hex": "#B88AD0",
      "rgb": "184, 138, 208",
      "pantone": "2567 C 부근"
    },
    {
      "code": "27012-06",
      "key": "27012-06",
      "nameKr": "커피",
      "nameCn": "咖啡色",
      "nameEn": "Coffee",
      "hex": "#A67857",
      "rgb": "166, 120, 87",
      "pantone": "729 C 부근"
    },
    {
      "code": "27012-07",
      "key": "27012-07",
      "nameKr": "워시드 그레이",
      "nameCn": "灰色",
      "nameEn": "Washed Grey",
      "hex": "#777878",
      "rgb": "119, 120, 120",
      "pantone": "Cool Gray 9 C 부근"
    },
    {
      "code": "27012-08",
      "key": "27012-08",
      "nameKr": "발렌시아가 블루",
      "nameCn": "巴黎世家蓝",
      "nameEn": "Balenciaga Blue",
      "hex": "#5771A8",
      "rgb": "87, 113, 168",
      "pantone": "7667 C 부근"
    }
  ],
  "S2000": [
    {
      "code": "S2000-01",
      "key": "s2000-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F1F2F5",
      "rgb": "241, 242, 245",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "S2000-02",
      "key": "s2000-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#252525",
      "rgb": "37, 37, 37",
      "pantone": "Black 7 C 부근"
    }
  ],
  "08VS30": [
    {
      "code": "08VS30-01",
      "key": "08vs30-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F1F2F5",
      "rgb": "241, 242, 245",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "08VS30-02",
      "key": "08vs30-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#181B21",
      "rgb": "24, 27, 33",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "08VS30-03",
      "key": "08vs30-03",
      "nameKr": "다크 그레이",
      "nameCn": "深灰",
      "nameEn": "Dark Gray",
      "hex": "#5B605F",
      "rgb": "91, 96, 95",
      "pantone": "424 C 부근"
    }
  ],
  "2403": [
    {
      "code": "2403-02",
      "key": "2403-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#2A2A2B",
      "rgb": "42, 42, 43",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "2403-03",
      "key": "2403-03",
      "nameKr": "아이보리",
      "nameCn": "米白色",
      "nameEn": "Ivory",
      "hex": "#DED7D1",
      "rgb": "222, 215, 209",
      "pantone": "Warm Gray 1 C 부근"
    },
    {
      "code": "2403-04",
      "key": "2403-04",
      "nameKr": "로즈 핑크",
      "nameCn": "蔷薇粉",
      "nameEn": "Rose Pink",
      "hex": "#E84F88",
      "rgb": "232, 79, 136",
      "pantone": "1915 C 부근"
    },
    {
      "code": "2403-05",
      "key": "2403-05",
      "nameKr": "그레이",
      "nameCn": "灰色",
      "nameEn": "Gray",
      "hex": "#8B8B86",
      "rgb": "139, 139, 134",
      "pantone": "Cool Gray 8 C 부근"
    }
  ],
  "2406": [
    {
      "code": "2406-02",
      "key": "2406-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#252827",
      "rgb": "37, 40, 39",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "2406-03",
      "key": "2406-03",
      "nameKr": "오렌지",
      "nameCn": "橙色",
      "nameEn": "Orange",
      "hex": "#F5A07D",
      "rgb": "245, 160, 125",
      "pantone": "1625 C 부근"
    },
    {
      "code": "2406-04",
      "key": "2406-04",
      "nameKr": "카키",
      "nameCn": "卡其色",
      "nameEn": "Khaki",
      "hex": "#C4B39F",
      "rgb": "196, 179, 159",
      "pantone": "7529 C 부근"
    },
    {
      "code": "2406-05",
      "key": "2406-05",
      "nameKr": "핑크",
      "nameCn": "粉色",
      "nameEn": "Pink",
      "hex": "#F579AD",
      "rgb": "245, 121, 173",
      "pantone": "1905 C 부근"
    },
    {
      "code": "2406-06",
      "key": "2406-06",
      "nameKr": "블루",
      "nameCn": "蓝色",
      "nameEn": "Blue",
      "hex": "#5DA6E5",
      "rgb": "93, 166, 229",
      "pantone": "2925 C 부근"
    },
    {
      "code": "2406-07",
      "key": "2406-07",
      "nameKr": "밀리터리 그린",
      "nameCn": "军绿色",
      "nameEn": "Military Green",
      "hex": "#918C78",
      "rgb": "145, 140, 120",
      "pantone": "417 C 부근"
    },
    {
      "code": "2406-08",
      "key": "2406-08",
      "nameKr": "그레이",
      "nameCn": "灰色",
      "nameEn": "Gray",
      "hex": "#7F8580",
      "rgb": "127, 133, 128",
      "pantone": "Cool Gray 8 C 부근"
    },
    {
      "code": "2406-09",
      "key": "2406-09",
      "nameKr": "퍼플",
      "nameCn": "紫色",
      "nameEn": "Purple",
      "hex": "#9A57B4",
      "rgb": "154, 87, 180",
      "pantone": "2583 C 부근"
    },
    {
      "code": "2406-10",
      "key": "2406-10",
      "nameKr": "브라운",
      "nameCn": "咖啡色",
      "nameEn": "Brown",
      "hex": "#8E7267",
      "rgb": "142, 114, 103",
      "pantone": "7615 C 부근"
    }
  ],
  "2405": [
    {
      "code": "2405-01",
      "key": "2405-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#DDD2CC",
      "rgb": "221, 210, 204",
      "pantone": "Warm Gray 1 C 부근"
    },
    {
      "code": "2405-02",
      "key": "2405-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#1D1E24",
      "rgb": "29, 30, 36",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "2405-03",
      "key": "2405-03",
      "nameKr": "카키",
      "nameCn": "卡其色",
      "nameEn": "Khaki",
      "hex": "#C9B39F",
      "rgb": "201, 179, 159",
      "pantone": "4755 C 부근"
    },
    {
      "code": "2405-04",
      "key": "2405-04",
      "nameKr": "핑크",
      "nameCn": "粉色",
      "nameEn": "Pink",
      "hex": "#EA7FA6",
      "rgb": "234, 127, 166",
      "pantone": "1905 C 부근"
    },
    {
      "code": "2405-05",
      "key": "2405-05",
      "nameKr": "로즈 핑크",
      "nameCn": "蔷薇粉",
      "nameEn": "Rose Pink",
      "hex": "#F05277",
      "rgb": "240, 82, 119",
      "pantone": "1915 C 부근"
    },
    {
      "code": "2405-06",
      "key": "2405-06",
      "nameKr": "진핑크",
      "nameCn": "玫红",
      "nameEn": "Rose Red",
      "hex": "#C8496B",
      "rgb": "200, 73, 107",
      "pantone": "7634 C 부근"
    },
    {
      "code": "2405-07",
      "key": "2405-07",
      "nameKr": "퍼플",
      "nameCn": "紫色",
      "nameEn": "Purple",
      "hex": "#7E59C2",
      "rgb": "126, 89, 194",
      "pantone": "2665 C 부근"
    },
    {
      "code": "2405-08",
      "key": "2405-08",
      "nameKr": "밀리터리 그린",
      "nameCn": "军绿色",
      "nameEn": "Military Green",
      "hex": "#777365",
      "rgb": "119, 115, 101",
      "pantone": "417 C 부근"
    },
    {
      "code": "2405-09",
      "key": "2405-09",
      "nameKr": "다크 그레이",
      "nameCn": "深灰色",
      "nameEn": "Dark Gray",
      "hex": "#4C4A50",
      "rgb": "76, 74, 80",
      "pantone": "Cool Gray 11 C 부근"
    },
    {
      "code": "2405-10",
      "key": "2405-10",
      "nameKr": "네이비",
      "nameCn": "藏蓝",
      "nameEn": "Navy",
      "hex": "#242944",
      "rgb": "36, 41, 68",
      "pantone": "2767 C 부근"
    }
  ],
  "2408": [
    {
      "code": "2408-02",
      "key": "2408-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#252827",
      "rgb": "37, 40, 39",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "2408-03",
      "key": "2408-03",
      "nameKr": "오렌지",
      "nameCn": "橙色",
      "nameEn": "Orange",
      "hex": "#F5A07D",
      "rgb": "245, 160, 125",
      "pantone": "1625 C 부근"
    },
    {
      "code": "2408-04",
      "key": "2408-04",
      "nameKr": "카키",
      "nameCn": "卡其色",
      "nameEn": "Khaki",
      "hex": "#C4B39F",
      "rgb": "196, 179, 159",
      "pantone": "7529 C 부근"
    },
    {
      "code": "2408-05",
      "key": "2408-05",
      "nameKr": "핑크",
      "nameCn": "粉色",
      "nameEn": "Pink",
      "hex": "#F579AD",
      "rgb": "245, 121, 173",
      "pantone": "1905 C 부근"
    },
    {
      "code": "2408-06",
      "key": "2408-06",
      "nameKr": "블루",
      "nameCn": "蓝色",
      "nameEn": "Blue",
      "hex": "#5DA6E5",
      "rgb": "93, 166, 229",
      "pantone": "2925 C 부근"
    },
    {
      "code": "2408-07",
      "key": "2408-07",
      "nameKr": "밀리터리 그린",
      "nameCn": "军绿色",
      "nameEn": "Military Green",
      "hex": "#918C78",
      "rgb": "145, 140, 120",
      "pantone": "417 C 부근"
    },
    {
      "code": "2408-08",
      "key": "2408-08",
      "nameKr": "그레이",
      "nameCn": "灰色",
      "nameEn": "Gray",
      "hex": "#7F8580",
      "rgb": "127, 133, 128",
      "pantone": "Cool Gray 8 C 부근"
    },
    {
      "code": "2408-09",
      "key": "2408-09",
      "nameKr": "퍼플",
      "nameCn": "紫色",
      "nameEn": "Purple",
      "hex": "#9A57B4",
      "rgb": "154, 87, 180",
      "pantone": "2583 C 부근"
    },
    {
      "code": "2408-10",
      "key": "2408-10",
      "nameKr": "브라운",
      "nameCn": "咖啡色",
      "nameEn": "Brown",
      "hex": "#8E7267",
      "rgb": "142, 114, 103",
      "pantone": "7615 C 부근"
    }
  ],
  "3053": [
    {
      "code": "3053-01",
      "key": "3053-01",
      "nameKr": "오프화이트",
      "nameCn": "漂白",
      "nameEn": "Off White",
      "hex": "#F3F3F1",
      "rgb": "243, 243, 241",
      "pantone": "11-0601 TCX / Cool Gray 1 C 부근"
    },
    {
      "code": "3053-02",
      "key": "3053-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#2C313E",
      "rgb": "44, 49, 62",
      "pantone": "432 C / Black 7 C 부근"
    },
    {
      "code": "3053-03",
      "key": "3053-03",
      "nameKr": "벽돌 레드",
      "nameCn": "砖红",
      "nameEn": "Brick Red",
      "hex": "#8F3E31",
      "rgb": "143, 62, 49",
      "pantone": "7593 C 부근"
    },
    {
      "code": "3053-04",
      "key": "3053-04",
      "nameKr": "다크 브라운",
      "nameCn": "深咖",
      "nameEn": "Dark Brown",
      "hex": "#4A2C1F",
      "rgb": "74, 44, 31",
      "pantone": "476 C 부근"
    },
    {
      "code": "3053-05",
      "key": "3053-05",
      "nameKr": "네이비",
      "nameCn": "藏蓝",
      "nameEn": "Navy",
      "hex": "#1E2E63",
      "rgb": "30, 46, 99",
      "pantone": "540 C 부근"
    }
  ],
  "7001(아동)": [
    {
      "code": "7001(아동)-01",
      "key": "7001-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F1F2F6",
      "rgb": "241, 242, 246",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "7001(아동)-02",
      "key": "7001-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#1A1D20",
      "rgb": "26, 29, 32",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "7001(아동)-03",
      "key": "7001-03",
      "nameKr": "멜란지",
      "nameCn": "麻灰",
      "nameEn": "Melange",
      "hex": "#8A887E",
      "rgb": "138, 136, 126",
      "pantone": "416 C 부근"
    },
    {
      "code": "7001(아동)-04",
      "key": "7001-04",
      "nameKr": "버건디",
      "nameCn": "酒红",
      "nameEn": "Burgundy",
      "hex": "#930006",
      "rgb": "147, 0, 6",
      "pantone": "7623 C 부근"
    },
    {
      "code": "7001(아동)-05",
      "key": "7001-05",
      "nameKr": "퍼플",
      "nameCn": "紫色",
      "nameEn": "Purple",
      "hex": "#6B3A5E",
      "rgb": "107, 58, 94",
      "pantone": "7657 C 부근"
    },
    {
      "code": "7001(아동)-06",
      "key": "7001-06",
      "nameKr": "네이비",
      "nameCn": "藏蓝",
      "nameEn": "Navy",
      "hex": "#1E2A73",
      "rgb": "30, 42, 115",
      "pantone": "2748 C 부근"
    }
  ],
  "T160": [
    {
      "code": "T160-01",
      "key": "t160-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F0F1F4",
      "rgb": "240, 241, 244",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "T160-02",
      "key": "t160-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#171B20",
      "rgb": "23, 27, 32",
      "pantone": "Black 7 C 부근"
    }
  ],
  "Q2000": [
    {
      "code": "Q2000-01",
      "key": "q2000-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F0F1F4",
      "rgb": "240, 241, 244",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "Q2000-02",
      "key": "q2000-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#15171B",
      "rgb": "21, 23, 27",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "Q2000-03",
      "key": "q2000-03",
      "nameKr": "라이트 옐로우",
      "nameCn": "鹅黄",
      "nameEn": "Light Yellow",
      "hex": "#E9EB78",
      "rgb": "233, 235, 120",
      "pantone": "586 C 부근"
    },
    {
      "code": "Q2000-04",
      "key": "q2000-04",
      "nameKr": "멜론 오렌지",
      "nameCn": "蜜瓜橙",
      "nameEn": "Melon Orange",
      "hex": "#F2A797",
      "rgb": "242, 167, 151",
      "pantone": "1625 C 부근"
    },
    {
      "code": "Q2000-05",
      "key": "q2000-05",
      "nameKr": "민트 그린",
      "nameCn": "薄荷绿",
      "nameEn": "Mint Green",
      "hex": "#65DFA6",
      "rgb": "101, 223, 166",
      "pantone": "3375 C 부근"
    },
    {
      "code": "Q2000-06",
      "key": "q2000-06",
      "nameKr": "멜란지",
      "nameCn": "麻灰",
      "nameEn": "Melange",
      "hex": "#B8B7BB",
      "rgb": "184, 183, 187",
      "pantone": "Cool Gray 5 C 부근"
    },
    {
      "code": "Q2000-07",
      "key": "q2000-07",
      "nameKr": "스모그 블루",
      "nameCn": "雾霾灰",
      "nameEn": "Smog Blue",
      "hex": "#4E8AB1",
      "rgb": "78, 138, 177",
      "pantone": "7696 C 부근"
    },
    {
      "code": "Q2000-08",
      "key": "q2000-08",
      "nameKr": "드래곤 프루트",
      "nameCn": "火龙果",
      "nameEn": "Dragon Fruit",
      "hex": "#9D2C8B",
      "rgb": "157, 44, 139",
      "pantone": "2415 C 부근"
    },
    {
      "code": "Q2000-09",
      "key": "q2000-09",
      "nameKr": "밀리터리 그린",
      "nameCn": "军绿色",
      "nameEn": "Military Green",
      "hex": "#3D482F",
      "rgb": "61, 72, 47",
      "pantone": "5743 C 부근"
    }
  ],
  "V2700": [
    {
      "code": "V2700-01",
      "key": "v2700-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#EDEDEA",
      "rgb": "237, 237, 234",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "V2700-02",
      "key": "v2700-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#141416",
      "rgb": "20, 20, 22",
      "pantone": "Black 6 C 또는 Black 7 C 부근"
    }
  ],
  "HP004": [
    {
      "code": "HP004-01",
      "key": "hp004-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F3F1F5",
      "rgb": "243, 241, 245",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "HP004-02",
      "key": "hp004-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#171819",
      "rgb": "23, 24, 25",
      "pantone": "Black 6 C 부근"
    },
    {
      "code": "HP004-03",
      "key": "hp004-03",
      "nameKr": "라이트 그린",
      "nameCn": "浅绿色",
      "nameEn": "Light Green",
      "hex": "#DAF0CF",
      "rgb": "218, 240, 207",
      "pantone": "621 C 부근"
    },
    {
      "code": "HP004-04",
      "key": "hp004-04",
      "nameKr": "퍼플",
      "nameCn": "紫色",
      "nameEn": "Purple",
      "hex": "#C8C5EF",
      "rgb": "200, 197, 239",
      "pantone": "2706 C 부근"
    },
    {
      "code": "HP004-05",
      "key": "hp004-05",
      "nameKr": "카키 그린",
      "nameCn": "军绿色",
      "nameEn": "Khaki Green",
      "hex": "#8E8373",
      "rgb": "142, 131, 115",
      "pantone": "7530 C 부근"
    },
    {
      "code": "HP004-06",
      "key": "hp004-06",
      "nameKr": "차콜 브라운",
      "nameCn": "黑灰",
      "nameEn": "Charcoal Brown",
      "hex": "#6D594B",
      "rgb": "109, 89, 75",
      "pantone": "7532 C 부근"
    }
  ],
  "7001(긴팔)": [
    {
      "code": "7001(긴팔)-01",
      "key": "7001-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F1F2F6",
      "rgb": "241, 242, 246",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "7001(긴팔)-02",
      "key": "7001-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#25262A",
      "rgb": "37, 38, 42",
      "pantone": "Black 7 C 부근"
    }
  ],
  "QXK2521": [
    {
      "code": "QXK2521-01",
      "key": "qxk2521-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F0F1F5",
      "rgb": "240, 241, 245",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "QXK2521-02",
      "key": "qxk2521-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#1D1F22",
      "rgb": "29, 31, 34",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "QXK2521-03",
      "key": "qxk2521-03",
      "nameKr": "카키",
      "nameCn": "卡其色",
      "nameEn": "Khaki",
      "hex": "#E6E0CB",
      "rgb": "230, 224, 203",
      "pantone": "7527 C 부근"
    },
    {
      "code": "QXK2521-04",
      "key": "qxk2521-04",
      "nameKr": "레몬 옐로우",
      "nameCn": "柠檬黄",
      "nameEn": "Lemon Yellow",
      "hex": "#C9F266",
      "rgb": "201, 242, 102",
      "pantone": "373 C 부근"
    },
    {
      "code": "QXK2521-05",
      "key": "qxk2521-05",
      "nameKr": "민트",
      "nameCn": "且青色",
      "nameEn": "Mint",
      "hex": "#9DEADC",
      "rgb": "157, 234, 220",
      "pantone": "3242 C 부근"
    },
    {
      "code": "QXK2521-06",
      "key": "qxk2521-06",
      "nameKr": "그레이 그린",
      "nameCn": "灰绿色",
      "nameEn": "Gray Green",
      "hex": "#C4DEC4",
      "rgb": "196, 222, 196",
      "pantone": "621 C 부근"
    },
    {
      "code": "QXK2521-07",
      "key": "qxk2521-07",
      "nameKr": "린넨 베이지",
      "nameCn": "亚麻",
      "nameEn": "Linen Beige",
      "hex": "#D7D2BF",
      "rgb": "215, 210, 191",
      "pantone": "7534 C 부근"
    },
    {
      "code": "QXK2521-08",
      "key": "qxk2521-08",
      "nameKr": "갈매기 그레이",
      "nameCn": "海鸥灰",
      "nameEn": "Seagull Gray",
      "hex": "#C7C9C0",
      "rgb": "199, 201, 192",
      "pantone": "427 C 부근"
    },
    {
      "code": "QXK2521-09",
      "key": "qxk2521-09",
      "nameKr": "스모키 베이지",
      "nameCn": "淡松烟",
      "nameEn": "Smoky Beige",
      "hex": "#BFB8A9",
      "rgb": "191, 184, 169",
      "pantone": "Warm Gray 4 C 부근"
    },
    {
      "code": "QXK2521-10",
      "key": "qxk2521-10",
      "nameKr": "멜란지",
      "nameCn": "麻灰",
      "nameEn": "Melange",
      "hex": "#B9B9B4",
      "rgb": "185, 185, 180",
      "pantone": "Cool Gray 5 C 부근"
    },
    {
      "code": "QXK2521-11",
      "key": "qxk2521-11",
      "nameKr": "레이크 블루",
      "nameCn": "湖蓝色",
      "nameEn": "Lake Blue",
      "hex": "#10C9CD",
      "rgb": "16, 201, 205",
      "pantone": "319 C 부근"
    },
    {
      "code": "QXK2521-12",
      "key": "qxk2521-12",
      "nameKr": "머스터드",
      "nameCn": "土黄色",
      "nameEn": "Mustard",
      "hex": "#C59B54",
      "rgb": "197, 155, 84",
      "pantone": "7563 C 부근"
    },
    {
      "code": "QXK2521-13",
      "key": "qxk2521-13",
      "nameKr": "로즈 핑크",
      "nameCn": "玫红",
      "nameEn": "Rose Pink",
      "hex": "#F54283",
      "rgb": "245, 66, 131",
      "pantone": "1915 C 부근"
    },
    {
      "code": "QXK2521-14",
      "key": "qxk2521-14",
      "nameKr": "올리브 그린",
      "nameCn": "橄榄绿",
      "nameEn": "Olive Green",
      "hex": "#81724C",
      "rgb": "129, 114, 76",
      "pantone": "4485 C 부근"
    },
    {
      "code": "QXK2521-15",
      "key": "qxk2521-15",
      "nameKr": "다크 그레이",
      "nameCn": "深灰",
      "nameEn": "Dark Gray",
      "hex": "#4B4C50",
      "rgb": "75, 76, 80",
      "pantone": "Cool Gray 11 C 부근"
    },
    {
      "code": "QXK2521-16",
      "key": "qxk2521-16",
      "nameKr": "네이비",
      "nameCn": "藏蓝",
      "nameEn": "Navy",
      "hex": "#153958",
      "rgb": "21, 57, 88",
      "pantone": "533 C 부근"
    },
    {
      "code": "QXK2521-17",
      "key": "qxk2521-17",
      "nameKr": "메이플 레드",
      "nameCn": "枫叶红",
      "nameEn": "Maple Red",
      "hex": "#4A0815",
      "rgb": "74, 8, 21",
      "pantone": "4975 C 부근"
    }
  ],
  "06OLK": [
    {
      "code": "06OLK-01",
      "key": "06olk-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#EEF1F3",
      "rgb": "238, 241, 243",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "06OLK-02",
      "key": "06olk-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#202328",
      "rgb": "32, 35, 40",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "06OLK-03",
      "key": "06olk-03",
      "nameKr": "라이트 그린",
      "nameCn": "浅绿色",
      "nameEn": "Light Green",
      "hex": "#DDE8DC",
      "rgb": "221, 232, 220",
      "pantone": "621 C 부근"
    },
    {
      "code": "06OLK-04",
      "key": "06olk-04",
      "nameKr": "라이트 옐로우",
      "nameCn": "栀子黄",
      "nameEn": "Light Yellow",
      "hex": "#E7EF88",
      "rgb": "231, 239, 136",
      "pantone": "586 C 부근"
    },
    {
      "code": "06OLK-05",
      "key": "06olk-05",
      "nameKr": "린넨 베이지",
      "nameCn": "亚麻色",
      "nameEn": "Linen Beige",
      "hex": "#E0DDC7",
      "rgb": "224, 221, 199",
      "pantone": "7527 C 부근"
    },
    {
      "code": "06OLK-06",
      "key": "06olk-06",
      "nameKr": "스모키 베이지",
      "nameCn": "淡松烟",
      "nameEn": "Smoky Beige",
      "hex": "#C8C1B3",
      "rgb": "200, 193, 179",
      "pantone": "Warm Gray 4 C 부근"
    },
    {
      "code": "06OLK-07",
      "key": "06olk-07",
      "nameKr": "올리브 그린",
      "nameCn": "橄榄绿",
      "nameEn": "Olive Green",
      "hex": "#777044",
      "rgb": "119, 112, 68",
      "pantone": "4485 C 부근"
    },
    {
      "code": "06OLK-08",
      "key": "06olk-08",
      "nameKr": "대나무 그린",
      "nameCn": "青竹绿",
      "nameEn": "Bamboo Green",
      "hex": "#00865D",
      "rgb": "0, 134, 93",
      "pantone": "7724 C 부근"
    },
    {
      "code": "06OLK-09",
      "key": "06olk-09",
      "nameKr": "다크 그레이",
      "nameCn": "深灰色",
      "nameEn": "Dark Gray",
      "hex": "#51595A",
      "rgb": "81, 89, 90",
      "pantone": "431 C 부근"
    }
  ],
  "Q2450": [
    {
      "code": "Q2450-01",
      "key": "q2450-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F0F1F4",
      "rgb": "240, 241, 244",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "Q2450-02",
      "key": "q2450-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#17181C",
      "rgb": "23, 24, 28",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "Q2450-03",
      "key": "q2450-03",
      "nameKr": "민트 그레이",
      "nameCn": "薄墨色",
      "nameEn": "Mint Gray",
      "hex": "#A8B8B2",
      "rgb": "168, 184, 178",
      "pantone": "5585 C 부근"
    },
    {
      "code": "Q2450-04",
      "key": "q2450-04",
      "nameKr": "코랄",
      "nameCn": "珊瑚珠",
      "nameEn": "Coral",
      "hex": "#F36F5D",
      "rgb": "243, 111, 93",
      "pantone": "7416 C 부근"
    },
    {
      "code": "Q2450-05",
      "key": "q2450-05",
      "nameKr": "앰버 옐로우",
      "nameCn": "琥珀黄",
      "nameEn": "Amber Yellow",
      "hex": "#C89228",
      "rgb": "200, 146, 40",
      "pantone": "7550 C 부근"
    },
    {
      "code": "Q2450-06",
      "key": "q2450-06",
      "nameKr": "블루 그레이",
      "nameCn": "青灰色",
      "nameEn": "Blue Gray",
      "hex": "#6F7B8D",
      "rgb": "111, 123, 141",
      "pantone": "7544 C 부근"
    },
    {
      "code": "Q2450-07",
      "key": "q2450-07",
      "nameKr": "인디고 블루",
      "nameCn": "靛蓝色",
      "nameEn": "Indigo Blue",
      "hex": "#00617A",
      "rgb": "0, 97, 122",
      "pantone": "7470 C 부근"
    },
    {
      "code": "Q2450-08",
      "key": "q2450-08",
      "nameKr": "다크 그레이",
      "nameCn": "深灰色",
      "nameEn": "Dark Gray",
      "hex": "#464649",
      "rgb": "70, 70, 73",
      "pantone": "Cool Gray 11 C 부근"
    }
  ],
  "OE2700": [
    {
      "code": "OE2700-01",
      "key": "oe2700-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#EDEDEA",
      "rgb": "237, 237, 234",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "OE2700-02",
      "key": "oe2700-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#171817",
      "rgb": "23, 24, 23",
      "pantone": "Black 6 C 부근"
    },
    {
      "code": "OE2700-03",
      "key": "oe2700-03",
      "nameKr": "라이트 옐로우",
      "nameCn": "鹅黄",
      "nameEn": "Light Yellow",
      "hex": "#F0EEA9",
      "rgb": "240, 238, 169",
      "pantone": "586 C 부근"
    },
    {
      "code": "OE2700-04",
      "key": "oe2700-04",
      "nameKr": "라이트 그린",
      "nameCn": "浅绿色",
      "nameEn": "Light Green",
      "hex": "#DFEED5",
      "rgb": "223, 238, 213",
      "pantone": "621 C 부근"
    },
    {
      "code": "OE2700-05",
      "key": "oe2700-05",
      "nameKr": "카키 브라운",
      "nameCn": "鹿角棕",
      "nameEn": "Khaki Brown",
      "hex": "#89806A",
      "rgb": "137, 128, 106",
      "pantone": "7530 C 부근"
    },
    {
      "code": "OE2700-06",
      "key": "oe2700-06",
      "nameKr": "대나무 그린",
      "nameCn": "青竹绿",
      "nameEn": "Bamboo Green",
      "hex": "#007A73",
      "rgb": "0, 122, 115",
      "pantone": "322 C 부근"
    },
    {
      "code": "OE2700-07",
      "key": "oe2700-07",
      "nameKr": "다크 그레이",
      "nameCn": "深灰色",
      "nameEn": "Dark Gray",
      "hex": "#465553",
      "rgb": "70, 85, 83",
      "pantone": "5467 C 부근"
    }
  ],
  "YL2800": [
    {
      "code": "YL2800-01",
      "key": "yl2800-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F1F2F4",
      "rgb": "241, 242, 244",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "YL2800-02",
      "key": "yl2800-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#171819",
      "rgb": "23, 24, 25",
      "pantone": "Black 6 C 부근"
    },
    {
      "code": "YL2800-03",
      "key": "yl2800-03",
      "nameKr": "카키",
      "nameCn": "卡其色",
      "nameEn": "Khaki",
      "hex": "#D9C79E",
      "rgb": "217, 199, 158",
      "pantone": "7502 C 부근"
    },
    {
      "code": "YL2800-04",
      "key": "yl2800-04",
      "nameKr": "핑크",
      "nameCn": "粉色",
      "nameEn": "Pink",
      "hex": "#F6A08D",
      "rgb": "246, 160, 141",
      "pantone": "1625 C 부근"
    },
    {
      "code": "YL2800-05",
      "key": "yl2800-05",
      "nameKr": "스카이 블루",
      "nameCn": "雾蓝色",
      "nameEn": "Sky Blue",
      "hex": "#73C8D9",
      "rgb": "115, 200, 217",
      "pantone": "636 C 부근"
    },
    {
      "code": "YL2800-06",
      "key": "yl2800-06",
      "nameKr": "퍼플",
      "nameCn": "紫色",
      "nameEn": "Purple",
      "hex": "#9C8AE1",
      "rgb": "156, 138, 225",
      "pantone": "2655 C 부근"
    },
    {
      "code": "YL2800-07",
      "key": "yl2800-07",
      "nameKr": "대나무 그린",
      "nameCn": "青竹绿",
      "nameEn": "Bamboo Green",
      "hex": "#3FAE96",
      "rgb": "63, 174, 150",
      "pantone": "7473 C 부근"
    },
    {
      "code": "YL2800-08",
      "key": "yl2800-08",
      "nameKr": "그래스 그린",
      "nameCn": "草绿色",
      "nameEn": "Grass Green",
      "hex": "#00A99A",
      "rgb": "0, 169, 154",
      "pantone": "3265 C 부근"
    },
    {
      "code": "YL2800-09",
      "key": "yl2800-09",
      "nameKr": "와인",
      "nameCn": "酒红",
      "nameEn": "Wine",
      "hex": "#C91442",
      "rgb": "201, 20, 66",
      "pantone": "7636 C 부근"
    },
    {
      "code": "YL2800-10",
      "key": "yl2800-10",
      "nameKr": "브라운",
      "nameCn": "咖啡色",
      "nameEn": "Brown",
      "hex": "#6B4B39",
      "rgb": "107, 75, 57",
      "pantone": "7596 C 부근"
    }
  ],
  "YL3200": [
    {
      "code": "YL3200-01",
      "key": "yl3200-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F1F0EC",
      "rgb": "241, 240, 236",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "YL3200-02",
      "key": "yl3200-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#18191B",
      "rgb": "24, 25, 27",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "YL3200-03",
      "key": "yl3200-03",
      "nameKr": "라이트 그린",
      "nameCn": "浅绿色",
      "nameEn": "Light Green",
      "hex": "#BDEBDD",
      "rgb": "189, 235, 221",
      "pantone": "3242 C 부근"
    },
    {
      "code": "YL3200-04",
      "key": "yl3200-04",
      "nameKr": "핑크",
      "nameCn": "粉色",
      "nameEn": "Pink",
      "hex": "#E7B6D9",
      "rgb": "231, 182, 217",
      "pantone": "2036 C 부근"
    },
    {
      "code": "YL3200-05",
      "key": "yl3200-05",
      "nameKr": "라이트 퍼플",
      "nameCn": "浅紫色",
      "nameEn": "Light Purple",
      "hex": "#C6C2EA",
      "rgb": "198, 194, 234",
      "pantone": "2635 C 부근"
    },
    {
      "code": "YL3200-06",
      "key": "yl3200-06",
      "nameKr": "라이트 옐로우",
      "nameCn": "鹅黄",
      "nameEn": "Light Yellow",
      "hex": "#E5CA2F",
      "rgb": "229, 202, 47",
      "pantone": "115 C 부근"
    },
    {
      "code": "YL3200-07",
      "key": "yl3200-07",
      "nameKr": "스카이 블루",
      "nameCn": "浅蓝色",
      "nameEn": "Sky Blue",
      "hex": "#A9CFE8",
      "rgb": "169, 207, 232",
      "pantone": "2905 C 부근"
    },
    {
      "code": "YL3200-08",
      "key": "yl3200-08",
      "nameKr": "아보카도 그린",
      "nameCn": "牛油果绿",
      "nameEn": "Avocado Green",
      "hex": "#9ED557",
      "rgb": "158, 213, 87",
      "pantone": "7488 C 부근"
    },
    {
      "code": "YL3200-09",
      "key": "yl3200-09",
      "nameKr": "멜란지",
      "nameCn": "麻灰",
      "nameEn": "Melange",
      "hex": "#B7B5AE",
      "rgb": "183, 181, 174",
      "pantone": "Cool Gray 5 C 부근"
    },
    {
      "code": "YL3200-10",
      "key": "yl3200-10",
      "nameKr": "코랄",
      "nameCn": "珊瑚色",
      "nameEn": "Coral",
      "hex": "#E9776D",
      "rgb": "233, 119, 109",
      "pantone": "7416 C 부근"
    },
    {
      "code": "YL3200-11",
      "key": "yl3200-11",
      "nameKr": "그레이 그린",
      "nameCn": "灰绿色",
      "nameEn": "Gray Green",
      "hex": "#86A9A0",
      "rgb": "134, 169, 160",
      "pantone": "5575 C 부근"
    },
    {
      "code": "YL3200-12",
      "key": "yl3200-12",
      "nameKr": "블루 그레이",
      "nameCn": "蓝灰色",
      "nameEn": "Blue Gray",
      "hex": "#6F8FA0",
      "rgb": "111, 143, 160",
      "pantone": "5415 C 부근"
    },
    {
      "code": "YL3200-13",
      "key": "yl3200-13",
      "nameKr": "대나무 그린",
      "nameCn": "青竹绿",
      "nameEn": "Bamboo Green",
      "hex": "#008F80",
      "rgb": "0, 143, 128",
      "pantone": "3285 C 부근"
    },
    {
      "code": "YL3200-14",
      "key": "yl3200-14",
      "nameKr": "레이크 블루",
      "nameCn": "湖蓝色",
      "nameEn": "Lake Blue",
      "hex": "#2C7898",
      "rgb": "44, 120, 152",
      "pantone": "7698 C 부근"
    },
    {
      "code": "YL3200-15",
      "key": "yl3200-15",
      "nameKr": "올리브 그린",
      "nameCn": "橄榄绿",
      "nameEn": "Olive Green",
      "hex": "#187856",
      "rgb": "24, 120, 86",
      "pantone": "7727 C 부근"
    },
    {
      "code": "YL3200-16",
      "key": "yl3200-16",
      "nameKr": "딥 퍼플",
      "nameCn": "深紫色",
      "nameEn": "Deep Purple",
      "hex": "#5D5478",
      "rgb": "93, 84, 120",
      "pantone": "7666 C 부근"
    },
    {
      "code": "YL3200-17",
      "key": "yl3200-17",
      "nameKr": "브라운 그레이",
      "nameCn": "咖灰色",
      "nameEn": "Brown Gray",
      "hex": "#5A4B4E",
      "rgb": "90, 75, 78",
      "pantone": "7617 C 부근"
    }
  ],
  "LM2800": [
    {
      "code": "LM2800-01",
      "key": "lm2800-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F0F1EF",
      "rgb": "240, 241, 239",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "LM2800-02",
      "key": "lm2800-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#141516",
      "rgb": "20, 21, 22",
      "pantone": "Black 6 C 부근"
    },
    {
      "code": "LM2800-03",
      "key": "lm2800-03",
      "nameKr": "카키",
      "nameCn": "卡其色",
      "nameEn": "Khaki",
      "hex": "#E3C98E",
      "rgb": "227, 201, 142",
      "pantone": "7502 C 부근"
    },
    {
      "code": "LM2800-04",
      "key": "lm2800-04",
      "nameKr": "멜론 오렌지",
      "nameCn": "蜜瓜橙",
      "nameEn": "Melon Orange",
      "hex": "#F4A58F",
      "rgb": "244, 165, 143",
      "pantone": "1625 C 부근"
    },
    {
      "code": "LM2800-05",
      "key": "lm2800-05",
      "nameKr": "스카이 블루",
      "nameCn": "浅蓝色",
      "nameEn": "Sky Blue",
      "hex": "#8FC8EF",
      "rgb": "143, 200, 239",
      "pantone": "2905 C 부근"
    },
    {
      "code": "LM2800-06",
      "key": "lm2800-06",
      "nameKr": "대나무 그린",
      "nameCn": "青竹绿",
      "nameEn": "Bamboo Green",
      "hex": "#36A88D",
      "rgb": "54, 168, 141",
      "pantone": "7473 C 부근"
    },
    {
      "code": "LM2800-07",
      "key": "lm2800-07",
      "nameKr": "퍼플",
      "nameCn": "紫色",
      "nameEn": "Purple",
      "hex": "#8D6BDA",
      "rgb": "141, 107, 218",
      "pantone": "2655 C 부근"
    },
    {
      "code": "LM2800-08",
      "key": "lm2800-08",
      "nameKr": "청록",
      "nameCn": "孔雀蓝",
      "nameEn": "Peacock Blue",
      "hex": "#008C8D",
      "rgb": "0, 140, 141",
      "pantone": "7716 C 부근"
    },
    {
      "code": "LM2800-09",
      "key": "lm2800-09",
      "nameKr": "와인",
      "nameCn": "酒红",
      "nameEn": "Wine",
      "hex": "#C9143F",
      "rgb": "201, 20, 63",
      "pantone": "7636 C 부근"
    },
    {
      "code": "LM2800-10",
      "key": "lm2800-10",
      "nameKr": "브라운",
      "nameCn": "咖啡色",
      "nameEn": "Brown",
      "hex": "#5B3B2F",
      "rgb": "91, 59, 47",
      "pantone": "7596 C 부근"
    }
  ],
  "LM3200": [
    {
      "code": "LM3200-01",
      "key": "lm3200-01",
      "nameKr": "화이트",
      "nameCn": "白色",
      "nameEn": "White",
      "hex": "#F1F0EC",
      "rgb": "241, 240, 236",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "LM3200-02",
      "key": "lm3200-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#171819",
      "rgb": "23, 24, 25",
      "pantone": "Black 6 C 부근"
    },
    {
      "code": "LM3200-03",
      "key": "lm3200-03",
      "nameKr": "라이트 그린",
      "nameCn": "浅绿色",
      "nameEn": "Light Green",
      "hex": "#BCEFCF",
      "rgb": "188, 239, 207",
      "pantone": "621 C 부근"
    },
    {
      "code": "LM3200-04",
      "key": "lm3200-04",
      "nameKr": "스카이 블루",
      "nameCn": "浅蓝色",
      "nameEn": "Sky Blue",
      "hex": "#B7D9E8",
      "rgb": "183, 217, 232",
      "pantone": "2905 C 부근"
    },
    {
      "code": "LM3200-05",
      "key": "lm3200-05",
      "nameKr": "라이트 퍼플",
      "nameCn": "浅紫色",
      "nameEn": "Light Purple",
      "hex": "#C9C5E7",
      "rgb": "201, 197, 231",
      "pantone": "2635 C 부근"
    },
    {
      "code": "LM3200-06",
      "key": "lm3200-06",
      "nameKr": "라이트 옐로우",
      "nameCn": "鹅黄",
      "nameEn": "Light Yellow",
      "hex": "#E3C531",
      "rgb": "227, 197, 49",
      "pantone": "115 C 부근"
    },
    {
      "code": "LM3200-07",
      "key": "lm3200-07",
      "nameKr": "핑크",
      "nameCn": "粉色",
      "nameEn": "Pink",
      "hex": "#E9A3C2",
      "rgb": "233, 163, 194",
      "pantone": "2036 C 부근"
    },
    {
      "code": "LM3200-08",
      "key": "lm3200-08",
      "nameKr": "멜란지",
      "nameCn": "麻灰",
      "nameEn": "Melange",
      "hex": "#B8B6B0",
      "rgb": "184, 182, 176",
      "pantone": "Cool Gray 5 C 부근"
    },
    {
      "code": "LM3200-09",
      "key": "lm3200-09",
      "nameKr": "아보카도 그린",
      "nameCn": "牛油果绿",
      "nameEn": "Avocado Green",
      "hex": "#98B84A",
      "rgb": "152, 184, 74",
      "pantone": "7495 C 부근"
    },
    {
      "code": "LM3200-10",
      "key": "lm3200-10",
      "nameKr": "그레이 그린",
      "nameCn": "灰绿色",
      "nameEn": "Gray Green",
      "hex": "#7FB2B1",
      "rgb": "127, 178, 177",
      "pantone": "5493 C 부근"
    },
    {
      "code": "LM3200-11",
      "key": "lm3200-11",
      "nameKr": "코랄",
      "nameCn": "珊瑚色",
      "nameEn": "Coral",
      "hex": "#D87568",
      "rgb": "216, 117, 104",
      "pantone": "7416 C 부근"
    },
    {
      "code": "LM3200-12",
      "key": "lm3200-12",
      "nameKr": "블루 그레이",
      "nameCn": "蓝灰色",
      "nameEn": "Blue Gray",
      "hex": "#6C879B",
      "rgb": "108, 135, 155",
      "pantone": "5415 C 부근"
    },
    {
      "code": "LM3200-13",
      "key": "lm3200-13",
      "nameKr": "딥 퍼플",
      "nameCn": "深紫色",
      "nameEn": "Deep Purple",
      "hex": "#8D739A",
      "rgb": "141, 115, 154",
      "pantone": "7660 C 부근"
    },
    {
      "code": "LM3200-14",
      "key": "lm3200-14",
      "nameKr": "대나무 그린",
      "nameCn": "青竹绿",
      "nameEn": "Bamboo Green",
      "hex": "#008F82",
      "rgb": "0, 143, 130",
      "pantone": "3285 C 부근"
    },
    {
      "code": "LM3200-15",
      "key": "lm3200-15",
      "nameKr": "레이크 블루",
      "nameCn": "湖蓝色",
      "nameEn": "Lake Blue",
      "hex": "#2D7795",
      "rgb": "45, 119, 149",
      "pantone": "7698 C 부근"
    },
    {
      "code": "LM3200-16",
      "key": "lm3200-16",
      "nameKr": "올리브 그린",
      "nameCn": "橄榄绿",
      "nameEn": "Olive Green",
      "hex": "#1D644B",
      "rgb": "29, 100, 75",
      "pantone": "7727 C 부근"
    },
    {
      "code": "LM3200-17",
      "key": "lm3200-17",
      "nameKr": "브라운 그레이",
      "nameCn": "咖灰色",
      "nameEn": "Brown Gray",
      "hex": "#463F39",
      "rgb": "70, 63, 57",
      "pantone": "7533 C 부근"
    }
  ],
  "QXX5200": [
    {
      "code": "QXX5200-02",
      "key": "qxx5200-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#0F1012",
      "rgb": "15, 16, 18",
      "pantone": "Black 6 C 부근"
    },
    {
      "code": "QXX5200-03",
      "key": "qxx5200-03",
      "nameKr": "아이보리",
      "nameCn": "米白色",
      "nameEn": "Ivory",
      "hex": "#ECE8D8",
      "rgb": "236, 232, 216",
      "pantone": "7527 C 부근"
    },
    {
      "code": "QXX5200-04",
      "key": "qxx5200-04",
      "nameKr": "라이트 그레이",
      "nameCn": "浅灰色",
      "nameEn": "Light Gray",
      "hex": "#E4E5E5",
      "rgb": "228, 229, 229",
      "pantone": "Cool Gray 1 C 부근"
    },
    {
      "code": "QXX5200-05",
      "key": "qxx5200-05",
      "nameKr": "카키",
      "nameCn": "卡其色",
      "nameEn": "Khaki",
      "hex": "#B9B19B",
      "rgb": "185, 177, 155",
      "pantone": "7534 C 부근"
    },
    {
      "code": "QXX5200-06",
      "key": "qxx5200-06",
      "nameKr": "멜란지",
      "nameCn": "麻灰",
      "nameEn": "Melange",
      "hex": "#A8AFAD",
      "rgb": "168, 175, 173",
      "pantone": "Cool Gray 6 C 부근"
    },
    {
      "code": "QXX5200-07",
      "key": "qxx5200-07",
      "nameKr": "카라멜",
      "nameCn": "焦糖色",
      "nameEn": "Caramel",
      "hex": "#C77F3B",
      "rgb": "199, 127, 59",
      "pantone": "7572 C 부근"
    },
    {
      "code": "QXX5200-08",
      "key": "qxx5200-08",
      "nameKr": "다크 그레이",
      "nameCn": "深灰色",
      "nameEn": "Dark Gray",
      "hex": "#2F3732",
      "rgb": "47, 55, 50",
      "pantone": "5605 C 부근"
    },
    {
      "code": "QXX5200-09",
      "key": "qxx5200-09",
      "nameKr": "네이비",
      "nameCn": "藏蓝",
      "nameEn": "Navy",
      "hex": "#0A1B2E",
      "rgb": "10, 27, 46",
      "pantone": "2965 C 부근"
    }
  ],
  "A23014": [
    {
      "code": "A23014-02",
      "key": "a23014-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#2A2B2B",
      "rgb": "42, 43, 43",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "A23014-03",
      "key": "a23014-03",
      "nameKr": "로즈 핑크",
      "nameCn": "蔷薇粉",
      "nameEn": "Rose Pink",
      "hex": "#E95A8A",
      "rgb": "233, 90, 138",
      "pantone": "1915 C 부근"
    },
    {
      "code": "A23014-04",
      "key": "a23014-04",
      "nameKr": "브라운",
      "nameCn": "咖啡色",
      "nameEn": "Brown",
      "hex": "#8B725F",
      "rgb": "139, 114, 95",
      "pantone": "7615 C 부근"
    },
    {
      "code": "A23014-05",
      "key": "a23014-05",
      "nameKr": "그레이",
      "nameCn": "灰色",
      "nameEn": "Gray",
      "hex": "#777878",
      "rgb": "119, 120, 120",
      "pantone": "Cool Gray 9 C 부근"
    },
    {
      "code": "A23014-06",
      "key": "a23014-06",
      "nameKr": "밀리터리 그린",
      "nameCn": "军绿色",
      "nameEn": "Military Green",
      "hex": "#5E604A",
      "rgb": "94, 96, 74",
      "pantone": "417 C 부근"
    }
  ],
  "3505": [
    {
      "code": "3505-02",
      "key": "3505-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#24262A",
      "rgb": "36, 38, 42",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "3505-03",
      "key": "3505-03",
      "nameKr": "아이보리",
      "nameCn": "米白色",
      "nameEn": "Ivory",
      "hex": "#E7DEDA",
      "rgb": "231, 222, 218",
      "pantone": "Warm Gray 1 C 부근"
    },
    {
      "code": "3505-04",
      "key": "3505-04",
      "nameKr": "로즈 핑크",
      "nameCn": "蔷薇粉",
      "nameEn": "Rose Pink",
      "hex": "#F02E75",
      "rgb": "240, 46, 117",
      "pantone": "1915 C 부근"
    },
    {
      "code": "3505-05",
      "key": "3505-05",
      "nameKr": "밀리터리 그린",
      "nameCn": "军绿色",
      "nameEn": "Military Green",
      "hex": "#6F765B",
      "rgb": "111, 118, 91",
      "pantone": "417 C 부근"
    },
    {
      "code": "3505-06",
      "key": "3505-06",
      "nameKr": "브라운",
      "nameCn": "咖啡色",
      "nameEn": "Brown",
      "hex": "#8A6656",
      "rgb": "138, 102, 86",
      "pantone": "7615 C 부근"
    },
    {
      "code": "3505-07",
      "key": "3505-07",
      "nameKr": "그레이",
      "nameCn": "灰色",
      "nameEn": "Gray",
      "hex": "#5F6562",
      "rgb": "95, 101, 98",
      "pantone": "Cool Gray 10 C 부근"
    }
  ],
  "3508": [
    {
      "code": "3508-02",
      "key": "3508-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#222429",
      "rgb": "34, 36, 41",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "3508-03",
      "key": "3508-03",
      "nameKr": "아이보리",
      "nameCn": "米白色",
      "nameEn": "Ivory",
      "hex": "#DCD8CF",
      "rgb": "220, 216, 207",
      "pantone": "Warm Gray 1 C 부근"
    },
    {
      "code": "3508-04",
      "key": "3508-04",
      "nameKr": "로즈 핑크",
      "nameCn": "蔷薇粉",
      "nameEn": "Rose Pink",
      "hex": "#E92D75",
      "rgb": "233, 45, 117",
      "pantone": "1915 C 부근"
    },
    {
      "code": "3508-05",
      "key": "3508-05",
      "nameKr": "그레이",
      "nameCn": "灰色",
      "nameEn": "Gray",
      "hex": "#6F7271",
      "rgb": "111, 114, 113",
      "pantone": "Cool Gray 9 C 부근"
    },
    {
      "code": "3508-06",
      "key": "3508-06",
      "nameKr": "브라운",
      "nameCn": "咖啡色",
      "nameEn": "Brown",
      "hex": "#76685E",
      "rgb": "118, 104, 94",
      "pantone": "7615 C 부근"
    },
    {
      "code": "3508-07",
      "key": "3508-07",
      "nameKr": "밀리터리 그린",
      "nameCn": "军绿色",
      "nameEn": "Military Green",
      "hex": "#626655",
      "rgb": "98, 102, 85",
      "pantone": "417 C 부근"
    }
  ],
  "CK280": [
    {
      "code": "CK280-02",
      "key": "ck280-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#151619",
      "rgb": "21, 22, 25",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "CK280-03",
      "key": "ck280-03",
      "nameKr": "그레이",
      "nameCn": "灰色",
      "nameEn": "Gray",
      "hex": "#8F8F8D",
      "rgb": "143, 143, 141",
      "pantone": "Cool Gray 8 C 부근"
    }
  ],
  "LK3401": [
    {
      "code": "LK3401-02",
      "key": "lk3401-02",
      "nameKr": "블랙",
      "nameCn": "黑色",
      "nameEn": "Black",
      "hex": "#25252B",
      "rgb": "37, 37, 43",
      "pantone": "Black 7 C 부근"
    },
    {
      "code": "LK3401-03",
      "key": "lk3401-03",
      "nameKr": "그레이",
      "nameCn": "灰色",
      "nameEn": "Gray",
      "hex": "#C6C6C2",
      "rgb": "198, 198, 194",
      "pantone": "Cool Gray 3 C 부근"
    }
  ]
};

const productColorAliases = {
  "7001-KIDS": "7001(아동)",
  "7001-LS": "7001(긴팔)",
  "0E2700": "OE2700"
};

const productColorImageFolders = {
  "0E2700": "OE2700"
};

const colorJapaneseNames = {
  "Angola Red": "アンゴラレッド",
  "Antler Brown": "アントラーブラウン",
  "Aqua": "アクア",
  "Aqua Blue": "アクアブルー",
  "Athens White": "アテネホワイト",
  "Avocado Green": "アボカドグリーン",
  "Balenciaga Blue": "バレンシアガブルー",
  "Bamboo Green": "バンブーグリーン",
  "Beige": "ベージュ",
  "Birch Beige": "バーチベージュ",
  "Black": "ブラック",
  "Blossom Pink": "ブロッサムピンク",
  "Blue": "ブルー",
  "Blue Gray": "ブルーグレー",
  "Brick Red": "ブリックレッド",
  "Brown": "ブラウン",
  "Brown Gray": "ブラウングレー",
  "Burgundy": "バーガンディ",
  "Canola Green": "カノーラグリーン",
  "Caramel": "キャラメル",
  "Charcoal Brown": "チャコールブラウン",
  "Cherry Blossom Pink": "チェリーブロッサムピンク",
  "Classic Black": "クラシックブラック",
  "Coffee": "コーヒー",
  "Coral": "コーラル",
  "Dark Brown": "ダークブラウン",
  "Dark Gray": "ダークグレー",
  "Dark Green": "ダークグリーン",
  "Dark Navy": "ダークネイビー",
  "Deep Melange": "ディープメランジ",
  "Deep Purple": "ディープパープル",
  "Dragon Fruit": "ドラゴンフルーツ",
  "Earth Tone": "アーストーン",
  "Egg Yellow": "エッグイエロー",
  "Emerald Green": "エメラルドグリーン",
  "Forest Green": "フォレストグリーン",
  "Ginger Yellow": "ジンジャーイエロー",
  "Grass Green": "グラスグリーン",
  "Gray": "グレー",
  "Gray Green": "グレーグリーン",
  "Gray Purple": "グレーパープル",
  "Indigo Blue": "インディゴブルー",
  "Ivory": "アイボリー",
  "Khaki": "カーキ",
  "Khaki Brown": "カーキブラウン",
  "Khaki Green": "カーキグリーン",
  "Lake Blue": "レイクブルー",
  "Lavender": "ラベンダー",
  "Lemon Yellow": "レモンイエロー",
  "Light Camel": "ライトキャメル",
  "Light Gray": "ライトグレー",
  "Light Green": "ライトグリーン",
  "Light Purple": "ライトパープル",
  "Light Yellow": "ライトイエロー",
  "Linen Beige": "リネンベージュ",
  "Maple Red": "メープルレッド",
  "Melange": "メランジ",
  "Melon Orange": "メロンオレンジ",
  "Military Green": "ミリタリーグリーン",
  "Mint": "ミント",
  "Mint Gray": "ミントグレー",
  "Mint Green": "ミントグリーン",
  "Mustard": "マスタード",
  "Navy": "ネイビー",
  "Navy Blue": "ネイビーブルー",
  "Off White": "オフホワイト",
  "Olive Green": "オリーブグリーン",
  "Orange": "オレンジ",
  "Papaya Orange": "パパイヤオレンジ",
  "Peacock Blue": "ピーコックブルー",
  "Pink": "ピンク",
  "Purple": "パープル",
  "Red": "レッド",
  "Rose Pink": "ローズピンク",
  "Rose Red": "ローズレッド",
  "Royal Blue": "ロイヤルブルー",
  "Sand Gray": "サンドグレー",
  "Seagull Gray": "シーガルグレー",
  "Sky Blue": "スカイブルー",
  "Smog Blue": "スモッグブルー",
  "Smoky Beige": "スモーキーベージュ",
  "Tiffany": "ティファニーグリーン",
  "Vintage Blue": "ヴィンテージブルー",
  "Washed Black": "ウォッシュドブラック",
  "Washed Grey": "ウォッシュドグレー",
  "White": "ホワイト",
  "White Tea Beige": "ホワイトティーベージュ",
  "Wine": "ワイン"
};

function getColorNameJa(color) {
  return colorJapaneseNames[color.nameEn] || color.nameEn || color.nameKr || "";
}

function toCamelColorName(name) {
  const words = String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words.map((word, index) => (
    index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
  )).join("");
}

function colorImageFallbacks(folder, code, color) {
  const base = `images/products/${folder}`;
  const colorBase = `${base}/colors`;
  const camelName = toCamelColorName(color.nameEn);
  const names = [camelName];

  if (camelName.includes("Gray")) names.push(camelName.replace(/Gray/g, "Grey"));
  if (camelName === "royalBlue") names.push("loyalBlue");

  return [...new Set(names.filter(Boolean))].flatMap((name) => [
    `${colorBase}/${folder}-${name}.jpg`,
    `${base}/${folder}-${name}.jpg`,
    `${colorBase}/${code}-${name}.jpg`,
    `${base}/${code}-${name}.jpg`
  ]);
}

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
  ["T210", "210G 아이스 실크 코튼 반팔 티셔츠", "冰丝棉短袖T恤", "210G Ice Silk Cotton Blend T-Shirt", "Short Sleeve", "Regular Fit", "Cotton 40% Rayon 40% Polyester 20%", "210G", "topS5", "t210", 6, []],
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
  const base = `images/products/${code}`;
  return {
    main: `${base}/${code}-front.jpg`,
    front: `${base}/${code}-front.jpg`,
    back: `${base}/${code}-back.jpg`,
    model: [`${base}/${code}-model-01.jpg`, `${base}/${code}-model-02.jpg`],
    detail: [`${base}/${code}-detail-01.jpg`, `${base}/${code}-detail-02.jpg`, `${base}/${code}-detail-03.jpg`, `${base}/${code}-detail-04.jpg`, `${base}/${code}-detail-05.jpg`],
    fabric: [],
    colorChart: `${base}/${code}-color-chart.jpg`,
    guide: `${code} ${name} 앞면, 뒷면, 확대컷, 컬러별 이미지입니다.`
  };
}

const productImageOverrides = {
  "01oa1": {
    thumbnail: "images/products/01OA1/01OA1-front.jpg",
    images: ["images/products/01OA1/01OA1-front.jpg"],
    imageSlots: {
      main: "images/products/01OA1/01OA1-front.jpg",
      front: "images/products/01OA1/01OA1-front.jpg",
      back: "images/products/01OA1/01OA1-back.jpg",
      model: [],
      detail: [
        "images/products/01OA1/01OA1-detail-01.jpg",
        "images/products/01OA1/01OA1-detail-02.jpg",
        "images/products/01OA1/01OA1-detail-03.jpg",
        "images/products/01OA1/01OA1-detail-04.jpg",
        "images/products/01OA1/01OA1-detail-05.jpg"
      ],
      fabric: [],
      colorChart: ""
    }
  },
  "t210": {
    thumbnail: "images/products/T210/T210-front.jpg",
    images: ["images/products/T210/T210-front.jpg"],
    imageSlots: {
      main: "images/products/T210/T210-front.jpg",
      front: "images/products/T210/T210-front.jpg",
      back: "images/products/T210/T210-back.jpg",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/T210/T210-front.jpg"
    }
  },
  "03xa5": {
    thumbnail: "images/products/03XA5/03XA5-front.jpg",
    images: ["images/products/03XA5/03XA5-front.jpg"],
    imageSlots: {
      main: "images/products/03XA5/03XA5-front.jpg",
      front: "images/products/03XA5/03XA5-front.jpg",
      back: "images/products/03XA5/03XA5-back.jpg",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/03XA5/03XA5-front.jpg"
    }
  },
  "o3000": {
    thumbnail: "images/products/O3000/O3000-front.jpg",
    images: ["images/products/O3000/O3000-front.jpg"],
    imageSlots: {
      main: "images/products/O3000/O3000-front.jpg",
      front: "images/products/O3000/O3000-front.jpg",
      back: "images/products/O3000/O3000-back.jpg",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/O3000/O3000-front.jpg"
    }
  },
  "7001": {
    thumbnail: "images/products/7001/7001-front.jpg",
    images: ["images/products/7001/7001-front.jpg"],
    imageSlots: {
      main: "images/products/7001/7001-front.jpg",
      front: "images/products/7001/7001-front.jpg",
      back: "images/products/7001/7001-back.jpg",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/7001/7001-front.jpg"
    }
  },
  "23012": {
    thumbnail: "images/products/23012/23012-front.jpg",
    images: ["images/products/23012/23012-front.jpg"],
    imageSlots: {
      main: "images/products/23012/23012-front.jpg",
      front: "images/products/23012/23012-front.jpg",
      back: "images/products/23012/23012-back.jpg",
      model: [],
      detail: [],
      fabric: [],
      colorChart: "images/products/23012/23012-front.jpg"
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
  let imageSlots = override ? { ...slots, ...override.imageSlots } : slots;
  imageSlots = {
    ...imageSlots,
    detail: imageSlots.detail && imageSlots.detail.length ? imageSlots.detail : slots.detail,
    fabric: imageSlots.fabric && imageSlots.fabric.length ? imageSlots.fabric : []
  };
  const excelColorRows = productColorData[productColorAliases[code] || code];
  const colorImageFolder = productColorImageFolders[code] || code;
  const colors = excelColorRows ? excelColorRows.map((color, index) => {
    const colorNumber = String(color.code || "").split("-").pop() || String(index + 1).padStart(2, "0");
    return {
      ...color,
      nameJa: color.nameJa || getColorNameJa(color),
      image: `images/products/${colorImageFolder}/colors/${colorImageFolder}-${colorNumber}.jpg`,
      fallbackImages: colorImageFallbacks(colorImageFolder, code, color)
    };
  }) : colorSets[colorSetKey].map((key) => ({
    key,
    code: `${code}-${key}`,
    ...colorLibrary[key],
    nameJa: getColorNameJa(colorLibrary[key]),
    image: `images/products/${code}/colors/${code}-${key}.jpg`,
    fallbackImages: [`images/products/${code}/${code}-${key}.jpg`]
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
    description: `${code} 제품으로 PDF 카탈로그 기준으로 모델 착용컷, 제품 앞면과 뒷면, 확대 디테일, 색상표를 함께 보여주는 상세 페이지입니다.`,
    thumbnail: override?.thumbnail || slots.main,
    images: override?.images || [slots.front, slots.back, ...slots.model, ...slots.detail, ...slots.fabric],
    imageSlots,
    colors,
    sizeFields: sizeTemplates[sizeKey].sizeFields,
    sizes: sizeTemplates[sizeKey].sizes,
    details: [
      { title: "Catalog Source", text: `PDF 카탈로그 ${pdfPage}페이지 기준 제품입니다.` },
      { title: "Image Plan", text: "앞면, 뒷면, 색상, 상세 확대 이미지를 포함했습니다." },
      { title: "Color Language", text: "색상명은 한국어, 중국어, 영어, 일본어를 함께 노출하도록 구성했습니다." }
    ]
  };
});

window.products = products;
window.catalogSummary = {
  companyName: "(주)티월드코리아",
  tel: "010-3585-4450",
  address: "경기도 구리시 갈매순환로166번길 46, 금강펜테리움 IX센터 B코어 8층 08-081호",
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
