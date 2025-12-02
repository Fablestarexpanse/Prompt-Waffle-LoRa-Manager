# LoRA Caption Editor

A powerful desktop application for managing and editing image captions for LoRA training datasets. Built with Electron, React, and AI-powered auto-captioning.

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

- **Electron**: Cross-platform desktop application framework
- **React**: UI library
- **Vite**: Build tool for fast development
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **Monaco Editor**: VS Code-powered text editor
- **Python**: Backend service for AI captioning (BLIP model)

## Installation

### Prerequisites
- Node.js 20.18+ (or compatible version)
- Python 3.10+ (for AI captioning feature)
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Fablestarexpanse/Prompt-Waffle-LoRa-Manager.git
   cd Prompt-Waffle-LoRa-Manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Python environment (optional, for AI captioning)**
   ```bash
   cd src\python
   setup.bat
   ```
   This will create a virtual environment and install required Python packages.

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build and preview
npm run build:win
```

## Usage

### Basic Workflow

1. **Open a Folder**: Click "Open Folder" in the Tools panel and select your image dataset directory
2. **Browse Images**: Use the thumbnail grid or arrow keys to navigate between images
3. **Edit Captions**: Type directly in the Monaco editor (auto-saves after 1 second)
4. **Batch Operations**: Use Find/Replace or Prefix/Suffix tools to modify multiple captions at once
5. **AI Captioning**: Initialize the caption service and generate captions automatically

### Keyboard Shortcuts

- `Arrow Left/Right/Up/Down`: Navigate between images
- `Ctrl+S`: Save current caption (in editor)

### AI Auto-Captioning

The application includes a Python-based AI captioning service:

1. Click "Initialize Service" in the Auto-Caption section
2. Wait for the service to load the model (first time may take a few minutes)
3. Click "Generate Caption" to create a caption for the current image

**Note**: The default model is BLIP. You can replace it with JoyCaption or other models by modifying `src/python/caption_service.py`.

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
