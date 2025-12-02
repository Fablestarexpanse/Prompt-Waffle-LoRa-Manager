const { ipcMain, dialog } = require('electron')
const fs = require('fs/promises')
const path = require('path')

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif']

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

module.exports = { setupFileSystemHandlers }
