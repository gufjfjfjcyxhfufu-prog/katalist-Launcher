const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('katalist', {
  // Window controls
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close')
  },

  // Config persistence
  config: {
    load: () => ipcRenderer.invoke('config:load'),
    save: (data) => ipcRenderer.invoke('config:save', data)
  },

  // File dialog
  dialog: {
    pickGame: () => ipcRenderer.invoke('dialog:pick-game')
  },

  // Game control
  game: {
    launch: (gamePath) => ipcRenderer.invoke('game:launch', gamePath),
    kill: () => ipcRenderer.invoke('game:kill'),
    onError: (cb) => ipcRenderer.on('game:error', (_, msg) => cb(msg)),
    onExit: (cb) => ipcRenderer.on('game:exited', (_, code) => cb(code))
  },

  // Shell utilities
  shell: {
    showItem: (filePath) => ipcRenderer.invoke('shell:show-item', filePath)
  },

  // Menu events from main process
  menu: {
    onLaunchGame: (cb) => ipcRenderer.on('menu:launch-game', cb),
    onOpenSettings: (cb) => ipcRenderer.on('menu:open-settings', cb)
  },

  // Environment
  isElectron: true
})
