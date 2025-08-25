export const normalizeLevel = (level) => {
  if (!level) return null;
  return level.trim().toLowerCase().replace(/^level/, "class");
};