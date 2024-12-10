import React from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  selectedModel: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeyChange, selectedModel }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm mb-2">API Key for {selectedModel}</label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
        placeholder="Enter your API key"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
      />
      <p className="text-xs text-gray-500 mt-1">
        Your API key is stored locally and never sent to our servers
      </p>
    </div>
  );
};

export default ApiKeyInput;