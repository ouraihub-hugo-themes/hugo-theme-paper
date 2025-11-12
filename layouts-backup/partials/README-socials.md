# 社交链接组件使用说明

## 概述

社交链接组件 (`socials.html`) 用于在网站上显示社交媒体链接。该组件完全参考 AstroPaper 的 `Socials.astro` 组件实现。

## 配置

在 `params.toml` 中配置社交链接：

```toml
# 支持的平台: github, twitter, x, linkedin, email, mail, facebook, telegram, mastodon, reddit
[[params.social]]
  name = "GitHub"
  href = "https://github.com/username"
  linkTitle = "Follow on GitHub"

[[params.social]]
  name = "X"
  href = "https://x.com/username"
  linkTitle = "Follow on X"

[[params.social]]
  name = "LinkedIn"
  href = "https://www.linkedin.com/in/username/"
  linkTitle = "Connect on LinkedIn"

[[params.social]]
  name = "Mail"
  href = "mailto:contact@example.com"
  linkTitle = "Send an email"
```

## 支持的平台

组件内置了以下平台的 SVG 图标：

- **GitHub**: `name = "GitHub"`
- **Twitter/X**: `name = "Twitter"` 或 `name = "X"`
- **LinkedIn**: `name = "LinkedIn"`
- **Email**: `name = "Email"` 或 `name = "Mail"`
- **Facebook**: `name = "Facebook"`
- **Telegram**: `name = "Telegram"`
- **Mastodon**: `name = "Mastodon"`
- **Reddit**: `name = "Reddit"`

如果使用其他平台名称，将显示默认的链接图标。

## 使用方法

### 在模板中使用

```html
{{ partial "socials.html" . }}
```

### 在首页使用（已集成）

社交链接已经集成到首页的 Hero section 中：

```html
{{- if .Site.Params.social -}}
<div class="mt-4 flex flex-col sm:flex-row sm:items-center mb-6">
  <div class="me-2 mb-1 whitespace-nowrap sm:mb-0">Social Links:</div>
  {{ partial "socials.html" . }}
</div>
{{- end -}}
```

## 样式说明

组件使用以下 Tailwind CSS 类（与 AstroPaper 完全一致）：

- **容器**: `flex flex-wrap justify-center gap-1`
- **链接**: `group inline-block p-2 hover:rotate-6 sm:p-1 transition-transform`
- **图标**: `inline-block size-6 scale-125 fill-transparent stroke-current stroke-2 opacity-90 group-hover:fill-transparent sm:scale-110`

## 可访问性

组件包含完整的可访问性支持：

- `target="_blank"` - 在新标签页打开
- `rel="noopener noreferrer"` - 安全属性
- `title` 属性 - 鼠标悬停提示
- `aria-label` 属性 - 屏幕阅读器支持
- `<span class="sr-only">` - 屏幕阅读器文本

## 响应式设计

- 移动设备: 图标较小 (`sm:scale-110`)
- 桌面设备: 图标较大 (`scale-125`)
- 悬停效果: 轻微旋转 (`hover:rotate-6`)

## 参考

- AstroPaper 组件: `astro-paper/src/components/Socials.astro`
- AstroPaper 配置: `astro-paper/src/constants.ts`
- 需求文档: Requirements 5.1-5.7
