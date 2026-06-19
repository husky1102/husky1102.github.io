# 前端美观与动画交互评审及改进指导

**时间**: 2026-06-19
**范围**: 前端样式 (`_sass/custom.scss`), 布局 (`_layouts`), 及交互脚本 (`assets/js/_main.js`)
**状态**: 已归档
**闭环提交**: `edada35 Add GSAP motion layer`
**验证**: `npm run build:js`; `node --test tests/website-aesthetics-v4.test.js tests/website-aesthetics-v3.test.js`

---

## 1. 现状美学评估 (Current State Evaluation)

目前项目的整体前端代码结构清晰，具备了建立现代网页的良好底子，表现出了以下优势：

1. **出色的排版与层级 (Typography & Hierarchy)**:
   - 引用了现代字体 `LXGW WenKai Screen` 和 `Maple Mono NF CN`。
   - 标题 (h1-h6) 配合 `text-wrap: balance` 以及适当的负字间距 (`letter-spacing`)，保证了阅读时的视觉节奏感。
2. **优雅的色彩与扁平化设计 (Color & Elevation)**:
   - 对 Quiet tier（安静层）和 Primary tier（主要层）的背景设定使用了 `color-mix()`，在扁平化的基础上利用微妙的渐变和阴影传达了不同层级的深度。
   - 深浅色切换（Dark/Light mode）支持良好，有着舒适的过渡时间（0.28s）。

**待提升的短板**：
虽然 CSS 的 `transition` 为 Hover 悬停效果提供了反馈，但网页整体缺乏**生命力**与**高级感 (Premium Feel)**。页面加载和向下滚动时，所有内容（如 Hero section 和 archive cards）均是静态生硬地直接出现，缺乏“呼吸感”和顺滑的微交互 (Micro-animations)。

---

## 2. 改进方向 (Areas for Improvement)

为了达到“令人惊艳的动态设计（Dynamic Design）”，建议采用 **GSAP (GreenSock Animation Platform)** 代替纯 CSS 或老旧的 jQuery 动画，对关键视觉路径进行以下维度的升级：

1. **首屏入场仪式感 (Hero Intro)**：进入页面时，标题、引言和按钮应依次顺滑浮现，避免生硬展现。
2. **滚动驱动呈现 (Scroll-driven Fade-ins)**：向下阅读文章列表或项目卡片时，元素应随着视口滚动逐渐淡入。
3. **交互性能与现代性**：用 GSAP 强大的引擎接管诸如“阅读进度条”等效果，替代原本在 jQuery `$(window).on("scroll")` 中手动计算的方式，以提高性能。

---

## 3. GSAP 动画改进实战指导 (Implementation Guide)

下面是结合项目中现有的 DOM 结构，如何引入并编写 GSAP 动画的具体指导：

### 3.1 引入核心依赖
在 `_includes/scripts.html` 或 `_layouts/default.html` 的底部引入 GSAP 核心库和 ScrollTrigger 插件：

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/ScrollTrigger.min.js"></script>
```

并在你的自定义 JS 顶部注册插件：
```javascript
gsap.registerPlugin(ScrollTrigger);
```

### 3.2 首屏（Hero Section）的错位入场动画
利用 `gsap.from()` 和 `stagger` 为首页的 `.home-hero` 添加动画：

```javascript
// 选择首屏的关键元素
const heroElements = document.querySelectorAll(".home-hero__eyebrow, .home-hero h1, .home-hero__lead, .home-hero__actions");

if (heroElements.length > 0) {
  gsap.from(heroElements, {
    y: 30,                 // 从下方 30px 开始移动
    autoAlpha: 0,          // 透明度从 0 开始（包含 visibility: hidden 的优化）
    duration: 1,           // 持续 1 秒
    ease: "power3.out",    // 流畅的减速缓动
    stagger: 0.15,         // 元素之间相隔 0.15 秒依次出现
    clearProps: "all"      // 动画结束后清除行内样式，交还给 CSS 控制
  });
}
```

### 3.3 卡片列表的滚动淡入 (ScrollTrigger.batch)
当用户往下滚动时，让信息卡片 `.home-info-card` 和 `.archive__item--card` 顺滑出现。使用 `ScrollTrigger.batch` 是处理此类网格卡片最佳的方案：

```javascript
ScrollTrigger.batch(".home-info-card, .archive__item--card", {
  start: "top 85%", // 当元素顶部到达视口 85% 位置时触发
  onEnter: (elements, triggers) => {
    gsap.from(elements, {
      y: 40,
      autoAlpha: 0,
      stagger: 0.1, // 同一批次出现的卡片错位 0.1s
      ease: "power2.out",
      overwrite: true
    });
  },
  once: true // 只动画一次，往上滚时不重复消失
});
```

### 3.4 阅读进度条优化 (Scroll-linked Progress)
将目前 `assets/js/_main.js` 中的进度条手动计算替换为 GSAP 的 ScrollTrigger scrub 动画：

```javascript
// 移除旧的 requestAnimationFrame 手动计算，使用这行代码即可：
gsap.to(".scroll-progress span", {
  width: "100%",
  ease: "none", // 保证随进度匀速变化
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.3 // scrub 为数字可带来丝滑的惯性跟随感
  }
});
```

### 3.5 无障碍与无缝集成 (Accessibility & prefers-reduced-motion)
在实现高级感的同时，必须遵守无障碍规范。使用 `gsap.matchMedia()` 包裹所有动画逻辑，使得晕眩症用户可以关闭动画：

```javascript
let mm = gsap.matchMedia();

// 仅在用户未偏好减少动画时才执行这些动效
mm.add("(prefers-reduced-motion: no-preference)", () => {
  // 在此处放置上方的首屏动画、ScrollTrigger.batch 动画等
  
  return () => {
    // 离开该媒体查询时的可选清理逻辑
  };
});
```

---

## 结论
借助以上 GSAP 策略，项目能立刻从一个设计精致的“静态文档”转变为具有“生命力”和“高级互动感”的现代 Web 站点。上述代码可作为下一阶段优化的蓝本，直接集成进 `assets/js/_main.js` 中。
