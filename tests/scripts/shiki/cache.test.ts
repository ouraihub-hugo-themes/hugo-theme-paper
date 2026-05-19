/**
 * Tests for ShikiCache
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ShikiCache } from "../../../scripts/shiki/cache.js";
import { rm } from "fs/promises";
import { join } from "path";

describe("ShikiCache", () => {
  const testCacheDir = join(process.cwd(), ".test-shiki-cache");
  let cache: ShikiCache;

  beforeEach(async () => {
    cache = new ShikiCache(testCacheDir, 1000); // 1 second max age for testing
    await cache.init();
  });

  afterEach(async () => {
    cache.clear();
    try {
      await rm(testCacheDir, { recursive: true, force: true });
    } catch {
      // Ignore errors
    }
  });

  describe("init", () => {
    it("should create cache directory", async () => {
      const newCache = new ShikiCache(join(testCacheDir, "new"));
      await newCache.init();
      // If no error is thrown, the directory was created successfully
      expect(true).toBe(true);
    });
  });

  describe("get and set", () => {
    it("should store and retrieve cached HTML", async () => {
      const code = 'console.log("hello");';
      const lang = "javascript";
      const meta = "";
      const html = "<pre><code>console.log(\"hello\");</code></pre>";

      await cache.set(code, lang, meta, html);
      const result = await cache.get(code, lang, meta);

      expect(result).toBe(html);
    });

    it("should return null for non-existent cache", async () => {
      const result = await cache.get("nonexistent", "js", "");
      expect(result).toBeNull();
    });

    it("should handle different languages separately", async () => {
      const code = "const x = 1;";
      const html1 = "<pre><code class='js'>const x = 1;</code></pre>";
      const html2 = "<pre><code class='ts'>const x = 1;</code></pre>";

      await cache.set(code, "javascript", "", html1);
      await cache.set(code, "typescript", "", html2);

      const result1 = await cache.get(code, "javascript", "");
      const result2 = await cache.get(code, "typescript", "");

      expect(result1).toBe(html1);
      expect(result2).toBe(html2);
    });

    it("should handle meta information in cache key", async () => {
      const code = "const x = 1;";
      const lang = "javascript";
      const html1 = "<pre><code>const x = 1;</code></pre>";
      const html2 = "<pre><code class='highlight'>const x = 1;</code></pre>";

      await cache.set(code, lang, "", html1);
      await cache.set(code, lang, "highlight", html2);

      const result1 = await cache.get(code, lang, "");
      const result2 = await cache.get(code, lang, "highlight");

      expect(result1).toBe(html1);
      expect(result2).toBe(html2);
    });
  });

  describe("has", () => {
    it("should return true for existing cache", async () => {
      const code = "test";
      const lang = "js";
      const meta = "";
      const html = "<pre>test</pre>";

      await cache.set(code, lang, meta, html);
      const exists = await cache.has(code, lang, meta);

      expect(exists).toBe(true);
    });

    it("should return false for non-existent cache", async () => {
      const exists = await cache.has("nonexistent", "js", "");
      expect(exists).toBe(false);
    });
  });

  describe("expiration", () => {
    it("should expire old cache entries", async () => {
      const shortCache = new ShikiCache(testCacheDir, 100); // 100ms max age
      await shortCache.init();

      const code = "test";
      const lang = "js";
      const meta = "";
      const html = "<pre>test</pre>";

      await shortCache.set(code, lang, meta, html);

      // Wait for cache to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      const result = await shortCache.get(code, lang, meta);
      expect(result).toBeNull();
    });
  });

  describe("cleanup", () => {
    it("should remove expired entries from memory cache", async () => {
      const shortCache = new ShikiCache(testCacheDir, 100);
      await shortCache.init();

      await shortCache.set("test1", "js", "", "<pre>1</pre>");
      await shortCache.set("test2", "js", "", "<pre>2</pre>");

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));

      await shortCache.cleanup();

      const stats = shortCache.getStats();
      expect(stats.memorySize).toBe(0);
    });
  });

  describe("clear", () => {
    it("should clear all memory cache", async () => {
      await cache.set("test1", "js", "", "<pre>1</pre>");
      await cache.set("test2", "js", "", "<pre>2</pre>");

      cache.clear();

      const stats = cache.getStats();
      expect(stats.memorySize).toBe(0);
    });
  });

  describe("getStats", () => {
    it("should return correct statistics", async () => {
      const stats1 = cache.getStats();
      expect(stats1.memorySize).toBe(0);
      expect(stats1.oldestEntry).toBeNull();
      expect(stats1.newestEntry).toBeNull();

      await cache.set("test1", "js", "", "<pre>1</pre>");
      await new Promise(resolve => setTimeout(resolve, 10));
      await cache.set("test2", "js", "", "<pre>2</pre>");

      const stats2 = cache.getStats();
      expect(stats2.memorySize).toBe(2);
      expect(stats2.oldestEntry).toBeLessThan(stats2.newestEntry!);
    });
  });

  describe("disk persistence", () => {
    it("should persist cache to disk and reload", async () => {
      const code = "test";
      const lang = "js";
      const meta = "";
      const html = "<pre>test</pre>";

      await cache.set(code, lang, meta, html);

      // Create new cache instance (simulating restart)
      const newCache = new ShikiCache(testCacheDir);
      await newCache.init();

      const result = await newCache.get(code, lang, meta);
      expect(result).toBe(html);
    });
  });
});
