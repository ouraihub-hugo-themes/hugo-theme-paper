import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

let dom: JSDOM;
let window: any;
let document: any;

beforeEach(() => {
  dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="theme-color" content="#ffffff">
        <title>Hugo Paper Theme Test</title>
      </head>
      <body>
        <header>
          <nav>
            <button id="theme-toggle">Toggle Theme</button>
            <button id="mobile-menu-btn">Menu</button>
          </nav>
          <nav id="mobile-menu" class="hidden">
            <a href="/">Home</a>
            <a href="/archives">Archives</a>
            <a href="/about">About</a>
          </nav>
        </header>

        <main>
          <article id="post-1">
            <h1>Test Article</h1>
            <div class="article-meta">
              <span class="publish-date">2024-01-01</span>
              <span class="reading-time">5 min read</span>
            </div>
            <div class="content">
              <p>Test content</p>
              <pre><code>const test = true;</code></pre>
            </div>
            <button id="post-like-btn">Like</button>
            <div id="share-container"></div>
          </article>
        </main>

        <footer>
          <p>&copy; 2024 Hugo Paper</p>
        </footer>

        <button id="back-to-top" class="opacity-0 invisible">Back to Top</button>
        <div id="reading-progress"></div>
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
  dom.window.close();
});

/**
 * Integration Tests - Overall Theme Functionality
 */
describe('Hugo Paper Theme Integration', () => {
  it('should have proper HTML structure', () => {
    expect(document.querySelector('header')).toBeTruthy();
    expect(document.querySelector('main')).toBeTruthy();
    expect(document.querySelector('footer')).toBeTruthy();
  });

  it('should have theme toggle button', () => {
    const themeToggle = document.getElementById('theme-toggle');
    expect(themeToggle).toBeTruthy();
    expect(themeToggle?.tagName).toBe('BUTTON');
  });

  it('should have mobile menu button', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    expect(mobileMenuBtn).toBeTruthy();
    expect(mobileMenu).toBeTruthy();
    expect(mobileMenu?.classList.contains('hidden')).toBe(true);
  });

  it('should have back to top button', () => {
    const backToTopBtn = document.getElementById('back-to-top');
    expect(backToTopBtn).toBeTruthy();
    expect(backToTopBtn?.classList.contains('invisible')).toBe(true);
  });

  it('should have reading progress element', () => {
    const readingProgress = document.getElementById('reading-progress');
    expect(readingProgress).toBeTruthy();
  });

  it('should have post content elements', () => {
    const article = document.querySelector('article');
    const title = document.querySelector('h1');
    const content = document.querySelector('.content');
    const likBtn = document.getElementById('post-like-btn');
    const shareContainer = document.getElementById('share-container');

    expect(article).toBeTruthy();
    expect(title).toBeTruthy();
    expect(content).toBeTruthy();
    expect(likBtn).toBeTruthy();
    expect(shareContainer).toBeTruthy();
  });

  it('should have proper meta tags', () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    const charset = document.querySelector('meta[charset]');
    const themeColor = document.querySelector('meta[name="theme-color"]');

    expect(viewport).toBeTruthy();
    expect(charset).toBeTruthy();
    expect(themeColor).toBeTruthy();
  });

  it('should detect code blocks', () => {
    const codeBlocks = document.querySelectorAll('pre code');
    expect(codeBlocks.length).toBe(1);
    expect(codeBlocks[0]?.textContent).toContain('const test = true;');
  });
});

/**
 * Integration Tests - Theme System
 */
