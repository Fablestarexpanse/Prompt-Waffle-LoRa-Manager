import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from "lucide-react";

export default function ImageViewer({ src, alt }) {
    return (
        <TransformWrapper
            initialScale={1}
            minScale={0.1}
            maxScale={8}
            centerOnInit={true}
            wheel={{ step: 0.1 }}
        >
            {({ zoomIn, zoomOut, resetTransform, centerView }) => (
                <div className="flex flex-col h-full w-full">
                    {/* Controls Toolbar */}
                    <div className="flex justify-center gap-2 mb-2 p-1 bg-bg-tertiary rounded-lg w-fit mx-auto z-10">
                        <button
                            onClick={() => zoomIn()}
                            className="p-1 hover:bg-bg-secondary rounded text-text-primary"
                            title="Zoom In"
                        >
                            <ZoomIn size={16} />
                        </button>
                        <button
                            onClick={() => zoomOut()}
                            className="p-1 hover:bg-bg-secondary rounded text-text-primary"
                            title="Zoom Out"
                        >
                            <ZoomOut size={16} />
                        </button>
                        <button
                            onClick={() => resetTransform()}
                            className="p-1 hover:bg-bg-secondary rounded text-text-primary"
                            title="Reset Zoom"
                        >
                            <RotateCcw size={16} />
                        </button>
                        <button
                            onClick={() => centerView()}
                            className="p-1 hover:bg-bg-secondary rounded text-text-primary"
                            title="Center Image"
                        >
                            <Maximize size={16} />
                        </button>
                    </div>

                    {/* Image Area */}
                    <div className="flex-1 overflow-hidden bg-bg-tertiary rounded-lg relative border border-border">
                        <TransformComponent
                            wrapperClass="!w-full !h-full"
                            contentClass="!w-full !h-full flex items-center justify-center"
                        >
                            <img
                                src={src}
                                alt={alt}
                                className="max-w-full max-h-full object-contain"
                            />
                        </TransformComponent>
                    </div>
                </div>
            )}
        </TransformWrapper>
    );
}
