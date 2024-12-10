import React, { useState } from 'react';
import { KeywordCategory, KeywordMetric } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultsPanelProps {
  keywords: string[];
  isLoading: boolean;
  categories: KeywordCategory[];
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  categories
}) => {
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.name || '');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [view, setView] = useState<'table' | 'analysis' | 'trends'>('table');

  // Helper function to format numbers
  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

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
        <div className={`h-full ${getColor()}`} style={{ width: `${value}%` }} />
      </div>
    );
  };

  const renderKeywordDetails = (keyword: KeywordMetric) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{keyword.keyword}</h3>
      
      {/* Main Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3 rounded shadow-sm">
          <div className="text-sm text-gray-600">Monthly Volume</div>
          <div className="text-xl font-semibold">{formatNumber(keyword.volume)}</div>
        </div>
        <div className="bg-white p-3 rounded shadow-sm">
          <div className="text-sm text-gray-600">CPC</div>
          <div className="text-xl font-semibold">${keyword.cpc.toFixed(2)}</div>
        </div>
        <div className="bg-white p-3 rounded shadow-sm">
          <div className="text-sm text-gray-600">Intent</div>
          <div className="text-xl font-semibold">{keyword.intent}</div>
        </div>
        <div className="bg-white p-3 rounded shadow-sm">
          <div className="text-sm text-gray-600">Seasonality</div>
          <div className="text-xl font-semibold">{keyword.seasonality}</div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={keyword.trend.map((value: number, i: number) => ({ month: i + 1, value }))}>
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
          {keyword.serp_features.map((feature: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Ranking Difficulty Analysis */}
      <div>
        <h4 className="text-sm font-medium mb-2">Ranking Difficulty Analysis</h4>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Competition</span>
              <span>{keyword.ranking_difficulty.factors.competition}%</span>
            </div>
            {renderMetricBar(keyword.ranking_difficulty.factors.competition, 'difficulty')}
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Content Depth</span>
              <span>{keyword.ranking_difficulty.factors.content_depth}%</span>
            </div>
            {renderMetricBar(keyword.ranking_difficulty.factors.content_depth, 'difficulty')}
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Authority Needed</span>
              <span>{keyword.ranking_difficulty.factors.authority_needed}%</span>
            </div>
            {renderMetricBar(keyword.ranking_difficulty.factors.authority_needed, 'difficulty')}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Category Summary */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-5 gap-4">
          {categories.length > 0 && (
            <>
              <div className="text-center">
                <div className="text-2xl font-semibold text-violet-600">
                  {formatNumber(categories.find(c => c.name === activeTab)?.summary.totalVolume || 0)}
                </div>
                <div className="text-sm text-gray-600">Total Volume</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-violet-600">
                  ${(categories.find(c => c.name === activeTab)?.summary.avgCpc || 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Avg. CPC</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-violet-600">
                  {categories.find(c => c.name === activeTab)?.summary.topIntent}
                </div>
                <div className="text-sm text-gray-600">Top Intent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-violet-600">
                  {(categories.find(c => c.name === activeTab)?.summary.growthRate || 0)}%
                </div>
                <div className="text-sm text-gray-600">Growth Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-violet-600">
                  {categories.find(c => c.name === activeTab)?.keywords.length}
                </div>
                <div className="text-sm text-gray-600">Keywords</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex border-b border-gray-200 px-4">
        <button
          className={`px-4 py-2 font-medium text-sm ${view === 'table' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}
          onClick={() => setView('table')}
        >
          Table View
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${view === 'analysis' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}
          onClick={() => setView('analysis')}
        >
          Analysis
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${view === 'trends' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'}`}
          onClick={() => setView('trends')}
        >
          Trends
        </button>
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
        {view === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-4">KEYWORD</th>
                  <th className="pb-4">VOLUME</th>
                  <th className="pb-4">INTENT</th>
                  <th className="pb-4">CPC</th>
                  <th className="pb-4">COMPETITION</th>
                  <th className="pb-4">DIFFICULTY</th>
                  <th className="pb-4">OPPORTUNITY</th>
                </tr>
              </thead>
              <tbody>
                {categories
                  .find(c => c.name === activeTab)
                  ?.keywords.map((keyword, index) => (
                    <tr 
                      key={index} 
                      className={`border-t border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedKeyword === keyword.keyword ? 'bg-violet-50' : ''
                      }`}
                      onClick={() => setSelectedKeyword(keyword.keyword)}
                    >
                      <td className="py-3">{keyword.keyword}</td>
                      <td className="py-3">{formatNumber(keyword.volume)}</td>
                      <td className="py-3">{keyword.intent}</td>
                      <td className="py-3">${keyword.cpc.toFixed(2)}</td>
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
        )}

        {view === 'analysis' && selectedKeyword && (
          renderKeywordDetails(
            categories
              .find(c => c.name === activeTab)
              ?.keywords.find(k => k.keyword === selectedKeyword)!
          )
        )}

        {view === 'trends' && (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={categories
                .find(c => c.name === activeTab)
                ?.keywords.map(k => ({
                  name: k.keyword,
                  ...k.trend.reduce((acc, val, i) => ({ ...acc, [`month${i+1}`]: val }), {})
                }))}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {Array.from({ length: 12 }).map((_, i) => (
                  <Line 
                    key={i}
                    type="monotone" 
                    dataKey={`month${i+1}`} 
                    stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;