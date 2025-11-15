# Hugo Paper - Example Site

这是使用 Hugo Paper 主题的示例网站，用于主题开发和测试。

## 快速开始

### 前提条件
- Hugo v0.120+ (Extended)
- Go 1.24+
- Node.js 18+
- pnpm 8+

### 本地开发

```bash
# 在主题根目录（不是 exampleSite）
cd hugo-theme-paper

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 在浏览器中打开 http://localhost:1313
```

### 生产构建

```bash
# 在主题根目录
pnpm build

# 输出在 public/ 目录
```

## 目录结构

```
exampleSite/
├── content/              # 示例内容
│   ├── en/              # 英文内容
│   │   ├── post/        # 博客文章
│   │   ├── page/        # 独立页面
│   │   └── _index.md    # 首页
│   └── zh/              # 中文内容
│       ├── post/
│       ├── page/
│       └── _index.md
└── static/              # 静态资源
    └── images/          # 示例图片
```

## 配置说明

主题配置位于主题根目录的 `config/_default/` 中：

- `hugo.toml` - Hugo 核心配置
- `params.toml` - 主题参数
- `languages.toml` - 多语言配置
- `menus.*.toml` - 菜单配置

## 测试

```bash
# 运行测试
pnpm test:run

# 生成覆盖率报告
pnpm test:coverage

# 使用 UI 界面
pnpm test:ui
```

## 注意事项

1. **不要在 exampleSite 中运行命令**
   - 所有命令都应该在主题根目录运行
   - exampleSite 只是内容目录

2. **配置文件位置**
   - 配置文件在主题根目录的 `config/_default/`
   - 不在 exampleSite 中

3. **构建输出**
   - 输出在主题根目录的 `public/`
   - 不在 exampleSite 中

## 相关链接

- [主题开发文档](../docs/README.md)
- [脚本使用指南](../docs/SCRIPTS.md)
- [版本发布指南](../docs/RELEASE.md)
