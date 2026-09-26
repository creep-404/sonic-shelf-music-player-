import React, { useRef, useEffect, useState } from 'react';
import useStore from '../store/useStore';

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"></path>
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
  </svg>
);

const SkipNextIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12l8.5-6L16 6z"></path>
  </svg>
);

const SkipPreviousIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path>
  </svg>
);

const ShuffleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8"></polyline>
    <path d="M4 20L21 3"></path>
    <polyline points="21 16 16 16 16 21"></polyline>
    <path d="M21 3L4 20"></path>
  </svg>
);

const RepeatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"></polyline>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
    <polyline points="7 23 3 19 7 15"></polyline>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
  </svg>
);

const RepeatOneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"></polyline>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
    <polyline points="7 23 3 19 7 15"></polyline>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
    <text x="18" y="16" fontSize="8" fill="currentColor" textAnchor="middle">1</text>
  </svg>
);

const VolumeHighIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 5 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const VolumeLowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 5 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

const VolumeMuteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 5 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const HeartFilledIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
  </svg>
);

const MoreHorizontalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="22"></line>
  </svg>
);

const ComputerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function PlayerBar({
  track,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  shuffle,
  repeat,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onShuffleToggle,
  onRepeatToggle
}) {
  const [isSeeking, setIsSeeking] = useState(false);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);
  const { isLiked, toggleLikedSong } = useStore();
  const liked = track ? isLiked(track.filePath) : false;

  const handleProgressClick = (e) => {
    if (!progressRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(percent * duration);
  };

  const handleProgressMouseDown = (e) => {
    setIsSeeking(true);
    handleProgressClick(e);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isSeeking) handleProgressClick(e);
    };
    const handleMouseUp = () => setIsSeeking(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSeeking, duration, onSeek]);

  const handleVolumeClick = (e) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onVolumeChange(percent);
  };

  const handleVolumeMouseDown = (e) => {
    handleVolumeClick(e);
    const handleMouseMove = (e) => handleVolumeClick(e);
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeMuteIcon />;
    if (volume < 0.5) return <VolumeLowIcon />;
    return <VolumeHighIcon />;
  };

  const getRepeatIcon = () => {
    if (repeat === 'one') return <RepeatOneIcon />;
    return <RepeatIcon />;
  };

  if (!track) {
    return (
      <footer className="player-bar">
        <div className="now-playing">
          <div className="track-thumbnail-placeholder">
            <MusicIcon />
          </div>
          <div className="now-playing-info">
            <div className="now-playing-title">Nothing playing</div>
            <div className="now-playing-artist">Select a song to start listening</div>
          </div>
        </div>
        <div className="player-controls">
          <div className="control-row">
            <button className="control-btn" onClick={onShuffleToggle} style={{ color: shuffle ? 'var(--accent)' : 'var(--text-secondary)' }} aria-label="Shuffle">
              <ShuffleIcon />
            </button>
            <button className="control-btn" onClick={onPrevious} aria-label="Previous">
              <SkipPreviousIcon />
            </button>
            <button className="control-btn play-btn" onClick={onPlayPause} aria-label="Play">
              <PlayIcon />
            </button>
            <button className="control-btn" onClick={onNext} aria-label="Next">
              <SkipNextIcon />
            </button>
            <button className="control-btn" onClick={onRepeatToggle} style={{ color: repeat !== 'none' ? 'var(--accent)' : 'var(--text-secondary)' }} aria-label="Repeat">
              {getRepeatIcon()}
            </button>
          </div>
          <div className="progress-container">
            <span className="time-display current">0:00</span>
            <div className="progress-bar" ref={progressRef} onClick={handleProgressClick} onMouseDown={handleProgressMouseDown}>
              <div className="progress-fill" style={{ width: '0%' }}>
                <div className="progress-handle" />
              </div>
            </div>
            <span className="time-display">0:00</span>
          </div>
        </div>
        <div className="right-controls">
          <div className="volume-container">
            <button className="volume-btn" onClick={onMuteToggle} aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {getVolumeIcon()}
            </button>
            <input
              ref={volumeRef}
              type="range"
              className="volume-slider"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              onMouseDown={handleVolumeMouseDown}
              aria-label="Volume"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="control-btn" aria-label="Like">
              <HeartIcon />
            </button>
            <button className="control-btn" aria-label="Devices">
              <ComputerIcon />
            </button>
          </div>
        </div>
      </footer>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="player-bar">
      <div className="now-playing">
        {track.coverArt ? (
          <img src={track.coverArt} alt="" className="track-thumbnail" />
        ) : (
          <div className="track-thumbnail-placeholder">
            <MusicIcon />
          </div>
        )}
        <div className="now-playing-info">
          <div className="now-playing-title">{track.title}</div>
          <div className="now-playing-artist">{track.artist}</div>
        </div>
        <div className="now-playing-actions">
          <button className="action-btn like-btn" onClick={() => toggleLikedSong(track)} aria-label={liked ? 'Remove from liked' : 'Add to liked'}>
            {liked ? <HeartFilledIcon /> : <HeartIcon />}
          </button>
          <button className="action-btn" aria-label="More options">
            <MoreHorizontalIcon />
          </button>
        </div>
      </div>

      <div className="player-controls">
        <div className="control-row">
          <button 
            className="control-btn" 
            onClick={onShuffleToggle} 
            style={{ color: shuffle ? 'var(--accent)' : 'var(--text-secondary)' }}
            aria-label="Shuffle"
            aria-pressed={shuffle}
          >
            <ShuffleIcon />
          </button>
          <button className="control-btn" onClick={onPrevious} aria-label="Previous">
            <SkipPreviousIcon />
          </button>
          <button className="control-btn play-btn" onClick={onPlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="control-btn" onClick={onNext} aria-label="Next">
            <SkipNextIcon />
          </button>
          <button 
            className="control-btn" 
            onClick={onRepeatToggle} 
            style={{ color: repeat !== 'none' ? 'var(--accent)' : 'var(--text-secondary)' }}
            aria-label="Repeat"
            aria-pressed={repeat !== 'none'}
          >
            {getRepeatIcon()}
          </button>
        </div>
        <div className="progress-container">
          <span className="time-display current">{formatTime(currentTime)}</span>
          <div 
            className="progress-bar" 
            ref={progressRef} 
            onClick={handleProgressClick} 
            onMouseDown={handleProgressMouseDown}
            role="slider"
            aria-label="Playback progress"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(currentTime)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') onSeek(Math.max(0, currentTime - 5));
              if (e.key === 'ArrowRight') onSeek(Math.min(duration, currentTime + 5));
            }}
          >
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}>
              <div className="progress-handle" />
            </div>
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="right-controls">
        <div className="volume-container">
          <button className="volume-btn" onClick={onMuteToggle} aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {getVolumeIcon()}
          </button>
          <input
            ref={volumeRef}
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            onMouseDown={handleVolumeMouseDown}
            aria-label="Volume"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="control-btn" aria-label="Lyrics">
            <MicIcon />
          </button>
          <button className="control-btn" aria-label="Queue">
            <ComputerIcon />
          </button>
        </div>
      </div>
    </footer>
  );
}

const MusicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

export default PlayerBar;