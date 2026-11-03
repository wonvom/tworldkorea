import {startMemberActivity} from './member-activity.js?v=20261103-staff-greeting';
(function () {

  function paint(signedIn,identity) {
    document.querySelectorAll('.nav-mypage').forEach(link => { link.hidden = !signedIn; });
    document.querySelectorAll('.nav-login, .nav-signup').forEach(link => { link.hidden = signedIn; });
    document.querySelectorAll('.nav-logout').forEach(button=>{button.hidden=!signedIn;});
    document.querySelectorAll('.nav-greeting').forEach(node=>{
      const name=typeof identity?.displayName==='string'?identity.displayName.trim().slice(0,80):'';
      node.textContent=signedIn&&name?`${name}님 반갑습니다.`:'';
      node.hidden=!signedIn||!name;
    });
    window.TworldMemberSignedIn = signedIn;
    window.TworldMemberCanOrder = signedIn&&identity?.canOrder!==false;
    window.dispatchEvent(new CustomEvent('tworld:session', { detail: { signedIn,canOrder:window.TworldMemberCanOrder } }));
  }

  paint(false);
  const session=startMemberActivity({endpoint:'https://members.tworldkorea.co.kr/account/shop/api/session',onSession:paint,onExpire:()=>window.location.assign('https://members.tworldkorea.co.kr/account/login?expired=1')});
  window.TworldMemberActivity=session;
  document.querySelectorAll('.nav-logout').forEach(button=>button.addEventListener('click',async()=>{
    if(!window.confirm('로그아웃하시겠습니까?'))return;
    button.disabled=true;try{await session.logout();}catch(error){window.alert(error.message);button.disabled=false;}
  }));
  window.addEventListener('pageshow',()=>void session.refresh());
})();
