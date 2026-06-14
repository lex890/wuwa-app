// util functions for localStorage caching

const CACHE_KEY = "wuwa-data";

export function getCachedData() {
  const cached = localStorage.getItem(CACHE_KEY);
  try {
    return JSON.parse(cached);
  } catch {
    console.log("Failed to parse skipping cache write")
    return
  }
}

export function setCachedData(data) {
  try {
    console.log("saving data: ", {
      size: Array.isArray(data) ? data.length : "non-array",
      timestamp: Date.now(),
    })

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    )
    console.log("write success")

  } catch (err) {
    console.warn("write failed: ", err);
  }
  logCacheSize(data)
}

function logCacheSize(data) {
  const sizeInKB = new Blob([JSON.stringify(data)]).size / 1024;
  console.log("Cache size:", sizeInKB.toFixed(2), "KB");
}

