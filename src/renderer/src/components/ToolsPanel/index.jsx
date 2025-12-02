import useDatasetStore from '../../store/datasetStore'
import { FolderOpen, RefreshCw } from 'lucide-react'

export default function ToolsPanel() {
    const { currentPath, setFolder, images } = useDatasetStore()

    const handleOpenFolder = async () => {
        const path = await window.api.selectFolder()
        if (path) {
            const files = await window.api.readDirectory(path)
            setFolder(path, files)
        }
    }

    return (
        <div className="h-full w-full bg-bg-secondary p-4 flex flex-col border-l border-r border-border">
            <h2 className="text-text-primary text-lg font-semibold mb-4">Tools</h2>

            <div className="space-y-4">
                <div className="bg-bg-tertiary p-3 rounded-lg">
                    <h3 className="text-text-secondary text-xs uppercase font-bold mb-2">Folder Management</h3>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleOpenFolder}
                            className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-3 py-2 rounded transition-colors"
                        >
                            <FolderOpen size={16} />
                            Open Folder
                        </button>

                        {currentPath && (
                            <div className="text-xs text-text-secondary break-all">
                                {currentPath}
                            </div>
                        )}

                        <div className="flex justify-between items-center text-sm text-text-primary">
                            <span>Images:</span>
                            <span className="font-mono">{images.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-4">
                {/* More tools will go here */}
            </div>
        </div>
    );
}
