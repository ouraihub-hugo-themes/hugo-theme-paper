/**
 * Shiki 错误处理和回退测试
 */

import { describe, it, expect, beforeEach } from "vitest";
import { ShikiProcessor, ErrorType } from "../../../scripts/shiki/processor.js";
import { languageSupport } from "../../../scripts/shiki/language-support.js";
import { configValidator } from "../../../scripts/shiki/config-validator.js";
import type { ShikiConfig, CodeBlock } from "../../../scripts/shiki/types.js";

describe("错误处理和回退", () => {
  let processor: ShikiProcessor;
  let config: ShikiConfig;

  beforeEach(() => {
    config = configValidator.generateDefaultConfig();
    processor = new ShikiProcessor(config, false); // 禁用日志输出
  });

  describe("语言支持检测", () => {
    it("应该检测支持的语言", () => {
      expect(languageSupport.isSupported("javascript")).toBe(true);
      expect(languageSupport.isSupported("typescript")).toBe(true);
      expect(languageSupport.isSupported("python")).toBe(true);
      expect(languageSupport.isSupported("js")).toBe(true); // 别名
      expect(languageSupport.isSupported("ts")).toBe(true); // 别名
    });

    it("应该检测不支持的语言", () => {
      expect(languageSupport.isSupported("unknownlang")).toBe(false);
      expect(languageSupport.isSupported("fake-language")).toBe(false);
    });

    it("应该解析语言别名", () => {
      expect(languageSupport.resolve("js")).toBe("javascript");
      expect(languageSupport.resolve("ts")).toBe("typescript");
      expect(languageSupport.resolve("py")).toBe("python");
      expect(languageSupport.resolve("sh")).toBe("bash");
      expect(languageSupport.resolve("yml")).toBe("yaml");
    });

    it("应该返回 null 对于不支持的语言", () => {
      expect(languageSupport.resolve("unknownlang")).toBe(null);
    });

    it("应该提供语言建议", () => {
      const similar = languageSupport.findSimilar("java", 3);
      expect(similar.length).toBeGreaterThan(0);
      expect(similar[0].id).toBe("java");
    });

    it("应该生成建议消息", () => {
      const message = languageSupport.getSuggestionMessage("unknownlang");
      expect(message).toContain("not supported");
      expect(message).toContain("plaintext");
    });

    it("应该获取所有支持的语言", () => {
      const languages = languageSupport.getAllLanguageIds();
      expect(languages.length).toBeGreaterThan(100);
      expect(languages).toContain("javascript");
      expect(languages).toContain("typescript");
      expect(languages).toContain("python");
    });
  });

  describe("Shiki 错误处理", () => {
    it("应该处理不支持的语言并回退到 plaintext", async () => {
      const codeBlock: CodeBlock = {
        code: "some code",
        lang: "unknownlang",
        meta: "",
        file: "test.md",
        line: 1,
      };

      const result = await processor.processCodeBlock(codeBlock);

      expect(result.html).toBeTruthy();
      expect(result.fallbackUsed).toBe("plaintext");
      expect(result.error).toBeUndefined();
    });

    it("应该记录语言不支持错误", async () => {
      processor.clearErrorLog();

      const codeBlock: CodeBlock = {
        code: "some code",
        lang: "fake-lang",
        meta: "",
        file: "test.md",
        line: 5,
      };

      await processor.processCodeBlock(codeBlock);

      const errors = processor.getErrorLog();
      expect(errors.length).toBe(1);
      expect(errors[0].type).toBe(ErrorType.LANGUAGE_NOT_SUPPORTED);
      expect(errors[0].lang).toBe("fake-lang");
      expect(errors[0].file).toBe("test.md");
      expect(errors[0].line).toBe(5);
    });

    it("应该处理空代码块", async () => {
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

    it("应该处理特殊字符", async () => {
      const codeBlock: CodeBlock = {
        code: 'const str = "<>&\\"";',
        lang: "javascript",
        meta: "",
        file: "test.md",
        line: 1,
      };

      const result = await processor.processCodeBlock(codeBlock);

      expect(result.html).toBeTruthy();
      expect(result.error).toBeUndefined();
    });

    it("应该清空错误日志", async () => {
      const codeBlock: CodeBlock = {
        code: "code",
        lang: "unknownlang",
        meta: "",
        file: "test.md",
        line: 1,
      };

      await processor.processCodeBlock(codeBlock);
      expect(processor.getErrorLog().length).toBeGreaterThan(0);

      processor.clearErrorLog();
      expect(processor.getErrorLog().length).toBe(0);
    });
  });

  describe("配置验证", () => {
    it("应该验证有效的配置", () => {
      const validConfig = configValidator.generateDefaultConfig();
      const result = configValidator.validate(validConfig);

      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it("应该检测缺失的主题配置", () => {
      const invalidConfig: Partial<ShikiConfig> = {
        defaultColor: false,
        wrap: false,
      };

      const result = configValidator.validate(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].field).toBe("themes");
    });

    it("应该检测不支持的主题", () => {
      const invalidConfig: Partial<ShikiConfig> = {
        themes: {
          light: "invalid-theme",
          dark: "night-owl",
        },
      };

      const result = configValidator.validate(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === "themes.light")).toBe(true);
    });

    it("应该检测无效的 transformer 配置", () => {
      const invalidConfig: Partial<ShikiConfig> = {
        themes: {
          light: "min-light",
          dark: "night-owl",
        },
        transformers: {
          fileName: "invalid" as any,
          diff: true,
          highlight: true,
          wordHighlight: false,
        },
      };

      const result = configValidator.validate(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === "transformers.fileName")).toBe(true);
    });

    it("应该检测无效的 fileName 选项", () => {
      const invalidConfig: Partial<ShikiConfig> = {
        themes: {
          light: "min-light",
          dark: "night-owl",
        },
        fileNameOptions: {
          style: "invalid" as any,
          hideDot: false,
        },
      };

      const result = configValidator.validate(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === "fileNameOptions.style")).toBe(true);
    });

    it("应该检测无效的 diff 选项", () => {
      const invalidConfig: Partial<ShikiConfig> = {
        themes: {
          light: "min-light",
          dark: "night-owl",
        },
        diffOptions: {
          matchAlgorithm: "invalid" as any,
        },
      };

      const result = configValidator.validate(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === "diffOptions.matchAlgorithm")).toBe(true);
    });

    it("应该提供友好的错误建议", () => {
      const invalidConfig: Partial<ShikiConfig> = {
        themes: {
          light: "min-ligt", // 拼写错误
          dark: "night-owl",
        },
      };

      const result = configValidator.validate(invalidConfig);

      expect(result.valid).toBe(false);
      const error = result.errors.find(e => e.field === "themes.light");
      expect(error).toBeDefined();
      expect(error?.suggestion).toBeTruthy();
      expect(error?.suggestion).toContain("min-light");
    });

    it("应该检查主题是否被支持", () => {
      expect(configValidator.isThemeSupported("min-light")).toBe(true);
      expect(configValidator.isThemeSupported("night-owl")).toBe(true);
      expect(configValidator.isThemeSupported("invalid-theme")).toBe(false);
    });

    it("应该获取所有支持的主题", () => {
      const themes = configValidator.getSupportedThemes();
      expect(themes.length).toBeGreaterThan(10);
      expect(themes).toContain("min-light");
      expect(themes).toContain("night-owl");
    });

    it("应该生成默认配置", () => {
      const defaultConfig = configValidator.generateDefaultConfig();

      expect(defaultConfig.themes.light).toBe("min-light");
      expect(defaultConfig.themes.dark).toBe("night-owl");
      expect(defaultConfig.defaultColor).toBe(false);
      expect(defaultConfig.wrap).toBe(false);
      expect(defaultConfig.transformers.fileName).toBe(true);
      expect(defaultConfig.transformers.diff).toBe(true);
      expect(defaultConfig.transformers.highlight).toBe(true);
      expect(defaultConfig.fileNameOptions.style).toBe("v2");
      expect(defaultConfig.diffOptions.matchAlgorithm).toBe("v3");
    });
  });

  describe("语言别名处理", () => {
    it("应该处理常见的语言别名", async () => {
      const aliases = [
        { alias: "js", expected: "javascript" },
        { alias: "ts", expected: "typescript" },
        { alias: "py", expected: "python" },
        { alias: "rb", expected: "ruby" },
        { alias: "sh", expected: "bash" },
        { alias: "yml", expected: "yaml" },
      ];

      for (const { alias, expected } of aliases) {
        // 验证别名解析
        const resolved = languageSupport.resolve(alias);
        expect(resolved).toBe(expected);

        // 验证代码块处理
        const codeBlock: CodeBlock = {
          code: "code",
          lang: alias,
          meta: "",
          file: "test.md",
          line: 1,
        };

        const result = await processor.processCodeBlock(codeBlock);
        expect(result.html).toBeTruthy();
        expect(result.error).toBeUndefined();
      }
    });

    it("应该处理大小写不敏感的语言名称", async () => {
      const codeBlock: CodeBlock = {
        code: "code",
        lang: "JavaScript",
        meta: "",
        file: "test.md",
        line: 1,
      };

      const result = await processor.processCodeBlock(codeBlock);
      expect(result.html).toBeTruthy();
      expect(result.error).toBeUndefined();
    });

    it("应该处理带空格的语言名称", async () => {
      const codeBlock: CodeBlock = {
        code: "code",
        lang: " javascript ",
        meta: "",
        file: "test.md",
        line: 1,
      };

      const result = await processor.processCodeBlock(codeBlock);
      expect(result.html).toBeTruthy();
      expect(result.error).toBeUndefined();
    });
  });

  describe("错误恢复", () => {
    it("应该在处理错误后继续处理其他代码块", async () => {
      const blocks: CodeBlock[] = [
        {
          code: "code1",
          lang: "unknownlang",
          meta: "",
          file: "test.md",
          line: 1,
        },
        {
          code: "code2",
          lang: "javascript",
          meta: "",
          file: "test.md",
          line: 5,
        },
        {
          code: "code3",
          lang: "anotherfake",
          meta: "",
          file: "test.md",
          line: 10,
        },
      ];

      const results = await processor.processCodeBlocks(blocks);

      expect(results.length).toBe(3);
      expect(results[0].html).toBeTruthy(); // 回退到 plaintext
      expect(results[1].html).toBeTruthy(); // 正常处理
      expect(results[2].html).toBeTruthy(); // 回退到 plaintext
    });

    it("应该记录所有错误", async () => {
      processor.clearErrorLog();

      const blocks: CodeBlock[] = [
        {
          code: "code1",
          lang: "fake1",
          meta: "",
          file: "test.md",
          line: 1,
        },
        {
          code: "code2",
          lang: "fake2",
          meta: "",
          file: "test.md",
          line: 5,
        },
      ];

      await processor.processCodeBlocks(blocks);

      const errors = processor.getErrorLog();
      expect(errors.length).toBe(2);
      expect(errors[0].type).toBe(ErrorType.LANGUAGE_NOT_SUPPORTED);
      expect(errors[1].type).toBe(ErrorType.LANGUAGE_NOT_SUPPORTED);
    });
  });
});
