import React from 'react';
import { ExternalLink, Trash2 } from 'lucide-react';

export default function PostCard({ post }) {
  const [showTranslations, setShowTranslations] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');

  const languages = {
    en: 'English',
    hi: 'Hindi',
    pa: 'Punjabi',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ar: 'Arabic',
    zh: 'Chinese',
    ru: 'Russian',
    ja: 'Japanese',
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Application': 'bg-blue-100 text-blue-800',
      'Renewal': 'bg-purple-100 text-purple-800',
      'Appointments': 'bg-pink-100 text-pink-800',
      'Tatkal': 'bg-orange-100 text-orange-800',
      'Visa': 'bg-indigo-100 text-indigo-800',
      'Travel Issues': 'bg-red-100 text-red-800',
      'Government Announcements': 'bg-teal-100 text-teal-800',
      'Scams/Fraud': 'bg-yellow-100 text-yellow-800',
      'News': 'bg-cyan-100 text-cyan-800',
      'Personal Experiences': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-gray-800">@{post.author.handle}</p>
          <p className="text-xs text-gray-500">{post.platform.toUpperCase()}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getSentimentColor(post.sentiment)}`}>
          {post.sentiment?.toUpperCase()}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-700 text-sm mb-3 line-clamp-3">{post.originalContent}</p>

      {/* Summary */}
      <div className="bg-blue-50 p-2 rounded mb-3">
        <p className="text-xs text-gray-700"><strong>Summary:</strong> {post.summary}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(post.category)}`}>
          {post.category}
        </span>
        {post.keywords.slice(0, 2).map((keyword) => (
          <span key={keyword} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            #{keyword}
          </span>
        ))}
      </div>

      {/* Engagement */}
      <div className="flex justify-between items-center text-xs text-gray-600 mb-3">
        <span>❤️ {post.engagement?.likes || 0}</span>
        <span>💬 {post.engagement?.comments || 0}</span>
        <span>📤 {post.engagement?.shares || 0}</span>
      </div>

      {/* Translation Button */}
      <div className="border-t pt-3">
        <button
          onClick={() => setShowTranslations(!showTranslations)}
          className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-semibold hover:bg-blue-200 transition-colors"
        >
          🌐 Translate
        </button>

        {showTranslations && (
          <div className="mt-3 space-y-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
              {post.translations?.[selectedLanguage] || post.originalContent}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t text-xs text-gray-500">
        <a
          href={post.postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center"
        >
          <ExternalLink size={14} className="mr-1" /> View
        </a>
        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
