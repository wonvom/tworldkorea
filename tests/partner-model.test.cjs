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
 assert.deepEqual(M.totals([line]),{quantity:3,supply:null,confirmed:false,vat:null,shipping:null,total:null});
 assert.equal(M.totals([{...line,unitPrice:2000},line]).supply,null);
 assert.equal(M.totals([{...line,unitPrice:2000}]).supply,6000);
});
test('quoted option prices and explicit charges sum without inventing missing prices or tax',()=>{
 const items=[{...line,unitPrice:2000},{...line,size:'M',quantity:2,unitPrice:2500}];
 assert.equal(M.lineAmount(items[0]),6000);
 assert.deepEqual(M.totals(items,{vat:1100,shipping:3000}),{quantity:5,supply:11000,confirmed:true,vat:1100,shipping:3000,total:15100});
 assert.equal(M.totals(items).total,null);
 assert.equal(M.totals(items,{vat:1100}).total,null);
 assert.equal(M.totals(items,{vat:1100,shipping:0}).total,12100);
 assert.equal(M.totals([...items,line],{vat:1100,shipping:0}).total,null);
 assert.equal(M.totals([{...line,unitPrice:0}],{vat:0,shipping:0}).total,0);
 assert.equal(M.totals([],{vat:0,shipping:0}).total,null);
 const revised=M.combine(items,[{...items[0],quantity:2}]);
 assert.equal(M.totals(revised).supply,15000);
 assert.equal(M.totals(revised).total,null);
 assert.equal(M.totals([{...items[0],quantity:1}],{vat:200,shipping:0}).total,2200);
});
test('invalid prices, quantities, charges and overflowing amounts cannot produce a payable total',()=>{
 for(const unitPrice of [null,undefined,'2000',-1,1.5,Infinity,NaN,Number.MAX_SAFE_INTEGER]){
  assert.equal(M.lineAmount({...line,unitPrice}),null);
  assert.equal(M.totals([{...line,unitPrice}],{vat:0,shipping:0}).total,null);
 }
 for(const quantity of [0,-1,1.5,10000,NaN])assert.equal(M.lineAmount({...line,quantity,unitPrice:2000}),null);
 for(const vat of [null,'0',-1,1.5,Infinity])assert.equal(M.totals([{...line,unitPrice:2000}],{vat,shipping:0}).total,null);
 const large={...line,quantity:1,unitPrice:Number.MAX_SAFE_INTEGER};
 assert.equal(M.totals([large,large],{vat:0,shipping:0}).supply,null);
 assert.equal(M.totals([large],{vat:1,shipping:0}).total,null);
});
test('order dates use the Korean timezone',()=>{
 assert.equal(M.dayISO(new Date('2026-10-19T15:01:00Z')),'2026-10-20');
});
test('phone field allows domestic formatting and rejects text/short values',()=>{
 assert.equal(M.validPhone('000-0000-0000'),true);assert.equal(M.validPhone('02-000-0000'),true);
 assert.equal(M.validPhone('abc123456789'),false);assert.equal(M.validPhone('123'),false);
});
