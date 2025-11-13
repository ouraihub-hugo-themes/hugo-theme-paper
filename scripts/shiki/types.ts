/**
 * Shiki 预处理器类型定义
 */

export interface ShikiConfig {
  themes: {
    light: string;
    dark: string;
  };
  defaultColor: boolean;
  wrap: boolean;
  transformers: {
    fileName: boolean;
    diff: boolean;
    highlight: boolean;
    wordHighlight: boolean;
  };
  fileNameOptions: {
    style: "v1" | "v2";
    hideDot: boolean;
  };
  diffOptions: {
    matchAlgorithm: "v1" | "v2" | "v3";
  };
}

export interface CodeBlock {
  code: string;
  lang: string;
  meta: string;
  file: string;
  line: number;
}

export interface ProcessResult {
  html: string;
  error?: Error;
  fallbackUsed?: string;
}

export interface ProcessError {
  type: string;
  message: string;
  file: string;
  line: number;
  lang: string;
  originalError?: Error;
  fallbackUsed?: string;
}

export interface CacheEntry {
  hash: string;
  html: string;
  timestamp: number;
}
