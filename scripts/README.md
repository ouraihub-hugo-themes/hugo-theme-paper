# Scripts 目录

此目录包含用于自动化任务的 TypeScript 脚本。

## generate-chroma-themed.ts

自动生成带主题前缀的 Chroma 深色模式样式。

### 功能

1. 读取 `assets/css/chroma-dark.css`（Hugo 生成的原始文件）
2. 为所有 CSS 选择器添加 `html[data-theme="dark"]` 前缀
3. 生成 `assets/css/chroma-dark-themed.css`（自动生成的文件）

### 使用方法

```bash
# 手动运行
pnpm chroma:generate

# 自动运行（在 css:build 时）
pnpm css:build
```

### 工作流程

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 使用 Hugo 生成原始 Chroma 样式                            │
└─────────────────────────────────────────────────────────────┘
   hugo gen chromastyles --style=github > chroma-light.css
   hugo gen chromastyles --style=monokai > chroma-dark.css

┌─────────────────────────────────────────────────────────────┐
│ 2. 运行脚本自动添加主题前缀                                  │
└─────────────────────────────────────────────────────────────┘
   pnpm chroma:generate
   
   输入: chroma-dark.css
   输出: chroma-dark-themed.css (带 html[data-theme="dark"] 前缀)

┌─────────────────────────────────────────────────────────────┐
│ 3. Tailwind 编译所有 CSS                                     │
└─────────────────────────────────────────────────────────────┘
   pnpm css:build
   
   main.css 导入:
   - chroma-light.css (浅色模式)
   - chroma-dark-themed.css (深色模式)
   - 其他样式文件
```

### 文件说明

| 文件 | 类型 | 说明 |
|------|------|------|
| `chroma-light.css` | 源文件 | Hugo 生成的浅色模式样式 |
| `chroma-dark.css` | 源文件 | Hugo 生成的深色模式样式 |
| `chroma-dark-themed.css` | 生成文件 | 自动生成，带主题前缀 |

### 更新 Chroma 主题

如果需要更换 Chroma 主题：

```bash
# 1. 重新生成原始文件
hugo gen chromastyles --style=dracula > assets/css/chroma-dark.css

# 2. 运行脚本生成带前缀的版本
pnpm chroma:generate

# 3. 构建 CSS
pnpm css:build
```

### 注意事项

⚠️ **不要手动编辑 `chroma-dark-themed.css`！**

此文件由脚本自动生成。如需修改：
1. 编辑 `chroma-dark.css`
2. 运行 `pnpm chroma:generate`

### 技术细节

- **语言**: TypeScript
- **编译器**: esbuild
- **输出格式**: ESM
- **目标**: Node.js 18+

脚本在 CSS 构建前自动运行，确保始终使用最新的主题样式。
