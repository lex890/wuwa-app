const CACHE_KEY = "wuwa-data";

export function getCachedData() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

export function setCachedData(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch (err) {
    console.warn("Cache write failed:", err);
  }
  logCacheSize(data)
}

function logCacheSize(data) {
  const sizeInKB = new Blob([JSON.stringify(data)]).size / 1024;
  console.log("Cache size:", sizeInKB.toFixed(2), "KB");
}