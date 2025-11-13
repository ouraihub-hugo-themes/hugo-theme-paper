# Shiki 错误处理和回退系统

## 概述

本文档描述了 Shiki 代码高亮系统的错误处理和回退机制，确保在遇到问题时能够优雅地降级，而不会导致构建失败或显示错误。

## 实现的功能

### 1. 语言支持检测

**文件**: `scripts/shiki/language-support.ts`

#### 功能特性

- **语言验证**: 检查语言是否被 Shiki 支持
- **别名解析**: 自动解析常见的语言别名（如 `js` → `javascript`）
- **智能建议**: 为不支持的语言提供相似语言建议
- **完整列表**: 提供所有支持的语言列表（314+ 种语言）

#### 支持的别名

```typescript
const aliases = {
  "js": "javascript",
  "ts": "typescript",
  "py": "python",
  "rb": "ruby",
  "sh": "bash",
  "shell": "bash",
  "yml": "yaml",
  "md": "markdown",
  "": "plaintext",
  "text": "plaintext",
};
```

#### API

```typescript
// 检查语言是否支持
languageSupport.isSupported("javascript"); // true
languageSupport.isSupported("unknownlang"); // false

// 解析语言别名
languageSupport.resolve("js"); // "javascript"
languageSupport.resolve("unknownlang"); // null

// 获取语言信息
languageSupport.getLanguageInfo("javascript");
// { id: "javascript", name: "javascript", aliases: ["js"], supported: true }

// 查找相似语言
languageSupport.findSimilar("java", 3);
// [{ id: "java", ... }, { id: "javascript", ... }, ...]

// 获取建议消息
languageSupport.getSuggestionMessage("unknownlang");
// "Language "unknownlang" is not supported. Use "plaintext" as fallback."

// 获取所有支持的语言
languageSupport.getAllLanguageIds(); // ["bash", "c", "cpp", ...]
```

#### CLI 工具

```bash
# 列出所有支持的语言
pnpm tsx scripts/shiki/language-support.ts list

# 检查语言是否支持
pnpm tsx scripts/shiki/language-support.ts check javascript

# 获取语言建议
pnpm tsx scripts/shiki/language-support.ts suggest java

# 生成语言文档
pnpm tsx scripts/shiki/language-support.ts doc
```

### 2. Shiki 错误处理

**文件**: `scripts/shiki/processor.ts`

#### 错误类型

```typescript
enum ErrorType {
  LANGUAGE_NOT_SUPPORTED = "LANGUAGE_NOT_SUPPORTED",
  THEME_NOT_FOUND = "THEME_NOT_FOUND",
  TRANSFORMER_ERROR = "TRANSFORMER_ERROR",
  RENDERING_ERROR = "RENDERING_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
```

#### 错误处理流程

1. **语言不支持**
   - 检测不支持的语言
   - 记录错误日志
   - 自动回退到 `plaintext`
   - 提供相似语言建议

2. **主题错误**
   - 检测主题加载失败
   - 记录错误信息
   - 回退到 basic 模式

3. **Transformer 错误**
   - 捕获 transformer 初始化错误
   - 继续处理但不使用失败的 transformer
   - 记录错误日志

4. **渲染错误**
   - 捕获 Shiki 渲染错误
   - 返回空 HTML
   - 让 Hugo 回退到 basic 模式

#### 错误日志

```typescript
interface ProcessError {
  type: string;              // 错误类型
  message: string;           // 错误消息
  file: string;              // 文件路径
  line: number;              // 行号
  lang: string;              // 语言
  originalError?: Error;     // 原始错误对象
  fallbackUsed?: string;     // 使用的回退方案
}
```

#### API

```typescript
// 获取错误日志
const errors = processor.getErrorLog();

// 清空错误日志
processor.clearErrorLog();

// 获取支持的语言列表
const languages = processor.getSupportedLanguages();

// 检查语言是否支持
const isSupported = processor.isLanguageSupported("javascript");
```

#### 错误日志示例

```
[Shiki Error] LANGUAGE_NOT_SUPPORTED at content/post/example.md:15: 
Language "unknownlang" is not supported. Did you mean:
  - unknown (aliases: ...)
  - lang (aliases: ...)

Using "plaintext" as fallback.
  Fallback: plaintext
```

