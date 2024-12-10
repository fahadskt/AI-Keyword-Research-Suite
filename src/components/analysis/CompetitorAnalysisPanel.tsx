import React, { useState } from 'react';
import { CompetitorAnalysis } from '../../types/analysis';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

interface Props {
  analysis: CompetitorAnalysis;
  isLoading?: boolean;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

export const CompetitorAnalysisPanel: React.FC<Props> = ({ analysis, isLoading }) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

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

  const marketShareData = analysis.topCompetitors.map(comp => ({
    name: comp.domain,
    value: comp.marketShare
  }));

  const getCompetitorTrend = (competitor: typeof analysis.topCompetitors[0]) => {
    const strengthsCount = competitor.strengths.length;
    const weaknessesCount = competitor.weaknesses.length;
    return {
      trend: strengthsCount > weaknessesCount ? 'up' : 'down',
      ratio: `${strengthsCount}:${weaknessesCount}`
    };
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Competitor Analysis</h2>
      
      {/* Market Share Distribution */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Market Share Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={marketShareData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(data) => data.name}
              >
                {marketShareData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Top Competitors */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Top Competitors</h3>
        <div className="space-y-4">
          {analysis.topCompetitors.map((competitor, index) => {
            const trend = getCompetitorTrend(competitor);
            return (
              <div 
                key={index} 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedCompetitor === competitor.domain ? 'border-violet-500 bg-violet-50' : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedCompetitor(competitor.domain)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{competitor.domain}</h4>
                      <ExternalLink 
                        size={16} 
                        className="ml-2 text-gray-400 hover:text-violet-600 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://${competitor.domain}`, '_blank');
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      Market Share: {competitor.marketShare}%
                    </span>
                  </div>
                  <div className={`flex items-center ${
                    trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.trend === 'up' ? (
                      <ArrowUpRight size={20} />
                    ) : (
                      <ArrowDownRight size={20} />
                    )}
                    <span className="text-sm ml-1">{trend.ratio}</span>
                  </div>
                </div>

                {selectedCompetitor === competitor.domain && (
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Strengths</h5>
                      <ul className="space-y-1">
                        {competitor.strengths.map((strength, i) => (
                          <li key={i} className="text-sm flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Weaknesses</h5>
                      <ul className="space-y-1">
                        {competitor.weaknesses.map((weakness, i) => (
                          <li key={i} className="text-sm flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-span-2">
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Content Gaps</h5>
                      <div className="flex flex-wrap gap-2">
                        {competitor.contentGaps.map((gap, i) => (
                          <span key={i} className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs">
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Competitive Landscape */}
      <div>
        <h3 className="text-lg font-medium mb-3">Competitive Landscape</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Market Difficulty</span>
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
            <ul className="space-y-2">
              {analysis.competitiveLandscape.entryBarriers.map((barrier, index) => (
                <li key={index} className="text-sm flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {barrier}
                </li>
              ))}
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Opportunities</h4>
              <ul className="space-y-2">
                {analysis.competitiveLandscape.opportunities.map((opportunity, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Threats</h4>
              <ul className="space-y-2">
                {analysis.competitiveLandscape.threats.map((threat, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    {threat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 