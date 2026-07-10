// util functions for localStorage caching

export function getCachedData(CACHE_KEY) {
  console.log('fetching cache data')
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    console.log(cached)
    if (!cached) return null;

    const { timestamp, ...local } = JSON.parse(cached);
    console.log(`Retrieved data from ${timestamp}`)
    return local.data;
  } catch {
    console.log("Failed to parse, skipping cache read");
    return null;
  }
}

export function setCachedData(data, CACHE_KEY) {
  try {
    console.log('this is: ', data)
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

  } catch (err) {
    console.warn("write failed: ", err);
  }
  logCacheSize(data)
}

export function clearLocalStorage() {
  localStorage.clear
}

function logCacheSize(data) {
  const sizeInKB = new Blob([JSON.stringify(data)]).size / 1024;
  console.log("Cache size:", sizeInKB.toFixed(2), "KB");
}

