import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { KeywordResearch } from './pages/KeywordResearch';
import { CompetitorAnalysis } from './pages/CompetitorAnalysis';
import { ContentStrategy } from './pages/ContentStrategy';
import { MarketTrends } from './pages/MarketTrends';
import { LocalSEO } from './pages/LocalSEO';
import { Settings } from './pages/Settings';
import { AppProviders } from './components/providers/AppProviders';

function App() {
  return (
    <AppProviders>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<KeywordResearch />} />
              <Route path="/competitor" element={<CompetitorAnalysis />} />
              <Route path="/content" element={<ContentStrategy />} />
              <Route path="/trends" element={<MarketTrends />} />
              <Route path="/local-seo" element={<LocalSEO />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProviders>
  );
}

export default App;