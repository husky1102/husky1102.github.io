/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function () {
  // detect OS/browser preference
  const browserPref = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  // Set the theme on page load or when explicitly called
  var setTheme = function (theme) {
    const use_theme =
      theme ||
      localStorage.getItem("theme") ||
      $("html").attr("data-theme") ||
      browserPref;

    const is_dark = use_theme === "dark";

    if (is_dark) {
      $("html").attr("data-theme", "dark");
      $("#theme-icon").removeClass("fa-sun").addClass("fa-moon");
    } else {
      $("html").removeAttr("data-theme");
      $("#theme-icon").removeClass("fa-moon").addClass("fa-sun");
    }

    // keep the toggle's state, label, and the browser UI color in sync
    var $themeToggleButton = $("#theme-toggle button");
    var nextThemeLabel = is_dark ? "切换到浅色模式" : "切换到深色模式";
    $themeToggleButton.attr({
      "aria-pressed": is_dark ? "true" : "false",
      "aria-label": nextThemeLabel,
      "title": nextThemeLabel,
    });
    var themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", is_dark ? "#0f172a" : "#fbfaf7");
    }
  };

  setTheme();

  // if user hasn't chosen a theme, follow OS changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });

  // Toggle the theme manually
  var toggleTheme = function () {
    $("#theme-toggle").addClass("is-switching");
    const current_theme = $("html").attr("data-theme");
    const new_theme = current_theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", new_theme);
    setTheme(new_theme);
    window.setTimeout(function () {
      $("#theme-toggle").removeClass("is-switching");
    }, 320);
  };

  $('#theme-toggle').on('click', toggleTheme);

  var $scrollProgress = $(".scroll-progress span");
  var $backToTop = $(".back-to-top");
  var gsapApi = window.gsap;
  var scrollTriggerApi = window.ScrollTrigger;
  var useGsapScrollProgress = false;
  var hasMotionEngine = Boolean(gsapApi && scrollTriggerApi);

  if (hasMotionEngine) {
    gsapApi.registerPlugin(scrollTriggerApi);
  }

  var updateScrollProgressFallback = function (scrollTop, scrollHeight) {
    var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    $scrollProgress.css("width", Math.min(100, Math.max(0, progress)) + "%");
  };
  var initGsapScrollProgress = function () {
    if (!hasMotionEngine || !$scrollProgress.length) {
      return;
    }

    useGsapScrollProgress = true;
    gsapApi.set($scrollProgress[0], {
      width: "100%",
      scaleX: 0,
      transformOrigin: "left center",
    });
    gsapApi.to($scrollProgress[0], {
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
  };
  var initGsapMotion = function () {
    if (!hasMotionEngine || !gsapApi.matchMedia) {
      return;
    }

    var motionMedia = gsapApi.matchMedia();
    motionMedia.add("(prefers-reduced-motion: no-preference)", function () {
      var heroElements = document.querySelectorAll(".home-hero__eyebrow, .home-hero h1, .home-hero__lead, .home-hero__actions");
      if (heroElements.length) {
        gsapApi.from(heroElements, {
          y: 24,
          autoAlpha: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.12,
          clearProps: "all",
        });
      }

      if (document.querySelector(".home-info-card, .archive__item--card")) {
        scrollTriggerApi.batch(".home-info-card, .archive__item--card", {
          start: "top 88%",
          once: true,
          onEnter: function (elements) {
            gsapApi.from(elements, {
              y: 32,
              autoAlpha: 0,
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.08,
              overwrite: "auto",
              clearProps: "all",
            });
          },
        });
      }

      return function () {
        scrollTriggerApi.refresh();
      };
    });

    window.addEventListener("load", function () {
      scrollTriggerApi.refresh();
    }, { once: true });
  };
  var scrollChromeTicking = false;
  var updateScrollChrome = function () {
    var scrollTop = $(window).scrollTop();
    var scrollHeight = $(document).height() - $(window).height();

    if (!useGsapScrollProgress) {
      updateScrollProgressFallback(scrollTop, scrollHeight);
    }
    $backToTop.toggleClass("is-visible", scrollTop > $(window).height() * 0.8);
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

  initGsapScrollProgress();
  initGsapMotion();
  updateScrollChrome();
  $(window).on("scroll resize", requestScrollChromeUpdate);
  window.addEventListener("scroll", requestScrollChromeUpdate, { passive: true });
  document.addEventListener("scroll", requestScrollChromeUpdate, { passive: true });
  $backToTop.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 450);
  });

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

  $("div.highlighter-rouge, figure.highlight").each(function () {
    var codeBlock = this;
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

  // These should be the same as the settings in _variables.scss
  const scssLarge = 925; // pixels

  // Sticky footer
  var bumpIt = function () {
    $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
  },
    didResize = false;

  bumpIt();

  $(window).resize(function () {
    didResize = true;
  });
  setInterval(function () {
    if (didResize) {
      didResize = false;
      bumpIt();
    }
  }, 250);

  // FitVids init
  fitvids();

  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function () {
    $(".author__urls").fadeToggle("fast", function () { });
    $(".author__urls-wrapper button").toggleClass("open");
  });

  // Restore the follow menu if toggled on a window resize
  jQuery(window).on('resize', function () {
    if ($('.author__urls.social-icons').css('display') == 'none' && $(window).width() >= scssLarge) {
      $(".author__urls").css('display', 'block')
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
