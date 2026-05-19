---
title: "Shiki 差异高亮测试"
date: 2024-01-15T10:00:00+08:00
draft: false
description: "测试 Shiki 代码块的差异高亮功能"
tags:
  - 测试
  - shiki
  - 代码高亮
---

## 差异高亮测试

测试 Shiki 的差异高亮功能，包括添加行、删除行和普通高亮行。

### JavaScript 示例

```js
function greet(name) {
  // [!code --]
  console.log("Hello, " + name);
  // [!code ++]
  console.log(`Hello, ${name}!`);
  
  // [!code hl]
  return `Welcome, ${name}`;
}
```

### TypeScript 示例

```ts
interface User {
  /* [!code --] */
  name: string;
  /* [!code ++] */
  firstName: string;
  /* [!code ++] */
  lastName: string;
  
  /* [!code hl] */
  email: string;
}
```

### 多行差异

```js
/* [!code --:3] */
const oldFunction = () => {
  return "old";
};

/* [!code ++:3] */
const newFunction = () => {
  return "new";
};
```

### 组合示例

```ts
class Calculator {
  // [!code --]
  add(a, b) {
  // [!code ++]
  add(a: number, b: number): number {
    // [!code hl]
    return a + b;
  }
}
```

### React 组件重构

```tsx
// [!code --]
function Button({ text }) {
// [!code ++]
function Button({ text }: { text: string }) {
  // [!code hl]
  return <button>{text}</button>;
}
```

## 预期视觉效果

- **删除行**：红色背景 (`bg-red-500/20`) + 红色 "-" 符号
- **添加行**：绿色背景 (`bg-green-400/20`) + 绿色 "+" 符号
- **高亮行**：灰色背景 (`bg-slate-400/20`)
