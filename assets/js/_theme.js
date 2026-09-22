/* Theme preference belongs to the containing site; incoming blog changes never echo. */
(function () {
  'use strict';
  const root = document.documentElement;
  const control = document.getElementById('theme-toggle');
  const system = matchMedia('(prefers-color-scheme: dark)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const isBlog = document.body.classList.contains('blog-layout');
  let preference = null;
  let transition = null;
  let revision = 0;
  let selectedTheme = root.dataset.theme === 'dark' ? 'dark' : 'light';
  try { preference = localStorage.getItem('theme'); } catch (_) {}
  if (!['light', 'dark'].includes(preference)) preference = null;
  // Track the latest intent even while the browser is capturing the previous view.
  const current = () => selectedTheme;
  function apply(theme, {remember = false, animate = false, announce = false} = {}) {
    if (!['light', 'dark'].includes(theme)) return;
    const previous = selectedTheme;
    const request = ++revision;
    selectedTheme = theme;
    if (transition) { transition.skipTransition(); transition = null; }
    root.classList.remove('is-theme-transitioning');
    if (remember) {
      preference = theme;
      try { localStorage.setItem('theme', theme); } catch (_) {}
    }
    function commit() {
      if (request !== revision) return;
      // Switch complete palettes atomically; never interpolate text through grey.
      root.classList.add('is-theme-syncing');
      root.dataset.theme = theme;
      if (control) {
        control.setAttribute('aria-pressed', String(theme === 'dark'));
        const label = control.dataset[theme === 'dark' ? 'lightLabel' : 'darkLabel'];
        control.setAttribute('aria-label', label);
        control.title = label;
      }
      const color = document.querySelector('meta[name="theme-color"]');
      if (color) color.content = isBlog ? (theme === 'dark' ? '#181a1d' : '#fafaf3') : (theme === 'dark' ? '#17191d' : '#fbfaf7');
      void root.offsetWidth;
      root.classList.remove('is-theme-syncing');
      if (announce) window.dispatchEvent(new CustomEvent('husky:theme-change', {detail: {theme}}));
    }
    function finish() {
      if (request !== revision) return;
      transition = null;
      root.classList.remove('is-theme-transitioning');
    }
    const motion = animate && previous !== theme && !reduced.matches && !isBlog && typeof document.startViewTransition === 'function';
    if (!motion) { commit(); return; }
    const bounds = control?.getBoundingClientRect();
    const x = bounds ? bounds.left + bounds.width / 2 : innerWidth / 2;
    const y = bounds ? bounds.top + bounds.height / 2 : 0;
    root.style.setProperty('--theme-x', x + 'px');
    root.style.setProperty('--theme-y', y + 'px');
    root.style.setProperty('--theme-radius', Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 'px');
    root.classList.add('is-theme-transitioning');
    try {
      const active = document.startViewTransition(commit);
      transition = active;
      active.ready.catch(() => {}); // Skipping the animation still runs its update callback.
      active.finished.then(finish, () => { commit(); finish(); });
    } catch (_) { commit(); finish(); }
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
