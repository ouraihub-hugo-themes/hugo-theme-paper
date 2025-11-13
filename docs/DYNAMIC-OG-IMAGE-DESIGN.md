# 动态 OG 图片生成 - 详细设计文档

## 📋 文档信息

- **版本**: 1.0.0
- **创建日期**: 2024-11-15
- **作者**: Hugo Paper Team
- **目标**: 为 Hugo 主题实现智能的动态 OG 图片生成功能

---

## 🎯 功能概述

### 什么是 OG 图片？

OG (Open Graph) 图片是社交媒体分享时显示的预览图片。当用户在 Twitter、Facebook、微信等平台分享链接时，会自动显示这张图片。

### 问题陈述

**当前痛点：**
1. 每篇文章都需要手动创建 OG 图片（耗时）
2. 没有图片时使用统一的默认图片（不够个性化）
3. 手动管理大量图片文件（维护成本高）

**解决方案：**
自动根据文章内容（标题、关键词、分类等）从免费图片 API 获取相关图片作为 OG 图片。

---

## 🏗️ 系统架构

### 整体流程图

```
文章 Frontmatter
    ↓
检查是否有 cover/image 字段
    ↓ 没有
检查 ogImage 配置模式
    ↓
根据配置提取关键词
    ↓
生成图片 API URL
    ↓
在 HTML meta 标签中使用
```

### 优先级逻辑

```
优先级 1: .Params.cover (文章指定的封面)
    ↓ 如果没有
优先级 2: .Params.image (文章指定的图片)
    ↓ 如果没有
优先级 3: 动态生成 (根据关键词从 API 获取)
    ↓ 如果失败
优先级 4: .Site.Params.ogImage (站点默认图片)
```

---

## 📝 配置设计

### 配置文件结构

**文件位置**: `config/_default/params.toml`

```toml
# ===== 动态 OG 图片配置 =====
[ogImage]
  # 模式选择
  # "manual" - 手动指定（默认，向后兼容）
  # "unsplash" - 从 Unsplash 自动获取
  # "pexels" - 从 Pexels 自动获取（需要 API key）
  # "generated" - 使用外部生成服务（如 Vercel OG）
  mode = "unsplash"
  
  # 默认图片（当所有方法都失败时使用）
  fallback = "/images/og-default.jpg"
  
  # Unsplash 配置
  [ogImage.unsplash]
    # 从哪个字段提取关键词
    # "keywords" - 使用 frontmatter 的 keywords 数组
    # "tags" - 使用 frontmatter 的 tags 数组
    # "categories" - 使用 frontmatter 的 categories 数组
    # "title" - 使用文章标题
    keywordSource = "keywords"
    
    # 使用多少个关键词（1-5）
    keywordCount = 2
    
    # 图片尺寸
    width = 1200
    height = 630
    
    # 图片质量 (1-100)
    quality = 80
    
    # 是否使用随机图片（当关键词为空时）
    useRandomOnEmpty = true
    
  # Pexels 配置（需要 API key）
  [ogImage.pexels]
    apiKey = ""  # 在 https://www.pexels.com/api/ 获取
    keywordSource = "keywords"
    keywordCount = 2
    width = 1200
    height = 630
    
  # 外部生成服务配置
  [ogImage.generated]
    # 服务 URL 模板
    # 可用变量: {{title}}, {{author}}, {{site}}
    template = "https://og-image.vercel.app/{{title}}.png?theme=light&md=1"
```

### 配置参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | string | "manual" | 图片获取模式 |
| `fallback` | string | "" | 兜底图片路径 |
| `keywordSource` | string | "keywords" | 关键词来源字段 |
| `keywordCount` | int | 2 | 使用的关键词数量 |
| `width` | int | 1200 | 图片宽度（推荐 1200） |
| `height` | int | 630 | 图片高度（推荐 630） |
| `quality` | int | 80 | 图片质量 |
| `useRandomOnEmpty` | bool | true | 无关键词时使用随机图 |

---

## 🔧 实现细节

### 1. 模板文件修改

**文件**: `layouts/_default/baseof.html` 或 `layouts/partials/head/seo.html`

**位置**: Open Graph meta 标签部分

### 2. 核心逻辑实现

