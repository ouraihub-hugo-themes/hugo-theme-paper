# Hugo Paper Theme - Development Repository

[![GitHub License](https://img.shields.io/github/license/ouraihub-hugo-themes/hugo-theme-paper)](https://github.com/ouraihub-hugo-themes/hugo-theme-paper/blob/master/LICENSE)
[![Hugo Version](https://img.shields.io/badge/Hugo-0.120%2B-blue)](https://gohugo.io/)
[![Node Version](https://img.shields.io/badge/Node-18%2B-green)](https://nodejs.org/)
[![pnpm Version](https://img.shields.io/badge/pnpm-8%2B-orange)](https://pnpm.io/)

一个受 [Astro Paper](https://astro-paper.pages.dev/) 启发的最小化、响应式 Hugo 主题。本仓库包含主题的源代码和开发工具。

---

## ⚠️ 你是用户还是开发者？

### 👤 如果你想使用这个主题

**请不要使用这个仓库！** 这是开发仓库，包含源代码和构建工具。

**请使用以下方式：**

1. **🚀 推荐：Starter 模板（最简单）**
   ```bash
   git clone https://github.com/ouraihub-hugo-themes/hugo-theme-paper-starter.git my-blog
   cd my-blog
   hugo server
   ```
   👉 [hugo-theme-paper-starter](https://github.com/ouraihub-hugo-themes/hugo-theme-paper-starter)

2. **📦 使用预编译版本（Hugo Modules）**
   ```toml
   [module]
     [[module.imports]]
       path = "github.com/ouraihub-hugo-themes/hugo-theme-paper-dist"
   ```
   👉 [hugo-theme-paper-dist](https://github.com/ouraihub-hugo-themes/hugo-theme-paper-dist)

### 👨‍💻 如果你想贡献代码

欢迎！继续阅读下面的开发指南。

---

## ✨ 主要特性

- 🎨 响应式设计 + 深色模式
- 🔍 搜索功能 + 阅读进度
- 💬 Giscus 评论集成
- � 代码复制 + *文章分享
- ♿ WCAG 2.1 AA 无障碍支持
- � SE代O 优化（Schema.org）
- 🧪 176 个测试用例，85%+ 覆盖率

## � ️ 开发环境设置

### 前置要求

- **Hugo**: v0.120+ (Extended 版本)
- **Go**: 1.24+ (Hugo Modules 依赖)
- **Node.js**: v18.0+
- **pnpm**: v8.15+

### 克隆和安装

```bash
# 克隆仓库
git clone https://github.com/ouraihub-hugo-themes/hugo-theme-paper.git
cd hugo-theme-paper

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 开发命令速查

```bash
# 开发
pnpm dev              # 启动完整开发环境（TypeScript + CSS + Hugo）
pnpm dev:fast         # 快速启动（仅 Hugo，不编译资源）

# 构建
pnpm build            # 生产构建（完整优化）
pnpm build:dev        # 开发构建（包含 sourcemap）

# 资源编译
pnpm ts:build         # 编译 TypeScript
pnpm ts:watch         # 监听 TypeScript 变化
pnpm css:build        # 编译 CSS
pnpm css:watch        # 监听 CSS 变化

# 代码质量
pnpm type-check       # TypeScript 类型检查
pnpm lint:ts          # TypeScript 代码检查
pnpm lint:css         # CSS 代码检查
pnpm format           # 代码格式化

# 测试
pnpm test             # 运行测试（监听模式）
pnpm test:run         # 单次运行测试
pnpm test:ui          # 测试 UI 界面
pnpm test:coverage    # 生成覆盖率报告
```

## � 构建和发布

### 构建流程

```bash
# 1. 类型检查
pnpm type-check

# 2. 运行测试
pnpm test:run

# 3. 代码检查
pnpm lint:ts
pnpm lint:css

# 4. 构建
pnpm build
```

### 发布新版本

```bash
# 1. 更新版本号和 CHANGELOG
# 编辑 docs/CHANGELOG.md

# 2. 提交更改
git add .
git commit -m "chore: release v0.x.x"
git push origin master

# 3. 创建并推送标签
git tag v0.x.x
git push origin v0.x.x
```

### 双仓库工作流

本项目使用双仓库架构：

1. **开发仓库**（本仓库）
   - 包含源代码（TypeScript、Tailwind CSS）
   - 包含开发工具和测试
   - 开发者在这里工作

2. **分发仓库** ([hugo-theme-paper-dist](https://github.com/ouraihub-hugo-themes/hugo-theme-paper-dist))
   - 只包含预编译文件
   - 用户通过 Hugo Modules 使用
   - 由 GitHub Actions 自动更新

**工作流程：**
- 推送标签到开发仓库 → GitHub Actions 自动编译 → 推送到分发仓库

详见：[docs/HUGO_MODULES_BEST_PRACTICES.md](./docs/HUGO_MODULES_BEST_PRACTICES.md)

## 📚 文档

- [CHANGELOG.md](./docs/CHANGELOG.md) - 更新日志
- [DIRECTORY_STRUCTURE_ANALYSIS.md](./docs/DIRECTORY_STRUCTURE_ANALYSIS.md) - 目录结构分析
- [HUGO_MODULES_BEST_PRACTICES.md](./docs/HUGO_MODULES_BEST_PRACTICES.md) - Hugo Modules 最佳实践

## 🧪 测试

本主题包含 **176 个测试用例**，覆盖率 **85%+**。

```bash
# 运行测试
pnpm test              # 监听模式
pnpm test:run          # 单次运行
pnpm test:ui           # UI 界面
pnpm test:coverage     # 覆盖率报告
```

### 测试覆盖

- 单元测试 (7)
- 交互功能测试 (15)
- 集成测试 (21)
- 性能基准测试 (23)
- 浏览器兼容性测试 (35)
- SEO 审核 (30)
- 安全审计 (45)

## 🏗️ 项目结构

```
hugo-theme-paper/
├── assets/               # 源文件（开发）
│   ├── css/             # Tailwind CSS 源文件
│   └── ts/              # TypeScript 源文件
├── static/               # 编译后的文件（分发）
│   ├── css/main.css     # 编译后的 CSS
│   ├── js/main.js       # 编译后的 JS
│   └── toggle-theme.js  # 主题切换脚本
├── layouts/              # Hugo 模板
├── i18n/                 # 国际化文件
├── archetypes/           # 内容模板
├── tests/                # 测试文件
├── docs/                 # 文档
├── .github/workflows/    # GitHub Actions
└── exampleSite/          # 示例网站
```

详见：[docs/DIRECTORY_STRUCTURE_ANALYSIS.md](./docs/DIRECTORY_STRUCTURE_ANALYSIS.md)

## 🔧 技术栈

### 核心技术
- **Hugo**: v0.120+ (Extended)
- **Tailwind CSS**: v4.0.0
- **TypeScript**: v5.8+
- **esbuild**: v0.23+ (打包工具)

### 开发工具
- **Vitest**: v2.0+ (测试框架)
- **ESLint**: v9.0+ (代码检查)
- **Stylelint**: v16.0+ (CSS 检查)
- **Prettier**: v3.1+ (代码格式化)

### 包管理
- **pnpm**: v8.15+ (推荐)
- **Node.js**: v18.0+

## 📝 代码规范

### TypeScript
- 使用 ESLint 进行代码检查
- 严格的类型检查（`strict: true`）
- 所有 JavaScript 必须从 TypeScript 编译而来

### CSS
- 使用 Tailwind CSS 实用类
- 使用 Stylelint 进行代码检查
- 遵循 BEM 命名规范（自定义类）

### 提交规范
- 使用语义化提交信息
- 格式：`type: description`
- 类型：`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 工作流
1. 创建功能分支
2. 编写代码和测试
3. 运行 `pnpm type-check` 和 `pnpm test:run`
4. 提交并创建 Pull Request

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 贡献前请确保：
- ✅ 所有测试通过 (`pnpm test:run`)
- ✅ 类型检查通过 (`pnpm type-check`)
- ✅ 代码检查通过 (`pnpm lint:ts && pnpm lint:css`)
- ✅ 代码已格式化 (`pnpm format`)

## 📄 许可

MIT License - 详见 [LICENSE](./LICENSE)

## 🐛 问题反馈

- Issues: https://github.com/ouraihub-hugo-themes/hugo-theme-paper/issues
- Discussions: https://github.com/ouraihub-hugo-themes/hugo-theme-paper/discussions

## 🙏 致谢

- 灵感来自 [Astro Paper](https://astro-paper.pages.dev/)
- 使用 [Tailwind CSS](https://tailwindcss.com/)
- 评论由 [Giscus](https://giscus.app/) 提供

---

Made with ❤️ by [OurAIHub](https://github.com/ouraihub-hugo-themes)
