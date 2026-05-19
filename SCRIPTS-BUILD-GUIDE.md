# 📦 脚本编译和使用指南

## 🎯 编译方式

本项目使用 **esbuild** 统一编译所有 TypeScript 代码，包括：
- 前端代码（`assets/ts/`）
- 命令行脚本（`scripts/`）

### 为什么使用 esbuild？

1. ✅ **统一工具链** - 与前端代码编译保持一致
2. ✅ **快速编译** - 比 tsc 快 10-100 倍
3. ✅ **自动打包** - 自动处理依赖
4. ✅ **零配置** - 不需要额外的 tsconfig

---

## 🚀 使用方法

### 首次安装

```bash
# 安装依赖（会自动编译脚本）
pnpm install
```

`postinstall` 钩子会自动运行 `pnpm scripts:build`，编译脚本到 `bin/` 目录。

### 使用脚本

```bash
# 交互式创建文章
pnpm new-post

# 快速创建文章
pnpm quick-post "文章标题"

# 快速创建中文文章
pnpm quick-post "文章标题" zh
```

---

## 🔧 开发模式

### 编译脚本

```bash
# 编译所有脚本
pnpm scripts:build

# 监听模式（自动重新编译）
pnpm scripts:watch
```

### 编译流程

```
scripts/new-post.ts    →  esbuild  →  bin/new-post.js
scripts/quick-post.ts  →  esbuild  →  bin/quick-post.js
```

### esbuild 配置

```json
{
  "scripts": {
    "scripts:build:new-post": "esbuild scripts/new-post.ts --bundle --platform=node --outfile=bin/new-post.js --target=node18"
  }
}
```

**参数说明：**
- `--bundle` - 打包所有依赖
- `--platform=node` - Node.js 环境
- `--outfile=bin/xxx.js` - 输出文件
- `--target=node18` - 目标 Node.js 版本

---

## 📁 目录结构

```
hugo-theme-paper/
├── scripts/              # TypeScript 源文件
│   ├── new-post.ts      # 交互式创建脚本
│   ├── quick-post.ts    # 快速创建脚本
│   └── README.md        # 使用文档
│
├── bin/                  # 编译后的 JS 文件（自动生成）
│   ├── new-post.js      # ← pnpm new-post 执行这个
│   └── quick-post.js    # ← pnpm quick-post 执行这个
│
├── tests/scripts/        # 测试文件
│   ├── new-post.test.ts
│   └── quick-post.test.ts
│
└── package.json          # 命令配置
```

---

## 🔄 工作流程

### 1. 开发脚本

```bash
# 编辑 TypeScript 源文件
vim scripts/new-post.ts

# 启动监听模式（自动编译）
pnpm scripts:watch
```

### 2. 测试脚本

```bash
# 运行测试
pnpm test:run

# 测试特定文件
pnpm vitest run tests/scripts/new-post.test.ts
```

### 3. 编译脚本

```bash
# 手动编译
pnpm scripts:build

# 或者让 postinstall 自动编译
pnpm install
```

### 4. 使用脚本

```bash
# 使用编译后的脚本
pnpm new-post
pnpm quick-post "My Post"
```

---

## 📊 编译对比

### 方案对比

| 方案 | 优点 | 缺点 | 选择 |
|------|------|------|------|
| **esbuild** | 快速、统一、自动打包 | - | ✅ 当前方案 |
| **tsc** | 标准、类型检查 | 慢、需要单独配置 | ❌ |
| **tsx** | 无需编译 | 运行时依赖、慢 | ❌ |

### 编译速度

```
esbuild:  ~50ms   ✅ 最快
tsc:      ~500ms
tsx:      ~200ms (运行时)
```

---

## 🎯 命令说明

### package.json 中的命令

```json
{
  "scripts": {
    // 编译脚本
    "scripts:build": "编译所有脚本",
    "scripts:build:new-post": "编译 new-post.ts",
    "scripts:build:quick-post": "编译 quick-post.ts",
    "scripts:watch": "监听模式，自动重新编译",
    
    // 使用脚本
    "new-post": "node bin/new-post.js",
    "quick-post": "node bin/quick-post.js",
    
    // 自动编译
    "postinstall": "pnpm scripts:build"
  }
}
```

### 执行流程

```
用户运行: pnpm new-post
    ↓
package.json: "new-post": "node bin/new-post.js"
    ↓
Node.js 执行: bin/new-post.js
    ↓
脚本运行: 创建文章
```

---

## 🔍 常见问题

### Q: bin/ 目录为什么不在 Git 中？

**A:** `bin/` 是编译产物，会在 `pnpm install` 时自动生成，不需要提交到 Git。

### Q: 如何更新脚本？

**A:** 
1. 编辑 `scripts/*.ts` 源文件
2. 运行 `pnpm scripts:build` 重新编译
3. 或者使用 `pnpm scripts:watch` 自动编译

### Q: 为什么不直接用 tsx 运行？

**A:** 
- esbuild 更快
- 与项目其他编译保持一致
- 编译后的 JS 可以直接运行，不需要额外依赖

### Q: 编译失败怎么办？

**A:**
```bash
# 清理并重新编译
rm -rf bin/
pnpm scripts:build

# 检查 TypeScript 错误
pnpm type-check
```

### Q: 如何添加新脚本？

**A:**
1. 在 `scripts/` 创建 `new-script.ts`
2. 在 `package.json` 添加编译命令：
   ```json
   "scripts:build:new-script": "esbuild scripts/new-script.ts --bundle --platform=node --outfile=bin/new-script.js --target=node18"
   ```
3. 添加使用命令：
   ```json
   "new-script": "node bin/new-script.js"
   ```
4. 更新 `scripts:build` 命令包含新脚本

---

## 📝 最佳实践

### 1. 开发时使用监听模式

```bash
# 终端 1: 监听脚本编译
pnpm scripts:watch

# 终端 2: 测试脚本
pnpm test

# 终端 3: 使用脚本
pnpm new-post
```

### 2. 提交前检查

```bash
# 类型检查
pnpm type-check

# 运行测试
pnpm test:run

# 重新编译
pnpm scripts:build
```

### 3. CI/CD 配置

```yaml
# .github/workflows/test.yml
- name: Install dependencies
  run: pnpm install  # 自动编译脚本

- name: Test scripts
  run: pnpm test:run

- name: Build scripts
  run: pnpm scripts:build
```

---

## 🎉 总结

### 编译方式

- ✅ 使用 **esbuild** 统一编译
- ✅ 与前端代码编译保持一致
- ✅ 快速、简单、零配置

### 使用方式

```bash
# 开发
pnpm scripts:watch  # 监听编译

# 使用
pnpm new-post       # 创建文章
pnpm quick-post     # 快速创建

# 测试
pnpm test:run       # 运行测试
```

### 目录结构

```
scripts/  ← 源文件（TypeScript）
bin/      ← 编译产物（JavaScript，自动生成）
```

---

**创建日期：** 2024-11-15  
**编译工具：** esbuild  
**Node.js 版本：** ≥18.0.0
