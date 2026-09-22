const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const source = fs.readFileSync(path.join(__dirname, '../assets/js/_theme.js'), 'utf8');

function setup({reduced = false, supported = true, blog = false, stored = null, throws = false} = {}) {
  const classes = new Set(), styles = new Map(), buttonAttributes = new Map();
  const listeners = {}, events = [], media = {}, transitions = [];
  let bridge;
  const root = {
    dataset: {}, offsetWidth: 1200,
    classList: {
      contains: key => classes.has(key), add: key => classes.add(key), remove: key => classes.delete(key),
      toggle: (key, enabled) => enabled ? classes.add(key) : classes.delete(key),
    },
    style: {setProperty: (key, value) => styles.set(key, value)},
  };
  const control = {
    dataset: {lightLabel: 'Light', darkLabel: 'Dark'},
    getBoundingClientRect: () => ({left: 400, top: 12, width: 44, height: 44}),
    setAttribute: (key, value) => buttonAttributes.set(key, value),
    addEventListener: (type, fn) => {listeners[type] = fn;},
  };
  const matchMedia = query => {
    const value = {matches: query.includes('reduced-motion') ? reduced : false};
    value.addEventListener = (_, fn) => {value.change = event => {value.matches = event.matches; fn(event);};};
    media[query] = value; return value;
  };
  const window = {
    dispatchEvent: event => events.push(event),
    addEventListener: (type, fn) => {listeners[type] = fn;},
    huskyBlogEmbed: {start: api => {bridge = api;}},
  };
  const document = {
    documentElement: root, getElementById: () => control, querySelector: () => null,
    body: {classList: {contains: () => blog}},
  };
  if (supported) document.startViewTransition = callback => {
    if (throws) throw new Error('capture unavailable');
    let resolve;
    const transition = {
      skipped: false, ready: Promise.resolve(), finished: new Promise(done => {resolve = done;}),
      skipTransition() {this.skipped = true;},
      async finish() {callback(); resolve(); await this.finished;},
    };
    transitions.push(transition); return transition;
  };
  vm.runInNewContext(source, {
    window, document, matchMedia, innerWidth: 1200, innerHeight: 900,
    localStorage: {getItem: () => stored, setItem: (_, value) => {stored = value;}},
    CustomEvent: function(type, options) {this.type = type; this.detail = options.detail;},
  });
  return {
    click: () => listeners.click(), classes, styles, transitions, media, events, bridge,
    storage: value => listeners.storage({key: 'theme', newValue: value}),
    theme: () => root.dataset.theme, stored: () => stored,
    pressed: () => buttonAttributes.get('aria-pressed'),
  };
}

test('rapid theme requests preserve the last choice even when old callbacks run later', async () => {
  const page = setup();
  page.click();
  assert.equal(page.stored(), 'dark');
  page.click();
  assert.equal(page.transitions[0].skipped, true);
  assert.equal(page.stored(), 'light');
  await page.transitions[1].finish();
  await page.transitions[0].finish();
  assert.equal(page.theme(), 'light');
  assert.equal(page.pressed(), 'false');
  assert.equal(page.classes.size, 0);
  assert.equal(page.events.length, 1);
  assert.equal(page.events[0].detail.theme, 'light');
});

test('an old transition cannot remove a newer transition state', async () => {
  const page = setup();
  page.click(); page.click();
  await page.transitions[0].finish();
  assert.ok(page.classes.has('is-theme-transitioning'));
  await page.transitions[1].finish();
  assert.equal(page.classes.size, 0);
});

for (const options of [{reduced: true}, {supported: false}, {blog: true}, {throws: true}]) {
  test(`theme fallback updates immediately: ${JSON.stringify(options)}`, () => {
    const page = setup(options);
    page.click();
    assert.equal(page.theme(), 'dark');
    assert.equal(page.stored(), 'dark');
    assert.equal(page.pressed(), 'true');
    assert.equal(page.classes.size, 0);
    assert.equal(page.transitions.length, 0);
  });
}

test('enabling reduced motion commits the pending choice and skips its animation', async () => {
  const page = setup();
  page.click();
  page.media['(prefers-reduced-motion: reduce)'].change({matches: true});
  assert.equal(page.transitions[0].skipped, true);
  assert.equal(page.theme(), 'dark');
  await page.transitions[0].finish();
  assert.equal(page.theme(), 'dark');
  assert.equal(page.classes.size, 0);
});

test('remote theme interrupts local animation without echoing or being overwritten', async () => {
  const page = setup();
  page.click();
  const count = page.events.length;
  page.bridge.receive('light');
  await page.transitions[0].finish();
  assert.equal(page.theme(), 'light');
  assert.equal(page.stored(), 'light');
  assert.equal(page.events.length, count);
  assert.equal(page.classes.size, 0);
});

test('system theme changes stay immediate until the visitor chooses a theme', async () => {
  const page = setup();
  page.media['(prefers-color-scheme: dark)'].change({matches: true});
  assert.equal(page.theme(), 'dark');
  assert.equal(page.transitions.length, 0);
  page.click();
  page.media['(prefers-color-scheme: dark)'].change({matches: true});
  await page.transitions[0].finish();
  assert.equal(page.theme(), 'light');
});

test('invalid preferences fall back to the system and storage changes cancel pending transitions', async () => {
  const page = setup({stored: 'invalid'});
  assert.equal(page.theme(), 'light');
  page.click();
  page.storage(null);
  await page.transitions[0].finish();
  assert.equal(page.theme(), 'light');
  assert.equal(page.pressed(), 'false');
  page.media['(prefers-color-scheme: dark)'].change({matches: true});
  assert.equal(page.theme(), 'dark');
});
