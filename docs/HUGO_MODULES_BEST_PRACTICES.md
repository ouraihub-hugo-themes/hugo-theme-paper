# Hugo Modules 最佳实践

## 问题背景

在将 hugo-theme-paper 作为 Hugo Module 使用时，发现主题无法正常渲染 HTML 页面。经过深入分析，发现问题根源在于主题的配置文件包含了开发环境专用的配置，这些配置在通过 Hugo Modules 引入时与用户项目配置产生冲突。

## 问题分析

### 问题表现

- ✅ Hugo 构建成功，无报错
- ✅ 生成了 JSON 和 XML 文件
- ❌ **没有生成任何 HTML 文件**
- ✅ 复制布局文件到项目后问题解决

### 根本原因

主题的配置文件包含了**开发环境专用的配置**：

```toml
# config/_default/hugo.toml
contentDir = "exampleSite/content"  # ❌ 指向不存在的目录

# config/_default/languages.toml
[en]
contentDir = "exampleSite/content/en"  # ❌ 项目特定配置
[zh]
contentDir = "exampleSite/content/zh"  # ❌ 项目特定配置
```

这些配置在通过 Hugo Modules 引入时会与用户项目配置合并，导致 Hugo 渲染逻辑混乱。

## Hugo 官方最佳实践

