---
title: "Hugo Paper 入门指南"
slug: "getting-started"
description: "了解如何为你的博客设置和自定义 Hugo Paper 主题"
date: 2024-11-11
lastmod: 2024-11-15
draft: false
featured: true
author: "Hugo Paper Team"
authorBio: "Hugo Paper 开发团队"
image: "/images/getting-started.jpg"
keywords:
  - hugo paper
  - hugo主题
  - 入门指南
  - 安装教程
  - 设置指南
  - 静态网站生成器
categories:
  - "Tutorial"
tags:
  - "hugo"
  - "setup"
  - "guide"
---

## 简介

Hugo Paper 是一个极简、快速、响应式的 Hugo 主题，专为博主和开发者设计。本指南将帮助你快速上手这个主题。

## 安装

### 步骤 1：下载 Hugo Paper

首先，你需要在系统上安装 Hugo。如果还没有安装 Hugo，请访问 [Hugo 官方网站](https://gohugo.io/installation/)。

### 步骤 2：创建新站点

```bash
hugo new site my-blog
cd my-blog
```

### 步骤 3：添加 Hugo Paper 主题

**方式一：使用 Hugo Modules（推荐）**

```bash
# 初始化 Hugo Modules
hugo mod init github.com/yourusername/my-blog

# 在 hugo.toml 中添加
echo '[module]
[[module.imports]]
  path = "github.com/ouraihub-hugo-themes/hugo-theme-paper"' >> hugo.toml

# 下载主题
hugo mod get
```

**方式二：使用 Git Submodule**

```bash
git init
git submodule add https://github.com/ouraihub-hugo-themes/hugo-paper.git themes/hugo-paper
echo 'theme = "hugo-paper"' >> hugo.toml
```

## 配置

Hugo Paper 使用分离的配置文件，更清晰易维护。

### 基础配置

编辑 `config/_default/hugo.toml`：

```toml
baseURL = "https://yourdomain.com/"
languageCode = "zh-cn"
title = "我的博客"
theme = "hugo-paper"  # 如果使用 git submodule
```

### 主题参数

编辑 `config/_default/params.toml`：

```toml
description = "我的个人博客"
showArchives = true
showBackButton = true
lightAndDarkMode = true  # 启用主题切换

# 社交链接
[[social]]
  name = "GitHub"
  href = "https://github.com/yourusername"
  linkTitle = "在 GitHub 上关注"
```

### 多语言配置

编辑 `config/_default/languages.toml`：

```toml
[zh]
  languageName = "中文"
  languageCode = "zh"
  weight = 1
  title = "我的博客"
  contentDir = "content/zh"
```

### 菜单配置

编辑 `config/_default/menus.zh.toml`：

```toml
[[main]]
  name = "首页"
  url = "/"
  weight = 1

[[main]]
  name = "文章"
  url = "/post/"
  weight = 2
```

## 创建内容

### 创建第一篇文章

```bash
# 使用内置脚本（推荐）
pnpm new-post "你好世界" zh

# 或使用 Hugo 命令
hugo new content/zh/post/hello-world.md
```

编辑生成的文件：

```markdown
---
title: "你好世界"
description: "我的第一篇博客文章"
date: 2024-11-11
draft: false
categories:
  - "欢迎"
tags:
  - "hello"
---

这是我的第一篇文章！
```

### 创建页面

```bash
hugo new content/zh/about.md
```

## 本地运行

```bash
# 开发服务器（带实时重载）
hugo server

# 生产构建
hugo
```

访问 `http://localhost:1313` 查看你的网站。

## 自定义

### 更改颜色

Hugo Paper 使用 CSS 变量实现主题系统。

**步骤 1：创建自定义 CSS 文件**

在你的项目中创建 `static/css/custom.css`：

```css
/* 自定义颜色 */
:root {
  --color-fill: 251, 254, 251;
  --color-accent: 0, 108, 172;
  --color-accent-2: 13, 148, 136;
}

[data-theme="dark"] {
  --color-fill: 33, 39, 55;
  --color-accent: 255, 107, 1;
}
```

**步骤 2：在配置中引用**

编辑 `config/_default/params.toml`：

```toml
# 自定义 CSS 文件
customCSS = ["css/custom.css"]
```

> 💡 提示：你可以添加多个自定义 CSS 文件，例如：
> ```toml
> customCSS = ["css/custom.css", "css/fonts.css"]
> ```

### 使用内置脚本

Hugo Paper 提供了便捷的脚本来创建文章：

```bash
# 交互式创建（推荐）
pnpm new-post

# 快速创建
pnpm quick-post "文章标题" zh
```

## 下一步

- 阅读[配置指南](/config/)
- 探索 [Hugo 文档](https://gohugo.io/documentation/)
- 自定义 [CSS 变量](/customization/)

祝你写作愉快！
