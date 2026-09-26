import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      library: [],
      playlists: {},
      likedSongs: [],
      currentView: 'library',
      currentPlaylistId: null,
      searchQuery: '',
      viewMode: 'grid',
      
      currentTrack: null,
      currentTrackIndex: -1,
      playQueue: [],
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.7,
      isMuted: false,
      shuffle: false,
      repeat: 'none',
      
      sidebarCollapsed: false,
      
      setLibrary: (library) => set({ library }),
      addToLibrary: (tracks) => set((state) => {
        const existingPaths = new Set(state.library.map(t => t.filePath));
        const newTracks = tracks.filter(t => !existingPaths.has(t.filePath));
        return { library: [...state.library, ...newTracks] };
      }),
      removeFromLibrary: (filePath) => set((state) => ({
        library: state.library.filter(t => t.filePath !== filePath),
        likedSongs: state.likedSongs.filter(t => t.filePath !== filePath),
        playQueue: state.playQueue.filter(t => t.filePath !== filePath)
      })),
      
      setPlaylists: (playlists) => set({ playlists }),
      createPlaylist: (name) => set((state) => {
        const id = `playlist-${Date.now()}`;
        return { playlists: { ...state.playlists, [id]: { id, name, tracks: [], createdAt: Date.now() } } };
      }),
      renamePlaylist: (id, name) => set((state) => ({
        playlists: { ...state.playlists, [id]: { ...state.playlists[id], name } }
      })),
      deletePlaylist: (id) => set((state) => {
        const { [id]: deleted, ...rest } = state.playlists;
        return { playlists: rest, currentPlaylistId: state.currentPlaylistId === id ? null : state.currentPlaylistId };
      }),
      addToPlaylist: (playlistId, tracks) => set((state) => {
        const playlist = state.playlists[playlistId];
        if (!playlist) return state;
        const existingPaths = new Set(playlist.tracks.map(t => t.filePath));
        const newTracks = tracks.filter(t => !existingPaths.has(t.filePath));
        return { playlists: { ...state.playlists, [playlistId]: { ...playlist, tracks: [...playlist.tracks, ...newTracks] } } };
      }),
      removeFromPlaylist: (playlistId, filePath) => set((state) => {
        const playlist = state.playlists[playlistId];
        if (!playlist) return state;
        return { playlists: { ...state.playlists, [playlistId]: { ...playlist, tracks: playlist.tracks.filter(t => t.filePath !== filePath) } } };
      }),
      reorderPlaylist: (playlistId, fromIndex, toIndex) => set((state) => {
        const playlist = state.playlists[playlistId];
        if (!playlist) return state;
        const tracks = [...playlist.tracks];
        const [removed] = tracks.splice(fromIndex, 1);
        tracks.splice(toIndex, 0, removed);
        return { playlists: { ...state.playlists, [playlistId]: { ...playlist, tracks } } };
      }),
      
      toggleLikedSong: (track) => set((state) => {
        const isLiked = state.likedSongs.some(t => t.filePath === track.filePath);
        if (isLiked) {
          return { likedSongs: state.likedSongs.filter(t => t.filePath !== track.filePath) };
        } else {
          return { likedSongs: [...state.likedSongs, track] };
        }
      }),
      isLiked: (filePath) => get().likedSongs.some(t => t.filePath === filePath),
      
      setCurrentView: (view) => set({ currentView: view }),
      setCurrentPlaylistId: (id) => set({ currentPlaylistId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      setCurrentTrack: (track, index = -1, queue = []) => set({ 
        currentTrack: track, 
        currentTrackIndex: index,
        playQueue: queue.length > 0 ? queue : (index >= 0 ? [track] : []),
        isPlaying: true,
        currentTime: 0,
        duration: track?.duration || 0
      }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
      setMuted: (isMuted) => set({ isMuted }),
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      toggleRepeat: () => set((state) => {
        const modes = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(state.repeat);
        return { repeat: modes[(currentIndex + 1) % modes.length] };
      }),
      
      playNext: () => set((state) => {
        if (state.playQueue.length === 0) return state;
        let nextIndex = state.currentTrackIndex + 1;
        if (state.shuffle) {
          nextIndex = Math.floor(Math.random() * state.playQueue.length);
        }
        if (nextIndex >= state.playQueue.length) {
          if (state.repeat === 'all') nextIndex = 0;
          else return { ...state, isPlaying: false };
        }
        return { 
          currentTrack: state.playQueue[nextIndex],
          currentTrackIndex: nextIndex,
          currentTime: 0,
          duration: state.playQueue[nextIndex]?.duration || 0,
          isPlaying: true
        };
      }),
      playPrevious: () => set((state) => {
        if (state.playQueue.length === 0) return state;
        let prevIndex = state.currentTrackIndex - 1;
        if (state.shuffle) {
          prevIndex = Math.floor(Math.random() * state.playQueue.length);
        }
        if (prevIndex < 0) {
          if (state.repeat === 'all') prevIndex = state.playQueue.length - 1;
          else return { ...state, currentTime: 0 };
        }
        return { 
          currentTrack: state.playQueue[prevIndex],
          currentTrackIndex: prevIndex,
          currentTime: 0,
          duration: state.playQueue[prevIndex]?.duration || 0,
          isPlaying: true
        };
      }),
      setPlayQueue: (queue, startIndex = 0) => set({
        playQueue: queue,
        currentTrackIndex: startIndex,
        currentTrack: queue[startIndex],
        currentTime: 0,
        duration: queue[startIndex]?.duration || 0,
        isPlaying: true
      }),
      
      loadAllData: async () => {
        const { electronAPI } = window;
        if (!electronAPI) return;
        
        const [library, playlists, likedSongs, settings] = await Promise.all([
          electronAPI.loadLibrary(),
          electronAPI.loadPlaylists(),
          electronAPI.loadLikedSongs(),
          electronAPI.loadSettings()
        ]);
        
        set({ library, playlists, likedSongs, volume: settings.volume, shuffle: settings.shuffle, repeat: settings.repeat });
      },
      
      saveAllData: async () => {
        const { electronAPI } = window;
        if (!electronAPI) return;
        
        const state = get();
        await Promise.all([
          electronAPI.saveLibrary(state.library),
          electronAPI.savePlaylists(state.playlists),
          electronAPI.saveLikedSongs(state.likedSongs),
          electronAPI.saveSettings({
            volume: state.volume,
            shuffle: state.shuffle,
            repeat: state.repeat
          })
        ]);
      }
    }),
    {
      name: 'sonicshelf-store',
      partialize: (state) => ({
        playlists: state.playlists,
        likedSongs: state.likedSongs,
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
        viewMode: state.viewMode,
        sidebarCollapsed: state.sidebarCollapsed
      })
    }
  )
);

export default useStore;