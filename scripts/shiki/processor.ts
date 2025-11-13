/**
 * Shiki 代码块处理器
 * 
 * 负责使用 Shiki 处理代码块，集成各种 transformers
 */

import { codeToHtml, bundledLanguages } from "shiki";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./fileName-transformer.js";
import type { ShikiConfig, CodeBlock, ProcessResult } from "./types.js";

export class ShikiProcessor {
  private config: ShikiConfig;
  private supportedLanguages: Set<string>;

  constructor(config: ShikiConfig) {
    this.config = config;
    this.supportedLanguages = new Set(Object.keys(bundledLanguages));
  }

  /**
   * 初始化处理器（加载支持的语言列表）
   */
  async init(): Promise<void> {
    // 语言列表已在构造函数中初始化
  }

  /**
   * 检查语言是否被 Shiki 支持
   */
  private isLanguageSupported(lang: string): boolean {
    return this.supportedLanguages.has(lang);
  }

  /**
   * 处理单个代码块
   */
  async processCodeBlock(codeBlock: CodeBlock): Promise<ProcessResult> {
    try {
      let { code, lang, meta } = codeBlock;

      // 检查语言支持
      if (!this.isLanguageSupported(lang)) {
        console.warn(
          `Language "${lang}" not supported by Shiki at ${codeBlock.file}:${codeBlock.line}, using plaintext`
        );
        lang = "plaintext";
      }

      // 构建 transformers 列表
      const transformers = [];

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

      // 使用 Shiki 处理代码
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

      return { html };
    } catch (error) {
      const err = error as Error;
      console.error(
        `Shiki processing failed for ${codeBlock.file}:${codeBlock.line}:`,
        err.message
      );
      return {
        html: "",
        error: err,
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
