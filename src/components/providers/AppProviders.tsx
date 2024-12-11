import { ReactNode } from 'react';
import { ApiKeyProvider } from '../../context/ApiKeyContext';
import { ContentStrategyProvider } from '../../context/ContentStrategyContext';
import { CompetitorProvider } from '../../context/CompetitorContext';
import { MarketTrendsProvider } from '../../context/MarketTrendsContext';

interface Props {
  children: ReactNode;
}

export const AppProviders: React.FC<Props> = ({ children }) => {
  return (
    <ApiKeyProvider>
      <ContentStrategyProvider>
        <CompetitorProvider>
          <MarketTrendsProvider>
            {children}
          </MarketTrendsProvider>
        </CompetitorProvider>
      </ContentStrategyProvider>
    </ApiKeyProvider>
  );
}; 