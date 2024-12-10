import React, { useState } from 'react';
import { KeywordCategory } from '../types';

interface ResultsPanelProps {
  keywords: string[];
  isLoading: boolean;
  categories: KeywordCategory[];
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  keywords,
  isLoading,
  categories
}) => {
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.name || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (!keywords.length) {
    return null;
  }

  const renderMetricBar = (value: number, type: 'competition' | 'difficulty' | 'opportunity') => {
    const getColor = () => {
      switch (type) {
        case 'competition':
          return value <= 33 ? 'bg-green-500' : value <= 66 ? 'bg-yellow-500' : 'bg-red-500';
        case 'difficulty':
          return value <= 33 ? 'bg-green-500' : value <= 66 ? 'bg-yellow-500' : 'bg-red-500';
        case 'opportunity':
          return value <= 33 ? 'bg-red-500' : value <= 66 ? 'bg-yellow-500' : 'bg-green-500';
      }
    };

    return (
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()}`}
          style={{ width: `${value}%` }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Category Summary */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-violet-600">
              {keywords.length}
            </div>
            <div className="text-sm text-gray-600">Total Keywords</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-violet-600">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-violet-600">
              34%
            </div>
            <div className="text-sm text-gray-600">Avg. Difficulty</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === category.name
                  ? 'text-violet-600 border-b-2 border-violet-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-4">KEYWORD</th>
                <th className="pb-4">VOLUME</th>
                <th className="pb-4">COMPETITION</th>
                <th className="pb-4">DIFFICULTY</th>
                <th className="pb-4">OPPORTUNITY</th>
              </tr>
            </thead>
            <tbody>
              {categories
                .find(c => c.name === activeTab)
                ?.keywords.map((keyword, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="py-3">{keyword.keyword}</td>
                    <td className="py-3">{keyword.volume}</td>
                    <td className="py-3">
                      {renderMetricBar(keyword.competition === 'Low' ? 33 : keyword.competition === 'Medium' ? 66 : 100, 'competition')}
                    </td>
                    <td className="py-3">
                      {renderMetricBar(keyword.difficulty, 'difficulty')}
                    </td>
                    <td className="py-3">
                      {renderMetricBar(keyword.opportunity, 'opportunity')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;