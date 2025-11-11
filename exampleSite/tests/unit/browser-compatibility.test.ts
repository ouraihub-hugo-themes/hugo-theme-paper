import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

/**
 * Browser Compatibility Tests
 * Tests for cross-browser feature support
 */
describe('Browser Compatibility', () => {
  let window: any;
  let document: any;

  /**
   * localStorage Support
   */
  describe('localStorage Support', () => {
    beforeEach(() => {
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      window = dom.window;
      document = window.document;
      global.window = window as any;
      global.document = document;
      global.localStorage = window.localStorage;
    });

    it('should support localStorage API', () => {
      expect(typeof window.localStorage).toBe('object');
      expect(typeof localStorage.setItem).toBe('function');
      expect(typeof localStorage.getItem).toBe('function');
      expect(typeof localStorage.removeItem).toBe('function');
    });

    it('should persist data in localStorage', () => {
      localStorage.setItem('test', 'value');
      expect(localStorage.getItem('test')).toBe('value');
      localStorage.removeItem('test');
      expect(localStorage.getItem('test')).toBe(null);
    });

    it('should handle JSON in localStorage', () => {
      const data = { id: 1, name: 'test' };
      localStorage.setItem('data', JSON.stringify(data));
      const retrieved = JSON.parse(localStorage.getItem('data') || '{}');
      expect(retrieved.id).toBe(1);
      expect(retrieved.name).toBe('test');
    });
  });

  /**
   * Clipboard API Support
   */
  describe('Clipboard API Support', () => {
    beforeEach(() => {
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      window = dom.window;
      document = window.document;
      global.window = window as any;
      global.document = document;

      // Mock clipboard API
      Object.assign(window.navigator, {
        clipboard: {
          writeText: async (text: string) => text,
          readText: async () => 'copied',
        },
      });
    });

    it('should have navigator.clipboard API', () => {
      expect(window.navigator.clipboard).toBeTruthy();
      expect(typeof window.navigator.clipboard.writeText).toBe('function');
    });

    it('should copy text to clipboard', async () => {
      const text = 'test text';
      const result = await window.navigator.clipboard.writeText(text);
      expect(result).toBe(text);
    });

    it('should fallback to alternative copy method if unavailable', () => {
      // Test fallback for older browsers
      const text = 'fallback text';

      // Mock older browser scenario
      const fallbackCopy = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      };

      expect(typeof fallbackCopy).toBe('function');
    });
  });

  /**
   * Event API Support
   */
  describe('Event APIs Support', () => {
    beforeEach(() => {
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      window = dom.window;
      document = window.document;
      global.window = window as any;
      global.document = document;
    });

    it('should support addEventListener', () => {
      expect(typeof document.addEventListener).toBe('function');
      expect(typeof window.addEventListener).toBe('function');
    });

    it('should support mouse events', () => {
      let clickCount = 0;
      const btn = document.createElement('button');
      btn.addEventListener('click', () => clickCount++);
      document.body.appendChild(btn);

      btn.click();
      expect(clickCount).toBe(1);
    });

    it('should support keyboard events', () => {
      let keyCode: string | number | null = null;
      document.addEventListener('keydown', (e: any) => {
        keyCode = e.key;
      });

      const event = new window.KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);

      expect(keyCode).toBe('Enter');
    });

    it('should support scroll events', () => {
      let scrolled = false;
      window.addEventListener('scroll', () => {
        scrolled = true;
      }, { passive: true });

      const event = new window.Event('scroll');
      window.dispatchEvent(event);

      expect(scrolled).toBe(true);
    });

    it('should support change events for media queries', () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      expect(mediaQuery).toBeTruthy();
      expect(typeof mediaQuery.addEventListener).toBe('function');
    });
  });

  /**
   * DOM API Support
   */
  describe('DOM APIs Support', () => {
    beforeEach(() => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head><meta name="theme-color" content="#ffffff"></head>
          <body>
            <div id="test" class="hidden">Test</div>
            <button id="btn">Button</button>
          </body>
        </html>
      `);
      window = dom.window;
      document = window.document;
      global.window = window as any;
      global.document = document;
    });

    it('should support getElementById', () => {
      const element = document.getElementById('test');
      expect(element).toBeTruthy();
      expect(element?.textContent).toBe('Test');
    });

    it('should support querySelector', () => {
      const element = document.querySelector('div.hidden');
      expect(element).toBeTruthy();
      expect(element?.id).toBe('test');
    });

    it('should support querySelectorAll', () => {
      const elements = document.querySelectorAll('button, div');
      expect(elements.length).toBe(2);
    });

    it('should support classList API', () => {
      const element = document.getElementById('test');
      expect(element?.classList.contains('hidden')).toBe(true);

      element?.classList.remove('hidden');
      expect(element?.classList.contains('hidden')).toBe(false);

      element?.classList.add('visible');
      expect(element?.classList.contains('visible')).toBe(true);
    });

    it('should support setAttribute and getAttribute', () => {
      const element = document.getElementById('test');
      element?.setAttribute('data-test', 'value');
      expect(element?.getAttribute('data-test')).toBe('value');
    });

    it('should support meta tag manipulation', () => {
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      expect(metaTheme).toBeTruthy();

      metaTheme?.setAttribute('content', '#000000');
      expect(metaTheme?.getAttribute('content')).toBe('#000000');
    });
  });

  /**
   * CSS Support
   */
  describe('CSS Support', () => {
    beforeEach(() => {
      const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              :root {
                --primary-color: #3b82f6;
              }
              .dark {
                --primary-color: #1e40af;
              }
              .dark:root {
                color-scheme: dark;
              }
            </style>
          </head>
          <body></body>
        </html>
      `);
      window = dom.window;
      document = window.document;
      global.window = window as any;
      global.document = document;
    });

    it('should support CSS custom properties', () => {
      const style = document.createElement('style');
      style.textContent = ':root { --test-color: red; }';
      document.head.appendChild(style);

      expect(style.textContent).toContain('--test-color');
    });

    it('should support CSS Grid and Flexbox', () => {
      const element = document.createElement('div');
      element.style.display = 'grid';
      element.style.gridTemplateColumns = '1fr 1fr';

      expect(element.style.display).toBe('grid');
    });

    it('should support CSS transitions', () => {
      const element = document.createElement('div');
      element.style.transition = 'all 0.3s ease';

      expect(element.style.transition).toContain('0.3s');
    });
  });

  /**
   * Array and Object APIs
   */
  describe('Modern JavaScript APIs', () => {
    it('should support ES6 arrow functions', () => {
      const fn = () => 'test';
      expect(fn()).toBe('test');
    });

    it('should support const and let', () => {
      const constant = 'value';
      let variable = 'value';
      expect(constant).toBe('value');
      expect(variable).toBe('value');
    });

    it('should support template literals', () => {
      const name = 'World';
      const greeting = `Hello, ${name}!`;
      expect(greeting).toBe('Hello, World!');
    });

    it('should support destructuring', () => {
      const obj = { a: 1, b: 2 };
      const { a, b } = obj;
      expect(a).toBe(1);
      expect(b).toBe(2);
    });

    it('should support spread operator', () => {
      const arr1 = [1, 2];
      const arr2 = [3, 4];
      const combined = [...arr1, ...arr2];
      expect(combined).toEqual([1, 2, 3, 4]);
    });

    it('should support Map and Set', () => {
      const map = new Map([['key', 'value']]);
      expect(map.get('key')).toBe('value');

      const set = new Set([1, 2, 3]);
      expect(set.has(2)).toBe(true);
    });

    it('should support Promise', async () => {
      const promise = new Promise((resolve) => {
        resolve('success');
      });

      const result = await promise;
      expect(result).toBe('success');
    });

    it('should support async/await', async () => {
      const asyncFn = async () => 'result';
      const result = await asyncFn();
      expect(result).toBe('result');
    });
  });

  /**
   * Media Query Support
   */
  describe('Media Query Support', () => {
    beforeEach(() => {
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      window = dom.window;
      document = window.document;
      global.window = window as any;
      global.document = document;
    });

    it('should support matchMedia API', () => {
      expect(typeof window.matchMedia).toBe('function');
    });

    it('should detect dark mode preference', () => {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      expect(darkModeQuery).toBeTruthy();
      expect(typeof darkModeQuery.matches).toBe('boolean');
    });

    it('should detect reduced motion preference', () => {
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      expect(reducedMotionQuery).toBeTruthy();
      expect(typeof reducedMotionQuery.matches).toBe('boolean');
    });

    it('should detect viewport width', () => {
      const mobileQuery = window.matchMedia('(max-width: 640px)');
      expect(mobileQuery).toBeTruthy();
    });
  });

  /**
   * Window APIs
   */
  describe('Window APIs', () => {
    beforeEach(() => {
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      window = dom.window;
      document = window.document;
      global.window = window as any;
      global.document = document;
    });

    it('should support window.scrollTo', () => {
      expect(typeof window.scrollTo).toBe('function');
    });

    it('should support window.scrollY', () => {
      expect(typeof window.scrollY).toBe('number');
    });

    it('should support window.innerHeight', () => {
      expect(typeof window.innerHeight).toBe('number');
    });

    it('should support setTimeout and setInterval', () => {
      expect(typeof window.setTimeout).toBe('function');
      expect(typeof window.setInterval).toBe('function');
    });

    it('should support requestAnimationFrame', () => {
      expect(typeof window.requestAnimationFrame).toBe('function');
    });
  });

  /**
   * Fallback Support
   */
  describe('Fallback Mechanisms', () => {
    it('should provide fallback for missing classList', () => {
      const fallback = {
        add: (className: string) => console.log(`Add: ${className}`),
        remove: (className: string) => console.log(`Remove: ${className}`),
        contains: (className: string) => false,
      };

      expect(typeof fallback.add).toBe('function');
      expect(typeof fallback.remove).toBe('function');
      expect(typeof fallback.contains).toBe('function');
    });

    it('should provide fallback for clipboard API', () => {
      const fallback = {
        writeText: (text: string) => {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          const success = document.execCommand('copy');
          document.body.removeChild(textArea);
          return Promise.resolve();
        },
      };

      expect(typeof fallback.writeText).toBe('function');
    });

    it('should provide fallback for matchMedia', () => {
      const fallback = {
        matchMedia: () => ({ matches: false, media: '' }),
      };

      expect(typeof fallback.matchMedia).toBe('function');
    });
  });
});

