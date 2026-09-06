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

test("I-35: archive cards stay quiet while homepage research uses open tracks", () => {
  const custom = read("_sass/custom.scss");
  assert.match(custom, /\.archive__item--card \{[\s\S]*?box-shadow:\s*none/);
  assert.match(custom, /\.home-research-track \{[\s\S]*?border-top:\s*1px solid var\(--global-border-color\)/);
});

test("I-42: site navigation names Husky while the homepage keeps the full identity", () => {
  const config = read("_config.yml");
  const home = read("_pages/home.md");
  const archive = read("_layouts/archive.html");

  assert.match(config, /title\s*:\s*"Husky"/);
  assert.match(config, /description\s*:\s*&description "西安交通大学人工智能硕士生，关注具身智能、智能体记忆与持续学习。"/);
  assert.match(home, /title:\s*"Husky1102"/);
  assert.match(home, /hide_title:\s*true/);
  assert.match(home, /author_profile:\s*false/);
  assert.match(archive, /\{% unless page\.hide_title %\}[\s\S]*?<h1 class="page__title">\{\{ page\.title \}\}<\/h1>[\s\S]*?\{% endunless %\}/);
});

test("I-42: homepage uses a character stage and differentiated information structures", () => {
  const home = read("_pages/home.md");
  const custom = read("_sass/custom.scss");
  const stageRule = custom.match(/\.home-hero__stage \{[\s\S]*?\n\}/)[0];

  assert.match(home, /class="home-hero__stage"/);
  assert.equal((home.match(/avatar-gpt063\.webp/g) || []).length, 2);
  assert.match(home, /home-hero__portrait-window[\s\S]*?home-hero__character--inside[\s\S]*?home-hero__portrait-ring[\s\S]*?home-hero__portrait-front[\s\S]*?home-hero__character--front/);
  assert.match(home, /home-hero__stage" role="img" aria-label=/);
  assert.doesNotMatch(home, /home-hero__stage"[^>]*tabindex=/);
  assert.equal((home.match(/class="home-hero__character[^>]*alt=""/g) || []).length, 2);
  assert.doesNotMatch(home, /home-hero__orbit/);
  assert.equal((home.match(/class="home-research-track"/g) || []).length, 3);
  assert.match(home, /class="home-now"/);
  assert.match(home, /class="home-destination-list"/);
  assert.doesNotMatch(home, /home-card-grid|home-info-card/);
  assert.match(custom, /\.home-hero__lead \{[\s\S]*?font-family:\s*"LXGW WenKai Screen"[\s\S]*?line-height:\s*1\.72/);
  assert.match(custom, /\.home-hero__stage \{[\s\S]*?isolation:\s*isolate/);
  assert.match(stageRule, /overflow:\s*visible/);
  assert.doesNotMatch(stageRule, /border|linear-gradient/);
  assert.match(custom, /\.home-hero__stage::before[\s\S]*?radial-gradient/);
  assert.match(custom, /\.home-hero__stage::after[\s\S]*?radial-gradient\(ellipse/);
  assert.match(custom, /\.home-hero__portrait-window \{[\s\S]*?clip-path:\s*circle\(42% at 50% 50%\)[\s\S]*?transparent 78%/);
  assert.match(custom, /\.home-hero__portrait-ring \{[\s\S]*?z-index:\s*2[\s\S]*?border:\s*2px solid/);
  assert.match(custom, /\.home-hero__portrait-front \{[\s\S]*?z-index:\s*3[\s\S]*?overflow:\s*visible[\s\S]*?clip-path:\s*polygon\([\s\S]*?78% 81%[\s\S]*?50% 92%[\s\S]*?22% 81%/);
  assert.match(custom, /\.home-research-track/);
  assert.match(custom, /\.home-now/);
  assert.match(custom, /\.home-destination-list/);
});

test("I-44: homepage profile labels name education stages and current city directly", () => {
  const home = read("_pages/home.md");
  const custom = read("_sass/custom.scss");

  assert.match(home, /<dt>硕士<\/dt><dd>西安交通大学，人工智能硕士在读<\/dd>/);
  assert.match(home, /<dt>本科<\/dt><dd>湖南大学，机器人工程学士，2025<\/dd>/);
  assert.match(home, /<dt>现居<\/dt><dd>中国陕西省西安市<\/dd>/);
  assert.doesNotMatch(home, /<dt>(学习|基础|所在)<\/dt>/);
  assert.match(custom, /@media \(max-width: 30em\)[\s\S]*?\.home-hero__stage-note \{[\s\S]*?display:\s*none/);
  assert.match(custom, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.home-hero__character[\s\S]*?will-change:\s*auto/);
});

test("I-45: homepage portrait responds to pointing without entering keyboard order", () => {
  const custom = read("_sass/custom.scss");
  const homeMotion = read("assets/js/_home-motion.js");

  assert.match(custom, /\.home-hero__stage:hover \.home-hero__character[\s\S]*?translate3d\(0, -3\.5%, 0\) scale\(1\.07\) rotate\(-0\.35deg\)/);
  assert.match(custom, /\.home-hero__stage\.is-popped \.home-hero__character/);
  assert.match(custom, /\.home-hero__stage:hover \.home-hero__portrait-ring[\s\S]*?transform:\s*scale\(0\.95\)/);
  assert.match(custom, /\.home-hero__portrait-ring::before[\s\S]*?conic-gradient[\s\S]*?opacity:\s*0/);
  assert.match(custom, /\.home-hero__portrait-ring::after[\s\S]*?background:\s*#f9c97f[\s\S]*?opacity:\s*0/);
  assert.match(custom, /\.home-hero__stage\.is-popped \.home-hero__portrait-ring::before[\s\S]*?opacity:\s*0\.82/);
  assert.match(custom, /\.home-hero__stage\.is-popped \.home-hero__portrait-ring::after[\s\S]*?opacity:\s*1/);
  assert.match(custom, /\.home-hero__stage\.is-popped \.home-hero__stage-note[\s\S]*?opacity:\s*0/);
  assert.doesNotMatch(custom, /\.home-hero__stage:focus-visible/);
  assert.match(custom, /@media \(hover: none\), \(pointer: coarse\)[\s\S]*?\.home-hero__stage:hover:not\(\.is-popped\) \.home-hero__character[\s\S]*?transform:\s*none/);
  assert.match(homeMotion, /var portrait = homeHero\.querySelector\("\.home-hero__portrait"\)/);
  assert.match(homeMotion, /event\.pointerType === "mouse" \|\| event\.pointerType === "pen"/);
  assert.match(homeMotion, /stage\.classList\.add\("is-popped"\)/);
  assert.match(homeMotion, /stage\.addEventListener\("pointerenter", handlePortraitPointerEnter\)/);
  assert.match(homeMotion, /stage\.removeEventListener\("pointerenter", handlePortraitPointerEnter\)/);
  assert.doesNotMatch(homeMotion, /handlePortraitFocus|handlePortraitBlur|addEventListener\("focus"/);
  assert.doesNotMatch(homeMotion, /querySelector\("\.home-hero__character"\)/);
  assert.doesNotMatch(homeMotion, /outerOrbit|innerOrbit|orbitElements/);
});

test("I-46: manual theme switching reveals from the toggle with an accessible fallback", () => {
  const custom = read("_sass/custom.scss");
  const mainJs = read("assets/js/_main.js");

  assert.match(mainJs, /var themeMotionMedia = window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(mainJs, /typeof document\.startViewTransition === "function"/);
  assert.match(mainJs, /themeToggleButton\.getBoundingClientRect\(\)/);
  assert.match(mainJs, /Math\.hypot\(/);
  assert.match(mainJs, /--theme-transition-x/);
  assert.match(mainJs, /--theme-transition-y/);
  assert.match(mainJs, /--theme-transition-radius/);
  assert.match(mainJs, /document\.startViewTransition\(function \(\) \{[\s\S]*?setTheme\(newTheme\)/);
  assert.match(mainJs, /themeTransition\.finished\.then\(finishThemeSwitch, finishThemeSwitch\)/);
  assert.match(mainJs, /if \(!canAnimateTheme\) \{[\s\S]*?setTheme\(newTheme\)/);
  assert.match(custom, /::view-transition-old\(root\),[\s\S]*?::view-transition-new\(root\)/);
  assert.match(custom, /@keyframes theme-reveal[\s\S]*?clip-path:\s*circle\(0 at var\(--theme-transition-x\) var\(--theme-transition-y\)\)/);
  assert.match(custom, /clip-path:\s*circle\(var\(--theme-transition-radius\) at var\(--theme-transition-x\) var\(--theme-transition-y\)\)/);
  assert.match(custom, /html\.is-theme-transitioning \*[\s\S]*?transition-duration:\s*0s !important/);
});

test("I-42: homepage destinations keep accepted URLs and describe the action", () => {
  const home = read("_pages/home.md");

  assert.match(home, /href="\{\{ base_path \}\}\/cv\/">查看英文 CV<\/a>/);
  assert.match(home, /href="\{\{ base_path \}\}\/cv_zh\/">查看中文简历<\/a>/);
  assert.match(home, /href="\{\{ base_path \}\}\/blog_embed\/">阅读个人博客<\/a>/);
  assert.match(home, /href="https:\/\/github\.com\/husky1102"/);
  assert.match(home, /href="https:\/\/kaggle\.com\/husky1102"/);
  assert.match(home, /href="\{\{ base_path \}\}\/about\/"/);
});

test("I-42: mobile homepage controls expose at least 44px targets", () => {
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

test("I-48: mobile cold loads keep the portrait centered and surface actions sooner", () => {
  const custom = read("_sass/custom.scss");
  const homeMotion = read("assets/js/_home-motion.js");
  const portraitRule = custom.match(/\.home-hero__portrait \{[\s\S]*?\n\}/)[0];

  assert.match(portraitRule, /right:\s*0/);
  assert.match(portraitRule, /left:\s*0/);
  assert.match(portraitRule, /margin-inline:\s*auto/);
  assert.doesNotMatch(portraitRule, /translateX\(-50%\)/);
  assert.doesNotMatch(homeMotion, /xPercent:\s*-50/);
  assert.match(custom, /@media \(max-width: 30em\)[\s\S]*?\.home-hero__stage \{[\s\S]*?min-height:\s*clamp\(13\.5rem, 68vw, 17rem\)/);
  assert.match(custom, /@media \(max-width: 30em\)[\s\S]*?\.home-hero__actions \{[\s\S]*?order:\s*1/);
  assert.match(custom, /@media \(max-width: 30em\)[\s\S]*?\.home-hero__lead-en \{[\s\S]*?order:\s*2/);
});

test("I-43: bilingual CVs omit unsupported experience and wrap the full publications section", () => {
  const cv = read("_pages/cv.md");
  const cvZh = read("_pages/cv_zh.md");
  const cvLayout = read("_layouts/cv-layout.html");
  const seo = read("_includes/seo.html");

  assert.match(cv, /lang:\s*en[\s\S]*locale:\s*en-US/);
  assert.match(cvLayout, /page\.lang \| default: document_locale/);
  assert.match(seo, /page\.locale \| default: site\.locale/);
  assert.doesNotMatch(cv, /Work Experience|No work experience yet|cv-item--empty/);
  assert.doesNotMatch(cvZh, /工作经历|暂无工作经历|cv-item--empty/);
  assert.match(
    cv,
    /\{% if site\.publications\.size > 0 %\}\s*<section class="cv-section" aria-labelledby="publications">[\s\S]*<\/section>\s*\{% endif %\}\s*<\/article>/
  );
  assert.match(
    cvZh,
    /\{% if site\.publications\.size > 0 %\}\s*<section class="cv-section" aria-labelledby="publications">[\s\S]*<\/section>\s*\{% endif %\}\s*<\/article>/
  );
  assert.doesNotMatch(cv, /cv-empty|No publication entries are currently listed/);
  assert.doesNotMatch(cvZh, /cv-empty|当前没有列出的论文条目/);
});

test("I-43: dark theme uses graphite surfaces and a restrained static ambient trace", () => {
  const dark = read("_sass/theme/_dark.scss");
  const custom = read("_sass/custom.scss");

  assert.match(dark, /\$background\s*:\s*#17191d/);
  assert.match(dark, /--global-footer-bg-color\s*:\s*#22252a/);
  assert.match(dark, /--global-thead-color\s*:\s*#25292f/);
  assert.doesNotMatch(dark, /#0f172a|#111c31/);
  assert.match(read("assets/js/_main.js"), /isDark \? "#17191d" : "#fbfaf7"/);
  assert.match(custom, /radial-gradient\(circle at 86% 4%, rgba\(246, 173, 99, 0\.04\)/);
  assert.match(custom, /html\[data-theme="dark"\] body \{[\s\S]*?background-repeat:\s*no-repeat/);
  assert.doesNotMatch(custom, /rgba\(196, 181, 253/);
  assert.match(custom, /rgba\(103, 232, 249, 0\.055\)/);
});

test("Minor: forms get a visible focus ring + theme-aware background; selection is branded", () => {
  const forms = read("_sass/layout/_forms.scss");
  assert.match(forms, /:focus-visible[\s\S]*?outline:\s*2px solid var\(--global-link-color\)/);
  assert.match(forms, /background-color:\s*var\(--global-bg-color\)/);
  const custom = read("_sass/custom.scss");
  assert.match(custom, /::selection \{[\s\S]*?color-mix/);
});

test("I-36: avatar hover and keyboard focus use a finite pop-out response", () => {
  const sidebar = read("_sass/layout/_sidebar.scss");

  assert.match(sidebar, /--avatar-art-y:\s*10px/);
  assert.match(
    sidebar,
    /\.author__profile > \.author__avatar:hover,\s*\.author__profile:focus-within > \.author__avatar \{[\s\S]*?overflow:\s*visible[\s\S]*?filter:\s*drop-shadow[\s\S]*?transform:\s*scale\(1\.06\)/
  );
  assert.match(sidebar, /conic-gradient\(\s*from 210deg/);
  assert.doesNotMatch(sidebar, /@keyframes avatar|animation:\s*avatar|animation-duration|infinite/);
  assert.doesNotMatch(sidebar, /will-change:/);
});

test("I-37: avatar finite response respects reduced motion and matches sidebar backdrop", () => {
  const sidebar = read("_sass/layout/_sidebar.scss");

  assert.match(
    sidebar,
    /&::after\s*\{[\s\S]*?background-image:[\s\S]*?linear-gradient\([\s\S]*?color-mix\(in srgb,\s*var\(--global-footer-bg-color\) 55%,\s*var\(--global-bg-color\)\)/
  );
  assert.match(
    sidebar,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.author__profile > \.author__avatar:hover,[\s\S]*?\.author__profile:focus-within > \.author__avatar[\s\S]*?transform:\s*none[\s\S]*?overflow:\s*hidden/
  );
  assert.match(
    sidebar,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.author__profile > \.author__avatar:hover[\s\S]*?img\s*\{[\s\S]*?transform:\s*translateY\(var\(--avatar-art-y\)\)[\s\S]*?filter:\s*none/
  );
});

test("I-38: local sidebar avatar uses a deploy-safe relative image URL", () => {
  const include = read("_includes/author-profile.html");

  assert.match(include, /author\.avatar \| prepend:\s*"\/images\/" \| relative_url/);
  assert.doesNotMatch(include, /author\.avatar \| prepend:\s*"\/images\/" \| prepend:\s*base_path/);
  assert.doesNotMatch(include, /<img[^>]+class="author__avatar"/);
});

test("I-39: GSAP runs a visible-baseline, lifecycle-aware homepage motion system", () => {
  const pkg = JSON.parse(read("package.json"));
  const mainJs = read("assets/js/_main.js");
  const homeMotion = read("assets/js/_home-motion.js");
  const scripts = read("_includes/scripts.html");
  const home = read("_pages/home.md");

  assert.match(pkg.dependencies.gsap, /^\^3\./);
  assert.doesNotMatch(pkg.scripts["uglify:main"], /gsap|ScrollTrigger|_home-motion/);
  assert.match(pkg.scripts["uglify:home-motion"], /gsap\.min\.js[\s\S]*ScrollTrigger\.min\.js[\s\S]*_home-motion\.js/);
  assert.match(home, /home_motion:\s*true/);
  assert.match(scripts, /main\.min\.js[\s\S]*if page\.home_motion[\s\S]*home-motion\.min\.js/);
  assert.doesNotMatch(mainJs, /window\.gsap|window\.ScrollTrigger|home-hero|scrollTrigger:/);
  assert.doesNotMatch(mainJs, /setInterval/);
  assert.match(mainJs, /footerResizeTimer[\s\S]*window\.clearTimeout\(footerResizeTimer\)[\s\S]*window\.setTimeout\([\s\S]*120/);
  assert.match(mainJs, /root\.getAttribute\("data-scroll-progress-engine"\) !== "gsap"[\s\S]*updateScrollProgressFallback\(scrollTop, scrollHeight\)/);
  assert.equal((mainJs.match(/scrollProgress\.style\.width =/g) || []).length, 1);
  assert.match(homeMotion, /gsapApi\.registerPlugin\(scrollTriggerApi\)/);
  assert.match(homeMotion, /gsapApi\.matchMedia\(\)/);
  assert.match(homeMotion, /\(prefers-reduced-motion: no-preference\)/);
  assert.match(homeMotion, /data-home-motion", "static"/);
  assert.match(homeMotion, /data-home-motion", "active"/);
  assert.match(homeMotion, /var initHomepageMotion = function \(\)/);
  assert.match(homeMotion, /gsapApi\.timeline\(\{[\s\S]*?defaults:/);
  assert.match(homeMotion, /\.home-hero__stage/);
  assert.match(homeMotion, /\.home-hero__portrait/);
  assert.match(homeMotion, /\.home-hero__portrait-ring/);
  assert.match(homeMotion, /\.home-hero__lead-en/);
  assert.match(homeMotion, /opacity:\s*0\.72/);
  assert.match(homeMotion, /opacity:\s*0\.78/);
  assert.match(homeMotion, /opacity:\s*0\.82/);
  assert.doesNotMatch(homeMotion, /autoAlpha:\s*0/);
  assert.match(homeMotion, /repeat:\s*-1/);
  assert.match(homeMotion, /IntersectionObserver/);
  assert.match(homeMotion, /document\.hidden/);
  assert.match(homeMotion, /visibilitychange/);
  assert.match(homeMotion, /stageObserver\.disconnect\(\)/);
  assert.doesNotMatch(homeMotion, /scrollTriggerApi\.batch|\.archive__item--card|\.home-info-card/);
  assert.match(homeMotion, /id:\s*"site-scroll-progress"/);
  assert.match(homeMotion, /scaleX:\s*1/);
  assert.equal((homeMotion.match(/scrollTrigger:/g) || []).length, 1);
});

test("I-41: dark ambient rendering is static and has no continuous card loops", () => {
  const custom = read("_sass/custom.scss");

  assert.match(
    custom,
    /html\[data-theme="dark"\] body \{[\s\S]*?radial-gradient\(circle at 50% 8%, rgba\(103, 232, 249, 0\.055\)/
  );
  assert.doesNotMatch(custom, /--dark-ambient-|background-attachment/);
  assert.doesNotMatch(custom, /darkAmbientCardBreath|\.archive__item--card::before/);
  assert.doesNotMatch(custom, /animation:[^;]*infinite/);
});

test("I-41: JavaScript performs no ambient pointer-driven rendering", () => {
  const mainJs = read("assets/js/_main.js");
  const homeMotion = read("assets/js/_home-motion.js");

  for (const source of [mainJs, homeMotion]) {
    assert.doesNotMatch(source, /initDarkAmbientMotion|ambientMedia|--dark-ambient-/);
    assert.doesNotMatch(source, /quickSetter|quickTo/);
    assert.doesNotMatch(source, /pointermove|mousemove/);
  }
});

test("I-40: blog route uses one direct destination and the footer stays concise", () => {
  const blogEmbed = read("_pages/blog_embed.md");
  const footer = read("_includes/footer.html");
  const contributing = read("CONTRIBUTING.md");

  assert.match(blogEmbed, /class="blog-entry__destination" href="https:\/\/www\.husky1102\.top\/" target="_blank" rel="noopener noreferrer"/);
  assert.match(blogEmbed, /前往阅读/);
  assert.doesNotMatch(blogEmbed, /<iframe|blog-embed-iframe|postMessage|MutationObserver|themeBridge|<script>/);
  assert.match(footer, /href="https:\/\/github\.com\/\{\{ site\.author\.github \}\}"/);
  assert.match(footer, /订阅更新/);
  assert.match(footer, /href="\{\{ base_path \}\}\/terms\/"/);
  assert.doesNotMatch(footer, /Jekyll|AcademicPages|Minimal Mistakes|Bitbucket|Powered by|技术支持/);
  assert.match(contributing, /Ruby dependencies are locked in `Gemfile\.lock`/);
  assert.match(contributing, /lockfile is maintained with Bundler 2\.4\.22/);
  assert.match(contributing, /bundle _2\.4\.22_ update/);
});

test("I-47: About and CV present verified identity without duplicate sidebars", () => {
  const about = read("_pages/about.md");
  const cv = read("_pages/cv.md");
  const cvZh = read("_pages/cv_zh.md");
  const cvLayout = read("_layouts/cv-layout.html");

  assert.match(about, /author_profile:\s*false/);
  assert.match(about, /西安交通大学[\s\S]*湖南大学[\s\S]*具身智能[\s\S]*智能体记忆[\s\S]*持续学习/);
  assert.match(about, /https:\/\/kaggle\.com\/husky1102/);
  assert.match(about, /关于本站[\s\S]*Jekyll[\s\S]*AcademicPages[\s\S]*Minimal Mistakes/);
  assert.doesNotMatch(about, /这是一个个人主页|其实也没什么好看的|这个人很懒/);
  assert.match(read("_sass/custom.scss"), /\.page__content \.about-profile__lead \{[\s\S]*?font-size:\s*clamp\(1\.3rem/);
  assert.match(read("_sass/custom.scss"), /\.about-profile p:not\(\.about-profile__lead\),[\s\S]*?font-family:\s*"LXGW WenKai Screen"/);
  assert.match(cv, /author_profile:\s*false/);
  assert.match(cvZh, /author_profile:\s*false/);
  assert.match(cv, /Embodied AI[\s\S]*Agent Memory[\s\S]*Continual Learning/);
  assert.match(cvZh, /具身智能[\s\S]*智能体记忆[\s\S]*持续学习/);
  assert.doesNotMatch(cvLayout, /include sidebar/);
});
