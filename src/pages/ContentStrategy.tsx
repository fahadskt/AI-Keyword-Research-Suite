import React, { useEffect } from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { ContentCalendar } from '../components/content/ContentCalendar';
import { ContentInsights } from '../components/content/ContentInsights';
import { TopicsList } from '../components/content/TopicsList';
import { useContentStrategy } from '../context/ContentStrategyContext';

export const ContentStrategy = () => {
  const { state, loadContentStrategy } = useContentStrategy();

  useEffect(() => {
    loadContentStrategy();
  }, [loadContentStrategy]);

  if (state.isLoading) {
    return (
      <DashboardLayout title="Content Strategy">
        <div className="animate-pulse">
          {/* Loading skeleton */}
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
      title="Content Strategy"
      actions={
        <button className="btn-primary">Create New Topic</button>
      }
    >
      {state.error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ContentInsights insights={state.insights} />
        <TopicsList topics={state.topics} />
      </div>

      <div className="mt-8">
        <ContentCalendar calendar={state.calendar} />
      </div>
    </DashboardLayout>
  );
}; 