// Run with a static preview at http://127.0.0.1:4173. Uses fictional test-only inputs.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}}), page=await context.newPage(),errors=[],orderRequests=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{if(/\/orders(?:\/verify)?(?:\?|$)/.test(request.url()))orderRequests.push(request.url());});
 await page.goto('http://127.0.0.1:4173/order.html');
 await page.getByLabel('주문코드',{exact:true}).fill('0000');await page.getByRole('button',{name:'입장하기'}).click();await page.getByText(/시연용 주문코드를 확인/).waitFor();
 await page.getByLabel('주문코드',{exact:true}).fill('9876');await page.getByRole('button',{name:'입장하기'}).click();
 await page.getByRole('tab',{name:'주문하기'}).click();await page.locator('#order-product').selectOption('TH5611');
 await page.getByLabel('S 주문 수량',{exact:true}).fill('12');await page.getByRole('button',{name:'주문서에 담기'}).click();assert.equal(await page.locator('#order-total').innerText(),'12장');
 await page.locator('#order-date-open').click();const date=page.locator('#calendar-days button:not([disabled])').last();const selected=await date.getAttribute('data-date');await date.click();assert.equal(await page.locator('#order-date').inputValue(),selected);
 await page.getByRole('radio',{name:/새 배송지/}).check();await page.getByLabel('수령인 이름').fill('시연 수령인');await page.getByLabel('연락처',{exact:false}).fill('000-0000-0000');
 await page.getByLabel('우편번호',{exact:false}).fill('00000');await page.getByLabel('기본 주소').fill('시연용 주소 · 실제 배송 금지');
 await page.locator('#order-agree').check();await page.getByRole('button',{name:'주문 확인',exact:false}).click();await page.locator('#statement-dialog').waitFor();
 assert.ok((await page.locator('#statement-document').innerText()).includes('단가 확인 후 안내'));
 await page.getByRole('button',{name:'시연 내역에 추가'}).click();await page.getByRole('button',{name:'거래명세서 보기'}).waitFor();
 await page.getByRole('tab',{name:'문의하기'}).click();await page.getByLabel('문의 내용').fill('시연용 상품 문의');await page.getByRole('button',{name:'시연 문의 남기기'}).click();await page.getByText('현재 화면의 시연 내역에 추가했습니다.',{exact:false}).waitFor();
 const stored=await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}));assert.ok(!stored.includes('시연 수령인'));assert.ok(!stored.includes('시연용 상품 문의'));assert.deepEqual(orderRequests,[]);
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.reload();await page.getByLabel('주문코드',{exact:true}).waitFor();assert.equal(await page.locator('#partner-app').isVisible(),false);assert.deepEqual(errors,[]);
 console.log('PASS: partner gate, quantity/date/address/statement, memory-only history and inquiry, no order requests, mobile layout.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
