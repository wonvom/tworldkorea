const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../js/partner-model.js');
const line = { productCode:'TH5611',colorCode:'TH5611-01',size:'S',quantity:3,unitPrice:null };
test('same option combines without mutating prior order, different sizes remain separate',()=>{
 const initial=[{...line}];const combined=M.combine(initial,[{...line,quantity:4},{...line,size:'M',quantity:2}]);
 assert.equal(combined.length,2);assert.equal(combined[0].quantity,7);assert.equal(initial[0].quantity,3);assert.equal(M.totals(combined).quantity,9);
 for(const quantity of [0,-1,1.1,10000,NaN])assert.throws(()=>M.combine([],[{...line,quantity}]));
 assert.throws(()=>M.combine([{...line,quantity:9999}],[line]));
});
test('unconfirmed prices never become zero-priced totals',()=>{
 assert.deepEqual(M.totals([line]),{quantity:3,supply:null,confirmed:false});
 assert.equal(M.totals([{...line,unitPrice:2000},line]).supply,null);
 assert.equal(M.totals([{...line,unitPrice:2000}]).supply,6000);
});
test('delivery date handles leap days, month/year edges and the Korean timezone',()=>{
 assert.equal(M.dayISO(new Date('2026-10-19T15:01:00Z')),'2026-10-20');
 assert.equal(M.validDate('2026-10-19','2026-10-20'),false);assert.equal(M.validDate('2026-10-20','2026-10-20'),true);
 assert.equal(M.validDate('2027-10-21','2026-10-20'),false);assert.equal(M.validDate('2027-02-29','2026-10-20'),false);
 assert.equal(M.validDate('2028-02-29','2028-01-01'),true);assert.equal(M.validDate('','2026-10-20'),true);
 assert.equal(M.addDays('2026-12-31',1),'2027-01-01');
});
test('phone field allows domestic formatting and rejects text/short values',()=>{
 assert.equal(M.validPhone('000-0000-0000'),true);assert.equal(M.validPhone('02-000-0000'),true);
 assert.equal(M.validPhone('abc123456789'),false);assert.equal(M.validPhone('123'),false);
});
