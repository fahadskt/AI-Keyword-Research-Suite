import React, { createContext, useContext, useState, useEffect } from 'react';

interface ApiKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
  gemini?: string;
}

interface ApiKeyContextType {
  apiKeys: ApiKeys;
  updateApiKeys: (keys: ApiKeys) => void;
  hasValidKeys: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [hasValidKeys, setHasValidKeys] = useState(false);

  useEffect(() => {
    // Load saved keys from localStorage on mount
    const savedKeys = localStorage.getItem('aiModelKeys');
    if (savedKeys) {
      const keys = JSON.parse(savedKeys);
      setApiKeys(keys);
      setHasValidKeys(Object.values(keys).some(key => key));
    }
  }, []);

  const updateApiKeys = (newKeys: ApiKeys) => {
    setApiKeys(newKeys);
    setHasValidKeys(Object.values(newKeys).some(key => key));
    localStorage.setItem('aiModelKeys', JSON.stringify(newKeys));
  };

  return (
    <ApiKeyContext.Provider value={{ apiKeys, updateApiKeys, hasValidKeys }}>
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
