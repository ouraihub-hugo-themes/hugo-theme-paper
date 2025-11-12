---
title: "Tailwind CSS v4 Best Practices"
description: "Discover best practices for working with Tailwind CSS v4 in Hugo Paper"
date: 2024-11-10
draft: false
featured: true
author: "Hugo Paper Team"
image: "/images/tailwind-v4.jpg"
categories:
  - "Development"
tags:
  - "tailwind"
  - "css"
  - "tips"
---

## Introduction

Tailwind CSS v4 brings powerful new features and improvements. Let's explore some best practices for using it effectively in your Hugo Paper projects.

## Utility-First Approach

The core philosophy of Tailwind CSS is utility-first. Instead of writing custom CSS, you compose styles using utility classes.

### Good Example

```html
<div class="flex items-center justify-between p-4 bg-primary text-white rounded-lg">
  <h2 class="text-lg font-bold">Title</h2>
  <button class="px-4 py-2 bg-white text-primary rounded hover:bg-gray-100 transition-colors">
    Action
  </button>
</div>
```

### Avoid Custom CSS for Simple Styles

❌ **Don't do this:**

```css
.card {
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

✅ **Do this instead:**

```html
<div class="p-4 rounded-lg shadow-sm">...</div>
```

## Component Extraction

When styles are repeated, extract them into components or use `@apply`.

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary text-white rounded-lg font-medium 
           hover:bg-accent transition-colors duration-200;
  }
}
```

Then use it:

```html
<button class="btn-primary">Click me</button>
```

## Responsive Design

Tailwind makes responsive design simple with breakpoint prefixes:

```html
<!-- Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- content -->
</div>
```

## Dark Mode

Hugo Paper includes dark mode support using CSS variables:

```html
<!-- This will automatically adjust for dark mode -->
<div class="bg-background text-foreground">
  <p class="text-muted">This text adjusts based on theme</p>
</div>
```

## Performance Tips

### 1. Avoid Arbitrary Values When Possible

❌ Avoid: `class="w-[347px]"`  
✅ Prefer: `class="w-full max-w-md"`

### 2. Use Content Configuration

Make sure your `tailwind.config.js` has the correct content paths:

```js
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.md',
  ],
}
```

### 3. Purge Unused Styles

Production builds automatically remove unused CSS:

```bash
hugo --minify
```

## Animation and Transitions

Tailwind includes built-in animations:

```html
<!-- Fade in animation -->
<div class="animate-fade-in">Fading in...</div>

<!-- Smooth color transition -->
<button class="bg-primary hover:bg-accent transition-colors duration-200">
  Hover me
</button>
```

## Customization

Extend Tailwind with custom utilities:

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'brand': '#your-color',
    },
    spacing: {
      '128': '32rem',
    },
  },
}
```

## Common Mistakes to Avoid

1. **Mixing utility and custom CSS** - Stick to utilities
2. **Not using component extraction** - Use `@apply` for repeated patterns
3. **Ignoring responsive design** - Always design mobile-first
4. **Overusing arbitrary values** - Extend config instead

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Hugo Paper Customization Guide](/config/)
- [Tailwind UI Components](https://tailwindui.com)

Happy styling!
