# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

#### 语言切换重复跳转导致 404 (2025-01-15)

**问题描述：**
- 在 posts、about、archives 页面，从英文切换到中文后，再次点击语言切换按钮会跳转到 `/zh/zh/xxx/` 导致 404
- 例如：`/en/post/` → `/zh/post/` → `/zh/zh/post/` (404)

**根本原因：**
- 这些页面的英文和中文版本没有设置 `translationKey`
- Hugo 不认为它们是翻译关系
- 语言切换器走的是 `else` 分支（没有翻译版本），使用路径拼接逻辑
- 路径拼接逻辑在某些情况下会重复添加语言前缀

**解决方案：**
为所有需要语言切换的页面添加 `translationKey`：

```yaml
# exampleSite/content/en/post/_index.md
---
title: All Posts
translationKey: post-section
---

# exampleSite/content/zh/post/_index.md
---
title: 所有文章
translationKey: post-section
---
```

同样的方式应用到：
- `about.md` - `translationKey: about-page`
- `archives/_index.md` - `translationKey: archives-page`

**技术细节：**
- 设置 `translationKey` 后，Hugo 会正确识别翻译关系
- 语言切换器使用 `.IsTranslated` 和 `.Translations` 方法
- 直接获取翻译页面的 `.Permalink`，避免路径拼接错误

**影响文件：**
- `exampleSite/content/en/post/_index.md`
- `exampleSite/content/zh/post/_index.md`
- `exampleSite/content/en/about.md`
- `exampleSite/content/zh/about.md`
- `exampleSite/content/en/archives/_index.md`
- `exampleSite/content/zh/archives/_index.md`

**测试结果：**
- ✅ Posts 页面语言切换正常（英文 ↔ 中文）
- ✅ About 页面语言切换正常（英文 ↔ 中文）
- ✅ Archives 页面语言切换正常（英文 ↔ 中文）
- ✅ 多次切换不会导致 404

**相关提交：**
- `17c5105` - fix: 修复语言切换重复跳转导致 404 的问题

---

#### 归档页面在多语言环境下不显示文章 (2025-01-15)

**问题描述：**
- 归档页面（`/en/archives/` 和 `/zh/archives/`）显示 "No articles found."
- 无法列出任何文章，即使文章确实存在

**根本原因：**
在多语言配置下，内容目录结构是 `content/en/post/` 和 `content/zh/post/`，导致：
- 第一级 section 是语言代码（`en` 或 `zh`）
- 第二级才是 `post`
- 原代码使用 `where .Site.RegularPages "Section" "post"` 无法找到文章
- 因为所有页面的 `.Section` 值是 `"en"` 或 `"zh"`，而不是 `"post"`

**解决方案：**
使用 `.Site.GetPage` 方法并构建完整的语言路径：

```go
{{- /* 构建当前语言的 post section 路径 */ -}}
{{ $postPath := printf "/%s/post" .Language.Lang }}
{{ $postSection := .Site.GetPage $postPath }}
{{ $posts := slice }}
{{ if $postSection }}
  {{ $posts = $postSection.RegularPages }}
{{ end }}
{{ $posts = where $posts "Draft" false }}
{{ $posts = $posts.ByDate.Reverse }}
```

**关键技术点：**
1. 使用 `printf "/%s/post" .Language.Lang` 构建语言特定的路径（如 `/en/post` 或 `/zh/post`）
2. 使用 `.Site.GetPage` 正确获取指定路径的 section 页面
3. 从 section 页面的 `RegularPages` 获取所有常规页面（文章）
4. 过滤草稿文章并按日期倒序排列

**影响文件：**
- `layouts/archives/list.html`

**测试结果：**
- ✅ 英文归档页面正确显示所有英文文章
- ✅ 中文归档页面正确显示所有中文文章
- ✅ 文章按年份和月份正确分组
- ✅ 语言切换功能正常工作

**相关提交：**
- `da43478` - fix: 修复多语言环境下归档页面不显示文章的问题

---

#### 语言切换器模板语法错误 (2025-01-15)

**问题描述：**
- `layouts/partials/language-switcher.html` 存在模板语法错误
- HTML 属性被自动格式化换行，导致引号不匹配
- Hugo 构建失败：`unterminated quoted string`

**解决方案：**
- 重构模板代码，将 i18n 文本提取到变量中
- 避免在 HTML 属性中直接使用多行模板表达式
- 使用 `$switchText` 变量存储翻译文本

**影响文件：**
- `layouts/partials/language-switcher.html`

**相关提交：**
- `da43478` - fix: 修复多语言环境下归档页面不显示文章的问题

---

## [2.0.0-dev] - 2024-11-15

### Added
- 初始版本，完整复刻 AstroPaper 主题
- 支持深色/浅色模式
- 响应式设计
- 多语言支持（英文/中文）
- 搜索功能
- 归档页面
- 标签和分类系统
- SEO 优化
- 社交链接集成

### Technical Stack
- Hugo v0.120+
- Tailwind CSS v4.0
- TypeScript v5.8+
- Vitest 测试框架
