const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("Portrait motion is scoped to fine pointers and cleaned up", () => {
  const source = read("assets/js/_home-motion.js");
  assert.match(source, /\(hover: hover\) and \(pointer: fine\)/);
  assert.match(source, /stage\.addEventListener\("pointermove", handlePortraitPointerMove\)/);
  assert.match(source, /stage\.removeEventListener\("pointermove", handlePortraitPointerMove\)/);
  assert.match(source, /pointerMedia\.revert\(\)/);
});

test("Theme transitions preserve fallback, latest intent, and reduced motion", () => {
  const source = read("assets/js/_main.js");
  assert.match(source, /typeof document\.startViewTransition === "function"/);
  assert.match(source, /!themeMotionMedia\.matches/);
  assert.match(source, /requestedTheme/);
  assert.match(source, /if \(!canAnimateTheme\)[\s\S]*?setThemeWithoutMotion\(newTheme\)/);
  assert.match(source, /activeThemeTransition\.finished\.then\(finishThemeSwitch, finishThemeSwitch\)/);
  assert.match(source, /activeThemeTransition\.skipTransition\(\)/);
});

test("Sidebar avatar respects reduced motion", () => {
  const sidebar = read("_sass/layout/_sidebar.scss");

  assert.match(
    sidebar,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.author__profile > \.author__avatar:hover,[\s\S]*?\.author__profile:focus-within > \.author__avatar[\s\S]*?transform:\s*none[\s\S]*?overflow:\s*hidden/
  );
  assert.match(
    sidebar,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.author__profile > \.author__avatar:hover[\s\S]*?img\s*\{[\s\S]*?transform:\s*translateY\(var\(--avatar-art-y\)\)[\s\S]*?filter:\s*none/
  );
});

test("Homepage motion supports reduced motion and releases observers", () => {
  const source = read("assets/js/_home-motion.js");
  assert.match(source, /\(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /data-home-motion", "static"/);
  assert.match(source, /document\.hidden/);
  assert.match(source, /visibilitychange/);
  assert.match(source, /stageObserver\.disconnect\(\)/);
});
