---
name: Husky Curious Workshop
description: A calm, curious, and playful personal research identity.
colors:
  light-canvas: "#fbfaf7"
  light-surface: "#f2efe9"
  light-ink: "#27231f"
  light-muted: "#6f675c"
  light-border: "#ded8cd"
  curiosity-teal: "#0f766e"
  curiosity-teal-hover: "#115e59"
  dark-canvas: "#17191d"
  dark-surface: "#22252a"
  dark-ink: "#e7edf4"
  dark-muted: "#a6b3c4"
  signal-cyan: "#67e8f9"
  warm-signal: "#f9c97f"
typography:
  display:
    fontFamily: "Maple Mono NF CN, LXGW WenKai Screen, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Maple Mono NF CN, LXGW WenKai Screen, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.014em"
  body:
    fontFamily: "LXGW WenKai Screen, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.72
  label:
    fontFamily: "Maple Mono NF CN, monospace"
    fontSize: "0.8rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.02em"
rounded:
  focus: "3px"
  control: "7px"
  surface: "8px"
  pill: "999px"
spacing:
  xs: "0.35rem"
  sm: "0.65rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.25rem"
components:
  button-primary:
    backgroundColor: "{colors.curiosity-teal}"
    textColor: "{colors.light-canvas}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.72rem 1rem"
    height: "2.75rem"
  button-secondary:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.curiosity-teal}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.72rem 1rem"
    height: "2.75rem"
  research-surface:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-ink}"
    rounded: "{rounded.surface}"
    padding: "1rem"
---

# Design System: Husky Curious Workshop

## Overview

**Creative North Star: "好奇心工作台"**

界面像一张正在使用的研究工作台：线索、兴趣与入口围绕一个鲜明的人格中心组织，而不是被平均分配进一组模板卡片。整体保持冷静的阅读秩序，用角色头像、不对称构图和少量机敏动效表达好奇与灵动。

这个系统服务于个人品牌，而非传统学院模板。研究信息必须可信、快速可扫读，但第一印象应先让人记住 Husky。它明确拒绝通用 SaaS 落地页、杂志模板、廉价赛博霓虹和无意义的滚动淡入。

**Key Characteristics:**

- 角色资产是叙事主角，不是侧栏缩略图。
- 单色青绿负责导航与行动，暖黄只作微量性格信号。
- 信息以轨道、清单和开放布局组织，同构卡片只用于真正独立的对象。
- 动画集中在首屏编排、状态反馈与空间关系，内容默认始终可见。
- 移动端重新编排主次，不机械压缩桌面布局。

## Colors

浅色模式像清洁的桌面，深色模式像低照度实验室；两者共享青绿色识别线索，暖色只在小面积细节中出现。

### Primary

- **Curiosity Teal**：浅色模式的链接、焦点、主要行动和关键轨迹。
- **Signal Cyan**：深色模式的链接、焦点和少量主动反馈，不铺满大面积表面。

### Secondary

- **Warm Signal**：只用于代码提示、状态细节或角色服装的呼应，禁止成为第二套主色。

### Neutral

- **Light Canvas / Light Surface**：浅色页面底与层级表面，保持低彩度，让头像与内容成为焦点。
- **Light Ink / Light Muted / Light Border**：正文、辅助信息与结构分隔。
- **Dark Canvas / Dark Surface**：深色环境与局部表面，不使用纯黑。
- **Dark Ink / Dark Muted**：深色正文与说明文字，必须保持 WCAG AA 对比度。

**The Sparse Signal Rule.** 强调色只标记行动、焦点与叙事线索；如果一个视口里每个边框都在发光，强调就已经失效。

**The Avatar Palette Rule.** 不从头像里机械复制整套青、黄、红色；页面用青绿建立身份，暖黄仅作一次呼应。

## Typography

**Display Font:** Maple Mono NF CN（回退至 LXGW WenKai Screen 与系统无衬线）  
**Body Font:** LXGW WenKai Screen（回退至系统无衬线）  
**Label/Mono Font:** Maple Mono NF CN（回退至系统等宽）

**Character:** Maple Mono 提供研究、代码和个人昵称的机械节奏，霞鹜文楷让长段落保留温度。两者必须形成明确分工，禁止所有文本都以等宽字体和同一节奏出现。

### Hierarchy

