import { create } from 'zustand';

export const useStore = create((set) => ({
  // Filters
  selectedPlatforms: [],
  selectedCategories: [],
  selectedSentiment: null,
  searchQuery: '',
  sortBy: 'publishedAt',
  sortOrder: 'desc',
  excludeGibberish: true,
  currentPage: 1,
  pageSize: 20,

  // Data
  posts: [],
  clusters: [],
  stats: null,
  loading: false,
  error: null,

  // Actions
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  setSelectedSentiment: (sentiment) => set({ selectedSentiment: sentiment }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (field, order) => set({ sortBy: field, sortOrder: order }),
  setExcludeGibberish: (exclude) => set({ excludeGibberish: exclude }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

  setPosts: (posts) => set({ posts }),
  setClusters: (clusters) => set({ clusters }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Reset filters
  resetFilters: () => set({
    selectedPlatforms: [],
    selectedCategories: [],
    selectedSentiment: null,
    searchQuery: '',
    currentPage: 1,
  }),
}));

export default useStore;
