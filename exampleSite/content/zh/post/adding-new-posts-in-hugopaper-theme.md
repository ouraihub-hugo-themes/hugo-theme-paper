---
title: "在 HugoPaper 主题中添加新文章"
slug: "adding-new-posts-in-hugopaper-theme"
date: 2022-09-23T15:22:00Z
lastmod: 2025-06-13T16:52:45Z
author: "Sat Naing"
description: "使用 HugoPaper 主题创建或添加新文章的一些规则和建议。"
keywords:
  - hugo
  - hugopaper
  - 博客文章
  - markdown
  - frontmatter
  - 内容创建
tags:
  - docs
categories:
  - Tutorial
featured: true
draft: false
---

以下是在 HugoPaper 博客主题中创建新文章的一些规则/建议、技巧和窍门。

<figure>
  <img
    src="https://images.pexels.com/photos/159618/still-life-school-retro-ink-159618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    alt="经典木质书桌与书写材料、复古时钟和皮包"
  />
    <figcaption class="text-center">
    图片来自 <a href="https://www.pexels.com/photo/brown-wooden-desk-159618/">Pixabay</a>
  </figcaption>
</figure>

## 目录

## 创建博客文章

要编写新的博客文章，请在 `content/post/` 目录中创建一个 markdown 文件。

你可以将博客文章组织到子目录中，这样更容易管理内容。

例如，如果你想将文章分组到 `2025` 下，可以将它们放在 `content/post/2025/` 中。Hugo 会自动生成相应的 URL。

```bash {filename="示例"}
# 示例：博客文章结构和 URL
content/post/very-first-post.md          -> mysite.com/post/very-first-post
content/post/2025/example-post.md        -> mysite.com/post/2025/example-post
content/post/docs/how-to.md              -> mysite.com/post/docs/how-to
```

> 💡 提示：你可以在 frontmatter 中使用 `slug` 参数覆盖博客文章的 slug。

## 前置元数据

Front Matter 是存储博客文章（文章）重要信息的主要位置。Front Matter 位于文章顶部，以 YAML 格式编写。在 [Hugo 文档](https://gohugo.io/content-management/front-matter/)中了解更多关于 frontmatter 及其用法的信息。

以下是每篇文章的 frontmatter 属性列表。

| 属性               | 描述                                                                     | 备注                      |
| ------------------ | ------------------------------------------------------------------------ | ------------------------- |
| **_title_**        | 文章标题（h1）                                                           | 必需<sup>\*</sup>         |
| **_description_**  | 文章描述。用于文章摘要和文章的网站描述。                                 | 必需<sup>\*</sup>         |
| **_date_**         | ISO 8601 格式的发布日期时间。                                            | 必需<sup>\*</sup>         |
| **_lastmod_**      | ISO 8601 格式的修改日期时间。（仅在博客文章被修改时添加此属性）          | 可选                      |
| **_author_**       | 文章作者。                                                               | 默认 = 网站作者           |
| **_slug_**         | 文章的 slug。此字段是可选的。                                            | 默认 = slug 化的文件名    |
| **_featured_**     | 是否在首页的精选部分显示此文章                                           | 默认 = false              |
| **_draft_**        | 将此文章标记为"未发布"。                                                 | 默认 = false              |
| **_tags_**         | 此文章的相关关键词。以 yaml 数组格式编写。                               | 默认 = []                 |
| **_categories_**   | 此文章的分类。以 yaml 数组格式编写。                                     | 默认 = []                 |
| **_image_**        | 文章的特色图片。对社交媒体分享和 SEO 有用。                              | 可选                      |
| **_hideEditPost_** | 隐藏博客标题下的编辑文章按钮。这仅适用于当前博客文章。                   | 默认 = false              |

frontmatter 中只有 `title`、`description` 和 `date` 字段必须指定。

标题和描述（摘要）对搜索引擎优化（SEO）很重要，因此 HugoPaper 鼓励在博客文章中包含这些内容。

`slug` 是 URL 的唯一标识符。因此，`slug` 必须是唯一的，与其他文章不同。`slug` 的空格应该用 `-` 或 `_` 分隔，但推荐使用 `-`。Slug 会使用博客文章文件名自动生成。但是，你可以在博客文章的 frontmatter 中定义自己的 `slug`。

如果你在博客文章中省略 `tags`（换句话说，如果没有指定标签），该文章将没有标签。

### Front Matter 示例

以下是文章的 frontmatter 示例。

```yaml
---
title: "文章标题"
author: "你的名字"
date: 2022-09-21T05:17:19Z
lastmod: 2023-01-15T10:30:00Z
slug: "the-title-of-the-post"
featured: true
draft: false
tags:
  - some
  - example
  - tags
categories:
  - Tutorial
image: "/images/example.png"
description: "这是示例文章的示例描述。"
---
```

## 添加目录

默认情况下，文章不包含任何目录（toc）。要包含目录，你必须以特定方式指定它。

以 h2 格式（markdown 中的 ##）编写 `目录`，并将其放置在你希望它出现在文章中的位置。

例如，如果你想将目录放在介绍段落下方（就像我通常做的那样），你可以按以下方式操作。

```md
---
# frontmatter
---

以下是在 HugoPaper 博客主题中创建新文章的一些建议、技巧和窍门。

## 目录

<!-- 文章的其余部分 -->
```

## 标题

关于标题有一点需要注意。HugoPaper 博客文章使用标题（frontmatter 中的 title）作为文章的主标题。因此，文章中的其余标题应该使用 h2 \~ h6。

这个规则不是强制性的，但出于视觉、可访问性和 SEO 目的，强烈推荐。

## 语法高亮

HugoPaper 使用 [Chroma](https://github.com/alecthomas/chroma) 作为默认语法高亮。你可以在 `hugo.toml` 文件中配置语法高亮主题。

```toml
[markup]
  [markup.highlight]
    style = "monokai"
    lineNos = false
    lineNumbersInTable = false
```

## 存储博客内容的图片

以下是存储图片并在 markdown 文件中显示它们的两种方法。

### 在 `static/` 目录中

你可以将图片存储在 `static/` 目录中。这些图片将按原样提供，不进行优化。

对于这些图片，你应该使用绝对路径；这些图片可以使用 [markdown 注释](https://www.markdownguide.org/basic-syntax/#images-1)或 [HTML img 标签](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)显示。

示例：假设 `example.jpg` 位于 `/static/images/example.jpg`。

```md
![something](/images/example.jpg)

<!-- 或 -->

<img src="/images/example.jpg" alt="something">
```

### 在 `assets/` 目录中（推荐）

你可以将图片存储在 `assets/` 目录中。这些图片可以通过 Hugo 的图片处理管道进行处理。

示例：假设你想显示路径为 `/assets/images/example.jpg` 的 `example.jpg`。

```md
![something](/images/example.jpg)
```

## 额外提示

### 图片压缩

当你在博客文章中放置图片时（特别是对于 `static` 目录下的图片），建议压缩图片。这将影响网站的整体性能。

我推荐的图片压缩网站。

- [TinyPng](https://tinypng.com/)
- [TinyJPG](https://tinyjpg.com/)

### 特色图片

如果文章没有指定特色图片，将使用默认的 OG 图片。虽然不是必需的，但应该在 frontmatter 中指定与文章相关的特色图片。OG 图片的推荐尺寸是 **_1200 X 640_** px。
