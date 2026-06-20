/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

(function () {
  var nav = document.getElementById("site-nav");
  var btn = document.querySelector("#site-nav > .greedy-nav__toggle");
  var visibleLinks = nav ? nav.querySelector(".visible-links") : null;
  var persistTail = visibleLinks ? visibleLinks.querySelector(".persist.tail") : null;
  var hiddenLinks = nav ? nav.querySelector(".hidden-links") : null;
  var breaks = [];

  if (!nav || !btn || !visibleLinks || !hiddenLinks) {
    return;
  }

  var getWidth = function (element) {
    return element ? element.getBoundingClientRect().width : 0;
  };

  var isVisible = function (element) {
    return Boolean(
      element &&
      (element.offsetWidth || element.offsetHeight || element.getClientRects().length)
    );
  };

  var getMovableLinks = function () {
    return Array.prototype.filter.call(visibleLinks.children, function (item) {
      return !item.classList.contains("persist");
    });
  };

  var getAvailableSpace = function () {
    return btn.classList.contains("hidden")
      ? getWidth(nav)
      : getWidth(nav) - getWidth(btn) - 30;
  };

  var setHiddenLinksOpen = function (isOpen) {
    hiddenLinks.classList.toggle("hidden", !isOpen);
    hiddenLinks.setAttribute("aria-hidden", isOpen ? "false" : "true");
    btn.classList.toggle("close", isOpen);
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  };

  var updatePageChromeOffsets = function () {
    var masthead = document.querySelector(".masthead");
    var sidebar = document.querySelector(".sidebar");
    var authorButton = document.querySelector(".author__urls-wrapper button");
    var mastheadHeight = masthead ? masthead.offsetHeight : 0;

    document.body.style.paddingTop = mastheadHeight + "px";
    if (sidebar) {
      sidebar.style.paddingTop = isVisible(authorButton) ? "" : mastheadHeight + "px";
    }
  };

  var updateNav = function () {
    var availableSpace = getAvailableSpace();

    // The visible list is overflowing the nav.
    if (getWidth(visibleLinks) > availableSpace) {
      while (getWidth(visibleLinks) > availableSpace && getMovableLinks().length > 0) {
        var movableLinks = getMovableLinks();

        breaks.push(getWidth(visibleLinks));
        hiddenLinks.insertBefore(movableLinks[movableLinks.length - 1], hiddenLinks.firstElementChild);
        btn.classList.remove("hidden");
        availableSpace = getAvailableSpace();
      }

      // The visible list is not overflowing.
    } else {
      // There is space for another item in the nav.
      while (breaks.length > 0 && availableSpace > breaks[breaks.length - 1]) {
        var firstHiddenLink = hiddenLinks.firstElementChild;

        if (!firstHiddenLink) {
          break;
        }

        if (persistTail && persistTail.children.length > 0) {
          visibleLinks.insertBefore(firstHiddenLink, persistTail);
        } else {
          visibleLinks.appendChild(firstHiddenLink);
        }
        breaks.pop();
      }

      // Hide the dropdown btn if hidden list is empty.
      if (breaks.length < 1) {
        btn.classList.add("hidden");
        setHiddenLinksOpen(false);
      }
    }

    btn.setAttribute("count", breaks.length);
    updatePageChromeOffsets();
  };

  window.addEventListener("resize", updateNav);
  if (screen.orientation && screen.orientation.addEventListener) {
    screen.orientation.addEventListener("change", updateNav);
  } else {
    window.addEventListener("orientationchange", updateNav);
  }

  btn.addEventListener("click", function () {
    setHiddenLinksOpen(hiddenLinks.classList.contains("hidden"));
  });

  updateNav();
}());
