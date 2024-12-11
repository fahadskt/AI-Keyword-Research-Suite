import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Target, BarChart2, Layout, Globe, Settings } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Keyword Research', icon: Search },
    { path: '/competitor', label: 'Competitor Analysis', icon: Target },
    { path: '/content', label: 'Content Strategy', icon: Layout },
    { path: '/trends', label: 'Market Trends', icon: BarChart2 },
    { path: '/local-seo', label: 'Local SEO', icon: Globe },
  ];

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-4 text-sm font-medium ${
                  location.pathname === item.path
                    ? 'text-violet-600 border-b-2 border-violet-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            to="/settings"
            className="flex items-center px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
}; 