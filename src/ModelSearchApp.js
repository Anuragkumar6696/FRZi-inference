import { ModelSearchManager } from './ModelSearchManager.js';
import { fetchModelsInBackground, initNetworkMonitor } from './networkMonitor.js';

const API_URL = 'https://binaire.app/hf-models-api.json';
const searchManager = new ModelSearchManager();

// 1. Debounce helper for search inputs (Task 2.2)
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// 2. Throttle helper for frequent events (Task 2.2)
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// 3. Initialize Network Status Monitoring (Task 2.8)
initNetworkMonitor((isOnline) => {
  const statusEl = document.getElementById('connection-status') || createStatusBanner();
  statusEl.textContent = isOnline ? '🟢 Online (Full API Access)' : '🔴 Offline Mode (Using Cached Data)';
  statusEl.className = isOnline ? 'status-online' : 'status-offline';
});

function createStatusBanner() {
  const banner = document.createElement('div');
  banner.id = 'connection-status';
  banner.style.cssText = 'padding: 8px; text-align: center; font-weight: bold; background: #eee;';
  document.body.prepend(banner);
  return banner;
}

// 4. Load Data from API in Background (Task 2.9)
function loadModels() {
  fetchModelsInBackground(
    API_URL,
    (data) => {
      const models = Array.isArray(data) ? data : data.models || [];
      searchManager.setModels(models);
      renderModels(models);
      console.log('Models successfully loaded and validated:', models.length);
    },
    (error) => {
      console.error('Background fetch or JSON validation error:', error);
    }
  );
}

// 5. Render UI list of models
function renderModels(models) {
  let container = document.getElementById('model-list-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'model-list-container';
    document.body.appendChild(container);
  }
  
  container.innerHTML = models.map(m => `
    <div class="model-card" style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
      <h3>${m.name || 'Unnamed Model'}</h3>
      <p><strong>Family:</strong> ${m.family || 'N/A'}</p>
      <p><strong>Pipeline Tag:</strong> ${m.pipelineTag || 'N/A'}</p>
      <p><strong>Safetensors Count:</strong> ${m.safetensorsCount || 0}</p>
    </div>
  `).join('');
}

// 6. Setup Interactive Search and Filters
document.addEventListener('DOMContentLoaded', () => {
  loadModels();

  // Search Input with Debouncing (Task 2.2)
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      const query = e.target.value;
      const results = searchManager.searchModels(query);
      renderModels(results);
    }, 300));
  }

  // Filter Trigger Example (Task 2.3)
  const filterButton = document.getElementById('apply-filters');
  if (filterButton) {
    filterButton.addEventListener('click', () => {
      const filtered = searchManager.filterModels({
        pipelineTag: document.getElementById('pipeline-select')?.value,
        safetensorMin: Number(document.getElementById('min-safetensors')?.value) || 0,
        safetensorMax: Number(document.getElementById('max-safetensors')?.value) || 10000
      });
      renderModels(filtered);
    });
  }
});