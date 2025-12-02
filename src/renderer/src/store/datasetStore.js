import { create } from 'zustand'

const useDatasetStore = create((set) => ({
  currentPath: null,
  images: [],
  selectedImageIndex: -1,
  
  setFolder: (path, images) => set({ 
    currentPath: path, 
    images: images.map(img => ({
      ...img,
      // We don't know if caption exists yet without checking fs, 
      // but we'll assume false or handle it in readDirectory
      // For now, let's just keep it simple.
      // Ideally readDirectory should return this info.
    })),
    selectedImageIndex: images.length > 0 ? 0 : -1
  }),
  
  selectImage: async (index) => {
    if (index < 0 || index >= get().images.length) return
    set({ selectedImageIndex: index })
    const state = get()
    const image = state.images[index]
    if (image) {
      const caption = await window.api.readFile(image.captionPath)
      set((state) => {
        const newImages = [...state.images]
        newImages[index] = { ...newImages[index], caption }
        return { images: newImages }
      })
    }
  },
  
  navigateNext: () => {
    const { selectedImageIndex, images, selectImage } = get()
    if (selectedImageIndex < images.length - 1) {
      selectImage(selectedImageIndex + 1)
    }
  },

  navigatePrevious: () => {
    const { selectedImageIndex, selectImage } = get()
    if (selectedImageIndex > 0) {
      selectImage(selectedImageIndex - 1)
    }
  },
  
  updateImageCaption: (index, caption) => set((state) => {
    const newImages = [...state.images]
    newImages[index] = { ...newImages[index], caption }
    return { images: newImages }
  }),

  // Find/Replace in current caption
  findReplace: (find, replace) => {
    const { selectedImageIndex, images } = get()
    if (selectedImageIndex < 0) return
    
    const currentImage = images[selectedImageIndex]
    if (currentImage && currentImage.caption) {
      const newCaption = currentImage.caption.replaceAll(find, replace)
      set((state) => {
        const newImages = [...state.images]
        newImages[selectedImageIndex] = { ...newImages[selectedImageIndex], caption: newCaption }
        return { images: newImages }
      })
    }
  },

  // Add Prefix/Suffix to current caption
  addPrefixSuffix: (prefix, suffix) => {
    const { selectedImageIndex, images } = get()
    if (selectedImageIndex < 0) return
    
    const currentImage = images[selectedImageIndex]
    if (currentImage) {
      const caption = currentImage.caption || ''
      const newCaption = `${prefix}${caption}${suffix}`
      set((state) => {
        const newImages = [...state.images]
        newImages[selectedImageIndex] = { ...newImages[selectedImageIndex], caption: newCaption }
        return { images: newImages }
      })
    }
  },

  // Batch Find/Replace
  batchFindReplace: async (find, replace) => {
    const { images } = get()
    const updatedImages = images.map(img => {
      if (img.caption) {
        return { ...img, caption: img.caption.replaceAll(find, replace) }
      }
      return img
    })
    
    set({ images: updatedImages })
    
    // Save all updated captions
    for (const img of updatedImages) {
      if (img.caption !== undefined) {
        await window.api.writeFile(img.captionPath, img.caption)
      }
    }
  },

  // Batch Prefix/Suffix
  batchPrefixSuffix: async (prefix, suffix) => {
    const { images } = get()
    const updatedImages = images.map(img => {
      const caption = img.caption || ''
      return { ...img, caption: `${prefix}${caption}${suffix}` }
    })
    
    set({ images: updatedImages })
    
    // Save all updated captions
    for (const img of updatedImages) {
      await window.api.writeFile(img.captionPath, img.caption)
    }
  }
}))

export default useDatasetStore
