# Hugo Paper 主题设计文档

## 📋 目录
1. [项目概述](#项目概述)
2. [需求分析](#需求分析)
3. [技术架构](#技术架构)
4. [目录结构](#目录结构)
5. [设计规范](#设计规范)
6. [开发指南](#开发指南)
7. [功能清单](#功能清单)
8. [性能目标](#性能目标)

---

## 项目概述

### 项目信息
- **项目名称**: Hugo Paper
- **项目类型**: Hugo 静态站点主题
- **基础参考**: astro-paper (Astro 博客主题)
- **目标用户**: 博客爱好者、开发者、内容创作者
- **主要特点**: 最小化、响应式、无障碍、SEO 友好

### 核心目标
将 Astro 框架的 astro-paper 主题完整复刻为 Hugo 版本,同时采用现代化技术栈 (Tailwind CSS v4 + TypeScript),确保性能、可用性和开发体验的优秀。

### 技术栈
```
┌─────────────────────────────────────┐
│     Hugo Paper Theme Stack          │
├─────────────────────────────────────┤
│ Static Site Generator: Hugo         │
│ CSS Framework: Tailwind CSS v4      │
│ Scripting Language: TypeScript      │
│ Build Tool: Hugo Pipes + PostCSS    │
│ Search Engine: Pagefind             │
│ Markdown Processor: Goldmark        │
│ Code Highlighting: Chroma           │
└─────────────────────────────────────┘
```

---

## 需求分析

### 1.1 功能需求

#### **页面类型** (9 种)

| 页面类型 | 描述 | 对应 Astro 页面 | Hugo 实现方式 |
|---------|------|-----------------|--------------|
| 首页 | 展示 Featured 和 Recent 文章 | `index.astro` | `layouts/index.html` |
| 文章列表页 | 分页文章列表 | `posts/[...page].astro` | `layouts/posts/list.html` + Hugo Paginate |
| 文章详情页 | 单篇文章完整展示 | `posts/[...slug]/index.astro` | `layouts/posts/single.html` |
| 标签列表页 | 所有标签展示 | `tags/index.astro` | `layouts/tags/terms.html` |
| 标签文章页 | 某标签下的文章 | `tags/[tag]/[...page].astro` | `layouts/tags/list.html` |
| 关于页 | 个人/网站简介 | AboutLayout | `layouts/page/single.html` |
| 归档页 | 按年份分组的文章 | `archives/index.astro` | `layouts/archives/list.html` |
| 搜索页 | 实时搜索功能 | `search.astro` | `layouts/search/single.html` |
| 404 页面 | 页面未找到 | `404.astro` | `layouts/404.html` |

#### **UI 组件** (14 个)

| 组件名 | 功能 | 对应 Astro 组件 | Hugo 实现 |
|-------|------|-----------------|----------|
| Header | 导航栏、主题切换、移动端菜单 | `Header.astro` | `partials/header.html` |
| Footer | 页脚信息 | `Footer.astro` | `partials/footer.html` |
| Card | 文章卡片 | `Card.astro` | `partials/card.html` |
| Pagination | 分页控件 | `Pagination.astro` | `partials/pagination.html` |
| Breadcrumb | 面包屑导航 | `Breadcrumb.astro` | `partials/breadcrumb.html` |
| Datetime | 日期时间显示 | `Datetime.astro` | `partials/datetime.html` |
| Tag | 标签组件 | `Tag.astro` | `partials/tag.html` |
| Socials | 社交媒体链接 | `Socials.astro` | `partials/socials.html` |
| Hr | 分隔线 | `Hr.astro` | `partials/hr.html` |
| LinkButton | 链接按钮 | `LinkButton.astro` | `partials/link-button.html` |
| ShareLinks | 分享链接 | `ShareLinks.astro` | `partials/share-links.html` |
| BackButton | 返回按钮 | `BackButton.astro` | `partials/back-button.html` |
| BackToTopButton | 回到顶部按钮 | `BackToTopButton.astro` | JavaScript 实现 |
| EditPost | 编辑文章链接 | `EditPost.astro` | `partials/edit-post.html` |

#### **核心特性**

```
✅ SEO 优化
   ├── Open Graph 元标签
   ├── Twitter Cards
   ├── JSON-LD 结构化数据
   ├── Sitemap 生成
   └── RSS 订阅

✅ 无障碍性 (A11y)
   ├── 键盘导航支持
   ├── 屏幕阅读器兼容
   ├── ARIA 标签
   ├── 语义 HTML
   └── 色彩对比度符合 WCAG AA

✅ 响应式设计
   ├── 移动优先
   ├── 流动布局
   ├── 灵活图片
   └── 触摸友好的交互

✅ 主题系统
   ├── 浅色主题
   ├── 深色主题
   ├── 自动检测系统偏好
   └── 手动切换功能

✅ 搜索功能
   ├── Pagefind 静态搜索
   ├── 实时搜索结果
   ├── 高亮显示匹配项
   └── 客户端搜索 (无需后端)

✅ 内容特性
   ├── 草稿支持
   ├── 分页机制
   ├── 阅读时间计算
   ├── 目录 (TOC) 生成
   ├── 代码高亮 (Chroma)
   ├── 数学公式 (可选 KaTeX)
   └── 内容分类和标签
```

### 1.2 非功能需求

#### **性能指标** (Lighthouse)
- ⚡ Performance: ≥ 95
- ♿ Accessibility: ≥ 95  
- ✅ Best Practices: ≥ 95
- 🔍 SEO: 100

#### **浏览器兼容性**
- Chrome/Edge (最新 2 个版本)
- Firefox (最新 2 个版本)
- Safari (最新 2 个版本)
- 移动浏览器 (iOS Safari, Chrome Mobile)

#### **代码质量**
- 遵循 TypeScript strict 模式
- 遵循 Tailwind CSS v4 最佳实践
- 代码格式化 (Prettier)
- ESLint 检查 (可选)

---

## 技术架构

### 2.1 整体架构

```
┌──────────────────────────────────────────────────────────┐
│                    Hugo Paper Theme                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Content    │  │   Assets     │  │  Templates   │  │
│  │  (Markdown)  │  │ (CSS/TS/IMG) │  │  (HTML)      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                 │                   │          │
│         └─────────────────┼───────────────────┘          │
│                           │                              │
│         ┌─────────────────▼───────────────────┐         │
│         │      Hugo Build Pipeline            │         │
│         ├─────────────────────────────────────┤         │
│         │  1. 解析 Markdown 内容              │         │
│         │  2. 处理 CSS (Tailwind + PostCSS)  │         │
│         │  3. 构建 TypeScript (esbuild)      │         │
│         │  4. 应用模板                        │         │
│         │  5. 生成静态 HTML                   │         │
│         └─────────────────┬───────────────────┘         │
│                           │                              │
│                    ┌──────▼──────┐                       │
│                    │  Public Dir  │                       │
│                    │ (Static Site)│                       │
│                    └──────┬──────┘                       │
│                           │                              │
│  ┌────────────────────────▼────────────────────────┐   │
│  │  Post-Build: Pagefind (搜索索引)               │   │
│  │  Post-Deploy: CDN / Web Server                 │   │
│  └────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 2.2 样式架构

#### **Tailwind CSS v4 集成**

```css
/* assets/css/main.css */

/* 导入 Tailwind 核心 */
@import "tailwindcss";

/* 定义自定义主题变量 */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-accent: var(--accent);
  --color-muted: var(--muted);
  --color-border: var(--border);
}

/* 创建自定义变体 */
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

/* 自定义基础样式 */
@layer base {
  /* 重置和全局样式 */
}

/* 自定义工具类 */
@utility max-w-app {
  max-width: 48rem; /* 3xl */
}

/* 组件样式 */
@layer components {
  /* 组件样式 */
}
```

#### **主题变量系统**

```css
/* Light Theme */
:root,
html[data-theme="light"] {
  --background: #fdfdfd;
  --foreground: #282728;
  --accent: #006cac;
  --muted: #e6e6e6;
  --border: #ece9e9;
}

/* Dark Theme */
html[data-theme="dark"] {
  --background: #212737;
  --foreground: #eaedf3;
  --accent: #ff6b01;
  --muted: #343f60;
  --border: #ab4b08;
}
```

### 2.3 脚本架构

#### **TypeScript 模块化**

```
assets/ts/
├── index.ts           # 入口文件
├── theme.ts           # 主题管理
├── menu.ts            # 移动菜单
├── search.ts          # 搜索功能
├── scroll.ts          # 回到顶部
├── types.ts           # 类型定义
└── utils/
    ├── dom.ts         # DOM 工具
    ├── storage.ts     # 本地存储
    └── event.ts       # 事件处理
```

#### **构建配置**

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## 目录结构

### 3.1 完整目录树

```
hugo-paper/
│
├── archetypes/              # 内容模板
│   ├── default.md          # 默认模板
│   └── post.md             # 文章模板
│
├── assets/                  # 需要处理的资源
│   ├── css/
│   │   ├── main.css        # Tailwind + 自定义样式
│   │   └── typography.css  # 排版样式
│   │
│   ├── ts/
│   │   ├── index.ts        # 入口文件
│   │   ├── theme.ts        # 主题切换逻辑
│   │   ├── menu.ts         # 移动端菜单
│   │   ├── search.ts       # 搜索功能
│   │   ├── scroll.ts       # 回到顶部
│   │   ├── types.ts        # 类型定义
│   │   └── utils/
│   │       ├── dom.ts      # DOM 工具函数
│   │       ├── storage.ts  # LocalStorage 工具
│   │       └── event.ts    # 事件处理工具
│   │
│   └── icons/              # SVG 图标
│       ├── icon-sun.svg
│       ├── icon-moon.svg
│       ├── icon-menu.svg
│       ├── icon-search.svg
│       ├── icon-archive.svg
│       └── ... (其他图标)
│
├── layouts/                # 页面模板
│   ├── _default/
│   │   ├── baseof.html     # 基础模板
│   │   ├── home.html       # 首页
│   │   ├── single.html     # 单页
│   │   ├── list.html       # 列表页
│   │   └── 404.html        # 404 页面
│   │
│   ├── partials/           # 组件模板
│   │   ├── head.html       # <head> 标签
│   │   ├── header.html     # 页头
│   │   ├── footer.html     # 页脚
│   │   ├── card.html       # 文章卡片
│   │   ├── pagination.html # 分页
│   │   ├── breadcrumb.html # 面包屑
│   │   ├── datetime.html   # 日期时间
│   │   ├── tag.html        # 标签
│   │   ├── socials.html    # 社交链接
│   │   ├── hr.html         # 分隔线
│   │   ├── link-button.html # 链接按钮
│   │   ├── back-button.html # 返回按钮
│   │   ├── share-links.html # 分享链接
│   │   ├── edit-post.html  # 编辑链接
│   │   ├── toc.html        # 目录
│   │   │
│   │   └── seo/            # SEO 相关
│   │       ├── opengraph.html   # Open Graph
│   │       ├── twitter.html     # Twitter Cards
│   │       └── schema.html      # Schema.org
│   │
│   ├── posts/              # 文章相关
│   │   ├── single.html     # 文章详情
│   │   └── list.html       # 文章列表
│   │
│   ├── tags/               # 标签相关
│   │   ├── list.html       # 标签下的文章
│   │   └── terms.html      # 标签列表
│   │
│   ├── archives/           # 归档相关
│   │   └── list.html       # 归档页
│   │
│   ├── search/             # 搜索相关
│   │   └── single.html     # 搜索页
│   │
│   └── page/               # 页面相关
│       └── single.html     # 页面模板 (关于等)
│
├── static/                 # 静态文件 (直接复制)
│   ├── favicon.svg
│   ├── robots.txt
│   └── ... (其他静态文件)
│
├── data/                    # 数据文件
│   └── socials.toml        # 社交媒体配置
│
├── i18n/                    # 国际化
│   └── en.toml             # 英文本地化
│
├── config/                  # Hugo 配置
│   └── _default/
│       ├── hugo.toml       # 主配置
│       ├── params.toml     # 参数配置
│       ├── menus.toml      # 菜单配置
│       ├── markup.toml     # Markdown 配置
│       └── module.toml     # Hugo Modules (如果使用)
│
├── exampleSite/            # 示例网站 (可选)
│   ├── content/
│   ├── config/
│   └── static/
│
├── package.json            # Node.js 依赖
├── postcss.config.js       # PostCSS 配置
├── tsconfig.json           # TypeScript 配置
├── theme.toml              # 主题元数据
├── README.md               # 使用说明
├── DESIGN.md              # 本文档
├── LICENSE                 # 许可证
└── .gitignore              # Git 忽略
```

### 3.2 核心文件说明

#### **配置文件**

| 文件 | 用途 | 关键配置 |
|-----|------|---------|
| `config/_default/hugo.toml` | Hugo 主配置 | baseURL、title、theme、输出格式 |
| `config/_default/params.toml` | 主题参数 | 作者、描述、社交链接、功能开关 |
| `config/_default/menus.toml` | 导航菜单 | 菜单项、权重、图标 |
| `config/_default/markup.toml` | Markdown 配置 | 代码高亮、代码块渲染 |
| `package.json` | Node.js 依赖 | Tailwind CSS、TypeScript、PostCSS |
| `postcss.config.js` | PostCSS 配置 | @tailwindcss/postcss 插件 |
| `tsconfig.json` | TypeScript 配置 | 编译选项、类型检查 |

#### **布局文件**

| 文件 | 用途 | 继承关系 |
|-----|------|---------|
| `baseof.html` | 根布局 | 所有页面的基础 |
| `home.html` | 首页 | 继承 baseof |
| `single.html` | 单页面 | 继承 baseof |
| `list.html` | 列表页 | 继承 baseof |
| `posts/single.html` | 文章详情 | 继承 single (覆盖) |
| `posts/list.html` | 文章列表 | 继承 list (覆盖) |

---

## 设计规范

### 4.1 配色规范

#### **浅色主题 (Light)**
```css
:root,
html[data-theme="light"] {
  --background: #fdfdfd;    /* 背景色 */
  --foreground: #282728;    /* 前景/文本色 */
  --accent: #006cac;        /* 强调色 */
  --muted: #e6e6e6;         /* 柔和色 */
  --border: #ece9e9;        /* 边框色 */
}
```

#### **深色主题 (Dark)**
```css
html[data-theme="dark"] {
  --background: #212737;    /* 背景色 */
  --foreground: #eaedf3;    /* 前景/文本色 */
  --accent: #ff6b01;        /* 强调色 */
  --muted: #343f60;         /* 柔和色 */
  --border: #ab4b08;        /* 边框色 */
}
```

#### **使用指南**
- **背景色**: 用于页面、卡片背景
- **前景色**: 用于正文、标题文本
- **强调色**: 用于链接、按钮、交互元素
- **柔和色**: 用于次要文本、禁用状态
- **边框色**: 用于分隔线、边框

### 4.2 排版规范

#### **字体栈**
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
}

code,
pre {
  font-family: "Consolas", "Monaco", "Courier New", monospace;
}
```

#### **排版尺度**
- h1: 2.5rem (40px) - 页面标题
- h2: 2rem (32px) - 主要章节
- h3: 1.5rem (24px) - 次要章节
- h4: 1.25rem (20px) - 小章节
- body: 1rem (16px) - 正文
- small: 0.875rem (14px) - 辅助文本

### 4.3 间距规范

#### **间距尺度** (Tailwind)
```
px-4   = 1rem (16px)    - 段内间距
py-6   = 1.5rem (24px)  - 块间垂直间距
gap-2  = 0.5rem (8px)   - 元素间间距
space-y-8 = 2rem (32px) - 大块间距
```

### 4.4 响应式断点**

| 断点 | 宽度 | 用途 |
|-----|------|------|
| `sm` | 640px | 小手机 |
| `md` | 768px | 大手机/平板 |
| `lg` | 1024px | 桌面 |
| `xl` | 1280px | 大桌面 |

#### **响应式策略**
- 移动优先: 先设计移动版本
- 渐进增强: 逐步添加桌面特性
- 流动布局: 使用 `max-w-` 和 `px-` 控制宽度

### 4.5 可访问性规范

#### **WCAG 2.1 AA 合规**
- ✅ 色彩对比度: 前景色 vs 背景色 ≥ 4.5:1
- ✅ 键盘导航: 所有交互元素可通过 Tab 键访问
- ✅ 焦点指示: 焦点元素有明显的视觉指示
- ✅ 语义 HTML: 使用正确的标签 (button、a、nav 等)
- ✅ ARIA 标签: 使用 `aria-label`、`aria-describedby` 等
- ✅ 屏幕阅读器: 页面结构清晰,能被屏幕阅读器正确理解

#### **实现示例**
```html
<!-- 好: 语义化按钮 -->
<button id="theme-btn" aria-label="切换深色/浅色主题">
  <span aria-hidden="true">🌙</span>
  <span class="sr-only">主题</span>
</button>

<!-- 避免: 非语义 div -->
<div onclick="toggleTheme()" role="button" tabindex="0">
  主题
</div>
```

### 4.6 SEO 规范

#### **必需元标签**
```html
<!-- 基础 -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>页面标题 | Hugo Paper</title>
<meta name="description" content="页面描述">

<!-- Open Graph -->
<meta property="og:title" content="标题">
<meta property="og:description" content="描述">
<meta property="og:image" content="图片 URL">
<meta property="og:url" content="页面 URL">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="标题">
<meta name="twitter:description" content="描述">
<meta name="twitter:image" content="图片 URL">

<!-- 规范链接 -->
<link rel="canonical" href="规范 URL">

<!-- RSS -->
<link rel="alternate" type="application/rss+xml" 
      title="RSS Feed" href="/rss.xml">
```

#### **结构化数据**
```html
<!-- JSON-LD Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "文章标题",
  "image": "图片 URL",
  "datePublished": "2024-01-01",
  "author": {
    "@type": "Person",
    "name": "作者名称"
  }
}
</script>
```

---

## 开发指南

### 5.1 环境配置

#### **前置需求**
- Hugo (Extended 版本): v0.120+
- Node.js: v18+
- pnpm: v8+

#### **初始化项目**
```bash
# 1. 进入项目目录
cd hugo-paper

# 2. 安装 pnpm (如果未安装)
npm install -g pnpm

# 3. 安装项目依赖
pnpm install

# 4. 验证 Hugo 版本
hugo version

# 5. 启动开发服务器
pnpm dev
```

### 5.2 开发工作流

#### **运行命令**
```bash
# 开发模式 (带热重载,包含草稿)
pnpm dev

# 构建生产版本 (包括 Pagefind 搜索索引)
pnpm build

# TypeScript 类型检查
pnpm type-check

# 格式化代码 (Prettier)
pnpm format

# 格式检查 (不修改文件)
pnpm format:check

# ESLint 检查 (可选)
pnpm lint
```

#### **文件修改热重载**
- 修改 `assets/css/main.css` → 自动重新加载样式
- 修改 `layouts/**/*.html` → 自动重新生成页面
- 修改 `assets/ts/*.ts` → 自动重新构建 JS
- 修改 `content/` → 自动重新构建页面

### 5.3 组件开发

#### **创建新 Partial**
```html
<!-- layouts/partials/my-component.html -->
{{ define "my-component" }}
  {{ with .text }}
    <div class="my-component">
      <p class="text-foreground">{{ . }}</p>
    </div>
  {{ end }}
{{ end }}
```

#### **使用 Partial**
```html
<!-- layouts/_default/single.html -->
{{ partial "my-component" (dict "text" "Hello World") }}
```

#### **Partial 参数传递**
```html
<!-- 简单参数 -->
{{ partial "my-partial" . }}

<!-- 字典参数 -->
{{ partial "my-partial" (dict "name" "value" "foo" "bar") }}

<!-- 访问参数 -->
{{ with .name }}
  <p>{{ . }}</p>
{{ end }}
```

### 5.4 样式开发

#### **添加新样式**

**方式 1: Tailwind 工具类** (首选)
```html
<div class="bg-background text-foreground p-4 rounded">
  <!-- 使用 Tailwind 工具类 -->
</div>
```

**方式 2: 自定义工具类**
```css
/* assets/css/main.css */
@utility my-custom {
  /* CSS 属性 */
}
```

**方式 3: @layer 组件**
```css
@layer components {
  .article-container {
    @apply max-w-app mx-auto px-4;
  }
}
```

### 5.5 脚本开发

#### **编写 TypeScript**
```typescript
// assets/ts/my-script.ts
interface Config {
  timeout: number;
  retries: number;
}

export function initFeature(config: Config): void {
  console.log('Feature initialized', config);
}

// 自动执行
initFeature({ timeout: 5000, retries: 3 });
```

#### **使用 Hugo Pipes 构建**
```html
<!-- layouts/partials/head.html -->
{{ $ts := resources.Get "ts/index.ts" }}
{{ $opts := dict "target" "es2020" "minify" hugo.IsProduction }}
{{ $js := $ts | js.Build $opts }}
{{ if hugo.IsProduction }}
  {{ $js = $js | fingerprint }}
{{ end }}
<script src="{{ $js.RelPermalink }}"></script>
```

#### **脚本定义 (package.json)**
```json
{
  "scripts": {
    "dev": "hugo server -D",
    "build": "hugo && pagefind --site public",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint ."
  }
}
```

### 5.6 内容创建

#### **创建新文章**
```bash
hugo new posts/my-article.md
```

#### **文章 Front Matter 示例**
```markdown
---
title: "文章标题"
description: "文章描述"
date: 2024-01-01
lastmod: 2024-01-02
draft: false           # 是否草稿
featured: true        # 是否在首页展示
categories:
  - 技术
tags:
  - Hugo
  - Web
image: "cover.jpg"
---

# 文章内容
...
```

---

## 功能清单

### 6.1 页面功能清单

- [ ] **首页**
  - [ ] Hero 区域 (标题、描述、社交链接)
  - [ ] Featured 文章区域
  - [ ] Recent 文章区域
  - [ ] "查看全部"按钮

- [ ] **文章列表页**
  - [ ] 文章列表
  - [ ] 分页控件
  - [ ] 页面标题和描述

- [ ] **文章详情页**
  - [ ] 文章标题
  - [ ] 文章元信息 (日期、修改时间、阅读时间)
  - [ ] 文章内容
  - [ ] 文章目录 (TOC)
  - [ ] 面包屑导航
  - [ ] 分享链接
  - [ ] 前/后文章链接
  - [ ] 编辑链接

- [ ] **标签系统**
  - [ ] 标签列表页
  - [ ] 单标签文章列表 (分页)

- [ ] **归档页**
  - [ ] 按年份分组
  - [ ] 文章计数
  - [ ] 年份链接

- [ ] **搜索页**
  - [ ] 搜索输入框
  - [ ] 实时搜索结果
  - [ ] 高亮匹配项

- [ ] **404 页面**
  - [ ] 友好的错误信息
  - [ ] 返回首页链接

### 6.2 组件功能清单

- [ ] **Header 组件**
  - [ ] Logo/站点标题
  - [ ] 导航菜单
  - [ ] 移动菜单 (汉堡菜单)
  - [ ] 主题切换按钮
  - [ ] 搜索按钮

- [ ] **Footer 组件**
  - [ ] 版权信息
  - [ ] 技术栈链接
  - [ ] 社交链接

- [ ] **Card 组件**
  - [ ] 文章标题
  - [ ] 文章描述
  - [ ] 发布日期
  - [ ] 修改日期
  - [ ] 链接

- [ ] **Pagination 组件**
  - [ ] 上一页/下一页按钮
  - [ ] 页码
  - [ ] 当前页指示

### 6.3 功能特性清单

- [ ] **SEO**
  - [ ] Open Graph 元标签
  - [ ] Twitter Cards
  - [ ] JSON-LD Schema
  - [ ] Sitemap
  - [ ] RSS

- [ ] **主题**
  - [ ] 浅色主题
  - [ ] 深色主题
  - [ ] 自动检测系统偏好
  - [ ] localStorage 记忆用户选择

- [ ] **搜索**
  - [ ] Pagefind 集成
  - [ ] 实时搜索
  - [ ] 高亮匹配

- [ ] **可访问性**
  - [ ] 键盘导航
  - [ ] 屏幕阅读器支持
  - [ ] ARIA 标签
  - [ ] 焦点指示
  - [ ] 色彩对比度

- [ ] **响应式**
  - [ ] 移动设计
  - [ ] 平板设计
  - [ ] 桌面设计
  - [ ] 触摸友好

- [ ] **性能**
  - [ ] CSS 压缩
  - [ ] JS 压缩
  - [ ] 资源指纹
  - [ ] 懒加载 (可选)

---

## 性能目标

### 7.1 Lighthouse 评分

| 指标 | 目标值 | 说明 |
|-----|--------|------|
| Performance | ≥ 95 | 页面加载速度和响应性 |
| Accessibility | ≥ 95 | 无障碍性合规 |
| Best Practices | ≥ 95 | 开发最佳实践 |
| SEO | 100 | 搜索引擎优化 |

### 7.2 核心指标 (Web Vitals)

| 指标 | 目标值 | 标准 |
|-----|--------|------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |
| FCP | < 1.8s | First Contentful Paint |
| TTFB | < 600ms | Time to First Byte |

### 7.3 文件大小目标

| 文件 | 目标大小 | 说明 |
|-----|----------|------|
| CSS | < 50KB | 压缩后 |
| JS | < 30KB | 压缩后 |
| HTML | < 60KB | 单页面 |
| 首页加载 | < 150KB | 总大小 |

### 7.4 性能优化策略

1. **CSS 优化**
   - 使用 PostCSS 压缩
   - 移除未使用的样式 (Tailwind 自动)
   - 使用 CSS 变量替代 JS

2. **JavaScript 优化**
   - 使用 esbuild 压缩
   - 代码分割 (可选)
   - 延迟加载非关键脚本

3. **资源优化**
   - 指纹化静态资源
   - 使用 WebP 格式的图片 (可选)
   - 响应式图片

4. **构建优化**
   - Partial 缓存
   - 资源管道优化
   - Hugo 增量构建

---

## 附录

### A. 相关链接

- [Hugo 官方主题](https://themes.gohugo.io/)
- [Hugo Paper 官方仓库](https://github.com/ouraihub-hugo-themes/hugo-paper)
- [Hugo 文档](https://gohugo.io/documentation/)
- [Tailwind CSS v4 文档](https://tailwindcss.com/docs)
- [Astro Paper GitHub](https://github.com/satnaing/astro-paper)
- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)

### B. 参考项目

- **astro-paper**: Astro 博客主题 (源参考)
- **hugo-theme-stack**: Hugo 博客主题 (技术参考)
- **Hugo Docs Site**: Hugo 官方文档网站

### C. 常见问题

**Q: 如何自定义配色?**
A: 修改 `assets/css/main.css` 中的 CSS 变量:
```css
html[data-theme="light"] {
  --background: #your-color;
  /* ... */
}
```

**Q: 如何添加新页面?**
A: 创建新的 Markdown 文件在 `content/` 或新增 layout 文件。

**Q: 如何修改导航菜单?**
A: 编辑 `config/_default/menus.toml` 配置文件。

**Q: 搜索功能如何工作?**
A: 使用 Pagefind 在构建后生成静态搜索索引。

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 0.1.0 | 2024-11-11 | 初始设计文档 |

---

**最后更新**: 2024-11-11  
**维护者**: Hugo Paper Team  
**许可证**: MIT
