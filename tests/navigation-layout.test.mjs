import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('all public pages load the larger, roomier navigation assets together',()=>{
  for(const name of ['index','products','lookbook','about','contact','product-detail']){
    const html=read(name+'.html');
    for(const stylesheet of ['member-session','member-shopping','style'])assert(html.includes(`css/${stylesheet}.css?v=${stylesheet==='member-session'?'20261103-mobile-auth':'20261103-roomy-nav'}`),name+' '+stylesheet);
  }
  const session=read('css/member-session.css');
  assert.match(session,/\.site-header \.site-nav\{[^}]*font-size:14px;[^}]*gap:30px/);
  assert.match(session,/\.site-header \.nav-mypage\{padding-left:30px/);
});

test('mobile account actions follow the product menus with a black login above signup',()=>{
  const css=read('css/member-session.css');
  assert.match(css,/@media\(max-width:1280px\)\{\s*\.site-header \.site-nav > a\.nav-login/);
  assert.match(css,/\.site-header \.site-nav > a\.nav-login\{margin-top:20px;background:#111;color:#fff;font-weight:600\}/);
  assert.match(css,/\.site-header \.site-nav > a\.nav-signup\{margin-top:10px;background:#fff;color:#111\}/);
  for(const name of ['index','products','lookbook','about','contact','product-detail']){
    const nav=read(name+'.html').match(/<nav class="site-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
    assert(nav.indexOf('href="contact.html"')<nav.indexOf('class="nav-login"'),name+' account actions are separate from product navigation');
    assert(nav.indexOf('class="nav-login"')<nav.indexOf('class="nav-signup"'),name+' login precedes signup');
    assert(nav.includes('class="nav-login" href="https://members.tworldkorea.co.kr/account/login"'));
    assert(nav.includes('class="nav-signup" href="https://members.tworldkorea.co.kr/account/signup"'));
  }
});

test('all header controls switch together before desktop navigation becomes crowded',()=>{
  const session=read('css/member-session.css'),shopping=read('css/member-shopping.css'),style=read('css/style.css');
  assert(session.includes('@media(min-width:1281px)'));
  assert(session.includes('@media(max-width:1280px)'));
  assert(shopping.includes('@media(max-width:1280px)'));
  assert(style.includes('@media (min-width: 768px) and (max-width: 1280px)'));
  assert(session.includes('.site-header .brand{flex:0 0 auto;white-space:nowrap}'));
  assert(session.includes('max-height:calc(100dvh - var(--header-height));overflow-y:auto'));
  assert(session.includes('.site-header .site-nav a{font-size:15px;'));
  assert(!/960px|961px/.test(session+shopping));
});
