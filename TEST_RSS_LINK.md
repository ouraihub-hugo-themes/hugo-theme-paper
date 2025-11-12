# RSS 链接实现验证

## 实现内容

已在 `hugo-theme-paper/layouts/_default/list.html` 中添加 RSS 订阅链接。

## 实现细节

### 位置
- RSS 链接紧跟在 Hero section 的 h1 标题后面
- 使用 `inline-block` 显示在标题旁边

### HTML 结构
```html
<a
  href="{{ .RelPermalink }}"
  target="_blank"
  rel="noopener noreferrer"
  title="RSS Feed"
  aria-label="rss feed"
  class="inline-block"
>
  <svg width="20" height="20" class="scale-125 stroke-accent stroke-3 rtl:-rotate-90">
    <!-- RSS 图标路径 -->
  </svg>
  <span class="sr-only">RSS Feed</span>
</a>
```

### 样式类
- `inline-block`: 使链接与标题在同一行显示
- `scale-125`: 放大图标 1.25 倍
- `stroke-accent`: 使用主题的强调色
- `stroke-3`: 笔画宽度为 3
- `rtl:-rotate-90`: RTL 语言支持，旋转 -90 度

### 可访问性
- ✅ `target="_blank"`: 在新标签页打开
- ✅ `rel="noopener noreferrer"`: 安全属性
- ✅ `title="RSS Feed"`: 鼠标悬停提示
- ✅ `aria-label="rss feed"`: 屏幕阅读器标签
- ✅ `<span class="sr-only">RSS Feed</span>`: 屏幕阅读器文本

### SVG 图标
- 尺寸: 20x20px
- 使用标准 RSS 波浪图标路径
- 笔画颜色: currentColor（继承文本颜色）

## 配置更新

### hugo.toml
```toml
[outputs]
  home = ["HTML", "RSS", "JSON"]
  section = ["HTML", "RSS"]
```

### exampleSite/hugo.toml
同样添加了 RSS 输出格式。

## 需求对照

- ✅ 6.1: 在首页 Hero section 的 h1 标题后添加 RSS 链接
- ✅ 6.2: 使用 `inline-block` 显示在标题旁边
- ✅ 6.3: 添加 RSS SVG 图标（20x20px）
- ✅ 6.4: 样式类 `scale-125 stroke-accent stroke-3`
- ✅ 6.5: 添加 `target="_blank"`, `rel="noopener noreferrer"`, `title="RSS Feed"`, `aria-label="rss feed"`
- ✅ 6.6: 添加 `<span class="sr-only">RSS Feed</span>`
- ✅ 6.7: RTL 支持 `rtl:-rotate-90` 类

## 与 AstroPaper 的一致性

完全参考了 `astro-paper/src/pages/index.astro` 的实现：
- 相同的位置（h1 标题后）
- 相同的样式类
- 相同的可访问性属性
- 相同的 SVG 图标尺寸和样式

## 测试建议

1. 启动 Hugo 服务器：`hugo server`
2. 访问首页，检查 RSS 图标是否显示在标题旁边
3. 点击 RSS 图标，确认在新标签页打开 `/index.xml`
4. 使用屏幕阅读器测试可访问性
5. 在 RTL 语言环境下测试图标旋转
