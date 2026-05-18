# Hugo Paper 配置指南

## 配置文件结构

本主题采用 Hugo 推荐的配置目录结构：

```
config/
└── _default/
    ├── hugo.toml        # 核心 Hugo 配置
    ├── params.toml      # 主题参数配置
    ├── languages.toml   # 多语言配置
    ├── menus.en.toml    # 英文菜单
    └── menus.zh.toml    # 中文菜单
```

## 快速开始

### 1. 站点基本信息

```toml
# config/_default/hugo.toml
baseURL = "https://example.com/"
title = "My Blog"
languageCode = "en-us"
defaultContentLanguage = "en"
```

### 2. 分页设置

```toml
# config/_default/hugo.toml
[pagination]
  pagerSize = 10  # 每页显示的文章数量
```

### 3. 主题切换

```toml
# config/_default/params.toml
[theme]
  defaultTheme = "light"  # light, dark, or auto
  switchTheme = true      # 显示主题切换按钮
```

### 4. 社交链接

```toml
# config/_default/params.toml
[[social]]
  name = "GitHub"
  href = "https://github.com/username"
  linkTitle = "Follow on GitHub"
```

### 5. 菜单配置

```toml
# config/_default/menus.en.toml
[[main]]
  identifier = "posts"
  name = "Posts"
  pageRef = "/post/"
  weight = 1
```

## 配置文件说明

### hugo.toml - 核心配置

- 站点基本信息：baseURL, title, languageCode
- 内容设置：contentDir, summaryLength, hasCJKLanguage
- 功能开关：enableEmoji, enableRobotsTXT
- 分页设置：pagination.pagerSize
- 分类系统：taxonomies
- 输出格式：outputs
- Markdown 配置：markup.goldmark
- 代码高亮：markup.highlight

### params.toml - 主题参数

- 站点信息：description, author, keywords
- 主题设置：theme.defaultTheme, theme.switchTheme
- 显示选项：showReadingTime, showTableOfContents
- 代码高亮：highlight.style, highlight.styleDark
- 搜索功能：search.enabled
- 评论系统：comments (Giscus)
- 编辑链接：editPost
- SEO 设置：seo
- 社交链接：social

### languages.toml - 多语言

```toml
[en]
  languageName = "English"
  weight = 1
  title = "Hugo Paper"
  contentDir = "content/en"

[zh]
  languageName = "中文"
  weight = 2
  title = "Hugo Paper"
  contentDir = "content/zh"
```

## 常用配置示例

### 代码高亮

```toml
# config/_default/hugo.toml
[markup.highlight]
  noClasses = false
  codeFences = true
  style = "github"

# config/_default/params.toml
[highlight]
  style = "github"
  styleDark = "monokai"
```

### 文章显示选项

```toml
# config/_default/params.toml
[post]
  showReadingTime = true
  showTableOfContents = true
  showBreadcrumbs = true
  showCopyCodeButton = true
```

### 评论系统

```toml
# config/_default/params.toml
[comments]
  enabled = true
  provider = "giscus"

[comments.giscus]
  repo = "username/repo"
  repoId = "R_xxx"
  category = "Announcements"
  categoryId = "DIC_xxx"
```

## 环境配置

### 开发环境

创建 `config/development/hugo.toml`：
```toml
baseURL = "http://localhost:1313/"
```

运行：`hugo server --environment development`

### 生产环境

创建 `config/production/hugo.toml`：
```toml
baseURL = "https://example.com/"
```

构建：`hugo --environment production --minify`

## 配置优先级

```
命令行参数 > 环境配置 > 默认配置
```

## 常用命令

```bash
# 查看最终配置
hugo config

# 开发服务器
hugo server -D

# 生产构建
hugo --minify

# 指定环境
hugo --environment production

# 清理构建目录
hugo --cleanDestinationDir
```

## 最佳实践

1. 使用配置目录 `config/_default/` 而不是单个配置文件
2. 将不同类型的配置放在不同文件中
3. 为生产和开发环境创建不同的配置
4. 在配置文件中添加清晰的注释
5. 使用语言特定的菜单文件（menus.en.toml, menus.zh.toml）

## 用户自定义配置

用户可以在站点根目录创建 `config/_default/` 目录来覆盖主题的默认配置：

```
my-site/
├── config/
│   ├── _default/
│   │   ├── hugo.toml
│   │   └── params.toml
│   └── production/
│       └── hugo.toml
├── content/
└── themes/
    └── hugo-theme-paper/
```

## 常见问题

**Q: 为什么我的配置没有生效？**
A: 检查配置优先级。主题根目录的配置会覆盖 exampleSite 的配置。

**Q: 如何修改每页显示的文章数量？**
A: 在 `hugo.toml` 中设置 `[pagination] pagerSize = 10`

**Q: 如何禁用某个功能？**
A: 在 `params.toml` 中设置对应的 `enabled = false`

## 参考文档

- [Hugo Configuration](https://gohugo.io/getting-started/configuration/)
- [Hugo Configuration Directory](https://gohugo.io/getting-started/configuration/#configuration-directory)
- [Hugo Multilingual](https://gohugo.io/content-management/multilingual/)
- [Hugo Menus](https://gohugo.io/content-management/menus/)
