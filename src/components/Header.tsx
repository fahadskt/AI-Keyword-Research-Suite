import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white">
      <div className="flex items-center space-x-2">
        <div className="text-violet-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12H16M8 8H16M8 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-semibold">AI Keyword Research</span>
      </div>
      <button className="bg-violet-600 text-white px-4 py-2 rounded-md text-sm hover:bg-violet-700 transition-colors">
        Book Free SEO Strategy Session
      </button>
    </header>
  );
};

export default Header;