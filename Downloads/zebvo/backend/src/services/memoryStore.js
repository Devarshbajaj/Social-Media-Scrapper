/**
 * In-Memory Data Store - Fallback when MongoDB is not available
 */

let posts = [];
let clusters = [];
let jobs = [];

export const memoryStore = {
  // Posts
  addPost: (post) => {
    posts.push({ ...post, _id: Math.random().toString(36).substr(2, 9) });
  },

  addPosts: (newPosts) => {
    posts = [...posts, ...newPosts.map(p => ({ ...p, _id: Math.random().toString(36).substr(2, 9) }))];
  },

  getPosts: (filters = {}, limit = 20, skip = 0) => {
    let filtered = [...posts];

    if (filters.platform) filtered = filtered.filter(p => p.platform === filters.platform);
    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters.sentiment) filtered = filtered.filter(p => p.sentiment === filters.sentiment);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.originalContent.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);
    return { posts: paginated, total };
  },

  getStatistics: () => {
    return {
      totalPosts: posts.length,
      validPosts: posts.filter(p => !p.isGibberish).length,
      gibberishPosts: posts.filter(p => p.isGibberish).length,
      byPlatform: posts.reduce((acc, p) => {
        acc[p.platform] = (acc[p.platform] || 0) + 1;
        return acc;
      }, {}),
      byCategory: posts.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {}),
      bySentiment: posts.reduce((acc, p) => {
        acc[p.sentiment] = (acc[p.sentiment] || 0) + 1;
        return acc;
      }, {}),
    };
  },

  clearPosts: () => {
    posts = [];
  },

  // Jobs
  addJob: (job) => {
    jobs.push({ ...job, _id: Math.random().toString(36).substr(2, 9) });
  },

  getJobs: () => jobs,

  // Clusters
  addCluster: (cluster) => {
    clusters.push({ ...cluster, _id: Math.random().toString(36).substr(2, 9) });
  },

  getClusters: () => clusters,
};

export default memoryStore;