### 3. 配置验证

**文件**: `scripts/shiki/config-validator.ts`

#### 验证功能

- **主题验证**: 检查主题是否存在
- **Transformer 验证**: 验证 transformer 配置
- **选项验证**: 验证各种配置选项的类型和值
- **友好建议**: 为错误配置提供修复建议

#### 验证规则

1. **必需配置**
   - `themes.light`: 必需，必须是有效的主题名称
   - `themes.dark`: 必需，必须是有效的主题名称

2. **可选配置**
   - `defaultColor`: 布尔值
   - `wrap`: 布尔值
   - `transformers.*`: 布尔值
   - `fileNameOptions.style`: "v1" | "v2"
   - `fileNameOptions.hideDot`: 布尔值
   - `diffOptions.matchAlgorithm`: "v1" | "v2" | "v3"

#### API

```typescript
// 验证配置
const result = configValidator.validate(config);
// {
//   valid: boolean,
//   errors: ValidationError[],
//   warnings: ValidationError[]
// }

// 检查主题是否支持
configValidator.isThemeSupported("min-light"); // true

// 获取所有支持的主题
const themes = configValidator.getSupportedThemes();

// 生成默认配置
const defaultConfig = configValidator.generateDefaultConfig();

// 打印验证结果
configValidator.printValidationResult(result);
```

#### 验证错误示例

```
❌ Configuration Errors:

============================================================

[themes.light]
  Theme "invalid-theme" is not supported
  💡 Did you mean: min-light, github-light, light-plus?

[transformers.fileName]
  Value must be a boolean, got string
  💡 Set transformers.fileName to true or false

============================================================
```

#### CLI 工具

```bash
# 列出所有支持的主题
pnpm tsx scripts/shiki/config-validator.ts themes

# 检查主题是否支持
pnpm tsx scripts/shiki/config-validator.ts check min-light

# 显示默认配置
pnpm tsx scripts/shiki/config-validator.ts default
```

## 回退机制

### 1. 语言回退

```
不支持的语言 → plaintext → 正常渲染
```

**示例**:
```markdown
```unknownlang
some code
```
```

**处理流程**:
1. 检测到 `unknownlang` 不支持
2. 记录错误日志
3. 使用 `plaintext` 渲染
4. 显示建议消息

### 2. 主题回退

```
无效主题 → 构建失败（配置验证阶段）
```

**处理流程**:
1. 在构建开始前验证配置
2. 检测到无效主题
3. 显示错误消息和建议
4. 终止构建

### 3. 渲染回退

```
Shiki 渲染失败 → 返回空 HTML → Hugo 使用 basic 模式
```

**处理流程**:
1. Shiki 渲染失败
2. 捕获错误并记录
3. 返回空 HTML
4. Hugo Render Hook 检测到空 HTML
5. 回退到 basic 模式（Chroma）

## 错误恢复

### 批量处理错误恢复

当处理多个代码块时，单个代码块的错误不会影响其他代码块的处理：

```typescript
const blocks = [
  { code: "code1", lang: "unknownlang", ... },  // 错误
  { code: "code2", lang: "javascript", ... },   // 正常
  { code: "code3", lang: "anotherfake", ... },  // 错误
];

const results = await processor.processCodeBlocks(blocks);
// 所有代码块都会被处理，错误的会回退到 plaintext
```

### 错误日志累积

所有错误都会被记录，可以在构建完成后查看：

```typescript
// 处理多个文件
await build.run();

// 查看所有错误
const errors = processor.getErrorLog();
console.log(`Total errors: ${errors.length}`);

for (const error of errors) {
  console.log(`${error.file}:${error.line} - ${error.message}`);
}
```

## 最佳实践

### 1. 使用标准语言名称

**推荐**:
```markdown
```javascript
const x = 1;
```
```

**也支持**:
```markdown
```js
const x = 1;
```
```

### 2. 验证配置

在构建前验证配置：

```typescript
const config = loadConfig();
const result = configValidator.validate(config);

if (!result.valid) {
  configValidator.printValidationResult(result);
  process.exit(1);
}
```

