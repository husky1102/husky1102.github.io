---
layout: embed
title: "个人博客"
permalink: /blog_embed/
author_profile: false
embed_url: "https://www.husky1102.top/"
---

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

  /* the open-external action is an icon, not a text link: drop the nav's
     animated underline so it reads cleanly next to the theme toggle */
  .greedy-nav .visible-links .masthead__menu-item--action a::before {
    display: none;
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
    <iframe class="blog-embed-iframe" src="{{ page.embed_url }}" title="个人博客" loading="eager"></iframe>
  </div>
</div>

<script>
  document.querySelector(".blog-embed-iframe").addEventListener("load", function () {
    document.querySelector(".blog-embed-shell").classList.add("is-loaded");
  });
</script>
