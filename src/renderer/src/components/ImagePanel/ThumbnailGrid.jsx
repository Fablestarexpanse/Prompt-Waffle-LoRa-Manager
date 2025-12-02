import useDatasetStore from '../../store/datasetStore'
import { useEffect, useRef } from 'react'
import clsx from 'clsx'

export default function ThumbnailGrid() {
    const { images, selectedImageIndex, selectImage } = useDatasetStore()
    const selectedRef = useRef(null)

    // Scroll selected item into view
    useEffect(() => {
        if (selectedRef.current) {
            selectedRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }
    }, [selectedImageIndex])

    if (images.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-text-secondary text-sm p-4">
                No images found
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto p-2">
            <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => {
                    const isSelected = index === selectedImageIndex
                    return (
                        <div
                            key={image.path}
                            ref={isSelected ? selectedRef : null}
                            onClick={() => selectImage(index)}
                            className={clsx(
                                "aspect-square rounded overflow-hidden cursor-pointer border-2 transition-all relative group",
                                isSelected
                                    ? "border-accent ring-2 ring-accent/20"
                                    : "border-transparent hover:border-border"
                            )}
                        >
                            <img
                                src={`file://${image.path}`}
                                alt={image.name}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                            {/* Caption status indicator */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                                <div
                                    className={clsx(
                                        "h-full w-full",
                                        image.caption ? "bg-success" : "bg-warning"
                                    )}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
