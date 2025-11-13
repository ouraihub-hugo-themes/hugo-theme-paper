/**
 * Code Enhancement Module
 * 
 * Provides client-side enhancements for code blocks:
 * - Diff markers (// [!code ++] and // [!code --])
 * - Line highlighting (// [!code hl])
 * - Copy button functionality
 * - File name display
 * 
 * Requirements: 2.1-2.6, 3.1-3.4, 5.1-5.6
 */

interface CodeEnhancementConfig {
  enableDiff: boolean;
  enableHighlight: boolean;
  showCopyButton: boolean;
  showFileName: boolean;
}

interface DiffMarker {
  type: 'add' | 'remove';
  count: number;
}

interface HighlightMarker {
  count: number;
}

export class CodeEnhancer {
  private config: CodeEnhancementConfig;
  
  constructor(config: CodeEnhancementConfig) {
    this.config = config;
  }
  
  /**
   * 初始化所有代码块
   * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
   */
  init(): void {
    // 查找所有代码块包装器（由 Hugo render hook 创建）
    const wrappers = document.querySelectorAll('.code-block-wrapper');
    
    wrappers.forEach(wrapper => {
      // 不添加复制按钮，使用 main.ts 中的旧实现
      // if (this.config.showCopyButton) {
      //   const button = this.createCopyButton();
      //   wrapper.appendChild(button);
      // }
      
      // 增强代码块（处理差异标记和行高亮）
      this.enhanceCodeBlock(wrapper as HTMLElement);
    });
    
    // 不初始化复制按钮，使用 main.ts 中的旧实现
    // if (this.config.showCopyButton) {
    //   this.initCopyButtons();
    // }
  }
  
  /**
   * 创建复制按钮
   */
  private createCopyButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'code-copy-button';
    button.type = 'button';
    button.setAttribute('data-copied-text', 'Copied!');
    button.setAttribute('aria-label', 'Copy code to clipboard');
    
    button.innerHTML = `
      <svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
      <span class="copy-text">Copy</span>
    `;
    
