import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const script=readFileSync(new URL('../js/main.js',import.meta.url),'utf8');
const productsScript=readFileSync(new URL('../data/products.js',import.meta.url),'utf8');
test('legacy orders forward bounded product codes without downloading the catalog',()=>{
  const orderPage=readFileSync(new URL('../order.html',import.meta.url),'utf8');
  assert(!orderPage.includes('data/products.js'));
  for(const file of ['member-order-redirect.js','order.js']){
    const redirect=readFileSync(new URL('../js/'+file,import.meta.url),'utf8');
    for(const [search,expected] of [['',''],['?product=01OA1','01OA1'],['?product=qxk2521','qxk2521'],['?product=https://invalid.test/','']]){
      let target;const location={pathname:'/order.html',search,replace(url){target=new URL(url);}};
      vm.runInNewContext(redirect,{location,URL,URLSearchParams,document:{querySelector(){return {};}}});
      assert.equal(target.origin,'https://members.tworldkorea.co.kr');
      assert.equal(target.pathname,'/account/shop');assert.equal(target.searchParams.get('product')||'',expected);
    }
  }
});
test('every product renders member order links without sample basket or anonymous stock controls',()=>{
  const catalog={window:{}};vm.runInNewContext(productsScript,catalog);
  for(const product of catalog.window.products){
    const mount={dataset:{},classList:{add(){}},innerHTML:'',querySelectorAll(){return [];},querySelector(){return null;}};
    const header={classList:{toggle(){}}};
    const location=new URL('https://www.tworldkorea.co.kr/product-detail.html?id='+encodeURIComponent(product.code));
    const document={body:{dataset:{page:'product-detail'}},documentElement:{style:{}},querySelector(s){return s==='[data-product-detail]'?mount:s==='[data-header]'?header:null;},querySelectorAll(){return [];}};
    const window={products:catalog.window.products,location,addEventListener(){},scrollY:0};window.self=window;window.top=window;
    vm.runInNewContext(script,{window,document,location,URL,URLSearchParams,navigator:{}});
    assert(mount.innerHTML.includes('/account/login?next='+encodeURIComponent('https://www.tworldkorea.co.kr/product-detail.html?id='+encodeURIComponent(product.code)+'#order')),product.code);
    assert(mount.innerHTML.includes('data-member-product="'+product.code+'"'),product.code);
    assert(mount.innerHTML.includes('주문하기'));assert(mount.innerHTML.includes('재고 확인'));
    assert(!mount.innerHTML.includes('샘플 담기'));assert(!mount.innerHTML.includes('data-stock'));
    assert(!mount.innerHTML.includes(product.nameCn), `${product.code}: Chinese product title must not render`);
    const sizeTable=mount.innerHTML.match(/<table class="size-table">[\s\S]*?<\/table>/)[0];
    assert(!/[\u3400-\u9fff]/.test(sizeTable), `${product.code}: size headings must not contain Chinese`);
    assert(mount.innerHTML.includes('lang="zh" translate="no"'), `${product.code}: Chinese color names must remain`);
  }
  const detail=readFileSync(new URL('../product-detail.html',import.meta.url),'utf8');assert(!detail.includes('js/inventory.js'));assert(!script.includes('localStorage'));
});
