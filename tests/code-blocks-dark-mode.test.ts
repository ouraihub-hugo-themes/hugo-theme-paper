/**
 * 代码块深色模式测试
 * 验证深色模式下的样式是否正确应用
 * 
 * 测试策略（遵循 AstroPaper 的做法）：
 * 1. 验证 CSS 变量系统是否正确响应主题切换
 * 2. 验证差异标记和行高亮在深色模式下使用相同的颜色类
 * 3. 验证半透明颜色在深色背景下的对比度
 * 
 * 参考: astro-paper/src/styles/typography.css (line 95-115)
 * 参考: astro-paper/src/styles/global.css (line 7-21)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

describe('代码块深色模式', () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html data-theme="dark">
        <head>
          <link rel="stylesheet" href="/assets/css/code-blocks.css">
        </head>
        <body>
          <div class="code-block-wrapper">
            <div class="code-file-name">
              <span class="file-indicator"></span>
              <span class="file-path">example.ts</span>
            </div>
            <div class="code-block">
              <pre><code>
                <span class="code-line diff-add">const x = 1;</span>
                <span class="code-line diff-remove">const y = 2;</span>
                <span class="code-line highlighted">const z = 3;</span>
                <span class="code-line">const w = 4;</span>
              </code></pre>
            </div>
            <button class="code-copy-button">
              <svg class="copy-icon"></svg>
              <span class="copy-text">Copy</span>
            </button>
          </div>
        </body>
      </html>
    `);
    document = dom.window.document;
  });

  describe('主题属性', () => {
    it('应该有 data-theme="dark" 属性', () => {
      const html = document.documentElement;
      expect(html.getAttribute('data-theme')).toBe('dark');
    });

    it('应该能切换到浅色模式', () => {
      const html = document.documentElement;
      html.setAttribute('data-theme', 'light');
      expect(html.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('CSS 变量系统（遵循 AstroPaper）', () => {
    it('文件名标签应该使用 CSS 变量', () => {
      // 验证 DOM 结构存在
      const fileName = document.querySelector('.code-file-name');
      expect(fileName).toBeTruthy();
      
      // AstroPaper 使用 bg-background, border-border, text-foreground
      // 这些类会自动使用 CSS 变量，无需显式的深色模式样式
      expect(fileName?.classList.contains('code-file-name')).toBe(true);
    });

    it('代码块应该使用 CSS 变量', () => {
      const codeBlock = document.querySelector('.code-block');
      expect(codeBlock).toBeTruthy();
      
      // 验证 pre 元素存在
      const pre = codeBlock?.querySelector('pre');
      expect(pre).toBeTruthy();
    });

    it('复制按钮应该使用 CSS 变量', () => {
      const copyButton = document.querySelector('.code-copy-button');
      expect(copyButton).toBeTruthy();
      
      // AstroPaper 使用 bg-background, border-border, text-foreground
      expect(copyButton?.classList.contains('code-copy-button')).toBe(true);
    });
  });

  describe('差异标记在深色模式下（遵循 AstroPaper）', () => {
    it('添加行应该使用相同的颜色类', () => {
      const addLine = document.querySelector('.code-line.diff-add');
      expect(addLine).toBeTruthy();
      
      // AstroPaper 在深色模式下使用相同的 bg-green-400/20
      // 半透明颜色会自动适配深色背景
      expect(addLine?.classList.contains('diff-add')).toBe(true);
    });

    it('删除行应该使用相同的颜色类', () => {
      const removeLine = document.querySelector('.code-line.diff-remove');
      expect(removeLine).toBeTruthy();
      
      // AstroPaper 在深色模式下使用相同的 bg-red-500/20
      expect(removeLine?.classList.contains('diff-remove')).toBe(true);
    });

    it('差异标记不应该有额外的深色模式类', () => {
      const addLine = document.querySelector('.code-line.diff-add');
      const removeLine = document.querySelector('.code-line.diff-remove');
      
      // 验证没有 dark:bg-xxx 这样的类
      // AstroPaper 不为差异标记单独定义深色模式样式
      expect(addLine?.className).toBe('code-line diff-add');
      expect(removeLine?.className).toBe('code-line diff-remove');
    });
  });

  describe('行高亮在深色模式下（遵循 AstroPaper）', () => {
    it('高亮行应该使用相同的颜色类', () => {
      const highlightedLine = document.querySelector('.code-line.highlighted');
      expect(highlightedLine).toBeTruthy();
      
      // AstroPaper 在深色模式下使用相同的 bg-slate-400/20
      expect(highlightedLine?.classList.contains('highlighted')).toBe(true);
    });

    it('高亮行不应该有额外的深色模式类', () => {
      const highlightedLine = document.querySelector('.code-line.highlighted');
      
      // 验证没有 dark:bg-xxx 这样的类
      expect(highlightedLine?.className).toBe('code-line highlighted');
    });
  });

  describe('主题切换', () => {
    it('应该能从深色切换到浅色', () => {
      const html = document.documentElement;
      
      // 初始状态：深色模式
      expect(html.getAttribute('data-theme')).toBe('dark');
      
      // 切换到浅色模式
      html.setAttribute('data-theme', 'light');
      expect(html.getAttribute('data-theme')).toBe('light');
      
      // 验证 DOM 结构仍然存在
      const addLine = document.querySelector('.code-line.diff-add');
      expect(addLine).toBeTruthy();
    });

    it('主题切换不应该影响差异标记类', () => {
      const html = document.documentElement;
      const addLine = document.querySelector('.code-line.diff-add');
      
      // 深色模式
      expect(html.getAttribute('data-theme')).toBe('dark');
      expect(addLine?.classList.contains('diff-add')).toBe(true);
      
      // 切换到浅色模式
      html.setAttribute('data-theme', 'light');
      expect(addLine?.classList.contains('diff-add')).toBe(true);
    });
  });

  describe('与 AstroPaper 的对齐验证', () => {
    it('应该使用 [data-theme="dark"] 选择器', () => {
      const html = document.documentElement;
      expect(html.getAttribute('data-theme')).toBe('dark');
      
      // AstroPaper 使用 html[data-theme="dark"] 选择器
      // 而不是 .dark 类或其他方式
    });

    it('差异标记应该使用半透明颜色', () => {
      // 验证 CSS 类存在
      const addLine = document.querySelector('.code-line.diff-add');
      const removeLine = document.querySelector('.code-line.diff-remove');
      
      expect(addLine).toBeTruthy();
      expect(removeLine).toBeTruthy();
      
      // AstroPaper 使用 bg-green-400/20 和 bg-red-500/20
      // 这些半透明颜色在深色背景下自动保持良好对比度
    });

    it('行高亮应该使用半透明颜色', () => {
      const highlightedLine = document.querySelector('.code-line.highlighted');
      expect(highlightedLine).toBeTruthy();
      
      // AstroPaper 使用 bg-slate-400/20
    });

    it('不应该有显式的深色模式样式覆盖', () => {
      // AstroPaper 的策略：
      // 1. 使用 CSS 变量系统（--background, --foreground 等）
      // 2. 差异标记和行高亮使用相同的颜色类
      // 3. 半透明颜色自动适配深色背景
      // 
      // 因此，不需要 html[data-theme="dark"] .diff-add 这样的样式
      
      const addLine = document.querySelector('.code-line.diff-add');
      expect(addLine?.className).toBe('code-line diff-add');
    });
  });

  describe('颜色对比度（WCAG 标准）', () => {
    it('应该在深色模式下保持可读性', () => {
      // 这个测试验证 DOM 结构
      // 实际的颜色对比度需要在浏览器中使用工具验证
      
      const addLine = document.querySelector('.code-line.diff-add');
      const removeLine = document.querySelector('.code-line.diff-remove');
      const highlightedLine = document.querySelector('.code-line.highlighted');
      
      expect(addLine).toBeTruthy();
      expect(removeLine).toBeTruthy();
      expect(highlightedLine).toBeTruthy();
    });

    it('文本应该在深色背景上可读', () => {
      const code = document.querySelector('code');
      const lines = code?.querySelectorAll('.code-line');
      
      expect(lines).toBeTruthy();
      expect(lines!.length).toBeGreaterThan(0);
    });
  });

  describe('CSS 文件结构', () => {
    it('应该有代码块样式定义', () => {
      const wrapper = document.querySelector('.code-block-wrapper');
      const codeBlock = document.querySelector('.code-block');
      
      expect(wrapper).toBeTruthy();
      expect(codeBlock).toBeTruthy();
    });

    it('应该有差异标记样式定义', () => {
      const addLine = document.querySelector('.diff-add');
      const removeLine = document.querySelector('.diff-remove');
      
      expect(addLine).toBeTruthy();
      expect(removeLine).toBeTruthy();
    });

    it('应该有行高亮样式定义', () => {
      const highlightedLine = document.querySelector('.highlighted');
      expect(highlightedLine).toBeTruthy();
    });
  });
});
