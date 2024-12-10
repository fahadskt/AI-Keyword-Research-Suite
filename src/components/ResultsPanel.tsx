import React, { useState } from 'react';
import { KeywordCluster, KeywordAnalysis, KeywordOverview } from '../types';
import KeywordOverviewPanel from './KeywordOverviewPanel';
import KeywordAnalysisPanel from './KeywordAnalysisPanel';

interface ResultsPanelProps {
  keywords: string[];
  clusters: KeywordCluster[];
  isLoading: boolean;
  overview?: KeywordOverview;
  selectedKeyword?: KeywordAnalysis;
}

type TabType = 'overview' | 'analysis' | 'clusters';

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  keywords,
  clusters,
  isLoading,
  overview,
  selectedKeyword
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

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

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'overview'
                ? 'text-violet-600 border-b-2 border-violet-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'analysis'
                ? 'text-violet-600 border-b-2 border-violet-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('analysis')}
          >
            Keyword Analysis
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'clusters'
                ? 'text-violet-600 border-b-2 border-violet-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('clusters')}
          >
            Clusters
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && overview && (
          <KeywordOverviewPanel overview={overview} />
        )}
        {activeTab === 'analysis' && selectedKeyword && (
          <KeywordAnalysisPanel analysis={selectedKeyword} />
        )}
        {activeTab === 'clusters' && (
          <div className="space-y-6">
            {clusters.map((cluster, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">{cluster.name}</h3>
                  <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">
                    {cluster.keywords.length} keywords
                  </span>
                </div>
                {cluster.metrics && (
                  <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-gray-600">Search Volume</div>
                      <div className="font-medium">{cluster.metrics.searchVolume.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Difficulty</div>
                      <div className="font-medium">{cluster.metrics.difficulty}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">CPC</div>
                      <div className="font-medium">${cluster.metrics.cpc}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Competition</div>
                      <div className="font-medium">{cluster.metrics.competition}</div>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {cluster.keywords.map((keyword, keywordIndex) => (
                    <span
                      key={keywordIndex}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;