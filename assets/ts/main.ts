/**
 * Theme Manager
 * Handles dark/light theme switching with system preference detection
 */
class ThemeManager {
  private readonly THEME_KEY = 'hugo-paper-theme';
  private readonly HTML_ELEMENT = document.documentElement;
  private readonly THEMES = ['light', 'dark'] as const;
  private currentTheme: 'light' | 'dark';

  constructor() {
    this.currentTheme = this.getInitialTheme();
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
  }

  /**
   * Get initial theme based on: saved preference > system preference > default
   */
  private getInitialTheme(): 'light' | 'dark' {
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme && this.THEMES.includes(savedTheme as any)) {
      return savedTheme as 'light' | 'dark';
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // Default to light
    return 'light';
  }

  /**
   * Apply theme to DOM
   */
  private applyTheme(theme: 'light' | 'dark'): void {
    this.currentTheme = theme;

    if (theme === 'dark') {
      this.HTML_ELEMENT.classList.add('dark');
      this.HTML_ELEMENT.setAttribute('data-theme', 'dark');
    } else {
      this.HTML_ELEMENT.classList.remove('dark');
      this.HTML_ELEMENT.setAttribute('data-theme', 'light');
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = theme === 'dark' ? '#0f172a' : '#ffffff';
      metaThemeColor.setAttribute('content', color);
    }

    localStorage.setItem(this.THEME_KEY, theme);
    this.updateThemeIcons();
  }

  /**
   * Update theme toggle icons
   */
  private updateThemeIcons(): void {
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

  /**
   * Toggle theme
   */
  public toggle(): void {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  /**
   * Set specific theme
   */
  public setTheme(theme: 'light' | 'dark'): void {
    if (this.THEMES.includes(theme)) {
      this.applyTheme(theme);
    }
  }

  /**
   * Get current theme
   */
  public getTheme(): 'light' | 'dark' {
    return this.currentTheme;
  }

  /**
   * Setup event listeners for theme toggle
   */
  private setupEventListeners(): void {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggle());
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(newTheme);
      });
    }
  }
}

/**
 * Mobile Menu Manager
 * Handles mobile navigation menu toggle
 */
class MobileMenuManager {
  private readonly MENU_BUTTON = document.getElementById('mobile-menu-btn');
  private readonly MOBILE_MENU = document.getElementById('mobile-menu');

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (this.MENU_BUTTON && this.MOBILE_MENU) {
      this.MENU_BUTTON.addEventListener('click', () => this.toggle());

      // Close menu when clicking on a link
      const links = this.MOBILE_MENU.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', () => this.close());
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (
          !this.MOBILE_MENU?.contains(target) &&
          !this.MENU_BUTTON?.contains(target)
        ) {
          this.close();
        }
      });
    }
  }

  private toggle(): void {
    if (this.MOBILE_MENU?.classList.contains('hidden')) {
      this.open();
    } else {
      this.close();
    }
  }

  private open(): void {
    this.MOBILE_MENU?.classList.remove('hidden');
  }

  private close(): void {
    this.MOBILE_MENU?.classList.add('hidden');
  }
}

/**
 * Back to Top Manager
 * Handles back to top button visibility and scroll behavior
 */
class BackToTopManager {
  private readonly BUTTON = document.getElementById('back-to-top');
  private readonly SCROLL_THRESHOLD = 300;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.BUTTON) return;

    window.addEventListener('scroll', () => this.updateButtonVisibility(), { passive: true });
    this.BUTTON.addEventListener('click', () => this.scrollToTop());
  }

  private updateButtonVisibility(): void {
    if (!this.BUTTON) return;

    if (window.scrollY > this.SCROLL_THRESHOLD) {
      this.BUTTON.classList.remove('opacity-0', 'invisible');
      this.BUTTON.classList.add('opacity-100', 'visible');
    } else {
      this.BUTTON.classList.add('opacity-0', 'invisible');
      this.BUTTON.classList.remove('opacity-100', 'visible');
    }
  }

  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

/**
 * Initialize all managers
 */
function initializeApp(): void {
  // Theme Manager
  new ThemeManager();

  // Mobile Menu Manager
  new MobileMenuManager();

  // Back to Top Manager
  new BackToTopManager();

  // Add any additional initialization here
  console.log('Hugo Paper theme initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
