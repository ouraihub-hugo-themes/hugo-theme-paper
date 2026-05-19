---
title: "Adding new posts in HugoPaper theme"
date: 2022-09-23T15:22:00Z
lastmod: 2025-06-13T16:52:45Z
author: "Sat Naing"
description: "Some rules & recommendations for creating or adding new posts using HugoPaper theme."
keywords:
  - hugo
  - hugopaper
  - blog post
  - markdown
  - frontmatter
  - content creation
tags:
  - docs
categories:
  - Tutorial
featured: true
draft: false
---

Here are some rules/recommendations, tips & ticks for creating new posts in HugoPaper blog theme.

<figure>
  <img
    src="https://images.pexels.com/photos/159618/still-life-school-retro-ink-159618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    alt="Free Classic wooden desk with writing materials, vintage clock, and a leather bag. Stock Photo"
  />
    <figcaption class="text-center">
    Photo by <a href="https://www.pexels.com/photo/brown-wooden-desk-159618/">Pixabay</a>
  </figcaption>
</figure>

## Table of contents

## Creating a Blog Post

To write a new blog post, create a markdown file inside the `content/post/` directory.

You can organize blog posts into subdirectories, making it easier to manage your content.

For example, if you want to group posts under `2025`, you can place them in `content/post/2025/`. Hugo will automatically generate the appropriate URLs.

```bash {filename="Example"}
# Example: blog post structure and URLs
content/post/very-first-post.md          -> mysite.com/post/very-first-post
content/post/2025/example-post.md        -> mysite.com/post/2025/example-post
content/post/docs/how-to.md              -> mysite.com/post/docs/how-to
```

> 💡 Tip: You can override a blog post's slug in the frontmatter using the `slug` parameter.

## Frontmatter

Frontmatter is the main place to store some important information about the blog post (article). Frontmatter lies at the top of the article and is written in YAML format. Read more about frontmatter and its usage in [Hugo documentation](https://gohugo.io/content-management/front-matter/).

Here is the list of frontmatter property for each post.

| Property           | Description                                                                                     | Remark                        |
| ------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------- |
| **_title_**        | Title of the post. (h1)                                                                         | required<sup>\*</sup>         |
| **_description_**  | Description of the post. Used in post excerpt and site description of the post.                 | required<sup>\*</sup>         |
| **_date_**         | Published datetime in ISO 8601 format.                                                          | required<sup>\*</sup>         |
| **_lastmod_**      | Modified datetime in ISO 8601 format. (only add this property when a blog post is modified)    | optional                      |
| **_author_**       | Author of the post.                                                                             | default = site author         |
| **_slug_**         | Slug for the post. This field is optional.                                                      | default = slugified file name |
| **_featured_**     | Whether or not display this post in featured section of home page                               | default = false               |
| **_draft_**        | Mark this post 'unpublished'.                                                                   | default = false               |
| **_tags_**         | Related keywords for this post. Written in array yaml format.                                   | default = []                  |
| **_categories_**   | Categories for this post. Written in array yaml format.                                         | default = []                  |
| **_image_**        | Featured image of the post. Useful for social media sharing and SEO.                            | optional                      |
| **_hideEditPost_** | Hide editPost button under blog title. This applies only to the current blog post.              | default = false               |

Only `title`, `description` and `date` fields in frontmatter must be specified.

Title and description (excerpt) are important for search engine optimization (SEO) and thus HugoPaper encourages to include these in blog posts.

`slug` is the unique identifier of the url. Thus, `slug` must be unique and different from other posts. The whitespace of `slug` should to be separated with `-` or `_` but `-` is recommended. Slug is automatically generated using the blog post file name. However, you can define your `slug` as a frontmatter in your blog post.

If you omit `tags` in a blog post (in other words, if no tag is specified), the post will have no tags.

### Sample Frontmatter

Here is the sample frontmatter for a post.

```yaml
---
title: "The title of the post"
author: "your name"
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
description: "This is the example description of the example post."
---
```

## Adding table of contents

By default, a post (article) does not include any table of contents (toc). To include toc, you have to specify it in a specific way.

Write `Table of contents` in h2 format (## in markdown) and place it where you want it to be appeared on the post.

For instance, if you want to place your table of contents just under the intro paragraph (like I usually do), you can do that in the following way.

```md
---
# frontmatter
---

Here are some recommendations, tips & ticks for creating new posts in HugoPaper blog theme.

## Table of contents

<!-- the rest of the post -->
```

## Headings

There's one thing to note about headings. The HugoPaper blog posts use title (title in the frontmatter) as the main heading of the post. Therefore, the rest of the heading in the post should be using h2 \~ h6.

This rule is not mandatory, but highly recommended for visual, accessibility and SEO purposes.

## Syntax Highlighting

HugoPaper uses [Chroma](https://github.com/alecthomas/chroma) as the default syntax highlighting. You can configure the syntax highlighting theme in your `hugo.toml` file.

```toml
[markup]
  [markup.highlight]
    style = "monokai"
    lineNos = false
    lineNumbersInTable = false
```

## Storing Images for Blog Content

Here are two methods for storing images and displaying them inside a markdown file.

### Inside `static/` directory

You can store images inside the `static/` directory. These images will be served as-is without optimization.

For these images, you should use an absolute path; and these images can be displayed using [markdown annotation](https://www.markdownguide.org/basic-syntax/#images-1) or [HTML img tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img).

Example: Assume `example.jpg` is located at `/static/images/example.jpg`.

```md
![something](/images/example.jpg)

<!-- OR -->

<img src="/images/example.jpg" alt="something">
```

### Inside `assets/` directory (recommended)

You can store images inside `assets/` directory. These images can be processed by Hugo's image processing pipeline.

Example: Suppose you want to display `example.jpg` whose path is `/assets/images/example.jpg`.

```md
![something](/images/example.jpg)
```

## Bonus

### Image compression

When you put images in the blog post (especially for images under `static` directory), it is recommended that the image is compressed. This will affect the overall performance of the website.

My recommendation for image compression sites.

- [TinyPng](https://tinypng.com/)
- [TinyJPG](https://tinyjpg.com/)

### Featured Image

The default OG image will be placed if a post does not specify the featured image. Though not required, a featured image related to the post should be specified in the frontmatter. The recommended size for OG image is **_1200 X 640_** px.
