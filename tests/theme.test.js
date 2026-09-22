const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const assert = require("node:assert/strict");

const source = fs.readFileSync(path.join(__dirname, "../assets/js/_theme.js"), "utf8");

function setup({ reduced = false, supported = true, blog = false, stored = null } = {}) {
  const classes = new Set(), styles = new Map(), buttonAttributes = new Map();
  const listeners = {}, timers = new Map(), events = [], media = {};
  let timerId = 0, bridge;
  const root = {
    dataset: {}, offsetWidth: 1200,
    classList: {
      contains: key => classes.has(key), add: key => classes.add(key), remove: key => classes.delete(key),
      toggle: (key, enabled) => enabled ? classes.add(key) : classes.delete(key),
    },
    style: { setProperty: (key, value) => styles.set(key, value) },
  };
  const control = {
    dataset: {lightLabel: 'Light', darkLabel: 'Dark'},
    setAttribute: (key, value) => buttonAttributes.set(key, value),
    addEventListener: (type, fn) => { listeners[type] = fn; },
  };
  const matchMedia = query => {
    const value = { matches: query.includes('reduced-motion') ? reduced : false };
    value.addEventListener = (_, fn) => { value.change = event => { value.matches = event.matches; fn(event); }; };
    media[query] = value; return value;
  };
  const window = {
    CSS: supported ? {registerProperty() {}} : undefined,
    dispatchEvent: event => events.push(event),
    addEventListener: (type, fn) => { listeners[type] = fn; },
    huskyBlogEmbed: {start: api => {bridge = api;}},
  };
  vm.runInNewContext(source, {
    window, CSS: window.CSS, matchMedia,
    document: {documentElement: root, getElementById: () => control, querySelector: () => null,
      body: {classList: {contains: () => blog}}},
    setTimeout: fn => {timers.set(++timerId, fn); return timerId;},
    clearTimeout: id => timers.delete(id),
    localStorage: {getItem: () => stored, setItem: (_, value) => {stored = value;}},
    CustomEvent: function(type, options) {this.type = type; this.detail = options.detail;},
  });
  return {
    click: () => listeners.click(), classes, styles, timers, media, events, bridge,
    storage: value => listeners.storage({key: 'theme', newValue: value}),
    theme: () => root.dataset.theme, stored: () => stored,
    pressed: () => buttonAttributes.get('aria-pressed'),
    finish: () => {for (const [id, fn] of [...timers]) {timers.delete(id); fn();}},
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

test('invalid saved preferences fall back to the system, storage changes update controls', () => {
  const page = setup({stored: 'invalid'});
  assert.equal(page.theme(), 'light');
  page.storage('dark');
  assert.equal(page.theme(), 'dark');
  assert.equal(page.pressed(), 'true');
  page.storage(null);
  assert.equal(page.theme(), 'light');
  page.media['(prefers-color-scheme: dark)'].change({matches: true});
  assert.equal(page.theme(), 'dark');
});
