/**
 * Shiki 语言支持检测工具
 * 
 * 提供语言支持检测、别名解析和建议功能
 */

import { bundledLanguages } from "shiki";

/**
 * 语言信息接口
 */
export interface LanguageInfo {
  id: string;
  name: string;
  aliases: string[];
  supported: boolean;
}

/**
 * 语言支持检测器
 */
export class LanguageSupport {
  private supportedLanguages: Map<string, LanguageInfo>;
  private aliasMap: Map<string, string>;

  constructor() {
    this.supportedLanguages = new Map();
    this.aliasMap = new Map();
    this.init();
  }

  /**
   * 初始化语言列表和别名映射
   */
  private init(): void {
    // 从 Shiki 获取支持的语言
    const languages = Object.keys(bundledLanguages);

    for (const id of languages) {
      // bundledLanguages 只提供语言 ID，别名信息需要动态加载
      // 这里我们只使用 ID，别名通过自定义映射添加
      const info: LanguageInfo = {
        id,
        name: id, // 使用 ID 作为名称
        aliases: [],
        supported: true,
      };

      this.supportedLanguages.set(id, info);

      // 建立别名映射
      this.aliasMap.set(id, id);
      this.aliasMap.set(id.toLowerCase(), id);
    }

    // 添加常见的自定义别名
    const customAliases: Record<string, string> = {
      "js": "javascript",
      "ts": "typescript",
      "py": "python",
      "rb": "ruby",
      "sh": "bash",
      "shell": "bash",
      "yml": "yaml",
      "md": "markdown",
      "": "plaintext",
      "text": "plaintext",
    };

    for (const [alias, target] of Object.entries(customAliases)) {
      if (this.supportedLanguages.has(target)) {
        this.aliasMap.set(alias.toLowerCase(), target);
      }
    }
  }

  /**
   * 检查语言是否被支持
   */
  isSupported(lang: string): boolean {
    const normalized = lang.toLowerCase().trim();
    return this.aliasMap.has(normalized);
  }

  /**
   * 解析语言别名到标准 ID
   */
  resolve(lang: string): string | null {
    const normalized = lang.toLowerCase().trim();
    return this.aliasMap.get(normalized) || null;
  }

  /**
   * 获取语言信息
   */
  getLanguageInfo(lang: string): LanguageInfo | null {
    const resolved = this.resolve(lang);
    if (!resolved) return null;
    return this.supportedLanguages.get(resolved) || null;
  }

