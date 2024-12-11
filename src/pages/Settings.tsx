import React from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { useApiKeys, ModelType } from '../context/ApiKeyContext';

export const Settings = () => {
  const { apiKeys, setApiKeys, selectedModel, setSelectedModel } = useApiKeys();

  const handleApiKeyChange = (key: keyof typeof apiKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeys({
      ...apiKeys,
      [key]: e.target.value
    });
  };

  return (
    <DashboardLayout title="Settings">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="max-w-3xl">
          {/* API Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">API Settings</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="openai-key" className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  id="openai-key"
                  value={apiKeys.openai}
                  onChange={handleApiKeyChange('openai')}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
              <div>
                <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-700 mb-1">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  id="gemini-key"
                  value={apiKeys.gemini}
                  onChange={handleApiKeyChange('gemini')}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
              <div>
                <label htmlFor="anthropic-key" className="block text-sm font-medium text-gray-700 mb-1">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  id="anthropic-key"
                  value={apiKeys.anthropic}
                  onChange={handleApiKeyChange('anthropic')}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                />
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
                  <option value="chatgpt">ChatGPT</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="anthropic">Anthropic Claude</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}; 