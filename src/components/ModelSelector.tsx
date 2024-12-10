import React from 'react';

interface ModelOption {
  id: string;
  name: string;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelSelect }) => {
  const models: ModelOption[] = [
    { id: 'chatgpt', name: 'ChatGPT' },
    { id: 'anthropic', name: 'Anthropic' },
    { id: 'gemini', name: 'Gemini' },
  ];

  return (
    <div className="mb-6">
      <h3 className="flex items-center text-sm font-medium mb-3">
        <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor"/>
          <path d="M15 8A7 7 0 111 8a7 7 0 0114 0z" stroke="currentColor" strokeWidth="2"/>
        </svg>
        Select AI Model
      </h3>
      <div className="flex space-x-3">
        {models.map((model) => (
          <button
            key={model.id}
            className={`px-4 py-2 rounded-md text-sm ${
              selectedModel === model.id
                ? 'bg-violet-100 text-violet-600 border-2 border-violet-600'
                : 'border-2 border-gray-200 hover:border-violet-600 transition-colors'
            }`}
            onClick={() => onModelSelect(model.id)}
          >
            {model.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;