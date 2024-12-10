import React, { useState } from 'react';
import { useApiKeys } from '../context/ApiKeyContext';

interface ApiKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
  gemini?: string;
}

const ApiKeySettings: React.FC = () => {
  const { apiKeys, updateApiKeys } = useApiKeys();
  const [isVisible, setIsVisible] = useState(false);

  const handleKeyChange = (provider: keyof ApiKeys, value: string) => {
    const newKeys = { ...apiKeys, [provider]: value };
    updateApiKeys(newKeys);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">AI Model API Keys</h2>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="text-blue-600 hover:text-blue-800"
        >
          {isVisible ? 'Hide Keys' : 'Show Keys'}
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OpenAI API Key
          </label>
          <input
            type={isVisible ? "text" : "password"}
            value={apiKeys.openai || ''}
            onChange={(e) => handleKeyChange('openai', e.target.value)}
            placeholder="Enter OpenAI API key"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anthropic API Key
          </label>
          <input
            type={isVisible ? "text" : "password"}
            value={apiKeys.anthropic || ''}
            onChange={(e) => handleKeyChange('anthropic', e.target.value)}
            placeholder="Enter Anthropic API key"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gemini API Key
          </label>
          <input
            type={isVisible ? "text" : "password"}
            value={apiKeys.gemini || ''}
            onChange={(e) => handleKeyChange('gemini', e.target.value)}
            placeholder="Enter Gemini API key"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google AI API Key
          </label>
          <input
            type={isVisible ? "text" : "password"}
            value={apiKeys.google || ''}
            onChange={(e) => handleKeyChange('google', e.target.value)}
            placeholder="Enter Google AI API key"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ApiKeySettings;
