# Spec 文档更新摘要

## 概述

根据用户反馈，需要将 CSS 重构的 5 个阶段正式纳入 spec 文档（需求、设计、任务）。

---

## 1. Requirements.md 需要更新

### Requirement 9 需要完全重写

**当前版本**（过于简单）:
```markdown
### Requirement 9: 深色模式样式完整性

1. WHEN 切换到深色模式 THEN 所有文本 SHALL 使用浅色
2. WHEN 切换到深色模式 THEN 所有背景 SHALL 使用深色
...
```

**新版本**（明确要求对齐 AstroPaper）:
```markdown
### Requirement 9: CSS 系统重构（完全对齐 AstroPaper）

**User Story:** 作为一个主题开发者，我希望 CSS 系统与 AstroPaper 完全一致，包括颜色搭配、样式架构和 Tailwind Typography 的使用，这样可以确保视觉效果和代码质量都与 AstroPaper 保持一致。

**参考实现:** 
- 必须完全复刻 `astro-paper/src/styles/global.css`
- 必须使用 `@tailwindcss/typography` 插件
- 必须删除所有自定义组件类

#### Acceptance Criteria

1. WHEN 查看 main.css THEN 代码行数 SHALL 约为 100 行（与 AstroPaper 的 global.css 相当）
2. WHEN 查看 main.css THEN 系统 SHALL NOT 包含任何硬编码的颜色值（如 bg-gray-900, from-blue-500 等）
3. WHEN 查看 main.css THEN 系统 SHALL NOT 包含自定义组件类（如 .btn-primary, .card, .gradient-text），除了 .active-nav
4. WHEN 查看 main.css THEN 系统 SHALL NOT 包含自定义排版样式（h1-h6, code, pre 等）
5. WHEN 查看 package.json THEN 系统 SHALL 包含 @tailwindcss/typography 依赖
6. WHEN 渲染文章内容 THEN 系统 SHALL 使用 Tailwind Typography 插件（prose 或 app-prose 类）
7. WHEN 切换到深色模式 THEN 所有颜色值 SHALL 与 AstroPaper 完全一致（--background: #212737, --foreground: #eaedf3, --accent: #ff6b01, --muted: #343f60, --border: #ab4b08）
8. WHEN 对比 Hugo Paper 和 AstroPaper THEN 视觉效果 SHALL 完全一致（颜色、间距、字体、布局）
9. WHEN 使用颜色对比度检查工具 THEN 所有文本与背景的对比度 SHALL 至少为 4.5:1（WCAG AA）
10. WHEN 查看布局文件 THEN 系统 SHALL NOT 使用自定义组件类，而是直接使用 Tailwind 类
```

---

## 2. Design.md 需要添加新章节

### 在 "Components and Interfaces" 部分添加

#### 新章节: CSS 系统重构设计

