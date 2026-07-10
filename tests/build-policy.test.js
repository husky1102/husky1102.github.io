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
