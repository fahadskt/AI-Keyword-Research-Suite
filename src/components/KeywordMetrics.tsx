import React from 'react';
import { KeywordMetrics as KeywordMetricsType } from '../types';

interface KeywordMetricsProps {
  metrics: KeywordMetricsType;
}

const KeywordMetrics: React.FC<KeywordMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <div className="text-sm text-gray-600 mb-1">Search Volume</div>
        <div className="font-semibold">{metrics.searchVolume.toLocaleString()}</div>
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-1">Difficulty</div>
        <div className="font-semibold flex items-center">
          {metrics.difficulty}
          <div 
            className="ml-2 w-16 h-2 rounded-full bg-gray-200 overflow-hidden"
            title={`Difficulty: ${metrics.difficulty}%`}
          >
            <div 
              className={`h-full rounded-full ${
                metrics.difficulty < 33 ? 'bg-green-500' :
                metrics.difficulty < 66 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${metrics.difficulty}%` }}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-1">CPC</div>
        <div className="font-semibold">${metrics.cpc}</div>
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-1">Competition</div>
        <div className="font-semibold">{(Number(metrics.competition) * 100).toFixed(0)}%</div>
      </div>
    </div>
  );
};

export default KeywordMetrics;