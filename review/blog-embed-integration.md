# 博客嵌入接入验收（2026-09-08）

个人主页与 `unTitled` 博客的本地接入已完成。此记录取代旧交接提示中“父页尚未实现协议”的状态描述；未推送或部署，公开站点仍需发布后复核。

## 已实现清单

- 在请求 `?embed=1` 前安装监听器，校验 `https://www.husky1102.top`、`blog-frame.contentWindow`、对象结构、版本及主题枚举。
- 保留 HTML 原生 iframe 地址供无脚本访问；脚本启动后才添加嵌入参数。
- 首次与 iframe load 发送 init；仅完整合法 ready 且主题一致时隐藏 `.blog-layout .masthead`，由 flex 让 iframe 占满视口。
- 导航通知、文档重新加载及历史恢复时恢复后备栏并重新握手。失败或未握手时保留返回、独立打开能力。
- 使用原主题函数同步父页背景、状态、存储及浏览器主题色；接收对方主题不回发，嵌入页不播放外层重复主题动画。
- 可选 ready.url 经来源校验并移除 embed 后更新后备独立打开链接。

实现：`assets/js/blog-embed.js`、`assets/js/_main.js`、`_includes/scripts.html`、`_sass/custom.scss`、`_pages/blog_embed.md`。

## 验证

`npm test`：73 项 Node、2 项 Python 通过；`npm run build:js` 与 `bundle exec jekyll build --safe --trace` 通过。消息测试覆盖不同来源/窗口、非法类型与版本、不完整及数组能力对象、主题无回环、重新加载和独立地址校验。

数字花园仓库的 `tests/browser/embed.cjs` 将两个真实 HTTPS 来源映射到各自本地构建产物，16 组浏览器流程通过。覆盖 320/390/768/1440px 深浅色、首页和文章、双向主题、握手重发、返回顶层、独立打开、未接协议父页、不可信父页及无脚本后备。此过程未修改真实 DNS、生产来源校验或线上网站。

复现方式及完整检查记录见 `/Users/lolita/mine/digital-garden/docs/embed-integration.md` 和 `docs/embed-qa-2026-09-08.md`。

## 发布顺序

1. 先发布博客，确保 embed 布局、返回入口和主题协议均已上线。
2. 再发布个人主页，确认 `/assets/js/blog-embed.js` 与新 main.min.js 已刷新缓存。
3. 在公开 `/blog_embed/` 复核首次握手、侧栏从顶部开始、文章切换与刷新后的重新握手、深浅色同步，以及加载失败时的后备栏。握手不成功时检查部署版本，不强制隐藏返回栏。
