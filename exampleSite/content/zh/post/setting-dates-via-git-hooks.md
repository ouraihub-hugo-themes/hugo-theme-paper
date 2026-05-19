---
title: "如何使用 Git Hooks 设置创建和修改日期"
description: "如何在 AstroPaper 中使用 Git Hooks 设置创建和修改日期"
date: 2024-01-03T20:40:08Z
lastmod: 2024-01-08T18:59:05Z
author: "Simon Smale"
keywords:
  - git hooks
  - 自动化
  - frontmatter
  - 日期
  - husky
  - pre-commit
draft: false
featured: false
tags:
  - docs
  - FAQ
canonicalURL: "https://smale.codes/posts/setting-dates-via-git-hooks/"
---

在这篇文章中，我将解释如何使用 pre-commit Git hook 来自动输入 AstroPaper 博客主题 frontmatter 中的创建日期（`pubDatetime`）和修改日期（`modDatetime`）。

## 目录

## 在所有地方使用它们

[Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) 非常适合自动化任务，例如[添加](https://gist.github.com/SSmale/3b380e5bbed3233159fb7031451726ea)或[检查](https://itnext.io/using-git-hooks-to-enforce-branch-naming-policy-ffd81fa01e5e)分支名称到提交消息，或[阻止你提交明文密钥](https://gist.github.com/SSmale/367deee757a9b2e119d241e120249000)。它们最大的缺陷是客户端 hooks 是针对每台机器的。

你可以通过拥有一个 `hooks` 目录并手动将它们复制到 `.git/hooks` 目录或设置符号链接来解决这个问题，但这都需要你记住设置它，而这不是我擅长做的事情。

由于这个项目使用 npm，我们能够使用一个名为 [Husky](https://typicode.github.io/husky/) 的包（这已经安装在 AstroPaper 中）来自动为我们安装 hooks。

> 更新！在 AstroPaper [v4.3.0](https://github.com/satnaing/astro-paper/releases/tag/v4.3.0) 中，pre-commit hook 已被删除，改为使用 GitHub Actions。但是，你可以轻松地[自己安装 Husky](https://typicode.github.io/husky/get-started.html)。

## 钩子

由于我们希望这个 hook 在我们提交代码时运行以更新日期，然后将其作为我们更改的一部分，我们将使用 `pre-commit` hook。这已经由 AstroPaper 项目设置好了，但如果没有，你可以运行 `npx husky add .husky/pre-commit 'echo "This is our new pre-commit hook"'`。

导航到 `hooks/pre-commit` 文件，我们将添加以下一个或两个代码片段。

### 编辑文件时更新修改日期

---

更新：

本节已更新为更智能的 hook 新版本。它现在不会增加 `modDatetime`，直到文章发布。在第一次发布时，将草稿状态设置为 `first`，然后观看魔法发生。

---

```shell
# 修改的文件，更新 modDatetime
git diff --cached --name-status |
grep -i '^M.*\.md$' |
while read _ file; do
  filecontent=$(cat "$file")
  frontmatter=$(echo "$filecontent" | awk -v RS='---' 'NR==2{print}')
  draft=$(echo "$frontmatter" | awk '/^draft: /{print $2}')
  if [ "$draft" = "false" ]; then
    echo "$file modDateTime updated"
    cat $file | sed "/---.*/,/---.*/s/^modDatetime:.*$/modDatetime: $(date -u "+%Y-%m-%dT%H:%M:%SZ")/" > tmp
    mv tmp $file
    git add $file
  fi
  if [ "$draft" = "first" ]; then
    echo "First release of $file, draft set to false and modDateTime removed"
    cat $file | sed "/---.*/,/---.*/s/^modDatetime:.*$/modDatetime:/" | sed "/---.*/,/---.*/s/^draft:.*$/draft: false/" > tmp
    mv tmp $file
    git add $file
  fi
done
```

`git diff --cached --name-status` 从 git 获取已暂存以供提交的文件。输出如下所示：

```shell
A       src/content/blog/setting-dates-via-git-hooks.md
```

开头的字母表示已采取的操作，在上面的示例中，文件已被添加。修改的文件有 `M`。

我们将该输出通过管道传输到 grep 命令，在那里我们查看每一行以查找已修改的行。该行需要以 `M`（`^(M)`）开头，之后有任意数量的字符（`.*`），并以 `.md` 文件扩展名（`.(md)$`）结尾。这将过滤掉不是修改的 markdown 文件的行 `egrep -i "^(M).*\.(md)$"`。

---

#### 改进 - 更明确

这可以添加为仅查找 `blog` 目录中的 markdown 文件，因为这些是唯一具有正确 frontmatter 的文件

---

正则表达式将捕获两部分，字母和文件路径。我们将把这个列表通过管道传输到 while 循环中，以迭代匹配的行，并将字母分配给 `a`，将路径分配给 `b`。我们现在将忽略 `a`。

要知道文件的草稿状态，我们需要它的 frontmatter。在以下代码中，我们使用 `cat` 获取文件的内容，然后使用 `awk` 在 frontmatter 分隔符（`---`）上拆分文件并获取第二个块（frontmatter，`---` 之间的部分）。从这里我们再次使用 `awk` 来查找 draft 键并打印其值。

```shell
  filecontent=$(cat "$file")
  frontmatter=$(echo "$filecontent" | awk -v RS='---' 'NR==2{print}')
  draft=$(echo "$frontmatter" | awk '/^draft: /{print $2}')
```

现在我们有了 `draft` 的值，我们将做 3 件事中的 1 件：将 modDatetime 设置为现在（当 draft 为 false 时 `if [ "$draft" = "false" ]; then`），清除 modDatetime 并将 draft 设置为 false（当 draft 设置为 first 时 `if [ "$draft" = "first" ]; then`），或什么都不做（在任何其他情况下）。

带有 sed 命令的下一部分对我来说有点神奇，因为我不经常使用它，它是从[另一篇关于做类似事情的博客文章](https://mademistakes.com/notes/adding-last-modified-timestamps-with-git/)复制的。本质上，它在文件的 frontmatter 标签（`---`）内查找 `pubDatetime:` 键，获取完整行并用 `pubDatetime: $(date -u "+%Y-%m-%dT%H:%M:%SZ")/"` 相同的键和正确格式化的当前日期时间替换它。

这个替换是在整个文件的上下文中进行的，所以我们将其放入一个临时文件（`> tmp`），然后我们移动（`mv`）新文件到旧文件的位置，覆盖它。然后将其添加到 git 中，准备提交，就好像我们自己做了更改一样。

---

#### 注意

要使 `sed` 工作，frontmatter 需要已经在 frontmatter 中有 `modDatetime` 键。你需要对应用程序进行一些其他更改才能使用空白日期构建，请参阅[下面](#empty-moddatetime-changes)

---

### 为新文件添加日期

为新文件添加日期与上面的过程相同，但这次我们正在查找已添加（`A`）的行，我们将替换 `pubDatetime` 值。

```shell
# 新文件，添加/更新 pubDatetime
git diff --cached --name-status | egrep -i "^(A).*\.(md)$" | while read a b; do
  cat $b | sed "/---.*/,/---.*/s/^pubDatetime:.*$/pubDatetime: $(date -u "+%Y-%m-%dT%H:%M:%SZ")/" > tmp
  mv tmp $b
  git add $b
done
```

---

#### 改进 - 只循环一次

我们可以使用 `a` 变量在循环内切换，并在一个循环中更新 `modDatetime` 或添加 `pubDatetime`。

---

## 填充 frontmatter

如果你的 IDE 支持代码片段，那么可以选择创建自定义代码片段来填充 frontmatter。[在 AstroPaper v4 中，默认情况下将为 VSCode 提供一个。](https://github.com/satnaing/astro-paper/pull/206)

<video autoplay muted="muted" controls plays-inline="true" class="border border-skin-line">
  <source src="https://github.com/satnaing/astro-paper/assets/17761689/e13babbc-2d78-405d-8758-ca31915e41b0" type="video/mp4">
</video>

## 空 `modDatetime` 更改

要允许 Astro 编译 markdown 并执行其操作，它需要知道 frontmatter 中期望的内容。它通过 `src/content/config.ts` 中的配置来执行此操作。

要允许键存在但没有值，我们需要编辑第 10 行以添加 `.nullable()` 函数。

```ts
const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional(), // [!code --]
      modDatetime: z.date().optional().nullable(), // [!code ++]
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      readingTime: z.string().optional(),
    }),
});
```

为了阻止 IDE 在博客引擎文件中抱怨，我还做了以下操作：

1. 在 `src/layouts/Layout.astro` 的第 15 行添加了 `| null`，使其看起来像

   ```typescript
   export interface Props {
     title?: string;
     author?: string;
     description?: string;
     ogImage?: string;
     canonicalURL?: string;
     pubDatetime?: Date;
     modDatetime?: Date | null;
   }
   ```

2. 在 `src/components/Datetime.tsx` 的第 5 行添加了 `| null`，使其看起来像

   ```typescript
   interface DatetimesProps {
     pubDatetime: string | Date;
     modDatetime: string | Date | undefined | null;
   }
   ```
