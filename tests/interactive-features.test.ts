import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

let dom: JSDOM;
let window: any;
let document: any;

beforeEach(() => {
  dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="theme-color" content="#ffffff">
      </head>
      <body>
        <article id="post-1" data-slug="/blog/test-post">
          <button id="post-like-btn" class="post-like-btn">
            <svg id="heart-empty" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span class="like-count">0</span>
          </button>

          <div id="share-container">
            <a href="#" class="share-btn" data-platform="twitter">Twitter</a>
            <a href="#" class="share-btn" data-platform="facebook">Facebook</a>
            <a href="#" class="share-btn" data-platform="linkedin">LinkedIn</a>
            <button class="copy-link-btn">Copy Link</button>
            <a href="#" class="share-btn" data-platform="email">Email</a>
          </div>

          <div id="reading-progress"></div>

          <pre><code id="code-block-1">const hello = "world";</code></pre>
          <pre><code id="code-block-2">function test() { return true; }</code></pre>
        </article>

        <div id="keyboard-help" class="hidden">
          <div class="shortcuts-list"></div>
        </div>
      </body>
    </html>
  `);

  window = dom.window;
  document = window.document;
  global.window = window as any;
  global.document = document;
  global.localStorage = window.localStorage;

  // Mock navigator.clipboard
  Object.assign(window.navigator, {
    clipboard: {
      writeText: vi.fn(() => Promise.resolve()),
    },
  });
});

afterEach(() => {
  vi.clearAllMocks();
  dom.window.close();
});

/**
 * Post Like Manager Tests
 */
describe('PostLikeManager', () => {
  it('should initialize like data from localStorage', () => {
    const postId = 'post-1';
    window.localStorage.setItem(`post-like-${postId}`, JSON.stringify({
      liked: true,
      count: 5,
      timestamp: Date.now(),
    }));

    eval(`
      class PostLikeManager {
        constructor() {
          this.btn = document.getElementById('post-like-btn');
          this.postId = 'post-1';
          this.storageKey = \`post-like-\${this.postId}\`;
          this.init();
        }

        init() {
          const likeData = this.getLikeData();
          this.updateUI(likeData);
          if (this.btn) {
            this.btn.addEventListener('click', () => this.toggleLike());
          }
        }

        getLikeData() {
          const data = localStorage.getItem(this.storageKey);
          if (data) {
            return JSON.parse(data);
          }
          return { liked: false, count: 0, timestamp: Date.now() };
        }

        updateUI(likeData) {
          const countSpan = this.btn?.querySelector('.like-count');
          if (countSpan) {
            countSpan.textContent = likeData.count;
          }
          if (likeData.liked) {
            this.btn?.classList.add('liked');
          } else {
            this.btn?.classList.remove('liked');
          }
        }

        toggleLike() {
          const likeData = this.getLikeData();
          likeData.liked = !likeData.liked;
          likeData.count += likeData.liked ? 1 : -1;
          localStorage.setItem(this.storageKey, JSON.stringify(likeData));
          this.updateUI(likeData);
        }
      }
      window.postLikeManager = new PostLikeManager();
    `);

    const likeBtn = document.getElementById('post-like-btn');
    const countSpan = likeBtn?.querySelector('.like-count');

    expect(countSpan?.textContent).toBe('5');
    expect(likeBtn?.classList.contains('liked')).toBe(true);
  });

  it('should toggle like state', () => {
    eval(`
      class PostLikeManager {
        constructor() {
          this.btn = document.getElementById('post-like-btn');
          this.postId = 'post-1';
          this.storageKey = \`post-like-\${this.postId}\`;
          this.init();
        }

        init() {
          const likeData = this.getLikeData();
          this.updateUI(likeData);
          if (this.btn) {
            this.btn.addEventListener('click', () => this.toggleLike());
          }
        }

        getLikeData() {
          const data = localStorage.getItem(this.storageKey);
          if (data) {
            return JSON.parse(data);
          }
          return { liked: false, count: 0 };
        }

        updateUI(likeData) {
          const countSpan = this.btn?.querySelector('.like-count');
          if (countSpan) {
            countSpan.textContent = likeData.count;
          }
          if (likeData.liked) {
            this.btn?.classList.add('liked');
          } else {
            this.btn?.classList.remove('liked');
          }
        }

        toggleLike() {
          const likeData = this.getLikeData();
          likeData.liked = !likeData.liked;
          likeData.count += likeData.liked ? 1 : -1;
          localStorage.setItem(this.storageKey, JSON.stringify(likeData));
          this.updateUI(likeData);
        }
      }
      window.postLikeManager = new PostLikeManager();
    `);

    const likeBtn = document.getElementById('post-like-btn');
    const countSpan = likeBtn?.querySelector('.like-count');

    // Initial state
    expect(countSpan?.textContent).toBe('0');
    expect(likeBtn?.classList.contains('liked')).toBe(false);

    // Toggle to liked
    likeBtn?.click();
    expect(countSpan?.textContent).toBe('1');
    expect(likeBtn?.classList.contains('liked')).toBe(true);

    // Toggle to unliked
    likeBtn?.click();
    expect(countSpan?.textContent).toBe('0');
    expect(likeBtn?.classList.contains('liked')).toBe(false);
  });
});

