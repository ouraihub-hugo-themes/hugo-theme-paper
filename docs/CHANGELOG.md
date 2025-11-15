# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

#### 默认语言菜单链接包含错误语言前缀 (2025-01-15)

**问题描述：**
- About 等页面的导航菜单与首页显示不一致
- About 页面显示错误的站点标题 "Hugo Paper - Theme Development" 而不是 "HugoPaper"
- 菜单链接包含 `/en/` 前缀（如 `/en/post/`、`/en/about/`），但实际页面 URL 没有前缀（如 `/post/`、`/about/`）
- 导致菜单链接与实际页面 URL 不匹配

**根本原因：**
Hugo 默认不为**默认语言**（`defaultContentLanguage`）添加 URL 语言前缀。

在多语言配置中：
- 默认语言（英文）的页面 URL：`/about/`、`/post/` (无 `/en/` 前缀)
- 非默认语言（中文）的页面 URL：`/zh/about/`、`/zh/post/` (有 `/zh/` 前缀)

但菜单配置中错误地为英文菜单添加了 `/en/` 前缀：
```toml
[[languages.en.menus.main]]
name = "Posts"
url = "/en/post/"  # ❌ 错误：实际 URL 是 /post/
```

这导致：
1. 菜单链接指向不存在的 `/en/post/` 路径
2. Hugo 无法正确识别当前页面的语言上下文
3. 页面显示错误的站点标题和配置

**解决方案：**
1. **修改英文菜单配置**，移除 `/en/` 前缀：
   ```toml
   [[languages.en.menus.main]]
   name = "Posts"
   url = "/post/"  # ✅ 正确：匹配实际 URL
   
   [[languages.en.menus.main]]
   name = "About"
   url = "/about/"  # ✅ 正确：匹配实际 URL
   ```

2. **使用 `relLangURL` 函数**处理动态链接（如 archives）：
   ```html
   <!-- ❌ 错误：硬编码语言前缀 -->
   <a href="{{ printf "/%s/archives/" .Site.Language.Lang }}">
   
   <!-- ✅ 正确：自动处理语言前缀 -->
   <a href="{{ "/archives/" | relLangURL }}">
   ```

3. **优化 header.html 中的上下文引用**：
   ```html
   <!-- 使用 $.Site 而不是 .Site 确保获取正确的站点上下文 -->
   {{- $currentLang := $.Site.Language.Lang -}}
   {{- $menu := index $.Site.Menus "main" -}}
   ```

**技术细节：**
- Hugo 的 `defaultContentLanguage` 配置决定了哪个语言不添加 URL 前缀
- `relLangURL` 函数会根据当前语言自动添加或不添加前缀
- 菜单 URL 应该与实际页面 URL 完全匹配，否则会导致语言上下文识别错误

**影响文件：**
- `hugo.toml` - 英文菜单配置
- `layouts/partials/header.html` - 导航菜单模板

**测试结果：**
- ✅ About 页面导航菜单与首页一致
- ✅ 站点标题在所有页面都显示 "HugoPaper"
- ✅ 英文菜单链接正确（无 `/en/` 前缀）
- ✅ 中文菜单链接正确（有 `/zh/` 前缀）
- ✅ 语言切换功能正常工作
- ✅ Archives 链接自动适配当前语言

