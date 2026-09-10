export class ModelSearchManager {
  constructor(models = []) {
    this.models = models;
  }

  setModels(models) {
    this.models = models;
  }

  // 2.2 Substring search from start or middle
  searchModels(query) {
    if (!query) return this.models;
    const q = query.toLowerCase().trim();
    return this.models.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.family?.toLowerCase().includes(q)
    );
  }

  // 2.3 Filter tags & 2.3.5 Safetensor min-to-max range
  filterModels(filters = {}) {
    return this.models.filter((m) => {
      if (filters.pipelineTag && m.pipelineTag !== filters.pipelineTag) return false;
      if (filters.familyTag && m.family !== filters.familyTag) return false;
      if (filters.architectureTag && m.architectureTag !== filters.architectureTag) return false;
      if (filters.weightTag && m.weightTag !== filters.weightTag) return false;
      
      const safetensors = m.safetensorsCount || 0;
      if (filters.safetensorMin !== undefined && safetensors < filters.safetensorMin) return false;
      if (filters.safetensorMax !== undefined && safetensors > filters.safetensorMax) return false;

      return true;
    });
  }

  // 2.4 Sorting (Safetensor file count & Alphabetical A-Z / Z-A)
  sortModels(data, criteria, ascending = true) {
    return [...data].sort((a, b) => {
      if (criteria === 'safetensors') {
        return ascending ? a.safetensorsCount - b.safetensorsCount : b.safetensorsCount - a.safetensorsCount;
      } else if (criteria === 'name') {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }
      return 0;
    });
  }
}