#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// scripts/new-post.ts
var fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);
var readline = __toESM(require("readline"), 1);
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}
function titleToSlug(title) {
  return title.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
function getCurrentDateTime() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function generateFrontmatter(metadata) {
  const {
    title,
    slug,
    description,
    keywords,
    author,
    categories,
    tags,
    featured,
    draft
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
function generatePostContent(metadata) {
  const { language } = metadata;
  if (language === "zh") {
    return `## \u7B80\u4ECB

\u5728\u8FD9\u91CC\u5199\u4F60\u7684\u6587\u7AE0\u7B80\u4ECB...

## \u76EE\u5F55

## \u4E3B\u8981\u5185\u5BB9

### \u7B2C\u4E00\u90E8\u5206

\u5728\u8FD9\u91CC\u5199\u7B2C\u4E00\u90E8\u5206\u7684\u5185\u5BB9...

### \u7B2C\u4E8C\u90E8\u5206

\u5728\u8FD9\u91CC\u5199\u7B2C\u4E8C\u90E8\u5206\u7684\u5185\u5BB9...

## \u603B\u7ED3

\u5728\u8FD9\u91CC\u5199\u603B\u7ED3...

## \u53C2\u8003\u8D44\u6E90

- [\u94FE\u63A51](https://example.com)
- [\u94FE\u63A52](https://example.com)
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
function createPostFile(metadata) {
  const { slug, language } = metadata;
  const contentDir = path.join(
    process.cwd(),
    "exampleSite",
    "content",
    language,
    "post"
  );
  const filePath = path.join(contentDir, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    console.error(`
\u274C \u9519\u8BEF: \u6587\u4EF6\u5DF2\u5B58\u5728: ${filePath}`);
    process.exit(1);
  }
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  const frontmatter = generateFrontmatter(metadata);
  const content = generatePostContent(metadata);
  const fullContent = frontmatter + content;
  fs.writeFileSync(filePath, fullContent, "utf-8");
  console.log(`
\u2705 \u6587\u7AE0\u521B\u5EFA\u6210\u529F\uFF01`);
  console.log(`\u{1F4C4} \u6587\u4EF6\u8DEF\u5F84: ${filePath}`);
  console.log(`
\u{1F4DD} \u4E0B\u4E00\u6B65:`);
  console.log(`   1. \u7F16\u8F91\u6587\u7AE0\u5185\u5BB9`);
  console.log(`   2. \u6DFB\u52A0 OG \u56FE\u7247 (\u63A8\u8350\u5C3A\u5BF8: 1200x640px)`);
  console.log(`   3. \u5C06 draft \u8BBE\u7F6E\u4E3A false \u4EE5\u53D1\u5E03`);
  console.log(`
\u{1F680} \u9884\u89C8\u547D\u4EE4: pnpm dev`);
}
async function main() {
  console.log("\n\u{1F3A8} Hugo Paper - \u521B\u5EFA\u65B0\u6587\u7AE0\n");
  console.log("=".repeat(50));
  try {
    const titleArg = process.argv[2];
    const title = titleArg || await prompt("\n\u{1F4DD} \u6587\u7AE0\u6807\u9898: ");
    if (!title) {
      console.error("\u274C \u9519\u8BEF: \u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A");
      process.exit(1);
    }
    const langArg = process.argv[3];
    let language;
    if (langArg) {
      language = langArg === "zh" ? "zh" : "en";
    } else {
      const langInput = await prompt("\u{1F30D} \u8BED\u8A00 (en/zh) [en]: ");
      language = langInput === "zh" ? "zh" : "en";
    }
    const defaultSlug = titleToSlug(title);
    const slugInput = await prompt(`\u{1F517} Slug [${defaultSlug}]: `);
    const slug = slugInput || defaultSlug;
    const description = await prompt(
      `\u{1F4C4} \u63CF\u8FF0 (150-160\u5B57\u7B26\uFF0C\u7528\u4E8ESEO): `
    );
    if (!description) {
      console.error("\u274C \u9519\u8BEF: \u63CF\u8FF0\u4E0D\u80FD\u4E3A\u7A7A\uFF08\u5BF9SEO\u5F88\u91CD\u8981\uFF09");
      process.exit(1);
    }
    const keywordsInput = await prompt(
      `\u{1F511} \u5173\u952E\u8BCD (\u7528\u9017\u53F7\u5206\u9694\uFF0C5-7\u4E2A): `
    );
    const keywords = keywordsInput.split(",").map((k) => k.trim()).filter((k) => k);
    if (keywords.length === 0) {
      console.error("\u274C \u9519\u8BEF: \u81F3\u5C11\u9700\u8981\u4E00\u4E2A\u5173\u952E\u8BCD\uFF08\u5BF9SEO\u5F88\u91CD\u8981\uFF09");
      process.exit(1);
    }
    const author = await prompt(`\u{1F464} \u4F5C\u8005 [Hugo Paper Team]: `);
    const categoriesInput = await prompt(
      `\u{1F4C1} \u5206\u7C7B (\u7528\u9017\u53F7\u5206\u9694) [Tutorial]: `
    );
    const categories = categoriesInput ? categoriesInput.split(",").map((c) => c.trim()) : ["Tutorial"];
    const tagsInput = await prompt(`\u{1F3F7}\uFE0F  \u6807\u7B7E (\u7528\u9017\u53F7\u5206\u9694): `);
    const tags = tagsInput.split(",").map((t) => t.trim()).filter((t) => t);
    if (tags.length === 0) {
      console.error("\u274C \u9519\u8BEF: \u81F3\u5C11\u9700\u8981\u4E00\u4E2A\u6807\u7B7E");
      process.exit(1);
    }
    const featuredInput = await prompt(`\u2B50 \u662F\u5426\u7CBE\u9009? (y/n) [n]: `);
    const featured = featuredInput.toLowerCase() === "y";
    const draftInput = await prompt(`\u{1F4DD} \u662F\u5426\u8349\u7A3F? (y/n) [y]: `);
    const draft = draftInput.toLowerCase() !== "n";
    const metadata = {
      title,
      slug,
      description,
      keywords,
      author: author || "Hugo Paper Team",
      categories,
      tags,
      featured,
      draft,
      language
    };
    console.log("\n" + "=".repeat(50));
    console.log("\u{1F4CB} \u6587\u7AE0\u4FE1\u606F\u6458\u8981:");
    console.log("=".repeat(50));
    console.log(`\u6807\u9898: ${metadata.title}`);
    console.log(`Slug: ${metadata.slug}`);
    console.log(`\u8BED\u8A00: ${metadata.language}`);
    console.log(`\u63CF\u8FF0: ${metadata.description}`);
    console.log(`\u5173\u952E\u8BCD: ${metadata.keywords.join(", ")}`);
    console.log(`\u4F5C\u8005: ${metadata.author}`);
    console.log(`\u5206\u7C7B: ${metadata.categories.join(", ")}`);
    console.log(`\u6807\u7B7E: ${metadata.tags.join(", ")}`);
    console.log(`\u7CBE\u9009: ${metadata.featured ? "\u662F" : "\u5426"}`);
    console.log(`\u8349\u7A3F: ${metadata.draft ? "\u662F" : "\u5426"}`);
    console.log("=".repeat(50));
    const confirm = await prompt("\n\u2705 \u786E\u8BA4\u521B\u5EFA? (y/n) [y]: ");
    if (confirm.toLowerCase() === "n") {
      console.log("\n\u274C \u5DF2\u53D6\u6D88");
      process.exit(0);
    }
    createPostFile(metadata);
  } catch (error) {
    console.error("\n\u274C \u9519\u8BEF:", error);
    process.exit(1);
  } finally {
    rl.close();
  }
}
main();
