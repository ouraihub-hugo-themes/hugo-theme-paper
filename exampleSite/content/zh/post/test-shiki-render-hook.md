---
title: "测试 Shiki Render Hook"
date: 2024-01-15T10:00:00+08:00
draft: false
description: "测试代码块渲染钩子的功能"
tags:
  - test
  - shiki
---

## 测试基础模式

这是一个简单的 JavaScript 代码块：

```javascript
function hello() {
  console.log("Hello, World!");
}
```

## 测试带文件名的代码块

```typescript {file="src/main.ts"}
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Alice",
  age: 30
};
```

## 测试多个代码块

第一个代码块：

```python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
```

第二个代码块：

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

## 测试不同语言

```bash
#!/bin/bash
echo "Hello from bash"
```

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

```json
{
  "name": "test",
  "version": "1.0.0",
  "description": "Test package"
}
```
