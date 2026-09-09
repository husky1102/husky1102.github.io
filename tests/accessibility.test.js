const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("Greedy navigation keeps closed links out of the keyboard path", () => {
  const masthead = read("_includes/masthead.html");
  const greedyNav = read("assets/js/plugins/jquery.greedy-navigation.js");

  assert.match(masthead, /id="site-nav-hidden-links"[^>]*aria-hidden="true"[^>]*inert/);
  assert.match(greedyNav, /hiddenLinks\.toggleAttribute\("inert", !shouldOpen\)/);
  assert.match(greedyNav, /shouldOpen \? "[^"]+" : "[^"]+"/);
  assert.match(greedyNav, /event\.key === "Escape"[\s\S]*setHiddenLinksOpen\(false, true\)/);
  assert.match(greedyNav, /document\.addEventListener\("pointerdown"[\s\S]*!nav\.contains\(event\.target\)/);
  assert.match(greedyNav, /if \(!shouldOpen && shouldReturnFocus\)[\s\S]*btn\.focus\(\)/);
});

test("Sidebar links disclosure exposes and synchronizes accessible state", () => {
  const include = read("_includes/author-profile.html");
  const mainJs = read("assets/js/_main.js");

  assert.match(include, /id="author-links-toggle"[^>]*type="button"/);
  assert.match(include, /id="author-links-toggle"[^>]*aria-controls="author-links"/);
  assert.match(include, /id="author-links-toggle"[^>]*aria-expanded="false"/);
  assert.match(include, /id="author-links-toggle"[^>]*aria-label="[^"]+"/);
  assert.match(include, /id="author-links"/);
  assert.match(mainJs, /authorUrlsButton\.setAttribute\("aria-expanded", isVisible \? "true" : "false"\)/);
  assert.match(mainJs, /isVisible \? "[^"]+" : "[^"]+"/);
  assert.match(mainJs, /authorUrls\.style\.removeProperty\("display"\)/);
});

test("Theme toggle stays visible and independent from greedy overflow menu", () => {
  const masthead = read("_includes/masthead.html");
  const greedyNav = read("assets/js/plugins/jquery.greedy-navigation.js");

  assert.match(masthead, /id="theme-toggle"[^>]*>\s*<button[^>]*aria-label="[^"]+"/);
  assert.match(masthead, /class="greedy-nav__toggle"/);
  assert.match(greedyNav, /querySelector\("#site-nav > \.greedy-nav__toggle"\)/);
  assert.doesNotMatch(greedyNav, /querySelector\("#site-nav button"\)/);
});

test("Primary controls expose at least 44px touch targets", () => {
  const custom = read("_sass/custom.scss");
  const navigation = read("_sass/layout/_navigation.scss");
  const sidebar = read("_sass/layout/_sidebar.scss");
  const cv = read("assets/css/cv-style.css");

  assert.match(custom, /\.home-hero__actions \.btn \{[\s\S]*?min-height:\s*2\.75rem/);
  assert.match(navigation, /\.greedy-nav \{[\s\S]*?button \{[\s\S]*?height:\s*2\.75rem/);
  assert.match(navigation, /#theme-toggle[\s\S]*?width:\s*2\.75rem[\s\S]*?height:\s*2\.75rem/);
  assert.match(sidebar, /\.author__urls-wrapper[\s\S]*?button \{[\s\S]*?min-height:\s*2\.75rem/);
  assert.match(cv, /\.cv-header__links a \{[\s\S]*?min-height:\s*2\.75rem/);
  assert.match(cv, /\.cv-publication-item__links a,[\s\S]*?min-height:\s*2\.75rem/);
});

test("Layouts provide a main landmark and skip links", () => {
  const defaultLayout = read("_layouts/default.html");
  const cvLayout = read("_layouts/cv-layout.html");

  assert.match(defaultLayout, /class="screen-reader-shortcut" href="#main">[^<]+/);
  assert.match(cvLayout, /class="screen-reader-shortcut" href="#main">[^<]+/);
  assert.match(cvLayout, /<main id="main"/);
  assert.equal((cvLayout.match(/<main\b/g) || []).length, 1);
});

test("Code blocks provide a copy action with clipboard fallback", () => {
  const syntax = read("_sass/_syntax.scss");
  const mainJs = read("assets/js/_main.js");

  assert.match(syntax, /\.code-copy-button/);
  assert.match(mainJs, /code-copy-button/);
  assert.match(mainJs, /navigator\.clipboard\.writeText/);
  assert.match(mainJs, /execCommand\("copy"\)/);
});

test("Wide tables can scroll within narrow screens", () => {
  assert.match(read("_sass/layout/_tables.scss"), /overflow-x:\s*auto/);
});

test("Form controls have a visible keyboard focus indicator", () => {
  assert.match(read("_sass/layout/_forms.scss"), /:focus-visible[\s\S]*?outline:\s*[^;]+/);
});
