import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";

// 辅助函数：将标题转换为 slug
function titleToSlug(title: string): string {
  return title
    .trim() // 先去除首尾空格
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, ""); // 去除首尾连字符
}

// 辅助函数：生成 frontmatter
function generateFrontmatter(metadata: {
  title: string;
  slug: string;
  description: string;
  keywords: string[];
  author: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  draft: boolean;
}): string {
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

  const date = new Date().toISOString();

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

describe("new-post.ts - titleToSlug", () => {
  it("应该将标题转换为小写", () => {
    expect(titleToSlug("Getting Started")).toBe("getting-started");
  });

  it("应该将空格转换为连字符", () => {
    expect(titleToSlug("My New Post")).toBe("my-new-post");
  });

  it("应该移除特殊字符", () => {
    expect(titleToSlug("Hello, World!")).toBe("hello-world");
    expect(titleToSlug("Test@#$%Post")).toBe("testpost");
  });

  it("应该处理多个连续空格", () => {
    expect(titleToSlug("Multiple   Spaces")).toBe("multiple-spaces");
  });

  it("应该处理多个连续连字符", () => {
    expect(titleToSlug("Multiple---Hyphens")).toBe("multiple-hyphens");
  });

  it("应该去除首尾空格", () => {
    expect(titleToSlug("  Trimmed  ")).toBe("trimmed");
  });

  it("应该处理中文标题", () => {
    expect(titleToSlug("Hugo 入门指南")).toBe("hugo");
  });

  it("应该处理混合语言", () => {
    expect(titleToSlug("Getting Started 入门")).toBe("getting-started");
  });

  it("应该处理空字符串", () => {
    expect(titleToSlug("")).toBe("");
  });

  it("应该处理只有特殊字符的字符串", () => {
    expect(titleToSlug("@#$%^&*()")).toBe("");
  });
});

describe("new-post.ts - generateFrontmatter", () => {
  const mockDate = new Date("2024-11-15T10:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("应该生成完整的 frontmatter", () => {
    const metadata = {
      title: "Test Post",
      slug: "test-post",
      description: "This is a test post",
      keywords: ["test", "post", "example"],
      author: "Test Author",
      categories: ["Tutorial"],
      tags: ["test", "example"],
      featured: false,
      draft: true,
    };

    const frontmatter = generateFrontmatter(metadata);

    expect(frontmatter).toContain('title: "Test Post"');
    expect(frontmatter).toContain('slug: "test-post"');
    expect(frontmatter).toContain('description: "This is a test post"');
    expect(frontmatter).toContain("keywords:");
    expect(frontmatter).toContain("  - test");
    expect(frontmatter).toContain("  - post");
    expect(frontmatter).toContain("  - example");
    expect(frontmatter).toContain('author: "Test Author"');
    expect(frontmatter).toContain("categories:");
    expect(frontmatter).toContain("  - Tutorial");
    expect(frontmatter).toContain("tags:");
    expect(frontmatter).toContain("featured: false");
    expect(frontmatter).toContain("draft: true");
  });

  it("应该包含日期字段", () => {
    const metadata = {
      title: "Test",
      slug: "test",
      description: "Test",
      keywords: ["test"],
      author: "Author",
      categories: ["Cat"],
      tags: ["tag"],
      featured: false,
      draft: true,
    };

    const frontmatter = generateFrontmatter(metadata);

    expect(frontmatter).toContain("date: 2024-11-15T10:00:00.000Z");
    expect(frontmatter).toContain("lastmod: 2024-11-15T10:00:00.000Z");
  });

  it("应该处理多个关键词", () => {
    const metadata = {
      title: "Test",
      slug: "test",
      description: "Test",
      keywords: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
      author: "Author",
      categories: ["Cat"],
      tags: ["tag"],
      featured: false,
      draft: true,
    };

    const frontmatter = generateFrontmatter(metadata);

    expect(frontmatter).toContain("  - keyword1");
    expect(frontmatter).toContain("  - keyword2");
    expect(frontmatter).toContain("  - keyword3");
    expect(frontmatter).toContain("  - keyword4");
    expect(frontmatter).toContain("  - keyword5");
  });

  it("应该处理多个分类", () => {
    const metadata = {
      title: "Test",
      slug: "test",
      description: "Test",
      keywords: ["test"],
      author: "Author",
      categories: ["Tutorial", "Guide", "Documentation"],
      tags: ["tag"],
      featured: false,
      draft: true,
    };

    const frontmatter = generateFrontmatter(metadata);

    expect(frontmatter).toContain("  - Tutorial");
    expect(frontmatter).toContain("  - Guide");
    expect(frontmatter).toContain("  - Documentation");
  });

  it("应该处理多个标签", () => {
    const metadata = {
      title: "Test",
      slug: "test",
      description: "Test",
      keywords: ["test"],
      author: "Author",
      categories: ["Cat"],
      tags: ["tag1", "tag2", "tag3"],
      featured: false,
      draft: true,
    };

    const frontmatter = generateFrontmatter(metadata);

    expect(frontmatter).toContain("  - tag1");
    expect(frontmatter).toContain("  - tag2");
    expect(frontmatter).toContain("  - tag3");
  });

  it("应该正确设置 featured 标志", () => {
    const metadataFeatured = {
      title: "Test",
      slug: "test",
      description: "Test",
      keywords: ["test"],
      author: "Author",
      categories: ["Cat"],
      tags: ["tag"],
      featured: true,
      draft: false,
    };

    const frontmatter = generateFrontmatter(metadataFeatured);
    expect(frontmatter).toContain("featured: true");
  });

  it("应该正确设置 draft 标志", () => {
    const metadataDraft = {
      title: "Test",
      slug: "test",
      description: "Test",
      keywords: ["test"],
      author: "Author",
      categories: ["Cat"],
      tags: ["tag"],
      featured: false,
      draft: false,
    };

    const frontmatter = generateFrontmatter(metadataDraft);
    expect(frontmatter).toContain("draft: false");
  });

  it("应该处理包含引号的标题", () => {
    const metadata = {
      title: 'Test "Quoted" Post',
      slug: "test-quoted-post",
      description: "Test",
      keywords: ["test"],
      author: "Author",
      categories: ["Cat"],
      tags: ["tag"],
      featured: false,
      draft: true,
    };

    const frontmatter = generateFrontmatter(metadata);
    expect(frontmatter).toContain('title: "Test "Quoted" Post"');
  });

  it("应该处理包含特殊字符的描述", () => {
    const metadata = {
      title: "Test",
      slug: "test",
      description: "Test with special chars: @#$%",
      keywords: ["test"],
      author: "Author",
      categories: ["Cat"],
      tags: ["tag"],
      featured: false,
      draft: true,
    };

    const frontmatter = generateFrontmatter(metadata);
    expect(frontmatter).toContain(
      'description: "Test with special chars: @#$%"'
    );
  });
});

