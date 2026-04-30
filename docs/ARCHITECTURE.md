# Architecture — FileManager

## Purpose

FileManager is a local-first browser prototype for analyzing selected files without uploading file contents. It turns browser file metadata into searchable records, storage summaries, cleanup recommendations, and an exportable JSON manifest.

## System Context

```mermaid
flowchart LR
    User[User] --> Browser[Browser UI]
    Browser --> Picker[File Input / Drag Drop]
    Picker --> Records[Normalized File Records]
    Records --> Logic[src/file-manager.js]
    Logic --> Insights[Stats, Filters, Recommendations]
    Logic --> Export[JSON Manifest]
    Tests[Node Unit Tests] --> Logic
```

## Runtime Boundaries

| Boundary | Responsibility | Notes |
| --- | --- | --- |
| Browser UI | Presents upload/drop zone, filters, stats, recommendations, and file list | Implemented in `index.html`, `src/app.js`, and `src/styles.css` |
| File metadata | Uses `File` object metadata from the browser | File contents are not uploaded or persisted |
| Core logic | Pure functions for classification, formatting, filtering, sorting, and recommendations | Implemented in `src/file-manager.js` and covered by tests |
| Export | Creates a portable JSON manifest from selected metadata | Runs entirely in the browser |
| Quality layer | Unit tests and project validation | `npm test`, `npm run check`, and GitHub Actions |

## Primary Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Browser UI
    participant Core as File Manager Logic
    participant Export as Manifest Export
    U->>UI: Select or drag files
    UI->>Core: Create normalized records
    Core-->>UI: Summary and classified file list
    U->>UI: Search, filter, and sort
    UI->>Core: Request filtered/sorted view
    Core-->>UI: Updated file list
    UI->>Core: Request recommendations
    Core-->>UI: Duplicate, large-file, and type insights
    U->>Export: Download JSON manifest
```

## Core Modules

| Module | Role |
| --- | --- |
| `index.html` | Semantic app shell and accessible controls |
| `src/app.js` | DOM orchestration, event handling, rendering, sample workspace, manifest download |
| `src/file-manager.js` | Pure file metadata functions: classify, format, filter, sort, summarize, recommend, export |
| `src/styles.css` | Dark responsive portfolio UI |
| `tests/file-manager.test.mjs` | Node tests for core behavior |
| `scripts/serve.mjs` | Dependency-free local preview server |
| `scripts/validate-project.mjs` | Project structure and README validation |

## Data Model

```mermaid
classDiagram
    class FileRecord {
      string id
      string name
      string path
      string extension
      number size
      string formattedSize
      string type
      string icon
      string? modifiedAt
    }

    class Manifest {
      string generatedAt
      Summary summary
      FileRecord[] files
    }

    class Summary {
      number totalFiles
      number totalBytes
      string formattedTotalSize
      object byType
      FileRecord? largestFile
      number typeCount
    }

    Manifest --> Summary
    Manifest --> FileRecord
```

## Quality Gates

- `npm test` validates core logic with Node's built-in test runner.
- `npm run check` validates expected app, docs, and workflow files.
- `.github/workflows/app-quality.yml` runs tests and validation on push/PR.
- `.github/workflows/repository-health.yml` validates professional repository files.

## Security and Privacy Notes

- The prototype uses browser-provided metadata and does not upload files.
- Manifest export contains file names, sizes, paths, types, and modified timestamps; users should review before sharing.
- Future File System Access API integration should remain explicit, permission-based, and documented.
