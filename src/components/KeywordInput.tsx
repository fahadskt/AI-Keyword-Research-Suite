import { Search } from 'lucide-react';
import Dropdown from './ui/Dropdown';
import { ModelType } from '../context/ApiKeyContext';

interface KeywordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  selectedModel: ModelType;
  onModelSelect: (model: ModelType) => void;
}

const KeywordInput: React.FC<KeywordInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  selectedModel,
  onModelSelect
}) => {
  const modelOptions = [
    {
      value: 'chatgpt' as ModelType,
      label: 'ChatGPT',
      description: 'OpenAI\'s GPT model for advanced language understanding',
      icon: (
        <svg className="w-5 h-5 text-violet-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      value: 'anthropic' as ModelType,
      label: 'Anthropic',
      description: 'Claude model for nuanced content generation',
      icon: (
        <svg className="w-5 h-5 text-violet-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 12H8M16 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      value: 'gemini' as ModelType,
      label: 'Gemini',
      description: 'Google\'s advanced AI model for comprehensive analysis',
      icon: (
        <svg className="w-5 h-5 text-violet-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L3 8.5V15.5L12 21L21 15.5V8.5L12 3Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8V16M8 10V14M16 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter Keywords
        </label>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., digital marketing, pet care, fitness equipment"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-shadow"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Search size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Dropdown<ModelType>
            value={selectedModel}
            onChange={onModelSelect}
            options={modelOptions}
            label="Select AI Model"
          />
        </div>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
            isLoading 
              ? 'bg-violet-400 cursor-not-allowed' 
              : 'bg-violet-600 hover:bg-violet-700 text-white'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Search size={18} />
              <span>Generate</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default KeywordInput;