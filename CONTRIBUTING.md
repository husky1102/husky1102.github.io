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

- 旧版头像高清备份：安装 `Pillow==12.2.0` 后，运行 `python3 scripts/export_hero_portrait.py`。
- 角色插画：`gpt091-source.png` 用于首页，`gpt092-source.png` 用于关于页，`gpt093-source.png` 用于 404 页，原图位于 `scripts/assets/images/`。安装 libwebp（本次导出使用 cwebp 1.6.0）后，运行 `bash scripts/export_character_images.sh` 生成透明 WebP。脚本保留原图比例与内容，只调整分辨率和压缩；首页按原图比例展示单层透明角色图，无边框、底色或阴影，仅在底部 10% 范围渐隐以柔化原图截断。

字体许可证随公开字体保留；`scripts/` 下的源资产不随站点发布。资源大小检查见 `tests/asset-budget.test.js`。

首页、关于页、404 页和侧栏头像使用主题中的 `--character-filter` 做可逆的显示调色：浅色模式轻微降低亮度和饱和度，深色模式进一步收敛亮度。调色不改变原始图片、透明度、尺寸或动画；需要微调时修改 `_sass/theme/_default.scss` 和 `_sass/theme/_dark.scss`。

## 鼠标指针

默认、文本和链接指针在浅色与深色主题下统一使用 `assets/cursors/` 下的同一套 SVG 重绘稿，直接编辑这三个 SVG 即可维护。默认和链接指针为 48 × 48 CSS px，文本指针为 31 × 32 CSS px；SVG 自适应屏幕密度，点击热点沿用原位置。重绘前后的对比存档见 `docs/design/cursor-svg-study/`，其中的深色调色稿仅作历史存档；该目录不随站点发布，其中的脚本仅重建对比稿，不写入正式资源。

其余六种指针继续使用 PNG。九种旧版透明原图保存在 `scripts/assets/cursors/`，运行 `bash scripts/export_cursors.sh`（需要 ImageMagick 7）可重建所有旧版 PNG，不影响现用 SVG。导出时仅对 RGB 使用高光压缩曲线 `u - shoulder × u³`（浅色 0.06，深色 0.16），保留原有透明度；使用 Lanczos 缩放和轻度 RGB 锐化，分别从原图导出 1x 和 `@2x` 资源，通过 `image-set()` 匹配屏幕密度，旧浏览器回退到 1x PNG。样式和点击热点在 `_sass/_cursors.scss`，随主题自动切换，仅对支持悬停的精细指针设备启用，强制颜色模式使用系统指针。

正文悬停保持箭头；仅在鼠标按住且产生真实文本选区时切换文本指针，松开、取消或窗口失焦后恢复，保留选区不会持续改变指针。输入框与可编辑内容保持文本指针。链接与按钮、带说明的缩写、可拖动元素、禁用控件及 `aria-busy="true"` 区域会自动匹配相应指针。自定义交互可用 `data-cursor="default|pointer|text|grab|grabbing|wait|help|not-allowed|crosshair"` 指定其中一种状态；`grab` 在按下时切换为 `grabbing`。这些属性只影响指针外观，不会实现拖拽、禁用或加载逻辑。跨域博客 iframe 内的指针由博客原站控制。

## 博客接入

当前消息协议、失败时的返回入口和部署核对方式见 [博客嵌入说明](docs/blog-embed.md)。