根据 [Hugo 官方文档](https://gohugo.io/hugo-modules/configuration/)，主题作为 Hugo Module 应该遵循以下最佳实践：

### 1. 使用 Mounts 明确定义挂载目录

> "If you define one or more mounts to map a file system path to a component path, do not use these legacy configuration settings"

**作用**：
- 明确定义主题提供哪些目录
- 避免暴露不必要的文件
- 提供清晰的模块边界

### 2. 限制主题配置范围

> "There are currently some restrictions to what a theme component can configure:
> - params (global and per language)
> - menu (global and per language)
> - outputformats and mediatypes"

**不应该包含**：
- ❌ `contentDir`
- ❌ `baseURL`
- ❌ 项目特定的语言配置

### 3. 配置文件合并机制

主题的 `config/_default/` 目录中的配置文件会自动与用户项目配置合并。因此主题配置应该：
- 只包含主题必需的配置
- 避免包含项目特定配置
- 提供合理的默认值

## 解决方案

### 方案概述

**最佳实践 = Mounts（方案 2）+ 配置清理（方案 3）**

这个组合方案：
- ✅ 完全符合 Hugo 官方文档推荐
- ✅ 解决了当前的所有问题
- ✅ 提供了清晰的模块边界
- ✅ 易于维护和扩展
- ✅ 用户体验好（开箱即用）

### 具体实施步骤

#### 步骤 1：创建 `config/_default/module.toml`

```toml
# Hugo Paper Theme - Module Configuration
# 明确定义主题挂载的目录

[[mounts]]
source = "layouts"
target = "layouts"

[[mounts]]
source = "assets"
target = "assets"

[[mounts]]
source = "static"
target = "static"

[[mounts]]
source = "i18n"
target = "i18n"

[[mounts]]
source = "archetypes"
target = "archetypes"

# 注意：
# - 不挂载 content 和 data，这些是用户的
# - config 目录通过配置合并机制处理，不需要在这里挂载
```

#### 步骤 2：清理 `config/_default/hugo.toml`

**移除项目特定配置**：
```toml
# ❌ 移除这些
baseURL = "http://localhost:1313/"
title = "Hugo Paper - Theme Development"
contentDir = "exampleSite/content"
defaultContentLanguage = "en"
```

**只保留主题必需配置**：
```toml
# Hugo Paper Theme - Core Configuration
# 只包含主题必需的配置

enableInlineShortcodes = true
enableEmoji = true
hasCJKLanguage = true
summaryLength = 200

# Pagination
[pagination]
pagerSize = 4

# Taxonomies
[taxonomies]
category = "categories"
tag = "tags"

# Outputs - 主题需要的输出格式
[outputs]
home = ["HTML", "RSS", "JSON"]
page = ["HTML"]
section = ["HTML", "RSS"]

# Output Formats
[outputFormats.JSON]
mediaType = "application/json"
baseName = "index"
```

#### 步骤 3：处理 `config/_default/languages.toml`

**推荐做法**：移动到 `exampleSite/config/_default/languages.toml` 作为示例

```bash
mv config/_default/languages.toml exampleSite/config/_default/
```

**原因**：
- 多语言配置是项目特定的
- 不同用户有不同的语言需求
- 应该由用户在自己的项目中配置

**如果需要提供默认支持**，可以保留最小配置（不包含 contentDir）：
```toml
# Hugo Paper Theme - Languages Configuration (Optional)
# 用户应该在自己的项目中配置语言

[en]
languageName = "English"
languageCode = "en"
weight = 1

[zh]
languageName = "中文"
languageCode = "zh"
weight = 2
```

#### 步骤 4：保持 `config/_default/params.toml` 不变

这个文件可以保留，因为它只包含主题参数，符合官方规定。

#### 步骤 5：更新 `config/_default/menus.*.toml`

菜单配置可以保留，但应该提供合理的默认值，用户可以在自己的项目中覆盖。

## 实施清单

### 主题仓库（hugo-theme-paper）

- [ ] 创建 `config/_default/module.toml`
- [ ] 清理 `config/_default/hugo.toml`
  - [ ] 移除 `baseURL`
  - [ ] 移除 `title`
  - [ ] 移除 `contentDir`
  - [ ] 移除 `defaultContentLanguage`
- [ ] 移动 `config/_default/languages.toml` 到 `exampleSite/config/_default/`
- [ ] 更新 `README.md` 说明配置方式
- [ ] 提交更改并打 tag（v0.5.0）

### Starter 仓库（hugo-theme-paper-starter）

- [ ] 更新主题版本到 v0.5.0
- [ ] 移除临时的布局文件覆盖（`layouts/index.html`, `layouts/_default/baseof.html`）
- [ ] 测试构建和运行
- [ ] 更新文档

## 验证方法

### 1. 主题仓库验证

```bash
cd hugo-theme-paper

# 开发模式仍然可以工作
hugo server

# 检查配置
hugo config | grep -i contentdir
# 应该显示 exampleSite/content（来自 exampleSite 的配置）
```

### 2. Starter 仓库验证

```bash
cd hugo-theme-paper-starter

# 更新模块
hugo mod get -u
hugo mod tidy

# 构建
hugo

# 检查生成的文件
ls -la public/index.html  # 应该存在

# 运行服务器
hugo server
# 访问 http://localhost:1313/ 应该正常显示
```

### 3. 新项目验证

```bash
# 创建新项目
hugo new site test-site
cd test-site

# 初始化模块
hugo mod init github.com/test/test-site

# 添加主题
cat >> hugo.toml << EOF
[module]
[[module.imports]]
path = "github.com/ouraihub-hugo-themes/hugo-theme-paper"
EOF

# 创建内容
hugo new post/test.md

# 构建
hugo

# 检查
ls -la public/index.html  # 应该存在
```

## 预期效果

### 修复前

```bash
hugo
# 输出：
# Pages: 31
# 但是 public/ 目录中没有 HTML 文件
```

### 修复后

```bash
hugo
# 输出：
# Pages: 78
# public/ 目录中有完整的 HTML 文件
# public/index.html 存在
```

## 参考资料

- [Hugo Modules Configuration](https://gohugo.io/hugo-modules/configuration/)
- [Theme Components](https://gohugo.io/hugo-modules/theme-components/)
- [Use Hugo Modules](https://gohugo.io/hugo-modules/use-modules/)
- [Multilingual Mode](https://gohugo.io/content-management/multilingual/)

## 版本历史

- **v0.5.0** (2025-01-14): 实施 Hugo Modules 最佳实践
  - 添加 module.toml 定义 mounts
  - 清理配置文件，移除项目特定配置
  - 移动 languages.toml 到 exampleSite
  - 修复 HTML 页面无法生成的问题

## 贡献者

感谢所有参与问题分析和解决方案设计的贡献者。

## 许可证

MIT License
