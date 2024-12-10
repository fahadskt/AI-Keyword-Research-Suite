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
      const INTENT_TYPES = ['Informational', 'Commercial', 'Transactional', 'Navigational'] as const;
      const SEASONALITY_TYPES = ['Stable', 'Seasonal', 'Trending'] as const;
      const CONTENT_TYPES = ['Article', 'Guide', 'List', 'How-to', 'Review'] as const;
      const COMPETITION_LEVELS = ['Low', 'Medium', 'High'] as const;

      const generateMockKeyword = (kw: string): KeywordMetric => {
        const getRandomElement = <T extends readonly any[]>(array: T): T[number] => {
          return array[Math.floor(Math.random() * array.length)];
        };

        return {
          keyword: kw,
          volume: Math.floor(Math.random() * 10000),
          competition: getRandomElement(COMPETITION_LEVELS),
          difficulty: Math.floor(Math.random() * 100),
          opportunity: Math.floor(Math.random() * 100),
          cpc: Math.random() * 10,
          intent: getRandomElement(INTENT_TYPES),
          serp_features: ['Featured Snippet', 'People Also Ask', 'Video Results', 'Image Pack']
            .slice(0, Math.floor(Math.random() * 4) + 1),
          trend: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000)),
          seasonality: getRandomElement(SEASONALITY_TYPES),
          ranking_difficulty: {
            score: Math.floor(Math.random() * 100),
            factors: {
              competition: Math.floor(Math.random() * 100),
              content_depth: Math.floor(Math.random() * 100),
              authority_needed: Math.floor(Math.random() * 100),
            }
          },
          competitors: Array.from({ length: 5 }, () => ({
            domain: `competitor${Math.floor(Math.random() * 100)}.com`,
            authority: Math.floor(Math.random() * 100),
            relevance: Math.floor(Math.random() * 100),
            backlinks: Math.floor(Math.random() * 10000),
            ranking: Math.floor(Math.random() * 10) + 1
          })),
          contentGap: {
            missingTopics: ['Topic 1', 'Topic 2', 'Topic 3'],
            contentSuggestions: Array.from({ length: 3 }, () => ({
              type: getRandomElement(CONTENT_TYPES),
              title: `Content suggestion for ${kw}`,
              description: 'This is a content suggestion description',
              estimatedDifficulty: Math.floor(Math.random() * 100),
              estimatedImpact: Math.floor(Math.random() * 100)
            }))
          },
          searchIntent: {
            primary: getRandomElement(INTENT_TYPES),
            secondary: ['Brand', 'Product', 'Service'].slice(0, Math.floor(Math.random() * 3) + 1),
            userQuestions: ['Question 1?', 'Question 2?', 'Question 3?']
          },
          performance: {
            clickThroughRate: Math.random(),
            impressionsPerMonth: Math.floor(Math.random() * 10000),
            averagePosition: Math.random() * 10
          },
          localMetrics: {
            localSearchVolume: Math.floor(Math.random() * 5000),
            topRegions: Array.from({ length: 5 }, () => ({
              region: `Region ${Math.floor(Math.random() * 10)}`,
              volume: Math.floor(Math.random() * 1000)
            })),
            deviceDistribution: {
              mobile: 60,
              desktop: 30,
              tablet: 10
            }
          }
        };
      };

      const newCategories: KeywordCategory[] = [
        {
          name: 'Content marketing',
          keywords: generated.slice(0, 5).map(generateMockKeyword),
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
          keywords: generated.slice(5, 10).map(generateMockKeyword),
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
          keywords: generated.slice(10, 15).map(generateMockKeyword),
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