const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { translate_epub } = require('./translate-wrapper');

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
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'ePub Files', extensions: ['epub'] }
    ]
  });
  return result.filePaths[0];
});

// 处理翻译请求
ipcMain.handle('translate-epub', async (event, { inputPath, outputPath }) => {
  try {
    translationPaused = false;
    await translate_epub(inputPath, outputPath, (progress) => {
      if (!mainWindow.isDestroyed()) {
        mainWindow.webContents.send('translation-progress', progress);
      }
    }, () => translationPaused);
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