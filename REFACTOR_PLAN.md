# Hugo Paper 主题结构重构计划

## 🎯 目标

将当前的**项目级结构**转换为**主题级结构**，使 Hugo Paper 成为一个真正可复用的 Hugo 主题包。

**重构难度**: ⭐⭐⭐ (中等)  
**预计工作量**: 2-3 小时  
**风险等级**: 低 (只是文件重新组织)

---

## 📋 重构步骤详解

### Phase 1: 创建目录结构 (30 分钟)

#### 1.1 创建 exampleSite 目录
```bash
mkdir -p exampleSite/content/post
mkdir -p exampleSite/layouts
mkdir -p exampleSite/static
```

#### 1.2 新的整体结构
```
hugo-paper/
├── README.md
├── LICENSE
├── theme.toml                    ← 新增：主题元数据
├── go.mod                        ← 可选：Hugo 模块
│
├── archetypes/
│   ├── default.md
│   └── post.md
│
├── assets/
│   ├── css/
│   │   └── main.css
│   ├── images/
│   └── ts/
│       ├── main.ts              ← 只保留这个
│       └── (删除所有 .test.ts 和 .bench.ts)
│
├── layouts/
│   ├── _default/
│   ├── partials/
│   ├── archives/
│   ├── categories/
│   ├── post/
│   ├── tags/
│   ├── 404.html
│   ├── rss.xml
│   └── sitemap.xml
│
├── i18n/
│   └── en.toml
│
├── data/
│   └── config.yaml
│
├── static/
│   └── (空或简单的资源)
│
└── exampleSite/                 ← 新增：示例网站
    ├── content/
    │   ├── _index.md
    │   ├── about.md
    │   ├── getting-started.md
    │   └── post/
    │       └── (所有文章都移到这里)
    │
    ├── layouts/                 ← 可选：覆盖主题
    │   └── (通常为空)
    │
    ├── static/                  ← 可选：网站特定资源
    │   └── (通常为空)
    │
    ├── config.toml              ← 从根目录移过来
    ├── params.toml              ← 从根目录移过来
    ├── package.json             ← 从根目录移过来
    │
    ├── hugo.toml                ← 或用 config.toml
    ├── tailwind.config.js        ← 示例网站的 Tailwind
    ├── postcss.config.js         ← 示例网站的 PostCSS
    ├── tsconfig.json             ← 示例网站的 TS 配置
    ├── vitest.config.ts          ← 示例网站的测试配置
    │
    ├── .gitignore
    └── README.md                 ← 示例网站说明
```

---

### Phase 2: 移动文件 (45 分钟)

#### 2.1 移动内容文件
```bash
# 将所有内容移到 exampleSite
mv content/post/* exampleSite/content/post/
mv content/*.md exampleSite/content/
rmdir content/post content
```

#### 2.2 移动配置文件
```bash
# 复制配置到示例网站（保留原件用于开发）
cp hugo.toml exampleSite/hugo.toml
cp params.toml exampleSite/params.toml
cp package.json exampleSite/package.json
cp tailwind.config.js exampleSite/tailwind.config.js
cp postcss.config.js exampleSite/postcss.config.js
cp tsconfig.json exampleSite/tsconfig.json
cp vitest.config.ts exampleSite/vitest.config.ts
```

#### 2.3 移动测试和文档
```bash
# 将文档移到根目录（或分离的 docs/ 目录）
# 注意：不要删除原来的文件，而是重新组织

# 测试文件放在 exampleSite 或独立的 tests/ 目录
mkdir -p tests/{unit,integration,performance,seo,security}
mv assets/ts/*.test.ts tests/unit/
mv assets/ts/*.bench.ts tests/performance/
```

#### 2.4 清理主题根目录
```bash
# 主题资源保留
# assets/ - 保留 (只含 css, ts/main.ts, images)
# layouts/ - 保留
# archetypes/ - 保留
# i18n/ - 保留
# data/ - 保留
# static/ - 保留

# 删除不应该在主题中的内容
# content/ - 删除（已移到 exampleSite）
# *.md 文档 - 保留在根目录但更新
# package.json - 删除或只保留主题级配置
```

---

### Phase 3: 创建主题元数据 (20 分钟)

