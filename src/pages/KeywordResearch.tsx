import { useState } from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { ResultsPanel } from '../components/ResultsPanel';
import { KeywordCategory } from '../types';
import { generateKeywordInsights } from '../services/aiService';
import { useApiKeys, ModelType } from '../context/ApiKeyContext';

export const KeywordResearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [categories, setCategories] = useState<KeywordCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedModel, getCurrentApiKey } = useApiKeys();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a keyword or topic');
      return;
    }

    const currentApiKey = getCurrentApiKey();
    if (!currentApiKey) {
      alert('Please set your API key in settings');
      return;
    }

    setIsLoading(true);
    try {
      // Generate keyword insights
      const insights = await generateKeywordInsights(
        searchTerm,
        currentApiKey,
        selectedModel as ModelType
      );

      // Extract keywords from insights
      const allKeywords = insights.flatMap(category => 
        category.keywords.map(k => k.keyword)
      );

      setKeywords(allKeywords);
      setCategories(insights);
    } catch (error) {
      console.error('Error generating keywords:', error);
      alert('Failed to generate keywords. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const hasApiKey = Boolean(getCurrentApiKey());

  return (
    <DashboardLayout 
      title="Keyword Research"
      actions={
        <button 
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-400"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? 'Researching...' : 'Research Keywords'}
        </button>
      }
    >
      {/* Search Input */}
      <div className="mb-8">
        <div className="max-w-3xl">
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your topic or keyword
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              id="keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
              placeholder="e.g., digital marketing, SEO strategies..."
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button 
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-400"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {!hasApiKey && (
            <p className="mt-2 text-sm text-red-600">
              Please set your API key in settings to use the keyword research feature
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <ResultsPanel 
        keywords={keywords}
        categories={categories}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
}; 