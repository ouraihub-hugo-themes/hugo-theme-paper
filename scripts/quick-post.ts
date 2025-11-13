#!/usr/bin/env node

/**
 * 快速创建文章脚本（使用默认值）
 * 用法: pnpm quick-post "文章标题" [语言]
 * 示例: pnpm quick-post "My New Post" en
 */

import * as fs from "fs";
import * as path from "path";

// 将标题转换为 slug
function titleToSlug(title: string): string {
  return title
    .trim() // 先去除首尾空格
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, ""); // 去除首尾连字符
}

// 获取当前日期时间
function getCurrentDateTime(): string {
  return new Date().toISOString();
}

// 生成文章内容
function generatePost(
  title: string,
  language: "en" | "zh"
): { content: string; slug: string } {
  const slug = titleToSlug(title);
  const date = getCurrentDateTime();

  const frontmatter = `---
title: "${title}"
slug: "${slug}"
description: "Add your description here (150-160 characters for SEO)"
date: ${date}
lastmod: ${date}
author: "Hugo Paper Team"
keywords:
  - keyword1
  - keyword2
  - keyword3
categories:
  - Tutorial
tags:
  - tag1
  - tag2
featured: false
draft: true
---

`;

  const content =
    language === "zh"
      ? `## 简介

在这里写你的文章简介...

## 目录

## 主要内容

### 第一部分

在这里写内容...

## 总结

在这里写总结...
`
      : `## Introduction

Write your introduction here...

## Table of contents

## Main Content

### Section 1

Write your content here...

## Conclusion

Write your conclusion here...
`;

  return {
    content: frontmatter + content,
    slug,
  };
}

// 主函数
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("\n❌ 错误: 请提供文章标题");
    console.log("\n用法: pnpm quick-post \"文章标题\" [语言]");
    console.log("示例: pnpm quick-post \"My New Post\" en");
    console.log("      pnpm quick-post \"我的新文章\" zh\n");
    process.exit(1);
  }

  const title = args[0];
  const language = args[1] === "zh" ? "zh" : "en";

  const { content, slug } = generatePost(title, language);

  const contentDir = path.join(
    process.cwd(),
    "exampleSite",
    "content",
    language,
    "post"
  );
  const filePath = path.join(contentDir, `${slug}.md`);

  // 检查文件是否已存在
  if (fs.existsSync(filePath)) {
    console.error(`\n❌ 错误: 文件已存在: ${filePath}\n`);
    process.exit(1);
  }

  // 确保目录存在
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // 写入文件
  fs.writeFileSync(filePath, content, "utf-8");

  console.log(`\n✅ 文章创建成功！`);
  console.log(`📄 文件: ${filePath}`);
  console.log(`\n⚠️  请记得更新以下字段:`);
  console.log(`   - description (描述)`);
  console.log(`   - keywords (关键词)`);
  console.log(`   - categories (分类)`);
  console.log(`   - tags (标签)`);
  console.log(`   - draft: false (发布时)`);
  console.log(`\n🚀 预览: pnpm dev\n`);
}

main();
