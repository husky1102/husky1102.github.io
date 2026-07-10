const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const sourceFont = path.join(root, "scripts", "assets", "fonts", "LXGWWenKaiGBScreen-full.woff2");
const publicFont = path.join(root, "assets", "fonts", "LXGWWenKaiGBScreen-subset.woff2");
const sourceAvatar = path.join(root, "scripts", "assets", "images", "avatar-gpt063-source.png");
const avatar = path.join(root, "images", "avatar-gpt063.webp");

test("the full Chinese font stays source-only and the public subset stays within budget", () => {
  assert.ok(fs.existsSync(sourceFont), "Keep the full font under scripts/assets/fonts for reproducible subsetting.");
  assert.ok(fs.existsSync(publicFont), "Generate the public Chinese font subset before testing.");
  assert.ok(fs.statSync(sourceFont).size > 1024 * 1024, "The source-only font should remain the complete font file.");
  assert.ok(fs.statSync(publicFont).size <= 512 * 1024, "The published Chinese font must stay at or below 512 KiB.");
});

test("the configured sidebar avatar is a compact WebP asset", () => {
  const config = fs.readFileSync(path.join(root, "_config.yml"), "utf8");

  assert.match(config, /avatar\s*:\s*"avatar-gpt063\.webp"/);
  assert.ok(fs.existsSync(sourceAvatar), "Keep the original avatar under scripts/assets/images for reproducible exports.");
  assert.ok(fs.existsSync(avatar), "Generate the optimized WebP avatar before testing.");
  assert.ok(fs.statSync(avatar).size <= 160 * 1024, "The published avatar must stay at or below 160 KiB.");

  const signature = fs.readFileSync(avatar).subarray(0, 12);
  assert.equal(signature.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(signature.subarray(8, 12).toString("ascii"), "WEBP");
});

test("the generated site does not publish source-only optimization assets", () => {
  assert.ok(!fs.existsSync(path.join(root, "_site", "scripts")), "The Jekyll artifact must exclude the scripts tree.");
  assert.ok(!fs.existsSync(path.join(root, "_site", "images", "avatar-gpt063.png")), "The obsolete large PNG avatar must not be published.");
});
