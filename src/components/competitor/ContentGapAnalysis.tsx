import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ContentGap {
  topic: string;
  difficulty: number;
  opportunity: number;
  competitors: string[];
}

export const ContentGapAnalysis = () => {
  // Sample data - replace with real data
  const gaps: ContentGap[] = [
    {
      topic: 'Beginner SEO Guide',
      difficulty: 45,
      opportunity: 85,
      competitors: ['competitor1.com', 'competitor2.com']
    },
    // Add more gaps...
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 col-span-2">
      <h2 className="text-lg font-medium mb-6">Content Gap Analysis</h2>
      
      <div className="space-y-6">
        {gaps.map((gap, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{gap.topic}</h3>
                <div className="flex items-center mt-1 space-x-4">
                  <span className="text-sm text-gray-500">
                    Difficulty: {gap.difficulty}%
                  </span>
                  <span className="text-sm text-gray-500">
                    Opportunity: {gap.opportunity}%
                  </span>
                </div>
              </div>
              <button className="px-3 py-1 text-sm text-violet-600 border border-violet-600 rounded-full hover:bg-violet-50">
                Create Content
              </button>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Competitors Ranking
              </h4>
              <div className="flex flex-wrap gap-2">
                {gap.competitors.map((competitor, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {competitor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 