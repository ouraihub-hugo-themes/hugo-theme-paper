/**
 * Shiki 缓存系统
 * 
 * 用于缓存 Shiki 处理结果，避免重复处理相同的代码块
 */

import { createHash } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import type { CacheEntry } from "./types.js";

export class ShikiCache {
  private cacheDir: string;
  private memoryCache: Map<string, CacheEntry>;
  private maxAge: number; // 缓存有效期（毫秒）

  constructor(cacheDir: string = ".shiki-cache", maxAge: number = 3600000) {
    this.cacheDir = cacheDir;
    this.memoryCache = new Map();
    this.maxAge = maxAge; // 默认 1 小时
  }

  /**
   * 初始化缓存目录
   */
  async init(): Promise<void> {
    try {
      await mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      console.warn("Failed to create cache directory:", error);
    }
  }

  /**
   * 计算代码块的 hash
   */
  private hash(code: string, lang: string, meta: string): string {
    const content = `${lang}:${meta}:${code}`;
    return createHash("sha256").update(content).digest("hex");
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(code: string, lang: string, meta: string): string {
    return this.hash(code, lang, meta);
  }

  /**
   * 生成缓存文件路径
   */
  private getCacheFilePath(key: string): string {
    // 使用两级目录结构避免单个目录文件过多
    const subDir = key.substring(0, 2);
    return join(this.cacheDir, subDir, `${key}.json`);
  }

  /**
   * 检查缓存条目是否有效
   */
  private isValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.maxAge;
  }

  /**
   * 从内存缓存获取
   */
  private getFromMemory(key: string): string | null {
    const entry = this.memoryCache.get(key);
    if (entry && this.isValid(entry)) {
      return entry.html;
    }
    if (entry) {
      // 过期，删除
      this.memoryCache.delete(key);
    }
    return null;
  }

  /**
   * 从磁盘缓存获取
   */
  private async getFromDisk(key: string): Promise<string | null> {
    try {
      const filePath = this.getCacheFilePath(key);
      const content = await readFile(filePath, "utf-8");
      const entry: CacheEntry = JSON.parse(content);

      if (this.isValid(entry)) {
        // 加载到内存缓存
        this.memoryCache.set(key, entry);
        return entry.html;
      }
    } catch {
      // 文件不存在或读取失败
      return null;
    }

    return null;
  }

  /**
   * 获取缓存的 HTML
   */
  async get(code: string, lang: string, meta: string): Promise<string | null> {
    const key = this.getCacheKey(code, lang, meta);

    // 先从内存缓存获取
    const memoryResult = this.getFromMemory(key);
    if (memoryResult) {
      return memoryResult;
    }

    // 再从磁盘缓存获取
    const diskResult = await this.getFromDisk(key);
    return diskResult;
  }

  /**
   * 保存到缓存
   */
  async set(
    code: string,
    lang: string,
    meta: string,
    html: string
  ): Promise<void> {
    const key = this.getCacheKey(code, lang, meta);
    const entry: CacheEntry = {
      hash: key,
      html,
      timestamp: Date.now(),
    };

    // 保存到内存缓存
    this.memoryCache.set(key, entry);

    // 保存到磁盘缓存
    try {
      const filePath = this.getCacheFilePath(key);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, JSON.stringify(entry, null, 2), "utf-8");
    } catch (error) {
      console.warn("Failed to write cache file:", error);
    }
  }

  /**
   * 检查缓存是否存在且有效
   */
  async has(code: string, lang: string, meta: string): Promise<boolean> {
    const result = await this.get(code, lang, meta);
    return result !== null;
  }

  /**
   * 清除过期的缓存
   */
  async cleanup(): Promise<void> {
    // 清除内存缓存中的过期条目
    for (const [key, entry] of this.memoryCache.entries()) {
      if (!this.isValid(entry)) {
        this.memoryCache.delete(key);
      }
    }

    // TODO: 清除磁盘缓存中的过期文件
    // 这需要遍历缓存目录，可以在后续优化中实现
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.memoryCache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): {
    memorySize: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    let oldest: number | null = null;
    let newest: number | null = null;

    for (const entry of this.memoryCache.values()) {
      if (oldest === null || entry.timestamp < oldest) {
        oldest = entry.timestamp;
      }
      if (newest === null || entry.timestamp > newest) {
        newest = entry.timestamp;
      }
    }

    return {
      memorySize: this.memoryCache.size,
      oldestEntry: oldest,
      newestEntry: newest,
    };
  }
}
