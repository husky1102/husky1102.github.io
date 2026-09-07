/* Version 1 bridge. No cross-origin DOM access, and no wildcard destinations. */
(function () {
  'use strict';
  var started = false;
  window.huskyBlogEmbed = {
    start: function (theme) {
      if (started) return;
      var frame = document.getElementById('blog-frame');
      if (!frame) return;
      started = true;
      var origin = 'https://www.husky1102.top';
      var status = document.querySelector('.blog-reader__status');
      var external = document.querySelector('.blog-reader__external');
      var timer;
      var ready = false;
      function send(type) {
        frame.contentWindow.postMessage({ type: type, version: 1, theme: theme.current() }, origin);
      }
      function fallback(loading) {
        ready = false;
        document.body.classList.remove('blog-embed-ready');
        window.clearTimeout(timer);
        if (status) {
          status.hidden = !loading;
          status.textContent = '正在打开博客…';
        }
        if (loading) timer = window.setTimeout(function () {
          if (status && !ready) {
            status.hidden = false;
            status.textContent = '加载较慢，可使用上方入口在新标签页阅读。';
          }
        }, 12000);
      }
      function articleUrl(value) {
        if (typeof value !== 'string') return null;
        try {
          var url = new URL(value);
          if (url.origin !== origin || url.username || url.password) return null;
          url.searchParams.delete('embed');
          return url.href;
        } catch (_) { return null; }
      }
      // Install this before requesting the embed document: its first ready can be early.
      window.addEventListener('message', function (event) {
        if (event.origin !== origin || event.source !== frame.contentWindow) return;
        var data = event.data;
        if (!data || typeof data !== 'object' || Array.isArray(data) || data.version !== 1) return;
        if (data.type === 'husky:embed:navigating') { fallback(true); return; }
        if (data.theme !== 'light' && data.theme !== 'dark') return;
        if (data.type === 'husky:embed:ready') {
          if (!data.capabilities || data.capabilities.returnHome !== true || data.capabilities.themeControl !== true) return;
          // Initialization always gives the containing page authority on first load.
          if (data.theme !== theme.current()) { send('husky:embed:init'); return; }
          var url = articleUrl(data.url);
          if (url && external) external.href = url;
          window.clearTimeout(timer);
          ready = true;
          if (status) status.hidden = true;
          document.body.classList.add('blog-embed-ready');
        } else if (data.type === 'husky:embed:theme') {
          theme.receive(data.theme); // Existing theme function; deliberately no echo.
        }
      });
      window.addEventListener('husky:theme-change', function () { send('husky:embed:theme'); });
      frame.addEventListener('load', function () {
        fallback(false);
        send('husky:embed:init'); // The first message may have arrived before the child listener.
      });
      frame.addEventListener('error', function () {
        fallback(false);
        if (status) {
          status.hidden = false;
          status.textContent = '博客暂时无法载入，请使用上方入口继续阅读。';
        }
      });
      window.addEventListener('pageshow', function (event) {
        if (event.persisted) { fallback(false); send('husky:embed:init'); }
      });
      fallback(true);
      var source = new URL(frame.getAttribute('src'), location.href);
      if (source.origin !== origin) return;
      source.searchParams.set('embed', '1');
      frame.src = source.href;
      send('husky:embed:init');
    }
  };
})();
