import React, { useState } from 'react';
import { useApiKeys, ModelType } from '../context/ApiKeyContext';

interface ModelConfig {
  id: ModelType;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const Settings: React.FC = () => {
  const { apiKeys, updateApiKeys } = useApiKeys();
  const [activeTab, setActiveTab] = useState<'api-keys' | 'preferences'>('api-keys');
  const [isVisible, setIsVisible] = useState(false);

  const getApiKeyValue = (modelId: ModelType): string | undefined => {
    switch (modelId) {
      case 'chatgpt':
        return apiKeys.openai;
      case 'anthropic':
        return apiKeys.anthropic;
      case 'gemini':
        return apiKeys.gemini;
      case 'google':
        return apiKeys.google;
      default:
        return undefined;
    }
  };

  const handleKeyChange = (provider: ModelType, value: string) => {
    const updatedKeys = { ...apiKeys };
    switch (provider) {
      case 'chatgpt':
        updatedKeys.openai = value;
        break;
      case 'anthropic':
        updatedKeys.anthropic = value;
        break;
      case 'gemini':
        updatedKeys.gemini = value;
        break;
      case 'google':
        updatedKeys.google = value;
        break;
    }
    updateApiKeys(updatedKeys);
  };

  const models: ModelConfig[] = [
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      description: 'OpenAI\'s GPT model for advanced language understanding',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Claude model for nuanced content generation',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 12H8M16 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'gemini',
      name: 'Gemini',
      description: 'Google\'s advanced AI model for comprehensive analysis',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L3 8.5V15.5L12 21L21 15.5V8.5L12 3Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8V16M8 10V14M16 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'google',
      name: 'Google AI',
      description: 'General-purpose AI model for diverse applications',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          className={`pb-2 px-4 ${activeTab === 'api-keys' ? 'border-b-2 border-violet-600 text-violet-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('api-keys')}
        >
          API Keys
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'preferences' ? 'border-b-2 border-violet-600 text-violet-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
      </div>

      {/* API Keys Section */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">AI Model API Keys</h2>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="text-violet-600 hover:text-violet-700"
            >
              {isVisible ? 'Hide Keys' : 'Show Keys'}
            </button>
          </div>

          <div className="grid gap-6">
            {models.map((model) => (
              <div key={model.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="text-violet-600">
                    {model.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{model.name}</h3>
                        <p className="text-sm text-gray-600">{model.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        getApiKeyValue(model.id) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {getApiKeyValue(model.id) ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                    <div className="mt-4">
                      <input
                        type={isVisible ? "text" : "password"}
                        value={getApiKeyValue(model.id) || ''}
                        onChange={(e) => handleKeyChange(model.id, e.target.value)}
                        placeholder={`Enter ${model.name} API key`}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Security Note</h3>
            <p className="text-sm text-gray-600">
              Your API keys are stored locally in your browser and are never sent to our servers.
              We recommend regularly rotating your API keys for security purposes.
            </p>
          </div>
        </div>
      )}

      {/* Preferences Section */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">General Preferences</h2>
            {/* Add preferences options here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 