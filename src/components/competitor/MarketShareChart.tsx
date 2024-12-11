import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

interface MarketShareData {
  domain: string;
  share: number;
}

export const MarketShareChart = () => {
  // Sample data - replace with real data
  const data: MarketShareData[] = [
    { domain: 'competitor1.com', share: 35 },
    { domain: 'competitor2.com', share: 25 },
    { domain: 'competitor3.com', share: 20 },
    { domain: 'competitor4.com', share: 15 },
    { domain: 'others', share: 5 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium mb-6">Market Share Distribution</h2>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="share"
              nameKey="domain"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={(entry) => `${entry.domain} (${entry.share}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 