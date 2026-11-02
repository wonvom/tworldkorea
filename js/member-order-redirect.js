(function(){
  const value=new URLSearchParams(location.search).get('product')||'';
  const product=(window.products||[]).find(p=>p.code.toLowerCase()===value.toLowerCase()||p.id.toLowerCase()===value.toLowerCase());
  const target=new URL('https://members.tworldkorea.co.kr/account/shop');
  if(product)target.searchParams.set('product',product.code);
  location.replace(target.href);
})();
