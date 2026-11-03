import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const script=readFileSync(new URL('../js/member-session.js',import.meta.url),'utf8');
const settle=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
test('catalog navigation delegates one shared idle session and exposes explicit logout only after login',async()=>{
  const mypage=[{hidden:false}],login=[{hidden:false}],signup=[{hidden:false}],greeting={hidden:false,textContent:''},events={},navigation=[];
  const logout={hidden:false,addEventListener:(_name,fn)=>{events.logout=fn;}};
  const document={querySelectorAll:s=>s==='.nav-mypage'?mypage:s==='.nav-logout'?[logout]:s==='.nav-greeting'?[greeting]:[...login,...signup]};
  let options,refreshed=0,loggedOut=0,confirmation=false;const prompts=[];
  const window={confirm:message=>{prompts.push(message);return confirmation;},location:{assign:url=>navigation.push(url)},addEventListener:(name,fn)=>{events[name]=fn;},dispatchEvent(){}};
  vm.runInNewContext(script.replace(/^import[^\n]+\n/,''),{document,window,CustomEvent:class{},startMemberActivity:value=>{options=value;return {refresh(){refreshed++;},async logout(){loggedOut++;options.onSession(false);options.onExpire();}};}});
  assert(mypage[0].hidden&&logout.hidden);
  options.onSession(true);assert(!mypage[0].hidden&&!logout.hidden);assert(login[0].hidden&&signup[0].hidden);
  options.onSession(true,{displayName:'가상 직원',canOrder:false});assert.equal(greeting.textContent,'가상 직원님 반갑습니다.');assert(!greeting.hidden);assert.equal(window.TworldMemberCanOrder,false);
  options.onSession(true,{displayName:'<img onerror=alert(1)>',canOrder:true});assert.equal(greeting.textContent,'<img onerror=alert(1)>님 반갑습니다.');assert.equal(greeting.innerHTML,undefined);
  assert.equal(options.endpoint,'https://members.tworldkorea.co.kr/account/shop/api/session');
  events.pageshow();assert.equal(refreshed,1);
  await events.logout();assert.equal(loggedOut,0);assert(!logout.hidden&&!logout.disabled);assert.equal(navigation.length,0);
  confirmation=true;await events.logout();assert.equal(loggedOut,1);assert(logout.hidden&&mypage[0].hidden);assert.deepEqual(prompts,['로그아웃하시겠습니까?','로그아웃하시겠습니까?']);
  assert.equal(navigation.at(-1),'https://members.tworldkorea.co.kr/account/login?expired=1');
  assert(greeting.hidden);assert.equal(greeting.textContent,'');
  assert(!script.includes('localStorage')&&!script.includes('document.cookie'));
  assert.equal(readFileSync(new URL('../js/member-activity.js',import.meta.url),'utf8'),readFileSync(new URL('../../tworld-inventory-api/lib/member-activity.mjs',import.meta.url),'utf8'));
});
test('every public navigation hides My Page initially and allows only the fixed member origin',()=>{
  for(const name of ['index','about','products','lookbook','contact','product-detail']){
    const html=readFileSync(new URL('../'+name+'.html',import.meta.url),'utf8');
    const links=html.match(/<a class="nav-mypage"[^>]*>/g)||[];assert(links.length>0,name);assert(links.every(v=>v.includes(' hidden')),name);
    assert(html.includes('type="module" src="js/member-session.js?v=20261103-staff-greeting"'),name);
    assert(html.includes('js/member-shopping.js?v=20261103-staff-greeting'),name);
    const nav=html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/)[0];
    const order=['index.html','products.html','lookbook.html','about.html','contact.html','https://members.tworldkorea.co.kr/account'];
    assert.deepEqual([...nav.matchAll(/<a(?: class="nav-mypage")? href="([^"]+)"/g)].map(v=>v[1]),order);
    assert(nav.includes('class="nav-logout" type="button" hidden'));
    assert(nav.indexOf('class="nav-mypage"')<nav.indexOf('class="nav-greeting"'));
    assert(nav.indexOf('class="nav-greeting"')<nav.indexOf('class="nav-logout"'));
    const mapSource=name==='contact'?'https://www.google.com/maps/embed':'https://map.naver.com';
    assert(html.includes('frame-src '+mapSource+' https://members.tworldkorea.co.kr;'),name);
    assert(html.includes("connect-src 'self' https://members.tworldkorea.co.kr;"),name);
    assert(!html.includes('js/inventory.js')&&!html.includes('stock-keyword'),name);
  }
});
