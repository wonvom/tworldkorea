(function(){
  'use strict';
  const origin='https://members.tworldkorea.co.kr';
  let signedIn=false,drawer=null,productFrame=null,cartFrame=null,launcher=null,returnFocus=null;
  const slot=document.querySelector('[data-member-product]');
  let prices=null,priceFlight=null;
  function paintPrices(){
    document.querySelectorAll('[data-member-price]').forEach(node=>{
      const price=prices?.[node.dataset.memberPrice];node.hidden=!signedIn;
      node.textContent=Number.isSafeInteger(price)&&price>0?price.toLocaleString('ko-KR')+'원~':'단가 확인 중';
      node.title='업체 적용 단가 / 부가세 별도';
    });
  }
  function loadPrices(){
    paintPrices();if(slot||!signedIn||prices||priceFlight)return;
    const controller=new AbortController();priceFlight=controller;
    fetch(origin+'/account/shop/api/catalog',{credentials:'include',cache:'no-store',signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Price lookup failed');return r.json();}).then(value=>{
      if(!signedIn||controller.signal.aborted||!Array.isArray(value.products))return;
      prices=Object.fromEntries(value.products.filter(p=>typeof p.code==='string'&&(p.minPrice===null||Number.isSafeInteger(p.minPrice)&&p.minPrice>0)).map(p=>[p.code,p.minPrice]));paintPrices();
    }).catch(()=>{}).finally(()=>{if(priceFlight===controller)priceFlight=null;});
  }
  function loginUrl(){
    const code=slot?.dataset.memberProduct;
    return origin+'/account/login'+(code?'?next='+encodeURIComponent('https://www.tworldkorea.co.kr/product-detail.html?id='+encodeURIComponent(code)+'#order'):'?next=%2Faccount%2Fcart');
  }
  function frame(path,title){
    const node=document.createElement('iframe');node.src=origin+path;node.title=title;node.referrerPolicy='strict-origin-when-cross-origin';return node;
  }
  function refreshProduct(){productFrame?.contentWindow?.postMessage({channel:'tworld-shop',type:'refresh'},origin);}
  function close(){if(drawer?.open)drawer.close();}
  function open(){
    if(!signedIn){window.location.assign(loginUrl());return;}
    if(!drawer){
      drawer=document.createElement('dialog');drawer.className='member-cart-drawer';drawer.setAttribute('aria-label','장바구니');
      const heading=document.createElement('header'),title=document.createElement('h2'),button=document.createElement('button');
      title.textContent='장바구니';button.type='button';button.className='member-cart-close';button.title='장바구니 접기';button.setAttribute('aria-label','장바구니 접기');
      const icon=document.createElement('img');icon.src='images/icons/panel-right-close.svg';icon.alt='';button.append(icon);button.addEventListener('click',close);heading.append(title,button);
      const body=document.createElement('div');body.className='member-cart-body';drawer.append(heading,body);document.body.append(drawer);
      drawer.addEventListener('click',e=>{if(e.target===drawer){const r=drawer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
      drawer.addEventListener('close',()=>{body.replaceChildren();cartFrame=null;launcher?.setAttribute('aria-expanded','false');document.documentElement.classList.remove('member-cart-open');refreshProduct();returnFocus?.focus();});
    }
    // Unmounting the frame stops stock polling while the cart is collapsed.
    cartFrame=frame('/member-widgets/cart','장바구니 품목과 재고');drawer.querySelector('.member-cart-body').replaceChildren(cartFrame);
    if(!drawer.open){returnFocus=document.activeElement;drawer.showModal();document.documentElement.classList.add('member-cart-open');}
    launcher?.setAttribute('aria-expanded','true');
  }
  function paint(value){
    signedIn=value===true;
    if(!launcher){
      launcher=document.createElement('button');launcher.type='button';launcher.className='member-cart-launcher';launcher.setAttribute('aria-label','장바구니 열기');launcher.setAttribute('aria-expanded','false');launcher.setAttribute('aria-haspopup','dialog');launcher.title='장바구니';
      const icon=document.createElement('img');icon.src='images/icons/shopping-cart.svg';icon.alt='';const label=document.createElement('span');label.textContent='장바구니';launcher.append(icon,label);launcher.addEventListener('click',()=>drawer?.open?close():open());
      document.querySelector('.site-header')?.append(launcher);
    }
    launcher.hidden=!signedIn;
    if(slot){
      slot.querySelector('[data-member-anonymous]').hidden=signedIn;
      const options=slot.querySelector('[data-member-options]');options.hidden=!signedIn;
      if(signedIn&&!productFrame){productFrame=frame('/member-widgets/product/'+encodeURIComponent(slot.dataset.memberProduct),'색상과 사이즈 선택 및 본사 재고');productFrame.dataset.memberProductFrame='';options.replaceChildren(productFrame);}
      else if(!signedIn){options.replaceChildren();productFrame=null;}
    }
    if(!signedIn)close();
    if(!signedIn){priceFlight?.abort();priceFlight=null;prices=null;}
    loadPrices();
  }
  window.addEventListener('message',event=>{
    if(event.origin!==origin||!event.data||event.data.channel!=='tworld-shop')return;
    const fromProduct=productFrame&&event.source===productFrame.contentWindow,fromCart=cartFrame&&event.source===cartFrame.contentWindow;
    if(!fromProduct&&!fromCart)return;
    const {type,value}=event.data;
    if(type==='height'&&fromProduct&&Number.isSafeInteger(value)&&value>=120&&value<=2400)productFrame.style.height=value+'px';
    else if(type==='price'&&fromProduct&&Number.isSafeInteger(value)&&value>=0&&value<=2147483647){prices={[slot.dataset.memberProduct]:value||null};paintPrices();}
    else if(type==='cart'&&Number.isSafeInteger(value)&&value>=0&&value<=999900)launcher.setAttribute('aria-label',`장바구니 열기 / ${value.toLocaleString()}장`);
    else if(type==='open-cart'&&fromProduct)open();
    else if(type==='checkout'&&signedIn)window.location.assign(origin+'/account/checkout');
    else if(type==='login')window.location.assign(loginUrl());
    else if(type==='activity')window.TworldMemberActivity?.activity();
  });
  window.addEventListener('tworld:session',event=>paint(event.detail?.signedIn));
  window.addEventListener('tworld:products',paintPrices);
  paint(window.TworldMemberSignedIn===true);
})();
