---
layout: embed
title: "个人博客"
permalink: /blog_embed/
author_profile: false
embed_url: "https://www.husky1102.top/"
---

{% assign blog_embed_url = site.blog_embed_url | default: page.embed_url %}

<style>
  html,
  body {
    overflow: hidden;
  }

  /* This page is a full-screen blog viewer framed by the (single) site nav.
     Scoped to this page only: make the masthead solid + full-width so it aligns
     with the blog panel below and casts a soft shadow onto it. The "open in new
     tab" action lives in the nav itself (see masthead.html + embed_url), so there
     is one bar, not two. */
  .masthead {
    background: var(--global-bg-color);
    -webkit-backdrop-filter: none;
            backdrop-filter: none;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  }

  .masthead__inner-wrap {
    max-width: none;
  }

  .blog-embed-shell {
    position: relative;
    display: flex;
    width: 100%;
    height: calc(100vh - 70px);
    min-height: 560px;
    background:
      radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--global-link-color) 9%, transparent), transparent 45%),
      var(--global-bg-color);
    overflow: hidden;
  }

  /* The blog sits in a rounded, bordered panel floating just under the nav,
     with a uniform margin whose left/right matches the masthead's 1em padding. */
  .blog-embed-frame {
    position: relative;
    flex: 1 1 auto;
    margin: 1em;
    border: 1px solid var(--global-border-color);
    border-radius: 14px;
    background: var(--global-bg-color);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .blog-embed-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2.5rem;
    height: 2.5rem;
    margin: -1.25rem 0 0 -1.25rem;
    border: 2px solid color-mix(in srgb, var(--global-link-color) 20%, var(--global-border-color));
    border-top-color: var(--global-link-color);
    border-radius: 50%;
    animation: blog-embed-spin 0.8s linear infinite;
    transition: opacity 0.35s ease;
  }

  .blog-embed-iframe {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    opacity: 0;
    transition: opacity 0.45s ease;
  }

  .blog-embed-shell.is-loaded .blog-embed-spinner {
    opacity: 0;
    pointer-events: none;
  }

  .blog-embed-shell.is-loaded .blog-embed-iframe {
    opacity: 1;
  }

  @keyframes blog-embed-spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>

<div class="blog-embed-shell">
  <div class="blog-embed-frame">
    <div class="blog-embed-spinner" aria-hidden="true"></div>
    <iframe class="blog-embed-iframe" title="个人博客" loading="eager" referrerpolicy="no-referrer" sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads" data-theme-bridge="pending"></iframe>
  </div>
</div>

<script>
  (function () {
    var shell = document.querySelector(".blog-embed-shell");
    var iframe = document.querySelector(".blog-embed-iframe");
    var themeToggleButton = document.querySelector("#theme-toggle button");
    var sourceUrl = {{ blog_embed_url | jsonify }};
    var themeBridgeTypes = {
      set: "husky-theme-sync:set",
      request: "husky-theme-sync:request",
      applied: "husky-theme-sync:applied"
    };
    var observer = null;

    var markLoaded = function () {
      shell.classList.add("is-loaded");
    };

    var getTheme = function () {
      return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    };

    var normalizeTheme = function (theme) {
      return theme === "dark" || theme === "light" ? theme : null;
    };

    var buildEmbedUrl = function () {
      var url = new URL(sourceUrl, window.location.href);
      url.searchParams.set("embedded", "1");
      url.searchParams.set("theme", getTheme());
      return url.href;
    };

    var syncBlogTheme = function () {
      if (!iframe.contentWindow) {
        return;
      }

      // This sandbox gives the child an opaque origin, so
      // targetOrigin must be "*". The payload is only a validated theme enum,
      // and the child independently verifies this page's origin and window.
      iframe.contentWindow.postMessage({
        type: themeBridgeTypes.set,
        theme: getTheme()
      }, "*");
    };

    var handleBlogThemeMessage = function (event) {
      if (event.source !== iframe.contentWindow) {
        return;
      }

      var message = event.data;
      if (!message || typeof message !== "object") {
        return;
      }

      var theme = normalizeTheme(message.theme);
      if (!theme) {
        return;
      }

      if (message.type === themeBridgeTypes.applied) {
        if (theme === getTheme()) {
          iframe.dataset.themeBridge = "connected";
        }
        return;
      }

      if (
        message.type === themeBridgeTypes.request
        && theme !== getTheme()
        && themeToggleButton
      ) {
        themeToggleButton.click();
      }
    };

    iframe.addEventListener("load", function () {
      markLoaded();
      syncBlogTheme();
    });
    window.addEventListener("message", handleBlogThemeMessage);

    observer = new MutationObserver(syncBlogTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    iframe.src = buildEmbedUrl();
  }());
</script>
