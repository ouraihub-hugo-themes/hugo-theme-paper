/**
 * Vitest Setup File
 * 配置测试环境，模拟浏览器 API
 */

import { beforeAll, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// 全局 DOM 设置
beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost:3000',
    pretendToBeVisual: true,
    resources: 'usable',
  });

  const { window } = dom;

  // 设置全局对象
  global.window = window as any;
  global.document = window.document;
  global.navigator = window.navigator;

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock requestAnimationFrame
  global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    setTimeout(callback, 0);
    return 0;
  });

  global.cancelAnimationFrame = vi.fn();

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  } as any;

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
});

// 每个测试后清理
afterEach(() => {
  vi.clearAllMocks();
  if (global.localStorage) {
    global.localStorage.clear();
  }
});
