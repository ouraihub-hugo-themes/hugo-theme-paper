/**
 * Shiki 预处理器模块入口
 */

export { ShikiProcessor } from "./processor.js";
export { ShikiCache } from "./cache.js";
export { MarkdownScanner } from "./markdown-scanner.js";
export { ShikiBuild } from "./build.js";
export { transformerFileName } from "./fileName-transformer.js";
export type {
  ShikiConfig,
  CodeBlock,
  ProcessResult,
  CacheEntry,
} from "./types.js";
