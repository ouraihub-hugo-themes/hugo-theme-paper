# 动态 OG 图片 - 快速实施指南

本文档是 `DYNAMIC-OG-IMAGE-DESIGN.md` 的实施版本，提供具体的代码和步骤。

---

## 🚀 快速开始（5分钟）

### 步骤 1: 添加配置

编辑 `config/_default/params.toml`，添加：

```toml
# ===== 动态 OG 图片配置 =====
[ogImage]
  mode = "unsplash"  # 启用 Unsplash 动态图片
  fallback = "/images/og-default.jpg"  # 兜底图片
  
  [ogImage.unsplash]
    keywordSource = "keywords"  # 从 keywords 字段提取关键词
    keywordCount = 2  # 使用前 2 个关键词
    width = 1200
    height = 630
    quality = 80
    useRandomOnEmpty = true  # 无关键词时使用随机图
```

### 步骤 2: 创建 Partial 模板

创建文件 `layouts/partials/head/og-image.html`：

```go-html-template
{{- /* 
  动态 OG 图片生成
  优先级: cover > image > 动态生成 > fallback
*/ -}}

{{- $ogImage := "" -}}

{{- /* 优先级 1: 文章指定的 cover */ -}}
{{- if .Params.cover -}}
  {{- $ogImage = .Params.cover | absURL -}}
  
{{- /* 优先级 2: 文章指定的 image */ -}}
{{- else if .Params.image -}}
  {{- $ogImage = .Params.image | absURL -}}
  
{{- /* 优先级 3: 动态生成 */ -}}
{{- else if .Site.Params.ogImage -}}
  {{- $mode := .Site.Params.ogImage.mode | default "manual" -}}
  
  {{- if eq $mode "unsplash" -}}
    {{- $config := .Site.Params.ogImage.unsplash -}}
    {{- $keywords := slice -}}
    
    {{- /* 提取关键词 */ -}}
    {{- $source := $config.keywordSource | default "keywords" -}}
    {{- if eq $source "keywords" -}}
      {{- $keywords = .Params.keywords -}}
    {{- else if eq $source "tags" -}}
      {{- $keywords = .Params.tags -}}
    {{- else if eq $source "categories" -}}
      {{- $keywords = .Params.categories -}}
    {{- else if eq $source "title" -}}
      {{- /* 将标题分词 */ -}}
      {{- $words := split .Title " " -}}
      {{- $keywords = first 3 $words -}}
    {{- end -}}
    
    {{- /* 构建 Unsplash URL */ -}}
    {{- $width := $config.width | default 1200 -}}
    {{- $height := $config.height | default 630 -}}
    
    {{- if $keywords -}}
      {{- $count := $config.keywordCount | default 2 -}}
      {{- $selectedKeywords := first $count $keywords -}}
      {{- $query := delimit $selectedKeywords "," -}}
      {{- $ogImage = printf "https://source.unsplash.com/%dx%d/?%s" $width $height $query -}}
    {{- else if $config.useRandomOnEmpty -}}
      {{- $ogImage = printf "https://source.unsplash.com/%dx%d/random" $width $height -}}
    {{- end -}}
  {{- end -}}
  
  {{- /* 优先级 4: 站点默认图片 */ -}}
  {{- if and (not $ogImage) .Site.Params.ogImage.fallback -}}
    {{- $ogImage = .Site.Params.ogImage.fallback | absURL -}}
  {{- end -}}
{{- end -}}

{{- /* 输出 meta 标签 */ -}}
{{- if $ogImage -}}
<meta property="og:image" content="{{ $ogImage }}" />
<meta property="twitter:image" content="{{ $ogImage }}" />
{{- with .Site.Params.ogImage.unsplash -}}
<meta property="og:image:width" content="{{ .width | default 1200 }}" />
<meta property="og:image:height" content="{{ .height | default 630 }}" />
{{- end -}}
{{- end -}}
```

### 步骤 3: 集成到 baseof.html

在 `layouts/_default/baseof.html` 的 `<head>` 部分，找到现有的 OG 图片标签并替换：

**查找：**
```html
{{- if .Params.image }}
  <meta property="og:image" content="{{ .Params.image | absURL }}" />
{{- else if .Site.Params.ogImage }}
  <meta property="og:image" content="{{ .Site.Params.ogImage | absURL }}" />
{{- end }}
```

**替换为：**
```html
{{ partial "head/og-image.html" . }}
```

---

## 📝 使用示例

