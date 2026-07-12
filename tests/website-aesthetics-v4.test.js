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

  assert.match(home, /class="home-hero__stage"/);
  assert.match(home, /avatar-gpt063\.webp[\s\S]*?relative_url/);
  assert.equal((home.match(/class="home-research-track"/g) || []).length, 3);
  assert.match(home, /class="home-now"/);
  assert.match(home, /class="home-destination-list"/);
  assert.doesNotMatch(home, /home-card-grid|home-info-card/);
  assert.match(custom, /\.home-hero__lead \{[\s\S]*?font-family:\s*"LXGW WenKai Screen"[\s\S]*?line-height:\s*1\.72/);
  assert.match(custom, /\.home-hero__stage \{[\s\S]*?isolation:\s*isolate/);
  assert.match(custom, /\.home-research-track/);
  assert.match(custom, /\.home-now/);
  assert.match(custom, /\.home-destination-list/);
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

test("I-43: dark theme uses graphite surfaces and a restrained warm ambient trace", () => {
  const dark = read("_sass/theme/_dark.scss");
  const custom = read("_sass/custom.scss");

  assert.match(dark, /\$background\s*:\s*#17191d/);
  assert.match(dark, /--global-footer-bg-color\s*:\s*#22252a/);
  assert.match(dark, /--global-thead-color\s*:\s*#25292f/);
  assert.doesNotMatch(dark, /#0f172a|#111c31/);
  assert.match(custom, /radial-gradient\(circle at 86% 4%, rgba\(246, 173, 99, 0\.04\)/);
  assert.match(custom, /linear-gradient\(315deg, rgba\(246, 173, 99, 0\.045\)/);
  assert.doesNotMatch(custom, /rgba\(196, 181, 253/);
  assert.match(custom, /#67e8f9/);
  assert.match(custom, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation:\s*none/);
});

test("Minor: forms get a visible focus ring + theme-aware background; selection is branded", () => {
  const forms = read("_sass/layout/_forms.scss");
  assert.match(forms, /:focus-visible[\s\S]*?outline:\s*2px solid var\(--global-link-color\)/);
  assert.match(forms, /background-color:\s*var\(--global-bg-color\)/);
  const custom = read("_sass/custom.scss");
  assert.match(custom, /::selection \{[\s\S]*?color-mix/);
});

test("I-36: avatar hover uses overflow visible, rotating gradient ring, and unified shadow", () => {
  const sidebar = read("_sass/layout/_sidebar.scss");

  // container unclips to let image expand
  assert.match(sidebar, /overflow:\s*visible/);
  // character sits lower in the ring so it covers the cropped legs
  assert.match(sidebar, /--avatar-art-y:\s*10px/);
  assert.match(sidebar, /animation:\s*avatar-spin/);
  assert.match(sidebar, /filter:\s*drop-shadow/);
  // the lower image mask snaps into place while only the pop-out scale animates,
  // so the ring does not visually chase the enlarged avatar.
  assert.match(sidebar, /transform 0\.4s cubic-bezier\(0\.34,\s*1\.56,\s*0\.64,\s*1\);\s*\/\/ gentle leap overshoot; mask snaps into place/);
  assert.doesNotMatch(sidebar, /clip-path\s+0\.08s ease-out/);
  assert.match(sidebar, /will-change:\s*transform,\s*clip-path/);
});

test("I-37: avatar hover respects reduced motion and matches sidebar backdrop", () => {
  const sidebar = read("_sass/layout/_sidebar.scss");

  assert.match(
    sidebar,
    /&::after\s*\{[\s\S]*?background-image:[\s\S]*?linear-gradient\([\s\S]*?color-mix\(in srgb,\s*var\(--global-footer-bg-color\) 55%,\s*var\(--global-bg-color\)\)/
  );
  assert.match(
    sidebar,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?&::before,\s*&::after\s*\{[\s\S]*?animation:\s*none/
  );
  assert.match(
    sidebar,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?&:hover\s*\{[\s\S]*?transform:\s*none[\s\S]*?filter:\s*drop-shadow/
  );
  assert.match(
    sidebar,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?&:hover img\s*\{[\s\S]*?transform:\s*translateY\(var\(--avatar-art-y\)\)[\s\S]*?filter:\s*none/
  );
});

test("I-38: local sidebar avatar uses a deploy-safe relative image URL", () => {
  const include = read("_includes/author-profile.html");

  assert.match(include, /author\.avatar \| prepend:\s*"\/images\/" \| relative_url/);
  assert.doesNotMatch(include, /author\.avatar \| prepend:\s*"\/images\/" \| prepend:\s*base_path/);
  assert.doesNotMatch(include, /<img[^>]+class="author__avatar"/);
});

test("I-39: GSAP motion is bundled locally and respects reduced motion", () => {
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
  assert.match(mainJs, /\.home-hero__eyebrow, \.home-hero h1, \.home-hero__lead, \.home-hero__actions/);
  assert.match(mainJs, /scrollTriggerApi\.batch\("\.home-info-card, \.archive__item--card"/);
  assert.match(mainJs, /id:\s*"site-scroll-progress"/);
  assert.match(mainJs, /scaleX:\s*1/);
  assert.match(mainJs, /if \(!useGsapScrollProgress\)[\s\S]*updateScrollProgressFallback\(scrollTop, scrollHeight\)/);
  assert.equal((mainJs.match(/scrollProgress\.style\.width =/g) || []).length, 1);
});

test("I-41: dark ambient layer is dark-scoped, surface-scoped, and reduced-motion safe", () => {
  const custom = read("_sass/custom.scss");

  assert.match(custom, /html\[data-theme="dark"\]\s*\{[\s\S]*?--dark-ambient-x:\s*50%/);
  assert.match(
    custom,
    /html\[data-theme="dark"\] body \{[\s\S]*?radial-gradient\(circle at var\(--dark-ambient-x\) var\(--dark-ambient-y\)/
  );
  assert.match(custom, /html\[data-theme="dark"\] \.home-info-card::before/);
  assert.match(custom, /html\[data-theme="dark"\] \.archive__item--card::before/);
  assert.match(custom, /html\[data-theme="dark"\] \.about-entry-card::before/);
  assert.match(custom, /@keyframes darkAmbientCardBreath/);
  assert.match(
    custom,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?html\[data-theme="dark"\] \.home-info-card::before[\s\S]*?animation:\s*none/
  );
});

test("I-41: GSAP ambient pointer glow is gated to dark-capable fine-pointer motion", () => {
  const mainJs = read("assets/js/_main.js");

  assert.match(mainJs, /var initDarkAmbientMotion = function \(\)/);
  assert.match(mainJs, /ambientMedia\.add\("\(prefers-reduced-motion: no-preference\) and \(pointer: fine\)"/);
  assert.match(mainJs, /gsapApi\.quickSetter\(root, "--dark-ambient-x"\)/);
  assert.match(mainJs, /gsapApi\.quickSetter\(root, "--dark-ambient-y"\)/);
  assert.match(mainJs, /gsapApi\.quickTo\(root, "--dark-ambient-spotlight-alpha"/);
  assert.match(mainJs, /root\.classList\.toggle\("has-dark-ambient-motion", shouldRun\)/);
  assert.match(mainJs, /window\.addEventListener\("pointermove", handlePointerMove, \{ passive: true \}\)/);
  assert.match(mainJs, /window\.removeEventListener\("pointermove", handlePointerMove\)/);
  assert.match(mainJs, /MutationObserver\(syncAmbientTheme\)/);
  assert.doesNotMatch(mainJs, /mousemove/);
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
