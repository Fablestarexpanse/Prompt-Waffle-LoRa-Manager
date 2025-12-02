import { dialog, ipcMain } from 'electron'
import fs from 'fs/promises'
import path from 'path'

export function setupFileSystemHandlers() {
  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    if (canceled) {
      return null
    }
    return filePaths[0]
  })

  ipcMain.handle('fs:readDirectory', async (_, dirPath) => {
    try {
      const files = await fs.readdir(dirPath)
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp']
      
      const images = await Promise.all(files.filter(file => {
        const ext = path.extname(file).toLowerCase()
        return imageExtensions.includes(ext)
      }).map(async file => {
        const captionPath = path.join(dirPath, path.basename(file, path.extname(file)) + '.txt')
        let hasCaption = false
        try {
          await fs.access(captionPath)
          hasCaption = true
        } catch {
          hasCaption = false
        }
        
        return {
          name: file,
          path: path.join(dirPath, file),
          captionPath,
          caption: hasCaption // We can use this for the indicator
        }
      }))

      return images
    } catch (error) {
      console.error('Error reading directory:', error)
      throw error
    }
  })

  ipcMain.handle('fs:readFile', async (_, filePath) => {
    try {
      return await fs.readFile(filePath, 'utf-8')
    } catch (error) {
      // If file doesn't exist, return empty string
      return ''
    }
  })

  ipcMain.handle('fs:writeFile', async (_, filePath, content) => {
    await fs.writeFile(filePath, content, 'utf-8')
  })
}
