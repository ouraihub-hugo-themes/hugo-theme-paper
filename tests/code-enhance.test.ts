/**
 * CodeEnhancer 测试
 * 验证代码增强功能的正确性
 */

import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { CodeEnhancer } from "../assets/ts/code-enhance";

describe("CodeEnhancer", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <pre><code id="test-code"></code></pre>
        </body>
      </html>
    `);
    document = dom.window.document;
    global.document = document as any;
  });

  describe("差异标记处理", () => {
    it("应该处理删除标记 (--)", () => {
      const code = document.getElementById("test-code") as HTMLElement;
      code.innerHTML = `/* [!code --] */
const oldCode = 'removed';`;

      const enhancer = new CodeEnhancer(true, true);
      enhancer.init();

      expect(code.innerHTML).toContain('class="line diff remove"');
    });

    it("应该处理添加标记 (++)", () => {
      const code = document.getElementById("test-code") as HTMLElement;
      code.innerHTML = `/* [!code ++] */
const newCode = 'added';`;

      const enhancer = new CodeEnhancer(true, true);
      enhancer.init();

      expect(code.innerHTML).toContain('class="line diff add"');
    });

    it("应该处理多行删除标记", () => {
      const code = document.getElementById("test-code") as HTMLElement;
      code.innerHTML = `/* [!code --:2] */
line 1
line 2`;

      const enhancer = new CodeEnhancer(true, true);
      enhancer.init();

      const removeLines = code.innerHTML.match(/class="line diff remove"/g);
      expect(removeLines).toHaveLength(2);
    });

    it("应该处理多行添加标记", () => {
      const code = document.getElementById("test-code") as HTMLElement;
      code.innerHTML = `/* [!code ++:3] */
line 1
line 2
line 3`;

      const enhancer = new CodeEnhancer(true, true);
      enhancer.init();

      const addLines = code.innerHTML.match(/class="line diff add"/g);
      expect(addLines).toHaveLength(3);
    });
  });

  describe("行高亮处理", () => {
    it("应该处理单行高亮", () => {
      const code = document.getElementById("test-code") as HTMLElement;
      code.innerHTML = `// [!code hl]
const important = 'highlighted';`;

      const enhancer = new CodeEnhancer(true, true);
      enhancer.init();

      expect(code.innerHTML).toContain('class="line highlighted"');
    });

    it("应该处理多行高亮", () => {
      const code = document.getElementById("test-code") as HTMLElement;
      code.innerHTML = `// [!code hl:2]
line 1
line 2`;

      const enhancer = new CodeEnhancer(true, true);
      enhancer.init();

      const hlLines = code.innerHTML.match(/class="line highlighted"/g);
      expect(hlLines).toHaveLength(2);
    });
  });

  describe("配置选项", () => {
    it("当 showDiff=false 时不应处理差异标记", () => {
      const code = document.getElementById("test-code") as HTMLElement;
      const originalHTML = `/* [!code --] */
const oldCode = 'removed';`;
      code.innerHTML = originalHTML;

      const enhancer = new CodeEnhancer(false, true);
      enhancer.init();

      expect(code.innerHTML).not.toContain('class="line diff remove"');
    });

    it("当 showHighlight=false 时不应处理高亮标记", () => {
      const code = document.getElementById("test-code") as HTMLElement;
      const originalHTML = `// [!code hl]
const important = 'highlighted';`;
      code.innerHTML = originalHTML;

      const enhancer = new CodeEnhancer(true, false);
      enhancer.init();

      expect(code.innerHTML).not.toContain('class="line highlighted"');
    });
  });

  describe("Shiki 处理检测", () => {
    it("不应处理已被 Shiki 处理的代码块", () => {
      const pre = document.querySelector("pre") as HTMLPreElement;
      pre.classList.add("astro-code");
      
      const code = document.getElementById("test-code") as HTMLElement;
      const originalHTML = `/* [!code --] */
const oldCode = 'removed';`;
      code.innerHTML = originalHTML;

      const enhancer = new CodeEnhancer(true, true);
      enhancer.init();

      // 应该保持原样，不处理
      expect(code.innerHTML).toBe(originalHTML);
    });
  });
});
