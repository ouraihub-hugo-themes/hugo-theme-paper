---
title: "Test Code Highlighting"
date: 2024-01-15T10:00:00+08:00
draft: false
description: "Testing Hugo Chroma code highlighting with different languages"
categories:
  - Test
tags:
  - Code
  - Syntax Highlighting
---

## JavaScript Example

```javascript {file="greet.js"}
function greet(name) {
  console.log(`Hello, ${name}!`);
  return true;
}

const user = "World";
greet(user);
```

## Diff Markers Example

```javascript {file="api.js"}
function fetchData(url) {
  // [!code --]
  return fetch(url).then(res => res.json());
  // [!code ++]
  return fetch(url)
    .then(res => res.json())
    .catch(err => console.error(err));
}

// [!code hl]
const API_URL = "https://api.example.com/data";
fetchData(API_URL);
```

## Multiple Line Diff

```typescript {file="user.ts"}
interface User {
  id: number;
  name: string;
  // [!code --:2]
  age: number;
  address: string;
  // [!code ++:3]
  email: string;
  phone: string;
  createdAt: Date;
}
```

## Python Example

```python
def calculate_sum(numbers):
    """Calculate the sum of a list of numbers."""
    total = 0
    for num in numbers:
        total += num
    return total

# Test the function
result = calculate_sum([1, 2, 3, 4, 5])
print(f"Sum: {result}")
```

## Go Example

```go
package main

import "fmt"

func main() {
    message := "Hello, Hugo!"
    fmt.Println(message)
    
    // Calculate factorial
    n := 5
    result := factorial(n)
    fmt.Printf("Factorial of %d is %d\n", n, result)
}

func factorial(n int) int {
    if n <= 1 {
        return 1
    }
    return n * factorial(n-1)
}
```

## TypeScript Example

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];
  
  addUser(user: User): void {
    this.users.push(user);
  }
  
  getUser(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }
}

const service = new UserService();
service.addUser({ id: 1, name: "Alice", email: "alice@example.com" });
```

## CSS Example

```css
/* Modern CSS with custom properties */
:root {
  --primary-color: #0ea5e9;
  --secondary-color: #64748b;
  --border-radius: 8px;
}

.card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}
```

## Bash Example

```bash
#!/bin/bash

# Deploy script
echo "Starting deployment..."

# Build the project
npm run build

# Run tests
npm test

# Deploy to production
if [ $? -eq 0 ]; then
    echo "Tests passed! Deploying..."
    rsync -avz dist/ user@server:/var/www/
    echo "Deployment complete!"
else
    echo "Tests failed! Aborting deployment."
    exit 1
fi
```
