/**
 * Shiki 配置读取和验证工具
 * 参考: astro-paper/astro.config.ts 的 markdown.shikiConfig
 */

import * as fs from "fs";
import * as path from "path";
import { parse as parseToml } from "smol-toml";

/**
 * Shiki 主题配置
 */
export interface ShikiThemes {
  light: string;
  dark: string;
}

/**
 * Shiki Transformers 配置
 */
export interface ShikiTransformers {
  fileName: boolean;
  diff: boolean;
  highlight: boolean;
  wordHighlight: boolean;
}

/**
 * fileName Transformer 选项
 * 对应 AstroPaper: transformerFileName({ style: "v2", hideDot: false })
 */
export interface FileNameOptions {
  style: "v1" | "v2";
  hideDot: boolean;
}

/**
 * diff Transformer 选项
 * 对应 AstroPaper: transformerNotationDiff({ matchAlgorithm: "v3" })
 */
export interface DiffOptions {
  matchAlgorithm: "v1" | "v2" | "v3";
}

/**
 * Shiki 配置
 * 对应 AstroPaper 的 markdown.shikiConfig
 */
export interface ShikiConfig {
  showFileName: boolean;
  showDiff: boolean;
  defaultColor: boolean; // 对应 AstroPaper: defaultColor: false
  wrap: boolean; // 对应 AstroPaper: wrap: false
  themes: ShikiThemes;
  transformers: ShikiTransformers;
  fileNameOptions: FileNameOptions;
  diffOptions: DiffOptions;
}

/**
 * 代码高亮配置
 */
export interface CodeHighlightConfig {
  engine: "basic" | "shiki";
  showCopyButton: boolean;
  showLineNumbers: boolean;
  basic: {
    showFileName: boolean;
    showDiff: boolean;
    theme: string;
  };
  shiki: ShikiConfig;
}

/**
 * 默认配置
 * 对应 AstroPaper 的默认值
 */
const DEFAULT_CONFIG: CodeHighlightConfig = {
  engine: "basic",
  showCopyButton: true,
  showLineNumbers: false,
  basic: {
    showFileName: true,
    showDiff: true,
    theme: "github",
  },
  shiki: {
    showFileName: true,
    showDiff: true,
    defaultColor: false, // 对应 AstroPaper
    wrap: false, // 对应 AstroPaper
    themes: {
      light: "min-light", // 对应 AstroPaper
      dark: "night-owl", // 对应 AstroPaper
    },
    transformers: {
      fileName: true,
      diff: true,
      highlight: true,
      wordHighlight: false,
    },
    fileNameOptions: {
      style: "v2", // 对应 AstroPaper
      hideDot: false, // 对应 AstroPaper
    },
    diffOptions: {
      matchAlgorithm: "v3", // 对应 AstroPaper
    },
  },
};

/**
 * 读取 params.toml 配置文件
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readParamsToml(configPath?: string): any {
  const paramsPath =
    configPath || path.join(process.cwd(), "params.toml");

  if (!fs.existsSync(paramsPath)) {
    throw new Error(`Configuration file not found: ${paramsPath}`);
  }

  const content = fs.readFileSync(paramsPath, "utf-8");
  return parseToml(content);
}

/**
 * 解析代码高亮配置
 */
