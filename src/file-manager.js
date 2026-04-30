const TYPE_RULES = [
  { type: "Images", icon: "🖼️", extensions: ["jpg", "jpeg", "png", "gif", "webp", "svg", "heic"] },
  { type: "Documents", icon: "📄", extensions: ["pdf", "doc", "docx", "txt", "md", "rtf", "odt"] },
  { type: "Spreadsheets", icon: "📊", extensions: ["xls", "xlsx", "csv", "ods"] },
  { type: "Presentations", icon: "📽️", extensions: ["ppt", "pptx", "key"] },
  { type: "Audio", icon: "🎧", extensions: ["mp3", "wav", "flac", "aac", "m4a", "ogg"] },
  { type: "Video", icon: "🎬", extensions: ["mp4", "mov", "avi", "mkv", "webm"] },
  { type: "Archives", icon: "🗜️", extensions: ["zip", "rar", "7z", "tar", "gz"] },
  { type: "Code", icon: "💻", extensions: ["js", "ts", "jsx", "tsx", "py", "dart", "java", "kt", "html", "css", "json", "yml", "yaml"] },
];

export function getTypeRules() {
  return TYPE_RULES.map((rule) => ({ ...rule, extensions: [...rule.extensions] }));
}

export function normalizeExtension(name = "") {
  const cleanName = String(name).trim().toLowerCase();
  const dotIndex = cleanName.lastIndexOf(".");
  if (dotIndex <= 0 || dotIndex === cleanName.length - 1) {
    return "";
  }
  return cleanName.slice(dotIndex + 1);
}

export function inferFileType(name = "", mimeType = "") {
  const extension = normalizeExtension(name);
  const mimeRoot = String(mimeType).split("/")[0];

  if (mimeRoot === "image") return "Images";
  if (mimeRoot === "audio") return "Audio";
  if (mimeRoot === "video") return "Video";
  if (String(mimeType).includes("pdf") || String(mimeType).includes("document")) return "Documents";

  const matchedRule = TYPE_RULES.find((rule) => rule.extensions.includes(extension));
  return matchedRule?.type ?? "Other";
}

export function iconForType(type = "Other") {
  return TYPE_RULES.find((rule) => rule.type === type)?.icon ?? "📦";
}

export function formatBytes(bytes = 0) {
  const value = Number(bytes) || 0;
  if (value < 0) throw new RangeError("bytes must be positive");
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const precision = unitIndex === 0 || size >= 10 ? 0 : 1;
  return `${size.toFixed(precision)} ${units[unitIndex]}`;
}

export function createFileRecord(file, index = 0) {
  const name = file?.name || `untitled-${index}`;
  const path = file?.webkitRelativePath || file?.path || name;
  const size = Number(file?.size) || 0;
  const modifiedAt = file?.lastModified ? new Date(file.lastModified).toISOString() : null;
  const type = inferFileType(name, file?.type);

  return {
    id: `${path}-${size}-${file?.lastModified || index}`,
    name,
    path,
    extension: normalizeExtension(name),
    size,
    formattedSize: formatBytes(size),
    type,
    icon: iconForType(type),
    modifiedAt,
  };
}

export function summarizeFiles(files = []) {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const byType = files.reduce((summary, file) => {
    summary[file.type] = (summary[file.type] || 0) + 1;
    return summary;
  }, {});
  const largestFile = files.reduce((largest, file) => (file.size > (largest?.size ?? -1) ? file : largest), null);

  return {
    totalFiles: files.length,
    totalBytes,
    formattedTotalSize: formatBytes(totalBytes),
    byType,
    largestFile,
    typeCount: Object.keys(byType).length,
  };
}

export function filterFiles(files = [], filters = {}) {
  const query = String(filters.query || "").trim().toLowerCase();
  const selectedType = filters.type && filters.type !== "all" ? filters.type : null;

  return files.filter((file) => {
    const queryMatch = !query || [file.name, file.path, file.extension, file.type].some((value) => String(value).toLowerCase().includes(query));
    const typeMatch = !selectedType || file.type === selectedType;
    return queryMatch && typeMatch;
  });
}

export function sortFiles(files = [], sortBy = "name", direction = "asc") {
  const multiplier = direction === "desc" ? -1 : 1;
  const sorted = [...files].sort((a, b) => {
    if (sortBy === "size") return (a.size - b.size) * multiplier;
    if (sortBy === "modified") return (String(a.modifiedAt || "").localeCompare(String(b.modifiedAt || ""))) * multiplier;
    if (sortBy === "type") return a.type.localeCompare(b.type) * multiplier || a.name.localeCompare(b.name) * multiplier;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" }) * multiplier;
  });
  return sorted;
}

export function findDuplicateCandidates(files = []) {
  const groups = new Map();
  for (const file of files) {
    const key = `${file.name.toLowerCase()}::${file.size}`;
    groups.set(key, [...(groups.get(key) || []), file]);
  }
  return [...groups.values()].filter((group) => group.length > 1);
}

export function recommendCleanup(files = []) {
  if (!files.length) return ["Select files to receive storage and organization insights."];

  const summary = summarizeFiles(files);
  const duplicateGroups = findDuplicateCandidates(files);
  const largeFiles = files.filter((file) => file.size >= 25 * 1024 * 1024);
  const otherFiles = files.filter((file) => file.type === "Other");
  const recommendations = [];

  if (duplicateGroups.length) {
    const duplicateCount = duplicateGroups.reduce((count, group) => count + group.length, 0);
    recommendations.push(`Review ${duplicateCount} possible duplicate files across ${duplicateGroups.length} groups.`);
  }

  if (largeFiles.length) {
    recommendations.push(`Check ${largeFiles.length} large files over 25 MB before backups or sharing.`);
  }

  if (otherFiles.length) {
    recommendations.push(`Classify ${otherFiles.length} unknown file types to improve organization.`);
  }

  const dominantType = Object.entries(summary.byType).sort((a, b) => b[1] - a[1])[0];
  if (dominantType) {
    recommendations.push(`${dominantType[0]} are the largest group by count (${dominantType[1]} files).`);
  }

  recommendations.push(`Workspace size is ${summary.formattedTotalSize} across ${summary.totalFiles} files.`);
  return recommendations;
}

export function buildManifest(files = []) {
  const summary = summarizeFiles(files);
  return {
    generatedAt: new Date().toISOString(),
    summary,
    files: files.map(({ id, name, path, extension, size, type, modifiedAt }) => ({ id, name, path, extension, size, type, modifiedAt })),
  };
}
