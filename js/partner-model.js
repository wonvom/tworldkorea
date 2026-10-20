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
  function totals(lines) {
    const confirmed = lines.length > 0 && lines.every(line => Number.isSafeInteger(line.unitPrice) && line.unitPrice >= 0);
    const quantity = lines.reduce((sum, line) => sum + line.quantity, 0);
    const supply = confirmed ? lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0) : null;
    return { quantity, supply, confirmed };
  }
  function dayISO(now = new Date()) { return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(now); }
  function addDays(iso, count) { const d = new Date(iso + "T12:00:00+09:00"); d.setUTCDate(d.getUTCDate() + count); return dayISO(d); }
  function validDate(value, today = dayISO()) {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const d = new Date(value + "T12:00:00+09:00");
    return Number.isFinite(+d) && dayISO(d) === value && value >= today && value <= addDays(today, 365);
  }
  function validPhone(value) { return /^[0-9 ()+-]+$/.test(value) && /^\d{9,15}$/.test(value.replace(/\D/g, "")); }
  return Object.freeze({ combine, totals, dayISO, addDays, validDate, validPhone });
});
