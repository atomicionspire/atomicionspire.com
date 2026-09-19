# Atomic Ionspire Studios website

Static website published by GitHub Pages from the main branch.

## Verify changes

- Run `node tests/check-site.mjs` to validate the shared navigation, release references, local links, anchors, and complete PNG data including chunk checksums.
- Run `node tests/preview.mjs` and open `http://localhost:4173/tests/visual.html` for the responsive browser harness.
- The harness checks all 12 pages at widths from 320 to 1440 pixels and at 200% text size. It checks page overflow, image loading, header consistency, card decoration, and mobile menu behavior, and provides controls for visual inspection.
- The same harness can check published pages under `/tests/visual.html`. It is not linked from the product and is marked noindex.

## Branding and releases

All public pages use the intact `assets/ionstar-v3.png` image. The original PNG was restored separately for older links. Do not substitute images with CSS `content:url()`.

Use one release version for all page, stylesheet, and script links so older cached pages are not mixed with new assets. All public pages use release 4.1.2.

When publishing a binary through an API, verify the returned Git blob SHA against `git hash-object`. Terminal output can be truncated even when a read command exits successfully; never publish base64 without checking byte counts and hashes.

## Approved redesign

The homepage is the approved animated, tabbed design with Lockridge featured first. Its assets are `style.css`, `premium.css`, `app.js`, and `energy.js`. All detail and policy pages share `style.css`, `premium.css`, and `energy.js`, with `details.css` and `details.js` providing section tabs and detail layouts. Internal navigation stays in the same browser tab. The unused legacy assets remain only for recoverability. The domain configuration is unchanged.

The previous live site is preserved on `backup/pre-premium-redesign-2026-09-19` at commit `2df7a543da8e7d43302fd28bfa3132fa6f1177b0`.
