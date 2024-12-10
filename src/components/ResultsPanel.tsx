import React, { useState } from 'react';
import { KeywordCategory, KeywordData } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  keywords: string[];
  isLoading: boolean;
  categories: KeywordCategory[];
}

export const ResultsPanel: React.FC<Props> = ({
  keywords,
  isLoading,
  categories
}) => {
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null);
  const [view, setView] = useState<'table' | 'details'>('table');

  const formatNumber = (num: number): string => new Intl.NumberFormat().format(num);

  const renderMetricBar = (value: number, type: 'competition' | 'difficulty'): JSX.Element => {
    const getColor = () => {
      switch (type) {
        case 'competition':
          return value <= 33 ? 'bg-green-500' : value <= 66 ? 'bg-yellow-500' : 'bg-red-500';
        case 'difficulty':
          return value <= 33 ? 'bg-green-500' : value <= 66 ? 'bg-yellow-500' : 'bg-red-500';
        default:
          return 'bg-gray-500';
      }
    };

    return (
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${getColor()}`} style={{ width: `${value}%` }} />
      </div>
    );
  };

  const getCompetitionValue = (level: string): number => {
    switch (level.toLowerCase()) {
      case 'high':
        return 100;
      case 'medium':
        return 66;
      case 'low':
        return 33;
      default:
        return 50;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'details' && selectedKeyword) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <button 
          onClick={() => {
            setView('table');
            setSelectedKeyword(null);
          }}
          className="mb-4 text-violet-600 hover:text-violet-700 flex items-center"
        >
          ← Back to Keywords
        </button>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">{selectedKeyword.keyword}</h3>
          
          {/* Main Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-600">Monthly Volume</div>
              <div className="text-xl font-semibold">{formatNumber(selectedKeyword.volume)}</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-600">CPC</div>
              <div className="text-xl font-semibold">${selectedKeyword.cpc.toFixed(2)}</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-600">Intent</div>
              <div className="text-xl font-semibold">{selectedKeyword.intent}</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-600">Seasonality</div>
              <div className="text-xl font-semibold">{selectedKeyword.seasonality}</div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedKeyword.trend.map((value: number, i: number) => ({ month: i + 1, value }))}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* SERP Features */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">SERP Features</h4>
            <div className="flex flex-wrap gap-2">
              {selectedKeyword.serpFeatures.map((feature: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header section */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800">Keyword Analysis</h2>
        {categories.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="block font-medium">Total Keywords</span>
              <span>{keywords.length}</span>
            </div>
            <div>
              <span className="block font-medium">Categories</span>
              <span>{categories.length}</span>
            </div>
            <div>
              <span className="block font-medium">Avg. Difficulty</span>
              <span>{Math.round(categories.reduce((acc, cat) => acc + cat.summary.avgDifficulty, 0) / categories.length)}%</span>
            </div>
            <div>
              <span className="block font-medium">Avg. CPC</span>
              <span>${(categories.reduce((acc, cat) => acc + cat.summary.avgCpc, 0) / categories.length).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8 last:mb-0">
            <h3 className="text-lg font-medium mb-4">{category.name}</h3>
            <div className="space-y-4">
              {category.keywords.map((keyword, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 hover:border-violet-500 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedKeyword(keyword);
                    setView('details');
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{keyword.keyword}</h4>
                      <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                        <span>Volume: {formatNumber(keyword.volume)}</span>
                        <span>CPC: ${keyword.cpc.toFixed(2)}</span>
                        <span>Intent: {keyword.intent}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Competition</div>
                        {renderMetricBar(getCompetitionValue(keyword.competition), 'competition')}
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Difficulty</div>
                        {renderMetricBar(keyword.difficulty, 'difficulty')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPanel;