import React from 'react';

const Hero = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-4">
        <span className="inline-flex items-center">
          <svg className="w-8 h-8 text-violet-600 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          AI Keyword Research Suite
        </span>
      </h1>
      <p className="text-gray-600 mb-6">
        Generate keywords, analyze clusters, and discover ranking opportunities
      </p>
      <button className="bg-violet-600 text-white px-6 py-3 rounded-md hover:bg-violet-700 transition-colors">
        Get Expert SEO Guidance
      </button>
    </div>
  );
};

export default Hero;