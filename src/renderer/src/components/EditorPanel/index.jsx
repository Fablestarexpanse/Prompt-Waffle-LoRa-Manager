import useDatasetStore from '../../store/datasetStore'
import CaptionEditor from './CaptionEditor'
import { Save } from 'lucide-react'

export default function EditorPanel() {
    const { images, selectedImageIndex, updateImageCaption } = useDatasetStore()
    const selectedImage = images[selectedImageIndex]

    const handleCaptionChange = (value) => {
        updateImageCaption(selectedImageIndex, value)
    }

    const handleSave = async () => {
        if (selectedImage) {
            await window.api.writeFile(selectedImage.captionPath, selectedImage.caption)
            // Optional: Show toast or indicator
            console.log('Saved caption:', selectedImage.captionPath)
        }
    }

    return (
        <div className="h-full w-full bg-bg-secondary p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-text-primary text-lg font-semibold">Caption Editor</h2>
                {selectedImage && (
                    <button
                        onClick={handleSave}
                        className="p-2 hover:bg-bg-tertiary rounded-full text-text-secondary hover:text-accent transition-colors"
                        title="Save (Ctrl+S)"
                    >
                        <Save size={18} />
                    </button>
                )}
            </div>

            <div className="flex-1 bg-bg-tertiary rounded-lg overflow-hidden border border-border">
                {selectedImage ? (
                    <div className="h-full flex flex-col">
                        <div className="bg-bg-primary px-4 py-2 text-xs text-text-secondary border-b border-border truncate">
                            {selectedImage.captionPath}
                        </div>
                        <div className="flex-1">
                            <CaptionEditor
                                initialValue={selectedImage.caption || ''}
                                onChange={handleCaptionChange}
                                onSave={handleSave}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-text-secondary">
                        Select an image to edit caption.
                    </div>
                )}
            </div>
        </div>
    );
}
