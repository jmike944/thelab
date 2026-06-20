# THE LAB® — Creative Worth

A single-page marketing site for **The Lab**, a creative studio. It marries two
looks — warm-paper editorial and a dark cyber-industrial **HUD** — behind one
**DIGITAL / PAPER** toggle that flips the entire page via shared CSS custom
properties.

Built as a faithful production rebuild of the design-system prototype
(`the_lab_site/`), driven entirely by the brandbook tokens.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4** (`@theme inline` bridged to the brand tokens)
- **shadcn/ui** primitives (used selectively for accessible plumbing)
- Self-hosted brand fonts (LAB, CommonWealth, Walkway) + real logo SVGs

## Two themes, one attribute

Every surface reads from `--hud-*` / `--spectrum-*` role tokens. Switching the
theme sets `data-theme="signal"` on `<html>` (persisted to
`localStorage["lab-site-theme"]` and restored pre-paint to avoid a flash), so a
single attribute repaints the whole page:

- **PAPER** (default): off-white `#FFFCF7`, ink `#231F20`, electric blue `#3537FF`
  accent, 2px ink frames with hard offset shadows.
- **DIGITAL** (`data-theme="signal"`): charcoal surface ladder, cyan `#00CFFF`
  accent, glow instead of shadow, sharp 0px geometry, the SMPTE spectrum used
  functionally.

## Sections

Header + fixed side rails · Hero (FIG.01 mark plate) · marquee · "Made in the
lab." work grid with filterable case overlay · Studio · TRANSMIT contact panel ·
HUD terminal footer.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build && npm run start   # production build
```

## Structure

```
app/
  layout.tsx      # root layout + pre-paint theme script
  page.tsx        # the full single-page site (client component)
  globals.css     # brand tokens, theme-signal layer, component styles
components/ui/    # shadcn primitives
public/fonts/     # LAB · CommonWealth · Walkway
public/logos/     # brand mark, wordmark, 3D mark (SVG)
```

🤖 Generated with [Claude Code](https://claude.com/claude-code)
