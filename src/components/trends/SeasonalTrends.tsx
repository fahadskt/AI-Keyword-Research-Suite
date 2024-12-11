import React, { useState } from 'react';
import { SeasonalTrend } from '../../types/marketTrends';
import { Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  seasonalData: SeasonalTrend[];
}

export const SeasonalTrends: React.FC<Props> = ({ seasonalData }) => {
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

  const getVolumeData = (trend: SeasonalTrend) => {
    return trend.keywords.map(kw => ({
      name: kw.keyword,
      peak: kw.peakVolume,
      offSeason: kw.offSeasonVolume,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium mb-6">Seasonal Trends</h2>
      
      <div className="space-y-6">
        {seasonalData.map((trend, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedSeason(selectedSeason === trend.season ? null : trend.season)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{trend.season}</h3>
                  <div className="flex items-center mt-1 space-x-4 text-sm">
                    <span className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {trend.months.join(', ')}
                    </span>
                    <span className="flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {trend.yearOverYearGrowth}% YoY
                    </span>
                  </div>
                </div>
                <ArrowRight className={`w-5 h-5 text-gray-400 transform transition-transform ${
                  selectedSeason === trend.season ? 'rotate-90' : ''
                }`} />
              </div>
            </div>

            {selectedSeason === trend.season && (
              <div className="border-t px-4 py-3 bg-gray-50">
                {/* Volume Chart */}
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getVolumeData(trend)} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Bar dataKey="peak" name="Peak Volume" fill="#8884d8" />
                      <Bar dataKey="offSeason" name="Off-Season" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {trend.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm flex items-start">
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Content Planning Timeline */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Content Planning</h4>
                  <div className="relative">
                    <div className="absolute top-3 left-3 w-0.5 h-full bg-gray-200" />
                    {trend.months.map((month, i) => (
                      <div key={i} className="relative pl-8 pb-4">
                        <div className="absolute left-2 top-1 w-2 h-2 bg-violet-500 rounded-full" />
                        <div className="text-sm">
                          <span className="font-medium">{month}:</span>
                          <span className="text-gray-600 ml-2">
                            {i === 0 ? 'Start content preparation' :
                             i === trend.months.length - 1 ? 'Peak season content push' :
                             'Continue content rollout'}
                          </span>
                        </div>
                      </div>
                    ))}
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