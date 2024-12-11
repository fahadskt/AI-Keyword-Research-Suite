import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { ContentStrategyState, ContentTopic, ContentCalendarItem, ContentInsight } from '../types/contentStrategy';
import { contentStrategyService } from '../services/contentStrategyService';

type Action =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_TOPICS'; payload: ContentTopic[] }
  | { type: 'SET_CALENDAR'; payload: ContentCalendarItem[] }
  | { type: 'SET_INSIGHTS'; payload: ContentInsight[] }
  | { type: 'ADD_TOPIC'; payload: ContentTopic }
  | { type: 'UPDATE_TOPIC'; payload: ContentTopic }
  | { type: 'DELETE_TOPIC'; payload: string };

const initialState: ContentStrategyState = {
  topics: [],
  calendar: [],
  insights: [],
  isLoading: false,
  error: null,
};

const ContentStrategyContext = createContext<{
  state: ContentStrategyState;
  loadContentStrategy: () => Promise<void>;
  generateTopics: (keywords: any[]) => Promise<void>;
  updateTopic: (topic: ContentTopic) => Promise<void>;
  deleteTopic: (topicId: string) => Promise<void>;
} | null>(null);

function contentStrategyReducer(state: ContentStrategyState, action: Action): ContentStrategyState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_TOPICS':
      return { ...state, topics: action.payload, isLoading: false };
    case 'SET_CALENDAR':
      return { ...state, calendar: action.payload, isLoading: false };
    case 'SET_INSIGHTS':
      return { ...state, insights: action.payload, isLoading: false };
    case 'ADD_TOPIC':
      return { ...state, topics: [...state.topics, action.payload] };
    case 'UPDATE_TOPIC':
      return {
        ...state,
        topics: state.topics.map(topic =>
          topic.id === action.payload.id ? action.payload : topic
        ),
      };
    case 'DELETE_TOPIC':
      return {
        ...state,
        topics: state.topics.filter(topic => topic.id !== action.payload),
      };
    default:
      return state;
  }
}

export function ContentStrategyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(contentStrategyReducer, initialState);

  const loadContentStrategy = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const [calendar, insights] = await Promise.all([
        contentStrategyService.getContentCalendar(),
        contentStrategyService.getContentInsights(),
      ]);

      dispatch({ type: 'SET_CALENDAR', payload: calendar });
      dispatch({ type: 'SET_INSIGHTS', payload: insights });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load content strategy' });
    }
  }, []);

  const generateTopics = useCallback(async (keywords: any[]) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const topics = await contentStrategyService.generateTopics(keywords);
      dispatch({ type: 'SET_TOPICS', payload: topics });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate topics' });
    }
  }, []);

  const updateTopic = useCallback(async (topic: ContentTopic) => {
    try {
      dispatch({ type: 'UPDATE_TOPIC', payload: topic });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update topic' });
    }
  }, []);

  const deleteTopic = useCallback(async (topicId: string) => {
    try {
      dispatch({ type: 'DELETE_TOPIC', payload: topicId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete topic' });
    }
  }, []);

  return (
    <ContentStrategyContext.Provider 
      value={{ 
        state, 
        loadContentStrategy, 
        generateTopics, 
        updateTopic, 
        deleteTopic 
      }}
    >
      {children}
    </ContentStrategyContext.Provider>
  );
}

export function useContentStrategy() {
  const context = useContext(ContentStrategyContext);
  if (!context) {
    throw new Error('useContentStrategy must be used within a ContentStrategyProvider');
  }
  return context;
} 