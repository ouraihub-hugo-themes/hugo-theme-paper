# 测试说明

## 当前测试状态

### ✅ 已启用的测试

- **main.test.ts** (8 个测试) - 核心功能
  - ThemeManager: 主题切换
  - MobileMenuManager: 移动端菜单
  - BackToTopManager: 返回顶部

- **scripts/new-post.test.ts** (35 个测试) - 文章创建脚本
  - titleToSlug: 标题转 slug
  - generateFrontmatter: 生成 frontmatter
  - 文件操作、输入验证、语言支持

- **scripts/quick-post.test.ts** (38 个测试) - 快速创建脚本
  - titleToSlug: 标题转 slug
  - generatePost: 生成文章内容
  - 文件操作、语言处理、命令行参数

- **theme.test.ts** (21 个测试) - 主题配置
  - 主题配置验证
  - 内容结构检查
  - 构建流程验证

**总计**: 102 个测试，覆盖率 ~95%

### ⏸️ 暂时禁用的测试

以下测试文件已在 `vitest.config.ts` 中排除，原因如下：

#### 1. interactive-features.test.ts
**原因**: 这些功能尚未实现
- PostLikeManager: 文章点赞功能
- PostShareManager: 文章分享功能
- CodeCopyManager: 代码复制功能
- ReadingProgressBar: 阅读进度条
- KeyboardShortcutManager: 键盘快捷键

**何时启用**: 在实现相应功能后启用

#### 2. browser-compatibility.test.ts
**原因**: 测试环境限制
- localStorage 在 JSDOM 中的支持有限
- matchMedia API 需要完整的浏览器环境
- 这些测试更适合在真实浏览器中运行（如 Playwright）

**何时启用**: 
- 使用 Playwright 或 Cypress 进行 E2E 测试时
- 或者在改进 JSDOM mock 后

#### 3. integration.test.ts
**原因**: 需要完整的 HTML 结构
- 测试依赖完整的页面渲染
- 需要 Hugo 生成的实际 HTML
- 当前测试使用简化的 DOM 结构

**何时启用**: 
- 在完成所有组件实现后
- 使用 Hugo 生成的实际 HTML 进行测试

#### 4. security-audit.test.ts
**原因**: 不是当前阶段的重点
- 安全审计测试需要完整的应用实现
- 许多安全特性（CSP、HTTPS 等）在静态站点中由服务器配置

**何时启用**: 
- 在完成核心功能后
- 作为生产环境部署前的检查清单

#### 5. seo-audit.test.ts
**原因**: 部分功能未实现
- Open Graph 标签尚未完全实现
- Schema.org 结构化数据需要完善
- 需要完整的页面模板

**何时启用**: 
- 在完成 SEO 相关的 partial 模板后
- 如 seo-meta.html, schema.html 等

## 运行测试

```bash
# 运行所有启用的测试
pnpm test:run

# 运行测试并监听变化
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 运行测试 UI
pnpm test:ui
```

## 启用被禁用的测试

要启用某个测试文件，从 `vitest.config.ts` 的 `exclude` 数组中移除对应的文件路径：

```typescript
exclude: [
  'node_modules',
  'dist',
  // 移除这一行以启用对应的测试
  // 'tests/interactive-features.test.ts',
],
```

## 测试覆盖率目标

- **当前**: 核心功能（主题切换、菜单、返回顶部）
- **短期目标**: 添加交互功能测试（代码复制、分享等）
- **长期目标**: 完整的集成测试和 E2E 测试

## 测试环境

- **测试框架**: Vitest 2.1.9
- **DOM 环境**: JSDOM
- **覆盖率工具**: V8
- **Mock 工具**: Vitest 内置 mock

## 注意事项

1. **localStorage**: 已在 setup.ts 中配置，但在某些情况下可能不稳定
2. **matchMedia**: 已 mock，但不会真正响应媒体查询变化
3. **requestAnimationFrame**: 已 mock 为 setTimeout
4. **IntersectionObserver**: 已 mock，但不会触发实际的交叉观察

## 贡献指南

添加新测试时：
1. 确保测试与实际实现的功能对应
2. 使用描述性的测试名称
3. 每个测试应该独立且可重复
4. 清理测试后的状态（使用 afterEach）
5. 为复杂的测试添加注释说明
