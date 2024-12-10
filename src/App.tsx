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
import { generateKeywordsFromNiche, clusterKeywords } from './utils/keywordGeneration';
import { KeywordCluster } from './types';

function AppContent() {
  const { apiKeys, hasValidKeys, updateApiKeys } = useApiKeys();
  const [selectedModel, setSelectedModel] = useState('chatgpt');
  const [keywords, setKeywords] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);
  const [keywordClusters, setKeywordClusters] = useState<KeywordCluster[]>([]);
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

  const handleGenerateKeywords = async () => {
    if (!keywords.trim() || !hasValidKeys) {
      alert('Please enter keywords and set up your API keys');
      return;
    }

    const currentApiKey = apiKeys[selectedModel as keyof typeof apiKeys];
    if (!currentApiKey) {
      alert(`Please set up your ${selectedModel} API key first`);
      return;
    }

    setIsLoading(true);
    try {
      const generated = await generateKeywordsFromNiche(keywords, currentApiKey, selectedModel);
      setGeneratedKeywords(generated);
      
      const clusters = clusterKeywords(
        generated,
        clusteringSettings.minGroupSize,
        clusteringSettings.maxGroupSize,
        clusteringSettings.similarityThreshold
      );
      setKeywordClusters(clusters);
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
            <ApiKeySettings onKeysUpdate={updateApiKeys} initialKeys={apiKeys} />
            <div className="mt-6">
              <ModelSelector
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
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