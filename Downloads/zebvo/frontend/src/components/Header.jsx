import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>

        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">
            Social Media Scraper Dashboard
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Start Scraping
          </button>
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </header>
  );
}
