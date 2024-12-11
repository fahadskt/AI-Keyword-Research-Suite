import React, { useState } from 'react';
import { IndustryInsight } from '../../types/marketTrends';
import { 
  Lightbulb, 
  Clock, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle 
} from 'lucide-react';

interface Props {
  insights: IndustryInsight[];
}

export const IndustryInsights: React.FC<Props> = ({ insights }) => {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const getImpactColor = (impact: number) => {
    if (impact >= 80) return 'text-red-600';
    if (impact >= 60) return 'text-orange-600';
    if (impact >= 40) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getImpactLabel = (impact: number) => {
    if (impact >= 80) return 'Critical Impact';
    if (impact >= 60) return 'High Impact';
    if (impact >= 40) return 'Moderate Impact';
    return 'Low Impact';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium">Industry Insights</h2>
        <div className="flex items-center text-sm text-gray-500">
          <AlertCircle className="w-4 h-4 mr-1" />
          Updated daily
        </div>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedInsight(expandedInsight === insight.trend ? null : insight.trend)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-violet-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{insight.trend}</h3>
                    <div className="flex items-center mt-1 space-x-4 text-sm">
                      <span className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {insight.timeframe}
                      </span>
                      <span className={`font-medium ${getImpactColor(insight.impact)}`}>
                        {getImpactLabel(insight.impact)}
                      </span>
                    </div>
                  </div>
                </div>
                {expandedInsight === insight.trend ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedInsight === insight.trend && (
              <div className="border-t px-4 py-3 bg-gray-50">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600">{insight.description}</p>
                  
                  {/* Action Items */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Action Items</h4>
                    <ul className="space-y-2">
                      {insight.actionItems.map((item, i) => (
                        <li key={i} className="text-sm flex items-start">
                          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sources */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Sources</h4>
                    <div className="flex flex-wrap gap-2">
                      {insight.sources.map((source, i) => (
                        <a
                          key={i}
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Source {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Impact Meter */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Industry Impact</span>
                      <span className={`font-medium ${getImpactColor(insight.impact)}`}>
                        {insight.impact}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          insight.impact >= 80 ? 'bg-red-500' :
                          insight.impact >= 60 ? 'bg-orange-500' :
                          insight.impact >= 40 ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${insight.impact}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 