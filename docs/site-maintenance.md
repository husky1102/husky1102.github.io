# 站点维护说明

本站以 Jekyll 生成静态文件。当前页面的 HTML 布局、内容组件、CSS 与共享交互均位于本仓库，不安装 Jekyll 主题，也不加载远程主题。依赖版本由锁文件确定。

## 内容与路由

| 修改内容 | 文件 | 公开入口 |
| --- | --- | --- |
| 个人主页 | `_pages/home.md` | `/` |
| 关于与研究介绍 | `_pages/about.md` | `/about/` |
| 中英文简历数据 | `_data/resume.yml` | `/cv/`、`/cv_zh/` |
| 博客入口 | `_pages/blog_embed.md` | `/blog_embed/` |
| 隐私说明 | `_pages/terms.md` | `/terms/` |
| 页面目录 | `_pages/sitemap.md` | `/sitemap/` |
| 找不到页面 | `_pages/404.md` | `/404.html` |
| 导航、双语操作提示 | `_data/navigation.yml`、`_data/interface.yml` | 各页面共享 |

`/about.html`、`/resume` 和 `/resume_zh` 保留跳转。旧的 `/categories/`、`/tags/`、`/year-archive/`、`/wordpress/blog-posts/` 都指向博客入口。本站不维护文章归档或订阅源，博客内容由个人博客管理。

简历的教育经历、研究兴趣、双语标签统一在 `resume.yml` 维护。论文可新增到 `_publications/`，使用 `title`、`date`、`venue`、`citation`；可选资源为 `paperurl`、`slidesurl`、`codeurl`、`bibtexurl`。每条论文生成 `/publications/文件名/`，并自动进入两份简历与站点目录。没有论文时不显示论文区块。`tests/publications.test.js` 在临时项目中验证此流程。

## 渲染与交互

- `_layouts/site.html` 负责页面元信息、资源加载、主内容和页脚；`paper.html` 提供论文正文布局。
- 四个 include 分别维护导航、个人资料、简历和论文资源链接。
- `assets/css/site.scss` 汇总五个本站样式文件：基础主题、首页、关于与404、文档与博客、鼠标指针。颜色集中在 `_sass/_foundation.scss`，以 CSS 自定义属性控制明暗切换。
- `_theme.js` 处理系统主题、本地偏好、跨标签页变化和博客同步；`_site.js` 处理手机导航、滚动进度、回到顶部、文本选区指针和代码复制。二者生成 `site.min.js`，不依赖浏览器库。
- `_home-motion.js` 与 GSAP、ScrollTrigger 合并生成 `home-motion.min.js`，只在首页加载。减少动态效果设置会停用角色动效。
- `blog-embed.js` 是独立的博客消息桥，协议与故障回退见 [博客嵌入说明](blog-embed.md)。

无 JavaScript 时主要内容、导航和博客入口仍可访问。手机菜单支持 Escape 返回焦点，关闭时链接退出键盘顺序。资料链接用浏览器原生展开控件。打印简历时隐藏导航和交互入口。

## 独立依赖与许可

| 依赖 | 用途 | 版本或许可位置 |
| --- | --- | --- |
| Jekyll、Liquid、Kramdown、Sass、Rouge 及运行依赖 | 静态构建与内容转换 | `Gemfile.lock`，包内许可证 |
| jekyll-sitemap、jekyll-redirect-from | XML 目录与历史入口 | `Gemfile.lock`，包内许可证 |
| GSAP / ScrollTrigger | 首页动效 | `package-lock.json`、`assets/licenses/GSAP-NOTICE.txt` 和构建产物中的原许可注释 |
| LXGW、Maple Mono 字体 | 中文与标题字体 | `assets/fonts/*-OFL.txt` |
| UglifyJS、onchange、Playwright | 构建、监听与浏览器测试 | `package-lock.json`，包内许可证 |
| fonttools、Brotli | 字体子集生成 | `requirements-assets.txt`，包内许可证 |

本站代码许可见根目录 `LICENSE`，发布副本为 `assets/licenses/site-MIT.txt`。独立第三方资源仍遵循其自身许可。图标采用本站现有 SVG/ICO；manifest 引用 SVG，不另行发布一套栅格应用图标。

## 验证与发布边界

按照 README 顺序生成 JavaScript 和字体，构建 `_site`，运行 `npm test` 与 `npm run test:browser`。测试覆盖页面内容、历史入口、链接、发布边界、资源预算、主题状态、博客协议、论文生成和真实浏览器操作。浏览器测试启动独立进程，默认 Chromium，可选择本机 Edge；结果保存在 `local/browser-check/`，CI 上传为检查附件。

`local/` 用于仅本机保留的计划、日志、截图和实验，不进入 Git 或发布产物；`docs/`、`scripts/`、`tests/`、构建配置及完整源字体也不发布。生成的字体、压缩脚本需要随源码提交。字体使用范围变化后务必重新生成。

托管采用 GitHub Actions 上传 `_site` 到 Pages，部署权限仅授予部署任务。修改可以在本地完整构建，不依赖 GitHub 的预装主题集合。推送和部署由仓库正常发布流程处理。
