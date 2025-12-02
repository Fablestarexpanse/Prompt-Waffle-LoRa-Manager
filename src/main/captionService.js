const { spawn } = require('child_process')
const path = require('path')
const { app } = require('electron')

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

      // Wait for ready message
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

      // Timeout after 30 seconds
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

      // Timeout after 60 seconds
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

// Singleton instance
let captionServiceInstance = null

function getCaptionService() {
  if (!captionServiceInstance) {
    captionServiceInstance = new CaptionService()
  }
  return captionServiceInstance
}

module.exports = { getCaptionService }
