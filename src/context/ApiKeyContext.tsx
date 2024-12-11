import React, { createContext, useContext, useState, useEffect } from 'react';

export type ModelType = 'chatgpt' | 'anthropic' | 'gemini';

interface ApiKeys {
  openai: string;
  anthropic: string;
  gemini: string;
}

export interface ApiKeyContextType {
  apiKeys: ApiKeys;
  setApiKeys: (keys: ApiKeys) => void;
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  getCurrentApiKey: () => string;
}

const DEFAULT_KEYS: ApiKeys = {
  openai: '',
  anthropic: '',
  gemini: ''
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_KEYS);
  const [selectedModel, setSelectedModel] = useState<ModelType>('chatgpt');

  useEffect(() => {
    // Load saved keys from localStorage on mount
    const savedKeys = localStorage.getItem('aiModelKeys');
    const savedModel = localStorage.getItem('selectedModel') as ModelType;
    
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
    
    if (savedModel) {
      setSelectedModel(savedModel);
    }
  }, []);

  const handleSetApiKeys = (newKeys: ApiKeys) => {
    setApiKeys(newKeys);
    localStorage.setItem('aiModelKeys', JSON.stringify(newKeys));
  };

  const handleSetSelectedModel = (model: ModelType) => {
    setSelectedModel(model);
    localStorage.setItem('selectedModel', model);
  };

  const getCurrentApiKey = (): string => {
    switch (selectedModel) {
      case 'chatgpt':
        return apiKeys.openai;
      case 'anthropic':
        return apiKeys.anthropic;
      case 'gemini':
        return apiKeys.gemini;
      default:
        return '';
    }
  };

  const value: ApiKeyContextType = {
    apiKeys,
    setApiKeys: handleSetApiKeys,
    selectedModel,
    setSelectedModel: handleSetSelectedModel,
    getCurrentApiKey
  };

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKeys = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKeys must be used within an ApiKeyProvider');
  }
  return context;
};
