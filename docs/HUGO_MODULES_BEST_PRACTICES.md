# Hugo Modules 最佳实践

> **最后更新**: 2025-11-15

## 概述

本文档说明 Hugo Paper 主题如何正确配置为 Hugo Module，以及用户如何使用。

## 主题配置

### Module 挂载配置

主题通过 `config/_default/module.toml` 明确定义挂载目录：

```toml
[[mounts]]
source = "layouts"
target = "layouts"

[[mounts]]
source = "static"
target = "static"

[[mounts]]
source = "i18n"
target = "i18n"

[[mounts]]
source = "archetypes"
target = "archetypes"
```

**关键点**：
- ✅ 明确定义主题提供的目录
- ✅ 不挂载 `content` 和 `data`（用户自己的）
- ✅ 提供清晰的模块边界

### 配置文件组织

```
hugo-theme-paper/
└── config/
    └── _default/
        ├── module.toml      # Module 挂载配置
        ├── hugo.toml        # 主题核心配置
        ├── params.toml      # 主题参数
        └── menus.*.toml     # 菜单配置（示例）
```

**原则**：
- ✅ 只包含主题必需的配置
- ❌ 不包含项目特定配置
- ✅ 提供合理的默认值

## 用户使用方式

### 方式 1：Hugo Modules（推荐）

```toml
[[imports]]
path = "github.com/ouraihub-hugo-themes/hugo-theme-paper-dist"
```

```bash
hugo mod get -u
hugo server
```

### 方式 2：Starter 模板（最简单）

```bash
git clone https://github.com/ouraihub-hugo-themes/hugo-theme-paper-starter.git my-blog
cd my-blog
hugo server
```

## 配置合并机制

Hugo 会自动合并主题和用户项目的配置：

1. 主题配置 (`themes/hugo-theme-paper/config/`)
2. 用户配置 (`config/`)
3. 合并结果 = 用户配置覆盖主题配置

## 常见问题

### HTML 页面没有生成

**原因**：主题配置包含了 `contentDir` 等项目特定配置

**解决**：主题不应该包含 `contentDir`, `baseURL`, `title` 等配置

### 多语言配置冲突

**原因**：主题的语言配置与用户项目冲突

**解决**：主题只提供最小的语言配置，用户在自己的项目中完整配置

### 菜单不显示

**原因**：主题的菜单配置不适合用户项目

**解决**：用户在自己的 `config/_default/menus.*.toml` 中定义菜单

## 参考资源

- [Hugo Modules Configuration](https://gohugo.io/hugo-modules/configuration/)
- [Hugo Mounts](https://gohugo.io/hugo-modules/configuration/#module-config-mounts)
