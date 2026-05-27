import React, { useEffect, useState } from 'react';
import { clusterService } from '../services/api';

export default function Clusters() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    try {
      setLoading(true);
      const response = await clusterService.getClusters();
      setClusters(response.data.data);
    } catch (error) {
      console.error('Error fetching clusters:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clustered Posts</h1>
        <button
          onClick={fetchClusters}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading clusters...</div>
      ) : clusters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No clusters found</div>
      ) : (
        <div className="space-y-4">
          {clusters.map((cluster) => (
            <div key={cluster._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{cluster.title}</h3>
              <p className="text-gray-700 mb-3">{cluster.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {cluster.postCount} posts
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {cluster.category}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {cluster.sentiment}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Updated: {new Date(cluster.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
