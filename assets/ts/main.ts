/**
 * Main Script
 * 参考: astro-paper/src/layouts/PostDetails.astro 中的 <script> 标签
 *
 * 这个脚本在页面加载后运行，处理各种交互功能
 * 注意：主题切换由 toggle-theme.js 处理，不在这里
 */

import { CodeEnhancer } from "./code-enhance";

/**
 * Create a progress indicator at the top
 * 参考: createProgressBar() in PostDetails.astro
 */
function createProgressBar(): void {
  // Create the main container div
  const progressContainer = document.createElement("div");
  progressContainer.className =
    "progress-container fixed top-0 z-10 h-1 w-full bg-background";

  // Create the progress bar div
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar h-1 w-0 bg-accent";
  progressBar.id = "myBar";

  // Append the progress bar to the progress container
  progressContainer.appendChild(progressBar);

  // Append the progress container to the document body
  document.body.appendChild(progressContainer);
}

/**
 * Update the progress bar when user scrolls
 * 参考: updateScrollProgress() in PostDetails.astro
 */
function updateScrollProgress(): void {
  document.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    const myBar = document.getElementById("myBar");
    if (myBar) {
      myBar.style.width = scrolled + "%";
    }
  });
}

/**
 * Attaches links to headings in the document,
 * allowing sharing of sections easily
 * 参考: addHeadingLinks() in PostDetails.astro
 */
function addHeadingLinks(): void {
  const headings = Array.from(document.querySelectorAll("h2, h3, h4, h5, h6"));

  for (const heading of headings) {
    heading.classList.add("group");
    const link = document.createElement("a");
    link.className =
      "heading-link ms-2 no-underline opacity-75 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100";
    link.href = "#" + heading.id;

    const span = document.createElement("span");
    span.ariaHidden = "true";
    span.innerText = "#";
    link.appendChild(span);
    heading.appendChild(link);
  }
}

/**
 * Attaches copy buttons to code blocks in the document,
 * allowing users to copy code easily
 * 参考: attachCopyButtons() in PostDetails.astro
 */
function attachCopyButtons(): void {
  const copyButtonLabel = "Copy";
  const codeBlocks = Array.from(document.querySelectorAll("pre"));

  for (const codeBlock of codeBlocks) {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    // Check if --file-name-offset custom property exists
    const computedStyle = getComputedStyle(codeBlock);
    const hasFileNameOffset =
      computedStyle.getPropertyValue("--file-name-offset").trim() !== "";

    // Determine the top positioning class
    const topClass = hasFileNameOffset ? "top-(--file-name-offset)" : "-top-3";

    const copyButton = document.createElement("button");
    copyButton.className = `copy-code absolute end-3 ${topClass} rounded bg-muted border border-muted px-2 py-1 text-xs leading-4 text-foreground font-medium`;
    copyButton.innerHTML = copyButtonLabel;
    codeBlock.setAttribute("tabindex", "0");
    codeBlock.appendChild(copyButton);

    // wrap codeblock with relative parent element
    codeBlock?.parentNode?.insertBefore(wrapper, codeBlock);
    wrapper.appendChild(codeBlock);

    copyButton.addEventListener("click", async () => {
      await copyCode(codeBlock, copyButton);
    });
  }

  async function copyCode(
    block: Element,
    button: HTMLButtonElement,
  ): Promise<void> {
    const code = block.querySelector("code");
    const text = code?.innerText;

    await navigator.clipboard.writeText(text ?? "");

    // visual feedback that task is completed
    button.innerText = "Copied";

    setTimeout(() => {
      button.innerText = copyButtonLabel;
    }, 700);
  }
}

/**
 * Toggle navigation menu (mobile)
 * 参考: toggleNav() in Header.astro
 */
function toggleNav(): void {
  const menuBtn = document.querySelector("#menu-btn");
  const menuItems = document.querySelector("#menu-items");
  const menuIcon = document.querySelector("#menu-icon");
  const closeIcon = document.querySelector("#close-icon");

  if (!menuBtn || !menuItems || !menuIcon || !closeIcon) return;

  menuBtn.addEventListener("click", () => {
    const openMenu = menuBtn.getAttribute("aria-expanded") === "true";

    menuBtn.setAttribute("aria-expanded", openMenu ? "false" : "true");
    menuBtn.setAttribute("aria-label", openMenu ? "Open Menu" : "Close Menu");

    menuItems.classList.toggle("hidden");
    menuItems.classList.toggle("grid"); // Add grid layout when menu is open on mobile
    menuIcon.classList.toggle("hidden");
    closeIcon.classList.toggle("hidden");
  });
}

/**
 * Scrolls the document to the top when the "Back to Top" button is clicked
 * 参考: backToTop() in BackToTopButton.astro
 */
function backToTop(): void {
  const rootElement = document.documentElement;
  const btnContainer = document.querySelector("#btt-btn-container");
  const backToTopBtn = document.querySelector("[data-button='back-to-top']");
  const progressIndicator = document.querySelector("#progress-indicator");

  if (!rootElement || !btnContainer || !backToTopBtn || !progressIndicator)
    return;

  // Attach click event handler for back-to-top button
  backToTopBtn.addEventListener("click", () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });

  // Handle button visibility according to scroll position
  let lastVisible: boolean | null = null;
  function handleScroll(): void {
    const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
    const scrollTop = rootElement.scrollTop;
    const scrollPercent = Math.floor((scrollTop / scrollTotal) * 100);

    // Update progress indicator (conic-gradient)
    if (progressIndicator) {
      progressIndicator.setAttribute(
        "style",
        `background-image: conic-gradient(var(--accent), var(--accent) ${scrollPercent}%, transparent ${scrollPercent}%)`,
      );
    }

    // Show/hide button when scroll > 30%
    const isVisible = scrollTop / scrollTotal > 0.3;

    if (isVisible !== lastVisible && btnContainer) {
      btnContainer.classList.toggle("opacity-100", isVisible);
      btnContainer.classList.toggle("translate-y-0", isVisible);
      btnContainer.classList.toggle("opacity-0", !isVisible);
      btnContainer.classList.toggle("translate-y-14", !isVisible);
      lastVisible = isVisible;
    }
  }

  // Use requestAnimationFrame for better performance
  let ticking = false;
  document.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

/**
 * 初始化代码增强功能
 * 根据配置决定使用 CodeEnhancer（Shiki 模式）还是传统的 attachCopyButtons（Basic 模式）
 * Requirements: 1.4, 8.3
 */
function initCodeEnhancement(): void {
  // 从 HTML 元素读取配置
  const codeHighlightEngine =
    document.documentElement.dataset.codeEngine || "basic";
  const showDiff = document.documentElement.dataset.codeDiff !== "false";
  const showHighlight =
    document.documentElement.dataset.codeHighlight !== "false";

  if (codeHighlightEngine === "shiki") {
    // Shiki 模式：使用 CodeEnhancer
    const enhancer = new CodeEnhancer(showDiff, showHighlight);
    enhancer.init();
  } else {
    // Basic 模式：使用传统的 attachCopyButtons
    attachCopyButtons();
  }
}

/**
 * Initialize all features
 * 只在文章详情页运行某些功能
 */
function initializeApp(): void {
  // 汉堡菜单 - 所有页面
  toggleNav();

  // 以下功能只在文章详情页运行
  const isPostPage = document.querySelector("#article") !== null;

  if (isPostPage) {
    createProgressBar();
    updateScrollProgress();
    addHeadingLinks();
    initCodeEnhancement(); // 使用新的代码增强初始化函数
    backToTop();
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