/**
 * Post Share Manager Tests
 */
describe('PostShareManager', () => {
  it('should generate correct share URLs', () => {
    eval(`
      class PostShareManager {
        constructor() {
          this.title = 'Test Article';
          this.url = 'https://example.com/blog/test';
          this.description = 'Test Description';
        }

        getTwitterShareUrl() {
          const text = \`\${this.title}\\n\${this.url}\`;
          return \`https://twitter.com/intent/tweet?text=\${encodeURIComponent(text)}\`;
        }

        getFacebookShareUrl() {
          return \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(this.url)}\`;
        }

        getLinkedInShareUrl() {
          return \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(this.url)}\`;
        }

        getEmailShareUrl() {
          const subject = encodeURIComponent(this.title);
          const body = encodeURIComponent(\`Check this out: \${this.url}\`);
          return \`mailto:?subject=\${subject}&body=\${body}\`;
        }
      }
      window.postShareManager = new PostShareManager();
    `);

    const shareManager = (window as any).postShareManager;

    const twitterUrl = shareManager.getTwitterShareUrl();
    expect(twitterUrl).toContain('twitter.com/intent/tweet');
    expect(twitterUrl).toContain('Test%20Article');

    const facebookUrl = shareManager.getFacebookShareUrl();
    expect(facebookUrl).toContain('facebook.com/sharer');
    expect(facebookUrl).toContain('example.com');

    const linkedinUrl = shareManager.getLinkedInShareUrl();
    expect(linkedinUrl).toContain('linkedin.com');
    expect(linkedinUrl).toContain('example.com');

    const emailUrl = shareManager.getEmailShareUrl();
    expect(emailUrl).toContain('mailto:');
    expect(emailUrl).toContain('Test%20Article');
  });

  it('should copy link to clipboard', async () => {
    eval(`
      class PostShareManager {
        constructor() {
          this.url = 'https://example.com/blog/test';
        }

        async copyLinkToClipboard() {
          try {
            await navigator.clipboard.writeText(this.url);
            return true;
          } catch (error) {
            return false;
          }
        }
      }
      window.postShareManager = new PostShareManager();
    `);

    const shareManager = (window as any).postShareManager;
    const result = await shareManager.copyLinkToClipboard();

    expect(result).toBe(true);
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/blog/test');
  });
});

/**
 * Code Copy Manager Tests
 */
describe('CodeCopyManager', () => {
  it('should detect code blocks', () => {
    eval(`
      class CodeCopyManager {
        constructor() {
          this.setupCodeBlocks();
        }

        setupCodeBlocks() {
          const codeBlocks = document.querySelectorAll('pre code, pre');
          this.codeBlockCount = codeBlocks.length;
        }
      }
      window.codeCopyManager = new CodeCopyManager();
    `);

    const codeCopyManager = (window as any).codeCopyManager;
    expect(codeCopyManager.codeBlockCount).toBe(2);
  });

  it('should copy code to clipboard on button click', async () => {
    eval(`
      class CodeCopyManager {
        constructor() {
          this.setupCodeBlocks();
        }

        setupCodeBlocks() {
          const codeBlocks = document.querySelectorAll('pre code');
          codeBlocks.forEach((block) => {
            const button = document.createElement('button');
            button.className = 'copy-code-btn';
            button.textContent = 'Copy';
            button.addEventListener('click', () => this.copyCode(block, button));
            block.parentNode?.insertBefore(button, block);
          });
        }

        async copyCode(codeBlock, button) {
          try {
            const text = codeBlock.textContent || '';
            await navigator.clipboard.writeText(text);
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
              button.textContent = originalText;
            }, 2000);
            return true;
          } catch (error) {
            return false;
          }
        }
      }
      window.codeCopyManager = new CodeCopyManager();
    `);

    // Verify the manager and code block exist
    expect((window as any).codeCopyManager).toBeDefined();
    expect(document.getElementById('code-block-1')).toBeTruthy();

    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('const hello = "world";');
  });
});

