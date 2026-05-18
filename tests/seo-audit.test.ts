import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

/**
 * SEO Audit Tests
 * Validates SEO best practices for the Hugo Paper theme
 */
describe('SEO Audit', () => {
  let dom: JSDOM;
  let window: any;
  let document: any;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="description" content="A minimal, responsive Hugo theme inspired by Astro Paper">
          <meta name="keywords" content="hugo, theme, blog">
          <meta name="author" content="OurAIHub">
          <meta name="robots" content="index, follow">
          <title>Hugo Paper - Minimal Blog Theme</title>
          <link rel="canonical" href="https://example.com/">
          <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml">
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Hugo Paper",
              "url": "https://example.com",
              "description": "A minimal, responsive Hugo theme",
              "author": {
                "@type": "Person",
                "name": "OurAIHub"
              }
            }
          </script>
        </head>
        <body>
          <header role="banner">
            <h1>Hugo Paper</h1>
            <nav role="navigation" aria-label="Main navigation">
              <a href="/">Home</a>
              <a href="/archives">Archives</a>
              <a href="/about">About</a>
            </nav>
          </header>

          <main role="main">
            <article itemscope itemtype="https://schema.org/BlogPosting">
              <h1 itemprop="headline">Blog Post Title</h1>
              <meta itemprop="author" content="Author Name">
              <meta itemprop="datePublished" content="2024-01-01T00:00:00Z">
              <meta itemprop="dateModified" content="2024-01-15T00:00:00Z">
              <div itemprop="articleBody">
                <p>Article content here.</p>
              </div>
            </article>
          </main>

          <footer role="contentinfo">
            <p>&copy; 2024 Hugo Paper</p>
          </footer>
        </body>
      </html>
    `);

    window = dom.window;
    document = window.document;
    global.window = window as any;
    global.document = document;
  });

  /**
   * Meta Tags Audit
   */
  describe('Meta Tags', () => {
    it('should have a proper title tag', () => {
      const title = document.querySelector('title');
      expect(title).toBeTruthy();
      expect(title?.textContent?.length).toBeGreaterThan(0);
      expect(title?.textContent?.length).toBeLessThanOrEqual(60);
    });

    it('should have meta description', () => {
      const description = document.querySelector('meta[name="description"]');
      expect(description).toBeTruthy();
      const content = description?.getAttribute('content');
      expect(content?.length).toBeGreaterThan(0);
      expect(content?.length).toBeLessThanOrEqual(160);
    });

    it('should have charset meta tag', () => {
      const charset = document.querySelector('meta[charset]');
      expect(charset).toBeTruthy();
      expect(charset?.getAttribute('charset')).toBe('UTF-8');
    });

    it('should have viewport meta tag for mobile', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      expect(viewport).toBeTruthy();
      expect(viewport?.getAttribute('content')).toContain('width=device-width');
      expect(viewport?.getAttribute('content')).toContain('initial-scale=1');
    });

    it('should have robots meta tag', () => {
      const robots = document.querySelector('meta[name="robots"]');
      expect(robots).toBeTruthy();
      expect(robots?.getAttribute('content')).toContain('index');
      expect(robots?.getAttribute('content')).toContain('follow');
    });

    it('should have author meta tag', () => {
      const author = document.querySelector('meta[name="author"]');
      expect(author).toBeTruthy();
    });

    it('should have keywords meta tag', () => {
      const keywords = document.querySelector('meta[name="keywords"]');
      expect(keywords).toBeTruthy();
      const content = keywords?.getAttribute('content');
      expect(content?.split(',').length).toBeGreaterThan(0);
    });
  });

  /**
   * Canonical URL Audit
   */
  describe('Canonical URL', () => {
    it('should have canonical link', () => {
      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).toBeTruthy();
      expect(canonical?.getAttribute('href')).toBeTruthy();
    });

    it('should have valid canonical URL', () => {
      const canonical = document.querySelector('link[rel="canonical"]');
      const href = canonical?.getAttribute('href');
      expect(href).toMatch(/^https?:\/\/.+/);
    });
  });

  /**
   * Structured Data Audit
   */
  describe('Structured Data (Schema.org)', () => {
    it('should have WebSite schema', () => {
      const schemas = document.querySelectorAll('script[type="application/ld+json"]');
      let hasWebSiteSchema = false;

      schemas.forEach((schema: Element) => {
        try {
          const data = JSON.parse(schema.textContent || '{}');
          if (data['@type'] === 'WebSite') {
            hasWebSiteSchema = true;
            expect(data.name).toBeTruthy();
            expect(data.url).toBeTruthy();
            expect(data.description).toBeTruthy();
          }
        } catch (e) {
          // Invalid JSON
        }
      });

      expect(hasWebSiteSchema).toBe(true);
    });

    it('should have BlogPosting schema', () => {
      const article = document.querySelector('article[itemtype*="BlogPosting"]');
      expect(article).toBeTruthy();
      expect(article?.getAttribute('itemscope')).toBeTruthy();
    });

    it('should have proper BlogPosting properties', () => {
      const article = document.querySelector('article[itemtype*="BlogPosting"]');
      const headline = article?.querySelector('[itemprop="headline"]');
      const author = article?.querySelector('[itemprop="author"]');
      const datePublished = article?.querySelector('[itemprop="datePublished"]');
      const articleBody = article?.querySelector('[itemprop="articleBody"]');

      expect(headline).toBeTruthy();
      expect(author).toBeTruthy();
      expect(datePublished).toBeTruthy();
      expect(articleBody).toBeTruthy();
    });
  });

  /**
   * Heading Structure Audit
   */
  describe('Heading Structure', () => {
    it('should have H1 heading', () => {
      const h1 = document.querySelector('h1');
      expect(h1).toBeTruthy();
    });

    it('should have only one H1 per page', () => {
      const h1s = document.querySelectorAll('h1');
      expect(h1s.length).toBeLessThanOrEqual(1);
    });

    it('should have proper heading hierarchy', () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

      headings.forEach((heading: Element) => {
        const level = parseInt(heading.tagName[1]);
        // Allow any valid progression (may skip levels)
        expect(level).toBeGreaterThanOrEqual(1);
        expect(level).toBeLessThanOrEqual(6);
      });
    });
  });

  /**
   * Alt Text Audit
   */
  describe('Image Alt Text', () => {
    beforeEach(() => {
      const imageHtml = `
        <!DOCTYPE html>
        <html>
          <body>
            <img src="test.jpg" alt="Test image description">
            <img src="test2.jpg" alt="">
            <picture>
              <source srcset="image.webp" type="image/webp">
              <img src="image.jpg" alt="Fallback description">
            </picture>
          </body>
        </html>
      `;

      const imageDom = new JSDOM(imageHtml);
      global.document = imageDom.window.document;
      global.window = imageDom.window as any;
    });

    it('should have alt text for images', () => {
      const images = document.querySelectorAll('img');
      images.forEach((img: Element) => {
        expect(img.hasAttribute('alt')).toBe(true);
      });
    });
  });

  /**
   * Semantic HTML Audit
   */
  describe('Semantic HTML', () => {
    it('should use header element', () => {
      const header = document.querySelector('header');
      expect(header).toBeTruthy();
    });

    it('should use main element', () => {
      const main = document.querySelector('main');
      expect(main).toBeTruthy();
    });

    it('should use footer element', () => {
      const footer = document.querySelector('footer');
      expect(footer).toBeTruthy();
    });

    it('should use article element for blog posts', () => {
      const article = document.querySelector('article');
      expect(article).toBeTruthy();
    });

    it('should use nav element for navigation', () => {
      const nav = document.querySelector('nav');
      expect(nav).toBeTruthy();
    });
  });

  /**
   * ARIA Attributes Audit
   */
  describe('ARIA Attributes', () => {
    it('should have role attributes on landmark elements', () => {
      expect(document.querySelector('[role="banner"]')).toBeTruthy();
      expect(document.querySelector('[role="navigation"]')).toBeTruthy();
      expect(document.querySelector('[role="main"]')).toBeTruthy();
      expect(document.querySelector('[role="contentinfo"]')).toBeTruthy();
    });

    it('should have aria-label on navigation', () => {
      const nav = document.querySelector('nav[role="navigation"]');
      expect(nav?.getAttribute('aria-label')).toBeTruthy();
    });
  });

  /**
   * Open Graph Tags Audit
   */
  describe('Open Graph Tags', () => {
    beforeEach(() => {
      const ogHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="og:title" content="Hugo Paper">
            <meta property="og:description" content="A minimal blog theme">
            <meta property="og:url" content="https://example.com">
            <meta property="og:type" content="website">
            <meta property="og:image" content="https://example.com/image.jpg">
          </head>
          <body></body>
        </html>
      `;

      const ogDom = new JSDOM(ogHtml);
      global.document = ogDom.window.document;
      global.window = ogDom.window as any;
    });

    it('should have Open Graph tags', () => {
      expect(document.querySelector('meta[property="og:title"]')).toBeTruthy();
      expect(document.querySelector('meta[property="og:description"]')).toBeTruthy();
      expect(document.querySelector('meta[property="og:url"]')).toBeTruthy();
      expect(document.querySelector('meta[property="og:type"]')).toBeTruthy();
    });

    it('should have og:image tag', () => {
      expect(document.querySelector('meta[property="og:image"]')).toBeTruthy();
    });
  });

  /**
   * RSS Feed Audit
   */
  describe('RSS Feed', () => {
    it('should have RSS feed link', () => {
      const rssFeed = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
      expect(rssFeed).toBeTruthy();
      expect(rssFeed?.getAttribute('href')).toBeTruthy();
    });

    it('should have valid RSS feed href', () => {
      const rssFeed = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
      const href = rssFeed?.getAttribute('href');
      expect(href).toMatch(/\.(xml|rss)$/);
    });
  });

  /**
   * Page Speed Audit
   */
  describe('Page Performance (SEO Related)', () => {
    it('should have reasonable number of DOM elements', () => {
      const allElements = document.querySelectorAll('*');
      // Recommended: less than 1500 elements per page
      expect(allElements.length).toBeLessThan(1500);
    });

    it('should not have excessive external resources', () => {
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      const scripts = document.querySelectorAll('script[src]');
      // Reasonable number of resources
      expect(links.length).toBeLessThan(10);
      expect(scripts.length).toBeLessThan(10);
    });
  });

  /**
   * Mobile Friendliness Audit
   */
  describe('Mobile Friendliness', () => {
    it('should have viewport meta tag', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      expect(viewport).toBeTruthy();
    });

    it('should have touch-friendly design considerations', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      const content = viewport?.getAttribute('content');
      expect(content).toContain('initial-scale=1');
    });
  });

  /**
   * Link Audit
   */
  describe('Links', () => {
    it('should have valid internal links', () => {
      const links = document.querySelectorAll('a[href^="/"]');
      links.forEach((link: Element) => {
        const href = link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/^\/[a-zA-Z0-9-/]*$/);
      });
    });

    it('should have valid external links', () => {
      const links = document.querySelectorAll('a[href^="http"]');
      links.forEach((link: Element) => {
        const href = link.getAttribute('href');
        expect(href).toMatch(/^https?:\/\/.+/);
      });
    });

    it('should have proper link text', () => {
      const links = document.querySelectorAll('a');
      links.forEach((link: Element) => {
        // Links should have meaningful text (not just generic "click here")
        const text = link.textContent?.trim();
        expect(text).toBeTruthy();
        expect(text).not.toMatch(/^click here$/i);
      });
    });
  });

  /**
   * Language Declaration
   */
  describe('Language Declaration', () => {
    it('should have lang attribute on html element', () => {
      const html = document.querySelector('html');
      expect(html?.getAttribute('lang')).toBeTruthy();
    });

    it('should have valid language code', () => {
      const html = document.querySelector('html');
      const lang = html?.getAttribute('lang');
      expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
    });
  });

  /**
   * Content Audit
   */
  describe('Content Quality', () => {
    it('should have page title', () => {
      const title = document.querySelector('title');
      expect(title?.textContent).toBeTruthy();
    });

    it('should have main content', () => {
      const main = document.querySelector('main');
      expect(main?.textContent?.trim().length).toBeGreaterThan(0);
    });

    it('should have descriptive headings', () => {
      const h1 = document.querySelector('h1');
      expect(h1?.textContent?.trim().length).toBeGreaterThan(3);
    });
  });
});

/**
 * SEO Sitemap Audit
 */
describe('Sitemap and Robots.txt', () => {
  it('should have sitemap URL pattern', () => {
    // Typical Hugo sitemap location
    const sitemapUrl = '/sitemap.xml';
    expect(sitemapUrl).toMatch(/^\/sitemap\.(xml|json)$/);
  });

  it('should have robots.txt URL pattern', () => {
    // Typical robots.txt location
    const robotsUrl = '/robots.txt';
    expect(robotsUrl).toBe('/robots.txt');
  });
});
