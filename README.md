# THE LAB® — Creative Worth

A single-page site for **The Lab**, a content studio in Saltillo, Coahuila that
specialises in restaurants and experiences. Spanish copy, real projects.

The page tells one story: **from paper to screen**. It opens as print (brand
paper, ink, the LAB face) and the full stop in "Creative worth." grows into the
blue screen where the work is shown, the way The Lab turns a place into content.

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**
- **Tailwind CSS v4** for preflight; the styles themselves are plain CSS in
  `app/globals.css`, organised by section
- Brand fonts loaded with `next/font/local`: **LAB** (compressed caps, display)
  and **CommonWealth** (text)
- Work photos served through `next/image`

## Design

- **Colour:** three brandbook colours, paper `#FFFCF7`, ink `#231F20` and screen
  blue `#3537FF`. Muted tones are `color-mix` derivatives, never new hexes. The
  blue only ever appears as the full stop and the screen it becomes.
- **Hero:** a poster. The masthead is sized to the full width from its measured
  em width (`100cqi / 5.92`). While pinned, a script grows a blue layer from the
  stop's exact box to the inset panel the work section continues.
- **Work:** a pinned feed. Each stretch of scroll swipes to the next project in a
  9:16 frame and fills its segment in a stories-style progress bar (clickable).
- **Motion** runs only when allowed: a head script adds `html.motion` before
  first paint unless `prefers-reduced-motion` is set, and removes it if the app
  hasn't hydrated within 3s. Without it every section is a plain flowing layout.

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
  layout.tsx          # fonts, metadata, motion boot script
  page.tsx            # composes the sections
  globals.css         # tokens + every section's styles
components/site/      # header, hero, work feed, studio, contact, footer
lib/content.ts        # projects, services and contact details
lib/scroll.ts         # scroll-progress helpers for the pinned scenes
public/work/          # project photos
public/logos/         # brand marks (SVG)
public/intro.mp4      # identity film shown in the studio section
```
