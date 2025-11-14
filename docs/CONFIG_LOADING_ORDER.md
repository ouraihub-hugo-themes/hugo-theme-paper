# Hugo 配置加载顺序说明

## 问题

在 `E:\workspace\hugo\hugo-paper-dev\hugo-theme-paper` 目录下执行 `hugo server` 时，Hugo 使用哪个配置？

## 答案

**Hugo 使用 `config/_default/` 目录中的配置文件**，而不是 `exampleSite/config/_default/` 中的配置。

## 详细说明

### 1. Hugo 配置查找顺序

当你在项目根目录运行 `hugo server` 时，Hugo 按以下顺序查找配置：

```
1. 根目录的 hugo.toml / hugo.yaml / hugo.json
2. config/_default/ 目录中的配置文件
3. config/production/ 或 config/development/ (根据环境)
```

**Hugo 不会自动加载 `exampleSite/config/` 中的配置**。

### 2. 当前配置状态

#### 使用的配置文件

```bash
hugo-theme-paper/
├── config/_default/
│   ├── hugo.toml          # ✅ 被使用
│   ├── params.toml        # ✅ 被使用
│   ├── menus.en.toml      # ✅ 被使用
│   ├── menus.zh.toml      # ✅ 被使用
│   ├── markup.toml        # ✅ 被使用
│   └── module.toml        # ✅ 被使用
```

#### 不被使用的配置文件

```bash
hugo-theme-paper/
├── exampleSite/config/_default/
│   ├── hugo.toml          # ❌ 不被使用
│   ├── params.toml        # ❌ 不被使用
│   ├── languages.toml     # ❌ 不被使用
│   └── ...                # ❌ 不被使用
```

### 3. 验证当前配置

运行 `hugo config` 可以看到实际使用的配置：

```toml
# 关键配置值
baseURL = ""                    # 空值（未设置）
title = ""                      # 空值（未设置）
contentdir = "content"          # 默认值
defaultcontentlanguage = "en"   # 来自 config/_default/hugo.toml
```

**注意**：
- `baseURL` 和 `title` 是空的，因为 `config/_default/hugo.toml` 中没有设置
- `contentDir` 是默认值 `content`，不是 `exampleSite/content`
- 这证明了 Hugo 使用的是 `config/_default/hugo.toml`，而不是 `exampleSite/config/_default/hugo.toml`

### 4. 为什么主题开发仍然可以工作？

虽然 Hugo 使用 `config/_default/` 中的配置，但主题开发仍然可以正常工作，因为：

1. **内容目录**：`contentDir = "content"` (默认值)
   - Hugo 会在 `hugo-theme-paper/content/` 目录查找内容
   - 但是这个目录不存在！

2. **实际情况**：主题项目没有 `content/` 目录，只有 `exampleSite/content/`
   - 这意味着当前配置下，`hugo server` 不会找到任何内容
   - 需要手动指定 contentDir

### 5. 正确的主题开发方式

#### 方式 1：使用 contentDir 配置（推荐）

在 `config/_default/hugo.toml` 中添加（仅用于开发）：

```toml
# For theme development only
contentDir = "exampleSite/content"
```

或者在根目录创建 `hugo.toml`：

```toml
# hugo.toml (root)
baseURL = "http://localhost:1313/"
title = "Hugo Paper - Theme Development"
contentDir = "exampleSite/content"
```

#### 方式 2：使用命令行参数

```bash
hugo server --contentDir exampleSite/content
```

#### 方式 3：在 exampleSite 目录中运行

```bash
cd exampleSite
hugo server
```

这样 Hugo 会使用 `exampleSite/config/_default/` 中的配置。

### 6. 当前问题

根据当前配置，运行 `hugo server` 时：

```bash
contentdir = 'content'  # 但是 content/ 目录不存在
```

**解决方案**：

1. **临时方案**：在根目录创建 `hugo.toml`
   ```toml
   contentDir = "exampleSite/content"
   baseURL = "http://localhost:1313/"
   title = "Hugo Paper - Theme Development"
   ```

2. **推荐方案**：在 exampleSite 目录中开发
   ```bash
   cd exampleSite
   hugo server
   ```

### 7. 配置文件优先级

如果同时存在多个配置文件，优先级为：

```
1. 根目录的 hugo.toml (最高优先级)
2. config/_default/hugo.toml
3. 环境特定配置 (config/production/, config/development/)
```

配置会**合并**，而不是覆盖。后加载的配置会覆盖先加载的同名配置项。

## 总结

**当前在 `hugo-theme-paper` 根目录运行 `hugo server` 时**：

- ✅ 使用 `config/_default/` 中的配置
- ❌ 不使用 `exampleSite/config/_default/` 中的配置
- ⚠️ `contentDir = "content"` 但该目录不存在
- 💡 建议在 `exampleSite/` 目录中运行 `hugo server`

## 推荐的项目结构

```bash
hugo-theme-paper/
├── config/_default/          # 主题配置（用于作为 Hugo Module）
│   ├── hugo.toml            # 只包含主题必需配置
│   ├── params.toml          # 主题参数
│   └── ...
├── exampleSite/             # 示例站点（用于主题开发）
│   ├── config/_default/     # 示例站点配置
│   │   ├── hugo.toml       # 包含 contentDir 等项目配置
│   │   └── ...
│   └── content/            # 示例内容
└── hugo.toml (可选)         # 根目录配置（覆盖 config/_default/）
```

## 参考

- [Hugo Configuration Directory](https://gohugo.io/getting-started/configuration/#configuration-directory)
- [Hugo Configuration Lookup Order](https://gohugo.io/getting-started/configuration/#configuration-lookup-order)
