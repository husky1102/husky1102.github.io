---
layout: cv-layout
title: "简历"
description: "Husky 的教育经历、研究兴趣与公开个人资料入口。"
permalink: /cv_zh/
author_profile: false
redirect_from:
  - /resume_zh
---

{% include base_path %}

<article class="cv-document cv-document--zh">
  <header class="cv-header">
    <div class="cv-header__text">
      <h1 id="cv-title">克苏鲁微糖</h1>
      <p class="cv-header__summary">西安交通大学人工智能硕士在读，关注具身智能、智能体记忆与持续学习。</p>
    </div>
    <nav class="cv-header__links" aria-label="简历链接">
      <a href="{{ base_path }}/about/">关于我</a>
      <a href="{{ base_path }}/cv/">English CV</a>
      <a href="https://github.com/husky1102">GitHub</a>
      <a href="https://kaggle.com/husky1102">Kaggle</a>
      <a href="https://www.husky1102.top/">个人博客</a>
    </nav>
  </header>

  <section class="cv-section cv-section--timeline" aria-labelledby="education">
    <h2 id="education">教育背景</h2>
    <div class="cv-item">
      <div class="cv-item__main">
        <h3>硕士，人工智能</h3>
        <p>西安交通大学，中国</p>
      </div>
      <p class="cv-item__meta">在读</p>
    </div>
    <div class="cv-item">
      <div class="cv-item__main">
        <h3>学士，机器人工程</h3>
        <p>湖南大学，中国</p>
      </div>
      <p class="cv-item__meta">2025</p>
    </div>
  </section>

  <section class="cv-section" aria-labelledby="interests">
    <h2 id="interests">研究兴趣</h2>
    <ul class="cv-interest-list">
      <li><h3>具身智能</h3><p>关注智能体如何在环境中感知、行动与推理。</p></li>
      <li><h3>智能体记忆</h3><p>关注智能体如何在长期交互中保留、检索和使用上下文。</p></li>
      <li><h3>持续学习</h3><p>关注智能体如何从新经验中学习，同时保留已有的有效能力。</p></li>
    </ul>
  </section>

  {% if site.publications.size > 0 %}
    <section class="cv-section" aria-labelledby="publications">
      <h2 id="publications">论文发表</h2>
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
            {% include publication-resource-links.html item=post class="cv-publication-item__links" hide_citation=true show_permalink=true aria_label="论文链接" %}
          </article>
        {% endfor %}
      </div>
    </section>
  {% endif %}
</article>
