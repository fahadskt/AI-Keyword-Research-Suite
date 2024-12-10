import React from 'react';
import { KeywordCluster } from '../types';
import KeywordMetrics from './KeywordMetrics';
import { analyzeKeyword } from '../utils/keywordAnalysis';

interface ResultsPanelProps {
  keywords: string[];
  clusters: KeywordCluster[];
  isLoading?: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ keywords, clusters, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-violet-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No Keywords Yet</h3>
            <p className="text-gray-600 text-sm">
              Enter your niche or keywords to get started with the analysis
            </p>
            <button className="mt-4 inline-flex items-center text-violet-600 hover:text-violet-700">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Get Expert Help
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Generated Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <div key={index} className="group relative">
              <span className="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm cursor-pointer">
                {keyword}
              </span>
              <div className="absolute z-10 left-0 mt-2 w-64 hidden group-hover:block">
                <KeywordMetrics metrics={analyzeKeyword(keyword)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Keyword Clusters</h3>
        <div className="space-y-4">
          {clusters.map((cluster, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">{cluster.name}</h4>
              {cluster.metrics && <KeywordMetrics metrics={cluster.metrics} />}
              <div className="flex flex-wrap gap-2 mt-4">
                {cluster.keywords.map((keyword, keywordIndex) => (
                  <span
                    key={keywordIndex}
                    className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;