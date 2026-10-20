# Inventory Integration

The catalog remains on GitHub Pages at https://www.tworldkorea.co.kr.
Stock is read only from https://www.tworldkorea.kr through this protected Sites API:

https://tworld-inventory-api.halestork64.chatgpt.site/stock

Sites project: `appgprj_6ad604f8c2748191a6a78350ee14cbcf`.
Production API source checkout: `../tworld-inventory-api`, with hosting identity
in that project's `.openai/hosting.json`. No Cloudflare signup or ONF access is
required. Do not move the catalog, change its CNAME/DNS, or expose account tokens.

## Behavior

- All 38 regular catalog products have the same protected stock UI. The 7
  custom-order products have no stock button, quantity labels or API traffic,
  even when the tab is already authenticated. Eligibility reuses the existing
  `isCustomOrderProduct` badge rule in `main.js`, including Pants.
- The server allowlist covers 45 public models / 321 mapped local colors. Four
  source-absent models (27012, YL3200, A23014, CK280) are all custom-order products,
  so their stock UI is omitted. Direct authenticated API queries remain unknown,
  never fabricated zero. All 38 regular models have verified source mappings.
- Stock is hidden and no inventory requests run until the visitor uses the
  "재고 확인" button and successfully submits the shared keyword.
- Keyword verification happens on the server, not in public JavaScript.
- Successful authentication selects and fetches the first visible color when
  no color is selected. An existing color selection is preserved. Restoring a
  valid tab session on another product also loads its first visible color.
- One-hour bearer tokens are kept only in memory/sessionStorage for the tab;
  keywords are not saved. "재고 숨기기", expiration or server rejection clears
  quantities and stops polling. A keyword must be entered again after locking.
- Color selection, including re-clicking the selected color, fetches fresh stock.
- The selected product refreshes every 30 seconds while the page is visible.
- Refresh icon also fetches fresh stock. No stock snapshots are persisted.
- Hidden tabs and cleared selections stop polling; returning to a tab refreshes.
- Old color responses are aborted/discarded, and errors clear outdated numbers.
- Actual zero stock is sold out and disables that size. A selected size is cleared
  if refreshed stock becomes zero; the status announces the change.
- Same-color refreshes keep known sold-out sizes disabled until the response.
  Changing color clears the previous color's restrictions. Absent/invalid data
  and errors are unknown and leave sizes selectable. Locking/reset also clears
  stock restrictions.
- Existing hidden colors, sizes, product data and custom-order flags are retained.
- Sample requests reject disabled sizes but allow unknown stock. This is not a
  reservation system, and stock must be rechecked before confirming an order.

## Configuration

`data/inventory-config.js` holds only the public HTTPS endpoint and enabled flag.
The exact API origin is allowed in `product-detail.html`'s `connect-src`; CSP has
not been broadly relaxed. Asset versions are used only for cache invalidation,
not visible navigation URLs.

The relay permits only the catalog's www/apex Origins and public catalog codes.
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

## Keyword Management

The owner manages the production keyword with the private Mac application
`~/Applications/Tworld Stock Access.app`. No default keyword or public bypass
exists. Anonymous requests get 401. See the API project's README for Keychain,
encrypted server configuration and rotation. Existing domain, DNS, GitHub Pages
hosting and ONF remain untouched. The Mac app currently allows 6-128 characters.

Source mapping is generated in the API project by `scripts/sync-stock-products.mjs`
into its fixed `data/stock-products.json` allowlist. Source IDs, re-numbered/HEX
color identifiers and size aliases are mapped without changing local catalog
data. Source-only/hidden products, hidden colors and removed 7001 XS stay excluded.
The missing source 7111 S row remains unknown while its local S size stays present.

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

`inventory-live.cjs` verifies the actual deployed anonymous-access gate and real
HTTPS/CORS keyword dialog. It also checks no anonymous stock requests occur
across a real 31-second interval, without fake API responses.
Set `INVENTORY_PREDEPLOY=1` to preview local catalog files on the catalog origin
before publishing; leave it unset to verify the deployed GitHub Pages files.
Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` when using an installed Chrome.
Screenshots are written to the ignored `outputs/inventory-qa/` directory.