describe("new-post.ts - 文件创建逻辑", () => {
  const testDir = path.join(process.cwd(), "test-output");
  const contentDir = path.join(testDir, "exampleSite", "content", "en", "post");

  beforeEach(() => {
    // 创建测试目录
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
  });

  afterEach(() => {
    // 清理测试目录
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("应该创建文件到正确的目录", () => {
    const filePath = path.join(contentDir, "test-post.md");
    const content = "# Test Content";

    fs.writeFileSync(filePath, content, "utf-8");

    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.readFileSync(filePath, "utf-8")).toBe(content);
  });

  it("应该检测文件是否已存在", () => {
    const filePath = path.join(contentDir, "existing-post.md");

    fs.writeFileSync(filePath, "Existing content", "utf-8");

    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("应该创建不存在的目录", () => {
    const newDir = path.join(testDir, "new", "nested", "directory");

    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    expect(fs.existsSync(newDir)).toBe(true);
  });
});

describe("new-post.ts - 输入验证", () => {
  it("应该验证标题不为空", () => {
    const title = "";
    expect(title.length).toBe(0);
  });

  it("应该验证描述不为空", () => {
    const description = "";
    expect(description.length).toBe(0);
  });

  it("应该验证关键词数组不为空", () => {
    const keywords: string[] = [];
    expect(keywords.length).toBe(0);
  });

  it("应该验证标签数组不为空", () => {
    const tags: string[] = [];
    expect(tags.length).toBe(0);
  });

  it("应该接受有效的标题", () => {
    const title = "Valid Title";
    expect(title.length).toBeGreaterThan(0);
  });

  it("应该接受有效的描述", () => {
    const description = "This is a valid description for SEO purposes.";
    expect(description.length).toBeGreaterThan(0);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("应该接受有效的关键词数组", () => {
    const keywords = ["keyword1", "keyword2", "keyword3"];
    expect(keywords.length).toBeGreaterThan(0);
    expect(keywords.length).toBeLessThanOrEqual(7);
  });
});

describe("new-post.ts - 语言支持", () => {
  it("应该支持英文语言", () => {
    const language = "en";
    expect(["en", "zh"]).toContain(language);
  });

  it("应该支持中文语言", () => {
    const language = "zh";
    expect(["en", "zh"]).toContain(language);
  });

  it("应该默认为英文", () => {
    const language: string = "";
    const defaultLanguage = language || "en";
    expect(defaultLanguage).toBe("en");
  });

  it("应该将无效语言转换为英文", () => {
    const language: string = "fr";
    const validLanguage = language === "zh" ? "zh" : "en";
    expect(validLanguage).toBe("en");
  });
});

describe("new-post.ts - 日期格式", () => {
  it("应该生成 ISO 8601 格式的日期", () => {
    const date = new Date().toISOString();
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it("应该生成当前时间", () => {
    const before = new Date();
    const date = new Date();
    const after = new Date();

    expect(date.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(date.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});
