const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const site = path.join(root, "_site");

const existsInSite = (relativePath) => fs.existsSync(path.join(site, relativePath));
const readIfExists = (relativePath) => {
  const fullPath = path.join(site, relativePath);
  return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : "";
};

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return fullPath;
  });
};

test("template-only and talkmap routes are not generated", () => {
  const absentRoutes = [
    "talkmap.html",
    "talkmap",
    "markdown",
    "markdown.html",
    "md",
    "page-archive",
    "collection-archive",
    "portfolio",
    "publications",
    "teaching",
    "talks",
  ];

  const leakedRoutes = absentRoutes.filter(existsInSite);
  assert.deepEqual(leakedRoutes, [], `Unexpected public routes: ${leakedRoutes.join(", ")}`);
});

test("sitemap omits template-only and talkmap routes", () => {
  const sitemap = readIfExists("sitemap.xml");
  const forbiddenUrls = [
    "/talkmap.html",
    "/talkmap/",
    "/markdown/",
    "/page-archive/",
    "/collection-archive/",
    "/portfolio/",
    "/publications/",
    "/teaching/",
    "/talks/",
  ];

  for (const url of forbiddenUrls) {
    assert.doesNotMatch(sitemap, new RegExp(url.replaceAll("/", "\\/")));
  }
});

test("sample talk content is absent from generated text assets", () => {
  const textExtensions = new Set([".css", ".html", ".js", ".json", ".txt", ".xml"]);
  const generatedText = walk(site)
    .filter((file) => textExtensions.has(path.extname(file)))
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");

  for (const sampleText of [
    "UC San Francisco",
    "UC-Berkeley Institute",
    "London School of Testing",
    "Testing Institute of America",
    "Talk 1 on Relevant Topic",
  ]) {
    assert.doesNotMatch(generatedText, new RegExp(sampleText));
  }
});
