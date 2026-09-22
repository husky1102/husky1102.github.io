/* Theme preference belongs to the containing site; incoming blog changes never echo. */
(function () {
  'use strict';
  const root = document.documentElement;
  const control = document.getElementById('theme-toggle');
  const system = matchMedia('(prefers-color-scheme: dark)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const isBlog = document.body.classList.contains('blog-layout');
  let preference = null;
  let timer;
  try { preference = localStorage.getItem('theme'); } catch (_) {}
  if (!['light', 'dark'].includes(preference)) preference = null;
  const current = () => root.dataset.theme === 'dark' ? 'dark' : 'light';
  function apply(theme, {remember = false, animate = false, announce = false} = {}) {
    if (!['light', 'dark'].includes(theme)) return;
    const interrupted = root.classList.contains('is-theme-transitioning');
    clearTimeout(timer);
    root.classList.remove('is-theme-transitioning');
    if (remember) {
      preference = theme;
      try { localStorage.setItem('theme', theme); } catch (_) {}
    }
    const duration = theme === 'dark' ? 650 : 800;
    const motion = animate && !reduced.matches && !isBlog && window.CSS && typeof CSS.registerProperty === 'function';
    root.classList.toggle('is-theme-syncing', !motion);
    if (motion) {
      root.style.setProperty('--theme-duration', duration + 'ms');
      root.style.setProperty('--theme-ink-delay', interrupted ? '0ms' : (theme === 'dark' ? '180ms' : '240ms'));
      root.classList.add('is-theme-transitioning');
    }
    root.dataset.theme = theme;
    if (control) {
      control.setAttribute('aria-pressed', String(theme === 'dark'));
      const label = control.dataset[theme === 'dark' ? 'lightLabel' : 'darkLabel'];
      control.setAttribute('aria-label', label);
      control.title = label;
    }
    const color = document.querySelector('meta[name="theme-color"]');
    if (color) color.content = isBlog ? (theme === 'dark' ? '#181a1d' : '#fafaf3') : (theme === 'dark' ? '#17191d' : '#fbfaf7');
    if (!motion) { void root.offsetWidth; root.classList.remove('is-theme-syncing'); }
    else timer = setTimeout(() => root.classList.remove('is-theme-transitioning'), duration);
    if (announce) window.dispatchEvent(new CustomEvent('husky:theme-change', {detail: {theme}}));
  }
  apply(preference || (system.matches ? 'dark' : 'light'));
  control?.addEventListener('click', () => apply(current() === 'dark' ? 'light' : 'dark', {remember: true, animate: true, announce: true}));
  system.addEventListener('change', () => { if (!preference) apply(system.matches ? 'dark' : 'light', {announce: true}); });
  reduced.addEventListener('change', () => { if (reduced.matches) apply(current()); });
  window.addEventListener('storage', event => {
    if (event.key !== 'theme') return;
    preference = ['light', 'dark'].includes(event.newValue) ? event.newValue : null;
    apply(preference || (system.matches ? 'dark' : 'light'), {announce: true});
  });
  window.huskyBlogEmbed?.start({current, receive: theme => apply(theme, {remember: true})});
})();
