# Inventory Integration

The catalog remains on GitHub Pages at https://www.tworldkorea.co.kr.
Stock is read only from https://www.tworldkorea.kr through this public Sites API:

https://tworld-inventory-api.halestork64.chatgpt.site/stock

Sites project: `appgprj_6ad604f8c2748191a6a78350ee14cbcf`.
Production API source checkout: `../tworld-inventory-api`, with hosting identity
in that project's `.openai/hosting.json`. No Cloudflare signup or ONF access is
required. Do not move the catalog, change its CNAME/DNS, or expose account tokens.

## Behavior

- Only 01OA1, 7001, 03XA5, T210 and 23012 show size-level stock.
- Color selection, including re-clicking the selected color, fetches fresh stock.
- The selected product refreshes every 30 seconds while the page is visible.
- Refresh icon also fetches fresh stock. No stock snapshots are persisted.
- Hidden tabs and cleared selections stop polling; returning to a tab refreshes.
- Old color responses are aborted/discarded, and errors clear outdated numbers.
- Actual zero stock is sold out; absent/invalid data and errors are unknown.
- Existing hidden colors, sizes, product data and custom-order flags are retained.
- Sample requests are not blocked based on stock; this is not a reservation system.

## Configuration

`data/inventory-config.js` holds only the public HTTPS endpoint and enabled flag.
The exact API origin is allowed in `product-detail.html`'s `connect-src`; CSP has
not been broadly relaxed. Asset versions are used only for cache invalidation,
not visible navigation URLs.

The public relay permits only the catalog's www/apex Origins, the five product
codes, and GET/OPTIONS. It never forwards cookies, tokens, arbitrary URLs, prices,
orders or other account data. Source requests have an 8-second timeout and no
cache. CORS is not authentication. The deployed route's bounded in-memory limiter
is best-effort per isolate, not a global rate limit.

`relay.mjs` is the plain-JavaScript relay contract used by the offline tests.
The deployed implementation and route live in the separate Sites source project.
No standalone Cloudflare login/deploy configuration is needed in this repository.

## Verification

```sh
node --test tests/inventory.test.mjs
python3 -m http.server 4173 --bind 127.0.0.1
```

With Playwright and Chromium available, in a second terminal:

```sh
node tests/inventory-browser.cjs
node tests/inventory-live.cjs
```

The first browser suite uses controlled fixtures for errors, race conditions,
timeouts, hidden tabs, reset behavior and mobile layout. `INVENTORY_LIVE_TEST=1`
optionally fetches the real source through its local test adapter.

`inventory-live.cjs` uses the actual public Sites API, anonymous browser requests,
real HTTPS/CORS and an actual 30-second timer, without fake inventory responses.
Set `INVENTORY_PREDEPLOY=1` to preview local catalog files on the catalog origin
before publishing; leave it unset to verify the deployed GitHub Pages files.
Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` when using an installed Chrome.
Screenshots are written to the ignored `outputs/inventory-qa/` directory.
