---
title: "AstroPaper 博客文章中的动态 OG 图片生成"
slug: "dynamic-og-image-generation-in-astropaper-blog-posts"
description: "AstroPaper v1.4.0 的新功能，为博客文章引入动态 OG 图片生成。"
date: 2022-12-28T04:59:04.866Z
lastmod: 2025-03-12T13:39:20.763Z
author: "Sat Naing"
draft: false
featured: false
tags: []
---

AstroPaper v1.4.0 的新功能，为博客文章引入动态 OG 图片生成。

## 目录

## 简介

OG 图片（又称社交图片）在社交媒体互动中扮演着重要角色。如果你不知道 OG 图片是什么，它是当我们在 Facebook、Discord 等社交媒体上分享网站 URL 时显示的图片。

> 用于 Twitter 的社交图片在技术上并不叫 OG 图片。但是，在这篇文章中，我将使用 OG 图片这个术语来指代所有类型的社交图片。

## 默认/静态 OG 图片（旧方式）

AstroPaper 已经提供了一种为博客文章添加 OG 图片的方法。作者可以在 frontmatter 的 `ogImage` 中指定 OG 图片。即使作者没有在 frontmatter 中定义 OG 图片，也会使用默认的 OG 图片作为后备（在这种情况下是 `public/astropaper-og.jpg`）。但问题是默认的 OG 图片是静态的，这意味着每篇没有在 frontmatter 中包含 OG 图片的博客文章都会使用相同的默认 OG 图片，尽管每篇文章的标题/内容都不同。

## 动态 OG 图片

为每篇文章生成动态 OG 图片可以让作者避免为每一篇博客文章都指定 OG 图片。此外，这将防止后备 OG 图片对所有博客文章都相同。

在 AstroPaper v1.4.0 中，使用 Vercel 的 [Satori](https://github.com/vercel/satori) 包来生成动态 OG 图片。

动态 OG 图片将在构建时为以下博客文章生成：

- frontmatter 中不包含 OG 图片
- 未标记为草稿

## AstroPaper 动态 OG 图片的结构

AstroPaper 的动态 OG 图片包括_博客文章标题_、_作者名称_和_网站标题_。作者名称和网站标题将通过 **"src/config.ts"** 文件的 `SITE.author` 和 `SITE.title` 获取。标题从博客文章 frontmatter 的 `title` 生成。

![动态 OG 图片示例链接](https://user-images.githubusercontent.com/53733092/209704501-e9c2236a-3f4d-4c67-bab3-025aebd63382.png)

### 非拉丁字符问题

包含非拉丁字符的标题无法开箱即用地正确显示。要解决这个问题，我们必须用你喜欢的字体替换 `loadGoogleFont.ts` 中的 `fontsConfig`。

```ts file=src/utils/loadGoogleFont.ts
async function loadGoogleFonts(
  text: string
): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fontsConfig = [
    {
      name: "Noto Sans JP",
      font: "Noto+Sans+JP",
      weight: 400,
      style: "normal",
    },
    {
      name: "Noto Sans JP",
      font: "Noto+Sans+JP:wght@700",
      weight: 700,
      style: "normal",
    },
    { name: "Noto Sans", font: "Noto+Sans", weight: 400, style: "normal" },
    {
      name: "Noto Sans",
      font: "Noto+Sans:wght@700",
      weight: 700,
      style: "normal",
    },
  ];
  // ...
}
```

> 查看[这个 PR](https://github.com/satnaing/astro-paper/pull/318) 了解更多信息。

## 权衡

虽然这是一个很好的功能，但也有权衡。每个 OG 图片大约需要一秒钟来生成。一开始可能不太明显，但随着博客文章数量的增长，你可能想要禁用此功能。由于每个 OG 图片都需要时间生成，拥有大量图片会线性增加构建时间。

例如：如果一个 OG 图片需要一秒钟生成，那么 60 个图片将需要大约一分钟，600 个图片将需要大约 10 分钟。随着内容规模的扩大，这会显著影响构建时间。

相关问题：[#428](https://github.com/satnaing/astro-paper/issues/428)

## 限制

在撰写本文时，[Satori](https://github.com/vercel/satori) 还相当新，尚未达到主要版本。因此，这个动态 OG 图片功能仍然存在一些限制。

- 此外，尚不支持 RTL 语言。
- 在标题中[使用表情符号](https://github.com/vercel/satori#emojis)可能有点棘手。
