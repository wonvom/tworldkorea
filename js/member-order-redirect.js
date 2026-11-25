(function(){
  const value=new URLSearchParams(location.search).get('product')||'';
  // The member shop already validates and canonicalizes the product code.
  const target=new URL('https://members.tworldkorea.co.kr/account/shop');
  if(/^[a-z0-9가-힣()-]{1,40}$/iu.test(value))target.searchParams.set('product',value);
  location.replace(target.href);
})();
