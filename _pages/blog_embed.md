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

  /* On this page the site masthead acts as the FRAME for the embedded blog:
     make it solid (drop the translucent floating look that has nothing to blur
     here) and let it cast a soft shadow onto the content below. Scoped to this
     page only — this <style> is rendered only on /blog_embed/. */
  .masthead {
    background: var(--global-bg-color);
    -webkit-backdrop-filter: none;
            backdrop-filter: none;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  }

  .blog-embed-shell {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 70px);
    min-height: 560px;
    background:
      radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--global-link-color) 9%, transparent), transparent 42%),
      var(--global-bg-color);
    overflow: hidden;
  }

  /* Slim toolbar that bridges the nav and the blog: a label + an escape hatch
     so the embed reads as intentional rather than a second header glued on. */
  .blog-embed-toolbar {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.55rem clamp(0.9rem, 3vw, 1.6rem);
    font-size: 0.85rem;
  }

  .blog-embed-toolbar__label {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--global-text-color);
    font-weight: 700;
  }

  .blog-embed-toolbar__label i {
    color: var(--global-link-color);
  }

  .blog-embed-toolbar__open {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--global-link-color);
    font-weight: 700;
    text-decoration: none;
  }

  .blog-embed-toolbar__open:hover,
  .blog-embed-toolbar__open:focus-visible {
    text-decoration: underline;
  }

  /* The blog sits in a rounded, bordered panel tucked under the nav/toolbar. */
  .blog-embed-frame {
    position: relative;
    flex: 1 1 auto;
    margin: 0 clamp(0.6rem, 2vw, 1.1rem) clamp(0.6rem, 2vw, 1.1rem);
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
  <div class="blog-embed-toolbar">
    <span class="blog-embed-toolbar__label"><i class="fas fa-blog" aria-hidden="true"></i> 个人博客</span>
    <a class="blog-embed-toolbar__open" href="https://www.husky1102.top/" target="_blank" rel="noopener noreferrer">在新标签打开 <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></a>
  </div>
  <div class="blog-embed-frame">
    <div class="blog-embed-spinner" aria-hidden="true"></div>
    <iframe class="blog-embed-iframe" src="https://www.husky1102.top/" title="个人博客" loading="eager"></iframe>
  </div>
</div>

<script>
  document.querySelector(".blog-embed-iframe").addEventListener("load", function () {
    document.querySelector(".blog-embed-shell").classList.add("is-loaded");
  });
</script>