- **Display**（700，流式 2.25–5.5rem，1.04）：只用于首页身份主标题，字距不低于 -0.03em。
- **Headline**（700，流式 1.5–2.4rem，1.2）：用于主要分区标题与页面标题。
- **Title**（700，约 1–1.2rem，1.3）：用于研究轨道、经历条目和可操作对象。
- **Body**（400，1.05rem，1.72）：用于说明与履历，行长控制在 65–72ch。
- **Label**（700，0.8rem，0.02em）：用于短状态、导航和元信息，不用全大写句子。

**The Two-Voice Rule.** 标题与标签使用 Maple Mono，叙述使用霞鹜文楷；一个区块只能有一个主导声音。

**The No-Cropping Rule.** 标题必须在 320px 视口完整换行，禁止依赖隐藏溢出来维持构图。

## Elevation

系统采用“平面为默认、状态才抬升”的混合层级。静止内容依靠色调、留白和分隔线组织；阴影只在首屏关键对象、悬停反馈和浮动控件上短暂出现。

### Shadow Vocabulary

- **Quiet Lift**（`0 6px 18px rgba(15, 23, 42, 0.05)`）：仅用于需要从背景中轻微分离的主内容。
- **Interactive Lift**（`0 14px 30px rgba(15, 23, 42, 0.09)`）：只在悬停或键盘焦点时出现。
- **Dark Focus Glow**（低透明青色与深色阴影组合）：只用于深色模式的主动状态，不用于持续呼吸。

**The Resting Surface Rule.** 同类内容在静止状态不同时拥有边框、宽阴影、渐变和光晕；最多选择一种主层级手段。

## Components

### Buttons

- **Shape:** 紧凑的轻圆角矩形（7px），不是胶囊，也不是玻璃卡片。
- **Primary:** 青绿实色、浅色标签、44px 最小高度，用于首要目的地。
- **Hover / Focus:** 通过 1–2px 的位移、颜色切换与清晰 2px 焦点环反馈；禁止大面积模糊光晕。
- **Secondary:** 使用页面表面色与青绿文本，权重明显低于主要行动。

### Chips

- **Style:** 仅用于真实元数据和资源类型，使用完整细边框、轻微色调背景和胶囊形态。
- **State:** 芯片默认静止；只有可交互芯片才具有悬停与焦点状态。

### Cards / Containers

- **Corner Style:** 轻圆角（8px），让角色资产与排版保持主导。
- **Background:** 浅色用 Light Surface，深色用 Dark Surface；不叠加装饰性玻璃模糊。
- **Shadow Strategy:** 静止时平面或 Quiet Lift，Interactive Lift 只响应交互。
- **Border:** 细分隔仅用于表达对象边界，连续内容优先使用留白与横向规则。
- **Internal Padding:** 以 1rem 为基线，密集条目可降至 0.65rem。

### Navigation

- 导航保持低矮、直接和可扫读；活动页使用位置、底线或颜色表达，禁止让每个导航项都成为独立按钮。
- 移动端保留品牌名、当前入口和主题切换，其他入口进入清晰菜单；所有触控目标至少 44px。

### Character Stage

首页角色图与主标题共同构成签名组件。角色图可以越出局部构图边界，但不得遮挡文字、抢占键盘路径或在移动端制造横向溢出。鼠标或滚动响应只能使用合成友好的 transform 与 opacity，并在减少动态模式下保持静态完整。

## Do's and Don'ts

### Do:

- **Do** 让角色头像、姓名和一句清晰定位共同占据首屏主要注意力。
- **Do** 用不对称构图与不同信息密度建立节奏，而不是复制同尺寸卡片。
- **Do** 确保内容在动画运行前就可见，JS 只增强已有呈现。
- **Do** 将高频动画限制在 transform 与 opacity，并在离屏、隐藏标签页或减少动态环境中停止。
- **Do** 在 320px、390px、768px、1024px 与 1440px 宽度检查标题、按钮、导航和角色图。

### Don't:

- **Don't** 回到“通用 SaaS 落地页的重复卡片与渐变装饰”。
- **Don't** 使用“杂志模板式的排版腔调”代替真实个人气质。
- **Don't** 使用“廉价赛博霓虹”、过量玻璃效果或让每个深色表面持续发光。
- **Don't** 使用无意义的滚动淡入，让未进入视口的内容暂时不可见。
- **Don't** 为同一身份在侧栏和首屏重复完整姓名、头像、简介与链接。
- **Don't** 通过超过 16px 的卡片圆角、渐变文字或宽阴影加细边框制造“高级感”。
