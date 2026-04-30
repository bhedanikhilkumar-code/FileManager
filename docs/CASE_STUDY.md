# Case Study — FileManager

## One-Line Summary

FileManager is a local-first browser utility that helps users understand selected files quickly through metadata analysis, search, sorting, cleanup recommendations, and manifest export.

## Why This Repo Was Weak

Before this upgrade, the repository had strong documentation but no actual application code, tests, package manifest, or app-specific CI. That made it look polished on the surface but weak during deeper review.

## What Changed

| Area | Upgrade |
| --- | --- |
| Product | Added a working smart file manager browser prototype. |
| Engineering | Added modular vanilla JavaScript core logic and DOM orchestration. |
| Quality | Added Node unit tests and project validation. |
| CI | Added App Quality workflow in addition to Repository Health. |
| Documentation | Updated README, architecture, quality, and roadmap to match the real implementation. |

## Product Decisions

- **Local-first by default:** The app uses browser file metadata and does not upload file contents.
- **Zero runtime dependencies:** Keeps the prototype easy to run, review, and maintain.
- **Pure logic module:** Core behavior lives in `src/file-manager.js`, making it easy to test without a browser.
- **Portfolio-friendly UI:** The UI is intentionally polished enough for a quick reviewer demo.
- **Manifest export:** Turns a simple file list into a useful audit/backups artifact.

## Main User Journey

1. User opens the app locally.
2. User selects or drags files into the browser.
3. App normalizes metadata into records.
4. User reviews total size, largest file, type counts, and recommendations.
5. User searches, filters, and sorts the workspace.
6. User exports a JSON manifest for review or backup planning.

## Portfolio Value

This upgrade makes the repository stronger because it now demonstrates:

- Practical product thinking.
- Real, runnable frontend implementation.
- Testable JavaScript architecture.
- CI-backed quality discipline.
- Privacy-aware design choices.
- Documentation that matches the actual codebase.

## Next Strong Upgrade

The most valuable next improvement would be a GitHub Pages demo with screenshots and Playwright smoke tests. That would make the project instantly reviewable without requiring local setup.
