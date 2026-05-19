#!/usr/bin/env node
/**
 * Shiki 构建脚本
 * 
 * 扫描 Markdown 文件，提取代码块，使用 Shiki 处理，并缓存结果
 */

import { writeFile, mkdir, readFile, stat } from "fs/promises";
import { join, dirname, relative } from "path";
import { existsSync } from "fs";
import { ShikiProcessor } from "./processor.js";
import { ShikiCache } from "./cache.js";
import { MarkdownScanner } from "./markdown-scanner.js";
import { configValidator } from "./config-validator.js";
import type { ShikiConfig, CodeBlock } from "./types.js";

interface BuildOptions {
  contentDir?: string;
  outputDir?: string;
  cacheDir?: string;
  configFile?: string;
  incremental?: boolean;
  parallel?: boolean;
  concurrency?: number;
  verbose?: boolean;
}

interface BuildStats {
  totalFiles: number;
  totalBlocks: number;
  processedBlocks: number;
  cachedBlocks: number;
  failedBlocks: number;
  skippedFiles: number;
  startTime: number;
  endTime: number;
}

interface BuildTimeRecord {
  lastBuildTime: number;
  version: string;
}

export class ShikiBuild {
  private options: Required<BuildOptions>;
  private processor: ShikiProcessor | null = null;
  private cache: ShikiCache | null = null;
  private scanner: MarkdownScanner | null = null;
  private stats: BuildStats;
  private buildTimeFile: string;

  constructor(options: BuildOptions = {}) {
    // 智能检测路径：如果在主题目录运行，自动使用 exampleSite
    const isThemeDir = existsSync("exampleSite");
    const defaultContentDir = isThemeDir ? "exampleSite/content" : "content";
    const defaultOutputDir = isThemeDir ? "exampleSite/.shiki-output" : ".shiki-output";
    const defaultCacheDir = isThemeDir ? "exampleSite/.shiki-cache" : ".shiki-cache";
    
    this.options = {
      contentDir: options.contentDir || defaultContentDir,
      outputDir: options.outputDir || defaultOutputDir,
      cacheDir: options.cacheDir || defaultCacheDir,
      configFile: options.configFile || "params.toml",
      incremental: options.incremental ?? true,
      parallel: options.parallel ?? true,
      concurrency: options.concurrency || 4,
      verbose: options.verbose ?? false,
    };

    this.stats = {
      totalFiles: 0,
      totalBlocks: 0,
      processedBlocks: 0,
      cachedBlocks: 0,
      failedBlocks: 0,
      skippedFiles: 0,
      startTime: 0,
      endTime: 0,
    };

    this.buildTimeFile = join(this.options.cacheDir, "build-time.json");
  }

  /**
   * 读取上次构建时间
   */
  private async getLastBuildTime(): Promise<number> {
    try {
      if (!existsSync(this.buildTimeFile)) {
        return 0;
      }
      const content = await readFile(this.buildTimeFile, "utf-8");
      const record: BuildTimeRecord = JSON.parse(content);
      return record.lastBuildTime;
    } catch {
      return 0;
    }
  }

  /**
   * 保存构建时间
   */
  private async saveBuildTime(): Promise<void> {
    const record: BuildTimeRecord = {
      lastBuildTime: this.stats.startTime,
      version: "1.0.0",
    };
    await writeFile(this.buildTimeFile, JSON.stringify(record, null, 2), "utf-8");
  }

  /**
   * 检查文件是否需要处理
   */
  private async shouldProcessFile(filePath: string, lastBuildTime: number): Promise<boolean> {
    if (!this.options.incremental) {
      return true;
    }

    try {
      const stats = await stat(filePath);
      return stats.mtimeMs > lastBuildTime;
    } catch {
      // 文件不存在或无法访问，跳过
      return false;
    }
  }

  /**
   * 加载配置
   */
  private async loadConfig(): Promise<ShikiConfig> {
    // 默认配置（与 AstroPaper 一致）
    const defaultConfig = configValidator.generateDefaultConfig();

    // TODO: 从 params.toml 读取配置
    // 这需要 TOML 解析器，可以在后续实现

    // 验证配置
    const validationResult = configValidator.validate(defaultConfig);
    
    if (!validationResult.valid) {
      console.error("\n❌ Configuration validation failed!\n");
      configValidator.printValidationResult(validationResult);
      throw new Error("Invalid Shiki configuration");
    }

    // 显示警告（如果有）
    if (validationResult.warnings.length > 0) {
      configValidator.printValidationResult(validationResult);
    }

    return defaultConfig;
  }

