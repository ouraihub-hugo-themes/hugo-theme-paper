# daisyUI + Hugo Paper 移动端布局方案

> 结论：daisyUI 不能让博客“天然自动移动端适配”，但它能把导航、抽屉、菜单、按钮、卡片等常见布局组件的响应式实现成本显著降低。

## 目标

把 Hugo Paper 的移动端布局从“手写响应式 class + 自定义交互”收敛为“标准组件 + 少量定制”，同时保留当前的文章排版、代码渲染和主题能力。

## 现状

这个主题已经有自己的响应式实现：

- 头部导航使用 `sm:` / `md:` 切换。
- `back-to-top` 在移动端和桌面端使用不同样式。
- `site-stats`、`post-share`、`taxonomy`、`pagination` 都是 Tailwind 手写布局。
- 文章正文排版和代码块样式完全自定义。

这说明当前问题不是“没有响应式”，而是“响应式分散在各处维护”。

## daisyUI 能帮什么

daisyUI 适合接管的是标准化、规律明确的移动端 UI：

- `navbar`
- `drawer`
- `menu`
- `dropdown`
- `button`
- `card`
- `modal`
- `collapse`
- `tabs`

这些组件本身就有响应式模式，例如：

- `navbar` 支持小屏下 dropdown menu、大屏下横向菜单。
- `drawer` 支持小屏抽屉、大屏常显。
- `menu` 可以在小屏纵向、在大屏横向。

## daisyUI 不能替代什么

- 文章正文的排版策略
- 代码块高亮
- 阅读进度条
- 文章分享逻辑
- 主题切换脚本
- SEO 相关布局
- 特定博客品牌视觉

这些内容仍然需要 Hugo Paper 自己定义。

## 推荐方案

### 1. 全局导航

用 `drawer + navbar + menu` 统一移动端主导航。

```html
<div class="drawer lg:drawer-open">
  <input id="site-drawer" type="checkbox" class="drawer-toggle" />

  <div class="drawer-content">
    <header class="navbar bg-base-100 shadow-sm">
      <div class="flex-none lg:hidden">
        <label for="site-drawer" class="btn btn-square btn-ghost">
          ☰
        </label>
      </div>
      <div class="navbar-center">Hugo Paper</div>
    </header>
  </div>

  <div class="drawer-side">
    <label for="site-drawer" class="drawer-overlay"></label>
    <ul class="menu min-h-full w-80 bg-base-100 p-4">
      <li><a>Posts</a></li>
      <li><a>Tags</a></li>
      <li><a>About</a></li>
    </ul>
  </div>
</div>
```

### 2. 文章内容区

保留现有 `max-w-app + prose + 代码块样式`，只做局部增强。

- 维持正文最大宽度。
- 保持移动端左右内边距。
- 代码块横向滚动。
- 图片自适应宽度。
- 表格在小屏可滚动。

### 3. 内容卡片

列表页、归档页、统计卡、分享卡可以逐步迁移到 `card` / `badge` / `button` / `alert` 风格。

### 4. 交互按钮

主题切换、复制按钮、返回顶部按钮统一成一套按钮规范。

## 实施分层

### P0: 导航优先

先改主导航和移动菜单，这是移动端体感最强的部分。

### P1: 内容卡片

再处理文章列表、标签、分享、统计卡片。

### P2: 文章正文

最后统一代码块、提示框、表格、引用块。

## 验收标准

- 小屏打开后，导航可正常展开/收起。
- 主内容不横向溢出。
- 文章卡片在手机上单列显示。
- 代码块可横向滚动，不撑破布局。
- 主题切换后布局不抖动。
- 不依赖额外 JS 来“修复”移动端布局。

## 结论

daisyUI 不是“自动移动端方案”，但它能把 Hugo Paper 的移动端布局从“自己造很多轮子”变成“复用成熟组件 + 少量定制”。  
对这个博客主题来说，最值得先做的是导航和菜单，其次是卡片类和按钮类组件。

## 参考

- [daisyUI Navbar](https://daisyui.com/components/navbar/)
- [daisyUI Drawer](https://daisyui.com/components/drawer/)
- [daisyUI Menu](https://daisyui.com/components/menu/)
- [daisyUI Themes](https://daisyui.com/docs/themes/)

