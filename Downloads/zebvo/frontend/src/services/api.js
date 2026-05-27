import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const postService = {
  getPosts: (filters) => api.get('/posts', { params: filters }),
  getPostById: (id) => api.get(`/posts/${id}`),
  searchPosts: (query) => api.get('/posts/search', { params: { q: query } }),
  getPostsByPlatform: (platform) => api.get(`/posts/platform/${platform}`),
  getPostsByCategory: (category) => api.get(`/posts/category/${category}`),
  getStatistics: () => api.get('/posts/statistics'),
  getTrendingPosts: () => api.get('/posts/trending'),
  generateTestPosts: (count = 50) => api.post('/posts/test/generate', { count }),
};

export const clusterService = {
  getClusters: (filters) => api.get('/clusters', { params: filters }),
  getClusterById: (id) => api.get(`/clusters/${id}`),
  getTrendingClusters: () => api.get('/clusters/trending'),
  getClustersByCategory: (category) => api.get(`/clusters/category/${category}`),
  triggerClustering: () => api.post('/clusters/trigger'),
};

export const scraperService = {
  startScraping: (platforms) => api.post('/scraper/start', { platforms }),
  getJobStatus: (jobId) => api.get(`/scraper/job/${jobId}`),
  getScrapingHistory: () => api.get('/scraper/history'),
};

export const exportService = {
  exportToCSV: (filters) => api.get('/export/csv', {
    params: filters,
    responseType: 'blob',
  }),
  exportToJSON: (filters) => api.get('/export/json', {
    params: filters,
    responseType: 'blob',
  }),
  generateReport: () => api.get('/export/report'),
};

export default api;
