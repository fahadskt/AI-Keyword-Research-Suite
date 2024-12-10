import { Link, useLocation } from 'react-router-dom';
import { Settings, Search, BarChart2, Book } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Search, label: 'Research' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/docs', icon: Book, label: 'Docs' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              KeywordAI
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all duration-200 ${
                    isActive 
                      ? 'bg-violet-50 text-violet-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors">
              <span>Upgrade Pro</span>
              <span className="ml-2 text-xs bg-violet-500 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;