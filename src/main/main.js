const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { translate_epub } = require('./translate-wrapper');
const fs = require('fs');

// 保持对窗口对象的全局引用
let mainWindow;
let translationPaused = false;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 800,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset', // macOS风格的标题栏
    backgroundColor: '#ffffff'
  });

  // 设置CSP
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          process.env.NODE_ENV === 'development'
            ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173"
            : "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'"
        ]
      }
    });
  });

  // 根据环境加载页面
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
}

// 当Electron完成初始化时调用此方法
app.whenReady().then(createWindow);

// 当所有窗口都被关闭时退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 处理文件选择
ipcMain.handle('select-file', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'ePub Files', extensions: ['epub'] }
      ]
    });
    
    if (result.canceled) {
      return null;
    }
    
    return result.filePaths[0];
  } catch (err) {
    console.error('Failed to select file:', err);
    throw err;
  }
});

// 处理翻译请求
ipcMain.handle('start-translation', async (event, { filePath, settings }) => {
  try {
    console.log('主进程收到翻译请求:', {
      filePath,
      settings: {
        ...settings,
        apiKeys: settings.apiKeys ? Object.keys(settings.apiKeys).reduce((acc, key) => {
          acc[key] = `${settings.apiKeys[key].substring(0, 4)}...${settings.apiKeys[key].slice(-4)}`;
          return acc;
        }, {}) : {}
      }
    });

    if (!settings || !settings.api || !settings.apiKeys[settings.api]) {
      console.error('翻译设置不完整:', { settings });
      throw new Error('翻译设置不完整');
    }

    // 验证文件路径
    if (!filePath || !fs.existsSync(filePath)) {
      console.error('无效的文件路径:', filePath);
      throw new Error('无效的文件路径');
    }

    console.log('开始调用翻译函数...');
    
    // 调用翻译函数
    const outputPath = await translate_epub(
      filePath,
      settings,
      (progress) => {
        console.log('发送进度更新:', progress);
        // 发送进度更新到渲染进程
        try {
          event.sender.send('translation-progress', progress);
        } catch (err) {
          console.error('发送进度更新失败:', err);
        }
      },
      () => translationPaused
    );

    console.log('翻译完成，输出路径:', outputPath);
    return { success: true, data: { outputPath } };
  } catch (error) {
    console.error('翻译错误:', error);
    return { success: false, error: error.message };
  }
});

// 处理设置更新
ipcMain.handle('update-settings', async (event, settings) => {
  try {
    // 验证设置
    if (!settings || !settings.api) {
      throw new Error('无效的设置');
    }
    
    // 可以在这里添加其他设置验证逻辑
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 处理暂停翻译
ipcMain.handle('pause-translation', () => {
  translationPaused = true;
});

// 处理继续翻译
ipcMain.handle('resume-translation', () => {
  translationPaused = false;
});

// 处理打开文件夹
ipcMain.handle('open-folder', async (event, filePath) => {
  if (filePath) {
    const folderPath = path.dirname(filePath);
    shell.showItemInFolder(filePath);
  }
});

// 处理设置更新
ipcMain.on('settings-updated', (event, settings) => {
  // 将设置保存到全局变量或传递给其他需要的模块
  global.translatorSettings = settings;
}); 