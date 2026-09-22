/* Shared behavior for the site's own document and navigation. */
(function () {
  'use strict';
  const root = document.documentElement;
  const nav = document.querySelector('.site-nav');
  const menu = document.querySelector('.menu-toggle');
  const links = document.getElementById('site-links');
  const compact = matchMedia('(max-width: 639px)');
  function closeMenu(returnFocus = false) {
    if (!menu || !links) return;
    nav.dataset.open = 'false';
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', menu.dataset.openLabel);
    links.hidden = compact.matches;
    links.inert = compact.matches;
    if (returnFocus) menu.focus();
  }
  if (menu && links) {
    closeMenu();
    compact.addEventListener('change', () => closeMenu());
    menu.addEventListener('click', () => {
      if (nav.dataset.open === 'true') { closeMenu(); return; }
      nav.dataset.open = 'true';
      menu.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-label', menu.dataset.closeLabel);
      links.hidden = false;
      links.inert = false;
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.dataset.open === 'true') closeMenu(true); });
    document.addEventListener('pointerdown', event => { if (!nav.contains(event.target)) closeMenu(); });
    links.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  }
  const progress = document.querySelector('.scroll-progress span');
  const top = document.querySelector('.back-to-top');
  let scrollPending = false;
  function updateScroll() {
    scrollPending = false;
    const distance = Math.max(0, root.scrollHeight - innerHeight);
    if (progress && root.dataset.scrollProgressEngine !== 'gsap') progress.style.width = (distance ? Math.min(100, scrollY / distance * 100) : 0) + '%';
    if (top) top.hidden = scrollY < 360;
  }
  addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); }
  }, {passive: true});
  addEventListener('resize', updateScroll);
  updateScroll();
  top?.addEventListener('click', () => scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}));

  let selecting = false;
  const cursor = matchMedia('(hover: hover) and (pointer: fine) and (forced-colors: none)');
  function release() { selecting = false; root.classList.remove('is-selecting-text'); }
  document.addEventListener('pointerdown', event => { release(); selecting = cursor.matches && event.pointerType === 'mouse' && event.button === 0; });
  document.addEventListener('selectionchange', () => {
    const selection = getSelection();
    root.classList.toggle('is-selecting-text', Boolean(selecting && selection && !selection.isCollapsed && selection.toString()));
  });
  ['pointerup', 'pointercancel', 'blur', 'pagehide'].forEach(event => addEventListener(event, release));
  document.addEventListener('pointermove', event => { if (selecting && !(event.buttons & 1)) release(); }, {passive: true});
  cursor.addEventListener('change', release);

  document.querySelectorAll('pre > code').forEach(code => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'code-copy'; button.textContent = root.lang === 'en' ? 'Copy' : '复制';
    code.parentElement.append(button);
    button.addEventListener('click', async () => {
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(code.textContent);
        else {
          const input = document.createElement('textarea'); input.value = code.textContent;
          input.style.position = 'fixed'; input.style.opacity = '0'; document.body.append(input); input.select();
          try { if (!document.execCommand('copy')) throw new Error('copy failed'); } finally { input.remove(); button.focus(); }
        }
        button.textContent = root.lang === 'en' ? 'Copied' : '已复制';
      } catch (_) { button.textContent = root.lang === 'en' ? 'Select to copy' : '请选择文字复制'; }
      setTimeout(() => { button.textContent = root.lang === 'en' ? 'Copy' : '复制'; }, 1600);
    });
  });
})();
