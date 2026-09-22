# Husky1102

这是 Husky 的个人研究主页与数字名片，集中展示研究兴趣、教育经历、简历入口和持续更新的个人博客。

- 个人主页：[husky1102.github.io](https://husky1102.github.io/)
- 个人博客：[husky1102.top](https://www.husky1102.top/)
- 问题与建议：[GitHub Issues](https://github.com/husky1102/husky1102.github.io/issues)

## 技术栈

站点使用 Jekyll 生成静态页面，由 GitHub Actions 构建并发布到 GitHub Pages。前端资源由 Node.js 构建，中文网页字体通过 Python 脚本从仓库内的源字体生成子集。

主要环境版本：

- Node.js 22 或更高版本
- Python 3.12（与 CI 一致）
- Ruby 3.3（与 CI 和 Docker 镜像一致）
- Bundler 2.4.22

## 本地运行

```bash
npm ci
python3 -m pip install -r requirements-assets.txt
bundle _2.4.22_ install

npm run build:js
npm run build:font
bundle exec jekyll serve
```

默认可通过 `http://localhost:4000` 预览站点。

## 验证

路由与发布范围测试读取生成后的 `_site/`。先构建，再运行 `npm test`；测试入口会重新生成并核对字体子集，然后运行 Node 测试和 Python 单元测试。

```bash
npm run build:js
npm run build:font
bundle exec jekyll clean
bundle exec jekyll build --safe --trace
npm test
```

修改 JavaScript 后还应确认提交的压缩产物与源文件一致：

```bash
npm run build:js
git diff --exit-code -- assets/js/site.min.js assets/js/home-motion.min.js
```

浏览器回归检查：

```bash
npx playwright install chromium
npm run test:browser
```

本机已有 Edge 时可使用 `BROWSER_CHANNEL=msedge npm run test:browser`。测试会启动独立的无头浏览器，结果和截图写入被忽略的 `local/browser-check/`。浏览器检查也在 `Site Check` 中运行，博客通信使用受控测试页面，不依赖线上博客响应。

容器预览可运行 `docker compose up --build`，完整安装并生成资产后监听 4000 端口；容器使用 Debian 自带 Python。JavaScript 修改后重新运行构建，内容修改后重新生成字体。当前环境未启动 Docker 服务，容器运行需在具备 Docker 的环境验证。

## 目录说明

- `_pages/`：主页、简历、关于页等主要内容
- `_layouts/`、`_includes/`、`_sass/`：Jekyll 布局、组件与样式
- `assets/`、`images/`：公开发布的前端资源
- `scripts/`：字体与图片的源资产及生成脚本，不随站点发布
- `tests/`：构建、公开路由、资源大小、可访问性与交互检查
- `docs/`：博客嵌入等功能的维护说明
- `.github/workflows/`：站点检查与 GitHub Pages 发布流程

## 生成资产

`assets/js/*.min.js` 和 `assets/fonts/LXGWWenKaiGBScreen-subset.woff2` 是需要提交的确定性产物。请从对应源文件重新生成，不要直接编辑压缩文件或字体子集。

完整中文字体和头像源图只保存在 `scripts/assets/` 中，并已从 Jekyll 发布范围排除。

## 部署

PR 由 `Site Check` 执行完整构建与测试；推送到 `master` 后，`Deploy Pages` 调用同一套检查，包括浏览器回归，全部通过后才上传并发布该次验证的 `_site`，不重复构建。本地提交不会自动推送或部署。

参与修改前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。布局、组件、样式与共享交互由本站维护，直接依赖 Jekyll 和独立第三方库。架构、内容编辑入口和依赖边界见 [站点维护说明](docs/site-maintenance.md)。
