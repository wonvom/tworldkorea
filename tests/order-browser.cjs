// Run with a static preview at http://127.0.0.1:4173. Uses fictional test-only inputs.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}}), page=await context.newPage(),errors=[],orderRequests=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{if(/\/orders(?:\/verify)?(?:\?|$)/.test(request.url()))orderRequests.push(request.url());});
 // Isolated browser fixtures: no real credentials, customer data or live requests.
 await page.route('https://tworld-inventory-api.halestork64.chatgpt.site/**',async route=>{
  const url=new URL(route.request().url()),headers={'Access-Control-Allow-Origin':'*','Content-Type':'application/json'};
  if(url.pathname==='/stock/partner-auth'){
   const valid=route.request().postDataJSON()?.code==='9876';
   await route.fulfill({status:valid?200:401,headers,body:JSON.stringify(valid?{token:'isolated-browser-fixture',expiresAt:Date.now()+3600000,demo:true}:{error:'Invalid partner code'})});return;
  }
  if(url.pathname==='/stock'){await route.fulfill({status:200,headers,body:JSON.stringify({product:url.searchParams.get('product'),availability:'inquiry',variants:[]})});return;}
  throw Error('Unexpected request: '+url.pathname);
 });
 await page.goto('http://127.0.0.1:4173/order.html');
 await page.getByLabel('회원코드',{exact:true}).fill('0000');await page.getByRole('button',{name:'입장하기'}).click();await page.getByText(/회원코드를 확인해주세요/).waitFor();
 await page.getByLabel('회원코드',{exact:true}).fill('9876');await page.getByRole('button',{name:'입장하기'}).click();
 await page.getByRole('tab',{name:'주문하기'}).click();assert.equal(await page.locator('#order-date, #delivery-memo, #date-dialog').count(),0);await page.locator('#order-product').selectOption('TH5611');
 await page.getByLabel('화이트 S 주문 수량',{exact:true}).fill('12');await page.getByLabel('블랙 M 주문 수량',{exact:true}).fill('8');assert.equal(await page.locator('#stock-dialog').count(),0);await page.getByRole('button',{name:'주문서에 담기'}).click();assert.equal(await page.locator('#order-total').innerText(),'20장');
 await page.getByRole('radio',{name:/새 배송지/}).check();await page.getByLabel('수령인 이름').fill('시연 수령인');await page.getByLabel('연락처',{exact:false}).fill('000-0000-0000');
 await page.getByLabel('우편번호',{exact:false}).fill('00000');await page.getByLabel('기본 주소').fill('시연용 주소 · 실제 배송 금지');
 await page.locator('#order-agree').check();await page.getByRole('button',{name:'주문 확인',exact:false}).click();await page.locator('#statement-dialog').waitFor();
 const statement=await page.locator('#statement-document').innerText();assert.ok(statement.includes('단가 확인 후 안내'));assert.doesNotMatch(statement,/배송 희망일|요청사항/);
 await page.getByRole('button',{name:'시연 내역에 추가'}).click();await page.getByRole('button',{name:'거래명세서 보기'}).waitFor();
 await page.getByRole('tab',{name:'문의하기'}).click();await page.getByLabel('문의 내용').fill('시연용 상품 문의');await page.getByRole('button',{name:'시연 문의 남기기'}).click();await page.getByText('현재 화면의 시연 내역에 추가했습니다.',{exact:false}).waitFor();
 const stored=await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}));assert.ok(!stored.includes('시연 수령인'));assert.ok(!stored.includes('시연용 상품 문의'));assert.deepEqual(orderRequests,[]);
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.reload();await page.getByLabel('회원코드',{exact:true}).waitFor();assert.equal(await page.locator('#partner-app').isVisible(),false);assert.deepEqual(errors,[]);
 console.log('PASS: partner gate, quantity/address/statement, memory-only history and inquiry, no order requests, mobile layout.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
