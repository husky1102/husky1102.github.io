# 参与贡献

欢迎为 Husky 的个人站点提交问题、内容修正和实现改进。请先在当前仓库搜索已有讨论；需要新反馈时，使用 [GitHub Issues](https://github.com/husky1102/husky1102.github.io/issues)。

## 开始之前

本地环境应尽量与 CI 保持一致：Node.js 22、Python 3.12、Ruby 3.3 和 Bundler 2.4.22。

```bash
npm ci
python3 -m pip install -r requirements-assets.txt
bundle _2.4.22_ install
```

从最新的 `master` 创建独立分支，并让一次提交只解决一个清晰问题。不要把无关格式化、依赖升级或生成资产变化混入同一修改。

## 开发与验证

构建前端和站点：

```bash
npm run build:js
npm run build:font
bundle exec jekyll clean
bundle exec jekyll build --safe --trace
```

运行统一测试入口：

```bash
npm test
```

`npm test` 会重新生成并严格比对网页字体，然后运行 Node 测试及 `tests/test_subset_site_font.py`。提交前还应根据改动范围完成以下检查：

- JavaScript：运行 `npm run build:js`，并确认两个 `assets/js/*.min.js` 产物没有未提交漂移。
- 页面或中文文案：运行 `npm run build:font`、`npm run check:font` 和完整 Jekyll 构建。
- Ruby 依赖：保留 `Gemfile.lock`，使用 Bundler 2.4.22，并在更新后运行完整验证。
- 公开资源：遵守 `tests/asset-budget.test.js` 中的大小、格式和发布边界。

Ruby 依赖锁定契约与现有自动化保持一致：Ruby dependencies are locked in `Gemfile.lock`, and the lockfile is maintained with Bundler 2.4.22. 只有在明确进行依赖维护时才运行 `bundle _2.4.22_ update`，随后必须完成全量验证。

## 生成资产规则

公开的 LXGW 字体子集由 `scripts/assets/fonts/LXGWWenKaiGBScreen-full.woff2` 生成：

```bash
npm run build:font
npm run check:font
```

生成器会检查字符覆盖、512 KiB 预算和字节级确定性。完整字体必须留在 Jekyll 排除的 `scripts/` 目录中，公开 CSS 不得直接引用它。

侧栏头像也遵守“源资产不发布”规则。需要重新导出时使用：

```bash
cwebp -q 82 -alpha_q 100 -m 6 -resize 640 640 \
  scripts/assets/images/avatar-gpt063-source.png \
  -o images/avatar-gpt063.webp
```

导出后确认 WebP 保留透明通道，并通过资源预算测试。

## Pull Request 检查清单

- 说明访客会看到或感受到的变化，以及为什么需要它。
- 列出实际运行的验证命令和结果。
- 提交所有需要发布的生成产物，不提交 `_site/`、缓存或源字体副本。
- 保持移动端、键盘操作、深浅色主题和减少动态偏好可用。
- 不在 Issue、日志或提交中包含密钥、令牌或个人敏感信息。

模板本身的问题可以在其上游项目讨论；本仓库的站点内容、构建流程和定制实现请始终在当前仓库跟踪。
