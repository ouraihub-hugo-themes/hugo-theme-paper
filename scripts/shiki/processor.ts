/**
 * Shiki 代码块处理器
 * 
 * 负责使用 Shiki 处理代码块，集成各种 transformers
 */

import { codeToHtml } from "shiki";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./fileName-transformer.js";
import { languageSupport } from "./language-support.js";
import type { ShikiConfig, CodeBlock, ProcessResult, ProcessError } from "./types.js";

/**
 * 错误类型枚举
 */
export enum ErrorType {
  LANGUAGE_NOT_SUPPORTED = "LANGUAGE_NOT_SUPPORTED",
  THEME_NOT_FOUND = "THEME_NOT_FOUND",
  TRANSFORMER_ERROR = "TRANSFORMER_ERROR",
  RENDERING_ERROR = "RENDERING_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * 处理错误类
 */
export class ShikiProcessError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public codeBlock: CodeBlock,
    public originalError?: Error
  ) {
    super(message);
    this.name = "ShikiProcessError";
  }
}

export class ShikiProcessor {
  private config: ShikiConfig;
  private errorLog: ProcessError[] = [];
  private enableLogging: boolean;

  constructor(config: ShikiConfig, enableLogging: boolean = true) {
    this.config = config;
    this.enableLogging = enableLogging;
  }

  /**
   * 初始化处理器（加载支持的语言列表）
   */
  async init(): Promise<void> {
    const languages = languageSupport.getAllLanguageIds();
    this.log(`Initialized with ${languages.length} supported languages`);
  }

  /**
   * 获取支持的语言列表
   */
  getSupportedLanguages(): string[] {
    return languageSupport.getAllLanguageIds();
  }

  /**
   * 检查语言是否被 Shiki 支持
   */
  isLanguageSupported(lang: string): boolean {
    return languageSupport.isSupported(lang);
  }

  /**
   * 获取错误日志
   */
  getErrorLog(): ProcessError[] {
    return [...this.errorLog];
  }

  /**
   * 清空错误日志
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * 记录错误
   */
  private logError(error: ProcessError): void {
    this.errorLog.push(error);
    
    if (this.enableLogging) {
      const location = `${error.file}:${error.line}`;
      console.error(`[Shiki Error] ${error.type} at ${location}: ${error.message}`);
      
      if (error.originalError) {
        console.error(`  Original error: ${error.originalError.message}`);
        if (error.originalError.stack) {
          console.error(`  Stack: ${error.originalError.stack.split('\n')[1]?.trim()}`);
        }
      }
      
      if (error.fallbackUsed) {
        console.warn(`  Fallback: ${error.fallbackUsed}`);
      }
    }
  }

  /**
   * 日志输出
   */
  private log(message: string): void {
    if (this.enableLogging) {
      console.log(`[Shiki] ${message}`);
    }
  }

