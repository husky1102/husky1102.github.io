---
layout: embed
title: "个人博客"
permalink: /blog_embed/
author_profile: false
---

<style>
  html,
  body {
    overflow: hidden;
  }

  .blog-embed-shell {
    position: relative;
    width: 100%;
    height: calc(100vh - 70px);
    min-height: 560px;
    background:
      radial-gradient(circle at 50% 38%, color-mix(in srgb, var(--global-link-color) 10%, transparent), transparent 34%),
      var(--global-bg-color);
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
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    margin: 0;
    padding: 0;
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
  <div class="blog-embed-spinner" aria-hidden="true"></div>
  <iframe class="blog-embed-iframe" src="https://www.husky1102.top/" title="个人博客" loading="eager"></iframe>
</div>

<script>
  document.querySelector(".blog-embed-iframe").addEventListener("load", function () {
    document.querySelector(".blog-embed-shell").classList.add("is-loaded");
  });
</script>
