# Atomic Ionspire Studios website

Static production website published by GitHub Pages.

## V3 premium redesign

The V3 redesign uses a shared graphite/crimson visual system across every public page, including the dedicated Lockridge detail page. The production brand mark is the triangular Atomic Ionspire A with integrated binary data:

- `assets/atomic-ionspire-binary.svg` — animated hero identity
- `assets/atomic-ionspire-binary-static.svg` — static header/footer/favicon identity

Active release assets use version `5.0.0`.

The site remains framework-free HTML, CSS, and JavaScript for predictable GitHub Pages deployment and low runtime overhead.

## Motion and accessibility

Motion is progressive enhancement. The site supports:

- `prefers-reduced-motion: reduce`
- a persistent Motion on/off control
- keyboard-visible focus
- a skip link
- touch-specific navigation behavior
- paused ambient animation while the document is hidden

Continuous ambient drawing uses `requestAnimationFrame`.

## Verify changes

Run:

```bash
node tests/check-site.mjs
node tests/preview.mjs
```

Then open `http://127.0.0.1:4173/tests/visual.html`.

The V3 harness covers all 13 public pages at 320, 360, 390, 412, 768, 1024, and 1440 pixels, plus a 390px / 200% text-size pass. It checks page overflow, shared branding, images, headings, and mobile menu behavior.

## Public page inventory

- `index.html`
- `projects.html`
- `games.html`
- `eve.html`
- `ionspire-os.html`
- `parallel-earth.html`
- `president-simulator.html`
- `ai-dungeon-master.html`
- `lockridge.html`
- `about.html`
- `contact.html`
- `privacy.html`
- `terms.html`

## Deployment safeguards

- Preserve `CNAME`.
- Keep one release version across active HTML/CSS/JS references.
- Run structural and responsive checks before merging.
- Do not treat a homepage-only visual pass as a completed redesign.
- The prior live site remains available in repository history and the existing backup branch.
