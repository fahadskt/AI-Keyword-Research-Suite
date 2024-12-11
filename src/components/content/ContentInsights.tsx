import React from 'react';
import { ContentInsight } from '../../types/contentStrategy';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  insights: ContentInsight[];
}

export const ContentInsights: React.FC<Props> = ({ insights }) => {
  const getInsightIcon = (type: ContentInsight['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'opportunity':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium mb-6">Content Insights</h2>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${
              insight.type === 'success' ? 'border-green-200 bg-green-50' :
              insight.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              'border-blue-200 bg-blue-50'
            }`}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                {getInsightIcon(insight.type)}
              </div>
              <div>
                <p className="font-medium mb-1">{insight.message}</p>
                <div className="flex items-center text-sm">
                  <span className="text-gray-600">{insight.metric}:</span>
                  <span className={`ml-2 ${
                    insight.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {insight.change > 0 ? '+' : ''}{insight.change}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {insight.recommendation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 