  /**
   * 处理单个代码块
   */
  async processCodeBlock(codeBlock: CodeBlock): Promise<ProcessResult> {
    try {
      let { code, lang, meta } = codeBlock;
      let fallbackUsed: string | undefined;

      // 保存原始语言名称
      const originalLang = lang;

      // 解析语言别名
      const resolved = languageSupport.resolve(lang);
      
      if (!resolved) {
        // 语言不支持，获取建议
        const suggestionMsg = languageSupport.getSuggestionMessage(lang);
        
        const error: ProcessError = {
          type: ErrorType.LANGUAGE_NOT_SUPPORTED,
          message: suggestionMsg,
          file: codeBlock.file,
          line: codeBlock.line,
          lang: originalLang,
          fallbackUsed: "plaintext",
        };
        
        this.logError(error);
        
        // 回退到 plaintext
        lang = "plaintext";
        fallbackUsed = "plaintext";
      } else {
        // 使用解析后的语言 ID
        lang = resolved;
      }

      // 构建 transformers 列表
      const transformers = [];

      try {
        if (this.config.transformers.fileName) {
          transformers.push(
            transformerFileName({
              style: this.config.fileNameOptions.style,
              hideDot: this.config.fileNameOptions.hideDot,
            })
          );
        }

        if (this.config.transformers.highlight) {
          transformers.push(transformerNotationHighlight());
        }

        if (this.config.transformers.wordHighlight) {
          transformers.push(transformerNotationWordHighlight());
        }

        if (this.config.transformers.diff) {
          transformers.push(
            transformerNotationDiff({
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              matchAlgorithm: this.config.diffOptions.matchAlgorithm as any,
            })
          );
        }
      } catch (error) {
        const err = error as Error;
        const processError: ProcessError = {
          type: ErrorType.TRANSFORMER_ERROR,
          message: `Failed to initialize transformers: ${err.message}`,
          file: codeBlock.file,
          line: codeBlock.line,
          lang: originalLang,
          originalError: err,
        };
        
        this.logError(processError);
        
        // 继续处理，但不使用 transformers
        transformers.length = 0;
      }

      // 使用 Shiki 处理代码
      try {
        const html = await codeToHtml(code, {
          lang,
          themes: {
            light: this.config.themes.light,
            dark: this.config.themes.dark,
          },
          defaultColor: this.config.defaultColor ? "light" : false,
          transformers,
          meta: { __raw: meta },
        });

        return { 
          html,
          fallbackUsed,
        };
      } catch (error) {
        const err = error as Error;
        
        // 检查是否是主题错误
        if (err.message.includes("theme") || err.message.includes("Theme")) {
          const processError: ProcessError = {
            type: ErrorType.THEME_NOT_FOUND,
            message: `Theme error: ${err.message}`,
            file: codeBlock.file,
            line: codeBlock.line,
            lang: originalLang,
            originalError: err,
            fallbackUsed: "basic mode",
          };
          
          this.logError(processError);
        } else {
          const processError: ProcessError = {
            type: ErrorType.RENDERING_ERROR,
            message: `Rendering failed: ${err.message}`,
            file: codeBlock.file,
            line: codeBlock.line,
            lang: originalLang,
            originalError: err,
            fallbackUsed: "basic mode",
          };
          
          this.logError(processError);
        }

        // 返回空 HTML，让 Hugo 回退到 basic 模式
        return {
          html: "",
          error: err,
          fallbackUsed: "basic mode",
        };
      }
    } catch (error) {
      const err = error as Error;
      
      const processError: ProcessError = {
        type: ErrorType.UNKNOWN_ERROR,
        message: `Unexpected error: ${err.message}`,
        file: codeBlock.file,
        line: codeBlock.line,
        lang: codeBlock.lang,
        originalError: err,
        fallbackUsed: "basic mode",
      };
      
      this.logError(processError);

      return {
        html: "",
        error: err,
        fallbackUsed: "basic mode",
      };
    }
  }

  /**
   * 批量处理代码块
   */
  async processCodeBlocks(codeBlocks: CodeBlock[]): Promise<ProcessResult[]> {
    const results: ProcessResult[] = [];

    for (const block of codeBlocks) {
      const result = await this.processCodeBlock(block);
      results.push(result);
    }

    return results;
  }

  /**
   * 并行处理代码块
   */
  async processCodeBlocksParallel(
    codeBlocks: CodeBlock[],
    concurrency: number = 4
  ): Promise<ProcessResult[]> {
    const results: ProcessResult[] = new Array(codeBlocks.length);
    const chunks: CodeBlock[][] = [];

    // 将代码块分组
    for (let i = 0; i < codeBlocks.length; i += concurrency) {
      chunks.push(codeBlocks.slice(i, i + concurrency));
    }

    // 并行处理每组
    let index = 0;
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(block => this.processCodeBlock(block))
      );

      for (const result of chunkResults) {
        results[index++] = result;
      }
    }

    return results;
  }
}
