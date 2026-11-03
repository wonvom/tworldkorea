import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('all public pages load the larger, roomier navigation assets together',()=>{
  for(const name of ['index','products','lookbook','about','contact','product-detail']){
    const html=read(name+'.html');
    for(const stylesheet of ['member-session','member-shopping','style'])assert(html.includes(`css/${stylesheet}.css?v=20261103-roomy-nav`),name+' '+stylesheet);
  }
  const session=read('css/member-session.css');
  assert.match(session,/\.site-header \.site-nav\{[^}]*font-size:14px;[^}]*gap:30px/);
  assert.match(session,/\.site-header \.nav-mypage\{padding-left:30px/);
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
