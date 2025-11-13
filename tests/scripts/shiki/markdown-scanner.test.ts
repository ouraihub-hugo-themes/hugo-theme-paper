/**
 * Tests for MarkdownScanner
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MarkdownScanner } from "../../../scripts/shiki/markdown-scanner.js";
import { writeFile, mkdir, rm } from "fs/promises";
import { join } from "path";

describe("MarkdownScanner", () => {
  const testContentDir = join(process.cwd(), ".test-content");
  let scanner: MarkdownScanner;

  beforeEach(async () => {
    await mkdir(testContentDir, { recursive: true });
    scanner = new MarkdownScanner(testContentDir);
  });

  afterEach(async () => {
    try {
      await rm(testContentDir, { recursive: true, force: true });
    } catch {
      // Ignore errors
    }
  });

  describe("scanFiles", () => {
    it("should find markdown files", async () => {
      await writeFile(join(testContentDir, "test1.md"), "# Test 1");
      await writeFile(join(testContentDir, "test2.md"), "# Test 2");

      const files = await scanner.scanFiles();
      expect(files.length).toBe(2);
    });

    it("should support custom patterns", async () => {
      await mkdir(join(testContentDir, "posts"), { recursive: true });
      await writeFile(join(testContentDir, "test.md"), "# Test");
      await writeFile(join(testContentDir, "posts", "post1.md"), "# Post 1");

      const files = await scanner.scanFiles("posts/**/*.md");
      expect(files.length).toBe(1);
      expect(files[0]).toContain("post1.md");
    });

    it("should return empty array if no files found", async () => {
      const files = await scanner.scanFiles();
      expect(files).toEqual([]);
    });
  });

  describe("extractCodeBlocks", () => {
    it("should extract code blocks from markdown", async () => {
      const content = `
# Test

\`\`\`javascript
console.log("hello");
\`\`\`

Some text

\`\`\`python
print("world")
\`\`\`
`;
      const filePath = join(testContentDir, "test.md");
      await writeFile(filePath, content);

      const blocks = await scanner.extractCodeBlocks(filePath);
      expect(blocks.length).toBe(2);
      expect(blocks[0].lang).toBe("javascript");
      expect(blocks[0].code).toBe('console.log("hello");');
      expect(blocks[1].lang).toBe("python");
      expect(blocks[1].code).toBe('print("world")');
    });

    it("should extract meta information", async () => {
      const content = `
\`\`\`typescript {file="src/main.ts"}
const x = 1;
\`\`\`
`;
      const filePath = join(testContentDir, "test.md");
      await writeFile(filePath, content);

      const blocks = await scanner.extractCodeBlocks(filePath);
      expect(blocks.length).toBe(1);
      expect(blocks[0].lang).toBe("typescript");
      expect(blocks[0].meta).toBe('{file="src/main.ts"}');
    });

    it("should track line numbers", async () => {
      const content = `
Line 1
Line 2
\`\`\`javascript
code
\`\`\`
Line 6
\`\`\`python
code
\`\`\`
`;
      const filePath = join(testContentDir, "test.md");
      await writeFile(filePath, content);

      const blocks = await scanner.extractCodeBlocks(filePath);
      expect(blocks[0].line).toBe(4); // Line where ``` appears
      expect(blocks[1].line).toBe(8);
    });

    it("should handle files without code blocks", async () => {
      const content = "# Just a heading\n\nSome text.";
      const filePath = join(testContentDir, "test.md");
      await writeFile(filePath, content);

      const blocks = await scanner.extractCodeBlocks(filePath);
      expect(blocks).toEqual([]);
    });

    it("should handle empty code blocks", async () => {
      const content = `
\`\`\`javascript
\`\`\`
`;
      const filePath = join(testContentDir, "test.md");
      await writeFile(filePath, content);

      const blocks = await scanner.extractCodeBlocks(filePath);
      expect(blocks.length).toBe(1);
      expect(blocks[0].code).toBe("");
    });

    it("should handle code blocks without language", async () => {
      const content = `
\`\`\`
plain text
\`\`\`
`;
      const filePath = join(testContentDir, "test.md");
      await writeFile(filePath, content);

      const blocks = await scanner.extractCodeBlocks(filePath);
      expect(blocks.length).toBe(0); // Regex requires language
    });
  });

  describe("scanAndExtract", () => {
    it("should scan and extract from all files", async () => {
      await writeFile(
        join(testContentDir, "test1.md"),
        '```javascript\nconsole.log("1");\n```'
      );
      await writeFile(
        join(testContentDir, "test2.md"),
        '```python\nprint("2")\n```'
      );

      const result = await scanner.scanAndExtract();
      expect(result.size).toBe(2);
    });

    it("should skip files without code blocks", async () => {
      await writeFile(join(testContentDir, "test1.md"), "# No code");
      await writeFile(
        join(testContentDir, "test2.md"),
        '```javascript\ncode\n```'
      );

      const result = await scanner.scanAndExtract();
      expect(result.size).toBe(1);
    });
  });

  describe("getModifiedFiles", () => {
    it("should detect modified files", async () => {
      const now = Date.now();
      const filePath = join(testContentDir, "test.md");

      await writeFile(filePath, "# Test");

      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));

      const modifiedFiles = await scanner.getModifiedFiles(now);
      expect(modifiedFiles.length).toBeGreaterThan(0);
    });

    it("should not return old files", async () => {
      const filePath = join(testContentDir, "test.md");
      await writeFile(filePath, "# Test");

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 10));

      const futureTime = Date.now() + 1000;
      const modifiedFiles = await scanner.getModifiedFiles(futureTime);
      expect(modifiedFiles.length).toBe(0);
    });
  });
});
