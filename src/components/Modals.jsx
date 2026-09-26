import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export function PlaylistModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>Create Playlist</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Playlist name"
            className="modal-input"
            autoFocus
            maxLength={100}
          />
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
              <PlusIcon />
              <span>Create</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Toast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useStore.subscribe((state) => {
    if (state.toastMessage) {
      addToast(state.toastMessage.message, state.toastMessage.type);
      state.clearToast?.();
    }
  });

  return (
    <div style={{ position: 'fixed', bottom: 'calc(var(--player-height) + 24px)', left: '50%', transform: 'translateX(-50%)', zIndex: 300, pointerEvents: 'none' }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast ${toast.type}`}
          style={{ pointerEvents: 'auto' }}
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export function ContextMenu({ x, y, items, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    onClose();
  }, []);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: x, top: y }}
      role="menu"
    >
      {items.map((item, index) => (
        <button
          key={index}
          className={`context-menu-item ${item.danger ? 'danger' : ''}`}
          onClick={() => { item.onClick(); onClose(); }}
          role="menuitem"
          disabled={item.disabled}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}