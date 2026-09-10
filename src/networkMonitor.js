export function initNetworkMonitor(callback) {
  // Initial check
  callback(navigator.onLine);

  // Listen for online/offline events
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
}

export function fetchModelsInBackground(url, onSuccess, onError) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => onSuccess(data))
    .catch(error => onError(error));
}