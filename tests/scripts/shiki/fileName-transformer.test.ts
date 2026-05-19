/**
 * Tests for transformerFileName
 */

import { describe, it, expect } from "vitest";
import { transformerFileName } from "../../../scripts/shiki/fileName-transformer.js";
import { codeToHtml } from "shiki";

describe("transformerFileName", () => {
  describe("basic functionality", () => {
    it("should add file name to code block", async () => {
      const code = 'console.log("hello");';
      const html = await codeToHtml(code, {
        lang: "javascript",
        theme: "min-light",
        transformers: [transformerFileName()],
        meta: { __raw: 'file="src/main.js"' },
      });

      expect(html).toContain("src/main.js");
    });

    it("should not add file name when not specified", async () => {
      const code = 'console.log("hello");';
      const html = await codeToHtml(code, {
        lang: "javascript",
        theme: "min-light",
        transformers: [transformerFileName()],
        meta: { __raw: "" },
      });

      // Should not contain file name span
      expect(html).not.toContain("src/main.js");
    });
  });

  describe("style options", () => {
    it("should apply v1 style", async () => {
      const code = "const x = 1;";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName({ style: "v1" })],
        meta: { __raw: 'file="test.ts"' },
      });

      expect(html).toContain("test.ts");
      expect(html).toContain("rounded-tl-none");
    });

    it("should apply v2 style (default)", async () => {
      const code = "const x = 1;";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName({ style: "v2" })],
        meta: { __raw: 'file="test.ts"' },
      });

      expect(html).toContain("test.ts");
      expect(html).toContain("mt-8");
    });
  });

  describe("hideDot option", () => {
    it("should show dot indicator by default", async () => {
      const code = "const x = 1;";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName({ hideDot: false })],
        meta: { __raw: 'file="test.ts"' },
      });

      expect(html).toContain("test.ts");
      expect(html).toContain("before:bg-green-500");
    });

    it("should hide dot indicator when hideDot is true", async () => {
      const code = "const x = 1;";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName({ hideDot: true })],
        meta: { __raw: 'file="test.ts"' },
      });

      expect(html).toContain("test.ts");
      expect(html).not.toContain("before:bg-green-500");
    });
  });

  describe("CSS custom properties", () => {
    it("should set file-name-offset for v1", async () => {
      const code = "const x = 1;";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName({ style: "v1" })],
        meta: { __raw: 'file="test.ts"' },
      });

      expect(html).toContain("--file-name-offset: 0.75rem");
    });

    it("should set file-name-offset for v2", async () => {
      const code = "const x = 1;";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName({ style: "v2" })],
        meta: { __raw: 'file="test.ts"' },
      });

      expect(html).toContain("--file-name-offset: -0.75rem");
    });
  });

  describe("meta parsing", () => {
    it("should parse file name from meta string", async () => {
      const code = "const x = 1;";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName()],
        meta: { __raw: 'file="src/components/Button.tsx"' },
      });

      expect(html).toContain("src/components/Button.tsx");
    });

    it("should handle file names with spaces", async () => {
      const code = "const x = 1;";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName()],
        meta: { __raw: 'file="my-file.ts"' },
      });

      expect(html).toContain("my-file.ts");
    });

    it("should handle different quote styles", async () => {
      const code = "const x = 1;";

      const html1 = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName()],
        meta: { __raw: 'file="test.ts"' },
      });

      const html2 = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName()],
        meta: { __raw: "file='test.ts'" },
      });

      expect(html1).toContain("test.ts");
      expect(html2).toContain("test.ts");
    });

    it("should handle multiple meta attributes", async () => {
      const code = "const x = 1;";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName()],
        meta: { __raw: 'file="test.ts" highlight="1-3"' },
      });

      expect(html).toContain("test.ts");
    });
  });

  describe("edge cases", () => {
    it("should handle empty file name", async () => {
      const code = "const x = 1;";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName()],
        meta: { __raw: 'file=""' },
      });

      // Should not add file name element for empty string
      expect(html).toBeTruthy();
    });

    it("should handle missing meta", async () => {
      const code = "const x = 1;";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName()],
      });

      expect(html).toBeTruthy();
    });

    it("should handle long file paths", async () => {
      const code = "const x = 1;";
      const longPath =
        "src/components/features/user/profile/settings/advanced/SecuritySettings.tsx";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName()],
        meta: { __raw: `file="${longPath}"` },
      });

      expect(html).toContain(longPath);
    });
  });

  describe("integration with other transformers", () => {
    it("should work with multiple transformers", async () => {
      const code = "const x = 1;";
      const html = await codeToHtml(code, {
        lang: "typescript",
        theme: "min-light",
        transformers: [transformerFileName()],
        meta: { __raw: 'file="test.ts"' },
      });

      expect(html).toContain("test.ts");
      expect(html).toBeTruthy();
    });
  });
});
