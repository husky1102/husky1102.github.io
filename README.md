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

`npm test` 是统一测试入口：它会先重新生成并核对字体子集，然后运行 Node 测试和 Python 单元测试。

```bash
npm test
bundle exec jekyll clean
bundle exec jekyll build --safe --trace
```

修改 JavaScript 后还应确认提交的压缩产物与源文件一致：

```bash
npm run build:js
git diff --exit-code -- assets/js/main.min.js assets/js/home-motion.min.js
```

## 目录说明

- `_pages/`：主页、简历、关于页等主要内容
- `_layouts/`、`_includes/`、`_sass/`：Jekyll 布局、组件与样式
- `assets/`、`images/`：公开发布的前端资源
- `scripts/`：字体与图片的源资产及生成脚本，不随站点发布
- `tests/`：构建策略、公开路由、资源预算和页面约束测试
- `.github/workflows/`：站点检查与 GitHub Pages 发布流程

## 生成资产

`assets/js/*.min.js` 和 `assets/fonts/LXGWWenKaiGBScreen-subset.woff2` 是需要提交的确定性产物。请从对应源文件重新生成，不要直接编辑压缩文件或字体子集。

完整中文字体和头像源图只保存在 `scripts/assets/` 中，并已从 Jekyll 发布范围排除。

## 部署

推送到 `master` 后，`Site Check` 会执行构建与测试，`Deploy Pages` 会在相同验证通过后发布 `_site`。本地提交不会自动推送或部署。

参与修改前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。本仓库源自 Academic Pages 生态，当前内容、设计与构建流程均面向 Husky 的个人站点维护。
