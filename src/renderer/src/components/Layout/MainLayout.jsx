import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ImagePanel from "../ImagePanel";
import ToolsPanel from "../ToolsPanel";
import EditorPanel from "../EditorPanel";
import useDatasetStore from "../../store/datasetStore";
import { useEffect } from "react";

export default function MainLayout() {
    const { navigateNext, navigatePrevious } = useDatasetStore();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if focus is in an input or textarea (except for special shortcuts if needed)
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                return;
            }

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    navigateNext();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    navigatePrevious();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigateNext, navigatePrevious]);

    return (
        <div className="h-screen w-screen bg-bg-primary text-text-primary overflow-hidden">
            <PanelGroup direction="horizontal">
                <Panel defaultSize={40} minSize={20} className="flex flex-col">
                    <ImagePanel />
                </Panel>

                <PanelResizeHandle className="w-1 bg-border hover:bg-accent transition-colors" />

                <Panel defaultSize={25} minSize={15} className="flex flex-col">
                    <ToolsPanel />
                </Panel>

                <PanelResizeHandle className="w-1 bg-border hover:bg-accent transition-colors" />

                <Panel defaultSize={35} minSize={20} className="flex flex-col">
                    <EditorPanel />
                </Panel>
            </PanelGroup>
        </div>
    );
}
