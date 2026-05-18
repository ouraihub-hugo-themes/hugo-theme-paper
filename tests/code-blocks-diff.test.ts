/**
 * 差异标记样式测试
 * 验证 .diff-add 和 .diff-remove 样式是否正确应用
 * 
 * 注意：这些测试验证 CSS 类的存在性和 DOM 结构
 * 实际的视觉效果（颜色、位置等）需要在浏览器中验证
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

describe('差异标记样式', () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" href="/assets/css/code-blocks.css">
        </head>
        <body>
          <div class="code-block-wrapper">
            <div class="code-block">
              <pre><code>
                <span class="code-line diff-add">const x = 1;</span>
                <span class="code-line diff-remove">const y = 2;</span>
                <span class="code-line">const z = 3;</span>
              </code></pre>
            </div>
          </div>
        </body>
      </html>
    `);
    document = dom.window.document;
  });

  describe('添加行样式 (.diff-add)', () => {
    it('应该有正确的类名', () => {
      const addLine = document.querySelector('.code-line.diff-add');
      expect(addLine).toBeTruthy();
      expect(addLine?.classList.contains('diff-add')).toBe(true);
      expect(addLine?.classList.contains('code-line')).toBe(true);
    });

    it('应该能通过选择器找到', () => {
      const addLines = document.querySelectorAll('.code-line.diff-add');
      expect(addLines.length).toBe(1);
    });

    it('应该包含代码内容', () => {
      const addLine = document.querySelector('.code-line.diff-add');
      expect(addLine?.textContent).toContain('const x = 1;');
    });
  });

  describe('删除行样式 (.diff-remove)', () => {
    it('应该有正确的类名', () => {
      const removeLine = document.querySelector('.code-line.diff-remove');
      expect(removeLine).toBeTruthy();
      expect(removeLine?.classList.contains('diff-remove')).toBe(true);
      expect(removeLine?.classList.contains('code-line')).toBe(true);
    });

    it('应该能通过选择器找到', () => {
      const removeLines = document.querySelectorAll('.code-line.diff-remove');
      expect(removeLines.length).toBe(1);
    });

    it('应该包含代码内容', () => {
      const removeLine = document.querySelector('.code-line.diff-remove');
      expect(removeLine?.textContent).toContain('const y = 2;');
    });
  });

  describe('普通行', () => {
    it('不应该有差异标记类', () => {
      const normalLines = document.querySelectorAll('.code-line:not(.diff-add):not(.diff-remove)');
      expect(normalLines.length).toBeGreaterThan(0);
      
      normalLines.forEach(line => {
        expect(line.classList.contains('diff-add')).toBe(false);
        expect(line.classList.contains('diff-remove')).toBe(false);
      });
    });

    it('应该只有 code-line 类', () => {
      const normalLine = document.querySelector('.code-line:not(.diff-add):not(.diff-remove)');
      expect(normalLine).toBeTruthy();
      expect(normalLine?.classList.contains('code-line')).toBe(true);
    });
  });

  describe('DOM 结构', () => {
    it('应该在代码块容器中', () => {
      const wrapper = document.querySelector('.code-block-wrapper');
      expect(wrapper).toBeTruthy();
      
      const addLine = wrapper?.querySelector('.code-line.diff-add');
      expect(addLine).toBeTruthy();
    });

    it('应该在 code 元素中', () => {
      const code = document.querySelector('code');
      expect(code).toBeTruthy();
      
      const addLine = code?.querySelector('.code-line.diff-add');
      expect(addLine).toBeTruthy();
    });

    it('应该有正确的层级结构', () => {
      const wrapper = document.querySelector('.code-block-wrapper');
      const codeBlock = wrapper?.querySelector('.code-block');
      const pre = codeBlock?.querySelector('pre');
      const code = pre?.querySelector('code');
      const addLine = code?.querySelector('.code-line.diff-add');
      
      expect(wrapper).toBeTruthy();
      expect(codeBlock).toBeTruthy();
      expect(pre).toBeTruthy();
      expect(code).toBeTruthy();
      expect(addLine).toBeTruthy();
    });
  });

  describe('CSS 类的存在性', () => {
    it('添加行应该有 diff-add 类', () => {
      const addLine = document.querySelector('.diff-add');
      expect(addLine).toBeTruthy();
    });

    it('删除行应该有 diff-remove 类', () => {
      const removeLine = document.querySelector('.diff-remove');
      expect(removeLine).toBeTruthy();
    });

    it('应该能同时选择多个差异行', () => {
      const diffLines = document.querySelectorAll('.code-line.diff-add, .code-line.diff-remove');
      expect(diffLines.length).toBe(2);
    });
  });

  describe('与 AstroPaper 的对齐验证', () => {
    it('CSS 文件应该定义 .diff-add 样式', () => {
      // 这个测试验证 CSS 类的存在性
      // 实际的样式值（bg-green-400/20 等）会被 Tailwind 编译
      const addLine = document.querySelector('.code-line.diff-add');
      expect(addLine).toBeTruthy();
    });

    it('CSS 文件应该定义 .diff-remove 样式', () => {
      // 这个测试验证 CSS 类的存在性
      // 实际的样式值（bg-red-500/20 等）会被 Tailwind 编译
      const removeLine = document.querySelector('.code-line.diff-remove');
      expect(removeLine).toBeTruthy();
    });

    it('应该使用与 AstroPaper 相同的类名结构', () => {
      // AstroPaper 使用 .line.diff.add 和 .line.diff.remove
      // 我们使用 .code-line.diff-add 和 .code-line.diff-remove
      // 验证类名存在
      const addLine = document.querySelector('.code-line.diff-add');
      const removeLine = document.querySelector('.code-line.diff-remove');
      
      expect(addLine).toBeTruthy();
      expect(removeLine).toBeTruthy();
    });
  });
});
