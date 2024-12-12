import React from 'react';
import { ContentCalendarItem } from '../../types/contentStrategy';
import { Calendar } from 'lucide-react';

interface Props {
  calendar: ContentCalendarItem[];
}

export const ContentCalendar: React.FC<Props> = ({ calendar }) => {
  const getProgressColor = (actual: number, goal: number) => {
    const percentage = (actual / goal) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium mb-6">Content Calendar</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calendar?.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{item.month}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {item.topics.length} topics
              </div>
            </div>

            {/* Topics */}
            <div className="space-y-2 mb-4">
              {item.topics.map((topic, index) => (
                <div key={index} className="text-sm flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    topic.status === 'published' ? 'bg-green-500' :
                    topic.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`} />
                  {topic.title}
                </div>
              ))}
            </div>

            {/* Goals & Performance */}
            {item.performance && (
              <div className="border-t pt-3 space-y-2">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Traffic</span>
                    <span>{item.performance.actualTraffic}/{item.goals.traffic}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(item.performance.actualTraffic, item.goals.traffic)}`}
                      style={{ width: `${Math.min((item.performance.actualTraffic / item.goals.traffic) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Conversions</span>
                    <span>{item.performance.actualConversions}/{item.goals.conversions}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(item.performance.actualConversions, item.goals.conversions)}`}
                      style={{ width: `${Math.min((item.performance.actualConversions / item.goals.conversions) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Rankings</span>
                    <span>{item.performance.actualRankings}/{item.goals.rankings}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(item.performance.actualRankings, item.goals.rankings)}`}
                      style={{ width: `${Math.min((item.performance.actualRankings / item.goals.rankings) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )) || <div>No calendar items available</div>}
      </div>
    </div>
  );
}; 