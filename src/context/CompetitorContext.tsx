import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { CompetitorAnalysisState } from '../types/competitor';
import { competitorService } from '../services/competitorService';

type Action =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_COMPETITORS'; payload: CompetitorAnalysisState['competitors'] }
  | { type: 'SET_MARKET_SHARE'; payload: CompetitorAnalysisState['marketShare'] }
  | { type: 'SET_CONTENT_GAPS'; payload: CompetitorAnalysisState['contentGaps'] };

const initialState: CompetitorAnalysisState = {
  competitors: [],
  marketShare: [],
  contentGaps: [],
  isLoading: false,
  error: null,
};

const CompetitorContext = createContext<{
  state: CompetitorAnalysisState;
  loadCompetitorData: (domain: string) => Promise<void>;
} | null>(null);

function competitorReducer(state: CompetitorAnalysisState, action: Action): CompetitorAnalysisState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_COMPETITORS':
      return { ...state, competitors: action.payload, isLoading: false };
    case 'SET_MARKET_SHARE':
      return { ...state, marketShare: action.payload, isLoading: false };
    case 'SET_CONTENT_GAPS':
      return { ...state, contentGaps: action.payload, isLoading: false };
    default:
      return state;
  }
}

export function CompetitorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(competitorReducer, initialState);

  const loadCompetitorData = useCallback(async (domain: string) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const [competitors, marketShare, contentGaps] = await Promise.all([
        competitorService.getCompetitorMetrics(domain),
        competitorService.getMarketShare(domain),
        competitorService.getContentGaps(domain),
      ]);

      dispatch({ type: 'SET_COMPETITORS', payload: competitors });
      dispatch({ type: 'SET_MARKET_SHARE', payload: marketShare });
      dispatch({ type: 'SET_CONTENT_GAPS', payload: contentGaps });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load competitor data' });
    }
  }, []);

  return (
    <CompetitorContext.Provider value={{ state, loadCompetitorData }}>
      {children}
    </CompetitorContext.Provider>
  );
}

export function useCompetitor() {
  const context = useContext(CompetitorContext);
  if (!context) {
    throw new Error('useCompetitor must be used within a CompetitorProvider');
  }
  return context;
} 