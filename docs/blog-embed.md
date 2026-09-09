# 博客嵌入

`/blog_embed/` 使用 iframe 显示 `https://www.husky1102.top/`。父页实现在 `assets/js/blog-embed.js`，主题接入在 `assets/js/_main.js`，脚本通过 `_includes/scripts.html` 加载。

HTML 中保留原始博客地址和独立打开链接，无脚本时仍可访问。脚本先安装消息监听器，再向 iframe 地址添加 `embed=1`。

## 消息协议

消息采用对象格式，包含 `version: 1`。主题值为 `light` 或 `dark`。

| 消息 | 方向 | 用途 |
| --- | --- | --- |
| `husky:embed:init` | 父页 → 博客 | 发送当前主题，触发博客报告就绪状态 |
| `husky:embed:ready` | 博客 → 父页 | 报告主题及 `capabilities.returnHome`、`capabilities.themeControl`；两项能力均为 `true` 且主题一致时，父页隐藏后备栏 |
| `husky:embed:theme` | 双向 | 同步主题；接收端应用主题后不回发相同变化 |
| `husky:embed:navigating` | 博客 → 父页 | 恢复后备栏，等待下一次就绪报告 |

父页只接收来自博客精确来源且 `event.source` 为当前 iframe 窗口的消息；发送消息也指定精确来源。`ready.url` 可更新独立打开链接，仅接受同源、无用户名和密码的地址，并移除 `embed` 参数。

iframe 加载、导航或页面历史恢复时会重新握手。协议不可用或握手未完成时保留返回和独立打开能力，加载较慢或失败时显示提示。

## 验证与发布

`tests/blog-embed.test.js` 验证消息来源、版本、能力对象、主题同步、重新加载及外部地址校验；`tests/public-routes.test.js` 检查生成页面的 iframe 和后备链接。

协议修改涉及两个站点时，先部署兼容的博客实现，再部署个人主页。发布后在 `/blog_embed/` 检查首次打开、文章导航、刷新、深浅色同步、返回主页和独立打开；同时检查博客不可用时的后备入口。这些跨站浏览器检查不能由本仓库的单元测试替代。
