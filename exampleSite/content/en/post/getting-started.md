---
title: "Getting Started with Hugo Paper"
description: "Learn how to set up and customize Hugo Paper theme for your blog"
date: 2024-11-11
draft: false
featured: true
author: "Hugo Paper Team"
authorBio: "The Hugo Paper development team"
image: "/images/getting-started.jpg"
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

```bash
# Using git submodule
git init
git submodule add https://github.com/ouraihub-hugo-themes/hugo-paper.git themes/hugo-paper

# Update hugo.toml
echo 'theme = "hugo-paper"' >> hugo.toml
```

## Configuration

### Basic Configuration

Edit your `hugo.toml` file:

```toml
baseURL = "https://yourdomain.com/"
languageCode = "en-us"
title = "My Awesome Blog"
theme = "hugo-paper"
```

### Customize Parameters

Create or edit `params.toml`:

```toml
[params]
[params.header]
logo = "/logo.svg"
logoText = "My Blog"

[params.footer]
copyright = "© 2024 My Blog. All rights reserved."
```

## Creating Content

### Create Your First Post

```bash
hugo new post/hello-world.md
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
hugo new about.md
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

Edit `assets/css/main.css` and modify the CSS variables in `:root`:

```css
:root {
  --color-primary: #0ea5e9;
  --color-accent: #f43f5e;
  /* ... more colors ... */
}
```

### Adding Custom CSS

Create `assets/css/custom.css` and import it in `main.css`:

```css
@import "custom.css";
```

## Next Steps

- Read the [Configuration Guide](/config/)
- Explore [Hugo Documentation](https://gohugo.io/documentation/)
- Customize the [CSS Variables](/customization/)

Happy blogging!
