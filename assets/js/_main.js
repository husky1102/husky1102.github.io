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
    var themeIcon = document.getElementById("theme-icon");
    var themeMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    var themeSwitchInProgress = false;

    // Set the theme on page load or when explicitly called.
    var setTheme = function (theme) {
      var useTheme =
        theme ||
        localStorage.getItem("theme") ||
        root.getAttribute("data-theme") ||
        browserPref;

      var isDark = useTheme === "dark";

      root.toggleAttribute("data-theme", isDark);
      if (isDark) {
        root.setAttribute("data-theme", "dark");
      }

      if (themeIcon) {
        themeIcon.classList.toggle("fa-sun", !isDark);
        themeIcon.classList.toggle("fa-moon", isDark);
      }

      // Keep the toggle's state, label, and the browser UI color in sync.
      var nextThemeLabel = isDark ? "切换到浅色模式" : "切换到深色模式";
      if (themeToggleButton) {
        themeToggleButton.setAttribute("aria-pressed", isDark ? "true" : "false");
        themeToggleButton.setAttribute("aria-label", nextThemeLabel);
        themeToggleButton.setAttribute("title", nextThemeLabel);
      }

      var themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", isDark ? "#17191d" : "#fbfaf7");
      }
    };

    setTheme();

    var setThemeWithoutMotion = function (theme) {
      root.classList.add("is-theme-syncing");
      setTheme(theme);
      window.requestAnimationFrame(function () {
        root.classList.remove("is-theme-syncing");
      });
    };

    // If user hasn't chosen a theme, follow OS changes.
    var handlePreferenceChange = function (event) {
      if (!localStorage.getItem("theme")) {
        setThemeWithoutMotion(event.matches ? "dark" : "light");
      }
    };
    if (prefersDarkMedia.addEventListener) {
      prefersDarkMedia.addEventListener("change", handlePreferenceChange);
    } else if (prefersDarkMedia.addListener) {
      prefersDarkMedia.addListener(handlePreferenceChange);
    }

    // Toggle the theme manually.
    var toggleTheme = function () {
      if (themeSwitchInProgress) {
        return;
      }

      var currentTheme = root.getAttribute("data-theme");
      var newTheme = currentTheme === "dark" ? "light" : "dark";
      var canAnimateTheme =
        themeToggleButton &&
        !themeMotionMedia.matches &&
        typeof document.startViewTransition === "function";
      var finishThemeSwitch = function () {
        root.classList.remove("is-theme-transitioning");
        if (themeToggle) {
          themeToggle.classList.remove("is-switching");
        }
        themeSwitchInProgress = false;
      };

      themeSwitchInProgress = true;

      if (themeToggle) {
        themeToggle.classList.add("is-switching");
      }

      if (!canAnimateTheme) {
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
        window.setTimeout(finishThemeSwitch, 320);
        return;
      }

      var themeToggleBounds = themeToggleButton.getBoundingClientRect();
      var themeTransitionX = themeToggleBounds.left + themeToggleBounds.width / 2;
      var themeTransitionY = themeToggleBounds.top + themeToggleBounds.height / 2;
      var farthestX = Math.max(themeTransitionX, window.innerWidth - themeTransitionX);
      var farthestY = Math.max(themeTransitionY, window.innerHeight - themeTransitionY);
      var themeTransitionRadius = Math.hypot(farthestX, farthestY);

      root.style.setProperty("--theme-transition-x", themeTransitionX + "px");
      root.style.setProperty("--theme-transition-y", themeTransitionY + "px");
      root.style.setProperty("--theme-transition-radius", themeTransitionRadius + "px");
      root.classList.add("is-theme-transitioning");

      var themeTransition = document.startViewTransition(function () {
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
      });

      themeTransition.finished.then(finishThemeSwitch, finishThemeSwitch);
    };

    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }

    var scrollProgress = document.querySelector(".scroll-progress span");
    var backToTop = document.querySelector(".back-to-top");
    var gsapApi = window.gsap;
    var scrollTriggerApi = window.ScrollTrigger;
    var useGsapScrollProgress = false;
    var hasMotionEngine = Boolean(gsapApi && scrollTriggerApi);

    if (hasMotionEngine) {
      gsapApi.registerPlugin(scrollTriggerApi);
    }

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
    var initGsapScrollProgress = function () {
      if (!hasMotionEngine || !scrollProgress) {
        return;
      }

      useGsapScrollProgress = true;
      gsapApi.set(scrollProgress, {
        width: "100%",
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsapApi.to(scrollProgress, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          id: "site-scroll-progress",
          trigger: document.documentElement,
          start: "top top",
          end: "max",
          scrub: 0.3,
        },
      });
      window.addEventListener("load", function () {
        scrollTriggerApi.refresh();
      }, { once: true });
    };
    var initHomepageMotion = function () {
      if (!hasMotionEngine || !gsapApi.matchMedia) {
        return;
      }

      var homeHero = document.querySelector(".home-hero");
      if (!homeHero) {
        return;
      }

      var motionMedia = gsapApi.matchMedia();
      motionMedia.add("(prefers-reduced-motion: no-preference)", function () {
        var stage = homeHero.querySelector(".home-hero__stage");
        var portrait = homeHero.querySelector(".home-hero__portrait");
        var portraitRing = homeHero.querySelector(".home-hero__portrait-ring");
        var stageNote = homeHero.querySelector(".home-hero__stage-note");
        var copyElements = homeHero.querySelectorAll(
          ".home-hero__eyebrow, .home-hero h1, .home-hero__lead, .home-hero__lead-en, .home-hero__actions"
        );
        var ambientTweens = [];
        var entranceComplete = false;
        var stageIsVisible = true;
        var stageObserver = null;
        var handlePortraitPointerEnter = function (event) {
          if (event.pointerType === "mouse" || event.pointerType === "pen") {
            stage.classList.add("is-popped");
          }
        };
        var handlePortraitPointerLeave = function () {
          stage.classList.remove("is-popped");
        };
        var homepageTimeline = gsapApi.timeline({
          paused: true,
          defaults: {
            duration: 0.82,
            ease: "power4.out",
          },
        });

        if (stage) {
          homepageTimeline.fromTo(
            stage,
            { y: 18, opacity: 0.78 },
            { y: 0, opacity: 1, clearProps: "transform,opacity" },
            0
          );
        }
        if (portraitRing) {
          homepageTimeline.fromTo(
            portraitRing,
            { scale: 0.84, rotation: -8, opacity: 0.18 },
            {
              scale: 1,
              rotation: 0,
              opacity: 1,
              clearProps: "transform,opacity",
            },
            0.06
          );
        }
        if (portrait) {
          homepageTimeline.fromTo(
            portrait,
            { xPercent: -50, yPercent: 9, scale: 0.955, rotation: -0.6, opacity: 0.82 },
            {
              xPercent: -50,
              yPercent: 3,
              scale: 1,
              rotation: 0,
              opacity: 1,
              clearProps: "opacity",
            },
            0.12
          );
        }
        if (stageNote) {
          homepageTimeline.fromTo(
            stageNote,
            { x: 12, opacity: 0.72 },
            { x: 0, opacity: 1, clearProps: "transform,opacity" },
            0.24
          );
        }
        if (copyElements.length) {
          homepageTimeline.fromTo(
            copyElements,
            { y: 22, opacity: 0.72 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.09,
              clearProps: "transform,opacity",
            },
            0.16
          );
        }

        if (portrait) {
          ambientTweens.push(gsapApi.to(portrait, {
            xPercent: -50,
            yPercent: 0.65,
            rotation: 0.28,
            duration: 3.4,
            ease: "sine.inOut",
            paused: true,
            repeat: -1,
            yoyo: true,
          }));
        }
        if (stageNote) {
          ambientTweens.push(gsapApi.to(stageNote, {
            y: -3,
            duration: 3.4,
            ease: "sine.inOut",
            paused: true,
            repeat: -1,
            yoyo: true,
          }));
        }

        var syncHomepageMotion = function () {
          var shouldPlay = stageIsVisible && !document.hidden;

          if (!entranceComplete) {
            if (shouldPlay) {
              homepageTimeline.play();
            } else {
              homepageTimeline.pause();
            }
            return;
          }

          ambientTweens.forEach(function (tween) {
            if (shouldPlay) {
              tween.play();
            } else {
              tween.pause();
            }
          });
        };
        var handleStageVisibility = function (entries) {
          stageIsVisible = entries.some(function (entry) {
            return entry.isIntersecting;
          });
          syncHomepageMotion();
        };
        var handleDocumentVisibility = function () {
          syncHomepageMotion();
        };

        homepageTimeline.eventCallback("onComplete", function () {
          entranceComplete = true;
          ambientTweens.forEach(function (tween) {
            tween.play(0);
          });
          syncHomepageMotion();
        });

        if (stage && "IntersectionObserver" in window) {
          var stageBounds = stage.getBoundingClientRect();
          stageIsVisible = stageBounds.bottom > 0 && stageBounds.top < window.innerHeight;
          stageObserver = new IntersectionObserver(handleStageVisibility, {
            threshold: 0.08,
          });
          stageObserver.observe(stage);
        }
        if (stage) {
          stage.addEventListener("pointerenter", handlePortraitPointerEnter);
          stage.addEventListener("pointerleave", handlePortraitPointerLeave);
        }
        document.addEventListener("visibilitychange", handleDocumentVisibility);
        syncHomepageMotion();

        return function () {
          homepageTimeline.kill();
          ambientTweens.forEach(function (tween) {
            tween.kill();
          });
          if (stageObserver) {
            stageObserver.disconnect();
          }
          if (stage) {
            stage.classList.remove("is-popped");
            stage.removeEventListener("pointerenter", handlePortraitPointerEnter);
            stage.removeEventListener("pointerleave", handlePortraitPointerLeave);
          }
          document.removeEventListener("visibilitychange", handleDocumentVisibility);
        };
      });

    };
    var scrollChromeTicking = false;
    var updateScrollChrome = function () {
      var scrollTop = getScrollTop();
      var scrollHeight = getDocumentHeight() - window.innerHeight;

      if (!useGsapScrollProgress) {
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

    initGsapScrollProgress();
    initHomepageMotion();
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

    // Sticky footer.
    var pageFooter = document.querySelector(".page__footer");
    var bumpIt = function () {
      if (!pageFooter) {
        return;
      }

      var footerStyles = window.getComputedStyle(pageFooter);
      var footerHeight =
        pageFooter.getBoundingClientRect().height +
        parseFloat(footerStyles.marginTop || 0) +
        parseFloat(footerStyles.marginBottom || 0);
      document.body.style.marginBottom = footerHeight + "px";
    };
    var didResize = false;

    bumpIt();

    window.addEventListener("resize", function () {
      didResize = true;
    });
    setInterval(function () {
      if (didResize) {
        didResize = false;
        bumpIt();
      }
    }, 250);

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
