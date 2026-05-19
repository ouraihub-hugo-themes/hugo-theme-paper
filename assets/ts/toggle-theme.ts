/**
 * Theme Toggle Script - 使用 @ouraihub/core 的 ThemeManager
 * 
 * 此脚本必须在页面渲染前运行以防止主题闪烁
 * 使用 @ouraihub/core 的 ThemeManager 替代原有的主题切换逻辑
 * 
 * API 保持兼容：
 * - localStorage key: "theme"
 * - data-theme 属性: "light" | "dark"
 */

import { ThemeManager } from '@ouraihub/core';

// 初始化 ThemeManager
// 使用与原脚本相同的配置保持向后兼容
const themeManager = new ThemeManager(document.documentElement, {
  storageKey: 'theme',
  attribute: 'data-theme',
  defaultTheme: 'system',
});

// 防闪烁：立即应用主题
themeManager.setTheme(themeManager.getTheme());

// 页面加载完成后设置交互
window.addEventListener('load', () => {
  const themeBtn = document.querySelector('#theme-btn');
  
  if (themeBtn) {
    // 设置初始 aria-label
    const currentTheme = themeManager.getTheme();
    themeBtn.setAttribute('aria-label', currentTheme);
    
    // 监听主题按钮点击
    themeBtn.addEventListener('click', () => {
      themeManager.toggle();
    });
    
    // 监听主题变化，更新 aria-label 和 meta theme-color
    themeManager.onThemeChange((theme) => {
      themeBtn.setAttribute('aria-label', theme);
      updateThemeColor(theme);
    });
  }
});

// 监听系统主题变化
themeManager.onThemeChange((theme) => {
  updateThemeColor(theme);
});

/**
 * 更新 meta theme-color 标签
 */
function updateThemeColor(theme: 'light' | 'dark'): void {
  const body = document.body;
  if (!body) return;
  
  const computedStyles = window.getComputedStyle(body);
  const bgColor = computedStyles.backgroundColor;
  
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute('content', bgColor);
}
