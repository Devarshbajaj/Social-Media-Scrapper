import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Sidebar({ open, setOpen }) {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Posts', path: '/posts', icon: '📝' },
    { name: 'Clusters', path: '/clusters', icon: '🔗' },
    { name: 'Statistics', path: '/statistics', icon: '📈' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">🌐 Social Scraper</h1>
          <p className="text-sm text-gray-400">Dashboard</p>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-4 py-3 mb-2 rounded-lg hover:bg-gray-800 transition-colors"
              onClick={() => setOpen(false)}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
