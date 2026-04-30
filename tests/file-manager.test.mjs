import test from "node:test";
import assert from "node:assert/strict";

import {
  buildManifest,
  createFileRecord,
  filterFiles,
  findDuplicateCandidates,
  formatBytes,
  inferFileType,
  recommendCleanup,
  sortFiles,
  summarizeFiles,
} from "../src/file-manager.js";

test("formatBytes returns readable storage units", () => {
  assert.equal(formatBytes(0), "0 B");
  assert.equal(formatBytes(512), "512 B");
  assert.equal(formatBytes(1024), "1.0 KB");
  assert.equal(formatBytes(10 * 1024 * 1024), "10 MB");
});

test("inferFileType classifies common file types", () => {
  assert.equal(inferFileType("photo.PNG", ""), "Images");
  assert.equal(inferFileType("song.mp3", "audio/mpeg"), "Audio");
  assert.equal(inferFileType("report.pdf", "application/pdf"), "Documents");
  assert.equal(inferFileType("script.ts", ""), "Code");
  assert.equal(inferFileType("mystery.filetype", ""), "Other");
});

test("createFileRecord normalizes browser file metadata", () => {
  const record = createFileRecord({
    name: "budget.csv",
    webkitRelativePath: "finance/budget.csv",
    size: 2048,
    type: "text/csv",
    lastModified: 1_700_000_000_000,
  });

  assert.equal(record.name, "budget.csv");
  assert.equal(record.path, "finance/budget.csv");
  assert.equal(record.extension, "csv");
  assert.equal(record.type, "Spreadsheets");
  assert.equal(record.formattedSize, "2.0 KB");
});

test("filterFiles and sortFiles support focused workspace views", () => {
  const files = [
    createFileRecord({ name: "zeta.mp4", size: 900, type: "video/mp4" }, 0),
    createFileRecord({ name: "alpha.pdf", size: 100, type: "application/pdf" }, 1),
    createFileRecord({ name: "app.js", size: 300, type: "text/javascript" }, 2),
  ];

  assert.deepEqual(filterFiles(files, { query: "app" }).map((file) => file.name), ["app.js"]);
  assert.deepEqual(filterFiles(files, { type: "Documents" }).map((file) => file.name), ["alpha.pdf"]);
  assert.deepEqual(sortFiles(files, "size", "desc").map((file) => file.name), ["zeta.mp4", "app.js", "alpha.pdf"]);
});

test("summarizeFiles and cleanup recommendations expose useful insights", () => {
  const files = [
    createFileRecord({ name: "demo.mp4", size: 30 * 1024 * 1024, type: "video/mp4" }, 0),
    createFileRecord({ name: "demo.mp4", size: 30 * 1024 * 1024, type: "video/mp4" }, 1),
    createFileRecord({ name: "notes.unknown", size: 500, type: "" }, 2),
  ];

  const summary = summarizeFiles(files);
  assert.equal(summary.totalFiles, 3);
  assert.equal(summary.byType.Video, 2);
  assert.equal(findDuplicateCandidates(files).length, 1);
  assert.ok(recommendCleanup(files).some((item) => item.includes("possible duplicate")));
  assert.ok(recommendCleanup(files).some((item) => item.includes("large files")));
});

test("buildManifest creates portable metadata export", () => {
  const files = [createFileRecord({ name: "readme.md", size: 256, type: "text/markdown" }, 0)];
  const manifest = buildManifest(files);

  assert.equal(manifest.summary.totalFiles, 1);
  assert.equal(manifest.files[0].name, "readme.md");
  assert.match(manifest.generatedAt, /^\d{4}-\d{2}-\d{2}T/);
});
