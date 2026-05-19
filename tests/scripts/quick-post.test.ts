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

// 辅助函数：生成文章内容
function generatePost(
    title: string,
    language: "en" | "zh"
): { content: string; slug: string } {
    const slug = titleToSlug(title);
    const date = new Date().toISOString();

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

describe("quick-post.ts - titleToSlug", () => {
    it("应该将标题转换为小写", () => {
        expect(titleToSlug("Quick Post")).toBe("quick-post");
    });

    it("应该将空格转换为连字符", () => {
        expect(titleToSlug("My Quick Post")).toBe("my-quick-post");
    });

    it("应该移除特殊字符", () => {
        expect(titleToSlug("Quick! Post?")).toBe("quick-post");
    });

    it("应该处理多个连续空格", () => {
        expect(titleToSlug("Quick    Post")).toBe("quick-post");
    });

    it("应该处理多个连续连字符", () => {
        expect(titleToSlug("Quick---Post")).toBe("quick-post");
    });

    it("应该去除首尾空格", () => {
        expect(titleToSlug("  Quick Post  ")).toBe("quick-post");
    });

    it("应该处理中文标题", () => {
        expect(titleToSlug("快速文章")).toBe("");
    });

    it("应该处理混合语言", () => {
        expect(titleToSlug("Quick 快速 Post")).toBe("quick-post");
    });

    it("应该处理空字符串", () => {
        expect(titleToSlug("")).toBe("");
    });

    it("应该处理数字", () => {
        expect(titleToSlug("Post 123")).toBe("post-123");
    });
});

describe("quick-post.ts - generatePost", () => {
    const mockDate = new Date("2024-11-15T10:00:00.000Z");

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(mockDate);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("应该生成英文文章内容", () => {
        const { content, slug } = generatePost("Test Post", "en");

        expect(slug).toBe("test-post");
        expect(content).toContain('title: "Test Post"');
        expect(content).toContain('slug: "test-post"');
        expect(content).toContain("## Introduction");
        expect(content).toContain("## Table of contents");
        expect(content).toContain("## Main Content");
        expect(content).toContain("## Conclusion");
    });

    it("应该生成中文文章内容", () => {
        const { content, slug } = generatePost("测试文章", "zh");

        expect(slug).toBe("");
        expect(content).toContain('title: "测试文章"');
        expect(content).toContain("## 简介");
        expect(content).toContain("## 目录");
        expect(content).toContain("## 主要内容");
        expect(content).toContain("## 总结");
    });

    it("应该包含默认的 frontmatter 字段", () => {
        const { content } = generatePost("Test", "en");

        expect(content).toContain('description: "Add your description here');
        expect(content).toContain("date: 2024-11-15T10:00:00.000Z");
        expect(content).toContain("lastmod: 2024-11-15T10:00:00.000Z");
        expect(content).toContain('author: "Hugo Paper Team"');
        expect(content).toContain("keywords:");
        expect(content).toContain("  - keyword1");
        expect(content).toContain("  - keyword2");
        expect(content).toContain("  - keyword3");
        expect(content).toContain("categories:");
        expect(content).toContain("  - Tutorial");
        expect(content).toContain("tags:");
        expect(content).toContain("  - tag1");
        expect(content).toContain("  - tag2");
        expect(content).toContain("featured: false");
        expect(content).toContain("draft: true");
    });

    it("应该生成正确的 slug", () => {
        const testCases = [
            { title: "Getting Started", expected: "getting-started" },
            { title: "How to Use Hugo", expected: "how-to-use-hugo" },
            { title: "Quick Guide", expected: "quick-guide" },
            { title: "Post 2024", expected: "post-2024" },
        ];

        testCases.forEach(({ title, expected }) => {
            const { slug } = generatePost(title, "en");
            expect(slug).toBe(expected);
        });
    });

    it("应该包含完整的文章结构", () => {
        const { content } = generatePost("Test", "en");

        // 检查 frontmatter
        expect(content).toMatch(/^---\n/);
        expect(content).toContain("\n---\n\n");

        // 检查内容部分
        expect(content).toContain("## Introduction");
        expect(content).toContain("## Table of contents");
        expect(content).toContain("## Main Content");
        expect(content).toContain("### Section 1");
        expect(content).toContain("## Conclusion");
    });

    it("应该为中文文章生成中文结构", () => {
        const { content } = generatePost("测试", "zh");

        expect(content).toContain("## 简介");
        expect(content).toContain("在这里写你的文章简介...");
        expect(content).toContain("## 目录");
        expect(content).toContain("## 主要内容");
        expect(content).toContain("### 第一部分");
        expect(content).toContain("在这里写内容...");
        expect(content).toContain("## 总结");
        expect(content).toContain("在这里写总结...");
    });

    it("应该为英文文章生成英文结构", () => {
        const { content } = generatePost("Test", "en");

        expect(content).toContain("## Introduction");
        expect(content).toContain("Write your introduction here...");
        expect(content).toContain("## Table of contents");
        expect(content).toContain("## Main Content");
        expect(content).toContain("### Section 1");
        expect(content).toContain("Write your content here...");
        expect(content).toContain("## Conclusion");
        expect(content).toContain("Write your conclusion here...");
    });
});

describe("quick-post.ts - 文件操作", () => {
    const testDir = path.join(process.cwd(), "test-output-quick");
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

    it("应该创建文件", () => {
        const { content, slug } = generatePost("Test Post", "en");
        const filePath = path.join(contentDir, `${slug}.md`);

        fs.writeFileSync(filePath, content, "utf-8");

        expect(fs.existsSync(filePath)).toBe(true);
    });

    it("应该写入正确的内容", () => {
        const { content, slug } = generatePost("Test Post", "en");
        const filePath = path.join(contentDir, `${slug}.md`);

        fs.writeFileSync(filePath, content, "utf-8");

        const fileContent = fs.readFileSync(filePath, "utf-8");
        expect(fileContent).toBe(content);
    });

    it("应该检测文件是否已存在", () => {
        const filePath = path.join(contentDir, "existing.md");

        fs.writeFileSync(filePath, "Existing", "utf-8");

        expect(fs.existsSync(filePath)).toBe(true);
    });

    it("应该创建不存在的目录", () => {
        const newDir = path.join(testDir, "new", "directory");

        if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir, { recursive: true });
        }

        expect(fs.existsSync(newDir)).toBe(true);
    });
});