  /**
   * 获取所有支持的语言列表
   */
  getAllLanguages(): LanguageInfo[] {
    return Array.from(this.supportedLanguages.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  /**
   * 获取所有语言 ID
   */
  getAllLanguageIds(): string[] {
    return Array.from(this.supportedLanguages.keys()).sort();
  }

  /**
   * 搜索相似的语言（用于建议）
   */
  findSimilar(lang: string, maxResults: number = 5): LanguageInfo[] {
    const normalized = lang.toLowerCase().trim();
    const results: Array<{ info: LanguageInfo; score: number }> = [];

    for (const info of this.supportedLanguages.values()) {
      let score = 0;

      // 检查 ID 匹配
      if (info.id.includes(normalized)) {
        score += 10;
      }

      // 检查名称匹配
      if (info.name.toLowerCase().includes(normalized)) {
        score += 8;
      }

      // 检查别名匹配
      for (const alias of info.aliases) {
        if (alias.toLowerCase().includes(normalized)) {
          score += 6;
          break;
        }
      }

      // 检查开头匹配（更高权重）
      if (info.id.startsWith(normalized)) {
        score += 15;
      }

      if (score > 0) {
        results.push({ info, score });
      }
    }

    // 按分数排序并返回
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(r => r.info);
  }

  /**
   * 获取语言建议消息
   */
  getSuggestionMessage(lang: string): string {
    const similar = this.findSimilar(lang, 3);

    if (similar.length === 0) {
      return `Language "${lang}" is not supported. Use "plaintext" as fallback.`;
    }

    const suggestions = similar
      .map(info => {
        const aliases = info.aliases.length > 0 
          ? ` (aliases: ${info.aliases.join(", ")})`
          : "";
        return `  - ${info.id}${aliases}`;
      })
      .join("\n");

    return `Language "${lang}" is not supported. Did you mean:\n${suggestions}\n\nUsing "plaintext" as fallback.`;
  }

  /**
   * 打印所有支持的语言（用于调试）
   */
  printAllLanguages(): void {
    console.log("\nSupported Languages:");
    console.log("=".repeat(60));

    const languages = this.getAllLanguages();
    
    for (const info of languages) {
      const aliases = info.aliases.length > 0
        ? ` (${info.aliases.join(", ")})`
        : "";
      console.log(`${info.id.padEnd(20)} ${info.name}${aliases}`);
    }

    console.log("=".repeat(60));
    console.log(`Total: ${languages.length} languages\n`);
  }

  /**
   * 生成语言支持文档
   */
  generateDocumentation(): string {
    const languages = this.getAllLanguages();
    
    let doc = "# Supported Languages\n\n";
    doc += `Shiki supports ${languages.length} programming languages.\n\n`;
    doc += "## Language List\n\n";
    doc += "| Language | ID | Aliases |\n";
    doc += "|----------|----|---------|\n";

    for (const info of languages) {
      const aliases = info.aliases.length > 0
        ? info.aliases.join(", ")
        : "-";
      doc += `| ${info.name} | \`${info.id}\` | ${aliases} |\n`;
    }

    doc += "\n## Usage\n\n";
    doc += "Use the language ID or any of its aliases in your code blocks:\n\n";
    doc += "````markdown\n";
    doc += "```javascript\n";
    doc += "const hello = 'world';\n";
    doc += "```\n";
    doc += "````\n\n";
    doc += "If a language is not supported, Shiki will automatically fall back to `plaintext`.\n";

    return doc;
  }
}

// 导出单例实例
export const languageSupport = new LanguageSupport();

// CLI 工具
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const support = new LanguageSupport();

  switch (command) {
    case "list":
      support.printAllLanguages();
      break;

    case "check": {
      const lang = args[1];
      if (!lang) {
        console.error("Usage: language-support check <language>");
        process.exit(1);
      }

      const isSupported = support.isSupported(lang);
      const resolved = support.resolve(lang);
      const info = support.getLanguageInfo(lang);

      console.log(`\nLanguage: ${lang}`);
      console.log(`Supported: ${isSupported ? "✓ Yes" : "✗ No"}`);
      
      if (resolved) {
        console.log(`Resolved to: ${resolved}`);
      }
      
      if (info) {
        console.log(`Name: ${info.name}`);
        if (info.aliases.length > 0) {
          console.log(`Aliases: ${info.aliases.join(", ")}`);
        }
      } else {
        console.log("\n" + support.getSuggestionMessage(lang));
      }
      
      console.log();
      break;
    }

    case "suggest": {
      const lang = args[1];
      if (!lang) {
        console.error("Usage: language-support suggest <language>");
        process.exit(1);
      }

      const similar = support.findSimilar(lang);
      
      console.log(`\nSuggestions for "${lang}":`);
      
      if (similar.length === 0) {
        console.log("No similar languages found.");
      } else {
        for (const info of similar) {
          const aliases = info.aliases.length > 0
            ? ` (${info.aliases.join(", ")})`
            : "";
          console.log(`  - ${info.id}: ${info.name}${aliases}`);
        }
      }
      
      console.log();
      break;
    }

    case "doc": {
      const doc = support.generateDocumentation();
      console.log(doc);
      break;
    }

    default:
      console.log("Shiki Language Support Tool\n");
      console.log("Commands:");
      console.log("  list              List all supported languages");
      console.log("  check <lang>      Check if a language is supported");
      console.log("  suggest <lang>    Get suggestions for similar languages");
      console.log("  doc               Generate language documentation");
      console.log();
      break;
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
