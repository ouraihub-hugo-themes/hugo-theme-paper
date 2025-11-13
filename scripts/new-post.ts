#!/usr/bin/env node

/**
 * 创建新文章脚本
 * 用法: pnpm new-post "文章标题" [语言]
 * 示例: pnpm new-post "Getting Started with Hugo" en
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

interface PostMetadata {
  title: string;
  slug: string;
  description: string;
  keywords: string[];
  author: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  draft: boolean;
  language: "en" | "zh";
}

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 提示用户输入
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// 将标题转换为 slug
function titleToSlug(title: string): string {
  return title
    .trim() // 先去除首尾空格
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // 移除特殊字符
    .replace(/\s+/g, "-") // 空格转连字符
    .replace(/-+/g, "-") // 多个连字符转单个
    .replace(/^-+|-+$/g, ""); // 去除首尾连字符
}

// 获取当前日期时间（ISO 8601 格式）
function getCurrentDateTime(): string {
  return new Date().toISOString();
}

// 生成 frontmatter
function generateFrontmatter(metadata: PostMetadata): string {
  const {
    title,
    slug,
    description,
    keywords,
    author,
    categories,
    tags,
    featured,
    draft,
  } = metadata;

  const date = getCurrentDateTime();

  return `---
title: "${title}"
slug: "${slug}"
description: "${description}"
date: ${date}
lastmod: ${date}
author: "${author}"
keywords:
${keywords.map((k) => `  - ${k}`).join("\n")}
categories:
${categories.map((c) => `  - ${c}`).join("\n")}
tags:
${tags.map((t) => `  - ${t}`).join("\n")}
featured: ${featured}
draft: ${draft}
---

`;
}

// 生成文章内容模板
function generatePostContent(metadata: PostMetadata): string {
  const { language } = metadata;

  if (language === "zh") {
    return `## 简介

在这里写你的文章简介...

## 目录

## 主要内容

### 第一部分

在这里写第一部分的内容...

### 第二部分

在这里写第二部分的内容...

## 总结

在这里写总结...

## 参考资源

- [链接1](https://example.com)
- [链接2](https://example.com)
`;
  } else {
    return `## Introduction

Write your introduction here...

## Table of contents

## Main Content

### Section 1

Write your first section here...

### Section 2

Write your second section here...

## Conclusion

Write your conclusion here...

## References

- [Link 1](https://example.com)
- [Link 2](https://example.com)
`;
  }
}

// 创建文章文件
function createPostFile(metadata: PostMetadata): void {
  const { slug, language } = metadata;
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
    console.error(`\n❌ 错误: 文件已存在: ${filePath}`);
    process.exit(1);
  }

  // 确保目录存在
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // 生成完整内容
  const frontmatter = generateFrontmatter(metadata);
  const content = generatePostContent(metadata);
  const fullContent = frontmatter + content;

  // 写入文件
  fs.writeFileSync(filePath, fullContent, "utf-8");

  console.log(`\n✅ 文章创建成功！`);
  console.log(`📄 文件路径: ${filePath}`);
  console.log(`\n📝 下一步:`);
  console.log(`   1. 编辑文章内容`);
  console.log(`   2. 添加 OG 图片 (推荐尺寸: 1200x640px)`);
  console.log(`   3. 将 draft 设置为 false 以发布`);
  console.log(`\n🚀 预览命令: pnpm dev`);
}

// 主函数
async function main() {
  console.log("\n🎨 Hugo Paper - 创建新文章\n");
  console.log("=" .repeat(50));

  try {
    // 1. 获取标题
    const titleArg = process.argv[2];
    const title = titleArg || (await prompt("\n📝 文章标题: "));

    if (!title) {
      console.error("❌ 错误: 标题不能为空");
      process.exit(1);
    }

    // 2. 获取语言
    const langArg = process.argv[3];
    let language: "en" | "zh";

    if (langArg) {
      language = langArg === "zh" ? "zh" : "en";
    } else {
      const langInput = await prompt("🌍 语言 (en/zh) [en]: ");
      language = langInput === "zh" ? "zh" : "en";
    }

    // 3. 生成 slug
    const defaultSlug = titleToSlug(title);
    const slugInput = await prompt(`🔗 Slug [${defaultSlug}]: `);
    const slug = slugInput || defaultSlug;

    // 4. 获取描述
    const description = await prompt(
      `📄 描述 (150-160字符，用于SEO): `
    );

    if (!description) {
      console.error("❌ 错误: 描述不能为空（对SEO很重要）");
      process.exit(1);
    }

    // 5. 获取关键词
    const keywordsInput = await prompt(
      `🔑 关键词 (用逗号分隔，5-7个): `
    );
    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k);

    if (keywords.length === 0) {
      console.error("❌ 错误: 至少需要一个关键词（对SEO很重要）");
      process.exit(1);
    }

    // 6. 获取作者
    const author = await prompt(`👤 作者 [Hugo Paper Team]: `);

    // 7. 获取分类
    const categoriesInput = await prompt(
      `📁 分类 (用逗号分隔) [Tutorial]: `
    );
    const categories = categoriesInput
      ? categoriesInput.split(",").map((c) => c.trim())
      : ["Tutorial"];

    // 8. 获取标签
    const tagsInput = await prompt(`🏷️  标签 (用逗号分隔): `);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    if (tags.length === 0) {
      console.error("❌ 错误: 至少需要一个标签");
      process.exit(1);
    }

    // 9. 是否精选
    const featuredInput = await prompt(`⭐ 是否精选? (y/n) [n]: `);
    const featured = featuredInput.toLowerCase() === "y";

    // 10. 是否草稿
    const draftInput = await prompt(`📝 是否草稿? (y/n) [y]: `);
    const draft = draftInput.toLowerCase() !== "n";

    // 创建元数据对象
    const metadata: PostMetadata = {
      title,
      slug,
      description,
      keywords,
      author: author || "Hugo Paper Team",
      categories,
      tags,
      featured,
      draft,
      language,
    };

    // 显示摘要
    console.log("\n" + "=".repeat(50));
    console.log("📋 文章信息摘要:");
    console.log("=".repeat(50));
    console.log(`标题: ${metadata.title}`);
    console.log(`Slug: ${metadata.slug}`);
    console.log(`语言: ${metadata.language}`);
    console.log(`描述: ${metadata.description}`);
    console.log(`关键词: ${metadata.keywords.join(", ")}`);
    console.log(`作者: ${metadata.author}`);
    console.log(`分类: ${metadata.categories.join(", ")}`);
    console.log(`标签: ${metadata.tags.join(", ")}`);
    console.log(`精选: ${metadata.featured ? "是" : "否"}`);
    console.log(`草稿: ${metadata.draft ? "是" : "否"}`);
    console.log("=".repeat(50));

    const confirm = await prompt("\n✅ 确认创建? (y/n) [y]: ");

    if (confirm.toLowerCase() === "n") {
      console.log("\n❌ 已取消");
      process.exit(0);
    }

    // 创建文件
    createPostFile(metadata);
  } catch (error) {
    console.error("\n❌ 错误:", error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// 运行主函数
main();
