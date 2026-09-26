import React, { useEffect, useRef, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import useStore from './store/useStore';
import Sidebar from './components/Sidebar';
import LibraryView from './components/LibraryView';
import PlaylistView from './components/PlaylistView';
import PlayerBar from './components/PlayerBar';
import { PlaylistModal, Toast } from './components/Modals';

function App() {
  const {
    currentView,
    currentPlaylistId,
    playlists,
    library,
    playQueue,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    sidebarCollapsed,
    loadAllData,
    saveAllData,
    setCurrentView,
    setCurrentPlaylistId,
    setCurrentTrack,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    setMuted,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious,
    setPlayQueue,
    addToLibrary,
    removeFromLibrary
  } = useStore();

  const audioRef = useRef(null);
  const howlRef = useRef(null);
  const progressAnimationRef = useRef(null);

  useEffect(() => {
    loadAllData();
    
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekRelative(-5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekRelative(5);
          break;
        case 'KeyF':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            document.querySelector('.search-container input')?.focus();
          }
          break;
        case 'MediaPlayPause':
          setIsPlaying(!isPlaying);
          break;
        case 'MediaTrackNext':
          playNext();
          break;
        case 'MediaTrackPrevious':
          playPrevious();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loadAllData, isPlaying, playNext, playPrevious, setIsPlaying]);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(volume);
      howlRef.current.mute(isMuted);
    }
    Howler.volume(volume);
  }, [volume, isMuted]);

  const playTrack = useCallback((track, index, queue) => {
    if (howlRef.current) {
      howlRef.current.unload();
    }

    const fileUrl = `file://${track.filePath.replace(/\\/g, '/')}`;
    
    const howl = new Howl({
      src: [fileUrl],
      format: ['mp3', 'flac', 'wav', 'ogg', 'm4a', 'aac', 'opus'],
      html5: true,
      volume: volume,
      mute: isMuted,
      onplay: () => {
        setIsPlaying(true);
        startProgressAnimation();
      },
      onpause: () => {
        setIsPlaying(false);
        stopProgressAnimation();
      },
      onstop: () => {
        setIsPlaying(false);
        stopProgressAnimation();
        setCurrentTime(0);
      },
      onend: () => {
        stopProgressAnimation();
        if (repeat === 'one') {
          howl.seek(0);
          howl.play();
        } else {
          playNext();
        }
      },
      onloaderror: (id, error) => {
        console.error('Audio load error:', error);
        playNext();
      },
      onplayerror: (id, error) => {
        console.error('Audio play error:', error);
        playNext();
      },
      onload: () => {
        setDuration(howl.duration() || track.duration || 0);
      }
    });

    howlRef.current = howl;
    setCurrentTrack(track, index, queue);
    howl.play();
  }, [volume, isMuted, setCurrentTrack, setIsPlaying, setDuration, repeat, playNext]);

  const startProgressAnimation = () => {
    const animate = () => {
      if (howlRef.current && howlRef.current.playing()) {
        setCurrentTime(howlRef.current.seek() || 0);
        progressAnimationRef.current = requestAnimationFrame(animate);
      }
    };
    animate();
  };

  const stopProgressAnimation = () => {
    if (progressAnimationRef.current) {
      cancelAnimationFrame(progressAnimationRef.current);
    }
  };

  const seek = (time) => {
    if (howlRef.current) {
      howlRef.current.seek(Math.max(0, Math.min(time, duration)));
      setCurrentTime(time);
    }
  };

  const seekRelative = (seconds) => {
    seek((currentTime || 0) + seconds);
  };

  const handlePlayPause = () => {
    if (howlRef.current) {
      if (howlRef.current.playing()) {
        howlRef.current.pause();
      } else {
        howlRef.current.play();
      }
    } else if (currentTrack) {
      playTrack(currentTrack, 0, [currentTrack]);
    }
  };

  const handleNext = () => {
    playNext();
    if (howlRef.current) {
      howlRef.current.stop();
    }
    const state = useStore.getState();
    if (state.currentTrack) {
      playTrack(state.currentTrack, state.currentTrackIndex, state.playQueue);
    }
  };

  const handlePrevious = () => {
    playPrevious();
    if (howlRef.current) {
      howlRef.current.stop();
    }
    const state = useStore.getState();
    if (state.currentTrack) {
      playTrack(state.currentTrack, state.currentTrackIndex, state.playQueue);
    }
  };

  const handleShuffle = () => {
    toggleShuffle();
    if (howlRef.current && shuffle) {
    }
  };

  const handleRepeat = () => {
    toggleRepeat();
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setMuted(!isMuted);
  };

  const handlePlayAlbum = (tracks, startIndex = 0) => {
    if (tracks.length === 0) return;
    setPlayQueue(tracks, startIndex);
    if (howlRef.current) {
      howlRef.current.stop();
    }
    playTrack(tracks[startIndex], startIndex, tracks);
  };

  const handleAddFiles = async () => {
    if (!window.electronAPI) return;
    
    const filePaths = await window.electronAPI.openFileDialog();
    if (filePaths.length === 0) return;

    const tracks = [];
    for (const filePath of filePaths) {
      const metadata = await window.electronAPI.getMetadata(filePath);
      tracks.push(metadata);
    }

    addToLibrary(tracks);
    await saveAllData();
  };

  const handleAddFolder = async () => {
    if (!window.electronAPI) return;
    
    const folderPath = await window.electronAPI.openFolderDialog();
    if (!folderPath) return;

    const filePaths = await window.electronAPI.scanFolder(folderPath);
    if (filePaths.length === 0) return;

    const tracks = [];
    for (const filePath of filePaths) {
      const metadata = await window.electronAPI.getMetadata(filePath);
      tracks.push(metadata);
    }

    addToLibrary(tracks);
    await saveAllData();
  };

  const currentPlaylist = currentPlaylistId ? playlists[currentPlaylistId] : null;

  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        currentView={currentView}
        currentPlaylistId={currentPlaylistId}
        playlists={playlists}
        onViewChange={setCurrentView}
        onPlaylistSelect={setCurrentPlaylistId}
        onCreatePlaylist={() => {}}
      />
      
      <main className="main-content">
        {currentView === 'library' && (
          <LibraryView
            onPlayAlbum={handlePlayAlbum}
            onAddFiles={handleAddFiles}
            onAddFolder={handleAddFolder}
          />
        )}
        
        {currentView === 'liked' && (
          <LibraryView
            isLikedView
            onPlayAlbum={handlePlayAlbum}
          />
        )}
        
        {currentView === 'playlist' && currentPlaylist && (
          <PlaylistView
            playlist={currentPlaylist}
            onPlayAlbum={handlePlayAlbum}
          />
        )}
      </main>

      <PlayerBar
        track={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        shuffle={shuffle}
        repeat={repeat}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={seek}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
        onShuffleToggle={handleShuffle}
        onRepeatToggle={handleRepeat}
      />

      <Toast />
    </div>
  );
}

export default App;