import React from 'react';
import { KeywordOverview } from '../types';

interface KeywordOverviewPanelProps {
  overview: KeywordOverview;
}

const KeywordOverviewPanel: React.FC<KeywordOverviewPanelProps> = ({ overview }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-semibold text-violet-600">
            {overview.totalKeywords}
          </div>
          <div className="text-sm text-gray-600">Total Keywords</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-violet-600">
            {overview.avgDifficulty}%
          </div>
          <div className="text-sm text-gray-600">Average Difficulty</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-violet-600">
            {overview.categories.length}
          </div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
      </div>

      {/* Volume Distribution */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Search Volume Distribution</h3>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
          <div
            className="bg-green-500 h-full"
            style={{ width: `${(overview.volumeDistribution.low / overview.totalKeywords) * 100}%` }}
          />
          <div
            className="bg-yellow-500 h-full"
            style={{ width: `${(overview.volumeDistribution.medium / overview.totalKeywords) * 100}%` }}
          />
          <div
            className="bg-red-500 h-full"
            style={{ width: `${(overview.volumeDistribution.high / overview.totalKeywords) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1" />
            Low ({overview.volumeDistribution.low})
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1" />
            Medium ({overview.volumeDistribution.medium})
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1" />
            High ({overview.volumeDistribution.high})
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {overview.categories.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeywordOverviewPanel;
