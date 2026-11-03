import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import i18n from '../js/i18n.js';
const script=fs.readFileSync(new URL('../js/member-shopping.js',import.meta.url),'utf8');
test('authenticated product choices and right cart mount only while needed, with strict frame messages',()=>{
  const events={},created=[],navigation=[],messages=[];
  class Node{
    children=[];attrs={};events={};style={};dataset={};hidden=false;open=false;
    constructor(tag){this.tag=tag;this.contentWindow={postMessage:(message,origin)=>messages.push({message,origin})};created.push(this);}
    append(...nodes){this.children.push(...nodes);}
    replaceChildren(...nodes){this.children=nodes;}
    setAttribute(key,value){this.attrs[key]=value;}
    addEventListener(name,fn){this.events[name]=fn;}
    querySelector(selector){return this.children.find(n=>'.'+n.className===selector);}
    showModal(){this.open=true;}
    close(){this.open=false;this.events.close?.();}
    focus(){}
  }
  const header=new Node('header'),body=new Node('body'),options=new Node('options'),anonymous=new Node('anonymous'),slot=new Node('slot');
  slot.dataset.memberProduct='01OA1';slot.querySelector=s=>s==='[data-member-anonymous]'?anonymous:options;
  const price=new Node('price');price.dataset.memberPrice='01OA1';
  const classes=new Set(),document={querySelector:s=>s==='[data-member-product]'?slot:header,querySelectorAll:()=>[price],createElement:tag=>new Node(tag),body,activeElement:header,documentElement:{classList:{add:v=>classes.add(v),remove:v=>classes.delete(v)}}};
  const window={location:{assign:url=>navigation.push(url)},addEventListener:(name,fn)=>{events[name]=fn;}};
  vm.runInNewContext(script,{document,window,encodeURIComponent,URL});
  const launcher=header.children[0];assert(launcher.hidden);assert.equal(options.children.length,0);assert(!anonymous.hidden);
  events['tworld:session']({detail:{signedIn:true}});assert(!launcher.hidden);assert(anonymous.hidden);
  const product=options.children[0];assert.equal(product.src,'https://members.tworldkorea.co.kr/member-widgets/product/01OA1?lang=ko');
  const send=(source,type,value,origin='https://members.tworldkorea.co.kr')=>events.message({origin,source,data:{channel:'tworld-shop',type,value,url:'https://evil.test'}});
  send(product.contentWindow,'height',600,'https://evil.test');send({},'height',600);send(product.contentWindow,'height',999999);assert.equal(product.style.height,undefined);
  send(product.contentWindow,'height',600);assert.equal(product.style.height,'600px');
  send(product.contentWindow,'price',3570);assert.equal(price.textContent,'3,570원~');assert(!price.hidden);
  send(product.contentWindow,'open-cart');const dialog=body.children[0];assert(dialog.open);assert(classes.has('member-cart-open'));
  const cartBody=dialog.children[1];assert.equal(cartBody.children[0].src,'https://members.tworldkorea.co.kr/member-widgets/cart?lang=ko');
  dialog.children[0].children[1].events.click();assert(!dialog.open);assert.equal(cartBody.children.length,0);assert(!classes.has('member-cart-open'));assert.equal(messages.at(-1).message.type,'refresh');
  send(product.contentWindow,'checkout');assert.equal(navigation.at(-1),'https://members.tworldkorea.co.kr/account/checkout?lang=ko');
  events['tworld:session']({detail:{signedIn:false}});assert(launcher.hidden);assert.equal(options.children.length,0);assert(!anonymous.hidden);
  assert(price.hidden);
  const before=navigation.length;send(product.contentWindow,'checkout');assert.equal(navigation.length,before);
  assert(!script.includes('document.cookie')&&!script.includes('localStorage')&&!script.includes('setInterval'));
});
test('catalogue prices load once for the approved session and disappear on logout without browser storage',async()=>{
  const events={},calls=[],badge={dataset:{memberPrice:'01OA1'},hidden:false};
  const node=()=>({children:[],append(...values){this.children.push(...values);},setAttribute(){},addEventListener(){}}),header=node();
  const document={querySelector:s=>s==='[data-member-product]'?null:header,querySelectorAll:()=>[badge],createElement:node};
  let language='ko';const translate=i18n.createTranslator();
  const window={TworldI18n:{get language(){return language;},text:value=>translate(value,language)},addEventListener:(name,fn)=>{events[name]=fn;},location:{assign(){assert.fail('Price lookup must not navigate');}}};
  vm.runInNewContext(script,{document,window,AbortController,encodeURIComponent,URL,fetch:async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>({products:[{code:'01OA1',minPrice:3570}]})};}});
  assert(badge.hidden);assert.equal(calls.length,0);
  events['tworld:session']({detail:{signedIn:true}});events['tworld:session']({detail:{signedIn:true}});
  for(let i=0;i<10;i++)await Promise.resolve();
  assert.equal(calls.length,1);assert.equal(calls[0].url,'https://members.tworldkorea.co.kr/account/shop/api/catalog');assert.equal(calls[0].options.credentials,'include');assert.equal(calls[0].options.cache,'no-store');assert.equal(badge.textContent,'3,570원~');assert(!badge.hidden);
  events['tworld:products']();events['tworld:session']({detail:{signedIn:true}});assert.equal(calls.length,1);
  language='en';events['tworld:language']();assert.equal(badge.textContent,'KRW 3,570+');assert.equal(calls.length,1);assert.equal(header.children[0].title,'Cart');
  language='ko';events['tworld:language']();assert.equal(badge.textContent,'3,570원~');assert.equal(calls.length,1);
  events['tworld:session']({detail:{signedIn:false}});assert(badge.hidden);
});
