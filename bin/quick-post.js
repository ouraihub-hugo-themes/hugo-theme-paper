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

// scripts/quick-post.ts
var fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);
function titleToSlug(title) {
  return title.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
function getCurrentDateTime() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function generatePost(title, language) {
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
  const content = language === "zh" ? `## \u7B80\u4ECB

\u5728\u8FD9\u91CC\u5199\u4F60\u7684\u6587\u7AE0\u7B80\u4ECB...

## \u76EE\u5F55

## \u4E3B\u8981\u5185\u5BB9

### \u7B2C\u4E00\u90E8\u5206

\u5728\u8FD9\u91CC\u5199\u5185\u5BB9...

## \u603B\u7ED3

\u5728\u8FD9\u91CC\u5199\u603B\u7ED3...
` : `## Introduction

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
    slug
  };
}
function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("\n\u274C \u9519\u8BEF: \u8BF7\u63D0\u4F9B\u6587\u7AE0\u6807\u9898");
    console.log('\n\u7528\u6CD5: pnpm quick-post "\u6587\u7AE0\u6807\u9898" [\u8BED\u8A00]');
    console.log('\u793A\u4F8B: pnpm quick-post "My New Post" en');
    console.log('      pnpm quick-post "\u6211\u7684\u65B0\u6587\u7AE0" zh\n');
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
  if (fs.existsSync(filePath)) {
    console.error(`
\u274C \u9519\u8BEF: \u6587\u4EF6\u5DF2\u5B58\u5728: ${filePath}
`);
    process.exit(1);
  }
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`
\u2705 \u6587\u7AE0\u521B\u5EFA\u6210\u529F\uFF01`);
  console.log(`\u{1F4C4} \u6587\u4EF6: ${filePath}`);
  console.log(`
\u26A0\uFE0F  \u8BF7\u8BB0\u5F97\u66F4\u65B0\u4EE5\u4E0B\u5B57\u6BB5:`);
  console.log(`   - description (\u63CF\u8FF0)`);
  console.log(`   - keywords (\u5173\u952E\u8BCD)`);
  console.log(`   - categories (\u5206\u7C7B)`);
  console.log(`   - tags (\u6807\u7B7E)`);
  console.log(`   - draft: false (\u53D1\u5E03\u65F6)`);
  console.log(`
\u{1F680} \u9884\u89C8: pnpm dev
`);
}
main();
