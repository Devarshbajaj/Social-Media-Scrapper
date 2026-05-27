import React, { useEffect, useState } from 'react';
import { postService, clusterService } from '../services/api';
import StatCard from '../components/StatCard';
import PostCard from '../components/PostCard';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, postsRes] = await Promise.all([
          postService.getStatistics(),
          postService.getTrendingPosts(),
        ]);
        setStats(statsRes.data.data);
        setPosts(postsRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Posts" value={stats?.totalPosts || 0} icon="📊" />
        <StatCard title="Valid Posts" value={stats?.validPosts || 0} icon="✅" />
        <StatCard title="Gibberish" value={stats?.gibberishPosts || 0} icon="🚫" />
        <StatCard title="Platforms" value={Object.keys(stats?.byPlatform || {}).length} icon="🌐" />
      </div>

      {/* Trending Posts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Trending Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* Categories Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Posts by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(stats?.byCategory || {}).map(([category, count]) => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{count}</div>
              <div className="text-sm text-gray-600">{category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
