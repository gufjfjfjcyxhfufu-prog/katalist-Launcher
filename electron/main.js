const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

// Config file path for saving game data
const configPath = path.join(app.getPath('userData'), 'katalist-config.json')

let mainWindow
let runningProcess = null

function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    }
  } catch (e) {
    console.error('Failed to load config:', e)
  }
  return { gamePath: null, gameTitle: null, recentGames: [] }
}

function saveConfig(data) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (e) {
    console.error('Failed to save config:', e)
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 1000,
    minHeight: 600,
    frame: false,
    transparent: false,
    backgroundColor: '#080b14',
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, '../assets/icons/icon.png'),
    show: false,
    resizable: true
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    // mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    // Fade in animation
    mainWindow.webContents.executeJavaScript(`
      document.body.style.opacity = '0';
      setTimeout(() => { document.body.style.transition = 'opacity 0.5s'; document.body.style.opacity = '1'; }, 100);
    `).catch(() => {})
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    if (runningProcess) {
      runningProcess.kill()
    }
  })

  // Set up application menu
  buildMenu()
}

function buildMenu() {
  const menuTemplate = [
    {
      label: 'Katalist',
      submenu: [
        {
          label: 'Launch Game',
          accelerator: 'CmdOrCtrl+L',
          click: () => {
            mainWindow?.webContents.send('menu:launch-game')
          }
        },
        { type: 'separator' },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow?.webContents.send('menu:open-settings')
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow?.webContents.reload()
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'F12',
          click: () => mainWindow?.webContents.toggleDevTools()
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

// ─── IPC Handlers ────────────────────────────────────────────────────────────

// Window controls
ipcMain.on('window:minimize', () => mainWindow?.minimize())
ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})
ipcMain.on('window:close', () => mainWindow?.close())

// Config
ipcMain.handle('config:load', () => loadConfig())
ipcMain.handle('config:save', (_, data) => {
  saveConfig(data)
  return { success: true }
})

// File picker
ipcMain.handle('dialog:pick-game', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Game Executable',
    filters: [
      { name: 'Executables', extensions: ['exe', 'app', 'sh', 'AppImage'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  })

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0]
    const fileName = path.basename(filePath, path.extname(filePath))
    return { path: filePath, name: fileName }
  }
  return null
})

// Launch game
ipcMain.handle('game:launch', async (_, gamePath) => {
  if (!gamePath) {
    return { success: false, error: 'No game path provided' }
  }

  if (!fs.existsSync(gamePath)) {
    return { success: false, error: 'Game executable not found at path: ' + gamePath }
  }

  try {
    if (runningProcess) {
      runningProcess.kill()
    }

    runningProcess = spawn(gamePath, [], {
      detached: true,
      stdio: 'ignore'
    })

    runningProcess.unref()

    runningProcess.on('error', (err) => {
      mainWindow?.webContents.send('game:error', err.message)
      runningProcess = null
    })

    runningProcess.on('exit', (code) => {
      mainWindow?.webContents.send('game:exited', code)
      runningProcess = null
    })

    return { success: true, pid: runningProcess.pid }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Kill running game
ipcMain.handle('game:kill', () => {
  if (runningProcess) {
    runningProcess.kill()
    runningProcess = null
    return { success: true }
  }
  return { success: false, error: 'No game running' }
})

// Open file in explorer
ipcMain.handle('shell:show-item', (_, filePath) => {
  shell.showItemInFolder(filePath)
  return { success: true }
})

// ─── App lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
