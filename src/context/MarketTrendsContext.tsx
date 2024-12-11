import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { MarketTrendsState } from '../types/marketTrends';

type Action =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_TRENDS'; payload: MarketTrendsState['trends'] }
  | { type: 'SET_EMERGING_TOPICS'; payload: MarketTrendsState['emergingTopics'] }
  | { type: 'SET_SEASONAL_TRENDS'; payload: MarketTrendsState['seasonalTrends'] }
  | { type: 'SET_INDUSTRY_INSIGHTS'; payload: MarketTrendsState['industryInsights'] };

const initialState: MarketTrendsState = {
  trends: [],
  emergingTopics: [],
  seasonalTrends: [],
  industryInsights: [],
  isLoading: false,
  error: null,
};

const MarketTrendsContext = createContext<{
  state: MarketTrendsState;
  loadTrendsData: () => Promise<void>;
} | null>(null);

function marketTrendsReducer(state: MarketTrendsState, action: Action): MarketTrendsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_TRENDS':
      return { ...state, trends: action.payload, isLoading: false };
    case 'SET_EMERGING_TOPICS':
      return { ...state, emergingTopics: action.payload, isLoading: false };
    case 'SET_SEASONAL_TRENDS':
      return { ...state, seasonalTrends: action.payload, isLoading: false };
    case 'SET_INDUSTRY_INSIGHTS':
      return { ...state, industryInsights: action.payload, isLoading: false };
    default:
      return state;
  }
}

export function MarketTrendsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(marketTrendsReducer, initialState);

  const loadTrendsData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      // TODO: Replace with actual API calls
      const mockData = {
        trends: Array.from({ length: 12 }, (_, i) => ({
          date: `2024-${i + 1}`,
          volume: Math.random() * 1000,
          competition: Math.random() * 100,
          cpc: Math.random() * 10,
          difficulty: Math.random() * 100,
        })),
        emergingTopics: [],
        seasonalTrends: [],
        industryInsights: [],
      };

      dispatch({ type: 'SET_TRENDS', payload: mockData.trends });
      dispatch({ type: 'SET_EMERGING_TOPICS', payload: mockData.emergingTopics });
      dispatch({ type: 'SET_SEASONAL_TRENDS', payload: mockData.seasonalTrends });
      dispatch({ type: 'SET_INDUSTRY_INSIGHTS', payload: mockData.industryInsights });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load market trends data' });
    }
  }, []);

  return (
    <MarketTrendsContext.Provider value={{ state, loadTrendsData }}>
      {children}
    </MarketTrendsContext.Provider>
  );
}

export function useMarketTrends() {
  const context = useContext(MarketTrendsContext);
  if (!context) {
    throw new Error('useMarketTrends must be used within a MarketTrendsProvider');
  }
  return context;
} 