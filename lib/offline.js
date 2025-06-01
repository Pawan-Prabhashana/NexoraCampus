// /lib/offline.js

export function isOffline() {
    return !navigator.onLine;
  }
  
  export function offlineFallbackMessage() {
    return "⚠️ You appear to be offline or experiencing a Vexora storm. I’ll answer with cached guidance if possible.";
  }
  
  export function showOfflineBanner(setBanner) {
    window.addEventListener('online', () => setBanner(false));
    window.addEventListener('offline', () => setBanner(true));
  }
  