### 示例 1: 使用关键词（推荐）

```yaml
---
title: "Hugo 建站教程"
keywords:
  - hugo
  - static-site
  - tutorial
---
```

**生成的图片 URL:**
```
https://source.unsplash.com/1200x630/?hugo,static-site
```

### 示例 2: 使用标签

**配置:**
```toml
[ogImage.unsplash]
  keywordSource = "tags"
```

**文章:**
```yaml
---
title: "我的文章"
tags:
  - photography
  - nature
---
```

**生成的图片 URL:**
```
https://source.unsplash.com/1200x630/?photography,nature
```

### 示例 3: 手动指定（优先级最高）

```yaml
---
title: "特殊文章"
cover: "/images/custom-cover.jpg"
---
```

**结果:** 使用指定的图片，不会动态生成。

---

## 🧪 测试

### 1. 创建测试文章

```bash
hugo new post/test-dynamic-og.md
```

### 2. 编辑文章

```yaml
---
title: "测试动态 OG 图片"
keywords:
  - test
  - hugo
---

这是测试文章。
```

### 3. 构建并检查

```bash
hugo
```

### 4. 查看生成的 HTML

```bash
cat public/post/test-dynamic-og/index.html | grep "og:image"
```

**预期输出:**
```html
<meta property="og:image" content="https://source.unsplash.com/1200x630/?test,hugo" />
```

### 5. 验证图片

在浏览器中打开：
```
https://source.unsplash.com/1200x630/?test,hugo
```

应该看到一张相关的图片。

---

## 🔧 配置选项详解

### mode 选项

| 值 | 说明 | 使用场景 |
|----|------|---------|
| `manual` | 手动模式（默认） | 向后兼容，不使用动态生成 |
| `unsplash` | Unsplash 动态图片 | 推荐，免费且高质量 |
| `generated` | 外部生成服务 | 需要带文字的图片 |

### keywordSource 选项

| 值 | 说明 | 示例 |
|----|------|------|
| `keywords` | 使用 frontmatter 的 keywords | `keywords: ["hugo", "blog"]` |
| `tags` | 使用 frontmatter 的 tags | `tags: ["tech", "tutorial"]` |
| `categories` | 使用 frontmatter 的 categories | `categories: ["Development"]` |
| `title` | 使用文章标题 | `title: "Hugo Tutorial"` |

---

## 🐛 故障排除

### 问题 1: 图片不显示

**检查：**
1. 配置是否正确添加
2. partial 文件是否创建
3. baseof.html 是否正确引用

**调试：**
```bash
hugo --logLevel debug
```

### 问题 2: 生成的 URL 不正确

**检查：**
1. keywords 字段是否存在
2. keywordSource 配置是否正确
3. 查看生成的 HTML 源代码

**手动测试 URL:**
```
https://source.unsplash.com/1200x630/?your,keywords
```

### 问题 3: 图片质量不好

**调整配置:**
```toml
[ogImage.unsplash]
  width = 1920  # 增加宽度
  height = 1080  # 增加高度
  quality = 95  # 提高质量
```

---

## 📊 性能考虑

### Unsplash 限制

- 每小时 50 次请求
- 对于静态网站足够（图片 URL 在构建时生成）

### 优化建议

1. **使用 CDN**
   - Unsplash 自带 CDN
   - 无需额外配置

2. **缓存策略**
   - 浏览器会自动缓存图片
   - 社交媒体平台会缓存 OG 图片

3. **备用方案**
   - 始终配置 fallback 图片
   - 确保在 API 失败时有图片可用

---

## ✅ 完成检查清单

- [ ] 配置已添加到 `params.toml`
- [ ] `og-image.html` partial 已创建
- [ ] `baseof.html` 已更新
- [ ] 测试文章已创建
- [ ] 构建成功
- [ ] 生成的 URL 正确
- [ ] 图片可以正常加载
- [ ] 社交媒体分享测试通过

---

## 🔄 回滚方案

如果需要回滚到原来的方式：

1. **禁用动态生成:**
   ```toml
   [ogImage]
     mode = "manual"
   ```

2. **或者删除配置:**
   删除 `[ogImage]` 整个部分

3. **恢复 baseof.html:**
   将 `{{ partial "head/og-image.html" . }}` 改回原来的代码

---

**实施时间**: 约 10-15 分钟  
**难度**: ⭐⭐☆☆☆ (简单)  
**推荐度**: ⭐⭐⭐⭐⭐
