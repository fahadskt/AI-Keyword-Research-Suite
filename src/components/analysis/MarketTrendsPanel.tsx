import React from 'react';
import { MarketTrends } from '../../types/analysis';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  trends: MarketTrends;
}

export const MarketTrendsPanel: React.FC<Props> = ({ trends }) => {
  // Transform emerging topics data for the chart
  const chartData = trends.emergingTopics.map(topic => ({
    name: topic.topic,
    growth: topic.growthRate,
    relevance: topic.relevance
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Market Trends</h2>
      
      {/* Growth & Relevance Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Topics Growth & Relevance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="growth" 
                stroke="#10B981" 
                name="Growth Rate"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="relevance" 
                stroke="#6366F1" 
                name="Relevance"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emerging Topics */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Emerging Topics</h3>
        <div className="space-y-4">
          {trends.emergingTopics.map((topic, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{topic.topic}</h4>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    +{topic.growthRate}% Growth
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {topic.relevance}% Relevant
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Predicted Peak: {topic.predictedPeak}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Opportunities */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Seasonal Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trends.seasonalOpportunities.map((season, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">{season.season}</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-600">Keywords</h5>
                  <div className="flex flex-wrap gap-2">
                    {season.keywords.map((keyword, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-600">Peak Months</h5>
                  <div className="flex flex-wrap gap-2">
                    {season.peakMonths.map((month, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-600">Preparation</h5>
                  <p className="text-sm">{season.recommendedPreparation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Industry Shifts */}
      <div>
        <h3 className="text-lg font-medium mb-3">Industry Shifts</h3>
        <div className="space-y-4">
          {trends.industryShifts.map((shift, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{shift.trend}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  shift.impact >= 70 ? 'bg-red-100 text-red-800' :
                  shift.impact >= 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  Impact: {shift.impact}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Timeframe: {shift.timeframe}</p>
              <h5 className="text-sm font-medium text-gray-600 mb-1">Action Items</h5>
              <ul className="list-disc list-inside text-sm">
                {shift.actionItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 