# Hugo Theme Paper - 完整设置总结

## 🎉 项目现状

hugo-theme-paper 主题已完全准备好发布和使用!

## 📦 双仓库架构

### 1. **主仓库** - hugo-theme-paper
- **地址**: https://github.com/ouraihub-hugo-themes/hugo-theme-paper
- **用途**: 源代码开发、维护、贡献
- **内容**: TypeScript、CSS 源文件、测试、文档

### 2. **发布仓库** - hugo-theme-paper-dist
- **地址**: https://github.com/ouraihub-hugo-themes/hugo-theme-paper-dist
- **用途**: 预编译主题分发
- **内容**: 编译后的 CSS、Hugo 模板、主题配置

## 🔧 已完成的工作

### 1. CSS 构建优化
- ✅ 移除有问题的 PostCSS 配置
- ✅ 使用 Tailwind CSS CLI 进行构建
- ✅ 添加 `css:build` 和 `css:watch` 脚本

### 2. 项目结构清理
- ✅ 移动测试文件到 `tests/` 目录
- ✅ 删除开发过程文档
- ✅ 清理 exampleSite
- ✅ 保留生产版本所需的文件

### 3. 自动化发布工作流
- ✅ 创建 `.github/workflows/publish-release.yml`
- ✅ 支持两种触发方式:
  - 推送版本标签 (`git tag v0.3.0`)
  - 手动触发 (GitHub Actions UI)
- ✅ 自动同步到发布仓库
- ✅ 创建 GitHub Release

### 4. 完整的文档
- ✅ `RELEASE-GUIDE.md` - 发布流程和用户安装指南
- ✅ `WORKFLOW-SETUP.md` - 工作流配置说明

## 🚀 一次性设置

**需要在 GitHub 主仓库配置 RELEASE_REPO_TOKEN (仅需一次)**

1. **创建 Personal Access Token**:
   - 访问: https://github.com/settings/tokens/new
   - Token name: `RELEASE_REPO_TOKEN`
   - Scope: 勾选 `repo`
   - 生成并复制 token

2. **添加到仓库 Secrets**:
   - 访问: https://github.com/ouraihub-hugo-themes/hugo-theme-paper/settings/secrets/actions
   - New repository secret
   - Name: `RELEASE_REPO_TOKEN`
   - Secret: (粘贴上面的 token)

## 📝 发布新版本

### 方法 1: 推送版本标签 (推荐)
```bash
git tag v1.0.0
git push origin v1.0.0
```

### 方法 2: 手动触发
访问: https://github.com/ouraihub-hugo-themes/hugo-theme-paper/actions/workflows/publish-release.yml
- 点击 "Run workflow"
- 输入版本号 (如 1.0.0)
- 点击 "Run workflow"

### 工作流会自动执行:
1. ✅ 编译 CSS (Tailwind CLI)
2. ✅ 打包主题文件
3. ✅ 清理开发文件
4. ✅ 创建 tar.gz 和 zip 归档
5. ✅ 发布到主仓库 Release
6. ✅ 同步到发布仓库 (hugo-theme-paper-dist)
7. ✅ 创建版本标签

## 👥 用户使用方式

### 方式 1: Hugo Modules (推荐)
```toml
# config.toml 或 config/_default/config.toml
[module]
  [[module.imports]]
    path = "github.com/ouraihub-hugo-themes/hugo-theme-paper-dist"
```

```bash
hugo mod get -u
hugo server
```

**优势**:
- 自动版本管理
- 一行命令更新: `hugo mod get -u`
- 预编译的 CSS,无需额外步骤

### 方式 2: 直接克隆主仓库
```bash
git clone https://github.com/ouraihub-hugo-themes/hugo-theme-paper.git themes/hugo-theme-paper
```

配置:
```toml
theme = "hugo-theme-paper"
```

### 方式 3: 克隆发布仓库
```bash
git clone https://github.com/ouraihub-hugo-themes/hugo-theme-paper-dist.git themes/hugo-theme-paper
```

### 方式 4: 下载预编译包
从 Release 页面下载:
https://github.com/ouraihub-hugo-themes/hugo-theme-paper/releases

## 📊 文件位置

```
hugo-theme-paper/
├── .github/workflows/publish-release.yml  # 自动化工作流
├── RELEASE-GUIDE.md                       # 发布和用户指南
├── WORKFLOW-SETUP.md                      # 工作流配置说明
├── layouts/                               # Hugo 模板
├── assets/
│   ├── css/                              # CSS 源文件
│   └── ts/                               # TypeScript 源文件
├── static/
│   └── css/main.css                      # 编译后的 CSS
├── i18n/                                 # 国际化
├── data/                                 # 数据文件
├── tests/                                # 测试文件
├── exampleSite/                          # 演示站点
├── package.json                          # NPM 配置
├── tailwind.config.js                    # Tailwind 配置
├── go.mod                                # Hugo Modules 配置
└── theme.toml                            # 主题信息
```

## 🔄 开发工作流

### 本地开发
```bash
# 安装依赖
pnpm install

# 开发模式(监视 CSS 变化)
pnpm run css:watch &
hugo server

# 或使用单一命令
pnpm run dev
```

### 构建生产版本
```bash
pnpm run css:build
hugo --minify --gc
```

### 运行测试
```bash
pnpm run test:run
pnpm run test:coverage
```

## 💡 关键特性

- ✅ **预编译 CSS** - 用户无需构建步骤
- ✅ **双仓库架构** - 源代码和发布版本分离
- ✅ **自动化发布** - 推送标签即可发布
- ✅ **Hugo Modules 支持** - 现代包管理方式
- ✅ **完整文档** - 用户和开发者指南
- ✅ **版本管理** - 遵循语义化版本

## 📚 文档链接

- [RELEASE-GUIDE.md](RELEASE-GUIDE.md) - 发布流程详细说明
- [WORKFLOW-SETUP.md](WORKFLOW-SETUP.md) - 工作流配置指南
- [README.md](README.md) - 主题使用说明
- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献指南

## 🎯 下一步

1. **配置 RELEASE_REPO_TOKEN** (如果还未配置)
2. **测试发布流程** - 推送 v0.3.0 标签
3. **验证 Hugo Modules** - 使用发布仓库测试
4. **发布生产版本** - 推送 v1.0.0 标签

---

**所有设置已完成! 🎉**

现在可以：
- 开发新功能
- 发布新版本
- 用户可通过多种方式使用主题

有任何问题,查看文档或提出 Issue。
