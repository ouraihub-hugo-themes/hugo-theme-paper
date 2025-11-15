# 脚本使用指南

## 概述

`scripts/` 目录包含用于创建新文章的辅助脚本。这些脚本支持**自动路径检测**，可以在主题开发环境和用户项目中无缝工作。

## 可用脚本

### 1. new-post.ts - 交互式创建文章

完整的交互式文章创建工具，会提示输入所有元数据。

**用法**：
```bash
pnpm new-post "文章标题" [语言]
```

**示例**：
```bash
# 英文文章
pnpm new-post "Getting Started with Hugo"

# 中文文章
pnpm new-post "Hugo 入门指南" zh
```

**功能**：
- 交互式输入所有元数据（标题、描述、关键词、分类、标签等）
- 自动生成 slug
- SEO 优化的 frontmatter
- 多语言支持（en/zh）
- 自动创建目录结构

### 2. quick-post.ts - 快速创建文章

使用默认值快速创建文章，适合快速起草。

**用法**：
```bash
pnpm quick-post "文章标题" [语言]
```

**示例**：
```bash
# 英文文章
pnpm quick-post "My New Post"

# 中文文章
pnpm quick-post "我的新文章" zh
```

**特点**：
- 使用默认值（draft: true, 默认分类和标签）
- 创建后需要手动更新元数据
- 适合快速起草

## 自动路径检测

脚本会自动检测运行环境并使用正确的路径：

### 主题开发环境
```
hugo-theme-paper/
├── scripts/
│   ├── new-post.ts
│   └── quick-post.ts
└── exampleSite/
    └── content/
        ├── en/post/     ← 文章创建到这里
        └── zh/post/
```

**检测逻辑**：如果存在 `exampleSite/` 目录，使用 `exampleSite/content/{language}/post/`

### 用户项目环境
```
my-blog/  (基于 hugo-theme-paper-starter)
├── scripts/
│   ├── new-post.ts
│   └── quick-post.ts
└── content/
    ├── en/post/     ← 文章创建到这里
    └── zh/post/
```

**检测逻辑**：如果不存在 `exampleSite/` 目录，使用 `content/{language}/post/`

## 实现原理

```typescript
// 检测项目类型并返回正确的 content 目录
function getContentDir(language: string): string {
  const cwd = process.cwd();
  
  // 检查是否在主题开发环境（存在 exampleSite 目录）
  if (fs.existsSync(path.join(cwd, "exampleSite"))) {
    return path.join(cwd, "exampleSite", "content", language, "post");
  }
  
  // 否则是用户项目（starter 或普通项目）
  return path.join(cwd, "content", language, "post");
}
```

## 文章 Frontmatter 结构

脚本生成的文章包含完整的 SEO 优化 frontmatter：

```yaml
---
title: "文章标题"
slug: "article-slug"
description: "文章描述（150-160字符，用于SEO）"
date: 2024-01-01T08:00:00Z
lastmod: 2024-01-01T08:00:00Z
author: "作者名"
keywords:
  - keyword1
  - keyword2
  - keyword3
categories:
  - Category1
tags:
  - tag1
  - tag2
featured: false
draft: true
---
```

## 维护说明

### 单一代码源

脚本代码在两个位置保持**完全相同**：
- `hugo-theme-paper/scripts/` - 主题开发
- `hugo-theme-paper-starter/scripts/` - 用户项目

**重要**：修改脚本时，需要同步更新两个位置。

### 为什么不放在 dist 仓库？

`hugo-theme-paper-dist` 是纯主题文件分发仓库，只包含：
- layouts/
- i18n/
- static/
- data/
- archetypes/

不包含开发工具（scripts/、tests/、node_modules/ 等）。

### 同步更新流程

1. 在 `hugo-theme-paper/scripts/` 中修改脚本
2. 测试功能是否正常
3. 复制到 `hugo-theme-paper-starter/scripts/`
4. 在两个环境中测试

## 依赖要求

### 主题开发环境
```json
{
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsx": "^4.7.0"
  }
}
```

### 用户项目环境
```json
{
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsx": "^4.7.0"
  }
}
```

## 故障排除

### 错误：找不到 content 目录

**原因**：脚本无法确定正确的 content 目录路径。

**解决**：
1. 确保在项目根目录运行脚本
2. 检查目录结构是否正确
3. 主题开发：确保有 `exampleSite/content/` 目录
4. 用户项目：确保有 `content/` 目录

### 错误：Cannot find module 'node:fs'

**原因**：缺少 Node.js 类型声明。

**解决**：
```bash
pnpm install
```

### 文章创建到错误的位置

**检查**：
1. 运行 `pwd` 确认当前目录
2. 检查是否有 `exampleSite/` 目录
3. 查看脚本输出的文件路径

## 最佳实践

### 使用 new-post 创建正式文章
```bash
pnpm new-post "Complete Guide to Hugo"
```
- 完整的元数据
- SEO 优化
- 适合发布

### 使用 quick-post 快速起草
```bash
pnpm quick-post "Draft Ideas"
```
- 快速创建
- 稍后完善
- 适合草稿

### 发布前检查清单
- [ ] 更新 description（150-160字符）
- [ ] 添加 5-7 个关键词
- [ ] 设置正确的分类和标签
- [ ] 添加 OG 图片（1200x640px）
- [ ] 将 `draft: false`
- [ ] 检查内容质量

## 扩展脚本

如果需要添加新功能：

1. 在 `hugo-theme-paper/scripts/` 中创建新脚本
2. 使用 `getContentDir()` 函数确保路径正确
3. 在 `package.json` 中添加命令
4. 同步到 `hugo-theme-paper-starter/`
5. 更新此文档

## 参考

- [Hugo Content Management](https://gohugo.io/content-management/)
- [Hugo Frontmatter](https://gohugo.io/content-management/front-matter/)
- [TypeScript Node.js](https://nodejs.org/api/documentation.html)
