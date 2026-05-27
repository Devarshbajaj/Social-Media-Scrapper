import React, { useEffect, useState } from 'react';
import { postService, exportService } from '../services/api';

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await postService.getStatistics();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await exportService[`exportTo${format}`]({});
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `posts.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Statistics & Reports</h1>
        <div className="space-x-2">
          <button
            onClick={() => handleExport('CSV')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            📥 Export CSV
          </button>
          <button
            onClick={() => handleExport('JSON')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📥 Export JSON
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm">Total Posts</h3>
          <p className="text-4xl font-bold text-blue-600">{stats?.totalPosts || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm">Valid Posts</h3>
          <p className="text-4xl font-bold text-green-600">{stats?.validPosts || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm">Gibberish Posts</h3>
          <p className="text-4xl font-bold text-red-600">{stats?.gibberishPosts || 0}</p>
        </div>
      </div>

      {/* By Platform */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Posts by Platform</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(stats?.byPlatform || {}).map(([platform, count]) => (
            <div key={platform} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 capitalize">{platform}</p>
              <p className="text-3xl font-bold text-indigo-600">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* By Category */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Posts by Category</h2>
        <div className="space-y-2">
          {Object.entries(stats?.byCategory || {})
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-700">{category}</span>
                <div className="flex items-center">
                  <div className="w-48 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(count / Math.max(...Object.values(stats?.byCategory || {}))) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="font-bold text-right w-12">{count}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* By Sentiment */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Posts by Sentiment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats?.bySentiment || {}).map(([sentiment, count]) => {
            let color = 'bg-gray-100 text-gray-800';
            if (sentiment === 'positive') color = 'bg-green-100 text-green-800';
            else if (sentiment === 'negative') color = 'bg-red-100 text-red-800';

            return (
              <div key={sentiment} className={`${color} rounded-lg p-6 text-center`}>
                <p className="capitalize font-semibold">{sentiment}</p>
                <p className="text-3xl font-bold mt-2">{count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
