const { app, shell, BrowserWindow, ipcMain, dialog } = require('electron')
const { join } = require('path')
const fs = require('fs/promises')
const path = require('path')
const { spawn } = require('child_process')

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif']

// File System Handlers
function setupFileSystemHandlers() {
  ipcMain.handle('dialog:openDirectory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    return result.canceled ? null : result.filePaths[0]
  })

  ipcMain.handle('fs:readDirectory', async (_, dirPath) => {
    const files = await fs.readdir(dirPath)
    const imageFiles = []

    for (const file of files) {
      const ext = path.extname(file).toLowerCase()
      if (IMAGE_EXTENSIONS.includes(ext)) {
        const imagePath = path.join(dirPath, file)
        const captionPath = imagePath.replace(ext, '.txt')
        
        let hasCaption = false
        try {
          await fs.access(captionPath)
          hasCaption = true
        } catch {
          hasCaption = false
        }

        imageFiles.push({
          name: file,
          path: imagePath,
          captionPath: captionPath,
          caption: hasCaption
        })
      }
    }

    return imageFiles
  })

  ipcMain.handle('fs:readFile', async (_, filePath) => {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return content
    } catch (error) {
      return ''
    }
  })

  ipcMain.handle('fs:writeFile', async (_, filePath, content) => {
    await fs.writeFile(filePath, content, 'utf-8')
    return true
  })
}

// Caption Service
class CaptionService {
  constructor() {
    this.process = null
    this.ready = false
    this.callbacks = new Map()
    this.requestId = 0
  }

  start() {
    return new Promise((resolve, reject) => {
      const isDev = !app.isPackaged
      const pythonPath = isDev
        ? path.join(process.cwd(), 'src', 'python', 'venv', 'Scripts', 'python.exe')
        : path.join(process.resourcesPath, 'python', 'python.exe')
      
      const scriptPath = isDev
        ? path.join(process.cwd(), 'src', 'python', 'caption_service.py')
        : path.join(process.resourcesPath, 'python', 'caption_service.py')

      console.log('Starting caption service:', pythonPath, scriptPath)

      this.process = spawn(pythonPath, [scriptPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      })

      this.process.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(l => l.trim())
        lines.forEach(line => {
          try {
            const message = JSON.parse(line)
            this._handleMessage(message)
          } catch (e) {
            console.error('Failed to parse message:', line, e)
          }
        })
      })

      this.process.stderr.on('data', (data) => {
        console.error('Caption service error:', data.toString())
      })

      this.process.on('close', (code) => {
        console.log('Caption service exited with code:', code)
        this.ready = false
      })

      const readyListener = (message) => {
        if (message.type === 'ready') {
          this.ready = true
          resolve()
        }
      }
      
      const originalHandler = this._handleMessage.bind(this)
      this._handleMessage = (message) => {
        readyListener(message)
        originalHandler(message)
      }

      setTimeout(() => {
        if (!this.ready) {
          reject(new Error('Caption service failed to start'))
        }
      }, 30000)
    })
  }

  stop() {
    if (this.process) {
      this._sendCommand({ command: 'exit' })
      this.process.kill()
      this.process = null
      this.ready = false
    }
  }

  async generateCaption(imagePath) {
    if (!this.ready) {
      throw new Error('Caption service not ready')
    }

    return new Promise((resolve, reject) => {
      const id = this.requestId++
      this.callbacks.set(id, { resolve, reject })

      this._sendCommand({
        command: 'caption',
        image_path: imagePath,
        id
      })

      setTimeout(() => {
        if (this.callbacks.has(id)) {
          this.callbacks.delete(id)
          reject(new Error('Caption generation timeout'))
        }
      }, 60000)
    })
  }

  _sendCommand(command) {
    if (this.process && this.process.stdin) {
      this.process.stdin.write(JSON.stringify(command) + '\n')
    }
  }

  _handleMessage(message) {
    console.log('Caption service message:', message)

    if (message.type === 'result') {
      const callback = this.callbacks.get(message.id)
      if (callback) {
        this.callbacks.delete(message.id)
        if (message.success) {
          callback.resolve(message.caption)
        } else {
          callback.reject(new Error(message.error))
        }
      }
    }
  }
}

let captionServiceInstance = null
function getCaptionService() {
  if (!captionServiceInstance) {
    captionServiceInstance = new CaptionService()
  }
  return captionServiceInstance
}

function createWindow() {
  const iconPath = join(__dirname, '../../resources/icon.png')
  
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon: iconPath } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  app.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production
  app.on('browser-window-created', (_, window) => {
    // Optional: Add shortcut watchers in development
  })

  // Setup file system handlers
  setupFileSystemHandlers()

  // Setup caption service handlers
  const captionService = getCaptionService()
  
  ipcMain.handle('caption:start', async () => {
    try {
      await captionService.start()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('caption:generate', async (_, imagePath) => {
    try {
      const caption = await captionService.generateCaption(imagePath)
      return { success: true, caption }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  const captionService = getCaptionService()
  captionService.stop()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
