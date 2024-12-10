import React from 'react';

interface KeywordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., digital marketing, pet care, fitness equipment"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 mb-3"
        disabled={isLoading}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className={`w-full py-2 rounded-md transition-colors flex items-center justify-center ${
          isLoading 
            ? 'bg-violet-400 cursor-not-allowed' 
            : 'bg-violet-600 hover:bg-violet-700 text-white'
        }`}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Generate Keywords
          </>
        )}
      </button>
    </div>
  );
};

export default KeywordInput;