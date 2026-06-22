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

test("Theme toggle stays visible and independent from greedy overflow menu", () => {
  const masthead = read("_includes/masthead.html");
  const greedyNav = read("assets/js/plugins/jquery.greedy-navigation.js");
  const mainJs = read("assets/js/_main.js");

  assert.match(masthead, /class="greedy-nav__toggle"/);
  assert.match(masthead, /id="theme-toggle"[\s\S]*fa-sun/);
  assert.match(masthead, /aria-label="切换到深色模式"/);
  assert.match(greedyNav, /querySelector\("#site-nav > \.greedy-nav__toggle"\)/);
  assert.doesNotMatch(greedyNav, /querySelector\("#site-nav button"\)/);
  assert.match(mainJs, /fa-moon/);
  assert.match(mainJs, /切换到浅色模式/);
});

test("Masthead action icons use a stable square focus target", () => {
  const navigation = read("_sass/layout/_navigation.scss");
  const blogEmbed = read("_pages/blog_embed.md");

  assert.match(navigation, /\.masthead__menu-item--action[\s\S]*?display:\s*inline-flex/);
  assert.match(navigation, /\.masthead__menu-item--action[\s\S]*?width:\s*2\.25rem/);
  assert.match(navigation, /\.masthead__menu-item--action[\s\S]*?height:\s*2\.25rem/);
  assert.match(navigation, /\.masthead__menu-item--action[\s\S]*?&:focus[\s\S]*?outline:\s*none/);
  assert.match(navigation, /a,\s*\n\s*\.theme-toggle__btn\s*\{[\s\S]*?&:before/);
  assert.match(navigation, /&:hover,\s*\n\s*&:focus-visible\s*\{[\s\S]*?color:\s*var\(--global-masthead-link-color-hover\)/);
  assert.match(navigation, /&:hover:before,\s*\n\s*&:focus-visible:before\s*\{[\s\S]*?scaleX\(1\)/);
  assert.match(blogEmbed, /embed_url:\s*"https:\/\/www\.husky1102\.top\/"/);
});

test("jQuery stage 1 vanillaizes local navigation and chrome while keeping plugin calls", () => {
  const greedyNav = read("assets/js/plugins/jquery.greedy-navigation.js");
  const mainJs = read("assets/js/_main.js");
  const pluginStart = mainJs.indexOf("// init smooth scroll");
  const localChrome = mainJs.slice(0, pluginStart);
  const pluginTail = mainJs.slice(pluginStart);

  assert.match(greedyNav, /document\.getElementById\("site-nav"\)/);
  assert.match(greedyNav, /classList\.toggle\("hidden", !isOpen\)/);
  assert.match(greedyNav, /insertBefore\(movableLinks\[movableLinks\.length - 1\], hiddenLinks\.firstElementChild\)/);
  assert.doesNotMatch(greedyNav, /\$\(|jQuery/);

  assert.match(localChrome, /root\.toggleAttribute\("data-theme", isDark\)/);
  assert.match(localChrome, /scrollProgress\.style\.width =/);
  assert.match(localChrome, /document\.querySelectorAll\("div\.highlighter-rouge, figure\.highlight"\)/);
  assert.match(localChrome, /authorUrlsButton\.addEventListener\("click"/);
  assert.doesNotMatch(localChrome, /\$\(|jQuery\s*\(/);

  assert.match(pluginTail, /\$\("a"\)\.smoothScroll/);
  assert.match(pluginTail, /\$\(this\)/);
  assert.match(pluginTail, /\$\("\.image-popup"\)\.magnificPopup/);
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

test("Back-to-top arrow has hover motion and dark-mode glow", () => {
  const custom = read("_sass/custom.scss");

  assert.match(custom, /\.back-to-top i[\s\S]*transition:[\s\S]*transform 0\.28s ease/);
  assert.match(custom, /\.back-to-top:hover i[\s\S]*transform:\s*translateY\(-3px\)/);
  assert.match(custom, /html\[data-theme="dark"\] \.back-to-top:hover[\s\S]*rgba\(103, 232, 249, 0\.15\)/);
  assert.match(custom, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.back-to-top i[\s\S]*transform:\s*none/);
});
