const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('openFileDialog'),
  openFolderDialog: () => ipcRenderer.invoke('openFolderDialog'),
  scanFolder: (folderPath) => ipcRenderer.invoke('scanFolder', folderPath),
  getMetadata: (filePath) => ipcRenderer.invoke('getMetadata', filePath),
  saveLibrary: (data) => ipcRenderer.invoke('saveLibrary', data),
  loadLibrary: () => ipcRenderer.invoke('loadLibrary'),
  savePlaylists: (data) => ipcRenderer.invoke('savePlaylists', data),
  loadPlaylists: () => ipcRenderer.invoke('loadPlaylists'),
  saveLikedSongs: (data) => ipcRenderer.invoke('saveLikedSongs', data),
  loadLikedSongs: () => ipcRenderer.invoke('loadLikedSongs'),
  saveSettings: (data) => ipcRenderer.invoke('saveSettings', data),
  loadSettings: () => ipcRenderer.invoke('loadSettings'),
  getAllLibraryData: () => ipcRenderer.invoke('getAllLibraryData')
});