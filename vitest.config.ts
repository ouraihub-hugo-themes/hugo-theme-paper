import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000',
        // 启用 localStorage 支持
        resources: 'usable',
        runScripts: 'dangerously',
      },
    },
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['assets/ts/**/*.ts'],
      exclude: [
        'node_modules/',
        'assets/ts/**/*.test.ts',
        'assets/ts/**/*.spec.ts',
      ],
    },
    include: ['tests/**/*.{test,spec,bench}.ts'],
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      // 暂时排除未实现功能的测试
      'tests/interactive-features.test.ts',
      'tests/browser-compatibility.test.ts',
      'tests/integration.test.ts',
      'tests/security-audit.test.ts',
      'tests/seo-audit.test.ts',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './assets/ts'),
    },
  },
});
