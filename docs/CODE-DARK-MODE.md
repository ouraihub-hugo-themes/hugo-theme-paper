# 代码块深色模式实现

## 概述

本文档说明代码块在深色模式下的实现方式，完全遵循 AstroPaper 的设计理念。

## 设计理念（遵循 AstroPaper）

AstroPaper 的深色模式实现非常优雅，使用了以下策略：

1. **CSS 变量系统**：定义语义化的颜色变量（`--background`、`--foreground` 等）
2. **主题选择器**：使用 `html[data-theme="dark"]` 选择器切换变量值
3. **半透明颜色**：差异标记和行高亮使用半透明颜色，自动适配深色背景
4. **无需额外样式**：不需要为深色模式单独定义差异标记和行高亮样式

## 实现细节

### 1. CSS 变量系统

在 `main.css` 中定义颜色变量：

```css
:root,
html[data-theme="light"] {
  --background: #fdfdfd;
  --foreground: #282728;
  --accent: #006cac;
  --muted: #e6e6e6;
  --border: #ece9e9;
}

html[data-theme="dark"] {
  --background: #212737;
  --foreground: #eaedf3;
  --accent: #ff6b01;
  --muted: #343f60;
  --border: #ab4b08;
}
```

### 2. Tailwind 颜色类

使用 Tailwind 的语义化颜色类，自动使用 CSS 变量：

```css
/* 文件名标签 */
.code-file-name {
  @apply bg-background border-border text-foreground;
}

/* 代码块背景 */
.code-block pre {
  @apply bg-muted/10;
}

/* 复制按钮 */
.code-copy-button {
  @apply bg-background border-border text-foreground;
}
```

### 3. 差异标记和行高亮

**关键发现**：AstroPaper 在深色模式下使用**相同的颜色类**：

```css
/* 添加行 - 浅色和深色模式使用相同的类 */
.code-line.diff-add {
  @apply bg-green-400/20;  /* 半透明绿色 */
}

/* 删除行 - 浅色和深色模式使用相同的类 */
.code-line.diff-remove {
  @apply bg-red-500/20;  /* 半透明红色 */
}

/* 行高亮 - 浅色和深色模式使用相同的类 */
.code-line.highlighted {
  @apply bg-slate-400/20;  /* 半透明灰色 */
}
```

**为什么这样做有效？**

- 半透明颜色（`/20` = 20% 不透明度）会与背景色混合
- 在浅色背景（#fdfdfd）上：绿色看起来较浅
- 在深色背景（#212737）上：绿色看起来较深
- 两种情况下都能保持良好的对比度

### 4. 主题切换

主题通过 `data-theme` 属性切换：

```javascript
// 设置深色模式
document.documentElement.setAttribute('data-theme', 'dark');

// 设置浅色模式
document.documentElement.setAttribute('data-theme', 'light');
```

## 与 AstroPaper 的对比

| 特性 | AstroPaper | Hugo Paper |
|------|-----------|-----------|
| 主题选择器 | `html[data-theme="dark"]` | ✅ 相同 |
| CSS 变量 | `--background`, `--foreground` 等 | ✅ 相同 |
| 差异标记颜色 | `bg-green-400/20`, `bg-red-500/20` | ✅ 相同 |
| 行高亮颜色 | `bg-slate-400/20` | ✅ 相同 |
| 深色模式特殊样式 | ❌ 无需额外样式 | ✅ 相同 |

## 颜色对比度验证

根据 WCAG 2.1 AA 标准，我们需要验证以下对比度：

### 浅色模式
- 背景：`#fdfdfd`（几乎白色）
- 前景：`#282728`（深灰色）
- 差异标记：`green-400/20`、`red-500/20`
- 行高亮：`slate-400/20`

### 深色模式
- 背景：`#212737`（深蓝灰色）
- 前景：`#eaedf3`（浅灰色）
- 差异标记：`green-400/20`、`red-500/20`（相同）
- 行高亮：`slate-400/20`（相同）

