export function startMemberActivity({endpoint='/account/shop/api/session',onSession=()=>{},onExpire=()=>window.location.assign('/account/login?expired=1'),onActivity=()=>{}}={}){
  let active=false,persistent=false,stopped=false,deadline=0,flight=null,timer=0,trailing=0,lastSent=0;
  const expired=()=>active&&!persistent&&Date.now()>=deadline;
  const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('tworld-member-session'):null;
  function schedule(){
    clearTimeout(timer);
    if(active&&!persistent)timer=setTimeout(()=>void check(false),Math.max(1000,deadline-Date.now()+100));
  }
  function paint(value){
    const before=active;active=value.signedIn===true;
    persistent=active&&value.persistent===true;
    deadline=active&&Number.isFinite(value.expiresAt)?value.expiresAt:0;
    onSession(active,active?{displayName:typeof value.displayName==='string'?value.displayName:'',canOrder:value.canOrder!==false}:null);schedule();
    if(before&&!active)onExpire();
  }
  async function check(touch=false,initial=false){
    if(stopped||flight)return flight;
    if(touch&&!active&&!initial)return;
    if(touch)lastSent=Date.now();
    flight=(async()=>{
      try{
        const response=await fetch(endpoint+(touch?'/activity':''),{method:touch?'POST':'GET',credentials:'include',cache:'no-store',signal:AbortSignal.timeout(8000)});
        if(!response.ok){if(expired())paint({signedIn:false});return;}
        const value=await response.json();if(stopped)return;
        paint(value);
        if(touch&&active)channel?.postMessage({type:'active',expiresAt:deadline});
      }catch{if(expired())paint({signedIn:false});}
      finally{flight=null;if(expired())timer=setTimeout(()=>void check(),5000);}
    })();
    return flight;
  }
  function activity(){
    if(!active||stopped)return;
    onActivity();
    clearTimeout(trailing);
    const remaining=Math.max(0,(persistent?86400000:60000)-(Date.now()-lastSent));
    if(!remaining)void check(true);else trailing=setTimeout(()=>void check(true),remaining);
  }
  const eventActivity=event=>{if(event.isTrusted)activity();};
  const visible=()=>{if(!document.hidden)void check();};
  const events=['pointerdown','keydown','wheel','touchstart'];
  for(const event of events)window.addEventListener(event,eventActivity,{passive:true});
  document.addEventListener('visibilitychange',visible);
  window.addEventListener('focus',visible);
  window.addEventListener('tworld:unauthorized',visible);
  if(channel)channel.onmessage=event=>{
    if(event.data?.type==='logout')paint({signedIn:false});
    else if(active&&!persistent&&event.data?.type==='active'&&Number.isFinite(event.data.expiresAt)&&event.data.expiresAt>0){deadline=Math.max(deadline,event.data.expiresAt);schedule();}
  };
  void check(true,true);
  return {
    activity,
    refresh:()=>check(),
    async logout(){
      const response=await fetch(endpoint+'/logout',{method:'POST',credentials:'include',cache:'no-store',signal:AbortSignal.timeout(8000)});
      if(!response.ok)throw Error('로그아웃을 완료하지 못했습니다. 다시 시도해주세요.');
      channel?.postMessage({type:'logout'});active=false;onSession(false);onExpire();
    },
    stop(){stopped=true;clearTimeout(timer);clearTimeout(trailing);channel?.close();for(const event of events)window.removeEventListener(event,eventActivity);document.removeEventListener('visibilitychange',visible);window.removeEventListener('focus',visible);window.removeEventListener('tworld:unauthorized',visible);},
  };
}
