---
layout: cv-layout
title: "CV"
description: "Husky's education, research interests, and public profile links."
permalink: /cv/
author_profile: false
redirect_from:
  - /resume
---

{% include base_path %}

<article class="cv-document">
  <header class="cv-header">
    <div class="cv-header__text">
      <h1 id="cv-title">Husky</h1>
      <p class="cv-header__summary">M.S. student in Artificial Intelligence at Xi'an Jiaotong University, focusing on Embodied AI, Agent Memory, and Continual Learning.</p>
    </div>
    <nav class="cv-header__links" aria-label="CV links">
      <a href="{{ base_path }}/about/">About</a>
      <a href="{{ base_path }}/cv_zh/">中文简历</a>
      <a href="https://github.com/husky1102">GitHub</a>
      <a href="https://kaggle.com/husky1102">Kaggle</a>
      <a href="https://www.husky1102.top/">Blog</a>
    </nav>
  </header>

  <section class="cv-section cv-section--timeline" aria-labelledby="education">
    <h2 id="education">Education</h2>
    <div class="cv-item">
      <div class="cv-item__main">
        <h3>M.S. in Artificial Intelligence</h3>
        <p>Xi'an Jiaotong University, China</p>
      </div>
      <p class="cv-item__meta">In progress</p>
    </div>
    <div class="cv-item">
      <div class="cv-item__main">
        <h3>B.S. in Robotics Engineering</h3>
        <p>Hunan University, China</p>
      </div>
      <p class="cv-item__meta">2025</p>
    </div>
  </section>

  <section class="cv-section" aria-labelledby="interests">
    <h2 id="interests">Research Interests</h2>
    <ul class="cv-interest-list">
      <li><h3>Embodied AI</h3><p>How agents perceive, act, and reason in environments.</p></li>
      <li><h3>Agent Memory</h3><p>How agents retain, retrieve, and use context across interactions.</p></li>
      <li><h3>Continual Learning</h3><p>How agents learn from new experience while preserving useful capabilities.</p></li>
    </ul>
  </section>

  {% if site.publications.size > 0 %}
    <section class="cv-section" aria-labelledby="publications">
      <h2 id="publications">Publications</h2>
      <div class="cv-publication-list">
        {% for post in site.publications reversed %}
          {% assign title = post.title | markdownify | remove: "<p>" | remove: "</p>" %}
          <article class="cv-publication-item" itemscope itemtype="http://schema.org/CreativeWork">
            <h3 itemprop="headline">
              {% if post.link %}
                <a class="cv-publication-item__title" href="{{ post.link }}">{{ title }}</a>
              {% else %}
                <a class="cv-publication-item__title" href="{{ base_path }}{{ post.url }}" rel="permalink">{{ title }}</a>
              {% endif %}
            </h3>
            {% if post.venue %}
              <p itemprop="description">{{ post.citation }}</p>
            {% endif %}
            {% include publication-resource-links.html item=post class="cv-publication-item__links" hide_citation=true show_permalink=true aria_label="Publication links" %}
          </article>
        {% endfor %}
      </div>
    </section>
  {% endif %}
</article>
