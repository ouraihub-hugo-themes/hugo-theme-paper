# Hugo Theme Paper Release Process

## 发布流程说明

### 自动化发布
当推送带有 `v*` 前缀的 Git 标签时,GitHub Actions 会自动触发发布工作流:

```bash
# 创建发布版本
git tag v0.2.0
git push origin v0.2.0
```

### 工作流步骤

1. **编译资源** - 使用 Tailwind CSS CLI 编译 CSS
2. **打包主题** - 创建预编译的主题包
3. **清理文件** - 移除开发依赖和源代码
4. **创建归档** - 生成 tar.gz 和 zip 文件
5. **发布到 GitHub** - 自动创建 Release 并上传文件

### 发布包内容

发布包包含:
- ✅ 完整的 Hugo 模板文件 (`layouts/`)
- ✅ 预编译的 CSS (`static/css/main.css`)
- ✅ 国际化文件 (`i18n/`)
- ✅ 数据文件 (`data/`)
- ✅ 主题配置 (`theme.toml`)
- ✅ 文档 (`README.md`, `CONTRIBUTING.md`)

发布包不包含:
- ❌ 源代码依赖 (`node_modules/`)
- ❌ 开发文件 (`tests/`, `exampleSite/`, `package.json`)
- ❌ TypeScript 源文件 (`assets/ts/`)
- ❌ 构建工具配置

### 用户安装流程

用户无需进行任何构建步骤,可直接使用发布的主题:

```bash
# 方式 1: 从 GitHub 克隆
git clone https://github.com/ouraihub-hugo-themes/hugo-theme-paper.git themes/hugo-theme-paper

# 方式 2: 下载发布包
cd themes
wget https://github.com/ouraihub-hugo-themes/hugo-theme-paper/releases/download/v0.2.0/hugo-theme-paper-0.2.0.tar.gz
tar -xzf hugo-theme-paper-0.2.0.tar.gz
```

## 开发工作流

### 本地开发
```bash
# 安装依赖
pnpm install

# 开发模式(监视 CSS 变化)
pnpm run css:watch &
hugo server

# 构建生产版本
pnpm run css:build
hugo --minify --gc
```

### 测试版本
```bash
# 运行测试
pnpm run test

# 运行特定测试
pnpm run test:run browser-compatibility.test.ts

# 查看测试覆盖率
pnpm run test:coverage
```

## 版本管理

遵循 [语义化版本](https://semver.org/lang/zh-CN/):
- `v1.0.0` - 主要版本 (重大变更)
- `v1.2.0` - 次要版本 (新功能,向后兼容)
- `v1.2.3` - 修订版本 (bug 修复)

## GitHub Actions 工作流文件

工作流文件位置: `.github/workflows/publish-release.yml`

支持两种触发方式:
1. **自动触发**: 推送 `v*` 标签
2. **手动触发**: 在 GitHub Actions 中手动运行,输入版本号

## 常见问题

### Q: 如何取消已发布的版本?
A: 可以在 GitHub Releases 页面删除发布,但标签会保留。建议创建新标签进行重新发布。

### Q: 发布前需要做什么准备?
A: 
1. 确保所有测试通过 (`pnpm run test:run`)
2. 更新版本号
3. 更新 CHANGELOG 或发布说明
4. 提交所有更改到 master
5. 创建版本标签并推送

### Q: 发布包中没有包含 node_modules,我该怎么办?
A: 这是设计的。发布包是预编译的,用户无需 npm 依赖。直接在 Hugo 项目中使用即可。

## 相关链接

- [GitHub Releases](https://github.com/ouraihub-hugo-themes/hugo-theme-paper/releases)
- [Hugo Themes 文档](https://gohugo.io/themes/installing-and-using-themes/)
- [主题 README](README.md)
