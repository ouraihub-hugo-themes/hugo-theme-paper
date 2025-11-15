# 版本发布指南

本项目使用 [standard-version](https://github.com/conventional-changelog/standard-version) 进行自动化版本管理。

## 快速开始

### 1. 按规范提交代码

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 新功能（minor 版本）
git commit -m "feat: 添加文章创建脚本"

# Bug 修复（patch 版本）
git commit -m "fix: 修复主题切换问题"

# 重大更新（major 版本）
git commit -m "feat!: 重构主题系统"
# 或
git commit -m "feat: 重构主题系统

BREAKING CHANGE: 不兼容旧版本配置"

# 文档更新
git commit -m "docs: 更新安装文档"

# 样式调整
git commit -m "style: 调整按钮样式"

# 代码重构
git commit -m "refactor: 重构搜索功能"

# 性能优化
git commit -m "perf: 优化图片加载"

# 测试
git commit -m "test: 添加单元测试"

# 构建相关
git commit -m "build: 更新依赖"

# CI/CD
git commit -m "ci: 更新 GitHub Actions"

# 其他
git commit -m "chore: 更新 .gitignore"
```

### 2. 发布新版本

```bash
# 自动判断版本类型（推荐）
pnpm release

# 手动指定版本类型
pnpm release:patch  # 0.7.2 -> 0.7.3
pnpm release:minor  # 0.7.2 -> 0.8.0
pnpm release:major  # 0.7.2 -> 1.0.0
```

## 自动完成的事情

运行 `pnpm release` 后，会自动：

1. ✅ 分析 git commit 历史
2. ✅ 决定版本号（基于 commit 类型）
3. ✅ 更新 `package.json` 的 version
4. ✅ 生成/更新 `CHANGELOG.md`
5. ✅ 创建 git commit（`chore(release): v0.7.3`）
6. ✅ 创建 git tag（`v0.7.3`）
7. ✅ 推送到 GitHub（包括 tag）

## Commit 类型说明

| 类型 | 说明 | 版本影响 | CHANGELOG 分类 |
|------|------|---------|---------------|
| `feat` | 新功能 | minor | ✨ 新功能 |
| `fix` | Bug 修复 | patch | 🐛 Bug 修复 |
| `docs` | 文档更新 | - | 📝 文档 |
| `style` | 样式调整 | - | 💄 样式 |
| `refactor` | 代码重构 | - | ♻️ 重构 |
| `perf` | 性能优化 | patch | ⚡ 性能优化 |
| `test` | 测试相关 | - | ✅ 测试 |
| `build` | 构建相关 | - | 📦 构建 |
| `ci` | CI/CD | - | 👷 CI/CD |
| `chore` | 其他 | - | 🔧 其他 |

**重大更新**：在 commit 类型后加 `!` 或在 body 中添加 `BREAKING CHANGE:`

## 版本号规则

遵循 [语义化版本](https://semver.org/lang/zh-CN/)：`MAJOR.MINOR.PATCH`

- **MAJOR**（主版本号）：不兼容的 API 修改
- **MINOR**（次版本号）：向下兼容的功能性新增
- **PATCH**（修订号）：向下兼容的问题修正

### 自动判断规则

- 有 `feat` commit → minor 版本
- 有 `fix` 或 `perf` commit → patch 版本
- 有 `BREAKING CHANGE` → major 版本
- 只有 `docs`, `style`, `chore` 等 → 不发布新版本

## 工作流程示例

### 场景 1：修复 Bug

```bash
# 1. 修复代码
# 2. 提交
git add .
git commit -m "fix: 修复主题切换闪烁问题"

# 3. 发布（自动 patch）
pnpm release
# 0.7.2 -> 0.7.3
```

### 场景 2：添加新功能

```bash
# 1. 开发新功能
# 2. 提交
git add .
git commit -m "feat: 添加代码复制按钮"

# 3. 发布（自动 minor）
pnpm release
# 0.7.2 -> 0.8.0
```

### 场景 3：重大更新

```bash
# 1. 重构代码
# 2. 提交
git add .
git commit -m "feat!: 重构配置系统

BREAKING CHANGE: 配置文件格式已更改，需要手动迁移"

# 3. 发布（自动 major）
pnpm release
# 0.7.2 -> 1.0.0
```

### 场景 4：多个 commit

```bash
# 提交多个更改
git commit -m "feat: 添加搜索功能"
git commit -m "fix: 修复移动端样式"
git commit -m "docs: 更新文档"

# 一次性发布（自动判断为 minor）
pnpm release
# 0.7.2 -> 0.8.0
```

## CHANGELOG 示例

生成的 `CHANGELOG.md` 格式：

```markdown
# Changelog

## [0.8.0](https://github.com/ouraihub-hugo-themes/hugo-theme-paper/compare/v0.7.2...v0.8.0) (2024-11-15)

### ✨ 新功能

* 添加搜索功能 ([abc1234](https://github.com/ouraihub-hugo-themes/hugo-theme-paper/commit/abc1234))
* 添加代码复制按钮 ([def5678](https://github.com/ouraihub-hugo-themes/hugo-theme-paper/commit/def5678))

### 🐛 Bug 修复

* 修复移动端样式 ([ghi9012](https://github.com/ouraihub-hugo-themes/hugo-theme-paper/commit/ghi9012))

### 📝 文档

* 更新文档 ([jkl3456](https://github.com/ouraihub-hugo-themes/hugo-theme-paper/commit/jkl3456))
```

## 高级用法

### 预发布版本

```bash
# 创建 alpha 版本
pnpm exec standard-version --prerelease alpha
# 0.7.2 -> 0.7.3-alpha.0

# 创建 beta 版本
pnpm exec standard-version --prerelease beta
# 0.7.2 -> 0.7.3-beta.0
```

### 跳过某些步骤

```bash
# 只生成 CHANGELOG，不创建 tag
pnpm exec standard-version --skip.tag

# 只创建 tag，不生成 CHANGELOG
pnpm exec standard-version --skip.changelog
```

### 首次发布

```bash
# 首次使用 standard-version
pnpm release:first
```

## 配置文件

配置文件：`.versionrc.json`

```json
{
  "types": [
    { "type": "feat", "section": "✨ 新功能" },
    { "type": "fix", "section": "🐛 Bug 修复" },
    ...
  ],
  "commitUrlFormat": "...",
  "compareUrlFormat": "...",
  ...
}
```

## 故障排除

### 问题 1：推送失败

**原因**：没有推送权限或网络问题

**解决**：
```bash
# 手动推送
git push --follow-tags origin master
```

### 问题 2：版本号不对

**原因**：commit message 格式不正确

**解决**：
1. 检查 commit message 是否符合规范
2. 使用 `pnpm release:patch/minor/major` 手动指定

### 问题 3：CHANGELOG 没有更新

**原因**：没有符合规范的 commit

**解决**：
1. 确保 commit message 以 `feat:`, `fix:` 等开头
2. 检查 `.versionrc.json` 配置

## 最佳实践

1. ✅ **每次提交都使用规范的 commit message**
2. ✅ **小步提交，频繁发布**
3. ✅ **发布前检查 CHANGELOG**
4. ✅ **重大更新前通知用户**
5. ✅ **保持 CHANGELOG 可读性**

## 参考资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [standard-version](https://github.com/conventional-changelog/standard-version)
- [Keep a Changelog](https://keepachangelog.com/)
