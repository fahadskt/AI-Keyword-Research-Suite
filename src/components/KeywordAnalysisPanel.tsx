import React from 'react';
import { KeywordAnalysis, KeywordVariation } from '../types';

interface KeywordAnalysisPanelProps {
  analysis: KeywordAnalysis;
}

const CompetitionBar: React.FC<{ level: string; value: number }> = ({ level, value }) => {
  const getColor = () => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${getColor()}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

const KeywordVariationRow: React.FC<{ variation: KeywordVariation }> = ({ variation }) => {
  const competitionValue = 
    variation.competition.toLowerCase() === 'high' ? 75 :
    variation.competition.toLowerCase() === 'medium' ? 50 : 25;

  return (
    <div className="flex items-center py-2 border-b border-gray-100">
      <div className="flex-1">
        <span className="text-sm text-gray-800">{variation.keyword}</span>
      </div>
      <div className="w-24 text-right">
        <span className="text-sm text-gray-600">{variation.searchVolume.toLocaleString()}</span>
      </div>
      <div className="w-32 px-4">
        <CompetitionBar level={variation.competition} value={competitionValue} />
      </div>
      <div className="w-20 text-right">
        <span className="text-sm text-gray-600">${variation.cpc}</span>
      </div>
      <div className="w-20 text-right">
        <span className="text-sm text-gray-600">{variation.difficulty}%</span>
      </div>
    </div>
  );
};

const KeywordAnalysisPanel: React.FC<KeywordAnalysisPanelProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header section */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800">Keyword Analysis</h2>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <span className="mr-4">
            Search Volume: {analysis.metrics.searchVolume.toLocaleString()}
          </span>
          <span className="mr-4">
            Difficulty: {analysis.metrics.difficulty}%
          </span>
          <span>
            CPC: ${analysis.metrics.cpc}
          </span>
        </div>
      </div>

      {/* Variations section */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Keyword Variations</h3>
        <div className="mb-2 flex items-center text-xs text-gray-500">
          <div className="flex-1">Keyword</div>
          <div className="w-24 text-right">Volume</div>
          <div className="w-32 px-4">Competition</div>
          <div className="w-20 text-right">CPC</div>
          <div className="w-20 text-right">Difficulty</div>
        </div>
        <div className="space-y-1">
          {analysis.variations.map((variation, index) => (
            <KeywordVariationRow key={index} variation={variation} />
          ))}
        </div>
      </div>

      {/* Related Topics */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Related Topics</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.relatedTopics.map((topic, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeywordAnalysisPanel;
