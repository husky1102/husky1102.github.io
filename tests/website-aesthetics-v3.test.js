const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("CV timeline items expose linked hover affordances", () => {
  const css = read("assets/css/cv-style.css");

  assert.match(css, /\.cv-section--timeline \.cv-item::after[\s\S]*transition:/);
  assert.match(css, /\.cv-section--timeline \.cv-item:hover::after[\s\S]*scale\(1\.28\)/);
  assert.match(css, /\.cv-section--timeline \.cv-item:hover::after[\s\S]*box-shadow:[\s\S]*var\(--global-link-color\)/);
  assert.match(css, /\.cv-section--timeline \.cv-item:hover \.cv-item__main[\s\S]*translateX\(3px\)/);
});
