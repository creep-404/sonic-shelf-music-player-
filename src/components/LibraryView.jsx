import React, { useState, useMemo } from 'react';
import useStore from '../store/useStore';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

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

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function AlbumCard({ track, onPlay, onPlayAlbum, index }) {
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

  return (
    <div className="album-card" onClick={() => onPlayAlbum([track], 0)}>
      {track.coverArt ? (
        <img src={track.coverArt} alt="" className="album-cover" loading="lazy" />
      ) : (
        <div className="album-cover-placeholder">
          <MusicIcon />
        </div>
      )}
      <div className="album-info">
        <div className="album-title">{track.title}</div>
        <div className="album-artist">{track.artist}</div>
      </div>
    </div>
  );
}

function TrackRow({ track, index, onPlay, onPlayAlbum, isPlaying }) {
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

  return (
    <tr style={{ cursor: isPlaying ? 'default' : 'pointer' }} onClick={() => !isPlaying && onPlayAlbum([track], 0)}>
      <td className="track-number">
        {isPlaying ? <PlayIcon style={{ width: 16, height: 16, color: 'var(--accent)' }} /> : index + 1}
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
        <button className="action-btn" onClick={(e) => { e.stopPropagation(); }} aria-label="More options">
          <MoreVerticalIcon />
        </button>
      </td>
    </tr>
  );
}

function LibraryView({ isLikedView, onPlayAlbum, onAddFiles, onAddFolder }) {
  const {
    library,
    likedSongs,
    searchQuery,
    viewMode,
    setSearchQuery,
    setViewMode,
    currentTrack,
    isPlaying
  } = useStore();

  const tracks = isLikedView ? likedSongs : library;
  const filteredTracks = useMemo(() => {
    if (!searchQuery) return tracks;
    const query = searchQuery.toLowerCase();
    return tracks.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.artist.toLowerCase().includes(query) ||
      t.album.toLowerCase().includes(query)
    );
  }, [tracks, searchQuery]);

  const albums = useMemo(() => {
    const albumMap = new Map();
    filteredTracks.forEach((track, index) => {
      const key = `${track.album}|${track.artist}`;
      if (!albumMap.has(key)) {
        albumMap.set(key, { ...track, tracks: [] });
      }
      albumMap.get(key).tracks.push({ ...track, originalIndex: index });
    });
    return Array.from(albumMap.values());
  }, [filteredTracks]);

  if (tracks.length === 0 && !isLikedView) {
    return (
      <div className="content-area">
        <div className="main-header">
          <div className="header-top">
            <h1 className="page-title">Library</h1>
            <div className="header-actions">
              <div className="search-container">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search your library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="btn btn-secondary" onClick={onAddFiles}>
                <PlusIcon />
                <span>Add Files</span>
              </button>
              <button className="btn btn-secondary" onClick={onAddFolder}>
                <FolderIcon />
                <span>Add Folder</span>
              </button>
            </div>
          </div>
        </div>
        <div className="empty-state">
          <MusicIcon />
          <h2>Your library is empty</h2>
          <p>Add music files or folders to start building your collection. SonicShelf supports MP3, FLAC, WAV, OGG, M4A, and more.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button className="btn btn-primary" onClick={onAddFiles}>
              <PlusIcon />
              <span>Add Files</span>
            </button>
            <button className="btn btn-secondary" onClick={onAddFolder}>
              <FolderIcon />
              <span>Add Folder</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (filteredTracks.length === 0) {
    return (
      <div className="content-area">
        <div className="main-header">
          <div className="header-top">
            <h1 className="page-title">{isLikedView ? 'Liked Songs' : 'Library'}</h1>
            <div className="header-actions">
              <div className="search-container">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="empty-state">
          <SearchIcon />
          <h2>No results found</h2>
          <p>Try adjusting your search or clear the filter to see all songs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="main-header">
        <div className="header-top">
          <h1 className="page-title">{isLikedView ? 'Liked Songs' : 'Library'}</h1>
          <div className="header-actions">
            <div className="search-container">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
              {!isLikedView && (
                <>
                  <button className="btn btn-secondary" onClick={onAddFiles}>
                    <PlusIcon />
                    <span>Add Files</span>
                  </button>
                  <button className="btn btn-secondary" onClick={onAddFolder}>
                    <FolderIcon />
                    <span>Add Folder</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <GridIcon />
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <ListIcon />
          </button>
        </div>

        {viewMode === 'grid' && (
          <div className="library-grid">
            {albums.map((album, albumIndex) => (
              <AlbumCard
                key={`${album.album}|${album.artist}`}
                track={album}
                index={albumIndex}
                onPlay={(track, index) => onPlayAlbum(album.tracks.map(t => ({ ...t, filePath: t.filePath })), index)}
                onPlayAlbum={onPlayAlbum}
              />
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <table className="library-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Title</th>
                <th>Album</th>
                <th style={{ width: '80px', textAlign: 'right' }}>Duration</th>
                <th style={{ width: '80px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredTracks.map((track, index) => (
                <TrackRow
                  key={track.filePath}
                  track={track}
                  index={index}
                  onPlay={(t, i) => onPlayAlbum(filteredTracks, i)}
                  onPlayAlbum={onPlayAlbum}
                  isPlaying={currentTrack?.filePath === track.filePath && isPlaying}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
  );
}

export default LibraryView;