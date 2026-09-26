# SonicShelf - Offline Music Player

A beautiful, offline-first desktop music player built with Electron, React, and Vite.

## Features

- **File Management**: Add individual audio files or entire folders (recursive scan)
- **Metadata Extraction**: Automatic ID3 tag parsing with album art extraction
- **Library Views**: Grid and list views with real-time search
- **Playback Controls**: Play/pause, seek, volume, shuffle, repeat (one/all)
- **Playlists**: Create, rename, delete playlists with drag-and-drop reordering
- **Liked Songs**: Heart favorite tracks
- **Dark Theme**: Spotify-inspired UI with #121212 background, #1DB954 accent
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Offline-First**: No internet required, all data stored locally

## Supported Formats

- MP3, FLAC, WAV, OGG, M4A, AAC, OPUS

## Tech Stack

- **Electron 28** - Desktop framework
- **React 18 + Vite** - Frontend
- **Zustand** - State management
- **Howler.js** - Audio playback
- **music-metadata** - ID3 tag parsing
- **electron-store** - Local persistence
- **electron-builder** - Packaging

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This starts Vite dev server and Electron with hot reload.

## Building for Production

```bash
# Build all platforms
npm run package

# Build specific platform
npm run package:win    # Windows .exe installer (NSIS)
npm run package:mac    # macOS .dmg
npm run package:linux  # Linux .AppImage
```

Output will be in the `dist/` directory.

## Project Structure

```
sonicshelf/
├── electron/
│   ├── main.js       # Electron main process
│   └── preload.js    # IPC bridge (contextBridge)
├── src/
│   ├── components/   # React components
│   │   ├── Sidebar.jsx
│   │   ├── LibraryView.jsx
│   │   ├── PlaylistView.jsx
│   │   ├── PlayerBar.jsx
│   │   └── Modals.jsx
│   ├── store/
│   │   └── useStore.js    # Zustand store with persistence
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── icon.svg      # App icon source
├── package.json
└── vite.config.js
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/Pause |
| `←` / `→` | Seek -5s / +5s |
| `Ctrl/Cmd + F` | Focus search |
| `Media Play/Pause` | Play/Pause (media keys) |
| `Media Next` | Next track |
| `Media Previous` | Previous track |

## IPC API (preload.js)

The renderer communicates with main process via `window.electronAPI`:

- `openFileDialog()` - Returns array of selected file paths
- `openFolderDialog()` - Returns selected folder path
- `scanFolder(folderPath)` - Returns array of audio file paths (recursive)
- `getMetadata(filePath)` - Returns `{ title, artist, album, duration, coverArt (base64) }`
- `saveLibrary(data)` / `loadLibrary()` - Persist/load library
- `savePlaylists(data)` / `loadPlaylists()` - Persist/load playlists
- `saveLikedSongs(data)` / `loadLikedSongs()` - Persist/load liked songs
- `saveSettings(data)` / `loadSettings()` - Persist/load settings
- `getAllLibraryData()` - Load all data at once

## Data Storage

All data is stored in Electron's user data directory via `electron-store`:
- `library` - Array of track objects with metadata
- `playlists` - Object of playlist objects with track arrays
- `likedSongs` - Array of liked track objects
- `settings` - Volume, shuffle, repeat preferences

## Icons

The app uses `public/icon.svg` as source. For production builds, you need:

- **Windows**: `public/icon.ico` (256x256, multiple sizes)
- **macOS**: `public/icon.icns` (iconset with 16-512px)
- **Linux**: `public/icon.png` (512x512)

You can generate these from the SVG using:
- [iconverticons.com](https://iconverticons.com/online/)
- [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)
- `npx electron-icon-builder --input=public/icon.svg --output=public --flatten`

## License

MIT