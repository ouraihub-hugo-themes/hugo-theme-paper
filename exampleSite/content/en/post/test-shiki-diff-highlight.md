---
title: "Shiki Diff Highlight Test"
date: 2024-01-15T10:00:00+08:00
draft: false
description: "Test Shiki code block diff highlighting feature"
tags:
  - test
  - shiki
  - code-highlight
---

## Diff Highlighting Test

Testing Shiki's diff highlighting feature, including added lines, removed lines, and highlighted lines.

### JavaScript Example

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

### TypeScript Example

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

### Multi-line Diff

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

### Combined Example

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

### React Component Refactor

```tsx
// [!code --]
function Button({ text }) {
// [!code ++]
function Button({ text }: { text: string }) {
  // [!code hl]
  return <button>{text}</button>;
}
```

## Expected Visual Effects

- **Removed lines**: Red background (`bg-red-500/20`) + red "-" symbol
- **Added lines**: Green background (`bg-green-400/20`) + green "+" symbol
- **Highlighted lines**: Gray background (`bg-slate-400/20`)
