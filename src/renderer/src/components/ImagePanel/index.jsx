import useDatasetStore from '../../store/datasetStore'
import ImageViewer from './ImageViewer'
import ThumbnailGrid from './ThumbnailGrid'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function ImagePanel() {
    const { images, selectedImageIndex } = useDatasetStore()
    const selectedImage = images[selectedImageIndex]

    return (
        <div className="h-full w-full bg-bg-secondary flex flex-col">
            <PanelGroup direction="vertical">
                <Panel defaultSize={70} minSize={30} className="flex flex-col p-4 pb-0">
                    <h2 className="text-text-primary text-lg font-semibold mb-4">Image Viewer</h2>
                    <div className="flex-1 overflow-hidden relative bg-bg-tertiary rounded-lg border border-border">
                        {selectedImage ? (
                            <ImageViewer
                                src={`file://${selectedImage.path}`}
                                alt={selectedImage.name}
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-text-secondary">
                                <p>No Image Selected</p>
                                <p className="text-xs opacity-50 mt-2">Open a folder to get started</p>
                            </div>
                        )}
                    </div>
                    {selectedImage && (
                        <div className="mt-2 text-xs text-text-secondary text-center truncate mb-2">
                            {selectedImage.name}
                        </div>
                    )}
                </Panel>

                <PanelResizeHandle className="h-1 bg-border hover:bg-accent transition-colors mx-4 my-1 rounded" />

                <Panel defaultSize={30} minSize={10} className="flex flex-col p-4 pt-0">
                    <div className="flex-1 bg-bg-tertiary rounded-lg border border-border overflow-hidden">
                        <ThumbnailGrid />
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
}