#### 3.1 创建 theme.toml
```toml
name = "Hugo Paper"
license = "MIT"
licenselink = "https://github.com/ouraihub-hugo-themes/hugo-paper/blob/main/LICENSE"
description = "A minimal, responsive Hugo theme inspired by Astro Paper"
homepage = "https://github.com/ouraihub-hugo-themes/hugo-paper"
repo = "https://github.com/ouraihub-hugo-themes/hugo-paper"

tags = [
  "blog",
  "minimal",
  "responsive",
  "tailwind",
  "typescript",
  "interactive",
  "dark-mode",
  "seo",
  "search"
]

features = [
  "Dark Mode",
  "Comments (Giscus)",
  "Search",
  "Reading Progress",
  "Code Copy Button",
  "Article Sharing",
  "Keyboard Shortcuts",
  "Responsive Design",
  "SEO Optimized",
  "Accessibility (WCAG 2.1 AA)"
]

min_version = "0.120.0"
hugo_version = "0.120+"

[author]
  name = "OurAIHub"
  homepage = "https://github.com/ouraihub"

[original]
  name = "Astro Paper"
  homepage = "https://astro-paper-example.vercel.app"
  repo = "https://github.com/satnaing/astro-paper"
```

#### 3.2 创建 exampleSite 的 README
```markdown
# Hugo Paper - Example Site

这是使用 Hugo Paper 主题的示例网站。

## 快速开始

```bash
cd exampleSite
pnpm install
pnpm dev
```

## 目录结构

- `content/` - 网站内容
- `layouts/` - 自定义布局（覆盖主题）
- `static/` - 静态资源
- `config.toml` - 网站配置

## 主题文件位置

主题文件位于根目录的 `../layouts/`, `../assets/` 等。
如果需要修改主题，编辑这些目录。

## 更多信息

参考根目录的 README.md
```

---

### Phase 4: 更新配置文件 (30 分钟)

#### 4.1 更新根目录 hugo.toml
```toml
# 根目录的 hugo.toml - 用于开发主题

baseURL = "http://localhost:1313/"
languageCode = "en-us"
title = "Hugo Paper - Theme Development"

theme = ["./"]  # 使用当前目录作为主题

defaultContentLanguage = "en"
defaultContentLanguageInSubdir = false

[markup.highlight]
  codeFences = true
  guessSyntax = false
  hl_Lines = ""
  lineAnchors = ""
  lineNoStart = 1
  lineNos = false
  noClasses = true
  style = "monokai"
  tabWidth = 4

[module]
  [[module.imports]]
    path = "github.com/ouraihub-hugo-themes/hugo-paper"

[params]
  # 主题参数...
```

#### 4.2 更新 exampleSite/config.toml
```toml
# exampleSite/config.toml - 用于示例网站

baseURL = "https://example.com/"
languageCode = "en-us"
title = "Hugo Paper"

theme = ".."  # 使用上级目录的主题

# 其他配置...
```

#### 4.3 创建 go.mod（可选但推荐）
```
module github.com/ouraihub-hugo-themes/hugo-paper

go 1.20

require github.com/gohugoio/hugo v0.120.0
```

---

### Phase 5: 更新文档 (30 分钟)

#### 5.1 更新主 README.md
```markdown
# Hugo Paper

一个受 Astro Paper 启发的最小化响应式 Hugo 主题。

## 功能特性

- ✨ 深色模式
- 💬 Giscus 评论系统
- 🔍 搜索功能
- 📖 阅读进度指示
- 📋 代码复制按钮
- 📱 文章分享（5 个平台）
- ⌨️ 键盘快捷键
- 🎨 响应式设计
- 🔍 SEO 优化
- ♿ 无障碍支持 (WCAG 2.1 AA)

## 快速开始

### 作为主题使用

1. 将主题添加到你的 Hugo 项目：

```bash
cd your-site
git submodule add https://github.com/ouraihub-hugo-themes/hugo-paper.git themes/hugo-paper
```

2. 在 `config.toml` 中设置主题：

```toml
theme = "hugo-paper"
```

3. 配置参数（参考 exampleSite/params.toml）

### 开发主题

1. 克隆仓库：

```bash
git clone https://github.com/ouraihub-hugo-themes/hugo-paper.git
cd hugo-paper
```

2. 进入示例网站：

```bash
cd exampleSite
pnpm install
pnpm dev
```

3. 在浏览器中打开 http://localhost:1313

## 文件结构

```
hugo-paper/
├── layouts/          # 主题模板
├── assets/           # 样式和脚本
├── archetypes/       # 内容原型
├── i18n/             # 翻译文件
├── exampleSite/      # 示例网站
├── tests/            # 测试文件
└── README.md
```

## 配置选项

参考 [CONFIG.md](CONFIG.md)

## 更多文档

- [DESIGN.md](DESIGN.md) - 架构和设计
- [CONFIG.md](CONFIG.md) - 配置指南
- [exampleSite/README.md](exampleSite/README.md) - 示例使用

## 许可

MIT License
```

