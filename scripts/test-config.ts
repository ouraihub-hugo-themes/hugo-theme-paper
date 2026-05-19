/**
 * 测试配置读取工具
 */

import { loadConfig, getDefaultConfig } from "./shiki-config";

async function main() {
  console.log("=== 测试 Shiki 配置读取工具 ===\n");

  // 测试默认配置
  console.log("1. 获取默认配置:");
  const defaultConfig = getDefaultConfig();
  console.log(JSON.stringify(defaultConfig, null, 2));
  console.log("\n");

  // 测试加载配置
  try {
    console.log("2. 从 params.toml 加载配置:");
    const config = loadConfig();
    console.log(JSON.stringify(config, null, 2));
    console.log("\n");

    console.log("✅ 配置加载成功！");
  } catch (error) {
    console.error("❌ 配置加载失败:");
    console.error(error);
    process.exit(1);
  }
}

main();
