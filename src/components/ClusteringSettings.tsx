import React from 'react';

interface Settings {
  minGroupSize: number;
  maxGroupSize: number;
  similarityThreshold: number;
}

interface ClusteringSettingsProps {
  settings: Settings;
  onSettingChange: (setting: string, value: number) => void;
}

const ClusteringSettings: React.FC<ClusteringSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  return (
    <div className="mb-6">
      <h3 className="flex items-center text-sm font-medium mb-3">
        <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 8a5 5 0 11-10 0 5 5 0 0110 0z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" fill="currentColor"/>
        </svg>
        Clustering Settings
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Minimum Group Size</label>
          <input
            type="number"
            value={settings.minGroupSize}
            onChange={(e) => onSettingChange('minGroupSize', parseInt(e.target.value))}
            min={1}
            max={settings.maxGroupSize}
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Maximum Group Size</label>
          <input
            type="number"
            value={settings.maxGroupSize}
            onChange={(e) => onSettingChange('maxGroupSize', parseInt(e.target.value))}
            min={settings.minGroupSize}
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
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
          <div className="flex justify-between text-xs text-gray-500">
            <span>Less Similar</span>
            <span>More Similar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusteringSettings;