import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scraperService, postService } from '../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
  const navigate = useNavigate();
  const [scraping, setScraping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter', 'reddit', 'youtube']);
  const [testPostCount, setTestPostCount] = useState(50);
  const [postsGenerated, setPostsGenerated] = useState(false);

  const platformOptions = [
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'facebook', name: 'Facebook', icon: '👍' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'youtube', name: 'YouTube', icon: '📹' },
    { id: 'reddit', name: 'Reddit', icon: '🤖' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  ];

  const handleStartScraping = async () => {
    try {
      setScraping(true);
      const response = await scraperService.startScraping(selectedPlatforms);
      setJobId(response.data.jobId);
      toast.success('Scraping job started!');
    } catch (error) {
      console.error('Error starting scraping:', error);
      toast.error('Failed to start scraping');
    } finally {
      setScraping(false);
    }
  };

  const handleGenerateTestPosts = async () => {
    try {
      setGenerating(true);
      await postService.generateTestPosts(testPostCount);
      setPostsGenerated(true);
      toast.success(`✅ Generated ${testPostCount} test posts!`);
      // Auto navigate to Posts page after 1 second
      setTimeout(() => {
        navigate('/posts');
      }, 1000);
    } catch (error) {
      console.error('Error generating test posts:', error);
      toast.error('Failed to generate test posts');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings & Configuration</h1>

      {/* Scraping Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Scraping Configuration</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Platforms to Scrape
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {platformOptions.map((platform) => (
                <label key={platform.id} className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50" style={{
                  borderColor: selectedPlatforms.includes(platform.id) ? '#3B82F6' : '#D1D5DB',
                  backgroundColor: selectedPlatforms.includes(platform.id) ? '#EFF6FF' : 'white',
                }}>
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPlatforms([...selectedPlatforms, platform.id]);
                      } else {
                        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-2xl">{platform.icon}</span>
                  <span className="ml-2 text-sm font-medium">{platform.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartScraping}
            disabled={scraping || selectedPlatforms.length === 0}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-colors"
          >
            {scraping ? 'Starting Scraping...' : '🚀 Start Scraping'}
          </button>

          {jobId && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Scraping job started! Job ID: <code className="bg-green-100 px-2 py-1 rounded">{jobId}</code>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Test Posts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Generate Test Posts</h2>
        <p className="text-gray-700 mb-4">
          Create dummy posts instantly to test the dashboard without waiting for scraping.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Posts
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={testPostCount}
              onChange={(e) => setTestPostCount(parseInt(e.target.value) || 50)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            onClick={handleGenerateTestPosts}
            disabled={generating}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold transition-colors"
          >
            {generating ? 'Generating...' : '📝 Generate Test Posts'}
          </button>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Generate test posts to immediately populate your dashboard. You can then view them on the Posts, Dashboard, and Statistics pages.
            </p>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">API Configuration</h2>
        <p className="text-gray-700 mb-4">
          Update your API keys and authentication tokens in the <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file:
        </p>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`TWITTER_BEARER_TOKEN=your_token_here
REDDIT_CLIENT_ID=your_id_here
YOUTUBE_API_KEY=your_key_here
GOOGLE_TRANSLATE_API_KEY=your_key_here`}
        </pre>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Posts per Platform
            </label>
            <input
              type="number"
              defaultValue="500"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scraping Interval (seconds)
            </label>
            <input
              type="number"
              defaultValue="3600"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
