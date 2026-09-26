import React from 'react';
import useStore from '../store/useStore';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const LibraryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="1" ry="1"></rect>
    <path d="M8 21h8"></path>
    <path d="M12 17v4"></path>
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const PlaylistIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
    <line x1="9" y1="9" x2="15" y2="9"></line>
    <line x1="9" y1="13" x2="15" y2="13"></line>
    <line x1="9" y1="17" x2="12" y2="17"></line>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MoreIcon = () => (
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

function Sidebar({
  collapsed,
  currentView,
  currentPlaylistId,
  playlists,
  onViewChange,
  onPlaylistSelect,
  onCreatePlaylist
}) {
  const [showCreatePlaylist, setShowCreatePlaylist] = React.useState(false);
  const [newPlaylistName, setNewPlaylistName] = React.useState('');
  const [editingPlaylistId, setEditingPlaylistId] = React.useState(null);
  const [editName, setEditName] = React.useState('');

  const { createPlaylist, renamePlaylist, deletePlaylist } = useStore();

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
    }
  };

  const handleRenamePlaylist = (id) => {
    if (editName.trim()) {
      renamePlaylist(id, editName.trim());
      setEditingPlaylistId(null);
    }
  };

  const handleDeletePlaylist = (id) => {
    deletePlaylist(id);
    setEditingPlaylistId(null);
  };

  const startEditing = (playlist) => {
    setEditingPlaylistId(playlist.id);
    setEditName(playlist.name);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
          <span className="logo-text">SonicShelf</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Your Library</div>
          <button
            className={`nav-item ${currentView === 'library' ? 'active' : ''}`}
            onClick={() => onViewChange('library')}
            title="Home"
          >
            <HomeIcon />
            <span>Home</span>
          </button>
          <button
            className={`nav-item ${currentView === 'library' ? 'active' : ''}`}
            onClick={() => onViewChange('library')}
            title="Library"
          >
            <LibraryIcon />
            <span>Library</span>
          </button>
          <button
            className={`nav-item ${currentView === 'liked' ? 'active' : ''}`}
            onClick={() => onViewChange('liked')}
            title="Liked Songs"
          >
            <HeartIcon />
            <span>Liked Songs</span>
          </button>
        </div>

        <div className="nav-section playlist-section">
          <div className="playlist-header">
            <h3>Playlists</h3>
            {!collapsed && (
              <button className="btn-icon" onClick={() => setShowCreatePlaylist(true)} title="Create Playlist">
                <PlusIcon />
              </button>
            )}
          </div>
          
          {showCreatePlaylist && !collapsed && (
            <div style={{ padding: '0 12px 12px' }}>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                onBlur={handleCreatePlaylist}
                placeholder="Playlist name"
                className="modal-input"
                style={{ marginBottom: 8, padding: '8px 12px', fontSize: '13px' }}
                autoFocus
              />
            </div>
          )}

          <div className="playlist-list">
            {Object.values(playlists).map((playlist) => (
              <div key={playlist.id} className="playlist-item">
                {editingPlaylistId === playlist.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenamePlaylist(playlist.id)}
                      onBlur={() => handleRenamePlaylist(playlist.id)}
                      className="modal-input"
                      style={{ flex: 1, padding: '6px 10px', fontSize: '13px' }}
                      autoFocus
                    />
                  </>
                ) : (
                  <>
                    <PlaylistIcon />
                    <span>{playlist.name}</span>
                    <div className="playlist-actions">
                      <button className="action-btn" onClick={() => startEditing(playlist)} title="Rename">
                        <EditIcon />
                      </button>
                      <button className="action-btn danger" onClick={() => handleDeletePlaylist(playlist.id)} title="Delete">
                        <TrashIcon />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {!collapsed && Object.keys(playlists).length === 0 && (
            <div style={{ padding: '16px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No playlists yet
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;