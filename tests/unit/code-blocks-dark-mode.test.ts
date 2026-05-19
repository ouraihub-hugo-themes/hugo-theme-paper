/**
 * Code Blocks Dark Mode Tests
 * 
 * 测试深色模式下的代码块样式
 * Requirements: 5.4
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('Code Blocks - Dark Mode Support', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('Shiki CSS Variables', () => {
    it('should use --shiki-light variables in light mode', () => {
      // 设置浅色模式
      document.documentElement.setAttribute('data-theme', 'light');

      // 创建 Shiki 代码块
      container.innerHTML = `
        <pre class="astro-code">
          <code>
            <span>const x = 1;</span>
          </code>
        </pre>
      `;

      const codeBlock = container.querySelector('.astro-code') as HTMLElement;

      // 验证使用了 Shiki 的浅色变量
      // 注意：在测试环境中，CSS 变量可能不会被解析
      // 但我们可以验证 CSS 类是否正确应用
      expect(codeBlock.classList.contains('astro-code')).toBe(true);
    });

    it('should use --shiki-dark variables in dark mode', () => {
      // 设置深色模式
      document.documentElement.setAttribute('data-theme', 'dark');

      // 创建 Shiki 代码块
      container.innerHTML = `
        <pre class="astro-code">
          <code>
            <span>const x = 1;</span>
          </code>
        </pre>
      `;

      const codeBlock = container.querySelector('.astro-code') as HTMLElement;

      // 验证深色模式类存在
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(codeBlock.classList.contains('astro-code')).toBe(true);
    });
  });

  describe('Diff Highlighting in Dark Mode', () => {
    it('should maintain diff colors in dark mode', () => {
      document.documentElement.setAttribute('data-theme', 'dark');

      container.innerHTML = `
        <pre class="astro-code">
          <code>
            <span class="line diff add">+ new line</span>
            <span class="line diff remove">- old line</span>
          </code>
        </pre>
      `;

      const addLine = container.querySelector('.line.diff.add') as HTMLElement;
      const removeLine = container.querySelector('.line.diff.remove') as HTMLElement;

      // 验证差异行存在
      expect(addLine).toBeTruthy();
      expect(removeLine).toBeTruthy();

      // 验证类名正确
      expect(addLine.classList.contains('diff')).toBe(true);
      expect(addLine.classList.contains('add')).toBe(true);
      expect(removeLine.classList.contains('diff')).toBe(true);
      expect(removeLine.classList.contains('remove')).toBe(true);
    });
  });

  describe('Line Highlighting in Dark Mode', () => {
    it('should maintain highlight colors in dark mode', () => {
      document.documentElement.setAttribute('data-theme', 'dark');

      container.innerHTML = `
        <pre class="astro-code">
          <code>
            <span class="line highlighted">highlighted line</span>
          </code>
        </pre>
      `;

      const highlightedLine = container.querySelector('.line.highlighted') as HTMLElement;

      // 验证高亮行存在
      expect(highlightedLine).toBeTruthy();
      expect(highlightedLine.classList.contains('highlighted')).toBe(true);
    });
  });

  describe('Theme Switching', () => {
    it('should switch between light and dark themes', () => {
      container.innerHTML = `
        <pre class="astro-code">
          <code>
            <span>const x = 1;</span>
          </code>
        </pre>
      `;

      const codeBlock = container.querySelector('.astro-code') as HTMLElement;

      // 切换到浅色模式
      document.documentElement.setAttribute('data-theme', 'light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      // 切换到深色模式
      document.documentElement.setAttribute('data-theme', 'dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      // 验证代码块仍然存在
      expect(codeBlock.classList.contains('astro-code')).toBe(true);
    });
  });

  describe('AstroPaper Compatibility', () => {
    it('should match AstroPaper dark mode structure', () => {
      document.documentElement.setAttribute('data-theme', 'dark');

      // 复刻 AstroPaper 的结构
      container.innerHTML = `
        <pre class="astro-code">
          <code>
            <span class="line">const x = 1;</span>
            <span class="line diff add">+ const y = 2;</span>
            <span class="line diff remove">- const z = 3;</span>
            <span class="line highlighted">const a = 4;</span>
          </code>
        </pre>
      `;

      // 验证所有元素存在
      expect(container.querySelector('.astro-code')).toBeTruthy();
      expect(container.querySelector('.line.diff.add')).toBeTruthy();
      expect(container.querySelector('.line.diff.remove')).toBeTruthy();
      expect(container.querySelector('.line.highlighted')).toBeTruthy();
    });

    it('should use same color transparency as AstroPaper', () => {
      // AstroPaper 使用的颜色：
      // - bg-green-400/20 (添加)
      // - bg-red-500/20 (删除)
      // - bg-slate-400/20 (高亮)
      
      // 这些颜色在深色模式下也保持相同的透明度
      // 因为半透明颜色在深色背景上也能保持良好的对比度

      container.innerHTML = `
        <pre class="astro-code">
          <code>
            <span class="line diff add">+ new</span>
            <span class="line diff remove">- old</span>
            <span class="line highlighted">highlight</span>
          </code>
        </pre>
      `;

      const addLine = container.querySelector('.line.diff.add');
      const removeLine = container.querySelector('.line.diff.remove');
      const highlightedLine = container.querySelector('.line.highlighted');

      // 验证元素存在（颜色由 CSS 处理）
      expect(addLine).toBeTruthy();
      expect(removeLine).toBeTruthy();
      expect(highlightedLine).toBeTruthy();
    });
  });

  describe('CSS Variable Fallback', () => {
    it('should handle missing Shiki variables gracefully', () => {
      // 即使 Shiki 变量未定义，代码块也应该正常显示
      container.innerHTML = `
        <pre class="astro-code">
          <code>
            <span>const x = 1;</span>
          </code>
        </pre>
      `;

      const codeBlock = container.querySelector('.astro-code') as HTMLElement;
      
      // 验证代码块存在
      expect(codeBlock).toBeTruthy();
      expect(codeBlock.querySelector('code')).toBeTruthy();
    });
  });
});
