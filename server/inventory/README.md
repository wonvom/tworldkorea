# Inventory Integration

The catalog remains on GitHub Pages at https://www.tworldkorea.co.kr.
Stock is read only from https://www.tworldkorea.kr through this protected Sites API:

https://tworld-inventory-api.halestork64.chatgpt.site/stock

Sites project: `appgprj_6ad604f8c2748191a6a78350ee14cbcf`.
Production API source checkout: `../tworld-inventory-api`, with hosting identity
in that project's `.openai/hosting.json`. No Cloudflare signup or ONF access is
required. Do not move the catalog, change its CNAME/DNS, or expose account tokens.

## Behavior

- Only 01OA1, 7001, 03XA5, T210 and 23012 show size-level stock.
- Stock is hidden and no inventory requests run until the visitor uses the
  "재고 확인" button and successfully submits the shared keyword.
- Keyword verification happens on the server, not in public JavaScript.
- One-hour bearer tokens are kept only in memory/sessionStorage for the tab;
  keywords are not saved. "재고 숨기기", expiration or server rejection clears
  quantities and stops polling. A keyword must be entered again after locking.
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

The relay permits only the catalog's www/apex Origins and five product codes.
`POST /stock/auth` exchanges a valid keyword for a short-lived signed token.
`GET /stock` rejects unauthenticated calls, including spoofed allowed Origins.
It never forwards cookies, tokens, arbitrary URLs, prices,
orders or other account data. Source requests have an 8-second timeout and no
cache. CORS is not authentication. The deployed route's bounded in-memory limiters
are best-effort per isolate, not global rate limits.

The deployed implementation, authentication tests and Worker integration tests
live in the separate Sites source project. The obsolete anonymous relay copy
has been removed from this repository to prevent accidental reuse.
No standalone Cloudflare login/deploy configuration is needed in this repository.

## Deferred Keyword Setup

The owner chose to configure the production keyword later (2026-10-20).
No default keyword, real signing secret or public bypass has been created.
The deployed API remains locked: anonymous requests get 401, and keyword
submissions get 503 until `STOCK_AUTH_VERIFIER` and `STOCK_TOKEN_SECRET` are
configured as Sites secrets and applied with a saved-version deployment. See
the API project's README for provisioning and rotation. The existing domain,
DNS, GitHub Pages hosting and ONF remain untouched.

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

The first browser suite uses isolated authentication/stock fixtures for gating,
expiry, errors, race conditions, timeouts, 30-second polling, hidden tabs, reset
behavior and mobile layout. Production credentials are never used by fixtures.

`inventory-live.cjs` verifies the actual deployed fail-closed API and real
HTTPS/CORS keyword dialog. It also checks no anonymous stock requests occur
across a real 31-second interval, without fake API responses.
Set `INVENTORY_PREDEPLOY=1` to preview local catalog files on the catalog origin
before publishing; leave it unset to verify the deployed GitHub Pages files.
Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` when using an installed Chrome.
Screenshots are written to the ignored `outputs/inventory-qa/` directory.
