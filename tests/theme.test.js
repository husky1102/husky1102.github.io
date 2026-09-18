const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const assert = require("node:assert/strict");

const source = fs.readFileSync(path.join(__dirname, "../assets/js/_main.js"), "utf8");

function setup({ reduced = false, supported = true, blog = false, stored = null } = {}) {
  const attributes = new Map();
  const classes = new Set();
  const styles = new Map();
  const buttonAttributes = new Map();
  const listeners = {};
  const timers = new Map();
  const events = [];
  const media = {};
  let timerId = 0;
  let bridge;
  const button = {
    getAttribute: (key) => buttonAttributes.get(key),
    setAttribute: (key, value) => buttonAttributes.set(key, value),
    addEventListener: (type, fn) => { listeners[type] = fn; },
  };
  const root = {
    getAttribute: (key) => attributes.get(key),
    setAttribute: (key, value) => attributes.set(key, value),
    toggleAttribute: (key, enabled) => enabled ? attributes.set(key, "") : attributes.delete(key),
    classList: { add: (key) => classes.add(key), remove: (key) => classes.delete(key) },
    style: { setProperty: (key, value) => styles.set(key, value) },
    offsetWidth: 1200,
  };
  const document = {
    readyState: "complete",
    documentElement: root,
    body: { classList: { contains: () => blog } },
    getElementById: () => ({ querySelector: () => button }),
    querySelector: () => null,
  };
  const window = {
    CSS: supported ? { registerProperty() {} } : undefined,
    matchMedia: (query) => (media[query] = {
      matches: query.includes("reduced-motion") ? reduced : false,
      addEventListener: (_, fn) => { media[query].change = fn; },
    }),
    dispatchEvent: (event) => events.push(event),
    setTimeout: (fn) => { timers.set(++timerId, fn); return timerId; },
    clearTimeout: (id) => timers.delete(id),
    huskyBlogEmbed: { start: (api) => { bridge = api; } },
  };
  // Stop before unrelated scroll/navigation initialization, exercising the real theme code.
  const themeSource = source.slice(0, source.indexOf('    var scrollProgress =')) + "\n  });\n})();";
  vm.runInNewContext(themeSource, {
    window, document,
    localStorage: { getItem: () => stored, setItem: (_, value) => { stored = value; } },
    CustomEvent: function (type, options) { this.type = type; this.detail = options.detail; },
  });
  return {
    click: () => listeners.click(), classes, styles, timers, media, events, bridge,
    theme: () => attributes.get("data-theme") || "light",
    stored: () => stored,
    pressed: () => buttonAttributes.get("aria-pressed"),
    finish: () => { for (const fn of [...timers.values()]) fn(); },
  };
}

test("daylight transitions reverse immediately and keep preference and control in sync", () => {
  const page = setup();
  page.click();
  assert.equal(page.theme(), "dark");
  assert.equal(page.styles.get("--theme-duration"), "650ms");
  assert.equal(page.pressed(), "true");
  page.click();
  assert.equal(page.theme(), "light");
  assert.equal(page.stored(), "light");
  assert.equal(page.pressed(), "false");
  assert.equal(page.styles.get("--theme-duration"), "800ms");
  assert.equal(page.styles.get("--theme-ink-delay"), "0ms");
  assert.equal(page.timers.size, 1);
  page.finish();
  assert.equal(page.classes.size, 0);
  assert.equal(page.timers.size, 0);
});

for (const options of [{ reduced: true }, { supported: false }, { blog: true }]) {
  test(`theme fallback updates immediately: ${JSON.stringify(options)}`, () => {
    const page = setup(options);
    page.click();
    assert.equal(page.theme(), "dark");
    assert.equal(page.stored(), "dark");
    assert.equal(page.classes.size, 0);
    assert.equal(page.timers.size, 0);
  });
}

test("enabling reduced motion finishes an active transition", () => {
  const page = setup();
  page.click();
  page.media["(prefers-reduced-motion: reduce)"].change({ matches: true });
  assert.equal(page.theme(), "dark");
  assert.equal(page.classes.size, 0);
  assert.equal(page.timers.size, 0);
});

test("remote theme interrupts local animation without echoing the change", () => {
  const page = setup();
  page.click();
  const count = page.events.length;
  page.bridge.receive("light");
  assert.equal(page.theme(), "light");
  assert.equal(page.stored(), "light");
  assert.equal(page.events.length, count);
  assert.equal(page.timers.size, 0);
  assert.equal(page.classes.size, 0);
});

test("system theme changes stay immediate until the visitor chooses a theme", () => {
  const page = setup();
  page.media["(prefers-color-scheme: dark)"].change({ matches: true });
  assert.equal(page.theme(), "dark");
  assert.equal(page.timers.size, 0);
  page.click();
  page.media["(prefers-color-scheme: dark)"].change({ matches: true });
  assert.equal(page.theme(), "light");
});