**验证方法**：
1. 在浏览器中打开示例页面
2. 使用浏览器开发者工具的对比度检查器
3. 切换深色/浅色模式
4. 确保所有文本的对比度 ≥ 4.5:1（正常文本）或 ≥ 3:1（大文本）

## 测试覆盖

我们创建了完整的测试套件来验证深色模式实现：

```bash
pnpm test:run -- code-blocks-dark-mode
```

测试内容包括：
- ✅ 主题属性验证
- ✅ CSS 变量系统
- ✅ 差异标记在深色模式下的行为
- ✅ 行高亮在深色模式下的行为
- ✅ 主题切换功能
- ✅ 与 AstroPaper 的对齐验证
- ✅ 颜色对比度（结构验证）
- ✅ CSS 文件结构

## 浏览器测试

### 手动测试步骤

1. **启动开发服务器**
   ```bash
   cd hugo-theme-paper
   pnpm dev
   ```

2. **打开示例页面**
   - 访问包含代码块的页面
   - 确保页面包含差异标记和行高亮

3. **测试浅色模式**
   - 点击主题切换按钮（如果是深色模式）
   - 验证代码块背景为浅色
   - 验证差异标记颜色清晰可见
   - 验证行高亮颜色清晰可见

4. **测试深色模式**
   - 点击主题切换按钮
   - 验证代码块背景为深色
   - 验证差异标记颜色清晰可见
   - 验证行高亮颜色清晰可见

5. **对比 AstroPaper**
   - 打开 AstroPaper 示例页面
   - 截图保存浅色和深色模式的代码块
   - 对比 Hugo Paper 的效果
   - 确保视觉效果一致

### 自动化测试

使用浏览器开发者工具：

```javascript
// 在控制台中运行
// 切换到深色模式
document.documentElement.setAttribute('data-theme', 'dark');

// 切换到浅色模式
document.documentElement.setAttribute('data-theme', 'light');

// 检查当前主题
console.log(document.documentElement.getAttribute('data-theme'));
```

## 常见问题

### Q: 为什么不为深色模式单独定义差异标记颜色？

A: AstroPaper 使用半透明颜色（`/20`），这些颜色会自动与背景混合，在深色和浅色背景下都能保持良好的对比度。这种方法更简洁，也更易于维护。

### Q: 如果我想调整深色模式的颜色怎么办？

A: 修改 `main.css` 中的 CSS 变量：

```css
html[data-theme="dark"] {
  --background: #212737;  /* 调整背景色 */
  --foreground: #eaedf3;  /* 调整前景色 */
  --accent: #ff6b01;      /* 调整强调色 */
  --muted: #343f60;       /* 调整静音色 */
  --border: #ab4b08;      /* 调整边框色 */
}
```

### Q: 差异标记在深色模式下看不清怎么办？

A: 首先确认是否正确实现了 CSS 变量系统。如果确实需要调整，可以修改半透明度：

```css
/* 增加不透明度（更明显） */
.code-line.diff-add {
  @apply bg-green-400/30;  /* 从 20% 增加到 30% */
}
```

但请注意，这会偏离 AstroPaper 的设计。

### Q: 如何验证颜色对比度？

A: 使用以下工具：
1. Chrome DevTools 的对比度检查器
2. [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
3. [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

## 参考资料

- [AstroPaper Typography CSS](https://github.com/satnaing/astro-paper/blob/main/src/styles/typography.css)
- [AstroPaper Global CSS](https://github.com/satnaing/astro-paper/blob/main/src/styles/global.css)
- [WCAG 2.1 对比度要求](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Tailwind CSS 深色模式](https://tailwindcss.com/docs/dark-mode)

## 总结

Hugo Paper 的代码块深色模式实现完全遵循 AstroPaper 的设计理念：

1. ✅ 使用 CSS 变量系统
2. ✅ 使用 `[data-theme="dark"]` 选择器
3. ✅ 差异标记和行高亮使用相同的半透明颜色
4. ✅ 无需额外的深色模式样式
5. ✅ 保持与 AstroPaper 一致的视觉效果

这种实现方式简洁、优雅、易于维护，完美复刻了 AstroPaper 的深色模式体验。
