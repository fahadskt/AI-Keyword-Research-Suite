import React from 'react';
import { CompetitorAnalysis } from '../../types/analysis';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  analysis: CompetitorAnalysis;
  isLoading?: boolean;
}

export const CompetitorAnalysisPanel: React.FC<Props> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Competitor Analysis</h2>
      
      {/* Top Competitors */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Top Competitors</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysis.topCompetitors}>
              <XAxis dataKey="domain" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="marketShare" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-4">
          {analysis.topCompetitors.map((competitor, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">{competitor.domain}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-600">Strengths</h5>
                  <ul className="list-disc list-inside text-sm">
                    {competitor.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-600">Weaknesses</h5>
                  <ul className="list-disc list-inside text-sm">
                    {competitor.weaknesses.map((weakness, i) => (
                      <li key={i}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Landscape */}
      <div>
        <h3 className="text-lg font-medium mb-3">Competitive Landscape</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Difficulty Level</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                analysis.competitiveLandscape.difficultyLevel === 'High' 
                  ? 'bg-red-100 text-red-800'
                  : analysis.competitiveLandscape.difficultyLevel === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {analysis.competitiveLandscape.difficultyLevel}
              </span>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Entry Barriers</h4>
            <ul className="list-disc list-inside text-sm">
              {analysis.competitiveLandscape.entryBarriers.map((barrier, index) => (
                <li key={index}>{barrier}</li>
              ))}
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Opportunities</h4>
            <ul className="list-disc list-inside text-sm">
              {analysis.competitiveLandscape.opportunities.map((opportunity, index) => (
                <li key={index}>{opportunity}</li>
              ))}
            </ul>
            <h4 className="text-sm font-medium text-gray-600 mt-4 mb-2">Threats</h4>
            <ul className="list-disc list-inside text-sm">
              {analysis.competitiveLandscape.threats.map((threat, index) => (
                <li key={index}>{threat}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 