# Hugo Paper Theme v0.4.0 Release Notes

## 发布信息

- **版本**: v0.4.0
- **发布日期**: 2024-01-13
- **类型**: 配置重构版本

## 主要更新

### 1. 配置结构重构 🎉

采用 Hugo 官方推荐的配置目录结构，提升可维护性和清晰度。

#### 主题配置重构
- ✅ 创建 `config/_default/` 目录结构
- ✅ 拆分配置为 6 个文件 + README
- ✅ 删除根目录的旧配置文件
- ✅ 只保留实际使用的配置（从 150+ 行减少到 70 行）

**新配置文件**:
```
config/_default/
├── hugo.toml          # 核心 Hugo 设置
├── params.toml        # 主题参数（70行）
├── languages.toml     # 多语言配置
├── menus.en.toml      # 英文菜单
├── menus.zh.toml      # 中文菜单
├── markup.toml        # Markdown 配置
└── README.md          # 配置说明
```

#### ExampleSite 配置重构
- ✅ 创建 `exampleSite/config/_default/` 目录结构
- ✅ 与主题配置结构保持一致
- ✅ 移除未实现的功能配置

### 2. 配置优化 ✨

#### 移除未实现的配置
- ❌ `header.logoText`, `header.logoWidth`, `header.logoHeight`
- ❌ `footer.*`（整个 footer 配置）
- ❌ `colors.*`, `darkColors.*`
- ❌ `typography.*`
- ❌ `home.*`, `post.*`
- ❌ `search.*`, `analytics.*`, `navigation.*`
- ❌ `breadcrumb.*`, `pagination.*`
- ❌ `highlight.*`, `math.*`, `imageProcessing.*`
- ❌ `performance.*`

#### 保留实际使用的配置
- ✅ `description`, `readmeUrl`, `showArchives`, `showBackButton`
- ✅ `postPerIndex`
- ✅ `theme.defaultTheme`, `theme.switchTheme`
- ✅ `header.logo`
- ✅ `editPost.*`
- ✅ `social`
- ✅ `comments.*`（Giscus）
- ✅ `seo.*`

### 3. 分页优化 📄

- 默认分页从每页 10 篇改为每页 4 篇
- 提升用户体验，减少页面加载时间

### 4. 文档完善 📚

- ✅ 添加 `config/_default/README.md` - 详细的配置说明
- ✅ 添加 `exampleSite/config/_default/README.md` - 示例站点配置说明
- ✅ 包含中文注释
- ✅ 提供配置示例和最佳实践

## 配置迁移指南

### 从 v0.3.0 升级到 v0.4.0

#### 1. 备份旧配置（可选）
```bash
cp hugo.toml hugo.toml.backup
cp params.toml params.toml.backup
```

#### 2. 删除旧配置文件
```bash
rm hugo.toml
rm params.toml
```

#### 3. 创建新配置结构
```bash
mkdir -p config/_default
```

#### 4. 复制新配置文件
从主题的 `config/_default/` 或 `exampleSite/config/_default/` 复制配置文件到你的站点。

#### 5. 更新配置内容
根据你的需求修改配置文件：

**config/_default/hugo.toml**:
```toml
baseURL = "https://your-site.com/"
title = "Your Site Title"
```

**config/_default/params.toml**:
```toml
description = "Your site description"
readmeUrl = "https://github.com/yourusername/your-repo"

[[social]]
name = "GitHub"
href = "https://github.com/yourusername"
```

#### 6. 验证配置
```bash
hugo config
hugo server
```

## 破坏性变更

### 配置文件位置变更
- ⚠️ 根目录的 `hugo.toml` 和 `params.toml` 不再使用
- ✅ 新配置位于 `config/_default/` 目录

### 配置项变更
- ⚠️ 移除了大量未实现的配置项
- ✅ 只保留实际使用的配置

### 分页默认值变更
- ⚠️ 从每页 10 篇改为每页 4 篇
- ✅ 可在 `config/_default/hugo.toml` 中修改

## 兼容性

- ✅ Hugo 版本: 0.120+
- ✅ Go 版本: 1.24+
- ✅ Node.js 版本: 18.0+
- ✅ 浏览器支持: 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）

## 已知问题

无

## 下一步计划

- [ ] 实现更多主题配置选项
- [ ] 添加更多示例内容
- [ ] 优化性能
- [ ] 完善文档

## 贡献者

感谢所有为这个版本做出贡献的人！

## 相关链接

- [GitHub Repository](https://github.com/ouraihub-hugo-themes/hugo-theme-paper)
- [Distribution Repository](https://github.com/ouraihub-hugo-themes/hugo-theme-paper-dist)
- [Documentation](https://github.com/ouraihub-hugo-themes/hugo-theme-paper/blob/master/README.md)
- [Issues](https://github.com/ouraihub-hugo-themes/hugo-theme-paper/issues)

## 安装

### Via Hugo Modules (推荐)
```toml
[module]
  [[module.imports]]
    path = "github.com/ouraihub-hugo-themes/hugo-theme-paper-dist"
```

```bash
hugo mod get -u
hugo server
```

### Via Git
```bash
git clone https://github.com/ouraihub-hugo-themes/hugo-theme-paper.git themes/hugo-theme-paper
```

## 反馈

如果你在使用过程中遇到任何问题，请在 [GitHub Issues](https://github.com/ouraihub-hugo-themes/hugo-theme-paper/issues) 中报告。

---

**完整更新日志**: https://github.com/ouraihub-hugo-themes/hugo-theme-paper/compare/v0.3.0...v0.4.0
