# T-WORLD KOREA Image Placement Guide

PDF 카탈로그를 기준으로 웹사이트는 제품별 이미지 폴더를 따로 두는 구조로 정리했습니다.

## Company Images

아래 파일명으로 넣으면 HOME과 ABOUT에서 바로 연결됩니다.

- `images/hero/hero-01.jpg` 메인 첫 화면 모델 또는 원단 이미지
- `images/models/model-01.jpg` 메인 보조 모델 이미지
- `images/company/china-factory.jpg` 중국 본사 공장 전경
- `images/company/china-knitting.jpg` 제직 이미지
- `images/company/china-dyeing.jpg` 염색 이미지
- `images/company/china-cutting.jpg` 재단 이미지
- `images/company/china-sewing.jpg` 봉제 이미지
- `images/company/china-warehouse.jpg` 중국 창고 이미지
- `images/company/china-showroom.jpg` 중국 쇼룸 이미지
- `images/company/korea-warehouse.jpg` 한국 지사 창고 전경
- `images/company/korea-showroom.jpg` 한국 쇼룸 이미지
- `images/lookbook/lookbook-01.jpg`부터 `images/lookbook/lookbook-07.jpg` 모델 착용 룩북 이미지

## Product Folder Rule

제품별 이미지는 아래 패턴으로 넣으면 됩니다.

```text
images/products/제품id/
├── 제품id-front.jpg
├── 제품id-back.jpg
├── 제품id-model-01.jpg
├── 제품id-model-02.jpg
├── 제품id-detail-01.jpg
├── 제품id-detail-02.jpg
├── 제품id-fabric-01.jpg
├── 제품id-color-chart.jpg
└── colors/
    └── 제품id-colorKey.jpg
```

예시:

```text
images/products/010a1/010a1-front.jpg
images/products/010a1/010a1-back.jpg
images/products/010a1/010a1-model-01.jpg
images/products/010a1/010a1-detail-01.jpg
images/products/010a1/010a1-fabric-01.jpg
images/products/010a1/colors/010a1-white.jpg
images/products/010a1/colors/010a1-black.jpg
```

## Product IDs

상세 페이지와 이미지 폴더는 아래 ID를 사용합니다.

- `010a1` 010A1 20수 230G 헤비웨이트 세미 드롭숄더 티셔츠
- `7001-ss` 7001 24수 180G 코마 면 티셔츠
- `03xa5` 03XA5 16수 250G 세미 와이드 트렌디 티셔츠
- `t210` T210 210G 실크 코튼 반팔 티셔츠
- `03000` 03000 13수 300G 순면 오버사이즈 루즈핏 티셔츠
- `23012` 23012 20수 230G 빈티지 워싱 티셔츠
- `27012` 27012 16수 270G 빈티지 워싱 티셔츠
- `s2000` S2000 210G 순면 여성 크롭 티셔츠
- `08vs30` 08VS30 20수 230G 순면 민소매 나시
- `2403` 2403 240G 여성 워싱 나시
- `2406` 2406 200G 여성 크롭 티셔츠
- `2405` 2405 240G 여성 워싱 티셔츠
- `2408` 2408 200G 여성 슬림핏 티셔츠
- `3053` 3053 60수 250G 반팔 티셔츠
- `7001-kids` 7001 24수 180G 코마 면 키즈 티셔츠
- `t160` T160 190G 코튼 터치 반팔 티셔츠
- `q2000` Q2000 21수 200G 산뜻한 컬러 티셔츠
- `hp004` HP004 220G 베이직 나시
- `7001-ls` 7001 24수 180G 코마 면 긴팔 티셔츠
- `qxk2521` QXK2521 21수 230G 순면 긴팔 티셔츠
- `06olk` 06OLK 21수 230G 립 소매 긴팔 티셔츠
- `q2450` Q2450 16수 260G 어깨라인 루즈핏 순면 긴팔 티셔츠
- `0e2700` 0E2700 270G 순면 크루넥 맨투맨
- `yl2800` YL2800 280G 맨투맨
- `yl3200` YL3200 320G 맨투맨
- `lm2800` LM2800 280G 맨투맨
- `lm3200` LM3200 320G 맨투맨
- `qxx5200` QXX5200 480G 후드티
- `a23014` A23014 230G 워싱 긴팔 티셔츠
- `3505` 3505 350G 워싱 맨투맨
- `3508` 3508 350G 워싱 후드티
- `ck280` CK280 280G 스웨트팬츠
- `lk3401` LK3401 340G 기모 조거팬츠

## Color Names

색상명은 `data/products.js`의 `colorLibrary`에서 관리합니다.

각 색상은 아래처럼 한국어, 중국어, 영어, HEX 값을 함께 갖습니다.

```js
white: {
  nameKr: "화이트",
  nameCn: "白色",
  nameEn: "White",
  hex: "#F7F4EE"
}
```

실제 컬러명이 PDF와 다를 경우 `colorLibrary`의 이름을 수정하면 모든 제품 상세 페이지에 반영됩니다.
