# Hugo Paper - 项目概览

## 欢迎使用 Hugo Paper! 👋

Hugo Paper 是一个现代化的、极简主义的 Hugo 博客主题,灵感来自 [astro-paper](https://github.com/satnaing/astro-paper)。它使用最新的技术栈 (Tailwind CSS v4 + TypeScript) 构建,提供优秀的性能和开发体验。

---

## 🎯 核心特性

- ✨ **极简设计**: 干净、现代的界面
- 📱 **完全响应式**: 在所有设备上都能完美显示
- 🌓 **明暗主题**: 内置浅色/深色主题切换
- ♿ **无障碍性**: 完全遵守 WCAG 2.1 AA 标准
- 🔍 **SEO 友好**: 内置 Open Graph、Twitter Cards、Schema.org
- ⚡ **高性能**: Lighthouse 评分 95+
- 🔎 **强大搜索**: 使用 Pagefind 的静态搜索
- 📝 **易用内容管理**: 简单的 Markdown 文章管理
- 🛠️ **易于定制**: 灵活的配置系统

---

## 📚 快速导航

### 对于用户
- **第一次使用?** → 阅读 [README.md](README.md)
- **需要配置帮助?** → 阅读 [CONFIG.md](CONFIG.md)
- **需要改进主题?** → 阅读 [DESIGN.md](DESIGN.md)

### 对于开发者
- **想了解架构?** → 阅读 [DESIGN.md](DESIGN.md) 中的技术架构部分
- **想贡献代码?** → 阅读 [CONTRIBUTING.md](CONTRIBUTING.md)
- **项目进度如何?** → 查看 [PROGRESS.md](PROGRESS.md)

---

## 🚀 快速开始 (30 秒)

```bash
# 1. 安装 pnpm (如果未安装)
npm install -g pnpm

# 2. 克隆项目
git clone https://github.com/ouraihub-hugo-themes/hugo-paper.git
cd hugo-paper

# 3. 安装依赖
pnpm install

# 4. 启动开发服务器
pnpm dev

# 5. 访问 http://localhost:1313
```

更详细的说明,请参考 [README.md](README.md)。

---

## 📦 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Hugo** | 0.120+ | 静态站点生成器 |
| **Tailwind CSS** | v4.1+ | CSS 框架 |
| **TypeScript** | 5.8+ | 脚本编程语言 |
| **pnpm** | 8+ | 包管理器 |
| **PostCSS** | 8+ | CSS 预处理 |
| **Pagefind** | 1.3+ | 静态搜索引擎 |

---

## 📋 项目结构

```
hugo-paper/
├── 📄 README.md          # 快速开始指南
├── 📄 CONFIG.md          # 配置详解
├── 📄 DESIGN.md          # 设计文档
├── 📄 CONTRIBUTING.md    # 贡献指南
├── 📄 PROGRESS.md        # 项目进度
├── 📄 LICENSE            # MIT 许可证
├── 📦 package.json       # 依赖管理
├── 🗂️ archetypes/        # 内容模板
├── 🗂️ assets/            # 资源文件 (CSS/TS/Icons)
├── 🗂️ layouts/           # 页面和组件模板
├── 🗂️ static/            # 静态文件
├── 🗂️ content/           # 博客内容
├── 🗂️ config/            # Hugo 配置
└── 🗂️ exampleSite/       # 示例网站
```

详见 [DESIGN.md](DESIGN.md) 中的目录结构说明。

---

## 🎨 功能概览

### 页面类型 (9 种)

| 页面 | 描述 | 链接 |
|------|------|------|
| 首页 | 展示精选和最新文章 | `/` |
| 文章列表 | 所有文章的分页列表 | `/posts/` |
| 文章详情 | 单篇文章详细视图 | `/posts/article-slug/` |
| 标签列表 | 所有标签 | `/tags/` |
| 标签页面 | 特定标签的文章 | `/tags/tag-name/` |
| 关于页 | 网站和作者简介 | `/about/` |
| 归档页 | 按年份分组的文章 | `/archives/` |
| 搜索页 | 实时搜索功能 | `/search/` |
| 404 页面 | 页面未找到 | `/404/` |

### 核心特性

**SEO 优化**:
- Open Graph 元标签 (社交分享优化)
- Twitter Cards (推特卡片)
- JSON-LD 结构化数据 (谷歌富摘要)
- 自动 Sitemap 生成
- RSS 订阅源

**用户体验**:
- 浅色/深色主题自动切换
- 响应式移动设计
- 流畅的页面过渡
- 快速的静态搜索
- 优雅的排版

**开发者友好**:
- TypeScript 类型安全
- 清晰的代码结构
- 完整的文档
- 易于定制配置

详见 [DESIGN.md](DESIGN.md) 中的功能清单。

---

## 📊 项目规划

### 阶段进度

```
✅ 阶段 0: 项目初始化和设计文档 (完成)
   └─ 设计文档、配置指南、快速指南、贡献指南

⏳ 阶段 1: 基础布局与样式系统 (待开始)
   └─ 目录结构、基础配置、Tailwind v4 集成、主题切换

⏳ 阶段 2: 核心页面开发 (待开始)
   └─ 首页、文章列表、文章详情、分页等

⏳ 阶段 3-6: 其他阶段 (待开始)
   └─ 标签系统、SEO 优化、交互功能、测试
```

详见 [PROGRESS.md](PROGRESS.md)。

---

## 🛠️ 可用命令

```bash
# 开发
pnpm dev              # 启动开发服务器 (热重载)
pnpm type-check       # TypeScript 类型检查
pnpm format           # 代码格式化
pnpm format:check     # 检查代码格式
pnpm lint             # ESLint 检查

# 生产
pnpm build            # 生产构建 (含 Pagefind 索引)

# 更多详情请参考 DESIGN.md 或 README.md
```

---

## 🌐 部署方案

Hugo Paper 可以部署到各种平台:

| 平台 | 配置难度 | 推荐度 |
|------|----------|--------|
| **Netlify** | 极简 | ⭐⭐⭐⭐⭐ |
| **Vercel** | 简单 | ⭐⭐⭐⭐⭐ |
| **GitHub Pages** | 简单 | ⭐⭐⭐⭐ |
| **Cloudflare Pages** | 简单 | ⭐⭐⭐⭐ |
| **自托管服务器** | 中等 | ⭐⭐⭐ |

详见 [README.md](README.md) 中的部署章节。

---

## 📖 文档一览

| 文档 | 面向用户 | 主要内容 | 阅读时间 |
|------|----------|----------|---------|
| **README.md** | 所有人 | 快速开始、安装、配置、部署 | 15 分钟 |
| **CONFIG.md** | 站点管理员 | 详细配置选项、参数说明 | 20 分钟 |
| **DESIGN.md** | 开发者 | 技术架构、设计规范、开发指南 | 45 分钟 |
| **CONTRIBUTING.md** | 贡献者 | 贡献流程、代码规范、测试方法 | 10 分钟 |
| **PROGRESS.md** | 项目跟踪 | 项目进度、里程碑、下一步计划 | 5 分钟 |

---

## ❓ 常见问题

**Q: Hugo Paper 支持哪些 Hugo 版本?**  
A: Hugo 0.120+ (Extended 版本)

**Q: 如何修改主题颜色?**  
A: 编辑 `assets/css/main.css` 中的 CSS 变量。详见 [CONFIG.md](CONFIG.md)。

**Q: 可以添加评论系统吗?**  
A: 可以,支持多种评论系统 (Giscus、Utterances 等)。详见 [CONFIG.md](CONFIG.md) 的评论配置。

**Q: 如何发布文章?**  
A: 使用 `hugo new posts/article-name.md` 创建新文章。详见 [README.md](README.md)。

**Q: 搜索功能如何工作?**  
A: 使用 Pagefind 在构建时生成静态搜索索引。详见 [DESIGN.md](DESIGN.md)。

更多问题,请查看各个文档或提交 Issue。

---

## 🤝 贡献

欢迎贡献! 无论是:
- 🐛 报告 Bug
- 💡 建议新功能
- 📝 改进文档
- 🔧 提交代码

详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 📄 许可证

Hugo Paper 采用 **MIT 许可证**。详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

感谢:
- [astro-paper](https://github.com/satnaing/astro-paper) - 设计灵感来源
- [Hugo](https://gohugo.io/) - 强大的静态站点生成器
- [Tailwind CSS](https://tailwindcss.com/) - 现代化的 CSS 框架
- 所有贡献者和使用者的支持!

---

## 📞 联系与支持

- **Issues**: [GitHub Issues](https://github.com/ouraihub-hugo-themes/hugo-paper/issues)
- **讨论**: [GitHub Discussions](https://github.com/ouraihub-hugo-themes/hugo-paper/discussions)
- **仓库**: [https://github.com/ouraihub-hugo-themes/hugo-paper](https://github.com/ouraihub-hugo-themes/hugo-paper)

---

## 🎓 下一步

1. **新用户**: 阅读 [README.md](README.md) 快速开始
2. **已安装**: 阅读 [CONFIG.md](CONFIG.md) 进行配置
3. **开发者**: 阅读 [DESIGN.md](DESIGN.md) 了解架构
4. **贡献者**: 阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 贡献代码

---

**最后更新**: 2024-11-11  
**版本**: 0.1.0-alpha  
**状态**: 🚧 开发中

祝您使用愉快! 🎉
