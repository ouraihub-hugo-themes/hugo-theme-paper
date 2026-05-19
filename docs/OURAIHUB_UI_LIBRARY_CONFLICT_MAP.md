# ouraihub-ui-library 冲突图

> 结论：当前 `feat/integrate-ouraihub-ui-library` 只有文档改动，和 `feature/client-side-code-enhancement` 没有直接文件冲突。  
> 真正需要关注的是未来 `ui-library` 适配代码落地时，会和 `client-side-code-enhancement` 改到同一批主题文件。

## 当前状态

- `feature/client-side-code-enhancement` 已经改了主题核心代码。
- `feat/integrate-ouraihub-ui-library` 目前只是文档方案。
- 这两个分支现在合到主干，不会直接冲突。
- 但如果后续把 `ui-library` 的适配代码真正接进来，高风险文件会集中在全局布局、Markdown 渲染、主题脚本和 CSS 入口。

## 高风险文件

这些文件最容易和 `client-side-code-enhancement` 产生重叠：

| 风险 | 文件 | 原因 |
|---|---|---|
| 高 | `assets/css/main.css` | 全局主题变量、页面布局、Tailwind 入口都在这里。 |
| 高 | `assets/css/typography.css` | Markdown 正文、代码块、Chroma 样式都在这里。 |
| 高 | `assets/css/code-blocks.css` | 代码块容器和高亮外观容易被重新接管。 |
| 高 | `assets/css/chroma-light.css` | 亮色代码高亮样式，适配时很可能重写。 |
| 高 | `assets/css/chroma-dark.css` | 暗色代码高亮样式，适配时很可能重写。 |
| 高 | `assets/css/chroma-dark-themed.css` | 如果继续做代码主题统一，这里会被调整。 |
| 高 | `layouts/_default/baseof.html` | 入口布局、样式加载、脚本挂载点最容易变。 |
| 高 | `layouts/partials/header.html` | 导航、主题切换、移动端菜单通常会被重做。 |
| 高 | `layouts/_default/_markup/render-codeblock.html` | Markdown 代码块渲染策略会直接受影响。 |
| 高 | `layouts/partials/code-block-basic.html` | 代码块基础结构和复制按钮容易冲突。 |
| 高 | `assets/ts/main.ts` | 全局初始化脚本，常和布局/主题联动。 |
| 高 | `assets/ts/code-enhance.ts` | 代码高亮增强逻辑和复制逻辑会改动。 |
| 高 | `static/css/main.css` | 编译产物，若重新构建会跟着变化。 |
| 高 | `static/toggle-theme.js` | 主题切换脚本，通常会和 token/theme 映射一起改。 |

## 中风险文件

这些文件不一定必改，但很容易在适配过程中被顺手改到：

| 风险 | 文件 | 原因 |
|---|---|---|
| 中 | `hugo.toml` | Hugo markup、highlight、模块挂载经常要调。 |
| 中 | `params.toml` | 主题参数、开关配置、布局选项会变化。 |
| 中 | `config/_default/hugo.toml` | 开发配置和示例站点常需要同步。 |
| 中 | `config/_default/params.toml` | 主题参数样例容易跟着变。 |
| 中 | `config/_default/menus.en.toml` | 导航重构时会改菜单结构。 |
| 中 | `config/_default/menus.zh.toml` | 中文菜单同样受影响。 |
| 中 | `layouts/partials/datetime.html` | 文章元信息组件可能被统一风格化。 |
| 中 | `layouts/partials/tag.html` | 标签/分类组件可能被换成统一按钮样式。 |
| 中 | `layouts/partials/schema.html` | 结构化数据一般不动，但布局重构时容易一起检查。 |
| 中 | `layouts/rss.xml` | 站点输出相关，常在整体验证时一起改。 |
| 中 | `layouts/sitemap.xml` | 同上。 |
| 中 | `layouts/partials/og-image.html` | 如果主题视觉统一，OG 图生成也可能联动。 |

## 低风险文件

- `docs/*`
- `exampleSite/*` 的内容文件
- `tests/*` 中和 UI 样式无关的测试
- 不参与布局输出的脚本说明文档

## 合并建议

1. 先合并 `feature/client-side-code-enhancement` 到主干。
2. 再在最新主干上做 `ui-library` 的适配。
3. 适配时优先改 `baseof.html`、`header.html`、`main.css`、`typography.css`。
4. `static/css/main.css` 和 `static/toggle-theme.js` 尽量通过构建产物生成，不要手改。
5. 如果两个分支都要持续演进，先 rebase 再合并，避免旧基线反复冲突。

## 结论

- 现在：**无直接冲突**
- 后续真正接 `ui-library`：**高风险重叠主要在全局样式、布局模板、Markdown 渲染和主题脚本**
- 最稳的路径：**先合代码增强分支，再做 ui-library 适配**

