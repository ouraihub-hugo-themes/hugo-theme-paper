# Hugo Paper Theme

[![GitHub License](https://img.shields.io/github/license/ouraihub-hugo-themes/hugo-paper)](https://github.com/ouraihub-hugo-themes/hugo-paper/blob/main/LICENSE)
[![Hugo Version](https://img.shields.io/badge/Hugo-0.120%2B-blue)](https://gohugo.io/)
[![Theme Version](https://img.shields.io/badge/Theme-v1.0.0-success)](https://github.com/ouraihub-hugo-themes/hugo-paper/releases)

一个受 [Astro Paper](https://astro-paper.pages.dev/) 启发的最小化、响应式的 Hugo 主题，具有完整的交互功能、SEO 优化和无障碍支持。

[English](./README.md) | [中文](#)

---

## ⚠️ 重要提示

**这是开发仓库，包含源代码和构建工具。**

### 如果你是用户（想使用这个主题）

**请使用以下方式之一：**

1. **推荐：使用 Starter 模板**
   ```bash
   git clone https://github.com/ouraihub-hugo-themes/hugo-theme-paper-starter.git my-blog
   cd my-blog
   hugo mod get -u
   hugo server
   ```
   👉 [hugo-theme-paper-starter](https://github.com/ouraihub-hugo-themes/hugo-theme-paper-starter)

2. **使用分发仓库（预编译版本）**
   ```toml
   [module]
     [[module.imports]]
       path = "github.com/ouraihub-hugo-themes/hugo-theme-paper-dist"
   ```
   👉 [hugo-theme-paper-dist](https://github.com/ouraihub-hugo-themes/hugo-theme-paper-dist)

### 如果你是开发者（想贡献代码）

继续阅读下面的开发指南。

---

## ✨ 功能特性

- 🎨 **响应式设计** - 完美适配所有设备
- 🌙 **深色模式** - 系统自动检测和手动切换
- 💬 **Giscus 评论** - GitHub Discussions 作为评论后端
- 🔍 **搜索功能** - 快速搜索所有内容
- 📖 **阅读进度** - 实时显示阅读进度
- 📋 **代码复制** - 一键复制代码块
- 📱 **文章分享** - 支持 5 个平台分享
- ⌨️ **快捷键** - 7 个内置快捷键
- 🔍 **SEO 优化** - Schema.org 结构化数据
- ♿ **无障碍** - WCAG 2.1 AA 级支持
- 📊 **性能** - 核心操作 < 10ms
- 🧪 **完整测试** - 176 个测试用例

## 📦 安装

### 方法 1: 作为 Git Submodule（推荐）

```bash
# 创建新 Hugo 站点
hugo new site my-site
cd my-site

# 初始化 Git
git init

# 添加主题作为 submodule
git submodule add https://github.com/ouraihub-hugo-themes/hugo-paper.git themes/hugo-paper

# 复制示例配置
cp themes/hugo-paper/exampleSite/config.toml .
cp themes/hugo-paper/exampleSite/params.toml .
cp themes/hugo-paper/exampleSite/package.json .
cp themes/hugo-paper/exampleSite/tailwind.config.js .
cp themes/hugo-paper/exampleSite/postcss.config.js .
cp themes/hugo-paper/exampleSite/tsconfig.json .

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 方法 2: 使用 Hugo Modules

```bash
# 初始化 Hugo 模块（如果还没有的话）
hugo mod init github.com/yourusername/my-site

# 添加 hugo-paper 作为模块依赖
hugo mod get github.com/ouraihub-hugo-themes/hugo-paper

# 获取依赖
hugo mod get -u

# 启动开发服务器
hugo server
```

### 方法 3: 从源代码开发

```bash
# 克隆主题源码
git clone https://github.com/ouraihub-hugo-themes/hugo-paper.git
cd hugo-paper

# 安装依赖
pnpm install

# 进入示例网站目录
cd exampleSite

# 启动开发服务器
pnpm dev
```

## 🚀 快速开始

### 1. 基本配置

编辑 `config.toml`：

```toml
baseURL = "https://yourdomain.com/"
languageCode = "en-us"
title = "My Blog"
theme = "hugo-paper"

# 其他配置...
```

### 2. 主题参数

编辑 `params.toml`：

```toml
[params]
  author = "Your Name"
  description = "Your site description"
  
  # 显示选项
  showReadingTime = true
  showTableOfContents = true
  
  # 交互功能
  [params.post]
    showLikeButton = true
    showShare = true
  
  # 评论系统 (Giscus)
  [params.comments]
    enable = true
    provider = "giscus"
    repo = "yourusername/your-repo"
    repoId = "R_..."
    category = "Announcements"
    categoryId = "DIC_..."
```

详细配置见 [CONFIG.md](./CONFIG.md)

### 3. 创建内容

```bash
# 创建新文章
hugo new post/my-first-post.md

# 启动开发服务器
pnpm dev
```

### 4. 部署

支持以下平台的一键部署：

- **Vercel** - 最推荐（自动部署）
- **Netlify** - 支持自定义域名
- **GitHub Pages** - 完全免费
- **任何支持 Hugo 的平台**

## 📚 文档

- [README.md](./README.md) - 本文件
- [CONFIG.md](./CONFIG.md) - 完整配置指南
- [DESIGN.md](./DESIGN.md) - 架构和设计
- [exampleSite/README.md](./exampleSite/README.md) - 示例网站使用说明
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南

## 🧪 测试

本主题包含 **176 个完整测试用例**，覆盖以下方面：

```bash
# 运行所有测试
pnpm test

# 生成覆盖率报告
pnpm test:coverage

# 使用 UI 运行测试
pnpm test:ui

# 单次运行测试
pnpm test:run
```

### 测试覆盖范围

- ✅ 单元测试 (7 个)
- ✅ 交互功能测试 (15 个)
- ✅ 集成测试 (21 个)
- ✅ 性能基准测试 (23 个)
- ✅ 浏览器兼容性测试 (35 个)
- ✅ SEO 审核 (30 个)
- ✅ 安全审计 (45 个)

## 🏗️ 项目结构

```
hugo-paper/
├── layouts/              # 主题模板
├── assets/               # 样式和脚本
│   ├── css/
│   ├── ts/
│   │   └── main.ts      # 核心脚本
│   └── images/
├── archetypes/           # 内容原型
├── i18n/                 # 多语言支持
├── data/                 # 数据文件
├── static/               # 静态资源
├── exampleSite/          # 示例网站
│   ├── content/         # 示例内容
│   ├── config.toml      # 示例配置
│   ├── params.toml
│   └── package.json
├── tests/                # 测试文件
├── theme.toml            # 主题元数据
└── README.md
```

## ⚙️ 主题参数

### 核心参数

```toml
[params]
  author = "Your Name"
  description = "Site description"
  showReadingTime = true
  showTableOfContents = true
  showCopyCodeButton = true
```

### 交互功能

```toml
[params.post]
  showLikeButton = true
  showShare = true

[params.comments]
  enable = true
  provider = "giscus"
  repo = "..."
  repoId = "..."
```

完整参数列表见 [CONFIG.md](./CONFIG.md)

## 🌐 浏览器支持

| 浏览器 | 版本 | 支持 |
|--------|------|------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |
| iOS Safari | 14+ | ✅ |
| Android Chrome | 90+ | ✅ |

## 🎯 性能指标

| 指标 | 值 | 状态 |
|------|-----|------|
| 首屏加载 | < 1.5s | ✅ |
| 交互延迟 | < 100ms | ✅ |
| Lighthouse | 95+ | ✅ |
| 代码覆盖率 | 85%+ | ✅ |

## 🔐 安全

- ✅ XSS 防护
- ✅ CSRF 防护
- ✅ 数据验证
- ✅ HTTPS 强制
- ✅ CSP 政策
- ✅ 安全 Headers

## ♿ 无障碍

符合 **WCAG 2.1 AA** 级标准：

- ✅ 语义化 HTML
- ✅ ARIA 标签
- ✅ 键盘导航
- ✅ 屏幕阅读器支持
- ✅ 颜色对比度

## 📄 许可

MIT License - 详见 [LICENSE](./LICENSE)

## 👥 贡献

欢迎贡献！请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 🐛 问题反馈

遇到问题？提交 Issue：https://github.com/ouraihub-hugo-themes/hugo-paper/issues

## 📞 联系

- 主页: https://github.com/ouraihub-hugo-themes/hugo-paper
- 讨论: https://github.com/ouraihub-hugo-themes/hugo-paper/discussions

## 🙏 致谢

- 灵感来自 [Astro Paper](https://astro-paper.pages.dev/)
- 使用 [Tailwind CSS](https://tailwindcss.com/)
- 评论由 [Giscus](https://giscus.app/) 提供

---

**Ready to get started?** 查看 [exampleSite/README.md](./exampleSite/README.md) 了解详细使用说明。

Made with ❤️ by [OurAIHub](https://github.com/ouraihub)
