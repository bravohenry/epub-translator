import React, { useState, useEffect } from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';

const API_OPTIONS = [
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'gemini', label: 'Google Gemini' },
];

const STYLE_OPTIONS = [
  { value: 'balanced', label: '平衡' },
  { value: 'literal', label: '直译' },
  { value: 'free', label: '意译' },
];

const DOMAIN_OPTIONS = [
  { value: 'general', label: '通用' },
  { value: 'academic', label: '学术' },
  { value: 'literature', label: '文学' },
];

const TARGET_LANGUAGE_OPTIONS = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英文' },
  { value: 'ja', label: '日文' },
  { value: 'ko', label: '韩文' },
  { value: 'fr', label: '法文' },
  { value: 'de', label: '德文' },
];

const defaultSettings = {
  api: 'deepseek',
  style: 'balanced',
  domain: 'general',
  targetLanguage: 'zh',
  keepOriginal: true,
  apiKeys: {},
};

export const SettingsDialog = ({ settings: initialSettings, onSettingsChange }) => {
  const [settings, setSettings] = useState(initialSettings || defaultSettings);

  const handleSave = () => {
    try {
      console.log('保存设置:', {
        api: settings.api,
        hasApiKey: !!settings.apiKeys[settings.api],
        apiKeyLength: settings.apiKeys[settings.api] ? settings.apiKeys[settings.api].length : 0
      });
      onSettingsChange(settings);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleChange = (key, value) => {
    console.log('设置改变:', { key, value });
    if (key === 'apiKeys') {
      console.log('API Key 更新:', {
        api: settings.api,
        hasNewKey: !!value[settings.api],
        newKeyLength: value[settings.api] ? value[settings.api].length : 0
      });
    }
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // 当初始设置改变时更新本地状态
  useEffect(() => {
    setSettings(initialSettings || defaultSettings);
  }, [initialSettings]);

  return (
    <Dialog.Content className="w-[90vw] max-w-lg">
      <Dialog.Header>
        <Dialog.Title>翻译设置</Dialog.Title>
        <Dialog.Description>
          配置翻译API和翻译风格
        </Dialog.Description>
      </Dialog.Header>

      <div className="space-y-4">
        {/* API 选择 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">翻译 API</label>
          <select
            value={settings.api}
            onChange={(e) => handleChange('api', e.target.value)}
            className="w-full px-3 py-2 bg-background border rounded-md"
          >
            {API_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* API Key 输入 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">API Key</label>
          <input
            type="password"
            value={settings.apiKeys[settings.api] || ''}
            onChange={(e) => handleChange('apiKeys', {
              ...settings.apiKeys,
              [settings.api]: e.target.value
            })}
            className="w-full px-3 py-2 bg-background border rounded-md"
            placeholder="输入 API Key"
          />
        </div>

        {/* 目标语言选择 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">目标语言</label>
          <select
            value={settings.targetLanguage}
            onChange={(e) => handleChange('targetLanguage', e.target.value)}
            className="w-full px-3 py-2 bg-background border rounded-md"
          >
            {TARGET_LANGUAGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 翻译风格选择 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">翻译风格</label>
          <select
            value={settings.style}
            onChange={(e) => handleChange('style', e.target.value)}
            className="w-full px-3 py-2 bg-background border rounded-md"
          >
            {STYLE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 领域选择 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">专业领域</label>
          <select
            value={settings.domain}
            onChange={(e) => handleChange('domain', e.target.value)}
            className="w-full px-3 py-2 bg-background border rounded-md"
          >
            {DOMAIN_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 保留原文选项 */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="keepOriginal"
            checked={settings.keepOriginal}
            onChange={(e) => handleChange('keepOriginal', e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="keepOriginal" className="text-sm font-medium">
            保留原文
          </label>
        </div>
      </div>

      <Dialog.Footer>
        <Dialog.Close asChild>
          <Button variant="secondary">取消</Button>
        </Dialog.Close>
        <Dialog.Close asChild>
          <Button onClick={handleSave}>保存</Button>
        </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  );
}; 