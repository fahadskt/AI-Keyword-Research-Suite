import { useState } from 'react';
import { useApiKeys, ModelType } from '../context/ApiKeyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Sliders, Bell, Palette } from 'lucide-react';
import Layout from './Layout';
import Card from './ui/Card';

interface ModelConfig {
  id: ModelType;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const Settings = () => {
  const { apiKeys, updateApiKeys } = useApiKeys();
  const [activeTab, setActiveTab] = useState<'api-keys' | 'preferences' | 'notifications' | 'appearance'>('api-keys');
  const [isVisible, setIsVisible] = useState(false);

  const tabs = [
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

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
    <Layout 
      title="Settings" 
      description="Manage your API keys and preferences"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-violet-50 text-violet-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'api-keys' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
                        <p className="text-sm text-gray-600">
                          Configure your AI model API keys for enhanced functionality
                        </p>
                      </div>
                      <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        <Shield size={16} />
                        <span>{isVisible ? 'Hide Keys' : 'Show Keys'}</span>
                      </button>
                    </div>

                    <div className="grid gap-6">
                      {models.map((model) => (
                        <Card key={model.id}>
                          <div className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="p-3 bg-violet-50 text-violet-600 rounded-lg">
                                {model.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-medium text-gray-900">{model.name}</h3>
                                    <p className="text-sm text-gray-600">{model.description}</p>
                                  </div>
                                  <motion.span
                                    initial={false}
                                    animate={{
                                      backgroundColor: getApiKeyValue(model.id) 
                                        ? 'rgb(220 252 231)' 
                                        : 'rgb(243 244 246)',
                                      color: getApiKeyValue(model.id)
                                        ? 'rgb(22 163 74)'
                                        : 'rgb(107 114 128)'
                                    }}
                                    className="px-2.5 py-1 text-xs rounded-full"
                                  >
                                    {getApiKeyValue(model.id) ? 'Connected' : 'Not Connected'}
                                  </motion.span>
                                </div>
                                <div className="mt-4">
                                  <div className="relative">
                                    <input
                                      type={isVisible ? "text" : "password"}
                                      value={getApiKeyValue(model.id) || ''}
                                      onChange={(e) => handleKeyChange(model.id, e.target.value)}
                                      placeholder={`Enter ${model.name} API key`}
                                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-shadow"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                      <Key size={16} className="text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Card className="p-4 bg-gradient-to-r from-violet-50 to-purple-50">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-white rounded-lg text-violet-600">
                          <Shield size={24} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Security Note</h3>
                          <p className="text-sm text-gray-600">
                            Your API keys are stored locally in your browser and are never sent to our servers.
                            We recommend regularly rotating your API keys for security purposes.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Add other tab content here */}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings; 