import React from 'react';
import { ContentStrategy } from '../../types/analysis';

interface Props {
  strategy: ContentStrategy;
}

export const ContentStrategyPanel: React.FC<Props> = ({ strategy }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Content Strategy</h2>
      
      {/* Recommended Topics */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Recommended Topics</h3>
        <div className="space-y-4">
          {strategy.recommendedTopics.map((topic, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{topic.topic}</h4>
                  <span className="text-sm text-gray-600">{topic.type}</span>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Impact: {topic.estimatedImpact}%
                </span>
              </div>
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-600 mb-1">Target Keywords</h5>
                <div className="flex flex-wrap gap-2">
                  {topic.targetKeywords.map((keyword, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-600 mb-1">Outline</h5>
                <ul className="list-disc list-inside text-sm">
                  {topic.outline.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Calendar */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Content Calendar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategy.contentCalendar.map((month, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">{month.month}</h4>
              <p className="text-sm text-gray-600 mb-2">Focus: {month.focus}</p>
              <div className="space-y-2">
                <div>
                  <h5 className="text-sm font-medium text-gray-600">Topics</h5>
                  <ul className="list-disc list-inside text-sm">
                    {month.topics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-600">Goals</h5>
                  <ul className="list-disc list-inside text-sm">
                    {month.goals.map((goal, i) => (
                      <li key={i}>{goal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Types */}
      <div>
        <h3 className="text-lg font-medium mb-3">Content Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategy.contentTypes.map((type, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{type.type}</h4>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {type.effectiveness}% Effective
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Frequency: {type.recommendedFrequency}
              </p>
              <h5 className="text-sm font-medium text-gray-600 mb-1">Best Practices</h5>
              <ul className="list-disc list-inside text-sm">
                {type.bestPractices.map((practice, i) => (
                  <li key={i}>{practice}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 