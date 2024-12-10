import React from 'react';

const QuestionFinder = () => {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-600" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14A6 6 0 108 2a6 6 0 000 12z" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 11V9m0-4v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Question Finder
        </div>
        <a href="#" className="text-sm text-violet-600 hover:text-violet-700">
          Get Content Strategy →
        </a>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Enter your main keyword (e.g., 'digital marketing')"
          className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 15l-4-4m2-6A6 6 0 111 7a6 6 0 0112 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuestionFinder;