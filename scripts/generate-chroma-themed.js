#!/usr/bin/env node

// scripts/generate-chroma-themed.ts
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var ASSETS_DIR = join(__dirname, "../assets/css");
var INPUT_FILE = join(ASSETS_DIR, "chroma-dark.css");
var OUTPUT_FILE = join(ASSETS_DIR, "chroma-dark-themed.css");
function addThemePrefix(css) {
  const lines = css.split("\n");
  const result = [];
  result.push("/**");
  result.push(" * Themed Chroma Dark Styles");
  result.push(" * ");
  result.push(" * \u6B64\u6587\u4EF6\u7531 scripts/generate-chroma-themed.ts \u81EA\u52A8\u751F\u6210");
  result.push(" * \u6E90\u6587\u4EF6: assets/css/chroma-dark.css");
  result.push(" * ");
  result.push(" * \u26A0\uFE0F \u4E0D\u8981\u624B\u52A8\u7F16\u8F91\u6B64\u6587\u4EF6\uFF01");
  result.push(
    " * \u5982\u9700\u4FEE\u6539\uFF0C\u8BF7\u7F16\u8F91 chroma-dark.css \u7136\u540E\u8FD0\u884C: pnpm chroma:generate"
  );
  result.push(" */");
  result.push("");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("/*") || trimmed.endsWith("*/")) {
      result.push(line);
      continue;
    }
    if (trimmed === "") {
      result.push(line);
      continue;
    }
    if (trimmed.includes("{") && !trimmed.includes(":")) {
      const parts = line.split("{");
      if (parts.length >= 2) {
        const indent = line.match(/^(\s*)/)?.[1] || "";
        const selector = parts[0].trim();
        const rest = parts.slice(1).join("{");
        const themedSelector = `html[data-theme="dark"] ${selector}`;
        result.push(`${indent}${themedSelector} {${rest}`);
        continue;
      }
    }
    result.push(line);
  }
  return result.join("\n");
}
function main() {
  try {
    console.log("\u{1F3A8} Generating themed Chroma styles...");
    console.log(`\u{1F4D6} Reading: ${INPUT_FILE}`);
    const css = readFileSync(INPUT_FILE, "utf-8");
    const themedCss = addThemePrefix(css);
    console.log(`\u270D\uFE0F  Writing: ${OUTPUT_FILE}`);
    writeFileSync(OUTPUT_FILE, themedCss, "utf-8");
    console.log("\u2705 Done! Themed Chroma styles generated successfully.");
    console.log("");
    console.log("\u{1F4DD} Next steps:");
    console.log("   1. Import chroma-dark-themed.css in main.css");
    console.log("   2. Run: pnpm css:build");
  } catch (error) {
    console.error("\u274C Error:", error.message);
    process.exit(1);
  }
}
main();
