# Shiki 预处理器

这个目录包含 Shiki 代码高亮预处理器的实现。

## 文件结构

```
scripts/shiki/
├── types.ts              # TypeScript 类型定义
├── fileName-transformer.ts  # 文件名 transformer（复刻 AstroPaper）
├── processor.ts          # Shiki 处理器核心
├── cache.ts              # 缓存系统
├── markdown-scanner.ts   # Markdown 文件扫描器
├── build.ts              # 构建脚本（CLI 入口）
├── index.ts              # 模块导出
└── README.md             # 本文件
```

## 功能特性

### 1. ShikiProcessor（处理器）

负责使用 Shiki 处理代码块，支持：
- 双主题（light/dark）
- 文件名显示
- 代码差异高亮（diff）
- 行高亮
- 词高亮
- 语言支持检测
- 错误处理和回退

### 2. ShikiCache（缓存系统）

提供高效的缓存机制：
- 内存缓存（快速访问）
- 磁盘缓存（持久化）
- 基于 SHA-256 的 hash 计算
- 缓存失效策略（默认 1 小时）
- 两级目录结构（避免单目录文件过多）

### 3. MarkdownScanner（扫描器）

扫描和提取 Markdown 文件中的代码块：
- 支持 glob 模式
- 提取代码块信息（语言、meta、内容、位置）
- 增量构建支持（基于文件修改时间）

### 4. transformerFileName（文件名 transformer）

完全复刻 AstroPaper 的文件名显示功能：
- 两种样式（v1: tab 风格，v2: badge 风格）
- 绿色圆点指示器
- 可配置隐藏圆点
- 与 AstroPaper 完全一致的样式

## 使用方法

### 命令行使用

```bash
# 处理默认内容目录（content/）
pnpm shiki:process

# 处理指定目录
node bin/shiki-build.js --content-dir path/to/content

# 详细输出
node bin/shiki-build.js --verbose

# 禁用并行处理
node bin/shiki-build.js --no-parallel

# 禁用增量构建
node bin/shiki-build.js --no-incremental
```

### 编程使用

```typescript
import { ShikiBuild } from './scripts/shiki/index.js';

const build = new ShikiBuild({
  contentDir: 'content',
  outputDir: '.shiki-output',
  cacheDir: '.shiki-cache',
  verbose: true,
  parallel: true,
  concurrency: 4,
});

await build.run();
```

## 配置

默认配置（与 AstroPaper 一致）：

```typescript
{
  themes: {
    light: "min-light",
    dark: "night-owl",
  },
  defaultColor: false,
  wrap: false,
  transformers: {
    fileName: true,
    diff: true,
    highlight: true,
    wordHighlight: false,
  },
  fileNameOptions: {
    style: "v2",
    hideDot: false,
  },
  diffOptions: {
    matchAlgorithm: "v3",
  },
}
```

## 输出格式

处理后的结果保存为 JSON 文件：

```json
[
  {
    "index": 0,
    "lang": "javascript",
    "meta": "file=example.js",
    "line": 7,
    "html": "<pre class=\"shiki...\">...</pre>",
    "success": true
  }
]
```

## 性能

- **首次处理**: ~50ms/block
- **缓存命中**: ~2-3ms/block
- **提升**: ~18x

## 缓存目录结构

```
.shiki-cache/
├── 26/
│   └── 26dba5297216b8fe5d171db3681efd4a08bdf7a680c029bcd808d4d3ec1cb173.json
├── 6a/
│   └── 6a29476f5ceeaf355dea0efcfc25caefa0565465e615e8f3d74da9ae8b2e7107.json
└── dd/
    └── dd4a695526681dddc45e5b296091760596acb27acd09338742d9290e3ef2db5a.json
```

## 开发

### 编译脚本

```bash
# 编译 Shiki 构建脚本
pnpm run scripts:build:shiki

# 编译所有脚本
pnpm run scripts:build
```

### 类型检查

```bash
pnpm type-check
```

### 测试

```bash
# 创建测试文件
echo '```javascript\nconst x = 1;\n```' > test.md

# 运行处理
node bin/shiki-build.js --content-dir . --verbose

# 检查输出
cat .shiki-output/test.json
```

## 参考

- AstroPaper 源码: `astro-paper/src/utils/transformers/fileName.js`
- AstroPaper 配置: `astro-paper/astro.config.ts`
- Shiki 文档: https://shiki.style/
- Shiki Transformers: https://shiki.style/packages/transformers
