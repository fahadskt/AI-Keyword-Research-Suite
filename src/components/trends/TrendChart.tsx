import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendData } from '../../types/marketTrends';
import { Calendar, TrendingUp, Filter } from 'lucide-react';

interface Props {
  trends: TrendData[];
}

export const TrendChart: React.FC<Props> = ({ trends }) => {
  const [timeframe, setTimeframe] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['volume', 'competition']);

  const timeframes = [
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
  ];

  const metrics = [
    { value: 'volume', label: 'Search Volume', color: '#8884d8' },
    { value: 'competition', label: 'Competition', color: '#82ca9d' },
    { value: 'cpc', label: 'CPC', color: '#ffc658' },
    { value: 'difficulty', label: 'Difficulty', color: '#ff7300' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Trend Analysis</h2>
        <div className="flex items-center space-x-4">
          {/* Timeframe selector */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="text-sm border rounded-lg px-2 py-1"
            >
              {timeframes.map(tf => (
                <option key={tf.value} value={tf.value}>{tf.label}</option>
              ))}
            </select>
          </div>

          {/* Metrics selector */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex items-center space-x-2">
              {metrics.map(metric => (
                <label key={metric.value} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMetrics([...selectedMetrics, metric.value]);
                      } else {
                        setSelectedMetrics(selectedMetrics.filter(m => m !== metric.value));
                      }
                    }}
                    className="form-checkbox h-3 w-3"
                  />
                  <span className="text-sm text-gray-600">{metric.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trends}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedMetrics.map(metric => {
              const metricConfig = metrics.find(m => m.value === metric)!;
              return (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={metricConfig.color}
                  name={metricConfig.label}
                  strokeWidth={2}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 