// Compatibility for bookmarks or previously cached versions of the old order page.
if (document.querySelector(".partner-tabs") && location.pathname.endsWith("/order.html")) {
  const route=new URL("https://members.tworldkorea.co.kr/account/shop");
  const code=new URLSearchParams(location.search).get("product");
  if(code && /^[a-z0-9가-힣()-]{1,40}$/iu.test(code))route.searchParams.set("product",code);
  location.replace(route.href);
}
