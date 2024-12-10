import React, { useState } from 'react';

interface QuestionFinderProps {
  generatedKeywords: string[];
}

const QuestionFinder: React.FC<QuestionFinderProps> = ({ generatedKeywords }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = generatedKeywords
    .filter(kw => kw.toLowerCase().includes('how') || 
                  kw.toLowerCase().includes('what') || 
                  kw.toLowerCase().includes('why') ||
                  kw.toLowerCase().includes('when') ||
                  kw.toLowerCase().includes('where') ||
                  kw.toLowerCase().includes('which'))
    .filter(q => !searchTerm || q.toLowerCase().includes(searchTerm.toLowerCase()));

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter questions (e.g., 'marketing')"
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>
      {filteredQuestions.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {filteredQuestions.map((question, index) => (
            <li key={index} className="flex items-start">
              <span className="text-violet-600 mr-2">•</span>
              {question}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">
          {searchTerm ? 'No matching questions found.' : 'No questions available in the generated keywords.'}
        </p>
      )}
    </div>
  );
};

export default QuestionFinder;