const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  claudeChat: (payload) => ipcRenderer.invoke('claude-chat', payload)
})
