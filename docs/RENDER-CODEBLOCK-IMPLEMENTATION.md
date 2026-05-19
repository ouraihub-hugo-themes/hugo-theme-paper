# Render Codeblock Implementation

## 概述

`render-codeblock.html` 是 Hugo 的 Render Hook，用于自定义代码块的渲染方式。它支持两种模式：

1. **Basic 模式**：使用 Hugo 内置的 Chroma 语法高亮器
2. **Shiki 模式**：使用预处理的 Shiki HTML

## 文件位置

```
hugo-theme-paper/layouts/_default/_markup/render-codeblock.html
```

## 工作原理

### 1. 模式检测

```go-html-template
{{- $engine := .Page.Site.Params.codeHighlight.engine | default "basic" -}}
```

从 `params.toml` 读取配置，默认使用 "basic" 模式。

### 2. Shiki 模式流程

当 `engine = "shiki"` 时：

1. **生成缓存文件路径**
   ```go-html-template
   {{- $pageID := .Page.File.UniqueID -}}
   {{- $ordinal := .Ordinal -}}
   {{- $shikiFile := printf "shiki-cache/%s-%d.html" $pageID $ordinal -}}
   ```

2. **尝试读取预处理的 HTML**
   ```go-html-template
   {{- $shikiResource := resources.Get $shikiFile -}}
   {{- if $shikiResource -}}
     {{- $shikiHTML = $shikiResource.Content -}}
   {{- end -}}
   ```

3. **渲染或回退**
   - 如果找到 Shiki HTML：直接输出
   - 如果未找到：回退到 basic 模式并输出警告

### 3. Basic 模式流程

当 `engine = "basic"` 或回退时：

```go-html-template
{{- partial "code-block-basic.html" (dict "code" $code "lang" $lang "attributes" $attributes "page" .Page) -}}
```

调用 `code-block-basic.html` partial 进行渲染。

## 配置

在 `params.toml` 中配置：

```toml
[codeHighlight]
  engine = "basic"  # 或 "shiki"
```

## 错误处理

### 1. Shiki HTML 未找到

**场景**：配置了 Shiki 模式，但预处理的 HTML 文件不存在

**处理**：
- 自动回退到 basic 模式
- 在开发模式下输出警告：
  ```
  WARN: Shiki HTML not found at shiki-cache/xxx-1.html for page content/post/example.md (block 1), falling back to basic mode
  ```

### 2. 页面没有 File 对象

**场景**：某些页面（如分类页面）没有 `.Page.File`

**处理**：
- 使用 `.Page.RelPermalink` 的 MD5 作为页面 ID
- 确保不会因为缺少 File 对象而失败

### 3. 不支持的语言

**场景**：Shiki 不支持某种语言

**处理**：
- Shiki 预处理阶段应该处理这种情况
- 如果预处理失败，不会生成 HTML 文件
- Render hook 会自动回退到 basic 模式
- Chroma 支持更广泛的语言

## 数据流

### Shiki 模式

```
Markdown 文件
    ↓
Shiki 预处理器 (Node.js)
    ↓
生成 HTML 文件 (assets/shiki-cache/*.html)
    ↓
Hugo 构建
    ↓
render-codeblock.html 读取 HTML
    ↓
输出到页面
```

### Basic 模式

```
Markdown 文件
    ↓
Hugo 构建
    ↓
render-codeblock.html
    ↓
code-block-basic.html (使用 Chroma)
    ↓
输出到页面
```

## 可用变量

在 render hook 中可用的变量：

- `.Type`: 代码块的语言（如 "javascript", "python"）
- `.Inner`: 代码块的内容
- `.Attributes`: 代码块的属性（如 `file=main.ts`）
- `.Ordinal`: 代码块在页面中的序号（从 0 开始）
- `.Page`: 当前页面对象
- `.Page.File.UniqueID`: 页面的唯一 ID
- `.Page.Site.Params`: 站点参数

## 测试

### 测试 Basic 模式

1. 确保 `params.toml` 中 `codeHighlight.engine = "basic"`
2. 创建包含代码块的 Markdown 文件
3. 运行 `hugo server`
4. 验证代码块使用 Chroma 高亮

### 测试 Shiki 模式

1. 设置 `codeHighlight.engine = "shiki"`
2. 运行 Shiki 预处理器生成 HTML
3. 运行 `hugo server`
4. 验证代码块使用 Shiki 高亮

### 测试回退机制

1. 设置 `codeHighlight.engine = "shiki"`
2. **不运行** Shiki 预处理器
3. 运行 `hugo server`
4. 验证：
   - 代码块仍然正常显示（使用 basic 模式）
   - 控制台输出警告信息

## 性能考虑

### Shiki 模式
- **优点**：高质量的语法高亮，支持主题切换
- **缺点**：需要预处理步骤，增加构建时间

### Basic 模式
- **优点**：无需预处理，构建快速
- **缺点**：高亮质量略低于 Shiki

## 未来改进

1. **缓存优化**：实现增量处理，只处理修改的文件
2. **并行处理**：使用 Worker 线程加速 Shiki 处理
3. **更多 Transformer**：支持行号、代码折叠等功能
4. **错误报告**：提供更详细的错误信息和调试工具

## 相关文件

- `layouts/_default/_markup/render-codeblock.html`: 本文件
- `layouts/partials/code-block-basic.html`: Basic 模式渲染（任务 4.2）
- `params.toml`: 配置文件
- `scripts/shiki-processor.ts`: Shiki 预处理器（任务 3）

## 需求映射

- **需求 1.1**: 双模式支持 ✅
- **需求 1.4**: 模式切换 ✅
- **需求 8.1**: Shiki 错误处理 ✅
- **需求 8.2**: 语言支持检测 ✅
