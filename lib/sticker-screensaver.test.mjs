import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  POSTER_LOGOS,
  STICKER_COLORS,
  buildImageTransitionSnapshot,
  buildPosterSticker,
  buildStickerStack,
  buildStickerTransitionSnapshot,
  transitionOverlayForTheme,
} from "./sticker-screensaver.mjs";

test("poster stickers keep accumulating and layer above earlier stickers", () => {
  const stickers = buildStickerStack(POSTER_LOGOS.length + 22);

  assert.equal(stickers.length, POSTER_LOGOS.length + 22);
  assert.deepEqual(
    stickers.slice(0, POSTER_LOGOS.length).map((sticker) => sticker.src),
    POSTER_LOGOS.map((logo) => logo.src),
  );
  assert.ok(stickers[stickers.length - 1].zIndex > stickers[0].zIndex);
});

test("poster sticker placement stays inside the viewport-safe sticker field", () => {
  for (let i = 0; i < 80; i += 1) {
    const sticker = buildPosterSticker(i);

    assert.ok(sticker.left >= 8 && sticker.left <= 92);
    assert.ok(sticker.top >= 10 && sticker.top <= 88);
    assert.ok(sticker.rotate >= -14 && sticker.rotate <= 14);
  }
});

test("sticker color is independent from the logo sequence", () => {
  const first = buildPosterSticker(0);
  const repeatedLogo = buildPosterSticker(POSTER_LOGOS.length);

  assert.equal(repeatedLogo.src, first.src);
  assert.notEqual(repeatedLogo.bg, first.bg);
});

test("two-tone 3d logos are marked to preserve their original colors", () => {
  const threeD = buildStickerStack(POSTER_LOGOS.length).filter((sticker) => sticker.preserveTone);

  assert.deepEqual(
    threeD.map((sticker) => sticker.src),
    ["/logos/the-lab-3d-line.svg", "/logos/the-lab-3d.svg"],
  );
});

test("sticker palette includes violet", () => {
  assert.ok(STICKER_COLORS.includes("#8a00ff"));
});

test("violet appears in the first visible sticker pass", () => {
  const firstPass = buildStickerStack(POSTER_LOGOS.length + 4);

  assert.ok(firstPass.some((sticker) => sticker.bg === "#8a00ff"));
});

test("preserve-tone logos are self-contained svg images", () => {
  const preserveToneLogos = POSTER_LOGOS.filter((logo) => logo.preserveTone);

  for (const logo of preserveToneLogos) {
    const file = fs.readFileSync(path.join(process.cwd(), "public", logo.src), "utf8");
    const usesClasses = /\bclass="[^"]+"/.test(file);
    const definesClasses = /<style[\s>]/.test(file);

    assert.ok(!usesClasses || definesClasses, `${logo.src} uses SVG classes without inline style definitions`);
  }
});

test("paper uses paper crumple transitions while signal keeps the testcard", () => {
  assert.equal(transitionOverlayForTheme("paper"), "paperCrumple");
  assert.equal(transitionOverlayForTheme("signal"), "testcard");
});

test("paper does not animate into the sticker screensaver", () => {
  assert.equal(transitionOverlayForTheme("paper", "screensaver-enter"), null);
  assert.equal(transitionOverlayForTheme("signal", "screensaver-enter"), "testcard");
});

test("sticker transition snapshot matches the current screensaver stack", () => {
  const activeStickers = buildStickerStack(11);
  const snapshot = buildStickerTransitionSnapshot(activeStickers);

  assert.equal(snapshot.length, activeStickers.length);
  assert.deepEqual(snapshot, activeStickers);
});

test("image transition snapshot preserves the captured frame source", () => {
  assert.deepEqual(buildImageTransitionSnapshot("data:image/png;base64,abc"), {
    kind: "image",
    src: "data:image/png;base64,abc",
  });
});