```markdown
### 8. CSS 系统重构（完全对齐 AstroPaper）

#### 8.1 设计目标

**核心原则**: 完全复刻 AstroPaper 的 CSS 架构，而不是自由发挥。

**目标**:
1. 将 main.css 从 250+ 行精简到 ~100 行
2. 删除所有自定义组件类
3. 使用 Tailwind Typography 处理排版
4. 确保颜色值与 AstroPaper 100% 一致

#### 8.2 Tailwind Typography 集成

**什么是 Tailwind Typography**:
- 官方插件，专门用于长文本内容的排版
- 提供 `prose` 类，自动美化 h1-h6, p, code, pre 等元素
- AstroPaper 使用此插件，Hugo Paper 也必须使用

**安装**:
```bash
pnpm add -D @tailwindcss/typography
```

**配置** (tailwind.config.js):
```js
export default {
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

**使用** (layouts/post/single.html):
```html
<article class="prose app-prose max-w-none">
  {{ .Content }}
</article>
```

#### 8.3 main.css 重构策略

**保留的内容**:
- CSS 变量定义（与 AstroPaper 完全一致）
- @theme inline 集成
- @layer base 基础样式
- .active-nav 类（唯一的自定义类）

**删除的内容**:
- ❌ 所有 h1-h6 样式（由 Tailwind Typography 处理）
- ❌ 所有 code, pre 样式（由 Tailwind Typography 处理）
- ❌ 所有 .btn-* 类（直接使用 Tailwind 类）
- ❌ 所有 .card 类（直接使用 Tailwind 类）
- ❌ 所有 .gradient-* 类（AstroPaper 没有这些）
- ❌ 所有硬编码颜色值

#### 8.4 布局文件重构策略

**修改原则**:
```html
<!-- ❌ 旧的方式 -->
<a href="/archives/" class="btn-primary">Read Articles</a>
<div class="card">...</div>
<h1 class="gradient-text">Title</h1>

<!-- ✅ 新的方式（参考 AstroPaper） -->
<a href="/archives/" class="inline-block px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/80">
  Read Articles
</a>
<div class="bg-background border border-border rounded-lg p-6">...</div>
<h1 class="text-foreground">Title</h1>
```

**需要修改的文件**:
- layouts/_default/list.html
- layouts/post/single.html
- layouts/partials/post-card.html
- layouts/partials/post-list-item.html
- 所有其他使用自定义类的文件

#### 8.5 实施风险

**高风险**:
- 破坏性变更 - 移除自定义类会导致现有布局失效
- 工作量大 - 需要修改所有布局文件

**缓解措施**:
- 先备份当前 main.css
- 逐个文件修改和测试
- 与 AstroPaper 进行视觉对比验证
```

---

## 3. Tasks.md 需要重写任务 8

### 当前任务 8（范围太小）

```markdown
- [ ] 8. 完善深色模式样式
  - 检查所有组件在深色模式下的显示
  - 确保颜色对比度符合标准
  - 修复任何显示问题

- [ ] 8.1 审查所有页面的深色模式样式
- [ ] 8.2 修复深色模式样式问题
- [ ] 8.3 验证颜色对比度
```

### 新任务 8（完整的 CSS 重构）

```markdown
- [ ] 8. 完全重构 CSS 系统以对齐 AstroPaper
  - 精简 main.css 到 ~100 行
  - 安装和配置 Tailwind Typography
  - 重构所有布局文件
  - 验证视觉一致性
  - _Requirements: 9.1-9.10_
  - _参考: astro-paper/src/styles/global.css, astro-paper/src/styles/typography.css_
  - _预估时间: 2-3 天_

- [ ] 8.1 Phase 1: 备份和准备 (30分钟)
  - 创建 main.css 的备份文件（main.css.backup）
  - 创建当前布局文件的备份
  - 记录当前使用的所有自定义类
  - 创建 CSS 重构检查清单
  - _Requirements: 9.1_

- [ ] 8.2 Phase 2: 精简 main.css (2-3小时)
  - 打开 `astro-paper/src/styles/global.css` 作为参考
  - 删除所有自定义组件类（.btn-*, .card, .gradient-* 等）
  - 删除所有硬编码颜色值（bg-gray-900, from-blue-500 等）
  - 删除所有自定义排版样式（h1-h6, code, pre 等）
  - 仅保留 AstroPaper 的基础样式（CSS 变量、@layer base、.active-nav）
  - 确保最终代码约 100 行
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 8.3 Phase 3: 安装 Tailwind Typography (30分钟)
  - 运行 `pnpm add -D @tailwindcss/typography`
  - 修改 `tailwind.config.js`，添加 typography 插件
  - 创建 `assets/css/typography.css`（可选，用于覆盖默认样式）
  - 参考 `astro-paper/src/styles/typography.css` 创建覆盖样式
  - 在 main.css 中导入 typography.css（如果创建了）
  - 测试 prose 类是否正常工作
  - _Requirements: 9.5, 9.6_

- [ ] 8.4 Phase 4: 重构布局文件 (4-6小时)
  - 修改 `layouts/_default/list.html`
    - 移除所有 .btn-primary, .btn-secondary 使用
    - 移除所有 .gradient-text 使用
    - 使用 Tailwind 类替代
  - 修改 `layouts/post/single.html`
    - 在文章内容外层添加 `prose app-prose` 类
    - 移除所有自定义类使用
  - 修改 `layouts/partials/post-card.html`
    - 移除 .card 类
    - 使用 Tailwind 类替代（bg-background border border-border rounded-lg p-6）
  - 修改 `layouts/partials/post-list-item.html`
    - 移除所有自定义类
    - 使用 Tailwind 类替代
  - 检查并修改所有其他使用自定义类的文件
  - _Requirements: 9.10_

- [ ] 8.5 Phase 5: 测试和验证 (2-3小时)
  - 启动开发服务器，检查所有页面显示
  - 对比 AstroPaper 和 Hugo Paper 的视觉效果
    - 首页布局和样式
    - 文章列表页
    - 文章详情页
    - 标签页
  - 使用 axe DevTools 检查颜色对比度
  - 测试深色模式切换
  - 测试响应式布局（移动、平板、桌面）
  - 记录并修复所有不一致的地方
  - _Requirements: 9.7, 9.8, 9.9_
```

---

## 4. 更新顺序

1. ✅ 创建本摘要文档
2. ⏭️ 更新 requirements.md - Requirement 9
3. ⏭️ 更新 design.md - 添加 CSS 重构设计章节
4. ⏭️ 更新 tasks.md - 重写任务 8
5. ⏭️ 获得用户确认
6. ⏭️ 开始执行任务 8

---

## 5. 关键决策点

### 是否使用 Tailwind Typography？

**推荐**: 是

**理由**:
1. AstroPaper 使用它
2. 代码量减少 60%
3. 维护更简单
4. 完全对齐 AstroPaper

**如果不使用**:
- 无法完全对齐 AstroPaper
- 代码量大
- 维护复杂

---

**创建日期**: 2025-11-11
**状态**: 等待执行更新
