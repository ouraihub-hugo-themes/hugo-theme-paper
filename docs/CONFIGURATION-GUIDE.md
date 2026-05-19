# 配置指南 (Configuration Guide)

## 配置文件结构

Hugo Paper 主题使用标准的 Hugo 配置结构：

```
hugo-theme-paper/
├── config/
│   └── _default/
│       ├── hugo.toml          # 主配置
│       ├── params.toml        # 参数配置（主题默认值）
│       ├── languages.toml     # 多语言配置
│       └── menus.*.toml       # 菜单配置
└── exampleSite/
    ├── hugo.toml              # 示例站点配置
    └── params.toml            # 示例站点参数（覆盖主题默认值）
```

## 配置优先级

```
用户站点配置 > exampleSite 配置 > config/_default 配置
```

## 主要配置项

### 主题切换 (Theme Toggle)

启用/禁用浅色和深色模式切换：

```toml
# config/_default/params.toml
lightAndDarkMode = true  # true 或 false
```

**注意**：此配置项与 AstroPaper 的命名保持一致。

### 归档页面 (Archives)

显示/隐藏归档菜单和页面：

```toml
showArchives = true  # true 或 false
```

### 返回按钮 (Back Button)

在文章详情页显示返回按钮：

```toml
showBackButton = true  # true 或 false
```

### 首页文章数量 (Posts Per Page)

首页显示的文章数量：

```toml
postPerIndex = 4  # 数字
```

### 社交链接 (Social Links)

配置社交媒体链接：

```toml
[[social]]
  name = "GitHub"
  href = "https://github.com/yourusername"
  linkTitle = "Follow on GitHub"

[[social]]
  name = "X"
  href = "https://x.com/yourusername"
  linkTitle = "Follow on X"
```

支持的平台：GitHub, X, LinkedIn, Mail, Facebook, Telegram, Mastodon, Reddit

### 编辑链接 (Edit Post)

允许用户建议修改：

```toml
[editPost]
  enabled = true
  text = "Edit page"
  url = "https://github.com/username/repo/edit/main/content/"
```

### 动态 OG 图片 (Dynamic OG Image)

自动生成社交媒体分享图片：

```toml
[ogImage]
  mode = "unsplash"  # "manual", "unsplash", "generated"
  fallback = "/images/og-default.jpg"
  
  [ogImage.unsplash]
    keywordSource = "keywords"  # "keywords", "tags", "categories", "title"
    keywordCount = 2
    width = 1200
    height = 630
```

## 迁移指南

### 从旧配置迁移

如果你使用的是旧版本的配置格式，请按以下方式更新：

**旧格式**（已废弃）：
```toml
[params.theme]
  switchTheme = true
```

**新格式**（推荐）：
```toml
lightAndDarkMode = true
```

## 最佳实践

1. **不要修改** `config/_default/` 中的文件（除非你在开发主题）
2. **在你的站点中覆盖配置**：创建自己的 `config/_default/params.toml`
3. **使用语义化的配置项名称**：遵循 AstroPaper 的命名约定
4. **保持配置简洁**：只覆盖需要修改的配置项

## 常见问题

### Q: 主题切换按钮不显示？

A: 检查 `lightAndDarkMode` 是否设置为 `true`：

```toml
lightAndDarkMode = true
```

### Q: 如何自定义菜单？

A: 编辑 `config/_default/menus.en.toml` 或 `menus.zh.toml`：

```toml
[[main]]
  name = "Home"
  url = "/"
  weight = 1

[[main]]
  name = "About"
  url = "/about/"
  weight = 2
```

### Q: 配置文件在哪里？

A: 
- 主题默认配置：`config/_default/params.toml`
- 你的站点配置：在你的站点根目录创建 `config/_default/params.toml`

## 参考

- [Hugo 配置文档](https://gohugo.io/getting-started/configuration/)
- [AstroPaper 配置](https://github.com/satnaing/astro-paper/blob/main/src/config.ts)
