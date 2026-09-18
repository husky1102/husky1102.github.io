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
      root.setAttribute("data-home-motion", "static");
      var motionMedia = gsapApi.matchMedia();
      motionMedia.add("(prefers-reduced-motion: no-preference)", function () {
        var stage = homeHero.querySelector(".home-hero__stage");
        var characters = homeHero.querySelectorAll(".home-hero__character");
        var copyElements = homeHero.querySelectorAll(
          ".home-hero__eyebrow, .home-hero h1, .home-hero__lead, .home-hero__lead-en, .home-hero__actions"
        );
        root.setAttribute("data-home-motion", "active");
        var stageIsVisible = true;
        var stageObserver = null;
        var homepageTimeline = gsapApi.timeline({
          defaults: { duration: 0.85, ease: "power3.out" }
        });
        // Entrance moves the stage; pointer motion moves only the artwork.
        homepageTimeline.fromTo(stage,
          { y: 16, opacity: 0.78 },
          { y: 0, opacity: 1, clearProps: "transform,opacity" }, 0);
        homepageTimeline.fromTo(copyElements,
          { y: 14, opacity: 0.72 },
          { y: 0, opacity: 1, stagger: 0.055, clearProps: "transform,opacity" }, 0.12);

        var pointerMedia = gsapApi.matchMedia();
        var resetPortrait = function () {};
        pointerMedia.add("(hover: hover) and (pointer: fine)", function () {
          var stageBounds = null;
          var xTo = gsapApi.quickTo(characters, "x", { duration: 0.45, ease: "power3.out" });
          var yTo = gsapApi.quickTo(characters, "y", { duration: 0.45, ease: "power3.out" });
          var rotationTo = gsapApi.quickTo(characters, "rotation", { duration: 0.55, ease: "power3.out" });
          var liftTo = gsapApi.quickTo(characters, "yPercent", { duration: 0.5, ease: "back.out(1.2)" });
          var scaleXTo = gsapApi.quickTo(characters, "scaleX", { duration: 0.5, ease: "back.out(1.2)" });
          var scaleYTo = gsapApi.quickTo(characters, "scaleY", { duration: 0.5, ease: "back.out(1.2)" });
          resetPortrait = function () {
            stage.classList.remove("is-popped");
            xTo(0); yTo(0); rotationTo(0);
            liftTo(0); scaleXTo(1); scaleYTo(1);
            stageBounds = null;
          };
          var handlePortraitPointerEnter = function (event) {
            if (event.pointerType === "mouse" || event.pointerType === "pen") {
              stageBounds = stage.getBoundingClientRect();
              stage.classList.add("is-popped");
              liftTo(-3.5); scaleXTo(1.1); scaleYTo(1.1);
            }
          };
          var handlePortraitPointerMove = function (event) {
            if (!stageBounds || !stageIsVisible || document.hidden) { return; }
            var x = gsapApi.utils.clamp(-0.5, 0.5, (event.clientX - stageBounds.left) / stageBounds.width - 0.5);
            var y = gsapApi.utils.clamp(-0.5, 0.5, (event.clientY - stageBounds.top) / stageBounds.height - 0.5);
            xTo(x * 28); yTo(y * 16); rotationTo(x * 3);
          };
          stage.addEventListener("pointerenter", handlePortraitPointerEnter);
          stage.addEventListener("pointermove", handlePortraitPointerMove);
          stage.addEventListener("pointerleave", resetPortrait);
          stage.addEventListener("pointercancel", resetPortrait);
          window.addEventListener("blur", resetPortrait);
          window.addEventListener("scroll", resetPortrait, { passive: true });
          window.addEventListener("resize", resetPortrait);
          return function () {
            stage.classList.remove("is-popped");
            stage.removeEventListener("pointerenter", handlePortraitPointerEnter);
            stage.removeEventListener("pointermove", handlePortraitPointerMove);
            stage.removeEventListener("pointerleave", resetPortrait);
            stage.removeEventListener("pointercancel", resetPortrait);
            window.removeEventListener("blur", resetPortrait);
            window.removeEventListener("scroll", resetPortrait);
            window.removeEventListener("resize", resetPortrait);
            resetPortrait = function () {};
          };
        });
        var syncHomepageMotion = function () {
          if (stageIsVisible && !document.hidden) { homepageTimeline.resume(); }
          else { homepageTimeline.pause(); resetPortrait(); }
        };
        if ("IntersectionObserver" in window) {
          stageObserver = new IntersectionObserver(function (entries) {
            stageIsVisible = entries.some(function (entry) { return entry.isIntersecting; });
            syncHomepageMotion();
          }, { threshold: 0.05 });
          stageObserver.observe(stage);
        }
        document.addEventListener("visibilitychange", syncHomepageMotion);
        return function () {
          root.setAttribute("data-home-motion", "static");
          pointerMedia.revert();
          homepageTimeline.kill();
          if (stageObserver) { stageObserver.disconnect(); }
          document.removeEventListener("visibilitychange", syncHomepageMotion);
        };
      });
    };

    initGsapScrollProgress();
    initHomepageMotion();
  });
}());
