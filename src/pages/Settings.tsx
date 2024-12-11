import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { useApiKeys, ModelType } from '../context/ApiKeyContext';
import { Save, Check, ExternalLink } from 'lucide-react';

export const Settings = () => {
  const { apiKeys, setApiKeys, selectedModel, setSelectedModel } = useApiKeys();
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [formKeys, setFormKeys] = useState(apiKeys);

  useEffect(() => {
    setFormKeys(apiKeys);
  }, [apiKeys]);

  const handleApiKeyChange = (key: keyof typeof apiKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormKeys({
      ...formKeys,
      [key]: e.target.value
    });
  };

  const handleSave = () => {
    setApiKeys(formKeys);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const openGeminiSetup = () => {
    window.open('https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com', '_blank');
  };

  return (
    <DashboardLayout 
      title="Settings"
      actions={
        <button 
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center"
          onClick={handleSave}
        >
          {showSaveSuccess ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      }
    >
      <div className="bg-white rounded-lg shadow p-6">
        <div className="max-w-3xl">
          {/* API Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">API Settings</h3>
            <div className="space-y-6">
              {/* OpenAI Section */}
              <div>
                <label htmlFor="openai-key" className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  id="openai-key"
                  value={formKeys.openai}
                  onChange={handleApiKeyChange('openai')}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                  placeholder="sk-..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Get your API key from{' '}
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:text-violet-700 inline-flex items-center"
                  >
                    OpenAI Dashboard
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </p>
              </div>

              {/* Gemini Section */}
              <div>
                <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-700 mb-1">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  id="gemini-key"
                  value={formKeys.gemini}
                  onChange={handleApiKeyChange('gemini')}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                  placeholder="Enter your Gemini API key"
                />
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-500">
                    To use Gemini, you need to:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-gray-500 space-y-1">
                    <li>Create a Google Cloud Project</li>
                    <li>Enable the Generative Language API</li>
                    <li>Create API credentials</li>
                  </ol>
                  <button
                    onClick={openGeminiSetup}
                    className="text-violet-600 hover:text-violet-700 text-sm inline-flex items-center"
                  >
                    Enable Gemini API
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              </div>

              {/* Anthropic Section */}
              <div>
                <label htmlFor="anthropic-key" className="block text-sm font-medium text-gray-700 mb-1">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  id="anthropic-key"
                  value={formKeys.anthropic}
                  onChange={handleApiKeyChange('anthropic')}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                  placeholder="Enter your Anthropic API key"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Get your API key from{' '}
                  <a 
                    href="https://console.anthropic.com/account/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:text-violet-700 inline-flex items-center"
                  >
                    Anthropic Console
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-lg font-medium mb-4">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default AI Model
                </label>
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                >
                  <option value="chatgpt">ChatGPT (OpenAI)</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="anthropic">Anthropic Claude</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Select which AI model to use for keyword research and analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}; 