  /**
   * 初始化
   */
  async init(): Promise<void> {
    this.log("Initializing Shiki build...");

    // 加载配置
    const config = await this.loadConfig();

    // 初始化处理器
    this.processor = new ShikiProcessor(config);
    await this.processor.init();

    // 初始化缓存
    this.cache = new ShikiCache(this.options.cacheDir);
    await this.cache.init();

    // 初始化扫描器
    this.scanner = new MarkdownScanner(this.options.contentDir);

    // 创建输出目录
    await mkdir(this.options.outputDir, { recursive: true });

    this.log("Initialization complete");
  }

  /**
   * 处理单个代码块
   */
  private async processBlock(block: CodeBlock): Promise<string | null> {
    if (!this.processor || !this.cache) {
      throw new Error("Processor or cache not initialized");
    }

    const startTime = Date.now();

    // 检查缓存
    const cached = await this.cache.get(block.code, block.lang, block.meta);
    if (cached) {
      this.stats.cachedBlocks++;
      const duration = Date.now() - startTime;
      this.log(`✓ Cache hit: ${block.file}:${block.line} (${duration}ms)`, true);
      return cached;
    }

    // 处理代码块
    const result = await this.processor.processCodeBlock(block);

    const duration = Date.now() - startTime;

    if (result.error) {
      this.stats.failedBlocks++;
      console.error(
        `✗ Failed to process ${block.file}:${block.line} (${duration}ms):`,
        result.error.message
      );
      return null;
    }

    // 保存到缓存
    await this.cache.set(block.code, block.lang, block.meta, result.html);
    this.stats.processedBlocks++;
    this.log(`✓ Processed: ${block.file}:${block.line} [${block.lang}] (${duration}ms)`, true);

    return result.html;
  }

  /**
   * 处理文件的所有代码块
   */
  private async processFile(
    filePath: string,
    blocks: CodeBlock[]
  ): Promise<void> {
    const startTime = Date.now();
    const relativePath = relative(this.options.contentDir, filePath);
    
    this.log(`📄 Processing ${relativePath} (${blocks.length} blocks)`);

    const results: Array<{ block: CodeBlock; html: string | null }> = [];

    if (this.options.parallel) {
      // 并行处理
      const htmlResults = await Promise.all(
        blocks.map(block => this.processBlock(block))
      );
      for (let i = 0; i < blocks.length; i++) {
        results.push({ block: blocks[i], html: htmlResults[i] });
      }
    } else {
      // 串行处理
      for (const block of blocks) {
        const html = await this.processBlock(block);
        results.push({ block, html });
      }
    }

    // 保存结果到输出目录
    await this.saveResults(filePath, results);

    const duration = Date.now() - startTime;
    const successCount = results.filter(r => r.html !== null).length;
    const failCount = results.length - successCount;
    
    this.log(
      `✓ Completed ${relativePath}: ${successCount} success, ${failCount} failed (${duration}ms)`
    );
  }

  /**
   * 保存处理结果
   */
  private async saveResults(
    filePath: string,
    results: Array<{ block: CodeBlock; html: string | null }>
  ): Promise<void> {
    const relativePath = relative(this.options.contentDir, filePath);
    const outputPath = join(
      this.options.outputDir,
      relativePath.replace(/\.md$/, ".json")
    );

    // 创建输出目录
    await mkdir(dirname(outputPath), { recursive: true });

    // 保存为 JSON
    const output = results.map((r, index) => ({
      index,
      lang: r.block.lang,
      meta: r.block.meta,
      line: r.block.line,
      html: r.html,
      success: r.html !== null,
    }));

    await writeFile(outputPath, JSON.stringify(output, null, 2), "utf-8");
  }

