/* ==========================================================================
   Homepage motion enhancement
   ========================================================================== */

(function () {
  var root = document.documentElement;
  var homeHero = document.querySelector(".home-hero");
  var gsapApi = window.gsap;
  var scrollTriggerApi = window.ScrollTrigger;

  if (!homeHero || !gsapApi || !scrollTriggerApi) {
    return;
  }

  gsapApi.registerPlugin(scrollTriggerApi);
  root.setAttribute("data-scroll-progress-engine", "gsap");

  var ready = function (callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  };

  ready(function () {
    var scrollProgress = document.querySelector(".scroll-progress span");

    var initGsapScrollProgress = function () {
      if (!scrollProgress) {
        return;
      }

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
      if (!gsapApi.matchMedia) {
        return;
      }

      root.setAttribute("data-home-motion", "static");

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

        root.setAttribute("data-home-motion", "active");

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
          root.setAttribute("data-home-motion", "static");
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

    initGsapScrollProgress();
    initHomepageMotion();
  });
}());
