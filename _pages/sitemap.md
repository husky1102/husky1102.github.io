---
layout: site
title: "Sitemap"
permalink: /sitemap/
profile: true
---

查看本站页面，也可访问 [XML 站点地图]({{ '/sitemap.xml' | relative_url }})。

<ul class="page-list">
{% assign listed_pages = site.pages | sort: 'url' %}
{% for item in listed_pages %}
  {% if item.title and item.sitemap != false and item.url != page.url %}
    {% unless item.redirect_to or item.redirect.to %}<li class="sitemap-entry"><a href="{{ item.url | relative_url }}">{{ item.title | escape }}</a></li>{% endunless %}
  {% endif %}
{% endfor %}
{% for paper in site.publications %}<li class="sitemap-entry"><a href="{{ paper.url | relative_url }}">{{ paper.title | escape }}</a></li>{% endfor %}
</ul>
