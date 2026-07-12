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

test("I-42: homepage keeps unTitled while reserving identity for the main stage", () => {
  const config = read("_config.yml");
  const home = read("_pages/home.md");
  const archive = read("_layouts/archive.html");

  assert.match(config, /title\s*:\s*"unTitled"/);
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
  assert.match(home, /home-hero__stage" role="img" tabindex="0" aria-label=/);
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
  assert.match(custom, /\.home-hero__portrait-window \{[\s\S]*?clip-path:\s*circle\(42% at 50% 50%\)/);
  assert.match(custom, /\.home-hero__portrait-ring \{[\s\S]*?z-index:\s*2[\s\S]*?border:\s*2px solid/);
  assert.match(custom, /\.home-hero__portrait-front \{[\s\S]*?z-index:\s*3[\s\S]*?clip-path:\s*polygon\([\s\S]*?50% 92%/);
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

test("I-45: homepage portrait pops through its ring without desynchronizing layers", () => {
  const custom = read("_sass/custom.scss");
  const mainJs = read("assets/js/_main.js");

  assert.match(custom, /\.home-hero__stage:hover \.home-hero__character[\s\S]*?translate3d\(0, -6\.5%, 0\) scale\(1\.12\)/);
  assert.match(custom, /\.home-hero__stage\.is-popped \.home-hero__character/);
  assert.match(custom, /\.home-hero__stage:hover \.home-hero__portrait-ring[\s\S]*?transform:\s*scale\(0\.95\)/);
  assert.match(custom, /\.home-hero__stage\.is-popped \.home-hero__stage-note[\s\S]*?opacity:\s*0/);
  assert.match(custom, /\.home-hero__stage:focus-visible \.home-hero__portrait-ring/);
  assert.match(custom, /@media \(hover: none\), \(pointer: coarse\)[\s\S]*?\.home-hero__stage:hover:not\(\.is-popped\) \.home-hero__character[\s\S]*?transform:\s*none/);
  assert.match(mainJs, /var portrait = homeHero\.querySelector\("\.home-hero__portrait"\)/);
  assert.match(mainJs, /event\.pointerType === "mouse" \|\| event\.pointerType === "pen"/);
  assert.match(mainJs, /stage\.matches\(":focus-visible"\)[\s\S]*?stage\.classList\.add\("is-popped"\)/);
  assert.match(mainJs, /stage\.classList\.add\("is-popped"\)/);
  assert.match(mainJs, /stage\.addEventListener\("pointerenter", handlePortraitPointerEnter\)/);
  assert.match(mainJs, /stage\.removeEventListener\("pointerenter", handlePortraitPointerEnter\)/);
  assert.doesNotMatch(mainJs, /querySelector\("\.home-hero__character"\)/);
  assert.doesNotMatch(mainJs, /outerOrbit|innerOrbit|orbitElements/);
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

  assert.match(custom, /\.home-hero__actions \.btn \{[\s\S]*?min-height:\s*2\.75rem/);
  assert.match(navigation, /\.greedy-nav \{[\s\S]*?button \{[\s\S]*?height:\s*2\.75rem/);
  assert.match(navigation, /\.masthead__menu-item--action[\s\S]*?width:\s*2\.75rem[\s\S]*?height:\s*2\.75rem/);
  assert.match(navigation, /#theme-toggle[\s\S]*?width:\s*2\.75rem[\s\S]*?height:\s*2\.75rem/);
  assert.match(sidebar, /\.author__urls-wrapper[\s\S]*?button \{[\s\S]*?min-height:\s*2\.75rem/);
});

test("I-43: bilingual CVs omit unsupported experience and wrap the full publications section", () => {
  const cv = read("_pages/cv.md");
  const cvZh = read("_pages/cv_zh.md");

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

  assert.match(pkg.dependencies.gsap, /^\^3\./);
  assert.match(
    pkg.scripts.uglify,
    /node_modules\/gsap\/dist\/gsap\.min\.js\s+node_modules\/gsap\/dist\/ScrollTrigger\.min\.js[\s\S]*assets\/js\/_main\.js/
  );
  assert.match(mainJs, /gsapApi\.registerPlugin\(scrollTriggerApi\)/);
  assert.match(mainJs, /gsapApi\.matchMedia\(\)/);
  assert.match(mainJs, /\(prefers-reduced-motion: no-preference\)/);
  assert.match(mainJs, /var initHomepageMotion = function \(\)/);
  assert.match(mainJs, /gsapApi\.timeline\(\{[\s\S]*?defaults:/);
  assert.match(mainJs, /\.home-hero__stage/);
  assert.match(mainJs, /\.home-hero__portrait/);
  assert.match(mainJs, /\.home-hero__portrait-ring/);
  assert.match(mainJs, /\.home-hero__lead-en/);
  assert.match(mainJs, /opacity:\s*0\.72/);
  assert.match(mainJs, /opacity:\s*0\.78/);
  assert.match(mainJs, /opacity:\s*0\.82/);
  assert.doesNotMatch(mainJs, /autoAlpha:\s*0/);
  assert.match(mainJs, /repeat:\s*-1/);
  assert.match(mainJs, /IntersectionObserver/);
  assert.match(mainJs, /document\.hidden/);
  assert.match(mainJs, /visibilitychange/);
  assert.match(mainJs, /stageObserver\.disconnect\(\)/);
  assert.doesNotMatch(mainJs, /scrollTriggerApi\.batch|\.archive__item--card|\.home-info-card/);
  assert.match(mainJs, /id:\s*"site-scroll-progress"/);
  assert.match(mainJs, /scaleX:\s*1/);
  assert.equal((mainJs.match(/scrollTrigger:/g) || []).length, 1);
  assert.match(mainJs, /if \(!useGsapScrollProgress\)[\s\S]*updateScrollProgressFallback\(scrollTop, scrollHeight\)/);
  assert.equal((mainJs.match(/scrollProgress\.style\.width =/g) || []).length, 1);
});

test("I-41: dark ambient rendering is static and has no continuous card loops", () => {
  const custom = read("_sass/custom.scss");

  assert.match(
    custom,
    /html\[data-theme="dark"\] body \{[\s\S]*?radial-gradient\(circle at 50% 8%, rgba\(103, 232, 249, 0\.055\)/
  );
  assert.doesNotMatch(custom, /--dark-ambient-|background-attachment/);
  assert.doesNotMatch(custom, /darkAmbientCardBreath|\.archive__item--card::before|\.about-entry-card::before/);
  assert.doesNotMatch(custom, /animation:[^;]*infinite/);
});

test("I-41: JavaScript performs no ambient pointer-driven rendering", () => {
  const mainJs = read("assets/js/_main.js");

  assert.doesNotMatch(mainJs, /initDarkAmbientMotion|ambientMedia|--dark-ambient-/);
  assert.doesNotMatch(mainJs, /quickSetter|quickTo/);
  assert.doesNotMatch(mainJs, /pointermove|mousemove/);
});

test("I-40: blog iframe and footer links use the hardened public-site defaults", () => {
  const blogEmbed = read("_pages/blog_embed.md");
  const footer = read("_includes/footer.html");
  const contributing = read("CONTRIBUTING.md");

  assert.match(blogEmbed, /class="blog-embed-iframe"[^>]*referrerpolicy="no-referrer"/);
  assert.match(blogEmbed, /class="blog-embed-iframe"[^>]*sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"/);
  assert.match(blogEmbed, /var markLoaded = function \(\)/);
  assert.doesNotMatch(blogEmbed, /iframe\.srcdoc/);
  assert.doesNotMatch(blogEmbed, /fetch\(sourceUrl/);
  assert.doesNotMatch(blogEmbed, /allow-same-origin/);
  assert.match(blogEmbed, /new MutationObserver\(syncBlogTheme\)/);
  assert.match(blogEmbed, /data-theme-bridge="fallback"/);
  assert.match(footer, /href="https:\/\/github\.com\/\{\{ site\.author\.github \}\}"/);
  assert.match(footer, /href="https:\/\/bitbucket\.org\/\{\{ site\.author\.bitbucket \}\}"/);
  assert.match(footer, /href="https:\/\/jekyllrb\.com"/);
  assert.doesNotMatch(footer, /href="http:\/\/(github\.com|bitbucket\.org|jekyllrb\.com)/);
  assert.match(contributing, /Ruby dependencies are locked in `Gemfile\.lock`/);
  assert.match(contributing, /lockfile is maintained with Bundler 2\.4\.22/);
  assert.match(contributing, /bundle _2\.4\.22_ update/);
});
