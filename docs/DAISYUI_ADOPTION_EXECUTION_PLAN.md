# daisyUI 采用执行清单

> 结论：不需要两个仓库一起重构。`hugo-theme-paper` 是主战场，`ui-library` 只做支撑层补强。

## 目标

把 `hugo-theme-paper` 里重复的标准 UI 组件尽量收敛到 daisyUI，保留博客内容体验、Markdown 渲染和业务交互的自定义实现。

## 仓库边界

### `hugo-theme-paper`

负责最终博客站点的视觉和交互落地，是本次改造的主要对象。

### `ui-library`

只负责提供可复用的 token、preset、主题映射和文档，不做整库翻新。

## 改造顺序

### Phase 1: 先改 `hugo-theme-paper`

先把最有收益、最固定的 UI 组件换掉。

#### 优先改的文件

- `package.json`
  - 添加 `daisyui` 依赖。
  - 如果需要，补充相应的 build 配置。
- `tailwind.config.js`
  - 启用 daisyUI 插件。
  - 配置主题范围，只暴露少量博客常用主题。
- `assets/css/main.css`
  - 保留现有 `data-theme` 机制。
  - 对接 daisyUI 的主题变量。
- `assets/css/ouraihub-mapping.css`
  - 继续作为品牌色和 token 映射层。
- `layouts/partials/header.html`
  - 主导航切换成 daisyUI 的 `navbar` / `drawer` / `menu` 结构。
- `layouts/partials/theme-toggle.html`
  - 统一按钮样式。
- `layouts/partials/back-to-top.html`
  - 改成 daisyUI 风格按钮。
- `layouts/partials/post-share.html`
  - 改成统一的按钮组 / 卡片样式。
- `layouts/partials/site-stats.html`
  - 改成 `card` / `stats` 风格展示。
- `layouts/partials/pagination.html`
  - 改成统一分页按钮样式。
- `layouts/_default/single.html`
  - 只保留文章结构，减少重复脚本。
- `layouts/partials/code-copy.html`
  - 与 `single.html` 里的复制逻辑合并或去重。
- `assets/css/typography.css`
  - 保留正文排版，收敛代码块和正文内容样式。

#### 暂时不动的文件

- `content/**`
  - 不改文章内容。
- `layouts/partials/seo-meta.html`
  - 不动 SEO 结构。
- `layouts/partials/giscus.html`
  - 不动评论系统。
- `layouts/partials/comments.html`
  - 不动评论适配。
- `assets/ts/*`
  - 只在复制逻辑必须合并时再动。

### Phase 2: 再补 `ui-library`

`ui-library` 只补支撑，不重写核心。

#### 只需要补的内容

- `packages/tokens`
  - 增加 daisyUI 主题映射说明。
  - 提供少量品牌主题模板。
- `packages/preset-*`
  - 如果后续多个主题都要复用，再加 preset 级支持。
- 文档
  - 记录主题映射、推荐主题和使用边界。

#### 不需要动的内容

- `packages/core`
  - 不改 ThemeManager、SEOManager、NavigationController 的核心逻辑。
- `packages/utils`
  - 不因 daisyUI 重写通用工具。
- `hugo/astro` 的核心适配层
  - 先不做全量重构。

## 推荐实施节奏

### 1. 导航优先

先改 `header.html`，这是用户最先看到的移动端体验。

### 2. 卡片和按钮

接着处理 `post-share`、`site-stats`、`pagination`、`back-to-top`。

### 3. Markdown 内容

最后处理正文排版、代码块外壳、复制按钮和提示样式。

## 验收标准

- 移动端导航可正常展开收起。
- 文章列表和卡片在小屏下不溢出。
- 代码块清晰可读，复制按钮正常。
- 主题切换后 UI 不破坏。
- `ui-library` 不需要跟着做大重构。

## 结论

如果目标是“用 daisyUI 提升博客主题效率”，那就先改 `hugo-theme-paper`。  
`ui-library` 只需要提供主题映射和文档支持，不需要整个重写。

