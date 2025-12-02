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
    // In a real app we'd update the file content too, but store just holds state
    // We'll handle file writing in the component or a thunk
    return { images: newImages }
  })
}))

export default useDatasetStore