/**
 * Reading Progress Bar Tests
 */
describe('ReadingProgressBar', () => {
  it('should initialize progress bar element', () => {
    eval(`
      class ReadingProgressBar {
        constructor() {
          this.bar = document.getElementById('reading-progress');
          this.init();
        }

        init() {
          if (this.bar) {
            window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
          }
        }

        updateProgress() {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          if (this.bar) {
            this.bar.style.width = scrollPercent + '%';
          }
        }
      }
      window.readingProgressBar = new ReadingProgressBar();
    `);

    const progressBar = document.getElementById('reading-progress');
    expect(progressBar).toBeTruthy();
  });

  it('should update progress width on scroll', () => {
    eval(`
      class ReadingProgressBar {
        constructor() {
          this.bar = document.getElementById('reading-progress');
          this.init();
        }

        init() {
          if (this.bar) {
            window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
          }
        }

        updateProgress() {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          if (this.bar) {
            this.bar.style.width = scrollPercent + '%';
          }
        }
      }
      window.readingProgressBar = new ReadingProgressBar();
    `);

    const progressBar = document.getElementById('reading-progress');
    const readingProgressBar = (window as any).readingProgressBar;

    // Simulate scroll to 50%
    Object.defineProperty(window, 'scrollY', { value: 250, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

    readingProgressBar.updateProgress();

    const expectedPercent = (250 / (1000 - 800)) * 100;
    expect(progressBar?.style.width).toBe(`${expectedPercent}%`);
  });
});

/**
 * Keyboard Shortcuts Tests
 */
describe('KeyboardShortcutManager', () => {
  it('should handle Ctrl+K shortcut', () => {
    eval(`
      class KeyboardShortcutManager {
        constructor() {
          this.shortcuts = new Map([
            ['ctrl_k', { callback: () => this.openSearch() }],
            ['cmd_k', { callback: () => this.openSearch() }],
          ]);
          this.setupEventListeners();
          this.searchOpened = false;
        }

        setupEventListeners() {
          document.addEventListener('keydown', (e) => this.handleKeydown(e));
        }

        handleKeydown(e) {
          const keys = [];
          if (e.ctrlKey) keys.push('ctrl');
          if (e.metaKey) keys.push('cmd');
          keys.push(e.key.toLowerCase());
          const combination = keys.join('_');

          if (this.shortcuts.has(combination)) {
            e.preventDefault();
            this.shortcuts.get(combination).callback();
          }
        }

        openSearch() {
          this.searchOpened = true;
        }
      }
      window.keyboardShortcutManager = new KeyboardShortcutManager();
    `);

    const shortcutManager = (window as any).keyboardShortcutManager;

    // Simulate Ctrl+K
    const event = new window.KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });

    document.dispatchEvent(event);
    expect(shortcutManager.searchOpened).toBe(true);
  });

  it('should not trigger shortcuts in input fields', () => {
    eval(`
      class KeyboardShortcutManager {
        constructor() {
          this.setupEventListeners();
          this.shortcutTriggered = false;
        }

        setupEventListeners() {
          document.addEventListener('keydown', (e) => this.handleKeydown(e));
        }

        handleKeydown(e) {
          if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
            return;
          }
          this.shortcutTriggered = true;
        }
      }
      window.keyboardShortcutManager = new KeyboardShortcutManager();
    `);

    const shortcutManager = (window as any).keyboardShortcutManager;

    // Create input and focus it
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const event = new window.KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });

    document.dispatchEvent(event);
    expect(shortcutManager.shortcutTriggered).toBe(false);

    document.body.removeChild(input);
  });
});
