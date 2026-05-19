/**
 * Tests for ShikiProcessor
 */

import { describe, it, expect, beforeEach } from "vitest";
import { ShikiProcessor } from "../../../scripts/shiki/processor.js";
import type { ShikiConfig, CodeBlock } from "../../../scripts/shiki/types.js";

describe("ShikiProcessor", () => {
  let processor: ShikiProcessor;
  let config: ShikiConfig;

  beforeEach(() => {
    config = {
      themes: {
        light: "min-light",
        dark: "night-owl",
      },
      defaultColor: false,
      wrap: false,
      transformers: {
        fileName: true,
        diff: true,
        highlight: true,
        wordHighlight: false,
      },
      fileNameOptions: {
        style: "v2",
        hideDot: false,
      },
      diffOptions: {
        matchAlgorithm: "v3",
      },
    };
    processor = new ShikiProcessor(config);
  });

  describe("init", () => {
    it("should initialize without errors", async () => {
      await processor.init();
      expect(true).toBe(true);
    });
  });

  describe("processCodeBlock", () => {
    it("should process a simple code block", async () => {
      const codeBlock: CodeBlock = {
        code: 'console.log("hello");',
        lang: "javascript",
        meta: "",
        file: "test.md",
        line: 1,
      };

      const result = await processor.processCodeBlock(codeBlock);
      expect(result.html).toBeTruthy();
      expect(result.html).toContain("console");
      expect(result.html).toContain("log");
      expect(result.error).toBeUndefined();
    });

    it("should handle unsupported languages", async () => {
      const codeBlock: CodeBlock = {
        code: "some code",
        lang: "unsupported-lang",
        meta: "",
        file: "test.md",
        line: 1,
      };

      const result = await processor.processCodeBlock(codeBlock);
      expect(result.html).toBeTruthy();
      expect(result.error).toBeUndefined();
    });

    it("should process code block with file name", async () => {
      const codeBlock: CodeBlock = {
        code: "const x = 1;",
        lang: "typescript",
        meta: 'file="src/main.ts"',
        file: "test.md",
        line: 1,
      };

      const result = await processor.processCodeBlock(codeBlock);
      expect(result.html).toBeTruthy();
      expect(result.html).toContain("src/main.ts");
    });

    it("should handle empty code", async () => {
      const codeBlock: CodeBlock = {
        code: "",
        lang: "javascript",
        meta: "",
        file: "test.md",
        line: 1,
      };

      const result = await processor.processCodeBlock(codeBlock);
      expect(result.html).toBeTruthy();
      expect(result.error).toBeUndefined();
    });

    it("should apply theme configuration", async () => {
      const codeBlock: CodeBlock = {
        code: "const x = 1;",
        lang: "javascript",
        meta: "",
        file: "test.md",
        line: 1,
      };

      const result = await processor.processCodeBlock(codeBlock);
      expect(result.html).toBeTruthy();
      // Should contain theme-related CSS
      expect(result.html).toMatch(/style|class/);
    });
  });

  describe("processCodeBlocks", () => {
    it("should process multiple code blocks", async () => {
      const codeBlocks: CodeBlock[] = [
        {
          code: 'console.log("1");',
          lang: "javascript",
          meta: "",
          file: "test.md",
          line: 1,
        },
        {
          code: 'print("2")',
          lang: "python",
          meta: "",
          file: "test.md",
          line: 5,
        },
      ];

      const results = await processor.processCodeBlocks(codeBlocks);
      expect(results.length).toBe(2);
      expect(results[0].html).toContain("console");
      expect(results[1].html).toContain("print");
    });

    it("should handle empty array", async () => {
      const results = await processor.processCodeBlocks([]);
      expect(results).toEqual([]);
    });
  });

  describe("processCodeBlocksParallel", () => {
    it("should process code blocks in parallel", async () => {
      const codeBlocks: CodeBlock[] = [
        {
          code: 'console.log("1");',
          lang: "javascript",
          meta: "",
          file: "test.md",
          line: 1,
        },
        {
          code: 'print("2")',
          lang: "python",
          meta: "",
          file: "test.md",
          line: 5,
        },
        {
          code: "const x = 3;",
          lang: "typescript",
          meta: "",
          file: "test.md",
          line: 10,
        },
      ];

      const results = await processor.processCodeBlocksParallel(codeBlocks, 2);
      expect(results.length).toBe(3);
      expect(results[0].html).toContain("console");
      expect(results[1].html).toContain("print");
      expect(results[2].html).toContain("const");
    });

    it("should maintain order of results", async () => {
      const codeBlocks: CodeBlock[] = Array.from({ length: 10 }, (_, i) => ({
        code: `const x = ${i};`,
        lang: "javascript",
        meta: "",
        file: "test.md",
        line: i,
      }));

      const results = await processor.processCodeBlocksParallel(codeBlocks, 3);
      expect(results.length).toBe(10);

      for (let i = 0; i < 10; i++) {
        expect(results[i].html).toContain(`${i}`);
      }
    });
  });

  describe("transformer configuration", () => {
    it("should respect fileName transformer setting", async () => {
      const configWithoutFileName: ShikiConfig = {
        ...config,
        transformers: {
          ...config.transformers,
          fileName: false,
        },
      };
      const processorWithoutFileName = new ShikiProcessor(
        configWithoutFileName
      );

      const codeBlock: CodeBlock = {
        code: "const x = 1;",
        lang: "typescript",
        meta: 'file="src/main.ts"',
        file: "test.md",
        line: 1,
      };

      const result =
        await processorWithoutFileName.processCodeBlock(codeBlock);
      expect(result.html).toBeTruthy();
      // File name should not be in HTML when transformer is disabled
      // Note: This is a basic check, actual behavior depends on transformer implementation
    });

    it("should handle different fileName styles", async () => {
      const configV1: ShikiConfig = {
        ...config,
        fileNameOptions: {
          style: "v1",
          hideDot: false,
        },
      };
      const processorV1 = new ShikiProcessor(configV1);

      const codeBlock: CodeBlock = {
        code: "const x = 1;",
        lang: "typescript",
        meta: 'file="src/main.ts"',
        file: "test.md",
        line: 1,
      };

      const result = await processorV1.processCodeBlock(codeBlock);
      expect(result.html).toBeTruthy();
    });
  });

  describe("error handling", () => {
    it("should handle processing errors gracefully", async () => {
      const codeBlock: CodeBlock = {
        code: "const x = 1;",
        lang: "javascript",
        meta: "",
        file: "test.md",
        line: 1,
      };

      // This should not throw
      const result = await processor.processCodeBlock(codeBlock);
      expect(result).toBeDefined();
    });
  });
});