```go-html-template
{{- /* 动态 OG 图片生成逻辑 */ -}}
{{- $ogImage := "" -}}

{{- /* 优先级 1: 文章指定的 cover */ -}}
{{- if .Params.cover -}}
  {{- $ogImage = .Params.cover | absURL -}}
  
{{- /* 优先级 2: 文章指定的 image */ -}}
{{- else if .Params.image -}}
  {{- $ogImage = .Params.image | absURL -}}
  
{{- /* 优先级 3: 动态生成 */ -}}
{{- else if and .Site.Params.ogImage (ne .Site.Params.ogImage.mode "manual") -}}
  {{- $mode := .Site.Params.ogImage.mode -}}
  
  {{- if eq $mode "unsplash" -}}
    {{- /* Unsplash 动态图片 */ -}}
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
      {{- $keywords = slice .Title -}}
    {{- end -}}
    
    {{- /* 构建 Unsplash URL */ -}}
    {{- if $keywords -}}
      {{- $count := $config.keywordCount | default 2 -}}
      {{- $selectedKeywords := first $count $keywords -}}
      {{- $query := delimit $selectedKeywords "," -}}
      {{- $width := $config.width | default 1200 -}}
      {{- $height := $config.height | default 630 -}}
      {{- $quality := $config.quality | default 80 -}}
      {{- $ogImage = printf "https://source.unsplash.com/%dx%d/?%s&q=%d" $width $height $query $quality -}}
    {{- else if $config.useRandomOnEmpty -}}
      {{- /* 无关键词时使用随机图 */ -}}
      {{- $width := $config.width | default 1200 -}}
      {{- $height := $config.height | default 630 -}}
      {{- $ogImage = printf "https://source.unsplash.com/%dx%d/random" $width $height -}}
    {{- end -}}
    
  {{- else if eq $mode "pexels" -}}
    {{- /* Pexels 动态图片（需要 API key） */ -}}
    {{- /* 注意: Pexels 需要服务端 API 调用，Hugo 无法直接实现 */ -}}
    {{- /* 建议使用 Hugo Pipes 或外部脚本预生成 */ -}}
    
  {{- else if eq $mode "generated" -}}
    {{- /* 外部生成服务 */ -}}
    {{- $template := .Site.Params.ogImage.generated.template -}}
    {{- $title := .Title | urlize -}}
    {{- $author := .Site.Params.author | default "Author" -}}
    {{- $site := .Site.Title -}}
    {{- $ogImage = replace $template "{{title}}" $title -}}
    {{- $ogImage = replace $ogImage "{{author}}" $author -}}
    {{- $ogImage = replace $ogImage "{{site}}" $site -}}
  {{- end -}}
  
{{- /* 优先级 4: 站点默认图片 */ -}}
{{- else if .Site.Params.ogImage.fallback -}}
  {{- $ogImage = .Site.Params.ogImage.fallback | absURL -}}
{{- end -}}

{{- /* 输出 OG 图片 meta 标签 */ -}}
{{- if $ogImage -}}
<meta property="og:image" content="{{ $ogImage }}" />
<meta property="twitter:image" content="{{ $ogImage }}" />
<meta property="og:image:width" content="{{ .Site.Params.ogImage.unsplash.width | default 1200 }}" />
<meta property="og:image:height" content="{{ .Site.Params.ogImage.unsplash.height | default 630 }}" />
{{- end -}}
```

---

## 🌐 支持的图片 API

### 1. Unsplash Source API

**优点：**
- ✅ 完全免费
- ✅ 无需 API key
- ✅ 高质量图片
- ✅ 支持关键词搜索
- ✅ 支持随机图片

**URL 格式：**
```
https://source.unsplash.com/{width}x{height}/?{keywords}
```

**示例：**
```
https://source.unsplash.com/1200x630/?hugo,programming
https://source.unsplash.com/1200x630/random
```

**限制：**
- 每小时 50 次请求（对于静态网站足够）

### 2. Pexels API

**优点：**
- ✅ 免费
- ✅ 高质量图片
- ✅ 支持关键词搜索

**缺点：**
- ❌ 需要 API key
- ❌ 需要服务端调用（Hugo 无法直接实现）

**建议：**
使用构建时脚本预生成图片 URL

### 3. 外部生成服务

**示例服务：**
- Vercel OG Image: `https://og-image.vercel.app/`
- Cloudinary: `https://res.cloudinary.com/`

**优点：**
- ✅ 可以生成带文字的图片
- ✅ 高度可定制

**缺点：**
- ❌ 可能需要付费
- ❌ 依赖外部服务

---

## 📊 使用示例

### 示例 1: 使用关键词

**文章 Frontmatter:**
```yaml
---
title: "如何使用 Hugo 建站"
keywords:
  - hugo
  - static-site
  - tutorial
---
```

**配置:**
```toml
[ogImage]
  mode = "unsplash"
  [ogImage.unsplash]
    keywordSource = "keywords"
    keywordCount = 2
```

**生成的 URL:**
```
https://source.unsplash.com/1200x630/?hugo,static-site
```

