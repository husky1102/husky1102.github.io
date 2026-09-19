/* ==========================================================================
   Site scripts and jQuery plugin settings
   ========================================================================== */

(function () {
  var ready = function (callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  };

  ready(function () {
    var root = document.documentElement;
    var prefersDarkMedia = window.matchMedia("(prefers-color-scheme: dark)");
    var browserPref = prefersDarkMedia.matches ? "dark" : "light";
    var themeToggle = document.getElementById("theme-toggle");
    var themeToggleButton = themeToggle ? themeToggle.querySelector("button") : null;
    var themeMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    var themeMotionTimer = null;
    var receivingBlogTheme = false;

    var storeTheme = function (theme) {
      try { localStorage.setItem("theme", theme); } catch (error) { /* Session-only preference. */ }
    };
    var readStoredTheme = function () {
      try { return localStorage.getItem("theme"); } catch (error) { return null; }
    };

    // Set the theme on page load or when explicitly called.
    var setTheme = function (theme) {
      var useTheme =
        theme ||
        readStoredTheme() ||
        root.getAttribute("data-theme") ||
        browserPref;

      var isDark = useTheme === "dark";

      root.toggleAttribute("data-theme", isDark);
      if (isDark) {
        root.setAttribute("data-theme", "dark");
      }

      // Keep the toggle's state, label, and the browser UI color in sync.
      var nextThemeLabel = isDark
        ? (themeToggleButton && themeToggleButton.getAttribute("data-light-label")) || "切换到浅色模式"
        : (themeToggleButton && themeToggleButton.getAttribute("data-dark-label")) || "切换到深色模式";
      if (themeToggleButton) {
        themeToggleButton.setAttribute("aria-pressed", isDark ? "true" : "false");
        themeToggleButton.setAttribute("aria-label", nextThemeLabel);
        themeToggleButton.setAttribute("title", nextThemeLabel);
      }

      var themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", document.body.classList.contains("blog-layout")
          ? (isDark ? "#181a1d" : "#fafaf3") : (isDark ? "#17191d" : "#fbfaf7"));
      }
      if (!receivingBlogTheme) window.dispatchEvent(new CustomEvent("husky:theme-change", { detail: { theme: isDark ? "dark" : "light" } }));
    };

    setTheme();

    var finishThemeSwitch = function () {
      window.clearTimeout(themeMotionTimer);
      themeMotionTimer = null;
      root.classList.remove("is-theme-transitioning");
    };

    var setThemeWithoutMotion = function (theme) {
      finishThemeSwitch();
      root.classList.add("is-theme-syncing");
      setTheme(theme);
      // Commit the non-animated state before restoring ordinary hover transitions.
      void root.offsetWidth;
      root.classList.remove("is-theme-syncing");
    };

    // If user hasn't chosen a theme, follow OS changes.
    var handlePreferenceChange = function (event) {
      if (!readStoredTheme()) {
        setThemeWithoutMotion(event.matches ? "dark" : "light");
      }
    };
    if (prefersDarkMedia.addEventListener) {
      prefersDarkMedia.addEventListener("change", handlePreferenceChange);
    } else if (prefersDarkMedia.addListener) {
      prefersDarkMedia.addListener(handlePreferenceChange);
    }

    var requestThemeSwitch = function () {
      var currentTheme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var newTheme = currentTheme === "dark" ? "light" : "dark";
      var canAnimateTheme = !document.body.classList.contains("blog-layout") && !themeMotionMedia.matches &&
        window.CSS && typeof window.CSS.registerProperty === "function";
      storeTheme(newTheme);
      if (!canAnimateTheme) {
        setThemeWithoutMotion(newTheme);
        return;
      }
      var interrupted = themeMotionTimer !== null;
      var duration = newTheme === "dark" ? 650 : 800;
      window.clearTimeout(themeMotionTimer);
      root.style.setProperty("--theme-duration", duration + "ms");
      root.style.setProperty("--theme-ink-delay", interrupted ? "0ms" : (newTheme === "dark" ? "180ms" : "240ms"));
      root.classList.add("is-theme-transitioning");
      // Native color transitions can reverse from their current rendered values.
      setTheme(newTheme);
      themeMotionTimer = window.setTimeout(finishThemeSwitch, duration);
    };
    if (themeToggleButton) {
      themeToggleButton.addEventListener("click", requestThemeSwitch);
    }
    themeMotionMedia.addEventListener("change", function (event) {
      if (event.matches) { setThemeWithoutMotion(root.getAttribute("data-theme") === "dark" ? "dark" : "light"); }
    });

    if (window.huskyBlogEmbed) window.huskyBlogEmbed.start({
      current: function () { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; },
      receive: function (theme) {
        if (theme !== "dark" && theme !== "light") return;
        receivingBlogTheme = true;
        storeTheme(theme);
        setThemeWithoutMotion(theme);
        receivingBlogTheme = false;
      }
    });

    var scrollProgress = document.querySelector(".scroll-progress span");
    // A retained selection must not leave the whole page using a text cursor.
    var selectingWithMouse = false;
    var cursorMedia = window.matchMedia("(hover: hover) and (pointer: fine) and (forced-colors: none)");
    var finishTextSelection = function () {
      selectingWithMouse = false;
      root.classList.remove("is-selecting-text");
    };
    document.addEventListener("pointerdown", function (event) {
      finishTextSelection();
      selectingWithMouse = event.pointerType === "mouse" && event.button === 0 && cursorMedia.matches;
    });
    document.addEventListener("selectionchange", function () {
      var selection = window.getSelection();
      root.classList.toggle("is-selecting-text", Boolean(selectingWithMouse && selection &&
        !selection.isCollapsed && selection.toString().length));
    });
    window.addEventListener("pointerup", finishTextSelection);
    window.addEventListener("pointercancel", finishTextSelection);
    window.addEventListener("blur", finishTextSelection);
    window.addEventListener("pagehide", finishTextSelection);
    document.addEventListener("pointermove", function (event) {
      // Recover if the mouse was released outside the window.
      if (selectingWithMouse && !(event.buttons & 1)) finishTextSelection();
    }, { passive: true });
    cursorMedia.addEventListener("change", finishTextSelection);

    var backToTop = document.querySelector(".back-to-top");

    var getScrollTop = function () {
      return window.pageYOffset || root.scrollTop || document.body.scrollTop || 0;
    };
    var getDocumentHeight = function () {
      return Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        root.clientHeight,
        root.scrollHeight,
        root.offsetHeight
      );
    };
    var updateScrollProgressFallback = function (scrollTop, scrollHeight) {
      if (!scrollProgress) {
        return;
      }

      var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      scrollProgress.style.width = Math.min(100, Math.max(0, progress)) + "%";
    };
    var scrollChromeTicking = false;
    var updateScrollChrome = function () {
      var scrollTop = getScrollTop();
      var scrollHeight = getDocumentHeight() - window.innerHeight;

      if (root.getAttribute("data-scroll-progress-engine") !== "gsap") {
        updateScrollProgressFallback(scrollTop, scrollHeight);
      }
      if (backToTop) {
        backToTop.classList.toggle("is-visible", scrollTop > window.innerHeight * 0.8);
      }
    };
    var requestScrollChromeUpdate = function () {
      if (scrollChromeTicking) {
        return;
      }

      scrollChromeTicking = true;
      window.requestAnimationFrame(function () {
        updateScrollChrome();
        scrollChromeTicking = false;
      });
    };
    var scrollToTop = function () {
      var start = getScrollTop();
      var duration = 450;
      var startTime = null;
      var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion || start <= 0) {
        window.scrollTo(0, 0);
        return;
      }

      var step = function (timestamp) {
        if (!startTime) {
          startTime = timestamp;
        }

        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(0, Math.round(start * (1 - eased)));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    };

    updateScrollChrome();
    window.addEventListener("scroll", requestScrollChromeUpdate, { passive: true });
    window.addEventListener("resize", requestScrollChromeUpdate);
    document.addEventListener("scroll", requestScrollChromeUpdate, { passive: true });
    if (backToTop) {
      backToTop.addEventListener("click", scrollToTop);
    }

    var copyTextFallback = function (text) {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    };
    var copyCodeText = function (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).catch(function () {
          copyTextFallback(text);
        });
      }

      copyTextFallback(text);
      return Promise.resolve();
    };

    Array.prototype.forEach.call(document.querySelectorAll("div.highlighter-rouge, figure.highlight"), function (codeBlock) {
      var code = codeBlock.querySelector("pre code");

      if (!code || codeBlock.querySelector(".code-copy-button")) {
        return;
      }

      var button = document.createElement("button");
      button.className = "code-copy-button";
      button.type = "button";
      button.setAttribute("aria-label", "Copy code");
      button.setAttribute("title", "Copy code");
      codeBlock.appendChild(button);

      button.addEventListener("click", function () {
        copyCodeText(code.innerText).then(function () {
          button.classList.add("is-copied");
          button.setAttribute("aria-label", "Code copied");
          button.setAttribute("title", "Code copied");
          window.setTimeout(function () {
            button.classList.remove("is-copied");
            button.setAttribute("aria-label", "Copy code");
            button.setAttribute("title", "Copy code");
          }, 1400);
        });
      });
    });

    // These should be the same as the settings in _variables.scss.
    var scssLarge = 925; // pixels

    // FitVids init.
    fitvids();

    // Mobile profile links disclosure.
    var authorUrlsButton = document.getElementById("author-links-toggle");
    var authorUrls = document.getElementById("author-links");
    var setAuthorUrlsState = function (isVisible) {
      if (!authorUrlsButton) {
        return;
      }

      var authorUrlsLabel = isVisible ? "不显示个人资料与链接" : "显示个人资料与链接";
      authorUrlsButton.classList.toggle("open", isVisible);
      authorUrlsButton.setAttribute("aria-expanded", isVisible ? "true" : "false");
      authorUrlsButton.setAttribute("aria-label", authorUrlsLabel);
      authorUrlsButton.setAttribute("title", authorUrlsLabel);
    };
    var setAuthorUrlsVisible = function (isVisible) {
      if (!authorUrls) {
        return;
      }

      authorUrls.style.display = isVisible ? "block" : "none";
      setAuthorUrlsState(isVisible);
    };
    if (authorUrlsButton && authorUrls) {
      authorUrlsButton.addEventListener("click", function () {
        var isHidden = window.getComputedStyle(authorUrls).display === "none";

        setAuthorUrlsVisible(isHidden);
      });
    }

    // Clear mobile disclosure state when the desktop layout takes over. This
    // also lets the CSS default close the disclosure after returning to mobile.
    window.addEventListener("resize", function () {
      if (authorUrls && authorUrlsButton && window.innerWidth >= scssLarge) {
        authorUrls.style.removeProperty("display");
        setAuthorUrlsState(false);
      }
    });

    // init smooth scroll, this needs to be slightly more than then fixed masthead height
    $("a").smoothScroll({
      offset: -75, // needs to match $masthead-height
      preventDefault: false,
    });

    // add lightbox class to all image links
    // Add "image-popup" to links ending in image extensions,
    // but skip any <a> that already contains an <img>
    $("a[href$='.jpg'],\
    a[href$='.jpeg'],\
    a[href$='.JPG'],\
    a[href$='.png'],\
    a[href$='.gif'],\
    a[href$='.webp']")
        .not(':has(img)')
        .addClass("image-popup");

    // 1) Wrap every <p><img> (except emoji images) in an <a> pointing at the image, and give it the lightbox class
    $('p > img').not('.emoji').each(function() {
      var $img = $(this);
      // skip if it’s already wrapped in an <a.image-popup>
      if ( ! $img.parent().is('a.image-popup') ) {
        $('<a>')
          .addClass('image-popup')
          .attr('href', $img.attr('src'))
          .insertBefore($img)   // place the <a> right before the <img>
          .append($img);        // move the <img> into the <a>
      }
    });

    // Magnific-Popup options
    $(".image-popup").magnificPopup({
      type: 'image',
      tLoading: 'Loading image #%curr%...',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
      },
      image: {
        tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
      },
      removalDelay: 500, // Delay in milliseconds before popup is removed
      // Class that is added to body when popup is open.
      // make it unique to apply your CSS animations just to this exact popup
      mainClass: 'mfp-zoom-in',
      callbacks: {
        beforeOpen: function () {
          // just a hack that adds mfp-anim class to markup
          this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
        }
      },
      closeOnContentClick: true,
      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });
  });
}());
