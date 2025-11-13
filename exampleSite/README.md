# Hugo Paper - Example Site

这是 Hugo Paper 主题的示例站点，展示如何正确配置和使用主题。

## 配置结构（最佳实践）

本示例站点采用 Hugo 推荐的配置目录结构：

```
exampleSite/
├── config/
│   └── _default/
│       ├── hugo.toml      # 核心配置
│       ├── params.toml    # 主题参数
│       └── menus.toml     # 菜单配置
├── content/
│   ├── en/                # 英文内容
│   └── zh/                # 中文内容
├── static/                # 静态资源
└── layouts/               # 自定义布局（可选）
```

## 快速开始

### 前提条件
- Hugo v0.120.0 或更高版本（Extended 版本）
- Node.js 18+ 和 pnpm（用于主题开发）

### 方法 1：直接使用 Hugo

```bash
# 进入 exampleSite 目录
cd hugo-theme-paper/exampleSite

# 启动开发服务器
hugo server

# 在浏览器中打开 http://localhost:1313
```

### 方法 2：使用主题开发环境

```bash
# 在主题根目录
cd hugo-theme-paper

# 安装依赖
pnpm install

# 启动完整开发环境（TypeScript + CSS + Hugo）
pnpm dev

# 在浏览器中打开 http://localhost:1313
```

## 配置说明

### 核心配置 (config/_default/hugo.toml)

包含 Hugo 的核心设置：
- 站点基本信息（baseURL、title、languageCode）
- 内容设置（summaryLength、hasCJKLanguage）
- 输出格式（HTML、RSS、JSON）
- Markdown 渲染配置
- 代码高亮配置

```toml
baseURL = "https://example.com/"
title = "Hugo Paper Example"
theme = "hugo-theme-paper"
```

### 主题参数 (config/_default/params.toml)

包含主题特定的参数：
- 主题设置（浅色/深色模式）
- 文章显示选项
- 代码高亮配置
- 社交链接
- SEO 设置

```toml
[theme]
  defaultTheme = "light"
  switchTheme = true

[post]
  showReadingTime = true
  showTableOfContents = true
```

### 菜单配置 (config/_default/menus.toml)

包含导航菜单配置：

```toml
[[main]]
  name = "Posts"
  url = "/post/"
  weight = 2
```

## 自定义配置

### 修改站点信息

编辑 `config/_default/hugo.toml`：
```toml
baseURL = "https://yourdomain.com/"
title = "Your Site Title"
```

### 修改主题设置

编辑 `config/_default/params.toml`：
```toml
[theme]
  defaultTheme = "dark"  # 改为深色模式

[post]
  showReadingTime = false  # 隐藏阅读时间
```

### 添加社交链接

编辑 `config/_default/params.toml`：
```toml
[[social]]
  name = "GitHub"
  href = "https://github.com/yourusername"
  linkTitle = "Follow on GitHub"
```

### 添加菜单项

编辑 `config/_default/menus.toml`：
```toml
[[main]]
  name = "Projects"
  url = "/projects/"
  weight = 5
```

## 环境特定配置

### 开发环境

创建 `config/development/hugo.toml`：
```toml
baseURL = "http://localhost:1313/"
```

运行：
```bash
hugo server --environment development
```

### 生产环境

创建 `config/production/hugo.toml`：
```toml
baseURL = "https://yourdomain.com/"
minify = true
```

构建：
```bash
hugo --environment production --minify
```

## 内容管理

### 创建新文章

```bash
hugo new post/my-first-post.md
```

### 文章 Front Matter

```yaml
---
title: "My First Post"
description: "This is a description"
date: 2024-01-01T10:00:00+08:00
draft: false
tags: ["hugo", "blog"]
categories: ["tutorials"]
author: "Your Name"
---

文章内容...
```

### 创建新页面

```bash
hugo new page/about.md
```

## 生产构建

### 构建静态站点

```bash
hugo --minify
```

生成的静态文件在 `public/` 目录。

### 构建选项

```bash
# 指定环境
hugo --environment production

# 启用压缩
hugo --minify

# 清理缓存
hugo --gc

# 完整构建命令
hugo --environment production --minify --gc
```

## 部署

### GitHub Pages

1. 创建 `.github/workflows/deploy.yml`
2. 配置 GitHub Actions
3. 推送代码自动部署

### Netlify

1. 连接 Git 仓库
2. 构建命令：`hugo --minify`
3. 发布目录：`public`
4. Hugo 版本：0.120.0

### Vercel

1. 连接 Git 仓库
2. 框架预设：Hugo
3. 构建命令：`hugo --minify`
4. 输出目录：`public`

## 主题开发

### 目录结构

```
hugo-theme-paper/
├── assets/              # 源资源文件
│   ├── css/            # CSS 源文件
│   └── ts/             # TypeScript 源文件
├── layouts/            # Hugo 模板
│   ├── _default/       # 默认布局
│   ├── partials/       # 部分模板
│   └── post/           # 文章布局
├── static/             # 静态文件
├── config/             # 主题配置
│   └── _default/       # 默认配置
└── exampleSite/        # 示例站点（本目录）
```

### 覆盖主题文件

要自定义主题，在 exampleSite 中创建同名文件：

```
exampleSite/
├── layouts/
│   └── partials/
│       └── footer.html  # 覆盖主题的 footer
└── static/
    └── logo.svg         # 自定义 logo
```

### 开发命令

```bash
# 类型检查
pnpm type-check

# 代码检查
pnpm lint:ts
pnpm lint:css

# 代码格式化
pnpm format

# 运行测试
pnpm test:run

# 构建资源
pnpm ts:build
pnpm css:build
```

## 配置参考

### 完整配置示例

参考主题的 `config/_default/` 目录：
- [hugo.toml](../config/_default/hugo.toml) - 核心配置
- [params.toml](../config/_default/params.toml) - 主题参数
- [menus.toml](../config/_default/menus.toml) - 菜单配置

### 配置文档

- [配置说明](../config/README.md)
- [快速参考](../config/QUICK_REFERENCE.md)
- [配置迁移指南](../CONFIGURATION_MIGRATION.md)

## 故障排除

### 页面不显示

1. 检查 `theme = "hugo-theme-paper"` 是否正确设置
2. 确保主题在正确的位置
3. 运行 `hugo server -D` 包含草稿页面

### 样式不加载

1. 检查 CSS 文件是否编译（`pnpm css:build`）
2. 清除浏览器缓存
3. 检查 `public/css/` 目录是否有 CSS 文件

### 配置不生效

1. 检查配置文件语法是否正确
2. 运行 `hugo config` 查看最终配置
3. 检查配置文件位置是否正确

### 构建错误

1. 检查 Hugo 版本（需要 0.120.0+）
2. 清除缓存：`hugo --gc`
3. 删除 `public/` 和 `resources/` 目录重新构建

## 更多资源

### 文档
- [主题 README](../README.md)
- [配置清理总结](../CONFIGURATION_CLEANUP_SUMMARY.md)
- [多语言实现](../MULTILINGUAL_IMPLEMENTATION.md)

### 社区
- [GitHub Issues](https://github.com/ouraihub-hugo-themes/hugo-theme-paper/issues)
- [Hugo 官方文档](https://gohugo.io/documentation/)
- [Hugo 论坛](https://discourse.gohugo.io/)

## 许可

MIT License - 详见 [LICENSE](../LICENSE)

---

**需要帮助？** 提交 Issue: https://github.com/ouraihub-hugo-themes/hugo-theme-paper/issues
