import React, { useState } from 'react';
import { useBoardStore } from '../store/boardStore';

export const Sidebar: React.FC = () => {
  const { boards, activeBoardId, createBoard, deleteBoard, renameBoard, setActiveBoard } =
    useBoardStore();
  const [newBoardName, setNewBoardName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreate = () => {
    const name = newBoardName.trim() || `Board ${boards.length + 1}`;
    const id = createBoard(name);
    setActiveBoard(id);
    setNewBoardName('');
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleFinishEdit = (id: string) => {
    if (editingName.trim()) {
      renameBoard(id, editingName.trim());
    }
    setEditingId(null);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">📌</span>
          <span className="sidebar-logo-text">Vision Board</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">MY BOARDS</div>
        <div className="boards-list">
          {boards.length === 0 && (
            <div className="boards-empty">
              No boards yet.<br />Create your first board below!
            </div>
          )}
          {boards.map((board) => (
            <div
              key={board.id}
              className={`board-item ${board.id === activeBoardId ? 'board-item--active' : ''}`}
              onClick={() => setActiveBoard(board.id)}
            >
              <div
                className="board-item-color"
                style={{ backgroundColor: board.backgroundColor }}
              />
              {editingId === board.id ? (
                <input
                  className="board-item-edit-input"
                  value={editingName}
                  autoFocus
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleFinishEdit(board.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFinishEdit(board.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="board-item-name">{board.name}</span>
              )}
              <div className="board-item-actions">
                <button
                  className="board-action-btn"
                  title="Rename"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(board.id, board.name);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="board-action-btn board-action-btn--danger"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${board.name}"?`)) {
                      deleteBoard(board.id);
                    }
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-create">
        <input
          className="create-board-input"
          placeholder="New board name..."
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button className="create-board-btn" onClick={handleCreate}>
          + New Board
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-text">
          {boards.length} board{boards.length !== 1 ? 's' : ''}
        </div>
      </div>
    </aside>
  );
};
