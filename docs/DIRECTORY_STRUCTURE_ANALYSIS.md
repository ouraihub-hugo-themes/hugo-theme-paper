# 主题目录结构说明

> **最后更新**: 2024-11-15

## 概述

Hugo Paper 主题采用**完全预编译**策略，用户无需安装构建工具即可使用。

## 目录结构

### 开发仓库（hugo-theme-paper）

```
hugo-theme-paper/
├── assets/                   # 源文件
│   ├── css/                 # Tailwind CSS 源码
│   │   ├── main.css
│   │   ├── base.css
│   │   └── global.css
│   └── ts/                  # TypeScript 源码
│       ├── main.ts
│       └── toggle-theme.ts
├── static/                   # 编译输出（.gitignore）
│   ├── css/
│   │   └── main.css         # 编译后的 CSS
│   ├── js/
│   │   └── main.js          # 编译后的 JS
│   └── toggle-theme.js      # 编译后的 JS
├── layouts/                  # Hugo 模板
├── i18n/                     # 多语言文件
├── data/                     # 数据文件
├── archetypes/               # 内容模板
├── scripts/                  # 辅助脚本
├── tests/                    # 测试文件
├── docs/                     # 文档
├── package.json              # npm 依赖和脚本
├── tailwind.config.js        # Tailwind 配置
├── tsconfig.json             # TypeScript 配置
└── .gitignore                # 排除编译文件
```

### 分发仓库（hugo-theme-paper-dist）

通过 GitHub Actions 自动生成，只包含用户需要的文件：

```
hugo-theme-paper-dist/
├── static/                   # 预编译资源
│   ├── css/
│   │   └── main.css         # 预编译的 CSS
│   ├── js/
│   │   └── main.js          # 预编译的 JS
│   └── toggle-theme.js      # 预编译的 JS
├── layouts/                  # Hugo 模板
├── i18n/                     # 多语言文件
├── data/                     # 数据文件
├── archetypes/               # 内容模板
├── go.mod                    # Hugo Modules 配置
└── README.md                 # 使用说明
```

**关键点**：
- ❌ 不包含 `assets/` 源码
- ❌ 不包含 `package.json` 等开发工具
- ✅ 只包含预编译的 CSS 和 JS
- ✅ 用户无需构建工具

## 资源加载方式

### CSS 加载

```html
<link rel="stylesheet" href="/css/main.css" />
```

- 直接引用 `static/css/main.css`
- 不使用 Hugo Pipes
- 无需 PostCSS 或 Tailwind CLI

### JavaScript 加载

```html
<script defer src="{{ "js/main.js" | relURL }}"></script>
<script src="{{ "toggle-theme.js" | relURL }}"></script>
```

- 直接引用 `static/js/` 中的文件
- 不使用 Hugo Pipes
- 无需 TypeScript 编译器

## 构建流程

### 开发环境

```bash
# 安装依赖
pnpm install

# 开发模式（自动编译 + 热重载）
pnpm dev

# 手动构建
pnpm build
```

### 发布流程

1. 提交代码到 `hugo-theme-paper`
2. 创建 tag（`pnpm release`）
3. GitHub Actions 自动：
   - 编译 TypeScript → `static/js/`
   - 编译 Tailwind CSS → `static/css/`
   - 复制必要文件到 `hugo-theme-paper-dist`
   - 创建 GitHub Release

## 设计理念

### 为什么预编译？

1. **用户友好**
   - 无需安装 Node.js、pnpm、Tailwind CSS
   - 无需运行构建命令
   - `hugo mod get -u` 即可使用

2. **简化依赖**
   - 主题使用 Tailwind CSS v4 + TypeScript
   - 构建流程复杂，不适合用户自行构建
   - 预编译避免版本冲突

3. **清晰分离**
   - 开发仓库：源码 + 开发工具
   - 分发仓库：预编译文件
   - 用户只需关注内容创作

### 为什么不包含源码？

1. **避免混淆**
   - 用户不会误以为可以修改 `assets/` 中的文件
   - 明确使用的是 `static/` 中的预编译文件

2. **减小体积**
   - 分发仓库更小，下载更快
   - 不包含开发工具和依赖

3. **源码可查**
   - 用户可以访问开发仓库查看源码
   - 需要自定义可以 fork 开发仓库

## 自定义主题

如果需要自定义 CSS 或 JavaScript：

1. Fork [开发仓库](https://github.com/ouraihub-hugo-themes/hugo-theme-paper)
2. 修改 `assets/css/` 或 `assets/ts/` 中的源文件
3. 运行 `pnpm build` 编译
4. 使用你的自定义版本

**不推荐**：
- ❌ 直接修改分发仓库的 `static/` 文件（会被覆盖）
- ❌ 在用户项目中覆盖主题文件（维护困难）

## 符合 Hugo 最佳实践

根据 [Hugo 官方文档](https://gohugo.io/getting-started/directory-structure/)：

- **assets/**：需要通过 asset pipeline 处理的资源
- **static/**：直接复制到 public/ 的文件

我们的实现：
- ✅ 开发仓库：源码在 `assets/`，编译到 `static/`
- ✅ 分发仓库：只有 `static/`，直接可用
- ✅ 符合 Hugo 的目录约定

## 参考资源

- [Hugo Directory Structure](https://gohugo.io/getting-started/directory-structure/)
- [Hugo Modules](https://gohugo.io/hugo-modules/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
