import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const script=readFileSync(new URL('../js/member-session.js',import.meta.url),'utf8');
const settle=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
test('catalog hides My Page until approved login and refreshes after returning without copying cookies',async()=>{
  const mypage=[{hidden:false},{hidden:false}],login=[{hidden:false}],signup=[{hidden:false}],events={},pageEvents={},calls=[];
  const document={hidden:false,querySelectorAll:s=>s==='.nav-mypage'?mypage:[...login,...signup],addEventListener:(name,fn)=>{events[name]=fn;}};
  const window={addEventListener:(name,fn)=>{pageEvents[name]=fn;},dispatchEvent(){}};
  let now=10000,signedIn=true,fail=false;
  vm.runInNewContext(script,{document,window,CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},Date:{now:()=>now},AbortController,setTimeout:()=>1,clearTimeout(){},fetch:async(url,options)=>{calls.push({url,options});if(fail)throw Error('offline');return {ok:true,json:async()=>({signedIn})};}});
  assert(mypage.every(n=>n.hidden));pageEvents.pageshow();pageEvents.focus();assert.equal(calls.length,1);
  await settle();assert(mypage.every(n=>!n.hidden));assert(login[0].hidden&&signup[0].hidden);
  assert.equal(calls[0].url,'https://members.tworldkorea.co.kr/account/shop/api/session');assert.equal(calls[0].options.credentials,'include');assert.equal(calls[0].options.cache,'no-store');assert(!calls[0].options.headers);
  signedIn=false;now+=5000;await pageEvents.pageshow();assert(mypage.every(n=>n.hidden));assert(!login[0].hidden&&!signup[0].hidden);
  signedIn='true';now+=5000;await pageEvents.focus();assert(mypage.every(n=>n.hidden));
  document.hidden=true;now+=5000;const before=calls.length;await events.visibilitychange();assert.equal(calls.length,before);
  document.hidden=false;fail=true;now+=5000;await events.visibilitychange();assert(mypage.every(n=>n.hidden));
  assert(!script.includes('localStorage')&&!script.includes('document.cookie')&&!script.includes('setInterval'));
});
test('every public navigation hides My Page initially and allows only the fixed member origin',()=>{
  for(const name of ['index','about','products','lookbook','contact','product-detail']){
    const html=readFileSync(new URL('../'+name+'.html',import.meta.url),'utf8');
    const links=html.match(/<a class="nav-mypage"[^>]*>/g)||[];assert(links.length>0,name);assert(links.every(v=>v.includes(' hidden')),name);
    assert(html.includes('js/member-session.js?v=20261102-inline-order'),name);
    assert(html.includes('js/member-shopping.js?v=20261102-inline-order'),name);
    const mapSource=name==='contact'?'https://www.google.com/maps/embed':'https://map.naver.com';
    assert(html.includes('frame-src '+mapSource+' https://members.tworldkorea.co.kr;'),name);
    assert(html.includes("connect-src 'self' https://members.tworldkorea.co.kr;"),name);
    assert(!html.includes('js/inventory.js')&&!html.includes('stock-keyword'),name);
  }
});
