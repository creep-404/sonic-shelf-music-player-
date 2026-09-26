import React, { useState, useMemo } from 'react';
import useStore from '../store/useStore';

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"></path>
  </svg>
);

const MusicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
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

const MoreVerticalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const GripIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="19" r="1"></circle>
    <circle cx="9" cy="5" r="1"></circle>
    <circle cx="15" cy="19" r="1"></circle>
    <circle cx="15" cy="5" r="1"></circle>
  </svg>
);

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function TrackRow({ track, index, onPlay, onRemove, isPlaying, onDragStart, onDragEnd, onDragOver, onDrop }) {
  const { isLiked, toggleLikedSong } = useStore();
  const liked = isLiked(track.filePath);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay(track, index);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLikedSong(track);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove(track.filePath);
  };

  return (
    <tr 
      draggable 
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      style={{ cursor: isPlaying ? 'default' : 'pointer' }}
      onClick={() => !isPlaying && onPlay(track, index)}
    >
      <td className="track-number" style={{ width: '40px', color: 'var(--text-muted)' }}>
        <GripIcon style={{ width: 16, height: 16, cursor: 'grab', opacity: 0.5 }} />
      </td>
      <td className="track-info">
        {track.coverArt ? (
          <img src={track.coverArt} alt="" className="track-cover" loading="lazy" />
        ) : (
          <div className="track-cover-placeholder"><MusicIcon /></div>
        )}
        <div className="track-details">
          <div className="track-title">{track.title}</div>
          <div className="track-artist">{track.artist}</div>
        </div>
      </td>
      <td className="track-album">{track.album}</td>
      <td className="track-duration">{formatDuration(track.duration)}</td>
      <td className="track-actions">
        <button className="action-btn like-btn" onClick={handleLikeClick} aria-label={liked ? 'Remove from liked' : 'Add to liked'}>
          {liked ? <HeartFilledIcon /> : <HeartIcon />}
        </button>
        <button className="action-btn" onClick={handleRemoveClick} aria-label="Remove from playlist">
          <TrashIcon />
        </button>
        <button className="action-btn" onClick={(e) => { e.stopPropagation(); }} aria-label="More options">
          <MoreVerticalIcon />
        </button>
      </td>
    </tr>
  );
}

function PlaylistView({ playlist, onPlayAlbum }) {
  const { removeFromPlaylist, reorderPlaylist, currentTrack, isPlaying } = useStore();
  const [dragIndex, setDragIndex] = useState(null);

  const handlePlay = (track, index) => {
    onPlayAlbum(playlist.tracks, index);
  };

  const handleRemove = (filePath) => {
    removeFromPlaylist(playlist.id, filePath);
  };

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDragIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      reorderPlaylist(playlist.id, dragIndex, index);
    }
    setDragIndex(null);
  };

  const totalDuration = playlist.tracks.reduce((sum, t) => sum + (t.duration || 0), 0);
  const formatTotalDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours} hr ${mins} min`;
    return `${mins} min`;
  };

  const coverArt = playlist.tracks.find(t => t.coverArt)?.coverArt;

  return (
    <div className="content-area">
      <div className="playlist-header-row">
        <div>
          {coverArt ? (
            <img src={coverArt} alt="" className="playlist-cover-large" />
          ) : (
            <div className="playlist-cover-placeholder-large">
              <MusicIcon />
            </div>
          )}
        </div>
        <div className="playlist-header-info">
          <h1 className="playlist-title">{playlist.name}</h1>
          <div className="playlist-meta">
            <span>{playlist.tracks.length} songs</span>
            <span>·</span>
            <span>{formatTotalDuration(totalDuration)}</span>
          </div>
          <div className="playlist-actions-row">
            <button className="btn btn-primary" onClick={() => onPlayAlbum(playlist.tracks, 0)}>
              <PlayIcon />
              <span>Play</span>
            </button>
            <button className="btn btn-secondary">
              <HeartIcon />
              <span>Save</span>
            </button>
            <button className="btn btn-secondary">
              <MoreVerticalIcon />
            </button>
          </div>
        </div>
      </div>

      {playlist.tracks.length === 0 ? (
        <div className="empty-state" style={{ minHeight: '300px' }}>
          <MusicIcon />
          <h2>This playlist is empty</h2>
          <p>Add songs from your library to get started.</p>
        </div>
      ) : (
        <table className="library-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              <th>Title</th>
              <th>Album</th>
              <th style={{ width: '80px', textAlign: 'right' }}>Duration</th>
              <th style={{ width: '100px' }}></th>
            </tr>
          </thead>
          <tbody>
            {playlist.tracks.map((track, index) => (
              <TrackRow
                key={track.filePath}
                track={track}
                index={index}
                onPlay={handlePlay}
                onRemove={handleRemove}
                isPlaying={currentTrack?.filePath === track.filePath && isPlaying}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PlaylistView;