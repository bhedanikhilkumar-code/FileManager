import { readFileSync } from "node:fs";
import { access } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "src/app.js",
  "src/file-manager.js",
  "src/styles.css",
  "tests/file-manager.test.mjs",
  "package.json",
  ".github/workflows/app-quality.yml",
  ".github/workflows/repository-health.yml",
  "README.md",
  "docs/QUALITY.md",
];

const missing = [];
for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    missing.push(file);
  }
}

if (missing.length) {
  console.error("Missing required project files:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const readme = readFileSync("README.md", "utf8");
const readmeChecks = [
  "Smart Local File Manager",
  "npm test",
  "app-quality.yml",
  "src/file-manager.js",
];
const failedReadmeChecks = readmeChecks.filter((token) => !readme.includes(token));
if (failedReadmeChecks.length) {
  console.error("README is missing expected project details:");
  for (const token of failedReadmeChecks) console.error(`- ${token}`);
  process.exit(1);
}

console.log("Project structure validation passed.");
