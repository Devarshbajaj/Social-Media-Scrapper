import React from 'react';

export default function FilterPanel({ filters, setFilters }) {
  const platforms = ['twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'reddit', 'tiktok'];
  const categories = [
    'Application',
    'Renewal',
    'Appointments',
    'Tatkal',
    'Visa',
    'Travel Issues',
    'Government Announcements',
    'Scams/Fraud',
    'News',
    'Personal Experiences',
  ];
  const sentiments = ['positive', 'negative', 'neutral'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Platform Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
          <select
            value={filters.platform}
            onChange={(e) => setFilters({ ...filters, platform: e.target.value, page: 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sentiment Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
          <select
            value={filters.sentiment}
            onChange={(e) => setFilters({ ...filters, sentiment: e.target.value, page: 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Sentiments</option>
            {sentiments.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Gibberish Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
          <select
            value={filters.excludeGibberish}
            onChange={(e) => setFilters({ ...filters, excludeGibberish: e.target.value === 'true', page: 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="true">Exclude Gibberish</option>
            <option value="false">Include All</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => setFilters({
          platform: '',
          category: '',
          sentiment: '',
          excludeGibberish: true,
          page: 1,
          limit: 20,
        })}
        className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}
