# Roadmap — FileManager

This roadmap focuses on turning the current browser prototype into a deeper productivity utility while keeping privacy and reviewability strong.

## Completed Foundation

- [x] Working browser UI for local file metadata analysis.
- [x] Drag/drop and file picker workflow.
- [x] Search, type filtering, sorting, summary cards, and cleanup recommendations.
- [x] JSON manifest export.
- [x] Node unit tests for core logic.
- [x] App Quality and Repository Health GitHub Actions workflows.

## Priority 1 — Better Organization Views

- [ ] Add folder tree visualization from `webkitRelativePath` metadata.
- [ ] Add file-type storage chart using lightweight SVG/CSS.
- [ ] Add quick filters for large files, duplicates, unknown files, and recent files.
- [ ] Add keyboard shortcuts for search, export, and clear.

## Priority 2 — Manifest Workflows

- [ ] Import a previously exported manifest for comparison.
- [ ] Add before/after manifest diff view for audits and backups.
- [ ] Export CSV alongside JSON.
- [ ] Add manifest schema documentation.

## Priority 3 — Browser Capability Upgrade

- [ ] Explore optional File System Access API integration for Chromium-based browsers.
- [ ] Keep all file-system actions explicit and permission-based.
- [ ] Document unsupported browser fallbacks clearly.
- [ ] Add safety prompts before any future write/delete action.

## Priority 4 — Testing and Demo Polish

- [ ] Add Playwright smoke tests for the browser workflow.
- [ ] Add screenshots or GIF of the sample workspace flow.
- [ ] Add a GitHub Pages deployment workflow if a public demo is desired.
- [ ] Add accessibility pass for focus states and screen-reader labels.
