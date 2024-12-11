import React from 'react';
import { EmergingTopic } from '../../types/marketTrends';
import { TrendingUp, TrendingDown, BarChart2, Star } from 'lucide-react';

interface Props {
  topics: EmergingTopic[];
}

export const EmergingTopics: React.FC<Props> = ({ topics }) => {
  const getSentimentColor = (sentiment: EmergingTopic['sentiment']) => {
    switch (sentiment) {
      case 'Positive':
        return 'text-green-500';
      case 'Negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getGrowthIcon = (growthRate: number) => {
    if (growthRate > 50) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
    if (growthRate > 20) {
      return <BarChart2 className="w-4 h-4 text-blue-500" />;
    }
    return <TrendingDown className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium mb-6">Emerging Topics</h2>
      
      <div className="space-y-6">
        {topics.map((topic, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium flex items-center">
                  {topic.topic}
                  {topic.growthRate > 75 && (
                    <Star className="w-4 h-4 text-yellow-400 ml-2 fill-current" />
                  )}
                </h3>
                <div className="flex items-center mt-1 space-x-4 text-sm">
                  <span className="text-gray-600">
                    Volume: {topic.searchVolume.toLocaleString()}
                  </span>
                  <span className={`flex items-center ${getSentimentColor(topic.sentiment)}`}>
                    {topic.sentiment}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                {getGrowthIcon(topic.growthRate)}
                <span className="ml-1 text-sm font-medium">
                  {topic.growthRate}% growth
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Related Keywords */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Related Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {topic.relatedKeywords.map((keyword, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-violet-50 text-violet-700 rounded-full text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prediction */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Predicted Peak:</span>
                <span className="font-medium">{topic.predictedPeak}</span>
              </div>

              {/* Competition Level */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Competition Level</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    topic.competition === 'Low' ? 'bg-green-100 text-green-800' :
                    topic.competition === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {topic.competition}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      topic.competition === 'Low' ? 'bg-green-500' :
                      topic.competition === 'Medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ 
                      width: `${
                        topic.competition === 'Low' ? 33 :
                        topic.competition === 'Medium' ? 66 :
                        100
                      }%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};