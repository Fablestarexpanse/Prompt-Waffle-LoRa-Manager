import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import useDatasetStore from "../../store/datasetStore";
import { useDebouncedCallback } from 'use-debounce';

export default function CaptionEditor({ initialValue, onChange, onSave }) {
    const editorRef = useRef(null);
    const { selectedImageIndex } = useDatasetStore();
    const [isDirty, setIsDirty] = useState(false);

    // Auto-save callback
    const debouncedSave = useDebouncedCallback(
        () => {
            if (onSave && isDirty) {
                onSave();
                setIsDirty(false);
            }
        },
        1000 // 1 second delay
    );

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;

        // Add Save command (Ctrl+S)
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            if (onSave) {
                onSave();
                setIsDirty(false);
                debouncedSave.cancel(); // Cancel pending auto-save
            }
        });
    }

    // Update editor content when selected image changes
    useEffect(() => {
        if (editorRef.current) {
            // Avoid triggering auto-save when switching images
            debouncedSave.cancel();
            setIsDirty(false);
            editorRef.current.setValue(initialValue || '');
        }
    }, [selectedImageIndex, initialValue]);

    const handleChange = (value) => {
        if (onChange) onChange(value);
        setIsDirty(true);
        debouncedSave();
    };

    return (
        <Editor
            height="100%"
            defaultLanguage="plaintext"
            theme="vs-dark"
            value={initialValue}
            onChange={handleChange}
            onMount={handleEditorDidMount}
            options={{
                minimap: { enabled: false },
                wordWrap: "on",
                lineNumbers: "off",
                fontSize: 14,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                fontFamily: "Consolas, 'Courier New', monospace",
                renderLineHighlight: "none",
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
            }}
        />
    );
}
