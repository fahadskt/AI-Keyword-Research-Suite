import React from 'react';

interface KeywordInputProps {
  keywords: string;
  onKeywordsChange: (value: string) => void;
  onGenerate: () => void;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ keywords, onKeywordsChange, onGenerate }) => {
  return (
    <div className="mb-6">
      <h3 className="flex items-center text-sm font-medium mb-3">
        <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Enter Keywords
      </h3>
      <div className="flex space-x-3 mb-3">
        <button
          className="flex items-center text-sm text-violet-600 hover:text-violet-700"
          onClick={() => {/* Generate from Niche logic */}}
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Generate from Niche
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-700">
          Enter Manually
        </button>
      </div>
      <input
        type="text"
        value={keywords}
        onChange={(e) => onKeywordsChange(e.target.value)}
        placeholder="e.g., digital marketing, pet care, fitness equipment"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 mb-3"
      />
      <button
        onClick={onGenerate}
        className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition-colors flex items-center justify-center"
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Generate Keywords
      </button>
    </div>
  );
};

export default KeywordInput;