import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock DOM environment
let dom: JSDOM;
let window: any;
let document: any;

beforeEach(() => {
  // Create a fresh DOM for each test
  dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="theme-color" content="#ffffff">
      </head>
      <body>
        <button id="theme-toggle">Toggle</button>
        <button id="mobile-menu-btn">Menu</button>
        <nav id="mobile-menu" class="hidden"></nav>
        <button id="back-to-top" class="opacity-0 invisible"></button>
      </body>
    </html>
  `);

  window = dom.window;
  document = window.document;
  global.window = window as any;
  global.document = document;
  global.localStorage = window.localStorage;
});

afterEach(() => {
  vi.clearAllMocks();
  dom.window.close();
});

/**
 * Theme Manager Tests
 */
describe('ThemeManager', () => {
  it('should initialize with light theme by default', () => {
    // Clear localStorage before test
    window.localStorage.clear();

    // Create and initialize theme manager
    eval(`
      class ThemeManager {
        constructor() {
          this.THEME_KEY = 'hugo-paper-theme';
          this.HTML_ELEMENT = document.documentElement;
          this.THEMES = ['light', 'dark'];
          this.currentTheme = this.getInitialTheme();
          this.applyTheme(this.currentTheme);
          this.setupEventListeners();
        }

        getInitialTheme() {
          const savedTheme = localStorage.getItem(this.THEME_KEY);
          if (savedTheme && this.THEMES.includes(savedTheme)) {
            return savedTheme;
          }
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
          }
          return 'light';
        }

        applyTheme(theme) {
          this.currentTheme = theme;
          if (theme === 'dark') {
            this.HTML_ELEMENT.classList.add('dark');
            this.HTML_ELEMENT.setAttribute('data-theme', 'dark');
          } else {
            this.HTML_ELEMENT.classList.remove('dark');
            this.HTML_ELEMENT.setAttribute('data-theme', 'light');
          }
          const metaThemeColor = document.querySelector('meta[name="theme-color"]');
          if (metaThemeColor) {
            const color = theme === 'dark' ? '#0f172a' : '#ffffff';
            metaThemeColor.setAttribute('content', color);
          }
          localStorage.setItem(this.THEME_KEY, theme);
          this.updateThemeIcons();
        }

        updateThemeIcons() {
          const sunIcon = document.getElementById('sun-icon');
          const moonIcon = document.getElementById('moon-icon');
          if (sunIcon && moonIcon) {
            if (this.currentTheme === 'dark') {
              sunIcon.classList.remove('hidden');
              moonIcon.classList.add('hidden');
            } else {
              sunIcon.classList.add('hidden');
              moonIcon.classList.remove('hidden');
            }
          }
        }

        toggle() {
          const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
          this.applyTheme(newTheme);
        }

        setTheme(theme) {
          if (this.THEMES.includes(theme)) {
            this.applyTheme(theme);
          }
        }

        getTheme() {
          return this.currentTheme;
        }

        setupEventListeners() {
          const themeToggle = document.getElementById('theme-toggle');
          if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
          }
        }
      }
      const themeManager = new ThemeManager();
    `);

    expect(window.localStorage.getItem('hugo-paper-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should toggle between light and dark theme', () => {
    window.localStorage.clear();

    eval(`
      class ThemeManager {
        constructor() {
          this.THEME_KEY = 'hugo-paper-theme';
          this.HTML_ELEMENT = document.documentElement;
          this.THEMES = ['light', 'dark'];
          this.currentTheme = 'light';
          this.applyTheme(this.currentTheme);
        }

        applyTheme(theme) {
          this.currentTheme = theme;
          if (theme === 'dark') {
            this.HTML_ELEMENT.classList.add('dark');
            this.HTML_ELEMENT.setAttribute('data-theme', 'dark');
          } else {
            this.HTML_ELEMENT.classList.remove('dark');
            this.HTML_ELEMENT.setAttribute('data-theme', 'light');
          }
          localStorage.setItem(this.THEME_KEY, theme);
        }

        toggle() {
          const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
          this.applyTheme(newTheme);
        }

        getTheme() {
          return this.currentTheme;
        }
      }
      const themeManager = new ThemeManager();
      window.themeManager = themeManager;
    `);

    const themeManager = (window as any).themeManager;
    expect(themeManager.getTheme()).toBe('light');

    themeManager.toggle();
    expect(themeManager.getTheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    themeManager.toggle();
    expect(themeManager.getTheme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should persist theme preference to localStorage', () => {
    window.localStorage.clear();

    eval(`
      class ThemeManager {
        constructor() {
          this.THEME_KEY = 'hugo-paper-theme';
          this.HTML_ELEMENT = document.documentElement;
          this.THEMES = ['light', 'dark'];
          this.currentTheme = 'light';
        }

        applyTheme(theme) {
          this.currentTheme = theme;
          localStorage.setItem(this.THEME_KEY, theme);
        }

        setTheme(theme) {
          if (this.THEMES.includes(theme)) {
            this.applyTheme(theme);
          }
        }
      }
      const themeManager = new ThemeManager();
      window.themeManager = themeManager;
    `);

    const themeManager = (window as any).themeManager;
    themeManager.setTheme('dark');

    expect(window.localStorage.getItem('hugo-paper-theme')).toBe('dark');
  });
});

/**
 * Mobile Menu Manager Tests
 */
describe('MobileMenuManager', () => {
  beforeEach(() => {
    // Add menu items to the mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.innerHTML = `
        <a href="/">Home</a>
        <a href="/about">About</a>
      `;
    }
  });

  it('should open mobile menu when button is clicked', () => {
    eval(`
      class MobileMenuManager {
        constructor() {
          this.MENU_BUTTON = document.getElementById('mobile-menu-btn');
          this.MOBILE_MENU = document.getElementById('mobile-menu');
          this.setupEventListeners();
        }

        setupEventListeners() {
          if (this.MENU_BUTTON && this.MOBILE_MENU) {
            this.MENU_BUTTON.addEventListener('click', () => this.toggle());
          }
        }

        toggle() {
          if (this.MOBILE_MENU?.classList.contains('hidden')) {
            this.open();
          } else {
            this.close();
          }
        }

        open() {
          this.MOBILE_MENU?.classList.remove('hidden');
        }

        close() {
          this.MOBILE_MENU?.classList.add('hidden');
        }

        isOpen() {
          return !this.MOBILE_MENU?.classList.contains('hidden');
        }
      }
      const mobileMenuManager = new MobileMenuManager();
      window.mobileMenuManager = mobileMenuManager;
    `);

    const mobileMenu = document.getElementById('mobile-menu');
    const menuBtn = document.getElementById('mobile-menu-btn');

    expect(mobileMenu?.classList.contains('hidden')).toBe(true);

    menuBtn?.click();

    expect(mobileMenu?.classList.contains('hidden')).toBe(false);
  });

  it('should close menu when clicking outside', () => {
    eval(`
      class MobileMenuManager {
        constructor() {
          this.MENU_BUTTON = document.getElementById('mobile-menu-btn');
          this.MOBILE_MENU = document.getElementById('mobile-menu');
          this.setupEventListeners();
        }

        setupEventListeners() {
          document.addEventListener('click', (e) => {
            const target = e.target;
            if (
              !this.MOBILE_MENU?.contains(target) &&
              !this.MENU_BUTTON?.contains(target)
            ) {
              this.close();
            }
          });
        }

        close() {
          this.MOBILE_MENU?.classList.add('hidden');
        }
      }
      const mobileMenuManager = new MobileMenuManager();
      window.mobileMenuManager = mobileMenuManager;
    `);

    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu?.classList.remove('hidden');

    // Click outside menu
    const event = new window.MouseEvent('click', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(mobileMenu?.classList.contains('hidden')).toBe(true);
  });
});

/**
 * Back to Top Manager Tests
 */
describe('BackToTopManager', () => {
  it('should hide button when scroll is near top', () => {
    eval(`
      class BackToTopManager {
        constructor() {
          this.BUTTON = document.getElementById('back-to-top');
          this.SCROLL_THRESHOLD = 300;
          this.setupEventListeners();
        }

        setupEventListeners() {
          if (!this.BUTTON) return;
          window.addEventListener('scroll', () => this.updateButtonVisibility(), { passive: true });
          this.BUTTON.addEventListener('click', () => this.scrollToTop());
        }

        updateButtonVisibility() {
          if (!this.BUTTON) return;
          if (window.scrollY > this.SCROLL_THRESHOLD) {
            this.BUTTON.classList.remove('opacity-0', 'invisible');
            this.BUTTON.classList.add('opacity-100', 'visible');
          } else {
            this.BUTTON.classList.add('opacity-0', 'invisible');
            this.BUTTON.classList.remove('opacity-100', 'visible');
          }
        }

        scrollToTop() {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      const backToTopManager = new BackToTopManager();
      window.backToTopManager = backToTopManager;
    `);

    const button = document.getElementById('back-to-top');
    expect(button?.classList.contains('opacity-0')).toBe(true);
  });

  it('should show button when scrolled down', () => {
    eval(`
      class BackToTopManager {
        constructor() {
          this.BUTTON = document.getElementById('back-to-top');
          this.SCROLL_THRESHOLD = 300;
        }

        updateButtonVisibility() {
          if (!this.BUTTON) return;
          if (window.scrollY > this.SCROLL_THRESHOLD) {
            this.BUTTON.classList.remove('opacity-0', 'invisible');
            this.BUTTON.classList.add('opacity-100', 'visible');
          } else {
            this.BUTTON.classList.add('opacity-0', 'invisible');
            this.BUTTON.classList.remove('opacity-100', 'visible');
          }
        }
      }
      const backToTopManager = new BackToTopManager();
      window.backToTopManager = backToTopManager;
    `);

    const button = document.getElementById('back-to-top');
    const backToTopManager = (window as any).backToTopManager;

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    backToTopManager.updateButtonVisibility();

    expect(button?.classList.contains('opacity-100')).toBe(true);
    expect(button?.classList.contains('visible')).toBe(true);
  });
});
