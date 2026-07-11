const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const jobSection = (workflow, jobName, nextJobName) => {
  const startMarker = `  ${jobName}:`;
  const start = workflow.indexOf(startMarker);
  assert.notEqual(start, -1, `Missing ${jobName} job.`);

  if (!nextJobName) return workflow.slice(start);

  const end = workflow.indexOf(`  ${nextJobName}:`, start + startMarker.length);
  assert.notEqual(end, -1, `Missing ${nextJobName} job after ${jobName}.`);
  return workflow.slice(start, end);
};

test("GitHub workflows grant deployment credentials only to the deploy job", () => {
  const pages = read(".github/workflows/pages.yml");
  const siteCheck = read(".github/workflows/site-check.yml");
  const buildJob = jobSection(pages, "build", "deploy");
  const deployJob = jobSection(pages, "deploy");

  assert.match(pages, /^permissions:\n  contents: read\n/m);
  assert.doesNotMatch(pages, /^permissions:\n(?:  .*\n)*  pages: write\n/m);
  assert.doesNotMatch(pages, /^permissions:\n(?:  .*\n)*  id-token: write\n/m);
  assert.doesNotMatch(buildJob, /\n    permissions:\n(?:      .*\n)*(?:      pages: write|      id-token: write)/);
  assert.match(
    deployJob,
    /\n    permissions:\n      contents: read\n      pages: write\n      id-token: write\n/
  );
  assert.match(siteCheck, /^permissions:\n  contents: read\n/m);
});

test("Node builds use the committed lockfile and the supported runtime", () => {
  const pages = read(".github/workflows/pages.yml");
  const siteCheck = read(".github/workflows/site-check.yml");
  const packageJson = JSON.parse(read("package.json"));
  const packageLock = JSON.parse(read("package-lock.json"));
  const gitignore = read(".gitignore");

  for (const workflow of [pages, siteCheck]) {
    assert.match(workflow, /node-version: "22"/);
    assert.match(workflow, /run: npm ci/);
    assert.doesNotMatch(workflow, /run: npm install/);
  }

  assert.equal(packageJson.engines.node, ">=22");
  assert.equal(packageLock.packages[""].engines.node, ">=22");
  assert.doesNotMatch(gitignore, /^package-lock\.json$/m);
});

test("npm metadata identifies this repository as a private site project", () => {
  const packageJson = JSON.parse(read("package.json"));
  const packageLock = JSON.parse(read("package-lock.json"));
  const lockRoot = packageLock.packages[""];

  assert.equal(packageJson.name, "husky1102.github.io");
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.repository.url, "https://github.com/husky1102/husky1102.github.io");
  assert.equal(packageJson.homepage, "https://husky1102.github.io");
  assert.equal(packageJson.bugs.url, "https://github.com/husky1102/husky1102.github.io/issues");
  assert.equal(packageLock.name, packageJson.name);
  assert.equal(lockRoot.name, packageJson.name);
  assert.equal(lockRoot.version, packageJson.version);
});

test("Ruby builds use a committed cross-platform dependency lock", () => {
  const gemfileLock = read("Gemfile.lock");
  const gitignore = read(".gitignore");
  const contributing = read("CONTRIBUTING.md");

  assert.doesNotMatch(gitignore, /^Gemfile\.lock$/m);
  assert.doesNotMatch(contributing, /does not commit `Gemfile\.lock`/);
  assert.match(gemfileLock, /PLATFORMS\n(?: {2}.+\n)* {2}ruby\n(?: {2}.+\n)* {2}x86_64-linux\n/);
  assert.match(gemfileLock, /BUNDLED WITH\n {3}2\.4\.22\n/);
});

test("Docker builds and serves with the locked Ruby bundle", () => {
  const dockerfile = read("Dockerfile");
  const compose = read("docker-compose.yaml");

  assert.match(dockerfile, /^FROM ruby:3\.3$/m);
  assert.match(dockerfile, /^COPY Gemfile Gemfile\.lock \.\/$/m);
  assert.match(dockerfile, /^RUN gem install bundler:2\.4\.22$/m);
  assert.match(dockerfile, /^RUN bundle _2\.4\.22_ install$/m);
  assert.doesNotMatch(dockerfile, /gem install connection_pool/);
  assert.match(dockerfile, /^CMD \["bundle", "exec", "jekyll", "serve", "-H", "0\.0\.0\.0", "-w"\]$/m);
  assert.match(compose, /^\s+command: bundle exec jekyll serve -H 0\.0\.0\.0 -w$/m);
});

test("CI rejects stale generated JavaScript and incomplete font subsets", () => {
  const pages = read(".github/workflows/pages.yml");
  const siteCheck = read(".github/workflows/site-check.yml");
  const requirements = read("requirements-assets.txt");

  assert.equal(requirements, "fonttools==4.60.2\nbrotli==1.2.0\n");

  for (const workflow of [pages, siteCheck]) {
    assert.match(workflow, /uses: actions\/setup-python@v5/);
    assert.match(workflow, /python-version: "3\.12"/);
    assert.match(workflow, /run: python3 -m pip install -r requirements-assets\.txt/);
    assert.match(workflow, /run: python3 scripts\/subset_site_font\.py --check-generated/);

    const buildIndex = workflow.indexOf("run: npm run build:js");
    const diffIndex = workflow.indexOf("run: git diff --exit-code -- assets/js/main.min.js");
    assert.notEqual(buildIndex, -1, "Missing JavaScript build step.");
    assert.ok(diffIndex > buildIndex, "Generated JavaScript must be checked after rebuilding it.");
  }
});
