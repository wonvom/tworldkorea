import {startMemberActivity} from './member-activity.js?v=20261103-staff-greeting';
(function () {
  let signedInNow=false,currentIdentity=null;
  const text=value=>window.TworldI18n?.text(value)||value;
  function paintGreeting(){
    document.querySelectorAll('.nav-greeting').forEach(node=>{
      const name=typeof currentIdentity?.displayName==='string'?currentIdentity.displayName.trim().slice(0,80):'';
      node.textContent=signedInNow&&name?(window.TworldI18n?.welcome(name)||`${name}님 반갑습니다.`):'';
      node.hidden=!signedInNow||!name;
    });
  }

  function paint(signedIn,identity) {
    signedInNow=signedIn;currentIdentity=identity;
    document.querySelectorAll('.nav-mypage').forEach(link => { link.hidden = !signedIn; });
    document.querySelectorAll('.nav-login, .nav-signup').forEach(link => { link.hidden = signedIn; });
    document.querySelectorAll('.nav-logout').forEach(button=>{button.hidden=!signedIn;});
    paintGreeting();
    window.TworldMemberSignedIn = signedIn;
    window.TworldMemberCanOrder = signedIn&&identity?.canOrder!==false;
    window.dispatchEvent(new CustomEvent('tworld:session', { detail: { signedIn,canOrder:window.TworldMemberCanOrder } }));
  }

  paint(false);
  const session=startMemberActivity({endpoint:'https://members.tworldkorea.co.kr/account/shop/api/session',onSession:paint,onExpire:()=>window.location.assign('https://members.tworldkorea.co.kr/account/login?expired=1&lang='+(window.TworldI18n?.language==='en'?'en':'ko'))});
  window.TworldMemberActivity=session;
  document.querySelectorAll('.nav-logout').forEach(button=>button.addEventListener('click',async()=>{
    if(!window.confirm(text('로그아웃하시겠습니까?')))return;
    button.disabled=true;try{await session.logout();}catch(error){window.alert(text(error.message));button.disabled=false;}
  }));
  window.addEventListener('pageshow',()=>void session.refresh());
  window.addEventListener('tworld:language',paintGreeting);
})();
