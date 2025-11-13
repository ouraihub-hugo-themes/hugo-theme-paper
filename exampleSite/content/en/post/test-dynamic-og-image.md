---
title: "Testing Dynamic OG Image Generation"
description: "This post tests the dynamic OG image generation feature using Unsplash API"
date: 2024-11-15
lastmod: 2024-11-15
draft: false
author: "Hugo Paper Team"
keywords:
  - hugo
  - programming
  - web-development
categories:
  - "Tutorial"
tags:
  - "test"
  - "og-image"
---

## Testing Dynamic OG Image

This post is created to test the dynamic OG image generation feature.

### Expected Behavior

Since this post has `keywords: ["hugo", "programming", "web-development"]`, the system should:

1. Extract the first 2 keywords (based on `keywordCount = 2`)
2. Generate an Unsplash URL: `https://source.unsplash.com/1200x630/?hugo,programming`
3. Use this URL as the OG image

### How to Verify

1. Build the site: `hugo`
2. Check the generated HTML in `public/post/test-dynamic-og-image/index.html`
3. Look for the `<meta property="og:image" content="...">` tag
4. Open the URL in a browser to see the image
5. Use social media debugging tools to verify

### Social Media Debuggers

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## Test Cases

### Test 1: With Keywords (This Post)
- **Keywords**: hugo, programming, web-development
- **Expected**: Unsplash image related to "hugo,programming"

### Test 2: With Manual Cover
Create a post with `cover: "/images/custom.jpg"` - should use the specified image.

### Test 3: No Keywords
Create a post without keywords - should use random Unsplash image (if `useRandomOnEmpty = true`).

### Test 4: Disabled Mode
Set `mode = "manual"` - should use fallback image.

## Conclusion

If you can see a relevant image when sharing this post on social media, the feature is working correctly!