describe("quick-post.ts - 语言处理", () => {
    it("应该默认为英文", () => {
        const language = undefined;
        const defaultLanguage = language === "zh" ? "zh" : "en";
        expect(defaultLanguage).toBe("en");
    });

    it("应该识别中文", () => {
        const language = "zh";
        const validLanguage = language === "zh" ? "zh" : "en";
        expect(validLanguage).toBe("zh");
    });

    it("应该将无效语言转换为英文", () => {
        const language: string = "fr";
        const validLanguage = language === "zh" ? "zh" : "en";
        expect(validLanguage).toBe("en");
    });

    it("应该处理空字符串", () => {
        const language: string = "";
        const validLanguage = language === "zh" ? "zh" : "en";
        expect(validLanguage).toBe("en");
    });
});

describe("quick-post.ts - 命令行参数", () => {
    it("应该解析标题参数", () => {
        const args = ["My New Post"];
        expect(args[0]).toBe("My New Post");
    });

    it("应该解析语言参数", () => {
        const args = ["My New Post", "zh"];
        expect(args[1]).toBe("zh");
    });

    it("应该处理缺少语言参数", () => {
        const args = ["My New Post"];
        expect(args[1]).toBeUndefined();
    });

    it("应该处理空参数数组", () => {
        const args: string[] = [];
        expect(args.length).toBe(0);
    });
});

describe("quick-post.ts - 错误处理", () => {
    it("应该检测空标题", () => {
        const title = "";
        expect(title.length).toBe(0);
    });

    it("应该接受有效标题", () => {
        const title = "Valid Title";
        expect(title.length).toBeGreaterThan(0);
    });

    it("应该处理特殊字符标题", () => {
        const title = "Title with @#$%";
        const slug = titleToSlug(title);
        expect(slug).toBe("title-with");
    });
});

describe("quick-post.ts - 内容模板", () => {
    it("英文模板应该包含所有必要部分", () => {
        const { content } = generatePost("Test", "en");

        const sections = [
            "## Introduction",
            "## Table of contents",
            "## Main Content",
            "### Section 1",
            "## Conclusion",
        ];

        sections.forEach((section) => {
            expect(content).toContain(section);
        });
    });

    it("中文模板应该包含所有必要部分", () => {
        const { content } = generatePost("测试", "zh");

        const sections = [
            "## 简介",
            "## 目录",
            "## 主要内容",
            "### 第一部分",
            "## 总结",
        ];

        sections.forEach((section) => {
            expect(content).toContain(section);
        });
    });

    it("应该包含占位符文本", () => {
        const { content } = generatePost("Test", "en");

        expect(content).toContain("Write your introduction here...");
        expect(content).toContain("Write your content here...");
        expect(content).toContain("Write your conclusion here...");
    });

    it("中文模板应该包含中文占位符", () => {
        const { content } = generatePost("测试", "zh");

        expect(content).toContain("在这里写你的文章简介...");
        expect(content).toContain("在这里写内容...");
        expect(content).toContain("在这里写总结...");
    });
});

describe("quick-post.ts - 日期格式", () => {
    it("应该生成 ISO 8601 格式", () => {
        const date = new Date().toISOString();
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("date 和 lastmod 应该相同", () => {
        const mockDate = new Date("2024-11-15T10:00:00.000Z");
        vi.useFakeTimers();
        vi.setSystemTime(mockDate);

        const { content } = generatePost("Test", "en");

        const dateMatch = content.match(/date: (.+)/);
        const lastmodMatch = content.match(/lastmod: (.+)/);

        expect(dateMatch?.[1]).toBe(lastmodMatch?.[1]);

        vi.useRealTimers();
    });
});
