# Hugo Paper 配置指南

本文档详细说明 Hugo Paper 主题的所有配置选项。

## 📚 目录

1. [快速开始](#快速开始)
2. [主配置 (hugo.toml)](#主配置)
3. [参数配置 (params.toml)](#参数配置)
4. [菜单配置 (menus.toml)](#菜单配置)
5. [Markdown 配置 (markup.toml)](#markdown-配置)
6. [高级配置](#高级配置)

---

## 快速开始

### 前置环境

```bash
# 安装 pnpm (如果未安装)
npm install -g pnpm

# 或使用 corepack (Node 16.13+)
corepack enable pnpm
```

### 最小化配置

创建 `config/_default/hugo.toml`:

```toml
baseURL = "https://example.com/"
languageCode = "en-us"
title = "Hugo Paper"
theme = "hugo-paper"

defaultContentLanguage = "en"

[outputs]
  home = ["HTML", "RSS", "JSON"]
  section = ["HTML", "RSS"]

[module]
  replacements = ""
```

然后在 `config/_default/params.toml` 中配置主题参数:

```toml
description = "A minimal, responsive and SEO-friendly Hugo blog theme"
author = "Your Name"

[sidebar]
  subtitle = "Welcome to Hugo Paper"
  
  [sidebar.avatar]
    enabled = true
    local = true
    src = "img/avatar.png"
```

### 初始化项目

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器
pnpm dev

# 3. 访问 http://localhost:1313
```

---

## 主配置

### 配置文件: `config/_default/hugo.toml`

#### 基础信息

```toml
# 网站基础 URL (必需)
baseURL = "https://example.com/"

# 语言代码 (必需)
languageCode = "en-us"

# 网站标题 (必需)
title = "Hugo Paper"

# 网站描述 (SEO)
# 可选,如未设置则使用 params.description
description = "A minimal, responsive and SEO-friendly Hugo blog theme"

# 主题名称
theme = "hugo-paper"

# 默认内容语言
defaultContentLanguage = "en"
```

#### 构建配置

```toml
# 是否生成机器人 robots.txt
disableRobotsTxt = false

# 页面摘要中的单词数
summaryLength = 200

# 是否在分页中包含摘要
enableEmoji = true

# 代码块行号
# (在 markup.toml 中配置)

# 是否启用 Git 信息 (作者、提交等)
enableGitInfo = false

# 是否为首页禁用 404
disableKinds = []
# 可选: 禁用某些类型
# disableKinds = ["taxonomy", "term"]
```

#### 输出格式

```toml
[outputs]
  # 首页输出格式
  home = ["HTML", "RSS", "JSON"]
  
  # 分类页输出格式
  section = ["HTML", "RSS"]
  
  # 分类术语页 (如标签页)
  taxonomy = ["HTML", "RSS"]
  
  # 分类术语列表页
  term = ["HTML", "RSS"]
```

#### 菜单与导航

```toml
[params]
  # 主菜单标签
  mainSection = ["posts"]
  
  # 是否显示归档页
  showArchives = true
```

#### 媒体类型

```toml
[mediaTypes]
  # JSON Feed
  [mediaTypes."application/json"]
    suffixes = ["json"]

# 输出格式定义
[outputFormats]
  [outputFormats.JSON]
    mediaType = "application/json"
    baseName = "feed"
    isPlainText = false
    notAlternative = true
```

#### 相关内容配置

```toml
[related]
  # 相关内容查询数
  threshold = 80
  
  [[related.indices]]
    name = "tags"
    weight = 100
    
  [[related.indices]]
    name = "categories"
    weight = 50
```

---

## 参数配置

### 配置文件: `config/_default/params.toml`

#### 网站元数据

```toml
# 网站描述
description = "A minimal, responsive and SEO-friendly Hugo blog theme"

# 网站作者
author = "Your Name"

# 作者个人主页
profile = "https://example.com/about"

# 邮箱 (可选)
email = "your.email@example.com"

# 网站 OG 图片
ogImage = "og.png"

# 是否启用浅色/深色模式
lightAndDarkMode = true

# 目录方向 ("ltr" | "rtl" | "auto")
dir = "ltr"

# HTML lang 属性
lang = "en"

# 时区 (IANA 格式)
# https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
timezone = "UTC"
```

#### 首页配置

```toml
# 首页显示文章数
postPerIndex = 4

# 每页显示文章数
postPerPage = 10

# 是否在首页显示最新文章
showRecentPostsOnHomePage = true

# 是否在首页显示精选文章
showFeaturedPostsOnHomePage = true
```

#### 功能开关

```toml
# 是否显示返回按钮 (文章详情页)
showBackButton = true

# 是否显示编辑链接
[editPost]
  enabled = true
  text = "Edit page"
  # 编辑链接 URL (GitHub 示例)
  url = "https://github.com/yourusername/your-repo/edit/main/content"

# 是否显示归档页
showArchives = true

# 是否生成动态 OG 图片 (需要额外依赖)
dynamicOgImage = false
```

#### 侧边栏配置

```toml
[sidebar]
  # 副标题/简介
  subtitle = "Welcome to Hugo Paper"
  
  # emoji (可选)
  emoji = "🎨"
  
  # 头像配置
  [sidebar.avatar]
    enabled = true
    # 是否使用本地图片
    local = true
    # 本地图片路径 (相对于 static/)
    src = "img/avatar.png"
    # 或使用远程 URL
    # src = "https://example.com/avatar.png"
    # local = false
```

#### 社交媒体配置

```toml
[socials]
  # 每个社交媒体配置
  # 格式: key = "URL"
  
  github = "https://github.com/yourusername"
  twitter = "https://twitter.com/yourusername"
  linkedin = "https://linkedin.com/in/yourusername"
  facebook = "https://facebook.com/yourusername"
  instagram = "https://instagram.com/yourusername"
  email = "mailto:your.email@example.com"
  rss = "/rss.xml"
```

#### 页脚配置

```toml
[footer]
  # 网站起始年份 (用于生成版权年份)
  since = 2020
  
  # 自定义页脚文本 (支持 HTML)
  customText = "Made with ❤️ by Your Name"
```

#### 代码配置

```toml
[article]
  # 是否显示代码块的文件名
  showCodeBlockFname = true
  
  # 是否显示代码块的行号
  showLineNumbers = false
  
  # 是否显示阅读时间
  readingTime = true
  
  # 是否显示字数统计
  wordCount = false
  
  # 是否启用数学公式 (KaTeX)
  math = false
  
  # 标题锚点样式
  headingAnchor = true
  
  # 目录 (TOC) 配置
  [article.toc]
    enabled = true
    # 最大标题级别
    maxDepth = 3
  
  # 文章许可证 (可选)
  [article.license]
    enabled = true
    default = "Licensed under CC BY-NC-SA 4.0"
```

#### 评论系统配置 (可选)

```toml
[comments]
  enabled = false
  provider = "disqus"  # or "giscus", "utterances", etc.
  
  [comments.disqus]
    shortname = "your-disqus-shortname"
  
  [comments.giscus]
    repo = "yourusername/repo"
    repoID = "your-repo-id"
    category = "Announcements"
    categoryID = "your-category-id"
    mapping = "pathname"
    lightTheme = "light"
    darkTheme = "dark"
    reactionsEnabled = 1
    emitMetadata = 0
```

#### SEO 配置

```toml
# 谷歌网站验证 (可选)
googleSiteVerification = ""

# Open Graph 配置
[opengraph]
  enabled = true
  
  # Twitter 配置
  [opengraph.twitter]
    site = "@yourtwitterhandle"
    card = "summary_large_image"

# 默认 OG 图片 (当文章未指定时使用)
[defaultImage]
  [defaultImage.opengraph]
    enabled = true
    local = true
    src = "og-default.png"
```

#### 图片处理配置

```toml
# 封面图处理
[imageProcessing.cover]
  enabled = true
  # 缩略图尺寸
  # 格式: "width x height"
  thumbSize = "300x200"

# 内容图处理
[imageProcessing.content]
  enabled = true
  # 是否生成响应式图片
  responsive = true
```

#### 搜索配置

```toml
[search]
  enabled = true
  provider = "pagefind"  # 目前仅支持 pagefind
  
  [search.pagefind]
    # Pagefind 索引目录 (构建后生成)
    indexDir = "/pagefind"
    # UI 语言
    language = "en"
```

#### 颜色方案配置

```toml
[colorScheme]
  # 是否允许用户切换主题
  toggle = true
  
  # 默认主题 ("light" | "dark" | "auto")
  default = "auto"
```

---

## 菜单配置

### 配置文件: `config/_default/menus.toml`

#### 主菜单配置

```toml
# 主菜单项
[[main]]
  identifier = "home"
  name = "Home"
  url = "/"
  weight = -100  # 权重越小越靠前

[[main]]
  identifier = "posts"
  name = "Posts"
  url = "/posts/"
  weight = -90

[[main]]
  identifier = "tags"
  name = "Tags"
  url = "/tags/"
  weight = -80

[[main]]
  identifier = "archives"
  name = "Archives"
  url = "/archives/"
  weight = -70

[[main]]
  identifier = "about"
  name = "About"
  url = "/about/"
  weight = -60

# 可以添加自定义菜单项
[[main]]
  identifier = "github"
  name = "GitHub"
  url = "https://github.com/yourusername"
  weight = -50
  # target = "_blank" (在新标签页打开)
```

#### 菜单项参数

```toml
[[main]]
  identifier = "unique-id"
  # 菜单项显示名称
  name = "Display Name"
  # 菜单项链接 URL
  url = "/path/"
  # 权重 (用于排序,低值优先)
  weight = 10
  # 标题属性 (悬停提示)
  title = "Hover Tooltip"
  # 是否在新标签页打开
  target = "_blank"
  # 关键属性 (可选)
  rel = "noopener noreferrer"
  
  # 子菜单 (可选)
  [[main.children]]
    identifier = "submenu"
    name = "Submenu Item"
    url = "/submenu/"
    weight = 1
```

#### 多级菜单示例

```toml
[[main]]
  identifier = "docs"
  name = "Documentation"
  weight = 10
  
  [[main.children]]
    identifier = "setup"
    name = "Setup"
    url = "/docs/setup/"
    weight = 1
  
  [[main.children]]
    identifier = "usage"
    name = "Usage"
    url = "/docs/usage/"
    weight = 2
  
  [[main.children]]
    identifier = "faq"
    name = "FAQ"
    url = "/docs/faq/"
    weight = 3
```

---

## Markdown 配置

### 配置文件: `config/_default/markup.toml`

#### Goldmark 配置

```toml
[markup]
  [markup.goldmark]
    # 是否渲染原始 HTML
    [markup.goldmark.renderer]
      unsafe = true  # 允许原始 HTML (对于嵌入内容)
      hardWraps = false
      xhtml = false
    
    # 扩展配置
    [markup.goldmark.extensions]
      typographer = true  # 智能标点
      footnote = true     # 脚注支持
      strikethrough = true # 删除线支持
      table = true        # 表格支持
      taskList = true     # 任务列表支持
    
    # 列表配置
    [markup.goldmark.list]
      style = "dash"  # 或 "plus", "star", "mixed"
    
    # 代码块配置
    [markup.goldmark.codeBlocks]
      lineNos = false         # 显示行号
      lineNumbersInTable = false
      noClasses = true        # 使用内联样式 (false 使用 CSS 类)
      startingLineNumber = 1
      style = "monokai"       # Chroma 样式
      tabWidth = 4
      wrapLongLines = false
```

#### 高亮配置

```toml
[markup.highlight]
  # Chroma 样式名
  # 可用: monokai, dracula, github, solarized-dark, solarized-light, etc.
  style = "dracula"
  
  # 是否显示行号
  lineNos = false
  
  # 行号起始号
  lineNumbersInTable = false
  
  # 是否在表格中显示行号 (false 使用 span)
  noClasses = false  # false 使用外部 CSS 类
  
  # Tab 宽度
  tabWidth = 4
  
  # 是否换行
  wrapLongLines = false
  
  # guessSyntax = false
  # hl_lines = []
  # hl_inline = false
```

#### 目录 (TOC) 配置

```toml
[markup.tableOfContents]
  # 起始标题级别
  startLevel = 2
  
  # 结束标题级别
  endLevel = 3
  
  # 是否保留 HTML 标签
  ordered = false
```

---

## 高级配置

### 构建优化配置

#### 缓存配置

```toml
[caches]
  [caches.getcsv]
    dir = ":cacheDir/:project"
    maxAge = "60s"
  
  [caches.getjson]
    dir = ":cacheDir/:project"
    maxAge = "60s"
  
  [caches.images]
    dir = ":cacheDir/:project"
    maxAge = "60s"
  
  [caches.modules]
    dir = ":cacheDir/modules"
    maxAge = "-1"
```

#### 资源路径配置

```toml
[[module.mounts]]
  source = "content"
  target = "content"

[[module.mounts]]
  source = "static"
  target = "static"

[[module.mounts]]
  source = "assets"
  target = "assets"

[[module.mounts]]
  source = "layouts"
  target = "layouts"

[[module.mounts]]
  source = "data"
  target = "data"

[[module.mounts]]
  source = "i18n"
  target = "i18n"

[[module.mounts]]
  source = "archetypes"
  target = "archetypes"
```

### 分类法 (Taxonomies) 配置

```toml
[taxonomies]
  # 格式: singular = "plural"
  category = "categories"
  tag = "tags"
  author = "authors"
  series = "series"
```

### 永久链接配置

```toml
[permalinks]
  # 页面的 URL 结构
  page = "/:slug/"
  posts = "/:year/:month/:day/:slug/"
  categories = "/categories/:slug/"
  tags = "/tags/:slug/"
```

### 输出配置

```toml
[outputs]
  home = ["HTML", "RSS", "JSON"]
  section = ["HTML", "RSS"]
  taxonomy = ["HTML", "RSS"]
  term = ["HTML", "RSS"]

[outputFormats]
  [outputFormats.SearchIndex]
    baseName = "index"
    mediaType = "application/json"
    isHTML = false
```

---

## 环境特定配置

### 开发环境 (`config/development/hugo.toml`)

```toml
# 开发环境配置
[outputs]
  home = ["HTML", "RSS", "JSON"]
```

### 生产环境 (`config/production/hugo.toml`)

```toml
# 生产环境配置
# 启用某些仅在生产环境的功能
[outputs]
  home = ["HTML", "RSS", "JSON"]
```

---

## 配置验证

### 检查配置是否正确

```bash
# 验证配置
hugo config

# 查看合并后的配置
hugo config mounts

# 构建并检查错误
hugo --debug
```

---

## 常见配置场景

### 场景 1: 简单博客

```toml
# hugo.toml
baseURL = "https://myblog.com/"
languageCode = "en-us"
title = "My Blog"
theme = "hugo-paper"

# params.toml
description = "My personal blog"
author = "Your Name"

[sidebar]
  subtitle = "Welcome to my blog"
  [sidebar.avatar]
    enabled = true
    local = true
    src = "img/avatar.png"

[socials]
  github = "https://github.com/yourusername"
  twitter = "https://twitter.com/yourusername"
```

### 场景 2: 技术文档站点

```toml
# hugo.toml
baseURL = "https://docs.example.com/"
languageCode = "en-us"
title = "Documentation"
theme = "hugo-paper"

[params]
  mainSection = ["docs"]
  showArchives = false

# 禁用某些页面类型
# disableKinds = ["taxonomy"]
```

### 场景 3: 多作者博客

```toml
# hugo.toml
[taxonomies]
  tag = "tags"
  author = "authors"

# params.toml
[article]
  showAuthor = true

[comments]
  enabled = true
  provider = "giscus"
```

---

## 配置检查清单

- [ ] 设置 `baseURL` (必需)
- [ ] 设置 `title` (网站标题)
- [ ] 设置 `languageCode` (语言代码)
- [ ] 配置 `author` (作者名称)
- [ ] 配置社交媒体链接
- [ ] 上传头像 (`static/img/avatar.png`)
- [ ] 配置菜单项
- [ ] 测试本地构建 (`hugo server`)
- [ ] 测试生产构建 (`hugo`)
- [ ] 验证 Lighthouse 评分

---

**最后更新**: 2024-11-11  
**版本**: 1.0.0
