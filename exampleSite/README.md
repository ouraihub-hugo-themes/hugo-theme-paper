# Hugo Paper - Example Site

这是使用 Hugo Paper 主题的示例网站。

## 快速开始

### 前提条件
- Hugo v0.120.0 或更高版本
- Node.js 18+ 和 pnpm

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 在浏览器中打开 http://localhost:1313
```

### 生产构建

```bash
# 构建静态网站
pnpm build

# 输出在 public/ 目录
```

### 运行测试

```bash
# 单次运行测试
pnpm test:run

# 生成覆盖率报告
pnpm test:coverage

# 使用 UI 界面运行测试
pnpm test:ui
```

## 目录结构

```
exampleSite/
├── content/              # 网站内容
│   ├── about.md         # 关于页面
│   ├── _index.md        # 首页内容
│   └── post/            # 博客文章
├── layouts/             # 自定义布局（覆盖主题）
├── static/              # 静态资源
├── config.toml          # Hugo 配置
├── params.toml          # 主题参数
├── hugo.toml            # Hugo 配置（同上）
├── package.json         # NPM 依赖
├── tailwind.config.js   # Tailwind CSS 配置
├── postcss.config.js    # PostCSS 配置
├── tsconfig.json        # TypeScript 配置
└── vitest.config.ts     # 测试框架配置
```

## 配置指南

### 基本配置 (config.toml / hugo.toml)

```toml
baseURL = "https://example.com/"
languageCode = "en-us"
title = "My Hugo Paper Site"
theme = ".."  # 指向上级目录的主题

[params]
  # 主题参数详见 ../params.toml
```

### 主题参数 (params.toml)

```toml
[params]
  # 显示选项
  showReadingTime = true
  showTableOfContents = true
  showCopyCodeButton = true
  
  # 交互功能
  [params.post]
    showLikeButton = true
    showShare = true
  
  # 评论系统
  [params.comments]
    enable = true
    provider = "giscus"
    repo = "your-username/your-repo"
    repoId = "R_..."
```

详细配置说明见 [../CONFIG.md](../CONFIG.md)

## 主题文件位置

主题的实际文件位于上级目录：

- 模板: `../layouts/`
- 样式: `../assets/css/`
- 脚本: `../assets/ts/`
- 配置: `../theme.toml`

如果需要修改主题，编辑这些目录中的文件。

## 覆盖主题

要自定义主题的特定部分，可以在 `layouts/` 目录中创建同名文件。Hugo 会优先使用项目的文件而不是主题的文件。

例如，要自定义页脚：
```
exampleSite/layouts/partials/footer.html  # 覆盖主题的 footer
```

## 部署

### Vercel

1. 将项目推送到 GitHub
2. 在 Vercel 中连接 GitHub 仓库
3. 设置构建命令：`cd exampleSite && pnpm build`
4. 设置输出目录：`exampleSite/public`

### Netlify

1. 将项目推送到 GitHub
2. 在 Netlify 中连接 GitHub 仓库
3. 设置构建命令：`cd exampleSite && pnpm build`
4. 设置发布目录：`exampleSite/public`

### GitHub Pages

参考 Netlify 或 Vercel 的设置（使用 GitHub Actions）

## 内容创建

### 创建新文章

```bash
hugo new post/my-first-post.md
```

### 文章格式

```markdown
---
title: "My First Post"
description: "This is a description"
date: 2024-01-01
updated: 2024-01-15
draft: false
tags: ["hugo", "blog"]
categories: ["tutorials"]
---

文章内容...
```

## 许可

MIT License - 详见 [../LICENSE](../LICENSE)

## 更多信息

- 主题文档: [../README.md](../README.md)
- 设计文档: [../DESIGN.md](../DESIGN.md)
- 配置指南: [../CONFIG.md](../CONFIG.md)
- 贡献指南: [../CONTRIBUTING.md](../CONTRIBUTING.md)

## 故障排除

### 页面不显示

1. 检查 `config.toml` 中 `theme = ".."` 是否正确设置
2. 确保主题文件在上级目录
3. 运行 `hugo server -D` 包含草稿页面

### 样式不加载

1. 检查 `tailwind.config.js` 是否正确
2. 确保 CSS 编译完成
3. 清除浏览器缓存

### 搜索功能不工作

1. 检查 `params.toml` 中 `showSearch` 是否为 true
2. 确保运行了 `pnpm install`
3. 重启开发服务器

---

**需要帮助？** 提交 Issue: https://github.com/ouraihub-hugo-themes/hugo-paper/issues
