const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("CV timeline stays visually static when entries are not interactive", () => {
  const css = read("assets/css/cv-style.css");

  assert.match(css, /\.cv-section--timeline \.cv-item::after[\s\S]*box-shadow:/);
  assert.doesNotMatch(css, /\.cv-section--timeline \.cv-item:(?:hover|focus-within)/);
  assert.doesNotMatch(css, /\.cv-item:hover|\.cv-item:focus-within/);
  assert.match(css, /\.cv-document \{[\s\S]*?font-family:\s*"LXGW WenKai Screen"/);
  assert.match(css, /\.cv-header__links a \{[\s\S]*?font-family:\s*"Maple Mono NF CN"/);
  assert.match(css, /\.cv-interest-list li \{[\s\S]*?border-bottom:/);
  assert.match(css, /\.cv-interest-list p \{[\s\S]*?line-height:\s*1\.65/);
});

test("Greedy navigation overflow menu uses rounded glass motion", () => {
  const navigation = read("_sass/layout/_navigation.scss");
  const utilities = read("_sass/include/_utilities.scss");

  assert.match(navigation, /\.greedy-nav[\s\S]*button[\s\S]*border-radius:\s*6px/);
  assert.match(navigation, /\.greedy-nav[\s\S]*button[\s\S]*backdrop-filter:\s*blur/);
  assert.match(navigation, /\.hidden-links[\s\S]*opacity[\s\S]*transform[\s\S]*transition:/);
  assert.match(navigation, /\.hidden-links[\s\S]*&:not\(\.hidden\)/);
  assert.match(navigation, /\.hidden-links[\s\S]*visibility:\s*hidden[\s\S]*&:not\(\.hidden\)[\s\S]*visibility:\s*visible/);
  assert.match(utilities, /\.greedy-nav button:hover \.navicon/);
});

test("Greedy navigation keeps closed links out of the keyboard path", () => {
  const masthead = read("_includes/masthead.html");
  const greedyNav = read("assets/js/plugins/jquery.greedy-navigation.js");

  assert.match(masthead, /id="site-nav-hidden-links"[^>]*aria-hidden="true"[^>]*inert/);
  assert.match(greedyNav, /hiddenLinks\.toggleAttribute\("inert", !shouldOpen\)/);
  assert.match(greedyNav, /shouldOpen \? "关闭导航菜单" : "打开导航菜单"/);
  assert.match(greedyNav, /event\.key === "Escape"[\s\S]*setHiddenLinksOpen\(false, true\)/);
  assert.match(greedyNav, /document\.addEventListener\("pointerdown"[\s\S]*!nav\.contains\(event\.target\)/);
  assert.match(greedyNav, /if \(!shouldOpen && shouldReturnFocus\)[\s\S]*btn\.focus\(\)/);
});

test("Shared layouts expose one stable main landmark without template fades", () => {
  const defaultLayout = read("_layouts/default.html");
  const cvLayout = read("_layouts/cv-layout.html");
  const page = read("_sass/layout/_page.scss");
  const masthead = read("_sass/layout/_masthead.scss");
  const footer = read("_sass/layout/_footer.scss");
  const navigation = read("_sass/layout/_navigation.scss");
  const base = read("_sass/layout/_base.scss");
  const defaultTheme = read("_sass/theme/_default.scss");
  const darkTheme = read("_sass/theme/_dark.scss");

  assert.match(defaultLayout, /class="screen-reader-shortcut" href="#main">跳到主要内容/);
  assert.match(cvLayout, /class="screen-reader-shortcut" href="#main">跳到主要内容/);
  assert.match(cvLayout, /<main id="main" class="cv-main"[\s\S]*?<div class="cv-page">/);
  assert.equal((cvLayout.match(/<main\b/g) || []).length, 1);
  [page, masthead, footer, navigation].forEach((source) => {
    assert.doesNotMatch(source, /animation(?:-delay)?:\s*intro|animation:\s*intro/);
  });
  [base, page, navigation, defaultTheme, darkTheme].forEach((source) => {
    assert.doesNotMatch(source, /\$global-transition|transition:\s*all/);
  });
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

test("Masthead keeps the theme action accessible without page-specific duplicates", () => {
  const navigation = read("_sass/layout/_navigation.scss");
  const masthead = read("_includes/masthead.html");
  const blogEmbed = read("_pages/blog_embed.md");

  assert.match(navigation, /a,\s*\n\s*\.theme-toggle__btn\s*\{[\s\S]*?&:before/);
  assert.match(navigation, /&:hover,\s*\n\s*&:focus-visible\s*\{[\s\S]*?color:\s*var\(--global-masthead-link-color-hover\)/);
  assert.match(navigation, /&:hover:before,\s*\n\s*&:focus-visible:before\s*\{[\s\S]*?scaleX\(1\)/);
  assert.doesNotMatch(navigation, /masthead__menu-item--action/);
  assert.doesNotMatch(masthead, /page\.embed_url|masthead__menu-item--action/);
  assert.doesNotMatch(blogEmbed, /embed_url|layout:\s*embed/);
});

test("jQuery stage 1 vanillaizes local navigation and chrome while keeping plugin calls", () => {
  const greedyNav = read("assets/js/plugins/jquery.greedy-navigation.js");
  const mainJs = read("assets/js/_main.js");
  const pluginStart = mainJs.indexOf("// init smooth scroll");
  const localChrome = mainJs.slice(0, pluginStart);
  const pluginTail = mainJs.slice(pluginStart);

  assert.match(greedyNav, /document\.getElementById\("site-nav"\)/);
  assert.match(greedyNav, /classList\.toggle\("hidden", !shouldOpen\)/);
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

test("Sidebar links disclosure exposes and synchronizes accessible state", () => {
  const include = read("_includes/author-profile.html");
  const mainJs = read("assets/js/_main.js");

  assert.match(include, /id="author-links-toggle"[^>]*type="button"/);
  assert.match(include, /id="author-links-toggle"[^>]*aria-controls="author-links"/);
  assert.match(include, /id="author-links-toggle"[^>]*aria-expanded="false"/);
  assert.match(include, /id="author-links-toggle"[^>]*aria-label="显示个人资料与链接"/);
  assert.match(include, /id="author-links" class="author__urls social-icons"/);
  assert.match(mainJs, /authorUrlsButton\.setAttribute\("aria-expanded", isVisible \? "true" : "false"\)/);
  assert.match(mainJs, /isVisible \? "不显示个人资料与链接" : "显示个人资料与链接"/);
  assert.match(mainJs, /authorUrls\.style\.removeProperty\("display"\)/);
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
