# 开发与维护

安装环境和启动方式见 [README.md](README.md)。当前 CI 使用 Node.js 22、Python 3.12、Ruby 3.3 和 Bundler 2.4.22；依赖由 `package-lock.json`、`Gemfile.lock` 和 `requirements-assets.txt` 记录。

## 验证修改

路由和发布范围测试读取 `_site/`，因此先构建，再运行测试：

```bash
npm run build:js
npm run build:font
bundle exec jekyll clean
bundle exec jekyll build --safe --trace
npm test
```

`npm test` 会重新生成并核对字体子集，然后运行 Node 与 Python 测试。提交包含源文件修改时，也应包含对应的 JavaScript 和字体生成产物。

## 字体与头像

- 中文字体源文件：`scripts/assets/fonts/LXGWWenKaiGBScreen-full.woff2`。使用 `npm run build:font` 生成子集，`npm run check:font` 检查覆盖和确定性。
- 头像源文件：`scripts/assets/images/avatar-gpt063-source.png`。侧栏版本可用 `cwebp` 导出：

  ```bash
  cwebp -q 82 -alpha_q 100 -m 6 -resize 640 640 \
    scripts/assets/images/avatar-gpt063-source.png \
    -o images/avatar-gpt063.webp
  ```

- 首页版本：安装 `Pillow==12.2.0` 后，运行 `python3 scripts/export_hero_portrait.py`。

字体许可证随公开字体保留；`scripts/` 下的源资产不随站点发布。资源大小检查见 `tests/asset-budget.test.js`。

## 博客接入

当前消息协议、失败时的返回入口和部署核对方式见 [博客嵌入说明](docs/blog-embed.md)。
