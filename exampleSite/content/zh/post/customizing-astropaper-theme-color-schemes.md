---
title: "自定义 AstroPaper 主题配色方案"
description: "如何启用/禁用浅色和深色模式；以及如何自定义 AstroPaper 主题的配色方案。"
date: 2022-09-25T15:20:35Z
lastmod: 2025-06-13T16:46:34.155Z
author: "Sat Naing"
keywords:
  - astropaper
  - 配色方案
  - 深色模式
  - 浅色模式
  - 主题自定义
  - css变量
draft: false
featured: false
tags:
  - color-schemes
  - docs
---

这篇文章将解释如何为网站启用/禁用浅色和深色模式。此外，你还将学习如何自定义整个网站的配色方案。

## 目录

## 启用/禁用浅色和深色模式

AstroPaper 主题默认包含浅色和深色模式。换句话说，会有两种配色方案——一种用于浅色模式，另一种用于深色模式。可以在 `SITE` 配置对象中禁用此默认行为。

```js file="src/config.ts"
export const SITE = {
  website: "https://astro-paper.pages.dev/", // 替换为你的部署域名
  author: "Sat Naing",
  profile: "https://satnaing.dev/",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "AstroPaper",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true, // [!code highlight]
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 分钟
  showArchives: true,
  showBackButton: true, // 在文章详情页显示返回按钮
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en", // html lang 代码。设置为空则默认为 "en"
  timezone: "Asia/Bangkok", // 默认全局时区（IANA 格式）https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
```

要禁用 `浅色和深色模式`，将 `SITE.lightAndDarkMode` 设置为 `false`。

## 选择主要配色方案

默认情况下，如果我们禁用 `SITE.lightAndDarkMode`，我们只会获得系统的 prefers-color-scheme。

因此，要选择主要配色方案而不是 prefers-color-scheme，我们必须在 `toggle-theme.js` 中的 `primaryColorScheme` 变量中设置配色方案。

```js file="public/toggle-theme.js"
const primaryColorScheme = ""; // "light" | "dark" // [!code hl]

// 从本地存储获取主题数据
const currentTheme = localStorage.getItem("theme");

// ...
```

**primaryColorScheme** 变量可以保存两个值——`"light"`、`"dark"`。如果你不想指定主要配色方案，可以留空字符串（默认）。

- `""` - 系统的 prefers-color-scheme。（默认）
- `"light"` - 使用浅色模式作为主要配色方案。
- `"dark"` - 使用深色模式作为主要配色方案。

<details>
<summary>为什么 primaryColorScheme 不在 config.ts 中？</summary>
为了避免页面重新加载时的颜色闪烁，我们必须在页面加载时尽早放置主题切换 JavaScript 代码。这解决了闪烁问题，但作为权衡，我们不能再使用 ESM 导入。
</details>

## 自定义配色方案

AstroPaper 主题的浅色和深色配色方案都可以在 `global.css` 文件中自定义。

```css file="src/styles/global.css"
@import "tailwindcss";
@import "./typography.css";

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

:root,
html[data-theme="light"] {
  --background: #fdfdfd;
  --foreground: #282728;
  --accent: #006cac;
  --muted: #e6e6e6;
  --border: #ece9e9;
}

html[data-theme="dark"] {
  --background: #212737;
  --foreground: #eaedf3;
  --accent: #ff6b01;
  --muted: #343f60bf;
  --border: #ab4b08;
}
/* ... */
```

在 AstroPaper 主题中，`:root` 和 `html[data-theme="light"]` 选择器定义浅色配色方案，而 `html[data-theme="dark"]` 定义深色配色方案。

要自定义你自己的配色方案，在 `:root, html[data-theme="light"]` 中指定浅色颜色，在 `html[data-theme="dark"]` 中指定深色颜色。

以下是颜色属性的详细说明。

| 颜色属性       | 定义和用法                                     |
| -------------- | ---------------------------------------------- |
| `--background` | 网站的主要颜色。通常是主背景。                 |
| `--foreground` | 网站的次要颜色。通常是文本颜色。               |
| `--accent`     | 网站的强调色。链接颜色、悬停颜色等。           |
| `--muted`      | 卡片和滚动条背景颜色，用于悬停状态等。         |
| `--border`     | 边框颜色。特别用于水平线（hr）                 |

以下是更改浅色配色方案的示例。

```css file="src/styles/global.css"
/* ... */
:root,
html[data-theme="light"] {
  --background: #f6eee1;
  --foreground: #012c56;
  --accent: #e14a39;
  --muted: #efd8b0;
  --border: #dc9891;
}
/* ... */
```

> 查看 AstroPaper 已经为你准备的一些[预定义配色方案](https://astro-paper.pages.dev/posts/predefined-color-schemes/)。
