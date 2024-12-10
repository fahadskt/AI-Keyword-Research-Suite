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
import { generateKeywordsFromNiche, clusterKeywords, analyzeKeyword } from './utils/keywordGeneration';
import { KeywordCluster, KeywordAnalysis, KeywordOverview } from './types';

type ModelType = 'chatgpt' | 'anthropic' | 'gemini' | 'google';

function AppContent() {
  const { apiKeys, hasValidKeys } = useApiKeys();
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini');
  const [keywords, setKeywords] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);
  const [keywordClusters, setKeywordClusters] = useState<KeywordCluster[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordAnalysis | undefined>();
  const [overview, setOverview] = useState<KeywordOverview | undefined>();
  const [isLoading, setIsLoading] = useState(false);
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
      
      // Generate clusters
      const clusters = clusterKeywords(
        generated,
        clusteringSettings.minGroupSize,
        clusteringSettings.maxGroupSize,
        clusteringSettings.similarityThreshold
      );
      setKeywordClusters(clusters);

      // Generate overview
      const totalKeywords = generated.length;
      const allMetrics = generated.map(kw => analyzeKeyword(kw));
      const avgDifficulty = Math.floor(allMetrics.reduce((acc, m) => acc + m.difficulty, 0) / totalKeywords);
      
      setOverview({
        totalKeywords,
        avgDifficulty,
        categories: clusters.map(c => c.name),
        volumeDistribution: {
          high: allMetrics.filter(m => m.searchVolume > 5000).length,
          medium: allMetrics.filter(m => m.searchVolume > 1000 && m.searchVolume <= 5000).length,
          low: allMetrics.filter(m => m.searchVolume <= 1000).length,
        }
      });

      // Set first keyword as selected
      if (generated.length > 0) {
        const firstKeywordMetrics = analyzeKeyword(generated[0]);
        setSelectedKeyword({
          keyword: generated[0],
          metrics: firstKeywordMetrics,
          variations: generated.slice(1, 4).map(kw => ({
            keyword: kw,
            searchVolume: Math.floor(Math.random() * 10000),
            difficulty: Math.floor(Math.random() * 100),
            competition: Math.random().toFixed(2),
            cpc: (Math.random() * 5).toFixed(2)
          })),
          relatedTopics: clusters[0]?.keywords.slice(0, 3) || []
        });
      }
    } catch (error) {
      console.error('Error generating keywords:', error);
      alert('Error generating keywords. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeywordSelect = (keyword: string) => {
    const keywordMetrics = analyzeKeyword(keyword);
    setSelectedKeyword({
      keyword,
      metrics: keywordMetrics,
      variations: generatedKeywords
        .filter(k => k !== keyword)
        .slice(0, 4)
        .map(kw => ({
          keyword: kw,
          searchVolume: Math.floor(Math.random() * 10000),
          difficulty: Math.floor(Math.random() * 100),
          competition: Math.random().toFixed(2),
          cpc: (Math.random() * 5).toFixed(2)
        })),
      relatedTopics: keywordClusters.find(c => c.keywords.includes(keyword))?.keywords.filter(k => k !== keyword).slice(0, 3) || []
    });
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
          clusters={keywordClusters}
          isLoading={isLoading}
          overview={overview}
          selectedKeyword={selectedKeyword}
          onKeywordSelect={handleKeywordSelect}
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