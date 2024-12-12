import React, { useState } from 'react';
import { ContentTopic } from '../../types/contentStrategy';
import { FileText, Video, Image, Book, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  topics: ContentTopic[];
}

export const TopicsList: React.FC<Props> = ({ topics }) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const getTopicIcon = (type: ContentTopic['type']) => {
    switch (type) {
      case 'blog':
        return <FileText className="w-5 h-5 text-violet-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />;
      case 'infographic':
        return <Image className="w-5 h-5 text-blue-500" />;
      case 'guide':
        return <Book className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: ContentTopic['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium mb-6">Content Topics</h2>
      
      <div className="space-y-4">
        {topics?.map((topic) => (
          <div key={topic.id} className="border rounded-lg overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getTopicIcon(topic.type)}
                  <div>
                    <h3 className="font-medium">{topic.title}</h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(topic.status)}`}>
                        {topic.status}
                      </span>
                      {topic.dueDate && (
                        <span className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {topic.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {expandedTopic === topic.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedTopic === topic.id && (
              <div className="border-t px-4 py-3 bg-gray-50">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Target Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {topic.targetKeywords.map((kw, i) => (
                        <div key={i} className="flex flex-col px-2 py-1 bg-white rounded border text-xs">
                          <span className="font-medium">{kw.keyword}</span>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-gray-500">Vol: {kw.volume}</span>
                            <span className="text-gray-500">KD: {kw.difficulty}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Content Outline</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {topic.outline.map((point, i) => (
                        <li key={i} className="text-gray-600">{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Impact Score:</span>
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${topic.estimatedImpact}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{topic.estimatedImpact}%</span>
                    </div>
                    <button className="text-sm text-violet-600 hover:text-violet-700">
                      Generate Brief
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )) || <div>No topics available</div>}
      </div>
    </div>
  );
}; 