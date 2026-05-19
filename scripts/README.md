# 📝 创建新文章脚本

两个 TypeScript 脚本帮助你快速创建包含完整 SEO 优化 frontmatter 的文章。

## 🚀 命令速查

```bash
# 交互式创建（推荐）- 完整 SEO 字段
pnpm new-post
pnpm new-post "Getting Started"
pnpm new-post "Hugo 入门" zh

# 快速创建 - 使用默认值
pnpm quick-post "Article Title"
pnpm quick-post "文章标题" zh
```

## ✅ SEO 检查清单

- [ ] **标题** - 50-60字符，包含主要关键词
- [ ] **描述** - 150-160字符，吸引人的摘要
- [ ] **关键词** - 5-7个相关关键词
- [ ] **分类** - 1-2个主要分类
- [ ] **标签** - 3-5个相关标签
- [ ] **草稿** - 发布前改为 `false`

## 📋 Frontmatter 模板

```yaml
---
title: "文章标题"
slug: "article-slug"
description: "文章描述（150-160字符）"
date: 2024-11-15T10:00:00Z
lastmod: 2024-11-15T10:00:00Z
author: "作者名"
keywords:
  - 关键词1
  - 关键词2
categories:
  - 分类
tags:
  - 标签1
  - 标签2
featured: false
draft: true
---
```

---

## 📄 两种方式

**交互式创建（推荐）** - `new-post.ts`
- 逐步引导，完整 SEO 字段，输入验证

**快速创建** - `quick-post.ts`
- 一行命令，使用默认值，需手动编辑

---

## 💡 SEO 优化示例

### ✅ 好的示例

**标题：** "Getting Started with Hugo Paper - Complete Guide 2024"  
**描述：** "Learn how to set up Hugo Paper theme in 5 minutes. Step-by-step guide with examples."  
**关键词：** hugo static site generator, blog setup tutorial, hugo theme customization

### ❌ 不好的示例

**标题：** "Hugo Tutorial"  
**描述：** "This is a tutorial."  
**关键词：** hugo, blog, tutorial

---

## 🐛 常见问题

**文件已存在？** 脚本会提示错误，不会覆盖。使用不同标题或 slug。

**添加 OG 图片？** 在 frontmatter 添加 `image: "/images/og.jpg"`

**自定义默认值？** 编辑 `new-post.ts` 或 `quick-post.ts` 中的默认值。
