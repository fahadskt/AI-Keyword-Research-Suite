import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ModelSelector from './components/ModelSelector';
import KeywordInput from './components/KeywordInput';
import ClusteringSettings from './components/ClusteringSettings';
import ResultsPanel from './components/ResultsPanel';
import QuestionFinder from './components/QuestionFinder';
import ApiKeySettings from './components/ApiKeySettings';
import { ApiKeyProvider, useApiKeys } from './context/ApiKeyContext';
import { generateKeywordsFromNiche } from './utils/keywordGeneration';
import { KeywordCategory } from './types';

type ModelType = 'chatgpt' | 'anthropic' | 'gemini' | 'google';

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

  const handleSettingChange = (setting: string, value: number) => {
    setClusteringSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

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
      const generated = await generateKeywordsFromNiche(keywords, currentApiKey, selectedModel);
      setGeneratedKeywords(generated);

      // Create and set categories
      const newCategories: KeywordCategory[] = [
        {
          name: 'Content marketing',
          keywords: generated.slice(0, 5).map(kw => ({
            keyword: kw,
            volume: Math.floor(Math.random() * 10000),
            competition: Math.random() > 0.5 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low',
            difficulty: Math.floor(Math.random() * 100),
            opportunity: Math.floor(Math.random() * 100),
            cpc: Math.random() * 10,
            intent: ['Informational', 'Commercial', 'Transactional', 'Navigational'][Math.floor(Math.random() * 4)] as any,
            serp_features: ['Featured Snippet', 'People Also Ask', 'Video Results', 'Image Pack'].slice(0, Math.floor(Math.random() * 4) + 1),
            trend: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000)),
            seasonality: ['Stable', 'Seasonal', 'Trending'][Math.floor(Math.random() * 3)] as any,
            ranking_difficulty: {
              score: Math.floor(Math.random() * 100),
              factors: {
                competition: Math.floor(Math.random() * 100),
                content_depth: Math.floor(Math.random() * 100),
                authority_needed: Math.floor(Math.random() * 100),
              }
            }
          })),
          summary: {
            totalVolume: Math.floor(Math.random() * 50000),
            avgDifficulty: Math.floor(Math.random() * 100),
            avgCpc: Math.random() * 10,
            topIntent: ['Informational', 'Commercial', 'Transactional'][Math.floor(Math.random() * 3)],
            growthRate: Math.floor(Math.random() * 200) - 100,
          }
        },
        {
          name: 'Content overview',
          keywords: generated.slice(5, 10).map(kw => ({
            keyword: kw,
            volume: Math.floor(Math.random() * 10000),
            competition: Math.random() > 0.5 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low',
            difficulty: Math.floor(Math.random() * 100),
            opportunity: Math.floor(Math.random() * 100),
            cpc: Math.random() * 10,
            intent: ['Informational', 'Commercial', 'Transactional', 'Navigational'][Math.floor(Math.random() * 4)] as any,
            serp_features: ['Featured Snippet', 'People Also Ask', 'Video Results', 'Image Pack'].slice(0, Math.floor(Math.random() * 4) + 1),
            trend: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000)),
            seasonality: ['Stable', 'Seasonal', 'Trending'][Math.floor(Math.random() * 3)] as any,
            ranking_difficulty: {
              score: Math.floor(Math.random() * 100),
              factors: {
                competition: Math.floor(Math.random() * 100),
                content_depth: Math.floor(Math.random() * 100),
                authority_needed: Math.floor(Math.random() * 100),
              }
            }
          })),
          summary: {
            totalVolume: Math.floor(Math.random() * 50000),
            avgDifficulty: Math.floor(Math.random() * 100),
            avgCpc: Math.random() * 10,
            topIntent: ['Informational', 'Commercial', 'Transactional'][Math.floor(Math.random() * 3)],
            growthRate: Math.floor(Math.random() * 200) - 100,
          }
        },
        {
          name: 'Social media',
          keywords: generated.slice(10, 15).map(kw => ({
            keyword: kw,
            volume: Math.floor(Math.random() * 10000),
            competition: Math.random() > 0.5 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low',
            difficulty: Math.floor(Math.random() * 100),
            opportunity: Math.floor(Math.random() * 100),
            cpc: Math.random() * 10,
            intent: ['Informational', 'Commercial', 'Transactional', 'Navigational'][Math.floor(Math.random() * 4)] as any,
            serp_features: ['Featured Snippet', 'People Also Ask', 'Video Results', 'Image Pack'].slice(0, Math.floor(Math.random() * 4) + 1),
            trend: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000)),
            seasonality: ['Stable', 'Seasonal', 'Trending'][Math.floor(Math.random() * 3)] as any,
            ranking_difficulty: {
              score: Math.floor(Math.random() * 100),
              factors: {
                competition: Math.floor(Math.random() * 100),
                content_depth: Math.floor(Math.random() * 100),
                authority_needed: Math.floor(Math.random() * 100),
              }
            }
          })),
          summary: {
            totalVolume: Math.floor(Math.random() * 50000),
            avgDifficulty: Math.floor(Math.random() * 100),
            avgCpc: Math.random() * 10,
            topIntent: ['Informational', 'Commercial', 'Transactional'][Math.floor(Math.random() * 3)],
            growthRate: Math.floor(Math.random() * 200) - 100,
          }
        }
      ];
      
      setCategories(newCategories);

    } catch (error) {
      console.error('Error generating keywords:', error);
      alert('Error generating keywords. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <ApiKeySettings />
            <div className="mt-6">
              <ModelSelector
                selectedModel={selectedModel}
                onModelSelect={(model: ModelType) => setSelectedModel(model)}
              />
            </div>
          </div>
          <div>
            <KeywordInput
              value={keywords}
              onChange={setKeywords}
              onSubmit={handleGenerateKeywords}
              isLoading={isLoading}
            />
            <ClusteringSettings
              settings={clusteringSettings}
              onSettingChange={handleSettingChange}
            />
          </div>
        </div>
        <ResultsPanel
          keywords={generatedKeywords}
          isLoading={isLoading}
          categories={categories}
        />
        <QuestionFinder generatedKeywords={generatedKeywords} />
      </main>
    </div>
  );
}

function App() {
  return (
    <ApiKeyProvider>
      <AppContent />
    </ApiKeyProvider>
  );
}

export default App;