export function parseCodeHighlightConfig(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any
): CodeHighlightConfig {
  const codeHighlight = params?.params?.codeHighlight || {};

  return {
    engine: codeHighlight.engine || DEFAULT_CONFIG.engine,
    showCopyButton:
      codeHighlight.showCopyButton ?? DEFAULT_CONFIG.showCopyButton,
    showLineNumbers:
      codeHighlight.showLineNumbers ?? DEFAULT_CONFIG.showLineNumbers,
    basic: {
      showFileName:
        codeHighlight.basic?.showFileName ??
        DEFAULT_CONFIG.basic.showFileName,
      showDiff:
        codeHighlight.basic?.showDiff ?? DEFAULT_CONFIG.basic.showDiff,
      theme: codeHighlight.basic?.theme || DEFAULT_CONFIG.basic.theme,
    },
    shiki: {
      showFileName:
        codeHighlight.shiki?.showFileName ??
        DEFAULT_CONFIG.shiki.showFileName,
      showDiff:
        codeHighlight.shiki?.showDiff ?? DEFAULT_CONFIG.shiki.showDiff,
      defaultColor:
        codeHighlight.shiki?.defaultColor ??
        DEFAULT_CONFIG.shiki.defaultColor,
      wrap: codeHighlight.shiki?.wrap ?? DEFAULT_CONFIG.shiki.wrap,
      themes: {
        light:
          codeHighlight.shiki?.themes?.light ||
          DEFAULT_CONFIG.shiki.themes.light,
        dark:
          codeHighlight.shiki?.themes?.dark ||
          DEFAULT_CONFIG.shiki.themes.dark,
      },
      transformers: {
        fileName:
          codeHighlight.shiki?.transformers?.fileName ??
          DEFAULT_CONFIG.shiki.transformers.fileName,
        diff:
          codeHighlight.shiki?.transformers?.diff ??
          DEFAULT_CONFIG.shiki.transformers.diff,
        highlight:
          codeHighlight.shiki?.transformers?.highlight ??
          DEFAULT_CONFIG.shiki.transformers.highlight,
        wordHighlight:
          codeHighlight.shiki?.transformers?.wordHighlight ??
          DEFAULT_CONFIG.shiki.transformers.wordHighlight,
      },
      fileNameOptions: {
        style:
          codeHighlight.shiki?.fileNameOptions?.style ||
          DEFAULT_CONFIG.shiki.fileNameOptions.style,
        hideDot:
          codeHighlight.shiki?.fileNameOptions?.hideDot ??
          DEFAULT_CONFIG.shiki.fileNameOptions.hideDot,
      },
      diffOptions: {
        matchAlgorithm:
          codeHighlight.shiki?.diffOptions?.matchAlgorithm ||
          DEFAULT_CONFIG.shiki.diffOptions.matchAlgorithm,
      },
    },
  };
}

/**
 * 验证配置
 */
export function validateConfig(
  config: CodeHighlightConfig
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 验证引擎
  if (!["basic", "shiki"].includes(config.engine)) {
    errors.push(
      `Invalid engine: ${config.engine}. Must be "basic" or "shiki".`
    );
  }

  // 验证 Shiki 主题
  if (config.engine === "shiki") {
    if (!config.shiki.themes.light) {
      errors.push("Shiki light theme is required.");
    }
    if (!config.shiki.themes.dark) {
      errors.push("Shiki dark theme is required.");
    }

    // 验证 fileName style
    if (!["v1", "v2"].includes(config.shiki.fileNameOptions.style)) {
      errors.push(
        `Invalid fileName style: ${config.shiki.fileNameOptions.style}. Must be "v1" or "v2".`
      );
    }

    // 验证 diff matchAlgorithm
    if (
      !["v1", "v2", "v3"].includes(
        config.shiki.diffOptions.matchAlgorithm
      )
    ) {
      errors.push(
        `Invalid diff matchAlgorithm: ${config.shiki.diffOptions.matchAlgorithm}. Must be "v1", "v2", or "v3".`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 加载并验证配置
 */
export function loadConfig(configPath?: string): CodeHighlightConfig {
  try {
    const params = readParamsToml(configPath);
    const config = parseCodeHighlightConfig(params);
    const validation = validateConfig(config);

    if (!validation.valid) {
      console.error("Configuration validation failed:");
      validation.errors.forEach(error => console.error(`  - ${error}`));
      throw new Error("Invalid configuration");
    }

    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
    throw error;
  }
}

/**
 * 获取默认配置
 */
export function getDefaultConfig(): CodeHighlightConfig {
  return DEFAULT_CONFIG;
}
