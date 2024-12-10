import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ModelSelector from './components/ModelSelector';
import ApiKeyInput from './components/ApiKeyInput';
import KeywordInput from './components/KeywordInput';
import ClusteringSettings from './components/ClusteringSettings';
import ResultsPanel from './components/ResultsPanel';
import QuestionFinder from './components/QuestionFinder';
import { generateKeywordsFromNiche, clusterKeywords } from './utils/keywordGeneration';
import { KeywordCluster } from './types';

function App() {
  const [selectedModel, setSelectedModel] = useState('chatgpt');
  const [apiKey, setApiKey] = useState('');
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
    if (!keywords.trim() || !apiKey.trim()) {
      alert('Please enter keywords and API key');
      return;
    }

    setIsLoading(true);
    try {
      const generated = await generateKeywordsFromNiche(keywords, apiKey, selectedModel);
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
      alert('Failed to generate keywords. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <ModelSelector
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
              />
              <ApiKeyInput
                apiKey={apiKey}
                onApiKeyChange={setApiKey}
                selectedModel={selectedModel}
              />
              <KeywordInput
                keywords={keywords}
                onKeywordsChange={setKeywords}
                onGenerate={handleGenerateKeywords}
              />
              <ClusteringSettings
                minGroupSize={clusteringSettings.minGroupSize}
                maxGroupSize={clusteringSettings.maxGroupSize}
                similarityThreshold={clusteringSettings.similarityThreshold}
                onSettingChange={handleSettingChange}
              />
            </div>
          </div>
          <div className="space-y-6">
            <ResultsPanel 
              keywords={generatedKeywords}
              clusters={keywordClusters}
              isLoading={isLoading}
            />
            <QuestionFinder />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;