**相关文档：**
- [Hugo URL 管理](https://gohugo.io/content-management/urls/)
- [Hugo 多语言配置](https://gohugo.io/content-management/multilingual/)

**相关提交：**
- `cc74960` - fix: 修复默认语言菜单链接包含错误语言前缀的问题

---

#### 多语言配置导致中文首页不显示文章列表 (2025-01-15)

**问题描述：**
- 中文首页（`/zh/`）无法显示 Featured 和 Recent Posts 部分
- 英文首页（`/`）显示正常
- 调试信息显示：`Lang=zh, RegularPages=0, PostPages=0, Featured=0, Recent=0`

**根本原因：**
使用了按目录翻译的方式（`content/en/` 和 `content/zh/`），但 Hugo 配置中没有为每个语言指定 `contentDir`。

在多语言环境下，如果不指定 `contentDir`：
- Hugo 无法正确识别每个语言的内容目录
- `.Site.RegularPages` 在非默认语言中返回空集合
- 导致页面无法获取文章列表

**解决方案：**
在 `hugo.toml` 中为每个语言添加 `contentDir` 配置：

```toml
[languages.en]
languageName = "English"
languageCode = "en"
weight = 1
title = "HugoPaper"
contentDir = "exampleSite/content/en"  # 添加此行

[languages.zh]
languageName = "中文"
languageCode = "zh"
weight = 2
title = "HugoPaper"
contentDir = "exampleSite/content/zh"  # 添加此行
```

同时移除全局的 `contentDir` 配置（如果存在）。

**技术细节：**
- Hugo 支持两种多语言翻译方式：
  1. **按文件名翻译**：`about.en.md`、`about.zh.md`（使用单一内容目录）
  2. **按目录翻译**：`content/en/about.md`、`content/zh/about.md`（使用独立内容目录）
- 当使用按目录翻译时，**必须**为每个语言配置 `contentDir`
- 否则 Hugo 无法正确解析内容目录结构，导致 `.Site.RegularPages` 返回错误结果

**配置要求：**
- ✅ 使用按目录翻译时，每个语言必须配置 `contentDir`
- ✅ 内容目录路径必须正确（相对于项目根目录）
- ✅ 修改 `contentDir` 后需要重启 Hugo 服务器才能生效

**影响文件：**
- `hugo.toml` - 语言配置
- `layouts/index.html` - 首页模板
- `layouts/archives/list.html` - 归档页面模板

**测试结果：**
- ✅ 中文首页正确显示 Featured Posts（3 篇）
- ✅ 中文首页正确显示 Recent Posts（4 篇）
- ✅ 英文首页保持正常显示
- ✅ `.Site.RegularPages` 正确返回当前语言的页面
- ✅ 两个语言的首页布局完全一致

**相关文档：**
- [Hugo 多语言模式文档](https://gohugo.io/content-management/multilingual/)
- [Hugo 按目录翻译配置](https://gohugo.io/content-management/multilingual/#translation-by-content-directory)

**相关提交：**
- 待提交 - fix: 修复多语言配置导致中文首页不显示文章列表的问题

---

#### 导航菜单链接无效和多语言菜单显示错误 (2025-01-15)

**问题描述：**
1. 首页导航菜单中 "Posts" 和 "About" 链接显示波浪线下划线（浏览器警告）
2. 点击这些链接跳转到首页 `/` 而不是正确的页面
3. 中文页面导航菜单显示英文文本（"Posts"、"Tags"、"About"）而不是中文（"文章"、"标签"、"关于"）

**根本原因：**
1. **菜单配置使用了 `pageRef` 而不是 `url`**
   - 配置：`pageRef = "/post"` 和 `pageRef = "/about"`
   - 在多语言环境下，Hugo 无法找到这些页面（实际路径是 `/en/post` 和 `/zh/post`）
   - 当 `pageRef` 无法解析时，Hugo 返回默认的 `/` 路径
   - 浏览器检测到链接指向当前页面，显示波浪线警告

2. **菜单配置格式错误**
   - 使用了 `[languages.xx.menu.main]` 而不是 `[languages.xx.menus.main]`
   - 虽然 `menu` 是 `menus` 的别名，但在某些情况下可能导致多语言菜单无法正确加载

**解决方案：**

1. **修复菜单链接**：改用 `url` 并使用完整的语言路径
   ```toml
   # 英文菜单
   [[languages.en.menus.main]]
   name = "Posts"
   url = "/en/post/"
   weight = 1
   
   # 中文菜单
   [[languages.zh.menus.main]]
   name = "文章"
   url = "/zh/post/"
   weight = 1
   ```

2. **修复多语言菜单显示**：
   - 确保菜单配置在正确的语言键下
   - 为每个语言单独配置菜单项
   - 使用 `url` 而不是 `pageRef` 以避免路径解析问题

**技术细节：**
- `pageRef` 适用于单语言站点或使用文件名语言后缀的多语言配置
- 对于使用内容目录分离的多语言配置（`content/en/` 和 `content/zh/`），应使用 `url` 并指定完整路径
- Hugo 的 `.Site.Menus.main` 会自动返回当前语言的菜单，前提是配置正确

**影响文件：**
- `hugo.toml` - 菜单配置
- `layouts/partials/header.html` - 菜单渲染模板

**测试结果：**
- ✅ 首页导航链接正常，无波浪线警告
- ✅ Posts 链接正确跳转到 `/en/post/`
- ✅ About 链接正确跳转到 `/en/about/`
- ✅ 中文页面导航菜单正确显示中文文本
- ✅ 中文菜单链接正确跳转到 `/zh/post/`、`/zh/about/` 等

**相关提交：**
- 待提交 - fix: 修复导航菜单链接无效和多语言菜单显示问题

---

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
