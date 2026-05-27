import React, { useEffect, useState } from 'react';
import { postService } from '../services/api';
import PostCard from '../components/PostCard';
import FilterPanel from '../components/FilterPanel';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({
    platform: '',
    category: '',
    sentiment: '',
    excludeGibberish: true,
    page: 1,
    limit: 20,
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getPosts(filters);
      setPosts(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Posts</h1>

      {/* Filters */}
      <FilterPanel filters={filters} setFilters={setFilters} />

      {/* Posts Grid */}
      {loading ? (
        <div className="text-center py-8">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No posts found</div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setFilters({ ...filters, page: i + 1 })}
                  className={`px-3 py-2 rounded ${
                    pagination.page === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
