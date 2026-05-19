# Code Block Usage Guide

This document explains how to use code blocks in Hugo Paper theme.

## Basic Code Block

Simply use triple backticks with a language identifier:

````markdown
```javascript
function hello() {
  console.log("Hello, World!");
}
```
````

## Code Block with File Name

To display a file name above the code block, use the `file` attribute:

````markdown
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
````

**Important**: The `file` attribute must be enclosed in curly braces `{}` and the value must be quoted.

## Features

### 1. Syntax Highlighting

All code blocks are automatically highlighted using Hugo's built-in Chroma highlighter (in basic mode) or Shiki (when enabled).

### 2. Copy Button

Every code block includes a copy button in the top-right corner that allows users to copy the code to their clipboard with one click.

### 3. File Name Display

When you specify a `file` attribute, a file name label will appear above the code block with:
- A green indicator dot
- The file path
- Styled to match the AstroPaper design

### 4. Responsive Design

Code blocks are fully responsive and will scroll horizontally on smaller screens.

## Configuration

You can configure code block behavior in `params.toml`:

```toml
[params.codeHighlight]
  # Engine: "basic" (Hugo Chroma) or "shiki" (Shiki pre-processing)
  engine = "basic"
  
  # Show copy button
  showCopyButton = true
  
  # Show line numbers
  showLineNumbers = false
  
  [params.codeHighlight.basic]
    # Show file name when specified
    showFileName = true
    
    # Chroma theme
    theme = "github"
```

## Styling

The code blocks use the following CSS classes:

- `.code-block-wrapper` - Outer container
- `.code-file-name` - File name label
- `.file-indicator` - Green dot indicator
- `.file-path` - File path text
- `.code-block` - Code container
- `.code-copy-button` - Copy button
- `.code-content` - Code content wrapper

All styles are defined in `assets/css/code-blocks.css` and support both light and dark themes.

## Examples

### JavaScript with File Name

````markdown
```javascript {file="app.js"}
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
```
````

### Python with File Name

````markdown
```python {file="main.py"}
def greet(name: str) -> str:
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("World"))
```
````

### CSS with File Name

````markdown
```css {file="styles.css"}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```
````

### Long File Path

````markdown
```typescript {file="src/components/features/UserProfile/UserProfileCard.tsx"}
export function UserProfileCard({ user }) {
  return (
    <div className="profile-card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```
````

## Requirements

- Hugo 0.93.0+ (for render-codeblock support)
- Goldmark parser with `attribute = true` enabled
- The theme's CSS must be compiled with Tailwind CSS

## Troubleshooting

### File name not showing

Make sure:
1. The `file` attribute is enclosed in curly braces: `{file="..."}`
2. The value is quoted: `file="src/main.ts"`
3. `showFileName = true` in your configuration
4. Goldmark attributes are enabled in your Hugo config

### Copy button not working

Make sure:
1. The JavaScript bundle is loaded: `assets/js/bundle.js`
2. `showCopyButton = true` in your configuration
3. Your browser supports the Clipboard API

### Styling issues

Make sure:
1. The CSS is compiled: `pnpm css:build`
2. The CSS file is loaded in your layout
3. Tailwind CSS is properly configured

## Related Files

- `layouts/_default/_markup/render-codeblock.html` - Render hook
- `layouts/partials/code-block-basic.html` - Basic mode partial
- `assets/css/code-blocks.css` - Code block styles
- `assets/ts/main.ts` - Copy button functionality

## Future Enhancements

When Shiki mode is implemented, additional features will be available:
- Diff highlighting (`// [!code ++]` and `// [!code --]`)
- Line highlighting (`// [!code hl]`)
- Word highlighting
- Multiple theme support
