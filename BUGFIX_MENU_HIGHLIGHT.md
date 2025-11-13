# Bug 修复：多语言菜单高亮问题

## 问题描述

在多语言站点中，切换到中文（或其他非默认语言）时，导航菜单项没有正确显示激活状态（波浪线下划线）。

### 症状
- 英文页面：菜单高亮正常 ✅
- 中文页面：菜单高亮失效 ❌

例如：
- 访问 `/post/` → "Posts" 有波浪线 ✅
- 访问 `/zh/post/` → "文章" 没有波浪线 ❌

## 根本原因

### 旧的路径匹配逻辑

```go
{{- $currentPath := $.Page.RelPermalink -}}  // 例如: /zh/post/
{{- $menuPath := .URL -}}                     // 例如: /post/
{{- if eq $currentPath $menuPath -}}          // 永远不匹配！
  {{- $isActive = true -}}
{{- end -}}
```

**问题**：
1. 菜单配置中的 URL 是相对路径（如 `/post/`）
2. 当前页面的 RelPermalink 包含语言前缀（如 `/zh/post/`）
3. 直接比较 `/zh/post/` 和 `/post/` 永远不会匹配

### 为什么英文正常？

因为英文是默认语言，URL 不包含语言前缀：
- 英文：`/post/` == `/post/` ✅
- 中文：`/zh/post/` != `/post/` ❌

## 解决方案

使用 `relLangURL` 函数将菜单 URL 转换为包含语言前缀的完整 URL：

```go
{{- $currentPath := $.Page.RelPermalink -}}      // /zh/post/
{{- $menuURL := .URL | relLangURL -}}            // /zh/post/ (自动添加语言前缀)
{{- if eq $currentPath $menuURL -}}              // 匹配！✅
  {{- $isActive = true -}}
{{- end -}}
```

### 修复后的完整逻辑

```go
{{- /* 获取当前页面路径 */ -}}
{{- $currentPath := $.Page.RelPermalink -}}

{{- /* 获取菜单的完整 URL（包含语言前缀） */ -}}
{{- $menuURL := .URL | relLangURL -}}

{{- /* 移除尾部斜杠进行比较 */ -}}
{{- $currentPathClean := strings.TrimSuffix "/" $currentPath -}}
{{- $menuURLClean := strings.TrimSuffix "/" $menuURL -}}

{{- /* 完全匹配 */ -}}
{{- if eq $currentPathClean $menuURLClean -}}
  {{- $isActive = true -}}
{{- /* 前缀匹配（用于子页面） */ -}}
{{- else if and (ne $menuURLClean "") (ne $menuURLClean "/") (hasPrefix $currentPathClean $menuURLClean) -}}
  {{- $isActive = true -}}
{{- end -}}
```

## 修复的文件

- `layouts/partials/header.html`
  - 修复导航菜单项的高亮逻辑
  - 修复 Archives 按钮的高亮逻辑
  - 简化代码，提高可读性

## 测试验证

### 测试场景

1. **英文首页** (`/`)
   - 无菜单项高亮 ✅

2. **英文文章列表** (`/post/`)
   - "Posts" 有波浪线 ✅

3. **英文文章详情** (`/post/my-post/`)
   - "Posts" 有波浪线 ✅

4. **中文首页** (`/zh/`)
   - 无菜单项高亮 ✅

5. **中文文章列表** (`/zh/post/`)
   - "文章" 有波浪线 ✅

6. **中文文章详情** (`/zh/post/my-post/`)
   - "文章" 有波浪线 ✅

7. **标签页面** (`/tags/` 或 `/zh/tags/`)
   - "Tags" 或 "标签" 有波浪线 ✅

8. **归档页面** (`/archives/` 或 `/zh/archives/`)
   - Archives 图标高亮 ✅

## 关键函数说明

### `relLangURL`

Hugo 内置函数，将相对 URL 转换为包含当前语言前缀的 URL。

```go
// 在英文页面
{{ "/post/" | relLangURL }}  // 输出: /post/

// 在中文页面
{{ "/post/" | relLangURL }}  // 输出: /zh/post/
```

### `hasPrefix`

检查字符串是否以指定前缀开头，用于匹配子页面。

```go
// 当前页面: /zh/post/my-article/
// 菜单 URL: /zh/post/
{{ hasPrefix "/zh/post/my-article/" "/zh/post/" }}  // true
```

## 最佳实践

### 多语言 URL 处理

在多语言站点中，始终使用 `relLangURL` 处理 URL：

✅ **推荐**：
```go
<a href="{{ .URL | relLangURL }}">{{ .Name }}</a>
```

❌ **不推荐**：
```go
<a href="{{ .URL }}">{{ .Name }}</a>
```

### 路径比较

比较路径时，考虑语言前缀：

✅ **推荐**：
```go
{{- $menuURL := .URL | relLangURL -}}
{{- if eq $currentPath $menuURL -}}
```

❌ **不推荐**：
```go
{{- if eq $currentPath .URL -}}
```

## 相关资源

- [Hugo Multilingual](https://gohugo.io/content-management/multilingual/)
- [Hugo URL Management](https://gohugo.io/content-management/urls/)
- [Hugo Template Functions](https://gohugo.io/functions/)

## 修复日期

2024-01-15

## 影响范围

- 所有多语言站点
- 导航菜单高亮
- Archives 按钮高亮
- Search 按钮高亮（已正确实现）

## 向后兼容性

✅ 完全向后兼容
- 单语言站点不受影响
- 英文（默认语言）不受影响
- 只修复了多语言站点的 bug
