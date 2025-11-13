#!/usr/bin/env node

/**
 * Generate Themed Chroma Styles
 * 
 * 此脚本自动处理 Chroma 样式文件：
 * 1. 读取 chroma-dark.css
 * 2. 为所有样式添加 html[data-theme="dark"] 前缀
 * 3. 生成 chroma-dark-themed.css
 * 
 * 使用方法：
 * pnpm chroma:generate
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ASSETS_DIR = join(__dirname, "../assets/css");
const INPUT_FILE = join(ASSETS_DIR, "chroma-dark.css");
const OUTPUT_FILE = join(ASSETS_DIR, "chroma-dark-themed.css");

/**
 * 为 CSS 规则添加主题前缀
 */
function addThemePrefix(css: string): string {
  const lines = css.split("\n");
  const result: string[] = [];

  // 添加文件头注释
  result.push("/**");
  result.push(" * Themed Chroma Dark Styles");
  result.push(" * ");
  result.push(" * 此文件由 scripts/generate-chroma-themed.ts 自动生成");
  result.push(" * 源文件: assets/css/chroma-dark.css");
  result.push(" * ");
  result.push(" * ⚠️ 不要手动编辑此文件！");
  result.push(
    " * 如需修改，请编辑 chroma-dark.css 然后运行: pnpm chroma:generate"
  );
  result.push(" */");
  result.push("");

  for (const line of lines) {
    const trimmed = line.trim();

    // 跳过注释行
    if (trimmed.startsWith("/*") || trimmed.endsWith("*/")) {
      result.push(line);
      continue;
    }

    // 跳过空行
    if (trimmed === "") {
      result.push(line);
      continue;
    }

    // 检查是否是 CSS 选择器行（包含 { 但不是属性行）
    // 属性行通常包含 : 或 ;
    if (trimmed.includes("{") && !trimmed.includes(":")) {
      // 提取选择器和剩余部分
      const parts = line.split("{");
      if (parts.length >= 2) {
        const indent = line.match(/^(\s*)/)?.[1] || "";
        const selector = parts[0].trim();
        const rest = parts.slice(1).join("{");
        
        // 添加主题前缀
        const themedSelector = `html[data-theme="dark"] ${selector}`;
        result.push(`${indent}${themedSelector} {${rest}`);
        continue;
      }
    }

    // 其他行保持不变
    result.push(line);
  }

  return result.join("\n");
}

/**
 * 主函数
 */
function main(): void {
  try {
    console.log("🎨 Generating themed Chroma styles...");
    console.log(`📖 Reading: ${INPUT_FILE}`);

    // 读取源文件
    const css = readFileSync(INPUT_FILE, "utf-8");

    // 添加主题前缀
    const themedCss = addThemePrefix(css);

    // 写入输出文件
    console.log(`✍️  Writing: ${OUTPUT_FILE}`);
    writeFileSync(OUTPUT_FILE, themedCss, "utf-8");

    console.log("✅ Done! Themed Chroma styles generated successfully.");
    console.log("");
    console.log("📝 Next steps:");
    console.log("   1. Import chroma-dark-themed.css in main.css");
    console.log("   2. Run: pnpm css:build");
  } catch (error) {
    console.error("❌ Error:", (error as Error).message);
    process.exit(1);
  }
}

main();
