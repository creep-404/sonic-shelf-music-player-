const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const mm = require('music-metadata');
const fs = require('fs');

let store;

async function initializeStore() {
  const { default: Store } = await import('electron-store');

  store = new Store({
    name: 'sonicshelf-library',
    defaults: {
      library: [],
      playlists: {},
      likedSongs: [],
      settings: {
        volume: 0.7,
        shuffle: false,
        repeat: 'none'
      }
    }
  });
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    icon: path.join(__dirname, '../public/icon.png'),
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#121212',
    show: false
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await initializeStore();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const AUDIO_EXTENSIONS = ['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac', '.opus'];

function isAudioFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return AUDIO_EXTENSIONS.includes(ext);
}

async function getMetadata(filePath) {
  try {
    const metadata = await mm.parseFile(filePath);
    const common = metadata.common;
    const format = metadata.format;

    let coverArt = null;
    if (common.picture && common.picture.length > 0) {
      const pic = common.picture[0];
      coverArt = `data:${pic.format};base64,${pic.data.toString('base64')}`;
    }

    return {
      title: common.title || path.basename(filePath, path.extname(filePath)),
      artist: common.artist || 'Unknown Artist',
      album: common.album || 'Unknown Album',
      duration: format.duration || 0,
      coverArt,
      filePath,
      year: common.year || null,
      genre: common.genre ? common.genre[0] : null,
      trackNumber: common.track?.no || null
    };
  } catch (error) {
    console.error('Error reading metadata:', error);
    return {
      title: path.basename(filePath, path.extname(filePath)),
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      duration: 0,
      coverArt: null,
      filePath,
      year: null,
      genre: null,
      trackNumber: null
    };
  }
}

async function scanFolder(folderPath) {
  const files = [];
  
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (isAudioFile(fullPath)) {
        files.push(fullPath);
      }
    }
  }
  
  scanDir(folderPath);
  return files;
}

ipcMain.handle('openFileDialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'flac', 'wav', 'ogg', 'm4a', 'aac', 'opus'] }
    ]
  });
  return result.filePaths;
});

ipcMain.handle('openFolderDialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0] || null;
});

ipcMain.handle('scanFolder', async (_, folderPath) => {
  return await scanFolder(folderPath);
});

ipcMain.handle('getMetadata', async (_, filePath) => {
  return await getMetadata(filePath);
});

ipcMain.handle('saveLibrary', async (_, data) => {
  store.set('library', data);
  return true;
});

ipcMain.handle('loadLibrary', async () => {
  return store.get('library', []);
});

ipcMain.handle('savePlaylists', async (_, data) => {
  store.set('playlists', data);
  return true;
});

ipcMain.handle('loadPlaylists', async () => {
  return store.get('playlists', {});
});

ipcMain.handle('saveLikedSongs', async (_, data) => {
  store.set('likedSongs', data);
  return true;
});

ipcMain.handle('loadLikedSongs', async () => {
  return store.get('likedSongs', []);
});

ipcMain.handle('saveSettings', async (_, data) => {
  store.set('settings', data);
  return true;
});

ipcMain.handle('loadSettings', async () => {
  return store.get('settings', {
    volume: 0.7,
    shuffle: false,
    repeat: 'none'
  });
});

ipcMain.handle('getAllLibraryData', async () => {
  return {
    library: store.get('library', []),
    playlists: store.get('playlists', {}),
    likedSongs: store.get('likedSongs', []),
    settings: store.get('settings', {
      volume: 0.7,
      shuffle: false,
      repeat: 'none'
    })
  };
});
