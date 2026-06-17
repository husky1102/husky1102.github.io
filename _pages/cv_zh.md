---
layout: cv-layout
title: "简历"
permalink: /cv_zh/
author_profile: true
redirect_from:
  - /resume_zh
---

{% include base_path %}

<article class="cv-document cv-document--zh">
  <header class="cv-header">
    <div class="cv-header__text">
      <h1 id="cv-title">克苏鲁微糖 / Husky</h1>
      <p class="cv-header__summary">西安交通大学人工智能硕士在读，关注具身智能、智能体记忆，以及任何足够有趣、值得持续学习的问题。</p>
    </div>
    <nav class="cv-header__links" aria-label="简历链接">
      <a href="{{ base_path }}/cv/">English CV</a>
      <a href="https://www.husky1102.top/">个人博客</a>
      <a href="https://github.com/husky1102">GitHub</a>
    </nav>
  </header>

  <section class="cv-section" aria-labelledby="education">
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

  <section class="cv-section" aria-labelledby="experience">
    <h2 id="experience">工作经历</h2>
    <div class="cv-item cv-item--empty">
      <div class="cv-item__main">
        <h3>暂无工作经历</h3>
      </div>
    </div>
  </section>

  <section class="cv-section" aria-labelledby="interests">
    <h2 id="interests">研究兴趣</h2>
    <ul class="cv-tag-list">
      <li>具身智能</li>
      <li>智能体记忆</li>
      <li>任何有趣的东西</li>
    </ul>
  </section>

  <section class="cv-section" aria-labelledby="publications">
    <h2 id="publications">论文发表</h2>
    {% if site.publications.size > 0 %}
      <div class="cv-publication-list">
        {% for post in site.publications reversed %}
          {% assign title = post.title | markdownify | remove: "<p>" | remove: "</p>" %}
          <article class="cv-publication-item" itemscope itemtype="http://schema.org/CreativeWork">
            <h3 itemprop="headline">
              {% if post.link %}
                <a href="{{ post.link }}">{{ title }}</a>
                <a class="cv-publication-item__permalink" href="{{ base_path }}{{ post.url }}" rel="permalink">Permalink</a>
              {% else %}
                <a href="{{ base_path }}{{ post.url }}" rel="permalink">{{ title }}</a>
              {% endif %}
            </h3>
            {% if post.venue %}
              <p itemprop="description">{{ post.citation }}</p>
            {% endif %}
          </article>
        {% endfor %}
      </div>
    {% else %}
      <p class="cv-empty">当前没有列出的论文条目。</p>
    {% endif %}
  </section>
</article>
