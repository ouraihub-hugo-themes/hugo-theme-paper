---
title: "Test Code Blocks"
date: 2024-01-20T10:00:00+08:00
draft: false
description: "Testing code block rendering with file names and copy buttons"
tags:
  - test
  - code
---

## Basic Code Block

A simple JavaScript code block without file name:

```javascript
function hello() {
  console.log("Hello, World!");
}

hello();
```

## Code Block with File Name

A TypeScript code block with file name:

```typescript file=src/main.ts
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Alice",
  age: 30
};

console.log(user);
```

## Multiple Code Blocks

First block (Python):

```python file=app.py
def greet(name: str) -> str:
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("World"))
```

Second block (Go):

```go file=main.go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

## Different Languages

Bash script:

```bash file=deploy.sh
#!/bin/bash
echo "Deploying application..."
npm run build
npm run deploy
```

CSS styles:

```css file=styles.css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

JSON configuration:

```json file=package.json
{
  "name": "test-app",
  "version": "1.0.0",
  "description": "Test application",
  "main": "index.js"
}
```

## Long File Path

```javascript file=src/components/features/UserProfile/UserProfileCard.tsx
export function UserProfileCard({ user }) {
  return (
    <div className="profile-card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```