    return button;
  }
  
  /**
   * 增强单个代码块
   */
  private enhanceCodeBlock(wrapper: HTMLElement): void {
    // 查找 pre 元素（Chroma 的容器）
    const preElement = wrapper.querySelector('pre');
    if (!preElement) return;
    
    // 将 pre 内容分割成行（保留 Chroma 的 HTML）
    const lines = this.splitPreIntoLines(preElement);
    
    // 处理差异标记和行高亮
    if (this.config.enableDiff || this.config.enableHighlight) {
      this.processMarkers(lines);
    }
    
    // 重新构建代码块
    this.rebuildPreElement(preElement, lines);
  }
  
  /**
   * 将 pre 元素分割成行（保留 HTML 标记）
   * Requirements: 2.1, 3.1
   */
  private splitPreIntoLines(preElement: HTMLElement): HTMLElement[] {
    const lines: HTMLElement[] = [];
    const codeElement = preElement.querySelector('code');
    
    if (!codeElement) return lines;
    
    // 获取 HTML 内容
    const html = codeElement.innerHTML;
    
    // 按换行符分割（保留 HTML 标记）
    const lineHtmls = html.split('\n');
    
    lineHtmls.forEach(lineHtml => {
      const lineElement = document.createElement('span');
      lineElement.className = 'code-line';
      lineElement.innerHTML = lineHtml;
      lines.push(lineElement);
    });
    
    return lines;
  }
  
  /**
   * 重新构建 pre 元素
   * Requirements: 7.1, 7.2, 7.3
   */
  private rebuildPreElement(preElement: HTMLElement, lines: HTMLElement[]): void {
    const codeElement = preElement.querySelector('code');
    if (!codeElement) return;
    
    // 使用 DocumentFragment 优化性能
    const fragment = document.createDocumentFragment();
    
    // 添加处理后的行
    lines.forEach((line, index) => {
      fragment.appendChild(line);
      
      // 添加换行符（除了最后一行）
      if (index < lines.length - 1) {
        fragment.appendChild(document.createTextNode('\n'));
      }
    });
    
    // 清空原内容并添加新内容
    codeElement.innerHTML = '';
    codeElement.appendChild(fragment);
  }
  
  /**
   * 处理差异标记和行高亮
   * Requirements: 2.5, 3.3, 3.4
   */
  private processMarkers(lines: HTMLElement[]): void {
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      const text = line.textContent || '';
      
      // 检查差异标记（优先级高于行高亮）
      const diffMarker = this.parseDiffMarker(text);
      if (diffMarker) {
        // 隐藏标记行
        line.classList.add('code-marker');
        i++;
        
        // 标记接下来的 N 行
        for (let j = 0; j < diffMarker.count && i < lines.length; j++, i++) {
          lines[i].classList.add(`diff-${diffMarker.type}`);
        }
        continue;
      }
      
      // 检查行高亮标记
      const hlMarker = this.parseHighlightMarker(text);
      if (hlMarker) {
        // 隐藏标记行
        line.classList.add('code-marker');
        i++;
        
        // 标记接下来的 N 行
        for (let j = 0; j < hlMarker.count && i < lines.length; j++, i++) {
          lines[i].classList.add('highlighted');
        }
        continue;
      }
      
      i++;
    }
  }
  
  /**
   * 解析差异标记
   * 支持格式：
   * - // [!code --]  或  /* [!code --] *\/
   * - // [!code ++]  或  /* [!code ++] *\/
   * - // [!code --:3]  (标记接下来的 3 行)
   * 
   * Requirements: 2.1, 2.2, 2.3, 2.4
   */
  private parseDiffMarker(text: string): DiffMarker | null {
    // 匹配 // [!code ++] 或 // [!code ++:3]
    const slashMatch = text.match(/\/\/\s*\[!code\s+(--|\+\+)(?::(\d+))?\]/);
    if (slashMatch) {
      return {
        type: slashMatch[1] === '++' ? 'add' : 'remove',
        count: parseInt(slashMatch[2] || '1', 10),
      };
    }
    
    // 匹配 /* [!code ++] */ 或 /* [!code ++:3] */
    const blockMatch = text.match(/\/\*\s*\[!code\s+(--|\+\+)(?::(\d+))?\]\s*\*\//);
    if (blockMatch) {
      return {
        type: blockMatch[1] === '++' ? 'add' : 'remove',
        count: parseInt(blockMatch[2] || '1', 10),
      };
    }
    
    return null;
  }
  
  /**
   * 解析行高亮标记
   * 支持格式：
   * - // [!code hl]
   * - // [!code hl:3]  (标记接下来的 3 行)
   * 
   * Requirements: 3.1, 3.2
   */
  private parseHighlightMarker(text: string): HighlightMarker | null {
    const match = text.match(/\/\/\s*\[!code\s+hl(?::(\d+))?\]/);
    if (match) {
      return {
        count: parseInt(match[1] || '1', 10),
      };
    }
    
    return null;
  }
  

  
  /**
   * 初始化复制按钮
   * Requirements: 5.1, 5.2, 5.4, 5.5
   */
  private initCopyButtons(): void {
    const buttons = document.querySelectorAll('.code-copy-button');
    
    buttons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        await this.handleCopy(btn);
      });
    });
  }
  
  /**
   * 处理复制操作
   * Requirements: 5.1, 5.2, 5.4, 5.5
   */
  private async handleCopy(button: HTMLButtonElement): Promise<void> {
    const wrapper = button.closest('.code-block-wrapper');
    const codeElement = wrapper?.querySelector('code');
    
    if (!codeElement) return;
    
    // 获取清理后的代码（移除标记）
    const code = this.getCleanCode(codeElement);
    
    try {
      await this.copyToClipboard(code);
      this.showCopyFeedback(button);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }
  
  /**
   * 获取清理后的代码（移除标记注释）
   * Requirements: 5.1, 5.2, 5.4, 5.5
   */
  private getCleanCode(codeElement: HTMLElement): string {
    const lines: string[] = [];
    const lineElements = codeElement.querySelectorAll('.code-line');
    
    lineElements.forEach(line => {
      // 跳过标记行
      if (line.classList.contains('code-marker')) {
        return;
      }
      
      const text = line.textContent || '';
      lines.push(text);
    });
    
    return lines.join('\n');
  }
  
  /**
   * 复制到剪贴板
   * Requirements: 5.2, 10.5
   */
  private async copyToClipboard(text: string): Promise<void> {
    // 优先使用 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    
    // 降级方案：使用 execCommand
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
  }
  
  /**
   * 显示复制成功反馈
   * Requirements: 5.3
   */
  private showCopyFeedback(button: HTMLButtonElement): void {
    const textElement = button.querySelector('.copy-text');
    if (!textElement) return;
    
    const originalText = textElement.textContent;
    
    // 更新按钮状态
    button.classList.add('copied');
    textElement.textContent = button.getAttribute('data-copied-text') || 'Copied!';
    
    // 2秒后恢复
    setTimeout(() => {
      button.classList.remove('copied');
      textElement.textContent = originalText;
    }, 2000);
  }
}

/**
 * 初始化代码增强
 */
function initCodeEnhancement(): void {
  // 从 HTML 数据属性读取配置
  const config: CodeEnhancementConfig = {
    enableDiff: document.documentElement.dataset.codeDiff !== 'false',
    enableHighlight: document.documentElement.dataset.codeHighlight !== 'false',
    showCopyButton: document.documentElement.dataset.codeCopy !== 'false',
    showFileName: document.documentElement.dataset.codeFileName !== 'false',
  };
  
  const enhancer = new CodeEnhancer(config);
  enhancer.init();
}

// 在 DOM 加载完成后初始化
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeEnhancement);
  } else {
    initCodeEnhancement();
  }
}
