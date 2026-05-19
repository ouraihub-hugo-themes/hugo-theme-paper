# 配置文件说明

Hugo Paper 使用分离的配置文件结构，使配置更清晰易维护。

## 📁 配置文件结构

```
config/
└── _default/
    ├── hugo.toml       # 基础配置
    ├── params.toml     # 主题参数
    ├── languages.toml  # 多语言设置
    ├── menus.en.toml   # 英文菜单
    └── menus.zh.toml   # 中文菜单
```

## 📝 各文件说明

### hugo.toml - 基础配置
包含 Hugo 核心设置：
- 站点基本信息（baseURL, title, languageCode）
- 内容设置（enableEmoji, hasCJKLanguage, summaryLength）
- 分页设置
- 分类系统（taxonomies）
- 输出格式（outputs）
- Markdown 渲染配置（markup）

### params.toml - 主题参数
包含主题特定的参数：
- 站点描述
- 主题开关设置
- 社交链接
- 编辑文章链接
- 其他主题功能开关

### languages.toml - 多语言配置
定义支持的语言：
- 语言名称和代码
- 每个语言的标题
- 内容目录路径
- 权重（显示顺序）

### menus.en.toml / menus.zh.toml - 菜单配置
分别定义英文和中文的导航菜单：
- 菜单项名称
- URL 路径
- 显示顺序

## 🎯 优势

1. **清晰分离** - 每个文件职责单一，易于理解
2. **易于维护** - 修改某项配置不用翻整个文件
3. **多人协作** - 不同人可以修改不同配置文件，减少冲突
4. **版本控制** - Git diff 更清晰，易于追踪变更

## 🔧 如何修改配置

### 修改站点标题
编辑 `config/_default/hugo.toml`:
```toml
title = "我的博客"
```

### 添加社交链接
编辑 `config/_default/params.toml`:
```toml
[[social]]
  name = "GitHub"
  href = "https://github.com/yourusername"
  linkTitle = "在 GitHub 上关注"
```

### 修改菜单
编辑 `config/_default/menus.zh.toml`:
```toml
[[main]]
  name = "首页"
  url = "/"
  weight = 1
```

### 添加新语言
1. 在 `languages.toml` 中添加语言定义
2. 创建对应的 `menus.{lang}.toml` 文件
3. 创建 `content/{lang}/` 目录

## 📚 参考文档

- [Hugo 配置目录文档](https://gohugo.io/getting-started/configuration/#configuration-directory)
- [Hugo 多语言文档](https://gohugo.io/content-management/multilingual/)
- [Hugo 菜单文档](https://gohugo.io/content-management/menus/)
