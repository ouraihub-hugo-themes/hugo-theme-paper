# AstroPaper 配置兼容性

本文档说明 Hugo Paper 如何实现 AstroPaper 的配置选项。

## 📊 配置对比

### ✅ 完全支持的功能

| AstroPaper 配置 | Hugo Paper 配置 | 配置文件 | 说明 |
|----------------|----------------|---------|------|
| `SITE.website` | `baseURL` | `hugo.toml` | 网站部署 URL |
| `SITE.author` | `params.author` | `params.toml` | 作者名称 |
| `SITE.profile` | `params.profile` | `params.toml` | 个人网站 URL |
| `SITE.desc` | `params.description` | `params.toml` | 网站描述 |
| `SITE.title` | `title` | `hugo.toml` | 网站标题 |
| `SITE.ogImage` | `params.ogImage` | `params.toml` | 默认 OG 图片 |
| `SITE.lightAndDarkMode` | `params.lightAndDarkMode` | `params.toml` | 主题切换 |
| `SITE.postPerIndex` | `params.postPerIndex` | `params.toml` | 首页文章数量 |
| `SITE.postPerPage` | `pagination.pagerSize` | `hugo.toml` | 每页文章数量 |
| `SITE.showArchives` | `params.showArchives` | `params.toml` | 显示归档页面 |
| `SITE.showBackButton` | `params.showBackButton` | `params.toml` | 显示返回按钮 |
| `SITE.editPost` | `params.editPost` | `params.toml` | 编辑文章链接 |
| `SITE.dir` | `params.direction` | `params.toml` | 文本方向 |
| `SITE.lang` | `languageCode` | `hugo.toml` | 语言代码 |
| `SITE.timezone` | `params.timezone` | `params.toml` | 时区设置 |
| `SOCIALS` | `params.social` | `params.toml` | 社交链接 |
| `SHARE_LINKS` | `params.shareLinks` | `params.toml` | 分享链接 |

### ⚠️ 部分支持的功能

| AstroPaper 配置 | Hugo Paper 实现 | 说明 |
|----------------|----------------|------|
| `SITE.scheduledPostMargin` | Hugo 内置 | Hugo 使用 `publishDate` 和 `expiryDate` 控制 |
| Logo 配置 | 模板级别 | 通过修改 `header.html` 实现 |
| 布局宽度 | CSS 变量 | 通过 `params.maxWidth` 配置 |

### ❌ 不支持的功能

| AstroPaper 配置 | 说明 | 原因 |
|----------------|------|------|
| `SITE.dynamicOgImage` | 动态 OG 图片生成 | 需要额外的图片生成服务 |

## 📝 配置示例

### AstroPaper 配置 (config.ts)

```typescript
export const SITE = {
  website: "https://astro-paper.pages.dev/",
  author: "Sat Naing",
  profile: "https://satnaing.dev/",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "AstroPaper",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dir: "ltr",
  lang: "en",
  timezone: "Asia/Bangkok",
} as const;
```

### Hugo Paper 等效配置

**config/_default/hugo.toml:**
```toml
baseURL = "https://astro-paper.pages.dev/"
title = "AstroPaper"
languageCode = "en"

[pagination]
  pagerSize = 4
```

**config/_default/params.toml:**
```toml
author = "Sat Naing"
profile = "https://satnaing.dev/"
description = "A minimal, responsive and SEO-friendly Astro blog theme."
ogImage = "astropaper-og.jpg"
lightAndDarkMode = true
postPerIndex = 4
showArchives = true
showBackButton = true
direction = "ltr"
timezone = "Asia/Bangkok"

[editPost]
  enabled = true
  text = "Suggest Changes"
  url = "https://github.com/satnaing/astro-paper/edit/main/"
```

## 🔄 迁移指南

从 AstroPaper 迁移到 Hugo Paper：

1. **复制基本配置**
   - `SITE.website` → `baseURL` (hugo.toml)
   - `SITE.title` → `title` (hugo.toml)
   - `SITE.author` → `params.author` (params.toml)

2. **复制显示设置**
   - `SITE.postPerIndex` → `params.postPerIndex`
   - `SITE.postPerPage` → `pagination.pagerSize`
   - `SITE.showArchives` → `params.showArchives`

3. **复制社交链接**
   - `SOCIALS` 数组 → `params.social` 数组
   - `SHARE_LINKS` 数组 → `params.shareLinks` 数组

4. **复制编辑设置**
   - `SITE.editPost` → `params.editPost`

## 📚 参考文档

- [AstroPaper 配置文档](https://github.com/satnaing/astro-paper#-configuration)
- [Hugo 配置文档](https://gohugo.io/getting-started/configuration/)
- [Hugo Paper 配置说明](./README.md)
