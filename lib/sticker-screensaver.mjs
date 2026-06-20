export const POSTER_LOGOS = [
  { src: "/logos/the-lab-complete.svg", width: 280 },
  { src: "/logos/the-lab-mark.svg", width: 230 },
  { src: "/logos/the-lab-variant.svg", width: 275 },
  { src: "/logos/the-lab-variant-2.svg", width: 300 },
  { src: "/logos/the-lab-wordmark.svg", width: 310 },
  { src: "/logos/the-lab-3d-line.svg", width: 260, preserveTone: true },
  { src: "/logos/the-lab-3d.svg", width: 250, preserveTone: true },
  { src: "/logos/the-lab-complete.svg", width: 245 },
];

export const STICKER_COLORS = ["#feff1f", "#00cfff", "#ff9000", "#3ac62f", "#8a00ff", "#ff0074", "#fffcf7", "#3537ff", "#ee1708"];

const STICKER_COLUMNS = 6;
const STICKER_ROWS = 5;
const STICKERS_PER_LAYER = STICKER_COLUMNS * STICKER_ROWS;

export function buildPosterSticker(index) {
  const logo = POSTER_LOGOS[index % POSTER_LOGOS.length];
  const slot = index % STICKERS_PER_LAYER;
  const layer = Math.floor(index / STICKERS_PER_LAYER);
  const col = slot % STICKER_COLUMNS;
  const row = Math.floor(slot / STICKER_COLUMNS);
  const jitterX = ((index * 17) % 9) - 4;
  const jitterY = ((index * 23) % 9) - 4;
  const layerNudge = layer % 2 === 0 ? 0 : 3;

  return {
    ...logo,
    id: index,
    bg: STICKER_COLORS[(index * 5) % STICKER_COLORS.length],
    left: clamp(10 + col * 16 + jitterX + layerNudge, 8, 92),
    top: clamp(12 + row * 18 + jitterY, 10, 88),
    rotate: ((index * 11) % 29) - 14,
    zIndex: index + 1,
  };
}

export function buildStickerStack(count) {
  return Array.from({ length: count }, (_, index) => buildPosterSticker(index));
}

export function buildStickerTransitionSnapshot(stickers) {
  return stickers.slice();
}

export function buildImageTransitionSnapshot(src) {
  return { kind: "image", src };
}

export function transitionOverlayForTheme(theme, phase = "default") {
  if (theme === "signal") return "testcard";
  if (phase === "screensaver-enter") return null;
  return "paperCrumple";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
