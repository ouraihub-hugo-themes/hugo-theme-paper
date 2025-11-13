/**
 * Shiki 配置验证器
 * 
 * 验证配置的完整性和正确性，提供友好的错误信息
 */

import { bundledThemes } from "shiki";
import type { ShikiConfig } from "./types.js";

/**
 * 验证错误接口
 */
export interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
  suggestion?: string;
}

/**
 * 验证结果接口
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * 配置验证器
 */
export class ConfigValidator {
  private supportedThemes: Set<string>;

  constructor() {
    this.supportedThemes = new Set(Object.keys(bundledThemes));
  }

  /**
   * 验证完整配置
   */
  validate(config: Partial<ShikiConfig>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // 验证主题配置
    this.validateThemes(config, errors, warnings);

    // 验证 transformers 配置
    this.validateTransformers(config, errors, warnings);

    // 验证 fileName 选项
    this.validateFileNameOptions(config, errors, warnings);

    // 验证 diff 选项
    this.validateDiffOptions(config, errors, warnings);

    // 验证其他选项
    this.validateOtherOptions(config, errors, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 验证主题配置
   */
  private validateThemes(
    config: Partial<ShikiConfig>,
    errors: ValidationError[],
    _warnings: ValidationError[]
  ): void {
    if (!config.themes) {
      errors.push({
        field: "themes",
        message: "Themes configuration is required",
        severity: "error",
        suggestion: 'Add themes configuration: { light: "min-light", dark: "night-owl" }',
      });
      return;
    }

    // 验证 light 主题
    if (!config.themes.light) {
      errors.push({
        field: "themes.light",
        message: "Light theme is required",
        severity: "error",
        suggestion: 'Set themes.light to a valid theme name, e.g., "min-light"',
      });
    } else if (!this.supportedThemes.has(config.themes.light)) {
      errors.push({
        field: "themes.light",
        message: `Theme "${config.themes.light}" is not supported`,
        severity: "error",
        suggestion: this.getThemeSuggestion(config.themes.light),
      });
    }

    // 验证 dark 主题
    if (!config.themes.dark) {
      errors.push({
        field: "themes.dark",
        message: "Dark theme is required",
        severity: "error",
        suggestion: 'Set themes.dark to a valid theme name, e.g., "night-owl"',
      });
    } else if (!this.supportedThemes.has(config.themes.dark)) {
      errors.push({
        field: "themes.dark",
        message: `Theme "${config.themes.dark}" is not supported`,
        severity: "error",
        suggestion: this.getThemeSuggestion(config.themes.dark),
      });
    }
  }

  /**
   * 验证 transformers 配置
   */
  private validateTransformers(
    config: Partial<ShikiConfig>,
    errors: ValidationError[],
    warnings: ValidationError[]
  ): void {
    if (!config.transformers) {
      warnings.push({
        field: "transformers",
        message: "Transformers configuration is missing, using defaults",
        severity: "warning",
        suggestion: "Add transformers configuration to customize behavior",
      });
      return;
    }

    const { transformers } = config;

    // 验证各个 transformer 选项
    const transformerKeys = ["fileName", "diff", "highlight", "wordHighlight"];
    
    for (const key of transformerKeys) {
      const value = transformers[key as keyof typeof transformers];
      
      if (typeof value !== "boolean" && value !== undefined) {
        errors.push({
          field: `transformers.${key}`,
          message: `Value must be a boolean, got ${typeof value}`,
          severity: "error",
          suggestion: `Set transformers.${key} to true or false`,
        });
      }
    }
  }

  /**
   * 验证 fileName 选项
   */
  private validateFileNameOptions(
    config: Partial<ShikiConfig>,
    errors: ValidationError[],
    warnings: ValidationError[]
  ): void {
    if (!config.fileNameOptions) {
      warnings.push({
        field: "fileNameOptions",
        message: "fileName options are missing, using defaults",
        severity: "warning",
        suggestion: 'Add fileNameOptions: { style: "v2", hideDot: false }',
      });
      return;
    }

    const { fileNameOptions } = config;

    // 验证 style
    if (fileNameOptions.style && !["v1", "v2"].includes(fileNameOptions.style)) {
      errors.push({
        field: "fileNameOptions.style",
        message: `Invalid style "${fileNameOptions.style}", must be "v1" or "v2"`,
        severity: "error",
        suggestion: 'Set fileNameOptions.style to "v1" or "v2"',
      });
    }

    // 验证 hideDot
    if (typeof fileNameOptions.hideDot !== "boolean" && fileNameOptions.hideDot !== undefined) {
      errors.push({
        field: "fileNameOptions.hideDot",
        message: `hideDot must be a boolean, got ${typeof fileNameOptions.hideDot}`,
        severity: "error",
        suggestion: "Set fileNameOptions.hideDot to true or false",
      });
    }
  }

  /**
   * 验证 diff 选项
   */
  private validateDiffOptions(
    config: Partial<ShikiConfig>,
    errors: ValidationError[],
    warnings: ValidationError[]
  ): void {
    if (!config.diffOptions) {
      warnings.push({
        field: "diffOptions",
        message: "Diff options are missing, using defaults",
        severity: "warning",
        suggestion: 'Add diffOptions: { matchAlgorithm: "v3" }',
      });
      return;
    }

    const { diffOptions } = config;

    // 验证 matchAlgorithm
    if (diffOptions.matchAlgorithm && !["v1", "v2", "v3"].includes(diffOptions.matchAlgorithm)) {
      errors.push({
        field: "diffOptions.matchAlgorithm",
        message: `Invalid matchAlgorithm "${diffOptions.matchAlgorithm}", must be "v1", "v2", or "v3"`,
        severity: "error",
        suggestion: 'Set diffOptions.matchAlgorithm to "v1", "v2", or "v3"',
      });
    }
  }

  /**
   * 验证其他选项
   */
  private validateOtherOptions(
    config: Partial<ShikiConfig>,
    errors: ValidationError[],
    _warnings: ValidationError[]
  ): void {
    // 验证 defaultColor
    if (typeof config.defaultColor !== "boolean" && config.defaultColor !== undefined) {
      errors.push({
        field: "defaultColor",
        message: `defaultColor must be a boolean, got ${typeof config.defaultColor}`,
        severity: "error",
        suggestion: "Set defaultColor to true or false",
      });
    }

    // 验证 wrap
    if (typeof config.wrap !== "boolean" && config.wrap !== undefined) {
      errors.push({
        field: "wrap",
        message: `wrap must be a boolean, got ${typeof config.wrap}`,
        severity: "error",
        suggestion: "Set wrap to true or false",
      });
    }
  }

  /**
   * 获取主题建议
   */
  private getThemeSuggestion(theme: string): string {
    const similar = this.findSimilarThemes(theme, 3);
    
    if (similar.length === 0) {
      return `Available themes: ${Array.from(this.supportedThemes).slice(0, 5).join(", ")}, ...`;
    }

    return `Did you mean: ${similar.join(", ")}?`;
  }

  /**
   * 查找相似的主题
   */
  private findSimilarThemes(theme: string, maxResults: number = 5): string[] {
    const normalized = theme.toLowerCase();
    const results: Array<{ theme: string; score: number }> = [];

    for (const supportedTheme of this.supportedThemes) {
      let score = 0;

      if (supportedTheme.includes(normalized)) {
        score += 10;
      }

      if (supportedTheme.startsWith(normalized)) {
        score += 15;
      }

      // Levenshtein distance (simplified)
      const distance = this.levenshteinDistance(normalized, supportedTheme);
      if (distance < 3) {
        score += 20 - distance * 5;
      }

      if (score > 0) {
        results.push({ theme: supportedTheme, score });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(r => r.theme);
  }

  /**
   * 计算 Levenshtein 距离
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * 获取所有支持的主题
   */
  getSupportedThemes(): string[] {
    return Array.from(this.supportedThemes).sort();
  }

  /**
   * 检查主题是否被支持
   */
  isThemeSupported(theme: string): boolean {
    return this.supportedThemes.has(theme);
  }

  /**
   * 打印验证结果
   */
  printValidationResult(result: ValidationResult): void {
    if (result.valid && result.warnings.length === 0) {
      console.log("✓ Configuration is valid\n");
      return;
    }

    if (result.errors.length > 0) {
      console.error("\n❌ Configuration Errors:\n");
      console.error("=".repeat(60));
      
      for (const error of result.errors) {
        console.error(`\n[${error.field}]`);
        console.error(`  ${error.message}`);
        if (error.suggestion) {
          console.error(`  💡 ${error.suggestion}`);
        }
      }
      
      console.error("\n" + "=".repeat(60) + "\n");
    }

    if (result.warnings.length > 0) {
      console.warn("\n⚠️  Configuration Warnings:\n");
      console.warn("=".repeat(60));
      
      for (const warning of result.warnings) {
        console.warn(`\n[${warning.field}]`);
        console.warn(`  ${warning.message}`);
        if (warning.suggestion) {
          console.warn(`  💡 ${warning.suggestion}`);
        }
      }
      
      console.warn("\n" + "=".repeat(60) + "\n");
    }
  }

  /**
   * 生成默认配置
   */
  generateDefaultConfig(): ShikiConfig {
    return {
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
  }
}

// 导出单例实例
export const configValidator = new ConfigValidator();

// CLI 工具
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const validator = new ConfigValidator();

  switch (command) {
    case "themes":
      console.log("\nSupported Themes:");
      console.log("=".repeat(60));
      
      const themes = validator.getSupportedThemes();
      for (const theme of themes) {
        console.log(`  - ${theme}`);
      }
      
      console.log("=".repeat(60));
      console.log(`Total: ${themes.length} themes\n`);
      break;

    case "check": {
      const theme = args[1];
      if (!theme) {
        console.error("Usage: config-validator check <theme>");
        process.exit(1);
      }

      const isSupported = validator.isThemeSupported(theme);
      console.log(`\nTheme: ${theme}`);
      console.log(`Supported: ${isSupported ? "✓ Yes" : "✗ No"}`);
      
      if (!isSupported) {
        const suggestion = validator["getThemeSuggestion"](theme);
        console.log(`\n${suggestion}`);
      }
      
      console.log();
      break;
    }

    case "default":
      console.log("\nDefault Configuration:");
      console.log("=".repeat(60));
      console.log(JSON.stringify(validator.generateDefaultConfig(), null, 2));
      console.log("=".repeat(60) + "\n");
      break;

    default:
      console.log("Shiki Configuration Validator\n");
      console.log("Commands:");
      console.log("  themes           List all supported themes");
      console.log("  check <theme>    Check if a theme is supported");
      console.log("  default          Show default configuration");
      console.log();
      break;
  }
}

// 检查是否作为主模块运行
const isMainModule = process.argv[1] && (
  import.meta.url.endsWith(process.argv[1]) ||
  import.meta.url.includes(process.argv[1].replace(/\\/g, '/'))
);

if (isMainModule) {
  main();
}
