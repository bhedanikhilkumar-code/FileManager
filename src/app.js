import {
  buildManifest,
  createFileRecord,
  filterFiles,
  formatBytes,
  getTypeRules,
  recommendCleanup,
  sortFiles,
  summarizeFiles,
} from "./file-manager.js";

const state = {
  files: [],
  query: "",
  type: "all",
  sortBy: "name",
  direction: "asc",
};

const elements = {
  filePicker: document.querySelector("#file-picker"),
  dropZone: document.querySelector("#drop-zone"),
  loadSample: document.querySelector("#load-sample"),
  exportManifest: document.querySelector("#export-manifest"),
  clearFiles: document.querySelector("#clear-files"),
  search: document.querySelector("#search"),
  typeFilter: document.querySelector("#type-filter"),
  sortBy: document.querySelector("#sort-by"),
  sortDirection: document.querySelector("#sort-direction"),
  statFiles: document.querySelector("#stat-files"),
  statSize: document.querySelector("#stat-size"),
  statLargest: document.querySelector("#stat-largest"),
  statTypes: document.querySelector("#stat-types"),
  recommendations: document.querySelector("#recommendations"),
  resultCount: document.querySelector("#result-count"),
  fileList: document.querySelector("#file-list"),
  fileRowTemplate: document.querySelector("#file-row-template"),
};

function sampleFiles() {
  const now = Date.now();
  return [
    { name: "resume-final.pdf", path: "career/resume-final.pdf", size: 348_000, type: "application/pdf", lastModified: now - 86_400_000 },
    { name: "portfolio-cover.png", path: "assets/portfolio-cover.png", size: 1_980_000, type: "image/png", lastModified: now - 42_000_000 },
    { name: "project-demo.mp4", path: "videos/project-demo.mp4", size: 41_500_000, type: "video/mp4", lastModified: now - 12_000_000 },
    { name: "budget.csv", path: "finance/budget.csv", size: 96_000, type: "text/csv", lastModified: now - 22_000_000 },
    { name: "notes.md", path: "notes/notes.md", size: 12_800, type: "text/markdown", lastModified: now - 5_000_000 },
    { name: "app.js", path: "projects/file-manager/app.js", size: 22_400, type: "text/javascript", lastModified: now - 1_000_000 },
    { name: "project-demo.mp4", path: "archive/project-demo.mp4", size: 41_500_000, type: "video/mp4", lastModified: now - 9_000_000 },
  ].map((file, index) => createFileRecord(file, index));
}

function setFiles(fileList) {
  state.files = Array.from(fileList).map((file, index) => createFileRecord(file, index));
  render();
}

function currentFiles() {
  return sortFiles(filterFiles(state.files, { query: state.query, type: state.type }), state.sortBy, state.direction);
}

function updateTypeFilter() {
  const availableTypes = new Set(["all", ...getTypeRules().map((rule) => rule.type), "Other"]);
  for (const file of state.files) availableTypes.add(file.type);

  const previous = elements.typeFilter.value || "all";
  elements.typeFilter.innerHTML = "";
  for (const type of availableTypes) {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type === "all" ? "All types" : type;
    elements.typeFilter.append(option);
  }
  elements.typeFilter.value = availableTypes.has(previous) ? previous : "all";
  state.type = elements.typeFilter.value;
}

function renderStats() {
  const summary = summarizeFiles(state.files);
  elements.statFiles.textContent = String(summary.totalFiles);
  elements.statSize.textContent = summary.formattedTotalSize;
  elements.statLargest.textContent = summary.largestFile ? `${summary.largestFile.name} · ${formatBytes(summary.largestFile.size)}` : "—";
  elements.statTypes.textContent = String(summary.typeCount);
}

function renderRecommendations() {
  elements.recommendations.innerHTML = "";
  for (const recommendation of recommendCleanup(state.files)) {
    const item = document.createElement("li");
    item.textContent = recommendation;
    elements.recommendations.append(item);
  }
}

function renderFiles() {
  const files = currentFiles();
  elements.fileList.innerHTML = "";
  elements.resultCount.textContent = state.files.length
    ? `${files.length} of ${state.files.length} files shown`
    : "No files selected yet.";

  if (!files.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = state.files.length ? "No files match the current filters." : "Choose files or load the sample workspace to begin.";
    elements.fileList.append(emptyState);
    return;
  }

  for (const file of files) {
    const row = elements.fileRowTemplate.content.firstElementChild.cloneNode(true);
    row.querySelector(".file-icon").textContent = file.icon;
    row.querySelector(".file-name").textContent = file.name;
    row.querySelector(".file-path").textContent = file.path;
    row.querySelector(".file-type").textContent = file.type;
    row.querySelector(".file-size").textContent = file.formattedSize;
    elements.fileList.append(row);
  }
}

function render() {
  updateTypeFilter();
  renderStats();
  renderRecommendations();
  renderFiles();
  const hasFiles = state.files.length > 0;
  elements.exportManifest.disabled = !hasFiles;
  elements.clearFiles.disabled = !hasFiles;
}

function exportManifest() {
  const manifest = buildManifest(state.files);
  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `filemanager-manifest-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

elements.filePicker.addEventListener("change", (event) => setFiles(event.target.files));
elements.loadSample.addEventListener("click", () => {
  state.files = sampleFiles();
  render();
});
elements.exportManifest.addEventListener("click", exportManifest);
elements.clearFiles.addEventListener("click", () => {
  state.files = [];
  elements.filePicker.value = "";
  render();
});
elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderFiles();
});
elements.typeFilter.addEventListener("change", (event) => {
  state.type = event.target.value;
  renderFiles();
});
elements.sortBy.addEventListener("change", (event) => {
  state.sortBy = event.target.value;
  renderFiles();
});
elements.sortDirection.addEventListener("change", (event) => {
  state.direction = event.target.value;
  renderFiles();
});

for (const eventName of ["dragenter", "dragover"]) {
  elements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropZone.classList.add("is-dragging");
  });
}

for (const eventName of ["dragleave", "drop"]) {
  elements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropZone.classList.remove("is-dragging");
  });
}

elements.dropZone.addEventListener("drop", (event) => {
  const files = event.dataTransfer?.files;
  if (files?.length) setFiles(files);
});

render();
