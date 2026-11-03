(function(){
  'use strict';
  const origin='https://members.tworldkorea.co.kr';
  let signedIn=false,canOrder=true,drawer=null,productFrame=null,cartFrame=null,launcher=null,returnFocus=null,drawerHeading=null,cartCloseButton=null,launcherLabel=null,cartQuantity=0;
  const text=value=>window.TworldI18n?.text(value)||value;
  const language=()=>window.TworldI18n?.language==='en'?'en':'ko';
  function memberUrl(path){const url=new URL(path,origin);url.searchParams.set('lang',language());return url.href;}
  function paintCopy(){
    if(launcher){launcher.title=text('장바구니');launcher.setAttribute('aria-label',text(cartQuantity?`장바구니 열기 / ${cartQuantity.toLocaleString()}장`:'장바구니 열기'));launcherLabel.textContent=text('장바구니');}
    if(drawer){drawer.setAttribute('aria-label',text('장바구니'));drawerHeading.textContent=text('장바구니');cartCloseButton.title=text('장바구니 접기');cartCloseButton.setAttribute('aria-label',text('장바구니 접기'));}
    for(const frame of [productFrame,cartFrame])if(frame){frame.title=text(frame.dataset.languageTitle);frame.contentWindow?.postMessage({channel:'tworld-shop',type:'language',value:language()},origin);}
    paintPrices();
  }
  const slot=document.querySelector('[data-member-product]');
  let prices=null,priceFlight=null;
  function paintPrices(){
    document.querySelectorAll('[data-member-price]').forEach(node=>{
      const price=prices?.[node.dataset.memberPrice];node.hidden=!signedIn;
      node.textContent=text(Number.isSafeInteger(price)&&price>0?price.toLocaleString('ko-KR')+'원~':'단가 확인 중');
      node.title=text('업체 적용 단가 / 부가세 별도');
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
    return memberUrl('/account/login'+(code?'?next='+encodeURIComponent('https://www.tworldkorea.co.kr/product-detail.html?id='+encodeURIComponent(code)+'#order'):'?next=%2Faccount%2Fcart'));
  }
  function frame(path,title){
    const node=document.createElement('iframe');node.src=memberUrl(path);node.dataset.languageTitle=title;node.title=text(title);node.referrerPolicy='strict-origin-when-cross-origin';node.addEventListener('load',()=>node.contentWindow?.postMessage({channel:'tworld-shop',type:'language',value:language()},origin));return node;
  }
  function refreshProduct(){productFrame?.contentWindow?.postMessage({channel:'tworld-shop',type:'refresh'},origin);}
  function close(){if(drawer?.open)drawer.close();}
  function open(){
    if(!signedIn){window.location.assign(loginUrl());return;}
    if(!canOrder)return;
    if(!drawer){
      drawer=document.createElement('dialog');drawer.className='member-cart-drawer';drawer.setAttribute('aria-label','장바구니');
      const heading=document.createElement('header'),title=document.createElement('h2'),button=document.createElement('button');
      title.textContent='장바구니';button.type='button';button.className='member-cart-close';button.title='장바구니 접기';button.setAttribute('aria-label','장바구니 접기');
      drawerHeading=title;cartCloseButton=button;
      const icon=document.createElement('img');icon.src='images/icons/panel-right-close.svg';icon.alt='';button.append(icon);button.addEventListener('click',close);heading.append(title,button);
      const body=document.createElement('div');body.className='member-cart-body';drawer.append(heading,body);document.body.append(drawer);
      drawer.addEventListener('click',e=>{if(e.target===drawer){const r=drawer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
      drawer.addEventListener('close',()=>{body.replaceChildren();cartFrame=null;launcher?.setAttribute('aria-expanded','false');document.documentElement.classList.remove('member-cart-open');refreshProduct();returnFocus?.focus();});
    }
    // Unmounting the frame stops stock polling while the cart is collapsed.
    cartFrame=frame('/member-widgets/cart','장바구니 품목과 재고');drawer.querySelector('.member-cart-body').replaceChildren(cartFrame);
    if(!drawer.open){returnFocus=document.activeElement;drawer.showModal();document.documentElement.classList.add('member-cart-open');}
    launcher?.setAttribute('aria-expanded','true');
    paintCopy();
  }
  function paint(value){
    signedIn=value===true;
    if(!launcher){
      launcher=document.createElement('button');launcher.type='button';launcher.className='member-cart-launcher';launcher.setAttribute('aria-label','장바구니 열기');launcher.setAttribute('aria-expanded','false');launcher.setAttribute('aria-haspopup','dialog');launcher.title='장바구니';
      const icon=document.createElement('img');icon.src='images/icons/shopping-cart.svg';icon.alt='';const label=document.createElement('span');launcherLabel=label;label.textContent='장바구니';launcher.append(icon,label);launcher.addEventListener('click',()=>drawer?.open?close():open());
      document.querySelector('.site-header')?.append(launcher);
    }
    launcher.hidden=!signedIn||!canOrder;
    if(slot){
      slot.querySelector('[data-member-anonymous]').hidden=signedIn;
      const options=slot.querySelector('[data-member-options]');options.hidden=!signedIn;
      if(signedIn&&!productFrame){productFrame=frame('/member-widgets/product/'+encodeURIComponent(slot.dataset.memberProduct),'색상과 사이즈 선택 및 본사 재고');productFrame.dataset.memberProductFrame='';options.replaceChildren(productFrame);}
      else if(!signedIn){options.replaceChildren();productFrame=null;}
    }
    if(!signedIn||!canOrder)close();
    if(!signedIn){priceFlight?.abort();priceFlight=null;prices=null;}
    loadPrices();
    paintCopy();
  }
  window.addEventListener('message',event=>{
    if(event.origin!==origin||!event.data||event.data.channel!=='tworld-shop')return;
    const fromProduct=productFrame&&event.source===productFrame.contentWindow,fromCart=cartFrame&&event.source===cartFrame.contentWindow;
    if(!fromProduct&&!fromCart)return;
    const {type,value}=event.data;
    if(type==='height'&&fromProduct&&Number.isSafeInteger(value)&&value>=120&&value<=2400)productFrame.style.height=value+'px';
    else if(type==='price'&&fromProduct&&Number.isSafeInteger(value)&&value>=0&&value<=2147483647){prices={[slot.dataset.memberProduct]:value||null};paintPrices();}
    else if(type==='cart'&&Number.isSafeInteger(value)&&value>=0&&value<=999900){cartQuantity=value;paintCopy();}
    else if(type==='open-cart'&&fromProduct)open();
    else if(type==='checkout'&&signedIn&&canOrder)window.location.assign(memberUrl('/account/checkout'));
    else if(type==='login')window.location.assign(loginUrl());
    else if(type==='activity')window.TworldMemberActivity?.activity();
  });
  window.addEventListener('tworld:session',event=>{canOrder=event.detail?.canOrder!==false;paint(event.detail?.signedIn);});
  window.addEventListener('tworld:products',paintPrices);
  window.addEventListener('tworld:language',paintCopy);
  canOrder=window.TworldMemberCanOrder!==false;
  paint(window.TworldMemberSignedIn===true);
})();
