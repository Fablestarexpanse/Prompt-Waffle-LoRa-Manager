import useDatasetStore from '../../store/datasetStore'
import { FolderOpen, Search, Type, Zap } from 'lucide-react'
import { useState } from 'react'

export default function ToolsPanel() {
    const { currentPath, images, setFolder, findReplace, addPrefixSuffix, batchFindReplace, batchPrefixSuffix } = useDatasetStore()

    const [findText, setFindText] = useState('')
    const [replaceText, setReplaceText] = useState('')
    const [prefix, setPrefix] = useState('')
    const [suffix, setSuffix] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    const handleOpenFolder = async () => {
        const path = await window.api.selectFolder()
        if (path) {
            const files = await window.api.readDirectory(path)
            setFolder(path, files)
        }
    }

    const handleFindReplace = () => {
        if (findText) {
            findReplace(findText, replaceText)
        }
    }

    const handlePrefixSuffix = () => {
        if (prefix || suffix) {
            addPrefixSuffix(prefix, suffix)
        }
    }

    const handleBatchFindReplace = async () => {
        if (findText && !isProcessing) {
            setIsProcessing(true)
            try {
                await batchFindReplace(findText, replaceText)
            } finally {
                setIsProcessing(false)
            }
        }
    }

    const handleBatchPrefixSuffix = async () => {
        if ((prefix || suffix) && !isProcessing) {
            setIsProcessing(true)
            try {
                await batchPrefixSuffix(prefix, suffix)
            } finally {
                setIsProcessing(false)
            }
        }
    }

    return (
        <div className="h-full w-full bg-bg-secondary p-4 flex flex-col gap-4 overflow-y-auto">
            <h2 className="text-text-primary text-lg font-semibold">Tools</h2>

            {/* Open Folder */}
            <div className="bg-bg-tertiary rounded-lg p-3 border border-border">
                <button
                    onClick={handleOpenFolder}
                    className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-text-primary px-4 py-2 rounded transition-colors"
                >
                    <FolderOpen size={18} />
                    Open Folder
                </button>
                {currentPath && (
                    <div className="mt-2 text-xs text-text-secondary">
                        <div className="truncate" title={currentPath}>{currentPath}</div>
                        <div className="mt-1">{images.length} images</div>
                    </div>
                )}
            </div>

            {/* Find/Replace */}
            <div className="bg-bg-tertiary rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 mb-3">
                    <Search size={16} className="text-accent" />
                    <h3 className="text-text-primary font-medium text-sm">Find/Replace</h3>
                </div>
                <input
                    type="text"
                    placeholder="Find..."
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    className="w-full bg-bg-primary text-text-primary px-3 py-2 rounded border border-border focus:border-accent outline-none text-sm mb-2"
                />
                <input
                    type="text"
                    placeholder="Replace with..."
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    className="w-full bg-bg-primary text-text-primary px-3 py-2 rounded border border-border focus:border-accent outline-none text-sm mb-2"
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleFindReplace}
                        disabled={!findText}
                        className="flex-1 bg-bg-primary hover:bg-border text-text-primary px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Current
                    </button>
                    <button
                        onClick={handleBatchFindReplace}
                        disabled={!findText || isProcessing}
                        className="flex-1 bg-accent hover:bg-accent/80 text-text-primary px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Processing...' : 'All Images'}
                    </button>
                </div>
            </div>

            {/* Prefix/Suffix */}
            <div className="bg-bg-tertiary rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 mb-3">
                    <Type size={16} className="text-accent" />
                    <h3 className="text-text-primary font-medium text-sm">Prefix/Suffix</h3>
                </div>
                <input
                    type="text"
                    placeholder="Prefix..."
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="w-full bg-bg-primary text-text-primary px-3 py-2 rounded border border-border focus:border-accent outline-none text-sm mb-2"
                />
                <input
                    type="text"
                    placeholder="Suffix..."
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    className="w-full bg-bg-primary text-text-primary px-3 py-2 rounded border border-border focus:border-accent outline-none text-sm mb-2"
                />
                <div className="flex gap-2">
                    <button
                        onClick={handlePrefixSuffix}
                        disabled={!prefix && !suffix}
                        className="flex-1 bg-bg-primary hover:bg-border text-text-primary px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Current
                    </button>
                    <button
                        onClick={handleBatchPrefixSuffix}
                        disabled={(!prefix && !suffix) || isProcessing}
                        className="flex-1 bg-accent hover:bg-accent/80 text-text-primary px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Processing...' : 'All Images'}
                    </button>
                </div>
            </div>

            {/* Stats */}
            {images.length > 0 && (
                <div className="bg-bg-tertiary rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={16} className="text-accent" />
                        <h3 className="text-text-primary font-medium text-sm">Statistics</h3>
                    </div>
                    <div className="text-xs text-text-secondary space-y-1">
                        <div>Total Images: {images.length}</div>
                        <div>With Captions: {images.filter(img => img.caption).length}</div>
                        <div>Without Captions: {images.filter(img => !img.caption).length}</div>
                    </div>
                </div>
            )}
        </div>
    )
}
