const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("I-29: .btn--inverse hover fills the brand color with legible text (no white-on-cream)", () => {
  const btn = read("_sass/layout/_buttons.scss");
  assert.match(btn, /&--inverse[\s\S]*?:hover[\s\S]*?background-color:\s*var\(--global-link-color\)/);
  assert.match(btn, /&--inverse[\s\S]*?:hover[\s\S]*?color:\s*var\(--global-bg-color\)/);
});

test("I-29: home hero buttons carry a readable label and a filled hover", () => {
  const custom = read("_sass/custom.scss");
  assert.match(custom, /\.home-hero__actions \.btn \{[\s\S]*?color:\s*var\(--global-link-color\)/);
  assert.match(custom, /\.home-hero__actions \.btn:hover[\s\S]*?background:\s*var\(--global-link-color\)/);
});

test("I-33: base .btn is brand-filled and .btn--x has a defined color", () => {
  const btn = read("_sass/layout/_buttons.scss");
  assert.match(btn, /\.btn \{[\s\S]*?background-color:\s*var\(--global-link-color\)/);
  assert.match(btn, /\(x,\s*#14202b\)/);
});

test("I-30: notices are theme-aware (theme text color, dark accents, brand left accent, no baked light bg)", () => {
  const notices = read("_sass/layout/_notices.scss");
  assert.match(notices, /color:\s*var\(--global-text-color\)/);
  assert.match(notices, /border-left:\s*4px solid var\(--notice-accent\)/);
  assert.match(notices, /html\[data-theme="dark"\][\s\S]*?--notice-success/);
  assert.doesNotMatch(notices, /background-color:\s*mix\(#fff,\s*\$notice-color,\s*90%\)/);
});

test("I-31: tables scroll on small screens and use horizontal rules + zebra + hover", () => {
  const tables = read("_sass/layout/_tables.scss");
  assert.match(tables, /table \{[\s\S]*?display:\s*block/);
  assert.match(tables, /overflow-x:\s*auto/);
  assert.match(tables, /tbody tr:nth-child\(even\)/);
  assert.match(tables, /tbody tr:hover/);
});

test("I-32: heading hierarchy adds weight/tracking, balance, and a wider content scale", () => {
  const custom = read("_sass/custom.scss");
  assert.match(custom, /letter-spacing:\s*-0\.014em/);
  assert.match(custom, /text-wrap:\s*balance/);
  assert.match(custom, /\.page__content \{[\s\S]*?h4 \{ font-size: 1\.02rem/);
  assert.match(custom, /\.page__title \{[\s\S]*?clamp\(1\.85rem/);
});

test("I-34: 404 is a recovery page with a code glyph and action buttons", () => {
  const md = read("_pages/404.md");
  assert.match(md, /error-404__code/);
  assert.match(md, /error-404__actions/);
  assert.match(md, /class="btn"/);
  const custom = read("_sass/custom.scss");
  assert.match(custom, /\.error-404__code \{[\s\S]*?clamp\(/);
});

test("I-35: card elevation is tiered (quiet archive cards, washed+lifted primary info card)", () => {
  const custom = read("_sass/custom.scss");
  assert.match(custom, /\.archive__item--card \{[\s\S]*?box-shadow:\s*none/);
  assert.match(custom, /\.home-info-card \{[\s\S]*?linear-gradient[\s\S]*?box-shadow:\s*0 6px 18px/);
});

test("Minor: forms get a visible focus ring + theme-aware background; selection is branded", () => {
  const forms = read("_sass/layout/_forms.scss");
  assert.match(forms, /:focus-visible[\s\S]*?outline:\s*2px solid var\(--global-link-color\)/);
  assert.match(forms, /background-color:\s*var\(--global-bg-color\)/);
  const custom = read("_sass/custom.scss");
  assert.match(custom, /::selection \{[\s\S]*?color-mix/);
});

test("I-36: avatar hover uses responsive mask fade and rotating gradient ring with shadow glow", () => {
  const sidebar = read("_sass/layout/_sidebar.scss");

  // Check SCSS variables and animations
  assert.match(sidebar, /clip-path:\s*none/);
  assert.match(sidebar, /mask-image:\s*linear-gradient/);
  assert.match(sidebar, /animation:\s*avatar-spin/);
  assert.match(sidebar, /filter:\s*drop-shadow/);
});

test("I-37: avatar hover respects reduced motion and matches sidebar backdrop", () => {
  const sidebar = read("_sass/layout/_sidebar.scss");

  assert.match(
    sidebar,
    /&::after\s*\{[\s\S]*?background:\s*color-mix\(in srgb,\s*var\(--global-footer-bg-color\) 55%,\s*var\(--global-bg-color\)\)/
  );
  assert.match(
    sidebar,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?&::before\s*\{[\s\S]*?animation:\s*none/
  );
  assert.match(
    sidebar,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?&:hover\s*\{[\s\S]*?transform:\s*none[\s\S]*?box-shadow:\s*0 10px 26px rgba\(#000,\s*0\.10\)/
  );
  assert.match(
    sidebar,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?&:hover img\s*\{[\s\S]*?transform:\s*translateY\(var\(--avatar-art-y\)\)[\s\S]*?filter:\s*none/
  );
});