### 3. 监控错误日志

定期检查错误日志，修复不支持的语言：

```bash
# 构建时启用详细日志
pnpm build --verbose

# 查看错误统计
grep "LANGUAGE_NOT_SUPPORTED" build.log | wc -l
```

### 4. 使用 CLI 工具

在编写内容前，检查语言是否支持：

```bash
# 检查语言
pnpm tsx scripts/shiki/language-support.ts check rust

# 获取建议
pnpm tsx scripts/shiki/language-support.ts suggest java
```

## 测试覆盖

### 测试文件

- `tests/scripts/shiki/error-handling.test.ts`: 27 个测试用例

### 测试覆盖范围

1. **语言支持检测** (7 个测试)
   - 检测支持的语言
   - 检测不支持的语言
   - 解析语言别名
   - 提供语言建议
   - 生成建议消息
   - 获取所有支持的语言

2. **Shiki 错误处理** (5 个测试)
   - 处理不支持的语言并回退
   - 记录语言不支持错误
   - 处理空代码块
   - 处理特殊字符
   - 清空错误日志

3. **配置验证** (10 个测试)
   - 验证有效配置
   - 检测缺失的主题配置
   - 检测不支持的主题
   - 检测无效的 transformer 配置
   - 检测无效的 fileName 选项
   - 检测无效的 diff 选项
   - 提供友好的错误建议
   - 检查主题是否被支持
   - 获取所有支持的主题
   - 生成默认配置

4. **语言别名处理** (3 个测试)
   - 处理常见的语言别名
   - 处理大小写不敏感的语言名称
   - 处理带空格的语言名称

5. **错误恢复** (2 个测试)
   - 在处理错误后继续处理其他代码块
   - 记录所有错误

### 运行测试

```bash
# 运行所有错误处理测试
pnpm test:run tests/scripts/shiki/error-handling.test.ts

# 运行所有 Shiki 测试
pnpm test:run tests/scripts/shiki/

# 运行所有测试
pnpm test:run
```

## 性能影响

### 错误处理开销

- **语言检测**: < 1ms（使用 Set 查找）
- **别名解析**: < 1ms（使用 Map 查找）
- **配置验证**: < 10ms（仅在构建开始时执行一次）
- **错误日志**: 可忽略（仅在出错时）

### 回退性能

- **plaintext 回退**: 与正常处理相同（Shiki 支持 plaintext）
- **basic 模式回退**: 使用 Hugo Chroma，性能优秀

## 故障排除

### 问题：语言不支持

**症状**:
```
[Shiki Error] LANGUAGE_NOT_SUPPORTED at content/post/example.md:15
```

**解决方案**:
1. 检查语言名称拼写
2. 使用 CLI 工具查找正确的语言名称
3. 查看建议的相似语言
4. 如果确实不支持，使用 `plaintext`

### 问题：主题不存在

**症状**:
```
❌ Configuration Errors:
[themes.light]
  Theme "invalid-theme" is not supported
```

**解决方案**:
1. 使用 CLI 工具列出所有支持的主题
2. 检查主题名称拼写
3. 使用默认主题（min-light / night-owl）

### 问题：构建失败

**症状**:
```
Build failed: Invalid Shiki configuration
```

**解决方案**:
1. 运行配置验证工具
2. 检查所有错误消息
3. 根据建议修复配置
4. 重新构建

## 相关文档

- [Shiki 配置指南](./SHIKI-SETUP.md)
- [Shiki 语法参考](./SHIKI-SYNTAX.md)
- [Shiki 构建集成](./SHIKI-BUILD-INTEGRATION.md)
- [故障排除指南](./SHIKI-TROUBLESHOOTING.md)

## 总结

Shiki 错误处理和回退系统提供了：

1. **完善的错误检测**: 捕获所有可能的错误
2. **优雅的降级**: 自动回退到可用的方案
3. **友好的提示**: 提供清晰的错误消息和建议
4. **零中断**: 错误不会导致构建失败
5. **完整的日志**: 记录所有错误供后续分析

这确保了即使在遇到问题时，网站仍然可以正常构建和显示，同时为开发者提供了足够的信息来修复问题。
