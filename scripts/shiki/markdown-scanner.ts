/**
 * Markdown 文件扫描器
 * 
 * 扫描 Markdown 文件并提取代码块
 */

import { readFile } from "fs/promises";
import { glob } from "glob";
import type { CodeBlock } from "./types.js";

export class MarkdownScanner {
  private contentDir: string;

  constructor(contentDir: string = "content") {
    this.contentDir = contentDir;
  }

  /**
   * 扫描所有 Markdown 文件
   */
  async scanFiles(pattern: string = "**/*.md"): Promise<string[]> {
    try {
      const files = await glob(pattern, {
        cwd: this.contentDir,
        absolute: true,
        ignore: ["**/node_modules/**", "**/.git/**"],
      });
      return files;
    } catch (error) {
      console.error("Failed to scan markdown files:", error);
      return [];
    }
  }

  /**
   * 从 Markdown 文件中提取代码块
   */
  async extractCodeBlocks(filePath: string): Promise<CodeBlock[]> {
    try {
      const content = await readFile(filePath, "utf-8");
      const codeBlocks: CodeBlock[] = [];

      // 匹配代码块的正则表达式
      // 格式: ```lang meta
      //       code
      //       ```
      const codeBlockRegex = /```(\w+)([^\n]*)\n([\s\S]*?)```/g;

      let match;

      while ((match = codeBlockRegex.exec(content)) !== null) {
        const [, lang, meta, code] = match;
        const matchStart = match.index;

        // 计算代码块开始的行号
        const beforeMatch = content.substring(0, matchStart);
        const linesBefore = beforeMatch.split("\n").length;

        codeBlocks.push({
          code: code.trim(),
          lang: lang || "plaintext",
          meta: meta.trim(),
          file: filePath,
          line: linesBefore,
        });
      }

      return codeBlocks;
    } catch (error) {
      console.error(`Failed to extract code blocks from ${filePath}:`, error);
      return [];
    }
  }

  /**
   * 扫描并提取所有代码块
   */
  async scanAndExtract(pattern?: string): Promise<Map<string, CodeBlock[]>> {
    const files = await this.scanFiles(pattern);
    const result = new Map<string, CodeBlock[]>();

    for (const file of files) {
      const blocks = await this.extractCodeBlocks(file);
      if (blocks.length > 0) {
        result.set(file, blocks);
      }
    }

    return result;
  }

  /**
   * 获取修改过的文件（基于时间戳）
   */
  async getModifiedFiles(
    lastBuildTime: number,
    pattern?: string
  ): Promise<string[]> {
    const files = await this.scanFiles(pattern);
    const modifiedFiles: string[] = [];

    for (const file of files) {
      try {
        const { stat: fileStat } = await import("fs/promises");
        const stats = await fileStat(file);
        if (stats.mtimeMs > lastBuildTime) {
          modifiedFiles.push(file);
        }
      } catch {
        // 文件可能已被删除，跳过
        continue;
      }
    }

    return modifiedFiles;
  }
}
