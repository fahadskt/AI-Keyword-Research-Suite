import React, { useEffect } from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { TrendChart } from '../components/trends/TrendChart';
import { EmergingTopics } from '../components/trends/EmergingTopics';
import { SeasonalTrends } from '../components/trends/SeasonalTrends';
import { IndustryInsights } from '../components/trends/IndustryInsights';
import { useMarketTrends } from '../context/MarketTrendsContext';

export const MarketTrends = () => {
  const { state, loadTrendsData } = useMarketTrends();

  useEffect(() => {
    loadTrendsData();
  }, [loadTrendsData]);

  if (state.isLoading) {
    return (
      <DashboardLayout title="Market Trends">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Market Trends"
      actions={
        <button className="btn-primary">Export Report</button>
      }
    >
      {state.error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {state.error}
        </div>
      )}

      <div className="mb-8">
        <TrendChart trends={state.trends} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EmergingTopics topics={state.emergingTopics} />
        <SeasonalTrends seasonalData={state.seasonalTrends} />
      </div>

      <div className="mt-8">
        <IndustryInsights insights={state.industryInsights} />
      </div>
    </DashboardLayout>
  );
}; 