import React from 'react';
import { useBoardStore } from '../store/boardStore';

export const WelcomeScreen: React.FC = () => {
  const { createBoard, setActiveBoard } = useBoardStore();

  const handleCreate = () => {
    const id = createBoard('My Vision Board');
    setActiveBoard(id);
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-icon">📌</div>
        <h1 className="welcome-title">Vision Board</h1>
        <p className="welcome-subtitle">
          Your personal space for ideas, dreams, and inspirations.
        </p>
        <div className="welcome-features">
          <div className="feature-item">
            <span className="feature-icon">🗺️</span>
            <span>Infinite canvas to map your thoughts</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📝</span>
            <span>Notes, to-dos, quotes, images & links</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📌</span>
            <span>Pin & arrange cards freely</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎨</span>
            <span>Customize colors and backgrounds</span>
          </div>
        </div>
        <button className="welcome-btn" onClick={handleCreate}>
          Create Your First Board
        </button>
        <p className="welcome-tip">
          Or select an existing board from the sidebar →
        </p>
      </div>
    </div>
  );
};
