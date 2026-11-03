import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const file=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');

test('catalogue card keeps the approved-member price in the photo and separate from model text',()=>{
  const source=file('js/main.js');
  const code=source.slice(source.indexOf('  function productCard('),source.indexOf('  function renderFeaturedProducts('));
  const html=vm.runInNewContext(code+';productCard(product)',{
    product:{code:'01OA1',name:'TEST PRODUCT',category:'tee',thumbnail:'test.webp',fit:'Regular',fabric:'Cotton',weight:'230G',colors:[]},
    categoryLabel:()=>({kr:'반팔'}),isCustomOrderProduct:()=>false,escapeHtml:String,assetUrl:String,encodeURIComponent
  });
  assert.match(html,/member-start-price[^>]*hidden><\/span>\s*<\/span>/);
  assert(!html.match(/<p class="product-code">[\s\S]*?member-start-price[\s\S]*?<\/p>/));
  assert.match(source,/data-main-product-image>\s*<span class="member-start-price"/);
  assert(!source.match(/<p class="product-detail-code">[^\n]*member-start-price/));
});

test('photo price uses neutral bottom-right styling and fresh asset versions on every public page',()=>{
  const css=file('css/member-shopping.css');
  assert(css.includes('.member-start-price{position:absolute;right:12px;bottom:12px'));
  assert(css.includes('max-width:calc(100% - 24px)'));
  assert(css.includes('@media(max-width:600px){.member-start-price'));
  assert(!css.includes('#286647'));
  for(const name of ['index','products','product-detail','about','lookbook','contact']){
    const html=file(name+'.html');
    assert(html.includes('css/member-shopping.css?v=20261103-monochrome-photo'));
    assert(html.includes('js/main.js?v=20261103-monochrome-photo'));
  }
});
