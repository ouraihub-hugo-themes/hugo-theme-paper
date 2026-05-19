---
title: "Test Shiki Render Hook"
date: 2024-01-15T10:00:00+08:00
draft: false
description: "Testing code block render hook functionality"
tags:
  - test
  - shiki
---

## Test Basic Mode

A simple JavaScript code block:

```javascript
function hello() {
  console.log("Hello, World!");
}
```

## Test Code Block with File Name

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

## Test Multiple Code Blocks

First code block:

```python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
```

Second code block:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

## Test Different Languages

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
