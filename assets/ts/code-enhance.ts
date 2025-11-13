/**
 * Code Enhancement Module
 * 代码块增强功能，处理差异标记、行高亮、复制功能等
 *
 * 参考: astro-paper/src/styles/typography.css 的 Shiki transformers 样式
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 9.1, 9.2, 9.3, 9.4
 */

/**
 * 代码块增强器类
 * 负责处理代码块的客户端增强功能
 */
export class CodeEnhancer {
  private showDiff: boolean;
  private showHighlight: boolean;

  /**
   * 构造函数
   * @param showDiff - 是否显示差异标记
   * @param showHighlight - 是否显示行高亮
   */
  constructor(showDiff: boolean = true, showHighlight: boolean = true) {
    this.showDiff = showDiff;
    this.showHighlight = showHighlight;
  }

  /**
   * 初始化所有代码块增强功能
   */
  init(): void {
    // 处理所有代码块
    this.enhanceAllCodeBlocks();

    // 初始化复制按钮
    this.initCopyButtons();
  }

  /**
   * 增强所有代码块
   */
  private enhanceAllCodeBlocks(): void {
    // 查找所有 pre 元素（包括 Shiki 和 Basic 模式）
    const codeBlocks = document.querySelectorAll("pre");

    codeBlocks.forEach((block) => {
      this.enhanceCodeBlock(block as HTMLPreElement);
    });
  }

  /**
   * 增强单个代码块
   * 处理差异标记和行高亮
   */
  private enhanceCodeBlock(block: HTMLPreElement): void {
    const code = block.querySelector("code");
    if (!code) return;

    // 检查是否已经被 Shiki 处理过（有 .astro-code 类）
    const isShikiProcessed = block.classList.contains("astro-code");

    if (isShikiProcessed) {
      // Shiki 已经处理过，不需要客户端处理
      return;
    }

    // Basic 模式：需要客户端处理差异标记和高亮
    if (this.showDiff || this.showHighlight) {
      this.processBasicModeMarkers(code);
    }
  }

  /**
   * 处理 Basic 模式的标记
   * 在客户端解析和应用差异标记、行高亮
   */
  private processBasicModeMarkers(code: HTMLElement): void {
    const lines = code.innerHTML.split("\n");
    const processedLines: string[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // 检查删除标记: /* [!code --] */ 或 // [!code --]
      const removeMatch = line.match(
        /(?:\/\*\s*\[!code\s+--(?::(\d+))?\]\s*\*\/|\/\/\s*\[!code\s+--(?::(\d+))?\])/,
      );
      if (removeMatch && this.showDiff) {
        const count = parseInt(removeMatch[1] || removeMatch[2] || "1");
        i++; // 跳过标记行

        for (let j = 0; j < count && i < lines.length; j++, i++) {
          processedLines.push(
            `<span class="line diff remove">${lines[i]}</span>`,
          );
        }
        continue;
      }

      // 检查添加标记: /* [!code ++] */ 或 // [!code ++]
      const addMatch = line.match(
        /(?:\/\*\s*\[!code\s+\+\+(?::(\d+))?\]\s*\*\/|\/\/\s*\[!code\s+\+\+(?::(\d+))?\])/,
      );
      if (addMatch && this.showDiff) {
        const count = parseInt(addMatch[1] || addMatch[2] || "1");
        i++; // 跳过标记行

        for (let j = 0; j < count && i < lines.length; j++, i++) {
          processedLines.push(`<span class="line diff add">${lines[i]}</span>`);
        }
        continue;
      }

      // 检查高亮标记: // [!code hl] 或 /* [!code hl] */
      const hlMatch = line.match(
        /(?:\/\/\s*\[!code\s+hl(?::(\d+))?\]|\/\*\s*\[!code\s+hl(?::(\d+))?\]\s*\*\/)/,
      );
      if (hlMatch && this.showHighlight) {
        const count = parseInt(hlMatch[1] || hlMatch[2] || "1");
        i++; // 跳过标记行

        for (let j = 0; j < count && i < lines.length; j++, i++) {
          processedLines.push(
            `<span class="line highlighted">${lines[i]}</span>`,
          );
        }
        continue;
      }

      // 普通行
      processedLines.push(line);
      i++;
    }

    // 更新代码块内容
    code.innerHTML = processedLines.join("\n");
  }

  /**
   * 初始化所有复制按钮
   * Requirements: 9.1, 9.2, 9.3, 9.4
   */
  private initCopyButtons(): void {
    const copyButtons = document.querySelectorAll(".copy-code");

    copyButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        await this.handleCopyClick(btn);
      });
    });
  }

  /**
   * 处理复制按钮点击事件
   * Requirements: 9.1, 9.2, 9.3, 9.4
   */
  private async handleCopyClick(button: HTMLButtonElement): Promise<void> {
    // 查找对应的代码块
    const codeBlock = button.closest("div")?.querySelector("code");
    if (!codeBlock) return;

    // 获取清理后的代码（移除差异标记）
    const cleanCode = this.getCleanCode(codeBlock);

    try {
      // 复制到剪贴板
      await navigator.clipboard.writeText(cleanCode);

      // 显示成功反馈
      this.showCopyFeedback(button, true);
    } catch (err) {
      console.error("Failed to copy code:", err);
      this.showCopyFeedback(button, false);
    }
  }

  /**
   * 获取清理后的代码
   * 移除差异标记和高亮标记
   * Requirements: 9.4
   */
  private getCleanCode(code: HTMLElement): string {
    // 获取文本内容
    let text = code.textContent || "";

    // 移除差异标记注释
    text = text
      .replace(/\/\*\s*\[!code\s+[^\]]+\]\s*\*\//g, "")
      .replace(/\/\/\s*\[!code\s+[^\]]+\]/g, "");

    // 移除多余的空行
    text = text.replace(/\n{3,}/g, "\n\n");

    return text.trim();
  }

  /**
   * 显示复制反馈
   * Requirements: 9.3
   */
  private showCopyFeedback(button: HTMLButtonElement, success: boolean): void {
    const originalText = button.innerHTML;
    const feedbackText = success ? "Copied" : "Failed";

    // 更新按钮文本
    button.innerHTML = feedbackText;

    // 添加视觉反馈类
    if (success) {
      button.classList.add("copied");
    }

    // 2 秒后恢复
    setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove("copied");
    }, 2000);
  }
}