  /**
   * 运行构建
   */
  async run(): Promise<void> {
    console.log("[Shiki] Starting build...");
    this.stats.startTime = Date.now();

    await this.init();

    if (!this.scanner) {
      throw new Error("Scanner not initialized");
    }

    // 获取上次构建时间（用于增量构建）
    const lastBuildTime = await this.getLastBuildTime();
    
    if (this.options.incremental && lastBuildTime > 0) {
      this.log(`Incremental build enabled (last build: ${new Date(lastBuildTime).toISOString()})`);
    }

    this.log("Scanning markdown files...");

    // 扫描并提取代码块
    const fileBlocks = await this.scanner.scanAndExtract();

    this.stats.totalFiles = fileBlocks.size;
    this.stats.totalBlocks = Array.from(fileBlocks.values()).reduce(
      (sum, blocks) => sum + blocks.length,
      0
    );

    this.log(
      `Found ${this.stats.totalFiles} files with ${this.stats.totalBlocks} code blocks`
    );

    // 处理每个文件
    let processedFiles = 0;
    const filesToProcess = Array.from(fileBlocks.entries());
    
    console.log("\n" + "─".repeat(60));
    console.log("Processing files...");
    console.log("─".repeat(60) + "\n");

    for (const [filePath, blocks] of filesToProcess) {
      // 检查是否需要处理此文件（增量构建）
      const shouldProcess = await this.shouldProcessFile(filePath, lastBuildTime);
      
      if (!shouldProcess) {
        this.stats.skippedFiles++;
        const relativePath = relative(this.options.contentDir, filePath);
        this.log(`⊘ Skipping unchanged: ${relativePath}`, true);
        continue;
      }

      await this.processFile(filePath, blocks);
      processedFiles++;

      // 显示进度条
      const progress = ((processedFiles / this.stats.totalFiles) * 100).toFixed(1);
      const progressBar = this.createProgressBar(
        processedFiles,
        this.stats.totalFiles,
        30
      );
      
      console.log(
        `\n${progressBar} ${progress}% (${processedFiles}/${this.stats.totalFiles})`
      );
      console.log(
        `Processed: ${this.stats.processedBlocks}, ` +
        `Cached: ${this.stats.cachedBlocks}, ` +
        `Failed: ${this.stats.failedBlocks}`
      );
    }

    console.log("\n" + "─".repeat(60) + "\n");

    this.stats.endTime = Date.now();

    // 保存构建时间
    await this.saveBuildTime();

    // 显示统计信息
    this.printStats();
  }

  /**
   * 打印统计信息
   */
  private printStats(): void {
    const duration = ((this.stats.endTime - this.stats.startTime) / 1000).toFixed(
      2
    );

    console.log("\n" + "=".repeat(60));
    console.log("Shiki Build Complete");
    console.log("=".repeat(60));
    console.log(`Total files:       ${this.stats.totalFiles}`);
    console.log(`Skipped files:     ${this.stats.skippedFiles}`);
    console.log(`Total blocks:      ${this.stats.totalBlocks}`);
    console.log(`Processed blocks:  ${this.stats.processedBlocks}`);
    console.log(`Cached blocks:     ${this.stats.cachedBlocks}`);
    console.log(`Failed blocks:     ${this.stats.failedBlocks}`);
    console.log(`Duration:          ${duration}s`);

    if (this.stats.totalBlocks > 0) {
      const avgTime = (
        (this.stats.endTime - this.stats.startTime) /
        this.stats.totalBlocks
      ).toFixed(2);
      console.log(`Avg time/block:    ${avgTime}ms`);
    }

    // 显示增量构建效率
    if (this.options.incremental && this.stats.skippedFiles > 0) {
      const skipRate = ((this.stats.skippedFiles / this.stats.totalFiles) * 100).toFixed(1);
      console.log(`Skip rate:         ${skipRate}% (incremental build)`);
    }

    console.log("=".repeat(60) + "\n");
  }

  /**
   * 创建进度条
   */
  private createProgressBar(current: number, total: number, width: number = 30): string {
    const percentage = current / total;
    const filled = Math.floor(percentage * width);
    const empty = width - filled;
    
    const filledBar = "█".repeat(filled);
    const emptyBar = "░".repeat(empty);
    
    return `[${filledBar}${emptyBar}]`;
  }

  /**
   * 日志输出
   */
  private log(message: string, verbose: boolean = false): void {
    if (verbose && !this.options.verbose) {
      return;
    }
    console.log(`[Shiki] ${message}`);
  }
}

// CLI 入口
async function main() {
  console.log("[Shiki] CLI started");
  console.log("[Shiki] Arguments:", process.argv);
  
  // 解析命令行参数
  const args = process.argv.slice(2);
  const options: BuildOptions = {
    verbose: args.includes("--verbose"),
    parallel: !args.includes("--no-parallel"),
    incremental: !args.includes("--no-incremental"),
  };

  // 查找 --content-dir 参数
  const contentDirIndex = args.indexOf("--content-dir");
  if (contentDirIndex !== -1 && args[contentDirIndex + 1]) {
    options.contentDir = args[contentDirIndex + 1];
  }

  console.log("[Shiki] Options:", options);

  const build = new ShikiBuild(options);

  try {
    await build.run();
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
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
