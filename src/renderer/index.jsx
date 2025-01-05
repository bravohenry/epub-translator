import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { Upload, Play, Pause, FolderOpen, SettingsIcon } from 'lucide-react';
import { SettingsDialog } from './components/settings-dialog';
import { Dialog } from './components/ui/dialog';

// 导入样式
import './styles.css';

// 默认设置
const defaultSettings = {
  api: 'deepseek',
  style: 'balanced',
  domain: 'general',
  targetLanguage: 'zh',
  keepOriginal: true,
  apiKeys: {},
};

const App = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentChapter, setCurrentChapter] = useState('0/0');
  const [chapterProgress, setChapterProgress] = useState(0);
  const [status, setStatus] = useState('ready');
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('translationSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (err) {
      console.error('Failed to parse settings:', err);
      return defaultSettings;
    }
  });
  const [translationStats, setTranslationStats] = useState({
    currentChapter: 0,
    totalChapters: 0,
    chapterProgress: 0,
    estimatedTimeRemaining: null,
    outputPath: '',
  });

  const handleStartTranslation = async () => {
    try {
      console.log('开始翻译...', { file, settings });
      
      if (!file) {
        throw new Error('请先选择一个ePub文件');
      }
      
      // 检查设置是否完整
      if (!settings || !settings.api || !settings.apiKeys[settings.api]) {
        throw new Error('请先在设置中配置API和API Key');
      }

      console.log('发送翻译请求...');
      setStatus('translating');
      setError(null);
      setProgress(0);
      
      const result = await window.electron.ipcRenderer.invoke('start-translation', {
        filePath: file,
        settings: settings
      });
      
      console.log('收到翻译结果:', result);
      
      if (result.success) {
        setStatus('success');
        setProgress(100);
      } else {
        throw new Error(result.error || '翻译失败');
      }
    } catch (err) {
      console.error('翻译错误:', err);
      setStatus('error');
      setError(err.message);
    }
  };

  // 保存设置到本地存储
  useEffect(() => {
    localStorage.setItem('translationSettings', JSON.stringify(settings));
  }, [settings]);

  // 监听翻译进度更新
  useEffect(() => {
    const handleProgress = (event, data) => {
      console.log('收到进度更新:', data);
      
      if (data.status === 'translating') {
        // 更新翻译统计信息
        setTranslationStats(prev => ({
          ...prev,
          currentChapter: data.currentChapter,
          totalChapters: data.totalChapters,
          chapterProgress: data.chapterProgress
        }));

        // 计算总体进度
        if (data.totalChapters > 0) {
          const totalProgress = ((data.currentChapter - 1) / data.totalChapters * 100) + 
                              (data.chapterProgress / data.totalChapters);
          setProgress(totalProgress);
        }
      } else if (data.status === 'error') {
        setError(data.message);
        setStatus('error');
      } else if (data.status === 'completed') {
        setStatus('success');
        setProgress(100);
      }
    };

    window.electron.ipcRenderer.on('translation-progress', handleProgress);
    return () => {
      window.electron.ipcRenderer.removeListener('translation-progress', handleProgress);
    };
  }, []);

  const handleFileSelect = async () => {
    try {
      const filePath = await window.electron.ipcRenderer.invoke('select-file');
      if (filePath) {
        setFile(filePath);
        setStatus('idle');
        setError(null);
        setTranslationStats(prev => ({
          ...prev,
          currentChapter: 0,
          totalChapters: 0,
          chapterProgress: 0,
          estimatedTimeRemaining: null,
          outputPath: filePath.replace('.epub', '_bilingual.epub')
        }));
      }
    } catch (err) {
      console.error('Failed to select file:', err);
      setError('选择文件失败');
      setStatus('error');
    }
  };

  const handlePauseResume = () => {
    if (status === 'translating') {
      setStatus('paused');
      window.electron.ipcRenderer.invoke('pause-translation');
    } else if (status === 'paused') {
      setStatus('translating');
      window.electron.ipcRenderer.invoke('resume-translation');
    }
  };

  const handleOpenOutputFolder = () => {
    if (translationStats.outputPath) {
      window.electron.ipcRenderer.invoke('open-folder', translationStats.outputPath);
    }
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('translationSettings', JSON.stringify(newSettings));
  };

  // 获取文件名的辅助函数
  const getFileName = (filePath) => {
    if (!filePath) return '';
    return filePath.split('/').pop().split('\\').pop();
  };

  // 格式化剩余时间
  const formatTimeRemaining = (seconds) => {
    if (!seconds) return '计算中...';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}分${remainingSeconds}秒`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 标题区域 - Linear风格的标题栏 */}
        <div className="flex items-center justify-between py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-sm">📚</span>
            </div>
            <div>
              <h1 className="text-lg font-medium">ePub Bilingual Translator</h1>
              <p className="text-sm text-muted-foreground">
                Translate your ePub books into bilingual versions
              </p>
            </div>
          </div>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button variant="ghost" size="icon" className="button-linear">
                <SettingsIcon className="w-4 h-4" />
              </Button>
            </Dialog.Trigger>
            <SettingsDialog 
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          </Dialog.Root>
        </div>

        {/* 主要内容区域 */}
        <div className="space-y-6">
          {/* 文件选择 */}
          <div className="card-linear">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/50" />
                  <label className="text-sm font-medium">Select ePub file</label>
                </div>
                <p className="text-muted-foreground text-sm truncate mt-2 ml-4">
                  {file ? getFileName(file) : 'No file selected'}
                </p>
              </div>
              <Button
                onClick={handleFileSelect}
                variant="secondary"
                className="button-linear button-secondary shrink-0"
              >
                <Upload className="w-4 h-4 mr-2" />
                Browse
              </Button>
            </div>
          </div>

          {file && (
            <div className="card-linear space-y-6">
              {/* 进度显示 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/50" />
                    <span className="text-sm font-medium">Translation Progress</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="progress-bar ml-4">
                  <div 
                    className="progress-bar-value"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* 统计信息 */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border">
                <div>
                  <label className="text-sm text-muted-foreground">Current Chapter</label>
                  <p className="text-2xl font-medium mt-1">
                    {translationStats.currentChapter}/{translationStats.totalChapters}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Chapter Progress</label>
                  <p className="text-2xl font-medium mt-1">
                    {Math.round(translationStats.chapterProgress)}%
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Time Remaining</label>
                  <p className="text-2xl font-medium mt-1">
                    {formatTimeRemaining(translationStats.estimatedTimeRemaining)}
                  </p>
                </div>
              </div>

              {/* 控制按钮 */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="status-indicator">
                  <div className={`status-dot ${
                    status === 'translating' ? 'status-dot-translating' :
                    status === 'success' ? 'status-dot-success' :
                    status === 'error' ? 'status-dot-error' : ''
                  }`} />
                  <span className="text-sm text-muted-foreground">
                    {status === 'idle' && 'Ready to translate'}
                    {status === 'translating' && 'Translating...'}
                    {status === 'paused' && 'Translation paused'}
                    {status === 'success' && 'Translation completed'}
                    {status === 'error' && `Error: ${error}`}
                  </span>
                </div>

                <div className="flex gap-2">
                  {(status === 'translating' || status === 'paused') && (
                    <Button
                      onClick={handlePauseResume}
                      variant="secondary"
                      size="icon"
                      className="button-linear button-secondary h-9 w-9"
                    >
                      {status === 'translating' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  {status === 'success' && (
                    <Button
                      onClick={handleOpenOutputFolder}
                      variant="secondary"
                      size="icon"
                      className="button-linear button-secondary h-9 w-9"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    onClick={handleStartTranslation}
                    disabled={status === 'translating'}
                    className="button-linear button-primary h-9"
                  >
                    Start Translation
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 