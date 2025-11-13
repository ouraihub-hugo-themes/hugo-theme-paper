# ExampleSite 配置最佳实践

## 改进总结

exampleSite 已经从单文件配置迁移到配置目录结构，完全符合 Hugo 最佳实践。

## 改进前后对比

### ❌ 改进前（不推荐）

```
exampleSite/
├── hugo.toml          # 单个大文件，包含所有配置
├── params.toml        # 重复的参数配置
└── content/
```

**问题**：
- 配置文件过大（120+ 行）
- 配置类型混杂在一起
- 难以维护和扩展
- 不支持环境特定配置
- 与主题配置结构不一致

### ✅ 改进后（推荐）

```
exampleSite/
├── config/
│   └── _default/
│       ├── hugo.toml      # 核心配置（60 行）
│       ├── params.toml    # 主题参数（70 行）
│       └── menus.toml     # 菜单配置（20 行）
└── content/
```

**优势**：
- ✅ 配置分离，职责清晰
- ✅ 每个文件更小，更易维护
- ✅ 支持环境特定配置
- ✅ 与主题配置结构一致
- ✅ 符合 Hugo 官方推荐

## 配置文件职责

### hugo.toml - 核心配置
**职责**：Hugo 框架的核心设置
- 站点基本信息
- 内容处理规则
- 输出格式
- Markdown 渲染
- 代码高亮

**不包含**：主题特定的参数

### params.toml - 主题参数
**职责**：主题特定的配置
- 主题外观设置
- 功能开关
- 社交链接
- SEO 设置

**不包含**：Hugo 核心配置

### menus.toml - 菜单配置
**职责**：导航菜单
- 菜单项定义
- 菜单顺序
- 多语言菜单

**不包含**：其他配置

## 环境配置支持

### 配置优先级

```
config/_default/     # 默认配置（所有环境）
    ↓
config/development/  # 开发环境（覆盖默认）
    ↓
config/production/   # 生产环境（覆盖默认）
    ↓
命令行参数           # 最高优先级
```

### 开发环境示例

创建 `config/development/hugo.toml`：
```toml
# 只覆盖需要的配置
baseURL = "http://localhost:1313/"

# 开发时显示草稿
buildDrafts = true
buildFuture = true
```

使用：
```bash
hugo server --environment development
```

### 生产环境示例

创建 `config/production/hugo.toml`：
```toml
# 只覆盖需要的配置
baseURL = "https://yourdomain.com/"

# 生产优化
minify = true
```

使用：
```bash
hugo --environment production
```

## 配置最佳实践

### 1. 使用配置目录

✅ **推荐**：
```
config/_default/
├── hugo.toml
├── params.toml
└── menus.toml
```

❌ **不推荐**：
```
hugo.toml  # 单个大文件
```

### 2. 分离关注点

✅ **推荐**：
```toml
# config/_default/hugo.toml
baseURL = "https://example.com/"
title = "My Site"

# config/_default/params.toml
[theme]
  defaultTheme = "light"
```

❌ **不推荐**：
```toml
# hugo.toml
baseURL = "https://example.com/"
title = "My Site"

[params]
  [params.theme]
    defaultTheme = "light"
```

### 3. 环境特定配置

✅ **推荐**：
```
config/
├── _default/       # 共享配置
├── development/    # 开发环境
└── production/     # 生产环境
```

❌ **不推荐**：
```toml
# hugo.toml
baseURL = "http://localhost:1313/"  # 硬编码
```

### 4. 只覆盖需要的配置

✅ **推荐**：
```toml
# config/production/hugo.toml
baseURL = "https://example.com/"  # 只覆盖 baseURL
```

❌ **不推荐**：
```toml
# config/production/hugo.toml
baseURL = "https://example.com/"
title = "My Site"              # 重复定义
languageCode = "en-us"         # 重复定义
# ... 复制所有配置
```

### 5. 添加清晰的注释

✅ **推荐**：
```toml
# ===== 主题设置 =====
[theme]
  defaultTheme = "light"  # light or dark
  switchTheme = true      # 允许用户切换主题
```

❌ **不推荐**：
```toml
[theme]
  defaultTheme = "light"
  switchTheme = true
```

## 配置验证

### 查看最终配置

```bash
# 查看合并后的完整配置
hugo config

# 查看特定环境的配置
hugo config --environment production
```

### 验证配置语法

```bash
# 尝试构建，检查错误
hugo --quiet

# 详细日志
hugo --logLevel info
```

## 迁移指南

### 从单文件迁移到配置目录

1. **创建配置目录**
```bash
mkdir -p config/_default
```

2. **分离配置**
- 核心配置 → `config/_default/hugo.toml`
- 主题参数 → `config/_default/params.toml`
- 菜单配置 → `config/_default/menus.toml`

3. **删除旧文件**
```bash
rm hugo.toml
rm params.toml  # 如果存在
```

4. **测试**
```bash
hugo server
```

## 常见问题

### Q: 必须使用配置目录吗？

A: 不是必须的，但强烈推荐。Hugo 支持单文件配置，但配置目录提供更好的组织和灵活性。

### Q: 可以混合使用吗？

A: 可以，但不推荐。如果同时存在 `hugo.toml` 和 `config/_default/hugo.toml`，配置目录优先级更高。

### Q: 如何知道配置是否正确？

A: 运行 `hugo config` 查看最终配置，或运行 `hugo --quiet` 检查错误。

### Q: 环境配置是必需的吗？

A: 不是必需的。如果不需要环境特定配置，只使用 `config/_default/` 即可。

### Q: 可以使用 YAML 或 JSON 吗？

A: 可以。Hugo 支持 TOML、YAML 和 JSON 格式。例如 `hugo.yaml` 或 `hugo.json`。

## 参考资源

### Hugo 官方文档
- [Configuration](https://gohugo.io/getting-started/configuration/)
- [Configuration Directory](https://gohugo.io/getting-started/configuration/#configuration-directory)
- [Environment Variables](https://gohugo.io/getting-started/configuration/#configure-with-environment-variables)

### 主题文档
- [配置说明](../config/README.md)
- [快速参考](../config/QUICK_REFERENCE.md)
- [配置迁移指南](../CONFIGURATION_MIGRATION.md)
- [配置清理总结](../CONFIGURATION_CLEANUP_SUMMARY.md)

## 总结

exampleSite 现在采用了 Hugo 推荐的配置目录结构，具有以下优势：

1. ✅ **清晰的组织**：不同类型的配置分离
2. ✅ **易于维护**：每个文件更小、更专注
3. ✅ **环境支持**：轻松添加环境特定配置
4. ✅ **最佳实践**：符合 Hugo 官方推荐
5. ✅ **用户友好**：为用户提供良好的示例

这个结构不仅适用于 exampleSite，也是用户在使用主题时应该采用的配置方式。
