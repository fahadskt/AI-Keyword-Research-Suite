import React, { createContext, useState, useEffect } from 'react';
import { ContentInsight, ContentTopic, ContentCalendarItem } from '../types/contentStrategy';

interface ContentStrategyContextType {
  insights: ContentInsight[];
  topics: ContentTopic[];
  calendar: ContentCalendarItem[];
  loading: boolean;
  error: string | null;
}

export const ContentStrategyContext = createContext<ContentStrategyContextType>({
  insights: [],
  topics: [],
  calendar: [],
  loading: false,
  error: null,
});

export const ContentStrategyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [insights, setInsights] = useState<ContentInsight[]>([]);
  const [topics, setTopics] = useState<ContentTopic[]>([]);
  const [calendar, setCalendar] = useState<ContentCalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentStrategyData = async () => {
      try {
        setLoading(true);
        // Replace these with actual API calls
        const insightsResponse = await fetch('/api/content/insights');
        const topicsResponse = await fetch('/api/content/topics');
        const calendarResponse = await fetch('/api/content/calendar');

        const [insightsData, topicsData, calendarData] = await Promise.all([
          insightsResponse.json(),
          topicsResponse.json(),
          calendarResponse.json(),
        ]);

        setInsights(insightsData);
        setTopics(topicsData);
        setCalendar(calendarData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch content strategy data');
      } finally {
        setLoading(false);
      }
    };

    fetchContentStrategyData();
  }, []);

  return (
    <ContentStrategyContext.Provider 
      value={{ 
        insights, 
        topics, 
        calendar, 
        loading, 
        error 
      }}
    >
      {children}
    </ContentStrategyContext.Provider>
  );
}; 