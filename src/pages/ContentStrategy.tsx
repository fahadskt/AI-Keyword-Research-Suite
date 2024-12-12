import React, { useContext } from 'react';
import { ContentInsights } from '../components/content/ContentInsights';
import { TopicsList } from '../components/content/TopicsList';
import { ContentCalendar } from '../components/content/ContentCalendar';
import { ContentStrategyContext } from '../context/ContentStrategyContext';
import { DashboardLayout } from '../components/layouts/DashboardLayout';

export const ContentStrategy = () => {
  const { insights, topics, calendar, loading, error } = useContext(ContentStrategyContext);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div>Loading content strategy data...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-red-600">Error loading content strategy: {error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <ContentInsights insights={insights} />
        <TopicsList topics={topics} />
        <ContentCalendar calendar={calendar} />
      </div>
    </DashboardLayout>
  );
}; 