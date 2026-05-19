---
title: "Getting Started with Hugo Paper"
description: "Learn how to set up and customize Hugo Paper theme for your blog"
date: 2024-11-11
lastmod: 2024-11-15
draft: false
featured: true
author: "Hugo Paper Team"
authorBio: "The Hugo Paper development team"
image: "/images/getting-started.jpg"
keywords:
  - hugo paper
  - hugo theme
  - getting started
  - installation
  - setup guide
  - static site generator
categories:
  - "Tutorial"
tags:
  - "hugo"
  - "setup"
  - "guide"
---

## Introduction

Hugo Paper is a minimal, fast, and responsive Hugo theme designed for bloggers and developers. This guide will help you get started with the theme quickly.

## Installation

### Step 1: Download Hugo Paper

First, you need to have Hugo installed on your system. If you haven't installed Hugo yet, visit the [official Hugo website](https://gohugo.io/installation/).

### Step 2: Create a New Site

```bash
hugo new site my-blog
cd my-blog
```

### Step 3: Add Hugo Paper Theme

**Option 1: Using Hugo Modules (Recommended)**

```bash
# Initialize Hugo Modules
hugo mod init github.com/yourusername/my-blog

# Add to hugo.toml
echo '[module]
[[module.imports]]
  path = "github.com/ouraihub-hugo-themes/hugo-theme-paper"' >> hugo.toml

# Download theme
hugo mod get
```

**Option 2: Using Git Submodule**

```bash
git init
git submodule add https://github.com/ouraihub-hugo-themes/hugo-paper.git themes/hugo-paper
echo 'theme = "hugo-paper"' >> hugo.toml
```

## Configuration

Hugo Paper uses separate configuration files for better clarity and maintainability.

### Basic Configuration

Edit `config/_default/hugo.toml`:

```toml
baseURL = "https://yourdomain.com/"
languageCode = "en-us"
title = "My Awesome Blog"
theme = "hugo-paper"  # if using git submodule
```

### Theme Parameters

Edit `config/_default/params.toml`:

```toml
description = "My personal blog"
showArchives = true
showBackButton = true
lightAndDarkMode = true  # Enable theme switching

# Social links
[[social]]
  name = "GitHub"
  href = "https://github.com/yourusername"
  linkTitle = "Follow on GitHub"
```

### Multilingual Setup

Edit `config/_default/languages.toml`:

```toml
[en]
  languageName = "English"
  languageCode = "en"
  weight = 1
  title = "My Blog"
  contentDir = "content/en"
```

### Menu Configuration

Edit `config/_default/menus.en.toml`:

```toml
[[main]]
  name = "Home"
  url = "/"
  weight = 1

[[main]]
  name = "Posts"
  url = "/post/"
  weight = 2
```

## Creating Content

### Create Your First Post

```bash
# Using built-in scripts (recommended)
pnpm new-post "Hello World" en

# Or using Hugo command
hugo new content/en/post/hello-world.md
```

Edit the generated file:

```markdown
---
title: "Hello World"
description: "My first blog post"
date: 2024-11-11
draft: false
categories:
  - "Welcome"
tags:
  - "hello"
---

This is my first post!
```

### Create a Page

```bash
hugo new content/en/about.md
```

## Running Locally

```bash
# Development server with live reload
hugo server

# Build for production
hugo
```

Visit `http://localhost:1313` to see your site.

## Customization

### Changing Colors

Hugo Paper uses CSS variables for theming.

**Step 1: Create Custom CSS File**

Create `static/css/custom.css` in your project:

```css
/* Custom colors */
:root {
  --color-fill: 251, 254, 251;
  --color-accent: 0, 108, 172;
  --color-accent-2: 13, 148, 136;
}

[data-theme="dark"] {
  --color-fill: 33, 39, 55;
  --color-accent: 255, 107, 1;
}
```

**Step 2: Reference in Configuration**

Edit `config/_default/params.toml`:

```toml
# Custom CSS files
customCSS = ["css/custom.css"]
```

> 💡 Tip: You can add multiple custom CSS files:
> ```toml
> customCSS = ["css/custom.css", "css/fonts.css"]
> ```

### Using Built-in Scripts

Hugo Paper provides convenient scripts for creating posts:

```bash
# Interactive creation (recommended)
pnpm new-post

# Quick creation
pnpm quick-post "Article Title" en
```

## Next Steps

- Read the [Configuration Guide](/config/)
- Explore [Hugo Documentation](https://gohugo.io/documentation/)
- Customize the [CSS Variables](/customization/)

Happy blogging!
