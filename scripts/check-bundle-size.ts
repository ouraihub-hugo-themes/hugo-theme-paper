#!/usr/bin/env tsx

/**
 * Bundle Size Checker
 * 
 * 验证 bundle.js 文件大小是否符合性能要求
 * Requirements: 7.1 - JavaScript 文件大小应 < 5KB（压缩后）
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

// ESM 环境下获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文件路径
const bundlePath = path.join(__dirname, '../assets/js/bundle.js');

// 性能要求
const MAX_SIZE_KB = 10; // 未压缩最大 10KB
const MAX_GZIP_SIZE_KB = 5; // gzip 压缩后最大 5KB

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
} as const;

interface SizeInfo {
  bytes: number;
  kb: string;
}

interface CompressionResult {
  original: SizeInfo;
  gzip: SizeInfo;
  brotli: SizeInfo;
  gzipRatio: string;
  brotliRatio: string;
}

function formatSize(bytes: number): string {
  return (bytes / 1024).toFixed(2);
}

function compressWithGzip(content: Buffer): Buffer {
  return zlib.gzipSync(content, { level: 9 });
}

function compressWithBrotli(content: Buffer): Buffer {
  return zlib.brotliCompressSync(content, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
    },
  });
}

function calculateCompressionRatio(compressed: number, original: number): string {
  return ((1 - compressed / original) * 100).toFixed(1);
}

function analyzeBundle(content: Buffer): CompressionResult {
  const size = content.length;
  
  // Gzip 压缩
  const gzipped = compressWithGzip(content);
  const gzipSize = gzipped.length;
  
  // Brotli 压缩
  const brotlied = compressWithBrotli(content);
  const brotliSize = brotlied.length;
  
  return {
    original: {
      bytes: size,
      kb: formatSize(size),
    },
    gzip: {
      bytes: gzipSize,
      kb: formatSize(gzipSize),
    },
    brotli: {
      bytes: brotliSize,
      kb: formatSize(brotliSize),
    },
    gzipRatio: calculateCompressionRatio(gzipSize, size),
    brotliRatio: calculateCompressionRatio(brotliSize, size),
  };
}

function checkBundleSize(): void {
  console.log(`${colors.blue}📦 检查 Bundle 文件大小...${colors.reset}\n`);

  // 检查文件是否存在
  if (!fs.existsSync(bundlePath)) {
    console.error(`${colors.red}❌ 错误: 找不到文件 ${bundlePath}${colors.reset}`);
    console.log(`${colors.yellow}💡 提示: 请先运行 'pnpm ts:build' 编译 TypeScript${colors.reset}`);
    process.exit(1);
  }

  // 读取文件
  const content = fs.readFileSync(bundlePath);
  const result = analyzeBundle(content);

  // 显示文件信息
  console.log(`📄 文件: ${path.basename(bundlePath)}`);
  console.log(`📏 未压缩大小: ${result.original.kb} KB`);

  // 检查未压缩大小
  const originalSizeKB = result.original.bytes / 1024;
  if (originalSizeKB > MAX_SIZE_KB) {
    console.log(`${colors.red}❌ 未压缩大小超过限制 (${MAX_SIZE_KB} KB)${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ 未压缩大小符合要求 (< ${MAX_SIZE_KB} KB)${colors.reset}`);
  }

  // 显示 Gzip 压缩信息
  console.log(`\n🗜️  Gzip 压缩后: ${result.gzip.kb} KB`);
  console.log(`📊 压缩率: ${result.gzipRatio}%`);

  // 检查 Gzip 压缩后大小
  const gzipSizeKB = result.gzip.bytes / 1024;
  if (gzipSizeKB > MAX_GZIP_SIZE_KB) {
    console.log(`${colors.red}❌ 压缩后大小超过限制 (${MAX_GZIP_SIZE_KB} KB)${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✅ 压缩后大小符合要求 (< ${MAX_GZIP_SIZE_KB} KB)${colors.reset}`);
  }

  // 显示 Brotli 压缩信息
  console.log(`\n🗜️  Brotli 压缩后: ${result.brotli.kb} KB`);
  console.log(`📊 压缩率: ${result.brotliRatio}%`);

  // 总结
  console.log(`\n${colors.green}✅ 所有文件大小检查通过！${colors.reset}`);
  console.log(`\n📋 总结:`);
  console.log(`   未压缩: ${result.original.kb} KB / ${MAX_SIZE_KB} KB`);
  console.log(`   Gzip:   ${result.gzip.kb} KB / ${MAX_GZIP_SIZE_KB} KB`);
  console.log(`   Brotli: ${result.brotli.kb} KB`);
}

// 运行检查
try {
  checkBundleSize();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${colors.red}❌ 错误: ${message}${colors.reset}`);
  process.exit(1);
}
