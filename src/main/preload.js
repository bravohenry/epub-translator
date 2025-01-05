const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, data) => {
      const validChannels = [
        'select-file',
        'translate-epub',
        'pause-translation',
        'resume-translation',
        'open-folder'
      ];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data);
      }
      return Promise.reject(new Error('Invalid channel'));
    },
    on: (channel, func) => {
      const validChannels = ['translation-progress'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
      }
    },
    removeListener: (channel, func) => {
      const validChannels = ['translation-progress'];
      if (validChannels.includes(channel)) {
        ipcRenderer.removeListener(channel, func);
      }
    }
  }
}); 