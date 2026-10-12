# Samir Habibov — portfolio

React 18 + TypeScript + Vite. The existing dark/green visual identity and motion are retained. Public pages are Home, Projects, Resume, Contact, and Testimonials. Admin pages use an external ASP.NET API; its implementation and database are not in this repository.

## Run and verify

Use Node.js 22.12+ and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
npm run check
npm run test:browser
```

Browser tests use installed Google Chrome locally. CI installs Playwright Chromium. Tests mock API writes and do not change the production database. `npm run test` covers request security, timeout/error handling, session expiry, response validation, and caching.

## Configuration and release

- `VITE_API_BASE_URL`: public API origin; defaults to the existing Render backend. Production requires HTTPS.
- `VITE_SITE_URL`: the real public HTTPS origin, without a path. **Required before release.** Do not use the test origin from the audit.
- Never put passwords, tokens, service-role keys, or private credentials into `VITE_*` variables: they are bundled into public JavaScript.

`npm run build` creates an unindexed preview when the site origin is not configured. `npm run build:release` refuses to proceed without `VITE_SITE_URL`. It generates route-specific static head metadata, canonical/Open Graph tags, `robots.txt`, and a sitemap for the five public routes. The page content is still client-rendered; this is not full server-side rendering.

Host `dist/` on a static HTTPS host. The provided `_redirects` and `_headers` target Netlify-compatible hosting. Other hosts must explicitly configure equivalent SPA fallbacks and security/cache headers. Existing static files and route `index.html` files should take priority; the two admin routes need the SPA fallback. Unknown routes should return the generated `404.html` with HTTP 404. Serve missing assets as 404, not HTML. Confirm host behavior before approval to deploy. No deployment is performed by the CI workflow.

The CSP allows HTTPS image and API origins because project images can come from an external CDN. Once production origins are confirmed, narrow `img-src` and `connect-src` on the host. Inline styles remain allowed for Framer Motion; inline scripts are not allowed. Enable HSTS at the HTTPS host after checking domain/subdomain requirements.

## API behavior and admin limitations

- Requests are scoped to the configured API origin, never follow redirects with credentials, and time out after 45 seconds to accommodate the measured Render cold start.
- Public list requests are coalesced and cached for 30 seconds. Successful mutations invalidate the cache.
- JWTs live in per-tab session storage (memory fallback if storage is blocked). Previous local-storage sessions require signing in again. Client expiry checks **do not** authenticate the token: the backend must validate its signature, expiration, issuer/audience, and permissions on every protected endpoint. HttpOnly cookie authentication requires backend work and is not implemented here.
- Contact opens WhatsApp with the encoded message; it does not send email or confirm message delivery.
- JSON import is explicitly a local backup preview, with editing disabled during preview. It does not pretend to restore the server. Export includes loaded approved and pending testimonials.
- Profile and password settings had no backend integration. Their controls now explain that support is unavailable and cannot submit misleading success. A real backend implementation is still required.
- File MIME/size and URL validation in the browser are UX checks; enforce these again on the server, including file-content inspection, moderation, rate limits and upload quotas.

## Audit artifacts

See `docs/production-readiness.md`, `artifacts/performance-before.json`, `artifacts/performance-after.json`, `artifacts/live-api.json`, and `artifacts/security/`.

Reproduce lab measurements against a production build:

```sh
node scripts/serve-production.mjs
# In another terminal:
npm run test:performance
```

The measurement script uses Chrome, two cold runs per public route, desktop and throttled mobile profiles, and deterministic empty API responses. Its INP samples come from scripted menu interactions, not field p75 data. `node scripts/check-live-api.mjs` performs read-only live requests separately.

Six remaining high build-tool audit findings share the unpatched Braces dependency. Production-only audit is clean at the time of this audit. Do not feed untrusted globs/source into the build tooling or expose Vite's development server publicly. See the report for the Tailwind 3 decision and residual risk.
