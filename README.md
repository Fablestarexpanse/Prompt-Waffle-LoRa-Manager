# temp_app

An Electron application with React

## Features

- **Three-Panel Layout**: Resizable layout optimized for captioning workflows.
- **Image Viewer**: 
  - Zoom, pan, and reset controls.
  - Thumbnail grid for quick navigation.
- **Caption Editor**: 
  - Integrated Monaco Editor (VS Code style).
  - Auto-save functionality.
  - Syntax highlighting (plaintext).
- **File System**: 
  - Open folders and scan for images/captions.
  - efficient file reading/writing.
- **Navigation**:
  - Keyboard shortcuts (Arrow keys) for image switching.
  - Visual selection in thumbnail grid.
- **Tools Panel**:
  - Find/Replace text in captions.
  - Add Prefix/Suffix to captions.
  - Batch operations (apply to all images).
  - Auto-captioning with AI (Python-based BLIP model).
  - Statistics display.

## Tech Stack

- **Electron**: Cross-platform desktop application framework.
- **React**: UI library.
- **Vite**: Build tool.
- **Tailwind CSS**: Utility-first CSS framework.
- **Zustand**: State management.
- **Monaco Editor**: Code editor component.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