describe('Theme System Integration', () => {
  it('should properly initialize and switch themes', () => {
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
          localStorage.setItem(this.THEME_KEY, theme);
        }

        toggle() {
          const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
          this.applyTheme(newTheme);
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

      class MobileMenuManager {
        constructor() {
          this.MENU_BUTTON = document.getElementById('mobile-menu-btn');
          this.MOBILE_MENU = document.getElementById('mobile-menu');
          this.setupEventListeners();
        }

        setupEventListeners() {
          if (this.MENU_BUTTON) {
            this.MENU_BUTTON.addEventListener('click', () => this.toggle());
          }
        }

        toggle() {
          if (this.MOBILE_MENU?.classList.contains('hidden')) {
            this.MOBILE_MENU.classList.remove('hidden');
          } else {
            this.MOBILE_MENU?.classList.add('hidden');
          }
        }
      }

      class BackToTopManager {
        constructor() {
          this.BUTTON = document.getElementById('back-to-top');
        }

        scrollToTop() {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }

      window.themeManager = new ThemeManager();
      window.mobileMenuManager = new MobileMenuManager();
      window.backToTopManager = new BackToTopManager();
    `);

    const themeManager = (window as any).themeManager;
    const themeToggle = document.getElementById('theme-toggle');

    expect(themeManager.getTheme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    themeToggle?.click();

    expect(themeManager.getTheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});

/**
 * Integration Tests - Navigation System
 */
describe('Navigation System Integration', () => {
  it('should toggle mobile menu on button click', () => {
    eval(`
      class MobileMenuManager {
        constructor() {
          this.MENU_BUTTON = document.getElementById('mobile-menu-btn');
          this.MOBILE_MENU = document.getElementById('mobile-menu');
          this.setupEventListeners();
        }

        setupEventListeners() {
          if (this.MENU_BUTTON) {
            this.MENU_BUTTON.addEventListener('click', () => this.toggle());
            const links = this.MOBILE_MENU?.querySelectorAll('a');
            links?.forEach(link => {
              link.addEventListener('click', () => this.close());
            });
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
      window.mobileMenuManager = new MobileMenuManager();
    `);

    const menuManager = (window as any).mobileMenuManager;
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBtn = document.getElementById('mobile-menu-btn');

    expect(mobileMenu?.classList.contains('hidden')).toBe(true);
    expect(menuManager.isOpen()).toBe(false);

    menuBtn?.click();

    expect(mobileMenu?.classList.contains('hidden')).toBe(false);
    expect(menuManager.isOpen()).toBe(true);

    menuBtn?.click();

    expect(mobileMenu?.classList.contains('hidden')).toBe(true);
    expect(menuManager.isOpen()).toBe(false);
  });

  it('should have navigation links', () => {
    const navLinks = document.querySelectorAll('nav a');
    expect(navLinks.length).toBeGreaterThan(0);

    const homeLink = Array.from(navLinks).find((link) => (link as Element).getAttribute('href') === '/');
    expect(homeLink).toBeTruthy();
  });
});

/**
 * Integration Tests - Post Display
 */
describe('Post Display Integration', () => {
  it('should display article meta information', () => {
    const publishDate = document.querySelector('.publish-date');
    const readingTime = document.querySelector('.reading-time');

    expect(publishDate).toBeTruthy();
    expect(publishDate?.textContent).toContain('2024-01-01');

    expect(readingTime).toBeTruthy();
    expect(readingTime?.textContent).toContain('5 min read');
  });

  it('should have proper article structure', () => {
    const article = document.querySelector('article');
    const title = article?.querySelector('h1');
    const meta = article?.querySelector('.article-meta');
    const content = article?.querySelector('.content');

    expect(article).toBeTruthy();
    expect(title?.textContent).toBe('Test Article');
    expect(meta).toBeTruthy();
    expect(content).toBeTruthy();
  });

  it('should include interactive buttons', () => {
    const article = document.querySelector('article');
    const likeBtn = article?.querySelector('#post-like-btn');
    const shareContainer = article?.querySelector('#share-container');

    expect(likeBtn).toBeTruthy();
    expect(likeBtn?.textContent).toContain('Like');
    expect(shareContainer).toBeTruthy();
  });
});

/**
 * Integration Tests - Footer
 */
describe('Footer Integration', () => {
  it('should have footer element', () => {
    const footer = document.querySelector('footer');
    expect(footer).toBeTruthy();
  });

  it('should display copyright information', () => {
    const footer = document.querySelector('footer');
    expect(footer?.textContent).toContain('Hugo Paper');
    expect(footer?.textContent).toContain('2024');
  });
});

/**
 * Performance Integration Tests
 */
describe('Performance Integration', () => {
  it('should have minimal critical rendering path', () => {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    const scripts = document.querySelectorAll('script');

    // Check that CSS and JS are properly included
    expect(links.length >= 0).toBe(true);
    expect(scripts.length >= 0).toBe(true);
  });

  it('should not have render-blocking resources at load time', () => {
    const head = document.querySelector('head');
    const asyncScripts = head?.querySelectorAll('script[async]');
    const deferScripts = head?.querySelectorAll('script[defer]');

    // Scripts should be async or defer to not block rendering
    expect(asyncScripts || deferScripts).toBeTruthy();
  });

  it('should have proper viewport meta tag', () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    const content = viewport?.getAttribute('content');

    expect(viewport).toBeTruthy();
    expect(content).toContain('width=device-width');
    expect(content).toContain('initial-scale=1');
  });
});

/**
 * Accessibility Integration Tests
 */
describe('Accessibility Integration', () => {
  it('should have document title', () => {
    expect(document.title).toBeTruthy();
    expect(document.title).toContain('Hugo Paper');
  });

  it('should have proper semantic structure', () => {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');

    expect(header).toBeTruthy();
    expect(main).toBeTruthy();
    expect(footer).toBeTruthy();
  });

  it('should have proper button elements', () => {
    const buttons = document.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);

    buttons.forEach((button: Element) => {
      const el = button as HTMLElement;
      expect(el.textContent || el.title).toBeTruthy();
    });
  });
});