### 示例 2: 使用标题

**文章 Frontmatter:**
```yaml
---
title: "Beautiful Sunset Photography"
---
```

**配置:**
```toml
[ogImage]
  mode = "unsplash"
  [ogImage.unsplash]
    keywordSource = "title"
```

**生成的 URL:**
```
https://source.unsplash.com/1200x630/?Beautiful,Sunset,Photography
```

### 示例 3: 手动指定（向后兼容）

**文章 Frontmatter:**
```yaml
---
title: "My Post"
cover: "/images/my-custom-cover.jpg"
---
```

**结果:**
使用指定的图片，不会动态生成。

---

## 🔄 迁移指南

### 从 hugo-butterfly 迁移

**hugo-butterfly 配置:**
```toml
[assets]
  defaultCover = "/images/default-cover.jpg"
```

**迁移到新方案:**
```toml
[ogImage]
  mode = "unsplash"
  fallback = "/images/default-cover.jpg"
  
  [ogImage.unsplash]
    keywordSource = "keywords"
    keywordCount = 2
```

**变化：**
1. ✅ 保留了默认图片功能（fallback）
2. ✅ 新增了动态获取功能
3. ✅ 完全向后兼容（mode = "manual" 时行为不变）

---

## 🧪 测试计划

### 测试用例

| 测试场景 | 输入 | 预期输出 |
|---------|------|---------|
| 有 cover 字段 | `cover: "/img.jpg"` | 使用指定图片 |
| 有 keywords | `keywords: ["hugo"]` | Unsplash URL with hugo |
| 无 keywords | 无 | 随机 Unsplash 图片 |
| mode = manual | 任何输入 | 使用 fallback |
| 所有方法失败 | 无任何图片 | 使用 fallback |

### 测试步骤

1. **创建测试文章**
   ```bash
   hugo new post/test-og-image.md
   ```

2. **配置不同模式**
   ```toml
   [ogImage]
     mode = "unsplash"
   ```

3. **构建并检查**
   ```bash
   hugo
   # 检查 public/post/test-og-image/index.html
   # 查找 <meta property="og:image" content="...">
   ```

4. **验证 URL**
   - 在浏览器中打开生成的 URL
   - 确认图片正确加载
   - 使用社交媒体调试工具验证

---

## 🚀 实施步骤

### 阶段 1: 配置准备（5分钟）

1. 在 `config/_default/params.toml` 添加配置
2. 设置默认值
3. 文档化配置选项

### 阶段 2: 模板实现（15分钟）

1. 创建 `layouts/partials/head/og-image.html`
2. 实现核心逻辑
3. 集成到 `baseof.html`

### 阶段 3: 测试验证（10分钟）

1. 创建测试文章
2. 测试各种场景
3. 验证生成的 URL

### 阶段 4: 文档编写（10分钟）

1. 更新用户文档
2. 添加配置示例
3. 编写迁移指南

**总计时间: 约 40 分钟**

---

## 📚 参考资料

### API 文档

- [Unsplash Source API](https://source.unsplash.com/)
- [Pexels API](https://www.pexels.com/api/)
- [Vercel OG Image](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation)

### Hugo 文档

- [Hugo Templates](https://gohugo.io/templates/)
- [Hugo Variables](https://gohugo.io/variables/)
- [Hugo Functions](https://gohugo.io/functions/)

### 社交媒体调试工具

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

---

## 🔮 未来扩展

### 可能的增强功能

1. **本地缓存**
   - 下载并缓存 Unsplash 图片
   - 减少外部依赖

2. **多 API 支持**
   - 自动切换 API（当一个失败时）
   - 负载均衡

3. **AI 生成**
   - 集成 DALL-E 或 Stable Diffusion
   - 根据文章内容生成独特图片

4. **图片优化**
   - 自动压缩
   - WebP 格式支持
   - 响应式图片

---

## ✅ 检查清单

实施前检查：

- [ ] 阅读并理解整个设计文档
- [ ] 确认 Hugo 版本兼容性（推荐 0.120+）
- [ ] 备份现有配置文件
- [ ] 准备测试文章

实施后检查：

- [ ] 配置文件正确添加
- [ ] 模板逻辑正确实现
- [ ] 所有测试用例通过
- [ ] 文档已更新
- [ ] 向后兼容性验证

---

## 📞 支持

如有问题，请：

1. 查看本文档的"测试计划"部分
2. 检查 Hugo 构建日志
3. 使用社交媒体调试工具验证
4. 提交 Issue 到 GitHub

---

**文档版本**: 1.0.0  
**最后更新**: 2024-11-15  
**维护者**: Hugo Paper Team
