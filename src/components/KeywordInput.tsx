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
  settings: {
    minGroupSize: number;
    maxGroupSize: number;
    similarityThreshold: number;
  };
  onSettingChange: (setting: string, value: number) => void;
}

const KeywordInput: React.FC<KeywordInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  selectedModel,
  onModelSelect,
  settings,
  onSettingChange
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1 - Keyword Input */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Enter Keywords</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your target keywords or topics to generate suggestions
            </p>
            <div className="relative">
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter one keyword per line, e.g.:&#13;&#10;digital marketing&#13;&#10;content strategy&#13;&#10;SEO optimization"
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-shadow resize-none"
                disabled={isLoading}
              />
              <div className="absolute top-3 right-3">
                <Search size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <button className="flex items-center space-x-1 hover:text-violet-600 transition-colors">
              <span>Import from CSV</span>
            </button>
            <span>•</span>
            <button className="flex items-center space-x-1 hover:text-violet-600 transition-colors">
              <span>Paste from clipboard</span>
            </button>
          </div>
        </div>

        {/* Column 2 - Clustering Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Clustering Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              Configure how keywords should be grouped and analyzed
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Minimum Group Size</label>
                <input
                  type="number"
                  value={settings.minGroupSize}
                  onChange={(e) => onSettingChange('minGroupSize', parseInt(e.target.value))}
                  min={1}
                  max={settings.maxGroupSize}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Maximum Group Size</label>
                <input
                  type="number"
                  value={settings.maxGroupSize}
                  onChange={(e) => onSettingChange('maxGroupSize', parseInt(e.target.value))}
                  min={settings.minGroupSize}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">
                  Similarity Threshold: {settings.similarityThreshold}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.similarityThreshold}
                  onChange={(e) => onSettingChange('similarityThreshold', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Less Similar</span>
                  <span>More Similar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3 - AI Model Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Model Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select the AI model to use for keyword generation
            </p>
            <Dropdown<ModelType>
              value={selectedModel}
              onChange={onModelSelect}
              options={modelOptions}
              label="Select AI Model"
            />
          </div>

          <div>
            <button
              onClick={onSubmit}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-3 ${
                isLoading 
                  ? 'bg-violet-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={20} />
                  <span className="font-medium">Generate Keywords</span>
                </>
              )}
            </button>
            {!isLoading && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Press Enter or click to generate keywords
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-violet-500 hover:text-violet-600 transition-colors">
                Save as Template
              </button>
              <button className="p-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-violet-500 hover:text-violet-600 transition-colors">
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordInput;