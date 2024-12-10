import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import KeywordInput from './components/KeywordInput';
import ResultsPanel from './components/ResultsPanel';
import QuestionFinder from './components/QuestionFinder';
import { ApiKeyProvider, useApiKeys, ModelType } from './context/ApiKeyContext';
import { generateKeywordsFromNiche } from './utils/keywordGeneration';
import { KeywordCategory } from './types';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Settings from './components/Settings';
import { generateKeywordInsights } from './services/aiService';
import { analyzeKeywordOpportunities } from './services/analysisService';
import { CompetitorAnalysis, ContentStrategy, MarketTrends } from './types/analysis';
import { CompetitorAnalysisPanel } from './components/analysis/CompetitorAnalysisPanel';
import { ContentStrategyPanel } from './components/analysis/ContentStrategyPanel';
import { MarketTrendsPanel } from './components/analysis/MarketTrendsPanel';

function AppContent() {
  const { apiKeys, hasValidKeys } = useApiKeys();
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini');
  const [keywords, setKeywords] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<KeywordCategory[]>([]);
  const [clusteringSettings, setClusteringSettings] = useState({
    minGroupSize: 3,
    maxGroupSize: 8,
    similarityThreshold: 30,
  });
  const [analysis, setAnalysis] = useState<{
    competitorAnalysis?: CompetitorAnalysis;
    contentStrategy?: ContentStrategy;
    marketTrends?: MarketTrends;
  }>({});

  const getApiKeyForModel = (model: ModelType): string | undefined => {
    switch (model) {
      case 'chatgpt':
        return apiKeys.openai;
      case 'anthropic':
        return apiKeys.anthropic;
      case 'gemini':
        return apiKeys.gemini;
      case 'google':
        return apiKeys.google;
    }
  };

  const handleGenerateKeywords = async () => {
    if (!keywords.trim()) {
      alert('Please enter keywords');
      return;
    }

    if (!hasValidKeys) {
      alert('Please set up your API keys first');
      return;
    }

    const currentApiKey = getApiKeyForModel(selectedModel);
    if (!currentApiKey) {
      alert(`Please set up your ${selectedModel} API key first`);
      return;
    }

    setIsLoading(true);
    try {
      // Generate keywords
      const generated = await generateKeywordsFromNiche(keywords, currentApiKey, selectedModel);
      setGeneratedKeywords(generated);

      // Get detailed insights
      const categoriesData = await generateKeywordInsights(
        keywords,
        currentApiKey,
        selectedModel
      );
      setCategories(categoriesData);

      // Get advanced analysis
      const analysisData = await analyzeKeywordOpportunities(
        categoriesData,
        currentApiKey,
        selectedModel
      );
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (setting: string, value: number) => {
    setClusteringSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <div className="mb-8">
          <KeywordInput
            value={keywords}
            onChange={setKeywords}
            onSubmit={handleGenerateKeywords}
            isLoading={isLoading}
            selectedModel={selectedModel}
            onModelSelect={(model: ModelType) => setSelectedModel(model)}
            settings={clusteringSettings}
            onSettingChange={handleSettingChange}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResultsPanel
            keywords={generatedKeywords}
            isLoading={isLoading}
            categories={categories}
          />
          {analysis.competitorAnalysis && (
            <CompetitorAnalysisPanel analysis={analysis.competitorAnalysis} />
          )}
          {analysis.contentStrategy && (
            <ContentStrategyPanel strategy={analysis.contentStrategy} />
          )}
          {analysis.marketTrends && (
            <MarketTrendsPanel trends={analysis.marketTrends} />
          )}
        </div>
        <QuestionFinder generatedKeywords={generatedKeywords} />
      </main>
    </div>
  );
}

function App() {
  return (
    <ApiKeyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </ApiKeyProvider>
  );
}

export default App;