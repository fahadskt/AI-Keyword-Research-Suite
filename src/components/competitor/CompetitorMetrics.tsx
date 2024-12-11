import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CompetitorMetric {
  domain: string;
  metrics: {
    domainAuthority: number;
    trafficValue: number;
    organicKeywords: number;
    backlinks: number;
  };
}

export const CompetitorMetrics = () => {
  // Sample data - replace with real data from your API
  const competitors: CompetitorMetric[] = [
    {
      domain: 'competitor1.com',
      metrics: {
        domainAuthority: 65,
        trafficValue: 250000,
        organicKeywords: 15000,
        backlinks: 50000
      }
    },
    // Add more competitors...
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium mb-6">Competitor Metrics</h2>
      
      <div className="space-y-6">
        {competitors.map((competitor, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{competitor.domain}</h3>
                <span className="text-sm text-gray-500">
                  DA: {competitor.metrics.domainAuthority}
                </span>
              </div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm">+15%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Traffic Value</span>
                <div className="text-lg font-medium">
                  ${competitor.metrics.trafficValue.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Organic Keywords</span>
                <div className="text-lg font-medium">
                  {competitor.metrics.organicKeywords.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Backlinks</span>
                <div className="text-lg font-medium">
                  {competitor.metrics.backlinks.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 