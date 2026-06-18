const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("CV timeline items expose linked hover affordances", () => {
  const css = read("assets/css/cv-style.css");

  assert.match(css, /\.cv-section--timeline \.cv-item::after[\s\S]*transition:/);
  assert.match(css, /\.cv-section--timeline \.cv-item:hover::after[\s\S]*scale\(1\.28\)/);
  assert.match(css, /\.cv-section--timeline \.cv-item:hover::after[\s\S]*box-shadow:[\s\S]*var\(--global-link-color\)/);
  assert.match(css, /\.cv-section--timeline \.cv-item:hover \.cv-item__main[\s\S]*translateX\(3px\)/);
});

test("Greedy navigation overflow menu uses rounded glass motion", () => {
  const navigation = read("_sass/layout/_navigation.scss");
  const utilities = read("_sass/include/_utilities.scss");

  assert.match(navigation, /\.greedy-nav[\s\S]*button[\s\S]*border-radius:\s*6px/);
  assert.match(navigation, /\.greedy-nav[\s\S]*button[\s\S]*backdrop-filter:\s*blur/);
  assert.match(navigation, /\.hidden-links[\s\S]*opacity[\s\S]*transform[\s\S]*transition:/);
  assert.match(navigation, /\.hidden-links[\s\S]*&:not\(\.hidden\)/);
  assert.match(utilities, /\.greedy-nav button:hover \.navicon/);
});

test("Sidebar author URLs are grouped into contact and links sections", () => {
  const include = read("_includes/author-profile.html");
  const sidebar = read("_sass/layout/_sidebar.scss");

  assert.match(include, /author__urls-section author__urls-section--contact/);
  assert.match(include, /author__urls-heading">CONTACT/);
  assert.match(include, /author__urls-section author__urls-section--links/);
  assert.match(include, /author__urls-heading">LINKS/);
  assert.match(sidebar, /\.author__urls-section \+ \.author__urls-section/);
  assert.match(sidebar, /\.author__urls-heading/);
});

test("TOC uses a glass card with link focus indicators", () => {
  const navigation = read("_sass/layout/_navigation.scss");

  assert.match(navigation, /\.toc[\s\S]*backdrop-filter:\s*blur\(8px\)/);
  assert.match(navigation, /\.toc[\s\S]*border-radius:\s*8px/);
  assert.match(navigation, /\.toc__menu[\s\S]*&::before/);
  assert.match(navigation, /\.toc__menu[\s\S]*border-left:\s*2px solid var\(--global-link-color\)/);
});

test("Code blocks expose copy buttons and accent framing", () => {
  const syntax = read("_sass/_syntax.scss");
  const mainJs = read("assets/js/_main.js");

  assert.match(syntax, /border-left:\s*3px solid var\(--global-link-color\)/);
  assert.match(syntax, /\.code-copy-button/);
  assert.match(mainJs, /code-copy-button/);
  assert.match(mainJs, /navigator\.clipboard\.writeText/);
  assert.match(mainJs, /execCommand\("copy"\)/);
});
