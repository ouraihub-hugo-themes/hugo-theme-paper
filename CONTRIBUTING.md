# 贡献指南

欢迎贡献 Hugo Paper! 本指南将帮助您了解如何贡献代码、文档或报告问题。

## 📋 行为守则

请参与者遵守我们的行为守则，确保一个尊重、包容的社区环境。

## 🐛 报告 Bug

### 提交 Bug 报告

请通过 [GitHub Issues](https://github.com/ouraihub-hugo-themes/hugo-paper/issues) 报告 Bug。

**提交时请包含**:
1. 明确的 Bug 描述
2. 复现步骤
3. 预期行为和实际行为
4. 操作系统和 Hugo 版本
5. 相关的错误消息或截图

### Bug 报告模板

```markdown
## Bug 描述
简要描述 Bug。

## 复现步骤
1. ...
2. ...
3. ...

## 预期行为
应该发生什么。

## 实际行为
实际上发生了什么。

## 环境
- OS: [e.g., macOS 14.0]
- Hugo 版本: [e.g., 0.120.0]
- Node.js 版本: [e.g., 18.0.0]
- 主题版本: [e.g., 0.1.0]
```

## 💡 建议新功能

通过 [GitHub Issues](https://github.com/ouraihub-hugo-themes/hugo-paper/issues) 提交功能建议。

**请包含**:
1. 功能的简要描述
2. 为什么您认为这是有用的
3. 可能的实施方式 (可选)

## 🔀 提交 Pull Request

### 准备工作

1. Fork 项目仓库 https://github.com/ouraihub-hugo-themes/hugo-paper
2. Clone 到本地
   ```bash
   git clone https://github.com/yourusername/hugo-paper.git
   cd hugo-paper
   ```
3. 创建新分支
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. 安装依赖
   ```bash
   pnpm install
   ```

### 开发工作流

1. 在新分支上进行修改
2. 确保代码通过检查
   ```bash
   pnpm type-check    # TypeScript 类型检查
   pnpm format:check  # 格式检查
   pnpm lint          # ESLint 检查 (可选)
   ```
3. 格式化代码
   ```bash
   pnpm format
   ```
4. 提交更改
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```
5. Push 到 GitHub
   ```bash
   git push origin feature/your-feature-name
   ```
6. 提交 Pull Request

### Commit 信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**类型**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档
- `style`: 代码风格变化 (不影响功能)
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试
- `chore`: 构建、依赖等

**示例**:
```
feat(header): 添加主题切换按钮

实现了通过点击按钮切换浅色/深色主题的功能。
使用 localStorage 保存用户偏好设置。

Closes #123
```

### Pull Request 检查清单

提交 PR 前请检查:

- [ ] 代码遵循项目风格
- [ ] TypeScript 类型检查通过 (`pnpm type-check`)
- [ ] 代码已格式化 (`pnpm format`)
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 测试已通过 (如适用)
- [ ] Commit 信息清晰有意义

### PR 模板

```markdown
## 描述
请简要描述此 PR 做了什么。

## 相关 Issue
Closes #(issue number)

## 改动类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] Breaking 变化
- [ ] 文档更新

## 改动详情
- 改动 1
- 改动 2
- ...

## 测试
已在以下环境测试:
- [ ] macOS
- [ ] Linux
- [ ] Windows

## 截图 (如适用)
附加截图或 GIF。

## 检查清单
- [ ] 代码已自测
- [ ] 已添加注释
- [ ] 已更新相关文档
- [ ] 没有引入新的警告
- [ ] 测试通过
```

## 📝 改进文档

### 文档贡献方式

1. 发现文档问题或不清楚的地方
2. Fork 并修改文档
3. 提交 Pull Request

### 文档标准

文档应该:
- ✅ 清晰易懂
- ✅ 包含代码示例
- ✅ 链接到相关资源
- ✅ 遵循格式规范

### 文档文件

主要文档文件:
- `README.md` - 快速开始指南
- `DESIGN.md` - 设计文档
- `CONFIG.md` - 配置指南
- `CONTRIBUTING.md` - 本文件

## 🎨 代码规范

### TypeScript

遵循以下规范:

```typescript
// 使用 strict 模式
// 明确的类型注解
function process(data: string[]): Record<string, number> {
  // 实现
}

// 避免 any 类型
// const data: any = ...  // ❌ 不好

const data: unknown = ...  // ✅ 好
```

### CSS/Tailwind

使用 Tailwind 工具类而非自定义 CSS:

```html
<!-- ✅ 好 -->
<div class="bg-background text-foreground p-4 rounded">
  Content
</div>

<!-- ❌ 不好 -->
<div style="background: #fff; color: #333; padding: 1rem;">
  Content
</div>
```

### HTML/模板

使用语义 HTML 和 ARIA 属性:

```html
<!-- ✅ 好 -->
<button aria-label="切换主题" id="theme-btn">
  <span aria-hidden="true">🌙</span>
  <span class="sr-only">主题</span>
</button>

<!-- ❌ 不好 -->
<div onclick="toggleTheme()" role="button">
  主题
</div>
```

## 🧪 测试

### 本地测试

1. 启动开发服务器
   ```bash
   pnpm dev
   ```
2. 访问 `http://localhost:1313`
3. 验证功能是否正常

### 构建测试

```bash
# 生产构建
pnpm build

# 检查输出
ls -la public/
```

## 📚 资源

- [Hugo 文档](https://gohugo.io/documentation/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)

## 👥 社区

- **讨论**: [GitHub Discussions](https://github.com/ouraihub-hugo-themes/hugo-paper/discussions)
- **问题**: [GitHub Issues](https://github.com/ouraihub-hugo-themes/hugo-paper/issues)

## 📜 许可证

通过贡献代码,您同意您的贡献将在项目许可证 (MIT) 下发布。

## 🙏 感谢

感谢所有为 Hugo Paper 做出贡献的人!您的帮助使这个项目变得更好。

---

**编写日期**: 2024-11-11  
**维护者**: Hugo Paper Team
