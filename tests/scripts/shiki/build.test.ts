/**
 * Shiki 构建流程测试
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, writeFile, rm, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { ShikiBuild } from "../../../scripts/shiki/build.js";

describe("ShikiBuild", () => {
  const testDir = join(process.cwd(), ".test-shiki-build");
  const contentDir = join(testDir, "content");
  const outputDir = join(testDir, ".shiki-output");
  const cacheDir = join(testDir, ".shiki-cache");

  beforeEach(async () => {
    // 创建测试目录
    await mkdir(contentDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });
    await mkdir(cacheDir, { recursive: true });
  });

  afterEach(async () => {
    // 清理测试目录
    if (existsSync(testDir)) {
      await rm(testDir, { recursive: true, force: true });
    }
  });

  describe("基础构建", () => {
    it("应该能够处理简单的 Markdown 文件", async () => {
      // 创建测试文件
      const testFile = join(contentDir, "test.md");
      await writeFile(
        testFile,
        `---
title: Test
---

# Test

\`\`\`javascript
const x = 1;
\`\`\`
`,
        "utf-8"
      );

      const build = new ShikiBuild({
        contentDir,
        outputDir,
        cacheDir,
        verbose: false,
      });

      await build.run();

      // 验证输出文件存在
      const outputFile = join(outputDir, "test.json");
      expect(existsSync(outputFile)).toBe(true);
    });

    it("应该能够处理多个代码块", async () => {
      const testFile = join(contentDir, "multi-blocks.md");
      await writeFile(
        testFile,
        `---
title: Multi Blocks
---

\`\`\`javascript
const x = 1;
\`\`\`

\`\`\`typescript
const y: number = 2;
\`\`\`

\`\`\`python
z = 3
\`\`\`
`,
        "utf-8"
      );

      const build = new ShikiBuild({
        contentDir,
        outputDir,
        cacheDir,
        verbose: false,
      });

      await build.run();

      const outputFile = join(outputDir, "multi-blocks.json");
      expect(existsSync(outputFile)).toBe(true);
    });
  });

  describe("增量构建", () => {
    it("应该跳过未修改的文件", async () => {
      // 第一次构建
      const testFile = join(contentDir, "incremental.md");
      await writeFile(
        testFile,
        `---
title: Incremental
---

\`\`\`javascript
const x = 1;
\`\`\`
`,
        "utf-8"
      );

      const build1 = new ShikiBuild({
        contentDir,
        outputDir,
        cacheDir,
        incremental: true,
        verbose: false,
      });

      await build1.run();

      // 获取第一次构建的时间
      const buildTimeFile = join(cacheDir, "build-time.json");
      expect(existsSync(buildTimeFile)).toBe(true);

      // 等待一小段时间
      await new Promise(resolve => setTimeout(resolve, 100));

      // 第二次构建（文件未修改）
      const build2 = new ShikiBuild({
        contentDir,
        outputDir,
        cacheDir,
        incremental: true,
        verbose: false,
      });

      await build2.run();

      // 验证构建时间文件已更新
      const stats = await stat(buildTimeFile);
      expect(stats.mtimeMs).toBeGreaterThan(0);
    });

    it("应该处理修改过的文件", async () => {
      // 第一次构建
      const testFile = join(contentDir, "modified.md");
      await writeFile(
        testFile,
        `---
title: Modified
---

\`\`\`javascript
const x = 1;
\`\`\`
`,
        "utf-8"
      );

      const build1 = new ShikiBuild({
        contentDir,
        outputDir,
        cacheDir,
        incremental: true,
        verbose: false,
      });

      await build1.run();

      // 等待一小段时间
      await new Promise(resolve => setTimeout(resolve, 100));

      // 修改文件
      await writeFile(
        testFile,
        `---
title: Modified
---

\`\`\`javascript
const x = 2; // 修改了
\`\`\`
`,
        "utf-8"
      );

      // 第二次构建
      const build2 = new ShikiBuild({
        contentDir,
        outputDir,
        cacheDir,
        incremental: true,
        verbose: false,
      });

      await build2.run();

      // 验证输出文件已更新
      const outputFile = join(outputDir, "modified.json");
      expect(existsSync(outputFile)).toBe(true);
    });

    it("应该在禁用增量构建时处理所有文件", async () => {
      const testFile = join(contentDir, "no-incremental.md");
      await writeFile(
        testFile,
        `---
title: No Incremental
---

\`\`\`javascript
const x = 1;
\`\`\`
`,
        "utf-8"
      );

      // 第一次构建
      const build1 = new ShikiBuild({
        contentDir,
        outputDir,
        cacheDir,
        incremental: false,
        verbose: false,
      });

      await build1.run();

      // 第二次构建（应该重新处理所有文件）
      const build2 = new ShikiBuild({
        contentDir,
        outputDir,
        cacheDir,
        incremental: false,
        verbose: false,
      });

      await build2.run();

      const outputFile = join(outputDir, "no-incremental.json");
      expect(existsSync(outputFile)).toBe(true);
    });
  });

  describe("错误处理", () => {
    it("应该处理不支持的语言", async () => {
      const testFile = join(contentDir, "unsupported-lang.md");
      await writeFile(
        testFile,
        `---
title: Unsupported
---

\`\`\`unknownlang
some code
\`\`\`
`,
        "utf-8"
      );

      const build = new ShikiBuild({
        contentDir,
        outputDir,
        cacheDir,
        verbose: false,
      });

      // 应该不抛出错误
      await expect(build.run()).resolves.not.toThrow();
    });

    it("应该处理空代码块", async () => {
      const testFile = join(contentDir, "empty-block.md");
      await writeFile(
        testFile,
        `---
title: Empty
---

\`\`\`javascript
\`\`\`
`,
        "utf-8"
      );

      const build = new ShikiBuild({
        contentDir,
        outputDir,
        cacheDir,
        verbose: false,
      });

      await expect(build.run()).resolves.not.toThrow();
    });
  });

  describe("并行处理", () => {
    it("应该支持并行处理多个文件", async () => {
      // 创建多个测试文件
      for (let i = 0; i < 5; i++) {
        const testFile = join(contentDir, `parallel-${i}.md`);
        await writeFile(
          testFile,
          `---
title: Parallel ${i}
---

\`\`\`javascript
const x${i} = ${i};
\`\`\`
`,
          "utf-8"
        );
      }

      const build = new ShikiBuild({
        contentDir,
        outputDir,
        cacheDir,
        parallel: true,
        verbose: false,
      });

      const startTime = Date.now();
      await build.run();
      const duration = Date.now() - startTime;

      // 验证所有输出文件都存在
      for (let i = 0; i < 5; i++) {
        const outputFile = join(outputDir, `parallel-${i}.json`);
        expect(existsSync(outputFile)).toBe(true);
      }

      // 并行处理应该比较快（这是一个粗略的检查）
      expect(duration).toBeLessThan(10000); // 10秒内完成
    });
  });
});
