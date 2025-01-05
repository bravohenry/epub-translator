import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';

const apiOptions = [
  { 
    id: 'deepseek', 
    name: 'DeepSeek API', 
    description: 'Professional AI translation engine',
    keyPlaceholder: 'Enter DeepSeek API key',
    keyHelp: 'Get your API key from DeepSeek website'
  },
  { 
    id: 'openai', 
    name: 'OpenAI API', 
    description: 'GPT-powered translation',
    keyPlaceholder: 'Enter OpenAI API key',
    keyHelp: 'Get your API key from OpenAI website'
  },
  { 
    id: 'google', 
    name: 'Google Translate', 
    description: 'Google translation service',
    keyPlaceholder: 'Enter Google Cloud API key',
    keyHelp: 'Get your API key from Google Cloud Console'
  },
];

const translationStyles = [
  { id: 'literal', name: 'Literal', description: 'Faithful to the original text, suitable for technical documents' },
  { id: 'free', name: 'Free', description: 'Elegant and fluent, suitable for literature' },
  { id: 'balanced', name: 'Balanced', description: 'Balance between accuracy and fluency' },
];

const domains = [
  { id: 'general', name: 'General', description: 'Suitable for most content' },
  { id: 'technical', name: 'Technical', description: 'Technical documents and manuals' },
  { id: 'literary', name: 'Literary', description: 'Novels and literature' },
  { id: 'business', name: 'Business', description: 'Business documents' },
  { id: 'academic', name: 'Academic', description: 'Academic papers and research' },
];

export function SettingsDialog({ settings, onSettingsChange }) {
  const [localSettings, setLocalSettings] = React.useState({
    ...settings,
    apiKeys: settings.apiKeys || {}
  });
  const [showApiKey, setShowApiKey] = React.useState(false);

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApiKeyChange = (apiId, value) => {
    setLocalSettings(prev => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [apiId]: value
      }
    }));
  };

  const handleSave = () => {
    const savedSettings = {
      ...localSettings,
      apiKeys: localSettings.apiKeys
    };
    localStorage.setItem('translationSettings', JSON.stringify(savedSettings));
    onSettingsChange(savedSettings);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="button-linear">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Translation Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Translation API</h4>
            <div className="space-y-2">
              {apiOptions.map((api) => (
                <div key={api.id} className="space-y-2">
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      localSettings.api === api.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleChange('api', api.id)}
                  >
                    <div>
                      <div className="font-medium">{api.name}</div>
                      <div className="text-sm text-muted-foreground">{api.description}</div>
                    </div>
                  </div>
                  {localSettings.api === api.id && (
                    <div className="px-3">
                      <div className="relative">
                        <input
                          type={showApiKey ? "text" : "password"}
                          className="input-linear w-full"
                          placeholder={api.keyPlaceholder}
                          value={localSettings.apiKeys[api.id] || ''}
                          onChange={(e) => handleApiKeyChange(api.id, e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{api.keyHelp}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Translation Style</h4>
            <div className="space-y-2">
              {translationStyles.map((style) => (
                <div
                  key={style.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    localSettings.style === style.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleChange('style', style.id)}
                >
                  <div>
                    <div className="font-medium">{style.name}</div>
                    <div className="text-sm text-muted-foreground">{style.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Domain</h4>
            <div className="grid grid-cols-2 gap-2">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-colors ${
                    localSettings.domain === domain.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleChange('domain', domain.id)}
                >
                  <div className="font-medium">{domain.name}</div>
                  <div className="text-xs text-muted-foreground">{domain.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="keepOriginal"
              className="rounded border-border focus:ring-primary"
              checked={localSettings.keepOriginal}
              onChange={(e) => handleChange('keepOriginal', e.target.checked)}
            />
            <label htmlFor="keepOriginal" className="text-sm font-medium">
              Keep original text
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="button-linear button-primary">
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 