import React, { useState } from 'react';
import { ContentStrategy } from '../../types/analysis';
import { Calendar, Layout, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  strategy: ContentStrategy;
  isLoading?: boolean;
}

export const ContentStrategyPanel: React.FC<Props> = ({ strategy, isLoading }) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Transform content types data for the chart
  const contentTypeData = strategy.contentTypes.map(type => ({
    name: type.type,
    effectiveness: type.effectiveness,
  }));

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
      <h2 className="text-xl font-semibold mb-6">Content Strategy</h2>

      {/* Content Types Overview with Chart */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Layout className="w-5 h-5 text-violet-600 mr-2" />
          <h3 className="text-lg font-medium">Content Types</h3>
        </div>
        
        {/* Effectiveness Chart */}
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contentTypeData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="effectiveness" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
                label={{ position: 'top' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Content Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategy.contentTypes.map((type, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium">{type.type}</h4>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {type.effectiveness}% Effective
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Frequency: {type.recommendedFrequency}
              </p>
              <div>
                <h5 className="text-sm font-medium text-gray-600 mb-2">Best Practices</h5>
                <ul className="space-y-2">
                  {type.bestPractices.map((practice, i) => (
                    <li key={i} className="text-sm flex items-center">
                      <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2"></span>
                      {practice}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Topics */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Target className="w-5 h-5 text-violet-600 mr-2" />
          <h3 className="text-lg font-medium">Recommended Topics</h3>
        </div>
        <div className="space-y-4">
          {strategy.recommendedTopics.map((topic, index) => (
            <div 
              key={index} 
              className="border rounded-lg overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedTopic(expandedTopic === topic.topic ? null : topic.topic)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{topic.topic}</h4>
                      <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        {topic.type}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-600">Impact Score:</span>
                      <div className="ml-2 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-600 rounded-full"
                          style={{ width: `${topic.estimatedImpact}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{topic.estimatedImpact}%</span>
                    </div>
                  </div>
                  {expandedTopic === topic.topic ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedTopic === topic.topic && (
                <div className="px-4 pb-4 border-t">
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Target Keywords</h5>
                    <div className="flex flex-wrap gap-2">
                      {topic.targetKeywords.map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Content Outline</h5>
                    <ul className="space-y-2">
                      {topic.outline.map((point, i) => (
                        <li key={i} className="text-sm flex items-center">
                          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2"></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Recommended Angle</h5>
                    <p className="text-sm text-gray-600">{topic.recommendedAngle}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Calendar */}
      <div>
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-violet-600 mr-2" />
          <h3 className="text-lg font-medium">Content Calendar</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategy.contentCalendar.map((month, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedMonth === month.month ? 'border-violet-500 bg-violet-50' : 'hover:border-gray-300'
              }`}
              onClick={() => setSelectedMonth(selectedMonth === month.month ? null : month.month)}
            >
              <h4 className="font-medium mb-2">{month.month}</h4>
              <div className="text-sm text-gray-600 mb-3">Focus: {month.focus}</div>
              
              {selectedMonth === month.month && (
                <>
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Topics</h5>
                    <ul className="space-y-2">
                      {month.topics.map((topic, i) => (
                        <li key={i} className="text-sm flex items-center">
                          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Goals</h5>
                    <ul className="space-y-2">
                      {month.goals.map((goal, i) => (
                        <li key={i} className="text-sm flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 