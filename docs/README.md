# Hugo Paper 开发文档

本目录包含 Hugo Paper 主题的开发和维护文档。

## 📚 文档索引

### 开发指南

#### [📝 脚本使用指南](./SCRIPTS.md)
- 文章创建脚本（new-post, quick-post）
- 自动路径检测
- 使用方法和最佳实践

#### [🚀 版本发布指南](./RELEASE.md)
- standard-version 使用方法
- Conventional Commits 规范
- 自动化版本管理流程
- CHANGELOG 自动生成

### 架构文档

#### [🏗️ Hugo Modules 最佳实践](./HUGO_MODULES_BEST_PRACTICES.md)
- Hugo Modules 配置问题解决
- 主题作为模块的最佳实践
- Mounts 配置指南

#### [📁 目录结构分析](./DIRECTORY_STRUCTURE_ANALYSIS.md)
- 主题目录结构说明
- 资源加载策略
- 开发仓库 vs 分发仓库

#### [🎨 Markdown 代码渲染方案](./MARKDOWN_CODE_RENDERING_PLAN.md)
- 代码块外壳与语法高亮分层
- daisyUI 与 Chroma / Shiki 的职责划分
- 主题切换和复制按钮的统一实现

#### [📱 daisyUI 移动端布局方案](./MOBILE_LAYOUT_WITH_DAISYUI.md)
- 导航、抽屉、菜单的响应式复用
- 保留文章正文和代码渲染自定义
- 先导航、再卡片、最后正文

#### [🧭 daisyUI 采用执行清单](./DAISYUI_ADOPTION_EXECUTION_PLAN.md)
- 先改 `hugo-theme-paper`
- `ui-library` 只做支撑层
- 哪些文件改、哪些不动

#### [🔐 依赖漏洞修复记录](./DEPENDENCY_VULNERABILITY_FIX.md)
- `pnpm audit` 漏洞定位流程
- `vite` / `esbuild` / `vitest` 修复思路
- `pnpm-workspace.yaml` override 和 `allowBuilds` 注意事项

## 🔗 相关资源

### 主仓库
- [开发仓库](https://github.com/ouraihub-hugo-themes/hugo-theme-paper) - 源代码
- [分发仓库](https://github.com/ouraihub-hugo-themes/hugo-theme-paper-dist) - 预编译版本
- [Starter 模板](https://github.com/ouraihub-hugo-themes/hugo-theme-paper-starter) - 快速启动

### 外部文档
- [Hugo 官方文档](https://gohugo.io/documentation/)
- [Hugo Modules](https://gohugo.io/hugo-modules/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## 📖 快速链接

### 常见任务

**创建新文章**
```bash
pnpm new-post "文章标题" [语言]
```
详见：[SCRIPTS.md](./SCRIPTS.md)

**发布新版本**
```bash
pnpm release
```
详见：[RELEASE.md](./RELEASE.md)

**配置 Hugo Modules**
详见：[HUGO_MODULES_BEST_PRACTICES.md](./HUGO_MODULES_BEST_PRACTICES.md)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支（`git checkout -b feature/AmazingFeature`）
3. 按规范提交（`git commit -m 'feat: Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 创建 Pull Request

## 📝 文档维护

### 添加新文档

1. 在 `docs/` 目录创建 Markdown 文件
2. 更新本 README 的索引
3. 提交时使用 `docs:` 前缀

### 更新现有文档

1. 修改对应的 Markdown 文件
2. 确保链接和引用正确
3. 提交时使用 `docs:` 前缀

## 📄 许可证

MIT License - 详见 [LICENSE](../LICENSE)
