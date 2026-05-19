/**
 * Tests for shiki-config
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getDefaultConfig,
  parseCodeHighlightConfig,
  validateConfig,
  loadConfig,
  readParamsToml,
  type CodeHighlightConfig,
} from "../../scripts/shiki-config.js";
import { writeFile, mkdir, rm } from "fs/promises";
import { join } from "path";

describe("shiki-config", () => {
  const testDir = join(process.cwd(), ".test-config");
  const testParamsPath = join(testDir, "params.toml");

  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore errors
    }
  });

  describe("getDefaultConfig", () => {
    it("should return default configuration", () => {
      const config = getDefaultConfig();

      expect(config.engine).toBe("basic");
      expect(config.showCopyButton).toBe(true);
      expect(config.showLineNumbers).toBe(false);
      expect(config.basic.showFileName).toBe(true);
      expect(config.shiki.themes.light).toBe("min-light");
      expect(config.shiki.themes.dark).toBe("night-owl");
    });

    it("should have correct AstroPaper defaults", () => {
      const config = getDefaultConfig();

      expect(config.shiki.defaultColor).toBe(false);
      expect(config.shiki.wrap).toBe(false);
      expect(config.shiki.fileNameOptions.style).toBe("v2");
      expect(config.shiki.fileNameOptions.hideDot).toBe(false);
      expect(config.shiki.diffOptions.matchAlgorithm).toBe("v3");
    });
  });

  describe("readParamsToml", () => {
    it("should read params.toml file", async () => {
      const content = `
[params]
  [params.codeHighlight]
    engine = "basic"
`;
      await writeFile(testParamsPath, content);

      const params = readParamsToml(testParamsPath);
      expect(params.params.codeHighlight.engine).toBe("basic");
    });

    it("should throw error if file not found", () => {
      expect(() => readParamsToml("/nonexistent/params.toml")).toThrow(
        "Configuration file not found"
      );
    });

    it("should parse TOML correctly", async () => {
      const content = `
[params]
  [params.codeHighlight]
    engine = "shiki"
    showCopyButton = true
    showLineNumbers = false
    
    [params.codeHighlight.shiki]
      [params.codeHighlight.shiki.themes]
        light = "github-light"
        dark = "github-dark"
`;
      await writeFile(testParamsPath, content);

      const params = readParamsToml(testParamsPath);
      expect(params.params.codeHighlight.shiki.themes.light).toBe(
        "github-light"
      );
    });
  });

  describe("parseCodeHighlightConfig", () => {
    it("should parse basic configuration", () => {
      const params = {
        params: {
          codeHighlight: {
            engine: "basic",
            showCopyButton: true,
            basic: {
              theme: "monokai",
            },
          },
        },
      };

      const config = parseCodeHighlightConfig(params);
      expect(config.engine).toBe("basic");
      expect(config.basic.theme).toBe("monokai");
    });

    it("should parse shiki configuration", () => {
      const params = {
        params: {
          codeHighlight: {
            engine: "shiki",
            shiki: {
              themes: {
                light: "github-light",
                dark: "github-dark",
              },
            },
          },
        },
      };

      const config = parseCodeHighlightConfig(params);
      expect(config.engine).toBe("shiki");
      expect(config.shiki.themes.light).toBe("github-light");
      expect(config.shiki.themes.dark).toBe("github-dark");
    });

    it("should use defaults for missing values", () => {
      const params = {
        params: {
          codeHighlight: {},
        },
      };

      const config = parseCodeHighlightConfig(params);
      expect(config.engine).toBe("basic");
      expect(config.showCopyButton).toBe(true);
      expect(config.shiki.themes.light).toBe("min-light");
    });

    it("should handle empty params", () => {
      const config = parseCodeHighlightConfig({});
      expect(config.engine).toBe("basic");
    });

    it("should parse transformer options", () => {
      const params = {
        params: {
          codeHighlight: {
            shiki: {
              transformers: {
                fileName: true,
                diff: false,
                highlight: true,
                wordHighlight: false,
              },
            },
          },
        },
      };

      const config = parseCodeHighlightConfig(params);
      expect(config.shiki.transformers.fileName).toBe(true);
      expect(config.shiki.transformers.diff).toBe(false);
    });

    it("should parse fileName options", () => {
      const params = {
        params: {
          codeHighlight: {
            shiki: {
              fileNameOptions: {
                style: "v1",
                hideDot: true,
              },
            },
          },
        },
      };

      const config = parseCodeHighlightConfig(params);
      expect(config.shiki.fileNameOptions.style).toBe("v1");
      expect(config.shiki.fileNameOptions.hideDot).toBe(true);
    });

    it("should parse diff options", () => {
      const params = {
        params: {
          codeHighlight: {
            shiki: {
              diffOptions: {
                matchAlgorithm: "v2",
              },
            },
          },
        },
      };

      const config = parseCodeHighlightConfig(params);
      expect(config.shiki.diffOptions.matchAlgorithm).toBe("v2");
    });
  });

  describe("validateConfig", () => {
    it("should validate correct basic config", () => {
      const config: CodeHighlightConfig = {
        engine: "basic",
        showCopyButton: true,
        showLineNumbers: false,
        basic: {
          showFileName: true,
          showDiff: true,
          theme: "github",
        },
        shiki: getDefaultConfig().shiki,
      };

      const result = validateConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should validate correct shiki config", () => {
      const config = getDefaultConfig();
      config.engine = "shiki";

      const result = validateConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should reject invalid engine", () => {
      const config = getDefaultConfig();
      // @ts-expect-error Testing invalid value
      config.engine = "invalid";

      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("Invalid engine");
    });

    it("should reject missing shiki themes", () => {
      const config = getDefaultConfig();
      config.engine = "shiki";
      config.shiki.themes.light = "";

      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes("light theme"))).toBe(true);
    });

    it("should reject invalid fileName style", () => {
      const config = getDefaultConfig();
      config.engine = "shiki";
      // @ts-expect-error Testing invalid value
      config.shiki.fileNameOptions.style = "v3";

      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes("fileName style"))).toBe(true);
    });

    it("should reject invalid diff matchAlgorithm", () => {
      const config = getDefaultConfig();
      config.engine = "shiki";
      // @ts-expect-error Testing invalid value
      config.shiki.diffOptions.matchAlgorithm = "v4";

      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(e => e.includes("diff matchAlgorithm"))
      ).toBe(true);
    });

    it("should allow multiple errors", () => {
      const config = getDefaultConfig();
      config.engine = "shiki";
      config.shiki.themes.light = "";
      config.shiki.themes.dark = "";

      const result = validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("loadConfig", () => {
    it("should load and validate config from file", async () => {
      const content = `
[params]
  [params.codeHighlight]
    engine = "basic"
    showCopyButton = true
`;
      await writeFile(testParamsPath, content);

      const config = loadConfig(testParamsPath);
      expect(config.engine).toBe("basic");
      expect(config.showCopyButton).toBe(true);
    });

    it("should throw error for invalid config", async () => {
      const content = `
[params]
  [params.codeHighlight]
    engine = "invalid"
`;
      await writeFile(testParamsPath, content);

      expect(() => loadConfig(testParamsPath)).toThrow("Invalid configuration");
    });

    it("should throw error for missing file", () => {
      expect(() => loadConfig("/nonexistent/params.toml")).toThrow(
        "Failed to load configuration"
      );
    });

    it("should load complete shiki config", async () => {
      const content = `
[params]
  [params.codeHighlight]
    engine = "shiki"
    
    [params.codeHighlight.shiki]
      defaultColor = false
      wrap = false
      
      [params.codeHighlight.shiki.themes]
        light = "github-light"
        dark = "github-dark"
      
      [params.codeHighlight.shiki.transformers]
        fileName = true
        diff = true
        highlight = true
        wordHighlight = false
      
      [params.codeHighlight.shiki.fileNameOptions]
        style = "v2"
        hideDot = false
      
      [params.codeHighlight.shiki.diffOptions]
        matchAlgorithm = "v3"
`;
      await writeFile(testParamsPath, content);

      const config = loadConfig(testParamsPath);
      expect(config.engine).toBe("shiki");
      expect(config.shiki.themes.light).toBe("github-light");
      expect(config.shiki.fileNameOptions.style).toBe("v2");
      expect(config.shiki.diffOptions.matchAlgorithm).toBe("v3");
    });
  });

  describe("integration", () => {
    it("should handle complete workflow", async () => {
      // 1. Get default config
      const defaultConfig = getDefaultConfig();
      expect(defaultConfig).toBeDefined();

      // 2. Create custom config file with valid shiki config
      const content = `
[params]
  [params.codeHighlight]
    engine = "shiki"
    
    [params.codeHighlight.shiki]
      defaultColor = false
      wrap = false
      
      [params.codeHighlight.shiki.themes]
        light = "min-light"
        dark = "night-owl"
      
      [params.codeHighlight.shiki.fileNameOptions]
        style = "v2"
        hideDot = false
      
      [params.codeHighlight.shiki.diffOptions]
        matchAlgorithm = "v3"
`;
      await writeFile(testParamsPath, content);

      // 3. Load config
      const config = loadConfig(testParamsPath);
      expect(config.engine).toBe("shiki");

      // 4. Validate config
      const validation = validateConfig(config);
      expect(validation.valid).toBe(true);
    });
  });
});
