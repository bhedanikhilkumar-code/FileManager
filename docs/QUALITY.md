# Quality Standard — FileManager

This repository has been upgraded from documentation-only to a working browser prototype with testable core logic and CI-backed quality checks.

## Quality Goals

| Goal | What it means |
| --- | --- |
| Working app | `index.html` launches a real browser UI for local file metadata analysis. |
| Testable logic | File classification, filtering, sorting, summaries, duplicate detection, recommendations, and manifest export live in pure functions. |
| Local-first privacy | Selected files are analyzed through browser metadata; contents are not uploaded. |
| Repeatable validation | Node tests and project structure validation run locally and in GitHub Actions. |
| Professional presentation | README, architecture, roadmap, support, security, and review docs are kept in sync. |

## Commands

| Check | Command |
| --- | --- |
| Start local preview | `npm start` |
| Run unit tests | `npm test` |
| Validate project structure | `npm run check` |
| App CI workflow | `.github/workflows/app-quality.yml` |
| Repository health workflow | `.github/workflows/repository-health.yml` |

## Test Coverage Focus

The current unit tests cover:

- Human-readable byte formatting.
- File type inference from names and MIME types.
- Browser file metadata normalization.
- Search, type filtering, and sorting.
- Summary generation and duplicate candidate detection.
- Cleanup recommendation generation.
- Portable JSON manifest creation.

## Definition of Strong

A strong FileManager change should satisfy:

- [ ] Core logic remains covered by `npm test`.
- [ ] UI behavior can be manually smoke-tested with sample files.
- [ ] README setup and feature notes match the implementation.
- [ ] No file contents, private paths, secrets, or generated manifests are committed accidentally.
- [ ] New browser APIs are permission-based and documented.

## Manual Smoke Test

1. Run `npm start`.
2. Open `http://localhost:4173`.
3. Click **Load sample workspace**.
4. Confirm file count, total size, largest file, recommendations, and file rows update.
5. Search for `demo` and filter by `Video`.
6. Export a manifest and inspect the generated JSON.
7. Clear the workspace.

## CI Expectations

Both workflows should remain green:

- **Repository Health** checks the professional documentation/community layer.
- **App Quality** checks the actual application logic and project structure.
