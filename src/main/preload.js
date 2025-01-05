const { contextBridge, ipcRenderer } = require('electron');

// 添加调试日志
function debugLog(type, ...args) {
  console.log(`[Preload ${type}]`, ...args);
}

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, data) => {
      const validChannels = [
        'select-file',
        'start-translation',
        'update-settings',
        'pause-translation',
        'resume-translation',
        'open-folder'
      ];
      debugLog('invoke', channel, data);
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data);
      }
      return Promise.reject(new Error('Invalid channel'));
    },
    send: (channel, data) => {
      const validChannels = ['settings-updated'];
      debugLog('send', channel, data);
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel, func) => {
      const validChannels = ['translation-progress'];
      debugLog('on', channel);
      if (validChannels.includes(channel)) {
        // 包装回调函数以添加日志
        const wrappedFunc = (event, ...args) => {
          debugLog('received', channel, ...args);
          func(event, ...args);
        };
        ipcRenderer.on(channel, wrappedFunc);
        // 返回原始函数以便于移除监听器
        return func;
      }
    },
    removeListener: (channel, func) => {
      const validChannels = ['translation-progress'];
      debugLog('removeListener', channel);
      if (validChannels.includes(channel)) {
        ipcRenderer.removeListener(channel, func);
      }
    }
  }
}); 