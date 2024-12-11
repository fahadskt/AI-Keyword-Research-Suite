import { useState } from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { ResultsPanel } from '../components/ResultsPanel';
import { KeywordCategory } from '../types';
import { generateKeywordInsights } from '../services/aiService';
import { useApiKeys, ModelType } from '../context/ApiKeyContext';
import { AlertCircle } from 'lucide-react';

export const KeywordResearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [categories, setCategories] = useState<KeywordCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedModel, getCurrentApiKey } = useApiKeys();

  const hasApiKey = Boolean(getCurrentApiKey());

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a keyword or topic');
      return;
    }

    const currentApiKey = getCurrentApiKey();
    if (!currentApiKey) {
      setError('Please set your API key in settings');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const insights = await generateKeywordInsights(
        searchTerm,
        currentApiKey,
        selectedModel as ModelType
      );

      const allKeywords = insights.flatMap(category => 
        category.keywords.map(k => k.keyword)
      );

      setKeywords(allKeywords);
      setCategories(insights);
    } catch (error: any) {
      console.error('Error generating keywords:', error);
      setError(error.message || 'Failed to generate keywords. Please try again.');
      setKeywords([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout 
      title="Keyword Research"
      actions={
        <button 
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-400"
          onClick={handleSearch}
          disabled={isLoading || !hasApiKey}
        >
          {isLoading ? 'Researching...' : 'Research Keywords'}
        </button>
      }
    >
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-red-700">{error}</div>
        </div>
      )}

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
                if (e.key === 'Enter' && hasApiKey) {
                  handleSearch();
                }
              }}
            />
            <button 
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-400"
              onClick={handleSearch}
              disabled={isLoading || !hasApiKey}
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

      <ResultsPanel 
        keywords={keywords}
        categories={categories}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
}; 