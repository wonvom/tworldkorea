(function(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TworldPartnerModel = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function() {
  const key = line => [line.productCode, line.colorCode, line.size].join("|");
  function combine(lines, additions) {
    const next = lines.map(line => ({ ...line }));
    for (const added of additions) {
      if (!Number.isInteger(added.quantity) || added.quantity < 1 || added.quantity > 9999) throw Error("수량은 1~9,999 사이의 정수로 입력해주세요.");
      const match = next.find(line => key(line) === key(added));
      if (match) match.quantity += added.quantity; else next.push({ ...added });
    }
    if (next.length > 100 || next.some(line => line.quantity > 9999)) throw Error("100개 조합까지, 조합별 9,999장까지 담을 수 있습니다.");
    return next;
  }
  const isAmount = value => Number.isSafeInteger(value) && value >= 0;
  function lineAmount(line) {
    if (!isAmount(line.unitPrice) || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 9999) return null;
    const amount = line.unitPrice * line.quantity;
    return isAmount(amount) ? amount : null;
  }
  // Future OS quotes must provide KRW supply unit prices and explicit order-level
  // VAT/shipping amounts. Missing charges are unknown, never implicitly zero.
  function totals(lines, charges = {}) {
    const amounts = lines.map(lineAmount);
    const sum = amounts.reduce((total, amount) => total + (amount ?? 0), 0);
    const confirmed = lines.length > 0 && amounts.every(amount => amount !== null) && isAmount(sum);
    const quantity = lines.reduce((sum, line) => sum + line.quantity, 0);
    const supply = confirmed ? sum : null;
    const vat = isAmount(charges.vat) ? charges.vat : null;
    const shipping = isAmount(charges.shipping) ? charges.shipping : null;
    const complete = confirmed && vat !== null && shipping !== null;
    const total = complete && isAmount(supply + vat + shipping) ? supply + vat + shipping : null;
    return { quantity, supply, confirmed, vat, shipping, total };
  }
  function dayISO(now = new Date()) { return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(now); }
  function validPhone(value) { return /^[0-9 ()+-]+$/.test(value) && /^\d{9,15}$/.test(value.replace(/\D/g, "")); }
  return Object.freeze({ combine, lineAmount, totals, dayISO, validPhone });
});