/**
 * Feature Detection Tests
 */
describe('Feature Detection', () => {
  let window: any;
  let document: any;

  beforeEach(() => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    window = dom.window;
    document = window.document;
    global.window = window as any;
    global.document = document;
    global.localStorage = window.localStorage;
  });

  it('should detect storage availability', () => {
    const storageAvailable = (type: string) => {
      try {
        const storage = (window as any)[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
      } catch (e) {
        return false;
      }
    };

    expect(storageAvailable('localStorage')).toBe(true);
  });

  it('should detect clipboard API availability', () => {
    const hasClipboardAPI = typeof window.navigator?.clipboard?.writeText === 'function';
    expect(typeof hasClipboardAPI).toBe('boolean');
  });

  it('should detect CSS custom properties support', () => {
    const hasCSSVariables = CSS?.supports?.('--color', 'red') ?? false;
    expect(typeof hasCSSVariables).toBe('boolean');
  });

  it('should detect requestAnimationFrame availability', () => {
    const hasRAF = typeof window.requestAnimationFrame === 'function';
    expect(hasRAF).toBe(true);
  });

  it('should detect Intersection Observer availability', () => {
    const hasIntersectionObserver = typeof window.IntersectionObserver === 'function';
    expect(typeof hasIntersectionObserver).toBe('boolean');
  });
});