#### 5.2 更新 CONFIG.md
更新路径从 `params.toml` 到 `exampleSite/params.toml`

#### 5.3 其他文档
- 更新所有文件路径引用
- 更新示例命令

---

### Phase 6: 测试和验证 (30 分钟)

#### 6.1 验证主题功能
```bash
# 1. 进入示例网站开发
cd exampleSite
pnpm dev

# 2. 检查所有页面是否正确渲染
# - 首页
# - 文章页
# - 分类页
# - 标签页
# - 归档页
```

#### 6.2 验证主题可复用性
```bash
# 1. 创建测试项目
mkdir test-hugo-project
cd test-hugo-project
hugo new site . -f

# 2. 添加主题作为 submodule
git init
git submodule add ../hugo-paper themes/hugo-paper

# 3. 配置
echo 'theme = "hugo-paper"' >> config.toml

# 4. 测试是否工作
hugo server
```

#### 6.3 验证文件结构
```bash
# 确保以下文件存在
- theme.toml ✓
- layouts/ ✓
- assets/ ✓
- archetypes/ ✓
- i18n/ ✓
- exampleSite/ ✓
- exampleSite/content/ ✓
- exampleSite/config.toml ✓
```

#### 6.4 验证没有遗留问题
```bash
# 检查是否有不应该在主题中的文件
- content/ (应该删除) ✓
- node_modules/ (应该在 .gitignore) ✓
- 测试文件不应在 assets/ts/ ✓
```

---

### Phase 7: 更新 .gitignore (15 分钟)

```gitignore
# Hugo
public/
resources/

# Example site specific
exampleSite/public/
exampleSite/resources/

# Node/NPM
node_modules/
dist/
*.log

# Build outputs
exampleSite/node_modules/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

---

## 📋 完整检查清单

### 文件操作
- [ ] 创建 `exampleSite/` 目录结构
- [ ] 将 `content/` 移到 `exampleSite/content/`
- [ ] 复制配置文件到 `exampleSite/`
- [ ] 复制 `package.json` 到 `exampleSite/`
- [ ] 移动测试文件到 `tests/` 或 `exampleSite/`
- [ ] 删除根目录 `content/` 目录
- [ ] 创建 `theme.toml`
- [ ] 创建 `exampleSite/README.md`

### 文档更新
- [ ] 更新主 `README.md`
- [ ] 更新 `CONFIG.md` 路径
- [ ] 更新 `DESIGN.md` 路径
- [ ] 创建/更新所有 PHASE 总结文档的路径
- [ ] 更新示例命令

### 测试验证
- [ ] 在 `exampleSite` 运行 `pnpm dev` 成功
- [ ] 所有页面正确渲染
- [ ] 创建新项目并使用主题成功
- [ ] Git submodule 方式可工作
- [ ] 所有特性正常功能（深色模式、搜索等）

### 版本和发布
- [ ] 更新 `theme.toml` 中的版本
- [ ] 更新 `package.json` 版本
- [ ] 创建 Git tag
- [ ] 生成 Release notes

---

## 🎯 重构后的优势

### ✅ 符合 Hugo 标准
- 可以作为 git submodule 安装
- 可以通过 Hugo 模块系统使用
- 符合 Hugo 官方主题规范

### ✅ 提高可用性
- 用户可以独立更新主题
- 支持主题覆盖（用户可自定义）
- 清晰的示例配置

### ✅ 便于维护
- 主题代码和示例分离
- 易于理解的项目结构
- 支持社区贡献

### ✅ 社区友好
- 可以提交到 Hugo 官方主题列表
- 便于其他开发者使用和贡献
- 规范的组织方式

---

## ⚠️ 注意事项

1. **备份重要文件**
   - 执行任何操作前备份整个项目
   - 使用 Git 追踪更改

2. **逐步进行**
   - 一步步执行，验证每个步骤
   - 不要一次性移动所有文件

3. **测试充分**
   - 每个步骤后都要测试
   - 确保没有功能损失

4. **更新文档**
   - 确保所有文档都指向正确的路径
   - 更新示例命令

---

## 📞 需要帮助？

是否需要我帮助执行这个重构计划？我可以：

1. 创建脚本自动执行这些步骤
2. 逐步指导执行每个阶段
3. 验证每个步骤的结果
4. 修复任何问题

请告诉我您想怎么做！
